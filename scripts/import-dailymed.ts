import { db } from '@/lib/db'
import https from 'https'

function fetch(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(data) } 
        catch { resolve('') }
      })
    }).on('error', reject)
  })
}

function extractXMLValue(xml: string, tag: string): string {
  const regex = new RegExp('<' + tag + '[^>]*>([^<]*)</' + tag + '>', 'i')
  const match = xml.match(regex)
  return match ? match[1].trim() : ''
}

async function searchDailyMed(drugName: string) {
  const url = 'https://dailymed.nlm.nih.gov/dailymed/services/v2/drugs.json?search=' + encodeURIComponent(drugName)
  const data = JSON.parse(await fetch(url))
  return data.data?.[0]?.setid
}

async function getSPLData(setid: string) {
  const url = 'https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/' + setid + '.xml'
  return fetch(url)
}

function parsePregnancyG6PD(xml: string) {
  const result = { pregnancy: '', precautions: '', g6pd: '', warning: '' }
  
  // Look for pregnancy category in XML
  if (xml.includes('Pregnancy Category A')) result.pregnancy = 'A'
  else if (xml.includes('Pregnancy Category B')) result.pregnancy = 'B'
  else if (xml.includes('Pregnancy Category C')) result.pregnancy = 'C'
  else if (xml.includes('Pregnancy Category D')) result.pregnancy = 'D'
  else if (xml.includes('Pregnancy Category X')) result.pregnancy = 'X'
  
  // Look for pregnancy warnings
  if (xml.includes('use in pregnancy') || xml.includes('pregnancy')) {
    result.precautions = 'Use with caution during pregnancy'
  }
  
  // G6PD
  if (xml.toLowerCase().includes('g6pd') || xml.toLowerCase().includes('glucose-6-phosphate')) {
    if (xml.toLowerCase().includes('contraindicated') || xml.toLowerCase().includes('avoid')) {
      result.g6pd = 'Contraindicated'
      result.warning = 'G6PD deficiency - contraindicated'
    } else if (xml.toLowerCase().includes('hemolys')) {
      result.g6pd = 'Use with caution'
      result.warning = 'Risk of hemolytic anemia in G6PD deficiency'
    } else {
      result.g6pd = 'Use with caution'
      result.warning = 'Monitor for signs of hemolysis'
    }
  }
  
  return result
}

async function importFromDailyMed() {
  console.log('Importing from DailyMed...\n')
  
  const drugs = await db.drug.findMany({
    where: { 
      status: 'Active',
      OR: [
        { pregnancyCategory: null },
        { g6pdSafety: null }
      ]
    },
    select: { id: true, genericName: true },
    take: 500
  })
  
  console.log('Processing', drugs.length, 'drugs')
  
  let found = 0
  
  for (const drug of drugs) {
    const term = drug.genericName?.split(' ')[0]
    if (!term) continue
    
    try {
      const setid = await searchDailyMed(term)
      if (!setid) continue
      
      const xml = await getSPLData(setid)
      if (!xml) continue
      
      const clinical = parsePregnancyG6PD(xml)
      
      if (clinical.pregnancy || clinical.g6pd) {
        await db.drug.update({
          where: { id: drug.id },
          data: {
            pregnancyCategory: clinical.pregnancy || 'Unknown',
            pregnancyPrecautions: clinical.precautions || null,
            g6pdSafety: clinical.g6pd || null,
            g6pdWarning: clinical.warning || null
          }
        })
        found++
        console.log(term + ': P' + clinical.pregnancy + ', G6PD:' + clinical.g6pd)
      }
    } catch (e) { }
  }
  
  console.log('\nUpdated', found, 'drugs')
}

importFromDailyMed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })