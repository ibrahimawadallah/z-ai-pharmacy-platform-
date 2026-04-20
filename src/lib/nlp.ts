/**
 * NLP Utility Functions for Clinical AI Chatbot
 * Provides intent recognition, entity extraction, and query classification
 */

export interface DrugEntity {
  name: string
  dosage?: string
  route?: string
  frequency?: string
}

export interface ClinicalIntent {
  intent: string
  confidence: number
  drugs: DrugEntity[]
  conditions: string[]
  parameters: Record<string, any>
}

// ==================== INTENT CLASSIFICATION ====================

const INTENT_PATTERNS: Record<string, RegExp[]> = {
  'drug_lookup': [
    /\b(what is|tell me about|info about|information about|lookup|search for)\b.*\b(drug|medication|pill|tablet)\b/i,
    /\b(drug|medication|pill)\s+(profile|info|information|details)\b/i,
  ],
  'interaction_check': [
    /\b(interaction|interacts|interacting|combine|combination|together)\b/i,
    /\b(check|look for|find|see)\s+.*\binteraction\b/i,
    /\b(drug|medication)\s+(drug|medication)\s+(interaction|interacts)\b/i,
  ],
  'side_effects': [
    /\b(side effect|adverse effect|adverse reaction|side effects)\b/i,
    /\b(side|adverse|unwanted)\s+(effect|reaction)\b/i,
    /\bwhat\s+(happens|are)\s+.*\b(side|adverse)\b/i,
  ],
  'pregnancy_check': [
    /\b(pregnancy|pregnant|breastfeeding|breastfeeding|nursing)\b/i,
    /\b(safe|safety|category|risk)\s+.*\b(pregnancy|pregnant)\b/i,
  ],
  'dosage_info': [
    /\b(dose|dosage|dosing|how much|how many)\b/i,
    /\b(dose|dosage)\s+(recommend|guide|calculate|adjust)\b/i,
  ],
  'contraindication': [
    /\b(contraindicate|contraindication|avoid|shouldn't|should not)\b/i,
    /\b(safe|unsafe|danger|risk)\b.*\b(use|take|give)\b/i,
  ],
  'renal_adjustment': [
    /\b(renal|kidney)\s+(dose|adjust|adjustment|impair|failure|disease)\b/i,
    /\b(dose|adjust)\s+.*\b(renal|kidney|creatinine|crcl)\b/i,
  ],
  'hepatic_adjustment': [
    /\b(hepatic|liver)\s+(dose|adjust|adjustment|impair|failure|disease)\b/i,
    /\b(dose|adjust)\s+.*\b(hepatic|liver|hepat)\b/i,
  ],
  'g6pd_check': [
    /\b(g6pd|glucose-6-phosphate|deficiency)\b/i,
    /\b(safe|unsafe|risk)\s+.*\bg6pd\b/i,
  ],
  'alternative_drug': [
    /\b(alternative|substitute|instead|replace|replacement)\b/i,
    /\b(similar|compare|better)\s+.*\b(drug|medication|option)\b/i,
  ],
  'disease_lookup': [
    /\b(what is|tell me about|info about|information about|define|description)\b.*\b(disease|syndrome|disorder|condition)\b/i,
    /\b(diagnosis|diagnose|diagnostic)\b.*\b(criteria|test|how)\b/i,
    /\b(symptoms|signs|presentation)\b.*\b(of|for)\b/i,
  ],
  'treatment_recommendation': [
    /\b(treatment|treat|manage|management|therapy)\b.*\b(for|of)\b/i,
    /\b(first.?line|second.?line|drug of choice|recommended)\b/i,
    /\b(how to treat|what to prescribe|recommended treatment)\b/i,
  ],
  'differential_diagnosis': [
    /\b(differential|ddx|rule out|consider)\b/i,
    /\b(possible diagnosis|what could it be|diagnosis)\b/i,
  ],
}

// ==================== DRUG NAME PATTERNS ====================

// Common disease name patterns
const DISEASE_NAME_PATTERNS = [
  // Matches common disease names
  /\b(hypertension|diabetes|asthma|copd|pneumonia|epilepsy|migraine|depression|anxiety|arthritis|osteoporosis|heart failure|coronary artery disease|atrial fibrillation|copd|tuberculosis|anemia|thyroid|hypothyroidism|hyperthyroidism)\b/gi,
  // Matches "disease", "syndrome", "disorder" patterns
  /\b([A-Z][a-z]+\s+){0,3}(disease|syndrome|disorder|condition|syndrome)\b/gi,
]

// Common drug name patterns (brand and generic)

// Common drug name patterns (brand and generic)
const DRUG_NAME_PATTERNS = [
  // Matches drug names in the database
  /\b(paracetamol|acetaminophen|ibuprofen|aspirin|metformin|amoxicillin|ciprofloxacin|omeprazole|amlodipine|lisinopril|simvastatin|atorvastatin|levothyroxine|prednisone|prednisolone|tramadol|sertraline|fluoxetine|warfarin|furosemide|metoprolol|losartan|gabapentin|clopidogrel|metronidazole|doxycycline|ranitidine|salbutamol|diclofenac|carbamazepine|insulin|heparin|penicillin|cephalexin|azithromycin|erythromycin|nitrofurantoin|clindamycin|fluconazole|acyclovir|oseltamivir|lorazepam|diazepam|codeine|morphine|oxycodone|ondansetron|methyldopa|labetalol|nifedipine|magnesium|propranolol|hydrochlorothiazide|spironolactone|digoxin|colchicine|allopurinol|methotrexate|hydroxychloroquine|phenytoin|valproic|lamotrigine|levetiracetam|topiramate|amitriptyline|venlafaxine|escitalopram|paroxetine|lithium|quetiapine|risperidone|olanzapine|aripiprazole|haloperidol|chlorpromazine|clozapine)\b/gi,

  // Matches brand names
  /\b(noracin|noracod|noractone|oxetine|panadol|glucophage|aspro|augmentin|noroxine|lipitor|crestor|synthroid|deltasone|ultram|zoloft|prozac|coumadin|lasix|lopressor|prilosec|nexium|prevacid|zantac|pepcid|flagyl|vibramycin|diflucan|zovirax|tamiflu|ativan|valium|tylenol|advil|motrin|aleve|celebrex|voltaren|zyrtec|claritin|allegra|singulair|ventolin|proair|serevent|advair|symbicort|pulmicort|flovent)\b/gi,

  // Generic pattern: capitalized words followed by dosage form
  /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(tablet|capsule|injection|syrup|cream|ointment|gel|drops|spray|patch|suppository)\b/gi,
]

// ==================== ENTITY EXTRACTION ====================

export function extractDrugEntities(text: string): DrugEntity[] {
  const entities: DrugEntity[] = []
  const seen = new Set<string>()

  for (const pattern of DRUG_NAME_PATTERNS) {
    const matches = text.match(pattern)
    if (matches) {
      for (const match of matches) {
        const drugName = match.toLowerCase().trim()
        if (!seen.has(drugName) && drugName.length > 2) {
          seen.add(drugName)
          entities.push({ name: match })
        }
      }
    }
  }

  return entities
}

export function extractConditions(text: string): string[] {
  const conditionPatterns = [
    /\b(diabetes|hypertension|asthma|copd|heart failure|kidney disease|liver disease|epilepsy|depression|anxiety|bipolar|schizophrenia|arthritis|cancer|infection|pain|migraine)\b/gi,
    /\b(renal impairment|hepatic impairment|kidney failure|liver failure|heart disease|lung disease)\b/gi,
  ]

  const conditions: string[] = []
  const seen = new Set<string>()

  for (const pattern of conditionPatterns) {
    const matches = text.match(pattern)
    if (matches) {
      for (const match of matches) {
        const condition = match.toLowerCase().trim()
        if (!seen.has(condition)) {
          seen.add(condition)
          conditions.push(match)
        }
      }
    }
  }

  return conditions
}

// ==================== INTENT RECOGNITION ====================

export function classifyIntent(text: string): ClinicalIntent {
  const intentScores: Record<string, number> = {}

  // Score each intent pattern
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    let score = 0
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        score += 1
      }
    }
    if (score > 0) {
      intentScores[intent] = score
    }
  }

  // Find highest scoring intent
  let bestIntent = 'general_query'
  let bestScore = 0

  for (const [intent, score] of Object.entries(intentScores)) {
    if (score > bestScore) {
      bestIntent = intent
      bestScore = score
    }
  }

  // Extract entities
  const drugs = extractDrugEntities(text)
  const conditions = extractConditions(text)

  // Calculate confidence (0-1 scale)
  const confidence = Math.min(bestScore / 3, 1) // Max 3 patterns = 1.0 confidence

  return {
    intent: bestIntent,
    confidence,
    drugs,
    conditions,
    parameters: {}
  }
}

