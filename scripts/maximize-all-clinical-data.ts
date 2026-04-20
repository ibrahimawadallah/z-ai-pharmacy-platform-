import { execSync } from 'child_process'
import { db } from '../src/lib/db'

async function main() {
  console.log('🚀 STARTING MAXIMUM CLINICAL DATA POPULATION PIPELINE...\n')
  
  try {
    // Step 1: Maximize Clinical Warnings
    console.log('📋 Step 1: MAXIMIZING Clinical Warnings and MOA')
    execSync('bun scripts/maximize-clinical-warnings.ts', { stdio: 'inherit' })
    
    // Step 2: Maximize Side Effect Frequencies  
    console.log('\n📊 Step 2: MAXIMIZING Side Effect Frequencies')
    execSync('bun scripts/maximize-side-effect-frequencies.ts', { stdio: 'inherit' })
    
    // Step 3: Maximize Pregnancy Categories
    console.log('\n🤰 Step 3: MAXIMIZING Pregnancy Categories')
    execSync('bun scripts/maximize-pregnancy-categories.ts', { stdio: 'inherit' })
    
    // Step 4: Maximize Dosage Adjustments
    console.log('\n🫀 Step 4: MAXIMIZING Dosage Adjustment Guidelines')
    execSync('bun scripts/maximize-dosage-adjustments.ts', { stdio: 'inherit' })
    
    // Step 5: Maximize Drug Interactions
    console.log('\n🔄 Step 5: MAXIMIZING Drug Interaction Coverage')
    execSync('bun scripts/maximize-interactions.ts', { stdio: 'inherit' })
    
    // Final Analysis
    console.log('\n📈 RUNNING FINAL MAXIMIZATION ANALYSIS...')
    execSync('bun scripts/analyze-clinical-data.ts', { stdio: 'inherit' })
    
    console.log('\n🎉 MAXIMUM CLINICAL DATA POPULATION PIPELINE COMPLETE!')
    console.log('📊 Check analysis results above for MAXIMIZED statistics.')
    
  } catch (error) {
    console.error('❌ Pipeline failed:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

main()
