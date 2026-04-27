import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { calculateICD10MappingQuality, getICD10MappingQualityBadge } from '@/lib/data-quality'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const icd10Code = searchParams.get('code') || ''
    const category = searchParams.get('category') || ''
    const source = searchParams.get('source') || ''
    const tier = searchParams.get('tier') || ''
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
    if (source) {
      where.source = source
    }
    if (tier) {
      // Note: tier is calculated, not stored, so we'll filter after fetching
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

    // Group by drug and add data quality
    const drugMap = new Map<string, any>()

    for (const mapping of mappings) {
      const drug = mapping.drug
      if (!drug) continue

      if (!drugMap.has(drug.id)) {
        drugMap.set(drug.id, {
          ...drug,
          interactions: drug.interactions,
          sideEffects: drug.sideEffects,
          icd10Codes: []
        })
      }
      const entry = drugMap.get(drug.id)!
      
      // Calculate data quality for this mapping
      const quality = calculateICD10MappingQuality(mapping)
      const badge = getICD10MappingQualityBadge(quality)
      
      if (!entry.icd10Codes.find((c: any) => c.icd10Code === mapping.icd10Code)) {
        entry.icd10Codes.push({
          icd10Code: mapping.icd10Code,
          description: mapping.description,
          category: mapping.category,
          source: mapping.source,
          confidence: mapping.confidence,
          evidenceLevel: mapping.evidenceLevel,
          isValidated: mapping.isValidated,
          requiresReview: mapping.requiresReview,
          dataQuality: quality,
          badge: badge
        })
      }
    }

    let results = Array.from(drugMap.values())

    // Filter by tier if requested
    if (tier) {
      results = results.filter(drug => 
        drug.icd10Codes.some((code: any) => code.dataQuality.tier === tier)
      )
    }

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

    // Get source statistics
    const sourceCounts = await db.iCD10Mapping.groupBy({
      by: ['source'],
      _count: {
        _all: true
      }
    })

    const sources = sourceCounts.map(c => ({
      source: c.source,
      count: c._count._all
    }))

    return NextResponse.json({
      success: true,
      data: results,
      categories,
      sources,
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
