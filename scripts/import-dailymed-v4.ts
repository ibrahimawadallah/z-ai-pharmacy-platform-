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

function stripXml(text: string): string {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractByTitle(xml: string, title: string, maxLen = 1000): string {
  const pattern = new RegExp('<title>[^<]*' + title + '[^<]*</title>[\\s\\S]*?<text>([\\s\\S]*?)</text>', 'i')
  const match = xml.match(pattern)
  return match ? stripXml(match[1]).substring(0, maxLen) : ''
}

function extractByTitles(xml: string, titles: string[]): string {
  for (const title of titles) {
    const result = extractByTitle(xml, title, 1500)
    if (result && result.length > 10) return result
  }
  return ''
}

function parsePregnancy(xml: string) {
  const result = { category: '', precautions: '', breastfeeding: '' }
  
  if (xml.includes('Pregnancy Category A')) result.category = 'A'
  else if (xml.includes('Pregnancy Category B')) result.category = 'B'
  else if (xml.includes('Pregnancy Category C')) result.category = 'C'
  else if (xml.includes('Pregnancy Category D')) result.category = 'D'
  else if (xml.includes('Pregnancy Category X')) result.category = 'X'

  const pregSection = extractByTitles(xml, ['PREGNANCY', 'USE IN PREGNANCY', 'PREGNANCY CATEGORY'])
  if (pregSection.length > 10) result.precautions = pregSection.substring(0, 800)
  
  const nursing = extractByTitles(xml, ['NURSING', 'LACTATION', 'BREASTFEEDING', 'NURSING MOTHERS'])
  if (nursing.length > 10) result.breastfeeding = nursing.substring(0, 500)
  else if (xml.toLowerCase().includes('breast') && xml.toLowerCase().includes('milk')) {
    result.breastfeeding = 'Use with caution - may be excreted in breast milk'
  }

  return result
}

function parseG6PD(xml: string) {
  const result = { safety: '', warning: '' }
  const lower = xml.toLowerCase()
  
  if (lower.includes('g6pd') || lower.includes('glucose-6-phosphate') || lower.includes('favism')) {
    if (lower.includes('contraindicated')) {
      result.safety = 'Contraindicated'
      result.warning = 'G6PD deficiency - contraindicated'
    } else if (lower.includes('hemolys')) {
      result.safety = 'Use with caution'
      result.warning = 'Risk of hemolytic anemia in G6PD deficiency'
    } else {
      result.safety = 'Use with caution'
      result.warning = 'G6PD deficiency - use with caution'
    }
  }
  return result
}

function parseWarnings(xml: string) {
  const contraindications = extractByTitle(xml, 'CONTRAINDICATIONS', 600)
  const warnings = extractByTitle(xml, 'WARNINGS', 800)
  
  let result = ''
  if (contraindications) result = '[CONTRAINDICATIONS] ' + contraindications
  if (warnings) {
    if (result) result += '\n[WARNINGS] ' + warnings
    else result = '[WARNINGS] ' + warnings
  }
  
  return result || null
}

function parseDosage(xml: string) {
  const dosage = extractByTitle(xml, 'DOSAGE', 800)
  
  let mgPerKg: number | null = null
  const match = dosage?.match(/(\d+(?:\.\d+)?)\s*mg\s*\/\s*kg/i)
  if (match) mgPerKg = parseFloat(match[1])
  
  return { mgPerKg: mgPerKg || null, indication: dosage || null }
}

function parseSideEffects(xml: string): string[] {
  const adverse = extractByTitle(xml, 'ADVERSE', 3000)
  if (!adverse || adverse.length < 20) return []
  
  const text = adverse.toLowerCase()
  const commonEffects = [
    'headache', 'dizziness', 'nausea', 'vomiting', 'diarrhea', 'constipation',
    'fatigue', 'tiredness', 'drowsiness', 'insomnia', 'anxiety', 'depression',
    'rash', 'pruritus', 'hives', 'hypotension', 'hypertension',
    'bradycardia', 'tachycardia', 'palpitations',
    'shortness of breath', 'dyspnea', 'cough', 'wheezing',
    'abdominal pain', 'dry mouth', 'indigestion', 'heartburn', 'flatulence',
    'back pain', 'joint pain', 'muscle pain', 'arthralgia', 'myalgia',
    'blurred vision', 'dry eye', 'tinnitus',
    'weight gain', 'weight loss', 'edema', 'swelling', 'flushing',
    'sexual dysfunction', 'impotence', 'hypoglycemia'
  ]
  
  const found: string[] = []
  for (const effect of commonEffects) {
    if (text.includes(effect) && !found.includes(effect)) {
      found.push(effect)
    }
  }
  
  return found.slice(0, 25)
}

function parseInteractions(xml: string): { desc: string, severity: string }[] {
  const intSection = extractByTitle(xml, 'INTERACTIONS', 2000)
  if (!intSection || intSection.length < 20) return []
  
  const sentences = intSection.split(/[.;]/).filter(s => s.length > 20)
  
  const interactions: { desc: string, severity: string }[] = []
  for (const sentence of sentences.slice(0, 8)) {
    const lower = sentence.toLowerCase()
    let severity = 'Moderate'
    if (lower.includes('avoid') || lower.includes('contraindicated')) severity = 'Major'
    else if (lower.includes('minor')) severity = 'Minor'
    
    if (sentence.length > 15 && sentence.length < 300) {
      interactions.push({ desc: sentence.trim(), severity })
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

async function processSPL(setid: string) {
  try {
    const xml = await fetch(`https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/${setid}.xml`, 25000)
    if (!xml || xml.length < 5000) return null
    
    return {
      pregnancy: parsePregnancy(xml),
      g6pd: parseG6PD(xml),
      warnings: parseWarnings(xml),
      dosage: parseDosage(xml),
      sideEffects: parseSideEffects(xml),
      interactions: parseInteractions(xml)
    }
  } catch { return null }
}

async function importFromDailyMed() {
  console.log('=== DailyMed Import v4 (Title-based) ===\n')

  const drugs = await db.drug.findMany({
    where: { status: 'Active' },
    select: { id: true, genericName: true },
    take: 200
  })

  let processed = 0
  let updated = 0

  for (let i = 0; i < drugs.length; i++) {
    const drug = drugs[i]
    const activeIngredient = extractActiveIngredient(drug.genericName || '')
    if (!activeIngredient || activeIngredient.length < 3) continue

    process.stdout.write(`[${i + 1}/${drugs.length}] ${activeIngredient}: `)

    try {
      const match = await searchDailyMed(activeIngredient)
      if (!match) { console.log('not found'); continue }

      const data = await processSPL(match.setid)
      if (!data) { console.log('parse failed'); continue }

      const updateData: any = {
        pregnancyCategory: data.pregnancy.category || 'Unknown',
        pregnancyPrecautions: data.pregnancy.precautions || null,
        breastfeedingSafety: data.pregnancy.breastfeeding || null,
        g6pdSafety: data.g6pd.safety || null,
        g6pdWarning: data.g6pd.warning || null,
        warnings: data.warnings,
        baseDoseMgPerKg: data.dosage.mgPerKg,
        baseDoseIndication: data.dosage.indication
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
            interactionType: int.desc.substring(0, 50),
            description: int.desc,
            severity: int.severity,
            evidence: 'DailyMed SPL'
          }
        })
      }

      console.log(`✓ P:${data.pregnancy.category || '-'} B:${data.pregnancy.breastfeeding ? 'Y' : '-'} G:${data.g6pd.safety || '-'} SE:${data.sideEffects.length} INT:${data.interactions.length}`)
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