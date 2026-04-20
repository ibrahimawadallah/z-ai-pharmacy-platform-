import { readFileSync, existsSync } from 'fs'
import { db } from '../src/lib/db'

async function importDrugs() {
  console.log('Starting drug import...')
  
  const csvPath = '/home/z/my-project/upload/UAE drug list.csv'
  const csvContent = readFileSync(csvPath, 'utf-8')
  const lines = csvContent.split('\n')
  
  console.log(`Found ${lines.length - 1} lines in CSV`)
  
  // Clear existing test data
  console.log('Clearing existing data...')
  await db.$executeRaw`DELETE FROM ICD10Mapping`
  await db.$executeRaw`DELETE FROM DrugInteraction`
  await db.$executeRaw`DELETE FROM DrugSideEffect`
  await db.$executeRaw`DELETE FROM Drug`
  
  // Parse and prepare data
  const drugData: any[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    // Simple CSV parsing
    const values: string[] = []
    let current = ''
    let inQuotes = false
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())
    
    if (!values[0] || !values[2]) continue // Skip rows without drug code or name
    
    const getVal = (idx: number) => values[idx] || null
    const getFloat = (idx: number) => values[idx] ? parseFloat(values[idx]) : null
    
    drugData.push({
      drugCode: values[0],
      packageName: values[2] || 'Unknown',
      genericName: values[4] || '',
      strength: values[5] || '',
      dosageForm: values[6] || '',
      packageSize: getVal(7),
      status: values[13] || 'Active',
      dispenseMode: getVal(8),
      packagePricePublic: getFloat(9),
      packagePricePharmacy: getFloat(10),
      unitPricePublic: getFloat(11),
      unitPricePharmacy: getFloat(12),
      agentName: getVal(16),
      manufacturerName: getVal(17),
      insurancePlan: getVal(1),
      govtFundedCoverage: getVal(18),
      uppScope: getVal(19),
      includedInThiqaABM: getVal(20),
      includedInBasic: getVal(21),
      includedInABM1: getVal(22),
      includedInABM7: getVal(23),
    })
  }
  
  console.log(`Prepared ${drugData.length} drugs for import`)
  
  // Import in batches
  const batchSize = 500
  let imported = 0
  
  for (let i = 0; i < drugData.length; i += batchSize) {
    const batch = drugData.slice(i, i + batchSize)
    
    try {
      await db.drug.createMany({ data: batch })
      imported += batch.length
      console.log(`Imported ${imported}/${drugData.length} drugs...`)
    } catch (error) {
      console.error(`Error at batch ${i}:`, error)
    }
  }
  
  console.log(`Import complete!`)
  
  const count = await db.drug.count()
  console.log(`Total drugs in database: ${count}`)
  
  await db.$disconnect()
}

importDrugs().catch(console.error)
