import { db } from '@/lib/db'
import https from 'https'

function fetch(url: string, timeout = 20000): Promise<string> {
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

function extractXmlSection(xml: string, sectionId: string): string {
  const regex = new RegExp('id="' + sectionId + '"[^>]*>[\\s\\S]*?<text>[\\s\\S]*?<paragraph>([\\s\\S]*?)</paragraph>', 'i')
  const match = xml.match(regex)
  if (match) return match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  
  const altRegex = new RegExp('<section[^>]*>.*?' + sectionId + '.*?</section>[\\s\\S]*?<text>([\\s\\S]*?)</text>', 'i')
  const altMatch = xml.match(altRegex)
  if (altMatch) return altMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  
  return ''
}

function extractByCode(xml: string, code: string): string {
  const regex = new RegExp('<section[^>]*>[\\s\\S]*?<code[^>]*>' + code + '</code>[\\s\\S]*?<title>([^<]+)</title>[\\s\\S]*?<text>([\\s\\S]*?)</text>', 'i')
  const match = xml.match(regex)
  if (match && match[2]) {
    return match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  }
  return ''
}

function extractTableContent(xml: string): string[] {
  const results: string[] = []
  const rows = xml.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || []
  for (const row of rows.slice(2)) {
    const cells = row.match(/<td[^>]*>([^<]+)<\/td>/gi) || []
    if (cells.length > 1) {
      const text = cells[0].replace(/<[^>]+>/g, '').trim()
      if (text && text.length > 2 && !text.includes('---')) {
        results.push(text)
      }
    }
  }
  return results
}

function parsePregnancyData(xml: string) {
  const result = { pregnancyCategory: '', pregnancyPrecautions: '', breastfeedingSafety: '' }
  
  if (xml.includes('Pregnancy Category A')) result.pregnancyCategory = 'A'
  else if (xml.includes('Pregnancy Category B')) result.pregnancyCategory = 'B'
  else if (xml.includes('Pregnancy Category C')) result.pregnancyCategory = 'C'
  else if (xml.includes('Pregnancy Category D')) result.pregnancyCategory = 'D'
  else if (xml.includes('Pregnancy Category X')) result.pregnancyCategory = 'X'

  const pregSection = extractByCode(xml, '48798-6')
  if (pregSection.length > 10) result.pregnancyPrecautions = pregSection.substring(0, 800)
  
  const nursingSection = extractByCode(xml, '48792-9')
  if (nursingSection.length > 10) result.breastfeedingSafety = nursingSection.substring(0, 500)
  else if (xml.toLowerCase().includes('breast') && xml.toLowerCase().includes('milk')) {
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
  
  const boxWarning = extractByCode(xml, '43685-7')
  if (boxWarning.length > 5) warnings += '[WARNINGS] ' + boxWarning.substring(0, 500)
  
  const contraindications = extractByCode(xml, '34070-3')
  if (contraindications.length > 5) {
    if (warnings) warnings += '\n'
    warnings += '[CONTRAINDICATIONS] ' + contraindications.substring(0, 400)
  }
  
  return warnings.substring(0, 1500) || null
}

function parseDosage(xml: string) {
  const dosageSection = extractByCode(xml, '34068-7')
  
  let baseDoseMgPerKg: number | null = null
  const mgPerKgMatch = dosageSection.match(/(\d+(?:\.\d+)?)\s*mg\s*\/\s*kg/gi)
  if (mgPerKgMatch) {
    const num = mgPerKgMatch[0].match(/(\d+(?:\.\d+)?)/)
    if (num) baseDoseMgPerKg = parseFloat(num[1])
  }
  
  return { baseDoseMgPerKg, baseDoseIndication: dosageSection.substring(0, 500) || null }
}

function parseSideEffects(xml: string): string[] {
  const effects: string[] = []
  
  const adverseSection = extractByCode(xml, '34084-4')
  if (adverseSection.length > 10) {
    const lines = adverseSection.split(/[,;.\n]/).map(s => s.trim()).filter(s => s.length > 3 && s.length < 80)
    effects.push(...lines.slice(0, 30))
  }
  
  const tableEffects = extractTableContent(xml)
  effects.push(...tableEffects)
  
  return [...new Set(effects)].slice(0, 30)
}

function parseInteractions(xml: string) {
  const interactions: { description: string, severity: string }[] = []
  
  const intSection = extractByCode(xml, '34069-5')
  if (intSection.length > 20) {
    const parts = intSection.split(/\n/).filter(s => s.length > 20)
    for (const part of parts.slice(0, 10)) {
      const lower = part.toLowerCase()
      let severity = 'Moderate'
      if (lower.includes('avoid') || lower.includes('contraindicated') || lower.includes('severe')) {
        severity = 'Major'
      } else if (lower.includes('minor') || lower.includes('minimal')) {
        severity = 'Minor'
      }
      interactions.push({ description: part.substring(0, 300), severity })
    }
  }
  
  return interactions
}

const ingredientMap: Record<string, string> = {
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
  'levetiracetam': 'levetiracetam', 'valproic': 'valproic acid', 'phenytoin': 'phenytoin',
  'carbamazepine': 'carbamazepine', 'lithium': 'lithium',
  'codeine': 'codeine', 'tramadol': 'tramadol', 'morphine': 'morphine',
  'diclofenac': 'diclofenac', 'ibuprofen': 'ibuprofen', 'naproxen': 'naproxen',
  'ketorolac': 'ketorolac', 'pethidine': 'meperidine', 'midazolam': 'midazolam',
  'heparin': 'heparin', 'insulin': 'insulin', 'prednisone': 'prednisone',
  'methylprednisolone': 'methylprednisolone', 'dexamethasone': 'dexamethasone',
  'hydrocortisone': 'hydrocortisone', 'chlorpheniramine': 'chlorpheniramine',
  'loratadine': 'loratadine', 'cetirizine': 'cetizine', 'desloratadine': 'desloratadine',
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
  'ranitidine': 'ranitidine', 'famotidine': 'famotidine', 'cimetidine': 'cimetidine',
  'misoprostol': 'misoprostol', 'sucralfate': 'sucralfate',
  'ursodiol': 'ursodiol', 'silymarin': 'silymarin',
  'alpha lipoic': 'alpha lipoic acid', 'methylcobalamin': 'methylcobalamin',
  'pyridoxine': 'pyridoxine', 'thiamine': 'thiamine', 'folic acid': 'folic acid',
  'iron': 'iron', 'ferrous': 'ferrous', 'calcium': 'calcium', 'vitamin': 'vitamin'
}

function extractActiveIngredient(genericName: string): string {
  if (!genericName) return ''
  let cleaned = genericName
    .replace(/\([^)]+\)/g, ' ')
    .replace(/\d+(\.\d+)?%/g, '')
    .replace(/(\d+\s*mg|\d+\s*ml|\d+\s*g)/gi, '')
    .replace(/[\[\]0-9]/g, ' ')
    .trim()
    .toLowerCase()

  const words = cleaned.split(/[\s,\-]+/).filter(w => w.length > 2)
  for (const word of words) {
    if (ingredientMap[word]) return ingredientMap[word]
  }
  return words[0] || ''
}

async function searchDailyMed(ingredient: string): Promise<{ setid: string, title: string } | null> {
  if (!ingredient || ingredient.length < 3) return null
  try {
    const url = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.xml?pagesize=50&search=${encodeURIComponent(ingredient)}`
    const xml = await fetch(url)
    const setidMatch = xml.match(/<setid>([^<]+)<\/setid>/)
    const titleMatch = xml.match(/<title>([^<]+)<\/title>/)
    if (setidMatch && titleMatch) {
      return { setid: setidMatch[1], title: titleMatch[1] }
    }
  } catch { }
  return null
}

async function fetchAndParseSPL(setid: string) {
  try {
    const xml = await fetch(`https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/${setid}.xml`, 25000)
    if (!xml || xml.length < 5000) return null
    
    return {
      pregnancy: parsePregnancyData(xml),
      g6pd: parseG6PDData(xml),
      warnings: parseWarnings(xml),
      dosage: parseDosage(xml),
      sideEffects: parseSideEffects(xml),
      interactions: parseInteractions(xml)
    }
  } catch { return null }
}

async function importFromDailyMed() {
  console.log('=== DailyMed Enhanced Import ===\n')

  const drugs = await db.drug.findMany({
    where: { status: 'Active' },
    select: { id: true, genericName: true },
    take: 300
  })

  let processed = 0
  let updated = 0
  let seCount = 0
  let intCount = 0

  for (let i = 0; i < drugs.length; i++) {
    const drug = drugs[i]
    const activeIngredient = extractActiveIngredient(drug.genericName || '')
    if (!activeIngredient || activeIngredient.length < 3) continue

    process.stdout.write(`[${i + 1}/${drugs.length}] ${activeIngredient}: `)

    try {
      const match = await searchDailyMed(activeIngredient)
      if (!match) { console.log('not found'); continue }

      const data = await fetchAndParseSPL(match.setid)
      if (!data) { console.log('parse failed'); continue }

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
        seCount++
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
        intCount++
      }

      console.log(`✓ (${data.sideEffects.length} SE, ${data.interactions.length} INT, P:${data.pregnancy.pregnancyCategory || '?'})`)
      updated++
    } catch (e: any) {
      console.log('error:', e.message)
    }
    processed++
  }

  console.log(`\n=== Summary ===`)
  console.log(`Processed: ${processed}, Updated: ${updated}`)
  console.log(`Side effects added: ${seCount}`)
  console.log(`Interactions added: ${intCount}`)
}

importFromDailyMed()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1) })
