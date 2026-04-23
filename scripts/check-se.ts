import { db } from '@/lib/db'

async function check() {
  const se = await db.drugSideEffect.findFirst()
  console.log('Sample side effect:', se?.sideEffect)
  console.log('Drug ID:', se?.drugId)
  
  if (se?.drugId) {
    const drug = await db.drug.findUnique({ where: { id: se.drugId }, select: { genericName: true, drugCode: true } })
    console.log('Drug:', drug?.genericName, 'Code:', drug?.drugCode)
  }
}

check().then(() => db.$disconnect()).catch(console.error)