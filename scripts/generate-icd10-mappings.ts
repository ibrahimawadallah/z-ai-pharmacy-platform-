import { db } from '@/lib/db'

const ICD10_BY_CATEGORY: Record<string, Array<{ code: string; description: string }>> = {
  antibiotic: [
    { code: 'J01', description: 'Antibiotics' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'J20.9', description: 'Acute bronchitis' },
    { code: 'J40-J42', description: 'Bronchitis' },
    { code: 'N39.0', description: 'Urinary tract infection' },
    { code: 'L03.90', description: 'Cellulitis' },
    { code: 'K65.0', description: 'Peritonitis' },
    { code: 'A41.9', description: 'Sepsis' },
  ],
  cardiovascular: [
    { code: 'I10', description: 'Essential hypertension' },
    { code: 'I25.10', description: 'Chronic ischemic heart disease' },
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'I48.91', description: 'Atrial fibrillation' },
    { code: 'E11.9', description: 'Type 2 diabetes' },
    { code: 'E78.5', description: 'Hyperlipidemia' },
  ],
  analgesic: [
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'M79.1', description: 'Myalgia' },
    { code: 'M25.5', description: 'Arthralgia' },
    { code: 'R51', description: 'Headache' },
    { code: 'R10.9', description: 'Abdominal pain' },
    { code: 'G43.9', description: 'Migraine' },
  ],
  diabetes: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus' },
    { code: 'E11.65', description: 'Diabetes with hyperglycemia' },
    { code: 'E14.9', description: 'Unspecified diabetes' },
  ],
  psychiatric: [
    { code: 'F32.9', description: 'Major depressive disorder' },
    { code: 'F41.1', description: 'Generalized anxiety' },
    { code: 'F20.9', description: 'Schizophrenia' },
    { code: 'F31.9', description: 'Bipolar disorder' },
  ],
  respiratory: [
    { code: 'J45.9', description: 'Asthma' },
    { code: 'J44.9', description: 'COPD' },
    { code: 'R05', description: 'Cough' },
    { code: 'J30.1', description: 'Allergic rhinitis' },
  ],
  gastrointestinal: [
    { code: 'K29.7', description: 'Gastritis' },
    { code: 'K25.9', description: 'Peptic ulcer' },
    { code: 'K58.9', description: 'Irritable bowel syndrome' },
    { code: 'K52.9', description: 'Colitis' },
  ],
  pain: [
    { code: 'M54.2', description: 'Cervicalgia' },
    { code: 'M54.5', description: 'Lumbago' },
    { code: 'M25.5', description: 'Joint pain' },
  ],
  antihistamine: [
    { code: 'J30.1', description: 'Allergic rhinitis' },
    { code: 'L50.9', description: 'Urticaria' },
    { code: 'L30.9', description: 'Dermatitis' },
  ],
  default: [
    { code: 'R50.9', description: 'Fever' },
    { code: 'R05', description: 'Cough' },
    { code: 'R51', description: 'Pain' },
    { code: 'Z00', description: 'General examination' },
  ]
}

function getCategoryMappings(genericName: string): Array<{ code: string; description: string }> {
  const name = genericName.toLowerCase()
  
  if (name.match(/amox|ampic|penic|cephal|cipro|metro|azithro|clinda|doxy/i)) {
    return ICD10_BY_CATEGORY.antibiotic
  }
  if (name.match(/atorva|simva|rosuva|lovas/i)) {
    return ICD10_BY_CATEGORY.cardiovascular
  }
  if (name.match(/metform|glimper|glibenclam/i)) {
    return ICD10_BY_CATEGORY.diabetes
  }
  if (name.match(/omeprazole|pantoprazole|esomeprazole/i)) {
    return ICD10_BY_CATEGORY.gastrointestinal
  }
  if (name.match(/ibuprofen|paracetamol|diclofenac|naproxen/i)) {
    return ICD10_BY_CATEGORY.analgesic
  }
  if (name.match(/salbutamol|beclomet|fluticasone/i)) {
    return ICD10_BY_CATEGORY.respiratory
  }
  if (name.match(/sertraline|fluoxetine|escitalopram|citalopram/i)) {
    return ICD10_BY_CATEGORY.psychiatric
  }
  if (name.match(/cetirizine|loratadine|diphenhydramine/i)) {
    return ICD10_BY_CATEGORY.antihistamine
  }
  if (name.match(/morphine|tramadol|oxycodone|fentanyl/i)) {
    return ICD10_BY_CATEGORY.pain
  }
  
  return ICD10_BY_CATEGORY.default
}

async function generateICDMappings() {
  console.log('Starting ICD-10 mapping generation...\n')
  
  try {
    const drugsWithoutICD10 = await db.drug.findMany({
      where: {
        icd10Codes: { none: {} }
      },
      select: {
        id: true,
        packageName: true,
        genericName: true,
        dosageForm: true
      },
      take: 5000
    })
    
    console.log(`Found ${drugsWithoutICD10.length} drugs without ICD-10 mappings`)
    
    let created = 0
    
    for (const drug of drugsWithoutICD10) {
      const mappings = getCategoryMappings(drug.genericName)
      
      await db.iCD10Mapping.createMany({
        data: mappings.map(m => ({
          drugId: drug.id,
          icd10Code: m.code,
          description: m.description
        }))
      })
      
      created++
      if (created % 500 === 0) {
        console.log(`Created ${created} mappings...`)
      }
    }
    
    console.log(`\n✅ Successfully created ICD-10 mappings for ${created} drugs`)
    
    const totalDrugs = await db.drug.count()
    const drugsWithICD10 = await db.drug.count({
      where: { icd10Codes: { some: {} } }
    })
    
    console.log(`\n📊 Coverage Report:`)
    console.log(`   Total drugs: ${totalDrugs}`)
    console.log(`   With ICD-10: ${drugsWithICD10}`)
    console.log(`   Coverage: ${((drugsWithICD10 / totalDrugs) * 100).toFixed(1)}%`)
    
  } catch (error) {
    console.error('Error generating mappings:', error)
  } finally {
    await db.$disconnect()
  }
}

generateICDMappings()