import { db } from '@/lib/db'
import { createReadStream } from 'fs'
import { parse } from 'csv-parse/sync'
import { resolve } from 'path'

async function importAll() {
  console.log('Importing SIDER side effects & drug interactions...\n')
  
  try {
    const seRecords = parse(createReadStream(resolve('./public/data/sider-side-effects.tsv') as any, {
      columns: true,
      delimiter: '\t',
      from: 2
    })
    
    console.log('SIDER records:', seRecords.length)
    
    let seCount = 0
    const batch: Array<{ drugId: string; sideEffect: string; severity: string }> = []
    
    for (const row of seRecords) {
      if (!row.drugbank_id || !row.side_effect_name) continue
      
      const drug = await db.drug.findFirst({ where: { drugCode: { startsWith: row.drugbank_id } } })
      if (drug) {
        batch.push({ drugId: drug.id, sideEffect: row.side_effect_name, severity: 'unknown' })
        seCount++
      }
    }
    
    console.log('Matched:', seCount, 'side effect records')
    console.log('Inserting...')
    
    for (let i = 0; i < batch.length; i += 1000) {
      await db.drugSideEffect.createMany({ data: batch.slice(i, i + 1000) })
    }
    
    const drugsWithSE = await db.drug.count({ where: { sideEffects: { some: {} } })
    console.log('Done! Drugs with side effects:', drugsWithSE)
    
  } catch (e) { console.error(e) }
  finally { await db.$disconnect() }
}

importAll()