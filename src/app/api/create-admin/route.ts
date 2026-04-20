import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { secret } = await req.json()

    // Simple protection - use the ADMIN_API_KEY from env
    if (secret !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email: 'admin@drugeye.com' }
    })

    if (existing) {
      return NextResponse.json({
        message: 'Admin already exists',
        email: 'admin@drugeye.com',
        role: existing.role
      })
    }

    // Create admin
    const hashedPassword = await bcrypt.hash('Admin123456!', 12)

    const admin = await prisma.user.create({
      data: {
        email: 'admin@drugeye.com',
        password: hashedPassword,
        name: 'System Administrator',
        role: 'admin',
        isVerified: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true
      }
    })

    return NextResponse.json({
      message: 'Admin created successfully!',
      admin,
      credentials: {
        email: 'admin@drugeye.com',
        password: 'Admin123456!'
      }
    })

  } catch (error: any) {
    console.error('Create admin error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
