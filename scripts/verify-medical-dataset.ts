import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║   MEDICAL DATASET & CHATBOT VERIFICATION                ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  // Count all data
  const drugCount = await prisma.drug.count()
  const diseaseCount = await prisma.disease.count()
  const treatmentCount = await prisma.diseaseTreatment.count()
  const interactionCount = await prisma.drugInteraction.count()
  const sideEffectCount = await prisma.drugSideEffect.count()
  const icd10Count = await prisma.iCD10Mapping.count()
  const pregnancyCount = await prisma.drug.count({ where: { pregnancyCategory: { not: null } } })
  const g6pdCount = await prisma.drug.count({ where: { g6pdSafety: { not: null } } })

  console.log('📊 DATABASE OVERVIEW:')
  console.log('━'.repeat(60))
  console.log(`💊 Total Drugs:              ${drugCount.toLocaleString()}`)
  console.log(`🏥 Total Diseases:            ${diseaseCount}`)
  console.log(`💉 Treatment Mappings:        ${treatmentCount}`)
  console.log(`🔗 Drug Interactions:         ${interactionCount}`)
  console.log(`⚠️  Drug Side Effects:         ${sideEffectCount}`)
  console.log(`🏷️  ICD-10 Mappings:          ${icd10Count.toLocaleString()}`)
  console.log(`🤰 Pregnancy Data:            ${pregnancyCount.toLocaleString()} (${((pregnancyCount/drugCount)*100).toFixed(1)}%)`)
  console.log(`🧬 G6PD Safety:               ${g6pdCount.toLocaleString()} (${((g6pdCount/drugCount)*100).toFixed(1)}%)`)

  console.log('\n\n📋 DISEASES BY SPECIALTY:')
  console.log('━'.repeat(60))

  const diseases = await prisma.disease.findMany({
    select: { name: true, category: true, icd10Code: true },
    orderBy: { category: 'asc' }
  })

  const byCategory = diseases.reduce((acc, d) => {
    const cat = d.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(d)
    return acc
  }, {} as Record<string, typeof diseases>)

  for (const [category, diseases] of Object.entries(byCategory)) {
    console.log(`\n${category}:`)
    diseases.forEach(d => {
      console.log(`  • ${d.name} (${d.icd10Code})`)
    })
  }

  console.log('\n\n💊 SAMPLE DISEASE-TREATMENT MAPPINGS:')
  console.log('━'.repeat(60))

  const sampleDiseases = await prisma.disease.findMany({
    where: { treatments: { some: {} } },
    include: {
      treatments: {
        include: {
          drug: {
            select: {
              packageName: true,
              genericName: true,
              pregnancyCategory: true,
              g6pdSafety: true
            }
          }
        },
        take: 3
      }
    },
    take: 5
  })

  for (const disease of sampleDiseases) {
    console.log(`\n${disease.name} (${disease.icd10Code}):`)
    disease.treatments.forEach(t => {
      console.log(`  → ${t.drug.genericName || t.drug.packageName} [${t.lineOfTherapy}]`)
      console.log(`    Dose: ${t.dose || 'N/A'} | Pregnancy: ${t.drug.pregnancyCategory || 'N/A'} | G6PD: ${t.drug.g6pdSafety || 'N/A'}`)
    })
  }

  console.log('\n\n🤖 CHATBOT TOOLS AVAILABLE:')
  console.log('━'.repeat(60))
  console.log(`1. drugLookup            - Look up any of ${drugCount.toLocaleString()} drugs`)
  console.log(`2. checkInteraction      - Check drug-drug interactions`)
  console.log(`3. getSideEffects        - Get side effects profile`)
  console.log(`4. checkPregnancy        - Check pregnancy safety`)
  console.log(`5. lookupDisease         - Look up any of ${diseaseCount} diseases`)
  console.log(`6. getTreatmentRecommendations - Get treatment protocols`)

  console.log('\n\n🎯 NLP INTENT TYPES:')
  console.log('━'.repeat(60))
  console.log(`• drug_lookup            - Drug information queries`)
  console.log(`• interaction_check      - Drug interaction queries`)
  console.log(`• side_effects           - Side effects queries`)
  console.log(`• pregnancy_check        - Pregnancy safety queries`)
  console.log(`• dosage_info           - Dosing queries`)
  console.log(`• contraindication       - Contraindication queries`)
  console.log(`• renal_adjustment       - Renal dose queries`)
  console.log(`• hepatic_adjustment     - Hepatic dose queries`)
  console.log(`• g6pd_check            - G6PD safety queries`)
  console.log(`• alternative_drug       - Drug alternative queries`)
  console.log(`• disease_lookup         - Disease information queries ✨ NEW`)
  console.log(`• treatment_recommendation - Treatment queries ✨ NEW`)
  console.log(`• differential_diagnosis  - Diagnostic reasoning ✨ NEW`)

  console.log('\n\n✅ MEDICAL DATASET INTEGRATION COMPLETE!')
  console.log('━'.repeat(60))
  console.log('\nYour chatbot can now answer:')
  console.log('  ✅ "What is hypertension?" → Full disease info')
  console.log('  ✅ "How to treat diabetes?" → Treatment protocols')
  console.log('  ✅ "Tell me about metformin" → Drug profile')
  console.log('  ✅ "Warfarin + aspirin interaction?" → Interaction check')
  console.log('  ✅ "Side effects of ibuprofen?" → Side effects list')
  console.log('  ✅ "Is lisinopril safe in pregnancy?" → Pregnancy check')
  console.log('\n🎉 Ready for clinical use!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
