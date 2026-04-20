import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import { authOptions } from '@/lib/auth-options'

const addHistorySchema = z.object({
  query: z.string().min(1, 'Query is required'),
  searchType: z.enum(['drug', 'icd10']),
  resultCount: z.number().int().min(0).optional().default(0)
})

// GET /api/user/history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const searchType = searchParams.get('searchType')
    const skip = (page - 1) * limit

    const where: any = { userId: session.user.id }
    if (searchType && ['drug', 'icd10'].includes(searchType)) {
      where.searchType = searchType
    }

    const total = await db.userSearchHistory.count({ where })

    const history = await db.userSearchHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip
    })

    return NextResponse.json({ success: true, data: history, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    console.error('Get history error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get search history' }, { status: 500 })
  }
}

// POST /api/user/history
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = addHistorySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Validation failed' }, { status: 400 })
    }

    const { query, searchType, resultCount } = validation.data

    const history = await db.userSearchHistory.create({
      data: {
        userId: session.user.id,
        query,
        searchType,
        resultCount: resultCount || 0,
      }
    })

    return NextResponse.json({ success: true, data: history }, { status: 201 })
  } catch (error) {
    console.error('Add history error:', error)
    return NextResponse.json({ success: false, error: 'Failed to add history' }, { status: 500 })
  }
}
