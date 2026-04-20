import { db } from './src/lib/db'
import fs from 'fs'

async function checkSiderData() {
  console.log('=== Analyzing SIDER File ===\n')

  const tsvPath = 'upload/sider-side-effects.tsv'
  const content = fs.readFileSync(tsvPath, 'utf-8')
  const lines = content.split('\n').filter(l => l.trim())

  console.log(`Total lines: ${lines.length}`)

  // Parse all unique drug entries
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

  console.log(`Unique SIDER drugs: ${drugSideEffectMap.size}`)

  // Now check how many match UAE drugs
  let matchedCount = 0
  let unmatchedSample: string[] = []
  const drugNames = Array.from(drugSideEffectMap.keys())

  console.log('\nChecking matches against UAE drugs...')

  // Sample 100 drugs to check match rate
  const sampleDrugs = drugNames.slice(0, 500)
  let matchCount = 0

  for (const drugName of sampleDrugs) {
    const found = await db.drug.findFirst({
      where: {
        OR: [
          { genericName: { contains: drugName, mode: 'insensitive' } },
          { packageName: { contains: drugName, mode: 'insensitive' } }
        ]
      },
      select: { id: true }
    })

    if (found) {
      matchCount++
    } else {
      if (unmatchedSample.length < 20) {
        unmatchedSample.push(drugName)
      }
    }
  }

  const matchRate = (matchCount / sampleDrugs.length * 100).toFixed(1)
  console.log(`\nMatch rate (sample of 500): ${matchCount}/${sampleDrugs.length} (${matchRate}%)`)
  console.log('\nSample unmatched SIDER drugs:')
  unmatchedSample.slice(0, 15).forEach(n => console.log('  - ' + n))

  // Estimate total potential matches
  const estimatedMatches = Math.round(drugSideEffectMap.size * (matchCount / sampleDrugs.length))
  console.log(`\nEstimated total matches: ${estimatedMatches}`)

  // Estimate side effects if we had full match
  let totalSideEffects = 0
  let matchedDrugsSideEffects = 0

  for (const [name, effects] of drugSideEffectMap.entries()) {
    totalSideEffects += effects.size
  }

  console.log(`\nTotal side effect records in SIDER: ${totalSideEffects.toLocaleString()}`)
}

checkSiderData().catch(e => {
  console.error('Error:', e)
  process.exit(1)
})
