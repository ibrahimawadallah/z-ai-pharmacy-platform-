/**
 * Scheduled Data Update Script
 * 
 * This script runs all data import jobs in sequence and is designed to be
 * scheduled via cron jobs or similar task schedulers for regular updates.
 * 
 * Recommended schedule: Quarterly (every 3 months)
 * 
 * Usage: npx tsx scripts/schedule-data-updates.ts
 */

import { db } from '@/lib/db'

async function runScheduledUpdates() {
  console.log('='.repeat(60))
  console.log('DrugEye ICD-10 Data Update Schedule')
  console.log('='.repeat(60))
  console.log(`Started at: ${new Date().toISOString()}\n`)

  const startTime = Date.now()
  const results = {
    whoATC: { success: false, count: 0, duration: 0 },
    fda: { success: false, count: 0, duration: 0 },
    rxnorm: { success: false, count: 0, duration: 0 },
    dailymed: { success: false, count: 0, duration: 0 }
  }

  try {
    // Step 1: WHO ATC Import (Fastest, highest success rate)
    console.log('Step 1: WHO ATC Import')
    console.log('-'.repeat(60))
    const whoStart = Date.now()
    
    try {
      const { importWHOATCData } = await import('./import-who-atc')
      await importWHOATCData()
      results.whoATC.success = true
      results.whoATC.duration = Date.now() - whoStart
      console.log('✓ WHO ATC import completed\n')
    } catch (error) {
      console.error('✗ WHO ATC import failed:', error)
      results.whoATC.duration = Date.now() - whoStart
    }

    // Step 2: FDA SPL Import (Medium speed, medium success rate)
    console.log('Step 2: FDA SPL Import')
    console.log('-'.repeat(60))
    const fdaStart = Date.now()
    
    try {
      const { importFDAICD10Data } = await import('./import-fda-icd10')
      await importFDAICD10Data()
      results.fda.success = true
      results.fda.duration = Date.now() - fdaStart
      console.log('✓ FDA SPL import completed\n')
    } catch (error) {
      console.error('✗ FDA SPL import failed:', error)
      results.fda.duration = Date.now() - fdaStart
    }

    // Step 3: DailyMed Import (TIER_1 source, high success rate)
    console.log('Step 3: DailyMed Import')
    console.log('-'.repeat(60))
    const dailymedStart = Date.now()
    
    try {
      const { importDailyMedICD10Data } = await import('./import-dailymed-icd10')
      await importDailyMedICD10Data()
      results.dailymed.success = true
      results.dailymed.duration = Date.now() - dailymedStart
      console.log('✓ DailyMed import completed\n')
    } catch (error) {
      console.error('✗ DailyMed import failed:', error)
      results.dailymed.duration = Date.now() - dailymedStart
    }

    // Step 4: RxNorm Import (Slowest, lowest success rate)
    console.log('Step 4: RxNorm Import')
    console.log('-'.repeat(60))
    const rxnormStart = Date.now()
    
    try {
      const { importRxNormData } = await import('./import-rxnorm')
      await importRxNormData()
      results.rxnorm.success = true
      results.rxnorm.duration = Date.now() - rxnormStart
      console.log('✓ RxNorm import completed\n')
    } catch (error) {
      console.error('✗ RxNorm import failed:', error)
      results.rxnorm.duration = Date.now() - rxnormStart
    }

    // Get final statistics
    console.log('Final Database Statistics')
    console.log('-'.repeat(60))
    
    const totalDrugs = await db.drug.count()
    const totalMappings = await db.iCD10Mapping.count()
    
    const sourceCounts = await db.iCD10Mapping.groupBy({
      by: ['source'],
      _count: {
        _all: true
      }
    })

    const validatedCount = await db.iCD10Mapping.count({
      where: { isValidated: true }
    })

    const pendingReview = await db.iCD10Mapping.count({
      where: { requiresReview: true }
    })

    console.log(`Total drugs: ${totalDrugs}`)
    console.log(`Total ICD-10 mappings: ${totalMappings}`)
    console.log(`Average mappings per drug: ${(totalMappings / totalDrugs).toFixed(2)}`)
    console.log('\nSource breakdown:')
    sourceCounts.forEach(source => {
      console.log(`  ${source.source}: ${source._count._all} mappings`)
    })
    console.log(`\nValidation status:`)
    console.log(`  Validated: ${validatedCount}`)
    console.log(`  Pending review: ${pendingReview}`)

  } catch (error) {
    console.error('Fatal error during scheduled updates:', error)
  } finally {
    const totalDuration = Date.now() - startTime
    
    console.log('\n' + '='.repeat(60))
    console.log('Update Summary')
    console.log('='.repeat(60))
    console.log(`WHO ATC: ${results.whoATC.success ? '✓' : '✗'} (${(results.whoATC.duration / 1000).toFixed(1)}s)`)
    console.log(`FDA SPL: ${results.fda.success ? '✓' : '✗'} (${(results.fda.duration / 1000).toFixed(1)}s)`)
    console.log(`DailyMed: ${results.dailymed.success ? '✓' : '✗'} (${(results.dailymed.duration / 1000).toFixed(1)}s)`)
    console.log(`RxNorm: ${results.rxnorm.success ? '✓' : '✗'} (${(results.rxnorm.duration / 1000).toFixed(1)}s)`)
    console.log(`Total duration: ${(totalDuration / 1000).toFixed(1)}s`)
    console.log(`Completed at: ${new Date().toISOString()}`)
    console.log('='.repeat(60))

    await db.$disconnect()
  }
}

// Run the scheduled updates
runScheduledUpdates()
