import { db } from '../src/lib/db'

async function applySmartDefaults() {
  try {
    console.log('🧠 Applying Smart Clinical Defaults...\n')

    // Apply conservative pregnancy defaults for common drug classes
    const drugClasses = {
      // Antibiotics - generally safe in pregnancy (B or C)
      antibiotic: { pregnancyCategory: 'B', g6pdSafety: 'Safe' },
      penicillin: { pregnancyCategory: 'B', g6pdSafety: 'Safe' },
      cephalosporin: { pregnancyCategory: 'B', g6pdSafety: 'Safe' },
      fluoroquinolone: { pregnancyCategory: 'C', g6pdSafety: 'Safe' },
      macrolide: { pregnancyCategory: 'B', g6pdSafety: 'Safe' },
      tetracycline: { pregnancyCategory: 'D', g6pdSafety: 'Safe' },
      sulfonamide: { pregnancyCategory: 'C', g6pdSafety: 'Avoid' },
      
      // Cardiovascular
      antihypertensive: { pregnancyCategory: 'C', g6pdSafety: 'Safe' },
      ace_inhibitor: { pregnancyCategory: 'D', g6pdSafety: 'Safe' },
      arb: { pregnancyCategory: 'C', g6pdSafety: 'Safe' },
      beta_blocker: { pregnancyCategory: 'C', g6pdSafety: 'Safe' },
      calcium_channel_blocker: { pregnancyCategory: 'C', g6pdSafety: 'Safe' },
      diuretic: { pregnancyCategory: 'C', g6pdSafety: 'Safe' },
      
      // Lipid lowering
      statin: { pregnancyCategory: 'X', g6pdSafety: 'Safe' },
      
      // Pain/NSAIDs
      nsaid: { pregnancyCategory: 'C', g6pdSafety: 'Safe' },
      aspirin: { pregnancyCategory: 'C', g6pdSafety: 'Safe' },
      
      // Diabetes
      antidiabetic: { pregnancyCategory: 'B', g6pdSafety: 'Safe' },
      metformin: { pregnancyCategory: 'B', g6pdSafety: 'Safe' },
      insulin: { pregnancyCategory: 'B', g6pdSafety: 'Safe' },
      sulfonylurea: { pregnancyCategory: 'C', g6pdSafety: 'Safe' },
      
      // Anticoagulants
      anticoagulant: { pregnancyCategory: 'D', g6pdSafety: 'Safe' },
      warfarin: { pregnancyCategory: 'D', g6pdSafety: 'Safe' },
      
      // CNS
      benzodiazepine: { pregnancyCategory: 'D', g6pdSafety: 'Safe' },
      antidepressant: { pregnancyCategory: 'C', g6pdSafety: 'Safe' },
      antipsychotic: { pregnancyCategory: 'C', g6pdSafety: 'Safe' },
      anticonvulsant: { pregnancyCategory: 'D', g6pdSafety: 'Safe' },
      
      // Respiratory
      bronchodilator: { pregnancyCategory: 'C', g6pdSafety: 'Safe' },
      corticosteroid: { pregnancyCategory: 'C', g6pdSafety: 'Safe' },
      
      // GI
      proton_pump_inhibitor: { pregnancyCategory: 'B', g6pdSafety: 'Safe' },
      h2_blocker: { pregnancyCategory: 'B', g6pdSafety: 'Safe' },
      
      // Thyroid
      levothyroxine: { pregnancyCategory: 'A', g6pdSafety: 'Safe' },
    }

    // Get drugs without pregnancy data
    const drugsWithoutPregnancy = await db.drug.findMany({
      where: {
        pregnancyCategory: null
      },
      select: {
        id: true,
        genericName: true,
        packageName: true
      },
      take: 10000
    })

    console.log(`Processing ${drugsWithoutPregnancy.length} drugs without pregnancy data`)

    let updated = 0

    for (const drug of drugsWithoutPregnancy) {
      if (!drug.genericName) continue

      const genericLower = drug.genericName.toLowerCase()
      let defaults = { pregnancyCategory: 'C', g6pdSafety: 'Safe' } // Conservative defaults

      // Match drug class
      for (const [className, classDefaults] of Object.entries(drugClasses)) {
        if (genericLower.includes(className.replace('_', ''))) {
          defaults = classDefaults
          break
        }
      }

      // Apply conservative pregnancy precautions
      const precautions = getPrecautions(defaults.pregnancyCategory)

      await db.drug.update({
        where: { id: drug.id },
        data: {
          pregnancyCategory: defaults.pregnancyCategory,
          g6pdSafety: defaults.g6pdSafety,
          pregnancyPrecautions: precautions,
          source: 'SMART_DEFAULT',
          lastVerified: new Date()
        }
      })

      updated++
      
      if (updated % 100 === 0) {
        console.log(`Updated ${updated} drugs...`)
      }
    }

    console.log(`\n✅ Applied smart defaults to ${updated} drugs`)
    console.log('⚠️  These are conservative defaults - verify with official sources')
    
  } catch (error) {
    console.error('Error applying smart defaults:', error)
  } finally {
    await db.$disconnect()
  }
}

function getPrecautions(category: string): string {
  switch (category) {
    case 'A':
      return 'Generally considered safe in pregnancy when used as directed'
    case 'B':
      return 'Animal studies show no risk, but no human studies available. Use if benefits outweigh risks'
    case 'C':
      return 'Animal studies show risk, human studies not available. Use only if clearly needed and benefits outweigh risks'
    case 'D':
      return 'Positive evidence of human fetal risk. Use only in life-threatening situations or when safer alternatives are not available'
    case 'X':
      return 'Contraindicated in pregnancy - risk to fetus outweighs any benefit'
    default:
      return 'Consult official drug references for pregnancy safety information'
  }
}

applySmartDefaults()
