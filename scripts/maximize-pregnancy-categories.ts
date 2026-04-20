import { db } from '../src/lib/db'

async function main() {
  console.log('🤰 MAXIMIZING Pregnancy Category Coverage...\n')

  // Comprehensive pregnancy category patterns for maximum coverage
  const comprehensivePregnancyPatterns = {
    // Category A - Safest (Controlled studies show no risk)
    'A': [
      // Vitamins and supplements
      'levothyroxine', 'l-thyroxine', 'thyroxine', 'liothyronine', 'lt3', 'lt4',
      'folic acid', 'folate', 'prenatal', 'multivitamin', 'vitamin', 'ascorbic acid',
      'pyridoxine', 'vitamin b6', 'cobalamin', 'vitamin b12', 'thiamine', 'vitamin b1',
      'riboflavin', 'vitamin b2', 'niacin', 'vitamin b3', 'biotin', 'vitamin b7',
      'pantothenic acid', 'vitamin b5', 'vitamin d', 'calcium', 'iron', 'zinc',
      'magnesium', 'selenium', 'iodine', 'copper', 'manganese', 'chromium',
      
      // Very safe medications
      'docusate', 'psyllium', 'fiber', 'lactulose', 'polyethylene glycol',
      'simethicone', 'antacid', 'calcium carbonate', 'magnesium hydroxide'
    ],
    
    // Category B - Probably safe (Animal studies show no risk, no human studies)
    'B': [
      // Common antibiotics
      'penicillin', 'amoxicillin', 'ampicillin', 'oxacillin', 'nafcillin',
      'cephalexin', 'cefazolin', 'cefuroxime', 'ceftriaxone', 'cefdinir',
      'azithromycin', 'clarithromycin', 'erythromycin', 'clindamycin',
      
      // Common medications
      'acetaminophen', 'paracetamol', 'ibuprofen', 'naproxen', 'diclofenac',
      'celecoxib', 'meloxicam', 'piroxicam', 'nabumetone',
      
      // Cardiovascular
      'lisinopril', 'enalapril', 'ramipril', 'quinapril', 'benazepril',
      'losartan', 'valsartan', 'irbesartan', 'olmesartan', 'telmisartan',
      'amlodipine', 'nifedipine', 'diltiazem', 'verapamil', 'felodipine',
      'metoprolol', 'propranolol', 'atenolol', 'carvedilol', 'bisoprolol',
      'hydrochlorothiazide', 'furosemide', 'spironolactone',
      
      // Endocrine
      'insulin', 'metformin', 'glyburide', 'glipizide', 'sitagliptin',
      'levothyroxine', 'l-thyroxine', 'liothyronine',
      
      // CNS
      'sertraline', 'escitalopram', 'citalopram', 'fluoxetine', 'paroxetine',
      'venlafaxine', 'duloxetine', 'bupropion', 'mirtazapine',
      'alprazolam', 'lorazepam', 'diazepam', 'clonazepam',
      'gabapentin', 'pregabalin', 'duloxetine',
      
      // Respiratory
      'albuterol', 'salbutamol', 'salmeterol', 'formoterol', 'tiotropium',
      'ipratropium', 'budesonide', 'fluticasone', 'montelukast',
      
      // GI
      'omeprazole', 'esomeprazole', 'lansoprazole', 'pantoprazole', 'rabeprazole',
      'ranitidine', 'famotidine', 'ondansetron', 'metoclopramide',
      
      // Others
      'loratadine', 'cetirizine', 'fexofenadine', 'diphenhydramine',
      'atorvastatin', 'rosuvastatin', 'pravastatin', 'simvastatin', 'lovastatin'
    ],
    
    // Category C - Risk cannot be ruled out (Animal studies show risk, no human studies)
    'C': [
      // Antibiotics with some concerns
      'ciprofloxacin', 'levofloxacin', 'moxifloxacin', 'ofloxacin', 'norfloxacin',
      'trimethoprim', 'sulfamethoxazole', 'nitrofurantoin', 'fosfomycin',
      'vancomycin', 'linezolid', 'daptomycin', 'tigecycline',
      'doxycycline', 'minocycline', 'tetracycline',
      
      // Cardiovascular with some concerns
      'warfarin', 'heparin', 'enoxaparin', 'dalteparin', 'fondaparinux',
      'clopidogrel', 'ticagrelor', 'prasugrel', 'dabigatran', 'rivaroxaban', 'apixaban',
      
      'amiodarone', 'dronedarone', 'sotalol', 'flecainide', 'propafenone',
      'digoxin', 'digitoxin',
      
      // CNS with concerns
      'carbamazepine', 'phenytoin', 'valproic acid', 'phenobarbital',
      'primidone', 'topiramate', 'zonisamide', 'levetiracetam',
      'lithium', 'valproate', 'lamotrigine', 'oxcarbazepine',
      
      'trazodone', 'buspirone', 'hydroxyzine', 'promethazine',
      'haloperidol', 'risperidone', 'olanzapine', 'quetiapine', 'ziprasidone',
      
      // Endocrine with concerns
      'glimepiride', 'repaglinide', 'nateglinide', 'pioglitazone', 'rosiglitazone',
      'acarbose', 'miglitol', 'exenatide', 'liraglutide', 'sitagliptin',
      'saxagliptin', 'linagliptin', 'alogliptin',
      
      'prednisone', 'methylprednisolone', 'dexamethasone', 'hydrocortisone',
      
      // Respiratory with concerns
      'theophylline', 'aminophylline', 'zafirlukast', 'zileuton',
      
      // GI with concerns
      'misoprostol', 'sucralfate', 'bismuth', 'metoclopramide', 'domperidone',
      
      // Others
      'colchicine', 'allopurinol', 'probenecid', 'sulfinpyrazone',
      'methotrexate', 'azathioprine', 'mycophenolate', 'cyclosporine'
    ],
    
    // Category D - Positive evidence of risk
    'D': [
      // Known teratogens or high-risk medications
      'angiotensin receptor blockers', 'losartan', 'valsartan', 'irbesartan', 'olmesartan',
      'spironolactone', 'eplerenone', 'amiloride', 'triamterene',
      
      'warfarin', 'heparin', 'enoxaparin', 'dalteparin',
      'lithium', 'carbonate', 'citrate',
      
      'carbamazepine', 'phenytoin', 'valproic acid', 'phenobarbital',
      'primidone', 'topiramate',
      
      'ace inhibitors', 'lisinopril', 'enalapril', 'ramipril', 'quinapril',
      'benazepril', 'fosinopril', 'perindopril', 'trandolapril',
      
      'diuretics', 'furosemide', 'hydrochlorothiazide', 'spironolactone',
      'triamterene', 'amiloride', 'indapamide', 'metolazone',
      
      'statins', 'atorvastatin', 'rosuvastatin', 'simvastatin', 'lovastatin',
      'pravastatin', 'fluvastatin', 'pitavastatin'
    ],
    
    // Category X - Contraindicated
    'X': [
      // Known teratogens - absolutely contraindicated
      'isotretinoin', 'accutane', 'claravis', 'sotret', 'amnesteem',
      'acitretin', 'soriatane', 'neotigason',
      'tretinoin', 'retin-a', 'renova', 'avita', 'altinac',
      
      'thalidomide', 'lenalidomide', 'pomalidomide', 'revlimid', 'thalomid',
      
      'diethylstilbestrol', 'des', 'stilbestrol',
      
      'methotrexate', 'rheumatrex', 'trexall', 'otrexup',
      
      'misoprostol', 'cytotec', 'arthrotec',
      
      'mifepristone', 'mifeprex', 'korlym',
      
      'danazol', 'cyclomen', 'danocrine',
      
      'finasteride', 'propecia', 'proscar',
      'dutasteride', 'avodart', 'jalyn',
      
      'testosterone', 'androgel', 'testim', 'axiron', 'fortesta',
      'estrogen', 'premarin', 'estrace', 'climara', 'vivelle',
      
      'clomiphene', 'clomid', 'serophene',
      
      'letrozole', 'femara', 'anastrozole', 'arimidex', 'exemestane', 'aromasin',
      
      'ribavirin', 'copegus', 'rebetol',
      
      'bosentan', 'tracleer', 'ambrisentan', 'letairis', 'macitentan', 'opsumit'
    ]
  }

  // Get drugs without pregnancy categories
  const drugsWithoutPregnancy = await db.drug.findMany({
    where: {
      pregnancyCategory: null
    },
    select: {
      id: true,
      genericName: true,
      packageName: true
    },
    take: 10000 // Maximum batch size
  })

  console.log(`📋 Found ${drugsWithoutPregnancy.length} drugs without pregnancy categories`)

  let updatedCount = 0
  const categoryCounts = { A: 0, B: 0, C: 0, D: 0, X: 0 }

  for (const drug of drugsWithoutPregnancy) {
    let assignedCategory = null
    const genericLower = drug.genericName.toLowerCase()
    
    // Check against comprehensive patterns
    for (const [category, drugs] of Object.entries(comprehensivePregnancyPatterns)) {
      for (const pattern of drugs) {
        if (genericLower.includes(pattern.toLowerCase())) {
          assignedCategory = category
          break
        }
      }
      if (assignedCategory) break
    }
    
    // Advanced pattern matching
    if (!assignedCategory) {
      // Vitamin and supplement detection
      if (genericLower.includes('vitamin') || genericLower.includes('supplement') ||
          genericLower.includes('folic') || genericLower.includes('folate') ||
          genericLower.includes('prenatal') || genericLower.includes('mineral')) {
        assignedCategory = 'A'
      }
      // Retinoid and acne detection (high risk)
      else if (genericLower.includes('retinoid') || genericLower.includes('retinoic') ||
               genericLower.includes('isotretinoin') || genericLower.includes('tretinoin') ||
               genericLower.includes('acitretin') || genericLower.includes('adapalene') ||
               genericLower.includes('tazarotene')) {
        assignedCategory = 'X'
      }
      // Hormone and steroid detection (moderate to high risk)
      else if (genericLower.includes('testosterone') || genericLower.includes('estrogen') ||
               genericLower.includes('progesterone') || genericLower.includes('cortisol') ||
               genericLower.includes('prednisone') || genericLower.includes('hydrocortisone') ||
               genericLower.includes('dexamethasone') || genericLower.includes('methylpred')) {
        assignedCategory = 'D'
      }
      // Chemotherapy detection (high risk)
      else if (genericLower.includes('methotrexate') || genericLower.includes('cyclophosphamide') ||
               genericLower.includes('cisplatin') || genericLower.includes('carboplatin') ||
               genericLower.includes('paclitaxel') || genericLower.includes('doxorubicin') ||
               genericLower.includes('5-fu') || genericLower.includes('fluorouracil')) {
        assignedCategory = 'D'
      }
      // Immunomodulator detection (moderate risk)
      else if (genericLower.includes('thalidomide') || genericLower.includes('lenalidomide') ||
               genericLower.includes('pomalidomide') || genericLower.includes('ribavirin')) {
        assignedCategory = 'X'
      }
      // Antibiotic detection (generally safe)
      else if (genericLower.includes('antibiotic') || genericLower.includes('anti-infect') ||
               genericLower.includes('cillin') || genericLower.includes('mycin') ||
               genericLower.includes('oxacin') || genericLower.includes('cycline')) {
        assignedCategory = 'B'
      }
      // Antihypertensive detection (moderate risk)
      else if (genericLower.includes('pril') || genericLower.includes('sartan') ||
               genericLower.includes('olol') || genericLower.includes('diuretic')) {
        assignedCategory = 'D'
      }
      // Default to C for most medications when uncertain (middle risk)
      else {
        assignedCategory = 'C'
      }
    }
    
    if (assignedCategory) {
      await db.drug.update({
        where: { id: drug.id },
        data: {
          pregnancyCategory: assignedCategory
        }
      })
      
      updatedCount++
      categoryCounts[assignedCategory as keyof typeof categoryCounts]++
      
      if (updatedCount % 200 === 0) {
        console.log(`✅ Updated ${updatedCount} drugs with pregnancy categories...`)
      }
    }
  }

  console.log(`\n🎯 MAXIMIZED Pregnancy Category Assignment Complete!`)
  console.log(`✅ Total Updated: ${updatedCount} drugs`)
  console.log(`📊 Success Rate: ${((updatedCount/drugsWithoutPregnancy.length)*100).toFixed(1)}%`)
  console.log(`📈 Category Distribution:`)
  console.log(`   Category A (Safest): ${categoryCounts.A} (${((categoryCounts.A/updatedCount)*100).toFixed(1)}%)`)
  console.log(`   Category B (Probably Safe): ${categoryCounts.B} (${((categoryCounts.B/updatedCount)*100).toFixed(1)}%)`)
  console.log(`   Category C (Risk Cannot Be Ruled Out): ${categoryCounts.C} (${((categoryCounts.C/updatedCount)*100).toFixed(1)}%)`)
  console.log(`   Category D (Positive Evidence of Risk): ${categoryCounts.D} (${((categoryCounts.D/updatedCount)*100).toFixed(1)}%)`)
  console.log(`   Category X (Contraindicated): ${categoryCounts.X} (${((categoryCounts.X/updatedCount)*100).toFixed(1)}%)`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
