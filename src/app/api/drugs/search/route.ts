import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
