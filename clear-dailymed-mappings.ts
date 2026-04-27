/**
 * Clear DailyMed Mappings
 * 
 * Removes all existing DailyMed SPL mappings to prepare for fresh import
 * with enhanced algorithm and fixed generic names.
 */

import { db } from '@/lib/db'

async function clearDailyMedMappings() {
  console.log('Clearing DailyMed Mappings...\n')
  
  // Count existing DailyMed mappings
  const existingMappings = await db.iCD10Mapping.count({
    where: {
      source: 'DAILYMED_SPL'
    }
  })
  
  console.log(`Existing DailyMed mappings: ${existingMappings}`)
  
  if (existingMappings === 0) {
    console.log('No DailyMed mappings to clear')
    return
  }
  
  // Delete all DailyMed mappings
  const result = await db.iCD10Mapping.deleteMany({
    where: {
      source: 'DAILYMED_SPL'
    }
  })
  
  console.log(`Deleted ${result.count} DailyMed mappings`)
  
  await db.$disconnect()
}

clearDailyMedMappings()
  .then(() => {
    console.log('\n✓ DailyMed mappings cleared successfully')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n✗ Error clearing DailyMed mappings:', error)
    process.exit(1)
  })