import { db } from '../src/lib/db'

async function main() {
  console.log('🔧 Populating Clinical Warnings and Mechanism of Action Data...\n')

  // Common clinical warnings and MOA patterns based on drug classes
  const clinicalPatterns = {
    'Antibiotics': {
      warning: 'May cause antibiotic resistance if used inappropriately. Monitor for allergic reactions including anaphylaxis. Consider renal function and adjust dosage accordingly.',
      moa: 'Inhibit bacterial cell wall synthesis, protein synthesis, or nucleic acid synthesis, leading to bacterial death or growth inhibition.'
    },
    'NSAIDs': {
      warning: 'Increased risk of cardiovascular events, GI bleeding, and renal impairment. Use lowest effective dose for shortest duration. Avoid in patients with peptic ulcer disease.',
      moa: 'Inhibit cyclooxygenase (COX) enzymes, reducing prostaglandin synthesis, resulting in anti-inflammatory, analgesic, and antipyretic effects.'
    },
    'Statins': {
      warning: 'Monitor liver enzymes periodically. Risk of myopathy and rhabdomyolysis, especially with high doses or drug interactions. Avoid grapefruit juice.',
      moa: 'Inhibit HMG-CoA reductase, reducing cholesterol synthesis in the liver and increasing LDL receptor expression.'
    },
    'ACE Inhibitors': {
      warning: 'May cause angioedema, especially in African American patients. Monitor renal function and potassium levels. Avoid in pregnancy.',
      moa: 'Inhibit angiotensin-converting enzyme, reducing angiotensin II production, leading to vasodilation and reduced blood pressure.'
    },
    'Beta Blockers': {
      warning: 'Do not stop abruptly - may cause rebound hypertension/tachycardia. Use with caution in asthma, diabetes, and heart block patients.',
      moa: 'Block beta-adrenergic receptors, reducing heart rate, contractility, and renin release, resulting in decreased blood pressure and cardiac workload.'
    },
    'Antidepressants': {
      warning: 'Increased risk of suicidal thoughts in young adults. Monitor for serotonin syndrome. Withdraw gradually to avoid discontinuation syndrome.',
      moa: 'Modulate neurotransmitter systems (serotonin, norepinephrine, dopamine) to improve mood and cognitive function.'
    },
    'Antidiabetics': {
      warning: 'Monitor blood glucose closely. Risk of hypoglycemia, especially with other glucose-lowering medications. Adjust dose in renal impairment.',
      moa: 'Increase insulin secretion, improve insulin sensitivity, or reduce glucose production to maintain glycemic control.'
    },
    'Anticoagulants': {
      warning: 'Increased bleeding risk. Monitor INR/PT regularly. Many drug interactions. Use caution in elderly and patients with fall risk.',
      moa: 'Interfere with clotting cascade to prevent thrombus formation and reduce risk of thromboembolic events.'
    },
    'Antihistamines': {
      warning: 'May cause drowsiness - avoid driving or operating machinery. Use with caution in glaucoma, BPH, and asthma.',
      moa: 'Block histamine H1 receptors, preventing histamine-mediated allergic responses and reducing allergy symptoms.'
    },
    'Proton Pump Inhibitors': {
      warning: 'Long-term use may increase risk of fractures, C. difficile infection, and vitamin B12 deficiency. Use lowest effective dose.',
      moa: 'Irreversibly inhibit H+/K+ ATPase in gastric parietal cells, reducing gastric acid production.'
    }
  }

  // Drug class identification patterns
  const drugClassPatterns = {
    'cillin': 'Antibiotics',
    'mycin': 'Antibiotics',
    'cycline': 'Antibiotics',
    'oxacin': 'Antibiotics',
    'sulfa': 'Antibiotics',
    'pril': 'ACE Inhibitors',
    'sartan': 'ARBs',
    'olol': 'Beta Blockers',
    'prazole': 'Proton Pump Inhibitors',
    'vastatin': 'Statins',
    'glipizide': 'Antidiabetics',
    'metformin': 'Antidiabetics',
    'warfarin': 'Anticoagulants',
    'heparin': 'Anticoagulants',
    'diphenhydramine': 'Antihistamines',
    'loratadine': 'Antihistamines',
    'cetirizine': 'Antihistamines',
    'sertraline': 'Antidepressants',
    'fluoxetine': 'Antidepressants',
    'paroxetine': 'Antidepressants',
    'citalopram': 'Antidepressants',
    'escitalopram': 'Antidepressants',
    'venlafaxine': 'Antidepressants',
    'duloxetine': 'Antidepressants',
    'amitriptyline': 'Antidepressants',
    'nortriptyline': 'Antidepressants',
    'ibuprofen': 'NSAIDs',
    'naproxen': 'NSAIDs',
    'diclofenac': 'NSAIDs',
    'celecoxib': 'NSAIDs',
    'meloxicam': 'NSAIDs',
    'aspirin': 'NSAIDs'
  }

  // Get drugs without warnings
  const drugsWithoutWarnings = await db.drug.findMany({
    where: {
      warnings: null
    },
    select: {
      id: true,
      genericName: true,
      packageName: true
    },
    take: 1000 // Batch processing
  })

  console.log(`📋 Found ${drugsWithoutWarnings.length} drugs without clinical warnings`)

  let updatedCount = 0

  for (const drug of drugsWithoutWarnings) {
    let clinicalInfo = null
    
    // Check generic name against patterns
    const genericLower = drug.genericName.toLowerCase()
    
    for (const [pattern, drugClass] of Object.entries(drugClassPatterns)) {
      if (genericLower.includes(pattern)) {
        clinicalInfo = clinicalPatterns[drugClass as keyof typeof clinicalPatterns]
        break
      }
    }
    
    // Fallback for common drug classes based on name patterns
    if (!clinicalInfo) {
      if (genericLower.includes('antibiotic') || genericLower.includes('anti-infect')) {
        clinicalInfo = clinicalPatterns['Antibiotics']
      } else if (genericLower.includes('anti') && genericLower.includes('depress')) {
        clinicalInfo = clinicalPatterns['Antidepressants']
      } else if (genericLower.includes('anti') && genericLower.includes('hist')) {
        clinicalInfo = clinicalPatterns['Antihistamines']
      }
    }
    
    if (clinicalInfo) {
      await db.drug.update({
        where: { id: drug.id },
        data: {
          warnings: clinicalInfo.warning
        }
      })
      
      updatedCount++
      
      if (updatedCount % 100 === 0) {
        console.log(`✅ Updated ${updatedCount} drugs with clinical warnings...`)
      }
    }
  }

  console.log(`\n🎯 Clinical Warnings Population Complete!`)
  console.log(`✅ Total Updated: ${updatedCount} drugs`)
  console.log(`📊 Success Rate: ${((updatedCount/drugsWithoutWarnings.length)*100).toFixed(1)}%`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
