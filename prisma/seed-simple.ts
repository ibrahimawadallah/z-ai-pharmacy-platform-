import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed process...')
  
  const csvPath = '/home/z/my-project/upload/UAE drug list.csv'
  
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found')
    process.exit(1)
  }
  
  const content = fs.readFileSync(csvPath, 'utf-8')
  const lines = content.split('\n').filter(line => line.trim())
  
  console.log(`Found ${lines.length} lines in CSV`)
  
  // Get headers
  const headerLine = lines[0]
  const headers = parseCSVLine(headerLine)
  console.log('Headers:', headers.slice(0, 10).join(', '), '...')
  
  // Find column indices
  const findIndex = (names: string[]): number => {
    for (const name of names) {
      const idx = headers.findIndex(h => 
        h.toLowerCase().replace(/[^a-z0-9]/g, '').includes(name.toLowerCase().replace(/[^a-z0-9]/g, ''))
      )
      if (idx >= 0) return idx
    }
    return -1
  }
  
  const colMap = {
    drugCode: findIndex(['Drug Code', 'drugcode']),
    packageName: findIndex(['Package Name', 'packagename']),
    genericName: findIndex(['Generic Name', 'genericname']),
    strength: findIndex(['Strength']),
    dosageForm: findIndex(['Dosage Form', 'dosageform']),
    packageSize: findIndex(['Package Size', 'packagesize']),
    status: findIndex(['Status']),
    dispenseMode: findIndex(['Dispense Mode', 'dispense']),
    packagePricePublic: findIndex(['Package Price to Public']),
    packagePricePharmacy: findIndex(['Package Price to Pharmacy']),
    unitPricePublic: findIndex(['Unit Price to Public']),
    unitPricePharmacy: findIndex(['Unit Price to Pharmacy']),
    agentName: findIndex(['Agent Name', 'agentname']),
    manufacturerName: findIndex(['Manufacturer Name', 'manufacturername']),
    includedInThiqaABM: findIndex(['Included in Thiqa', 'thiya']),
    includedInBasic: findIndex(['Included In Basic', 'basic']),
    includedInABM1: findIndex(['Included In ABM 1', 'abm1']),
    includedInABM7: findIndex(['Included In ABM 7', 'abm7']),
    lastChangeDate: findIndex(['Last Change Date', 'lastchange'])
  }
  
  console.log('Column mapping:', colMap)
  
  const getValue = (values: string[], key: keyof typeof colMap): string => {
    const idx = colMap[key]
    if (idx < 0 || idx >= values.length) return ''
    return values[idx]?.trim() || ''
  }
  
  const parsePrice = (val: string): number | null => {
    if (!val) return null
    const num = parseFloat(val.replace(/,/g, ''))
    return isNaN(num) ? null : num
  }
  
  const parseDate = (val: string): Date | null => {
    if (!val) return null
    try {
      const dateStr = val.split(' ')[0]
      const [month, day, year] = dateStr.split('/')
      if (month && day && year) {
        return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)
      }
    } catch {}
    return null
  }
  
  // Clear existing drugs
  console.log('Clearing existing drugs...')
  await prisma.drug.deleteMany({})
  
  // Process drugs
  const drugs: Array<{
    drugCode: string
    packageName: string
    genericName: string
    strength: string
    dosageForm: string
    packageSize: string
    status: string
    dispenseMode: string | null
    packagePricePublic: number | null
    packagePricePharmacy: number | null
    unitPricePublic: number | null
    unitPricePharmacy: number | null
    agentName: string | null
    manufacturerName: string | null
    includedInThiqaABM: string | null
    includedInBasic: string | null
    includedInABM1: string | null
    includedInABM7: string | null
    lastChangeDate: Date | null
  }> = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    
    const values = parseCSVLine(line)
    
    const drug = {
      drugCode: getValue(values, 'drugCode') || `DRUG-${i}`,
      packageName: getValue(values, 'packageName') || 'Unknown',
      genericName: getValue(values, 'genericName') || 'Unknown',
      strength: getValue(values, 'strength') || '',
      dosageForm: getValue(values, 'dosageForm') || 'Tablets',
      packageSize: getValue(values, 'packageSize') || '',
      status: getValue(values, 'status') || 'Active',
      dispenseMode: getValue(values, 'dispenseMode') || null,
      packagePricePublic: parsePrice(getValue(values, 'packagePricePublic')),
      packagePricePharmacy: parsePrice(getValue(values, 'packagePricePharmacy')),
      unitPricePublic: parsePrice(getValue(values, 'unitPricePublic')),
      unitPricePharmacy: parsePrice(getValue(values, 'unitPricePharmacy')),
      agentName: getValue(values, 'agentName') || null,
      manufacturerName: getValue(values, 'manufacturerName') || null,
      includedInThiqaABM: getValue(values, 'includedInThiqaABM') || 'No',
      includedInBasic: getValue(values, 'includedInBasic') || 'No',
      includedInABM1: getValue(values, 'includedInABM1') || 'No',
      includedInABM7: getValue(values, 'includedInABM7') || 'No',
      lastChangeDate: parseDate(getValue(values, 'lastChangeDate'))
    }
    
    drugs.push(drug)
    
    if (drugs.length % 500 === 0) {
      console.log(`Parsed ${drugs.length} drugs...`)
    }
  }
  
  console.log(`Total drugs parsed: ${drugs.length}`)
  
  // Insert in batches
  const batchSize = 100
  let inserted = 0
  
  for (let i = 0; i < drugs.length; i += batchSize) {
    const batch = drugs.slice(i, i + batchSize)
    try {
      await prisma.drug.createMany({
        data: batch
      })
      inserted += batch.length
      if (inserted % 1000 === 0) {
        console.log(`Inserted ${inserted}/${drugs.length} drugs...`)
      }
    } catch (error) {
      console.error(`Error at batch ${i}:`, error)
    }
  }
  
  console.log(`Successfully imported ${inserted} drugs!`)
  
  // Show stats
  const total = await prisma.drug.count()
  const active = await prisma.drug.count({ where: { status: 'Active' } })
  console.log(`\nFinal stats: ${total} total, ${active} active`)
}

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

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
