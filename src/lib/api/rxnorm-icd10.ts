/**
 * NLM RxNorm Integration for ICD-10 Mappings
 * 
 * This module integrates with the National Library of Medicine RxNorm API
 * to provide drug-condition relationships and map to ICD-10 codes via MeSH terms.
 * 
 * Source: https://clinicaltables.nlm.nih.gov/api/rxnorm/
 * Authority: National Library of Medicine (NLM)
 * Data Quality: TIER_2 (Authoritative medical database)
 */

interface RxNormDrug {
  rxcui: string
  name: string
  synonym: string[]
}

interface RxNormInteraction {
  rxcui: string
  name: string
  tty: string
}

interface RxNormICD10Mapping {
  icd10Code: string
  description: string
  source: string
  confidence: string
  evidenceLevel: string
}

// MeSH to ICD-10 mappings (simplified for common conditions)
const MESH_TO_ICD10: Record<string, string[]> = {
  'hypertension': ['I10', 'I11', 'I12', 'I15'],
  'diabetes mellitus': ['E10', 'E11', 'E12', 'E13', 'E14'],
  'depressive disorder': ['F32', 'F33', 'F34'],
  'anxiety disorders': ['F41', 'F40', 'F42'],
  'asthma': ['J45', 'J46'],
  'pneumonia': ['J18', 'J15', 'J12'],
  'pain': ['R52', 'M54', 'M79'],
  'arthritis': ['M00', 'M19', 'M05'],
  'heart failure': ['I50'],
  'atrial fibrillation': ['I48'],
  'migraine disorders': ['G43'],
  'epilepsy': ['G40', 'G41'],
  'schizophrenia': ['F20'],
  'bipolar disorder': ['F31'],
  'hyperlipidemias': ['E78'],
  'osteoporosis': ['M80', 'M81'],
  'infection': ['A00', 'B99'],
  'bacterial infections': ['A00', 'A99'],
  'viral diseases': ['B00', 'B99'],
  'mycoses': ['B30', 'B49'],
  'gastroesophageal reflux': ['K21'],
  'peptic ulcer': ['K25'],
  'rheumatoid arthritis': ['M05', 'M06'],
  'osteoarthritis': ['M15', 'M19'],
}

/**
 * Extract base generic name from complex drug names (same as FDA)
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
 * Search RxNorm for a drug by name with improved matching
 */
export async function searchRxNorm(drugName: string): Promise<RxNormDrug[]> {
  try {
    const searchTerms = extractBaseGenericName(drugName)
    
    // Try each search term until we find a match
    for (const searchTerm of searchTerms) {
      const searchQuery = searchTerm.replace(/\s+/g, '+')
      const url = `https://clinicaltables.nlm.nih.gov/api/rxnorm/v3/search?terms=${searchQuery}&ef=RXN_CUIS`
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'DrugEye-Clinical-Command-Center/1.0'
        }
      })
      
      if (!response.ok) {
        console.warn(`RxNorm API request failed for ${searchTerm}: ${response.status}`)
        continue
      }
      
      const data = await response.json()
      
      if (data[0] !== 200 || !data[1]) {
        continue
      }
      
      // Parse RxNorm response format
      const drugs: RxNormDrug[] = []
      const terms = data[1] || []
      
      for (const term of terms) {
        if (term.length >= 2) {
          drugs.push({
            rxcui: term[0],
            name: term[1],
            synonym: term[2] || []
          })
        }
      }
      
      if (drugs.length > 0) {
        return drugs
      }
    }
    
    console.warn(`RxNorm API: No results found for ${drugName} (tried: ${searchTerms.join(', ')})`)
    return []
  } catch (error) {
    console.error(`Error searching RxNorm for ${drugName}:`, error)
    return []
  }
}

/**
 * Get drug information from RxNorm by RxCUI
 */
export async function getRxNormDrugInfo(rxcui: string): Promise<any> {
  try {
    const url = `https://clinicaltables.nlm.nih.gov/api/rxnorm/v3/rxcui/${rxcui}/properties`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DrugEye-Clinical-Command-Center/1.0'
      }
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    
    if (data[0] !== 200 || !data[1]) {
      return null
    }
    
    return data[1]
  } catch (error) {
    console.error(`Error getting RxNorm info for ${rxcui}:`, error)
    return null
  }
}

/**
 * Get MeSH terms associated with a drug
 */
export async function getDrugMeSHTerms(drugName: string): Promise<string[]> {
  const drugs = await searchRxNorm(drugName)
  
  if (drugs.length === 0) {
    return []
  }
  
  const meshTerms: string[] = []
  
  for (const drug of drugs.slice(0, 3)) { // Check top 3 results
    const drugInfo = await getRxNormDrugInfo(drug.rxcui)
    
    if (drugInfo && drugInfo.length > 0) {
      // Extract MeSH terms if available in the response
      // Note: RxNorm API response structure varies, this is a simplified approach
      const info = drugInfo[0]
      if (info.MESH) {
        meshTerms.push(...info.MESH)
      }
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  return meshTerms
}

/**
 * Map MeSH terms to ICD-10 codes
 */
export function mapMeSHToICD10(meshTerms: string[]): RxNormICD10Mapping[] {
  const mappings: RxNormICD10Mapping[] = []
  
  for (const meshTerm of meshTerms) {
    const termLower = meshTerm.toLowerCase()
    
    for (const [meshKey, icd10Codes] of Object.entries(MESH_TO_ICD10)) {
      if (termLower.includes(meshKey.toLowerCase()) || meshKey.toLowerCase().includes(termLower)) {
        for (const code of icd10Codes) {
          mappings.push({
            icd10Code: code,
            description: meshKey.charAt(0).toUpperCase() + meshKey.slice(1),
            source: 'RXNORM_MESH',
            confidence: 'MEDIUM',
            evidenceLevel: 'THERAPEUTIC_RELATIONSHIP'
          })
        }
      }
    }
  }
  
  return mappings
}

/**
 * Get ICD-10 mappings for a drug from RxNorm data
 */
export async function getRxNormICD10Mappings(drugName: string): Promise<RxNormICD10Mapping[]> {
  const meshTerms = await getDrugMeSHTerms(drugName)
  
  if (meshTerms.length === 0) {
    return []
  }
  
  return mapMeSHToICD10(meshTerms)
}

/**
 * Batch fetch RxNorm data for multiple drugs
 */
export async function batchFetchRxNormICD10Mappings(drugNames: string[]): Promise<Map<string, RxNormICD10Mapping[]>> {
  const results = new Map<string, RxNormICD10Mapping[]>()
  
  for (const drugName of drugNames) {
    const mappings = await getRxNormICD10Mappings(drugName)
    if (mappings.length > 0) {
      results.set(drugName, mappings)
    }
    
    // Rate limiting: 1 request per 2 seconds to respect RxNorm API limits
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  return results
}

/**
 * Get RxNorm data quality metadata
 */
export function getRxNormDataQuality() {
  return {
    source: 'RXNORM_MESH',
    tier: 'TIER_2',
    authority: 'National Library of Medicine',
    confidence: 'MEDIUM',
    evidenceLevel: 'THERAPEUTIC_RELATIONSHIP',
    lastUpdated: new Date().toISOString(),
    url: 'https://clinicaltables.nlm.nih.gov/api/rxnorm/',
    description: 'RxNorm drug database with MeSH term mappings'
  }
}
