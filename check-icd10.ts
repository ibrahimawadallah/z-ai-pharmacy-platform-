import { db } from './src/lib/db'

async function checkICD10Mappings() {
  try {
    console.log('🔍 Checking ICD-10 Mappings...\n')

    // Check total ICD-10 mappings
    const totalMappings = await db.iCD10Mapping.count()
    console.log(`Total ICD-10 Mappings: ${totalMappings}`)

    // Check drugs with ICD-10 codes
    const drugsWithICD10 = await db.drug.count({
      where: { icd10Codes: { some: {} } }
    })
    console.log(`Drugs with ICD-10 Mappings: ${drugsWithICD10}`)

    // Sample drug with ICD-10 data
    const sampleDrug = await db.drug.findFirst({
      where: { icd10Codes: { some: {} } },
      select: {
        drugCode: true,
        packageName: true,
        genericName: true,
        icd10Codes: {
          take: 5,
          select: {
            icd10Code: true,
            description: true,
            category: true
          }
        }
      }
    })

    if (sampleDrug) {
      console.log('\n📋 Sample Drug with ICD-10 Data:')
      console.log(`Name: ${sampleDrug.packageName}`)
      console.log(`Generic: ${sampleDrug.genericName}`)
      console.log(`ICD-10 Codes: ${sampleDrug.icd10Codes.length}`)
      sampleDrug.icd10Codes.forEach((icd10, i) => {
        console.log(`  ${i + 1}. ${icd10.icd10Code} - ${icd10.description} (${icd10.category || 'No category'})`)
      })
    }

    // Check ICD-10 mapping structure
    console.log('\n🔎 ICD-10 Mapping Structure:')
    const sampleMapping = await db.iCD10Mapping.findFirst()
    if (sampleMapping) {
      console.log('Sample mapping fields:', Object.keys(sampleMapping))
    }

    // Check unique ICD-10 codes
    const uniqueCodes = await db.iCD10.groupBy({
      by: ['icd10Code'],
      _count: { _all: true }
    })
    console.log(`\n📊 Unique ICD-10 Codes: ${uniqueCodes.length}`)

  } catch (error) {
    console.error('Error checking ICD-10 mappings:', error)
  } finally {
    await db.$disconnect()
  }
}

checkICD10Mappings()
