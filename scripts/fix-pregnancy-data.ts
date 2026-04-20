import { PrismaClient } from '@prisma/client'
import { existsSync } from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function fixPregnancyData() {
  console.log('Fixing pregnancy category data...')
  
  const intelligencePath = path.join(process.cwd(), 'upload', 'drug-intelligence.db')
  
  if (!existsSync(intelligencePath)) {
    console.log('Intelligence DB not found')
    return 0
  }

  const { default: Database } = await import('better-sqlite3')
  const sqliteDB = new Database(intelligencePath, { readonly: true })

  try {
    // Get drugs with pregnancy data
    const drugsWithPregnancy = sqliteDB.prepare(`
      SELECT drug_code, pregnancy_category, breastfeeding_safe
      FROM drugs
      WHERE drug_code IS NOT NULL 
        AND pregnancy_category IS NOT NULL
    `).all() as any[]

    console.log(`Found ${drugsWithPregnancy.length} drugs with pregnancy data`)

    let updated = 0
    const batchSize = 1000

    for (let i = 0; i < drugsWithPregnancy.length; i += batchSize) {
      const batch = drugsWithPregnancy.slice(i, i + batchSize)
      
      const updates = batch.map(drug => {
        const pregnancyCat = drug.pregnancy_category.replace(/'/g, "''")
        const breastfeeding = drug.breastfeeding_safe ? 'Yes' : 'No'
        return `UPDATE "Drug" SET "pregnancyCategory" = '${pregnancyCat}', "breastfeedingSafety" = '${breastfeeding}' WHERE "drugCode" = '${drug.drug_code.replace(/'/g, "''")}';`
      })

      // Execute in smaller chunks for Neon
      for (const update of updates) {
        await prisma.$executeRawUnsafe(update)
      }
      
      updated += batch.length
      console.log(`Updated ${updated}/${drugsWithPregnancy.length} drugs...`)
    }

    console.log(`Pregnancy data update complete: ${updated} drugs updated`)
    return updated

  } finally {
    sqliteDB.close()
  }
}

async function main() {
  try {
    const count = await fixPregnancyData()
    
    // Verify
    const drugsWithPregnancy = await prisma.drug.count({
      where: { pregnancyCategory: { not: null } }
    })
    
    console.log(`\nDrugs with pregnancy data: ${drugsWithPregnancy}`)
    console.log('Success!')
    
  } catch (error: any) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
