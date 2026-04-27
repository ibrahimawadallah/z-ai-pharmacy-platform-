/**
 * FDA SPL ICD-10 Data Import Script
 * 
 * This script fetches official FDA drug-indication mappings and updates
 * the ICD-10 mappings in the database with proper source attribution.
 * 
 * Usage: npx tsx scripts/import-fda-icd10.ts
 */

import { db } from '@/lib/db'
import { getFDAICD10Mappings, batchFetchFDAICD10Mappings } from '@/lib/api/fda-icd10'

async function importFDAICD10Data() {
  console.log('Starting FDA ICD-10 data import...\n')
  
  try {
    // Get drugs that don't have FDA mappings yet
    const drugsWithoutFDA = await db.drug.findMany({
      where: {
        icd10Codes: {
          none: {
            source: 'FDA_SPL'
          }
        }
      },
      select: {
        id: true,
        packageName: true,
        genericName: true
      },
      take: 100 // Process in batches of 100
    })
    
    console.log(`Found ${drugsWithoutFDA.length} drugs without FDA ICD-10 mappings`)
    
    if (drugsWithoutFDA.length === 0) {
      console.log('All drugs already have FDA mappings. Exiting.')
      return
    }
    
    let processed = 0
    let fdaMappingsAdded = 0
    let failed = 0
    
    for (const drug of drugsWithoutFDA) {
      try {
        console.log(`Processing: ${drug.genericName} (${drug.packageName})`)
        
        // Fetch FDA mappings
        const fdaMappings = await getFDAICD10Mappings(drug.genericName)
        
        if (fdaMappings.length > 0) {
          // Create FDA mappings
          await db.iCD10Mapping.createMany({
            data: fdaMappings.map(mapping => ({
              drugId: drug.id,
              icd10Code: mapping.icd10Code,
              description: mapping.description,
              source: mapping.source,
              confidence: mapping.confidence,
              evidenceLevel: mapping.evidenceLevel,
              lastVerified: new Date(),
              verifiedBy: 'FDA_API_IMPORT',
              requiresReview: false // FDA data is authoritative
            })),
            skipDuplicates: true
          })
          
          fdaMappingsAdded += fdaMappings.length
          console.log(`  ✓ Added ${fdaMappings.length} FDA mappings`)
        } else {
          console.log(`  - No FDA mappings found`)
        }
        
        processed++
        
        // Progress update
        if (processed % 10 === 0) {
          console.log(`\nProgress: ${processed}/${drugsWithoutFDA.length} drugs processed`)
          console.log(`FDA mappings added: ${fdaMappingsAdded}\n`)
        }
        
        // Rate limiting: 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`  ✗ Error processing ${drug.genericName}:`, error)
        failed++
      }
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('FDA ICD-10 Import Summary')
    console.log('='.repeat(50))
    console.log(`Total drugs processed: ${processed}`)
    console.log(`FDA mappings added: ${fdaMappingsAdded}`)
    console.log(`Failed: ${failed}`)
    console.log(`Success rate: ${((processed - failed) / processed * 100).toFixed(1)}%`)
    
    // Get final statistics
    const totalDrugs = await db.drug.count()
    const drugsWithFDA = await db.drug.count({
      where: {
        icd10Codes: {
          some: {
            source: 'FDA_SPL'
          }
        }
      }
    })
    
    console.log(`\nDatabase Statistics:`)
    console.log(`Total drugs: ${totalDrugs}`)
    console.log(`Drugs with FDA mappings: ${drugsWithFDA}`)
    console.log(`Coverage: ${((drugsWithFDA / totalDrugs) * 100).toFixed(1)}%`)
    
  } catch (error) {
    console.error('Fatal error during FDA import:', error)
  } finally {
    await db.$disconnect()
  }
}

// Run the import
importFDAICD10Data()
