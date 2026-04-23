import { db } from '@/lib/db'
import https from 'node:https'

function fetch(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => resolve(JSON.parse(data)))
    }).on('error', reject)
  })
}

async function importFromOpenFDA() {
  console.log('Fetching from OpenFDA...\n')
  
  try {
    const data = await fetch('https://api.fda.gov/drug/event.json?search=reaction.reactionmeddrapt:*&limit=100')
    
    console.log('Total events:', data.meta?.results?.total || 0)
    
    if (!data.results) return
    
    const sideEffects = new Map<string, Set<string>>()
    
    for (const event of data.results) {
      const reactions = event.reaction || []
      const drugs = event.drug || []
      
      for (const reaction of reactions) {
        if (reaction.reactionmeddrapt) {
          for (const drug of drugs) {
            if (drug.generic) {
              if (!sideEffects.has(drug.generic)) {
                sideEffects.set(drug.generic, new Set())
              }
              sideEffects.get(drug.generic).add(reaction.reactionmeddrapt)
            }
          }
        }
      }
    }
    
    console.log('Found', sideEffects.size, 'drugs with SE')
    
    let imported = 0
    for (const [drugName, effects] of sideEffects) {
      const drug = await db.drug.findFirst({
        where: { genericName: { contains: drugName, mode: 'insensitive' } }
      })
      
      if (drug) {
        for (const effect of effects) {
          await db.drugSideEffect.create({
            data: { drugId: drug.id, sideEffect: effect, severity: 'reported' }
          })
          imported++
        }
      }
    }
    
    console.log('Imported', imported, 'SE')
    
  } catch (e) { console.error(e) }
  finally { await db.$disconnect() }
}

importFromOpenFDA()