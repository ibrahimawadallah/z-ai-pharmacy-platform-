import { PrismaClient } from '@prisma/client'
import { readFileSync, existsSync } from 'fs'
import { createInterface } from 'readline'
import { createReadStream } from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// ==================== DRUG IMPORT ====================
async function importUAEDrugs() {
  console.log('\n========================================')
  console.log('IMPORTING UAE DRUG LIST')
  console.log('========================================')

  const csvPath = path.join(process.cwd(), 'upload', 'UAE drug list.csv')
  
  if (!existsSync(csvPath)) {
    console.error('CSV file not found:', csvPath)
    return 0
  }

  console.log('Reading CSV file...')
  const csvContent = readFileSync(csvPath, 'utf-8')
  const lines = csvContent.split('\n').filter(line => line.trim())
  
  if (lines.length === 0) {
    console.log('No data in CSV')
    return 0
  }

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim())
  console.log(`CSV has ${headers.length} columns`)
  console.log(`CSV has ${lines.length - 1} data rows`)

  // Clear existing drugs data
  console.log('\nClearing existing data...')
  await prisma.drugSideEffect.deleteMany({})
  await prisma.drugInteraction.deleteMany({})
  await prisma.iCD10Mapping.deleteMany({})
  await prisma.drug.deleteMany({})
  console.log('Cleared existing data')

  // Parse and import drugs
  console.log('\nParsing drug data...')
  const batchSize = 500
  let imported = 0
  let skipped = 0
  let batch: any[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue

    // Parse CSV line handling quotes
    const values: string[] = []
    let current = ''
    let inQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]
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

    // Map to expected columns based on UAE drug list format
    const getField = (idx: number) => values[idx] || null
    const getFloat = (idx: number) => {
      const val = getField(idx)
      if (!val) return null
      const num = parseFloat(val.replace(/,/g, ''))
      return isNaN(num) ? null : num
    }
    const parseDate = (idx: number) => {
      const val = getField(idx)
      if (!val || !val.includes('/')) return null
      try {
        const dateStr = val.split(' ')[0]
        const parts = dateStr.split('/')
        if (parts.length === 3) {
          const [month, day, year] = parts
          return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)
        }
        return null
      } catch {
        return null
      }
    }

    const drugCode = getField(0)
    if (!drugCode) {
      skipped++
      continue
    }

    const drugData = {
      drugCode: drugCode,
      packageName: getField(2) || 'Unknown',
      genericName: getField(4) || '',
      strength: getField(5) || '',
      dosageForm: getField(6) || '',
      packageSize: getField(7),
      status: getField(13) || 'Active',
      dispenseMode: getField(8),
      packagePricePublic: getFloat(9),
      packagePricePharmacy: getFloat(10),
      unitPricePublic: getFloat(11),
      unitPricePharmacy: getFloat(12),
      agentName: getField(16),
      manufacturerName: getField(17),
      insurancePlan: getField(1),
      govtFundedCoverage: getField(18),
      uppScope: getField(19),
      includedInThiqaABM: getField(20),
      includedInBasic: getField(21),
      includedInABM1: getField(22),
      includedInABM7: getField(23),
      pregnancyCategory: null,
      breastfeedingSafety: null,
      renalAdjustment: null,
      hepaticAdjustment: null,
      warnings: null,
      lastChangeDate: parseDate(15),
      uppEffectiveDate: parseDate(28),
      uppUpdatedDate: parseDate(29),
      uppExpiryDate: parseDate(30),
    }

    batch.push(drugData)

    if (batch.length >= batchSize || i === lines.length - 1) {
      try {
        await prisma.drug.createMany({ data: batch })
        imported += batch.length
        console.log(`Imported ${imported}/${lines.length - 1} drugs...`)
        batch = []
      } catch (error: any) {
        console.error(`Error importing batch at line ${i}:`, error.message)
        // Try one by one for problematic records
        for (const drug of batch) {
          try {
            await prisma.drug.create({ data: drug })
            imported++
          } catch (e: any) {
            console.error(`Failed to import drug ${drug.drugCode}:`, e.message)
            skipped++
          }
        }
        batch = []
      }
    }
  }

  console.log(`\nDrug import complete: ${imported} imported, ${skipped} skipped`)
  return imported
}

