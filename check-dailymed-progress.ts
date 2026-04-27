/**
 * Check DailyMed Import Progress
 * 
 * Monitors the current DailyMed import progress by checking
 * how many drugs have DailyMed SPL mappings.
 */

import { db } from '@/lib/db'

async function checkDailyMedProgress() {
  console.log('Checking DailyMed Import Progress...\n')
  
  // Get total drugs
  const totalDrugs = await db.drug.count()
  console.log(`Total drugs in database: ${totalDrugs}`)
  
  // Get drugs with DailyMed mappings
  const drugsWithDailyMed = await db.drug.count({
    where: {
      icd10Codes: {
        some: {
          source: 'DAILYMED_SPL'
        }
      }
    }
  })
  console.log(`Drugs with DailyMed mappings: ${drugsWithDailyMed}`)
  
  // Get drugs without DailyMed mappings
  const drugsWithoutDailyMed = await db.drug.count({
    where: {
      icd10Codes: {
        none: {
          source: 'DAILYMED_SPL'
        }
      }
    }
  })
  console.log(`Drugs without DailyMed mappings: ${drugsWithoutDailyMed}`)
  
  // Calculate progress percentage
  const progress = ((drugsWithDailyMed / totalDrugs) * 100).toFixed(1)
  console.log(`\nImport Progress: ${progress}%`)
  
  // Get recent DailyMed mappings
  const recentMappings = await db.iCD10Mapping.findMany({
    where: {
      source: 'DAILYMED_SPL'
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5,
    select: {
      id: true,
      drugId: true,
      icd10Code: true,
      createdAt: true,
      drug: {
        select: {
          packageName: true,
          genericName: true
        }
      }
    }
  })
  
  console.log(`\nRecent DailyMed Mappings:`)
  recentMappings.forEach(mapping => {
    console.log(`  ${mapping.drug.packageName}`)
    console.log(`    ICD-10: ${mapping.icd10Code}`)
    console.log(`    Created: ${mapping.createdAt.toISOString()}`)
  })
  
  await db.$disconnect()
}

checkDailyMedProgress()
  .then(() => {
    console.log('\n=== Progress Check Complete ===')
    process.exit(0)
  })
  .catch(error => {
    console.error('Error during progress check:', error)
    process.exit(1)
  })