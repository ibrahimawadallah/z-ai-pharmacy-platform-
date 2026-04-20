import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getExternalDrugData } from '@/lib/external-data-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pregnancyCategory = searchParams.get('category')
    const search = searchParams.get('q') || ''
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)

    const whereClause: any = {
      status: 'Active'
    }

    if (search) {
      whereClause.OR = [
        { packageName: { contains: search, mode: 'insensitive' } },
        { genericName: { contains: search, mode: 'insensitive' } }
      ]
    }

    const drugs = await db.drug.findMany({
      where: whereClause,
      select: {
        id: true,
        packageName: true,
        genericName: true,
        strength: true,
        dosageForm: true,
        pregnancyCategory: true,
        pregnancyPrecautions: true,
        breastfeedingSafety: true,
        baseDoseMgPerKg: true,
        baseDoseIndication: true
      },
      orderBy: { packageName: 'asc' },
      take: limit
    })

    const filteredByCategory = pregnancyCategory 
      ? drugs.filter(d => d.pregnancyCategory === pregnancyCategory)
      : drugs

    const enriched = await Promise.all(
      filteredByCategory.map(async (drug) => {
        if (!drug.pregnancyCategory) {
          const external = await getExternalDrugData(drug.genericName || drug.packageName)
          if (external) {
            return {
              ...drug,
              pregnancyCategory: external.pregnancyCategory,
              pregnancyPrecautions: external.pregnancyPrecautions,
              breastfeedingSafety: external.breastfeedingSafety,
              baseDoseMgPerKg: external.baseDoseMgPerKg,
              baseDoseIndication: external.baseDoseIndication,
              dataSource: external.source
            }
          }
        }
        return { ...drug, dataSource: 'UAE MOH' }
      })
    )

    const categoryCounts = {
      A: enriched.filter(d => d.pregnancyCategory === 'A').length,
      B: enriched.filter(d => d.pregnancyCategory === 'B').length,
      C: enriched.filter(d => d.pregnancyCategory === 'C').length,
      D: enriched.filter(d => d.pregnancyCategory === 'D').length,
      X: enriched.filter(d => d.pregnancyCategory === 'X').length
    }

    return NextResponse.json({
      success: true,
      data: enriched,
      counts: categoryCounts
    })
  } catch (error) {
    console.error('Pregnancy drugs error:', error)
    return NextResponse.json({ error: 'Failed to fetch drugs' }, { status: 500 })
  }
}