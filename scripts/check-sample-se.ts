import { db } from '@/lib/db'

async function check() {
  const sample = await db.drug.findFirst({
    where: { sideEffects: { some: {} } },
    include: { sideEffects: { take: 3 } }
  })
  
  console.log('Drug:', sample?.genericName)
  console.log('Sample SE:')
  sample?.sideEffects?.forEach(se => {
    console.log('-', se.sideEffect?.substring(0, 60))
  })
}

check().then(() => process.exit(0))