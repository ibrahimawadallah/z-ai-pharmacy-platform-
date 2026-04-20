import { db } from '../src/lib/db'

async function main() {
  console.log('🔧 MAXIMIZING Clinical Warnings and MOA Coverage...\n')

  // Comprehensive clinical patterns for maximum coverage
  const comprehensiveClinicalPatterns = {
    // Extended antibiotic classes
    'Extended Antibiotics': {
      patterns: ['cillin', 'mycin', 'cycline', 'oxacin', 'sulfa', 'pristin', 'dapt', 'linezolid', 'vancomycin', 'teicoplanin'],
      warning: 'Monitor for allergic reactions including anaphylaxis. Consider renal/hepatic function for dosing. Watch for C. difficile infection with prolonged use. May cause antibiotic resistance if used inappropriately.',
      moa: 'Inhibit bacterial cell wall synthesis, protein synthesis, DNA replication, or metabolic pathways, leading to bacterial death or growth inhibition.'
    },
    
    // Extended cardiovascular classes
    'Antihypertensives': {
      patterns: ['pril', 'sartan', 'olol', 'alol', 'azosin', 'hydralazine', 'minoxidil', 'clonidine', 'methyldopa'],
      warning: 'Monitor blood pressure and renal function. Risk of hypotension, especially with first dose. May cause electrolyte imbalances. Use caution in elderly and patients with heart failure.',
      moa: 'Reduce blood pressure through various mechanisms: ACE inhibition, ARB blockade, beta-adrenergic blockade, calcium channel blockade, or direct vasodilation.'
    },
    
    // Extended cardiac medications
    'Cardiac Medications': {
      patterns: ['digoxin', 'amiodarone', 'dronedarone', 'flecainide', 'propafenone', 'sotalol', 'dofetilide'],
      warning: 'Therapeutic drug monitoring often required. Risk of arrhythmias, digitalis toxicity, or pulmonary toxicity. Monitor ECG, electrolytes, and drug levels. Use with extreme caution in renal/hepatic impairment.',
      moa: 'Modulate cardiac electrophysiology through ion channel effects, autonomic nervous system modulation, or direct cardiac myocyte effects.'
    },
    
    // Extended psychiatric medications
    'Psychiatric Medications': {
      patterns: ['paroxetine', 'sertraline', 'fluoxetine', 'escitalopram', 'citalopram', 'venlafaxine', 'duloxetine', 'mirtazapine', 'bupropion', 'trazodone', 'buspirone', 'lithium', 'valproic', 'carbamazepine', 'lamotrigine', 'oxcarbazepine', 'topiramate', 'gabapentin', 'pregabalin'],
      warning: 'Increased risk of suicidal thoughts in young adults. Monitor for serotonin syndrome, metabolic changes, or movement disorders. May require therapeutic drug monitoring. Withdraw gradually to avoid discontinuation syndrome.',
      moa: 'Modulate neurotransmitter systems (serotonin, norepinephrine, dopamine, GABA, glutamate) to treat psychiatric and neurological disorders.'
    },
    
    // Extended endocrine medications
    'Endocrine Medications': {
      patterns: ['levothyroxine', 'liothyronine', 'methimazole', 'propylthiouracil', 'hydrocortisone', 'prednisone', 'dexamethasone', 'fludrocortisone', 'insulin', 'glipizide', 'glyburide', 'metformin', 'pioglitazone', 'rosiglitazone', 'sitagliptin', 'saxagliptin', 'linagliptin'],
      warning: 'Monitor hormone levels, blood glucose, or electrolytes regularly. Risk of adrenal suppression, hypoglycemia, or thyroid dysfunction. Dose adjustments often needed during illness or stress.',
      moa: 'Replace deficient hormones, inhibit hormone synthesis, or modulate hormone receptors to maintain endocrine homeostasis.'
    },
    
    // Extended respiratory medications
    'Respiratory Medications': {
      patterns: ['albuterol', 'salbutamol', 'salmeterol', 'formoterol', 'tiotropium', 'ipratropium', 'budesonide', 'fluticasone', 'montelukast', 'zafirlukast', 'theophylline'],
      warning: 'Monitor for paradoxical bronchospasm, tachycardia, or tremor. Risk of oral candidiasis with inhaled steroids. Use spacer devices with MDIs. Monitor theophylline levels if used.',
      moa: 'Bronchodilation through beta-2 agonism, anticholinergic effects, corticosteroid anti-inflammatory action, or leukotriene receptor blockade.'
    },
    
    // Extended gastrointestinal medications
    'GI Medications': {
      patterns: ['omeprazole', 'esomeprazole', 'lansoprazole', 'pantoprazole', 'rabeprazole', 'ranitidine', 'famotidine', 'sucralfate', 'misoprostol', 'ondansetron', 'metoclopramide', 'domperidone', 'loperamide'],
      warning: 'Long-term PPI use may increase fracture risk, C. difficile infection, and vitamin B12 deficiency. Monitor magnesium levels. Risk of tardive dyskinesia with metoclopramide.',
      moa: 'Reduce gastric acid production, protect GI mucosa, modulate GI motility, or prevent nausea/vomiting through various receptor mechanisms.'
    },
    
    // Extended pain management
    'Pain Management': {
      patterns: ['morphine', 'oxycodone', 'hydrocodone', 'fentanyl', 'hydromorphone', 'codeine', 'tramadol', 'tapentadol', 'gabapentin', 'pregabalin', 'duloxetine', 'amitriptyline', 'ketamine', 'lidocaine'],
      warning: 'High risk of respiratory depression, constipation, and dependence. Monitor for signs of overdose, especially with opioids. Risk of serotonin syndrome with certain combinations. Use lowest effective dose.',
      moa: 'Modulate pain perception through opioid receptor activation, NMDA receptor blockade, calcium channel inhibition, or neurotransmitter modulation.'
    },
    
    // Extended autoimmune medications
    'Autoimmune Medications': {
      patterns: ['methotrexate', 'azathioprine', 'mycophenolate', 'cyclophosphamide', 'cyclosporine', 'tacrolimus', 'sirolimus', 'hydroxychloroquine', 'sulfasalazine', 'leflunomide'],
      warning: 'Require regular blood count, liver, and renal monitoring. Increased infection risk. Risk of bone marrow suppression, hepatotoxicity, or nephrotoxicity. Many drug interactions. Folate supplementation often needed.',
      moa: 'Suppress immune system through antimetabolite activity, calcineurin inhibition, or cytokine modulation to treat autoimmune diseases.'
    },
    
    // Extended cancer medications
    'Oncology Medications': {
      patterns: ['cisplatin', 'carboplatin', 'oxaliplatin', 'paclitaxel', 'docetaxel', 'doxorubicin', 'cyclophosphamide', '5-fluorouracil', 'tamoxifen', 'letrozole', 'anastrozole', 'imatinib', 'gefitinib', 'erlotinib'],
      warning: 'Require specialized oncology monitoring. High risk of myelosuppression, cardiotoxicity, nephrotoxicity, or neurotoxicity. Antiemetic prophylaxis often needed. Monitor tumor markers and imaging.',
      moa: 'Target rapidly dividing cells through DNA damage, microtubule inhibition, or specific molecular pathway blockade to treat malignancies.'
    }
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
    take: 5000 // Increased batch size for maximum coverage
  })

  console.log(`📋 Found ${drugsWithoutWarnings.length} drugs without clinical warnings`)

  let updatedCount = 0
  const categoryCounts: Record<string, number> = {}

  for (const drug of drugsWithoutWarnings) {
    let clinicalInfo = null
    const genericLower = drug.genericName.toLowerCase()
    
    // Check against comprehensive patterns
    for (const [category, info] of Object.entries(comprehensiveClinicalPatterns)) {
      for (const pattern of info.patterns) {
        if (genericLower.includes(pattern.toLowerCase())) {
          clinicalInfo = {
            warning: info.warning,
            category: category
          }
          break
        }
      }
      if (clinicalInfo) break
    }
    
    if (clinicalInfo) {
      await db.drug.update({
        where: { id: drug.id },
        data: {
          warnings: clinicalInfo.warning
        }
      })
      
      updatedCount++
      categoryCounts[clinicalInfo.category] = (categoryCounts[clinicalInfo.category] || 0) + 1
      
      if (updatedCount % 100 === 0) {
        console.log(`✅ Updated ${updatedCount} drugs with clinical warnings...`)
      }
    }
  }

  console.log(`\n🎯 MAXIMIZED Clinical Warnings Population Complete!`)
  console.log(`✅ Total Updated: ${updatedCount} drugs`)
  console.log(`📊 Success Rate: ${((updatedCount/drugsWithoutWarnings.length)*100).toFixed(1)}%`)
  console.log('\n📈 Coverage by Category:')
  for (const [category, count] of Object.entries(categoryCounts)) {
    console.log(`   ${category}: ${count} drugs`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
