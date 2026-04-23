/**
 * Comprehensive UAE Drug to ICD-10 Mapping Generator
 * Processes all 22,049 drugs and maps them to relevant ICD-10 codes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple CSV parser
function parseCSV(content) {
  const lines = content.split('\n');
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''));

    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || '';
    });
    rows.push(row);
  }

  return rows;
}

// Comprehensive therapeutic category to ICD-10 mapping
const THERAPEUTIC_MAPPINGS = {
  // Cardiovascular - Expanded
  cardiovascular: ['I10', 'I25.10', 'I50.9', 'I48.91', 'I20.9'],
  antihypertensive: ['I10', 'I15.9'],
  'beta blocker': ['I10', 'I25.10', 'I48.91', 'I20.9'],
  'beta-blocker': ['I10', 'I25.10', 'I48.91', 'I20.9'],
  'ace inhibitor': ['I10', 'I50.9', 'I25.10'],
  arb: ['I10', 'I50.9', 'E11.69'],
  angiotensin: ['I10', 'I50.9'],
  'calcium channel blocker': ['I10', 'I20.9'],
  'calcium blocker': ['I10', 'I20.9'],
  diuretic: ['I10', 'I50.9', 'R60.9'],
  thiazide: ['I10', 'I50.9'],
  'loop diuretic': ['I50.9', 'R60.9'],
  anticoagulant: ['I48.91', 'I26.99', 'I82.90', 'Z79.01'],
  antiplatelet: ['I25.10', 'I63.9', 'I20.9', 'Z79.02'],
  statin: ['E78.5', 'I25.10', 'E78.00'],
  'lipid lowering': ['E78.5', 'E78.00'],
  fibrate: ['E78.5', 'E78.2'],
  antiarrhythmic: ['I48.91', 'I49.9'],
  'heart failure': ['I50.9', 'I50.1'],
  cardiac: ['I51.9', 'I25.10'],

  // Diabetes & Endocrine
  diabetes: ['E11.9', 'E10.9', 'E11.65', 'E11.69'],
  insulin: ['E10.9', 'E11.9', 'E10.65', 'E11.65'],
  'insulin aspart': ['E10.9', 'E11.9', 'E10.65', 'E11.65'],
  'insulin glargine': ['E10.9', 'E11.9', 'E10.65', 'E11.65'],
  'human insulin': ['E10.9', 'E11.9', 'E10.65', 'E11.65'],
  'insulin lispro': ['E10.9', 'E11.9', 'E10.65', 'E11.65'],
  'insulin detemir': ['E10.9', 'E11.9', 'E10.65', 'E11.65'],
  antidiabetic: ['E11.9', 'E11.65'],
  metformin: ['E11.9', 'E11.65'],
  sulfonylurea: ['E11.9'],
  thyroid: ['E03.9', 'E05.90', 'E06.3'],
  levothyroxine: ['E03.9', 'E03.8'],
  hormone: ['E28.9', 'E29.9', 'N95.1'],

  // Pain & Inflammation
  analgesic: ['R52', 'M79.3', 'R51.9', 'M25.50'],
  nsaid: ['M79.3', 'M25.50', 'R52', 'M79.18'],
  paracetamol: ['R50.9', 'R51.9', 'R52'],
  acetaminophen: ['R50.9', 'R51.9', 'R52'],
  ibuprofen: ['R52', 'R51.9', 'M79.3'],
  aspirin: ['I25.10', 'I20.9', 'R51.9', 'I63.9'],
  opioid: ['R52', 'G89.29', 'G89.4'],
  tramadol: ['R52', 'M79.3', 'G89.29'],
  morphine: ['R52', 'G89.29'],

  // Antibiotics & Anti-infectives
  antibiotic: ['J02.9', 'J18.9', 'N39.0', 'L03.90'],
  amoxicillin: ['J02.9', 'J18.9', 'J01.90', 'N39.0'],
  azithromycin: ['J02.9', 'J18.9', 'J20.9'],
  ciprofloxacin: ['N39.0', 'J18.9', 'A09.9'],
  cephalosporin: ['J02.9', 'J18.9', 'N39.0'],
  penicillin: ['J02.9', 'J18.9', 'A46'],
  antiviral: ['B34.9', 'B00.9', 'B19.9'],
  antifungal: ['B37.9', 'B35.9', 'B49'],

  // Respiratory
  respiratory: ['J44.9', 'J45.909', 'J06.9', 'R05.9'],
  bronchodilator: ['J44.9', 'J45.909', 'J44.1'],
  inhaler: ['J45.909', 'J44.9'],
  corticosteroid: ['J45.909', 'L30.9', 'M05.9', 'J44.1'],
  antihistamine: ['J30.9', 'L50.9', 'R06.89'],
  cough: ['R05.9', 'J20.9', 'J40'],
  asthma: ['J45.909', 'J45.901'],
  copd: ['J44.9', 'J44.1'],

  // Gastrointestinal
  gastrointestinal: ['K21.9', 'K59.00', 'K30', 'A09.9'],
  antacid: ['K21.9', 'K30', 'K25.9'],
  ppi: ['K21.9', 'K25.9', 'K29.70'],
  'proton pump inhibitor': ['K21.9', 'K25.9', 'K29.70'],
  omeprazole: ['K21.9', 'K25.9', 'K29.70'],
  'h2 blocker': ['K21.9', 'K25.9'],
  laxative: ['K59.00', 'K59.09'],
  antidiarrheal: ['A09.9', 'K59.1'],
  antiemetic: ['R11.2', 'R11.10'],

  // Neurological & Psychiatric
  antidepressant: ['F32.9', 'F33.9', 'F41.9'],
  ssri: ['F32.9', 'F33.9', 'F41.1'],
  anxiolytic: ['F41.9', 'F41.1'],
  benzodiazepine: ['F41.9', 'G47.00', 'F10.239'],
  antipsychotic: ['F20.9', 'F31.9', 'F29'],
  anticonvulsant: ['G40.909', 'G40.419', 'R56.9'],
  epilepsy: ['G40.909', 'G40.419'],
  parkinson: ['G20', 'G21.9'],
  alzheimer: ['G30.9', 'F03.90'],
  migraine: ['G43.909', 'R51.9'],

  // Musculoskeletal
  'muscle relaxant': ['M62.830', 'M79.1', 'M25.50'],
  arthritis: ['M19.90', 'M06.9', 'M79.3'],
  osteoporosis: ['M81.0', 'M80.00XA'],
  gout: ['M10.9', 'M10.00'],

  // Dermatological
  topical: ['L30.9', 'L20.9', 'L50.9'],
  dermatological: ['L30.9', 'L20.9', 'L98.9'],
  eczema: ['L30.9', 'L20.9'],
  psoriasis: ['L40.9', 'L40.0'],
  acne: ['L70.0', 'L70.9'],

  // Ophthalmological
  ophthalmic: ['H10.9', 'H57.9', 'H40.9'],
  'eye drop': ['H10.9', 'H57.9', 'H57.1'],
  glaucoma: ['H40.9', 'H40.11X0'],

  // Vitamins & Supplements
  vitamin: ['E56.9', 'E55.9', 'D53.9'],
  'vitamin d': ['E55.9', 'M81.0'],
  'vitamin b': ['E53.8', 'E53.9', 'D51.9'],
  calcium: ['E58', 'M81.0'],
  iron: ['D50.9', 'D50.0'],
  'folic acid': ['D52.9', 'O99.019'],

  // Hematological
  anemia: ['D50.9', 'D64.9', 'D51.9'],
  anticoagulation: ['I48.91', 'I26.99', 'Z79.01'],

  // Urological
  urological: ['N39.0', 'N40.0', 'N32.81'],
  uti: ['N39.0', 'N30.00'],
  bph: ['N40.0', 'N40.1'],

  // Gynecological
  contraceptive: ['Z30.9', 'Z30.011'],
  'hormone replacement': ['N95.1', 'E28.39'],

  // Oncology
  chemotherapy: ['C80.1', 'Z51.11'],
  cancer: ['C80.1', 'C79.9'],

  // Allergy & Immunology
  allergy: ['J30.9', 'L50.9', 'T78.40XA'],
  immunosuppressant: ['M05.9', 'K50.90', 'L40.0'],

  // MEGA EXPANSION - 150+ additional therapeutic keywords
  // More specific cardiovascular terms
  hypertension: ['I10', 'I15.9'],
  hypotension: ['I95.9'],
  tachycardia: ['R00.0', 'I47.1'],
  bradycardia: ['R00.1', 'I49.5'],
  atrial: ['I48.91', 'I48.0'],
  ventricular: ['I47.2', 'I49.3'],
  'angiotensin receptor blocker': ['I10', 'I50.9'],
  renin: ['I10'],
  aldosterone: ['I10', 'I50.9'],
  'potassium-sparing': ['I50.9', 'I10'],
  vasopressor: ['R57.9', 'I95.9'],
  inotrope: ['I50.9', 'R57.0'],
  chronotropic: ['I49.5', 'I50.9'],
  antihyperlipidemic: ['E78.5'],
  'hmg-coa': ['E78.5'],
  pcsk9: ['E78.5'],
  'cholesterol absorption': ['E78.5'],
  triglyceride: ['E78.2', 'E78.5'],
  hdl: ['E78.6'],
  ldl: ['E78.00'],
  apolipoprotein: ['E78.5'],
  thrombolytic: ['I26.99', 'I63.3'],
  fibrinolytic: ['I26.99', 'I63.3'],
  'factor xa': ['I48.91', 'I26.99'],
  'direct thrombin': ['I48.91', 'I26.99'],
  'vitamin k antagonist': ['I48.91', 'Z79.01'],
  glycoprotein: ['I25.10', 'I63.9'],
  'adenosine diphosphate': ['I25.10', 'Z79.02'],
  phosphodiesterase: ['I27.20', 'N52.9'],
  endothelin: ['I27.20'],
  prostacyclin: ['I27.20'],
  'soluble guanylate': ['I27.20'],

  // More diabetes terms
  hyperglycemia: ['E11.65', 'R73.9'],
  hypoglycemia: ['E16.2', 'E11.649'],
  glycemic: ['E11.9', 'E10.9'],
  glucagon: ['E16.2'],
  incretin: ['E11.9'],
  'glp-1': ['E11.9', 'E66.9'],
  glp1: ['E11.9', 'E66.9'],
  'dpp-4': ['E11.9'],
  dpp4: ['E11.9'],
  'sglt-2': ['E11.9', 'E11.65'],
  sglt2: ['E11.9', 'E11.65'],
  'sodium glucose': ['E11.9', 'E11.65'],
  biguanide: ['E11.9'],
  thiazolidinedione: ['E11.9'],
  tzd: ['E11.9'],
  glitazone: ['E11.9'],
  meglitinide: ['E11.9'],
  'alpha-glucosidase': ['E11.9'],
  acarbose: ['E11.9'],
  pramlintide: ['E10.9', 'E11.9'],
  amylin: ['E10.9', 'E11.9'],

  // More antibiotic terms
  'beta-lactam': ['J02.9', 'J18.9'],
  'beta lactam': ['J02.9', 'J18.9'],
  aminopenicillin: ['J02.9', 'J18.9'],
  carboxypenicillin: ['J18.9', 'A41.9'],
  ureidopenicillin: ['J18.9', 'A41.9'],
  'beta-lactamase': ['J02.9', 'J18.9'],
  clavulanic: ['J02.9', 'J18.9'],
  sulbactam: ['J18.9', 'A41.9'],
  tazobactam: ['J18.9', 'A41.9'],
  'first generation cephalosporin': ['J02.9', 'N39.0'],
  'second generation cephalosporin': ['J02.9', 'J18.9'],
  'third generation cephalosporin': ['J18.9', 'A41.9'],
  'fourth generation cephalosporin': ['J18.9', 'A41.9'],
  'fifth generation cephalosporin': ['J18.9', 'A41.9'],
  carbapenem: ['J18.9', 'A41.9'],
  monobactam: ['J18.9', 'A41.9'],
  aminoglycoside: ['A41.9', 'J18.9', 'N39.0'],
  glycopeptide: ['A41.9', 'L03.90'],
  lipopeptide: ['A41.9', 'L03.90'],
  oxazolidinone: ['A41.9', 'J18.9'],
  streptogramin: ['A41.9'],
  ketolide: ['J18.9', 'J02.9'],
  quinolone: ['N39.0', 'J18.9'],
  fluoroquinolone: ['N39.0', 'J18.9'],
  tetracycline: ['J02.9', 'L70.0'],
  glycylcycline: ['J18.9', 'A41.9'],
  nitroimidazole: ['A07.8', 'A06.0'],
  sulfonamide: ['N39.0', 'J18.9'],
  'folate synthesis': ['N39.0', 'J18.9'],
  polymyxin: ['J18.9', 'A41.9'],

  // More respiratory terms
  bronchospasm: ['J45.909', 'J44.1'],
  wheezing: ['R06.2', 'J45.909'],
  dyspnea: ['R06.00', 'R06.02'],
  'shortness of breath': ['R06.02'],
  'beta2-agonist': ['J45.909', 'J44.1'],
  'beta2 agonist': ['J45.909', 'J44.1'],
  'short-acting': ['J45.909', 'J44.1'],
  'long-acting': ['J45.909', 'J44.1'],
  saba: ['J45.909', 'J44.1'],
  laba: ['J45.909', 'J44.1'],
  lama: ['J44.9', 'J44.1'],
  sama: ['J45.909', 'J44.1'],
  muscarinic: ['J44.9', 'N32.81'],
  methylxanthine: ['J45.909', 'J44.9'],
  'leukotriene receptor': ['J45.909', 'J30.9'],
  'leukotriene modifier': ['J45.909'],
  '5-lipoxygenase': ['J45.909'],
  'mast cell stabilizer': ['J45.909', 'J30.9'],
  cromone: ['J45.909', 'J30.9'],
  'ige inhibitor': ['J45.909'],
  'il-5 inhibitor': ['J45.909'],
  'il-4 receptor': ['J45.909'],
  nasal: ['J30.9', 'J01.90'],
  rhinitis: ['J30.9', 'J31.0'],
  sinusitis: ['J01.90', 'J32.9'],
  pharyngitis: ['J02.9'],
  laryngitis: ['J04.0'],
  tracheitis: ['J04.10'],
  bronchitis: ['J20.9', 'J40'],
  pneumonia: ['J18.9', 'J15.9'],
  expectorant: ['R05.9'],
  mucolytic: ['R05.9', 'J44.1'],
  antitussive: ['R05.9'],
  decongestant: ['J30.9', 'J01.90'],
  'nasal decongestant': ['J30.9', 'R09.81'],

  // More GI terms
  gastroprotective: ['K21.9', 'K25.9'],
  'acid suppression': ['K21.9', 'K25.9'],
  'acid reducer': ['K21.9', 'K25.9'],
  gastritis: ['K29.70', 'K29.60'],
  esophagitis: ['K20.9', 'K21.9'],
  reflux: ['K21.9'],
  gerd: ['K21.9'],
  dyspepsia: ['K30'],
  peptic: ['K25.9', 'K27.9'],
  duodenal: ['K26.9'],
  'gastric ulcer': ['K25.9'],
  helicobacter: ['K27.9', 'B96.81'],
  'h pylori': ['K27.9', 'B96.81'],
  'h. pylori': ['K27.9', 'B96.81'],
  prokinetic: ['R11.2', 'K30'],
  motility: ['K30', 'K59.00'],
  gastroparesis: ['K31.84'],
  nausea: ['R11.2', 'R11.0'],
  vomiting: ['R11.10', 'R11.2'],
  emesis: ['R11.10'],
  antivertigo: ['R42', 'H81.9'],
  vertigo: ['R42', 'H81.9'],
  'motion sickness': ['T75.3XXA'],
  diarrhea: ['A09.9', 'K59.1'],
  'loose stool': ['K59.1'],
  constipation: ['K59.00', 'K59.09'],
  bowel: ['K59.00', 'K58.9'],
  'stool softener': ['K59.00'],
  'bulk-forming': ['K59.00'],
  'osmotic laxative': ['K59.00'],
  'stimulant laxative': ['K59.00'],
  ibs: ['K58.9'],
  'irritable bowel syndrome': ['K58.9'],
  ibd: ['K50.90', 'K51.90'],
  'inflammatory bowel disease': ['K50.90', 'K51.90'],
  crohn: ['K50.90'],
  'crohn disease': ['K50.90'],
  ulcerative: ['K51.90'],
  colitis: ['K52.9', 'K51.90'],
  '5-aminosalicylic': ['K50.90', 'K51.90'],
  mesalazine: ['K50.90', 'K51.90'],
  'bile acid': ['K76.0', 'K90.89'],
  'pancreatic enzyme': ['K86.89', 'K90.3'],
  'digestive enzyme': ['K86.89', 'K90.3'],
  hepatoprotective: ['K76.9'],
  'liver protective': ['K76.9'],
  cholagogue: ['K80.20'],
  choleretic: ['K80.20'],

  // More pain terms
  analgesia: ['R52'],
  'pain relief': ['R52', 'M79.3'],
  antipyretic: ['R50.9'],
  'fever reducer': ['R50.9'],
  'anti-inflammatory': ['M79.3', 'M25.50'],
  'cox-2': ['M19.90', 'M79.3'],
  'cox-1': ['M79.3', 'M25.50'],
  cyclooxygenase: ['M79.3', 'M25.50'],
  'prostaglandin synthesis': ['M79.3'],
  narcotic: ['R52', 'G89.29'],
  opiate: ['R52', 'G89.29'],
  'mu-opioid': ['R52', 'G89.29'],
  'kappa-opioid': ['R52'],
  'opioid agonist': ['R52', 'G89.29'],
  'opioid antagonist': ['T40.2X1A', 'F11.20'],
  'partial agonist': ['R52', 'F11.20'],
  'mixed agonist': ['R52'],
  'centrally acting': ['R52', 'M79.3'],
  neuropathic: ['G89.29', 'M79.2'],
  neuropathy: ['G62.9', 'E11.40'],
  neuralgia: ['M79.2'],
  nociceptive: ['R52'],

  // More psychiatric terms
  depression: ['F32.9', 'F33.9'],
  'major depressive': ['F32.9', 'F33.9'],
  anxiety: ['F41.9', 'F41.1'],
  'generalized anxiety': ['F41.1'],
  panic: ['F41.0'],
  'social anxiety': ['F40.10'],
  phobia: ['F40.9'],
  obsessive: ['F42.9'],
  ocd: ['F42.9'],
  ptsd: ['F43.10'],
  'post-traumatic': ['F43.10'],
  bipolar: ['F31.9'],
  mania: ['F31.9', 'F30.9'],
  schizophrenia: ['F20.9'],
  psychosis: ['F29'],
  psychotic: ['F29'],
  'mood stabilizer': ['F31.9'],
  antimanic: ['F31.9', 'F30.9'],
  'typical antipsychotic': ['F20.9'],
  'atypical antipsychotic': ['F20.9', 'F31.9'],
  'first generation antipsychotic': ['F20.9'],
  'second generation antipsychotic': ['F20.9', 'F31.9'],
  'dopamine antagonist': ['F20.9', 'R11.2'],
  'serotonin reuptake': ['F32.9', 'F41.9'],
  'norepinephrine reuptake': ['F32.9', 'F41.9'],
  'serotonin norepinephrine': ['F32.9', 'F41.9'],
  snri: ['F32.9', 'F41.9'],
  tricyclic: ['F32.9', 'G89.29'],
  tca: ['F32.9', 'G89.29'],
  tetracyclic: ['F32.9'],
  maoi: ['F32.9'],
  'monoamine oxidase': ['F32.9'],
  mirtazapine: ['F32.9', 'F51.05'],
  trazodone: ['F32.9', 'G47.00'],
  'sedative-hypnotic': ['G47.00', 'F41.9'],
  hypnotic: ['G47.00'],
  'sleep aid': ['G47.00', 'F51.05'],
  insomnia: ['G47.00', 'F51.05'],
  'z-drug': ['G47.00'],
  'non-benzodiazepine': ['G47.00'],
  gaba: ['F41.9', 'G47.00'],
  'melatonin receptor': ['G47.00'],
  'orexin receptor': ['G47.00'],
  adhd: ['F90.9'],
  'attention deficit': ['F90.9'],
  hyperactivity: ['F90.9'],
  stimulant: ['F90.9', 'G47.419'],
  amphetamine: ['F90.9'],
  methylphenidate: ['F90.9'],
  'non-stimulant': ['F90.9'],
  narcolepsy: ['G47.419'],
  wakefulness: ['G47.419'],

  // More musculoskeletal
  osteoarthritis: ['M19.90'],
  'rheumatoid arthritis': ['M05.9', 'M06.9'],
  'inflammatory arthritis': ['M06.9', 'M05.9'],
  spondyloarthritis: ['M45.9'],
  ankylosing: ['M45.9'],
  'hyaluronic acid': ['M19.90', 'M25.50'],
  'sodium hyaluronate': ['M19.90', 'M25.50', 'H04.123'],
  hyaluronate: ['M19.90', 'M25.50'],
  viscosupplementation: ['M19.90'],
  'joint injection': ['M19.90', 'M25.50'],
  dmard: ['M05.9', 'L40.0'],
  'disease-modifying': ['M05.9', 'L40.0'],
  biologic: ['M05.9', 'L40.0', 'K50.90'],
  'tnf inhibitor': ['M05.9', 'L40.0', 'K50.90'],
  'tnf-alpha': ['M05.9', 'L40.0'],
  'il-6': ['M05.9', 'M06.9'],
  'il-17': ['L40.0', 'M45.9'],
  'il-23': ['L40.0', 'K50.90'],
  'jak inhibitor': ['M05.9', 'K51.90'],
  'janus kinase': ['M05.9', 'L40.0'],
  spasm: ['M62.830', 'M79.1'],
  spasticity: ['G80.9', 'G82.50'],
  'skeletal muscle relaxant': ['M62.830', 'M79.1'],
  antispasmodic: ['K58.9', 'R10.4'],
  'smooth muscle': ['K58.9', 'N32.81'],
  'bone resorption': ['M81.0', 'C79.51'],
  'bone density': ['M81.0', 'M85.80'],
  osteopenia: ['M85.80'],
  'paget disease': ['M88.9'],
  hyperparathyroidism: ['E21.0', 'E21.3'],
  hypercalcemia: ['E83.52'],
  hypocalcemia: ['E83.51'],
};

// Generic name to ICD-10 specific mappings
const GENERIC_SPECIFIC_MAPPINGS = {
  // Common drugs with specific indications
  amlodipine: ['I10', 'I20.9'],
  atorvastatin: ['E78.5', 'I25.10'],
  simvastatin: ['E78.5', 'E78.00'],
  warfarin: ['I48.91', 'Z79.01', 'I26.99'],
  rivaroxaban: ['I48.91', 'I26.99', 'I82.90'],
  clopidogrel: ['I25.10', 'I63.9', 'Z79.02'],
  ramipril: ['I10', 'I50.9'],
  enalapril: ['I10', 'I50.9'],
  losartan: ['I10', 'E11.69'],
  metoprolol: ['I10', 'I25.10', 'I48.91'],
  bisoprolol: ['I50.9', 'I10'],
  furosemide: ['I50.9', 'R60.9'],
  spironolactone: ['I50.9', 'I10'],

  gliclazide: ['E11.9'],
  sitagliptin: ['E11.9'],
  empagliflozin: ['E11.9', 'E11.65'],

  pregabalin: ['G89.29', 'F41.9', 'G40.909'],
  gabapentin: ['G89.29', 'G40.909'],
  duloxetine: ['F32.9', 'G89.29'],
  sertraline: ['F32.9', 'F41.9'],
  escitalopram: ['F32.9', 'F41.1'],
  fluoxetine: ['F32.9', 'F33.9'],
  alprazolam: ['F41.9', 'F41.1'],
  lorazepam: ['F41.9', 'G47.00'],
  diazepam: ['F41.9', 'M62.830'],

  salbutamol: ['J45.909', 'J44.1'],
  budesonide: ['J45.909', 'J44.1', 'K50.90'],
  montelukast: ['J45.909', 'J30.9'],
  'montelukast sodium': ['J45.909', 'J30.9'],
  cetirizine: ['J30.9', 'L50.9'],
  loratadine: ['J30.9', 'L50.9'],

  pantoprazole: ['K21.9', 'K25.9'],
  'pantoprazole sodium': ['K21.9', 'K25.9'],
  esomeprazole: ['K21.9', 'K25.9'],
  lansoprazole: ['K21.9', 'K25.9'],
  ranitidine: ['K21.9', 'K25.9'],
  metoclopramide: ['R11.2', 'K30'],
  ondansetron: ['R11.2', 'R11.10'],

  paracetamol: ['R50.9', 'R51.9', 'R52'],
  ibuprofen: ['R52', 'M79.3', 'R51.9'],
  diclofenac: ['M79.3', 'M25.50', 'M79.18'],
  'diclofenac sodium': ['M79.3', 'M25.50', 'M79.18'],
  naproxen: ['M79.3', 'M25.50'],
  celecoxib: ['M19.90', 'M79.3'],

  'amoxicillin+clavulanate': ['J02.9', 'J18.9', 'N39.0', 'L03.90'],
  'co-amoxiclav': ['J02.9', 'J18.9', 'N39.0', 'L03.90'],
  amoxicillin: ['J02.9', 'J18.9', 'N39.0'],
  'amoxicillin trihydrate': ['J02.9', 'J18.9', 'N39.0'],
  azithromycin: ['J02.9', 'J18.9', 'J20.9'],
  'azithromycin dihydrate': ['J02.9', 'J18.9', 'J20.9'],
  levetiracetam: ['G40.909', 'G40.301', 'G40.A01'],
  tadalafil: ['N52.9', 'I27.20', 'N40.1'],
  sildenafil: ['N52.9', 'I27.20'],
  'sildenafil citrate': ['N52.9', 'I27.20'],
  levofloxacin: ['N39.0', 'J18.9'],
  moxifloxacin: ['J18.9', 'J01.90'],
  ceftriaxone: ['J18.9', 'N39.0', 'A41.9'],
  'ceftriaxone sodium': ['J18.9', 'N39.0', 'A41.9'],
  cefixime: ['J02.9', 'N39.0'],

  levothyroxine: ['E03.9', 'E03.8'],
  thyroxine: ['E03.9', 'E03.8'],

  cholecalciferol: ['E55.9', 'M81.0'],
  'vitamin d3': ['E55.9', 'M81.0'],
  ergocalciferol: ['E55.9'],
  'ferrous sulfate': ['D50.9', 'D50.0'],
  'calcium carbonate': ['E58', 'M81.0'],
  'folic acid': ['D52.9', 'O99.019'],

  'sodium chloride': ['E87.1', 'E86.0', 'J34.89'],
  'normal saline': ['E87.1', 'E86.0'],
  saline: ['E87.1', 'E86.0', 'J34.89'],

  tamsulosin: ['N40.0', 'N32.81'],
  finasteride: ['N40.0', 'L64.9'],

  metformin: ['E11.9', 'E11.65'],
  'metformin hydrochloride': ['E11.9', 'E11.65'],

  // Vertigo / Meniere's disease / Dizziness
  betahistine: ['R42', 'H81.09', 'H81.10'],
  'betahistine dihydrochloride': ['R42', 'H81.09', 'H81.10'],

  // Erectile dysfunction / Pulmonary hypertension
  vardenafil: ['N52.9', 'I27.20'],
  'vardenafil hydrochloride': ['N52.9', 'I27.20'],

  // Liver / Gallstones
  'ursodeoxycholic acid': ['K76.0', 'K80.20', 'K83.01'],
  ursodiol: ['K76.0', 'K80.20'],

  hydrocortisone: ['L30.9', 'E27.40'],
  betamethasone: ['L30.9', 'L20.9'],
  mometasone: ['J30.9', 'L30.9'],
  latanoprost: ['H40.11X0', 'H40.9'],
  timolol: ['H40.11X0', 'H40.9'],

  // MASSIVE EXPANSION - Additional 200+ common drugs
  // More Cardiovascular
  carvedilol: ['I50.9', 'I10'],
  nebivolol: ['I10', 'I50.9'],
  atenolol: ['I10', 'I20.9', 'I48.91'],
  propranolol: ['I10', 'I20.9', 'G43.909'],
  diltiazem: ['I10', 'I20.9', 'I48.91'],
  verapamil: ['I10', 'I20.9', 'I48.91'],
  nifedipine: ['I10', 'I20.9'],
  felodipine: ['I10'],
  lisinopril: ['I10', 'I50.9'],
  perindopril: ['I10', 'I50.9'],
  captopril: ['I10', 'I50.9'],
  telmisartan: ['I10', 'E11.69'],
  valsartan: ['I10', 'I50.9'],
  candesartan: ['I10', 'I50.9'],
  irbesartan: ['I10', 'E11.69'],
  olmesartan: ['I10'],
  hydrochlorothiazide: ['I10', 'I50.9'],
  indapamide: ['I10'],
  chlorthalidone: ['I10'],
  amiloride: ['I50.9', 'I10'],
  eplerenone: ['I50.9', 'I10'],
  torsemide: ['I50.9', 'R60.9'],
  bumetanide: ['I50.9', 'R60.9'],
  rosuvastatin: ['E78.5', 'I25.10'],
  pravastatin: ['E78.5', 'I25.10'],
  fluvastatin: ['E78.5'],
  ezetimibe: ['E78.5', 'E78.00'],
  fenofibrate: ['E78.5', 'E78.2'],
  gemfibrozil: ['E78.5', 'E78.2'],
  apixaban: ['I48.91', 'I26.99', 'I82.90'],
  dabigatran: ['I48.91', 'I26.99'],
  edoxaban: ['I48.91', 'I26.99'],
  enoxaparin: ['I26.99', 'I82.90', 'Z79.01'],
  heparin: ['I26.99', 'I82.90'],
  ticagrelor: ['I25.10', 'I63.9'],
  prasugrel: ['I25.10', 'I63.9'],
  dipyridamole: ['I63.9', 'Z79.02'],
  amiodarone: ['I48.91', 'I49.9'],
  sotalol: ['I48.91', 'I49.9'],
  flecainide: ['I48.91'],
  digoxin: ['I50.9', 'I48.91'],
  ivabradine: ['I50.9', 'I20.9'],
  isosorbide: ['I20.9', 'I50.9'],
  nitroglycerin: ['I20.9'],
  'glyceryl trinitrate': ['I20.9'],

  // More Diabetes medications
  glipizide: ['E11.9'],
  glibenclamide: ['E11.9'],
  glyburide: ['E11.9'],
  pioglitazone: ['E11.9'],
  rosiglitazone: ['E11.9'],
  liraglutide: ['E11.9', 'E66.9'],
  semaglutide: ['E11.9', 'E66.9'],
  dulaglutide: ['E11.9'],
  exenatide: ['E11.9'],
  dapagliflozin: ['E11.9', 'E11.65'],
  canagliflozin: ['E11.9', 'E11.65'],
  saxagliptin: ['E11.9'],
  linagliptin: ['E11.9'],
  vildagliptin: ['E11.9'],
  alogliptin: ['E11.9'],
  repaglinide: ['E11.9'],
  nateglinide: ['E11.9'],
  acarbose: ['E11.9'],
  miglitol: ['E11.9'],

  // More Antibiotics
  doxycycline: ['J02.9', 'L70.0', 'A77.9'],
  tetracycline: ['J02.9', 'L70.0'],
  minocycline: ['L70.0', 'J02.9'],
  clindamycin: ['J02.9', 'L70.0', 'L03.90'],
  erythromycin: ['J02.9', 'J18.9'],
  clarithromycin: ['J02.9', 'J18.9', 'K27.9'],
  roxithromycin: ['J02.9', 'J18.9'],
  metronidazole: ['A07.8', 'A06.0', 'B37.9'],
  tinidazole: ['A07.8', 'A06.0'],
  norfloxacin: ['N39.0', 'A09.9'],
  gatifloxacin: ['N39.0', 'J18.9'],
  cefuroxime: ['J02.9', 'J18.9', 'N39.0'],
  cefotaxime: ['J18.9', 'A41.9'],
  ceftazidime: ['J18.9', 'A41.9'],
  cefepime: ['J18.9', 'A41.9'],
  cefpodoxime: ['J02.9', 'N39.0'],
  cefdinir: ['J02.9', 'J18.9'],
  cephalexin: ['J02.9', 'N39.0', 'L03.90'],
  ampicillin: ['J02.9', 'J18.9', 'N39.0'],
  piperacillin: ['J18.9', 'A41.9'],
  tazobactam: ['J18.9', 'A41.9'],
  meropenem: ['J18.9', 'A41.9'],
  imipenem: ['J18.9', 'A41.9'],
  ertapenem: ['J18.9', 'A41.9'],
  vancomycin: ['A41.9', 'L03.90'],
  linezolid: ['A41.9', 'J18.9'],
  gentamicin: ['A41.9', 'N39.0'],
  tobramycin: ['A41.9', 'J18.9'],
  amikacin: ['A41.9', 'J18.9'],
  nitrofurantoin: ['N39.0', 'N30.00'],
  fosfomycin: ['N39.0'],
  trimethoprim: ['N39.0', 'J18.9'],
  sulfamethoxazole: ['N39.0', 'J18.9'],
  cotrimoxazole: ['N39.0', 'J18.9'],

  // Antifungals
  fluconazole: ['B37.9', 'B35.9'],
  itraconazole: ['B37.9', 'B35.9'],
  voriconazole: ['B37.9'],
  terbinafine: ['B35.9', 'B35.1'],
  griseofulvin: ['B35.9'],
  nystatin: ['B37.9', 'B37.0'],
  clotrimazole: ['B37.9', 'B35.9'],
  miconazole: ['B37.9', 'B35.9'],
  ketoconazole: ['B37.9', 'B35.9', 'L21.9'],

  // More Respiratory
  albuterol: ['J45.909', 'J44.1'],
  terbutaline: ['J45.909', 'J44.1'],
  formoterol: ['J45.909', 'J44.1'],
  salmeterol: ['J45.909', 'J44.1'],
  vilanterol: ['J45.909', 'J44.1'],
  tiotropium: ['J44.9', 'J44.1'],
  ipratropium: ['J45.909', 'J44.1'],
  glycopyrronium: ['J44.9'],
  umeclidinium: ['J44.9'],
  fluticasone: ['J45.909', 'J44.1', 'J30.9'],
  beclomethasone: ['J45.909', 'J30.9'],
  ciclesonide: ['J45.909'],
  'mometasone furoate': ['J30.9', 'L30.9'],
  theophylline: ['J45.909', 'J44.9'],
  aminophylline: ['J45.909', 'J44.9'],
  doxofylline: ['J45.909', 'J44.9'],
  zafirlukast: ['J45.909'],
  pranlukast: ['J45.909'],
  roflumilast: ['J44.9'],
  fexofenadine: ['J30.9', 'L50.9'],
  desloratadine: ['J30.9', 'L50.9'],
  levocetirizine: ['J30.9', 'L50.9'],
  chlorpheniramine: ['J30.9', 'L50.9'],
  diphenhydramine: ['J30.9', 'L50.9', 'G47.00'],
  promethazine: ['R11.2', 'J30.9'],
  dextromethorphan: ['R05.9'],
  codeine: ['R05.9', 'R52'],
  guaifenesin: ['R05.9'],
  ambroxol: ['R05.9', 'J20.9'],
  bromhexine: ['R05.9'],
  acetylcysteine: ['R05.9', 'J44.1'],
  carbocisteine: ['R05.9'],

  // More GI medications
  famotidine: ['K21.9', 'K25.9'],
  cimetidine: ['K21.9', 'K25.9'],
  nizatidine: ['K21.9', 'K25.9'],
  rabeprazole: ['K21.9', 'K25.9'],
  dexlansoprazole: ['K21.9', 'K25.9'],
  sucralfate: ['K25.9', 'K21.9'],
  bismuth: ['K29.70', 'A09.9'],
  'magnesium hydroxide': ['K21.9', 'K59.00'],
  'aluminum hydroxide': ['K21.9', 'K30'],
  'sodium alginate': ['K21.9'],
  domperidone: ['R11.2', 'K30'],
  itopride: ['R11.2', 'K30'],
  mosapride: ['K30', 'K59.00'],
  prucalopride: ['K59.00'],
  granisetron: ['R11.2'],
  palonosetron: ['R11.2'],
  dolasetron: ['R11.2'],
  dronabinol: ['R11.2'],
  aprepitant: ['R11.2'],
  loperamide: ['A09.9', 'K59.1'],
  diphenoxylate: ['A09.9'],
  racecadotril: ['A09.9'],
  octreotide: ['A09.9', 'K31.89'],
  lactulose: ['K59.00'],
  'polyethylene glycol': ['K59.00'],
  bisacodyl: ['K59.00'],
  senna: ['K59.00'],
  docusate: ['K59.00'],
  psyllium: ['K59.00', 'E78.5'],
  methylcellulose: ['K59.00'],
  mesalamine: ['K50.90', 'K51.90'],
  sulfasalazine: ['K50.90', 'K51.90', 'M05.9'],
  balsalazide: ['K51.90'],
  olsalazine: ['K51.90'],

  // More Pain medications
  indomethacin: ['M79.3', 'M25.50', 'M10.9'],
  ketorolac: ['R52', 'M79.3'],
  meloxicam: ['M19.90', 'M79.3'],
  piroxicam: ['M79.3', 'M25.50'],
  etodolac: ['M19.90', 'M79.3'],
  fenoprofen: ['M79.3', 'R52'],
  flurbiprofen: ['M79.3', 'R52'],
  ketoprofen: ['M79.3', 'M25.50'],
  'mefenamic acid': ['R52', 'N94.6'],
  etoricoxib: ['M19.90', 'M79.3', 'M10.9'],
  parecoxib: ['R52', 'M79.3'],
  valdecoxib: ['M19.90', 'M79.3'],
  oxycodone: ['R52', 'G89.29'],
  hydrocodone: ['R52', 'R05.9'],
  hydromorphone: ['R52', 'G89.29'],
  fentanyl: ['R52', 'G89.29'],
  methadone: ['R52', 'F11.20'],
  buprenorphine: ['R52', 'F11.20'],
  naloxone: ['T40.2X1A', 'F11.20'],
  naltrexone: ['F10.20', 'F11.20'],
  tapentadol: ['R52', 'G89.29'],

  // More Psychiatric medications
  venlafaxine: ['F32.9', 'F41.9'],
  desvenlafaxine: ['F32.9', 'F41.9'],
  mirtazapine: ['F32.9', 'F51.05'],
  trazodone: ['F32.9', 'G47.00'],
  bupropion: ['F32.9', 'F17.200'],
  amitriptyline: ['F32.9', 'G43.909', 'G89.29'],
  nortriptyline: ['F32.9', 'G89.29'],
  imipramine: ['F32.9', 'F98.0'],
  clomipramine: ['F42.9', 'F32.9'],
  doxepin: ['F32.9', 'G47.00'],
  paroxetine: ['F32.9', 'F41.9'],
  citalopram: ['F32.9', 'F41.9'],
  fluvoxamine: ['F42.9', 'F32.9'],
  vortioxetine: ['F32.9'],
  vilazodone: ['F32.9'],
  agomelatine: ['F32.9'],
  buspirone: ['F41.9'],
  clonazepam: ['G40.909', 'F41.9'],
  oxazepam: ['F41.9'],
  temazepam: ['G47.00'],
  triazolam: ['G47.00'],
  zolpidem: ['G47.00'],
  zopiclone: ['G47.00'],
  eszopiclone: ['G47.00'],
  zaleplon: ['G47.00'],
  ramelteon: ['G47.00'],
  suvorexant: ['G47.00'],
  quetiapine: ['F20.9', 'F31.9', 'F32.9'],
  olanzapine: ['F20.9', 'F31.9'],
  risperidone: ['F20.9', 'F31.9'],
  aripiprazole: ['F20.9', 'F31.9'],
  paliperidone: ['F20.9'],
  ziprasidone: ['F20.9', 'F31.9'],
  asenapine: ['F20.9', 'F31.9'],
  lurasidone: ['F20.9', 'F31.9'],
  cariprazine: ['F20.9', 'F31.9'],
  brexpiprazole: ['F20.9', 'F32.9'],
  haloperidol: ['F20.9', 'F29'],
  chlorpromazine: ['F20.9', 'F29'],
  fluphenazine: ['F20.9'],
  perphenazine: ['F20.9'],
  lithium: ['F31.9'],
  valproate: ['G40.909', 'F31.9', 'G43.909'],
  carbamazepine: ['G40.909', 'F31.9', 'G50.0'],
  lamotrigine: ['G40.909', 'F31.9'],
  phenytoin: ['G40.909'],
  phenobarbital: ['G40.909'],
  topiramate: ['G40.909', 'G43.909', 'E66.9'],
  zonisamide: ['G40.909'],
  oxcarbazepine: ['G40.909', 'G50.0'],
  ethosuximide: ['G40.A09'],
  lacosamide: ['G40.909'],
  perampanel: ['G40.909'],
  brivaracetam: ['G40.909'],
  methylphenidate: ['F90.9', 'G47.419'],
  atomoxetine: ['F90.9'],
  lisdexamfetamine: ['F90.9'],
  amphetamine: ['F90.9'],
  dextroamphetamine: ['F90.9'],
  modafinil: ['G47.419'],
  armodafinil: ['G47.419'],
  memantine: ['G30.9', 'F03.90'],
  donepezil: ['G30.9', 'F03.90'],
  rivastigmine: ['G30.9', 'F03.90'],
  galantamine: ['G30.9', 'F03.90'],

  // More Hormones & Endocrine
  prednisone: ['M05.9', 'J45.909', 'L30.9'],
  prednisolone: ['M05.9', 'J45.909', 'L30.9'],
  methylprednisolone: ['M05.9', 'J45.909'],
  dexamethasone: ['R11.2', 'M05.9', 'H10.9'],
  triamcinolone: ['M19.90', 'L30.9', 'J30.9'],
  fludrocortisone: ['E27.40'],
  testosterone: ['E29.1', 'E28.310'],
  estradiol: ['N95.1', 'E28.39'],
  estrogen: ['N95.1', 'N91.0'],
  progesterone: ['N91.0', 'N97.9'],
  medroxyprogesterone: ['N92.0', 'N91.0'],
  norethindrone: ['Z30.9', 'N92.0'],
  'ethinyl estradiol': ['Z30.9'],
  drospirenone: ['Z30.9'],
  desogestrel: ['Z30.9'],
  levonorgestrel: ['Z30.9', 'Z30.018'],
  ulipristal: ['Z30.09'],
  mifepristone: ['O04.9'],
  misoprostol: ['O04.9', 'K25.9'],
  oxytocin: ['O75.9'],
  dinoprostone: ['O61.0'],
  methylergometrine: ['O72.1'],
  cabergoline: ['E22.1', 'O92.6'],
  bromocriptine: ['E22.1', 'G20'],
  clomiphene: ['N97.9', 'E28.2'],
  letrozole: ['C50.919', 'N97.9'],
  anastrozole: ['C50.919'],
  exemestane: ['C50.919'],
  tamoxifen: ['C50.919', 'N97.9'],
  raloxifene: ['M81.0', 'C50.919'],
  alendronate: ['M81.0', 'M80.00XA'],
  risedronate: ['M81.0', 'M80.00XA'],
  ibandronate: ['M81.0', 'M80.00XA'],
  'zoledronic acid': ['M81.0', 'C79.51'],
  denosumab: ['M81.0', 'C79.51'],
  teriparatide: ['M81.0'],
  calcitonin: ['M81.0', 'M88.9'],

  // More common drugs
  allopurinol: ['M10.9', 'M10.00'],
  colchicine: ['M10.9', 'M35.2'],
  probenecid: ['M10.9'],
  febuxostat: ['M10.9'],
  lesinurad: ['M10.9'],
  baclofen: ['M62.830', 'G80.9'],
  tizanidine: ['M62.830', 'M79.1'],
  cyclobenzaprine: ['M62.830', 'M79.1'],
  methocarbamol: ['M62.830'],
  carisoprodol: ['M62.830'],
  orphenadrine: ['M62.830'],
  dantrolene: ['M62.830', 'T88.3XXA'],
  hydroxychloroquine: ['M05.9', 'M32.10'],
  chloroquine: ['B54', 'M32.10'],
  methotrexate: ['M05.9', 'L40.0', 'C91.00'],
  azathioprine: ['M05.9', 'K50.90', 'D59.1'],
  mycophenolate: ['T86.10', 'M32.10'],
  cyclosporine: ['T86.10', 'L40.0'],
  tacrolimus: ['T86.10', 'L30.9'],
  sirolimus: ['T86.10'],
  everolimus: ['T86.10', 'C25.4'],
  adalimumab: ['M05.9', 'L40.0', 'K50.90'],
  etanercept: ['M05.9', 'L40.0'],
  infliximab: ['M05.9', 'K50.90', 'K51.90'],
  rituximab: ['M05.9', 'C91.00'],
  tocilizumab: ['M05.9'],
  abatacept: ['M05.9'],
  tofacitinib: ['M05.9', 'K51.90'],
  baricitinib: ['M05.9'],
  upadacitinib: ['M05.9', 'L40.0'],
  secukinumab: ['L40.0'],
  ixekizumab: ['L40.0'],
  ustekinumab: ['L40.0', 'K50.90'],
  vedolizumab: ['K50.90', 'K51.90'],
  natalizumab: ['G35', 'K50.90'],

  // MASSIVE EXPANSION PART 2 - 400+ additional UAE drugs
  // Combination drugs (very common in UAE)
  'amoxicillin clavulanic acid': ['J02.9', 'J18.9', 'N39.0'],
  'amoxicillin clavulanate': ['J02.9', 'J18.9', 'N39.0'],
  augmentin: ['J02.9', 'J18.9', 'N39.0'],
  clavamox: ['J02.9', 'J18.9', 'N39.0'],
  'paracetamol ibuprofen': ['R52', 'R51.9', 'M79.3'],
  'acetaminophen ibuprofen': ['R52', 'R51.9', 'M79.3'],
  'paracetamol caffeine': ['R51.9', 'G43.909'],
  'paracetamol codeine': ['R52', 'R51.9'],
  'paracetamol tramadol': ['R52', 'M79.3'],
  'aspirin clopidogrel': ['I25.10', 'I63.9', 'Z79.02'],
  'aspirin dipyridamole': ['I63.9', 'Z79.02'],
  'atorvastatin amlodipine': ['E78.5', 'I10'],
  'atorvastatin ezetimibe': ['E78.5', 'E78.00'],
  'simvastatin ezetimibe': ['E78.5', 'E78.00'],
  'amlodipine valsartan': ['I10'],
  'amlodipine olmesartan': ['I10'],
  'amlodipine benazepril': ['I10'],
  'amlodipine perindopril': ['I10', 'I20.9'],
  'valsartan hydrochlorothiazide': ['I10'],
  'losartan hydrochlorothiazide': ['I10'],
  'telmisartan hydrochlorothiazide': ['I10', 'E11.69'],
  'irbesartan hydrochlorothiazide': ['I10', 'E11.69'],
  'olmesartan hydrochlorothiazide': ['I10'],
  'candesartan hydrochlorothiazide': ['I10', 'I50.9'],
  'enalapril hydrochlorothiazide': ['I10', 'I50.9'],
  'lisinopril hydrochlorothiazide': ['I10', 'I50.9'],
  'ramipril hydrochlorothiazide': ['I10', 'I50.9'],
  'perindopril indapamide': ['I10'],
  'bisoprolol hydrochlorothiazide': ['I50.9', 'I10'],
  'metoprolol hydrochlorothiazide': ['I10', 'I25.10'],
  'atenolol chlorthalidone': ['I10', 'I20.9'],
  'metformin sitagliptin': ['E11.9'],
  'metformin vildagliptin': ['E11.9'],
  'metformin saxagliptin': ['E11.9'],
  'metformin linagliptin': ['E11.9'],
  'metformin alogliptin': ['E11.9'],
  'metformin pioglitazone': ['E11.9'],
  'metformin glipizide': ['E11.9'],
  'metformin glyburide': ['E11.9'],
  'glimepiride metformin': ['E11.9'],
  'glimepiride pioglitazone': ['E11.9'],
  'empagliflozin metformin': ['E11.9', 'E11.65'],
  'empagliflozin linagliptin': ['E11.9', 'E11.65'],
  'dapagliflozin metformin': ['E11.9', 'E11.65'],
  'dapagliflozin saxagliptin': ['E11.9', 'E11.65'],
  'canagliflozin metformin': ['E11.9', 'E11.65'],
  'insulin glargine': ['E10.9', 'E11.9'],
  'insulin detemir': ['E10.9', 'E11.9'],
  'insulin aspart': ['E10.9', 'E11.9'],
  'insulin lispro': ['E10.9', 'E11.9'],
  'insulin degludec': ['E10.9', 'E11.9'],
  'insulin regular': ['E10.9', 'E11.9'],
  'insulin nph': ['E10.9', 'E11.9'],
  'insulin 70/30': ['E10.9', 'E11.9'],
  'insulin 50/50': ['E10.9', 'E11.9'],
  'piperacillin tazobactam': ['J18.9', 'A41.9'],
  'ticarcillin clavulanate': ['J18.9', 'A41.9'],
  'ampicillin sulbactam': ['J18.9', 'J02.9'],
  'cefoperazone sulbactam': ['J18.9', 'A41.9'],
  'ceftriaxone sulbactam': ['J18.9', 'A41.9'],
  'sulfamethoxazole trimethoprim': ['N39.0', 'J18.9'],
  'trimethoprim sulfamethoxazole': ['N39.0', 'J18.9'],
  bactrim: ['N39.0', 'J18.9'],
  septrin: ['N39.0', 'J18.9'],
  'co-trimoxazole': ['N39.0', 'J18.9'],
  'ciprofloxacin tinidazole': ['N39.0', 'A07.8'],
  'ciprofloxacin dexamethasone': ['H60.9', 'H66.90'],
  'ofloxacin dexamethasone': ['H60.9', 'H66.90'],
  'neomycin polymyxin': ['H60.9', 'H10.9'],
  'neomycin bacitracin': ['H10.9', 'L08.9'],
  'polymyxin bacitracin': ['H10.9', 'L08.9'],
  'tobramycin dexamethasone': ['H10.9', 'H60.9'],
  'gentamicin betamethasone': ['H60.9', 'L30.9'],
  'prednisolone sulfacetamide': ['H10.9'],
  'beclomethasone formoterol': ['J45.909', 'J44.1'],
  'fluticasone salmeterol': ['J45.909', 'J44.1'],
  'budesonide formoterol': ['J45.909', 'J44.1'],
  'fluticasone vilanterol': ['J45.909', 'J44.1'],
  'mometasone formoterol': ['J45.909', 'J44.1'],
  'tiotropium olodaterol': ['J44.9', 'J44.1'],
  'umeclidinium vilanterol': ['J44.9', 'J44.1'],
  'glycopyrronium indacaterol': ['J44.9', 'J44.1'],
  'ipratropium salbutamol': ['J45.909', 'J44.1'],
  'ipratropium albuterol': ['J45.909', 'J44.1'],
  'fenoterol ipratropium': ['J45.909', 'J44.1'],
  'pseudoephedrine cetirizine': ['J30.9', 'J01.90'],
  'pseudoephedrine loratadine': ['J30.9', 'J01.90'],
  'pseudoephedrine fexofenadine': ['J30.9', 'J01.90'],
  'phenylephrine chlorpheniramine': ['J30.9', 'J01.90'],
  'phenylephrine cetirizine': ['J30.9', 'J01.90'],
  'paracetamol pseudoephedrine': ['R51.9', 'J30.9'],
  'ibuprofen pseudoephedrine': ['R51.9', 'J30.9', 'M79.3'],
  'paracetamol phenylephrine': ['R51.9', 'J30.9'],
  'paracetamol chlorpheniramine': ['R51.9', 'J30.9'],
  'dextromethorphan guaifenesin': ['R05.9'],
  'dextromethorphan pseudoephedrine': ['R05.9', 'J30.9'],
  'codeine guaifenesin': ['R05.9'],
  'codeine promethazine': ['R05.9', 'R11.2'],
  'hydrocodone homatropine': ['R05.9'],
  'omeprazole sodium bicarbonate': ['K21.9', 'K25.9'],
  'esomeprazole naproxen': ['K21.9', 'M79.3'],
  'lansoprazole naproxen': ['K21.9', 'M79.3'],
  'ranitidine domperidone': ['K21.9', 'R11.2'],
  'famotidine calcium carbonate': ['K21.9', 'K30'],
  'aluminum magnesium': ['K21.9', 'K30'],
  'magnesium aluminum': ['K21.9', 'K30'],
  'calcium carbonate magnesium': ['K21.9', 'K30'],
  simethicone: ['K30', 'R14.0'],
  dimethicone: ['K30', 'R14.0'],
  'loperamide simethicone': ['A09.9', 'K59.1'],
  'diphenoxylate atropine': ['A09.9'],
  'levodopa carbidopa': ['G20'],
  'levodopa benserazide': ['G20'],
  'carbidopa entacapone levodopa': ['G20'],
  'levodopa carbidopa entacapone': ['G20'],

  // More single-ingredient drugs frequently used in UAE
  aceclofenac: ['M79.3', 'M25.50', 'M19.90'],
  nimesulide: ['M79.3', 'M25.50', 'R50.9'],
  dexibuprofen: ['M79.3', 'R52'],
  lornoxicam: ['M79.3', 'M25.50'],
  tenoxicam: ['M79.3', 'M19.90'],
  nabumetone: ['M19.90', 'M79.3'],
  sulindac: ['M19.90', 'M79.3'],
  tolmetin: ['M19.90', 'M79.3'],
  diflunisal: ['M79.3', 'R52'],
  salsalate: ['M19.90', 'M79.3'],
  oxaprozin: ['M19.90', 'M79.3'],
  'tiaprofenic acid': ['M79.3', 'M25.50'],
  fenbufen: ['M79.3', 'M19.90'],
  dexketoprofen: ['R52', 'M79.3'],
  meperidine: ['R52', 'G89.29'],
  pethidine: ['R52', 'G89.29'],
  pentazocine: ['R52'],
  butorphanol: ['R52', 'G43.909'],
  nalbuphine: ['R52'],
  nefopam: ['R52'],
  flupirtine: ['R52'],
  ziconotide: ['R52', 'G89.29'],
  capsaicin: ['M79.3', 'G89.29'],
  'lidocaine patch': ['R52', 'G89.29'],
  'fentanyl patch': ['R52', 'G89.29'],
  'buprenorphine patch': ['R52', 'G89.29'],
  dihydrocodeine: ['R52', 'R05.9'],
  dextropropoxyphene: ['R52'],
  propoxyphene: ['R52'],
  levorphanol: ['R52', 'G89.29'],
  oxymorphone: ['R52', 'G89.29'],
  sufentanil: ['R52', 'G89.29'],
  alfentanil: ['R52'],
  remifentanil: ['R52'],
  cloxacillin: ['L03.90', 'J02.9'],
  dicloxacillin: ['L03.90', 'J02.9'],
  flucloxacillin: ['L03.90', 'J02.9'],
  oxacillin: ['L03.90', 'J02.9'],
  nafcillin: ['L03.90', 'A41.9'],
  mezlocillin: ['J18.9', 'A41.9'],
  azlocillin: ['J18.9', 'A41.9'],
  cefaclor: ['J02.9', 'N39.0'],
  cefadroxil: ['J02.9', 'N39.0', 'L03.90'],
  cefalexin: ['J02.9', 'N39.0', 'L03.90'],
  cefazolin: ['J18.9', 'A41.9'],
  cefoxitin: ['J18.9', 'A41.9'],
  cefditoren: ['J02.9', 'J18.9'],
  ceftibuten: ['J02.9', 'N39.0'],
  cefprozil: ['J02.9', 'J18.9'],
  'cefuroxime axetil': ['J02.9', 'J18.9'],
  ceftaroline: ['J18.9', 'A41.9'],
  ceftobiprole: ['J18.9', 'A41.9'],
  'ceftolozane tazobactam': ['J18.9', 'A41.9'],
  cefiderocol: ['J18.9', 'A41.9'],
  doripenem: ['J18.9', 'A41.9'],
  faropenem: ['J18.9'],
  biapenem: ['J18.9', 'A41.9'],
  telithromycin: ['J18.9', 'J02.9'],
  spiramycin: ['J02.9'],
  josamycin: ['J02.9', 'J18.9'],
  midecamycin: ['J02.9'],
  dirithromycin: ['J02.9', 'J18.9'],
  gemifloxacin: ['J18.9'],
  sparfloxacin: ['J18.9'],
  pefloxacin: ['N39.0', 'J18.9'],
  ofloxacin: ['N39.0', 'J18.9', 'H10.9'],
  besifloxacin: ['H10.9'],
  delafloxacin: ['J18.9', 'L03.90'],
  finafloxacin: ['H60.9'],
  prulifloxacin: ['N39.0'],
  rufloxacin: ['N39.0'],
  tigecycline: ['J18.9', 'A41.9'],
  eravacycline: ['J18.9', 'A41.9'],
  omadacycline: ['J18.9', 'L03.90'],
  sarecycline: ['L70.0'],
  colistin: ['J18.9', 'A41.9'],
  'polymyxin b': ['J18.9', 'A41.9'],
  teicoplanin: ['A41.9', 'J18.9'],
  daptomycin: ['A41.9', 'L03.90'],
  'quinupristin dalfopristin': ['A41.9'],
  chloramphenicol: ['H10.9', 'A39.0'],
  'fusidic acid': ['L01.00', 'H10.9'],
  mupirocin: ['L01.00', 'L08.9'],
  retapamulin: ['L01.00'],
  bacitracin: ['H10.9', 'L08.9'],
  rifampicin: ['A15.0', 'A41.9'],
  rifampin: ['A15.0', 'A41.9'],
  rifabutin: ['A31.0', 'A15.0'],
  rifapentine: ['A15.0'],
  rifaximin: ['K70.9', 'A09.9'],
  isoniazid: ['A15.0'],
  pyrazinamide: ['A15.0'],
  ethambutol: ['A15.0', 'A31.0'],
  streptomycin: ['A15.0'],
  capreomycin: ['A15.0'],
  cycloserine: ['A15.0'],
  ethionamide: ['A15.0'],
  'para-aminosalicylic acid': ['A15.0'],
  bedaquiline: ['A15.0'],
  delamanid: ['A15.0'],
  pretomanid: ['A15.0'],
  sulfadiazine: ['A00.9', 'B58.9'],
  sulfadoxine: ['B50.9'],
  sulfamethizole: ['N39.0'],
  sulfisoxazole: ['N39.0'],
  sulfacetamide: ['H10.9'],
  'silver sulfadiazine': ['T30.0', 'L89.90'],
  mafenide: ['T30.0'],
  dapsone: ['L13.0', 'A30.9'],
  atovaquone: ['B58.9', 'P59.3'],
  pentamidine: ['B59', 'P59.3', 'B56.9'],
  pyrimethamine: ['B58.9', 'B50.9'],
  'sulfadoxine pyrimethamine': ['B50.9'],
  'artemether lumefantrine': ['B50.9'],
  artesunate: ['B50.9'],
  artemether: ['B50.9'],
  dihydroartemisinin: ['B50.9'],
  primaquine: ['B50.9', 'B51.9'],
  quinine: ['B50.9'],
  mefloquine: ['B50.9'],
  halofantrine: ['B50.9'],
  proguanil: ['B50.9'],
  'atovaquone proguanil': ['B50.9'],
  chlorproguanil: ['B50.9'],
  tafenoquine: ['B50.9'],
  albendazole: ['B76.9', 'B83.9'],
  mebendazole: ['B80', 'B76.9'],
  thiabendazole: ['B76.9', 'B83.9'],
  pyrantel: ['B80', 'B76.1'],
  praziquantel: ['B65.9', 'B71.9'],
  niclosamide: ['B71.9'],
  ivermectin: ['B86', 'B85.3', 'B74.9'],
  diethylcarbamazine: ['B74.9'],
  triclabendazole: ['B66.3'],
  nitazoxanide: ['A07.8', 'A06.0'],
  paromomycin: ['A06.0', 'A07.8'],
  diloxanide: ['A06.0'],
  iodoquinol: ['A06.0'],
  secnidazole: ['A07.8', 'A06.0'],
  ornidazole: ['A07.8', 'A06.0'],
  benznidazole: ['B57.2'],
  nifurtimox: ['B57.2'],
  suramin: ['B56.9'],
  melarsoprol: ['B56.9'],
  eflornithine: ['B56.9'],
  miltefosine: ['B55.9'],
  'amphotericin b': ['B37.9', 'B38.9'],
  flucytosine: ['B37.9', 'B45.9'],
  caspofungin: ['B37.9', 'B44.9'],
  micafungin: ['B37.9', 'B44.9'],
  anidulafungin: ['B37.9', 'B44.9'],
  isavuconazole: ['B37.9', 'B44.9'],
  efinaconazole: ['B35.1'],
  luliconazole: ['B35.9'],
  sertaconazole: ['B35.9', 'B37.9'],
  econazole: ['B35.9', 'B37.9'],
  butoconazole: ['B37.9'],
  terconazole: ['B37.9'],
  fenticonazole: ['B37.9'],
  oxiconazole: ['B35.9'],
  sulconazole: ['B35.9'],
  bifonazole: ['B35.9'],
  tioconazole: ['B35.9', 'B37.9'],
  amorolfine: ['B35.1'],
  ciclopirox: ['B35.1', 'B36.0'],
  naftifine: ['B35.9'],
  butenafine: ['B35.9'],
  tolnaftate: ['B35.9'],
  'undecylenic acid': ['B35.3'],
  'whitfield ointment': ['B35.9'],
  acyclovir: ['B00.9', 'B02.9'],
  valacyclovir: ['B00.9', 'B02.9'],
  famciclovir: ['B00.9', 'B02.9'],
  ganciclovir: ['B25.9', 'B00.9'],
  valganciclovir: ['B25.9'],
  cidofovir: ['B25.9', 'B00.9'],
  foscarnet: ['B25.9', 'B00.9'],
  penciclovir: ['B00.9'],
  docosanol: ['B00.1'],
  idoxuridine: ['B00.9'],
  trifluridine: ['B00.9'],
  vidarabine: ['B00.9'],
  oseltamivir: ['J10.1', 'J11.1'],
  zanamivir: ['J10.1', 'J11.1'],
  peramivir: ['J10.1', 'J11.1'],
  baloxavir: ['J10.1', 'J11.1'],
  amantadine: ['G20', 'J10.1'],
  rimantadine: ['J10.1'],
  ribavirin: ['B19.9', 'J12.1'],
  sofosbuvir: ['B18.2'],
  'ledipasvir sofosbuvir': ['B18.2'],
  'velpatasvir sofosbuvir': ['B18.2'],
  'glecaprevir pibrentasvir': ['B18.2'],
  daclatasvir: ['B18.2'],
  simeprevir: ['B18.2'],
  paritaprevir: ['B18.2'],
  ombitasvir: ['B18.2'],
  dasabuvir: ['B18.2'],
  'elbasvir grazoprevir': ['B18.2'],
  'interferon alfa': ['B18.2', 'C92.10'],
  'peginterferon alfa': ['B18.2', 'C92.10'],
  lamivudine: ['B18.1', 'B20'],
  adefovir: ['B18.1'],
  entecavir: ['B18.1'],
  telbivudine: ['B18.1'],
  tenofovir: ['B18.1', 'B20'],
  'tenofovir alafenamide': ['B18.1', 'B20'],
  'tenofovir disoproxil': ['B18.1', 'B20'],
  emtricitabine: ['B20', 'B18.1'],
  'emtricitabine tenofovir': ['B20'],
  zidovudine: ['B20'],
  stavudine: ['B20'],
  didanosine: ['B20'],
  zalcitabine: ['B20'],
  abacavir: ['B20'],
  'abacavir lamivudine': ['B20'],
  'abacavir lamivudine zidovudine': ['B20'],
  nevirapine: ['B20'],
  efavirenz: ['B20'],
  'efavirenz emtricitabine tenofovir': ['B20'],
  etravirine: ['B20'],
  rilpivirine: ['B20'],
  doravirine: ['B20'],
  saquinavir: ['B20'],
  ritonavir: ['B20'],
  indinavir: ['B20'],
  nelfinavir: ['B20'],
  amprenavir: ['B20'],
  fosamprenavir: ['B20'],
  'lopinavir ritonavir': ['B20'],
  atazanavir: ['B20'],
  tipranavir: ['B20'],
  darunavir: ['B20'],
  raltegravir: ['B20'],
  elvitegravir: ['B20'],
  dolutegravir: ['B20'],
  bictegravir: ['B20'],
  cabotegravir: ['B20'],
  maraviroc: ['B20'],
  enfuvirtide: ['B20'],
  ibalizumab: ['B20'],
};

// Dosage form hints for route-specific conditions
const DOSAGE_FORM_HINTS = {
  topical: ['L30.9', 'L98.9'],
  cream: ['L30.9', 'L20.9'],
  ointment: ['L30.9', 'L20.9'],
  gel: ['L30.9', 'M79.3'],
  patch: ['R52', 'I20.9'],
  inhaler: ['J45.909', 'J44.9'],
  nebulizer: ['J45.909', 'J44.9'],
  'eye drop': ['H10.9', 'H57.9'],
  'ear drop': ['H66.9', 'H61.9'],
  injection: ['Z51.89'],
  infusion: ['Z51.89'],
  suppository: ['K59.00', 'R11.2'],
};

// Load ICD-10 codes from official source
async function loadIcd10Codes() {
  const icd10Map = new Map();
  const icd10Dir = path.join(__dirname, '../icd10cm-Code Descriptions-2026');

  console.log('Loading ICD-10 codes from official 2026 source...');

  try {
    // Load main codes file
    const mainFile = path.join(icd10Dir, 'icd10cm-codes-2026.txt');
    const addendaFile = path.join(icd10Dir, 'icd10cm-codes-addenda-2026.txt');

    if (fs.existsSync(mainFile)) {
      const content = fs.readFileSync(mainFile, 'utf-8');
      const lines = content.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // ICD-10 format: CODE DESCRIPTION (space/tab separated)
        // File format: "J029" but we normalize to "J02.9" for standard format
        const parts = trimmed.split(/\s{2,}|\t/);
        if (parts.length >= 2) {
          let code = parts[0].trim();
          const description = parts.slice(1).join(' ').trim();

          // Normalize code: J029 -> J02.9, E1165 -> E11.65
          if (code && /^[A-Z]\d{3,}$/.test(code)) {
            // Insert decimal after first 3 characters (e.g., J029 -> J02.9)
            code = code.substring(0, 3) + '.' + code.substring(3);
          }

          if (code && description) {
            icd10Map.set(code, description);
            // Also store without decimal for compatibility
            const codeNoDot = code.replace('.', '');
            if (codeNoDot !== code) {
              icd10Map.set(codeNoDot, description);
            }
          }
        }
      }
    }

    // Load addenda file
    if (fs.existsSync(addendaFile)) {
      const content = fs.readFileSync(addendaFile, 'utf-8');
      const lines = content.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const match = trimmed.match(/^([A-Z]\d{2}(?:\.\d{1,4})?)\s+(.+)$/);
        if (match) {
          const [, code, description] = match;
          icd10Map.set(code, description.trim());
        }
      }
    }

    console.log(`✓ Loaded ${icd10Map.size} ICD-10 codes`);
  } catch (error) {
    console.error('Error loading ICD-10 codes:', error.message);
  }

  return icd10Map;
} // Smart mapping function with enhanced generic name extraction
function mapDrugToIcd10(drug, icd10Map) {
  const genericName = (drug['Generic Name'] || '').toLowerCase().trim();
  const packageName = (drug['Package Name'] || '').toLowerCase().trim();
  const dosageForm = (drug['Dosage Form'] || '').toLowerCase().trim();

  const icd10Codes = new Set();

  // Enhanced name processing: remove common suffixes (salts, esters)
  const removeSalts = (name) => {
    const saltSuffixes = [
      'dihydrochloride',
      'trihydrochloride',
      'monohydrochloride',
      'hydrochloride',
      'hcl',
      'sulfate',
      'sulphate',
      'phosphate',
      'sodium',
      'potassium',
      'calcium',
      'mesylate',
      'maleate',
      'succinate',
      'fumarate',
      'tartrate',
      'citrate',
      'acetate',
      'besylate',
      'monohydrate',
      'dihydrate',
      'trihydrate',
      'anhydrous',
      'hemihydrate',
      'sesquihydrate',
      'base',
    ];
    let cleanName = name;
    saltSuffixes.forEach((salt) => {
      cleanName = cleanName.replace(new RegExp(`\\s+${salt}$`, 'gi'), '');
    });
    return cleanName.trim();
  };

  // Extract all drug components from combinations (handles +, /, and, &, with)
  const extractComponents = (name) => {
    const components = [];

    // Split by common separators
    const parts = name.split(/[+/&]|\s+and\s+|\s+with\s+/i);

    parts.forEach((part) => {
      let cleaned = part.trim();
      // Remove salt suffixes
      cleaned = removeSalts(cleaned);
      // Remove strength/dosage info (e.g., "500mg", "5%", "10ml")
      cleaned = cleaned.replace(/\s*\d+(\.\d+)?\s*(mg|mcg|g|ml|%|iu|units?)\s*/gi, '').trim();
      // Remove common non-drug words
      cleaned = cleaned
        .replace(/\b(tablet|capsule|syrup|solution|injection|cream|ointment)\b/gi, '')
        .trim();

      if (cleaned.length > 2) {
        components.push(cleaned);
      }
    });

    return components;
  };

  // Priority 1: Check exact generic-specific mappings
  const cleanGenericName = removeSalts(genericName);

  if (cleanGenericName && GENERIC_SPECIFIC_MAPPINGS[cleanGenericName]) {
    GENERIC_SPECIFIC_MAPPINGS[cleanGenericName].forEach((code) => {
      if (icd10Map.has(code)) icd10Codes.add(code);
    });
  }

  // Priority 2: Check all components of combination drugs
  const genericComponents = extractComponents(genericName);
  const packageComponents = extractComponents(packageName);
  const allComponents = [...new Set([...genericComponents, ...packageComponents])];

  allComponents.forEach((component) => {
    if (GENERIC_SPECIFIC_MAPPINGS[component]) {
      GENERIC_SPECIFIC_MAPPINGS[component].forEach((code) => {
        if (icd10Map.has(code)) icd10Codes.add(code);
      });
    }
  });

  // Priority 3: Check for partial matches in GENERIC_SPECIFIC_MAPPINGS
  Object.keys(GENERIC_SPECIFIC_MAPPINGS).forEach((mappedDrug) => {
    const searchIn = `${cleanGenericName} ${packageName}`.toLowerCase();

    // Check if mapped drug name appears in the search text
    if (searchIn.includes(mappedDrug) || mappedDrug.includes(cleanGenericName)) {
      GENERIC_SPECIFIC_MAPPINGS[mappedDrug].forEach((code) => {
        if (icd10Map.has(code)) icd10Codes.add(code);
      });
    }
  });

  // Priority 4: Check therapeutic category keywords
  const searchText = `${cleanGenericName} ${genericName} ${packageName} ${dosageForm}`;

  for (const [keyword, codes] of Object.entries(THERAPEUTIC_MAPPINGS)) {
    if (searchText.includes(keyword)) {
      codes.forEach((code) => {
        if (icd10Map.has(code)) icd10Codes.add(code);
      });
    }
  }

  // Priority 5: Check dosage form hints
  for (const [formKeyword, codes] of Object.entries(DOSAGE_FORM_HINTS)) {
    if (dosageForm.includes(formKeyword)) {
      codes.forEach((code) => {
        if (icd10Map.has(code)) icd10Codes.add(code);
      });
    }
  }

  // Limit to top 5 most relevant codes
  return Array.from(icd10Codes)
    .slice(0, 5)
    .map((code) => ({
      code,
      description: icd10Map.get(code),
    }));
}

