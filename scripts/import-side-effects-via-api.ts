/**
 * Import side effects via API (no direct DB connection needed)
 * Run: npx ts-node scripts/import-side-effects-via-api.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

const API_BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:5173'

// Map to track frequency of side effects per drug
function getFrequencyCategory(count: number, total: number): string {
  const percentage = (count / total) * 100
  if (percentage >= 10) return 'Very Common (>10%)'
  if (percentage >= 1) return 'Common (1-10%)'
  if (percentage >= 0.1) return 'Uncommon (0.1-1%)'
  if (percentage >= 0.01) return 'Rare (0.01-0.1%)'
  return 'Very Rare (<0.01%)'
}

async function importViaAPI() {
  console.log('Starting side effects import via API...')
  
  const sideEffectsPath = path.join(process.cwd(), 'upload', 'sider-side-effects.tsv')
  
  console.log('Reading side effects file...')
  const fileStream = fs.createReadStream(sideEffectsPath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  
  let lineCount = 0
  const drugSideEffects: Map<string, Map<string, number>> = new Map()
  
  // First pass: collect all side effects per drug
  console.log('Collecting side effects data...')
  for await (const line of rl) {
    lineCount++
    if (lineCount === 1) continue // Skip header
    
    const parts = line.split('\t')
    if (parts.length < 4) continue
    
    const [, drugName, , sideEffect] = parts
    
    if (!drugSideEffects.has(drugName)) {
      drugSideEffects.set(drugName, new Map())
    }
    
    const drugEffects = drugSideEffects.get(drugName)!
    drugEffects.set(sideEffect, (drugEffects.get(sideEffect) || 0) + 1)
    
    if (lineCount % 50000 === 0) {
      console.log(`  Read ${lineCount} lines...`)
    }
  }
  
  console.log(`\nCollected data for ${drugSideEffects.size} unique drugs`)
  
  // Second pass: Import via API
  let successCount = 0
  let errorCount = 0
  let skippedCount = 0
  let totalSideEffects = 0
  let processedDrugs = 0
  
  console.log('\nStarting API import...')
  
  for (const [drugName, effects] of drugSideEffects) {
    try {
      // Search for the drug
      const searchResponse = await fetch(`${API_BASE_URL}/api/drugs/search?q=${encodeURIComponent(drugName)}&limit=1`)
      
      if (!searchResponse.ok) {
        skippedCount++
        continue
      }
      
      const searchData = await searchResponse.json()
      
      if (!searchData.data || searchData.data.length === 0) {
        skippedCount++
        continue
      }
      
      const drugId = searchData.data[0].id
      const totalEffects = effects.size
      
      // Prepare side effects with frequency categories
      const sideEffectsData = Array.from(effects.entries()).map(([effect, count]) => ({
        sideEffect: effect,
        frequency: getFrequencyCategory(count, totalEffects),
        severity: 'Unknown' // SIDER doesn't provide severity
      }))
      
      // Import in batches of 50 to avoid payload size issues
      const batchSize = 50
      for (let i = 0; i < sideEffectsData.length; i += batchSize) {
        const batch = sideEffectsData.slice(i, i + batchSize)
        
        const importResponse = await fetch(`${API_BASE_URL}/api/admin/drugs/${drugId}/side-effects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sideEffects: batch })
        })
        
        if (importResponse.ok) {
          totalSideEffects += batch.length
        } else {
          console.log(`  Failed to import batch for ${drugName}`)
        }
      }
      
      successCount++
      
      if (successCount % 100 === 0) {
        console.log(`Progress: ${successCount} drugs, ${totalSideEffects} side effects...`)
      }
    } catch (error) {
      console.error(`Error importing ${drugName}:`, error)
      errorCount++
    }
    
    processedDrugs++
    if (processedDrugs % 100 === 0) {
      console.log(`  Processed ${processedDrugs}/${drugSideEffects.size} drugs...`)
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('IMPORT SUMMARY')
  console.log('='.repeat(50))
  console.log(`Total drugs imported: ${successCount}`)
  console.log(`Total side effects imported: ${totalSideEffects}`)
  console.log(`Skipped (not found): ${skippedCount}`)
  console.log(`Errors: ${errorCount}`)
  console.log('='.repeat(50))
}

async function checkServer() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/drugs/stats`, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    })
    return response.ok
  } catch {
    return false
  }
}

async function main() {
  const isServerRunning = await checkServer()
  
  if (!isServerRunning) {
    console.error('ERROR: Next.js server is not running!')
    console.error('Please start the server first with: npm run dev')
    process.exit(1)
  }
  
  console.log('Server is running. Starting import...')
  await importViaAPI()
}

main().catch(console.error)
