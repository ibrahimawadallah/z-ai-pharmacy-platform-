import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/admin/drugs/[id]/side-effects - Add side effects to a drug
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: drugId } = await params
    const { sideEffects } = await request.json()

    if (!Array.isArray(sideEffects)) {
      return NextResponse.json(
        { error: 'sideEffects must be an array' },
        { status: 400 }
      )
    }

    const createdSideEffects = await Promise.all(
      sideEffects.map((se: { sideEffect: string; frequency?: string; severity?: string }) =>
        db.drugSideEffect.create({
          data: {
            drugId,
            sideEffect: se.sideEffect,
            frequency: se.frequency || null,
            severity: se.severity || null
          }
        })
      )
    )

    return NextResponse.json({
      success: true,
      count: createdSideEffects.length,
      sideEffects: createdSideEffects
    })
  } catch (error) {
    console.error('Error importing side effects:', error)
    return NextResponse.json(
      { error: 'Failed to import side effects' },
      { status: 500 }
    )
  }
}
