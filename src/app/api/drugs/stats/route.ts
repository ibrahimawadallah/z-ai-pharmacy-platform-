import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthSession } from '@/lib/auth'

// GET /api/drugs/stats - Get UAE drug database statistics
export async function GET() {
  try {
    const session = await getAuthSession()
    const userId = session?.user?.id
    
    // Get today's start and end
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const endOfToday = new Date(startOfToday)
    endOfToday.setDate(endOfToday.getDate() + 1)
    
    // Get last 7 days start
    const startOfLast7Days = new Date()
    startOfLast7Days.setDate(startOfLast7Days.getDate() - 7)
    startOfLast7Days.setHours(0, 0, 0, 0)

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

    // Get active interactions today (for dashboard)
    const activeInteractions = await db.drugInteraction.count({
      where: {
        createdAt: {
          gte: startOfToday,
          lt: endOfToday
        }
      }
    })

    // Get recent searches (for dashboard)
    const recentSearches = userId ? 
      await db.userSearchHistory.count({
        where: {
          userId,
          createdAt: {
            gte: startOfLast7Days
          }
        }
      }) : 0

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
      dashboard: {
        activeInteractions,
        recentSearches
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
