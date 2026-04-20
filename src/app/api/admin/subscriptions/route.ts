import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth-options'

// GET /api/admin/subscriptions - Get all subscriptions (Admin Only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const planId = searchParams.get('planId')

    const where: any = {}
    if (status) where.status = status
    if (planId) where.planId = planId

    const subscriptions = await db.subscription.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    const stats = await db.subscription.groupBy({
      by: ['planId'],
      _count: true
    })

    const totalRevenue = await db.payment.aggregate({
      where: { status: 'succeeded' },
      _sum: { amount: true }
    })

    return NextResponse.json({ 
      success: true, 
      subscriptions,
      analytics: {
        planDistribution: stats,
        totalRevenue: totalRevenue._sum.amount || 0
      }
    })
  } catch (error) {
    console.error('Admin subscription fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
