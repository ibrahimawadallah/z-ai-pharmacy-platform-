import { db } from './src/lib/db'
import fs from 'fs'

async function importSideEffectsBatch() {
  console.log('=== Starting SIDER Side Effects Import (Batch Mode) ===\n')

  const tsvPath = 'upload/sider-side-effects.tsv'
  const content = fs.readFileSync(tsvPath, 'utf-8')
  const lines = content.split('\n').filter(l => l.trim())

  console.log(`Total lines: ${lines.length}`)

  // Parse all unique drug entries first
  const drugSideEffectMap = new Map<string, Set<string>>()

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split('\t')
    if (parts.length < 4) continue

    const drugbankId = parts[0]?.trim()
    const drugbankName = parts[1]?.trim()
    const sideEffect = parts[3]?.trim()

    if (!drugbankId?.startsWith('DB') || !drugbankName || !sideEffect) continue

    const key = drugbankName.toLowerCase()
    if (!drugSideEffectMap.has(key)) {
      drugSideEffectMap.set(key, new Set())
    }
    drugSideEffectMap.get(key)!.add(sideEffect)
  }

  console.log(`Unique drugs with side effects: ${drugSideEffectMap.size}`)

  // Now match and insert
  let totalInserted = 0
  let totalDrugsMatched = 0
  const drugNames = Array.from(drugSideEffectMap.keys())

  console.log('\nMatching and inserting...')

  // Process in batches for efficiency
  const batchSize = 10
  for (let i = 0; i < drugNames.length; i += batchSize) {
    const batch = drugNames.slice(i, i + batchSize)
    const progress = Math.min(i + batchSize, drugNames.length)

    if (i % 100 === 0) {
      console.log(`Progress: ${progress}/${drugNames.length} drugs - Inserted: ${totalInserted}`)
    }

    for (const drugName of batch) {
      const sideEffects = drugSideEffectMap.get(drugName)!

      // Find matching drug in Neon using contains matching
      const drugs = await db.drug.findMany({
        where: {
          OR: [
            { genericName: { contains: drugName, mode: 'insensitive' } },
            { packageName: { contains: drugName, mode: 'insensitive' } }
          ]
        },
        select: { id: true },
        take: 1
      })

      if (drugs.length === 0) continue
      totalDrugsMatched++

      const drugId = drugs[0].id

      // Insert all side effects for this drug
      for (const sideEffect of sideEffects) {
        try {
          await db.drugSideEffect.create({
            data: {
              drugId,
              sideEffect,
            }
          })
          totalInserted++
        } catch (e) {
          // Skip duplicates
        }
      }
    }
  }

  console.log(`\n=== IMPORT COMPLETE ===`)
  console.log(`Drugs matched: ${totalDrugsMatched}`)
  console.log(`Total side effects inserted: ${totalInserted}`)

  const count = await db.drugSideEffect.count()
  console.log(`Verified in database: ${count}`)
}

importSideEffectsBatch().catch(e => {
  console.error('Error:', e)
  process.exit(1)
})
