import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import https from 'https'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const createPrismaClient = () => {
  const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL
  return new PrismaClient({
    datasources: {
      db: { url: dbUrl }
    }
  })
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

const DELAY_MS = 1000 // Rate limiting - 1 second between requests

function fetch(url: string, timeout = 25000): Promise<string> {
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

function extractByTitle(xml: string, title: string, maxLen = 800): string {
  const pattern = new RegExp('<title>[^<]*' + title + '[^<]*</title>[\\s\\S]*?<text>([\\s\\S]*?)</text>', 'i')
  const match = xml.match(pattern)
  return match ? stripXml(match[1]).substring(0, maxLen) : ''
}

function extractByTitles(xml: string, titles: string[]): string {
  for (const title of titles) {
    const result = extractByTitle(xml, title, 1000)
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
  if (pregSection.length > 10) result.precautions = pregSection.substring(0, 600)
  
  const nursing = extractByTitles(xml, ['NURSING', 'LACTATION', 'BREASTFEEDING', 'NURSING MOTHERS'])
  if (nursing.length > 10) result.breastfeeding = nursing.substring(0, 400)
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
  const contraindications = extractByTitle(xml, 'CONTRAINDICATIONS', 400)
  const warnings = extractByTitle(xml, 'WARNINGS', 500)
  
  let result = ''
  if (contraindications) result = '[CONTRAINDICATIONS] ' + contraindications
  if (warnings) {
    if (result) result += '\n[WARNINGS] ' + warnings
    else result = '[WARNINGS] ' + warnings
  }
  
  return result || null
}

function parseDosage(xml: string) {
  const dosage = extractByTitle(xml, 'DOSAGE', 600)
  
  let mgPerKg: number | null = null
  const match = dosage?.match(/(\d+(?:\.\d+)?)\s*mg\s*\/\s*kg/i)
  if (match) mgPerKg = parseFloat(match[1])
  
  return { mgPerKg: mgPerKg || null, indication: dosage || null }
}

function parseSideEffects(xml: string): string[] {
  const adverse = extractByTitle(xml, 'ADVERSE', 2000)
  if (!adverse || adverse.length < 20) return []
  
  const text = adverse.toLowerCase()
  const commonEffects = [
    'headache', 'dizziness', 'nausea', 'vomiting', 'diarrhea', 'constipation',
    'fatigue', 'drowsiness', 'insomnia', 'anxiety', 'rash', 'pruritus',
    'hypotension', 'hypertension', 'bradycardia', 'tachycardia',
    'abdominal pain', 'dry mouth', 'back pain', 'joint pain', 'muscle pain'
  ]
  
  const found: string[] = []
  for (const effect of commonEffects) {
    if (text.includes(effect) && !found.includes(effect)) {
      found.push(effect)
    }
  }
  
  return found.slice(0, 15)
}

const ingredientMap: Record<string, string> = {
  'metformin': 'metformin', 'glimepiride': 'glimepiride', 'glibenclamide': 'glyburide',
  'atorvastatin': 'atorvastatin', 'simvastatin': 'simvastatin', 'rosuvastatin': 'rosuvastatin',
  'amlodipine': 'amlodipine', 'losartan': 'losartan', 'valsartan': 'valsartan',
  'telmisartan': 'telmisartan', 'ramipril': 'ramipril', 'enalapril': 'enalapril',
  'lisinopril': 'lisinopril', 'bisoprolol': 'bisoprolol', 'metoprolol': 'metoprolol',
  'carvedilol': 'carvedilol', 'atenolol': 'atenolol',
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
  'ketorolac': 'ketorolac', 'midazolam': 'midazolam',
  'heparin': 'heparin', 'insulin': 'insulin', 'prednisone': 'prednisone',
  'methylprednisolone': 'methylprednisolone', 'dexamethasone': 'dexamethasone',
  'chlorpheniramine': 'chlorpheniramine', 'loratadine': 'loratadine', 'cetirizine': 'cetirizine',
  'montelukast': 'montelukast', 'salbutamol': 'salbutamol', 'budesonide': 'budesonide',
  'aciclovir': 'acyclovir', 'valaciclovir': 'valacyclovir',
  'sildenafil': 'sildenafil', 'tadalafil': 'tadalafil',
  'finasteride': 'finasteride', 'dutasteride': 'dutasteride',
  'tamsulosin': 'tamsulosin', 'alfuzosin': 'alfuzosin',
  'latanoprost': 'latanoprost', 'timolol': 'timolol',
  'chloramphenicol': 'chloramphenicol',
  'tetracycline': 'tetracycline', 'doxycycline': 'doxycycline', 'minocycline': 'minocycline',
  'clindamycin': 'clindamycin', 'erythromycin': 'erythromycin',
  'trimethoprim': 'trimethoprim', 'sulfamethoxazole': 'sulfamethoxazole',
  'hydroxychloroquine': 'hydroxychloroquine', 'chloroquine': 'chloroquine',
  'allopurinol': 'allopurinol', 'febuxostat': 'febuxostat', 'colchicine': 'colchicine',
  'ondansetron': 'ondansetron', 'granisetron': 'granisetron', 'metoclopramide': 'metoclopramide',
  'domperidone': 'domperidone', 'loperamide': 'loperamide',
  'lactulose': 'lactulose', 'bisacodyl': 'bisacodyl', 'sennosides': 'sennosides',
  'ranitidine': 'ranitidine', 'famotidine': 'famotidine', 'cimetidine': 'cimetidine',
  'misoprostol': 'misoprostol', 'sucralfate': 'sucralfate'
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
    const url = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.xml?pagesize=20&search=${encodeURIComponent(ingredient)}`
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
    const xml = await fetch(`https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/${setid}.xml`, 30000)
    if (!xml || xml.length < 5000) return null
    
    return {
      pregnancy: parsePregnancy(xml),
      g6pd: parseG6PD(xml),
      warnings: parseWarnings(xml),
      dosage: parseDosage(xml),
      sideEffects: parseSideEffects(xml)
    }
  } catch { return null }
}

async function enrichFromDailyMed(limit: number = 100) {
  console.log('\n=== DAILYMED ENRICHMENT ===\n')

  // Get drugs without pregnancy data
  const drugs = await prisma.drug.findMany({
    where: {
      status: 'Active',
      OR: [
        { pregnancyCategory: null },
        { g6pdSafety: null }
      ]
    },
    select: { id: true, genericName: true, packageName: true, pregnancyCategory: true, g6pdSafety: true },
    take: limit
  })

  console.log(`Found ${drugs.length} drugs needing clinical data\n`)

  let processed = 0
  let updated = 0
  let skipped = 0

  for (let i = 0; i < drugs.length; i++) {
    const drug = drugs[i]
    const activeIngredient = extractActiveIngredient(drug.genericName || '')
    
    if (!activeIngredient || activeIngredient.length < 3) {
      skipped++
      continue
    }

    process.stdout.write(`[${i + 1}/${drugs.length}] ${activeIngredient}: `)

    try {
      // Rate limiting
      if (i > 0) await new Promise(r => setTimeout(r, DELAY_MS))

      const match = await searchDailyMed(activeIngredient)
      if (!match) { 
        console.log('not found in DailyMed')
        skipped++
        continue 
      }

      const data = await processSPL(match.setid)
      if (!data) { 
        console.log('parse failed')
        skipped++
        continue 
      }

      const updateData: any = {
        pregnancyCategory: data.pregnancy.category || drug.pregnancyCategory,
        pregnancyPrecautions: data.pregnancy.precautions || null,
        breastfeedingSafety: data.pregnancy.breastfeeding || null,
        g6pdSafety: data.g6pd.safety || drug.g6pdSafety,
        g6pdWarning: data.g6pd.warning || null,
        warnings: data.warnings,
        baseDoseMgPerKg: data.dosage.mgPerKg,
        baseDoseIndication: data.dosage.indication
      }

      await prisma.drug.update({ where: { id: drug.id }, data: updateData })

      // Add side effects
      for (const se of data.sideEffects) {
        await prisma.drugSideEffect.upsert({
          where: { id: `${drug.id}-${se.substring(0, 15)}` },
          create: { drugId: drug.id, sideEffect: se, frequency: null },
          update: {}
        })
      }

      console.log(`✓ P:${data.pregnancy.category || '-'} G:${data.g6pd.safety || '-'} SE:${data.sideEffects.length}`)
      updated++
    } catch (e: any) {
      console.log('error:', e.message)
      skipped++
    }
    processed++
  }

  console.log(`\n=== SUMMARY ===`)
  console.log(`Processed: ${processed}`)
  console.log(`Updated: ${updated}`)
  console.log(`Skipped: ${skipped}`)
}

async function main() {
  console.log('=== DAILYMED DRUG ENRICHMENT ===\n')
  
  try {
    // First, show current status
    const [total, withPregnancy, withG6PD] = await Promise.all([
      prisma.drug.count({ where: { status: 'Active' } }),
      prisma.drug.count({ where: { status: 'Active', pregnancyCategory: { not: null } } }),
      prisma.drug.count({ where: { status: 'Active', g6pdSafety: { not: null } } })
    ])

    console.log(`Total Active Drugs: ${total}`)
    console.log(`With Pregnancy Data: ${withPregnancy}`)
    console.log(`With G6PD Data: ${withG6PD}`)
    console.log(`Needs Enrichment: ${total - withPregnancy - withG6PD}`)

    // Run enrichment for top 50 drugs (can be increased)
    await enrichFromDailyMed(50)

    // Show final status
    const [finalPregnancy, finalG6PD] = await Promise.all([
      prisma.drug.count({ where: { status: 'Active', pregnancyCategory: { not: null } } }),
      prisma.drug.count({ where: { status: 'Active', g6pdSafety: { not: null } } })
    ])

    console.log('\n=== FINAL STATUS ===')
    console.log(`With Pregnancy Data: ${finalPregnancy} (+${finalPregnancy - withPregnancy})`)
    console.log(`With G6PD Data: ${finalG6PD} (+${finalG6PD - withG6PD})`)

    console.log('\n✅ DailyMed enrichment complete!')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()