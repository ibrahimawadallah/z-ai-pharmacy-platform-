import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthSession } from '@/lib/auth'
import { createAuditLog } from '@/lib/security'

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

    void createAuditLog(session.user.id, 'patient_view', `patient:${patient.id}`, null, req)

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
        weightKg: body.weightKg !== undefined ? parseFloat(body.weightKg) : undefined,
        heightCm: body.heightCm !== undefined ? parseFloat(body.heightCm) : undefined,
        creatinineClearance: body.creatinineClearance !== undefined ? parseFloat(body.creatinineClearance) : undefined,
        allergies: body.allergies,
        conditions: body.conditions,
      },
      include: {
        medications: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    void createAuditLog(session.user.id, 'patient_update', `patient:${updatedPatient.id}`, null, req)

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

    void createAuditLog(session.user.id, 'patient_delete', `patient:${patientId}`, null, req)

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[PATIENT_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
