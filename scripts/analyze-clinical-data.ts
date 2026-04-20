import { db } from '../src/lib/db'

async function main() {
  console.log('🔍 Analyzing UAE Drug Database...\n')

  // Get total drug count
  const totalDrugs = await db.drug.count()
  console.log(`📊 Total Drugs: ${totalDrugs}\n`)

  // Count drugs with side effects
  const drugsWithSideEffects = await db.drug.count({
    where: {
      sideEffects: {
        some: {}
      }
    }
  })
  console.log(`💊 Drugs with Side Effects: ${drugsWithSideEffects} (${((drugsWithSideEffects/totalDrugs)*100).toFixed(1)}%)\n`)

  // Count drugs with interactions
  const drugsWithInteractions = await db.drug.count({
    where: {
      interactions: {
        some: {}
      }
    }
  })
  console.log(`⚠️  Drugs with Interactions: ${drugsWithInteractions} (${((drugsWithInteractions/totalDrugs)*100).toFixed(1)}%)\n`)

  // Count drugs with warnings (MOA/Clinical info)
  const drugsWithWarnings = await db.drug.count({
    where: {
      warnings: {
        not: null
      }
    }
  })
  console.log(`⚗️  Drugs with Clinical Warnings: ${drugsWithWarnings} (${((drugsWithWarnings/totalDrugs)*100).toFixed(1)}%)\n`)

  // Count drugs with renal adjustment info
  const drugsWithRenalInfo = await db.drug.count({
    where: {
      renalAdjustment: {
        not: null
      }
    }
  })
  console.log(`🫀 Drugs with Renal Adjustment Info: ${drugsWithRenalInfo} (${((drugsWithRenalInfo/totalDrugs)*100).toFixed(1)}%)\n`)

  // Count drugs with hepatic adjustment info
  const drugsWithHepaticInfo = await db.drug.count({
    where: {
      hepaticAdjustment: {
        not: null
      }
    }
  })
  console.log(`🫁 Drugs with Hepatic Adjustment Info: ${drugsWithHepaticInfo} (${((drugsWithHepaticInfo/totalDrugs)*100).toFixed(1)}%)\n`)

  // Count drugs with pregnancy category
  const drugsWithPregnancyInfo = await db.drug.count({
    where: {
      pregnancyCategory: {
        not: null
      }
    }
  })
  console.log(`🤰 Drugs with Pregnancy Category: ${drugsWithPregnancyInfo} (${((drugsWithPregnancyInfo/totalDrugs)*100).toFixed(1)}%)\n`)

  // Count drugs with complete clinical info (side effects + interactions + warnings)
  const drugsWithCompleteInfo = await db.drug.count({
    where: {
      AND: [
        {
          sideEffects: {
            some: {}
          }
        },
        {
          interactions: {
            some: {}
          }
        },
        {
          warnings: {
            not: null
          }
        }
      ]
    }
  })
  console.log(`✅ Drugs with Complete Clinical Info (Side Effects + Interactions + Warnings): ${drugsWithCompleteInfo} (${((drugsWithCompleteInfo/totalDrugs)*100).toFixed(1)}%)\n`)

  // Get side effect statistics
  const totalSideEffects = await db.drugSideEffect.count()
  const avgSideEffectsPerDrug = totalSideEffects / drugsWithSideEffects
  console.log(`📈 Total Side Effects in Database: ${totalSideEffects}`)
  console.log(`📊 Average Side Effects per Drug: ${avgSideEffectsPerDrug.toFixed(1)}\n`)

  // Get interaction statistics
  const totalInteractions = await db.drugInteraction.count()
  const avgInteractionsPerDrug = totalInteractions / drugsWithInteractions
  console.log(`🔄 Total Drug Interactions in Database: ${totalInteractions}`)
  console.log(`📊 Average Interactions per Drug: ${avgInteractionsPerDrug.toFixed(1)}\n`)

  // Show distribution by severity
  const interactionSeverity = await db.drugInteraction.groupBy({
    by: ['severity'],
    _count: true,
    orderBy: {
      _count: {
        severity: 'desc'
      }
    }
  })
  console.log('📊 Interaction Severity Distribution:')
  interactionSeverity.forEach((item: any) => {
    const severity = item.severity || 'Unknown'
    const count = item._count
    const percentage = ((count / totalInteractions) * 100).toFixed(1)
    console.log(`   ${severity}: ${count} (${percentage}%)`)
  })

  // Show side effect frequency distribution
  const sideEffectFrequency = await db.drugSideEffect.groupBy({
    by: ['frequency'],
    _count: true,
    orderBy: {
      _count: {
        frequency: 'desc'
      }
    }
  })
  console.log('\n📊 Side Effect Frequency Distribution:')
  sideEffectFrequency.forEach((item: any) => {
    const frequency = item.frequency || 'Unknown'
    const count = item._count
    const percentage = ((count / totalSideEffects) * 100).toFixed(1)
    console.log(`   ${frequency}: ${count} (${percentage}%)`)
  })

  // Get sample of drugs with complete info
  const sampleDrugs = await db.drug.findMany({
    where: {
      AND: [
        {
          sideEffects: {
            some: {}
          }
        },
        {
          interactions: {
            some: {}
          }
        },
        {
          warnings: {
            not: null
          }
        }
      ]
    },
    select: {
      drugCode: true,
      packageName: true,
      genericName: true,
      _count: {
        select: {
          sideEffects: true,
          interactions: true
        }
      }
    },
    take: 10,
    orderBy: {
      packageName: 'asc'
    }
  })

  console.log('\n🔬 Sample Drugs with Complete Clinical Info:')
  sampleDrugs.forEach((drug: any) => {
    console.log(`   ${drug.packageName} (${drug.genericName})`)
    console.log(`     Drug Code: ${drug.drugCode}`)
    console.log(`     Side Effects: ${drug._count.sideEffects}`)
    console.log(`     Interactions: ${drug._count.interactions}`)
    console.log('')
  })
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