// ==================== QUERY PREPROCESSING ====================

export function preprocessQuery(query: string): string {
  return query
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/['"]/g, '') // Remove quotes
    .toLowerCase()
}

// ==================== INTENT-SPECIFIC RESPONSES ====================

export function getIntentDescription(intent: string): string {
  const descriptions: Record<string, string> = {
    'drug_lookup': 'Looking up drug information',
    'interaction_check': 'Checking drug interactions',
    'side_effects': 'Finding side effects',
    'pregnancy_check': 'Checking pregnancy safety',
    'dosage_info': 'Getting dosage information',
    'contraindication': 'Identifying contraindications',
    'renal_adjustment': 'Checking renal dose adjustments',
    'hepatic_adjustment': 'Checking hepatic dose adjustments',
    'g6pd_check': 'Checking G6PD safety',
    'alternative_drug': 'Finding drug alternatives',
    'general_query': 'Processing clinical query'
  }

  return descriptions[intent] || 'Processing your query'
}

// ==================== CLINICAL VALIDATION ====================

export function validateClinicalQuery(query: string): { valid: boolean; warnings: string[] } {
  const warnings: string[] = []
  const lowerQuery = query.toLowerCase()

  // Check for potentially unsafe queries
  const dangerousPatterns = [
    { pattern: /\b(kill|suicide|overdose|poison)\b/i, warning: 'This query contains concerning language. If this is a clinical emergency, please contact emergency services.' },
    { pattern: /\b(illegal|recreational|high|get high)\b/i, warning: 'This appears to be a non-clinical query. Please use this tool for professional clinical purposes only.' },
  ]

  for (const { pattern, warning } of dangerousPatterns) {
    if (pattern.test(lowerQuery)) {
      warnings.push(warning)
    }
  }

  // Check if query contains at least one drug name or clinical term
  const drugs = extractDrugEntities(query)
  const conditions = extractConditions(query)
  const intent = classifyIntent(query)

  if (drugs.length === 0 && conditions.length === 0 && intent.intent === 'general_query') {
    warnings.push('No specific drug or clinical condition detected. Please include drug names or clinical terms for better results.')
  }

  return {
    valid: warnings.length === 0,
    warnings
  }
}

// ==================== USAGE EXAMPLE ====================

/*
import { classifyIntent, extractDrugEntities, validateClinicalQuery } from '@/lib/nlp'

const query = "What are the interactions between Warfarin and Aspirin?"
const intent = classifyIntent(query)
const drugs = extractDrugEntities(query)
const validation = validateClinicalQuery(query)

console.log(intent)
// {
//   intent: 'interaction_check',
//   confidence: 0.67,
//   drugs: [{ name: 'Warfarin' }, { name: 'Aspirin' }],
//   conditions: [],
//   parameters: {}
// }
*/
