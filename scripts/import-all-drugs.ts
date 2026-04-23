import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const createPrismaClient = () => {
  const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL
  return new PrismaClient({
    datasources: {
      db: {
        url: dbUrl
      }
    }
  })
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

const scriptDir = resolve('./scripts')

const resolvePath = (...paths: string[]) => resolve(scriptDir, ...paths)

interface DrugData {
  packageName: string
  genericName: string
  strength: string
  dosageForm: string
  packageSize?: string
  status: string
  manufacturerName?: string
}

interface InteractionData {
  [drug1: string]: {
    [drug2: string]: {
      severity: string
      description: string
      mechanism?: string
      recommendation?: string
    }
  }
}

interface PregnancyData {
  [drug: string]: {
    category: string
    description?: string
    recommendation?: string
  }
}

async function loadDataFiles() {
  console.log('Loading data files...\n')
  
  const data: {
    drugs: DrugData[]
    interactions: InteractionData
    pregnancy: PregnancyData
    icd10: Record<string, string[]>
  } = {
    drugs: [],
    interactions: {},
    pregnancy: {},
    icd10: {}
  }

  // Load drug interactions from public folder
  try {
    const interactionsPath = resolvePath('../public/data/drug-interactions.json')
    if (existsSync(interactionsPath)) {
      const content = readFileSync(interactionsPath, 'utf-8')
      data.interactions = JSON.parse(content)
      console.log(`Loaded interactions: ${Object.keys(data.interactions).length} drugs`)
    }
  } catch (e) {
    console.log('No interactions file found in public/data/')
  }

  // Load pregnancy data
  try {
    const pregnancyPath = resolvePath('../database/data/pregnancy-categories.ts')
    if (existsSync(pregnancyPath)) {
      console.log('Found pregnancy categories file')
    }
  } catch (e) {
    console.log('Could not load pregnancy data:', e)
  }

  // Load UAE drugs from JSON
  try {
    const uaePath = resolvePath('../database/data/uae-drugs-complete-icd10-mappings.json')
    if (existsSync(uaePath)) {
      const content = readFileSync(uaePath, 'utf-8')
      const parsed = JSON.parse(content)
      console.log(`Found UAE drug mappings: ${Object.keys(parsed).length} drugs`)
    }
  } catch (e) {
    console.log('Could not load UAE drugs:', e)
  }

  return data
}

async function checkCurrentData() {
  console.log('\n=== CURRENT DATABASE STATUS ===\n')
  
  const [totalDrugs, totalInteractions, totalSideEffects, totalICD10] = await Promise.all([
    prisma.drug.count(),
    prisma.drugInteraction.count(),
    prisma.drugSideEffect.count(),
    prisma.iCD10Mapping.count()
  ])

  const [withPregnancy, withG6PD, withDosage] = await Promise.all([
    prisma.drug.count({ where: { pregnancyCategory: { not: null } } }),
    prisma.drug.count({ where: { g6pdSafety: { not: null } } }),
    prisma.drug.count({ where: { baseDoseMgPerKg: { not: null } } })
  ])

  console.log(`Total Drugs: ${totalDrugs}`)
  console.log(`Total Interactions: ${totalInteractions}`)
  console.log(`Total Side Effects: ${totalSideEffects}`)
  console.log(`Total ICD-10 Mappings: ${totalICD10}`)
  console.log(`With Pregnancy Data: ${withPregnancy}`)
  console.log(`With G6PD Data: ${withG6PD}`)
  console.log(`With Dosage Data: ${withDosage}`)

  return { totalDrugs, totalInteractions, totalSideEffects, totalICD10, withPregnancy, withG6PD, withDosage }
}

async function importClinicalData() {
  console.log('\n=== IMPORTING CLINICAL DATA ===\n')

  // Import pregnancy data from external-data-service.ts
  const { FALLBACK_DATA } = await import('@/lib/external-data-service')
  
  let pregnancyUpdated = 0
  
  for (const [drugName, clinicalData] of Object.entries(FALLBACK_DATA)) {
    const drugs = await prisma.drug.findMany({
      where: {
        OR: [
          { genericName: { contains: drugName, mode: 'insensitive' } },
          { packageName: { contains: drugName, mode: 'insensitive' } }
        ]
      },
      take: 1
    })

    if (drugs.length > 0) {
      await prisma.drug.update({
        where: { id: drugs[0].id },
        data: {
          pregnancyCategory: clinicalData.pregnancyCategory,
          pregnancyPrecautions: clinicalData.pregnancyPrecautions,
          breastfeedingSafety: clinicalData.breastfeedingSafety,
          g6pdSafety: clinicalData.g6pdSafety,
          g6pdWarning: clinicalData.g6pdWarning,
          baseDoseMgPerKg: clinicalData.baseDoseMgPerKg,
          baseDoseIndication: clinicalData.baseDoseIndication
        }
      })
      pregnancyUpdated++
    }
  }

  console.log(`Updated clinical data for ${pregnancyUpdated} drugs`)

  // Import interactions from database
  try {
    const intPath = resolvePath('../public/data/drug-interactions.json')
    if (existsSync(intPath)) {
      const content = readFileSync(intPath, 'utf-8')
      const interactions = JSON.parse(content)
      
      let intImported = 0
      
      for (const [drug1Name, drug2Data] of Object.entries(interactions)) {
        const drugs1 = await prisma.drug.findMany({
          where: {
            OR: [
              { genericName: { contains: drug1Name, mode: 'insensitive' } },
              { packageName: { contains: drug1Name, mode: 'insensitive' } }
            ]
          },
          take: 1
        })

        if (drugs1.length === 0) continue

        for (const [drug2Name, detailsAny] of Object.entries(drug2Data as Record<string, any>)) {
          const drugs2 = await prisma.drug.findMany({
            where: {
              OR: [
                { genericName: { contains: drug2Name, mode: 'insensitive' } },
                { packageName: { contains: drug2Name, mode: 'insensitive' } }
              ]
            },
            take: 1
          })

          if (drugs2.length > 0) {
            await prisma.drugInteraction.create({
              data: {
                drugId: drugs1[0].id,
                secondaryDrugId: drugs2[0].id,
                secondaryDrugName: drug2Name,
                severity: detailsAny?.severity || 'moderate',
                description: detailsAny?.description || '',
                evidence: 'Imported from clinical database'
              }
            })
            intImported++
          }
        }
      }
      
      console.log(`Imported ${intImported} drug interactions`)
    }
  } catch (e) {
    console.log('Could not import interactions:', e)
  }
}

async function main() {
  console.log('=== DRUG DATABASE IMPORT SCRIPT ===\n')
  
  try {
    // Check current status
    const currentStatus = await checkCurrentData()
    
    // Load available data files
    await loadDataFiles()
    
    // Import clinical data
    await importClinicalData()
    
    // Final check
    console.log('\n=== FINAL STATUS ===\n')
    await checkCurrentData()
    
    console.log('\nImport complete!')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()