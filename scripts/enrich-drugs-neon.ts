import { PrismaClient } from '@prisma/client'
import { readFileSync, existsSync } from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// ==================== ENRICH DRUGS WITH INTELLIGENCE DATA ====================
async function enrichDrugsWithIntelligenceData() {
  console.log('\n========================================')
  console.log('ENRICHING DRUGS WITH INTELLIGENCE DATA')
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
    // Get intelligence drug data
    console.log('Fetching intelligence data...')
    const intelligenceDrugs = sqliteDB.prepare(`
      SELECT 
        drug_code,
        pregnancy_category,
        breastfeeding_safe,
        indications,
        contraindications,
        controlled_substance,
        requires_prescription
      FROM drugs
      WHERE drug_code IS NOT NULL
    `).all() as Array<{
      drug_code: string
      pregnancy_category: string | null
      breastfeeding_safe: boolean | null
      indications: string | null
      contraindications: string | null
      controlled_substance: boolean | null
      requires_prescription: boolean | null
    }>

    console.log(`Found ${intelligenceDrugs.length} drugs with intelligence data`)

    // Map drugCode to intelligence data
    const intelligenceMap = new Map<string, any>()
    for (const drug of intelligenceDrugs) {
      if (drug.drug_code) {
        intelligenceMap.set(drug.drug_code, drug)
      }
    }

    // Fetch all Neon drugs
    console.log('Fetching Neon drugs for enrichment...')
    const neonDrugs = await prisma.drug.findMany({
      select: { id: true, drugCode: true }
    })

    console.log(`Found ${neonDrugs.length} drugs to enrich`)

    let updated = 0
    let skipped = 0
    const batchSize = 500
    const batch: Array<{ id: string; data: any }> = []

    for (const neonDrug of neonDrugs) {
      const intelligenceData = intelligenceMap.get(neonDrug.drugCode)
      
      if (!intelligenceData) {
        skipped++
        continue
      }

      const updateData: any = {}
      
      if (intelligenceData.pregnancy_category) {
        updateData.pregnancyCategory = intelligenceData.pregnancy_category
      }
      
      if (intelligenceData.breastfeeding_safe !== null) {
        updateData.breastfeedingSafety = intelligenceData.breastfeeding_safe ? 'Yes' : 'No'
      }
      
      if (intelligenceData.indications) {
        updateData.warnings = `Indications: ${intelligenceData.indications}`
      }
      
      if (intelligenceData.contraindications) {
        updateData.warnings = (updateData.warnings ? updateData.warnings + '\n' : '') + 
          `Contraindications: ${intelligenceData.contraindications}`
      }

      if (Object.keys(updateData).length > 0) {
        batch.push({ id: neonDrug.id, data: updateData })
      } else {
        skipped++
        continue
      }

      if (batch.length >= batchSize) {
        for (const item of batch) {
          await prisma.drug.update({
            where: { id: item.id },
            data: item.data
          })
        }
        updated += batch.length
        console.log(`Enriched ${updated}/${neonDrugs.length} drugs...`)
        batch.length = 0
      }
    }

    // Process remaining
    for (const item of batch) {
      await prisma.drug.update({
        where: { id: item.id },
        data: item.data
      })
    }
    updated += batch.length

    console.log(`Enrichment complete: ${updated} updated, ${skipped} skipped`)
    return updated

  } finally {
    sqliteDB.close()
  }
}

// ==================== MAIN ====================
async function main() {
  console.log('========================================')
  console.log('ENRICHING DATABASE WITH INTELLIGENCE DATA')
  console.log('========================================')
  console.log('Start time:', new Date().toISOString())
  
  try {
    const enrichedCount = await enrichDrugsWithIntelligenceData()
    
    console.log('\n========================================')
    console.log('ENRICHMENT SUMMARY')
    console.log('========================================')
    console.log(`Drugs enriched: ${enrichedCount}`)
    
    // Verify some sample data
    const sampleDrugs = await prisma.drug.findMany({
      where: {
        pregnancyCategory: { not: null }
      },
      select: {
        drugCode: true,
        packageName: true,
        pregnancyCategory: true,
        breastfeedingSafety: true,
        warnings: true
      },
      take: 5
    })
    
    console.log('\nSample enriched drugs:')
    for (const drug of sampleDrugs) {
      console.log(`- ${drug.packageName} (${drug.drugCode})`)
      console.log(`  Pregnancy: ${drug.pregnancyCategory || 'N/A'}`)
      console.log(`  Breastfeeding: ${drug.breastfeedingSafety || 'N/A'}`)
    }
    
    console.log('\nEnd time:', new Date().toISOString())
    console.log('Enrichment completed successfully!')
    
  } catch (error: any) {
    console.error('\nEnrichment failed:', error)
    console.error('Error details:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
