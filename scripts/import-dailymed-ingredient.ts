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

function extractActiveIngredient(genericName: string): string {
  if (!genericName) return ''
  
  let cleaned = genericName
    .replace(/\([^)]+\)/g, ' ')
    .replace(/\d+(\.\d+)?%/g, '')
    .replace(/(\d+\s*mg|\d+\s*ml|\d+\s*g)/gi, '')
    .replace(/[\[\]0-9]/g, ' ')
    .trim()

  const commonDrugs: Record<string, string> = {
    'metformin': 'metformin', 'glimepiride': 'glimepiride', 'glibenclamide': 'glyburide',
    'atorvastatin': 'atorvastatin', 'simvastatin': 'simvastatin', 'rosuvastatin': 'rosuvastatin',
    'amlodipine': 'amlodipine', 'losartan': 'losartan', 'valsartan': 'valsartan',
    'telmisartan': 'telmisartan', 'ramipril': 'ramipril', 'enalapril': 'enalapril',
    'lisinopril': 'lisinopril', 'bisoprolol': 'bisoprolol', 'metoprolol': 'metoprolol',
    'carvedilol': 'carvedilol', 'atenolol': 'atenolol', 'propafenone': 'propafenone',
    'amiodarone': 'amiodarone', 'digoxin': 'digoxin', 'furosemide': 'furosemide',
    'spironolactone': 'spironolactone', 'hydrochlorothiazide': 'hydrochlorothiazide',
    'warfarin': 'warfarin', 'clopidogrel': 'clopidogrel', 'aspirin': 'aspirin',
    'omeprazole': 'omeprazole', 'pantoprazole': 'pantoprazole', 'esomeprazole': 'esomeprazole',
    'lansoprazole': 'lansoprazole', 'rabeprazole': 'rabeprazole',
    'levothyroxine': 'levothyroxine', 'levofloxacin': 'levofloxacin',
    'ciprofloxacin': 'ciprofloxacin', 'azithromycin': 'azithromycin', 'amoxicillin': 'amoxicillin',
    'cephalexin': 'cephalexin', 'ceftriaxone': 'ceftriaxone', 'metronidazole': 'metronidazole',
    'nitrofurantoin': 'nitrofurantoin', 'fluconazole': 'fluconazole',
    'sertraline': 'sertraline', 'escitalopram': 'escitalopram', 'fluoxetine': 'fluoxetine',
    'paroxetine': 'paroxetine', 'duloxetine': 'duloxetine', 'venlafaxine': 'venlafaxine',
    'olanzapine': 'olanzapine', 'quetiapine': 'quetiapine', 'aripiprazole': 'aripiprazole',
    'pregabalin': 'pregabalin', 'gabapentin': 'gabapentin',
    'levetiracetam': 'levetiracetam', 'valproic': 'valproic', 'phenytoin': 'phenytoin',
    'carbamazepine': 'carbamazepine', 'lithium': 'lithium',
    'codeine': 'codeine', 'tramadol': 'tramadol', 'morphine': 'morphine',
    'diclofenac': 'diclofenac', 'ibuprofen': 'ibuprofen', 'naproxen': 'naproxen',
    'ketorolac': 'ketorolac', 'pethidine': 'meperidine', 'midazolam': 'midazolam',
    'heparin': 'heparin', 'insulin': 'insulin', 'prednisone': 'prednisone',
    'methylprednisolone': 'methylprednisolone', 'dexamethasone': 'dexamethasone',
    'hydrocortisone': 'hydrocortisone', 'chlorpheniramine': 'chlorpheniramine',
    'loratadine': 'loratadine', 'cetirizine': 'cetirizine', 'desloratadine': 'desloratadine',
    'montelukast': 'montelukast', 'salbutamol': 'albuterol', 'budesonide': 'budesonide',
    'ipratropium': 'ipratropium', 'tiotropium': 'tiotropium',
    'aciclovir': 'acyclovir', 'valaciclovir': 'valacyclovir',
    'sildenafil': 'sildenafil', 'tadalafil': 'tadalafil',
    'finasteride': 'finasteride', 'dutasteride': 'dutasteride',
    'tamsulosin': 'tamsulosin', 'alfuzosin': 'alfuzosin',
    'latanoprost': 'latanoprost', 'timolol': 'timolol',
    'povidone': 'povidone', 'chloramphenicol': 'chloramphenicol',
    'tetracycline': 'tetracycline', 'doxycycline': 'doxycycline', 'minocycline': 'minocycline',
    'clindamycin': 'clindamycin', 'erythromycin': 'erythromycin',
    'trimethoprim': 'trimethoprim', 'sulfamethoxazole': 'sulfamethoxazole',
    'hydroxychloroquine': 'hydroxychloroquine', 'chloroquine': 'chloroquine',
    'allopurinol': 'allopurinol', 'febuxostat': 'febuxostat', 'colchicine': 'colchicine',
    'rasagiline': 'rasagiline', 'selegiline': 'selegiline', 'pramipexole': 'pramipexole',
    'ropinirole': 'ropinirole', 'baclofen': 'baclofen', 'tizanidine': 'tizanidine',
    'cyclobenzaprine': 'cyclobenzaprine', 'orphenadrine': 'orphenadrine',
    'pyridostigmine': 'pyridostigmine', 'neostigmine': 'neostigmine',
    'atropine': 'atropine', 'glycopyrrolate': 'glycopyrrolate',
    'ondansetron': 'ondansetron', 'granisetron': 'granisetron', 'metoclopramide': 'metoclopramide',
    'domperidone': 'domperidone', 'loperamide': 'loperamide',
    'lactulose': 'lactulose', 'bisacodyl': 'bisacodyl', 'sennosides': 'sennosides',
    'esomeprazole': 'esomeprazole', 'dexlansoprazole': 'dexlansoprazole',
    'pantoprazole': 'pantoprazole', 'ranitidine': 'ranitidine', 'famotidine': 'famotidine',
    'cimetidine': 'cimetidine', 'misoprostol': 'misoprostol', 'sucralfate': 'sucralfate',
    'ursodiol': 'ursodiol', 'silymarin': 'silymarin',
    'alpha lipoic': 'alpha lipoic', 'methylcobalamin': 'methylcobalamin',
    'pyridoxine': 'pyridoxine', 'thiamine': 'thiamine', 'folic acid': 'folic acid',
    'iron': 'iron', 'ferrous': 'ferrous', 'calcium': 'calcium', 'vitamin': 'vitamin'
  }

  const words = cleaned.toLowerCase().split(/[\s,\-]+/).filter(w => w.length > 2)
  
  for (const word of words) {
    if (commonDrugs[word]) return commonDrugs[word]
  }

  return words[0] || ''
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

