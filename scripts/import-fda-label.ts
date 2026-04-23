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
  console.log('Importing from FDA Label API...\n')
  
  let totalSE = 0
  
  // Search these common drugs
  const drugs = [
    'Ibuprofen', 'Metformin', 'Atorvastatin', 'Amlodipine', 'Lisinopril',
    'Omeprazole', 'Losartan', 'Metoprolol', 'Gabapentin', 'Sertraline',
    'Amoxicillin', 'Azithromycin', 'Ciprofloxacin', 'Prednisone', 'Acetaminophen',
    'Aspirin', 'Hydrochlorothiazide', 'Fluoxetine', 'Warfarin', 'Insulin'
  ]
  
  for (const term of drugs) {
    try {
      const data = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:${term}&limit=5`)
      
      if (data.results && data.results.length > 0) {
        const adverseReactions = new Set<string>()
        
        for (const label of data.results) {
          if (label.adverse_reactions) {
            for (const r of label.adverse_reactions) {
              adverseReactions.add(r)
            }
          }
        }
        
        if (adverseReactions.size > 0) {
          const dbDrug = await db.drug.findFirst({
            where: { OR: [
              { genericName: { contains: term, mode: 'insensitive' } },
              { packageName: { contains: term, mode: 'insensitive' } }
            ]}
          })
          
          if (dbDrug) {
            for (const se of adverseReactions) {
              await db.drugSideEffect.upsert({
                where: { id: dbDrug.id + '-' + se.substring(0, 50) },
                create: { drugId: dbDrug.id, sideEffect: se, severity: 'reported' },
                update: {}
              })
              totalSE++
            }
            console.log(`${term}: Added ${adverseReactions.size} SE`)
          }
        }
      }
    } catch (e) { console.log(term, 'error') }
  }
  
  const drugsWith = await db.drug.count({ where: { sideEffects: { some: {} } } })
  console.log(`\nDone! ${drugsWith} drugs now have SE`)
}

importFDA().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })