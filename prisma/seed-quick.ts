import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
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

async function main() {
  console.log('Quick seed - importing first 3000 drugs...')
  
  const csvPath = '/home/z/my-project/upload/UAE drug list.csv'
  const content = fs.readFileSync(csvPath, 'utf-8')
  const lines = content.split('\n').filter(line => line.trim())
  
  // Clear existing
  await prisma.drug.deleteMany({})
  
  // Column indices from header
  // Drug Code: 0, Package Name: 2, Generic Name: 4, Strength: 5, 
  // Dosage Form: 6, Package Size: 7, Dispense Mode: 8,
  // Package Price to Public: 9, Package Price to Pharmacy: 10,
  // Unit Price to Public: 11, Unit Price to Pharmacy: 12,
  // Status: 13, Last Change Date: 15, Agent Name: 16, Manufacturer: 17
  // Thiqa: 20, Basic: 21, ABM1: 22, ABM7: 23
  
  const parsePrice = (val: string): number | null => {
    if (!val) return null
    const num = parseFloat(val.replace(/,/g, ''))
    return isNaN(num) ? null : num
  }
  
  const drugs = []
  const limit = Math.min(3000, lines.length - 1)
  
  for (let i = 1; i <= limit; i++) {
    const values = parseCSVLine(lines[i])
    
    drugs.push({
      drugCode: values[0] || `DRUG-${i}`,
      packageName: values[2] || 'Unknown',
      genericName: values[4] || 'Unknown',
      strength: values[5] || '',
      dosageForm: values[6] || 'Tablets',
      packageSize: values[7] || '',
      status: values[13] || 'Active',
      dispenseMode: values[8] || null,
      packagePricePublic: parsePrice(values[9]),
      packagePricePharmacy: parsePrice(values[10]),
      unitPricePublic: parsePrice(values[11]),
      unitPricePharmacy: parsePrice(values[12]),
      agentName: values[16] || null,
      manufacturerName: values[17] || null,
      includedInThiqaABM: values[20] || 'No',
      includedInBasic: values[21] || 'No',
      includedInABM1: values[22] || 'No',
      includedInABM7: values[23] || 'No'
    })
  }
  
  console.log(`Parsed ${drugs.length} drugs, inserting...`)
  
  // Single batch insert
  await prisma.drug.createMany({
    data: drugs,
    skipDuplicates: true
  })
  
  const count = await prisma.drug.count()
  console.log(`Done! Total drugs: ${count}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
