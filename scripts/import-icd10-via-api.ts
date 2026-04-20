/**
 * Import ICD-10 mappings via API (no direct DB connection needed)
 * Run: npx ts-node scripts/import-icd10-via-api.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const API_BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:5173'

interface ICD10Mapping {
  code: string
  description: string
  category?: string
}

interface DrugMapping {
  drugName: string
  drugCode?: string
  icd10Codes: ICD10Mapping[]
}

async function importViaAPI() {
  console.log('Starting ICD-10 mappings import via API...')
  
  // Read the mappings file
  const mappingsPath = path.join(process.cwd(), 'upload', 'uae-drugs-complete-icd10-mappings.json')
  const mappingsData: Record<string, ICD10Mapping[]> = JSON.parse(fs.readFileSync(mappingsPath, 'utf-8'))
  
  const drugNames = Object.keys(mappingsData)
  console.log(`Found ${drugNames.length} drugs with ICD-10 mappings`)
  
  let successCount = 0
  let errorCount = 0
  let skippedCount = 0
  
  // Process in batches to avoid overwhelming the API
  const batchSize = 50
  
  for (let i = 0; i < drugNames.length; i += batchSize) {
    const batch = drugNames.slice(i, i + batchSize)
    console.log(`\nProcessing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(drugNames.length/batchSize)} (${i}-${i+batch.length})...`)
    
    for (const drugName of batch) {
      const icd10Codes = mappingsData[drugName]
      
      try {
        // First, search for the drug to get its ID
        const searchResponse = await fetch(`${API_BASE_URL}/api/drugs/search?q=${encodeURIComponent(drugName)}&limit=1`)
        
        if (!searchResponse.ok) {
          console.log(`  Search failed for: ${drugName}`)
          errorCount++
          continue
        }
        
        const searchData = await searchResponse.json()
        
        if (!searchData.data || searchData.data.length === 0) {
          console.log(`  Drug not found: ${drugName}`)
          skippedCount++
          continue
        }
        
        const drugId = searchData.data[0].id
        
        // Import ICD-10 mappings via the admin API endpoint
        const importResponse = await fetch(`${API_BASE_URL}/api/admin/drugs/${drugId}/icd10`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ icd10Codes })
        })
        
        if (importResponse.ok) {
          successCount++
          if (successCount % 100 === 0) {
            console.log(`  Progress: ${successCount} drugs imported`)
          }
        } else {
          console.log(`  Import failed for ${drugName}: ${importResponse.status}`)
          errorCount++
        }
      } catch (error) {
        console.error(`  Error processing ${drugName}:`, error)
        errorCount++
      }
    }
    
    // Small delay between batches to be nice to the API
    if (i + batchSize < drugNames.length) {
      console.log('  Waiting 2 seconds before next batch...')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('IMPORT SUMMARY')
  console.log('='.repeat(50))
  console.log(`Total drugs in file: ${drugNames.length}`)
  console.log(`Successfully imported: ${successCount}`)
  console.log(`Skipped (not found): ${skippedCount}`)
  console.log(`Errors: ${errorCount}`)
  console.log('='.repeat(50))
}

// Check if server is running
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

// Main
async function main() {
  const isServerRunning = await checkServer()
  
  if (!isServerRunning) {
    console.error('ERROR: Next.js server is not running!')
    console.error('Please start the server first with: npm run dev')
    console.error('Then run this script in another terminal.')
    process.exit(1)
  }
  
  console.log('Server is running. Starting import...')
  await importViaAPI()
}

main().catch(console.error)
