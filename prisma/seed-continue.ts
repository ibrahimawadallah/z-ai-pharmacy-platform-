import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false
  for (const char of line) {
    if (char === '"') inQuotes = !inQuotes
    else if (char === ',' && !inQuotes) {
      values.push(current.trim().replace(/^"|"$/g, ''))
      current = ''
    } else current += char
  }
  values.push(current.trim().replace(/^"|"$/g, ''))
  return values
}

const parsePrice = (val: string): number | null => {
  if (!val || val.trim() === '') return null
  const num = parseFloat(val.replace(/,/g, ''))
  return isNaN(num) ? null : num
}

async function main() {
  const csvPath = '/home/z/my-project/upload/UAE drug list.csv'
  const content = fs.readFileSync(csvPath, 'utf-8')
  const lines = content.split('\n').filter(l => l.trim())
  
  const existingCount = await prisma.drug.count()
  console.log(`Current drugs: ${existingCount}`)
  
  // Continue from where we left off
  const startFrom = existingCount + 1
  const limit = Math.min(startFrom + 3000, lines.length)
  
  console.log(`Adding drugs ${startFrom} to ${limit}...`)
  
  let inserted = 0
  const seenCodes = new Set<string>()
  
  // Get existing codes
  const existing = await prisma.drug.findMany({ select: { drugCode: true } })
  existing.forEach(d => seenCodes.add(d.drugCode))
  
  for (let i = startFrom; i <= limit; i++) {
    const v = parseCSVLine(lines[i])
    const drugCode = v[0] || `DRUG-${i}`
    
    if (seenCodes.has(drugCode)) continue
    seenCodes.add(drugCode)
    
    try {
      await prisma.drug.create({
        data: {
          drugCode,
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
        }
      })
      inserted++
      if (inserted % 200 === 0) console.log(`Inserted ${inserted}...`)
    } catch {}
  }
  
  const total = await prisma.drug.count()
  console.log(`Done! Inserted: ${inserted}, Total: ${total}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
