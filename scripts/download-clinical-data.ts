// Manually set environment variables to bypass dotenv issues
process.env.DATABASE_URL = "postgresql://neondb_owner:npg_QNEzlKjg4J3p@ep-shiny-king-adsne10e-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&pool_timeout=10&connection_limit=1"
process.env.DIRECT_URL = "postgresql://neondb_owner:npg_QNEzlKjg4J3p@ep-shiny-king-adsne10e-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

interface FDADrug {
  openfda?: {
    brand_name?: string[]
    generic_name?: string[]
    substance_name?: string[]
    route?: string[]
  }
  results?: Array<{
    pregnancy?: string[]
    breastfeeding?: string[]
  }>
}

const FDA_DATA_URL = 'https://api.fda.gov/drug/label.json'

async function fetchFromFDA(searchTerm: string): Promise<FDADrug[]> {
  try {
    const url = `${FDA_DATA_URL}?search=${encodeURIComponent(searchTerm)}&limit=10`
    const res = await fetch(url)
    const data = await res.json()
    return data.results || []
  } catch (e) {
    console.error('FDA fetch error:', e)
    return []
  }
}

async function populateFromFavoritesList() {
  const commonDrugs = [
    'amoxicillin', 'metformin', 'atorvastatin', 'ibuprofen', 'aspirin',
    'paracetamol', 'azithromycin', 'omeprazole', 'prednisolone', 'salbutamol',
    'lisinopril', 'amlodipine', 'gliclazide', ' metformin ', 'losartan',
    'ciprofloxacin', 'metronidazole', 'diclofenac', 'ranitidine', 'cetirizine'
  ]

  console.log('Starting FDA data population...')
  
  let enriched = 0
  
  for (const drug of commonDrugs) {
    try {
      const results = await fetchFromFDA(drug)
      
      for (const result of results) {
        const brandName = result.openfda?.brand_name?.[0]
        const genericName = result.openfda?.generic_name?.[0]
        
        if (!brandName) continue

        // Find matching UAE drug
        const uaeDrug = await db.drug.findFirst({
          where: {
            OR: [
              { packageName: { contains: brandName, mode: 'insensitive' } },
              { genericName: { contains: genericName || brandName, mode: 'insensitive' } }
            ]
          }
        })

        if (uaeDrug) {
          // Extract pregnancy category from FDA data
          const pregnancyResult = result.pregnancy?.[0] || ''
          let category = null
          if (pregnancyResult.toLowerCase().includes('category a')) category = 'A'
          else if (pregnancyResult.toLowerCase().includes('category b')) category = 'B'
          else if (pregnancyResult.toLowerCase().includes('category c')) category = 'C'
          else if (pregnancyResult.toLowerCase().includes('category d')) category = 'D'
          else if (pregnancyResult.toLowerCase().includes('category x')) category = 'X'

          const updateData: any = {}
          if (category && !uaeDrug.pregnancyCategory) {
            updateData.pregnancyCategory = category
            enriched++
          }

          if (Object.keys(updateData).length > 0) {
            await db.drug.update({
              where: { id: uaeDrug.id },
              data: updateData
            })
            console.log(`Updated: ${brandName} -> Category ${category}`)
          }
        }
      }
    } catch (e) {
      console.error(`Error fetching ${drug}:`, e)
    }
  }

  console.log(`\nEnriched ${enriched} drugs from FDA data`)
}

async function supplementWithExternalData() {
  console.log('Supplementing database with clinical data...')
  
   // Load external data service
   const { supplementDrugData } = await import('../src/lib/external-data-service')

  // Get drugs missing pregnancy data
  const drugs = await db.drug.findMany({
    where: {
      status: 'Active',
      pregnancyCategory: null
    },
    select: { id: true, packageName: true, genericName: true },
    take: 100
  })

  console.log(`Found ${drugs.length} drugs missing pregnancy data`)

  let supplemented = 0
  for (const drug of drugs) {
    const result = await supplementDrugData(drug.id)
    if (result.supplemented) {
      supplemented++
      console.log(`Supplemented: ${drug.packageName}`)
    }
  }

  console.log(`\nSupplemented ${supplemented} drugs with external data`)
}

async function main() {
  const command = process.argv[2] || 'all'

  if (command === 'fda') {
    await populateFromFavoritesList()
  } else if (command === 'supplement') {
    await supplementWithExternalData()
  } else {
    console.log('Running full data population...')
    await supplementWithExternalData()
    console.log('\nNote: FDA API requires separate authentication')
    console.log('For full FDA data, register at https://api.fda.gov')
  }

  await db.$disconnect()
  console.log('\nDone!')
}

main().catch(console.error)