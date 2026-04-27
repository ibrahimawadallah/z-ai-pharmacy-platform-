import { db } from '@/lib/db'

async function checkDrugCodes() {
  const drugs = await db.drug.findMany({
    select: {
      id: true,
      packageName: true,
      drugCode: true,
      genericName: true
    },
    take: 10
  })
  
  console.log('Sample drug codes from database:')
  drugs.forEach(drug => {
    console.log(`  ${drug.packageName}: ${drug.drugCode} (generic: ${drug.genericName})`)
  })
  
  await db.$disconnect()
}

checkDrugCodes().catch(console.error)