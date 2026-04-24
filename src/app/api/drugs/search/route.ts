import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthSession } from '@/lib/auth'
import { createAuditLog } from '@/lib/security'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const status = searchParams.get('status') || 'Active'
  const dosageForm = searchParams.get('form') || ''
  const skip = (page - 1) * limit

  try {
    // Use Neon PostgreSQL via Prisma
    let drugs: any[] = []
    let total = 0
    
    if (query && dosageForm) {
      const countResult = await db.drug.count({
        where: {
          status: status,
          OR: [
            { packageName: { contains: query, mode: 'insensitive' } },
            { genericName: { contains: query, mode: 'insensitive' } }
          ],
          dosageForm: dosageForm
        }
      })
      total = countResult
      
      drugs = await db.drug.findMany({
        where: {
          status: status,
          OR: [
            { packageName: { contains: query, mode: 'insensitive' } },
            { genericName: { contains: query, mode: 'insensitive' } }
          ],
          dosageForm: dosageForm
        },
        include: {
          icd10Codes: true
        },
        orderBy: { packageName: 'asc' },
        take: limit,
        skip: skip
      })
    } else if (query) {
      const countResult = await db.drug.count({
        where: {
          status: status,
          OR: [
            { packageName: { contains: query, mode: 'insensitive' } },
            { genericName: { contains: query, mode: 'insensitive' } }
          ]
        }
      })
      total = countResult
      
      drugs = await db.drug.findMany({
        where: {
          status: status,
          OR: [
            { packageName: { contains: query, mode: 'insensitive' } },
            { genericName: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          icd10Codes: true
        },
        orderBy: { packageName: 'asc' },
        take: limit,
        skip: skip
      })
    } else {
      const countResult = await db.drug.count({
        where: { status: status }
      })
      total = countResult
      
      drugs = await db.drug.findMany({
        where: { status: status },
        include: {
          icd10Codes: true
        },
        orderBy: { packageName: 'asc' },
        take: limit,
        skip: skip
      })
    }

    // Fire-and-forget audit log for authenticated searches only. We skip anonymous
    // traffic to avoid flooding the log with health-checks / scrapers.
    if (query) {
      try {
        const session = await getAuthSession()
        if (session?.user?.id) {
          void createAuditLog(
            session.user.id,
            'drug_search',
            query.slice(0, 100),
            { query, page, limit, resultCount: drugs.length, total },
            request
          )
        }
      } catch (err) {
        console.error('drug_search audit log failed:', err)
      }
    }

    return NextResponse.json({
      success: true,
      source: 'Neon PostgreSQL Database',
      usingFallback: false,
      data: drugs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total
      }
    })

  } catch (error) {
    console.error('Drug search error:', error)
    return NextResponse.json({ 
      error: 'Failed to search drugs', 
      details: String(error) 
    }, { status: 500 })
  }
}
