/**
 * Monitor DailyMed Import Progress
 * 
 * Comprehensive monitoring script to track DailyMed import progress,
 * success rates, and identify potential issues.
 */

import { db } from '@/lib/db'

async function monitorDailyMedImport() {
  console.log('=== DailyMed Import Monitor ===\n')
  
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
  const progress = ((drugsWithDailyMed / totalDrugs) * 100).toFixed(2)
  console.log(`\nImport Progress: ${progress}%`)
  
  // Get total DailyMed mappings (not just unique drugs)
  const totalMappings = await db.iCD10Mapping.count({
    where: {
      source: 'DAILYMED_SPL'
    }
  })
  console.log(`Total DailyMed ICD-10 mappings: ${totalMappings}`)
  
  // Calculate average mappings per drug
  const avgMappings = drugsWithDailyMed > 0 ? (totalMappings / drugsWithDailyMed).toFixed(2) : '0'
  console.log(`Average mappings per drug: ${avgMappings}`)
  
  // Get recent DailyMed mappings
  const recentMappings = await db.iCD10Mapping.findMany({
    where: {
      source: 'DAILYMED_SPL'
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10,
    select: {
      id: true,
      drugId: true,
      icd10Code: true,
      createdAt: true,
      confidence: true,
      drug: {
        select: {
          packageName: true,
          genericName: true
        }
      }
    }
  })
  
  console.log(`\n=== Recent DailyMed Mappings ===`)
  recentMappings.forEach((mapping, index) => {
    console.log(`${index + 1}. ${mapping.drug.packageName}`)
    console.log(`   Generic: ${mapping.drug.genericName.substring(0, 50)}...`)
    console.log(`   ICD-10: ${mapping.icd10Code} (Confidence: ${mapping.confidence})`)
    console.log(`   Created: ${mapping.createdAt.toISOString()}`)
  })
  
  // Analyze ICD-10 code distribution
  const icd10Distribution = await db.iCD10Mapping.groupBy({
    by: ['icd10Code'],
    where: {
      source: 'DAILYMED_SPL'
    },
    _count: {
      icd10Code: true
    },
    orderBy: {
      _count: {
        icd10Code: 'desc'
      }
    },
    take: 10
  })
  
  console.log(`\n=== Top ICD-10 Codes ===`)
  icd10Distribution.forEach((item, index) => {
    console.log(`${index + 1}. ${item.icd10Code}: ${item._count.icd10Code} mappings`)
  })
  
  // Check for any errors or issues
  const lowConfidenceMappings = await db.iCD10Mapping.count({
    where: {
      source: 'DAILYMED_SPL',
      confidence: 'LOW'
    }
  })
  
  const pendingReviewMappings = await db.iCD10Mapping.count({
    where: {
      source: 'DAILYMED_SPL',
      requiresReview: true
    }
  })
  
  console.log(`\n=== Quality Metrics ===`)
  console.log(`Low confidence mappings: ${lowConfidenceMappings}`)
  console.log(`Pending review mappings: ${pendingReviewMappings}`)
  
  // Estimate completion time
  if (drugsWithDailyMed > 0) {
    const timeElapsed = Date.now() - recentMappings[recentMappings.length - 1].createdAt.getTime()
    const drugsPerMinute = (drugsWithDailyMed / (timeElapsed / 60000)).toFixed(2)
    const remainingDrugs = drugsWithoutDailyMed
    const estimatedMinutes = (remainingDrugs / parseFloat(drugsPerMinute)).toFixed(0)
    const estimatedHours = (parseFloat(estimatedMinutes) / 60).toFixed(1)
    
    console.log(`\n=== Estimated Completion ===`)
    console.log(`Current rate: ${drugsPerMinute} drugs/minute`)
    console.log(`Remaining drugs: ${remainingDrugs}`)
    console.log(`Estimated time: ${estimatedMinutes} minutes (${estimatedHours} hours)`)
  }
  
  await db.$disconnect()
}

monitorDailyMedImport()
  .then(() => {
    console.log('\n=== Monitor Complete ===')
    process.exit(0)
  })
  .catch(error => {
    console.error('Error during monitoring:', error)
    process.exit(1)
  })