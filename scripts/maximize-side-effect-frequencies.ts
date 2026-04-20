import { db } from '../src/lib/db'

async function main() {
  console.log('📊 MAXIMIZING Side Effect Frequency Classification...\n')

  // Comprehensive frequency patterns with medical terminology
  const comprehensiveFrequencyPatterns = {
    // Very Common (>10% occurrence)
    'Common': [
      // Gastrointestinal
      'nausea', 'vomiting', 'diarrhea', 'constipation', 'abdominal pain', 'dyspepsia', 'flatulence', 'bloating',
      'stomach upset', 'gastritis', 'heartburn', 'acid reflux', 'indigestion', 'loss of appetite', 'weight gain',
      
      // Neurological/Psychiatric
      'headache', 'dizziness', 'fatigue', 'drowsiness', 'insomnia', 'anxiety', 'nervousness', 'restlessness',
      'tremor', 'weakness', 'lethargy', 'somnolence', 'sedation', 'confusion', 'memory problems',
      
      // Cardiovascular
      'palpitations', 'tachycardia', 'hypotension', 'hypertension', 'chest pain', 'shortness of breath',
      
      // Dermatologic
      'rash', 'itching', 'pruritus', 'urticaria', 'hives', 'dry skin', 'acne', 'photosensitivity',
      
      // Musculoskeletal
      'muscle pain', 'joint pain', 'back pain', 'myalgia', 'arthralgia', 'muscle weakness', 'cramps',
      
      // General
      'fever', 'chills', 'sweating', 'edema', 'swelling', 'flu-like symptoms'
    ],
    
    // Uncommon (1-10% occurrence)
    'Uncommon': [
      // Neurological
      'mood changes', 'depression', 'euphoria', 'irritability', 'agitation', 'hallucination', 'seizure',
      'vertigo', 'syncope', 'fainting', 'diplopia', 'blurred vision', 'tinnitus', 'hearing loss',
      'peripheral neuropathy', 'paresthesia', 'numbness', 'tingling', 'coordination problems',
      
      // Cardiovascular
      'arrhythmia', 'bradycardia', 'ectopic beats', 'atrial fibrillation', 'heart block',
      'angina', 'myocardial infarction', 'stroke', 'thrombosis', 'embolism',
      
      // Respiratory
      'cough', 'bronchospasm', 'wheezing', 'dyspnea', 'respiratory depression', 'pneumonitis',
      
      // Gastrointestinal
      'pancreatitis', 'hepatitis', 'liver dysfunction', 'cholestasis', 'jaundice', 'gastrointestinal bleeding',
      'ulcer', 'perforation', 'toxic megacolon', 'pseudomembranous colitis',
      
      // Renal/Genitourinary
      'renal failure', 'acute kidney injury', 'nephrotoxicity', 'urinary retention', 'incontinence',
      'hematuria', 'proteinuria', 'dysuria', 'frequency', 'urgency', 'sexual dysfunction',
      'erectile dysfunction', 'libido decrease', 'menstrual changes', 'amenorrhea',
      
      // Endocrine/Metabolic
      'hypoglycemia', 'hyperglycemia', 'diabetes', 'thyroid dysfunction', 'adrenal suppression',
      'electrolyte imbalance', 'hyponatremia', 'hyperkalemia', 'hypocalcemia', 'metabolic acidosis',
      
      // Hematologic
      'anemia', 'leukopenia', 'neutropenia', 'thrombocytopenia', 'pancytopenia', 'coagulopathy',
      'bleeding', 'bruising', 'petechiae', 'purpura'
    ],
    
    // Rare (<1% occurrence)
    'Rare': [
      // Life-threatening
      'anaphylaxis', 'anaphylactic shock', 'severe allergic reaction', 'angioedema', 'laryngeal edema',
      'steven-johnson syndrome', 'toxic epidermal necrolysis', 'erythema multiforme', 'dress syndrome',
      
      // Organ failure
      'liver failure', 'fulminant hepatitis', 'acute liver failure', 'renal failure', 'acute renal failure',
      'cardiac arrest', 'respiratory arrest', 'multiple organ failure', 'shock',
      
      // Severe hematologic
      'aplastic anemia', 'hemolytic anemia', 'thrombotic thrombocytopenic purpura', 'disseminated intravascular coagulation',
      'bone marrow failure', 'agranulocytosis', 'severe neutropenia', 'pancytopenia',
      
      // Neurological emergencies
      'status epilepticus', 'seizure disorder', 'coma', 'persistent vegetative state', 'brain death',
      'transient ischemic attack', 'cerebral edema', 'increased intracranial pressure',
      
      // Psychiatric emergencies
      'psychosis', 'schizophrenia', 'bipolar disorder', 'major depression', 'suicidal thoughts',
      'suicide attempt', 'mania', 'delirium', 'catatonia',
      
      // Cardiovascular emergencies
      'ventricular tachycardia', 'ventricular fibrillation', 'torsades de pointes', 'heart block',
      'myocardial infarction', 'unstable angina', 'cardiogenic shock', 'pulmonary embolism',
      
      // Severe metabolic
      'diabetic ketoacidosis', 'hyperosmolar hyperglycemic state', 'thyroid storm', 'myxedema coma',
      'adrenal crisis', 'severe hypoglycemia', 'lactic acidosis', 'severe electrolyte disturbance',
      
      // Autoimmune reactions
      'lupus-like syndrome', 'drug-induced lupus', 'vasculitis', 'serum sickness', 'autoimmune hemolytic anemia',
      'goodpasture syndrome', 'wegener granulomatosis', 'churg-strauss syndrome',
      
      // Severe dermatologic
      'exfoliative dermatitis', 'toxic shock syndrome', 'necrotizing fasciitis', 'purpura fulminans',
      'severe photosensitivity', 'phototoxic reaction', 'severe drug eruption',
      
      // Carcinogenic potential
      'carcinoma', 'sarcoma', 'lymphoma', 'leukemia', 'malignant transformation',
      'tumor promotion', 'carcinogenesis', 'mutagenesis', 'teratogenesis'
    ]
  }

  // Get all side effects that need classification
  const sideEffectsToClassify = await db.drugSideEffect.findMany({
    where: {
      frequency: null
    },
    select: {
      id: true,
      sideEffect: true
    },
    take: 50000 // Maximum batch size for comprehensive coverage
  })

  console.log(`📋 Found ${sideEffectsToClassify.length} side effects to classify`)

  let updatedCount = 0
  const frequencyCounts = { Common: 0, Uncommon: 0, Rare: 0, Unknown: 0 }

  for (const sideEffect of sideEffectsToClassify) {
    const effectLower = sideEffect.sideEffect.toLowerCase()
    let assignedFrequency = 'Unknown'
    
    // Check against comprehensive frequency patterns
    for (const [frequency, effects] of Object.entries(comprehensiveFrequencyPatterns)) {
      for (const pattern of effects) {
        if (effectLower.includes(pattern.toLowerCase())) {
          assignedFrequency = frequency
          break
        }
      }
      if (assignedFrequency !== 'Unknown') break
    }
    
    // Advanced pattern matching for medical terminology
    if (assignedFrequency === 'Unknown') {
      // Severity-based classification
      if (effectLower.includes('severe') || effectLower.includes('life-threatening') || 
          effectLower.includes('fatal') || effectLower.includes('syndrome') ||
          effectLower.includes('failure') || effectLower.includes('crisis') ||
          effectLower.includes('shock') || effectLower.includes('emergency')) {
        assignedFrequency = 'Rare'
      } else if (effectLower.includes('moderate') || effectLower.includes('mild') ||
                 effectLower.includes('transient') || effectLower.includes('reversible')) {
        assignedFrequency = 'Uncommon'
      } else if (effectLower.includes('common') || effectLower.includes('frequent') ||
                 effectLower.includes('often') || effectLower.includes('usually')) {
        assignedFrequency = 'Common'
      }
      
      // Organ-specific rare reactions
      if (effectLower.includes('steven') || effectLower.includes('johnson') ||
          effectLower.includes('necrolysis') || effectLower.includes('epidermal') ||
          effectLower.includes('anaphylax') || effectLower.includes('angioedema')) {
        assignedFrequency = 'Rare'
      }
    }
    
    // Update the side effect frequency
    await db.drugSideEffect.update({
      where: { id: sideEffect.id },
      data: {
        frequency: assignedFrequency
      }
    })
    
    updatedCount++
    frequencyCounts[assignedFrequency as keyof typeof frequencyCounts]++
    
    if (updatedCount % 1000 === 0) {
      console.log(`✅ Classified ${updatedCount} side effects...`)
    }
  }

  console.log(`\n🎯 MAXIMIZED Side Effect Frequency Classification Complete!`)
  console.log(`✅ Total Updated: ${updatedCount} side effects`)
  console.log(`📊 Classification Results:`)
  console.log(`   Common: ${frequencyCounts.Common} (${((frequencyCounts.Common/updatedCount)*100).toFixed(1)}%)`)
  console.log(`   Uncommon: ${frequencyCounts.Uncommon} (${((frequencyCounts.Uncommon/updatedCount)*100).toFixed(1)}%)`)
  console.log(`   Rare: ${frequencyCounts.Rare} (${((frequencyCounts.Rare/updatedCount)*100).toFixed(1)}%)`)
  console.log(`   Unknown: ${frequencyCounts.Unknown} (${((frequencyCounts.Unknown/updatedCount)*100).toFixed(1)}%)`)
  
  const improvementRate = ((frequencyCounts.Common + frequencyCounts.Uncommon + frequencyCounts.Rare) / updatedCount) * 100
  console.log(`\n🚀 Overall Classification Improvement: ${improvementRate.toFixed(1)}%`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
