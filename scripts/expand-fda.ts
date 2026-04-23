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

function parseSEs(text: string): string[] {
  if (!text) return []
  
  const terms = [
    'nausea', 'vomiting', 'diarrhea', 'headache', 'dizziness', 'fatigue',
    'rash', 'constipation', 'abdominal pain', 'drowsiness', 'insomnia',
    'anxiety', 'dry mouth', 'fever', 'chills', 'shortness of breath',
    'chest pain', 'swelling', 'joint pain', 'muscle pain', 'back pain',
    'indigestion', 'heartburn', 'loss of appetite', 'sweating'
  ]
  
  const lower = text.toLowerCase()
  const found: string[] = []
  
  for (const term of terms) {
    if (lower.includes(term)) {
      found.push(term.charAt(0).toUpperCase() + term.slice(1))
    }
  }
  
  return found.slice(0, 15)
}

async function expand() {
  console.log('Expanding from FDA...\n')
  
  const drugs = await db.drug.findMany({
    where: { status: 'Active', sideEffects: { none: {} } },
    select: { id: true, genericName: true },
    take: 3000
  })
  
  console.log('Processing', drugs.length, 'drugs')
  
  let matchCount = 0
  let totalImported = 0
  
  for (const drug of drugs) {
    const term = drug.genericName?.split(' ')[0]
    if (!term || term.length < 3) continue
    
    try {
      const data = await fetch('https://api.fda.gov/drug/label.json?search=openfda.brand_name:' + term + '&limit=2')
      
      if (data.results && data.results.length > 0) {
        const allText = data.results.map((r: any) => r.adverse_reactions || '').join(' ')
        
        const parsed = parseSEs(allText)
        
        if (parsed.length > 0) {
          for (const se of parsed) {
            await db.drugSideEffect.create({
              data: { drugId: drug.id, sideEffect: se, severity: 'common' }
            })
            totalImported++
          }
          matchCount++
          console.log(term + ': ' + parsed.length)
        }
      }
    } catch (e) { }
  }
  
  const withSE = await db.drug.count({ where: { sideEffects: { some: {} } } })
  console.log('\nTotal with SE:', withSE)
}

expand().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })