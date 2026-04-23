import { db } from '@/lib/db'

async function main() {
  const seData = [
    { code: 'DB8-7305-02670-02', effects: ['Headache', 'Nausea', 'Dizziness', 'Rash', 'Diarrhea'] },
    { code: 'DB8-0149-02671-01', effects: ['Headache', 'Nausea', 'Diarrhea', 'Abdominal pain'] },
    { code: 'DB8-0196-02671-01', effects: ['Headache', 'Dizziness', 'Dry mouth', 'Rash'] },
  ]
  
  let count = 0
  for (const d of seData) {
    const drug = await db.drug.findFirst({ where: { drugCode: d.code } })
    if (drug) {
      for (const se of d.effects) {
        await db.drugSideEffect.create({
          data: { drugId: drug.id, sideEffect: se, severity: 'common' }
        })
        count++
      }
    }
  }
  console.log('Imported', count, 'side effects')
}

main().then(() => db.$disconnect()).catch(console.error)