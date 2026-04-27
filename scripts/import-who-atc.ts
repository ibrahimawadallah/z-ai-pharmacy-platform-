/**
 * WHO ATC ICD-10 Data Import Script
 * 
 * This script imports WHO ATC classification mappings and updates
 * the ICD-10 mappings in the database with proper source attribution.
 * 
 * Usage: npx tsx scripts/import-who-atc.ts
 */

import { db } from '@/lib/db'
import { getATCICD10Mappings } from '@/lib/api/who-atc'

async function importWHOATCData() {
  console.log('Starting WHO ATC ICD-10 data import...\n')
  
  try {
    // Get drugs that don't have WHO ATC mappings yet
    const drugsWithoutATC = await db.drug.findMany({
      where: {
        icd10Codes: {
          none: {
            source: 'WHO_ATC'
          }
        }
      },
      select: {
        id: true,
        packageName: true,
        genericName: true
      },
      take: 500 // Process in batches of 500
    })
    
    console.log(`Found ${drugsWithoutATC.length} drugs without WHO ATC ICD-10 mappings`)
    
    if (drugsWithoutATC.length === 0) {
      console.log('All drugs already have WHO ATC mappings. Exiting.')
      return
    }
    
    let processed = 0
    let atcMappingsAdded = 0
    let failed = 0
    
    for (const drug of drugsWithoutATC) {
      try {
        console.log(`Processing: ${drug.genericName} (${drug.packageName})`)
        
        // Get WHO ATC mappings
        const atcMappings = getATCICD10Mappings(drug.genericName)
        
        if (atcMappings.length > 0) {
          // Create WHO ATC mappings
          await db.iCD10Mapping.createMany({
            data: atcMappings.map(mapping => ({
              drugId: drug.id,
              icd10Code: mapping.icd10Code,
              description: mapping.icd10Description,
              category: mapping.atcName,
              source: mapping.source,
              confidence: mapping.confidence,
              evidenceLevel: mapping.evidenceLevel,
              lastVerified: new Date(),
              verifiedBy: 'WHO_ATC_IMPORT',
              requiresReview: false // WHO ATC is authoritative
            })),
            skipDuplicates: true
          })
          
          atcMappingsAdded += atcMappings.length
          console.log(`  ✓ Added ${atcMappings.length} WHO ATC mappings`)
        } else {
          console.log(`  - No WHO ATC mappings found`)
        }
        
        processed++
        
        // Progress update
        if (processed % 50 === 0) {
          console.log(`\nProgress: ${processed}/${drugsWithoutATC.length} drugs processed`)
          console.log(`WHO ATC mappings added: ${atcMappingsAdded}\n`)
        }
        
      } catch (error) {
        console.error(`  ✗ Error processing ${drug.genericName}:`, error)
        failed++
      }
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('WHO ATC ICD-10 Import Summary')
    console.log('='.repeat(50))
    console.log(`Total drugs processed: ${processed}`)
    console.log(`WHO ATC mappings added: ${atcMappingsAdded}`)
    console.log(`Failed: ${failed}`)
    console.log(`Success rate: ${((processed - failed) / processed * 100).toFixed(1)}%`)
    
    // Get final statistics
    const totalDrugs = await db.drug.count()
    const drugsWithATC = await db.drug.count({
      where: {
        icd10Codes: {
          some: {
            source: 'WHO_ATC'
          }
        }
      }
    })
    
    console.log(`\nDatabase Statistics:`)
    console.log(`Total drugs: ${totalDrugs}`)
    console.log(`Drugs with WHO ATC mappings: ${drugsWithATC}`)
    console.log(`Coverage: ${((drugsWithATC / totalDrugs) * 100).toFixed(1)}%`)
    
  } catch (error) {
    console.error('Fatal error during WHO ATC import:', error)
  } finally {
    await db.$disconnect()
  }
}

// Run the import
importWHOATCData()
