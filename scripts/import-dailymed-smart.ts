import { db } from '@/lib/db'
import https from 'https'

function fetch(url: string, timeout = 15000): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')) })
  })
}

function extractXmlValue(xml: string, tag: string): string {
  const regex = new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>', 'i')
  const match = xml.match(regex)
  return match ? match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : ''
}

function extractFullXmlSection(xml: string, section: string): string {
  const regex = new RegExp('<' + section + '[^>]*>([\\s\\S]*?)</' + section + '>', 'i')
  const match = xml.match(regex)
  return match ? match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : ''
}

function parsePregnancyData(xml: string) {
  const result = { pregnancyCategory: '', pregnancyPrecautions: '', breastfeedingSafety: '' }
  
  if (xml.includes('Pregnancy Category A')) result.pregnancyCategory = 'A'
  else if (xml.includes('Pregnancy Category B')) result.pregnancyCategory = 'B'
  else if (xml.includes('Pregnancy Category C')) result.pregnancyCategory = 'C'
  else if (xml.includes('Pregnancy Category D')) result.pregnancyCategory = 'D'
  else if (xml.includes('Pregnancy Category X')) result.pregnancyCategory = 'X'

  const useInPregnancy = extractFullXmlSection(xml, 'use_in_pregnancy')
  if (useInPregnancy.length > 10) result.pregnancyPrecautions = useInPregnancy.substring(0, 800)
  
  const nursing = extractFullXmlSection(xml, 'nursing_mothers')
  if (nursing.length > 10) result.breastfeedingSafety = nursing.substring(0, 500)
  else if (xml.toLowerCase().includes('breast') && xml.toLowerCase().includes('excreted')) {
    result.breastfeedingSafety = 'Use with caution - may be excreted in breast milk'
  }

  return result
}

function parseG6PDData(xml: string) {
  const result = { g6pdSafety: '', g6pdWarning: '' }
  const xmlLower = xml.toLowerCase()
  
  if (xmlLower.includes('g6pd') || xmlLower.includes('glucose-6-phosphate') || xmlLower.includes('favism')) {
    if (xmlLower.includes('contraindicated')) {
      result.g6pdSafety = 'Contraindicated'
      result.g6pdWarning = 'G6PD deficiency - contraindicated'
    } else if (xmlLower.includes('hemolys')) {
      result.g6pdSafety = 'Use with caution'
      result.g6pdWarning = 'Risk of hemolytic anemia in G6PD deficiency'
    } else {
      result.g6pdSafety = 'Use with caution'
      result.g6pdWarning = 'G6PD deficiency - use with caution'
    }
  }
  return result
}

function parseWarnings(xml: string) {
  let warnings = ''
  const boxWarning = extractFullXmlSection(xml, 'box_warning')
  if (boxWarning.length > 5) warnings += '[BOX WARNING] ' + boxWarning.substring(0, 400) + ' '
  const contraindications = extractFullXmlSection(xml, 'contraindications')
  if (contraindications.length > 5) warnings += '[CONTRAINDICATIONS] ' + contraindications.substring(0, 400)
  return warnings.substring(0, 1500) || null
}

function parseDosage(xml: string) {
  const dosage = extractFullXmlSection(xml, 'dosage_and_administration')
  const adultDose = extractFullXmlSection(xml, 'adult_dose')
  const combined = dosage + ' ' + adultDose
  
  let baseDoseMgPerKg: number | null = null
  const mgPerKgMatch = combined.match(/(\d+(?:\.\d+)?)\s*mg\s*\/\s*kg/gi)
  if (mgPerKgMatch) {
    const num = mgPerKgMatch[0].match(/(\d+(?:\.\d+)?)/)
    if (num) baseDoseMgPerKg = parseFloat(num[1])
  }
  
  return { baseDoseMgPerKg, baseDoseIndication: combined.substring(0, 500) || null }
}

function parseAdverseReactions(xml: string): string[] {
  const reactions = extractFullXmlSection(xml, 'adverse_reactions')
  if (reactions.length > 10) {
    return reactions.split(/[,;]/).map(s => s.trim()).filter(Boolean).slice(0, 25)
  }
  return []
}

function parseInteractions(xml: string) {
  const interactions = extractFullXmlSection(xml, 'drug_interactions')
  if (interactions.length > 20) {
    const parts = interactions.split(/\n/).filter(s => s.length > 15)
    return parts.slice(0, 8).map(p => {
      const lower = p.toLowerCase()
      let severity = 'Moderate'
      if (lower.includes('avoid') || lower.includes('contraindicated') || lower.includes('severe')) severity = 'Major'
      else if (lower.includes('minor') || lower.includes('minimal')) severity = 'Minor'
      return { description: p.substring(0, 250), severity }
    })
  }
  return []
}

