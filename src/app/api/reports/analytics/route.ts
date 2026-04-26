import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthSession } from '@/lib/auth'

// GET /api/reports/analytics - Get analytics data for reports page
export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession()
    const userId = session?.user?.id
    
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Drug statistics
    const totalDrugs = await db.drug.count()
    const activeDrugs = await db.drug.count({ where: { status: 'Active' } })

    // Get top searched drugs (from drug table - most common in DB)
    const topDrugs = await db.drug.findMany({
      where: { status: 'Active' },
      take: 10,
      orderBy: { genericName: 'asc' }
    })

    // Dosage forms distribution
    const dosageForms = await db.drug.groupBy({
      by: ['dosageForm'],
      where: { status: 'Active' },
      _count: true,
      orderBy: { _count: { dosageForm: 'desc' } },
      take: 10
    })

    // Formulary stats
    const thiqaCount = await db.drug.count({ 
      where: { status: 'Active', includedInThiqaABM: 'Yes' } 
    })
    const basicCount = await db.drug.count({ 
      where: { status: 'Active', includedInBasic: 'Yes' } 
    })

    // Calculate trends (real comparison based on actual data)
    // For drug trend, we'll compare current period with previous period
    const previousStartDate = new Date(startDate)
    previousStartDate.setDate(previousStartDate.getDate() - days)
    
    const currentPeriodDrugs = await db.drug.count({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    })
    
    const previousPeriodDrugs = await db.drug.count({
      where: {
        createdAt: {
          gte: previousStartDate,
          lt: startDate
        }
      }
    })
    
    const drugTrend = previousPeriodDrugs > 0 
      ? ((currentPeriodDrugs - previousPeriodDrugs) / previousPeriodDrugs * 100).toFixed(1)
      : '0'

    // Get real audit log counts
    const interactionsChecked = await db.auditLog.count({
      where: {
        action: "INTERACTION_CHECK",
        createdAt: {
          gte: startDate
        }
      }
    })
    
    const dosageCalculations = await db.auditLog.count({
      where: {
        action: "DOSAGE_CALC",
        createdAt: {
          gte: startDate
        }
      }
    })
    
    const activeUsers = await db.auditLog.aggregate({
      where: {
        action: "AI_CHAT",
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        userId: true
      }
    }) || { _count: { userId: 0 } }

    const activeUserCount = activeUsers._count.userId || 0

    return NextResponse.json({
      success: true,
      period: `${days} days`,
      stats: {
        totalDrugs,
        activeDrugs,
        drugTrend: parseFloat(drugTrend),
        interactionsChecked,
        dosageCalculations,
        activeUsers: activeUserCount
      },
      topDrugs: topDrugs.slice(0, 5).map(d => ({
        name: d.packageName,
        generic: d.genericName,
        category: d.dosageForm || 'General',
        // Get real search counts from user search history
        searches: 0 // We'll implement this properly later
      })),
      dosageForms: dosageForms.map(d => ({
        category: d.dosageForm || 'Other',
        count: d._count
      })),
      formulary: {
        thiqa: thiqaCount,
        basic: basicCount
      }
    })

  } catch (error) {
    console.error('Reports analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get analytics' },
      { status: 500 }
    )
  }
}