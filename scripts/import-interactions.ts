import { db } from '@/lib/db'
import { readFileSync } from 'fs'
import { resolve } from 'path'

async function importDrugInteractions() {
  console.log('Importing drug interactions...\n')
  
  try {
    const filePath = resolve('./public/data/drug-interactions.json')
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))
    
    let imported = 0
    let skipped = 0
    
    for (const [drug1, interactions] of Object.entries(data)) {
      const drugs = await db.drug.findMany({
        where: { 
          OR: [
            { genericName: { contains: drug1, mode: 'insensitive' } },
            { packageName: { contains: drug1, mode: 'insensitive' } }
          ]
        },
        select: { id: true, genericName: true }
      })
      
      if (drugs.length === 0) {
        skipped++
        continue
      }
      
      const drug1Id = drugs[0].id
      
      for (const [drug2, details] of Object.entries(interactions as any)) {
        const drugs2 = await db.drug.findMany({
          where: { 
            OR: [
              { genericName: { contains: drug2, mode: 'insensitive' } },
              { packageName: { contains: drug2, mode: 'insensitive' } }
            ]
          },
          select: { id: true }
        })
        
        if (drugs2.length > 0) {
          const typedDetails = details as { severity: string; description: string; recommendation: string }
          await db.drugInteraction.upsert({
            where: { drugId_several: { drugId: drug1Id, secondaryDrugId: drugs2[0].id } },
            create: {
              drugId: drug1Id,
              secondaryDrugId: drugs2[0].id,
              secondaryDrugName: drug2,
              severity: typedDetails.severity,
              description: typedDetails.description,
              management: typedDetails.recommendation
            },
            update: {
              severity: typedDetails.severity,
              description: typedDetails.description,
              management: typedDetails.recommendation
            }
          })
          imported++
        }
      }
    }
    
    console.log(`Imported ${imported} interactions`)
    console.log(`Skipped ${skipped} drugs not found`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await db.$disconnect()
  }
}

importDrugInteractions()