import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcryptjs from 'bcryptjs'
import { z } from 'zod'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'New password must contain at least one letter')
    .regex(/[0-9]/, 'New password must contain at least one number'),
})

async function getAuthenticatedUser(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const userId = authHeader.substring(7)
    const user = await db.user.findUnique({ where: { id: userId }, select: { id: true } })
    return user?.id || null
  }

  const userIdHeader = request.headers.get('x-user-id')
  if (userIdHeader) {
    const user = await db.user.findUnique({ where: { id: userIdHeader }, select: { id: true } })
    return user?.id || null
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUser(request)

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()

    const validationResult = changePasswordSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        data: { errors: validationResult.error.flatten().fieldErrors },
      }, { status: 400 })
    }

    const { currentPassword, newPassword } = validationResult.data

    // Get user with password using prisma
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true }
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    // Verify current password
    const isPasswordValid = await bcryptjs.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Current password is incorrect' }, { status: 400 })
    }

    // Check if new password is same as current
    const isSamePassword = await bcryptjs.compare(newPassword, user.password)
    if (isSamePassword) {
      return NextResponse.json({ success: false, message: 'New password must be different from current password' }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 12)

    // Update password using prisma
    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ success: true, message: 'Password changed successfully' }, { status: 200 })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ success: false, message: 'An error occurred while changing password' }, { status: 500 })
  }
}
