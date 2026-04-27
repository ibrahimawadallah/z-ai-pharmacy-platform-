/**
 * DailyMed ICD-10 Data Import Script
 * 
 * This script fetches official FDA drug-indication mappings from DailyMed SPL XML
 * and updates the ICD-10 mappings in the database with proper source attribution.
 * 
 * DailyMed is a TIER_1 data source (official regulatory source from NLM/FDA)
 * 
 * Usage: npx tsx scripts/import-dailymed-icd10.ts
 */

import { db } from '@/lib/db'
import { 
  fetchDailyMedSPLs,
  fetchAllDailyMedSPLs,
  fetchDailyMedSPLXML,
  matchDrugByGenericName,
  fetchAllDailyMedDrugNames,
  extractIndicationsFromSPLXML,
  convertIndicationToICD10,
  getDailyMedDataQuality
} from '@/lib/api/dailymed-integration'

async function importDailyMedICD10Data() {
  console.log('Starting DailyMed ICD-10 data import...\n')
  
  try {
    // Get drugs that don't have DailyMed mappings yet
    const drugsWithoutDailyMed = await db.drug.findMany({
      where: {
        icd10Codes: {
          none: {
            source: 'DAILYMED_SPL'
          }
        }
      },
      select: {
        id: true,
        genericName: true,
        packageName: true
      }
      // Process all drugs without DailyMed mappings
    })
    
    console.log(`Found ${drugsWithoutDailyMed.length} drugs without DailyMed mappings`)
    
    if (drugsWithoutDailyMed.length === 0) {
      console.log('All drugs already have DailyMed mappings')
      return
    }
    
    // Fetch all DailyMed drug names for matching
    console.log('\nFetching DailyMed drug names for matching...')
    const dailyMedDrugNames = await fetchAllDailyMedDrugNames()
    console.log(`Fetched ${dailyMedDrugNames.length} drug names from DailyMed`)
    
    // Fetch DailyMed SPL documents for SET IDs
    console.log('\nFetching DailyMed SPL documents...')
    const splData = await fetchAllDailyMedSPLs()
    console.log(`Fetched ${splData.length} SPL documents`)
    
    let totalMappingsAdded = 0
    let totalDrugsProcessed = 0
    let noMatchCount = 0
    let noSPLCount = 0
    let noIndicationCount = 0
    let noICD10Count = 0
    
    const batchSize = 50
    const totalDrugs = drugsWithoutDailyMed.length
    
    console.log(`\nProcessing ${totalDrugs} drugs in batches of ${batchSize}...\n`)
    
    for (let i = 0; i < totalDrugs; i++) {
      const drug = drugsWithoutDailyMed[i]
      
      // Progress indicator
      if (i % 10 === 0) {
        console.log(`Progress: ${i}/${totalDrugs} (${((i / totalDrugs) * 100).toFixed(1)}%)`)
      }
      
      try {
        // Match drug to DailyMed by generic name
        const genericMatches = matchDrugByGenericName(drug.genericName, dailyMedDrugNames)
        
        if (genericMatches.length === 0) {
          noMatchCount++
          continue
        }
        
        // Try to find a matching SPL document
        let matchedSPL = null
        
        // Extract base ingredients from generic name for better matching
        const baseIngredients = drug.genericName
          .toLowerCase()
          .replace(/[(),]/g, ' ')
          .replace(/\s+(hydrochloride|hcl|sulfate|maleate|tartrate|sodium|potassium|calcium|hydrogen)/gi, '')
          .replace(/\s+(acetate|phosphate|citrate|lactate|gluconate)/gi, '')
          .trim()
          .split(/[\s,]+/)
          .filter(i => i.length > 3)
        
        for (const ingredient of baseIngredients) {
          for (const spl of splData) {
            const splTitleLower = spl.title.toLowerCase()
            
            // Check if SPL title contains the ingredient
            if (splTitleLower.includes(ingredient)) {
              // Additional check: ensure it's not too long (avoid false positives)
              if (splTitleLower.length < ingredient.length + 50) {
                matchedSPL = spl
                break
              }
            }
          }
          
          if (matchedSPL) break
        }
        
        if (!matchedSPL) {
          noSPLCount++
          continue
        }
        
        // Fetch SPL XML for the matched document
        const splXML = await fetchDailyMedSPLXML(matchedSPL.setid)
        
        if (!splXML) {
          noSPLCount++
          continue
        }
        
        // Extract indications from SPL XML
        const indications = extractIndicationsFromSPLXML(splXML)
        
        if (indications.length === 0) {
          noIndicationCount++
          continue
        }
        
        // Convert indications to ICD-10 codes
        const icd10Mappings = new Map<string, string>()
        
        for (const indication of indications) {
          const icd10Code = convertIndicationToICD10(indication)
          if (icd10Code && !icd10Mappings.has(icd10Code)) {
            icd10Mappings.set(icd10Code, indication)
          }
        }
        
        if (icd10Mappings.size === 0) {
          noICD10Count++
          continue
        }
        
        // Add ICD-10 mappings to database
        const dataQuality = getDailyMedDataQuality()
        
        for (const [icd10Code, indication] of icd10Mappings.entries()) {
          try {
            await db.iCD10Mapping.create({
              data: {
                drugId: drug.id,
                icd10Code,
                source: dataQuality.source,
                confidence: dataQuality.confidence,
                evidenceLevel: dataQuality.evidenceLevel,
                lastVerified: new Date(),
                isValidated: true,
                validationDate: new Date(),
                validationNotes: `Imported from DailyMed SPL: ${matchedSPL.title}. Indication: ${indication.substring(0, 100)}...`,
                requiresReview: false,
                splSetId: matchedSPL.setid
              }
            })
            
            totalMappingsAdded++
          } catch (error) {
            // Mapping might already exist - ignore
          }
        }
        
        totalDrugsProcessed++
        
        // Add delay to avoid overwhelming the API
        if (i % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        
      } catch (error) {
        console.error(`Error processing ${drug.packageName}:`, error)
      }
    }
    
    console.log(`\n\nImport Summary:`)
    console.log(`  Total drugs without DailyMed mappings: ${totalDrugs}`)
    console.log(`  Drugs successfully processed: ${totalDrugsProcessed}`)
    console.log(`  ICD-10 mappings added: ${totalMappingsAdded}`)
    console.log(`  No generic name match: ${noMatchCount}`)
    console.log(`  No SPL document found: ${noSPLCount}`)
    console.log(`  No indications extracted: ${noIndicationCount}`)
    console.log(`  No ICD-10 mapping possible: ${noICD10Count}`)
    console.log(`  Success rate: ${((totalDrugsProcessed / totalDrugs) * 100).toFixed(1)}%`)
    console.log(`  Data source: DailyMed SPL (TIER_1)`)
    console.log(`  Authority: National Library of Medicine / FDA`)
    
  } catch (error) {
    console.error('Error during DailyMed import:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

// Run the import
importDailyMedICD10Data()
  .then(() => {
    console.log('\n✓ DailyMed import completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n✗ DailyMed import failed:', error)
    process.exit(1)
  })