import { db } from '@/lib/db'

async function removeDuplicates() {
  console.log('Removing duplicate ICD-10 mappings...')
  
  const all = await db.iCD10Mapping.findMany({
    select: { id: true, drugId: true, icd10Code: true },
    orderBy: { drugId: 'asc' }
  })
  
  const seen = new Set<string>()
  const toDelete: string[] = []
  
  for (const m of all) {
    const key = `${m.drugId}-${m.icd10Code}`
    if (seen.has(key)) {
      toDelete.push(m.id)
    } else {
      seen.add(key)
    }
  }
  
  console.log(`Found ${toDelete.length} duplicates to delete`)
  
  if (toDelete.length > 0) {
    for (let i = 0; i < toDelete.length; i += 1000) {
      await db.iCD10Mapping.deleteMany({
        where: { id: { in: toDelete.slice(i, i + 1000) }}
      })
    }
  }
  
  const total = await db.iCD10Mapping.count()
  console.log(`Total clean mappings: ${total}`)
}

removeDuplicates().then(() => db.$disconnect()).catch(console.error)