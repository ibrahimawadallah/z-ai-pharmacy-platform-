import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthSession } from '@/lib/auth'

function normalizeList(input: unknown): string | null | undefined {
  if (input === undefined) return undefined
  if (input === null) return null
  if (Array.isArray(input)) {
    const cleaned = input.map((s) => String(s).trim()).filter(Boolean)
    return cleaned.length ? cleaned.join(', ') : null
  }
  const s = String(input).trim()
  return s.length ? s : null
}

function parseNumber(input: unknown): number | null | undefined {
  if (input === undefined) return undefined
  if (input === null || input === '') return null
  const n = typeof input === 'number' ? input : parseFloat(String(input))
  return Number.isFinite(n) ? n : null
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const session = await getAuthSession()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { patientId } = await params

    const patient = await db.patient.findFirst({
      where: {
        id: patientId,
        clinicianId: session.user.id
      },
      include: {
        medications: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!patient) {
      return new NextResponse('Patient not found', { status: 404 })
    }

    return NextResponse.json(patient)
  } catch (error) {
    console.error('[PATIENT_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const session = await getAuthSession()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { patientId } = await params
    const body = await req.json()

    // Check if patient exists and belongs to user
    const existing = await db.patient.findFirst({
      where: {
        id: patientId,
        clinicianId: session.user.id
      }
    })

    if (!existing) {
      return new NextResponse('Patient not found', { status: 404 })
    }

    const updatedPatient = await db.patient.update({
      where: { id: patientId },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        mrn: body.mrn,
        gender: body.gender,
        weightKg: parseNumber(body.weightKg),
        heightCm: parseNumber(body.heightCm),
        creatinineClearance: parseNumber(body.creatinineClearance),
        allergies: normalizeList(body.allergies),
        conditions: normalizeList(body.conditions),
        hepaticImpairment: body.hepaticImpairment !== undefined ? Boolean(body.hepaticImpairment) : undefined,
        isPregnant: body.isPregnant !== undefined ? Boolean(body.isPregnant) : undefined,
      },
      include: {
        medications: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    return NextResponse.json(updatedPatient)
  } catch (error) {
    console.error('[PATIENT_PATCH]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const session = await getAuthSession()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { patientId } = await params

    // Check if patient exists and belongs to user
    const existing = await db.patient.findFirst({
      where: {
        id: patientId,
        clinicianId: session.user.id
      }
    })

    if (!existing) {
      return new NextResponse('Patient not found', { status: 404 })
    }

    await db.patient.delete({
      where: { id: patientId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[PATIENT_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
