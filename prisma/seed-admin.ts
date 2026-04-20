import { db } from '@/lib/db'
import bcryptjs from 'bcryptjs'

const ADMIN_EMAIL = 'admin@drugeye.com'
const ADMIN_PASSWORD = 'Admin123456!'
const ADMIN_NAME = 'System Administrator'

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await db.user.findUnique({
      where: { email: ADMIN_EMAIL },
    })

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email)
      console.log('Email:', ADMIN_EMAIL)
      console.log('Password:', ADMIN_PASSWORD)
      console.log('Role:', existingAdmin.role)
      return
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, saltRounds)

    // Create admin user
    const admin = await db.user.create({
      data: {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        name: ADMIN_NAME,
        role: 'admin',
        isVerified: true,
        licenseNumber: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Email:', ADMIN_EMAIL)
    console.log('Password:', ADMIN_PASSWORD)
    console.log('Role:', admin.role)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  } catch (error) {
    console.error('❌ Failed to create admin user:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

createAdminUser()
