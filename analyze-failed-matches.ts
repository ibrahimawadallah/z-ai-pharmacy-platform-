/**
 * Analyze Failed DailyMed Matches
 * 
 * Analyzes drugs that failed to match with DailyMed to identify patterns
 * and opportunities for algorithm improvement.
 */

import { db } from '@/lib/db'
import { readFileSync } from 'fs'
import { join } from 'path'

interface DrugRecord {
  "Drug Code": string
  "Package Name": string
  "Generic Name": string
}

async function analyzeFailedMatches() {
  console.log('=== Failed Match Analysis ===\n')
  
  // Get drugs without DailyMed mappings
  const drugsWithoutDailyMed = await db.drug.findMany({
    where: {
      icd10Codes: {
        none: {
          source: 'DAILYMED_SPL'
        }
      }
    },
    select: {
      id: true,
      drugCode: true,
      genericName: true,
      packageName: true
    }
  })
  
  console.log(`Drugs without DailyMed mappings: ${drugsWithoutDailyMed.length}`)
  
  // Get drugs with DailyMed mappings for comparison
  const drugsWithDailyMed = await db.drug.findMany({
    where: {
      icd10Codes: {
        some: {
          source: 'DAILYMED_SPL'
        }
      }
    },
    select: {
      id: true,
      drugCode: true,
      genericName: true,
      packageName: true
    }
  })
  
  console.log(`Drugs with DailyMed mappings: ${drugsWithDailyMed.length}`)
  
  // Analyze generic name characteristics
  console.log(`\n=== Generic Name Analysis ===`)
  
  // Check for salt forms in failed matches
  const failedWithSalts = drugsWithoutDailyMed.filter(d => 
    d.genericName.match(/hydrochloride|hcl|sulfate|maleate|tartrate|besylate|mesylate/i)
  ).length
  
  const successWithSalts = drugsWithDailyMed.filter(d => 
    d.genericName.match(/hydrochloride|hcl|sulfate|maleate|tartrate|besylate|mesylate/i)
  ).length
  
  console.log(`Failed drugs with salt forms: ${failedWithSalts} (${((failedWithSalts/drugsWithoutDailyMed.length)*100).toFixed(1)}%)`)
  console.log(`Successful drugs with salt forms: ${successWithSalts} (${((successWithSalts/drugsWithDailyMed.length)*100).toFixed(1)}%)`)
  
  // Check for combination drugs
  const failedCombo = drugsWithoutDailyMed.filter(d => 
    d.genericName.includes(',') || d.genericName.includes('+')
  ).length
  
  const successCombo = drugsWithDailyMed.filter(d => 
    d.genericName.includes(',') || d.genericName.includes('+')
  ).length
  
  console.log(`Failed combination drugs: ${failedCombo} (${((failedCombo/drugsWithoutDailyMed.length)*100).toFixed(1)}%)`)
  console.log(`Successful combination drugs: ${successCombo} (${((successCombo/drugsWithDailyMed.length)*100).toFixed(1)}%)`)
  
  // Check for Arabic/brand-specific names
  const failedBrandSpecific = drugsWithoutDailyMed.filter(d => 
    d.packageName.match(/[A-Z]{3,}/) && d.genericName.length < 20
  ).length
  
  const successBrandSpecific = drugsWithDailyMed.filter(d => 
    d.packageName.match(/[A-Z]{3,}/) && d.genericName.length < 20
  ).length
  
  console.log(`Failed brand-specific drugs: ${failedBrandSpecific} (${((failedBrandSpecific/drugsWithoutDailyMed.length)*100).toFixed(1)}%)`)
  console.log(`Successful brand-specific drugs: ${successBrandSpecific} (${((successBrandSpecific/drugsWithDailyMed.length)*100).toFixed(1)}%)`)
  
  // Analyze generic name length
  const failedAvgLength = drugsWithoutDailyMed.reduce((sum, d) => sum + d.genericName.length, 0) / drugsWithoutDailyMed.length
  const successAvgLength = drugsWithDailyMed.reduce((sum, d) => sum + d.genericName.length, 0) / drugsWithDailyMed.length
  
  console.log(`Failed avg generic name length: ${failedAvgLength.toFixed(1)} characters`)
  console.log(`Successful avg generic name length: ${successAvgLength.toFixed(1)} characters`)
  
  // Sample failed drugs
  console.log(`\n=== Sample Failed Drugs ===`)
  drugsWithoutDailyMed.slice(0, 20).forEach(drug => {
    console.log(`\n${drug.packageName}`)
    console.log(`  Generic: ${drug.genericName.substring(0, 80)}...`)
    console.log(`  Code: ${drug.drugCode}`)
  })
  
  // Analyze by drug code prefix
  console.log(`\n=== Drug Code Prefix Analysis (Failed) ===`)
  const prefixCounts = new Map<string, number>()
  
  drugsWithoutDailyMed.forEach(drug => {
    const prefix = drug.drugCode.split('-')[0]
    prefixCounts.set(prefix, (prefixCounts.get(prefix) || 0) + 1)
  })
  
  const sortedPrefixes = Array.from(prefixCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
  
  sortedPrefixes.forEach(([prefix, count]) => {
    console.log(`${prefix}: ${count} drugs (${((count/drugsWithoutDailyMed.length)*100).toFixed(1)}%)`)
  })
  
  // Check for herbal/natural products
  const failedHerbal = drugsWithoutDailyMed.filter(d => 
    d.genericName.match(/oil|extract|herbal|natural|plant|root|leaf/i)
  ).length
  
  const successHerbal = drugsWithDailyMed.filter(d => 
    d.genericName.match(/oil|extract|herbal|natural|plant|root|leaf/i)
  ).length
  
  console.log(`\nFailed herbal/natural products: ${failedHerbal} (${((failedHerbal/drugsWithoutDailyMed.length)*100).toFixed(1)}%)`)
  console.log(`Successful herbal/natural products: ${successHerbal} (${((successHerbal/drugsWithDailyMed.length)*100).toFixed(1)}%)`)
  
  // Check for medical devices/supplements
  const failedDevices = drugsWithoutDailyMed.filter(d => 
    d.genericName.match(/device|supplement|vitamin|mineral|solution|injection/i)
  ).length
  
  const successDevices = drugsWithDailyMed.filter(d => 
    d.genericName.match(/device|supplement|vitamin|mineral|solution|injection/i)
  ).length
  
  console.log(`Failed devices/supplements: ${failedDevices} (${((failedDevices/drugsWithoutDailyMed.length)*100).toFixed(1)}%)`)
  console.log(`Successful devices/supplements: ${successDevices} (${((successDevices/drugsWithDailyMed.length)*100).toFixed(1)}%)`)
  
  await db.$disconnect()
  
  return {
    failedCount: drugsWithoutDailyMed.length,
    successCount: drugsWithDailyMed.length,
    failedWithSalts,
    successWithSalts,
    failedCombo,
    successCombo,
    failedAvgLength,
    successAvgLength
  }
}

analyzeFailedMatches()
  .then(results => {
    console.log('\n=== Analysis Complete ===')
    console.log(`Failed: ${results.failedCount}, Success: ${results.successCount}`)
    console.log(`Success rate: ${((results.successCount/(results.failedCount+results.successCount))*100).toFixed(1)}%`)
    process.exit(0)
  })
  .catch(error => {
    console.error('Error during analysis:', error)
    process.exit(1)
  })