import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // Get drug details using prisma
    const drug = await db.drug.findFirst({
      where: {
        OR: [
          { id: id },
          { drugCode: id }
        ]
      },
      include: {
        icd10Codes: true,
        interactions: {
          orderBy: { severity: 'asc' }
        },
        sideEffects: {
          orderBy: { sideEffect: 'asc' },
          take: 200
        }
      }
    })

    if (!drug) {
      return NextResponse.json({ error: 'Drug not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      source: 'UAE Ministry of Health Drug Database',
      data: {
        ...drug,
        icd10Codes: drug.icd10Codes.map(c => ({ code: c.icd10Code, description: c.description, category: c.category })),
      }
    })
  } catch (error) {
    console.error('Drug lookup error:', error)
    return NextResponse.json({ error: 'Failed to get drug details' }, { status: 500 })
  }
}
