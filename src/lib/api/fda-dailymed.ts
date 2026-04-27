/**
 * FDA DailyMed API Integration
 * Provides official FDA drug information including:
 * - Pregnancy categories
 * - Adverse reactions (side effects)
 * - Drug interactions
 * - Boxed warnings
 * - Contraindications
 */

const DAILYMED_BASE_URL = 'https://dailymed.nlm.nih.gov/dailymed'

interface DailyMedSearchResult {
  data: {
    id: string
    title: string
    set_id: string
  }[]
}

interface DailyMedDrugInfo {
  drug_interactions?: Array<{
      drug_name: string
      interaction: string
  }>
  adverse_reactions?: string
  boxed_warning?: string
  contraindications?: string
  pregnancy?: string
  warnings_and_precautions?: string
}

/**
 * Search for drug by generic name in DailyMed
 * Note: DailyMed API structure has changed, using alternative approach
 */
export async function searchDailyMed(genericName: string): Promise<string[]> {
  try {
    // Try the newer DailyMed API endpoint
    const response = await fetch(
      `https://dailymed.nlm.nih.gov/dailymed/services/v2/drugnames/search.json?query=${encodeURIComponent(genericName)}&limit=5`
    )
    
    if (!response.ok) {
      throw new Error(`DailyMed API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Handle different response structures
    if (data && data.data) {
      return data.data.map((drug: any) => drug.set_id || drug.id)
    }
    
    return []
  } catch (error) {
    console.error('DailyMed search error:', error)
    return []
  }
}

/**
 * Get detailed drug information from DailyMed
 */
export async function getDrugInfo(setId: string): Promise<DailyMedDrugInfo | null> {
  try {
    const response = await fetch(
      `${DAILYMED_BASE_URL}/api/v1/druginfo/${setId}.json`
    )
    
    if (!response.ok) {
      throw new Error(`DailyMed API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Extract relevant information from DailyMed response
    // This is a simplified extraction - actual DailyMed response structure is complex
    return {
      drug_interactions: extractDrugInteractions(data),
      adverse_reactions: extractAdverseReactions(data),
      boxed_warning: extractBoxedWarning(data),
      contraindications: extractContraindications(data),
      pregnancy: extractPregnancyInfo(data),
      warnings_and_precautions: extractWarnings(data)
    }
  } catch (error) {
    console.error('DailyMed drug info error:', error)
    return null
  }
}

/**
 * Extract drug interactions from DailyMed response
 */
function extractDrugInteractions(data: any): Array<{drug_name: string, interaction: string}> {
  // DailyMed response structure is complex - this is a simplified extraction
  // In production, you'd need to parse the actual SPL structure
  const interactions: Array<{drug_name: string, interaction: string}> = []
  
  try {
    // This would need to be adapted to actual DailyMed response structure
    if (data?.data?.drug_interactions) {
      return data.data.drug_interactions
    }
  } catch (error) {
    console.error('Error extracting interactions:', error)
  }
  
  return interactions
}

/**
 * Extract adverse reactions from DailyMed response
 */
function extractAdverseReactions(data: any): string {
  try {
    if (data?.data?.adverse_reactions) {
      return typeof data.data.adverse_reactions === 'string' 
        ? data.data.adverse_reactions 
        : JSON.stringify(data.data.adverse_reactions)
    }
  } catch (error) {
    console.error('Error extracting adverse reactions:', error)
  }
  
  return ''
}

/**
 * Extract boxed warning from DailyMed response
 */
function extractBoxedWarning(data: any): string {
  try {
    if (data?.data?.boxed_warning) {
      return typeof data.data.boxed_warning === 'string'
        ? data.data.boxed_warning
        : JSON.stringify(data.data.boxed_warning)
    }
  } catch (error) {
    console.error('Error extracting boxed warning:', error)
  }
  
  return ''
}

/**
 * Extract contraindications from DailyMed response
 */
function extractContraindications(data: any): string {
  try {
    if (data?.data?.contraindications) {
      return typeof data.data.contraindications === 'string'
        ? data.data.contraindications
        : JSON.stringify(data.data.contraindications)
    }
  } catch (error) {
    console.error('Error extracting contraindications:', error)
  }
  
  return ''
}

/**
 * Extract pregnancy information from DailyMed response
 */
function extractPregnancyInfo(data: any): string {
  try {
    if (data?.data?.pregnancy) {
      return typeof data.data.pregnancy === 'string'
        ? data.data.pregnancy
        : JSON.stringify(data.data.pregnancy)
    }
  } catch (error) {
    console.error('Error extracting pregnancy info:', error)
  }
  
  return ''
}

/**
 * Extract warnings from DailyMed response
 */
function extractWarnings(data: any): string {
  try {
    if (data?.data?.warnings_and_precautions) {
      return typeof data.data.warnings_and_precautions === 'string'
        ? data.data.warnings_and_precautions
        : JSON.stringify(data.data.warnings_and_precautions)
    }
  } catch (error) {
    console.error('Error extracting warnings:', error)
  }
  
  return ''
}

/**
 * Get FDA pregnancy category from text
 */
export function extractPregnancyCategory(pregnancyText: string): string | null {
  if (!pregnancyText) return null
  
  const categoryMatch = pregnancyText.match(/Pregnancy Category ([A-DX])/i)
  if (categoryMatch) {
    return categoryMatch[1].toUpperCase()
  }
  
  // Look for other pregnancy category indicators
  if (pregnancyText.toLowerCase().includes('category a')) return 'A'
  if (pregnancyText.toLowerCase().includes('category b')) return 'B'
  if (pregnancyText.toLowerCase().includes('category c')) return 'C'
  if (pregnancyText.toLowerCase().includes('category d')) return 'D'
  if (pregnancyText.toLowerCase().includes('category x')) return 'X'
  
  return null
}

/**
 * Parse adverse reactions into structured format
 */
export function parseAdverseReactions(adverseReactionsText: string): string[] {
  if (!adverseReactionsText) return []
  
  // Simple parsing - split by common delimiters
  const reactions = adverseReactionsText
    .split(/[,;]\s*/)
    .map(r => r.trim())
    .filter(r => r.length > 2 && r.length < 100) // Filter out very short/long entries
  
  return reactions.slice(0, 50) // Limit to top 50
}
