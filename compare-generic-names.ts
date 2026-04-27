/**
 * Generic Name Comparison
 * 
 * Compares generic names between JSON file and database
 * to identify which source has better data for DailyMed matching.
 */

import { db } from '@/lib/db'
import { readFileSync } from 'fs'
import { join } from 'path'

interface DrugRecord {
  "Drug Code": string
  "Package Name": string
  "Generic Name": string
}

async function compareGenericNames() {
  console.log('Comparing Generic Names between JSON and Database...\n')
  
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
    }
  })
  
  console.log(`Drugs in database: ${dbDrugs.length}`)
  
  // Compare generic names
  const differences: Array<{
    drugCode: string
    jsonGeneric: string
    dbGeneric: string
    packageName: string
  }> = []
  
  const jsonOnly: string[] = []
  const dbOnly: string[] = []
  
  // Create a map of DB drugs by drug code
  const dbDrugMap = new Map(dbDrugs.map(d => [d.drugCode, d]))
  
  for (const jsonDrug of jsonData) {
    const dbDrug = dbDrugMap.get(jsonDrug["Drug Code"])
    
    if (dbDrug) {
      // Compare generic names
      if (jsonDrug["Generic Name"] !== dbDrug.genericName) {
        differences.push({
          drugCode: jsonDrug["Drug Code"],
          jsonGeneric: jsonDrug["Generic Name"],
          dbGeneric: dbDrug.genericName,
          packageName: jsonDrug["Package Name"]
        })
      }
    } else {
      jsonOnly.push(jsonDrug["Drug Code"])
    }
  }
  
  // Find drugs only in DB
  for (const dbDrug of dbDrugs) {
    if (!dbDrugMap.has(dbDrug.drugCode)) {
      dbOnly.push(dbDrug.drugCode)
    }
  }
  
  console.log(`\n=== Comparison Results ===`)
  console.log(`Total JSON records: ${jsonData.length}`)
  console.log(`Total DB records: ${dbDrugs.length}`)
  console.log(`Matching drug codes: ${dbDrugs.length - dbOnly.length}`)
  console.log(`Generic name differences: ${differences.length}`)
  console.log(`JSON-only drug codes: ${jsonOnly.length}`)
  console.log(`DB-only drug codes: ${dbOnly.length}`)
  
  if (differences.length > 0) {
    console.log(`\n=== Sample Generic Name Differences ===`)
    differences.slice(0, 20).forEach(diff => {
      console.log(`\n${diff.drugCode} - ${diff.packageName}`)
      console.log(`  JSON: "${diff.jsonGeneric}"`)
      console.log(`  DB:   "${diff.dbGeneric}"`)
    })
  }
  
  // Analyze which generic names might be better for DailyMed matching
  console.log(`\n=== Generic Name Quality Analysis ===`)
  
  // Check for salt forms and modifiers
  const jsonWithSalts = differences.filter(d => 
    d.jsonGeneric.match(/hydrochloride|hcl|sulfate|maleate|tartrate/i)
  ).length
  
  const dbWithSalts = differences.filter(d => 
    d.dbGeneric.match(/hydrochloride|hcl|sulfate|maleate|tartrate/i)
  ).length
  
  console.log(`JSON generic names with salt forms: ${jsonWithSalts}`)
  console.log(`DB generic names with salt forms: ${dbWithSalts}`)
  
  // Check for combination drugs
  const jsonCombo = differences.filter(d => 
    d.jsonGeneric.includes(',') || d.jsonGeneric.includes('+')
  ).length
  
  const dbCombo = differences.filter(d => 
    d.dbGeneric.includes(',') || d.dbGeneric.includes('+')
  ).length
  
  console.log(`JSON combination drugs: ${jsonCombo}`)
  console.log(`DB combination drugs: ${dbCombo}`)
  
  await db.$disconnect()
  
  return {
    differences,
    jsonOnly,
    dbOnly,
    jsonWithSalts,
    dbWithSalts
  }
}

// Run the comparison
compareGenericNames()
  .then(results => {
    console.log('\n=== Comparison Complete ===')
    console.log(`Total differences: ${results.differences.length}`)
    console.log(`JSON-only records: ${results.jsonOnly.length}`)
    console.log(`DB-only records: ${results.dbOnly.length}`)
  })
  .catch(error => {
    console.error('Error during comparison:', error)
    process.exit(1)
  })