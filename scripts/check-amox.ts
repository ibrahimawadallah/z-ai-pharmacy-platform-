import { db } from '@/lib/db'

async function checkAmox() {
  const drug = await db.drug.findFirst({
    where: { genericName: { contains: 'Amox' } },
    include: { sideEffects: { take: 10 } }
  })
  
  if (drug) {
    console.log('Drug:', drug.genericName)
    console.log('Side effects:', drug.sideEffects?.length || 0)
    drug.sideEffects?.forEach(se => {
      console.log(' -', se.sideEffect)
    })
  } else {
    console.log('No Amox drug found')
  }
}

checkAmox().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })