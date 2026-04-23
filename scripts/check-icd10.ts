import { db } from '@/lib/db'

async function check() {
  const drugs = await db.drug.findMany({
    where: { icd10Codes: { some: {} } },
    include: { icd10Codes: true },
    take: 15
  })
  
  console.log('Sample ICD-10 Mappings:\n')
  for (const d of drugs) {
    console.log(`${d.genericName} -> ${d.icd10Codes.map(i => i.icd10Code).join(', ')}`)
  }
}

check().then(() => db.$disconnect()).catch(console.error)