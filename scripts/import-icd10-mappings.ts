/**
 * Import ICD-10 mappings from uae-drugs-complete-icd10-mappings.json into database
 * Run: npx ts-node scripts/import-icd10-mappings.ts
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface ICD10Mapping {
  drugName: string
  drugCode: string
  icd10Codes: Array<{
    code: string
    description: string
    category: string
  }>
}

async function importICD10Mappings() {
  console.log('Starting ICD-10 mappings import...')
  
  // Read the mappings file
  const mappingsPath = path.join(process.cwd(), 'upload', 'uae-drugs-complete-icd10-mappings.json')
  const mappingsData: Record<string, ICD10Mapping> = JSON.parse(fs.readFileSync(mappingsPath, 'utf-8'))
  
  const drugNames = Object.keys(mappingsData)
  console.log(`Found ${drugNames.length} drugs with ICD-10 mappings`)
  
  let successCount = 0
  let errorCount = 0
  let skippedCount = 0
  
  // Process in batches
  const batchSize = 100
  
  for (let i = 0; i < drugNames.length; i += batchSize) {
    const batch = drugNames.slice(i, i + batchSize)
    
    await prisma.$transaction(async (tx) => {
      for (const drugName of batch) {
        const mapping = mappingsData[drugName]
        
        try {
          // Find the drug by name or code
          const drug = await tx.drug.findFirst({
            where: {
              OR: [
                { genericName: { contains: drugName, mode: 'insensitive' } },
                { packageName: { contains: drugName, mode: 'insensitive' } },
                { drugCode: mapping.drugCode }
              ]
            }
          })
          
          if (!drug) {
            skippedCount++
            continue
          }
          
          // Delete existing ICD-10 mappings for this drug
          await tx.iCD10Mapping.deleteMany({
            where: { drugId: drug.id }
          })
          
          // Create new ICD-10 mappings
          for (const icd10 of mapping.icd10Codes) {
            await tx.iCD10Mapping.create({
              data: {
                drugId: drug.id,
                icd10Code: icd10.code,
                description: icd10.description,
                category: icd10.category
              }
            })
          }
          
          successCount++
          
          if (successCount % 100 === 0) {
            console.log(`Processed ${successCount} drugs...`)
          }
        } catch (error) {
          console.error(`Error processing ${drugName}:`, error)
          errorCount++
        }
      }
    })
    
    console.log(`Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(drugNames.length/batchSize)} completed`)
  }
  
  console.log('\nImport Summary:')
  console.log(`- Total drugs in file: ${drugNames.length}`)
  console.log(`- Successfully imported: ${successCount}`)
  console.log(`- Skipped (not found): ${skippedCount}`)
  console.log(`- Errors: ${errorCount}`)
}

importICD10Mappings()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
