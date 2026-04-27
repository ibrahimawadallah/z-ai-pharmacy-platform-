import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function minimalSeed() {
  console.log('🚀 Starting minimal seed...')

  try {
    const hashedPassword = await bcrypt.hash('demo123456', 12)

    // Create demo user only
    const user = await prisma.user.create({
      data: {
        email: 'demo@z-ai-pharmacy.com',
        password: hashedPassword,
        name: 'Demo User',
        role: 'user',
        isVerified: true
      }
    })

    console.log('✅ Created demo user:', user.email)
    console.log('📊 Database ready!')
    console.log('🌐 Visit: http://localhost:5173')
    console.log('👤 Login: demo@z-ai-pharmacy.com / demo123456')

  } catch (error) {
    console.error('❌ Seed failed:', (error as Error).message)
  } finally {
    await prisma.$disconnect()
  }
}

minimalSeed()
