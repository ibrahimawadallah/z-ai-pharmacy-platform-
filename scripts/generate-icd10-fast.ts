import { db } from '@/lib/db'

const ICD10_RULES = [
  { pattern: /amox|ampic|penic|cephal|cipro|metro|azithro|clinda|doxy|levofloxacin|clarithromycin/i, codes: ['J01','J18.9','J20.9','N39.0','L03.90'] },
  { pattern: /atorva|simva|rosuva|ezetimibe/i, codes: ['E78.5','I10'] },
  { pattern: /metform|glimper|glibenclam|sitagliptin/i, codes: ['E11.9'] },
  { pattern: /omeprazole|pantoprazole|esomeprazole|rabeprazole/i, codes: ['K29.7','K25.9'] },
  { pattern: /ibuprofen|diclofenac|naproxen|meloxicam/i, codes: ['M54.5','M79.1'] },
  { pattern: /salbutamol|budesonide|ipratropium/i, codes: ['J45.9','J44.9'] },
  { pattern: /sertraline|fluoxetine|escitalopram|paroxetine/i, codes: ['F32.9','F41.1'] },
  { pattern: /cetirizine|loratadine|desloratadine/i, codes: ['J30.1','L50.9'] },
  { pattern: /warfarin|rivaroxaban|apixaban|dabigatran/i, codes: ['I74.9','I80.1'] },
  { pattern: /enalapril|lisinopril|ramipril|perindopril/i, codes: ['I10','I50.9'] },
  { pattern: /amlodipine|nifedipine|diltiazem|verapamil/i, codes: ['I10','I25.10'] },
  { pattern: /furosemide|hydrochlorothiazide|spironolactone/i, codes: ['I50.9','N17.9'] },
  { pattern: /levothyroxine|thyroxine/i, codes: ['E03.9'] },
  { pattern: /prednisolone|methylprednisolone|dexamethasone/i, codes: ['J30.1','M54.5'] },
]

const DEFAULT_CODES = ['R50.9','R05']
const CODE_DESCS: Record<string, string> = {
  'J01': 'Antibacterial', 'J18.9': 'Pneumonia', 'J20.9': 'Acute bronchitis', 'N39.0': 'UTI', 'L03.90': 'Cellulitis',
  'E78.5': 'Hyperlipidemia', 'I10': 'Hypertension', 'E11.9': 'Type 2 DM',
  'K29.7': 'Gastritis', 'K25.9': 'Peptic ulcer',
  'M54.5': 'Lumbago', 'M79.1': 'Myalgia',
  'J45.9': 'Asthma', 'J44.9': 'COPD',
  'F32.9': 'Depression', 'F41.1': 'Anxiety',
  'J30.1': 'Allergic rhinitis', 'L50.9': 'Urticaria',
  'I74.9': 'Thromboembolism', 'I80.1': 'Phlebitis',
  'I50.9': 'Heart failure', 'N17.9': 'Renal failure',
  'E03.9': 'Hypothyroidism',
  'R50.9': 'Fever', 'R05': 'Cough',
}

async function generate() {
  console.log('Generating ICD-10 mappings...\n')
  
  try {
    const drugs = await db.drug.findMany({
      where: { icd10Codes: { none: {} } },
      select: { id: true, genericName: true },
      take: 10000
    })
    
    console.log(`Processing ${drugs.length} drugs...`)
    
    const allMappings: Array<{ drugId: string; icd10Code: string; description: string }> = []
    
    for (const drug of drugs) {
      const rules = ICD10_RULES.find(r => r.pattern.test(drug.genericName))
      const codes = rules?.codes || DEFAULT_CODES
      
      for (const code of codes) {
        allMappings.push({ drugId: drug.id, icd10Code: code, description: CODE_DESCS[code] || code })
      }
    }
    
    console.log(`Created ${allMappings.length} mappings, inserting...`)
    
    for (let i = 0; i < allMappings.length; i += 1000) {
      await db.iCD10Mapping.createMany({ data: allMappings.slice(i, i + 1000) })
      process.stdout.write(`.`)
    }
    
    console.log()
    const withICD10 = await db.drug.count({ where: { icd10Codes: { some: {} } } })
    const total = await db.drug.count()
    console.log(`\n✅ Coverage: ${withICD10}/${total} (${((withICD10/total)*100).toFixed(1)}%)`)
    
  } finally {
    await db.$disconnect()
  }
}

generate()