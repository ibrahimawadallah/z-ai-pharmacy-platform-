import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

function parsePrice(value: string): number | null {
  if (!value || value.trim() === '') return null
  const num = parseFloat(value.replace(/,/g, ''))
  return isNaN(num) ? null : num
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const batchSize = parseInt(searchParams.get('batchSize') || '500')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const csvPath = path.join(process.cwd(), 'upload', 'UAE drug list.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      from_line: 1
    }) as Record<string, string>[]
    
    const activeDrugs = records.filter((r: any) => r.Status === 'Active')
    const totalDrugs = activeDrugs.length
    
    const batch = activeDrugs.slice(offset, offset + batchSize)
    
    if (batch.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Import complete - no more drugs to process',
        totalProcessed: offset,
        totalDrugs
      })
    }
    
    let inserted = 0
    
    for (const record of batch) {
      try {
        const drugData = {
          drugCode: record['Drug Code'] || '',
          insurancePlan: record['Insurance Plan'] || null,
          packageName: record['Package Name'] || '',
          genericName: record['Generic Name'] || '',
          strength: record['Strength'] || '',
          dosageForm: record['Dosage Form'] || '',
          packageSize: record['Package Size'] || null,
          dispenseMode: record['Dispense Mode'] || null,
          packagePricePublic: parsePrice(record['Package Price to Public']),
          packagePricePharmacy: parsePrice(record['Package Price to Pharmacy']),
          unitPricePublic: parsePrice(record['Unit Price to Public']),
          unitPricePharmacy: parsePrice(record['Unit Price to Pharmacy']),
          status: record['Status'] || 'Active',
          agentName: record['Agent Name'] || null,
          manufacturerName: record['Manufacturer Name'] || null,
          govtFundedCoverage: record['Insurance Coverage For Government Funded Program'] || null,
          uppScope: record['UPP Scope'] || null,
          includedInThiqaABM: record['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] || null,
          includedInBasic: record['Included In Basic Drug Formulary'] || null,
          includedInABM1: record['Included In ABM 1 Drug Formulary'] || null,
          includedInABM7: record['Included In ABM 7 Drug Formulary'] || null
        }
        
        if (!drugData.drugCode) continue
        
        const existing = await db.drug.findUnique({
          where: { drugCode: drugData.drugCode },
          select: { id: true }
        })
        if (existing) continue
        
        await db.drug.create({
          data: {
            drugCode: drugData.drugCode,
            insurancePlan: drugData.insurancePlan,
            packageName: drugData.packageName,
            genericName: drugData.genericName,
            strength: drugData.strength,
            dosageForm: drugData.dosageForm,
            packageSize: drugData.packageSize,
            dispenseMode: drugData.dispenseMode,
            packagePricePublic: drugData.packagePricePublic,
            packagePricePharmacy: drugData.packagePricePharmacy,
            unitPricePublic: drugData.unitPricePublic,
            unitPricePharmacy: drugData.unitPricePharmacy,
            status: drugData.status,
            agentName: drugData.agentName,
            manufacturerName: drugData.manufacturerName,
            govtFundedCoverage: drugData.govtFundedCoverage,
            uppScope: drugData.uppScope,
            includedInThiqaABM: drugData.includedInThiqaABM,
            includedInBasic: drugData.includedInBasic,
            includedInABM1: drugData.includedInABM1,
            includedInABM7: drugData.includedInABM7,
          }
        })
        
        inserted++
      } catch (err) {
        console.error(`Error importing drug:`, err)
      }
    }
    
    const nextOffset = offset + batch.length
    const hasMore = nextOffset < totalDrugs
    
    return NextResponse.json({
      success: true,
      message: `Imported ${inserted} drugs in this batch`,
      stats: {
        inserted,
        processed: nextOffset,
        totalDrugs,
        hasMore,
        nextOffset: hasMore ? nextOffset : null
      }
    })
    
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { success: false, error: 'Import failed', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const count = await db.drug.count()
    const icd10Count = await db.iCD10Mapping.count()
    const interactionCount = await db.drugInteraction.count()
    
    return NextResponse.json({
      success: true,
      currentStats: {
        totalDrugs: count,
        totalICD10Mappings: icd10Count,
        totalInteractions: interactionCount
      }
    })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get status' },
      { status: 500 }
    )
  }
}