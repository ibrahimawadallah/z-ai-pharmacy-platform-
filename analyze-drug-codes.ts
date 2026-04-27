/**
 * Drug Code Pattern Analysis
 * 
 * Analyzes UAE drug codes from the JSON file to identify patterns
 * and potential correlations with DailyMed data.
 */

import { readFileSync } from 'fs'
import { join } from 'path'

interface DrugRecord {
  "Drug Code": string
  "Package Name": string
  "Generic Name": string
  "Manufacturer Name": string
}

function analyzeDrugCodes() {
  console.log('Analyzing UAE Drug Code Patterns...\n')
  
  // Read the JSON file
  const jsonPath = join('G:\\drug-intel-migration\\data\\json', 'uae_drug_snomed_icd10.json')
  const jsonData = JSON.parse(readFileSync(jsonPath, 'utf-8')) as DrugRecord[]
  
  console.log(`Total records: ${jsonData.length}`)
  
  // Extract all drug codes
  const drugCodes = jsonData.map(record => record["Drug Code"])
  
  // Analyze patterns
  const patterns = {
    prefixes: new Map<string, number>(),
    lengths: new Map<number, number>(),
    formats: new Map<string, number>(),
    manufacturers: new Map<string, number>()
  }
  
  for (const code of drugCodes) {
    // Extract prefix (first 3 characters)
    const prefix = code.substring(0, 3)
    patterns.prefixes.set(prefix, (patterns.prefixes.get(prefix) || 0) + 1)
    
    // Length analysis
    const length = code.length
    patterns.lengths.set(length, (patterns.lengths.get(length) || 0) + 1)
    
    // Format analysis (hyphen positions)
    const format = code.split('-').map((part, i) => `${i}:${part.length}`).join('-')
    patterns.formats.set(format, (patterns.formats.get(format) || 0) + 1)
  }
  
  // Manufacturer analysis
  for (const record of jsonData) {
    const manufacturer = record["Manufacturer Name"]
    if (manufacturer) {
      patterns.manufacturers.set(manufacturer, (patterns.manufacturers.get(manufacturer) || 0) + 1)
    }
  }
  
  console.log('\n=== Drug Code Prefixes ===')
  const sortedPrefixes = [...patterns.prefixes.entries()].sort((a, b) => b[1] - a[1])
  sortedPrefixes.slice(0, 20).forEach(([prefix, count]) => {
    console.log(`${prefix}: ${count} (${((count / drugCodes.length) * 100).toFixed(1)}%)`)
  })
  
  console.log('\n=== Drug Code Lengths ===')
  const sortedLengths = [...patterns.lengths.entries()].sort((a, b) => a[0] - b[0])
  sortedLengths.forEach(([length, count]) => {
    console.log(`${length} characters: ${count} (${((count / drugCodes.length) * 100).toFixed(1)}%)`)
  })
  
  console.log('\n=== Drug Code Formats ===')
  const sortedFormats = [...patterns.formats.entries()].sort((a, b) => b[1] - a[1])
  sortedFormats.slice(0, 10).forEach(([format, count]) => {
    console.log(`${format}: ${count} (${((count / drugCodes.length) * 100).toFixed(1)}%)`)
  })
  
  console.log('\n=== Top Manufacturers ===')
  const sortedManufacturers = [...patterns.manufacturers.entries()].sort((a, b) => b[1] - a[1])
  sortedManufacturers.slice(0, 10).forEach(([manufacturer, count]) => {
    console.log(`${manufacturer}: ${count} drugs`)
  })
  
  // Sample drug codes by prefix
  console.log('\n=== Sample Drug Codes by Prefix ===')
  const prefixGroups = new Map<string, string[]>()
  for (const code of drugCodes) {
    const prefix = code.substring(0, 3)
    if (!prefixGroups.has(prefix)) {
      prefixGroups.set(prefix, [])
    }
    prefixGroups.get(prefix)!.push(code)
  }
  
  sortedPrefixes.slice(0, 5).forEach(([prefix]) => {
    const codes = prefixGroups.get(prefix)!.slice(0, 5)
    console.log(`\n${prefix}:`)
    codes.forEach(code => console.log(`  ${code}`))
  })
  
  // Check for potential NDC-like patterns
  console.log('\n=== Potential NDC-like Patterns ===')
  const ndcLikeCodes = drugCodes.filter(code => {
    // Look for codes that might contain NDC-like segments
    const parts = code.split('-')
    return parts.some(part => part.match(/^\d{5,11}$/))
  })
  
  console.log(`Codes with NDC-like segments: ${ndcLikeCodes.length} (${((ndcLikeCodes.length / drugCodes.length) * 100).toFixed(1)}%)`)
  
  if (ndcLikeCodes.length > 0) {
    console.log('Sample NDC-like codes:')
    ndcLikeCodes.slice(0, 10).forEach(code => console.log(`  ${code}`))
  }
  
  return {
    totalRecords: jsonData.length,
    uniquePrefixes: patterns.prefixes.size,
    commonFormats: sortedFormats.slice(0, 5),
    ndcLikeCount: ndcLikeCodes.length
  }
}

// Run the analysis
try {
  const results = analyzeDrugCodes()
  console.log('\n=== Analysis Complete ===')
  console.log(`Total records analyzed: ${results.totalRecords}`)
  console.log(`Unique prefixes found: ${results.uniquePrefixes}`)
  console.log(`NDC-like patterns: ${results.ndcLikeCount}`)
} catch (error) {
  console.error('Error during analysis:', error)
  process.exit(1)
}