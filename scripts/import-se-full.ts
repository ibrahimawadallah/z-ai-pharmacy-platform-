import { db } from '@/lib/db'
import { readFileSync } from 'fs'

async function main() {
  const lines = readFileSync('./public/data/sider-side-effects.tsv', 'utf-8').split('\n').slice(1)

  let seCount = 0
  const batch: Array<{ drugId: string; sideEffect: string; severity: string }> = []
  const matchedDrugIds = new Set<string>()

  for (const line of lines) {
    if (!line.trim()) continue

    const [drugBank, drugName, , sideEffect] = line.split('\t')
    if (!drugBank || !drugName || !sideEffect) continue

    const drugNameMatch = drugName.split(' ')[0]
    const drug = await db.drug.findFirst({
      where: { packageName: { contains: drugNameMatch, mode: 'insensitive' } },
    })

    if (drug) {
      batch.push({ drugId: drug.id, sideEffect, severity: 'common' })
      seCount++
      matchedDrugIds.add(drug.id)
    }
  }

  console.log('Drugs found:', seCount, 'unique:', matchedDrugIds.size)

  for (let i = 0; i < batch.length; i += 1000) {
    await db.drugSideEffect.createMany({ data: batch.slice(i, i + 1000) })
  }

  const total = await db.drug.count({ where: { sideEffects: { some: {} } } })
  console.log('Total drugs with SE:', total)
}

main()
  .then(() => db.$disconnect())
  .catch(async (error) => {
    console.error(error)
    await db.$disconnect()
    process.exit(1)
  })
