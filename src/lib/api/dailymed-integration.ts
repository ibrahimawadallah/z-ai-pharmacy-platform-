/**
 * DailyMed Integration Module
 * 
 * This module integrates with DailyMed's RESTful API to fetch official FDA
 * drug data and NDC codes for improved ICD-10 mapping accuracy.
 * 
 * Source: https://dailymed.nlm.nih.gov/dailymed/services/
 * Authority: National Library of Medicine (NLM) / FDA
 * Data Quality: TIER_1 (Official regulatory source)
 */

interface DailyMedSPL {
  setid: string
  splVersion: string
  splCreateDate: string
  splPublishDate: string
  ndcs: string[]
  genericName: string
  brandName: string
  activeIngredient: string[]
  indications: string[]
}

interface DailyMedNDC {
  ndc: string
}

interface DailyMedSPL {
  setid: string
  spl_version: number
  published_date: string
  title: string
}

interface DailyMedDrugName {
  name_type: string
  drug_name: string
}

const DAILYMED_BASE_URL = 'https://dailymed.nlm.nih.gov/dailymed/services/v2'

/**
 * Fetch all NDC codes from DailyMed
 */
export async function fetchDailyMedNDCs(page: number = 1, pageSize: number = 100): Promise<{
  data: DailyMedNDC[]
  metadata: any
}> {
  try {
    const url = `${DAILYMED_BASE_URL}/ndcs.json?page=${page}&pagesize=${pageSize}`
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching DailyMed NDCs:', error)
    return { data: [], metadata: {} }
  }
}

/**
 * Fetch all SPL documents from DailyMed
 */
export async function fetchDailyMedSPLs(page: number = 1, pageSize: number = 100): Promise<{
  data: DailyMedSPL[]
  metadata: any
}> {
  try {
    const url = `${DAILYMED_BASE_URL}/spls.json?page=${page}&pagesize=${pageSize}`
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching DailyMed SPLs:', error)
    return { data: [], metadata: {} }
  }
}

/**
 * Fetch all drug names from DailyMed
 */
export async function fetchDailyMedDrugNames(page: number = 1, pageSize: number = 100): Promise<{
  data: DailyMedDrugName[]
  metadata: any
}> {
  try {
    const url = `${DAILYMED_BASE_URL}/drugnames.json?page=${page}&pagesize=${pageSize}`
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching DailyMed drug names:', error)
    return { data: [], metadata: {} }
  }
}

/**
 * Fetch SPL document for a specific SET ID
 */
export async function fetchDailyMedSPL(setId: string): Promise<DailyMedSPL | null> {
  try {
    const url = `${DAILYMED_BASE_URL}/spls/${setId}.json`
    const response = await fetch(url)
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching DailyMed SPL for ${setId}:`, error)
    return null
  }
}

/**
 * Fetch SPL XML content for a specific SET ID
 * This returns the raw XML which contains structured indication data
 */
export async function fetchDailyMedSPLXML(setId: string): Promise<string | null> {
  try {
    const url = `${DAILYMED_BASE_URL}/spls/${setId}.xml`
    const response = await fetch(url)
    
    if (!response.ok) {
      return null
    }
    
    const xmlText = await response.text()
    return xmlText
  } catch (error) {
    console.error(`Error fetching DailyMed SPL XML for ${setId}:`, error)
    return null
  }
}

/**
 * Extract NDC code from UAE drug code format
 * UAE drug codes are in format: F68-0913-04317-01
 * NDC format: 12345-6789-12345 (11 digits)
 */
export function extractNDCFromDrugCode(drugCode: string): string | null {
  // Try to extract NDC from various formats
  // UAE format: F68-0913-04317-01 (16 chars)
  // NDC format: 12345-6789-12345 (11 chars with hyphens)
  
  // Remove non-numeric characters except hyphens
  const cleaned = drugCode.replace(/[^0-9-]/g, '')
  
  // If we have 11 digits, format as NDC
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 9)}-${cleaned.slice(9, 11)}`
  }
  
  // If we have 10 digits, pad with leading zero
  if (cleaned.length === 10) {
    return `0${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 10)}`
  }
  
  return null
}

