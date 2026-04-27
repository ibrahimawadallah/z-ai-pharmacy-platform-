/**
 * RxNorm ICD-10 Data Import Script
 * 
 * This script fetches RxNorm drug-condition relationships and updates
 * the ICD-10 mappings in the database with proper source attribution.
 * 
 * Usage: npx tsx scripts/import-rxnorm.ts
 */

import { db } from '@/lib/db'
import { getRxNormICD10Mappings } from '@/lib/api/rxnorm-icd10'

async function importRxNormData() {
  console.log('Starting RxNorm ICD-10 data import...\n')
  
  try {
    // Get drugs that don't have RxNorm mappings yet
    const drugsWithoutRxNorm = await db.drug.findMany({
      where: {
        icd10Codes: {
          none: {
            source: 'RXNORM_MESH'
          }
        }
      },
      select: {
        id: true,
        packageName: true,
        genericName: true
      },
      take: 50 // Process in smaller batches due to API rate limits
    })
    
    console.log(`Found ${drugsWithoutRxNorm.length} drugs without RxNorm ICD-10 mappings`)
    
    if (drugsWithoutRxNorm.length === 0) {
      console.log('All drugs already have RxNorm mappings. Exiting.')
      return
    }
    
    let processed = 0
    let rxnormMappingsAdded = 0
    let failed = 0
    
    for (const drug of drugsWithoutRxNorm) {
      try {
        console.log(`Processing: ${drug.genericName} (${drug.packageName})`)
        
        // Fetch RxNorm mappings
        const rxnormMappings = await getRxNormICD10Mappings(drug.genericName)
        
        if (rxnormMappings.length > 0) {
          // Create RxNorm mappings
          await db.iCD10Mapping.createMany({
            data: rxnormMappings.map(mapping => ({
              drugId: drug.id,
              icd10Code: mapping.icd10Code,
              description: mapping.description,
              source: mapping.source,
              confidence: mapping.confidence,
              evidenceLevel: mapping.evidenceLevel,
              lastVerified: new Date(),
              verifiedBy: 'RXNORM_API_IMPORT',
              requiresReview: true // RxNorm data should be reviewed
            })),
            skipDuplicates: true
          })
          
          rxnormMappingsAdded += rxnormMappings.length
          console.log(`  ✓ Added ${rxnormMappings.length} RxNorm mappings`)
        } else {
          console.log(`  - No RxNorm mappings found`)
        }
        
        processed++
        
        // Progress update
        if (processed % 5 === 0) {
          console.log(`\nProgress: ${processed}/${drugsWithoutRxNorm.length} drugs processed`)
          console.log(`RxNorm mappings added: ${rxnormMappingsAdded}\n`)
        }
        
        // Rate limiting: 2 seconds between requests (RxNorm has stricter limits)
        await new Promise(resolve => setTimeout(resolve, 2000))
        
      } catch (error) {
        console.error(`  ✗ Error processing ${drug.genericName}:`, error)
        failed++
      }
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('RxNorm ICD-10 Import Summary')
    console.log('='.repeat(50))
    console.log(`Total drugs processed: ${processed}`)
    console.log(`RxNorm mappings added: ${rxnormMappingsAdded}`)
    console.log(`Failed: ${failed}`)
    console.log(`Success rate: ${((processed - failed) / processed * 100).toFixed(1)}%`)
    
    // Get final statistics
    const totalDrugs = await db.drug.count()
    const drugsWithRxNorm = await db.drug.count({
      where: {
        icd10Codes: {
          some: {
            source: 'RXNORM_MESH'
          }
        }
      }
    })
    
    console.log(`\nDatabase Statistics:`)
    console.log(`Total drugs: ${totalDrugs}`)
    console.log(`Drugs with RxNorm mappings: ${drugsWithRxNorm}`)
    console.log(`Coverage: ${((drugsWithRxNorm / totalDrugs) * 100).toFixed(1)}%`)
    
  } catch (error) {
    console.error('Fatal error during RxNorm import:', error)
  } finally {
    await db.$disconnect()
  }
}

// Run the import
importRxNormData()
