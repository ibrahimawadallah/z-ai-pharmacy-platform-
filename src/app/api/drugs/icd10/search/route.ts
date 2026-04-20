import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const icd10Code = searchParams.get('code') || ''
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Build conditions using prisma
    const where: any = {}
    if (icd10Code) {
      where.icd10Code = { contains: icd10Code.toUpperCase(), mode: 'insensitive' }
    }
    if (category) {
      where.category = category
    }

    const totalMappings = await db.iCD10Mapping.count({ where })
    
    const mappings = await db.iCD10Mapping.findMany({
      where,
      orderBy: { icd10Code: 'asc' },
      take: limit,
      skip: skip,
      include: {
        drug: {
          include: {
            interactions: { orderBy: { severity: 'asc' } },
            sideEffects: { orderBy: { frequency: 'desc' } }
          }
        }
      }
    })

    // Group by drug
    const drugMap = new Map<string, { drug: any; icd10Codes: any[] }>()

    for (const mapping of mappings) {
      const drug = mapping.drug
      if (!drug) continue

      if (!drugMap.has(drug.id)) {
        drugMap.set(drug.id, {
          drug: {
            ...drug,
            interactions: drug.interactions,
            sideEffects: drug.sideEffects
          },
          icd10Codes: []
        })
      }
      const entry = drugMap.get(drug.id)!
      if (!entry.icd10Codes.find(c => c.code === mapping.icd10Code)) {
        entry.icd10Codes.push({
          code: mapping.icd10Code,
          description: mapping.description,
          category: mapping.category
        })
      }
    }

    const results = Array.from(drugMap.values())

    // Get categories using prisma
    const categoryCounts = await db.iCD10Mapping.groupBy({
      by: ['category'],
      _count: {
        _all: true
      },
      where: {
        category: { not: null }
      }
    })

    const categories = categoryCounts.map(c => ({
      category: c.category,
      count: c._count._all
    }))

    return NextResponse.json({
      success: true,
      data: results,
      categories,
      pagination: {
        page,
        limit,
        total: totalMappings,
        totalPages: Math.ceil(totalMappings / limit)
      }
    })
  } catch (error) {
    console.error('ICD10 search error:', error)
    return NextResponse.json({ error: 'Failed to search ICD10 codes' }, { status: 500 })
  }
}
