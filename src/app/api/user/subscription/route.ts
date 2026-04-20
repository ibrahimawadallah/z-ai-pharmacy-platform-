import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth-options'

// GET /api/user/subscription
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await db.subscription.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: subscription || null })
  } catch (error) {
    console.error('Get subscription error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get subscription' }, { status: 500 })
  }
}

// POST /api/user/subscription
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { planId: planIdFromBody, plan, status, currentPeriodEnd, expiresAt } = body
    const planId = planIdFromBody || plan
    const periodEnd = currentPeriodEnd || expiresAt

    if (!planId || !status) {
      return NextResponse.json({ success: false, error: 'Missing planId or status' }, { status: 400 })
    }

    const subscription = await db.subscription.upsert({
      where: { userId: session.user.id },
      update: {
        planId,
        status,
        currentPeriodEnd: periodEnd ? new Date(periodEnd) : null,
      },
      create: {
        userId: session.user.id,
        planId,
        status,
        currentPeriodEnd: periodEnd ? new Date(periodEnd) : null,
      }
    })

    return NextResponse.json({ success: true, data: subscription }, { status: 201 })
  } catch (error) {
    console.error('Create subscription error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create subscription' }, { status: 500 })
  }
}
