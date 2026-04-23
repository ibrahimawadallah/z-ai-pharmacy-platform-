// Test database connection
const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing database connection...')
    const count = await db.drug.count()
    console.log(`Database connection successful. Total drugs: ${count}`)
    
    // Test a simple query
    const sampleDrug = await db.drug.findFirst({
      select: {
        id: true,
        packageName: true,
        genericName: true,
        pregnancyCategory: true
      }
    })
    
    console.log('Sample drug:', sampleDrug)
  } catch (error) {
    console.error('Database connection failed:', error)
  } finally {
    await db.$disconnect()
  }
}

testConnection()