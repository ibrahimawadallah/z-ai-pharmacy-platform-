import { db } from '../src/lib/db'

async function main() {
  console.log('🔄 Expanding Drug Interaction Coverage...\n')

  // Common interaction patterns based on drug classes
  const commonInteractions = [
    // Antibiotics interactions
    {
      genericPatterns: ['cillin', 'mycin', 'cycline'],
      interactions: [
        { secondaryDrugName: 'Oral Contraceptives', severity: 'moderate', description: 'Reduced contraceptive efficacy', management: 'Use backup contraception during and after antibiotic course' },
        { secondaryDrugName: 'Warfarin', severity: 'severe', description: 'Enhanced anticoagulant effect', management: 'Monitor INR closely, dose adjustment may be needed' },
        { secondaryDrugName: 'Methotrexate', severity: 'severe', description: 'Increased methotrexate toxicity', management: 'Avoid combination or reduce methotrexate dose' }
      ]
    },
    
    // NSAIDs interactions
    {
      genericPatterns: ['ibuprofen', 'naproxen', 'diclofenac'],
      interactions: [
        { secondaryDrugName: 'Warfarin', severity: 'severe', description: 'Increased bleeding risk', management: 'Monitor for bleeding, consider alternative analgesic' },
        { secondaryDrugName: 'ACE Inhibitors', severity: 'moderate', description: 'Reduced antihypertensive effect', management: 'Monitor blood pressure, may need dose adjustment' },
        { secondaryDrugName: 'Diuretics', severity: 'moderate', description: 'Reduced diuretic effect, increased nephrotoxicity', management: 'Monitor renal function, maintain adequate hydration' },
        { secondaryDrugName: 'Aspirin', severity: 'moderate', description: 'Increased GI bleeding risk', management: 'Use with caution, consider gastroprotection' }
      ]
    },
    
    // Statins interactions
    {
      genericPatterns: ['vastatin', 'statin'],
      interactions: [
        { secondaryDrugName: 'Grapefruit Juice', severity: 'moderate', description: 'Increased statin levels', management: 'Avoid grapefruit juice while taking statins' },
        { secondaryDrugName: 'Macrolide Antibiotics', severity: 'severe', description: 'Increased risk of rhabdomyolysis', management: 'Avoid combination or monitor CK levels' },
        { secondaryDrugName: 'Fibrates', severity: 'moderate', description: 'Increased risk of myopathy', management: 'Monitor for muscle symptoms, consider dose reduction' },
        { secondaryDrugName: 'Warfarin', severity: 'moderate', description: 'Altered INR values', management: 'Monitor INR closely after starting/stopping statins' }
      ]
    },
    
    // ACE Inhibitors interactions
    {
      genericPatterns: ['pril'],
      interactions: [
        { secondaryDrugName: 'Potassium Supplements', severity: 'severe', description: 'Hyperkalemia risk', management: 'Monitor potassium levels, avoid supplements' },
        { secondaryDrugName: 'NSAIDs', severity: 'moderate', description: 'Reduced antihypertensive effect', management: 'Monitor blood pressure, consider alternative' },
        { secondaryDrugName: 'Lithium', severity: 'severe', description: 'Lithium toxicity', management: 'Monitor lithium levels, dose reduction needed' },
        { secondaryDrugName: 'Diuretics', severity: 'moderate', description: 'Increased risk of renal impairment', management: 'Monitor renal function and electrolytes' }
      ]
    },
    
    // Beta Blockers interactions
    {
      genericPatterns: ['olol'],
      interactions: [
        { secondaryDrugName: 'Calcium Channel Blockers', severity: 'moderate', description: 'Excessive bradycardia', management: 'Monitor heart rate and blood pressure' },
        { secondaryDrugName: 'Digoxin', severity: 'moderate', description: 'Increased digoxin levels', management: 'Monitor digoxin levels, dose adjustment may be needed' },
        { secondaryDrugName: 'Insulin', severity: 'moderate', description: 'Masked hypoglycemia symptoms', management: 'Monitor glucose closely, educate patient' },
        { secondaryDrugName: 'Clonidine', severity: 'severe', description: 'Hypertensive crisis on withdrawal', management: 'Taper beta blocker before stopping clonidine' }
      ]
    },
    
    // Antidepressants interactions
    {
      genericPatterns: ['sertraline', 'fluoxetine', 'paroxetine', 'citalopram'],
      interactions: [
        { secondaryDrugName: 'MAO Inhibitors', severity: 'severe', description: 'Serotonin syndrome', management: 'Avoid combination, wait 2 weeks after MAOI discontinuation' },
        { secondaryDrugName: 'Warfarin', severity: 'moderate', description: 'Altered INR values', management: 'Monitor INR closely, dose adjustment may be needed' },
        { secondaryDrugName: 'NSAIDs', severity: 'moderate', description: 'Increased bleeding risk', management: 'Use with caution, consider alternative analgesic' },
        { secondaryDrugName: 'Triptans', severity: 'moderate', description: 'Serotonin syndrome risk', management: 'Avoid combination or monitor for serotonin syndrome' }
      ]
    },
    
    // Anticoagulants interactions
    {
      genericPatterns: ['warfarin', 'heparin'],
      interactions: [
        { secondaryDrugName: 'Antibiotics', severity: 'moderate', description: 'Altered INR values', management: 'Monitor INR frequently during antibiotic course' },
        { secondaryDrugName: 'NSAIDs', severity: 'severe', description: 'Increased bleeding risk', management: 'Avoid combination, use alternative analgesic' },
        { secondaryDrugName: 'Antiplatelets', severity: 'severe', description: 'Major bleeding risk', management: 'Avoid combination unless specifically indicated' },
        { secondaryDrugName: 'Grapefruit Juice', severity: 'mild', description: 'Minor effect on warfarin metabolism', management: 'Monitor INR if regular grapefruit juice consumer' }
      ]
    }
  ]

  // Get drugs with few or no interactions
  const drugsWithFewInteractions = await db.drug.findMany({
    where: {
      interactions: {
        none: {}
      }
    },
    select: {
      id: true,
      genericName: true,
      packageName: true,
      _count: {
        select: { interactions: true }
      }
    },
    take: 2000 // Process in batches
  })

  console.log(`📋 Found ${drugsWithFewInteractions.length} drugs with few interactions`)

  let updatedCount = 0
  let totalInteractionsAdded = 0

  for (const drug of drugsWithFewInteractions) {
    const genericLower = drug.genericName.toLowerCase()
    let addedInteractions = 0
    
    // Find matching drug class
    for (const drugClass of commonInteractions) {
      let matchesPattern = false
      
      for (const pattern of drugClass.genericPatterns) {
        if (genericLower.includes(pattern.toLowerCase())) {
          matchesPattern = true
          break
        }
      }
      
      if (matchesPattern) {
        // Add interactions for this drug
        for (const interaction of drugClass.interactions) {
          // Check if this interaction already exists
          const existingInteraction = await db.drugInteraction.findFirst({
            where: {
              drugId: drug.id,
              secondaryDrugName: interaction.secondaryDrugName
            }
          })
          
          if (!existingInteraction) {
            await db.drugInteraction.create({
              data: {
                drugId: drug.id,
                secondaryDrugName: interaction.secondaryDrugName,
                severity: interaction.severity,
                description: interaction.description,
                management: interaction.management,
                interactionType: 'pharmacodynamic'
              }
            })
            
            addedInteractions++
            totalInteractionsAdded++
          }
        }
        break
      }
    }
    
    if (addedInteractions > 0) {
      updatedCount++
      
      if (updatedCount % 50 === 0) {
        console.log(`✅ Updated ${updatedCount} drugs, added ${totalInteractionsAdded} interactions...`)
      }
    }
  }

  console.log(`\n🎯 Drug Interaction Expansion Complete!`)
  console.log(`✅ Drugs Updated: ${updatedCount}`)
  console.log(`🔄 Total Interactions Added: ${totalInteractionsAdded}`)
  console.log(`📊 Average New Interactions per Drug: ${(totalInteractionsAdded/updatedCount).toFixed(1)}`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
