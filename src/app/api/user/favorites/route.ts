import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import { authOptions } from '@/lib/auth-options'

const addFavoriteSchema = z.object({
  drugCode: z.string().min(1, 'Drug code is required'),
  drugName: z.string().min(1, 'Drug name is required'),
  notes: z.string().optional()
})

// GET /api/user/favorites
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const total = await db.favorite.count({
      where: { userId: session.user.id }
    })

    const favorites = await db.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip
    })

    return NextResponse.json({ success: true, data: favorites, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    console.error('Get favorites error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get favorites' }, { status: 500 })
  }
}

// POST /api/user/favorites
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = addFavoriteSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: validation.error.flatten() }, { status: 400 })
    }

    const { drugCode, drugName, notes } = validation.data

    // Check if already exists using prisma
    const existing = await db.favorite.findUnique({
      where: {
        userId_drugCode: {
          userId: session.user.id,
          drugCode: drugCode
        }
      }
    })
    
    if (existing) {
      return NextResponse.json({ success: false, error: 'Already in favorites' }, { status: 409 })
    }

    const favorite = await db.favorite.create({
      data: {
        userId: session.user.id,
        drugCode,
        drugName,
        notes: notes || null,
      }
    })

    return NextResponse.json({ success: true, data: favorite }, { status: 201 })
  } catch (error) {
    console.error('Add favorite error:', error)
    return NextResponse.json({ success: false, error: 'Failed to add favorite' }, { status: 500 })
  }
}

// DELETE /api/user/favorites
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const drugCode = searchParams.get('drugCode')

    if (!drugCode) {
      return NextResponse.json({ success: false, error: 'Drug code required' }, { status: 400 })
    }

    await db.favorite.delete({
      where: {
        userId_drugCode: {
          userId: session.user.id,
          drugCode: drugCode
        }
      }
    })

    return NextResponse.json({ success: true, message: 'Removed from favorites' })
  } catch (error) {
    console.error('Delete favorite error:', error)
    return NextResponse.json({ success: false, error: 'Failed to remove favorite' }, { status: 500 })
  }
}
