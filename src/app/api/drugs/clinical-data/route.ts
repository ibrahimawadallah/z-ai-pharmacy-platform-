import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const search = searchParams.get('q') || ''
    const hasClinicalData = searchParams.get('hasClinicalData')

    const whereClause: any = {
      status: 'Active'
    }

    if (search) {
      whereClause.OR = [
        { packageName: { contains: search, mode: 'insensitive' } },
        { genericName: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (hasClinicalData === 'true') {
      whereClause.pregnancyCategory = { not: null }
    } else if (hasClinicalData === 'false') {
      whereClause.pregnancyCategory = null
    }

    const drugs = await db.drug.findMany({
      where: whereClause,
      select: {
        id: true,
        drugCode: true,
        packageName: true,
        genericName: true,
        strength: true,
        dosageForm: true,
        manufacturerName: true,
        pregnancyCategory: true,
        pregnancyPrecautions: true,
        breastfeedingSafety: true,
        g6pdSafety: true,
        g6pdWarning: true,
        baseDoseMgPerKg: true,
        baseDoseIndication: true,
        warnings: true,
        renalAdjustment: true,
        hepaticAdjustment: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { packageName: 'asc' },
      take: limit
    })

    const totalCount = await db.drug.count({ where: { status: 'Active' } })
    const withPregnancyCount = await db.drug.count({ 
      where: { status: 'Active', pregnancyCategory: { not: null } } 
    })
    const withG6PDCount = await db.drug.count({ 
      where: { status: 'Active', g6pdSafety: { not: null } } 
    })

    return NextResponse.json({
      success: true,
      data: drugs,
      statistics: {
        total: totalCount,
        active: totalCount,
        withPregnancyData: withPregnancyCount,
        withG6PDData: withG6PDCount,
        missingData: totalCount - withPregnancyCount,
        pregnancyCoverage: Math.round((withPregnancyCount / totalCount) * 100),
        g6pdCoverage: Math.round((withG6PDCount / totalCount) * 100),
      }
    })
  } catch (error) {
    console.error('Clinical data API error:', error)
    return NextResponse.json({ error: 'Failed to fetch clinical data' }, { status: 500 })
  }
}