// ==================== INTERACTIONS IMPORT ====================
async function importInteractionsFromIntelligenceDB() {
  console.log('\n========================================')
  console.log('IMPORTING DRUG INTERACTIONS')
  console.log('========================================')

  const intelligencePath = path.join(process.cwd(), 'upload', 'drug-intelligence.db')
  
  if (!existsSync(intelligencePath)) {
    console.log('Drug intelligence database not found:', intelligencePath)
    console.log('Skipping interactions import')
    return 0
  }

  // Use better-sqlite3 for reading the SQLite file
  const { default: Database } = await import('better-sqlite3')
  
  console.log('Opening drug intelligence database...')
  const sqliteDB = new Database(intelligencePath, { readonly: true })
  
  try {
    // Get all drugs from Neon
    console.log('Fetching drugs from Neon...')
    const neonDrugs = await prisma.drug.findMany({
      select: { id: true, drugCode: true, packageName: true, genericName: true }
    })
    
    const codeToId = new Map<string, string>()
    const nameToId = new Map<string, string>()
    
    for (const drug of neonDrugs) {
      if (drug.drugCode) codeToId.set(drug.drugCode.trim(), drug.id)
      nameToId.set(drug.packageName.toLowerCase(), drug.id)
      if (drug.genericName) nameToId.set(drug.genericName.toLowerCase(), drug.id)
    }
    
    console.log(`Loaded ${neonDrugs.length} drugs for matching`)
    
    // Check if drugs table exists
    const tables = sqliteDB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
    console.log('Tables in intelligence DB:', tables.map((t: any) => t.name))
    
    if (!tables.some((t: any) => t.name === 'drug_interactions')) {
      console.log('No drug_interactions table found')
      return 0
    }
    
    // Query interactions
    const interactionsQuery = sqliteDB.prepare(`
      SELECT 
        d1.drug_code as primaryCode,
        d1.drug_name as primaryName,
        d1.generic_name as primaryGeneric,
        d2.drug_code as secondaryCode,
        d2.drug_name as secondaryName,
        d2.generic_name as secondaryGeneric,
        di.interaction_type as interactionType,
        di.severity as severity,
        di.description as description
      FROM drug_interactions di
      JOIN drugs d1 ON di.drug_id = d1.id
      LEFT JOIN drugs d2 ON di.interacting_drug_id = d2.id
    `)
    
    console.log('Importing interactions...')
    const batchSize = 1000
    let imported = 0
    let skipped = 0
    const batch: any[] = []
    const seen = new Set<string>()
    
    for (const row of interactionsQuery.iterate()) {
      const r = row as any
      
      // Find primary drug
      let primaryId = null
      if (r.primaryCode) primaryId = codeToId.get(r.primaryCode.trim())
      if (!primaryId && r.primaryName) primaryId = nameToId.get(r.primaryName.toLowerCase())
      if (!primaryId && r.primaryGeneric) primaryId = nameToId.get(r.primaryGeneric.toLowerCase())
      
      if (!primaryId) {
        skipped++
        continue
      }
      
      // Find secondary drug
      let secondaryId = null
      let secondaryName = null
      if (r.secondaryCode) secondaryId = codeToId.get(r.secondaryCode.trim())
      if (!secondaryId && r.secondaryName) {
        secondaryId = nameToId.get(r.secondaryName.toLowerCase())
        secondaryName = r.secondaryName
      }
      if (!secondaryId && r.secondaryGeneric) {
        secondaryName = r.secondaryGeneric
      }
      
      // Deduplication key
      const dedupeKey = `${primaryId}|${secondaryId || secondaryName}|${r.severity}`
      if (seen.has(dedupeKey)) continue
      seen.add(dedupeKey)
      
      batch.push({
        drugId: primaryId,
        secondaryDrugName: secondaryName,
        secondaryDrugId: secondaryId,
        severity: r.severity,
        interactionType: r.interactionType,
        description: r.description,
        management: null,
        evidence: null,
      })
      
      if (batch.length >= batchSize) {
        await prisma.drugInteraction.createMany({ data: batch })
        imported += batch.length
        console.log(`Imported ${imported} interactions...`)
        batch.length = 0
      }
    }
    
    // Import remaining
    if (batch.length > 0) {
      await prisma.drugInteraction.createMany({ data: batch })
      imported += batch.length
    }
    
    console.log(`Interaction import complete: ${imported} imported, ${skipped} skipped`)
    return imported
    
  } finally {
    sqliteDB.close()
  }
}

