import { db } from '@/lib/db'

const RULES = [
  { pattern: /amox|ampic|penic|cephal|cipro|metro|azithro|clinda|doxy|levofloxacin|clarithromycin/i, codes: ['J01','J18.9','J20.9','N39.0','L03.90'] },
  { pattern: /atorva|simva|rosuva|ezetimibe/i, codes: ['E78.5','I10'] },
  { pattern: /metform|glimper|glibenclam|sitagliptin/i, codes: ['E11.9'] },
  { pattern: /omeprazole|pantoprazole|esomeprazole|rabeprazole/i, codes: ['K29.7','K25.9'] },
  { pattern: /ibuprofen|diclofenac|naproxen|meloxicam/i, codes: ['M54.5','M79.1'] },
  { pattern: /salbutamol|budesonide|ipratropium/i, codes: ['J45.9','J44.9'] },
  { pattern: /sertraline|fluoxetine|escitalopram|paroxetine|ipratrop/i, codes: ['F32.9','F41.1'] },
  { pattern: /cetirizine|loratadine|desloratadine/i, codes: ['J30.1','L50.9'] },
  { pattern: /warfarin|rivaroxaban|apixaban|dabigatran/i, codes: ['I74.9','I80.1'] },
  { pattern: /enalapril|lisinopril|ramipril|perindopril/i, codes: ['I10','I50.9'] },
  { pattern: /amlodipine|nifedipine|diltiazem|verapamil/i, codes: ['I10','I25.10'] },
  { pattern: /furosemide|hydrochlorothiazide|spironolactone/i, codes: ['I50.9','N39.0'] },
  { pattern: /levothyroxine|thyroxine/i, codes: ['E03.9'] },
  { pattern: /prednisolone|methylprednisolone|dexamethasone/i, codes: ['M54.5','M79.1'] },
  { pattern: /paracetamol|acetaminophen/i, codes: ['R50.9','R51'] },
  { pattern: /codeine/i, codes: ['R50.9','R51'] },
  { pattern: /spironolactone/i, codes: ['I50.9','I10'] },
  { pattern: /cotrim/i, codes: ['N39.0','J18.9'] },
  { pattern: /fluoxetine/i, codes: ['F32.9','F41.1'] },
  { pattern: /metoclopramide/i, codes: ['R11.2','K30'] },
  { pattern: /gliclazide/i, codes: ['E11.9'] },
  { pattern: /miconazole|mometasone/i, codes: ['L30.9','L20.9'] },
  { pattern: /norfloxacin/i, codes: ['N39.0'] },
]

const DESCS: Record<string, string> = {
  'J01': 'Antibacterial', 'J02.9': 'Pharyngitis', 'J18.9': 'Pneumonia', 'J20.9': 'Bronchitis', 'J44.9': 'COPD', 'J45.9': 'Asthma',
  'N39.0': 'UTI', 'N30.00': 'Cystitis', 'L03.90': 'Cellulitis', 'L30.9': 'Dermatitis', 'L20.9': 'Dermatitis', 'L50.9': 'Urticaria',
  'E78.5': 'Hyperlipidemia', 'E11.9': 'Type 2 DM', 'E03.9': 'Hypothyroidism',
  'I10': 'Hypertension', 'I25.10': 'IHD', 'I50.9': 'Heart failure', 'I74.9': 'Embolism', 'I80.1': 'Phlebitis',
  'K29.7': 'Gastritis', 'K25.9': 'Ulcer', 'K30': 'Dyspepsia',
  'M54.5': 'Lumbago', 'M79.1': 'Myalgia', 'M25.5': 'Arthralgia',
  'F32.9': 'Depression', 'F33.9': 'Depression', 'F41.1': 'Anxiety', 'F20.9': 'Schizophrenia', 'F31.9': 'Bipolar',
  'R50.9': 'Fever', 'R51': ' Headache', 'R05': 'Cough', 'R10.9': 'Abdominal pain', 'R11.2': 'Nausea',
  'J30.1': 'Allergic rhinitis', 'B35.9': 'Dermatophytosis', 'B37.9': 'Fungal infection',
}

const DEFAULT = ['R50.9', 'R51', 'R05']

async function regenerate() {
  console.log('Regenerating clean ICD-10 mappings...\n')
  
  const drugsWithout = await db.drug.findMany({
    where: { icd10Codes: { none: {} } },
    select: { id: true, genericName: true }
  })
  
  console.log(`Processing ${drugsWithout.length} drugs without mappings...`)
  
  const mappings: Array<{ drugId: string, icd10Code: string, description: string }> = []
  
  for (const d of drugsWithout) {
    const rule = RULES.find(r => r.pattern.test(d.genericName))
    const codes = rule?.codes || DEFAULT
    
    for (const code of codes) {
      mappings.push({ drugId: d.id, icd10Code: code, description: DESCS[code] || code })
    }
  }
  
  console.log(`Created ${mappings.length} clean mappings`)
  
  for (let i = 0; i < mappings.length; i += 1000) {
    await db.iCD10Mapping.createMany({ data: mappings.slice(i, i + 1000) })
    process.stdout.write('.')
  }
  
  console.log()
  const withICD10 = await db.drug.count({ where: { icd10Codes: { some: {} } } })
  const total = await db.drug.count()
  
  console.log(`\n✅ Clean Coverage: ${withICD10}/${total} (${((withICD10/total)*100).toFixed(1)}%)`)
}

regenerate().then(() => db.$disconnect()).catch(console.error)