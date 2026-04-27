/**
 * Fix Truncated Generic Names
 * 
 * Updates 8 drug records with complete generic names from JSON file
 * to improve DailyMed matching accuracy.
 */

import { db } from '@/lib/db'
import { readFileSync } from 'fs'
import { join } from 'path'

interface DrugRecord {
  "Drug Code": string
  "Package Name": string
  "Generic Name": string
}

async function fixTruncatedGenericNames() {
  console.log('Fixing Truncated Generic Names...\n')
  
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
  
  // Create a map of JSON drugs by drug code
  const jsonDrugMap = new Map(jsonData.map(d => [d["Drug Code"], d]))
  
  // Find drugs with truncated generic names
  const fixes: Array<{
    drugCode: string
    packageName: string
    currentGeneric: string
    fixedGeneric: string
  }> = []
  
  for (const dbDrug of dbDrugs) {
    const jsonDrug = jsonDrugMap.get(dbDrug.drugCode)
    
    if (jsonDrug) {
      // Check if DB generic name is different (and likely truncated)
      if (jsonDrug["Generic Name"] !== dbDrug.genericName) {
        fixes.push({
          drugCode: dbDrug.drugCode,
          packageName: dbDrug.packageName,
          currentGeneric: dbDrug.genericName,
          fixedGeneric: jsonDrug["Generic Name"]
        })
      }
    }
  }
  
  console.log(`\n=== Drugs to Fix: ${fixes.length} ===`)
  fixes.forEach(fix => {
    console.log(`\n${fix.drugCode} - ${fix.packageName}`)
    console.log(`  Current: "${fix.currentGeneric}"`)
    console.log(`  Fixed:   "${fix.fixedGeneric}"`)
  })
  
  // Apply fixes
  console.log(`\n=== Applying Fixes ===`)
  
  for (const fix of fixes) {
    console.log(`\nFixing ${fix.drugCode}...`)
    
    await db.drug.update({
      where: { drugCode: fix.drugCode },
      data: { genericName: fix.fixedGeneric }
    })
    
    console.log(`  ✓ Updated generic name`)
  }
  
  console.log(`\n=== All Fixes Applied ===`)
  console.log(`Fixed ${fixes.length} drug records`)
  
  await db.$disconnect()
}

// Run the fix
fixTruncatedGenericNames()
  .then(() => {
    console.log('\n=== Fix Complete ===')
    process.exit(0)
  })
  .catch(error => {
    console.error('Error during fix:', error)
    process.exit(1)
  })