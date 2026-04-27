import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkRateLimit, getClientIP, getRateLimitHeaders } from '@/lib/rate-limit'
import { calculateDrugDataQuality, getDataQualityBadge, calculateICD10MappingQuality, getICD10MappingQualityBadge } from '@/lib/data-quality'

export async function GET(request: NextRequest) {
  // Apply rate limiting (60 requests/minute for search)
  const clientIP = getClientIP(request)
  const rateLimitResult = await checkRateLimit(clientIP, '/api/drugs/search')
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too Many Requests', message: `Rate limit exceeded. Try again in ${rateLimitResult.retryAfter} seconds.` },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
    )
  }
  
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
          icd10Codes: true,
          interactions: true,
          sideEffects: true
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
          icd10Codes: true,
          interactions: true,
          sideEffects: true
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
          icd10Codes: true,
          interactions: true,
          sideEffects: true
        },
        orderBy: { packageName: 'asc' },
        take: limit,
        skip: skip
      })
    }

    // Add data quality information to each drug and ICD-10 codes
    const drugsWithQuality = drugs.map(drug => ({
      ...drug,
      dataQuality: calculateDrugDataQuality(drug),
      icd10Codes: drug.icd10Codes.map(icd10 => {
        const quality = calculateICD10MappingQuality(icd10)
        const badge = getICD10MappingQualityBadge(quality)
        return {
          ...icd10,
          dataQuality: quality,
          badge: badge
        }
      })
    }))

    // Calculate overall data quality statistics
    const tier1Count = drugsWithQuality.filter(d => d.dataQuality.tier === 'TIER_1').length
    const tier2Count = drugsWithQuality.filter(d => d.dataQuality.tier === 'TIER_2').length
    const tier3Count = drugsWithQuality.filter(d => d.dataQuality.tier === 'TIER_3').length
    const researchReadyCount = drugsWithQuality.filter(d => d.dataQuality.metadata.researchReady).length

    return NextResponse.json({
      success: true,
      source: 'Neon PostgreSQL Database',
      usingFallback: false,
      data: drugsWithQuality,
      pagination: { 
        page, 
        limit, 
        total, 
        totalPages: Math.ceil(total / limit), 
        hasMore: skip + limit < total 
      },
      dataQuality: {
        totalDrugs: total,
        tier1Count,
        tier2Count,
        tier3Count,
        researchReadyCount,
        averageCompleteness: Math.round(drugsWithQuality.reduce((sum, d) => sum + d.dataQuality.completeness, 0) / drugsWithQuality.length),
        sources: {
          UAE_MOH_OFFICIAL: drugsWithQuality.filter(d => d.dataQuality.source === 'UAE_MOH_OFFICIAL').length,
          SMART_DEFAULT: drugsWithQuality.filter(d => d.dataQuality.source === 'SMART_DEFAULT').length,
          OTHER: drugsWithQuality.filter(d => !['UAE_MOH_OFFICIAL', 'SMART_DEFAULT'].includes(d.dataQuality.source)).length
        }
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
