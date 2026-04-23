import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/drugs/stats - Get UAE drug database statistics
export async function GET() {
  try {
    // Get total counts by status
    const statusCounts = await db.drug.groupBy({
      by: ['status'],
      _count: true
    })

    // Get dosage forms
    const dosageForms = await db.drug.groupBy({
      by: ['dosageForm'],
      where: { status: 'Active' },
      _count: true,
      orderBy: { _count: { dosageForm: 'desc' } },
      take: 15
    })

    // Total active drugs
    const totalActive = await db.drug.count({
      where: { status: 'Active' }
    })

    // Get drugs with pricing
    const drugsWithPricing = await db.drug.count({
      where: {
        status: 'Active',
        packagePricePublic: { not: null }
      }
    })

    // Get drugs in formulary
    const drugsInThiqa = await db.drug.count({
      where: {
        status: 'Active',
        includedInThiqaABM: 'Yes'
      }
    })

    const drugsInBasic = await db.drug.count({
      where: {
        status: 'Active',
        includedInBasic: 'Yes'
      }
    })

    // Get unique drug pairs with interactions
    const interactionsCount = await db.drugInteraction.count()

    return NextResponse.json({
      success: true,
      source: 'UAE Ministry of Health Drug Database',
      lastUpdated: new Date().toISOString(),
      statistics: {
        total: statusCounts.reduce((acc, s) => acc + s._count, 0),
        byStatus: statusCounts.map(s => ({
          status: s.status,
          count: s._count
        })),
        active: totalActive,
        withPricing: drugsWithPricing,
        formulary: {
          thiqa: drugsInThiqa,
          basic: drugsInBasic
        },
        interactions: interactionsCount
      },
      dosageForms: dosageForms.map(d => ({
        form: d.dosageForm,
        count: d._count
      }))
    })

  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get statistics' },
      { status: 500 }
    )
  }
}
