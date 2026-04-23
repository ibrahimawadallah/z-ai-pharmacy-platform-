// Manually set environment variables to bypass dotenv issues
process.env.DATABASE_URL = "postgresql://neondb_owner:npg_QNEzlKjg4J3p@ep-shiny-king-adsne10e-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&pool_timeout=10&connection_limit=1"
process.env.DIRECT_URL = "postgresql://neondb_owner:npg_QNEzlKjg4J3p@ep-shiny-king-adsne10e-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function checkData() {
  try {
    const totalDrugs = await db.drug.count()
    const activeDrugs = await db.drug.count({ where: { status: 'Active' } })
    const drugsWithPregnancy = await db.drug.count({ 
      where: { 
        status: 'Active',
        pregnancyCategory: { not: null }
      } 
    })
    const drugsWithG6PD = await db.drug.count({ 
      where: { 
        status: 'Active',
        g6pdSafety: { not: null }
      } 
    })
    
    console.log(`Total drugs: ${totalDrugs}`)
    console.log(`Active drugs: ${activeDrugs}`)
    console.log(`Drugs with pregnancy data: ${drugsWithPregnancy}`)
    console.log(`Drugs with G6PD data: ${drugsWithG6PD}`)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await db.$disconnect()
  }
}

checkData()