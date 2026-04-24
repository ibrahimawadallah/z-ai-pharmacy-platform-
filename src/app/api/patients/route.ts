import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthSession } from '@/lib/auth'

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

/**
 * `allergies` and `conditions` are stored as a single comma-separated String
 * (not a relation) — callers may send either an array or a string, we
 * normalize to the stored shape.
 */
function normalizeList(input: unknown): string | null {
  if (input == null) return null
  if (Array.isArray(input)) {
    const cleaned = input.map((s) => String(s).trim()).filter(Boolean)
    return cleaned.length ? cleaned.join(', ') : null
  }
  const s = String(input).trim()
  return s.length ? s : null
}

function parseNumber(input: unknown): number | null {
  if (input === null || input === undefined || input === '') return null
  const n = typeof input === 'number' ? input : parseFloat(String(input))
  return Number.isFinite(n) ? n : null
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    if (!body?.firstName || !body?.lastName || !body?.dateOfBirth || !body?.gender) {
      return NextResponse.json(
        { error: 'firstName, lastName, dateOfBirth and gender are required' },
        { status: 400 }
      )
    }

    const dob = new Date(body.dateOfBirth)
    if (Number.isNaN(dob.getTime())) {
      return NextResponse.json({ error: 'Invalid dateOfBirth' }, { status: 400 })
    }

    const patient = await db.patient.create({
      data: {
        clinicianId: session.user.id,
        mrn: body.mrn ? String(body.mrn).trim() : null,
        firstName: String(body.firstName).trim(),
        lastName: String(body.lastName).trim(),
        dateOfBirth: dob,
        gender: String(body.gender),
        weightKg: parseNumber(body.weightKg),
        heightCm: parseNumber(body.heightCm),
        allergies: normalizeList(body.allergies),
        conditions: normalizeList(body.conditions),
        creatinineClearance: parseNumber(body.creatinineClearance),
        hepaticImpairment: Boolean(body.hepaticImpairment),
        isPregnant: Boolean(body.isPregnant),
      }
    })

    return NextResponse.json({ patient }, { status: 201 })
  } catch (error) {
    console.error('Failed to create patient:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
