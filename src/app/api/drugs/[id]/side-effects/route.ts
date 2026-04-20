import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const sideEffects = await db.drugSideEffect.findMany({
      where: { drugId: id },
      orderBy: { severity: 'asc' },
      take: 200
    })

    return NextResponse.json({
      success: true,
      data: sideEffects.map(se => ({
        id: se.id,
        drugId: se.drugId,
        name: se.sideEffect,
        frequency: se.frequency,
        severity: se.severity,
        mechanism: se.mechanism,
        description: `${se.sideEffect}${se.frequency ? ` (${se.frequency})` : ''}`
      }))
    })
  } catch (error) {
    console.error('Error fetching side effects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch side effects', details: String(error) },
      { status: 500 }
    )
  }
}