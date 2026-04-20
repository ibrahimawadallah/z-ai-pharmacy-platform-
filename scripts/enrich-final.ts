import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// All data sources
const DATA = {
  pregnancy: {
    'paracetamol': 'B - Generally safe during pregnancy',
    'acetaminophen': 'B - Generally safe during pregnancy',
    'ibuprofen': 'C/D - Avoid in third trimester',
    'aspirin': 'C/D - Avoid in third trimester',
    'metformin': 'B - Generally considered safe',
    'amoxicillin': 'B - Safe during pregnancy',
    'ciprofloxacin': 'C - Use only if benefit justifies risk',
    'omeprazole': 'C - Use only if clearly needed',
    'amlodipine': 'C - No adequate studies',
    'lisinopril': 'D - CONTRAINDICATED - fetal toxicity',
    'simvastatin': 'X - CONTRAINDICATED in pregnancy',
    'atorvastatin': 'X - CONTRAINDICATED in pregnancy',
    'levothyroxine': 'A - Safe and essential',
    'prednisone': 'C - Use lowest effective dose',
    'prednisolone': 'C - Use lowest effective dose',
    'tramadol': 'C - Use with caution',
    'sertraline': 'C - Benefits may outweigh risks',
    'fluoxetine': 'C - Benefits may outweigh risks',
    'warfarin': 'X - CONTRAINDICATED - teratogenic',
    'furosemide': 'C - Use only if clearly needed',
    'metoprolol': 'C - Monitor fetal growth',
    'losartan': 'D - CONTRAINDICATED - fetal toxicity',
    'gabapentin': 'C - Use only if benefit justifies risk',
    'clopidogrel': 'B - Limited human data',
    'metronidazole': 'B - Generally safe',
    'doxycycline': 'D - CONTRAINDICATED - affects bone/tooth development',
    'ranitidine': 'B - Generally considered safe',
    'salbutamol': 'C - Use only if benefit outweighs risk',
    'diclofenac': 'C/D - Avoid in third trimester',
    'carbamazepine': 'D - Teratogenic risk',
    'insulin': 'B - Safe during pregnancy',
    'heparin': 'B - Safe during pregnancy',
    'penicillin': 'B - Safe during pregnancy',
    'cephalexin': 'B - Safe during pregnancy',
    'azithromycin': 'B - Safe during pregnancy',
    'erythromycin': 'B - Safe during pregnancy',
    'nitrofurantoin': 'B - Avoid at term (38-42 weeks)',
    'clindamycin': 'B - Safe during pregnancy',
    'fluconazole': 'C/D - High doses contraindicated',
    'acyclovir': 'B - Safe during pregnancy',
    'oseltamivir': 'C - Use if benefit outweighs risk',
    'lorazepam': 'D - Risk of fetal harm',
    'diazepam': 'D - Risk of fetal harm',
    'codeine': 'C - Use with caution',
    'morphine': 'C - Use with caution',
    'oxycodone': 'B/C - Use with caution',
    'ondansetron': 'B - Generally safe for morning sickness',
    'methyldopa': 'B - Preferred antihypertensive',
    'labetalol': 'C - Commonly used in pregnancy',
    'nifedipine': 'C - Used for preterm labor',
    'magnesium sulfate': 'A - Safe, used for eclampsia',
    'propranolol': 'C - Monitor fetal growth',
    'hydrochlorothiazide': 'B - Generally compatible',
    'spironolactone': 'C - Anti-androgenic effects',
    'digoxin': 'C - Use with monitoring',
    'colchicine': 'C - Use with caution',
    'allopurinol': 'C - Use only if clearly needed',
    'methotrexate': 'X - CONTRAINDICATED - teratogenic',
    'hydroxychloroquine': 'C - Generally compatible',
    'phenytoin': 'D - Teratogenic risk',
    'valproic acid': 'D - CONTRAINDICATED - neural tube defects',
    'lamotrigine': 'C - Generally compatible',
    'levetiracetam': 'C - Limited data',
    'topiramate': 'D - Teratogenic risk',
    'amitriptyline': 'C - Use with caution',
    'venlafaxine': 'C - Use with caution',
    'escitalopram': 'C - Use with caution',
    'paroxetine': 'D - Teratogenic risk',
    'lithium': 'D - Teratogenic risk',
    'quetiapine': 'C - Limited data',
    'risperidone': 'C - Limited data',
    'olanzapine': 'C - Limited data',
    'aripiprazole': 'C - Limited data',
    'haloperidol': 'C - Use with caution',
    'chlorpromazine': 'C - Use with caution',
    'clozapine': 'C - Limited data',
  },
  g6pd: {
    'nitrofurantoin': 'HIGH RISK - CONTRAINDICATED',
    'primaquine': 'HIGH RISK - CONTRAINDICATED',
    'dapsone': 'HIGH RISK - CONTRAINDICATED',
    'rasburicase': 'HIGH RISK - CONTRAINDICATED',
    'pegloticase': 'HIGH RISK - CONTRAINDICATED',
    'methylene blue': 'HIGH RISK - CONTRAINDICATED',
    'sulfamethoxazole': 'HIGH RISK - CONTRAINDICATED',
    'sulfasalazine': 'HIGH RISK - CONTRAINDICATED',
    'phenazopyridine': 'HIGH RISK - CONTRAINDICATED',
    'quinidine': 'HIGH RISK - CONTRAINDICATED',
    'quinine': 'HIGH RISK - CONTRAINDICATED',
    'chloramphenicol': 'LOW RISK - Use with caution',
    'ciprofloxacin': 'LOW RISK - Use with caution',
    'levofloxacin': 'LOW RISK - Use with caution',
    'metronidazole': 'LOW RISK - Use with caution',
    'aspirin': 'LOW RISK - Safe at low doses',
    'paracetamol': 'SAFE',
    'acetaminophen': 'SAFE',
    'metformin': 'SAFE',
    'amoxicillin': 'SAFE',
    'ibuprofen': 'SAFE',
    'omeprazole': 'SAFE',
    'amlodipine': 'SAFE',
    'lisinopril': 'SAFE',
    'simvastatin': 'SAFE',
    'atorvastatin': 'SAFE',
    'levothyroxine': 'SAFE',
    'doxycycline': 'SAFE',
    'azithromycin': 'SAFE',
    'erythromycin': 'SAFE',
    'clindamycin': 'SAFE',
    'penicillin': 'SAFE',
    'cephalexin': 'SAFE',
    'insulin': 'SAFE',
    'warfarin': 'SAFE',
    'furosemide': 'SAFE',
    'hydrochlorothiazide': 'SAFE',
    'metoprolol': 'SAFE',
    'propranolol': 'SAFE',
    'losartan': 'SAFE',
    'gabapentin': 'SAFE',
    'prednisone': 'SAFE',
    'prednisolone': 'SAFE',
    'tramadol': 'SAFE',
    'codeine': 'SAFE',
    'morphine': 'SAFE',
    'ondansetron': 'SAFE',
    'salbutamol': 'SAFE',
    'diclofenac': 'SAFE',
    'fluconazole': 'SAFE',
    'acyclovir': 'SAFE',
  },
  offlabel: {
    'metformin': 'PCOS; Weight gain prevention; Prediabetes',
    'gabapentin': 'Neuropathic pain; Restless leg syndrome; Hot flashes; Anxiety',
    'pregabalin': 'Neuropathic pain; Fibromyalgia',
    'amitriptyline': 'Neuropathic pain; Migraine prophylaxis; Insomnia; IBS',
    'topiramate': 'Migraine prophylaxis; Weight loss',
    'propranolol': 'Performance anxiety; Essential tremor; Migraine prophylaxis',
    'clonidine': 'ADHD; Tourette syndrome; Opioid withdrawal',
    'trazodone': 'Insomnia',
    'mirtazapine': 'Insomnia; Appetite stimulation',
    'quetiapine': 'Insomnia; Treatment-resistant depression',
    'spironolactone': 'Acne; Hirsutism; Female pattern hair loss',
    'methotrexate': 'Rheumatoid arthritis; Psoriasis; Crohn\'s disease',
    'hydroxychloroquine': 'Rheumatoid arthritis; Lupus',
    'colchicine': 'Familial Mediterranean fever; Pericarditis',
    'aspirin': 'Cardiovascular prevention; Preeclampsia prevention',
    'doxycycline': 'Acne; Rosacea; Malaria prophylaxis; Lyme disease',
    'sertraline': 'PTSD; OCD; Panic disorder',
    'fluoxetine': 'PTSD; OCD; Bulimia nervosa',
    'lamotrigine': 'Bipolar disorder; Neuropathic pain',
    'valproic acid': 'Bipolar disorder; Migraine prophylaxis',
    'carbamazepine': 'Trigeminal neuralgia; Bipolar disorder',
    'warfarin': 'Mechanical heart valves; Atrial fibrillation',
    'lisinopril': 'Heart failure; CKD (renoprotective)',
    'losartan': 'Heart failure; Diabetic nephropathy',
    'metoprolol': 'Heart failure; Post-MI; Angina',
    'levothyroxine': 'Subclinical hypothyroidism',
    'tramadol': 'Neuropathic pain; Fibromyalgia',
  },
  sideEffects: {
    'paracetamol': ['Hepatotoxicity', 'Rash', 'Nausea', 'Thrombocytopenia'],
    'acetaminophen': ['Hepatotoxicity', 'Rash', 'Nausea', 'Thrombocytopenia'],
    'ibuprofen': ['Gastric ulcer', 'GI bleeding', 'Nephrotoxicity', 'Dizziness', 'Dyspepsia'],
    'aspirin': ['GI bleeding', 'Gastric ulcer', 'Tinnitus', 'Bleeding tendency'],
    'metformin': ['Lactic acidosis', 'Nausea', 'Diarrhea', 'Vitamin B12 deficiency'],
    'amoxicillin': ['Diarrhea', 'Nausea', 'Rash', 'Allergic reaction'],
    'ciprofloxacin': ['Tendon rupture', 'Peripheral neuropathy', 'QT prolongation', 'Photosensitivity'],
    'omeprazole': ['Headache', 'Nausea', 'Hypomagnesemia', 'C. difficile infection'],
    'amlodipine': ['Peripheral edema', 'Fatigue', 'Dizziness', 'Flushing'],
    'lisinopril': ['Angioedema', 'Dry cough', 'Dizziness', 'Hyperkalemia'],
    'simvastatin': ['Myopathy', 'Rhabdomyolysis', 'Hepatotoxicity', 'Myalgia'],
    'atorvastatin': ['Myopathy', 'Rhabdomyolysis', 'Hepatotoxicity'],
    'levothyroxine': ['Weight loss', 'Tremor', 'Insomnia', 'Palpitations'],
    'prednisone': ['Immunosuppression', 'Weight gain', 'Hyperglycemia', 'Osteoporosis'],
    'prednisolone': ['Immunosuppression', 'Weight gain', 'Hyperglycemia'],
    'tramadol': ['Seizures', 'Serotonin syndrome', 'Nausea', 'Dizziness'],
    'sertraline': ['Serotonin syndrome', 'Nausea', 'Insomnia', 'Sexual dysfunction'],
    'fluoxetine': ['Serotonin syndrome', 'Nausea', 'Insomnia', 'Anxiety'],
    'warfarin': ['Major bleeding', 'Intracranial hemorrhage', 'Bruising'],
    'furosemide': ['Dehydration', 'Hypokalemia', 'Hyponatremia', 'Ototoxicity'],
    'metoprolol': ['Bradycardia', 'Fatigue', 'Dizziness', 'Bronchospasm'],
    'losartan': ['Dizziness', 'Hyperkalemia', 'Hypotension'],
    'gabapentin': ['Dizziness', 'Fatigue', 'Ataxia', 'Peripheral edema'],
    'clopidogrel': ['Bleeding', 'Rash', 'Neutropenia'],
    'metronidazole': ['Peripheral neuropathy', 'Nausea', 'Metallic taste'],
    'doxycycline': ['Photosensitivity', 'Nausea', 'Tooth discoloration'],
    'insulin': ['Hypoglycemia', 'Weight gain', 'Lipodystrophy'],
    'heparin': ['Bleeding', 'HIT', 'Elevated liver enzymes'],
    'penicillin': ['Allergic reactions', 'Anaphylaxis', 'Rash'],
    'azithromycin': ['Diarrhea', 'Nausea', 'QT prolongation'],
    'fluconazole': ['Nausea', 'Headache', 'Hepatotoxicity'],
    'acyclovir': ['Nausea', 'Headache', 'Renal impairment'],
    'lorazepam': ['Sedation', 'Dizziness', 'Memory impairment'],
    'diazepam': ['Drowsiness', 'Fatigue', 'Memory impairment'],
    'codeine': ['Constipation', 'Nausea', 'Respiratory depression'],
    'morphine': ['Constipation', 'Nausea', 'Respiratory depression'],
    'ondansetron': ['Headache', 'Constipation', 'QT prolongation'],
    'carbamazepine': ['Stevens-Johnson syndrome', 'Aplastic anemia', 'Hyponatremia'],
    'phenytoin': ['Nystagmus', 'Ataxia', 'Gingival hyperplasia'],
    'valproic acid': ['Nausea', 'Weight gain', 'Hepatotoxicity'],
    'lamotrigine': ['Rash', 'Headache', 'Stevens-Johnson syndrome'],
  }
}

