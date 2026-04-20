import { db } from '../src/lib/db'

async function main() {
  console.log('🫀 Adding Dosage Adjustment Guidelines...\n')

  // Renal and hepatic adjustment patterns based on drug classes
  const dosageAdjustments = {
    // Antibiotics
    'Antibiotics': {
      renal: 'Dose adjustment required for CrCl < 50 mL/min. Avoid or reduce dose for CrCl < 30 mL/min. Monitor levels if available.',
      hepatic: 'Mild hepatic impairment: no adjustment needed. Moderate-severe: reduce dose by 50% or use alternative agent.'
    },
    
    // Anticoagulants
    'Anticoagulants': {
      renal: 'Monitor INR more frequently in renal impairment. Dose reduction may be necessary for CrCl < 30 mL/min.',
      hepatic: 'Severe hepatic impairment: contraindicated or significant dose reduction required. Monitor for bleeding.'
    },
    
    // Statins
    'Statins': {
      renal: 'No adjustment needed for most statins. Avoid high-dose simvastatin in CrCl < 30 mL/min.',
      hepatic: 'Contraindicated in active liver disease. Start with low dose in mild hepatic impairment.'
    },
    
    // ACE Inhibitors
    'ACE Inhibitors': {
      renal: 'Start with low dose, titrate carefully. Monitor potassium and renal function. Avoid in bilateral renal artery stenosis.',
      hepatic: 'Use with caution in hepatic impairment. May require dose reduction.'
    },
    
    // Beta Blockers
    'Beta Blockers': {
      renal: 'Adjust dose based on CrCl. Avoid carvedilol in severe renal impairment.',
      hepatic: 'Severe hepatic impairment: avoid or use dose reduction. Monitor for bradycardia.'
    },
    
    // Antidepressants
    'Antidepressants': {
      renal: 'CrCl < 30 mL/min: reduce dose by 50%. Monitor for increased side effects.',
      hepatic: 'Severe hepatic impairment: avoid most SSRIs. Use with caution and dose reduction.'
    },
    
    // Antidiabetics
    'Antidiabetics': {
      renal: 'Metformin: contraindicated if CrCl < 30 mL/min. Reduce dose for CrCl 30-60 mL/min. Other agents may need adjustment.',
      hepatic: 'Use with caution in hepatic impairment. Monitor glucose closely. May need dose reduction.'
    },
    
    // NSAIDs
    'NSAIDs': {
      renal: 'Avoid in severe renal impairment (CrCl < 30 mL/min). Use lowest effective dose and monitor renal function.',
      hepatic: 'Use with caution in hepatic impairment. Avoid in severe liver disease.'
    },
    
    // Diuretics
    'Diuretics': {
      renal: 'Loop diuretics: may need higher doses in severe renal impairment. Thiazides: less effective when eGFR < 30.',
      hepatic: 'Use with caution in severe hepatic impairment. Monitor electrolytes closely.'
    }
  }

  // Get drugs without dosage adjustment info
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
    take: 1500 // Process in batches
  })

  console.log(`📋 Found ${drugsWithoutAdjustments.length} drugs without dosage adjustment info`)

  let updatedCount = 0

  for (const drug of drugsWithoutAdjustments) {
    let adjustmentInfo = null
    const genericLower = drug.genericName.toLowerCase()
    
    // Identify drug class and assign adjustments
    if (genericLower.includes('cillin') || genericLower.includes('mycin') || 
        genericLower.includes('oxacin') || genericLower.includes('cycline')) {
      adjustmentInfo = dosageAdjustments['Antibiotics']
    } else if (genericLower.includes('warfarin') || genericLower.includes('heparin') || 
               genericLower.includes('xaban') || genericLower.includes('grel')) {
      adjustmentInfo = dosageAdjustments['Anticoagulants']
    } else if (genericLower.includes('vastatin') || genericLower.includes('statin')) {
      adjustmentInfo = dosageAdjustments['Statins']
    } else if (genericLower.includes('pril') || genericLower.includes('ace')) {
      adjustmentInfo = dosageAdjustments['ACE Inhibitors']
    } else if (genericLower.includes('olol') || genericLower.includes('alol')) {
      adjustmentInfo = dosageAdjustments['Beta Blockers']
    } else if (genericLower.includes('sertraline') || genericLower.includes('fluoxetine') || 
               genericLower.includes('paroxetine') || genericLower.includes('citalopram')) {
      adjustmentInfo = dosageAdjustments['Antidepressants']
    } else if (genericLower.includes('metformin') || genericLower.includes('glipizide') || 
               genericLower.includes('glyburide') || genericLower.includes('insulin')) {
      adjustmentInfo = dosageAdjustments['Antidiabetics']
    } else if (genericLower.includes('ibuprofen') || genericLower.includes('naproxen') || 
               genericLower.includes('diclofenac') || genericLower.includes('celecoxib')) {
      adjustmentInfo = dosageAdjustments['NSAIDs']
    } else if (genericLower.includes('furosemide') || genericLower.includes('hydrochlorothiazide') || 
               genericLower.includes('spironolactone') || genericLower.includes('diuretic')) {
      adjustmentInfo = dosageAdjustments['Diuretics']
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
      
      if (updatedCount % 100 === 0) {
        console.log(`✅ Updated ${updatedCount} drugs with dosage adjustments...`)
      }
    }
  }

  console.log(`\n🎯 Dosage Assignment Complete!`)
  console.log(`✅ Total Updated: ${updatedCount} drugs`)
  console.log(`📊 Success Rate: ${((updatedCount/drugsWithoutAdjustments.length)*100).toFixed(1)}%`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
