import { db } from '@/lib/db'
import https from 'https'

const FETCH_TIMEOUT = 15000

function fetch(url: string, timeout = FETCH_TIMEOUT): Promise<string> {
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

async function searchDailyMed(drugName: string): Promise<string | null> {
  try {
    const url = 'https://dailymed.nlm.nih.gov/dailymed/services/v2/drugs.json?search=' + encodeURIComponent(drugName)
    const data = await fetch(url)
    const json = JSON.parse(data)
    return json.data?.[0]?.setid || null
  } catch { return null }
}

async function getSPLXml(setid: string): Promise<string | null> {
  try {
    const url = 'https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/' + setid + '.xml'
    return await fetch(url)
  } catch { return null }
}

function extractXmlValue(xml: string, tag: string): string {
  const regex = new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>', 'i')
  const match = xml.match(regex)
  return match ? match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : ''
}

function extractXmlValues(xml: string, tag: string): string[] {
  const regex = new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>', 'gi')
  const matches = xml.match(regex) || []
  return matches.map(m => m.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean)
}

function extractFullXmlSection(xml: string, section: string): string {
  const regex = new RegExp('<' + section + '[^>]*>([\\s\\S]*?)</' + section + '>', 'i')
  const match = xml.match(regex)
  return match ? match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : ''
}

function parsePregnancyData(xml: string) {
  const result = {
    pregnancyCategory: '',
    pregnancyPrecautions: '',
    breastfeedingSafety: ''
  }

  const xmlLower = xml.toLowerCase()

  if (xml.includes('Pregnancy Category A')) result.pregnancyCategory = 'A'
  else if (xml.includes('Pregnancy Category B')) result.pregnancyCategory = 'B'
  else if (xml.includes('Pregnancy Category C')) result.pregnancyCategory = 'C'
  else if (xml.includes('Pregnancy Category D')) result.pregnancyCategory = 'D'
  else if (xml.includes('Pregnancy Category X')) result.pregnancyCategory = 'X'
  else if (xml.includes('Pregnancy Category')) result.pregnancyCategory = 'Not Assigned'

  const useInPregnancy = extractFullXmlSection(xml, 'use_in_pregnancy')
  if (useInPregnancy.length > 10) {
    result.pregnancyPrecautions = useInPregnancy.substring(0, 1000)
  } else if (xmlLower.includes('pregnancy') && (xmlLower.includes('contraindicated') || xmlLower.includes('avoid'))) {
    result.pregnancyPrecautions = 'Use with caution - consult healthcare provider'
  }

  const nursingMothers = extractFullXmlSection(xml, 'nursing_mothers')
  if (nursingMothers.length > 10) {
    result.breastfeedingSafety = nursingMothers.substring(0, 500)
  } else if (xmlLower.includes('breastfeed') || xmlLower.includes('lactation')) {
    if (xmlLower.includes('contraindicated') || xmlLower.includes('avoid')) {
      result.breastfeedingSafety = 'Not recommended during breastfeeding'
    } else if (xmlLower.includes('excreted') || xmlLower.includes('present in breast')) {
      result.breastfeedingSafety = 'Use with caution - may be excreted in breast milk'
    }
  }

  return result
}

function parseG6PDData(xml: string) {
  const result = { g6pdSafety: '', g6pdWarning: '' }
  const xmlLower = xml.toLowerCase()

  if (xmlLower.includes('g6pd') || xmlLower.includes('glucose-6-phosphate') || xmlLower.includes('favism')) {
    if (xmlLower.includes('contraindicated') || xmlLower.includes('should not be used') || xmlLower.includes('not for use in')) {
      result.g6pdSafety = 'Contraindicated'
      result.g6pdWarning = 'G6PD deficiency - contraindicated due to risk of hemolytic anemia'
    } else if (xmlLower.includes('hemolys')) {
      result.g6pdSafety = 'Use with caution'
      result.g6pdWarning = 'Risk of hemolytic anemia in G6PD deficiency - monitor for signs of hemolysis'
    } else {
      result.g6pdSafety = 'Use with caution'
      result.g6pdWarning = 'G6PD deficiency - use with caution, monitor for hemolysis'
    }
  }

  return result
}

function parseWarnings(xml: string) {
  let warnings = ''

  const boxWarning = extractFullXmlSection(xml, 'box_warning')
  if (boxWarning.length > 5) {
    warnings += '[BOX WARNING] ' + boxWarning.substring(0, 500) + '\n'
  }

  const warnings2 = extractFullXmlSection(xml, 'warnings')
  if (warnings2.length > 5 && warnings2.length < 2000) {
    warnings += warnings2
  }

  const contraindications = extractFullXmlSection(xml, 'contraindications')
  if (contraindications.length > 5) {
    if (warnings) warnings += '\n'
    warnings += '[CONTRAINDICATIONS] ' + contraindications.substring(0, 500)
  }

  return warnings.substring(0, 2000) || null
}

function parseDosage(xml: string) {
  let baseDoseMgPerKg: number | null = null
  let baseDoseIndication = ''

  const dosageSection = extractFullXmlSection(xml, 'dosage_and_administration')
  const adultDose = extractFullXmlSection(xml, 'adult_dose')

  const combinedDosage = dosageSection + ' ' + adultDose

  const mgPerKgMatch = combinedDosage.match(/(\d+(?:\.\d+)?)\s*mg\s*\/\s*kg/gi)
  if (mgPerKgMatch) {
    const numMatch = mgPerKgMatch[0].match(/(\d+(?:\.\d+)?)/)
    if (numMatch) {
      baseDoseMgPerKg = parseFloat(numMatch[1])
    }
  }

  if (combinedDosage.length > 10) {
    baseDoseIndication = combinedDosage.substring(0, 500)
  }

  return { baseDoseMgPerKg, baseDoseIndication }
}

function parseRenalHepatic(xml: string) {
  let renalAdjustment = ''
  let hepaticAdjustment = ''

  const useInRenal = extractFullXmlSection(xml, 'use_in_renal_impairment')
  const renal = extractFullXmlSection(xml, 'renal')
  const kidneys = extractFullXmlSection(xml, 'kidney')

  if (useInRenal.length > 5) renalAdjustment = useInRenal.substring(0, 500)
  else if (renal.length > 5) renalAdjustment = renal.substring(0, 500)
  else if (kidneys.length > 5) renalAdjustment = kidneys.substring(0, 500)

  const useInHepatic = extractFullXmlSection(xml, 'use_in_hepatic_impairment')
  const hepatic = extractFullXmlSection(xml, 'hepatic')
  const liver = extractFullXmlSection(xml, 'liver')

  if (useInHepatic.length > 5) hepaticAdjustment = useInHepatic.substring(0, 500)
  else if (hepatic.length > 5) hepaticAdjustment = hepatic.substring(0, 500)
  else if (liver.length > 5) hepaticAdjustment = liver.substring(0, 500)

  return { renalAdjustment: renalAdjustment || null, hepaticAdjustment: hepaticAdjustment || null }
}

function parseAdverseReactions(xml: string): string[] {
  const sideEffects: string[] = []

  const adverseReactions = extractFullXmlSection(xml, 'adverse_reactions')
  if (adverseReactions.length > 10) {
    const lines = adverseReactions.split(/[,;]/).map(s => s.trim()).filter(Boolean)
    sideEffects.push(...lines.slice(0, 30))
  }

  const moreReactions = extractFullXmlSection(xml, 'adverse_reactions_table')
  if (moreReactions.length > 10) {
    const lines = moreReactions.split(/[,;]/).map(s => s.trim()).filter(Boolean)
    sideEffects.push(...lines.slice(0, 20))
  }

  return [...new Set(sideEffects)].slice(0, 30)
}

function parseDrugInteractions(xml: string): { description: string, severity: string }[] {
  const interactions: { description: string, severity: string }[] = []

  const interactionSection = extractFullXmlSection(xml, 'drug_interactions')
  if (interactionSection.length > 20) {
    const parts = interactionSection.split(/\n/).filter(s => s.length > 20)
    for (const part of parts.slice(0, 10)) {
      let severity = 'Moderate'
      const lower = part.toLowerCase()
      if (lower.includes('avoid') || lower.includes('contraindicated') || lower.includes('severe')) {
        severity = 'Major'
      } else if (lower.includes('minor') || lower.includes('minimal')) {
        severity = 'Minor'
      }
      interactions.push({ description: part.substring(0, 300), severity })
    }
  }

  return interactions.slice(0, 10)
}

async function processDrug(drug: { id: string, genericName: string, packageName: string }) {
  const searchTerm = drug.genericName?.split(/[\s,]/)[0] || drug.packageName?.split(/[\s,]/)[0]
  if (!searchTerm || searchTerm.length < 2) return null

  const setid = await searchDailyMed(searchTerm)
  if (!setid) return null

  const xml = await getSPLXml(setid)
  if (!xml || xml.length < 1000) return null

  const pregnancy = parsePregnancyData(xml)
  const g6pd = parseG6PDData(xml)
  const warnings = parseWarnings(xml)
  const dosage = parseDosage(xml)
  const renalHepatic = parseRenalHepatic(xml)
  const sideEffects = parseAdverseReactions(xml)
  const interactions = parseDrugInteractions(xml)

  return {
    pregnancy,
    g6pd,
    warnings,
    dosage,
    renalHepatic,
    sideEffects,
    interactions
  }
}

async function importFromDailyMed() {
  console.log('=== DailyMed Comprehensive Import ===\n')

  const drugs = await db.drug.findMany({
    where: {
      status: 'Active',
      OR: [
        { pregnancyCategory: null },
        { g6pdSafety: null },
        { warnings: null }
      ]
    },
    select: { id: true, genericName: true, packageName: true },
    take: 500
  })

  console.log('Found', drugs.length, 'drugs to process\n')

  let processed = 0
  let updated = 0
  let sideEffectCount = 0
  let interactionCount = 0

  for (let i = 0; i < drugs.length; i++) {
    const drug = drugs[i]
    process.stdout.write(`[${i + 1}/${drugs.length}] Processing: ${drug.genericName?.substring(0, 30)}... `)

    try {
      const data = await processDrug(drug)
      if (!data) {
        console.log('not found')
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
        baseDoseIndication: data.dosage.baseDoseIndication || null,
        renalAdjustment: data.renalHepatic.renalAdjustment,
        hepaticAdjustment: data.renalHepatic.hepaticAdjustment
      }

      await db.drug.update({ where: { id: drug.id }, data: updateData })
      updated++

      if (data.sideEffects.length > 0) {
        for (const se of data.sideEffects) {
          await db.drugSideEffect.upsert({
            where: { id: `${drug.id}-${se.substring(0, 20)}` },
            create: { drugId: drug.id, sideEffect: se, frequency: null, severity: null },
            update: {}
          })
          sideEffectCount++
        }
      }

      if (data.interactions.length > 0) {
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
          interactionCount++
        }
      }

      console.log('updated')
      processed++
    } catch (e: any) {
      console.log('error:', e.message)
    }
  }

  console.log('\n=== Summary ===')
  console.log('Drugs processed:', processed)
  console.log('Drugs updated:', updated)
  console.log('Side effects added:', sideEffectCount)
  console.log('Interactions added:', interactionCount)
}

importFromDailyMed()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1) })
