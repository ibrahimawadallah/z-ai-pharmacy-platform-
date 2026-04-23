// Manually set environment variables to bypass dotenv issues
process.env.DATABASE_URL = "postgresql://neondb_owner:npg_QNEzlKjg4J3p@ep-shiny-king-adsne10e-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&pool_timeout=10&connection_limit=1"
process.env.DIRECT_URL = "postgresql://neondb_owner:npg_QNEzlKjg4J3p@ep-shiny-king-adsne10e-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()
const fs = require('fs')
const path = require('path')

// Function to normalize drug names for matching
function normalizeDrugName(name) {
  if (!name) return null
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')  // Remove parentheses content
    .replace(/[^a-z0-9\s]/g, ' ')  // Remove special characters
    .replace(/\s+/g, ' ')  // Normalize whitespace
    .trim()
}

// Function to build search keys for a drug
function buildDrugSearchKeys(packageName, genericName) {
  const keys = new Set()
  
  const addKey = (name) => {
    const normalized = normalizeDrugName(name)
    if (normalized) {
      keys.add(normalized)
      // Also add first token for partial matching
      const firstToken = normalized.split(' ')[0]
      if (firstToken) keys.add(firstToken)
    }
  }
  
  addKey(packageName)
  addKey(genericName)
  
  return Array.from(keys)
}

async function importSiderSideEffects() {
  console.log('Starting SIDER side effects import...\n')
  
  const siderPath = path.join(process.cwd(), 'public', 'data', 'sider-side-effects.tsv')
  
  if (!fs.existsSync(siderPath)) {
    console.error(`SIDER file not found at ${siderPath}`)
    return
  }
  
  // First, get all drugs from our database to build lookup map
  console.log('Loading drugs from database...')
  const drugs = await db.drug.findMany({
    select: {
      id: true,
      packageName: true,
      genericName: true
    },
    where: {
      status: 'Active'
    }
  })
  
  console.log(`Loaded ${drugs.length} active drugs from database`)
  
  // Build lookup maps
  const drugLookup = new Map()  // normalizedName -> [drugIds]
  const idToDrug = new Map()    // drugId -> drugObject
  
  drugs.forEach(drug => {
    idToDrug.set(drug.id, drug)
    const keys = buildDrugSearchKeys(drug.packageName, drug.genericName)
    keys.forEach(key => {
      if (!drugLookup.has(key)) {
        drugLookup.set(key, [])
      }
      drugLookup.get(key).push(drug.id)
    })
  })
  
  console.log(`Built lookup map with ${drugLookup.size} unique drug name keys`)
  
  // Read and process SIDER file
  const fileContent = fs.readFileSync(siderPath, 'utf8')
  const lines = fileContent.split('\n').filter(line => line.trim())
  
  console.log(`Processing ${lines.length - 1} side effect records (excluding header)...`)
  
  const batchSize = 1000
  let sideEffectsToCreate = []
  let processed = 0
  let matched = 0
  let inserted = 0
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    processed++
    
    if (processed % 10000 === 0) {
      console.log(`Processed ${processed} records...`)
    }
    
    const line = lines[i].trim()
    if (!line) continue
    
    const parts = line.split('\t')
    if (parts.length < 4) continue
    
    const drugbankId = parts[0].trim()
    const drugbankName = parts[1].trim()
    const sideEffectName = parts[3].trim()
    
    if (!sideEffectName) continue
    
    // Try to find matching drugs
    const drugKeys = buildDrugSearchKeys(drugbankName, null)
    let matchedDrugIds = []
    
    for (const key of drugKeys) {
      if (drugLookup.has(key)) {
        matchedDrugIds = matchedDrugIds.concat(drugLookup.get(key))
      }
    }
    
    // Deduplicate drug IDs
    matchedDrugIds = [...new Set(matchedDrugIds)]
    
    if (matchedDrugIds.length > 0) {
      matched++
      
      // Create side effect entries for each matched drug
      for (const drugId of matchedDrugIds) {
        sideEffectsToCreate.push({
          drugId,
          sideEffect: sideEffectName,
          frequency: null,  // SIDER doesn't provide frequency in this format
          severity: null,   // SIDER doesn't provide severity
          mechanism: null   // SIDER doesn't provide mechanism
        })
      }
    }
    
    // Insert in batches
    if (sideEffectsToCreate.length >= batchSize) {
      try {
        await db.drugSideEffect.createMany({
          data: sideEffectsToCreate
        })
        inserted += sideEffectsToCreate.length
        console.log(`Inserted batch. Total inserted: ${inserted}`)
        sideEffectsToCreate = []
      } catch (error) {
        console.error('Error inserting batch:', error)
        // Continue with next batch
        sideEffectsToCreate = []
      }
    }
  }
  
  // Insert remaining records
  if (sideEffectsToCreate.length > 0) {
    try {
      await db.drugSideEffect.createMany({
        data: sideEffectsToCreate
      })
      inserted += sideEffectsToCreate.length
      console.log(`Inserted final batch. Total inserted: ${inserted}`)
    } catch (error) {
      console.error('Error inserting final batch:', error)
    }
  }
  
  console.log(`\n=== SIDER IMPORT COMPLETE ===`)
  console.log(`Total records processed: ${processed}`)
  console.log(`Records matched to drugs: ${matched}`)
  console.log(`Side effect entries created: ${inserted}`)
  
  // Get final count
  const totalSideEffects = await db.drugSideEffect.count()
  console.log(`Total side effects in database: ${totalSideEffects}`)
  
  await db.$disconnect()
}

importSiderSideEffects()
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })