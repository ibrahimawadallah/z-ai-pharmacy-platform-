import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthSession } from '@/lib/auth'
import { createAuditLog } from '@/lib/security'

export async function GET(req: Request) {
  try {
    const session = await getAuthSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const patients = await db.patient.findMany({
      where: { clinicianId: session.user.id },
      include: {
        _count: {
          select: { medications: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    const formattedPatients = patients.map(p => ({
      ...p,
      medicationCount: p._count.medications
    }))

    return NextResponse.json({ patients: formattedPatients })
  } catch (error) {
    console.error('Failed to fetch patients:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const patient = await db.patient.create({
      data: {
        clinicianId: session.user.id,
        mrn: body.mrn,
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: new Date(body.dateOfBirth),
        gender: body.gender,
        weightKg: body.weightKg ? parseFloat(body.weightKg) : null,
        heightCm: body.heightCm ? parseFloat(body.heightCm) : null,
        allergies: body.allergies || [],
        conditions: body.conditions || [],
        creatinineClearance: body.creatinineClearance ? parseFloat(body.creatinineClearance) : null,
      }
    })

    void createAuditLog(
      session.user.id,
      'patient_create',
      `patient:${patient.id}`,
      { mrn: patient.mrn ?? null },
      req
    )

    return NextResponse.json({ patient }, { status: 201 })
  } catch (error) {
    console.error('Failed to create patient:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
