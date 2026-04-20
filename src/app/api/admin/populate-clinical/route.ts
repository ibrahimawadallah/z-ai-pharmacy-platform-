import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getExternalDrugData } from '@/lib/external-data-service'

// API route to populate database with clinical data
// POST /api/admin/populate-clinical
// Run once to download and save data for offline use

const CLINICAL_DATA = {
  'amoxicillin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Crosses placenta. Use only if clearly needed.', breastfeedingSafety: 'Compatible. Excreted in low concentrations.', g6pdSafety: 'Safe', baseDoseMgPerKg: 25, baseDoseIndication: 'Respiratory infection' },
  'metformin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Continue use in pregnancy for diabetes control.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 20, baseDoseIndication: 'Type 2 Diabetes' },
  'atorvastatin': { pregnancyCategory: 'X', pregnancyPrecautions: 'CONTRAINDICATED IN PREGNANCY.', breastfeedingSafety: 'Contraindicated.', g6pdSafety: 'Safe' },
  'ibuprofen': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in 3rd trimester.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Caution', g6pdWarning: 'May trigger hemolysis in G6PD deficiency', baseDoseMgPerKg: 10, baseDoseIndication: 'Pain/Inflammation' },
  'paracetamol': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe at recommended doses.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 15, baseDoseIndication: 'Pain/Fever' },
  'panadol': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe at recommended doses.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 15, baseDoseIndication: 'Pain/Fever' },
  'augmentin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe for infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 25, baseDoseIndication: 'Respiratory infection' },
  'azithromycin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use only if needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 10, baseDoseIndication: 'Respiratory infection' },
  'omeprazole': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'losartan': { pregnancyCategory: 'D', pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'lisinopril': { pregnancyCategory: 'D', pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'amlodipine': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'gliclazide': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only in 2nd/3rd trimester if needed.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'salbutamol': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'prednisolone': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use lowest effective dose.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 1, baseDoseIndication: 'Inflammation' },
  'ranitidine': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'metronidazole': { pregnancyCategory: 'B', pregnancyPrecautions: 'Avoid in 1st trimester.', breastfeedingSafety: 'Discontinue for 24h.', g6pdSafety: 'Safe' },
  'diclofenac': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in 3rd trimester.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'cetirizine': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'loratadine': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' }
}

export async function POST(request: NextRequest) {
  try {
    // Get drugs missing clinical data
    const drugs = await db.drug.findMany({
      where: {
        status: 'Active',
        pregnancyCategory: null
      },
      select: {
        id: true,
        packageName: true,
        genericName: true
      },
      take: 500
    })

    console.log(`Found ${drugs.length} drugs needing clinical data`)

    let updated = 0
    for (const drug of drugs) {
      const name = (drug.genericName || drug.packageName || '').toLowerCase()

      // Find matching data
      let data = null
      for (const [key, value] of Object.entries(CLINICAL_DATA)) {
        if (name.includes(key) || key.includes(name)) {
          data = value
          break
        }
      }

      // Also try external service
      if (!data) {
        const external = await getExternalDrugData(drug.genericName || drug.packageName)
        if (external) data = external
      }

      if (data) {
        await db.drug.update({
          where: { id: drug.id },
          data: {
            pregnancyCategory: data.pregnancyCategory,
            pregnancyPrecautions: data.pregnancyPrecautions,
            breastfeedingSafety: data.breastfeedingSafety,
            g6pdSafety: data.g6pdSafety,
            g6pdWarning: data.g6pdWarning,
            baseDoseMgPerKg: data.baseDoseMgPerKg,
            baseDoseIndication: data.baseDoseIndication
          }
        })
        updated++
      }
    }

    return NextResponse.json({
      success: true,
      updated,
      message: `Updated ${updated} drugs with clinical data for offline use`
    })
  } catch (error) {
    console.error('Populate error:', error)
return NextResponse.json({ error: 'Failed to populate data' }, { status: 500 })
  }
}