import { db } from '@/lib/db'

async function check() {
  const drug = await db.drug.findFirst({
    where: { genericName: { contains: 'Ampicillin' } },
    include: { sideEffects: { take: 10 } }
  })
  
  console.log('Drug:', drug?.genericName)
  console.log('SE count:', drug?.sideEffects?.length || 0)
  console.log('Side Effects:')
  drug?.sideEffects?.forEach(s => {
    console.log('-', s.sideEffect?.substring(0, 60))
  })
}

check().then(() => process.exit(0))