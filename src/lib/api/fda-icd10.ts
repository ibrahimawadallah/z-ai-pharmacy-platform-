/**
 * FDA Structured Product Labeling (SPL) Integration for ICD-10 Mappings
 * 
 * This module integrates with the FDA OpenFDA API to fetch official drug-indication
 * relationships and map them to ICD-10 codes for clinical accuracy.
 * 
 * Source: https://open.fda.gov/api/drug/label/
 * Authority: U.S. Food and Drug Administration (FDA)
 * Data Quality: TIER_1 (Official regulatory source)
 */

interface FDALabelResponse {
  results: Array<{
    id: string
    openfda: {
      generic_name?: string[]
      brand_name?: string[]
      manufacturer?: string[]
      product_ndc?: string[]
    }
    indications_and_usage?: string[]
    clinical_pharmacology?: string[]
  }>
}

interface FDAIndication {
  icd10Code: string
  description: string
  source: string
  confidence: string
  evidenceLevel: string
}

// Common ICD-10 code mappings for FDA indications
const INDICATION_TO_ICD10: Record<string, string[]> = {
  'hypertension': ['I10', 'I11', 'I12', 'I15'],
  'diabetes': ['E10', 'E11', 'E12', 'E13', 'E14'],
  'depression': ['F32', 'F33', 'F34'],
  'anxiety': ['F41', 'F40', 'F42'],
  'asthma': ['J45', 'J46'],
  'pneumonia': ['J18', 'J15', 'J12'],
  'infection': ['A00', 'B99', 'J01', 'J02'],
  'pain': ['R52', 'M54', 'M79'],
  'arthritis': ['M00', 'M19', 'M05'],
  'heart failure': ['I50'],
  'atrial fibrillation': ['I48'],
  'migraine': ['G43'],
  'epilepsy': ['G40', 'G41'],
  'schizophrenia': ['F20'],
  'bipolar': ['F31'],
  'hyperlipidemia': ['E78'],
  'osteoporosis': ['M80', 'M81'],
  'cancer': ['C00', 'C97', 'D00'],
  'bacterial infection': ['A00', 'A99'],
  'viral infection': ['B00', 'B99'],
  'fungal infection': ['B30', 'B49'],
}

/**
 * Extract base generic name from complex drug names
 */
function extractBaseGenericName(drugName: string): string[] {
  const baseNames: string[] = []
  const name = drugName.toLowerCase()
  
  // Remove common suffixes and qualifiers
  const cleanedName = name
    .replace(/\s*(hydrochloride|hcl|sulfate|sodium|calcium|potassium|magnesium)\s*/gi, ' ')
    .replace(/\s*(ph\.eur\.|usp|bp)\s*/gi, ' ')
    .replace(/\s*(micronized|anhydrous|monohydrate|dihydrate)\s*/gi, ' ')
    .replace(/\s*\([^)]*\)\s*/g, ' ') // Remove parenthetical information
    .replace(/\s*\d+\.?\d*\s*(mg|g|ml|mcg|iu)\s*/gi, ' ') // Remove dosages
    .replace(/\s*(equivalent to|eq\. to)\s*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  // Split by common separators
  const parts = cleanedName.split(/[,+]/).map(p => p.trim()).filter(p => p.length > 2)
  
  // Add the full cleaned name
  if (cleanedName.length > 2) {
    baseNames.push(cleanedName)
  }
  
  // Add individual parts for combination drugs
  parts.forEach(part => {
    if (part.length > 2 && !baseNames.includes(part)) {
      baseNames.push(part)
    }
  })
  
  return baseNames
}

/**
 * Fetch drug label information from FDA OpenFDA API with improved matching
 */
