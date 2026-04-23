import { db } from '@/lib/db'

async function main() {
  const seData = [
    { name: 'Metformin', effects: ['Nausea', 'Diarrhea', 'Abdominal pain', 'Metallic taste'] },
    { name: 'Amlodipine', effects: ['Edema', 'Headache', 'Dizziness', 'Flushing'] },
    { name: 'Lisinopril', effects: ['Cough', 'Dizziness', 'Hyperkalemia'] },
    { name: 'Atorvastatin', effects: ['Myalgia', 'Headache', 'Diarrhea'] },
    { name: 'Omeprazole', effects: ['Headache', 'Diarrhea', 'Constipation'] },
    { name: 'Losartan', effects: ['Dizziness', 'Hypotension', 'Hyperkalemia'] },
    { name: 'Metoprolol', effects: ['Bradycardia', 'Fatigue', 'Dizziness'] },
    { name: 'Gabapentin', effects: ['Dizziness', 'Somnolence', 'Edema'] },
    { name: 'Sertraline', effects: ['Nausea', 'Insomnia', 'Sexual dysfunction'] },
    { name: 'Fluoxetine', effects: ['Nausea', 'Insomnia', 'Anxiety'] },
  ]
  
  let count = 0
  for (const d of seData) {
    const drug = await db.drug.findFirst({ 
      where: { genericName: { contains: d.name, mode: 'insensitive' } } 
    })
    if (drug) {
      for (const se of d.effects) {
        await db.drugSideEffect.create({
          data: { drugId: drug.id, sideEffect: se, severity: 'common' }
        })
        count++
      }
    }
  }
  console.log('Added', count, 'side effects')
}

main().then(() => db.$disconnect()).catch(console.error)