/**
 * Import side effects from sider-side-effects.tsv into database
 * Run: npx ts-node scripts/import-side-effects.ts
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

const prisma = new PrismaClient()

// Map to track frequency of side effects per drug for categorization
function getFrequencyCategory(count: number, total: number): string {
  const percentage = (count / total) * 100
  if (percentage >= 10) return 'Very Common (>10%)'
  if (percentage >= 1) return 'Common (1-10%)'
  if (percentage >= 0.1) return 'Uncommon (0.1-1%)'
  if (percentage >= 0.01) return 'Rare (0.01-0.1%)'
  return 'Very Rare (<0.01%)'
}

async function importSideEffects() {
  console.log('Starting side effects import...')
  
  const sideEffectsPath = path.join(process.cwd(), 'upload', 'sider-side-effects.tsv')
  
  // Count total lines first
  console.log('Counting total entries...')
  const totalLines = parseInt(
    await new Promise((resolve) => {
      let count = 0
      const stream = fs.createReadStream(sideEffectsPath)
      stream.on('data', (chunk) => {
        count += chunk.toString().split('\n').length - 1
      })
      stream.on('end', () => resolve(count.toString()))
    })
  )
  
  console.log(`Total entries to process: ${totalLines}`)
  
  const fileStream = fs.createReadStream(sideEffectsPath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  
  let lineCount = 0
  let successCount = 0
  let errorCount = 0
  let skippedCount = 0
  
  // First pass: collect all side effects per drug
  const drugSideEffects: Map<string, Map<string, number>> = new Map()
  
  console.log('First pass: Collecting side effects...')
  
  for await (const line of rl) {
    lineCount++
    
    if (lineCount === 1) continue // Skip header
    
    const parts = line.split('\t')
    if (parts.length < 4) {
      skippedCount++
      continue
    }
    
    const [, drugName, , sideEffect] = parts
    
    if (!drugSideEffects.has(drugName)) {
      drugSideEffects.set(drugName, new Map())
    }
    
    const drugEffects = drugSideEffects.get(drugName)!
    drugEffects.set(sideEffect, (drugEffects.get(sideEffect) || 0) + 1)
    
    if (lineCount % 10000 === 0) {
      console.log(`Processed ${lineCount}/${totalLines} lines...`)
    }
  }
  
  console.log(`\nCollected side effects for ${drugSideEffects.size} unique drugs`)
  
  // Second pass: Import into database
  console.log('Second pass: Importing to database...')
  
  let processedDrugs = 0
  
  for (const [drugName, effects] of drugSideEffects) {
    try {
      // Find drug by name (using DrugBank name)
      const drug = await prisma.drug.findFirst({
        where: {
          OR: [
            { genericName: { contains: drugName, mode: 'insensitive' } },
            { packageName: { contains: drugName, mode: 'insensitive' } }
          ]
        }
      })
      
      if (!drug) {
        // Try to find by matching partial names
        const partialMatch = await prisma.drug.findFirst({
          where: {
            OR: [
              { genericName: { startsWith: drugName.split(' ')[0], mode: 'insensitive' } },
              { packageName: { startsWith: drugName.split(' ')[0], mode: 'insensitive' } }
            ]
          }
        })
        
        if (!partialMatch) {
          skippedCount++
          continue
        }
      }
      
      const targetDrug = drug!
      const totalEffects = effects.size
      
      // Delete existing side effects for this drug
      await prisma.drugSideEffect.deleteMany({
        where: { drugId: targetDrug.id }
      })
      
      // Create new side effects
      const sideEffectsData = Array.from(effects.entries()).map(([effect, count]) => ({
        drugId: targetDrug.id,
        sideEffect: effect,
        frequency: getFrequencyCategory(count, totalEffects),
        umlsCui: null // We could extract this from the TSV if needed
      }))
      
      await prisma.drugSideEffect.createMany({
        data: sideEffectsData,
        skipDuplicates: true
      })
      
      successCount++
      
      if (successCount % 100 === 0) {
        console.log(`Imported ${successCount} drugs...`)
      }
    } catch (error) {
      console.error(`Error importing ${drugName}:`, error)
      errorCount++
    }
    
    processedDrugs++
    if (processedDrugs % 100 === 0) {
      console.log(`Processed ${processedDrugs}/${drugSideEffects.size} unique drugs...`)
    }
  }
  
  console.log('\nImport Summary:')
  console.log(`- Total lines in file: ${lineCount}`)
  console.log(`- Unique drugs with side effects: ${drugSideEffects.size}`)
  console.log(`- Successfully imported: ${successCount}`)
  console.log(`- Skipped (not found): ${skippedCount}`)
  console.log(`- Errors: ${errorCount}`)
}

importSideEffects()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