export async function fetchFDALabel(drugName: string): Promise<FDALabelResponse | null> {
  try {
    const searchTerms = extractBaseGenericName(drugName)
    
    // Try each search term until we find a match
    for (const searchTerm of searchTerms) {
      const searchQuery = searchTerm.replace(/\s+/g, '+')
      
      // Try generic name search first
      let url = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${searchQuery}"&limit=1`
      
      let response = await fetch(url, {
        headers: {
          'User-Agent': 'DrugEye-Clinical-Command-Center/1.0'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.results && data.results.length > 0) {
          return data
        }
      }
      
      // Try brand name search if generic name fails
      url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${searchQuery}"&limit=1`
      
      response = await fetch(url, {
        headers: {
          'User-Agent': 'DrugEye-Clinical-Command-Center/1.0'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.results && data.results.length > 0) {
          return data
        }
      }
      
      // Try broader search without field specification
      url = `https://api.fda.gov/drug/label.json?search="${searchQuery}"&limit=1`
      
      response = await fetch(url, {
        headers: {
          'User-Agent': 'DrugEye-Clinical-Command-Center/1.0'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.results && data.results.length > 0) {
          return data
        }
      }
    }
    
    console.warn(`FDA API: No results found for ${drugName} (tried: ${searchTerms.join(', ')})`)
    return null
  } catch (error) {
    console.error(`Error fetching FDA data for ${drugName}:`, error)
    return null
  }
}

/**
 * Extract indications from FDA label and map to ICD-10 codes
 */
export function extractIndicationsFromLabel(fdaData: FDALabelResponse): FDAIndication[] {
  const indications: FDAIndication[] = []
  
  if (!fdaData.results || fdaData.results.length === 0) {
    return indications
  }
  
  const result = fdaData.results[0]
  const indicationText = result.indications_and_usage?.join(' ') || ''
  
  // Extract condition keywords from indication text
  for (const [condition, icd10Codes] of Object.entries(INDICATION_TO_ICD10)) {
    const regex = new RegExp(condition, 'gi')
    if (regex.test(indicationText)) {
      for (const code of icd10Codes) {
        indications.push({
          icd10Code: code,
          description: condition.charAt(0).toUpperCase() + condition.slice(1),
          source: 'FDA_SPL',
          confidence: 'HIGH',
          evidenceLevel: 'APPROVED_INDICATION'
        })
      }
    }
  }
  
  return indications
}

/**
 * Get ICD-10 mappings for a drug from FDA data
 */
export async function getFDAICD10Mappings(drugName: string): Promise<FDAIndication[]> {
  const fdaData = await fetchFDALabel(drugName)
  
  if (!fdaData) {
    return []
  }
  
  return extractIndicationsFromLabel(fdaData)
}

/**
 * Batch fetch FDA data for multiple drugs
 */
export async function batchFetchFDAICD10Mappings(drugNames: string[]): Promise<Map<string, FDAIndication[]>> {
  const results = new Map<string, FDAIndication[]>()
  
  for (const drugName of drugNames) {
    const mappings = await getFDAICD10Mappings(drugName)
    if (mappings.length > 0) {
      results.set(drugName, mappings)
    }
    
    // Rate limiting: 1 request per second to respect FDA API limits
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  return results
}

/**
 * Search FDA database by generic name
 */
export async function searchFDAByGenericName(genericName: string): Promise<any[]> {
  try {
    const searchQuery = genericName.replace(/\s+/g, '+')
    const url = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${searchQuery}"&limit=10`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DrugEye-Clinical-Command-Center/1.0'
      }
    })
    
    if (!response.ok) {
      return []
    }
    
    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error(`Error searching FDA for ${genericName}:`, error)
    return []
  }
}

/**
 * Get FDA data quality metadata
 */
export function getFDADataQuality() {
  return {
    source: 'FDA_SPL',
    tier: 'TIER_1',
    authority: 'U.S. Food and Drug Administration',
    confidence: 'HIGH',
    evidenceLevel: 'APPROVED_INDICATION',
    lastUpdated: new Date().toISOString(),
    url: 'https://open.fda.gov/api/drug/label/',
    description: 'Official FDA drug labeling information with approved indications'
  }
}
