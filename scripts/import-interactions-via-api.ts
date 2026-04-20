/**
 * Import drug interactions via API (no direct DB connection needed)
 * Run: npx ts-node scripts/import-interactions-via-api.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const API_BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:5173'

interface InteractionData {
  severity: 'mild' | 'moderate' | 'severe'
  description: string
  mechanism?: string
  recommendation: string
}

interface DrugInteractions {
  [drugName: string]: {
    [interactingDrug: string]: InteractionData
  }
}

async function importViaAPI() {
  console.log('Starting drug interactions import via API...')
  
  const interactionsPath = path.join(process.cwd(), 'upload', 'drug-interactions.json')
  const interactionsData: DrugInteractions = JSON.parse(fs.readFileSync(interactionsPath, 'utf-8'))
  
  const drugNames = Object.keys(interactionsData)
  console.log(`Found ${drugNames.length} drugs with interaction data`)
  
  let successCount = 0
  let errorCount = 0
  let skippedCount = 0
  let totalInteractions = 0
  
  for (const drugName of drugNames) {
    try {
      // Search for the drug
      const searchResponse = await fetch(`${API_BASE_URL}/api/drugs/search?q=${encodeURIComponent(drugName)}&limit=1`)
      
      if (!searchResponse.ok) {
        console.log(`Search failed for: ${drugName}`)
        errorCount++
        continue
      }
      
      const searchData = await searchResponse.json()
      
      if (!searchData.data || searchData.data.length === 0) {
        console.log(`Drug not found: ${drugName}`)
        skippedCount++
        continue
      }
      
      const drugId = searchData.data[0].id
      const interactions = interactionsData[drugName]
      
      // Import each interaction
      for (const [interactingDrugName, interactionData] of Object.entries(interactions)) {
        const importResponse = await fetch(`${API_BASE_URL}/api/admin/drugs/${drugId}/interactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interactingDrugName,
            severity: interactionData.severity,
            description: interactionData.description,
            mechanism: interactionData.mechanism,
            recommendation: interactionData.recommendation
          })
        })
        
        if (importResponse.ok) {
          totalInteractions++
        } else {
          console.log(`  Failed to import interaction: ${drugName} + ${interactingDrugName}`)
        }
      }
      
      successCount++
      
      if (successCount % 10 === 0) {
        console.log(`Progress: ${successCount} drugs, ${totalInteractions} interactions...`)
      }
    } catch (error) {
      console.error(`Error processing ${drugName}:`, error)
      errorCount++
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('IMPORT SUMMARY')
  console.log('='.repeat(50))
  console.log(`Total drugs processed: ${successCount}`)
  console.log(`Total interactions imported: ${totalInteractions}`)
  console.log(`Skipped (not found): ${skippedCount}`)
  console.log(`Errors: ${errorCount}`)
  console.log('='.repeat(50))
}

async function checkServer() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/drugs/stats`, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    })
    return response.ok
  } catch {
    return false
  }
}

async function main() {
  const isServerRunning = await checkServer()
  
  if (!isServerRunning) {
    console.error('ERROR: Next.js server is not running!')
    console.error('Please start the server first with: npm run dev')
    process.exit(1)
  }
  
  console.log('Server is running. Starting import...')
  await importViaAPI()
}

main().catch(console.error)
