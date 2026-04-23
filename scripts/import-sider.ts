import { db } from '@/lib/db'
import { createReadStream } from 'fs'
import { parse } from 'csv-parse/sync'
import { resolve } from 'path'

async function importSideEffects() {
  console.log('Importing SIDER side effects...\n')
  
  try {
    const filePath = resolve('./public/data/sider-side-effects.tsv')
    const file = createReadStream(filePath)
    
    let processed = 0
    let matched = 0
    
    const records = parse(file, {
      columns: true,
      delimiter: '\t',
      from: 2
    })
    
    console.log(`Total records: ${records.length}`)
    
    const drugSideEffects: Array<{ drugId: string; sideEffect: string; severity: string }> = []
    
    for (const row of records) {
      const drugBankId = row.drugbank_id
      const sideEffect = row.side_effect_name
      
      if (!drugBankId || !sideEffect) continue
      
      processed++
      
      const drug = await db.drug.findFirst({
        where: { drugCode: drugBankId }
      })
      
      if (drug) {
        drugSideEffects.push({
          drugId: drug.id,
          sideEffect: sideEffect,
          severity: 'unknown'
        })
        matched++
      }
      
      if (processed % 10000 === 0) {
        console.log(`Processed ${processed}, Matched ${matched}`)
      }
    }
    
    console.log(`\nMatched ${matched} drug-side effect pairs`)
    console.log('Inserting...')
    
    const batchSize = 1000
    for (let i = 0; i < drugSideEffects.length; i += batchSize) {
      const batch = drugSideEffects.slice(i, i + batchSize)
      await db.drugSideEffect.createMany({ data: batch })
      process.stdout.write('.')
    }
    
    console.log('\nDone!')
    
    const drugsWithSE = await db.drug.count({ where: { sideEffects: { some: {} } } })
    console.log(`Drugs now with side effects: ${drugsWithSE}`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await db.$disconnect()
  }
}

importSideEffects()