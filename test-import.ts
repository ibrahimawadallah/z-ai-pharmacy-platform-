import { db } from './src/lib/db'
import fs from 'fs'

async function importSideEffects() {
  console.log('Starting side effects import to Neon...')

  const tsvPath = 'upload/sider-side-effects.tsv'
  const content = fs.readFileSync(tsvPath, 'utf-8')
  const lines = content.split('\n').filter(l => l.trim())

  console.log(`Found ${lines.length} lines`)

  // First, let's see the first few lines
  console.log('\n=== DEBUG: First 5 lines ===')
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    console.log(`Line ${i}: [${lines[i]}]`)
    const parts = lines[i].split('\t')
    console.log(`  Parts: ${parts.length}`)
    console.log(`  parts[0]: [${parts[0]}]`)
    console.log(`  parts[1]: [${parts[1]}]`)
    console.log(`  parts[2]: [${parts[2]}]`)
    console.log(`  parts[3]: [${parts[3]}]`)
  }

  // Test with first actual data line (line 1, index 1)
  console.log('\n=== Testing drug search ===')
  const testLine = lines[1]
  const testParts = testLine.split('\t')
  const testDrugCode = testParts[0]?.trim()
  const testDrugName = testParts[1]?.toLowerCase().trim()

  console.log(`Looking for drug: ${testDrugCode} or ${testDrugName}`)

  const drugs = await db.drug.findMany({
    where: {
      OR: [
        { drugCode: testDrugCode },
        { genericName: { contains: testDrugName, mode: 'insensitive' } },
        { packageName: { contains: testDrugName, mode: 'insensitive' } }
      ]
    },
    select: { id: true, drugCode: true, genericName: true },
    take: 3
  })

  console.log(`Found ${drugs.length} matching drugs`)
  drugs.forEach(d => console.log(`  - ${d.drugCode}: ${d.genericName}`))

  console.log('\n=== Import would start here ===')
  console.log(`Total lines to process: ${lines.length - 1}`) // minus header
}

importSideEffects().catch(e => {
  console.error('Error:', e)
  process.exit(1)
})
