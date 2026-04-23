import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
})

async function main() {
  const [total, unique, pregnancy, g6pd, dosage] = await Promise.all([
    prisma.drug.count({ where: { status: 'Active' } }),
    prisma.drug.groupBy({ by: ['genericName'], where: { status: 'Active', genericName: { not: '' } }, _count: { genericName: true } }),
    prisma.drug.count({ where: { status: 'Active', pregnancyCategory: { not: null } } }),
    prisma.drug.count({ where: { status: 'Active', g6pdSafety: { not: null } } }),
    prisma.drug.count({ where: { status: 'Active', baseDoseMgPerKg: { not: null } } })
  ])

  console.log('=== DRUG DATABASE STATUS ===')
  console.log(`Total Active Drugs: ${total}`)
  console.log(`Unique Generic Names: ${unique.length}`)
  console.log(`With Pregnancy Data: ${pregnancy}`)
  console.log(`With G6PD Data: ${g6pd}`)
  console.log(`With Dosage Data: ${dosage}`)
  console.log(`Missing Clinical Data: ${total - pregnancy - g6pd}`)

  await prisma.$disconnect()
}

main()