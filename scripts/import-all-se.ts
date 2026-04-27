import { db } from '@/lib/db'
import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'
import { resolve } from 'path'

async function importAll() {
  console.log('Importing SIDER side effects & drug interactions...\n')

  try {
    const seFilePath = resolve('./public/data/sider-side-effects.tsv')
    const seFile = readFileSync(seFilePath, 'utf-8')
    const seRecords = parse(seFile, {
      columns: true,
      delimiter: '\t',
      bom: true,
      skip_empty_lines: true,
      trim: true,
    }) as Array<{ drugbank_id?: string; side_effect_name?: string }>

    if (seRecords.length > 0 && (!('drugbank_id' in seRecords[0]) || !('side_effect_name' in seRecords[0]))) {
      throw new Error('Unexpected SIDER TSV headers: expected drugbank_id and side_effect_name columns')
    }

    console.log('SIDER records:', seRecords.length)

    let seCount = 0
    const batch: Array<{ drugId: string; sideEffect: string; severity: string }> = []

    for (const row of seRecords) {
      if (!row.drugbank_id || !row.side_effect_name) continue

      const drug = await db.drug.findFirst({
        where: { drugCode: { startsWith: row.drugbank_id } },
      })

      if (drug) {
        batch.push({
          drugId: drug.id,
          sideEffect: row.side_effect_name,
          severity: 'unknown',
        })
        seCount++
      }
    }

    console.log('Matched:', seCount, 'side effect records')
    console.log('Inserting...')

    for (let i = 0; i < batch.length; i += 1000) {
      await db.drugSideEffect.createMany({ data: batch.slice(i, i + 1000) })
    }

    const drugsWithSE = await db.drug.count({ where: { sideEffects: { some: {} } } })
    console.log('Done! Drugs with side effects:', drugsWithSE)
  } catch (error) {
    console.error(error)
  } finally {
    await db.$disconnect()
  }
}

importAll()
