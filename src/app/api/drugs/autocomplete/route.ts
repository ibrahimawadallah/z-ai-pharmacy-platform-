import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const limit = Math.min(parseInt(searchParams.get('limit') || '8'), 20)

    if (query.length < 2) {
      return NextResponse.json({ success: true, suggestions: [] })
    }

    const drugs = await db.drug.findMany({
      where: {
        status: 'Active',
        OR: [
          { packageName: { contains: query, mode: 'insensitive' } },
          { genericName: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        packageName: true,
        genericName: true,
        strength: true,
        dosageForm: true
      },
      orderBy: { packageName: 'asc' },
      take: limit
    })

    const suggestions = drugs.map(drug => ({
      id: drug.id,
      packageName: drug.packageName,
      genericName: drug.genericName,
      strength: drug.strength,
      dosageForm: drug.dosageForm
    }))

    return NextResponse.json({
      success: true,
      suggestions
    })
  } catch (error) {
    console.error('Autocomplete error:', error)
    return NextResponse.json({ error: 'Failed to get suggestions' }, { status: 500 })
  }
}