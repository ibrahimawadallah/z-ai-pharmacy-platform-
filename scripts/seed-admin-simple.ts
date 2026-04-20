import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import 'dotenv/config'

const prisma = new PrismaClient()

const ADMINS = [
  { email: 'admin@drugeye.com', password: 'Admin123456!', name: 'System Administrator' },
  { email: 'ibrahieemawdallah@gmail.com', password: 'Admin123456!', name: 'Ibrahim Awadallah' },
]

async function seedAdmin() {
  try {
    console.log('🌱 Starting admin seed...')

    for (const admin of ADMINS) {
      const existing = await prisma.user.findUnique({
        where: { email: admin.email }
      })
      
      if (existing) {
        console.log(`✅ Admin ${admin.email} already exists`)
        continue
      }

      const hashedPassword = await bcryptjs.hash(admin.password, 12)
      
      await prisma.user.create({
        data: {
          email: admin.email,
          password: hashedPassword,
          name: admin.name,
          role: 'admin',
          isVerified: true,
          licenseNumber: null
        }
      })
      
      console.log(`✅ Created admin: ${admin.email}`)
    }

    console.log('🎉 Admin seed completed!')
  } catch (error) {
    console.error('❌ Error seeding admin:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedAdmin()
