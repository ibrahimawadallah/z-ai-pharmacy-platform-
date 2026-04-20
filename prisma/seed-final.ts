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
  console.log('Starting seed...')
  
  // Clear existing (except keep the test ones)
  await prisma.drug.deleteMany({})
  
  const csvPath = '/home/z/my-project/upload/UAE drug list.csv'
  const content = fs.readFileSync(csvPath, 'utf-8')
  const lines = content.split('\n').filter(l => l.trim())
  
  console.log(`Processing ${lines.length - 1} drugs...`)
  
  let inserted = 0
  let errors = 0
  const seenCodes = new Set<string>()
  
  // Process first 2000 drugs for now
  const limit = Math.min(2000, lines.length - 1)
  
  for (let i = 1; i <= limit; i++) {
    const v = parseCSVLine(lines[i])
    const drugCode = v[0] || `DRUG-${i}`
    
    // Skip duplicate codes
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
      if (inserted % 100 === 0) console.log(`Inserted ${inserted}...`)
    } catch (e) {
      errors++
    }
  }
  
  const total = await prisma.drug.count()
  console.log(`Done! Inserted: ${inserted}, Errors: ${errors}, Total in DB: ${total}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
