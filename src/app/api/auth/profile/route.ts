import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  licenseNumber: z.string().optional().nullable(),
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

// GET - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUser(request)

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        licenseNumber: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { user },
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json({ success: false, message: 'An error occurred while retrieving profile' }, { status: 500 })
  }
}

// PATCH - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUser(request)

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()

    const validationResult = updateProfileSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        data: { errors: validationResult.error.flatten().fieldErrors },
      }, { status: 400 })
    }

    const { name, licenseNumber } = validationResult.data

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name: name !== undefined ? name : undefined,
        licenseNumber: licenseNumber !== undefined ? licenseNumber : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        licenseNumber: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser },
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ success: false, message: 'An error occurred while updating profile' }, { status: 500 })
  }
}
