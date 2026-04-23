import { db } from '@/lib/db'

async function check() {
  const drugsWithInteractions = await db.drug.count({ where: { interactions: { some: {} } } })
  const drugsWithSideEffects = await db.drug.count({ where: { sideEffects: { some: {} } } })
  
  console.log('=== Clinical Data Quality ===')
  console.log('Drugs with interactions:', drugsWithInteractions)
  console.log('Drugs with side effects:', drugsWithSideEffects)
  console.log('Total drugs:', await db.drug.count())
  
  const sampleSE = await db.drug.findFirst({
    where: { sideEffects: { some: {} } },
    include: { sideEffects: { take: 5 } }
  })
  console.log('\nSample side effects for:', sampleSE?.genericName)
  if (sampleSE?.sideEffects) {
    sampleSE.sideEffects.forEach(se => console.log(' -', se.sideEffect))
  }
}

check().then(() => db.$disconnect()).catch(console.error)