async function searchDailyMedDrugs(query: string, maxPages = 5) {
  const results: { setid: string, title: string }[] = []
  const queryLower = query.toLowerCase().replace(/[^a-z]/g, ' ')
  
  for (let page = 1; page <= maxPages; page++) {
    try {
      const url = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.xml?pagesize=100&page=${page}`
      const xml = await fetch(url)
      
      const setidMatches = xml.match(/<setid>([^<]+)<\/setid>/g) || []
      const titleMatches = xml.match(/<title>([^<]+)<\/title>/g) || []
      
      for (let i = 0; i < setidMatches.length; i++) {
        const setid = setidMatches[i].replace(/<\/?setid>/g, '')
        const title = titleMatches[i]?.replace(/<\/?title>/g, '').toLowerCase() || ''
        
        const searchTerms = queryLower.split(' ').filter(t => t.length > 2)
        const hasMatch = searchTerms.some(term => title.includes(term))
        
        if (hasMatch) {
          results.push({ setid, title: titleMatches[i]?.replace(/<\/?title>/g, '') || '' })
        }
      }
    } catch { break }
  }
  return results
}

async function fetchAndParseSPL(setid: string) {
  try {
    const xml = await fetch(`https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/${setid}.xml`, 20000)
    if (!xml || xml.length < 5000) return null
    
    return {
      pregnancy: parsePregnancyData(xml),
      g6pd: parseG6PDData(xml),
      warnings: parseWarnings(xml),
      dosage: parseDosage(xml),
      sideEffects: parseAdverseReactions(xml),
      interactions: parseInteractions(xml)
    }
  } catch { return null }
}

async function importFromDailyMed() {
  console.log('=== DailyMed Smart Import ===\n')

  const drugs = await db.drug.findMany({
    where: { status: 'Active' },
    select: { id: true, genericName: true },
    take: 200
  })

  let processed = 0
  let updated = 0

  for (let i = 0; i < drugs.length; i++) {
    const drug = drugs[i]
    const searchTerms = (drug.genericName || '')
      .split(/[\s,()]/)
      .filter(t => t.length > 3 && !t.match(/^\d/))
      .slice(0, 2)
      .join(' ')
    
    if (!searchTerms || searchTerms.length < 3) {
      console.log(`[${i + 1}/${drugs.length}] Skipping: ${drug.genericName?.substring(0, 20)}`)
      continue
    }

    process.stdout.write(`[${i + 1}/${drugs.length}] Searching: ${searchTerms.substring(0, 25)}... `)

    try {
      const matches = await searchDailyMedDrugs(searchTerms, 3)
      
      if (matches.length === 0) {
        console.log('no match')
        continue
      }

      const match = matches[0]
      const data = await fetchAndParseSPL(match.setid)
      
      if (!data) {
        console.log('parse failed')
        continue
      }

      const updateData: any = {
        pregnancyCategory: data.pregnancy.pregnancyCategory || 'Unknown',
        pregnancyPrecautions: data.pregnancy.pregnancyPrecautions || null,
        breastfeedingSafety: data.pregnancy.breastfeedingSafety || null,
        g6pdSafety: data.g6pd.g6pdSafety || null,
        g6pdWarning: data.g6pd.g6pdWarning || null,
        warnings: data.warnings,
        baseDoseMgPerKg: data.dosage.baseDoseMgPerKg,
        baseDoseIndication: data.dosage.baseDoseIndication
      }

      await db.drug.update({ where: { id: drug.id }, data: updateData })

      for (const se of data.sideEffects) {
        await db.drugSideEffect.upsert({
          where: { id: `${drug.id}-${se.substring(0, 15)}` },
          create: { drugId: drug.id, sideEffect: se, frequency: null },
          update: {}
        })
      }

      for (const int of data.interactions) {
        await db.drugInteraction.create({
          data: {
            drugId: drug.id,
            interactionType: int.description.substring(0, 50),
            description: int.description,
            severity: int.severity,
            evidence: 'DailyMed SPL'
          }
        })
      }

      console.log(`found! (${data.sideEffects.length} SE, ${data.interactions.length} INT)`)
      updated++
    } catch (e: any) {
      console.log('error:', e.message)
    }
    processed++
  }

  console.log(`\n=== Summary ===`)
  console.log(`Processed: ${processed}, Updated: ${updated}`)
}

importFromDailyMed()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1) })
