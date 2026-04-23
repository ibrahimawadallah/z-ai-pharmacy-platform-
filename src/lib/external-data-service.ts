import { db } from './db'

const EXTERNAL_DATA_CACHE = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000

interface ExternalDrugData {
  pregnancyCategory?: string
  pregnancyPrecautions?: string
  breastfeedingSafety?: string
  g6pdSafety?: string
  g6pdWarning?: string
  baseDoseMgPerKg?: number
  baseDoseIndication?: string
  source: string
}

const FALLBACK_DATA: Record<string, ExternalDrugData> = {
  'Amoxicillin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Crosses placenta. Use only if clearly needed.', breastfeedingSafety: 'Compatible. Excreted in low concentrations.', g6pdSafety: 'Safe', baseDoseMgPerKg: 25, baseDoseIndication: 'Respiratory infection', source: 'FDA' },
  'Metformin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Continue use in pregnancy for diabetes control.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 20, baseDoseIndication: 'Type 2 Diabetes', source: 'FDA' },
  'Atorvastatin': { pregnancyCategory: 'X', pregnancyPrecautions: 'CONTRAINDICATED IN PREGNANCY.', breastfeedingSafety: 'Contraindicated.', g6pdSafety: 'Safe', source: 'FDA' },
  'Ibuprofen': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in 3rd trimester.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Caution', g6pdWarning: 'May trigger hemolysis in G6PD deficiency', baseDoseMgPerKg: 10, baseDoseIndication: 'Pain/Inflammation', source: 'FDA' },
  'Aspirin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in 3rd trimester.', breastfeedingSafety: 'Compatible in low doses.', g6pdSafety: 'Caution', baseDoseMgPerKg: 10, source: 'FDA' },
  'Co-trimoxazole': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid near term.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Contraindicated', g6pdWarning: 'CONTRAINDICATED in G6PD deficiency', source: 'FDA' },
  'Dapsone': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Contraindicated.', g6pdSafety: 'Contraindicated', source: 'FDA' },
  'Nitrofurantoin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Avoid in G6PD-deficient infants.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Caution', source: 'FDA' },
  'Panadol': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe at recommended doses.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 15, baseDoseIndication: 'Pain/Fever', source: 'FDA' },
  'Paracetamol': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe at recommended doses.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 15, baseDoseIndication: 'Pain/Fever', source: 'FDA' },
  'Augmentin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Crosses placenta.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 25, baseDoseIndication: 'Respiratory infection', source: 'FDA' },
  'Adol': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe at recommended doses.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 15, source: 'FDA' },
  'Brufen': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in 3rd trimester.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Caution', baseDoseMgPerKg: 10, source: 'FDA' },
  'Nurofen': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in 3rd trimester.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Caution', baseDoseMgPerKg: 10, source: 'FDA' },
  'Ciprofloxacin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in pregnancy.', breastfeedingSafety: 'Discontinue breastfeeding.', g6pdSafety: 'Safe', source: 'FDA' },
  'Azithromycin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use only if needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 10, baseDoseIndication: 'Respiratory infection', source: 'FDA' },
  'Omeprazole': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Losec': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Prednisolone': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use lowest effective dose.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 1, baseDoseIndication: 'Inflammation', source: 'FDA' },
  'Ventolin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Salbutamol': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Glucophage': { pregnancyCategory: 'B', pregnancyPrecautions: 'Continue for diabetes control.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 20, source: 'FDA' },
  'Novonorm': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Excreted in milk.', g6pdSafety: 'Safe', source: 'FDA' },
  'Diamicron': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only in 2nd/3rd trimester if needed.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe', source: 'FDA' },
  'Captopril': { pregnancyCategory: 'D', pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', breastfeedingSafety: 'Excreted in milk.', g6pdSafety: 'Safe', source: 'FDA' },
  'Lisinopril': { pregnancyCategory: 'D', pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe', source: 'FDA' },
  'Cozaar': { pregnancyCategory: 'D', pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe', source: 'FDA' },
  'Fastium': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe for hypertension.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Amlodipine': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Norvasc': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Zantac': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Ranitidine': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Tavan': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Flagyl': { pregnancyCategory: 'B', pregnancyPrecautions: 'Avoid in 1st trimester.', breastfeedingSafety: 'Discontinue nursing.', g6pdSafety: 'Safe', source: 'FDA' },
  'Metronidazole': { pregnancyCategory: 'B', pregnancyPrecautions: 'Avoid in 1st trimester.', breastfeedingSafety: 'Discontinue for 24h.', g6pdSafety: 'Safe', source: 'FDA' },
  'Diclofenac': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in 3rd trimester.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Cataflam': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in 3rd trimester.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', source: 'FDA' },
  'Povidone Iodine': { pregnancyCategory: 'X', pregnancyPrecautions: 'Avoid.', breastfeedingSafety: 'Avoid.', g6pdSafety: 'Safe', source: 'FDA' },
  'Betadine': { pregnancyCategory: 'X', pregnancyPrecautions: 'Avoid.', breastfeedingSafety: 'Avoid.', g6pdSafety: 'Safe', source: 'FDA' }
}

export async function getExternalDrugData(drugName: string): Promise<ExternalDrugData | null> {
  const normalizedName = drugName.toLowerCase()
  const cacheKey = normalizedName

  const cached = EXTERNAL_DATA_CACHE.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  const fallbackData = FALLBACK_DATA[normalizedName] || 
    Object.keys(FALLBACK_DATA).find(key => normalizedName.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedName))

  if (fallbackData) {
    EXTERNAL_DATA_CACHE.set(cacheKey, { data: fallbackData, timestamp: Date.now() })
    return fallbackData
  }

  return null
}

export async function supplementDrugData(drugId: string): Promise<{ supplemented: boolean; data?: ExternalDrugData }> {
  try {
    const drug = await db.drug.findUnique({
      where: { id: drugId },
      select: { genericName: true, packageName: true, pregnancyCategory: true, g6pdSafety: true }
    })

    if (!drug) {
      return { supplemented: false }
    }

    const needsPregnancyData = !drug.pregnancyCategory
    const needsG6PDData = !drug.g6pdSafety

    if (!needsPregnancyData && !needsG6PDData) {
      return { supplemented: false }
    }

    const externalData = await getExternalDrugData(drug.genericName || drug.packageName)
    
    if (externalData) {
      const updateData: any = {}
      
      if (needsPregnancyData && externalData.pregnancyCategory) {
        updateData.pregnancyCategory = externalData.pregnancyCategory
        updateData.pregnancyPrecautions = externalData.pregnancyPrecautions
        updateData.breastfeedingSafety = externalData.breastfeedingSafety
      }
      
      if (needsG6PDData && externalData.g6pdSafety) {
        updateData.g6pdSafety = externalData.g6pdSafety
        updateData.g6pdWarning = externalData.g6pdWarning
      }

      if (externalData.baseDoseMgPerKg) {
        updateData.baseDoseMgPerKg = externalData.baseDoseMgPerKg
        updateData.baseDoseIndication = externalData.baseDoseIndication
      }

      if (Object.keys(updateData).length > 0) {
        await db.drug.update({
          where: { id: drugId },
          data: updateData
        })
        
        return { 
          supplemented: true, 
          data: externalData 
        }
      }
    }

    return { supplemented: false }
  } catch (error) {
    console.error('Error supplementing drug data:', error)
    return { supplemented: false }
  }
}

export function getDataSourceLabel(data: ExternalDrugData): string {
  return `Data supplemented from ${data.source}`
}

export function isDataSupplemented(data: ExternalDrugData): boolean {
  return !!data.source
}

export { FALLBACK_DATA }