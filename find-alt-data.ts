import { db } from './src/lib/db'
import fs from 'fs'

async function findAlternativeData() {
  console.log('=== Exploring Alternative Side Effect Data Sources ===\n')

  // Check if there's side effect data in the comprehensive interactions file
  const interactionsPath = 'upload/comprehensive-drug-interactions.json'
  if (fs.existsSync(interactionsPath)) {
    const data = JSON.parse(fs.readFileSync(interactionsPath, 'utf-8'))
    const drugs = Object.keys(data)
    console.log(`comprehensive-drug-interactions.json:`)
    console.log(`  Primary drugs: ${drugs.length}`)

    // Check first drug for side effect-like data
    if (drugs.length > 0) {
      const firstDrug = data[drugs[0]]
      const keys = Object.keys(firstDrug)
      console.log(`  Keys in first entry: ${keys.join(', ')}`)
    }
  }

  // Check the intelligent-drug-data.ts file
  const intelligentPath = 'upload/intelligent-drug-data.ts'
  if (fs.existsSync(intelligentPath)) {
    const content = fs.readFileSync(intelligentPath, 'utf-8')
    console.log(`\nintelligent-drug-data.ts:`)
    console.log(`  Size: ${(content.length / 1024 / 1024).toFixed(2)} MB`)
    console.log(`  Contains side effect references: ${content.includes('side effect') || content.includes('adverse')}`)
  }

  // Check if we can extract side effects from warnings field in Neon
  console.log(`\n=== Checking Neon Drug Warnings (as alternative) ===`)
  const drugsWithWarnings = await db.drug.findMany({
    where: {
      warnings: { not: null }
    },
    select: {
      id: true,
      packageName: true,
      warnings: true
    },
    take: 5
  })

  console.log(`Found ${drugsWithWarnings.length} drugs with warnings in Neon`)

  // Count total drugs with any safety info
  const withPregnancy = await db.drug.count({
    where: { pregnancyCategory: { not: null } }
  })
  const withBreastfeeding = await db.drug.count({
    where: { breastfeedingSafety: { not: null } }
  })
  const withRenal = await db.drug.count({
    where: { renalAdjustment: { not: null } }
  })
  const withWarnings = await db.drug.count({
    where: { warnings: { not: null } }
  })

  console.log(`\n=== Neon Safety Data Coverage ===`)
  console.log(`  Pregnancy Category: ${withPregnancy} drugs`)
  console.log(`  Breastfeeding Safety: ${withBreastfeeding} drugs`)
  console.log(`  Renal Adjustment: ${withRenal} drugs`)
  console.log(`  Warnings: ${withWarnings} drugs`)
}

findAlternativeData().catch(console.error)
