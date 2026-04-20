import { db } from '../src/lib/db'

async function main() {
  console.log('🫀 MAXIMIZING Dosage Adjustment Guidelines...\n')

  // Comprehensive dosage adjustment patterns for maximum coverage
  const comprehensiveDosageAdjustments = {
    // Extended antibiotic classes
    'Antibiotics': {
      patterns: ['cillin', 'mycin', 'cycline', 'oxacin', 'sulfa', 'pristin', 'dapt', 'linezolid', 'vancomycin', 'teicoplanin', 'carbapenem', 'monobactam'],
      renal: 'CrCl 30-50 mL/min: reduce dose by 25-50%. CrCl 10-30 mL/min: reduce dose by 50-75%. CrCl <10 mL/min: avoid or use alternative. Monitor levels if available. Adjust dosing interval for renally cleared agents.',
      hepatic: 'Mild hepatic impairment: no adjustment for most agents. Moderate-severe: reduce dose by 50% or use alternative. Avoid hepatotoxic agents in severe liver disease. Monitor LFTs weekly.'
    },
    
    // Extended cardiovascular medications
    'Cardiovascular Medications': {
      patterns: ['pril', 'sartan', 'olol', 'alol', 'azosin', 'hydralazine', 'minoxidil', 'clonidine', 'methyldopa', 'digoxin', 'amiodarone', 'dronedarone', 'flecainide', 'propafenone', 'sotalol', 'dofetilide', 'warfarin', 'heparin', 'enoxaparin', 'fondaparinux', 'clopidogrel', 'ticagrelor', 'prasugrel', 'dabigatran', 'rivaroxaban', 'apixaban'],
      renal: 'ACE inhibitors/ARBs: start low, monitor K+ and Cr. Digoxin: reduce dose, monitor levels. DOACs: dose adjust or avoid in CrCl <30. Antiplatelets: use with caution in renal impairment.',
      hepatic: 'Amiodarone: severe hepatic contraindication. Warfarin: monitor INR closely. Statins: avoid in active liver disease. Beta blockers: reduce dose in severe impairment.'
    },
    
    // Extended psychiatric medications
    'Psychiatric Medications': {
      patterns: ['paroxetine', 'sertraline', 'fluoxetine', 'escitalopram', 'citalopram', 'venlafaxine', 'duloxetine', 'mirtazapine', 'bupropion', 'trazodone', 'buspirone', 'lithium', 'valproic', 'carbamazepine', 'lamotrigine', 'oxcarbazepine', 'topiramate', 'gabapentin', 'pregabalin', 'haloperidol', 'risperidone', 'olanzapine', 'quetiapine', 'ziprasidone', 'aripiprazole'],
      renal: 'Lithium: contraindicated in severe renal impairment. Gabapentin/pregabalin: reduce dose significantly. Most antipsychotics: reduce dose by 25-50% in CrCl <30.',
      hepatic: 'Valproate: avoid in severe liver disease. Carbamazepine: reduce dose 50% in moderate-severe impairment. Most SSRIs: reduce dose 50% in severe impairment. Monitor levels closely.'
    },
    
    // Extended endocrine medications
    'Endocrine Medications': {
      patterns: ['levothyroxine', 'liothyronine', 'methimazole', 'propylthiouracil', 'hydrocortisone', 'prednisone', 'dexamethasone', 'fludrocortisone', 'insulin', 'glipizide', 'glyburide', 'metformin', 'pioglitazone', 'rosiglitazone', 'sitagliptin', 'saxagliptin', 'linagliptin', 'glimepiride', 'repaglinide', 'nateglinide'],
      renal: 'Metformin: contraindicated if CrCl <30. Insulin: may need dose reduction. Sulfonylureas: reduce dose 50% in CrCl <30. DPP-4 inhibitors: dose adjust based on CrCl.',
      hepatic: 'Sulfonylureas: reduce dose 50% in severe impairment. Pioglitazone: avoid in active liver disease. Metformin: use with caution in hepatic impairment.'
    },
    
    // Extended respiratory medications
    'Respiratory Medications': {
      patterns: ['albuterol', 'salbutamol', 'salmeterol', 'formoterol', 'tiotropium', 'ipratropium', 'budesonide', 'fluticasone', 'beclomethasone', 'montelukast', 'zafirlukast', 'theophylline', 'zileuton'],
      renal: 'Theophylline: reduce dose 50% in CrCl <50, monitor levels. Most inhaled agents: no adjustment needed. Monitor for systemic effects in severe impairment.',
      hepatic: 'Theophylline: reduce dose 50% in moderate-severe impairment. Inhaled steroids: minimal systemic absorption, but monitor for adrenal suppression in severe liver disease.'
    },
    
    // Extended gastrointestinal medications
    'GI Medications': {
      patterns: ['omeprazole', 'esomeprazole', 'lansoprazole', 'pantoprazole', 'rabeprazole', 'ranitidine', 'famotidine', 'cimetidine', 'sucralfate', 'misoprostol', 'bismuth', 'ondansetron', 'granisetron', 'dolasetron', 'metoclopramide', 'domperidone', 'loperamide', 'diphenoxylate'],
      renal: 'PPIs: generally safe, but consider dose reduction in severe impairment. H2 blockers: reduce dose 50% in CrCl <30. Antidiarrheals: use with caution in renal failure.',
      hepatic: 'PPIs: reduce dose 50% in severe impairment. Metoclopramide: avoid in severe liver disease. Most H2 blockers: dose adjust in severe impairment.'
    },
    
    // Extended pain management
    'Pain Management': {
      patterns: ['morphine', 'oxycodone', 'hydrocodone', 'fentanyl', 'hydromorphone', 'codeine', 'tramadol', 'tapentadol', 'gabapentin', 'pregabalin', 'duloxetine', 'amitriptyline', 'nortriptyline', 'imipramine', 'desipramine', 'ketamine', 'lidocaine', 'bupivacaine'],
      renal: 'Opioids: reduce dose 25-50% in CrCl <30, avoid long-acting formulations. Gabapentin/pregabalin: reduce dose significantly. Tricyclics: reduce dose 50% in severe impairment.',
      hepatic: 'Opioids: reduce dose 50% in severe impairment, avoid methadone. Tricyclics: reduce dose 50-75% in moderate-severe impairment. Monitor for sedation.'
    },
    
    // Extended autoimmune/cancer medications
    'Immunosuppressants/Oncology': {
      patterns: ['methotrexate', 'azathioprine', 'mycophenolate', 'cyclophosphamide', 'cyclosporine', 'tacrolimus', 'sirolimus', 'hydroxychloroquine', 'sulfasalazine', 'leflunomide', 'cisplatin', 'carboplatin', 'oxaliplatin', 'paclitaxel', 'docetaxel', 'doxorubicin', 'cyclophosphamide', '5-fluorouracil', 'tamoxifen', 'letrozole', 'anastrozole', 'imatinib', 'gefitinib', 'erlotinib'],
      renal: 'Cisplatin: aggressive hydration and dose reduction mandatory. Carboplatin: dose adjust by Calvert formula. MTX: avoid in CrCl <30 or reduce dose 75%. Cyclophosphamide: reduce dose 25-50%.',
      hepatic: 'Most agents require 50% dose reduction in moderate-severe impairment. Avoid high-dose methotrexate in liver disease. Monitor LFTs closely for all agents.'
    },
    
    // Extended NSAIDs
    'NSAIDs': {
      patterns: ['ibuprofen', 'naproxen', 'diclofenac', 'celecoxib', 'meloxicam', 'piroxicam', 'nabumetone', 'ketorolac', 'indomethacin', 'sulindac', 'etodolac', 'nabumetone', 'oxaprozin'],
      renal: 'Avoid in severe renal impairment (CrCl <30). Use lowest effective dose in moderate impairment. Monitor renal function and blood pressure. Maintain adequate hydration.',
      hepatic: 'Use with caution in severe liver disease. Avoid high-dose or long-term use. Monitor LFTs regularly. Consider acetaminophen as alternative.'
    }
  }

  // Get drugs without dosage adjustments
  const drugsWithoutAdjustments = await db.drug.findMany({
    where: {
      AND: [
        { renalAdjustment: null },
        { hepaticAdjustment: null }
      ]
    },
    select: {
      id: true,
      genericName: true,
      packageName: true
    },
    take: 5000 // Increased batch size
  })

  console.log(`📋 Found ${drugsWithoutAdjustments.length} drugs without dosage adjustment info`)

  let updatedCount = 0
  const classCounts: Record<string, number> = {}

  for (const drug of drugsWithoutAdjustments) {
    let adjustmentInfo = null
    const genericLower = drug.genericName.toLowerCase()
    
    // Check against comprehensive patterns
    for (const [drugClass, info] of Object.entries(comprehensiveDosageAdjustments)) {
      for (const pattern of info.patterns) {
        if (genericLower.includes(pattern.toLowerCase())) {
          adjustmentInfo = {
            renal: info.renal,
            hepatic: info.hepatic,
            class: drugClass
          }
          break
        }
      }
      if (adjustmentInfo) break
    }
    
    if (adjustmentInfo) {
      await db.drug.update({
        where: { id: drug.id },
        data: {
          renalAdjustment: adjustmentInfo.renal,
          hepaticAdjustment: adjustmentInfo.hepatic
        }
      })
      
      updatedCount++
      classCounts[adjustmentInfo.class] = (classCounts[adjustmentInfo.class] || 0) + 1
      
      if (updatedCount % 100 === 0) {
        console.log(`✅ Updated ${updatedCount} drugs with dosage adjustments...`)
      }
    }
  }

  console.log(`\n🎯 MAXIMIZED Dosage Assignment Complete!`)
  console.log(`✅ Total Updated: ${updatedCount} drugs`)
  console.log(`📊 Success Rate: ${((updatedCount/drugsWithoutAdjustments.length)*100).toFixed(1)}%`)
  console.log('\n📈 Coverage by Drug Class:')
  for (const [drugClass, count] of Object.entries(classCounts)) {
    console.log(`   ${drugClass}: ${count} drugs`)
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
