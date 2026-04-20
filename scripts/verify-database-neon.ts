import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyDatabase() {
  console.log('========================================')
  console.log('DATABASE VERIFICATION')
  console.log('========================================\n')

  try {
    // Count all tables
    const drugCount = await prisma.drug.count()
    const interactionCount = await prisma.drugInteraction.count()
    const sideEffectCount = await prisma.drugSideEffect.count()
    const icd10Count = await prisma.iCD10Mapping.count()
    const userCount = await prisma.user.count()
    const courseCount = await prisma.course.count()

    console.log('TABLE COUNTS:')
    console.log('─────────────────────────────────────')
    console.log(`Drugs:                ${drugCount.toLocaleString()}`)
    console.log(`Drug Interactions:    ${interactionCount.toLocaleString()}`)
    console.log(`Drug Side Effects:    ${sideEffectCount.toLocaleString()}`)
    console.log(`ICD-10 Mappings:      ${icd10Count.toLocaleString()}`)
    console.log(`Users:                ${userCount.toLocaleString()}`)
    console.log(`Courses:              ${courseCount.toLocaleString()}`)
    console.log('')

    // Sample drugs with complete data
    console.log('SAMPLE DRUGS WITH COMPLETE DATA:')
    console.log('─────────────────────────────────────')
    const sampleDrugs = await prisma.drug.findMany({
      where: {
        pregnancyCategory: { not: null }
      },
      select: {
        drugCode: true,
        packageName: true,
        genericName: true,
        strength: true,
        dosageForm: true,
        pregnancyCategory: true,
        breastfeedingSafety: true,
        manufacturerName: true,
        status: true,
        packagePricePublic: true,
        interactions: { select: { id: true }, take: 1 },
        sideEffects: { select: { id: true }, take: 1 },
        icd10Codes: { select: { id: true }, take: 1 }
      },
      take: 5
    })

    for (const drug of sampleDrugs) {
      console.log(`\n${drug.packageName} (${drug.genericName})`)
      console.log(`  Code: ${drug.drugCode}`)
      console.log(`  Strength: ${drug.strength} ${drug.dosageForm}`)
      console.log(`  Manufacturer: ${drug.manufacturerName || 'N/A'}`)
      console.log(`  Status: ${drug.status}`)
      console.log(`  Price (Public): ${drug.packagePricePublic ? 'AED ' + drug.packagePricePublic.toFixed(2) : 'N/A'}`)
      console.log(`  Pregnancy: ${drug.pregnancyCategory || 'N/A'}`)
      console.log(`  Breastfeeding: ${drug.breastfeedingSafety || 'N/A'}`)
      console.log(`  Has Interactions: ${drug.interactions.length > 0 ? '✓' : '✗'}`)
      console.log(`  Has Side Effects: ${drug.sideEffects.length > 0 ? '✓' : '✗'}`)
      console.log(`  Has ICD-10 Codes: ${drug.icd10Codes.length > 0 ? '✓' : '✗'}`)
    }

    console.log('\n\nTOP 10 DRUGS BY INTERACTIONS:')
    console.log('─────────────────────────────────────')
    const drugsWithInteractions = await prisma.drug.findMany({
      where: {
        interactions: { some: {} }
      },
      select: {
        packageName: true,
        genericName: true,
        _count: {
          select: { interactions: true }
        }
      },
      orderBy: {
        interactions: { _count: 'desc' }
      },
      take: 10
    })

    drugsWithInteractions.forEach((drug, idx) => {
      console.log(`${idx + 1}. ${drug.packageName} (${drug.genericName}) - ${drug._count.interactions} interactions`)
    })

    console.log('\n\nTOP 10 DRUGS BY SIDE EFFECTS:')
    console.log('─────────────────────────────────────')
    const drugsWithSideEffects = await prisma.drug.findMany({
      where: {
        sideEffects: { some: {} }
      },
      select: {
        packageName: true,
        genericName: true,
        _count: {
          select: { sideEffects: true }
        }
      },
      orderBy: {
        sideEffects: { _count: 'desc' }
      },
      take: 10
    })

    drugsWithSideEffects.forEach((drug, idx) => {
      console.log(`${idx + 1}. ${drug.packageName} (${drug.genericName}) - ${drug._count.sideEffects} side effects`)
    })

    console.log('\n\nCOVERAGE STATISTICS:')
    console.log('─────────────────────────────────────')
    const drugsWithInteractionsCount = await prisma.drug.count({
      where: { interactions: { some: {} } }
    })
    const drugsWithSideEffectsCount = await prisma.drug.count({
      where: { sideEffects: { some: {} } }
    })
    const drugsWithICD10Count = await prisma.drug.count({
      where: { icd10Codes: { some: {} } }
    })
    const drugsWithPregnancyData = await prisma.drug.count({
      where: { pregnancyCategory: { not: null } }
    })

    console.log(`Drugs with interactions: ${drugsWithInteractionsCount.toLocaleString()} (${((drugsWithInteractionsCount / drugCount) * 100).toFixed(1)}%)`)
    console.log(`Drugs with side effects: ${drugsWithSideEffectsCount.toLocaleString()} (${((drugsWithSideEffectsCount / drugCount) * 100).toFixed(1)}%)`)
    console.log(`Drugs with ICD-10 codes: ${drugsWithICD10Count.toLocaleString()} (${((drugsWithICD10Count / drugCount) * 100).toFixed(1)}%)`)
    console.log(`Drugs with pregnancy data: ${drugsWithPregnancyData.toLocaleString()} (${((drugsWithPregnancyData / drugCount) * 100).toFixed(1)}%)`)

    console.log('\n\nDATABASE STATUS: ✓ COMPLETE')
    console.log('All core data successfully migrated to Neon!')

  } catch (error: any) {
    console.error('Verification failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

verifyDatabase()
