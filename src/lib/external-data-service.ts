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
  'Amoxicillin': {
    pregnancyCategory: 'B',
    pregnancyPrecautions: 'Crosses placenta. Use only if clearly needed.',
    breastfeedingSafety: 'Compatible. Excreted in low concentrations.',
    g6pdSafety: 'Safe',
    baseDoseMgPerKg: 25,
    baseDoseIndication: 'Respiratory infection',
    source: 'FDA/Micromedex'
  },
  'Metformin': {
    pregnancyCategory: 'B',
    pregnancyPrecautions: 'Continue use in pregnancy for diabetes control. Do not use for PCOS.',
    breastfeedingSafety: 'Compatible. Excreted in breast milk.',
    g6pdSafety: 'Safe',
    baseDoseMgPerKg: 20,
    baseDoseIndication: 'Type 2 Diabetes',
    source: 'FDA/Micromedex'
  },
  'Atorvastatin': {
    pregnancyCategory: 'X',
    pregnancyPrecautions: 'CONTRAINDICATED IN PREGNANCY. Discontinue if pregnancy occurs.',
    breastfeedingSafety: 'Contraindicated. Excreted in breast milk.',
    g6pdSafety: 'Safe',
    source: 'FDA/Micromedex'
  },
  'Ibuprofen': {
    pregnancyCategory: 'C',
    pregnancyPrecautions: 'Avoid in 3rd trimester. May cause premature closure of ductus arteriosus.',
    breastfeedingSafety: 'Compatible. Excreted in low concentrations.',
    g6pdSafety: 'Caution',
    g6pdWarning: 'May trigger hemolysis in G6PD-deficient patients',
    baseDoseMgPerKg: 10,
    baseDoseIndication: 'Pain/Inflammation',
    source: 'FDA/Micromedex'
  },
  'Aspirin': {
    pregnancyCategory: 'C',
    pregnancyPrecautions: 'Avoid in 3rd trimester. May cause bleeding.',
    breastfeedingSafety: 'Compatible in low doses.',
    g6pdSafety: 'Caution',
    g6pdWarning: 'May trigger hemolysis in G6PD-deficient patients',
    baseDoseMgPerKg: 10,
    baseDoseIndication: 'Pain/Antiplatelet',
    source: 'FDA/Micromedex'
  },
  'Co-trimoxazole': {
    pregnancyCategory: 'C',
    pregnancyPrecautions: 'Avoid near term. May cause kernicterus in newborns.',
    breastfeedingSafety: 'Compatible. Monitor forkernicterus in infants.',
    g6pdSafety: 'Contraindicated',
    g6pdWarning: 'CONTRAINDICATED in G6PD deficiency. May cause severe hemolytic anemia.',
    source: 'FDA/Micromedex'
  },
  'Dapsone': {
    pregnancyCategory: 'C',
    pregnancyPrecautions: 'Use only if benefits outweigh risks.',
    breastfeedingSafety: 'Contraindicated. Significant excretion.',
    g6pdSafety: 'Contraindicated',
    g6pdWarning: 'CONTRAINDICATED in G6PD deficiency. May cause severe hemolytic anemia.',
    source: 'FDA/Micromedex'
  },
  'Nalidixic Acid': {
    pregnancyCategory: 'C',
    pregnancyPrecautions: 'Use only if benefits outweigh risks.',
    breastfeedingSafety: 'Compatible.',
    g6pdSafety: 'Contraindicated',
    g6pdWarning: 'CONTRAINDICATED in G6PD deficiency. May cause hemolytic anemia.',
    source: 'FDA/Micromedex'
  },
  'Nitrofurantoin': {
    pregnancyCategory: 'B',
    pregnancyPrecautions: 'Avoid in G6PD-deficient infants. Near term use may cause infant hemolysis.',
    breastfeedingSafety: 'Compatible. Avoid in G6PD-deficient infants.',
    g6pdSafety: 'Caution',
    g6pdWarning: 'Use with caution in G6PD deficiency. May cause hemolysis.',
    source: 'FDA/Micromedex'
  },
  'Primaquine': {
    pregnancyCategory: 'C',
    pregnancyPrecautions: 'Use only if benefits outweigh risks.',
    breastfeedingSafety: 'Excreted in milk. Discontinue breastfeeding.',
    g6pdSafety: 'Contraindicated',
    g6pdWarning: 'CONTRAINDICATED in G6PD deficiency. May cause life-threatening hemolytic anemia.',
    source: 'FDA/Micromedex'
  }
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