async function searchDailyMedByIngredient(ingredient: string): Promise<{ setid: string, title: string } | null> {
  if (!ingredient || ingredient.length < 3) return null
  
  try {
    const url = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.xml?pagesize=50&search=${encodeURIComponent(ingredient)}`
    const xml = await fetch(url)
    
    const setidMatch = xml.match(/<setid>([^<]+)<\/setid>/)
    const titleMatch = xml.match(/<title>([^<]+)<\/title>/)
    
    if (setidMatch && titleMatch) {
      return {
        setid: setidMatch[1],
        title: titleMatch[1]
      }
    }
  } catch { }
  return null
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
  console.log('=== DailyMed Import (Active Ingredient Search) ===\n')

  const drugs = await db.drug.findMany({
    where: { status: 'Active' },
    select: { id: true, genericName: true },
    take: 500
  })

  let processed = 0
  let updated = 0

  for (let i = 0; i < drugs.length; i++) {
    const drug = drugs[i]
    const activeIngredient = extractActiveIngredient(drug.genericName || '')
    
    if (!activeIngredient || activeIngredient.length < 3) {
      continue
    }

    process.stdout.write(`[${i + 1}/${drugs.length}] ${activeIngredient}: `)

    try {
      const match = await searchDailyMedByIngredient(activeIngredient)
      
      if (!match) {
        console.log('not found')
        continue
      }

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

      console.log(`found! (${data.sideEffects.length} SE, ${data.interactions.length} INT, P:${data.pregnancy.pregnancyCategory || '?'})`)
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
