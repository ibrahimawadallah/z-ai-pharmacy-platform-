import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const ADMIN_EMAIL = 'admin@drugeye.com'
const ADMIN_PASSWORD = 'Admin123456!'
const ADMIN_NAME = 'System Administrator'

async function createAdmin() {
  // Use DIRECT_URL from environment
  const directUrl = process.env.DIRECT_URL || process.env.DATABASE_URL
  
  if (!directUrl) {
    console.error('❌ Error: DIRECT_URL or DATABASE_URL not set in .env')
    process.exit(1)
  }

  console.log('🔌 Connecting to database...')
  console.log('URL:', directUrl.replace(/:[^:@]+@/, ':****@')) // Hide password

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: directUrl,
      },
    },
  })

  try {
    // Check if admin already exists
    console.log('🔍 Checking for existing admin...')
    const existingAdmin = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    })

    if (existingAdmin) {
      console.log('✅ Admin user already exists!')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('Email:', ADMIN_EMAIL)
      console.log('Password:', ADMIN_PASSWORD)
      console.log('Role:', existingAdmin.role)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      return
    }

    // Hash password
    console.log('🔐 Hashing password...')
    const saltRounds = 12
    const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, saltRounds)

    // Create admin user
    console.log('👤 Creating admin user...')
    const admin = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        name: ADMIN_NAME,
        role: 'admin',
        isVerified: true,
        licenseNumber: null,
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Email:', ADMIN_EMAIL)
    console.log('Password:', ADMIN_PASSWORD)
    console.log('Role:', admin.role)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('🎉 You can now log in at https://z-ai-pharmacy-platform.vercel.app')
    console.log('   with the credentials above.')

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    console.error('')
    console.error('💡 Troubleshooting:')
    console.error('   1. Make sure DIRECT_URL is set correctly in .env')
    console.error('   2. Ensure the database is accessible from your location')
    console.error('   3. Check that the "User" table exists in the database')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
