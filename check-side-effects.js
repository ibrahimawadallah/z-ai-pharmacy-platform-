// Manually set environment variables to bypass dotenv issues
process.env.DATABASE_URL = "postgresql://neondb_owner:npg_QNEzlKjg4J3p@ep-shiny-king-adsne10e-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&pool_timeout=10&connection_limit=1"
process.env.DIRECT_URL = "postgresql://neondb_owner:npg_QNEzlKjg4J3p@ep-shiny-king-adsne10e-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function checkSideEffects() {
  try {
    const count = await db.drugSideEffect.count()
    console.log(`Total side effect entries: ${count}`)
    
    // Get some samples
    const samples = await db.drugSideEffect.findMany({
      take: 5,
      include: {
        drug: {
          select: {
            packageName: true,
            genericName: true
          }
        }
      }
    })
    
    console.log('\nSample side effects:')
    samples.forEach((se, index) => {
      console.log(`${index + 1}. ${se.drug.packageName} (${se.drug.genericName}): ${se.sideEffect}`)
    })
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await db.$disconnect()
  }
}

checkSideEffects()