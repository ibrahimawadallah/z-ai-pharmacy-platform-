import { db } from '@/lib/db'
import https from 'https'

function fetch(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) } 
        catch { resolve({ results: [] }) }
      })
    }).on('error', reject)
  })
}

async function importFDA() {
  console.log('Bulk importing from FDA...\n')
  
  const allDrugs = await db.drug.findMany({
    where: { status: 'Active' },
    select: { id: true, genericName: true }
  })
  
  console.log('Found', allDrugs.length, 'active drugs')
  
  let processed = 0
  let found = 0
  let totalSE = 0
  
  for (const drug of allDrugs) {
    processed++
    if (processed % 200 === 0) console.log('Progress:', processed)
    
    const term = drug.genericName?.split(' ')[0]
    if (!term || term.length < 3) continue
    
    try {
      const data = await fetch('https://api.fda.gov/drug/label.json?search=openfda.brand_name:' + term + '&limit=3')
      
      if (data.results && data.results.length > 0) {
        const reactions = new Set()
        
        for (const label of data.results) {
          if (label.adverse_reactions) {
            for (const r of label.adverse_reactions) {
              reactions.add(r)
            }
          }
        }
        
        if (reactions.size > 0) {
          for (const se of reactions) {
            const id = drug.id + se.substring(0, 30)
            await db.drugSideEffect.upsert({
              where: { id: id },
              create: { drugId: drug.id, sideEffect: se, severity: 'reported' },
              update: {}
            })
            totalSE++
          }
          found++
        }
      }
    } catch (e) { }
  }
  
  const drugsWith = await db.drug.count({ where: { sideEffects: { some: {} } } })
  console.log('Total SE:', totalSE)
  console.log('Drugs with SE:', drugsWith)
}

importFDA().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })