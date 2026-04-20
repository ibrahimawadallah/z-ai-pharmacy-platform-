import { db } from '../src/lib/db'

async function main() {
  console.log('🔧 Classifying Side Effect Frequencies...\n')

  // Common side effects with their typical frequencies
  const frequencyPatterns = {
    // Very Common (>10%)
    'Common': [
      'nausea', 'vomiting', 'headache', 'dizziness', 'fatigue', 'drowsiness',
      'diarrhea', 'constipation', 'stomach upset', 'rash', 'itching',
      'dry mouth', 'insomnia', 'drowsiness', 'loss of appetite', 'weight gain',
      'swelling', 'weakness', 'muscle pain', 'joint pain', 'back pain'
    ],
    
    // Uncommon (1-10%)
    'Uncommon': [
      'anxiety', 'nervousness', 'tremor', 'palpitations', 'chest pain',
      'shortness of breath', 'cough', 'sore throat', 'fever', 'chills',
      'blurred vision', 'ringing in ears', 'hair loss', 'skin discoloration',
      'mood changes', 'confusion', 'memory problems', 'difficulty concentrating',
      'urinary problems', 'sexual dysfunction', 'menstrual changes'
    ],
    
    // Rare (<1%)
    'Rare': [
      'anaphylaxis', 'severe allergic reaction', 'steven-johnson syndrome',
      'liver failure', 'kidney failure', 'blood disorders', 'severe skin reactions',
      'heart rhythm problems', 'severe bleeding', 'blood clots', 'stroke',
      'seizures', 'hallucinations', 'psychosis', 'severe depression',
      'suicidal thoughts', 'coma', 'paralysis', 'severe muscle weakness'
    ]
  }

  // Get all side effects with unknown frequency
  const sideEffects = await db.drugSideEffect.findMany({
    where: {
      frequency: null
    },
    select: {
      id: true,
      sideEffect: true
    },
    take: 10000 // Process in batches
  })

  console.log(`📋 Found ${sideEffects.length} side effects to classify`)

  let updatedCount = 0
  let commonCount = 0
  let uncommonCount = 0
  let rareCount = 0

  for (const sideEffect of sideEffects) {
    const effectLower = sideEffect.sideEffect.toLowerCase()
    let assignedFrequency = 'Unknown'
    
    // Check against frequency patterns
    for (const [frequency, effects] of Object.entries(frequencyPatterns)) {
      for (const pattern of effects) {
        if (effectLower.includes(pattern.toLowerCase())) {
          assignedFrequency = frequency
          break
        }
      }
      if (assignedFrequency !== 'Unknown') break
    }
    
    // Additional pattern matching for medical terms
    if (assignedFrequency === 'Unknown') {
      if (effectLower.includes('severe') || effectLower.includes('life-threatening') || 
          effectLower.includes('fatal') || effectLower.includes('syndrome')) {
        assignedFrequency = 'Rare'
      } else if (effectLower.includes('moderate') || effectLower.includes('mild')) {
        assignedFrequency = 'Uncommon'
      } else if (effectLower.includes('common') || effectLower.includes('frequent')) {
        assignedFrequency = 'Common'
      }
    }
    
    // Update the side effect frequency
    await db.drugSideEffect.update({
      where: { id: sideEffect.id },
      data: {
        frequency: assignedFrequency
      }
    })
    
    updatedCount++
    
    if (assignedFrequency === 'Common') commonCount++
    else if (assignedFrequency === 'Uncommon') uncommonCount++
    else if (assignedFrequency === 'Rare') rareCount++
    
    if (updatedCount % 500 === 0) {
      console.log(`✅ Classified ${updatedCount} side effects...`)
    }
  }

  console.log(`\n🎯 Side Effect Frequency Classification Complete!`)
  console.log(`✅ Total Updated: ${updatedCount} side effects`)
  console.log(`📊 Classification Results:`)
  console.log(`   Common: ${commonCount} (${((commonCount/updatedCount)*100).toFixed(1)}%)`)
  console.log(`   Uncommon: ${uncommonCount} (${((uncommonCount/updatedCount)*100).toFixed(1)}%)`)
  console.log(`   Rare: ${rareCount} (${((rareCount/updatedCount)*100).toFixed(1)}%)`)
  console.log(`   Unknown: ${updatedCount - commonCount - uncommonCount - rareCount} (${(((updatedCount - commonCount - uncommonCount - rareCount)/updatedCount)*100).toFixed(1)}%)`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
