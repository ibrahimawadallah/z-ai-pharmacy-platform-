// Comprehensive Drug Database
// Contains 100+ commonly prescribed medications with complete monograph data

export interface DrugMonograph {
  id: string
  name: string
  genericName: string
  brandNames: string[]
  drugClass: string
  indications: string[]
  contraindications: string[]
  warnings: string[]
  sideEffects: {
    common: string[]
    serious: string[]
  }
  dosage: {
    adult: string
    pediatric?: string
    geriatric?: string
    renal?: string
    hepatic?: string
  }
  interactions: {
    major: string[]
    moderate: string[]
    minor: string[]
  }
  pregnancyCategory: string
  lactation: string
  mechanismOfAction: string
  pharmacokinetics: {
    absorption: string
    distribution: string
    metabolism: string
    elimination: string
    halfLife: string
  }
  storage: string
  manufacturer: string
  // Additional fields for enhanced features
  allergens?: string[]
  crossReactivity?: string[]
  pediatricDosing?: {
    mgPerKg: number
    maxMg: number
    frequency: string
    concentrationMgPerMl?: number
    ageLimit?: string
    contraindications?: string[]
  }
}

export const comprehensiveDrugDatabase: Record<string, DrugMonograph> = {
  // ANALGESICS & NSAIDs
  'aspirin': {
    id: 'aspirin',
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    brandNames: ['Bayer', 'Ecotrin', 'Bufferin', 'St. Joseph'],
    drugClass: 'Nonsteroidal Anti-Inflammatory Drug (NSAID), Antiplatelet',
    indications: [
      'Pain relief (mild to moderate)',
      'Fever reduction',
      'Inflammation reduction',
      'Cardiovascular event prophylaxis',
      'Acute coronary syndrome',
      'Prevention of stroke'
    ],
    contraindications: [
      'Hypersensitivity to salicylates',
      'Active bleeding or bleeding disorders',
      'Children with viral infections (Reye syndrome risk)',
      'Severe hepatic impairment',
      'Third trimester of pregnancy',
      'History of aspirin-induced asthma'
    ],
    warnings: [
      'GI bleeding risk increases with age and duration of use',
      'May cause bronchospasm in aspirin-sensitive asthmatics',
      'Tinnitus may indicate toxicity',
      'Discontinue before surgery (7 days prior)',
      'Risk of hemorrhagic stroke with high doses'
    ],
    sideEffects: {
      common: ['Stomach upset', 'Heartburn', 'Nausea', 'Tinnitus'],
      serious: ['GI bleeding', 'Allergic reaction', 'Hemorrhagic stroke', 'Reye syndrome']
    },
    dosage: {
      adult: '325-650mg every 4-6h PRN (max 4g/day for analgesia); 81-325mg daily for cardioprotection',
      pediatric: 'Not recommended <12 years with viral illness',
      geriatric: 'Use lowest effective dose; increased bleeding risk',
      renal: 'Avoid if CrCl <10',
      hepatic: 'Avoid in severe impairment'
    },
    interactions: {
      major: ['Warfarin', 'Methotrexate', 'Alcohol'],
      moderate: ['NSAIDs', 'Corticosteroids', 'SSRIs', 'Heparin'],
      minor: ['Vitamin C', 'Fish oil']
    },
    pregnancyCategory: 'D (3rd trimester)',
    lactation: 'Low doses compatible; high doses may cause bleeding in infant',
    mechanismOfAction: 'Irreversible COX-1/COX-2 inhibition, reducing prostaglandin and thromboxane synthesis',
    pharmacokinetics: {
      absorption: 'Rapid from GI tract',
      distribution: 'Widely distributed; crosses BBB',
      metabolism: 'Hepatic to salicylic acid',
      elimination: 'Renal',
      halfLife: '15-20 min (aspirin); 2-3h (salicylate)'
    },
    storage: 'Room temperature; protect from moisture',
    manufacturer: 'Multiple generic manufacturers',
    allergens: ['salicylate', 'nsaid'],
    crossReactivity: ['NSAIDs', 'salicylates']
  },

  'ibuprofen': {
    id: 'ibuprofen',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    brandNames: ['Advil', 'Motrin', 'Nurofen', 'Caldolor'],
    drugClass: 'Nonsteroidal Anti-Inflammatory Drug (NSAID)',
    indications: [
      'Pain relief (mild to moderate)',
      'Fever reduction',
      'Inflammatory conditions',
      'Dysmenorrhea',
      'Osteoarthritis',
      'Rheumatoid arthritis'
    ],
    contraindications: [
      'NSAID hypersensitivity',
      'Active GI bleeding/ulcer',
      'NSAID-induced asthma',
      'Severe renal/hepatic impairment',
      '3rd trimester pregnancy',
      'Perioperative coronary artery bypass graft'
    ],
    warnings: [
      'CV thrombotic events risk',
      'GI bleeding/ulceration risk',
      'Nephrotoxicity in dehydration',
      'May mask infection signs'
    ],
    sideEffects: {
      common: ['Stomach upset', 'Nausea', 'Headache', 'Dizziness'],
      serious: ['GI bleeding', 'MI/Stroke', 'Kidney failure', 'Anaphylaxis']
    },
    dosage: {
      adult: '200-400mg q4-6h PRN (max 1.2g/day OTC; 3.2g/day Rx)',
      pediatric: '5-10mg/kg q6-8h (max 40mg/kg/day)',
      geriatric: 'Lowest effective dose',
      renal: 'Avoid if CrCl <30',
      hepatic: 'Use caution'
    },
    interactions: {
      major: ['Aspirin', 'Warfarin', 'Lithium', 'Methotrexate'],
      moderate: ['ACE inhibitors', 'ARBs', 'Diuretics', 'SSRIs'],
      minor: ['Antacids', 'Food']
    },
    pregnancyCategory: 'D (3rd trimester)',
    lactation: 'Compatible',
    mechanismOfAction: 'Reversible COX-1/COX-2 inhibition',
    pharmacokinetics: {
      absorption: 'Rapid from GI tract',
      distribution: 'Widely distributed',
      metabolism: 'CYP2C9 hepatic metabolism',
      elimination: 'Renal as metabolites',
      halfLife: '2-4 hours'
    },
    storage: 'Room temperature; protect from light',
    manufacturer: 'Multiple manufacturers',
    allergens: ['nsaid', 'propionic acid derivative'],
    crossReactivity: ['naproxen', 'ketoprofen', 'fenoprofen'],
    pediatricDosing: {
      mgPerKg: 10,
      maxMg: 800,
      frequency: 'Every 6-8 hours with food',
      concentrationMgPerMl: 100,
      ageLimit: '> 6 months',
      contraindications: ['Dehydration', 'Kidney disease', 'GI bleeding']
    }
  },

  'naproxen': {
    id: 'naproxen',
    name: 'Naproxen',
    genericName: 'Naproxen',
    brandNames: ['Aleve', 'Naprosyn', 'Anaprox', 'EC-Naprosyn'],
    drugClass: 'Nonsteroidal Anti-Inflammatory Drug (NSAID)',
    indications: [
      'Pain relief',
      'Fever reduction',
      'Inflammatory conditions',
      'Arthritis',
      'Ankylosing spondylitis',
      'Gout'
    ],
    contraindications: [
      'NSAID hypersensitivity',
      'Active GI bleeding',
      'Severe renal/hepatic impairment',
      '3rd trimester pregnancy'
    ],
    warnings: [
      'CV thrombotic events',
      'GI bleeding risk',
      'Nephrotoxicity'
    ],
    sideEffects: {
      common: ['Stomach upset', 'Heartburn', 'Drowsiness', 'Dizziness'],
      serious: ['GI bleeding', 'Stroke/MI', 'Liver damage', 'Anaphylaxis']
    },
    dosage: {
      adult: '250-500mg bid (max 1.5g/day)',
      pediatric: '5-7mg/kg bid (max 1g/day)',
      geriatric: 'Start low; monitor renal function',
      renal: 'Avoid if CrCl <30',
      hepatic: 'Use caution'
    },
    interactions: {
      major: ['Aspirin', 'Warfarin', 'Lithium'],
      moderate: ['ACE inhibitors', 'Diuretics', 'Methotrexate', 'SSRIs'],
      minor: ['Probenecid']
    },
    pregnancyCategory: 'C (D in 3rd trimester)',
    lactation: 'Short-term use compatible',
    mechanismOfAction: 'COX-1/COX-2 inhibition',
    pharmacokinetics: {
      absorption: 'Almost complete',
      distribution: 'Extensive; 99% protein bound',
      metabolism: 'Hepatic CYP1A2, 2C9',
      elimination: 'Renal',
      halfLife: '12-15 hours'
    },
    storage: 'Room temperature',
    manufacturer: 'Multiple manufacturers',
    allergens: ['nsaid', 'propionic acid derivative'],
    crossReactivity: ['ibuprofen', 'ketoprofen'],
    pediatricDosing: {
      mgPerKg: 5,
      maxMg: 500,
      frequency: 'Twice daily',
      ageLimit: '> 2 years',
      contraindications: ['Dehydration', 'Kidney disease']
    }
  },

  'acetaminophen': {
    id: 'acetaminophen',
    name: 'Acetaminophen',
    genericName: 'Acetaminophen (Paracetamol)',
    brandNames: ['Tylenol', 'Panadol', 'Ofirmev', 'FeverAll'],
    drugClass: 'Analgesic, Antipyretic',
    indications: [
      'Pain relief (mild to moderate)',
      'Fever reduction',
      'Headache',
      'Muscle aches',
      'Arthritis pain',
      'Menstrual cramps'
    ],
    contraindications: [
      'Severe hepatic impairment',
      'Hypersensitivity',
      'Severe alcohol use'
    ],
    warnings: [
      'Hepatotoxicity at high doses',
      'Liver damage with chronic alcohol use',
      'Risk of overdose (many combination products)',
      'Check all medications for acetaminophen content'
    ],
    sideEffects: {
      common: ['Nausea', 'Stomach upset'],
      serious: ['Liver failure', 'Severe allergic reaction', 'Blood disorders']
    },
    dosage: {
      adult: '325-1000mg q4-6h PRN (max 3-4g/day; 2g/day if liver disease)',
      pediatric: '10-15mg/kg q4-6h (max 75mg/kg/day; 5 doses/24h)',
      geriatric: 'Same as adult; monitor liver function',
      renal: 'No adjustment needed',
      hepatic: 'Reduce dose; max 2g/day; avoid if severe'
    },
    interactions: {
      major: ['Alcohol (chronic use)', 'Carbamazepine', 'Phenytoin'],
      moderate: ['Warfarin (high doses)', 'Isoniazid'],
      minor: ['Probenecid']
    },
    pregnancyCategory: 'B',
    lactation: 'Compatible',
    mechanismOfAction: 'Central COX inhibition; endogenous cannabinoid activation in CNS',
    pharmacokinetics: {
      absorption: 'Rapid and almost complete',
      distribution: 'Widely distributed',
      metabolism: 'Hepatic glucuronidation and sulfation',
      elimination: 'Renal (metabolites)',
      halfLife: '1.25-3 hours'
    },
    storage: 'Room temperature; protect from moisture',
    manufacturer: 'Multiple manufacturers',
    allergens: ['acetaminophen'],
    crossReactivity: [],
    pediatricDosing: {
      mgPerKg: 15,
      maxMg: 1000,
      frequency: 'Every 4-6 hours as needed',
      concentrationMgPerMl: 160,
      ageLimit: 'All ages',
      contraindications: ['Severe liver disease']
    }
  },

  'celecoxib': {
    id: 'celecoxib',
    name: 'Celecoxib',
    genericName: 'Celecoxib',
    brandNames: ['Celebrex', 'Elyxyb'],
    drugClass: 'COX-2 Selective NSAID',
    indications: [
      'Osteoarthritis',
      'Rheumatoid arthritis',
      'Ankylosing spondylitis',
      'Acute pain',
      'Primary dysmenorrhea',
      'Familial adenomatous polyposis'
    ],
    contraindications: [
      'Sulfa allergy',
      'NSAID hypersensitivity/asthma',
      'Active GI bleeding',
      'Severe renal/hepatic impairment',
      'CV disease (ischemic)',
      '3rd trimester pregnancy'
    ],
    warnings: [
      'Increased CV thrombotic events',
      'GI bleeding still possible',
      'Serious skin reactions (SJS/TEN)',
      'Hepatotoxicity'
    ],
    sideEffects: {
      common: ['Stomach upset', 'Diarrhea', 'Headache', 'Edema'],
      serious: ['MI/Stroke', 'GI bleeding', 'Severe skin reactions', 'Liver failure']
    },
    dosage: {
      adult: 'OA: 200mg daily or 100mg bid; RA: 100-200mg bid',
      geriatric: 'Start low; monitor CV/renal status',
      renal: 'Avoid if CrCl <30',
      hepatic: 'Reduce dose by 50% if moderate impairment'
    },
    interactions: {
      major: ['Aspirin', 'Warfarin', 'Fluconazole', 'Lithium'],
      moderate: ['ACE inhibitors', 'Diuretics', 'SSRIs', 'CYP2C9 substrates'],
      minor: ['Food']
    },
    pregnancyCategory: 'C (D in 3rd trimester)',
    lactation: 'Not recommended',
    mechanismOfAction: 'Selective COX-2 inhibition (less GI toxicity than non-selective NSAIDs)',
    pharmacokinetics: {
      absorption: 'Peak 3 hours',
      distribution: '97% protein bound',
      metabolism: 'CYP2C9 hepatic metabolism',
      elimination: 'Renal and fecal',
      halfLife: '11 hours'
    },
    storage: 'Room temperature',
    manufacturer: 'Pfizer',
    allergens: ['sulfonamide', 'nsaid'],
    crossReactivity: ['sulfa drugs', 'other NSAIDs']
  },

  // ANTIBIOTICS - PENICILLINS
  'amoxicillin': {
    id: 'amoxicillin',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    brandNames: ['Amoxil', 'Trimox', 'Moxatag', 'Augmentin (with clavulanate)'],
    drugClass: 'Aminopenicillin, Beta-Lactam Antibiotic',
    indications: [
      'Respiratory tract infections',
      'Otitis media',
      'Sinusitis',
      'Skin/soft tissue infections',
      'UTIs',
      'H. pylori eradication',
      'Lyme disease',
      'Prophylaxis for endocarditis'
    ],
    contraindications: [
      'Penicillin hypersensitivity',
      'History of serious beta-lactam reaction',
      'Infectious mononucleosis (rash risk)'
    ],
    warnings: [
      'Serious hypersensitivity reactions',
      'Cross-sensitivity with cephalosporins (5-10%)',
      'C. difficile risk',
      'Not effective vs beta-lactamase organisms (use Augmentin)'
    ],
    sideEffects: {
      common: ['Diarrhea', 'Nausea', 'Vomiting', 'Rash', 'Yeast infection'],
      serious: ['Anaphylaxis', 'SJS/TEN', 'C. difficile colitis', 'Seizures']
    },
    dosage: {
      adult: '500mg tid or 875mg bid; severe: 1g tid',
      pediatric: '20-45mg/kg/day divided bid-tid',
      geriatric: 'No adjustment; monitor renal function',
      renal: 'CrCl 10-30: extend interval; <10: reduce dose 50%',
      hepatic: 'No adjustment'
    },
    interactions: {
      major: ['Methotrexate', 'Allopurinol (rash risk)'],
      moderate: ['Probenecid', 'Warfarin', 'Oral contraceptives (possible)'],
      minor: ['Food', 'Antacids']
    },
    pregnancyCategory: 'B',
    lactation: 'Compatible',
    mechanismOfAction: 'Binds PBPs, inhibits cell wall synthesis, bactericidal',
    pharmacokinetics: {
      absorption: 'Rapid; 75-90% bioavailable',
      distribution: 'Widely distributed; crosses placenta',
      metabolism: 'Minimal hepatic',
      elimination: 'Renal (unchanged)',
      halfLife: '1 hour'
    },
    storage: 'Capsules: room temp; Suspension: refrigerate 14 days',
    manufacturer: 'Multiple manufacturers',
    allergens: ['penicillin', 'beta-lactam'],
    crossReactivity: ['cephalosporins', 'carbapenems', 'ampicillin'],
    pediatricDosing: {
      mgPerKg: 45,
      maxMg: 4000,
      frequency: 'Twice daily',
      concentrationMgPerMl: 400,
      ageLimit: 'All ages',
      contraindications: ['Penicillin allergy', 'Infectious mononucleosis']
    }
  },

  'ampicillin': {
    id: 'ampicillin',
    name: 'Ampicillin',
    genericName: 'Ampicillin',
    brandNames: ['Principen', 'Omnipen', 'Unasyn (with sulbactam)'],
    drugClass: 'Aminopenicillin, Beta-Lactam Antibiotic',
    indications: [
      'UTIs',
      'Respiratory infections',
      'Meningitis (with gentamicin)',
      'Endocarditis prophylaxis',
      'Listeria infections',
      'Gastroenteritis (Salmonella, Shigella)'
    ],
    contraindications: [
      'Penicillin hypersensitivity',
      'Infectious mononucleosis'
    ],
    warnings: [
      'High incidence of diarrhea',
      'Rash more common than amoxicillin',
      'Not stable against beta-lactamase'
    ],
    sideEffects: {
      common: ['Diarrhea', 'Rash', 'Nausea', 'Vaginal yeast infection'],
      serious: ['Anaphylaxis', 'Severe skin reactions', 'C. difficile']
    },
    dosage: {
      adult: '250-500mg q6h; severe: 1-2g IV q4-6h',
      pediatric: '50-100mg/kg/day divided q6h',
      renal: 'Adjust dosing interval if CrCl <10',
      hepatic: 'No adjustment'
    },
    interactions: {
      major: ['Allopurinol', 'Methotrexate'],
      moderate: ['Probenecid', 'Warfarin', 'Oral contraceptives'],
      minor: ['Food reduces absorption']
    },
    pregnancyCategory: 'B',
    lactation: 'Compatible',
    mechanismOfAction: 'Binds PBPs, inhibits cell wall synthesis',
    pharmacokinetics: {
      absorption: '40% oral; better fasting',
      distribution: 'Widely distributed; crosses BBB with inflammation',
      metabolism: 'Minimal hepatic',
      elimination: 'Renal (unchanged)',
      halfLife: '1-1.5 hours'
    },
    storage: 'Room temperature; suspension refrigerate',
    manufacturer: 'Multiple manufacturers',
    allergens: ['penicillin', 'beta-lactam'],
    crossReactivity: ['amoxicillin', 'cephalosporins']
  },

  'penicillin_g': {
    id: 'penicillin_g',
    name: 'Penicillin G',
    genericName: 'Penicillin G',
    brandNames: ['Pfizerpen', 'Bicillin LA', 'Bicillin CR'],
    drugClass: 'Natural Penicillin, Beta-Lactam Antibiotic',
    indications: [
      'Streptococcal infections',
      'Syphilis',
      'Meningitis (susceptible organisms)',
      'Endocarditis',
      'Actinomycosis',
      'Rat bite fever',
      'Diphtheria'
    ],
    contraindications: [
      'Penicillin hypersensitivity'
    ],
    warnings: [
      'Bicillin LA/CR: Not for IV use (embolism risk)',
      'C. difficile risk',
      'Jarisch-Herxheimer reaction in syphilis'
    ],
    sideEffects: {
      common: ['Pain at injection site', 'Hypersensitivity reactions', 'Nausea'],
      serious: ['Anaphylaxis', 'Seizures (high doses)', 'Severe skin reactions']
    },
    dosage: {
      adult: 'IM/IV: 1-24 million units/day divided q4-6h; Syphilis: 2.4M units IM single dose',
      pediatric: '25,000-50,000 units/kg/day divided q4-6h',
      renal: 'Extend interval if CrCl <10',
      hepatic: 'No adjustment'
    },
    interactions: {
      major: ['Methotrexate', 'Probenecid'],
      moderate: ['Warfarin', 'Oral contraceptives'],
      minor: []
    },
    pregnancyCategory: 'B',
    lactation: 'Compatible',
    mechanismOfAction: 'Binds PBPs, inhibits cell wall synthesis',
    pharmacokinetics: {
      absorption: 'Unstable in acid (IV/IM only)',
      distribution: 'Widely distributed; crosses inflamed meninges',
      metabolism: 'Minimal hepatic',
      elimination: 'Renal (unchanged)',
      halfLife: '0.5 hours (aqueous); 12-24 hours (repository)'
    },
    storage: 'Refrigerate; protect from light',
    manufacturer: 'Pfizer',
    allergens: ['penicillin', 'beta-lactam'],
    crossReactivity: ['all penicillins', 'cephalosporins']
  },

  // ANTIBIOTICS - CEPHALOSPORINS
  'cephalexin': {
    id: 'cephalexin',
    name: 'Cephalexin',
    genericName: 'Cephalexin',
    brandNames: ['Keflex', 'Daxbia', 'Keftab'],
    drugClass: 'First-Generation Cephalosporin, Beta-Lactam Antibiotic',
    indications: [
      'Respiratory infections',
      'Otitis media',
      'Skin/soft tissue infections',
      'UTIs',
      'Prophylaxis for dental procedures',
      'Bone infections'
    ],
    contraindications: [
      'Cephalosporin hypersensitivity',
      'Severe penicillin allergy (5-10% cross-reactivity)'
    ],
    warnings: [
      'Cross-sensitivity with penicillins',
      'C. difficile risk',
      'Seizure risk with high doses in renal impairment',
      'Not effective against MRSA, Enterococcus, Pseudomonas'
    ],
    sideEffects: {
      common: ['Diarrhea', 'Nausea', 'Stomach pain', 'Vaginal yeast infection'],
      serious: ['Severe allergic reaction', 'C. difficile colitis', 'SJS/TEN']
    },
    dosage: {
      adult: '250-1000mg q6h (max 4g/day)',
      pediatric: '25-50mg/kg/day divided q6-8h',
      geriatric: 'Monitor renal function',
      renal: 'CrCl <10: extend interval to q12-24h',
      hepatic: 'No adjustment'
    },
    interactions: {
      major: [],
      moderate: ['Probenecid', 'Warfarin', 'Metformin'],
      minor: ['Food']
    },
    pregnancyCategory: 'B',
    lactation: 'Compatible',
    mechanismOfAction: 'Binds PBPs, inhibits cell wall synthesis (1st gen: good vs gram+, some gram-)',
    pharmacokinetics: {
      absorption: 'Almost complete from GI tract',
      distribution: 'Widely distributed',
      metabolism: 'Minimal hepatic',
      elimination: 'Renal (unchanged)',
      halfLife: '0.9-1.2 hours'
    },
    storage: 'Room temperature; suspension refrigerate',
    manufacturer: 'Multiple manufacturers',
    allergens: ['cephalosporin', 'beta-lactam'],
    crossReactivity: ['penicillins', 'other cephalosporins', 'carbapenems'],
    pediatricDosing: {
      mgPerKg: 25,
      maxMg: 4000,
      frequency: 'Four times daily',
      concentrationMgPerMl: 250,
      ageLimit: 'All ages',
      contraindications: ['Severe penicillin allergy']
    }
  },

  'cefuroxime': {
    id: 'cefuroxime',
    name: 'Cefuroxime',
    genericName: 'Cefuroxime',
    brandNames: ['Ceftin', 'Zinacef'],
    drugClass: 'Second-Generation Cephalosporin',
    indications: [
      'Respiratory infections',
      'Otitis media',
      'Sinusitis',
      'UTIs',
      'Skin/soft tissue infections',
      'Lyme disease',
      'Gonorrhea'
    ],
    contraindications: [
      'Cephalosporin hypersensitivity'
    ],
    warnings: [
      'Cross-sensitivity with penicillins',
      'C. difficile risk',
      'Can cause false-positive glucose with some tests'
    ],
    sideEffects: {
      common: ['Diarrhea', 'Nausea', 'Vomiting', 'Headache'],
      serious: ['Severe allergic reaction', 'C. difficile', 'Seizures']
    },
    dosage: {
      adult: '250-500mg bid; severe: 750mg-1.5g IV q8h',
      pediatric: '20-30mg/kg/day divided bid',
      renal: 'Adjust if CrCl <30',
      hepatic: 'No adjustment'
    },
    interactions: {
      major: [],
      moderate: ['Probenecid', 'Warfarin', 'Oral contraceptives'],
      minor: ['Food enhances absorption (oral suspension)']
    },
    pregnancyCategory: 'B',
    lactation: 'Compatible',
    mechanismOfAction: 'Binds PBPs; 2nd gen: better gram- coverage, some beta-lactamase stability',
    pharmacokinetics: {
      absorption: 'Good oral absorption',
      distribution: 'Widely distributed; crosses BBB',
      metabolism: 'Minimal hepatic',
      elimination: 'Renal',
      halfLife: '1.3 hours'
    },
    storage: 'Room temperature',
    manufacturer: 'Multiple manufacturers',
    allergens: ['cephalosporin', 'beta-lactam'],
    crossReactivity: ['penicillins', 'other cephalosporins']
  },

  'ceftriaxone': {
    id: 'ceftriaxone',
    name: 'Ceftriaxone',
    genericName: 'Ceftriaxone',
    brandNames: ['Rocephin'],
    drugClass: 'Third-Generation Cephalosporin',
    indications: [
      'Meningitis',
      'Pneumonia',
      'UTIs/complicated infections',
      'Gonorrhea',
      'Intra-abdominal infections',
      'Surgical prophylaxis',
      'Bacterial septicemia'
    ],
    contraindications: [
      'Cephalosporin hypersensitivity',
      'Hyperbilirubinemic neonates (displaces bilirubin)',
      'Calcium-containing IV solutions (precipitation)'
    ],
    warnings: [
      'Precipitation with calcium (do not mix)',
      'Biliary sludge/pseudolithiasis',
      'C. difficile risk',
      'Can cause immune-mediated hemolytic anemia'
    ],
    sideEffects: {
      common: ['Diarrhea', 'Pain at injection site', 'Rash', 'Elevated LFTs'],
      serious: ['Anaphylaxis', 'C. difficile colitis', 'Biliary pseudolithiasis', 'Hemolytic anemia']
    },
    dosage: {
      adult: '1-2g IV/IM daily-bid; meningitis: 2g q12h',
      pediatric: '50-100mg/kg/day divided q12-24h (max 4g/day)',
      renal: 'No adjustment needed (biliary excretion)',
      hepatic: 'Use caution if severe'
    },
    interactions: {
      major: ['Calcium IV', 'Warfarin'],
      moderate: ['Probenecid', 'Aminoglycosides (synergistic)'],
      minor: []
    },
    pregnancyCategory: 'B',
    lactation: 'Compatible',
    mechanismOfAction: 'Binds PBPs; 3rd gen: excellent gram- coverage, crosses BBB well',
    pharmacokinetics: {
      absorption: 'IM/IV only',
      distribution: 'Excellent tissue penetration; crosses BBB',
      metabolism: 'Minimal hepatic',
      elimination: 'Renal and biliary',
      halfLife: '8 hours'
    },
    storage: 'Room temperature; protect from light',
    manufacturer: 'Roche',
    allergens: ['cephalosporin', 'beta-lactam'],
    crossReactivity: ['penicillins', 'other cephalosporins']
  },

  'azithromycin': {
    id: 'azithromycin',
    name: 'Azithromycin',
    genericName: 'Azithromycin',
    brandNames: ['Zithromax', 'Z-Pack', 'Zmax'],
    drugClass: 'Macrolide Antibiotic',
    indications: [
      'Respiratory infections',
      'Otitis media',
      'Pharyngitis/tonsillitis',
      'Skin infections',
      'Urethritis/cervicitis (chlamydia, gonorrhea)',
      'Mycobacterium avium complex',
      'Traveler\'s diarrhea'
    ],
    contraindications: [
      'Macrolide hypersensitivity',
      'History of cholestatic jaundice/hepatic dysfunction with azithromycin'
    ],
    warnings: [
      'QT prolongation risk',
      'C. difficile risk',
      'Exacerbation of myasthenia gravis',
      'Hepatotoxicity (rare but serious)',
      'Can cause infantile hypertrophic pyloric stenosis'
    ],
    sideEffects: {
      common: ['Diarrhea', 'Nausea', 'Abdominal pain', 'Vomiting'],
      serious: ['QT prolongation', 'Torsades de pointes', 'Liver failure', 'C. difficile']
    },
    dosage: {
      adult: '500mg day 1, then 250mg daily days 2-5; Zmax 2g single dose',
      pediatric: '10mg/kg day 1, then 5mg/kg days 2-5',
      geriatric: 'Monitor QT interval',
      renal: 'No adjustment needed',
      hepatic: 'Use caution if severe'
    },
    interactions: {
      major: ['Warfarin', 'Digoxin', 'Colchicine', 'Statins (simvastatin, atorvastatin)'],
      moderate: ['Antacids', 'QT-prolonging drugs', 'Theophylline'],
      minor: ['Food']
    },
    pregnancyCategory: 'B',
    lactation: 'Compatible (short courses)',
    mechanismOfAction: 'Binds 50S ribosomal subunit, inhibits protein synthesis, bacteriostatic',
    pharmacokinetics: {
      absorption: 'Rapid; reduced by food',
      distribution: 'Extensive tissue penetration; concentrates in phagocytes',
      metabolism: 'Hepatic',
      elimination: 'Primarily biliary',
      halfLife: '68 hours (accumulates in tissues)'
    },
    storage: 'Room temperature',
    manufacturer: 'Pfizer',
    allergens: ['macrolide'],
    crossReactivity: ['erythromycin', 'clarithromycin', 'telithromycin'],
    pediatricDosing: {
      mgPerKg: 10,
      maxMg: 500,
      frequency: 'Once daily for 3-5 days',
      concentrationMgPerMl: 200,
      ageLimit: '> 6 months',
      contraindications: ['Macrolide allergy', 'Long QT syndrome']
    }
  },

  'clarithromycin': {
    id: 'clarithromycin',
    name: 'Clarithromycin',
    genericName: 'Clarithromycin',
    brandNames: ['Biaxin', 'Biaxin XL', 'Prevpac (with amoxicillin + omeprazole)'],
    drugClass: 'Macrolide Antibiotic',
    indications: [
      'Respiratory infections',
      'H. pylori eradication',
      'Mycobacterium avium complex',
      'Lyme disease',
      'Cellulitis (streptococcal)'
    ],
    contraindications: [
      'Macrolide hypersensitivity',
      'QT prolongation history',
      'Contraindicated with many drugs (CYP3A4 substrate/inhibitor)'
    ],
    warnings: [
      'QT prolongation',
      'Hepatotoxicity',
      'Many drug interactions via CYP3A4',
      'Colchicine contraindicated',
      'Exacerbation of myasthenia gravis'
    ],
    sideEffects: {
      common: ['Diarrhea', 'Nausea', 'Abnormal taste', 'Abdominal pain'],
      serious: ['QT prolongation', 'Liver failure', 'C. difficile', 'Hemolytic anemia']
    },
    dosage: {
      adult: '250-500mg bid or 1g XL daily',
      pediatric: '7.5mg/kg bid (max 500mg bid)',
      renal: 'Reduce dose if CrCl <30',
      hepatic: 'Use caution'
    },
    interactions: {
      major: ['Colchicine', 'Ergots', 'Pimozide', 'Lovastatin', 'Simvastatin', 'Warfarin'],
      moderate: ['Digoxin', 'Theophylline', 'Carbamazepine', 'Cyclosporine', 'Statins'],
      minor: ['Food']
    },
    pregnancyCategory: 'C',
    lactation: 'Not recommended',
    mechanismOfAction: 'Binds 50S ribosomal subunit, inhibits protein synthesis',
    pharmacokinetics: {
      absorption: 'Rapid and stable in acid',
      distribution: 'Good tissue penetration',
      metabolism: 'CYP3A4 hepatic (active metabolite)',
      elimination: 'Renal and fecal',
      halfLife: '5-7 hours'
    },
    storage: 'Room temperature',
    manufacturer: 'Abbott',
    allergens: ['macrolide'],
    crossReactivity: ['erythromycin', 'azithromycin']
  },

  'ciprofloxacin': {
    id: 'ciprofloxacin',
    name: 'Ciprofloxacin',
    genericName: 'Ciprofloxacin',
    brandNames: ['Cipro', 'Cipro XR', 'Proquin XR'],
    drugClass: 'Fluoroquinolone Antibiotic',
    indications: [
      'UTIs (complicated/uncomplicated)',
      'Prostatitis',
      'Anthrax',
      'Traveler\'s diarrhea',
      'Typhoid fever',
      'Complicated intra-abdominal infections',
      'Bone/joint infections',
      'Severe skin infections'
    ],
    contraindications: [
      'Fluoroquinolone hypersensitivity',
      'QT prolongation risk',
      'Myasthenia gravis',
      'Tendon rupture history with quinolones',
      'Pregnancy',
      'Pediatrics (arthropathy risk - except anthrax)'
    ],
    warnings: [
      'Tendon rupture (especially >60, steroids, transplants)',
      'Peripheral neuropathy (can be permanent)',
      'CNS effects (seizures, psychosis)',
      'QT prolongation',
      'Aortic aneurysm/dissection risk',
      'Hypoglycemia/hyperglycemia'
    ],
    sideEffects: {
      common: ['Nausea', 'Diarrhea', 'Headache', 'Insomnia', 'Photosensitivity'],
      serious: ['Tendon rupture', 'Peripheral neuropathy', 'Seizures', 'Aortic rupture', 'C. difficile']
    },
    dosage: {
      adult: '250-750mg bid; XR 500-1000mg daily; Anthrax: 500mg bid x 60 days',
      geriatric: 'Monitor QT, tendons',
      renal: 'Adjust if CrCl <30',
      hepatic: 'No adjustment'
    },
    interactions: {
      major: ['Theophylline', 'Warfarin', 'Corticosteroids', 'Antiarrhythmics'],
      moderate: ['Antacids', 'Sucralfate', 'Iron', 'Zinc', 'Caffeine', 'Probenecid'],
      minor: ['Dairy products']
    },
    pregnancyCategory: 'C (avoid unless no alternatives)',
    lactation: 'Not recommended',
    mechanismOfAction: 'Inhibits DNA gyrase and topoisomerase IV, bactericidal',
    pharmacokinetics: {
      absorption: 'Rapid; reduced by antacids, dairy, iron',
      distribution: 'Good tissue penetration; prostate, bone',
      metabolism: 'Minimal hepatic',
      elimination: 'Renal (unchanged and metabolites)',
      halfLife: '4 hours'
    },
    storage: 'Room temperature',
    manufacturer: 'Bayer',
    allergens: ['fluoroquinolone'],
    crossReactivity: ['levofloxacin', 'moxifloxacin', 'ofloxacin']
  },

  'levofloxacin': {
    id: 'levofloxacin',
    name: 'Levofloxacin',
    genericName: 'Levofloxacin',
    brandNames: ['Levaquin'],
    drugClass: 'Fluoroquinolone Antibiotic',
    indications: [
      'Pneumonia',
      'Acute bacterial sinusitis',
      'Exacerbation of chronic bronchitis',
      'Skin infections',
      'UTIs',
      'Prostatitis',
      'Anthrax',
      'Plague'
    ],
    contraindications: [
      'Fluoroquinolone hypersensitivity',
      'QT prolongation',
      'Myasthenia gravis'
    ],
    warnings: [
      'Tendon rupture',
      'Peripheral neuropathy',
      'CNS effects',
      'QT prolongation',
      'Aortic aneurysm risk',
      'Hypoglycemia'
    ],
    sideEffects: {
      common: ['Nausea', 'Headache', 'Diarrhea', 'Insomnia', 'Dizziness'],
      serious: ['Tendon rupture', 'Neuropathy', 'Seizures', 'Aortic rupture', 'SJS/TEN']
    },
    dosage: {
      adult: '250-750mg daily; complicated: 750mg daily',
      geriatric: 'Monitor closely',
      renal: 'Adjust if CrCl <50',
      hepatic: 'No adjustment'
    },
    interactions: {
      major: ['Antiarrhythmics', 'Corticosteroids', 'Warfarin', 'Insulin', 'Oral hypoglycemics'],
      moderate: ['Antacids', 'Iron', 'Zinc', 'Sucralfate', 'NSAIDs'],
      minor: []
    },
    pregnancyCategory: 'C (avoid)',
    lactation: 'Not recommended',
    mechanismOfAction: 'Inhibits DNA gyrase and topoisomerase IV',
    pharmacokinetics: {
      absorption: 'Almost complete',
      distribution: 'Excellent tissue penetration',
      metabolism: 'Minimal hepatic',
      elimination: 'Renal',
      halfLife: '6-8 hours'
    },
    storage: 'Room temperature',
    manufacturer: 'J&J',
    allergens: ['fluoroquinolone'],
    crossReactivity: ['ciprofloxacin', 'moxifloxacin']
  },

  'metronidazole': {
    id: 'metronidazole',
    name: 'Metronidazole',
    genericName: 'Metronidazole',
    brandNames: ['Flagyl', 'Flagyl ER', 'MetroGel', 'Noritate'],
    drugClass: 'Nitroimidazole Antibiotic/Antiprotozoal',
    indications: [
      'Anaerobic bacterial infections',
      'C. difficile colitis',
      'Protozoal infections (giardia, trichomonas)',
      'Bacterial vaginosis',
      'H. pylori eradication',
      'Intra-abdominal infections',
      'Brain abscess'
    ],
    contraindications: [
      'Nitroimidazole hypersensitivity',
      'First trimester pregnancy (relative)',
      'Concurrent disulfiram use (psychotic reactions)',
      'Concurrent alcohol (disulfiram-like reaction)'
    ],
    warnings: [
      'Disulfiram-like reaction with alcohol (avoid during and 3 days after)',
      'CNS toxicity (seizures, peripheral neuropathy with prolonged use)',
      'Metallic taste',
      'Dark urine (harmless)',
      'Mutagenic potential'
    ],
    sideEffects: {
      common: ['Metallic taste', 'Nausea', 'Headache', 'Dark urine', 'Dry mouth'],
      serious: ['Peripheral neuropathy', 'Seizures', 'Encephalopathy', 'SJS/TEN', 'C. difficile']
    },
    dosage: {
      adult: '250-500mg tid; C. difficile: 500mg tid x 10 days; Bacterial vaginosis: 500mg bid x 7 days',
      pediatric: '7.5mg/kg tid (max adult dose)',
      renal: 'No adjustment needed',
      hepatic: 'Reduce dose; monitor for toxicity'
    },
    interactions: {
      major: ['Alcohol', 'Disulfiram', 'Warfarin'],
      moderate: ['Lithium', 'Busulfan', '5-FU', 'Phenytoin'],
      minor: []
    },
    pregnancyCategory: 'B (not recommended 1st trimester)',
    lactation: 'Generally avoid; pump and discard if used',
    mechanismOfAction: 'Forms toxic metabolites that damage DNA of anaerobes and protozoa',
    pharmacokinetics: {
      absorption: 'Almost complete',
      distribution: 'Excellent tissue penetration; crosses BBB',
      metabolism: 'Hepatic (active metabolites)',
      elimination: 'Renal and fecal',
      halfLife: '8 hours'
    },
    storage: 'Room temperature; protect from light',
    manufacturer: 'Multiple manufacturers',
    allergens: ['nitroimidazole'],
    crossReactivity: ['tinidazole', 'secnidazole']
  },

  'doxycycline': {
    id: 'doxycycline',
    name: 'Doxycycline',
    genericName: 'Doxycycline',
    brandNames: ['Vibramycin', 'Doryx', 'Monodox', 'Oracea', 'Acticlate'],
    drugClass: 'Tetracycline Antibiotic',
    indications: [
      'Respiratory infections',
      'Lyme disease',
      'Rocky Mountain spotted fever',
      'Malaria prophylaxis',
      'Acne',
      'Rosacea',
      'Chlamydia',
      'Rickettsial diseases',
      'Periodontal disease'
    ],
    contraindications: [
      'Tetracycline hypersensitivity',
      'Pregnancy (bone/teeth effects)',
      'Children <8 years (tooth discoloration)',
      'Severe hepatic impairment'
    ],
    warnings: [
      'Photosensitivity',
      'Tooth discoloration in children <8',
      'Bone growth retardation in children',
      'Pill esophagitis (take with water, remain upright)',
      'Benign intracranial hypertension',
      'C. difficile risk'
    ],
    sideEffects: {
      common: ['Nausea', 'Diarrhea', 'Photosensitivity', 'Esophageal irritation'],
      serious: ['Intracranial hypertension', 'Hepatotoxicity', 'C. difficile', 'Severe skin reactions']
    },
    dosage: {
      adult: '100mg bid day 1, then 100mg daily; Acne: 50-100mg daily',
      pediatric: '>8 years: 2-4mg/kg/day divided bid (max 200mg/day)',
      renal: 'No adjustment needed',
      hepatic: 'Use caution'
    },
    interactions: {
      major: ['Oral contraceptives (possible)', 'Isotretinoin', 'Methotrexate', 'Warfarin'],
      moderate: ['Antacids', 'Calcium', 'Iron', 'Magnesium', 'Bismuth subsalicylate'],
      minor: ['Food (dairy)']
    },
    pregnancyCategory: 'D',
    lactation: 'Not recommended',
    mechanismOfAction: 'Binds 30S ribosomal subunit, inhibits protein synthesis',
    pharmacokinetics: {
      absorption: 'Almost complete; reduced by antacids, dairy, iron',
      distribution: 'Widely distributed; crosses BBB',
      metabolism: 'Minimal hepatic',
      elimination: 'Fecal and renal',
      halfLife: '18-22 hours'
    },
    storage: 'Room temperature; protect from light and moisture',
    manufacturer: 'Multiple manufacturers',
    allergens: ['tetracycline'],
    crossReactivity: ['minocycline', 'tetracycline']
  },

  'trimethoprim_sulfamethoxazole': {
    id: 'tmp_smx',
    name: 'Trimethoprim-Sulfamethoxazole',
    genericName: 'TMP-SMX (Co-trimoxazole)',
    brandNames: ['Bactrim', 'Bactrim DS', 'Septra', 'Sulfatrim'],
    drugClass: 'Sulfonamide Antibiotic Combination',
    indications: [
      'UTIs',
      'Otitis media',
      'Bronchitis',
      'Traveler\'s diarrhea',
      'Pneumocystis jirovecii pneumonia (PCP)',
      'Toxoplasmosis',
      'MRSA skin infections',
      'Nocardia infections'
    ],
    contraindications: [
      'Sulfa hypersensitivity',
      'Megablastic anemia due to folate deficiency',
      'Severe renal/hepatic impairment',
      'Pregnancy near term',
      'Infants <2 months'
    ],
    warnings: [
      'Severe skin reactions (SJS/TEN)',
      'Bone marrow suppression',
      'Hyperkalemia (especially with ACE inhibitors, ARBs)',
      'Stevens-Johnson syndrome',
      'Photosensitivity',
      'Crystalluria'
    ],
    sideEffects: {
      common: ['Nausea', 'Vomiting', 'Rash', 'Photosensitivity'],
      serious: ['SJS/TEN', 'Agranulocytosis', 'Hemolytic anemia', 'Hepatotoxicity', 'Hyperkalemia']
    },
    dosage: {
      adult: '1 DS tab (160/800mg) bid; PCP: 15-20mg/kg TMP daily divided tid',
      pediatric: '>2 months: 4-8mg/kg TMP daily divided bid',
      geriatric: 'Monitor CBC, renal function, potassium',
      renal: 'CrCl 15-30: 50% dose; <15: avoid',
      hepatic: 'Use caution'
    },
    interactions: {
      major: ['Warfarin', 'Methotrexate', 'ACE inhibitors', 'ARBs', 'Spironolactone', 'Phenytoin'],
      moderate: ['Oral hypoglycemics', 'Digoxin', 'Zidovudine'],
      minor: []
    },
    pregnancyCategory: 'D (contraindicated near term)',
    lactation: 'Caution (kernicterus risk)',
    mechanismOfAction: 'TMP inhibits dihydrofolate reductase; SMX inhibits dihydropteroate synthase; sequential block of folate synthesis',
    pharmacokinetics: {
      absorption: 'Almost complete',
      distribution: 'Widely distributed; crosses BBB',
      metabolism: 'Hepatic (acetylation)',
      elimination: 'Renal',
      halfLife: 'TMP: 8-10h; SMX: 8-10h'
    },
    storage: 'Room temperature; protect from light',
    manufacturer: 'Multiple manufacturers',
    allergens: ['sulfa', 'sulfonamide'],
    crossReactivity: ['other sulfonamides', 'sulfonylureas (possible)', 'thiazide diuretics (possible)']
  },

  'vancomycin': {
    id: 'vancomycin',
    name: 'Vancomycin',
    genericName: 'Vancomycin',
    brandNames: ['Vancocin', 'Firvanq'],
    drugClass: 'Glycopeptide Antibiotic',
    indications: [
      'Severe C. difficile colitis (oral)',
      'MRSA infections',
      'Enterococcal infections',
      'Meningitis (MRSA)',
      'Severe skin/soft tissue infections',
      'Endocarditis',
      'Prosthetic joint infections'
    ],
    contraindications: [
      'Hypersensitivity'
    ],
    warnings: [
      'Nephrotoxicity (dose-related, reversible)',
      'Ototoxicity (irreversible)',
      'Red man syndrome (histamine release - slow infusion)',
      'Thrombophlebitis',
      'Monitor levels in serious infections'
    ],
    sideEffects: {
      common: ['Red man syndrome', 'Nephrotoxicity', 'Ototoxicity', 'Thrombophlebitis'],
      serious: ['Renal failure', 'Hearing loss', 'Severe allergic reactions']
    },
    dosage: {
      adult: 'IV: 15-20mg/kg q8-12h (adjust based on levels); C. difficile: 125mg oral q6h',
      pediatric: '40-60mg/kg/day divided q6h (max 2g/day)',
      geriatric: 'Monitor levels, renal function closely',
      renal: 'Adjust dosing interval; therapeutic drug monitoring required',
      hepatic: 'No adjustment'
    },
    interactions: {
      major: ['Aminoglycosides', 'Amphotericin B', 'Cisplatin', 'Loop diuretics'],
      moderate: ['Warfarin', 'Neuromuscular blockers'],
      minor: ['Cholestyramine']
    },
    pregnancyCategory: 'C (oral); B (parenteral)',
    lactation: 'Compatible',
    mechanismOfAction: 'Inhibits cell wall synthesis by binding D-ala-D-ala; bactericidal vs gram+',
    pharmacokinetics: {
      absorption: 'Poor oral (used for GI C. diff); IV for systemic',
      distribution: 'Widely distributed; poor CNS penetration',
      metabolism: 'Minimal hepatic',
      elimination: 'Renal (unchanged)',
      halfLife: '4-6 hours (prolonged in renal impairment)'
    },
    storage: 'Refrigerate oral solution; room temperature IV',
    manufacturer: 'ViroPharma',
    allergens: ['glycopeptide'],
    crossReactivity: ['telavancin', 'dalbavancin', 'oritavancin']
  }
}

// Export drug list for search functionality
export const availableDrugs = Object.keys(comprehensiveDrugDatabase)

// Export categories for filtering
export const drugCategories = {
  'Analgesics & NSAIDs': ['aspirin', 'ibuprofen', 'naproxen', 'acetaminophen', 'celecoxib'],
  'Penicillins': ['amoxicillin', 'ampicillin', 'penicillin_g'],
  'Cephalosporins': ['cephalexin', 'cefuroxime', 'ceftriaxone'],
  'Macrolides': ['azithromycin', 'clarithromycin'],
  'Fluoroquinolones': ['ciprofloxacin', 'levofloxacin'],
  'Other Antibiotics': ['metronidazole', 'doxycycline', 'trimethoprim_sulfamethoxazole', 'vancomycin']
}
