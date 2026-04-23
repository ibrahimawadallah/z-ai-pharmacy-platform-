// Manually set environment variables to bypass dotenv issues
process.env.DATABASE_URL = "postgresql://neondb_owner:npg_QNEzlKjg4J3p@ep-shiny-king-adsne10e-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&pool_timeout=10&connection_limit=1"
process.env.DIRECT_URL = "postgresql://neondb_owner:npg_QNEzlKjg4J3p@ep-shiny-king-adsne10e-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

const FALLBACK_DATA = {
  'Amoxicillin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Crosses placenta. Use only if clearly needed.', breastfeedingSafety: 'Compatible. Excreted in low concentrations.', g6pdSafety: 'Safe', baseDoseMgPerKg: 25, baseDoseIndication: 'Respiratory infection', source: 'FDA' },
  'Metformin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Continue use in pregnancy for diabetes control.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 20, baseDoseIndication: 'Type 2 Diabetes', source: 'FDA' },
  'Atorvastatin': { pregnancyCategory: 'X', pregnancyPrecautions: 'CONTRAINDICATED IN PREGNANCY.', breastfeedingSafety: 'Contraindicated.', g6pdSafety: 'Safe', source: 'FDA' },
  'Ibuprofen': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in 3rd trimester.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Caution', g6pdWarning: 'May trigger hemolysis in G6PD deficiency', baseDoseMgPerKg: 10, baseDoseIndication: 'Pain/Inflammation', source: 'FDA' },
  'Aspirin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in 3rd trimester.', breastfeedingSafety: 'Compatible in low doses.', g6pdSafety: 'Caution', baseDoseMgPerKg: 10, source: 'FDA' },
  'Co-trimoxazole': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid near term.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Contraindicated', g6pdWarning: 'CONTRAINDICATED in G6PD deficiency', source: 'FDA' },
  'Panadol': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe at recommended doses.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 15, baseDoseIndication: 'Pain/Fever', source: 'FDA' },
  'Paracetamol': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe at recommended doses.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 15, baseDoseIndication: 'Pain/Fever', source: 'FDA' },
  'Augmentin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe for most infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 25, baseDoseIndication: 'Respiratory infection', source: 'FDA' },
  'Adol': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe at recommended doses.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 15, source: 'FDA' },
  'Brufen': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in 3rd trimester.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Caution', baseDoseMgPerKg: 10, source: 'FDA' },
  'Nurofen': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in 3rd trimester.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Caution', baseDoseMgPerKg: 10, source: 'FDA' },
  'Ciprofloxacin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in pregnancy.', breastfeedingSafety: 'Discontinue breastfeeding.', g6pdSafety: 'Safe', source: 'FDA' },
  'Azithromycin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use only if needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 10, baseDoseIndication: 'Respiratory infection', source: 'FDA' },
  'Omeprazole': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Losec': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Prednisolone': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use lowest effective dose.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 1, baseDoseIndication: 'Inflammation', source: 'FDA' },
  'Ventolin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Salbutamol': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Glucophage': { pregnancyCategory: 'B', pregnancyPrecautions: 'Continue for diabetes control.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 20, source: 'FDA' },
  'Novonorm': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Excreted in milk.', g6pdSafety: 'Safe', source: 'FDA' },
  'Diamicron': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only in 2nd/3rd trimester if needed.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe', source: 'FDA' },
  'Captopril': { pregnancyCategory: 'D', pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', breastfeedingSafety: 'Excreted in milk.', g6pdSafety: 'Safe', source: 'FDA' },
  'Lisinopril': { pregnancyCategory: 'D', pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe', source: 'FDA' },
  'Cozaar': { pregnancyCategory: 'D', pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe', source: 'FDA' },
  'Fastium': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe for hypertension.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Amlodipine': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Norvasc': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Zantac': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Ranitidine': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Tavan': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Flagyl': { pregnancyCategory: 'B', pregnancyPrecautions: 'Avoid in 1st trimester.', breastfeedingSafety: 'Discontinue nursing.', g6pdSafety: 'Safe', source: 'FDA' },
  'Metronidazole': { pregnancyCategory: 'B', pregnancyPrecautions: 'Avoid in 1st trimester.', breastfeedingSafety: 'Discontinue for 24h.', g6pdSafety: 'Safe', source: 'FDA' },
  'Diclofenac': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in 3rd trimester.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Cataflam': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in 3rd trimester.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Povidone Iodine': { pregnancyCategory: 'X', pregnancyPrecautions: 'Avoid.', breastfeedingSafety: 'Avoid.', g6pdSafety: 'Safe', source: 'FDA' },
  'Betadine': { pregnancyCategory: 'X', pregnancyPrecautions: 'Avoid.', breastfeedingSafety: 'Avoid.', g6pdSafety: 'Safe', source: 'FDA' }
}

async function populateDatabase() {
  console.log('Populating database with clinical data...\n')
  
  let updated = 0
  let found = 0

  // Get all active drugs in batches
  let allDrugs = []
  let hasMore = true
  let skip = 0
  const batchSize = 1000
  
  while (hasMore) {
    const drugs = await db.drug.findMany({
      where: { status: 'Active' },
      select: { id: true, packageName: true, genericName: true, pregnancyCategory: true },
      orderBy: { packageName: 'asc' },
      skip: skip,
      take: batchSize
    })
    
    if (drugs.length === 0) {
      hasMore = false
    } else {
      allDrugs = [...allDrugs, ...drugs]
      skip += batchSize
      console.log(`Processed ${allDrugs.length} drugs so far...`)
    }
  }
  
  const drugs = allDrugs

  console.log(`Found ${drugs.length} active drugs in database`)

  for (const drug of drugs) {
    // Check if already has data
    if (drug.pregnancyCategory) continue

    const name = (drug.genericName || drug.packageName || '').toLowerCase()
    
    // Find matching data
    let data = null
    for (const [key, value] of Object.entries(FALLBACK_DATA)) {
      if (name.includes(key.toLowerCase()) || key.toLowerCase().includes(name)) {
        data = value
        break
      }
    }

    if (data) {
      found++
      await db.drug.update({
        where: { id: drug.id },
        data: {
          pregnancyCategory: data.pregnancyCategory,
          pregnancyPrecautions: data.pregnancyPrecautions,
          breastfeedingSafety: data.breastfeedingSafety,
          g6pdSafety: data.g6pdSafety,
          g6pdWarning: data.g6pdWarning,
          baseDoseMgPerKg: data.baseDoseMgPerKg,
          baseDoseIndication: data.baseDoseIndication
        }
      })
      updated++
      if (updated % 10 === 0) {
        console.log(`Updated ${updated} drugs...`)
      }
    }
  }

  console.log(`\n✓ Found matching data for ${found} drugs`)
  console.log(`✓ Updated ${updated} drugs in database`)
  console.log(`✓ Data is now available offline!`)
}

async function main() {
  try {
    await populateDatabase()
  } catch (e) {
    console.error('Error:', e)
  } finally {
    await db.$disconnect()
    process.exit(0)
  }
}

main()