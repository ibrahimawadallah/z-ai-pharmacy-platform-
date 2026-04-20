import { db } from './src/lib/db'
import fs from 'fs'

async function importSideEffects() {
  console.log('Starting side effects import to Neon...\n')

  const tsvPath = 'upload/sider-side-effects.tsv'
  const content = fs.readFileSync(tsvPath, 'utf-8')
  const lines = content.split('\n').filter(l => l.trim())

  console.log(`Found ${lines.length} lines\n`)

  let totalInserted = 0
  let skipped = 0
  let i = 0

  for (const line of lines) {
    i++
    if (i === 1) continue // Skip header

    if (i % 10000 === 0) {
      console.log(`Progress: ${i}/${lines.length} - Inserted: ${totalInserted}, Skipped: ${skipped}`)
    }

    // Split by TAB
    const parts = line.split('\t')
    if (parts.length < 4) {
      skipped++
      continue
    }

    const drugbankId = parts[0]?.trim()
    const drugbankName = parts[1]?.toLowerCase().trim()
    const umlsCui = parts[2]?.trim()
    const sideEffect = parts[3]?.trim()

    if (!drugbankId || !drugbankName || !sideEffect) {
      skipped++
      continue
    }

    // Skip if not a valid drugbank ID
    if (!drugbankId.startsWith('DB')) {
      skipped++
      continue
    }

    try {
      // Find drug in Neon by drugbank_id or name
      const drugs = await db.drug.findMany({
        where: {
          OR: [
            { drugCode: drugbankId },
            { genericName: { contains: drugbankName, mode: 'insensitive' } },
            { packageName: { contains: drugbankName, mode: 'insensitive' } }
          ]
        },
        select: { id: true },
        take: 1
      })

      if (drugs.length === 0) {
        skipped++
        continue
      }

      const drug = drugs[0]
      await db.drugSideEffect.create({
        data: {
          drugId: drug.id,
          sideEffect: sideEffect,
        }
      })
      totalInserted++
    } catch (e) {
      skipped++
    }
  }

  console.log(`\n=== IMPORT COMPLETE ===`)
  console.log(`Total side effects inserted: ${totalInserted}`)
  console.log(`Skipped (no match or duplicate): ${skipped}`)

  const count = await db.drugSideEffect.count()
  console.log(`Verified count in database: ${count}`)
}

importSideEffects().catch(console.error)
