/**
 * DailyMed Correlation Analysis
 * 
 * Analyzes if UAE drug code segments correlate with DailyMed data
 * to improve matching accuracy.
 */

import { db } from '@/lib/db'
import { 
  fetchAllDailyMedSPLs,
  fetchAllDailyMedDrugNames
} from '@/lib/api/dailymed-integration'
import { readFileSync } from 'fs'
import { join } from 'path'

interface DrugRecord {
  "Drug Code": string
  "Package Name": string
  "Generic Name": string
}

async function analyzeDailyMedCorrelation() {
  console.log('Analyzing UAE Drug Code correlation with DailyMed...\n')
  
  // Read UAE drug data
  const jsonPath = join('G:\\drug-intel-migration\\data\\json', 'uae_drug_snomed_icd10.json')
  const jsonData = JSON.parse(readFileSync(jsonPath, 'utf-8')) as DrugRecord[]
  
  console.log(`UAE drugs in JSON: ${jsonData.length}`)
  
  // Get current database drugs
  const dbDrugs = await db.drug.findMany({
    select: {
      drugCode: true,
      genericName: true,
      packageName: true
    },
    take: 100
  })
  
  console.log(`Drugs in database: ${dbDrugs.length}`)
  
  // Fetch DailyMed data
  console.log('\nFetching DailyMed data...')
  const splData = await fetchAllDailyMedSPLs()
  const drugNames = await fetchAllDailyMedDrugNames()
  
  console.log(`DailyMed SPL documents: ${splData.length}`)
  console.log(`DailyMed drug names: ${drugNames.length}`)
  
  // Analyze UAE drug code structure
  console.log('\n=== UAE Drug Code Structure Analysis ===')
  
  const codeStructure = {
    segment1: new Map<string, number>(),  // XXX (prefix)
    segment2: new Map<string, number>(),  // XXXX (middle)
    segment3: new Map<string, number>(),  // XXXXX (product)
    segment4: new Map<string, number>()   // XX (suffix)
  }
  
  for (const drug of dbDrugs) {
    const parts = drug.drugCode.split('-')
    if (parts.length === 4) {
      codeStructure.segment1.set(parts[0], (codeStructure.segment1.get(parts[0]) || 0) + 1)
      codeStructure.segment2.set(parts[1], (codeStructure.segment2.get(parts[1]) || 0) + 1)
      codeStructure.segment3.set(parts[2], (codeStructure.segment3.get(parts[2]) || 0) + 1)
      codeStructure.segment4.set(parts[3], (codeStructure.segment4.get(parts[3]) || 0) + 1)
    }
  }
  
  console.log('\nSegment 1 (Prefix) - Top 10:')
  const sortedSeg1 = [...codeStructure.segment1.entries()].sort((a, b) => b[1] - a[1])
  sortedSeg1.slice(0, 10).forEach(([seg, count]) => {
    console.log(`  ${seg}: ${count} drugs`)
  })
  
  console.log('\nSegment 2 (Middle) - Top 10:')
  const sortedSeg2 = [...codeStructure.segment2.entries()].sort((a, b) => b[1] - a[1])
  sortedSeg2.slice(0, 10).forEach(([seg, count]) => {
    console.log(`  ${seg}: ${count} drugs`)
  })
  
  console.log('\nSegment 3 (Product) - Top 10:')
  const sortedSeg3 = [...codeStructure.segment3.entries()].sort((a, b) => b[1] - a[1])
  sortedSeg3.slice(0, 10).forEach(([seg, count]) => {
    console.log(`  ${seg}: ${count} drugs`)
  })
  
  // Check if any segments appear in DailyMed SPL titles
  console.log('\n=== Checking for Segment Correlation with DailyMed ===')
  
  let correlationCount = 0
  const correlations: Array<{
    drugCode: string
    genericName: string
    segment: string
    splTitle: string
  }> = []
  
  for (const drug of dbDrugs.slice(0, 50)) {
    const parts = drug.drugCode.split('-')
    if (parts.length === 4) {
      // Check each segment against SPL titles
      for (let i = 1; i < 3; i++) { // Check segments 2 and 3
        const segment = parts[i]
        
        for (const spl of splData) {
          if (spl.title.includes(segment)) {
            correlationCount++
            correlations.push({
              drugCode: drug.drugCode,
              genericName: drug.genericName,
              segment,
              splTitle: spl.title
            })
            break // Only count first match per segment
          }
        }
      }
    }
  }
  
  console.log(`Found ${correlationCount} potential segment correlations in 50 drugs`)
  
  if (correlations.length > 0) {
    console.log('\nSample correlations:')
    correlations.slice(0, 5).forEach(cor => {
      console.log(`  ${cor.drugCode} (${cor.genericName})`)
      console.log(`    Segment "${cor.segment}" found in: ${cor.splTitle}`)
    })
  }
  
  // Check if generic names from JSON match DailyMed better than current DB
  console.log('\n=== Generic Name Matching Comparison ===')
  
  let jsonMatchCount = 0
  let dbMatchCount = 0
  
  for (let i = 0; i < Math.min(50, jsonData.length); i++) {
    const jsonDrug = jsonData[i]
    const dbDrug = dbDrugs.find(d => d.drugCode === jsonDrug["Drug Code"])
    
    if (dbDrug) {
      // Check JSON generic name
      const jsonMatches = drugNames.filter(dn => 
        dn.name_type === 'G' && 
        dn.drug_name.toLowerCase().includes(jsonDrug["Generic Name"].toLowerCase())
      )
      
      // Check DB generic name
      const dbMatches = drugNames.filter(dn => 
        dn.name_type === 'G' && 
        dn.drug_name.toLowerCase().includes(dbDrug.genericName.toLowerCase())
      )
      
      if (jsonMatches.length > 0) jsonMatchCount++
      if (dbMatches.length > 0) dbMatchCount++
      
      if (jsonMatches.length !== dbMatches.length) {
        console.log(`\n${jsonDrug["Drug Code"]}:`)
        console.log(`  JSON generic: "${jsonDrug["Generic Name"]}" - ${jsonMatches.length} matches`)
        console.log(`  DB generic: "${dbDrug.genericName}" - ${dbMatches.length} matches`)
      }
    }
  }
  
  console.log(`\nJSON generic name matches: ${jsonMatchCount}/50`)
  console.log(`DB generic name matches: ${dbMatchCount}/50`)
  
  await db.$disconnect()
  
  return {
    correlationCount,
    jsonMatchCount,
    dbMatchCount
  }
}

// Run the analysis
analyzeDailyMedCorrelation()
  .then(results => {
    console.log('\n=== Analysis Complete ===')
    console.log(`Segment correlations found: ${results.correlationCount}`)
    console.log(`JSON generic name matches: ${results.jsonMatchCount}`)
    console.log(`DB generic name matches: ${results.dbMatchCount}`)
  })
  .catch(error => {
    console.error('Error during analysis:', error)
    process.exit(1)
  })