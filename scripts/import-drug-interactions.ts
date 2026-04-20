/**
 * Import drug interactions from drug-interactions.json into database
 * Run: npx ts-node scripts/import-drug-interactions.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { db } from '../src/lib/db'

interface InteractionData {
  severity: 'mild' | 'moderate' | 'severe'
  description: string
  mechanism: string
  recommendation: string
}

interface DrugInteractions {
  [drugName: string]: {
    [interactingDrug: string]: InteractionData
  }
}

async function importDrugInteractions() {
  console.log('Starting drug interactions import...')
  
  // Read the interactions file
  const candidates = [
    path.join(process.cwd(), 'upload', 'drug-interactions.json'),
    path.join(process.cwd(), 'public', 'data', 'drug-interactions.json'),
  ]
  const interactionsPath = candidates.find(p => fs.existsSync(p))
  if (!interactionsPath) {
    throw new Error('Interactions file not found (upload/drug-interactions.json or public/data/drug-interactions.json)')
  }
  const interactionsData: DrugInteractions = JSON.parse(fs.readFileSync(interactionsPath, 'utf-8'))
  
  const drugNames = Object.keys(interactionsData)
  console.log(`Found ${drugNames.length} drugs with interaction data`)
  
  let successCount = 0
  let errorCount = 0
  let interactionCount = 0
  
  for (const drugName of drugNames) {
    try {
      // Find the primary drug
      const drug = await db.drug.findFirst({
        where: {
          OR: [
            { genericName: { contains: drugName, mode: 'insensitive' } },
            { packageName: { contains: drugName, mode: 'insensitive' } }
          ]
        }
      })
      
      if (!drug) {
        console.log(`Drug not found: ${drugName}`)
        continue
      }
      
      const interactions = interactionsData[drugName]
      
      for (const [interactingDrugName, interactionData] of Object.entries(interactions)) {
        // Find the interacting drug
        const interactingDrug = await db.drug.findFirst({
          where: {
            OR: [
              { genericName: { contains: interactingDrugName, mode: 'insensitive' } },
              { packageName: { contains: interactingDrugName, mode: 'insensitive' } }
            ]
          }
        })
        
        if (!interactingDrug) {
          // For non-drug interactions (like alcohol, food)
          await db.drugInteraction.create({
            data: {
              drugId: drug.id,
              secondaryDrugId: null,
              secondaryDrugName: interactingDrugName,
              severity: interactionData.severity,
              description: interactionData.description,
              management: interactionData.recommendation
            }
          })
        } else {
          await db.drugInteraction.create({
            data: {
              drugId: drug.id,
              secondaryDrugId: interactingDrug.id,
              secondaryDrugName: interactingDrugName,
              severity: interactionData.severity,
              description: interactionData.description,
              management: interactionData.recommendation
            }
          })
        }
        
        interactionCount++
      }
      
      successCount++
      
      if (successCount % 10 === 0) {
        console.log(`Processed ${successCount} drugs, ${interactionCount} interactions...`)
      }
    } catch (error) {
      console.error(`Error processing ${drugName}:`, error)
      errorCount++
    }
  }
  
  console.log('\nImport Summary:')
  console.log(`- Total drugs processed: ${successCount}`)
  console.log(`- Total interactions created: ${interactionCount}`)
  console.log(`- Errors: ${errorCount}`)
}

importDrugInteractions()
  .catch(console.error)
  .finally(() => db.$disconnect())