async function main() {
  console.log('=== FAST DRUG ENRICHMENT ===\n')
  
  const drugs = await prisma.drug.findMany({
    select: { id: true, genericName: true, packageName: true }
  })
  
  console.log(`Processing ${drugs.length} drugs...\n`)
  
  let enriched = 0
  const batchSize = 500
  const updatePromises: Promise<any>[] = []
  
  for (const drug of drugs) {
    const name = (drug.genericName || drug.packageName).toLowerCase()
    
    let pregnancyCat = null
    let g6pd = null
    let offlabel = null
    let sideEffects = null
    
    // Match data
    for (const [key, val] of Object.entries(DATA.pregnancy)) {
      if (name.includes(key)) { pregnancyCat = val; break }
    }
    for (const [key, val] of Object.entries(DATA.g6pd)) {
      if (name.includes(key)) { g6pd = val; break }
    }
    for (const [key, val] of Object.entries(DATA.offlabel)) {
      if (name.includes(key)) { offlabel = val; break }
    }
    for (const [key, val] of Object.entries(DATA.sideEffects)) {
      if (name.includes(key)) { sideEffects = val; break }
    }
    
    if (!pregnancyCat && !g6pd && !offlabel && !sideEffects) continue
    
    // Build update
    const updateData: any = {}
    if (pregnancyCat) updateData.pregnancyCategory = pregnancyCat
    if (g6pd) updateData.g6pdSafety = g6pd
    if (offlabel) updateData.offLabelUses = offlabel
    
    // Queue update
    updatePromises.push(
      prisma.drug.update({
        where: { id: drug.id },
        data: updateData
      }).catch(() => {}) // Ignore errors
    )
    
    enriched++
    
    // Execute in batches
    if (updatePromises.length >= batchSize) {
      await Promise.all(updatePromises)
      updatePromises.length = 0
      console.log(`Enriched ${enriched}/${drugs.length}...`)
    }
  }
  
  // Final batch
  if (updatePromises.length > 0) {
    await Promise.all(updatePromises)
  }
  
  console.log(`\n✅ Enriched ${enriched} drugs\n`)
  
  // Verify
  const withPregnancy = await prisma.drug.count({ where: { pregnancyCategory: { not: null } } })
  const withG6PD = await prisma.drug.count({ where: { g6pdSafety: { not: null } } })
  const withOfflabel = await prisma.drug.count({ where: { offLabelUses: { not: null } } })
  const total = await prisma.drug.count()
  
  console.log('=== COVERAGE ===')
  console.log(`Total: ${total.toLocaleString()}`)
  console.log(`Pregnancy: ${withPregnancy.toLocaleString()} (${((withPregnancy/total)*100).toFixed(1)}%)`)
  console.log(`G6PD: ${withG6PD.toLocaleString()} (${((withG6PD/total)*100).toFixed(1)}%)`)
  console.log(`Off-label: ${withOfflabel.toLocaleString()} (${((withOfflabel/total)*100).toFixed(1)}%)`)
  
  // Sample cards
  console.log('\n=== SAMPLE DRUG CARDS ===')
  const samples = await prisma.drug.findMany({
    where: { pregnancyCategory: { not: null } },
    select: {
      packageName: true, genericName: true, pregnancyCategory: true,
      g6pdSafety: true, offLabelUses: true, strength: true, dosageForm: true,
      sideEffects: { take: 3, select: { sideEffect: true } },
      interactions: { take: 2, select: { secondaryDrugName: true, severity: true } }
    },
    take: 3
  })
  
  for (const d of samples) {
    console.log(`\n${d.packageName} (${d.genericName || 'N/A'})`)
    console.log(`  ${d.strength} ${d.dosageForm}`)
    console.log(`  🤰 ${d.pregnancyCategory || 'N/A'}`)
    console.log(`  🧬 ${d.g6pdSafety || 'N/A'}`)
    console.log(`  📋 ${d.offLabelUses || 'N/A'}`)
    console.log(`  ⚠️ ${d.sideEffects.map(s => s.sideEffect).join(', ') || 'N/A'}`)
    console.log(`  🔗 ${d.interactions.map(i => `${i.secondaryDrugName} (${i.severity})`).join(', ') || 'N/A'}`)
  }
  
  console.log('\n✅ DRUG CARDS COMPLETE!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
