import { db } from '@/lib/db'

function extractSideEffects(text: string): string[] {
  if (!text || text.length < 10) return []
  
  // Split by common separators
  const effects = text.split(/[;,]|\b(?:and|plus)\b/i)
    .map(e => e.trim())
    .filter(e => e.length > 3 && e.length < 100)
  
  // Filter out noise
  return effects.filter(e => 
    !e.match(/^(adverse|reaction|warning|precaution|section|follow|including|see|data)/i)
  ).slice(0, 10)
}

async function cleanSE() {
  console.log('Cleaning side effects...\n')
  
  const allSE = await db.drugSideEffect.findMany({
    where: { sideEffect: { length: { gt: 100 } } }
  })
  
  console.log('Found', allSE.length, 'long SE records to clean')
  
  let cleaned = 0
  for (const se of allSE) {
    const extracted = extractSideEffects(se.sideEffect)
    
    if (extracted.length > 0) {
      // Delete the long one
      await db.drugSideEffect.delete({ where: { id: se.id } })
      
      // Add cleaned versions
      for (const effect of extracted) {
        await db.drugSideEffect.create({
          data: { drugId: se.drugId, sideEffect: effect, severity: 'common' }
        })
        cleaned++
      }
    }
  }
  
  console.log('Replaced with', cleaned, 'cleaned SE')
}

cleanSE().then(() => process.exit(0))