// ==================== SIDE EFFECTS IMPORT ====================
async function importSideEffectsFromIntelligenceDB() {
  console.log('\n========================================')
  console.log('IMPORTING DRUG SIDE EFFECTS')
  console.log('========================================')

  const intelligencePath = path.join(process.cwd(), 'upload', 'drug-intelligence.db')
  
  if (!existsSync(intelligencePath)) {
    console.log('Drug intelligence database not found')
    return 0
  }

  const { default: Database } = await import('better-sqlite3')
  
  console.log('Opening drug intelligence database...')
  const sqliteDB = new Database(intelligencePath, { readonly: true })
  
  try {
    console.log('Fetching drugs from Neon...')
    const neonDrugs = await prisma.drug.findMany({
      select: { id: true, drugCode: true, packageName: true, genericName: true }
    })
    
    const codeToId = new Map<string, string>()
    const nameToId = new Map<string, string>()
    
    for (const drug of neonDrugs) {
      if (drug.drugCode) codeToId.set(drug.drugCode.trim(), drug.id)
      nameToId.set(drug.packageName.toLowerCase(), drug.id)
      if (drug.genericName) nameToId.set(drug.genericName.toLowerCase(), drug.id)
    }
    
    console.log(`Loaded ${neonDrugs.length} drugs for matching`)
    
    const tables = sqliteDB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
    console.log('Tables in intelligence DB:', tables.map((t: any) => t.name))
    
    if (!tables.some((t: any) => t.name === 'drug_side_effects')) {
      console.log('No drug_side_effects table found')
      return 0
    }
    
    const sideEffectsQuery = sqliteDB.prepare(`
      SELECT 
        d.drug_code as drugCode,
        d.drug_name as drugName,
        d.generic_name as genericName,
        se.side_effect as sideEffect,
        se.frequency as frequency,
        se.severity as severity
      FROM drug_side_effects se
      JOIN drugs d ON se.drug_id = d.id
    `)
    
    console.log('Importing side effects...')
    const batchSize = 1000
    let imported = 0
    let skipped = 0
    const batch: any[] = []
    const seen = new Set<string>()
    
    for (const row of sideEffectsQuery.iterate()) {
      const r = row as any
      
      // Find drug
      let drugId = null
      if (r.drugCode) drugId = codeToId.get(r.drugCode.trim())
      if (!drugId && r.drugName) drugId = nameToId.get(r.drugName.toLowerCase())
      if (!drugId && r.genericName) drugId = nameToId.get(r.genericName.toLowerCase())
      
      if (!drugId || !r.sideEffect) {
        skipped++
        continue
      }
      
      const dedupeKey = `${drugId}|${r.sideEffect}`
      if (seen.has(dedupeKey)) continue
      seen.add(dedupeKey)
      
      batch.push({
        drugId: drugId,
        sideEffect: r.sideEffect,
        frequency: r.frequency,
        severity: r.severity,
        mechanism: null,
      })
      
      if (batch.length >= batchSize) {
        await prisma.drugSideEffect.createMany({ data: batch })
        imported += batch.length
        console.log(`Imported ${imported} side effects...`)
        batch.length = 0
      }
    }
    
    if (batch.length > 0) {
      await prisma.drugSideEffect.createMany({ data: batch })
      imported += batch.length
    }
    
    console.log(`Side effects import complete: ${imported} imported, ${skipped} skipped`)
    return imported
    
  } finally {
    sqliteDB.close()
  }
}

