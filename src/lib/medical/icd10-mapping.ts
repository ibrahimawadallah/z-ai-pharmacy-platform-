/**
 * Sophisticated ICD-10 Mapping System
 * 
 * This module provides comprehensive mapping from medical indications
 * to ICD-10 codes using medical terminology and condition recognition.
 * 
 * Based on WHO ICD-10-CM 2026 classification system
 */

interface ICD10Mapping {
  code: string
  description: string
  category: string
  keywords: string[]
  severity?: 'mild' | 'moderate' | 'severe'
}

/**
 * Comprehensive ICD-10 mapping database
 * Organized by medical categories with extensive keyword coverage
 */
const ICD10_MAPPINGS: ICD10Mapping[] = [
  // Cardiovascular
  {
    code: 'I10',
    description: 'Essential (primary) hypertension',
    category: 'cardiovascular',
    keywords: ['hypertension', 'high blood pressure', 'elevated blood pressure', 'bp', 'htn']
  },
  {
    code: 'I11',
    description: 'Hypertensive heart disease',
    category: 'cardiovascular',
    keywords: ['hypertensive heart', 'heart disease hypertension', 'cardiac hypertension']
  },
  {
    code: 'I12',
    description: 'Hypertensive renal disease',
    category: 'cardiovascular',
    keywords: ['hypertensive renal', 'kidney disease hypertension', 'renal hypertension']
  },
  {
    code: 'I50',
    description: 'Heart failure',
    category: 'cardiovascular',
    keywords: ['heart failure', 'cardiac failure', 'congestive heart failure', 'chf', 'ventricular failure']
  },
  {
    code: 'I48',
    description: 'Atrial fibrillation and flutter',
    category: 'cardiovascular',
    keywords: ['atrial fibrillation', 'afib', 'atrial flutter', 'irregular heartbeat', 'arrhythmia']
  },
  {
    code: 'I21',
    description: 'Acute myocardial infarction',
    category: 'cardiovascular',
    keywords: ['myocardial infarction', 'heart attack', 'mi', 'cardiac infarction', 'coronary infarction']
  },
  {
    code: 'I25',
    description: 'Chronic ischemic heart disease',
    category: 'cardiovascular',
    keywords: ['ischemic heart', 'coronary artery disease', 'cad', 'coronary heart disease', 'angina']
  },
  {
    code: 'I20',
    description: 'Angina pectoris',
    category: 'cardiovascular',
    keywords: ['angina', 'chest pain', 'angina pectoris', 'heart pain']
  },

  // Endocrine/Metabolic
  {
    code: 'E11',
    description: 'Type 2 diabetes mellitus',
    category: 'endocrine',
    keywords: ['type 2 diabetes', 'diabetes mellitus type 2', 't2dm', 'adult onset diabetes', 'non-insulin diabetes']
  },
  {
    code: 'E10',
    description: 'Type 1 diabetes mellitus',
    category: 'endocrine',
    keywords: ['type 1 diabetes', 'diabetes mellitus type 1', 't1dm', 'juvenile diabetes', 'insulin diabetes']
  },
  {
    code: 'E78',
    description: 'Disorders of lipoprotein metabolism and other lipidemias',
    category: 'endocrine',
    keywords: ['hyperlipidemia', 'high cholesterol', 'dyslipidemia', 'elevated lipids', 'lipid disorder']
  },
  {
    code: 'E66',
    description: 'Overweight and obesity',
    category: 'endocrine',
    keywords: ['obesity', 'overweight', 'bmi', 'adiposity', 'excess weight']
  },
  {
    code: 'E03',
    description: 'Other hypothyroidism',
    category: 'endocrine',
    keywords: ['hypothyroidism', 'underactive thyroid', 'low thyroid', 'thyroid deficiency']
  },
  {
    code: 'E05',
    description: 'Thyrotoxicosis',
    category: 'endocrine',
    keywords: ['hyperthyroidism', 'overactive thyroid', 'thyrotoxicosis', 'graves disease']
  },

  // Respiratory
  {
    code: 'J45',
    description: 'Asthma',
    category: 'respiratory',
    keywords: ['asthma', 'bronchial asthma', 'asthmatic', 'wheezing', 'bronchospasm']
  },
  {
    code: 'J44',
    description: 'Other chronic obstructive pulmonary disease',
    category: 'respiratory',
    keywords: ['copd', 'chronic obstructive pulmonary', 'emphysema', 'chronic bronchitis']
  },
  {
    code: 'J18',
    description: 'Pneumonia, unspecified',
    category: 'respiratory',
    keywords: ['pneumonia', 'lung infection', 'pulmonary infection', 'pneumonitis']
  },
  {
    code: 'J30',
    description: 'Vasomotor and allergic rhinitis',
    category: 'respiratory',
    keywords: ['rhinitis', 'allergic rhinitis', 'hay fever', 'nasal allergy', 'stuffy nose']
  },
  {
    code: 'J01',
    description: 'Acute sinusitis',
    category: 'respiratory',
    keywords: ['sinusitis', 'sinus infection', 'sinus inflammation', 'paranasal sinus']
  },
  {
    code: 'J06',
    description: 'Acute upper respiratory infections',
    category: 'respiratory',
    keywords: ['upper respiratory infection', 'uri', 'common cold', 'cold', 'viral infection']
  },

  // Mental Health
  {
    code: 'F32',
    description: 'Major depressive disorder, single episode',
    category: 'mental',
    keywords: ['depression', 'depressive', 'major depression', 'mdd', 'depressed mood']
  },
  {
    code: 'F33',
    description: 'Major depressive disorder, recurrent',
    category: 'mental',
    keywords: ['recurrent depression', 'chronic depression', 'persistent depression']
  },
  {
    code: 'F41',
    description: 'Other anxiety disorders',
    category: 'mental',
    keywords: ['anxiety', 'anxious', 'panic', 'generalized anxiety', 'gad', 'nervousness']
  },
  {
    code: 'F20',
    description: 'Schizophrenia',
    category: 'mental',
    keywords: ['schizophrenia', 'psychotic disorder', 'psychosis']
  },
  {
    code: 'F31',
    description: 'Bipolar disorder',
    category: 'mental',
    keywords: ['bipolar', 'manic depression', 'manic depressive', 'mood disorder']
  },
  {
    code: 'F43',
    description: 'Reaction to severe stress, and adjustment disorders',
    category: 'mental',
    keywords: ['ptsd', 'post traumatic stress', 'stress disorder', 'adjustment disorder']
  },

  // Neurological
  {
    code: 'G43',
    description: 'Migraine',
    category: 'neurological',
    keywords: ['migraine', 'migraine headache', 'vascular headache']
  },
  {
    code: 'G40',
    description: 'Epilepsy',
    category: 'neurological',
    keywords: ['epilepsy', 'seizure', 'convulsion', 'epileptic']
  },
  {
    code: 'G35',
    description: 'Multiple sclerosis',
    category: 'neurological',
    keywords: ['multiple sclerosis', 'ms', 'demyelinating disease']
  },
  {
    code: 'G62',
    description: 'Other polyneuropathies',
    category: 'neurological',
    keywords: ['neuropathy', 'nerve damage', 'peripheral neuropathy', 'neuralgia']
  },
  {
    code: 'R51',
    description: 'Headache',
    category: 'neurological',
    keywords: ['headache', 'cephalgia', 'head pain', 'tension headache']
  },

  // Gastrointestinal
  {
    code: 'K21',
    description: 'Gastro-esophageal reflux disease',
    category: 'gastrointestinal',
    keywords: ['gerd', 'reflux', 'acid reflux', 'heartburn', 'gastroesophageal reflux']
  },
  {
    code: 'K25',
    description: 'Gastric ulcer',
    category: 'gastrointestinal',
    keywords: ['gastric ulcer', 'stomach ulcer', 'peptic ulcer', 'ulcer']
  },
  {
    code: 'K29',
    description: 'Gastritis and duodenitis',
    category: 'gastrointestinal',
    keywords: ['gastritis', 'stomach inflammation', 'duodenitis', 'stomach irritation']
  },
  {
    code: 'K30',
    description: 'Functional dyspepsia',
    category: 'gastrointestinal',
    keywords: ['dyspepsia', 'indigestion', 'upset stomach', 'digestive discomfort']
  },
  {
    code: 'K59',
    description: 'Other functional intestinal disorders',
    category: 'gastrointestinal',
    keywords: ['constipation', 'diarrhea', 'ibs', 'irritable bowel', 'intestinal disorder']
  },

  // Musculoskeletal
  {
    code: 'M54',
    description: 'Dorsalgia',
    category: 'musculoskeletal',
    keywords: ['back pain', 'dorsalgia', 'lumbago', 'lower back pain', 'spine pain']
  },
  {
    code: 'M79',
    description: 'Other soft tissue disorders',
    category: 'musculoskeletal',
    keywords: ['muscle pain', 'soft tissue pain', 'myalgia', 'body aches']
  },
  {
    code: 'M25',
    description: 'Other joint disorder',
    category: 'musculoskeletal',
    keywords: ['joint pain', 'arthralgia', 'joint stiffness', 'joint swelling']
  },
  {
    code: 'M80',
    description: 'Osteoporosis with current pathological fracture',
    category: 'musculoskeletal',
    keywords: ['osteoporosis', 'bone loss', 'low bone density', 'fragile bones']
  },
  {
    code: 'M05',
    description: 'Rheumatoid arthritis',
    category: 'musculoskeletal',
    keywords: ['rheumatoid arthritis', 'ra', 'rheumatoid', 'autoimmune arthritis']
  },
  {
    code: 'M15',
    description: 'Polyosteoarthritis',
    category: 'musculoskeletal',
    keywords: ['osteoarthritis', 'oa', 'degenerative arthritis', 'wear and tear arthritis']
  },

  // Infectious Diseases
  {
    code: 'A00',
    description: 'Cholera',
    category: 'infectious',
    keywords: ['cholera', 'vibrio cholerae']
  },
  {
    code: 'A09',
    description: 'Other and unspecified infectious gastroenteritis and colitis',
    category: 'infectious',
    keywords: ['gastroenteritis', 'stomach flu', 'intestinal infection', 'infectious diarrhea']
  },
  {
    code: 'J01',
    description: 'Acute sinusitis',
    category: 'infectious',
    keywords: ['bacterial sinusitis', 'sinus infection bacterial']
  },
  {
    code: 'J02',
    description: 'Acute pharyngitis',
    category: 'infectious',
    keywords: ['strep throat', 'bacterial pharyngitis', 'throat infection']
  },
  {
    code: 'J03',
    description: 'Acute tonsillitis',
    category: 'infectious',
    keywords: ['tonsillitis', 'tonsil infection', 'acute tonsillitis']
  },

  // Dermatological
  {
    code: 'L30',
    description: 'Other dermatitis',
    category: 'dermatological',
    keywords: ['dermatitis', 'eczema', 'skin inflammation', 'rash', 'skin irritation']
  },
  {
    code: 'L20',
    description: 'Atopic dermatitis',
    category: 'dermatological',
    keywords: ['atopic dermatitis', 'eczema', 'atopic eczema', 'allergic dermatitis']
  },
  {
    code: 'L23',
    description: 'Allergic contact dermatitis',
    category: 'dermatological',
    keywords: ['contact dermatitis', 'allergic skin reaction', 'skin allergy']
  },
  {
    code: 'L70',
    description: 'Acne',
    category: 'dermatological',
    keywords: ['acne', 'pimples', 'breakouts', 'acne vulgaris']
  },
  {
    code: 'L40',
    description: 'Psoriasis',
    category: 'dermatological',
    keywords: ['psoriasis', 'psoriatic', 'skin plaques']
  },

  // Ophthalmological
  {
    code: 'H10',
    description: 'Conjunctivitis',
    category: 'ophthalmological',
    keywords: ['conjunctivitis', 'pink eye', 'eye inflammation', 'red eye']
  },
  {
    code: 'H52',
    description: 'Other disorders of refraction and accommodation',
    category: 'ophthalmological',
    keywords: ['refraction disorder', 'vision problem', 'nearsighted', 'farsighted']
  },
  {
    code: 'H40',
    description: 'Glaucoma',
    category: 'ophthalmological',
    keywords: ['glaucoma', 'ocular hypertension', 'eye pressure']
  },

  // Pain
  {
    code: 'R52',
    description: 'Pain, unspecified',
    category: 'pain',
    keywords: ['pain', 'ache', 'discomfort', 'soreness', 'hurt']
  },
  {
    code: 'R50',
    description: 'Fever of other and unknown origin',
    category: 'general',
    keywords: ['fever', 'pyrexia', 'elevated temperature', 'high temperature']
  },

  // Allergic/Immunological
  {
    code: 'J30',
    description: 'Allergic rhinitis',
    category: 'allergic',
    keywords: ['allergy', 'allergic reaction', 'hypersensitivity', 'allergic response']
  },
  {
    code: 'T78',
    description: 'Adverse effects, not elsewhere classified',
    category: 'allergic',
    keywords: ['allergic reaction', 'hypersensitivity reaction', 'anaphylaxis', 'allergic response']
  },

  // Genitourinary
  {
    code: 'N30',
    description: 'Cystitis',
    category: 'genitourinary',
    keywords: ['cystitis', 'bladder infection', 'uti', 'urinary tract infection', 'bladder inflammation']
  },
  {
    code: 'N40',
    description: 'Benign prostatic hyperplasia',
    category: 'genitourinary',
    keywords: ['bph', 'prostate enlargement', 'benign prostatic hyperplasia', 'prostate growth']
  },
  {
    code: 'N18',
    description: 'Chronic kidney disease',
    category: 'genitourinary',
    keywords: ['chronic kidney disease', 'ckd', 'renal failure', 'kidney failure']
  }
]

