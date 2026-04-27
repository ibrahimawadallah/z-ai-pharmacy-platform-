import 'dotenv/config'
import { db } from '@/lib/db'
import {
  getConfiguredAdminCredentials,
  upsertAdminUser,
} from '@/lib/admin-bootstrap'

async function main() {
  const credentials = getConfiguredAdminCredentials()

  try {
    const admin = await upsertAdminUser(credentials, { resetPassword: true })

    console.log('Admin user is ready')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Email:    ', credentials.email)
    console.log('Password: ', credentials.password)
    console.log('Role:     ', admin.role)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  } catch (error) {
    console.error('Failed to seed admin user:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

main()
