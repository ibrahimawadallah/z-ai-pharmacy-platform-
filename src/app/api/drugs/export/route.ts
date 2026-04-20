import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/drugs/export - Export drugs data as CSV or JSON
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const format = searchParams.get('format') || 'json'
  const status = searchParams.get('status') || 'Active'
  const includeICD10 = searchParams.get('icd10') === 'true'

  try {
    // Build where clause
    const where = {
      status
    }

    // Get drugs with optional ICD-10 mappings
    const drugs = await db.drug.findMany({
      where,
      include: includeICD10 ? {
        icd10Codes: true
      } : undefined,
      orderBy: {
        packageName: 'asc'
      }
    })

    if (format === 'csv') {
      // Generate CSV
      const headers = [
        'Drug Code',
        'Package Name',
        'Generic Name',
        'Strength',
        'Dosage Form',
        'Package Size',
        'Status',
        'Dispense Mode',
        'Public Price (AED)',
        'Pharmacy Price (AED)',
        'Thiqa Formulary',
        'Basic Formulary',
        ...(includeICD10 ? ['ICD-10 Codes', 'ICD-10 Descriptions'] : [])
      ]
      
      const rows = drugs.map(drug => {
        const row = [
          drug.drugCode,
          `"${drug.packageName.replace(/"/g, '""')}"`,
          `"${drug.genericName.replace(/"/g, '""')}"`,
          drug.strength,
          drug.dosageForm,
          drug.packageSize,
          drug.status,
          drug.dispenseMode || '',
          drug.packagePricePublic?.toString() || '',
          drug.packagePricePharmacy?.toString() || '',
          drug.includedInThiqaABM || 'No',
          drug.includedInBasic || 'No'
        ]
        
        if (includeICD10 && 'icd10Codes' in drug) {
          const codes = (drug.icd10Codes as { icd10Code: string; description: string | null }[])
            .map((c: { icd10Code: string }) => c.icd10Code)
            .join('; ')
          const descriptions = (drug.icd10Codes as { icd10Code: string; description: string | null }[])
            .map((c: { description: string | null }) => c.description || '')
            .join('; ')
          row.push(`"${codes}"`, `"${descriptions}"`)
        }
        
        return row.join(',')
      })
      
      const csv = [headers.join(','), ...rows].join('\n')
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="uae-drugs-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }
    
    // JSON format
    return NextResponse.json({
      success: true,
      exportedAt: new Date().toISOString(),
      totalRecords: drugs.length,
      format: 'json',
      data: drugs
    })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
