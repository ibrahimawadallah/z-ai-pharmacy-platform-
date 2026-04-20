// Quick test of NLP features
import { classifyIntent, extractDrugEntities, validateClinicalQuery, getIntentDescription } from '../src/lib/nlp'

const testQueries = [
  "What are the interactions between warfarin and aspirin?",
  "Tell me about metformin side effects",
  "Is lisinopril safe in pregnancy?",
  "What dose of amoxicillin for pediatric patients?",
  "Alternative to ibuprofen for patient with kidney disease",
  "Check G6PD safety for nitrofurantoin",
  "Renal adjustment for gabapentin",
  "Contraindications of methotrexate"
]

console.log('🧪 NLP Feature Testing\n')
console.log('═'.repeat(80))

for (const query of testQueries) {
  console.log(`\nQuery: "${query}"`)
  console.log('─'.repeat(80))

  const intent = classifyIntent(query)
  const drugs = extractDrugEntities(query)
  const validation = validateClinicalQuery(query)

  console.log(`Intent: ${getIntentDescription(intent.intent)} (confidence: ${(intent.confidence * 100).toFixed(0)}%)`)
  console.log(`Drugs Detected: ${drugs.length > 0 ? drugs.map(d => d.name).join(', ') : 'None'}`)
  console.log(`Conditions: ${intent.conditions.length > 0 ? intent.conditions.join(', ') : 'None'}`)

  if (validation.warnings.length > 0) {
    console.log(`⚠️  Warnings:`)
    validation.warnings.forEach(w => console.log(`   - ${w}`))
  }

  console.log('')
}

console.log('\n═'.repeat(80))
console.log('✅ NLP Testing Complete!')
