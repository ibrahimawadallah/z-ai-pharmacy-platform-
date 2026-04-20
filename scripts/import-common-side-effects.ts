import { PrismaClient } from '@prisma/client'
import { existsSync, readFileSync } from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Common side effects database from pharmaceutical sources
const COMMON_SIDE_EFFECTS: Record<string, string[]> = {
  'Paracetamol': ['Headache', 'Nausea', 'Rash', 'Allergic reaction'],
  'Ibuprofen': ['Nausea', 'Vomiting', 'Diarrhea', 'Dizziness', 'Headache', 'Rash', 'Dyspepsia', 'Abdominal pain'],
  'Aspirin': ['Nausea', 'Vomiting', 'Dyspepsia', 'Gastric ulcer', 'Bleeding tendency', 'Tinnitus', 'Rash'],
  'Metformin': ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain', 'Loss of appetite', 'Metallic taste'],
  'Amoxicillin': ['Diarrhea', 'Nausea', 'Rash', 'Vomiting', 'Allergic reaction'],
  'Ciprofloxacin': ['Nausea', 'Diarrhea', 'Dizziness', 'Headache', 'Rash'],
  'Omeprazole': ['Headache', 'Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain', 'Flatulence'],
  'Amlodipine': ['Edema', 'Fatigue', 'Dizziness', 'Flushing', 'Headache', 'Palpitations'],
  'Lisinopril': ['Cough', 'Dizziness', 'Headache', 'Fatigue', 'Nausea', 'Hypotension'],
  'Simvastatin': ['Myalgia', 'Headache', 'Nausea', 'Abdominal pain', 'Constipation', 'Elevated liver enzymes'],
  'Levothyroxine': ['Weight loss', 'Tremor', 'Headache', 'Insomnia', 'Palpitations', 'Heat intolerance'],
  'Prednisone': ['Weight gain', 'Mood changes', 'Insomnia', 'Increased appetite', 'Hyperglycemia', 'Osteoporosis'],
  'Tramadol': ['Nausea', 'Dizziness', 'Drowsiness', 'Constipation', 'Headache', 'Vomiting'],
  'Sertraline': ['Nausea', 'Diarrhea', 'Insomnia', 'Dizziness', 'Fatigue', 'Dry mouth', 'Ejaculation failure'],
  'Fluoxetine': ['Nausea', 'Headache', 'Insomnia', 'Fatigue', 'Diarrhea', 'Dry mouth', 'Anxiety'],
  'Warfarin': ['Bleeding', 'Bruising', 'Nausea', 'Vomiting', 'Diarrhea', 'Hair loss'],
  'Furosemide': ['Dehydration', 'Electrolyte imbalance', 'Dizziness', 'Headache', 'Nausea', 'Muscle cramps'],
  'Metoprolol': ['Fatigue', 'Dizziness', 'Bradycardia', 'Cold extremities', 'Nausea', 'Diarrhea'],
  'Losartan': ['Dizziness', 'Upper respiratory infection', 'Nasal congestion', 'Back pain', 'Diarrhea'],
  'Gabapentin': ['Dizziness', 'Fatigue', 'Ataxia', 'Tremor', 'Nausea', 'Vomiting', 'Diplopia'],
}

async function importCommonSideEffects() {
  console.log('Importing common side effects...')
  
  const drugs = await prisma.drug.findMany({
    select: { id: true, genericName: true, packageName: true }
  })

  console.log(`Found ${drugs.length} drugs to check`)

  let imported = 0
  const batchSize = 500
  const batch: any[] = []

  for (const drug of drugs) {
    // Try to match by generic name first, then package name
    const genericMatch = Object.keys(COMMON_SIDE_EFFECTS).find(
      key => drug.genericName.toLowerCase().includes(key.toLowerCase())
    )
    
    const packageMatch = Object.keys(COMMON_SIDE_EFFECTS).find(
      key => drug.packageName.toLowerCase().includes(key.toLowerCase())
    )
    
    const match = genericMatch || packageMatch
    if (!match) continue

    const sideEffects = COMMON_SIDE_EFFECTS[match]
    
    for (const sideEffect of sideEffects) {
      batch.push({
        drugId: drug.id,
        sideEffect: sideEffect,
        frequency: 'Common',
        severity: 'Moderate',
        mechanism: null,
      })
    }

    imported += sideEffects.length

    if (batch.length >= batchSize) {
      await prisma.drugSideEffect.createMany({ data: batch })
      console.log(`Imported ${imported} side effects...`)
      batch.length = 0
    }
  }

  // Final batch
  if (batch.length > 0) {
    await prisma.drugSideEffect.createMany({ data: batch })
    imported += batch.length
  }

  console.log(`Side effects import complete: ${imported} side effects imported`)
  return imported
}

async function main() {
  console.log('========================================')
  console.log('IMPORTING COMMON SIDE EFFECTS')
  console.log('========================================\n')

  try {
    const count = await importCommonSideEffects()
    
    const finalCount = await prisma.drugSideEffect.count()
    console.log(`\nTotal side effects in database: ${finalCount}`)
    console.log('Import completed successfully!')
    
  } catch (error: any) {
    console.error('Import failed:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
