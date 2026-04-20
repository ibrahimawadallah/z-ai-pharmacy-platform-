import { execSync } from 'child_process'
import { db } from '../src/lib/db'

async function main() {
  console.log('🚀 Starting Clinical Data Population Pipeline...\n')
  
  try {
    // Step 1: Populate Clinical Warnings
    console.log('📋 Step 1: Adding Clinical Warnings and MOA')
    execSync('bun scripts/populate-clinical-warnings.ts', { stdio: 'inherit' })
    
    // Step 2: Classify Side Effect Frequencies  
    console.log('\n📊 Step 2: Classifying Side Effect Frequencies')
    execSync('bun scripts/classify-side-effect-frequencies.ts', { stdio: 'inherit' })
    
    // Step 3: Add Pregnancy Categories
    console.log('\n🤰 Step 3: Adding Pregnancy Categories')
    execSync('bun scripts/add-pregnancy-categories.ts', { stdio: 'inherit' })
    
    // Step 4: Add Dosage Adjustments
    console.log('\n🫀 Step 4: Adding Dosage Adjustment Guidelines')
    execSync('bun scripts/add-dosage-adjustments.ts', { stdio: 'inherit' })
    
    // Step 5: Expand Drug Interactions
    console.log('\n🔄 Step 5: Expanding Drug Interaction Coverage')
    execSync('bun scripts/expand-interactions.ts', { stdio: 'inherit' })
    
    // Final Analysis
    console.log('\n📈 Running Final Analysis...')
    execSync('bun scripts/analyze-clinical-data.ts', { stdio: 'inherit' })
    
    console.log('\n🎉 Clinical Data Population Pipeline Complete!')
    console.log('📊 Check the analysis results above for updated statistics.')
    
  } catch (error) {
    console.error('❌ Pipeline failed:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

main()