/**
 * Normalize indication text for matching
 */
function normalizeIndication(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

/**
 * Calculate match score between indication and ICD-10 mapping
 */
function calculateMatchScore(indication: string, mapping: ICD10Mapping): number {
  const normalizedIndication = normalizeIndication(indication)
  let score = 0
  
  // Check for exact keyword matches
  for (const keyword of mapping.keywords) {
    const normalizedKeyword = normalizeIndication(keyword)
    
    // Exact match
    if (normalizedIndication === normalizedKeyword) {
      score += 10
    }
    // Contains keyword
    else if (normalizedIndication.includes(normalizedKeyword)) {
      score += 5
    }
    // Keyword contains indication (for short indications)
    else if (normalizedKeyword.includes(normalizedIndication) && normalizedIndication.length > 3) {
      score += 3
    }
  }
  
  // Check for category-specific terms
  const categoryTerms = {
    cardiovascular: ['heart', 'cardiac', 'vascular', 'blood pressure', 'circulation'],
    endocrine: ['diabetes', 'thyroid', 'hormone', 'metabolic', 'glucose'],
    respiratory: ['lung', 'breathing', 'respiratory', 'pulmonary', 'breath'],
    mental: ['mental', 'psych', 'mood', 'anxiety', 'depression'],
    neurological: ['nerve', 'brain', 'neural', 'headache', 'seizure'],
    gastrointestinal: ['stomach', 'digestive', 'intestinal', 'gastric', 'bowel'],
    musculoskeletal: ['muscle', 'joint', 'bone', 'back', 'pain'],
    infectious: ['infection', 'bacterial', 'viral', 'infectious'],
    dermatological: ['skin', 'dermat', 'rash', 'cutaneous'],
    ophthalmological: ['eye', 'ocular', 'vision', 'ophthalm'],
    pain: ['pain', 'ache', 'discomfort'],
    allergic: ['allergy', 'allergic', 'hypersensitivity'],
    genitourinary: ['urinary', 'kidney', 'bladder', 'renal']
  }
  
  const categoryKeywords = categoryTerms[mapping.category as keyof typeof categoryTerms] || []
  for (const catKeyword of categoryKeywords) {
    if (normalizedIndication.includes(catKeyword)) {
      score += 2
    }
  }
  
  return score
}

/**
 * Convert indication text to ICD-10 codes with confidence scores
 * Returns sorted array of matches by confidence score
 */
export function convertIndicationToICD10Advanced(indication: string): Array<{
  code: string
  description: string
  confidence: number
  category: string
}> {
  const matches: Array<{
    code: string
    description: string
    confidence: number
    category: string
  }> = []
  
  for (const mapping of ICD10_MAPPINGS) {
    const score = calculateMatchScore(indication, mapping)
    
    if (score > 0) {
      // Normalize score to 0-100 range
      const confidence = Math.min(Math.round((score / 15) * 100), 100)
      
      matches.push({
        code: mapping.code,
        description: mapping.description,
        confidence,
        category: mapping.category
      })
    }
  }
  
  // Sort by confidence score (highest first)
  return matches.sort((a, b) => b.confidence - a.confidence)
}

/**
 * Get best ICD-10 match for an indication
 * Returns the highest confidence match or null if no good match found
 */
export function getBestICD10Match(indication: string, minConfidence: number = 50): {
  code: string
  description: string
  confidence: number
  category: string
} | null {
  const matches = convertIndicationToICD10Advanced(indication)
  
  if (matches.length === 0) {
    return null
  }
  
  const bestMatch = matches[0]
  
  return bestMatch.confidence >= minConfidence ? bestMatch : null
}

/**
 * Get ICD-10 mappings by category
 */
export function getICD10MappingsByCategory(category: string): ICD10Mapping[] {
  return ICD10_MAPPINGS.filter(mapping => mapping.category === category)
}

/**
 * Search ICD-10 mappings by keyword
 */
export function searchICD10Mappings(keyword: string): ICD10Mapping[] {
  const normalizedKeyword = normalizeIndication(keyword)
  
  return ICD10_MAPPINGS.filter(mapping => 
    mapping.keywords.some(k => normalizeIndication(k).includes(normalizedKeyword)) ||
    mapping.description.toLowerCase().includes(normalizedKeyword)
  )
}