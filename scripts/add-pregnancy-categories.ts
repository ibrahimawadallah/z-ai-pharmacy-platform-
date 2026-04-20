import { db } from '../src/lib/db'

async function main() {
  console.log('🤰 Adding Pregnancy Categories to Drugs...\n')

  // Pregnancy category patterns based on drug classes and known medications
  const pregnancyCategories = {
    // Category A - Safest (Controlled studies show no risk)
    'A': [
      'levothyroxine', 'l-thyroxine', 'folic acid', 'prenatal vitamins',
      'pyridoxine', 'vitamin b6', 'ascorbic acid', 'vitamin c'
    ],
    
    // Category B - Probably safe (Animal studies show no risk, no human studies)
    'B': [
      'acetaminophen', 'paracetamol', 'penicillin', 'amoxicillin',
      'ampicillin', 'cephalexin', 'insulin', 'metformin',
      'lisinopril', 'hydrochlorothiazide', 'albuterol', 'salbutamol',
      'prednisone', 'methylprednisolone', 'omeprazole', 'pantoprazole',
      'sertraline', 'escitalopram', 'citalopram', 'fluoxetine',
      'ibuprofen', 'naproxen', 'diclofenac', 'celecoxib',
      'atorvastatin', 'rosuvastatin', 'pravastatin', 'simvastatin'
    ],
    
    // Category C - Risk cannot be ruled out (Animal studies show risk, no human studies)
    'C': [
      'warfarin', 'heparin', 'enoxaparin', 'aspirin', 'clopidogrel',
      'amlodipine', 'nifedipine', 'diltiazem', 'verapamil',
      'metoprolol', 'propranolol', 'atenolol', 'carvedilol',
      'losartan', 'valsartan', 'irbesartan', 'olmesartan',
      'furosemide', 'hydrochlorothiazide', 'spironolactone',
      'diphenhydramine', 'loratadine', 'cetirizine', 'fexofenadine',
      'azithromycin', 'clarithromycin', 'doxycycline', 'ciprofloxacin',
      'levofloxacin', 'moxifloxacin', 'trimethoprim', 'sulfamethoxazole'
    ],
    
    // Category D - Positive evidence of risk
    'D': [
      'angiotensin receptor blockers', 'losartan', 'valsartan', 'irbesartan',
      'spironolactone', 'warfarin', 'heparin', 'lithium',
      'carbamazepine', 'phenytoin', 'valproic acid', 'phenobarbital',
      'ACE inhibitors', 'lisinopril', 'enalapril', 'ramipril',
      'diuretics', 'furosemide', 'hydrochlorothiazide'
    ],
    
    // Category X - Contraindicated
    'X': [
      'isotretinoin', 'accutane', 'thalidomide', 'diethylstilbestrol',
      'methotrexate', 'misoprostol', 'mifepristone', 'danazol',
      'finasteride', 'dutasteride', 'testosterone', 'estrogen'
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
    take: 2000 // Process in batches
  })

  console.log(`📋 Found ${drugsWithoutPregnancy.length} drugs without pregnancy categories`)

  let updatedCount = 0
  const categoryCounts = { A: 0, B: 0, C: 0, D: 0, X: 0 }

  for (const drug of drugsWithoutPregnancy) {
    let assignedCategory = null
    const genericLower = drug.genericName.toLowerCase()
    
    // Check against known patterns
    for (const [category, drugs] of Object.entries(pregnancyCategories)) {
      for (const pattern of drugs) {
        if (genericLower.includes(pattern.toLowerCase())) {
          assignedCategory = category
          break
        }
      }
      if (assignedCategory) break
    }
    
    // Additional pattern matching
    if (!assignedCategory) {
      if (genericLower.includes('vitamin') || genericLower.includes('supplement')) {
        assignedCategory = 'A'
      } else if (genericLower.includes('retinoid') || genericLower.includes('acne')) {
        assignedCategory = 'X'
      } else if (genericLower.includes('hormone') || genericLower.includes('steroid')) {
        assignedCategory = 'D'
      } else if (genericLower.includes('antibiotic') || genericLower.includes('anti-infect')) {
        assignedCategory = 'B'
      } else {
        // Default to C for most medications when uncertain
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
      
      if (updatedCount % 100 === 0) {
        console.log(`✅ Updated ${updatedCount} drugs with pregnancy categories...`)
      }
    }
  }

  console.log(`\n🎯 Pregnancy Category Assignment Complete!`)
  console.log(`✅ Total Updated: ${updatedCount} drugs`)
  console.log(`📊 Category Distribution:`)
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
