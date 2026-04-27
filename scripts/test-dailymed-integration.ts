/**
 * DailyMed Integration Test Script
 * 
 * This script tests the DailyMed API integration and NDC matching logic
 * with UAE drug data.
 */

import { db } from '@/lib/db'
import { 
  fetchDailyMedNDCs, 
  fetchDailyMedSPLs,
  fetchDailyMedDrugNames,
  fetchDailyMedSPLXML,
  extractNDCFromDrugCode,
  matchDrugByNDC,
  matchDrugByGenericName,
  batchMatchUAEDrugsToDailyMed,
  extractIndicationsFromSPLXML
} from '@/lib/api/dailymed-integration'

async function testDailyMedIntegration() {
  console.log('Testing DailyMed Integration...\n')
  
  try {
    // Test 1: Fetch DailyMed NDC data
    console.log('Test 1: Fetching DailyMed NDC data')
    const ndcData = await fetchDailyMedNDCs(1, 10)
    console.log(`✓ Fetched ${ndcData.data.length} NDC codes`)
    console.log(`Total NDC codes available: ${ndcData.metadata.total_elements}`)
    console.log('Sample NDC codes:', ndcData.data.slice(0, 5).map(n => n.ndc).join(', '))
    
    // Test 1b: Fetch DailyMed SPL data (for SET IDs)
    console.log('\nTest 1b: Fetching DailyMed SPL data')
    const splData = await fetchDailyMedSPLs(1, 10)
    console.log(`✓ Fetched ${splData.data.length} SPL documents`)
    console.log(`Total SPL documents available: ${splData.metadata.total_elements}`)
    console.log('Sample SPL titles:', splData.data.slice(0, 3).map(s => s.title).join(', '))
    console.log('Sample SPL SET ID:', splData.data[0]?.setid)
    
    // Test 2: Fetch DailyMed drug names
    console.log('\nTest 2: Fetching DailyMed drug names')
    const drugNameData = await fetchDailyMedDrugNames(1, 100)
    console.log(`✓ Fetched ${drugNameData.data.length} drug names`)
    console.log('Sample drug names:', drugNameData.data.slice(0, 5).map(d => d.drug_name).join(', '))
    console.log(`Name types found: ${[...new Set(drugNameData.data.map(d => d.name_type))].join(', ')}`)
    console.log(`Generic names (G): ${drugNameData.data.filter(d => d.name_type === 'G').length}`)
    console.log(`Brand names (B): ${drugNameData.data.filter(d => d.name_type === 'B').length}`)
    console.log(`Sample generic names: ${drugNameData.data.filter(d => d.name_type === 'G').slice(0, 5).map(d => d.drug_name).join(', ')}`)
    
    // Test 3: NDC extraction from UAE drug codes
    console.log('\nTest 3: Testing NDC extraction from UAE drug codes')
    const testDrugCodes = [
      'F68-0913-04317-01',  // UAE format
      '12345-6789-12345',    // Standard NDC format
      '0002-0152-01',        // Short NDC format
      'INVALID-CODE'          // Invalid format
    ]
    
    for (const code of testDrugCodes) {
      const extracted = extractNDCFromDrugCode(code)
      console.log(`  ${code} → ${extracted || 'null'}`)
    }
    
    // Test 4: NDC matching with UAE drugs
    console.log('\nTest 4: Testing NDC matching with UAE drugs')
    const sampleDrugs = await db.drug.findMany({
      select: {
        id: true,
        drugCode: true,
        genericName: true,
        packageName: true
      },
      take: 5
    })
    
    console.log(`Testing with ${sampleDrugs.length} sample drugs`)
    
    for (const drug of sampleDrugs) {
      const ndcMatch = matchDrugByNDC(drug.drugCode, ndcData.data)
      console.log(`  ${drug.packageName} (${drug.drugCode})`)
      console.log(`    NDC match: ${ndcMatch ? 'Yes' : 'No'}`)
    }
    
    // Test 5: Generic name matching
    console.log('\nTest 5: Testing generic name matching')
    const testGenericNames = ['atorvastatin', 'metformin', 'lisinopril', 'amoxicillin', 'spironolactone', 'norfloxacin', 'ampicillin', 'fluoxetine', 'codeine', 'paracetamol', 'telmisartan', 'amlodipine', 'lipofer', 'delafoxacin']
    
    for (const genericName of testGenericNames) {
      const matches = matchDrugByGenericName(genericName, drugNameData.data)
      console.log(`  ${genericName}: ${matches.length} matches`)
      if (matches.length > 0 && matches.length <= 5) {
        console.log(`    Sample matches: ${matches.slice(0, 3).join(', ')}`)
      }
    }
    
    // Test 6: Batch matching UAE drugs to DailyMed
    console.log('\nTest 6: Batch matching UAE drugs to DailyMed')
    const allDrugs = await db.drug.findMany({
      select: {
        id: true,
        drugCode: true,
        genericName: true,
        packageName: true
      },
      take: 20
    })
    
    console.log(`Processing ${allDrugs.length} drugs...`)
    const matchResults = await batchMatchUAEDrugsToDailyMed(allDrugs)
    
    let ndcMatches = 0
    let genericMatches = 0
    
    for (const [drugId, result] of matchResults.entries()) {
      if (result.ndcMatch) ndcMatches++
      if (result.genericMatches.length > 0) genericMatches++
    }
    
    console.log(`\nMatch Results:`)
    console.log(`  NDC matches: ${ndcMatches} / ${allDrugs.length} (${((ndcMatches / allDrugs.length * 100).toFixed(1))}%)`)
    console.log(`  Generic name matches: ${genericMatches} / ${allDrugs.length} (${((genericMatches / allDrugs.length * 100).toFixed(1))}%)`)
    console.log(`  Total matches: ${ndcMatches + genericMatches} / ${allDrugs.length} (${(((ndcMatches + genericMatches) / allDrugs.length) * 100).toFixed(1)}%)`)
    
    // Test 7: Show sample matches
    console.log('\nSample successful matches:')
    let sampleCount = 0
    for (const [drugId, result] of matchResults.entries()) {
      if (sampleCount >= 5) break
      
      if (result.ndcMatch || result.genericMatches.length > 0) {
        const drug = allDrugs.find(d => d.id === drugId)
        console.log(`  ${drug?.packageName}:`)
        if (result.ndcMatch) {
          console.log(`    ✓ NDC match found`)
        }
        if (result.genericMatches.length > 0) {
          console.log(`    ✓ Generic matches: ${result.genericMatches.slice(0, 2).join(', ')}`)
        }
        sampleCount++
      }
    }
    
    // Test 8: Test SPL XML parsing
    console.log('\nTest 8: Testing SPL XML parsing')
    // Use a known SET ID from the SPL data for testing
    const testSetId = splData.data[0]?.setid
    if (testSetId) {
      console.log(`  Fetching SPL XML for SET ID: ${testSetId}`)
      console.log(`  Drug: ${splData.data[0]?.title}`)
      const splXML = await fetchDailyMedSPLXML(testSetId)
      
      if (splXML) {
        console.log(`  ✓ Fetched SPL XML (${splXML.length} characters)`)
        const indications = extractIndicationsFromSPLXML(splXML)
        console.log(`  ✓ Extracted ${indications.length} indications`)
        if (indications.length > 0) {
          console.log(`  Sample indications:`)
          indications.slice(0, 3).forEach(ind => {
            console.log(`    - ${ind.substring(0, 100)}...`)
          })
        }
      } else {
        console.log(`  ✗ Failed to fetch SPL XML`)
      }
    } else {
      console.log(`  ✗ No SET ID available for testing`)
    }
    
    console.log('\n✓ All tests completed successfully')
    
  } catch (error) {
    console.error('Error during DailyMed integration test:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

testDailyMedIntegration()
