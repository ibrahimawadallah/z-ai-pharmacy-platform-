import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL })

function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false
  
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim().replace(/^"|"$/g, ''))
      current = ''
    } else {
      current += char
    }
  }
  values.push(current.trim().replace(/^"|"$/g, ''))
  return values
}

const parsePrice = (val: string): number | null => {
  if (!val) return null
  const num = parseFloat(val.replace(/,/g, ''))
  return isNaN(num) ? null : num
}

async function main() {
  console.log('Starting optimized seed...')
  
  // Clear existing
  await prisma.drug.deleteMany({})
  
  const csvPath = '/home/z/my-project/upload/UAE drug list.csv'
  const content = fs.readFileSync(csvPath, 'utf-8')
  const lines = content.split('\n').filter(l => l.trim())
  
  console.log(`Processing ${lines.length - 1} drugs...`)
  
  let inserted = 0
  const batchSize = 50
  
  for (let i = 1; i < lines.length; i += batchSize) {
    const batch = []
    for (let j = i; j < Math.min(i + batchSize, lines.length); j++) {
      const v = parseCSVLine(lines[j])
      batch.push({
        drugCode: v[0] || `DRUG-${j}`,
        packageName: v[2] || 'Unknown',
        genericName: v[4] || 'Unknown',
        strength: v[5] || '',
        dosageForm: v[6] || 'Tablets',
        packageSize: v[7] || '',
        status: v[13] || 'Active',
        dispenseMode: v[8] || null,
        packagePricePublic: parsePrice(v[9]),
        packagePricePharmacy: parsePrice(v[10]),
        unitPricePublic: parsePrice(v[11]),
        unitPricePharmacy: parsePrice(v[12]),
        agentName: v[16] || null,
        manufacturerName: v[17] || null,
        includedInThiqaABM: v[20] || 'No',
        includedInBasic: v[21] || 'No',
        includedInABM1: v[22] || 'No',
        includedInABM7: v[23] || 'No'
      })
    }
    
    try {
      await prisma.drug.createMany({ data: batch, skipDuplicates: true })
      inserted += batch.length
      if (inserted % 500 === 0) console.log(`Inserted ${inserted}...`)
    } catch (e) {
      console.error(`Batch error at ${i}`)
    }
  }
  
  const total = await prisma.drug.count()
  console.log(`Done! Total: ${total}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
