import { db } from '@/lib/db'
import { readFileSync } from 'fs'

async function main() {
  const lines = readFileSync('./public/data/sider-side-effects.tsv', 'utf-8').split('\n').slice(1)
  
  const effects: Array<{ drugId: string; sideEffect: string; severity: string }> = []
  let found = 0
  
  for (const line of lines.slice(1, 5000)) {
    if (!line.trim()) continue
    const [code, , , sideEffect] = line.split('\t')
    if (!code || !sideEffect) continue
    
    const drug = await db.drug.findFirst({ where: { drugCode: { startsWith: code } } })
    if (drug) {
      effects.push({ drugId: drug.id, sideEffect, severity: 'common' })
      found++
    }
  }
  
  console.log('Found drugs:', found, 'total effects to import:', effects.length)
  
  for (let i = 0; i < effects.length; i += 500) {
    await db.drugSideEffect.createMany({ data: effects.slice(i, i + 500) })
    process.stdout.write('.')
  }
  
  const drugsWith = await db.drug.count({ where: { sideEffects: { some: {} } } })
  console.log('\nDone! Drugs with side effects:', drugsWith)
}

main().then(() => db.$disconnect()).catch(console.error)