// Main processing function
async function generateCompleteMappings() {
  console.log('🚀 Starting comprehensive UAE drug ICD-10 mapping generation...\n');

  const startTime = Date.now();
  const icd10Map = await loadIcd10Codes();

  const csvPath = path.join(__dirname, '../database/Drugs 03.12.csv');
  const drugs = [];

  console.log('Loading UAE drug database...');

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const allDrugs = parseCSV(csvContent);

  // Filter active drugs only
  allDrugs.forEach((row) => {
    if (row['Status'] === 'Active') {
      drugs.push(row);
    }
  });
  console.log(`✓ Loaded ${drugs.length} active drugs\n`);
  console.log('Generating ICD-10 mappings...\n');

  const mappings = {};
  const statistics = {
    totalProcessed: 0,
    withMappings: 0,
    withoutMappings: 0,
    totalIcd10CodesAssigned: 0,
    categoryBreakdown: {},
  };

  for (let i = 0; i < drugs.length; i++) {
    const drug = drugs[i];
    const icd10Codes = mapDrugToIcd10(drug, icd10Map);

    const genericName = drug['Generic Name'] || 'Unknown';
    const packageName = drug['Package Name'] || 'Unknown';

    // Store mapping with multiple keys for flexible lookup
    const keys = [packageName.toLowerCase().trim(), genericName.toLowerCase().trim()];

    keys.forEach((key) => {
      if (key && key !== 'unknown') {
        mappings[key] = icd10Codes;
      }
    });

    statistics.totalProcessed++;
    if (icd10Codes.length > 0) {
      statistics.withMappings++;
      statistics.totalIcd10CodesAssigned += icd10Codes.length;
    } else {
      statistics.withoutMappings++;
    }

    // Progress indicator
    if ((i + 1) % 1000 === 0) {
      console.log(`  Processed ${i + 1}/${drugs.length} drugs...`);
    }
  }

  // Calculate statistics
  statistics.averageCodesPerDrug = (
    statistics.totalIcd10CodesAssigned / statistics.withMappings
  ).toFixed(2);
  statistics.coveragePercentage = (
    (statistics.withMappings / statistics.totalProcessed) *
    100
  ).toFixed(2);

  // Save mappings
  const outputPath = path.join(__dirname, '../data/uae-drugs-complete-icd10-mappings.json');
  fs.writeFileSync(outputPath, JSON.stringify(mappings, null, 2));

  // Save statistics
  const statsPath = path.join(__dirname, '../data/uae-drugs-mapping-statistics.json');
  fs.writeFileSync(statsPath, JSON.stringify(statistics, null, 2));

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n✅ Mapping generation complete!\n');
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 STATISTICS:');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Total drugs processed:     ${statistics.totalProcessed.toLocaleString()}`);
  console.log(
    `Drugs with mappings:       ${statistics.withMappings.toLocaleString()} (${statistics.coveragePercentage}%)`
  );
  console.log(`Drugs without mappings:    ${statistics.withoutMappings.toLocaleString()}`);
  console.log(`Total ICD-10 codes:        ${statistics.totalIcd10CodesAssigned.toLocaleString()}`);
  console.log(`Average codes per drug:    ${statistics.averageCodesPerDrug}`);
  console.log(`Time elapsed:              ${elapsed}s`);
  console.log('═══════════════════════════════════════════════════════');
  console.log(`\n📁 Output files:`);
  console.log(`   Mappings: ${outputPath}`);
  console.log(`   Statistics: ${statsPath}`);
  console.log(
    '\n🎉 Ready to use! The mappings will be automatically loaded by the drug service.\n'
  );
}

// Run the generator
generateCompleteMappings().catch((error) => {
  console.error('❌ Error generating mappings:', error);
  process.exit(1);
});
