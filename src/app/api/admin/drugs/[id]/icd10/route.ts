import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/admin/drugs/[id]/icd10 - Add ICD-10 mappings to a drug
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: drugId } = await params
    const { icd10Codes } = await request.json()

    if (!Array.isArray(icd10Codes)) {
      return NextResponse.json(
        { error: 'icd10Codes must be an array' },
        { status: 400 }
      )
    }

    await db.iCD10Mapping.deleteMany({
      where: { drugId }
    })

    const createdMappings = await Promise.all(
      icd10Codes.map((icd10: { code: string; description: string; category?: string }) =>
        db.iCD10Mapping.create({
          data: {
            drugId,
            icd10Code: icd10.code,
            description: icd10.description,
            category: icd10.category || 'General'
          }
        })
      )
    )

    return NextResponse.json({
      success: true,
      count: createdMappings.length,
      mappings: createdMappings
    })
  } catch (error) {
    console.error('Error importing ICD-10 mappings:', error)
    return NextResponse.json(
      { error: 'Failed to import ICD-10 mappings' },
      { status: 500 }
    )
  }
}
