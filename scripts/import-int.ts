import { db } from '@/lib/db'
import { readFileSync } from 'fs'

async function main() {
  const data = JSON.parse(readFileSync('./public/data/drug-interactions.json', 'utf-8'))
  
  let count = 0
  for (const [drug1, interactions] of Object.entries(data)) {
    for (const [drug2, details] of Object.entries(interactions as any)) {
      const d1 = await db.drug.findFirst({ where: { genericName: { contains: drug1, mode: 'insensitive' } } })
      const d2 = await db.drug.findFirst({ where: { genericName: { contains: drug2, mode: 'insensitive' } } })
      
      if (d1 && d2) {
        const exists = await db.drugInteraction.findFirst({
          where: { drugId: d1.id, secondaryDrugId: d2.id }
        })
        
        if (!exists) {
          await db.drugInteraction.create({
            data: {
              drugId: d1.id,
              secondaryDrugId: d2.id,
              secondaryDrugName: drug2,
              severity: details.severity,
              description: details.description,
              management: details.recommendation
            }
          })
          count++
        }
      }
    }
  }
  console.log('Imported', count, 'interactions')
}

main().then(() => db.$disconnect()).catch(console.error)