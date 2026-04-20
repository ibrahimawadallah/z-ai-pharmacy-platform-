import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthSession } from '@/lib/auth'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const session = await getAuthSession()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { patientId } = await params

    // Verify patient ownership using prisma
    const patient = await db.patient.findUnique({
      where: { id: patientId }
    })

    if (!patient || patient.clinicianId !== session.user.id) {
      return new NextResponse('Unauthorized or Not Found', { status: 401 })
    }

    const body = await req.json()
    const { drugId, drugName, genericName, dosage, frequency, route, startDate, endDate, isPRN, notes } = body

    if (!drugId || !drugName || !dosage || !frequency || !route) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const medication = await db.patientMedication.create({
      data: {
        patientId,
        drugId,
        drugName,
        genericName,
        dosage,
        frequency,
        route,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        isPRN: isPRN || false,
        notes: notes || null,
      }
    })

    return NextResponse.json(medication, { status: 201 })
  } catch (error) {
    console.error('[MEDICATION_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
