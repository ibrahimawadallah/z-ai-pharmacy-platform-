import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/admin/drugs/[id]/interactions - Add drug interaction
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: drugId } = await params
    const { interactingDrugName, severity, description, mechanism, recommendation } = await request.json()

    if (!interactingDrugName || !severity) {
      return NextResponse.json(
        { error: 'interactingDrugName and severity are required' },
        { status: 400 }
      )
    }

    const interactingDrug = await db.drug.findFirst({
      where: {
        OR: [
          { genericName: { contains: interactingDrugName, mode: 'insensitive' } },
          { packageName: { contains: interactingDrugName, mode: 'insensitive' } }
        ]
      }
    })

    const interaction = await db.drugInteraction.create({
      data: {
        drugId,
        secondaryDrugId: interactingDrug?.id || null,
        secondaryDrugName: interactingDrugName,
        severity,
        description: description || null,
        interactionType: mechanism || null,
        management: recommendation || null
      }
    })

    return NextResponse.json({
      success: true,
      interaction
    })
  } catch (error) {
    console.error('Error importing drug interaction:', error)
    return NextResponse.json(
      { error: 'Failed to import drug interaction' },
      { status: 500 }
    )
  }
}
