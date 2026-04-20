import { PrismaClient } from '@prisma/client'
import { existsSync } from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function fastEnrich() {
  console.log('Fast enrichment starting...')
  
  const intelligencePath = path.join(process.cwd(), 'upload', 'drug-intelligence.db')
  
  if (!existsSync(intelligencePath)) {
    console.log('Drug intelligence database not found')
    return
  }

  const { default: Database } = await import('better-sqlite3')
  const sqliteDB = new Database(intelligencePath, { readonly: true })

  try {
    const intelligenceDrugs = sqliteDB.prepare(`
      SELECT drug_code, pregnancy_category, breastfeeding_safe, indications, contraindications
      FROM drugs
      WHERE drug_code IS NOT NULL
    `).all() as any[]

    console.log(`Found ${intelligenceDrugs.length} intelligence records`)

    const intelligenceMap = new Map<string, any>()
    for (const drug of intelligenceDrugs) {
      if (drug.drug_code) {
        intelligenceMap.set(drug.drug_code, drug)
      }
    }

    const neonDrugs = await prisma.drug.findMany({
      select: { id: true, drugCode: true }
    })

    console.log(`Processing ${neonDrugs.length} drugs...`)

    let updated = 0
    const batchSize = 500
    const batch: any[] = []

    for (const neonDrug of neonDrugs) {
      const intel = intelligenceMap.get(neonDrug.drugCode)
      if (!intel) continue

      const updateData: any = {}
      
      if (intel.pregnancy_category) {
        updateData.pregnancyCategory = intel.pregnancy_category
      }
      
      if (intel.breastfeeding_safe !== null) {
        updateData.breastfeedingSafety = intel.breastfeeding_safe ? 'Yes' : 'No'
      }
      
      const warningsParts: string[] = []
      if (intel.indications) warningsParts.push(`Indications: ${intel.indications}`)
      if (intel.contraindications) warningsParts.push(`Contraindications: ${intel.contraindications}`)
      if (warningsParts.length > 0) {
        updateData.warnings = warningsParts.join('\n')
      }

      if (Object.keys(updateData).length > 0) {
        batch.push({
          where: { id: neonDrug.id },
          data: updateData
        })
      }

      if (batch.length >= batchSize) {
        const tx = batch.map(item => 
          prisma.drug.update({
            where: item.where,
            data: item.data
          })
        )
        
        await prisma.$transaction(tx)
        updated += batch.length
        console.log(`Updated ${updated}/${neonDrugs.length} drugs...`)
        batch.length = 0
      }
    }

    // Final batch
    if (batch.length > 0) {
      const tx = batch.map(item => 
        prisma.drug.update({
          where: item.where,
          data: item.data
        })
      )
      await prisma.$transaction(tx)
      updated += batch.length
    }

    console.log(`Fast enrichment complete: ${updated} drugs updated`)

  } finally {
    sqliteDB.close()
    await prisma.$disconnect()
  }
}

fastEnrich().catch(console.error)