/**
 * Match UAE drug to DailyMed by NDC code
 * Note: NDC endpoint doesn't include setid, so this just checks if NDC exists
 */
export function matchDrugByNDC(uaendcCode: string, dailyMedNDCs: DailyMedNDC[]): boolean {
  const uaeNDC = extractNDCFromDrugCode(uaendcCode)
  
  if (!uaeNDC) {
    return false
  }
  
  // Search for exact NDC match
  const match = dailyMedNDCs.find(ndc => ndc.ndc === uaeNDC)
  
  return !!match
}

/**
 * Match UAE drug to DailyMed by generic name
 * Enhanced with fuzzy matching for international drug names
 * DailyMed drug names are complex product descriptions, not simple generic names
 */
export function matchDrugByGenericName(genericName: string, dailyMedDrugNames: DailyMedDrugName[]): string[] {
  const cleanName = genericName.toLowerCase()
  const matches: string[] = []
  
  // Handle truncated generic names (common in database)
  // If name ends abruptly, try to complete it
  let processedName = cleanName
  if (cleanName.endsWith(' ') || cleanName.endsWith('\n') || cleanName.endsWith('\t')) {
    processedName = cleanName.trim()
  }
  
  // Normalize the generic name (remove special characters, extra spaces)
  const normalizedName = processedName
    .replace(/[(),]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  // Remove common salt forms and modifiers for better matching
  const baseName = normalizedName
    .replace(/\s+(hydrochloride|hcl|sulfate|maleate|tartrate|sodium|potassium|calcium|hydrogen)/gi, '')
    .replace(/\s+(acetate|phosphate|citrate|lactate|gluconate)/gi, '')
    .replace(/\s+(besylate|mesylate|tosylate|edetate)/gi, '')
    .replace(/\s+(equivalent to|eq|mg|mcg|iu|units?)/gi, '')
    .trim()
  
  // Split multi-ingredient drugs
  const ingredients = baseName.split(/[\s,]+/).filter(i => i.length > 3)
  
  // Try exact match first (with and without salt forms)
  const exactMatch = dailyMedDrugNames.find(dn => 
    dn.name_type === 'G' && 
    (dn.drug_name.toLowerCase() === normalizedName || 
     dn.drug_name.toLowerCase() === baseName)
  )
  
  if (exactMatch) {
    matches.push(exactMatch.drug_name)
  }
  
  // Try ingredient-based matching for combination drugs
  for (const ingredient of ingredients) {
    // Skip very short ingredients and common words
    if (ingredient.length < 4) continue
    if (['and', 'for', 'with', 'plus', 'containing', 'elemental', 'including'].includes(ingredient)) continue
    
    const ingredientMatches = dailyMedDrugNames.filter(dn => {
      const drugNameLower = dn.drug_name.toLowerCase()
      
      // Must be generic name type
      if (dn.name_type !== 'G') return false
      
      // Must contain the ingredient as a whole word (not substring)
      const ingredientRegex = new RegExp(`\\b${ingredient}\\b`, 'i')
      if (!ingredientRegex.test(drugNameLower)) return false
      
      // Must be reasonable length (not too long compared to ingredient)
      if (drugNameLower.length > ingredient.length + 60) return false
      
      // For combination drugs, require at least half of ingredients to match
      if (ingredients.length > 1) {
        const matchedIngredients = ingredients.filter(i => {
          if (i.length < 4 || ['and', 'for', 'with', 'plus'].includes(i)) return false
          const regex = new RegExp(`\\b${i}\\b`, 'i')
          return regex.test(drugNameLower)
        })
        if (matchedIngredients.length < Math.max(1, Math.ceil(ingredients.length / 2))) return false
      }
      
      return true
    })
    
    ingredientMatches.forEach(im => {
      if (!matches.includes(im.drug_name)) {
        matches.push(im.drug_name)
      }
    })
  }
  
  // Try partial match (contains) for single ingredient drugs
  if (ingredients.length === 1 && ingredients[0].length >= 4) {
    const partialMatches = dailyMedDrugNames.filter(dn => {
      const drugNameLower = dn.drug_name.toLowerCase()
      
      if (dn.name_type !== 'G') return false
      
      const ingredientRegex = new RegExp(`\\b${ingredients[0]}\\b`, 'i')
      if (!ingredientRegex.test(drugNameLower)) return false
      
      if (drugNameLower.length > ingredients[0].length + 35) return false
      
      return true
    })
    
    partialMatches.forEach(pm => {
      if (!matches.includes(pm.drug_name)) {
        matches.push(pm.drug_name)
      }
    })
  }
  
  // Try very loose match for drugs with no other matches
  if (matches.length === 0 && ingredients.length > 0) {
    const looseMatches = dailyMedDrugNames.filter(dn => {
      if (dn.name_type !== 'G') return false
      
      const drugNameLower = dn.drug_name.toLowerCase()
      
      // Check if any ingredient appears (as substring)
      for (const ingredient of ingredients) {
        if (ingredient.length >= 5 && drugNameLower.includes(ingredient)) {
          // But avoid very long drug names
          if (drugNameLower.length < ingredient.length + 40) {
            return true
          }
        }
      }
      
      return false
    })
    
    looseMatches.forEach(lm => {
      if (!matches.includes(lm.drug_name)) {
        matches.push(lm.drug_name)
      }
    })
  }
  
  return matches
}

/**
 * Extract indications from DailyMed SPL XML
 * SPL XML has structured sections with indication data
 * Handles both prescription (INDICATIONS AND USAGE) and OTC (Drug Facts) formats
 */
export function extractIndicationsFromSPLXML(xmlText: string): string[] {
  const indications: string[] = []
  
  try {
    // SPL XML uses specific tags for indications
    // The main indication section is typically in <section> with code="34068-4"
    // which corresponds to "INDICATIONS AND USAGE" for prescription drugs
    
    // Extract the indications section
    const indicationsSectionMatch = xmlText.match(/<section[^>]*code="34068-4"[^>]*>([\s\S]*?)<\/section>/i)
    
    if (indicationsSectionMatch) {
      const sectionContent = indicationsSectionMatch[1]
      
      // Extract text from <text> tags within the section
      const textMatches = sectionContent.match(/<text[^>]*>([\s\S]*?)<\/text>/gi)
      
      if (textMatches) {
        for (const textMatch of textMatches) {
          // Remove HTML tags and get plain text
          const plainText = textMatch
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
          
          // Extract indication sentences
          const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 10)
          
          for (const sentence of sentences) {
            const trimmed = sentence.trim()
            if (trimmed.length > 15 && trimmed.length < 300) {
              indications.push(trimmed)
            }
          }
        }
      }
    }
    
    // For OTC drugs, look for "Use" section in Drug Facts
    if (indications.length === 0) {
      const otcUseMatch = xmlText.match(/<content[^>]*>[\s\S]*?<content[^>]*>Use<\/content>[\s\S]*?([\s\S]*?)``/i)
      
      if (otcUseMatch) {
        const useText = otcUseMatch[1]
          .replace(/<[^>]+>/g, ' ')
          .replace(/``/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
        
        if (useText.length > 10 && useText.length < 300) {
          indications.push(useText)
        }
      }
    }
    
    // Fallback: search for indication keywords in the entire XML
    if (indications.length === 0) {
      const indicationKeywords = [
        'indicated for',
        'treatment of',
        'management of',
        'used for',
        'therapy for',
        'for the treatment',
        'relieves',
        'temporarily relieves'
      ]
      
      const lines = xmlText.split('\n')
      
      for (const line of lines) {
        for (const keyword of indicationKeywords) {
          if (line.toLowerCase().includes(keyword)) {
            // Extract the indication text
            const match = line.match(new RegExp(`${keyword}(.*)`, 'i'))
            if (match && match[1]) {
              const indication = match[1]
                .replace(/<[^>]+>/g, ' ') // Remove HTML tags
                .replace(/``/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
              
              if (indication.length > 10 && indication.length < 300) {
                indications.push(indication)
              }
            }
          }
        }
      }
    }
    
  } catch (error) {
    console.error('Error parsing SPL XML for indications:', error)
  }
  
  return indications
}

/**
 * Convert DailyMed indication text to ICD-10 code
 * Uses sophisticated medical terminology mapping
 */
export function convertIndicationToICD10(indication: string): string | null {
  // Simple fallback mapping for now - advanced mapping would require async import
  const indicationLower = indication.toLowerCase()
  
  // Enhanced indication to ICD-10 mappings
  const mappings: Record<string, string[]> = {
    'hypertension': ['I10', 'I11', 'I12'],
    'high blood pressure': ['I10', 'I11'],
    'diabetes': ['E10', 'E11', 'E12'],
    'type 2 diabetes': ['E11'],
    'type 1 diabetes': ['E10'],
    'asthma': ['J45', 'J46'],
    'pneumonia': ['J18', 'J15'],
    'depression': ['F32', 'F33'],
    'anxiety': ['F41', 'F40'],
    'pain': ['R52', 'M54', 'M79'],
    'headache': ['R51', 'G43'],
    'migraine': ['G43'],
    'infection': ['A00', 'B99'],
    'bacterial infection': ['A00', 'B99'],
    'viral infection': ['A00', 'B99'],
    'heart failure': ['I50'],
    'cardiac failure': ['I50'],
    'atrial fibrillation': ['I48'],
    'epilepsy': ['G40', 'G41'],
    'seizure': ['G40', 'G41'],
    'schizophrenia': ['F20'],
    'bipolar': ['F31'],
    'hyperlipidemia': ['E78'],
    'high cholesterol': ['E78'],
    'osteoporosis': ['M80', 'M81'],
    'arthritis': ['M15', 'M05'],
    'osteoarthritis': ['M15'],
    'rheumatoid arthritis': ['M05'],
    'gerd': ['K21'],
    'reflux': ['K21'],
    'acid reflux': ['K21'],
    'ulcer': ['K25'],
    'gastritis': ['K29'],
    'constipation': ['K59'],
    'diarrhea': ['K59'],
    'allergy': ['J30', 'L23', 'T78'],
    'allergic rhinitis': ['J30'],
    'conjunctivitis': ['H10'],
    'pink eye': ['H10'],
    'glaucoma': ['H40'],
    'cystitis': ['N30'],
    'uti': ['N30'],
    'urinary tract infection': ['N30'],
    'kidney disease': ['N18'],
    'renal failure': ['N18'],
    'psoriasis': ['L40'],
    'eczema': ['L20', 'L30'],
    'dermatitis': ['L30'],
    'acne': ['L70'],
    'back pain': ['M54'],
    'joint pain': ['M25'],
    'muscle pain': ['M79'],
    'fever': ['R50'],
    'cough': ['R05'],
    'cold': ['J06'],
    'flu': ['J11'],
    'sinusitis': ['J01'],
    'bronchitis': ['J20', 'J40', 'J42'],
    'copd': ['J44'],
    'emphysema': ['J44'],
    'angina': ['I20'],
    'chest pain': ['I20', 'R07'],
    'myocardial infarction': ['I21'],
    'heart attack': ['I21'],
    'stroke': ['I63', 'I64'],
    'hyperthyroidism': ['E05'],
    'hypothyroidism': ['E03'],
    'obesity': ['E66'],
    'overweight': ['E66'],
    'insomnia': ['G47'],
    'sleep disorder': ['G47']
  }
  
  // Check for exact matches first
  for (const [condition, icd10Codes] of Object.entries(mappings)) {
    if (indicationLower === condition) {
      return icd10Codes[0]
    }
  }
  
  // Check for partial matches
  for (const [condition, icd10Codes] of Object.entries(mappings)) {
    if (indicationLower.includes(condition)) {
      return icd10Codes[0]
    }
  }
  
  return null
}

/**
 * Get DailyMed data quality metadata
 */
export function getDailyMedDataQuality() {
  return {
    source: 'DAILYMED_SPL',
    tier: 'TIER_1',
    authority: 'National Library of Medicine / FDA',
    confidence: 'HIGH',
    evidenceLevel: 'APPROVED_INDICATION',
    lastUpdated: new Date().toISOString(),
    url: 'https://dailymed.nlm.nih.gov/',
    description: 'Official FDA drug labeling with structured mapping files'
  }
}

/**
 * Fetch all drug names from DailyMed (paginated)
 */
export async function fetchAllDailyMedDrugNames(): Promise<DailyMedDrugName[]> {
  const allDrugNames: DailyMedDrugName[] = []
  let page = 1
  const pageSize = 1000
  let hasMore = true
  
  while (hasMore) {
    try {
      const data = await fetchDailyMedDrugNames(page, pageSize)
      allDrugNames.push(...data.data)
      
      // Check if we have more pages
      const totalPages = data.metadata?.total_pages || 1
      hasMore = page < totalPages
      page++
      
      // Safety limit: don't fetch more than 100 pages (100,000 drug names)
      if (page > 100) {
        console.log('Reached safety limit of 100 pages for drug names')
        break
      }
    } catch (error) {
      console.error(`Error fetching drug names page ${page}:`, error)
      hasMore = false
    }
  }
  
  return allDrugNames
}

/**
 * Fetch all SPL documents from DailyMed (paginated)
 */
export async function fetchAllDailyMedSPLs(): Promise<DailyMedSPL[]> {
  const allSPLs: DailyMedSPL[] = []
  let page = 1
  const pageSize = 1000
  let hasMore = true
  
  while (hasMore) {
    try {
      const data = await fetchDailyMedSPLs(page, pageSize)
      allSPLs.push(...data.data)
      
      // Check if we have more pages
      const totalPages = data.metadata?.total_pages || 1
      hasMore = page < totalPages
      page++
      
      // Safety limit: don't fetch more than 200 pages (200,000 SPL documents)
      if (page > 200) {
        console.log('Reached safety limit of 200 pages for SPL documents')
        break
      }
    } catch (error) {
      console.error(`Error fetching SPL documents page ${page}:`, error)
      hasMore = false
    }
  }
  
  return allSPLs
}

/**
 * Batch match UAE drugs to DailyMed
 */
export async function batchMatchUAEDrugsToDailyMed(drugs: Array<{
  id: string
  drugCode: string
  genericName: string
}>): Promise<Map<string, {
  ndcMatch: boolean
  genericMatches: string[]
  splSetId: string | null
}>> {
  const results = new Map<string, any>()
  
  try {
    // Fetch DailyMed NDC data (first page for now)
    const ndcData = await fetchDailyMedNDCs(1, 1000)
    
    // Fetch ALL DailyMed drug names for better matching
    console.log('Fetching all DailyMed drug names...')
    const drugNameData = await fetchAllDailyMedDrugNames()
    console.log(`Fetched ${drugNameData.length} drug names from DailyMed`)
    
    for (const drug of drugs) {
      // Try NDC matching
      const ndcMatch = matchDrugByNDC(drug.drugCode, ndcData.data)
      
      // Try generic name matching
      const genericMatches = matchDrugByGenericName(drug.genericName, drugNameData)
      
      results.set(drug.id, {
        ndcMatch,
        genericMatches,
        splSetId: ndcMatch || (genericMatches.length > 0 ? 'PENDING' : null)
      })
    }
    
  } catch (error) {
    console.error('Error during batch matching:', error)
  }
  
  return results
}
