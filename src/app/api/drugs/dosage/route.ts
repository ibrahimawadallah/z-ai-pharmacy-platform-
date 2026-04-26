import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getExternalDrugData } from '@/lib/external-data-service'
import { requireAuth } from '@/lib/auth'
import { getClientIP } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const session = await requireAuth()
  const userId = session?.user?.id
  
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('q') || ''
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)

    const drugs = await db.drug.findMany({
      where: {
        status: 'Active',
        baseDoseMgPerKg: { not: null },
        OR: search ? [
          { packageName: { contains: search, mode: 'insensitive' } },
          { genericName: { contains: search, mode: 'insensitive' } }
        ] : undefined
      },
      select: {
        id: true,
        packageName: true,
        genericName: true,
        strength: true,
        dosageForm: true,
        baseDoseMgPerKg: true,
        baseDoseIndication: true
      },
      orderBy: { packageName: 'asc' },
      take: limit
    })

    const enriched = await Promise.all(
      drugs.map(async (drug) => {
        if (drug.baseDoseMgPerKg === null) {
          const external = await getExternalDrugData(drug.genericName || drug.packageName)
          if (external?.baseDoseMgPerKg) {
            return { ...drug, baseDoseMgPerKg: external.baseDoseMgPerKg, baseDoseIndication: external.baseDoseIndication, dataSource: external.source }
          }
        }
        return { ...drug, dataSource: 'UAE MOH' }
      })
    )

    const filterEmpty = enriched.filter(d => d.baseDoseMgPerKg !== null)

    // Write to AuditLog
    if (userId) {
      await db.auditLog.create({
        data: {
          userId,
          action: "DOSAGE_CALC",
          resource: "drug_dosage",
          details: `Searched dosage for: ${search || 'all drugs'}`,
          ipAddress: getClientIP(request),
        }
      }).catch(console.error)
    }

    return NextResponse.json({
      success: true,
      data: filterEmpty,
      count: filterEmpty.length
    })
  } catch (error: any) {
    console.error('Dosage API error:', error)
    
    // Write error to AuditLog
    if (userId) {
      await db.auditLog.create({
        data: {
          userId,
          action: "DOSAGE_CALC_ERROR",
          resource: "drug_dosage",
          details: error.message,
        }
      }).catch(console.error)
    }
    
    return NextResponse.json({ error: 'Failed to fetch dosage data' }, { status: 500 })
  }
}