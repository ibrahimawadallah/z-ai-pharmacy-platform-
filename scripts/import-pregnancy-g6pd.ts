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

function parsePregnancy(text: string) {
  if (!text) return null
  
  const lower = text.toLowerCase()
  let category = 'Unknown'
  const precautions: string[] = []
  
  if (lower.includes('pregnancy category a')) category = 'A'
  else if (lower.includes('pregnancy category b')) category = 'B'  
  else if (lower.includes('pregnancy category c')) category = 'C'
  else if (lower.includes('pregnancy category d')) category = 'D'
  else if (lower.includes('pregnancy category x')) category = 'X'
  
  if (lower.includes('use in pregnancy')) {
    precautions.push('Use with caution during pregnancy')
  }
  if (lower.includes('teratogenic')) {
    precautions.push('Potential teratogenic effects')
  }
  if (lower.includes('fetal toxicity')) {
    precautions.push('Associated with fetal toxicity')
  }
  
  return { category, precautions: precautions.join('; ') }
}

function parseG6PD(text: string) {
  if (!text) return null
  
  const lower = text.toLowerCase()
  
  if (lower.includes('g6pd')) {
    if (lower.includes('contraindicated') || lower.includes('avoid')) {
      return { safety: 'Contraindicated', warning: 'G6PD deficiency - contraindicated' }
    }
    if (lower.includes('hemolysis')) {
      return { safety: 'Use with caution', warning: 'Risk of hemolytic anemia in G6PD deficiency' }
    }
    return { safety: 'Use with caution', warning: 'Monitor for signs of hemolysis' }
  }
  
  return null
}

async function importClinical() {
  console.log('Importing pregnancy & G6PD data...\n')
  
  const drugs = await db.drug.findMany({
    where: { 
      status: 'Active',
      OR: [
        { pregnancyCategory: null },
        { g6pdSafety: null }
      ]
    },
    select: { id: true, genericName: true, pregnancyCategory: true, g6pdSafety: true },
    take: 2000
  })
  
  console.log('Found', drugs.length, 'drugs needing data')
  
  let pregnancyUpdated = 0
  let g6pdUpdated = 0
  
  for (const drug of drugs) {
    const term = drug.genericName?.split(' ')[0]
    if (!term || term.length < 3) continue
    
    try {
      const data = await fetch('https://api.fda.gov/drug/label.json?search=openfda.brand_name:' + term + '&limit=2')
      
      if (data.results && data.results.length > 0) {
        const allText = data.results.map((r: any) => 
          (r['Indications and Usage'] || '') + ' ' + 
          (r['Warnings and Precautions'] || '') + ' ' +
          (r['Use in Specific Populations'] || '')
        ).join(' ')
        
        const pregnancy = parsePregnancy(allText)
        if (pregnancy && !drug.pregnancyCategory) {
          await db.drug.update({
            where: { id: drug.id },
            data: { 
              pregnancyCategory: pregnancy.category,
              pregnancyPrecautions: pregnancy.precautions || null
            }
          })
          pregnancyUpdated++
        }
        
        const g6pd = parseG6PD(allText)
        if (g6pd && !drug.g6pdSafety) {
          await db.drug.update({
            where: { id: drug.id },
            data: { 
              g6pdSafety: g6pd.safety,
              g6pdWarning: g6pd.warning
            }
          })
          g6pdUpdated++
        }
      }
    } catch (e) { }
  }
  
  console.log('Updated:')
  console.log('  Pregnancy:', pregnancyUpdated)
  console.log('  G6PD:', g6pdUpdated)
}

importClinical().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })