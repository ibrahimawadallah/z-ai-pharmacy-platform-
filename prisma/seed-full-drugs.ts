import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

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

async function main() {
  console.log('🚀 Starting full drug database import...')
  
  try {
    // Clear existing data in correct order (respecting foreign keys)
    console.log('🗑️  Clearing existing data...')
    await prisma.iCD10Mapping.deleteMany()
    await prisma.drugSideEffect.deleteMany()
    await prisma.drugInteraction.deleteMany()
    await prisma.drug.deleteMany()
    
    console.log('✅ Cleared existing data')
    
    // Read and parse the CSV file
    const csvPath = path.join(process.cwd(), 'upload', 'UAE drug list.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.split('\n').filter(line => line.trim())
    
    if (lines.length === 0) {
      console.log('❌ CSV file is empty')
      return
    }
    
    const headers = parseCSVLine(lines[0])
    console.log(`📊 Found ${lines.length - 1} drugs to import`)
    
    const drugs: any[] = []
    
    // Process each drug
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      if (values.length < headers.length) continue
      
      const drugCode = values[0]?.trim()
      const packageName = values[2]?.trim()
      const genericName = values[4]?.trim()
      const strength = values[5]?.trim()
      const dosageForm = values[6]?.trim()
      const packageSize = values[7]?.trim()
      const dispenseMode = values[8]?.trim()
      const packagePricePublic = values[9] ? parseFloat(values[9]) : null
      const packagePricePharmacy = values[10] ? parseFloat(values[10]) : null
      const unitPricePublic = values[11] ? parseFloat(values[11]) : null
      const unitPricePharmacy = values[12] ? parseFloat(values[12]) : null
      const status = values[13]?.trim() || 'Active'
      const agentName = values[17]?.trim()
      const manufacturerName = values[18]?.trim()
      const uppEffectiveDate = values[26]?.trim()
      const uppUpdatedDate = values[27]?.trim()
      const uppExpiryDate = values[28]?.trim()
      
      // Parse dates safely
      const parseDate = (dateStr: string) => {
        if (!dateStr || dateStr.trim() === '') return null
        try {
          const date = new Date(dateStr)
          return isNaN(date.getTime()) ? null : date
        } catch {
          return null
        }
      }
      
      if (!drugCode || !packageName || !genericName) {
        console.log(`⚠️  Skipping row ${i}: missing required fields`)
        continue
      }
      
      // Skip if dosageForm is empty or null since it's required
      if (!dosageForm || dosageForm.trim() === '') {
        console.log(`⚠️  Skipping row ${i}: missing dosage form`)
        continue
      }
      
      drugs.push({
        drugCode,
        packageName,
        genericName,
        strength: strength || null,
        dosageForm: dosageForm || null,
        packageSize: packageSize || null,
        dispenseMode: dispenseMode || null,
        packagePricePublic,
        packagePricePharmacy,
        unitPricePublic,
        unitPricePharmacy,
        status,
        agentName: agentName || null,
        manufacturerName: manufacturerName || null,
        uppEffectiveDate: parseDate(uppEffectiveDate),
        uppUpdatedDate: parseDate(uppUpdatedDate),
        uppExpiryDate: parseDate(uppExpiryDate),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      if (drugs.length % 1000 === 0) {
        console.log(`📝 Processed ${drugs.length} drugs...`)
      }
    }
    
    console.log(`💾 Inserting ${drugs.length} drugs into database...`)
    
    // Insert in batches of 1000 to avoid memory issues
    const batchSize = 1000
    for (let i = 0; i < drugs.length; i += batchSize) {
      const batch = drugs.slice(i, i + batchSize)
      await prisma.drug.createMany({
        data: batch,
        skipDuplicates: true
      })
      console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(drugs.length/batchSize)}`)
    }
    
    console.log(`🎉 Successfully imported ${drugs.length} drugs!`)
    
    // Get final count
    const totalDrugs = await prisma.drug.count()
    console.log(`📊 Total drugs in database: ${totalDrugs}`)
    
  } catch (error) {
    console.error('❌ Error importing drugs:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