// ==================== ICD-10 IMPORT ====================
async function importICD10Mappings() {
  console.log('\n========================================')
  console.log('IMPORTING ICD-10 MAPPINGS')
  console.log('========================================')

  const icd10Path = path.join(process.cwd(), 'upload', 'uae-drugs-complete-icd10-mappings.txt')
  
  if (!existsSync(icd10Path)) {
    console.log('ICD-10 mappings file not found:', icd10Path)
    return 0
  }

  console.log('Reading ICD-10 mappings...')
  const rawContent = readFileSync(icd10Path, 'utf-8')
  const mappingsByName = JSON.parse(rawContent.replace(/^\uFEFF/, '')) as Record<
    string,
    { code: string; description?: string | null }[]
  >

  console.log(`Found ${Object.keys(mappingsByName).length} drug names with ICD-10 mappings`)

  // Fetch all drugs for matching
  const neonDrugs = await prisma.drug.findMany({
    select: { id: true, packageName: true, genericName: true }
  })
  
  const nameToId = new Map<string, string[]>()
  for (const drug of neonDrugs) {
    const names = [drug.packageName.toLowerCase(), drug.genericName?.toLowerCase()].filter(Boolean)
    for (const name of names) {
      if (!nameToId.has(name)) nameToId.set(name, [])
      nameToId.get(name)!.push(drug.id)
    }
  }

  console.log('Importing ICD-10 mappings...')
  let imported = 0
  let skipped = 0
  const batch: any[] = []
  const batchSize = 1000

  for (const [drugName, codes] of Object.entries(mappingsByName)) {
    const drugIds = nameToId.get(drugName.toLowerCase())
    
    if (!drugIds || drugIds.length === 0) {
      skipped++
      continue
    }

    for (const drugId of drugIds) {
      for (const entry of codes) {
        const code = (entry.code || '').trim().toUpperCase()
        if (!code) continue
        
        batch.push({
          drugId: drugId,
          icd10Code: code,
          description: entry.description || null,
          category: null,
        })
        
        if (batch.length >= batchSize) {
          await prisma.iCD10Mapping.createMany({ data: batch })
          imported += batch.length
          console.log(`Imported ${imported} ICD-10 mappings...`)
          batch.length = 0
        }
      }
    }
  }

  if (batch.length > 0) {
    await prisma.iCD10Mapping.createMany({ data: batch })
    imported += batch.length
  }

  console.log(`ICD-10 import complete: ${imported} imported, ${skipped} skipped`)
  return imported
}

// ==================== MAIN ====================
async function main() {
  console.log('========================================')
  console.log('COMPLETE DATABASE MIGRATION TO NEON')
  console.log('========================================')
  console.log('Start time:', new Date().toISOString())
  
  try {
    // Step 1: Import drugs
    const drugCount = await importUAEDrugs()
    
    // Step 2: Import interactions
    const interactionCount = await importInteractionsFromIntelligenceDB()
    
    // Step 3: Import side effects
    const sideEffectCount = await importSideEffectsFromIntelligenceDB()
    
    // Step 4: Import ICD-10 mappings
    const icd10Count = await importICD10Mappings()
    
    // Final statistics
    console.log('\n========================================')
    console.log('MIGRATION SUMMARY')
    console.log('========================================')
    console.log(`Drugs: ${drugCount}`)
    console.log(`Drug Interactions: ${interactionCount}`)
    console.log(`Drug Side Effects: ${sideEffectCount}`)
    console.log(`ICD-10 Mappings: ${icd10Count}`)
    
    // Verify counts in database
    const finalDrugCount = await prisma.drug.count()
    const finalInteractionCount = await prisma.drugInteraction.count()
    const finalSideEffectCount = await prisma.drugSideEffect.count()
    const finalICD10Count = await prisma.iCD10Mapping.count()
    
    console.log('\nDatabase Verification:')
    console.log(`Drugs in database: ${finalDrugCount}`)
    console.log(`Interactions in database: ${finalInteractionCount}`)
    console.log(`Side effects in database: ${finalSideEffectCount}`)
    console.log(`ICD-10 mappings in database: ${finalICD10Count}`)
    
    console.log('\nEnd time:', new Date().toISOString())
    console.log('Migration completed successfully!')
    
  } catch (error: any) {
    console.error('\nMigration failed:', error)
    console.error('Error details:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
