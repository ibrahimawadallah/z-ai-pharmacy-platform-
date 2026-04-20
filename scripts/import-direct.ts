/**
 * Direct database import for ICD-10 mappings - NO server needed
 * Run: npx ts-node scripts/import-direct.ts
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

// Use direct URL for connection
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
})

async function importICD10() {
  console.log('Reading ICD-10 mappings...')
  const mappingsPath = path.join(process.cwd(), 'upload', 'uae-drugs-complete-icd10-mappings.json')
  const mappingsData: Record<string, Array<{ code: string; description: string }>> = JSON.parse(fs.readFileSync(mappingsPath, 'utf-8'))
  
  const drugNames = Object.keys(mappingsData)
  console.log(`Found ${drugNames.length} drugs with ICD-10 mappings`)
  
  let successCount = 0
  let errorCount = 0
  let skippedCount = 0
  
  // Process in batches
  const batchSize = 50
  
  for (let i = 0; i < drugNames.length; i += batchSize) {
    const batch = drugNames.slice(i, i + batchSize)
    
    await prisma.$transaction(async (tx) => {
      for (const drugName of batch) {
        const icd10Codes = mappingsData[drugName]
        
        // Find drug by name
        const drug = await tx.drug.findFirst({
          where: {
            OR: [
              { genericName: { contains: drugName, mode: 'insensitive' } },
              { packageName: { contains: drugName, mode: 'insensitive' } }
            ]
          }
        })
        
        if (!drug) {
          skippedCount++
          continue
        }
        
        // Delete existing mappings
        await tx.iCD10Mapping.deleteMany({
          where: { drugId: drug.id }
        })
        
        // Create new mappings
        for (const icd10 of icd10Codes) {
          await tx.iCD10Mapping.create({
            data: {
              drugId: drug.id,
              icd10Code: icd10.code,
              description: icd10.description,
              category: 'General'
            }
          })
        }
        
        successCount++
      }
    })
    
    if (i % 500 === 0) {
      console.log(`Progress: ${i}/${drugNames.length} drugs processed`)
    }
  }
  
  console.log('\n=== IMPORT COMPLETE ===')
  console.log(`Imported: ${successCount}`)
  console.log(`Skipped: ${skippedCount}`)
  console.log(`Errors: ${errorCount}`)
}

importICD10()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
