import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const interactions = await db.drugInteraction.findMany({
      where: {
        OR: [
          { drugId: id },
          { secondaryDrugId: id }
        ]
      },
      orderBy: { severity: 'asc' },
      take: 100
    })

    return NextResponse.json({
      success: true,
      data: interactions.map(interaction => ({
        id: interaction.id,
        drugId: interaction.drugId,
        secondaryDrugName: interaction.secondaryDrugName,
        secondaryDrugId: interaction.secondaryDrugId,
        severity: interaction.severity,
        interactionType: interaction.interactionType,
        description: interaction.description,
        management: interaction.management,
        evidence: interaction.evidence
      }))
    })
  } catch (error) {
    console.error('Error fetching interactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch interactions', details: String(error) },
      { status: 500 }
    )
  }
}