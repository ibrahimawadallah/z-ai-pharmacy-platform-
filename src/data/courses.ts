export interface VideoResource {
  id: string
  title: string
  description: string
  duration: string
  source: string
}

export interface DiagramResource {
  url: string
  title: string
  description: string
}

export interface ModuleContent {
  id: number
  title: string
  icon: string
  color: string
  
  writtenContent: {
    introduction: string
    coreConcepts: string[]
    clinicalPearls: string[]
    warnings: string[]
  }
  
  undergraduate: {
    focus: string
    objectives: string[]
    keyPoints: string[]
    simplifiedExplanation: string
    memoryAids: string[]
  }
  
  postgraduate: {
    focus: string
    objectives: string[]
    keyPoints: string[]
    advancedConcepts: string
    evidenceBase: string[]
  }
  
  videos: VideoResource[]
  diagrams: DiagramResource[]
}

export interface CaseStudy {
  title: string
  patient: string
  presentation: string
  findings: string
  questions: string[]
  answers: string[]
}

export interface Course {
  id: string
  title: string
  shortTitle: string
  description: string
  icon: string
  color: string
  category: string
  totalModules: number
  duration: string
  level: string
  
  modules: ModuleContent[]
  
  caseStudies: {
    undergraduate: CaseStudy
    postgraduate: CaseStudy
  }
}

export const courses: Course[] = [
  // ==================== ANTIBIOTICS COURSE ====================
  {
    id: "antibiotics",
    title: "Antibiotics & Antimicrobials",
    shortTitle: "Antibiotics",
    description: "Comprehensive coverage of antimicrobial agents including classification, mechanisms, resistance, and clinical applications.",
    icon: "Pill",
    color: "emerald",
    category: "Infectious Disease",
    totalModules: 5,
    duration: "8 hours",
    level: "All Levels",
    modules: [
      {
        id: 1,
        title: "Introduction to Antibiotics & Classification",
        icon: "Pill",
        color: "emerald",
        writtenContent: {
          introduction: "Antibiotics are antimicrobial substances active against bacteria. They are the cornerstone of modern medicine, enabling complex surgical procedures, cancer chemotherapy, and management of infectious diseases. The discovery of penicillin by Alexander Fleming in 1928 revolutionized medicine and has saved countless lives since.",
          coreConcepts: [
            "Antibiotics target bacterial structures or processes that are absent or different in human cells",
            "The beta-lactam ring is the core structure of the largest class of antibiotics",
            "Spectrum of activity ranges from narrow (affecting few species) to broad (affecting many)",
            "Bactericidal antibiotics kill bacteria; bacteriostatic antibiotics inhibit growth",
            "Classification is based on chemical structure, mechanism of action, or spectrum of activity"
          ],
          clinicalPearls: [
            "Narrow spectrum antibiotics should be preferred when the pathogen is known to reduce resistance selection",
            "Beta-lactam antibiotics share the risk of cross-reactivity in allergic patients",
            "Time-dependent antibiotics require frequent dosing; concentration-dependent antibiotics can be dosed less frequently",
            "Combination therapy may provide synergy or prevent resistance emergence"
          ],
          warnings: [
            "Never use antibiotics for viral infections (common cold, most sore throats)",
            "Complete the full prescribed course even if symptoms improve",
            "Report any allergic reactions immediately",
            "Some antibiotics require dose adjustment in renal or hepatic impairment"
          ]
        },
        undergraduate: {
          focus: "What are antibiotics and how are they classified?",
          objectives: [
            "Define antibiotics and their role in medicine",
            "List major antibiotic classes (Beta-lactams, Macrolides, etc.)",
            "Understand bactericidal vs bacteriostatic",
            "Identify common antibiotics by class"
          ],
          keyPoints: [
            "Antibiotics are drugs that kill or inhibit bacterial growth",
            "Classification based on mechanism, spectrum, and chemical structure",
            "Beta-lactams: Penicillins, Cephalosporins, Carbapenems",
            "Non-beta-lactams: Macrolides, Aminoglycosides, Fluoroquinolones"
          ],
          simplifiedExplanation: "Think of antibiotics as 'smart bombs' that target specific parts of bacteria. The beta-lactam antibiotics (like penicillin) attack the bacterial cell wall - imagine trying to build a house without nails. Other antibiotics block the bacteria's ability to make proteins (like stopping a factory from producing goods) or copy DNA (like preventing blueprints from being copied).",
          memoryAids: [
            "Beta-lactams = 'Break Bacterial Walls' (Cell wall synthesis inhibitors)",
            "Aminoglycosides = 'Attack Ribosomes' (Protein synthesis - 30S)",
            "Macrolides = 'Make Ribosomes Lazy' (Protein synthesis - 50S)",
            "Fluoroquinolones = 'Foils DNA copying' (DNA gyrase inhibitors)"
          ]
        },
        postgraduate: {
          focus: "Rational selection based on spectrum, PK/PD, and resistance patterns",
          objectives: [
            "Analyze spectrum of activity for each class",
            "Apply PK/PD principles to antibiotic selection",
            "Evaluate resistance mechanisms by class",
            "Select appropriate empiric therapy based on local epidemiology"
          ],
          keyPoints: [
            "Time-dependent vs concentration-dependent killing",
            "T>MIC for beta-lactams, AUC/MIC for fluoroquinolones",
            "ESBL prevalence affects empiric selection",
            "De-escalation principles based on culture results"
          ],
          advancedConcepts: "Rational antibiotic selection requires integration of multiple factors: the likely pathogen(s) based on infection site and patient factors, local resistance patterns, antibiotic PK/PD properties, drug-drug interactions, and patient-specific factors (renal function, allergies, immune status). The concept of 'antibiotic stewardship' emphasizes using the right drug, at the right dose, for the right duration.",
          evidenceBase: [
            "IDSA guidelines recommend empiric therapy based on local susceptibility patterns",
            "Multiple studies show that appropriate empiric therapy reduces mortality in sepsis",
            "De-escalation based on culture results does not increase adverse outcomes",
            "Shorter antibiotic courses are non-inferior for many infections (STOP-IT trial)"
          ]
        },
        videos: [
          { id: "gqoqexfqoBM", title: "Antibiotic Classes in 7 Minutes", description: "Quick overview of antibiotic classes", duration: "7:00", source: "Dr. Matt & Dr. Mike" },
          { id: "SzJbAGbOcHI", title: "Penicillins: Nursing Pharmacology", description: "Comprehensive overview of penicillins", duration: "12:30", source: "Osmosis" },
          { id: "UTRQYnQvGeA", title: "Beta-lactam Antibiotics Mechanism", description: "Molecular mechanism explained", duration: "8:45", source: "Khan Academy" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Antibiotics_coverage_diagram.jpg/800px-Antibiotics_coverage_diagram.jpg", title: "Antibiotics Coverage Diagram", description: "Visual representation of antibiotic coverage" },
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Antibiotics_action.svg/800px-Antibiotics_action.svg.png", title: "Antibiotics Mechanism of Action", description: "Targets in bacterial cell" }
        ]
      },
      {
        id: 2,
        title: "Mechanism of Action (MOA)",
        icon: "Activity",
        color: "blue",
        writtenContent: {
          introduction: "Understanding the mechanism of action (MOA) of antibiotics is fundamental to rational prescribing. Antibiotics exploit structural and biochemical differences between bacteria and human cells, targeting processes essential for bacterial survival.",
          coreConcepts: [
            "Cell wall synthesis inhibitors prevent peptidoglycan cross-linking",
            "Protein synthesis inhibitors target bacterial ribosomes (70S) which differ from human ribosomes (80S)",
            "DNA synthesis inhibitors target bacterial DNA gyrase and topoisomerase IV",
            "Folate synthesis inhibitors block nucleotide precursor production",
            "Membrane disruptors alter bacterial membrane permeability"
          ],
          clinicalPearls: [
            "Beta-lactams require actively dividing bacteria to be effective",
            "Aminoglycosides require oxygen for uptake - ineffective against anaerobes",
            "Fluoroquinolones have excellent tissue penetration including bone and prostate",
            "Macrolides have anti-inflammatory properties beyond antimicrobial effects"
          ],
          warnings: [
            "Concurrent use of bacteriostatic and bactericidal antibiotics may be antagonistic",
            "Some mechanisms are associated with specific toxicity profiles",
            "Resistance can develop through single point mutations"
          ]
        },
        undergraduate: {
          focus: "How do antibiotics kill or inhibit bacteria?",
          objectives: [
            "Explain cell wall synthesis inhibition",
            "Understand protein synthesis inhibition",
            "Describe DNA/RNA synthesis interference",
            "Visualize each mechanism simply"
          ],
          keyPoints: [
            "Cell wall inhibitors: Beta-lactams, Vancomycin",
            "Protein synthesis: Aminoglycosides (30S), Macrolides (50S)",
            "DNA synthesis: Fluoroquinolones",
            "Folate synthesis: Sulfonamides, Trimethoprim"
          ],
          simplifiedExplanation: "Imagine bacteria as tiny factories. Each antibiotic class attacks a different part: beta-lactams destroy the factory walls, aminoglycosides and macrolides jam the production lines (ribosomes), fluoroquinolones break the blueprint copying machines (DNA replication).",
          memoryAids: [
            "30S = 'Three-Zero-S' = Aminoglycosides, Tetracyclines",
            "50S = 'Five-Zero-S' = Macrolides, Chloramphenicol, Clindamycin",
            "DNA synthesis = 'Double-Strand' inhibitors"
          ]
        },
        postgraduate: {
          focus: "Molecular targets, binding sites, and structure-activity relationships",
          objectives: [
            "Detail molecular binding sites for each class",
            "Analyze structure-activity relationships (SAR)",
            "Understand PBP affinity variations",
            "Apply MOA knowledge to predict drug interactions"
          ],
          keyPoints: [
            "PBP binding affinity varies among beta-lactams",
            "Ribosomal subunit specificity determines spectrum",
            "DNA gyrase vs topoisomerase IV targeting",
            "Synergistic combinations based on MOA"
          ],
          advancedConcepts: "At the molecular level, antibiotic-target interactions involve specific binding to enzymatic active sites. Beta-lactams mimic D-Ala-D-Ala, the natural substrate of transpeptidases. Understanding these interactions explains resistance mechanisms and guides combination therapy.",
          evidenceBase: [
            "PBP binding studies correlate with in vitro activity",
            "Structural biology reveals quinolone binding to gyrase-DNA complex",
            "Aminoglycoside-ribosome crystal structures explain resistance mutations"
          ]
        },
        videos: [
          { id: "UTRQYnQvGeA", title: "Beta-lactam Antibiotics Mechanism", description: "Detailed molecular explanation", duration: "8:45", source: "Khan Academy" },
          { id: "QNp7SUcDYRM", title: "DNA Synthesis Inhibitors", description: "Metronidazole and others", duration: "6:20", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Antibiotics_action.svg/800px-Antibiotics_action.svg.png", title: "Antibiotic Targets", description: "All major targets in bacterial cell" }
        ]
      },
      {
        id: 3,
        title: "Antibiotic Resistance",
        icon: "AlertTriangle",
        color: "red",
        writtenContent: {
          introduction: "Antimicrobial resistance (AMR) is one of the greatest threats to global health. The WHO has declared AMR a top-ten global public health threat. Resistance occurs when bacteria evolve mechanisms to survive exposure to antibiotics.",
          coreConcepts: [
            "Intrinsic resistance: Natural properties of bacteria that prevent antibiotic action",
            "Acquired resistance: Genetic changes through mutation or horizontal gene transfer",
            "Enzymatic inactivation: Beta-lactamases, aminoglycoside-modifying enzymes",
            "Target modification: Altered PBPs, ribosomal methylation, DNA gyrase mutations",
            "Efflux pumps: Active transport of antibiotics out of the bacterial cell"
          ],
          clinicalPearls: [
            "MRSA has altered PBP2a with low affinity for all beta-lactams",
            "ESBLs hydrolyze third-generation cephalosporins and monobactams",
            "Carbapenemases (KPC, NDM-1) can inactivate nearly all beta-lactams",
            "Vancomycin resistance (VRE) involves altered peptidoglycan precursors"
          ],
          warnings: [
            "Inappropriate antibiotic use drives resistance selection",
            "Prior antibiotic exposure is a major risk factor for resistant infections",
            "Few new antibiotics are in development for gram-negative infections"
          ]
        },
        undergraduate: {
          focus: "What is antibiotic resistance and why does it matter?",
          objectives: [
            "Define antibiotic resistance",
            "Understand how resistance develops",
            "Identify common resistant organisms",
            "Learn basic prevention strategies"
          ],
          keyPoints: [
            "Resistance = bacteria survive despite antibiotics",
            "Causes: Overuse, incomplete courses, agricultural use",
            "MRSA, VRE, ESBL-producers are major concerns",
            "Prevention: Appropriate prescribing, infection control"
          ],
          simplifiedExplanation: "Think of antibiotic resistance like an arms race. When we use antibiotics, bacteria that survive are the ones with 'shields' (resistance mechanisms). These survivors multiply and spread their 'shield' genes to other bacteria.",
          memoryAids: [
            "MRSA = Methicillin-Resistant Staphylococcus Aureus",
            "VRE = Vancomycin-Resistant Enterococcus",
            "ESBL = Extended-Spectrum Beta-Lactamase"
          ]
        },
        postgraduate: {
          focus: "Resistance mechanisms, molecular basis, and stewardship principles",
          objectives: [
            "Detail enzymatic resistance mechanisms",
            "Understand efflux pumps and porin mutations",
            "Apply stewardship principles clinically",
            "Interpret resistance patterns for treatment decisions"
          ],
          keyPoints: [
            "ESBL: Extended-spectrum beta-lactamases",
            "AmpC and carbapenemase production",
            "mcr-1 gene for colistin resistance",
            "Pharmacodynamic optimization to overcome resistance"
          ],
          advancedConcepts: "Resistance mechanisms can be enzymatic (beta-lactamases), target-based (PBP alterations), permeability-based (porin loss, efflux pumps), or bypass mechanisms. Understanding the molecular basis enables prediction of cross-resistance patterns and selection of appropriate therapy.",
          evidenceBase: [
            "WHO AWaRe classification promotes appropriate antibiotic use",
            "Antibiotic stewardship programs reduce resistance rates",
            "Rapid diagnostic testing enables earlier appropriate therapy"
          ]
        },
        videos: [
          { id: "ReKG-vuYHY4", title: "Mechanisms of Antibiotic Resistance", description: "How bacteria develop resistance", duration: "10:15", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/How_do_different_antibiotics_work%3F.png/800px-How_do_different_antibiotics_work%3F.png", title: "Resistance Mechanisms", description: "Visual overview of resistance" }
        ]
      },
      {
        id: 4,
        title: "Pharmacokinetics & Pharmacodynamics (PK/PD)",
        icon: "Microscope",
        color: "purple",
        writtenContent: {
          introduction: "Pharmacokinetics (PK) describes what the body does to the drug - absorption, distribution, metabolism, and excretion. Pharmacodynamics (PD) describes what the drug does to the body - the relationship between drug concentration and effect.",
          coreConcepts: [
            "ADME: Absorption, Distribution, Metabolism, Excretion",
            "Bioavailability: Fraction of drug reaching systemic circulation",
            "Volume of distribution: Extent of drug distribution into tissues",
            "Half-life: Time for concentration to decrease by 50%",
            "Clearance: Volume of blood cleared of drug per unit time"
          ],
          clinicalPearls: [
            "Time-dependent killing: Keep free drug concentration above MIC (T>MIC)",
            "Concentration-dependent killing: Maximize peak concentration (Cmax/MIC)",
            "AUC/MIC: Area under curve relative to MIC (fluoroquinolones, vancomycin)",
            "Protein binding affects free drug concentration at infection site"
          ],
          warnings: [
            "Renal impairment requires dose adjustment for many antibiotics",
            "Hepatic dysfunction affects metabolism of some agents",
            "Obesity may require adjusted dosing"
          ]
        },
        undergraduate: {
          focus: "How does the body handle antibiotics?",
          objectives: [
            "Understand ADME basics",
            "Learn about dosing intervals",
            "Understand oral vs IV administration",
            "Know importance of completing courses"
          ],
          keyPoints: [
            "Absorption varies by drug and route",
            "Distribution affected by protein binding",
            "Metabolism: Some drugs need adjustment",
            "Elimination: Renal/hepatic clearance important"
          ],
          simplifiedExplanation: "When you take an antibiotic, it goes on a journey through your body: absorption, distribution to the infection site, metabolism, and elimination. This journey determines how much drug reaches the bacteria and how often you need to take it.",
          memoryAids: [
            "ADME = Absorption, Distribution, Metabolism, Excretion",
            "T>MIC = Time above MIC for beta-lactams",
            "Cmax/MIC = Concentration matters for aminoglycosides"
          ]
        },
        postgraduate: {
          focus: "PK/PD modeling, dosing optimization, and therapeutic drug monitoring",
          objectives: [
            "Apply PK/PD indices to optimize dosing",
            "Calculate loading and maintenance doses",
            "Implement therapeutic drug monitoring",
            "Adjust doses for organ dysfunction"
          ],
          keyPoints: [
            "T>MIC: Time above MIC (beta-lactams)",
            "Cmax/MIC: Peak concentration (aminoglycosides)",
            "AUC/MIC: Area under curve (fluoroquinolones, vancomycin)",
            "Extended/continuous infusion strategies"
          ],
          advancedConcepts: "PK/PD optimization involves matching antibiotic exposure to bacterial susceptibility. For time-dependent drugs, extended infusions maximize T>MIC. Monte Carlo simulations can predict probability of target attainment for different dosing regimens.",
          evidenceBase: [
            "Extended infusion piperacillin-tazobactam improves outcomes in severe infections",
            "Once-daily aminoglycoside dosing is as effective and less toxic",
            "Vancomycin AUC-guided dosing reduces nephrotoxicity"
          ]
        },
        videos: [
          { id: "SzJbAGbOcHI", title: "Penicillins: Pharmacology and Dosing", description: "PK/PD considerations", duration: "12:30", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Antibiotics_coverage_diagram.jpg/800px-Antibiotics_coverage_diagram.jpg", title: "Coverage and Dosing", description: "PK/PD considerations" }
        ]
      },
      {
        id: 5,
        title: "Clinical Applications & Guidelines",
        icon: "Stethoscope",
        color: "teal",
        writtenContent: {
          introduction: "Clinical application of antibiotic knowledge requires integrating microbiology, pharmacology, and patient factors. Evidence-based guidelines from organizations like IDSA provide frameworks for diagnosis and treatment.",
          coreConcepts: [
            "Empiric therapy: Treatment before pathogen identification",
            "Targeted therapy: Treatment based on culture and sensitivity results",
            "De-escalation: Narrowing spectrum based on culture results",
            "Duration of therapy: Balancing cure with resistance prevention",
            "Combination therapy: Synergy, broadening spectrum, preventing resistance"
          ],
          clinicalPearls: [
            "Sepsis: Start broad-spectrum antibiotics within 1 hour of recognition",
            "Community-acquired pneumonia: Consider local resistance patterns",
            "UTI: Nitrofurantoin for uncomplicated cystitis, avoid fluoroquinolones",
            "Skin infections: Consider MRSA coverage in appropriate settings"
          ],
          warnings: [
            "Clinical response may lag behind microbiological response",
            "Some infections require prolonged therapy (endocarditis, osteomyelitis)",
            "Consider alternative diagnoses if no response to appropriate therapy"
          ]
        },
        undergraduate: {
          focus: "When do we use which antibiotic?",
          objectives: [
            "Match common infections to first-line antibiotics",
            "Understand empiric vs targeted therapy",
            "Know common side effects",
            "Learn basic drug interactions"
          ],
          keyPoints: [
            "URI: Often viral, avoid antibiotics",
            "UTI: Nitrofurantoin, TMP-SMX first-line",
            "Skin infections: Cephalexin, Dicloxacillin",
            "Pneumonia: Amoxicillin, Azithromycin"
          ],
          simplifiedExplanation: "Choosing the right antibiotic is like matching a key to a lock. For each type of infection, there's a 'first-choice' antibiotic that usually works best. Always consider: what's the likely bacteria? What antibiotic reaches that site? Is the patient allergic?",
          memoryAids: [
            "URI = Usually viral, Resist prescribing",
            "UTI = Use Nitrofurantoin Initially",
            "Sepsis = Start antibiotics Speedily"
          ]
        },
        postgraduate: {
          focus: "Evidence-based guidelines, complex cases, and antimicrobial stewardship",
          objectives: [
            "Apply IDSA guidelines to complex cases",
            "Manage polymicrobial infections",
            "Navigate antibiotic shortages",
            "Implement stewardship interventions"
          ],
          keyPoints: [
            "Community-acquired vs healthcare-associated infections",
            "Sepsis bundles and timing of antibiotics",
            "Combination therapy for synergy",
            "Antibiotic cycling and restriction policies"
          ],
          advancedConcepts: "Modern antimicrobial stewardship integrates multiple strategies: prospective audit and feedback, formulary restriction, clinical pathways, dose optimization, IV-to-PO conversion, and duration optimization. The 'Five Ds': Right Diagnosis, Right Drug, Right Dose, Right Duration, Right De-escalation.",
          evidenceBase: [
            "IDSA guidelines provide evidence-based recommendations",
            "Surviving Sepsis Campaign: Antibiotics within 1 hour",
            "Shorter courses are non-inferior for many infections"
          ]
        },
        videos: [
          { id: "gqoqexfqoBM", title: "Antibiotic Classes and Clinical Use", description: "Clinical overview", duration: "7:00", source: "Dr. Matt & Dr. Mike" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Antibiotics_coverage_diagram.jpg/800px-Antibiotics_coverage_diagram.jpg", title: "Coverage Guide", description: "Quick reference for selection" }
        ]
      }
    ],
    caseStudies: {
      undergraduate: {
        title: "Community-Acquired Pneumonia",
        patient: "Sarah, 45-year-old female",
        presentation: "3-day history of fever (38.5°C), productive cough with yellow sputum, right-sided pleuritic chest pain, and shortness of breath.",
        findings: "BP 120/80, HR 98, RR 22, SpO2 94%. Crackles in right lower lobe. WBC 14,000. CXR shows right lower lobe consolidation.",
        questions: ["What is the most likely diagnosis?", "Which antibiotics are appropriate for outpatient treatment?", "What patient education is needed?"],
        answers: ["Community-acquired pneumonia (CAP) - typical presentation", "First-line: Amoxicillin 1g TDS OR Doxycycline 100mg BD", "Complete full course (5-7 days), rest, hydration, return if worsening"]
      },
      postgraduate: {
        title: "Healthcare-Associated Pneumonia with Comorbidities",
        patient: "Mr. Johnson, 72-year-old male",
        presentation: "Fever and altered mental status 5 days after hip replacement. History of COPD, Type 2 DM, CKD (eGFR 45). Recent hospitalization 3 months ago.",
        findings: "BP 100/60, HR 110, RR 28, SpO2 88%. Confused. WBC 18,000, Cr 1.8, Lactate 2.5. CT shows bilateral consolidations.",
        questions: ["What is the risk stratification and likely pathogens?", "Design an empiric antibiotic regimen.", "What PK/PD considerations apply?"],
        answers: ["HCAP with high mortality risk. Likely MDR: Pseudomonas, MRSA, ESBL-producers", "Pip-tazo 4.5g q6h + Vancomycin targeting AUC 400-600 ± Tobramycin", "Reduce doses for CrCl, consider extended infusion piperacillin-tazobactam"]
      }
  }
  },

  // ==================== CARDIOVASCULAR COURSE ====================
  {
    id: "cardiovascular",
    title: "Cardiovascular Pharmacology",
    shortTitle: "Cardiovascular",
    description: "Complete coverage of cardiovascular drugs including antihypertensives, antianginals, heart failure medications, anticoagulants, and antiarrhythmics.",
    icon: "Heart",
    color: "rose",
    category: "Cardiovascular",
    totalModules: 5,
    duration: "10 hours",
    level: "All Levels",
    modules: [
      {
        id: 1,
        title: "Antihypertensive Agents",
        icon: "Activity",
        color: "rose",
        writtenContent: {
          introduction: "Hypertension affects over 1 billion people worldwide and is a major risk factor for cardiovascular disease. Antihypertensive therapy has been proven to reduce the risk of stroke, myocardial infarction, heart failure, and kidney disease. Multiple drug classes target different aspects of blood pressure regulation.",
          coreConcepts: [
            "RAAS inhibitors: ACE inhibitors and ARBs reduce angiotensin II effects",
            "Calcium channel blockers: Reduce vascular smooth muscle contraction",
            "Diuretics: Reduce blood volume through increased sodium and water excretion",
            "Beta-blockers: Reduce cardiac output and renin release",
            "Alpha-blockers, vasodilators: Direct vascular effects"
          ],
          clinicalPearls: [
            "First-line for most patients: ACEi/ARB, CCB, or thiazide diuretic",
            "ACEi and ARBs are contraindicated in pregnancy and bilateral renal artery stenosis",
            "Thiazide diuretics can cause hyponatremia, hypokalemia, hyperuricemia",
            "Beta-blockers are no longer first-line for uncomplicated hypertension"
          ],
          warnings: [
            "Never stop beta-blockers abruptly - risk of rebound hypertension",
            "ACE inhibitors can cause angioedema and cough",
            "Monitor electrolytes with diuretics and ACEi/ARBs",
            "CCBs can cause significant edema"
          ]
        },
        undergraduate: {
          focus: "What are the main classes of antihypertensive drugs?",
          objectives: [
            "List major antihypertensive drug classes",
            "Understand basic mechanism of each class",
            "Know common side effects",
            "Identify first-line agents"
          ],
          keyPoints: [
            "ACE inhibitors: '-prils' (lisinopril, enalapril)",
            "ARBs: '-sartans' (losartan, valsartan)",
            "CCBs: Amlodipine, nifedipine, diltiazem",
            "Diuretics: Hydrochlorothiazide, chlorthalidone"
          ],
          simplifiedExplanation: "Blood pressure is controlled by three main factors: how hard the heart pumps, how constricted the blood vessels are, and how much fluid is in the blood. Each drug class targets one of these: beta-blockers slow the heart, ACEi/ARBs and CCBs relax blood vessels, and diuretics remove excess fluid.",
          memoryAids: [
            "ACEi = '-prils' (All Cause Enzyme inhibition)",
            "ARBs = '-sartans' (At Receptor Block)",
            "CCB = Calcium Channels Blocked",
            "'ABCD' = ACEi/ARB, Beta-blocker, CCB, Diuretic"
          ]
        },
        postgraduate: {
          focus: "Individualized antihypertensive therapy based on comorbidities",
          objectives: [
            "Select appropriate agents based on patient comorbidities",
            "Manage resistant hypertension",
            "Understand compelling indications for specific drug classes",
            "Apply latest guideline recommendations"
          ],
          keyPoints: [
            "Diabetes with proteinuria: ACEi or ARB preferred",
            "Post-MI: Beta-blocker + ACEi",
            "Heart failure with reduced EF: ACEi/ARB/ARNI + beta-blocker + MRA",
            "Resistant HTN: Add spironolactone"
          ],
          advancedConcepts: "The choice of antihypertensive should be individualized based on compelling indications, contraindications, and anticipated side effects. The 2017 ACC/AHA guidelines emphasize BP targets <130/80 for most adults. PATHWAY-2 trial established spironolactone as the most effective add-on for resistant hypertension.",
          evidenceBase: [
            "SPRINT trial: Intensive BP control reduces cardiovascular events",
            "ASCOT: ACEi + CCB superior to beta-blocker + diuretic",
            "PATHWAY-2: Spironolactone most effective for resistant HTN"
          ]
        },
        videos: [
          { id: "2Z9mC5WJi9I", title: "Antihypertensive Drugs - Overview", description: "Comprehensive overview of antihypertensive classes", duration: "15:00", source: "Osmosis" },
          { id: "bJ7Y1pObknA", title: "ACE Inhibitors Mechanism", description: "How ACE inhibitors work", duration: "8:30", source: "Ninja Nerd" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Blood_pressure_control_loop.png/800px-Blood_pressure_control_loop.png", title: "Blood Pressure Regulation", description: "Physiological control mechanisms" }
        ]
      },
      {
        id: 2,
        title: "Heart Failure Medications",
        icon: "Heart",
        color: "red",
        writtenContent: {
          introduction: "Heart failure affects over 26 million people globally. Modern pharmacotherapy has dramatically improved outcomes, with multiple drug classes providing mortality and morbidity benefits. The four pillars of HFrEF therapy are ACEi/ARB/ARNI, beta-blockers, MRAs, and SGLT2 inhibitors.",
          coreConcepts: [
            "ACE inhibitors/ARBs/ARNIs: Reduce afterload and remodeling",
            "Beta-blockers: Reduce heart rate and improve outcomes",
            "Mineralocorticoid receptor antagonists: Reduce fibrosis and mortality",
            "SGLT2 inhibitors: Novel mechanism with proven mortality benefit",
            "Diuretics: Symptomatic relief from congestion"
          ],
          clinicalPearls: [
            "Start low and go slow with beta-blockers in HF",
            "ARNIs (sacubitril-valsartan) superior to ACEi alone",
            "SGLT2 inhibitors benefit HF regardless of diabetes status",
            "Hydralazine-nitrates for self-identified African Americans"
          ],
          warnings: [
            "Avoid abrupt beta-blocker withdrawal",
            "Monitor potassium with ACEi/ARB/MRA combinations",
            "Adjust doses for renal function",
            "Avoid NSAIDs and thiazolidinediones in HF"
          ]
        },
        undergraduate: {
          focus: "What drugs are used to treat heart failure?",
          objectives: [
            "List the main drug classes for heart failure",
            "Understand basic mechanism of each class",
            "Know which drugs improve mortality",
            "Identify common side effects"
          ],
          keyPoints: [
            "ACE inhibitors: Reduce mortality, improve symptoms",
            "Beta-blockers: Carvedilol, metoprolol succinate, bisoprolol",
            "Diuretics: Furosemide for symptom relief",
            "Digoxin: Symptom control, no mortality benefit"
          ],
          simplifiedExplanation: "Heart failure is like a weak pump that can't keep up with demand. Medications help by: reducing the workload (ACEi, ARBs), slowing the heart so it fills better (beta-blockers), removing excess fluid (diuretics), and preventing further damage (MRAs, SGLT2i).",
          memoryAids: [
            "'ABCD' for HF: ACEi, Beta-blocker, Cardiac glycoside, Diuretic",
            "'GET MAD' = G: Gentility (kind), E: Exercise, T: Treatment, M: Medications, A: ACEi, D: Diuretics",
            "Proven mortality benefit: ACEi/ARB/ARNI, BB, MRA, SGLT2i"
          ]
        },
        postgraduate: {
          focus: "Guideline-directed medical therapy for HFrEF and HFpEF",
          objectives: [
            "Implement guideline-directed medical therapy (GDMT)",
            "Understand device therapy indications",
            "Manage acute decompensated HF",
            "Apply evidence from landmark trials"
          ],
          keyPoints: [
            "Four pillars: ACEi/ARNI + BB + MRA + SGLT2i",
            "Target doses from clinical trials",
            "Device therapy: ICD, CRT-D for eligible patients",
            "Advanced therapies: LVAD, transplant"
          ],
          advancedConcepts: "Modern HF therapy requires simultaneous initiation and uptitration of multiple drug classes. The 2022 AHA/ACC/HFSA guidelines recommend initiating all four pillars before hospital discharge. PARADIGM-HF established sacubitril-valsartan as superior to enalapril. DAPA-HF and EMPEROR-Reduced established SGLT2 inhibitors for HFrEF regardless of diabetes status.",
          evidenceBase: [
            "PARADIGM-HF: ARNI superior to ACEi",
            "DAPA-HF, EMPEROR-Reduced: SGLT2i reduce mortality in HFrEF",
            "MERIT-HF, COPERNICUS: Beta-blockers reduce mortality",
            "EMPHASIS-HF: MRA reduces mortality in mild HF"
          ]
        },
        videos: [
          { id: "A8-p2wzQ0D0", title: "Heart Failure Pharmacology", description: "Comprehensive HF medications", duration: "18:00", source: "Osmosis" },
          { id: "vQr1YGRBkYk", title: "SGLT2 Inhibitors in Heart Failure", description: "Novel mechanism and benefits", duration: "12:00", source: "Medicosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Heart_failure_ventricular_remodeling.png/800px-Heart_failure_ventricular_remodeling.png", title: "Ventricular Remodeling", description: "How HF medications affect remodeling" }
        ]
      },
      {
        id: 3,
        title: "Anticoagulants & Antiplatelets",
        icon: "Droplet",
        color: "blue",
        writtenContent: {
          introduction: "Antithrombotic therapy is essential for preventing and treating thromboembolic disorders. Anticoagulants inhibit the coagulation cascade, while antiplatelets inhibit platelet aggregation. Understanding the indications, monitoring, and reversal strategies is critical for safe prescribing.",
          coreConcepts: [
            "Vitamin K antagonists: Warfarin inhibits synthesis of factors II, VII, IX, X",
            "Direct oral anticoagulants: Direct factor Xa or thrombin inhibition",
            "Heparins: Antithrombin-mediated factor Xa and thrombin inhibition",
            "Antiplatelets: Aspirin, P2Y12 inhibitors, GPIIb/IIIa inhibitors",
            "Reversal agents: Vitamin K, PCC, idarucizumab, andexanet alfa"
          ],
          clinicalPearls: [
            "DOACs preferred over warfarin for most indications except mechanical valves",
            "LMWH preferred in pregnancy (does not cross placenta)",
            "Triple therapy (anticoagulant + DAPT) increases bleeding risk",
            "Bridging may be needed when stopping warfarin for procedures"
          ],
          warnings: [
            "Warfarin has many drug interactions",
            "DOACs need dose adjustment for renal function",
            "Heparin can cause HIT - monitor platelets",
            "Bleeding risk assessment essential before starting"
          ]
        },
        undergraduate: {
          focus: "What are the main anticoagulant and antiplatelet drugs?",
          objectives: [
            "Distinguish anticoagulants from antiplatelets",
            "List major drug classes and examples",
            "Understand basic monitoring requirements",
            "Know common indications"
          ],
          keyPoints: [
            "Warfarin: INR monitoring, vitamin K antagonist",
            "DOACs: Apixaban, rivaroxaban, dabigatran, edoxaban",
            "Heparin: aPTT monitoring, LMWH no monitoring needed",
            "Antiplatelets: Aspirin, clopidogrel, ticagrelor"
          ],
          simplifiedExplanation: "Blood clots form through two main processes: platelet clumping and the coagulation cascade. Antiplatelets (aspirin, clopidogrel) stop platelets from clumping - like preventing cars from traffic jamming. Anticoagulants (warfarin, heparin, DOACs) stop the clotting cascade - like preventing road construction materials from arriving.",
          memoryAids: [
            "Warfarin = 'Wants INR Regularly' - needs monitoring",
            "DOACs = Direct Oral Anticoagulants",
            "Antiplatelets for Arterial, Anticoagulants for Venous",
            "'CHADSVASc' for stroke risk in atrial fibrillation"
          ]
        },
        postgraduate: {
          focus: "Optimal antithrombotic selection, monitoring, and management",
          objectives: [
            "Select appropriate antithrombotic based on indication",
            "Manage periprocedural anticoagulation",
            "Treat bleeding and overdose",
            "Navigate complex antithrombotic combinations"
          ],
          keyPoints: [
            "AF: DOAC preferred, warfarin for mechanical valves",
            "VTE: DOAC or warfarin, LMWH for cancer-associated",
            "ACS: DAPT duration based on bleeding/ischemic risk",
            "Procedures: Bridge if high thrombotic risk"
          ],
          advancedConcepts: "The choice of antithrombotic requires balancing thrombotic and bleeding risks. DOACs have transformed management by eliminating routine monitoring for most patients. Reversal strategies have evolved with specific antidotes (idarucizumab for dabigatran, andexanet alfa for factor Xa inhibitors). The PRACTICAL and AUGUSTUS trials inform combination antithrombotic strategies.",
          evidenceBase: [
            "RE-LY, ROCKET-AF, ARISTOTLE: DOACs non-inferior/superior to warfarin",
            "COMPARE-AF: Apixaban has lowest bleeding risk",
            "AUGUSTUS: Apixaban + P2Y12 inhibitor safer than triple therapy"
          ]
        },
        videos: [
          { id: "f8w1q-dJhYA", title: "Anticoagulants Made Easy", description: "Overview of anticoagulant classes", duration: "14:00", source: "Osmosis" },
          { id: "I_h8VwZvkdA", title: "Antiplatelet Drugs", description: "Aspirin and P2Y12 inhibitors", duration: "11:00", source: "Ninja Nerd" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Coagulation_full.svg/800px-Coagulation_full.svg.png", title: "Coagulation Cascade", description: "Full cascade with drug targets" }
        ]
      },
      {
        id: 4,
        title: "Antiarrhythmic Agents",
        icon: "Zap",
        color: "yellow",
        writtenContent: {
          introduction: "Antiarrhythmic drugs are classified by the Vaughan-Williams system based on their primary electrophysiological effect. While drugs play an important role, catheter ablation has become first-line therapy for many arrhythmias. Understanding drug mechanisms, indications, and proarrhythmic risks is essential.",
          coreConcepts: [
            "Class I: Sodium channel blockers (fast, intermediate, slow kinetics)",
            "Class II: Beta-blockers - reduce sympathetic effects",
            "Class III: Potassium channel blockers - prolong repolarization",
            "Class IV: Calcium channel blockers - slow AV nodal conduction",
            "Other: Digoxin, adenosine, magnesium"
          ],
          clinicalPearls: [
            "Amiodarone: Most effective but significant toxicity",
            "Flecainide: Avoid in structural heart disease (CAST trial)",
            "Beta-blockers and CCBs for rate control in AF",
            "Adenosine for SVT diagnosis and termination"
          ],
          warnings: [
            "Amiodarone requires baseline and periodic monitoring (thyroid, liver, lungs, eyes)",
            "Class Ic drugs can be proarrhythmic in structural heart disease",
            "QT prolongation with Class III drugs requires monitoring",
            "Digoxin toxicity is common and dangerous"
          ]
        },
        undergraduate: {
          focus: "What are the main antiarrhythmic drug classes?",
          objectives: [
            "List Vaughan-Williams classes",
            "Know examples of each class",
            "Understand basic mechanisms",
            "Identify common indications"
          ],
          keyPoints: [
            "Class I: Sodium channel blockers (flecainide, lidocaine)",
            "Class II: Beta-blockers (metoprolol, atenolol)",
            "Class III: K+ blockers (amiodarone, sotalol)",
            "Class IV: CCBs (verapamil, diltiazem)"
          ],
          simplifiedExplanation: "The heart's electrical system is like a carefully timed orchestra. Antiarrhythmic drugs adjust the timing: sodium channel blockers slow the signal spread, beta-blockers calm the sympathetic 'fight or flight' response, potassium channel blockers extend the recovery time, and calcium channel blockers slow the AV node 'gatekeeper'.",
          memoryAids: [
            "'Some Block Potassium Channels' = Sodium, Beta, Potassium, Calcium",
            "Class I = Ion (Na+) channel blockade",
            "Class III = Three letters (K+), Third element (Potassium)",
            "'ABCD' for AF rate control: AV node blockers, Beta-blockers, CCBs, Digoxin"
          ]
        },
        postgraduate: {
          focus: "Antiarrhythmic selection, monitoring, and combination with devices",
          objectives: [
            "Select appropriate antiarrhythmic based on rhythm and patient factors",
            "Monitor for drug toxicity and proarrhythmia",
            "Integrate pharmacotherapy with ablation and devices",
            "Manage anticoagulation with rhythm control"
          ],
          keyPoints: [
            "AF rhythm control: Flecainide (no SHD), amiodarone (SHD)",
            "Rate control in AF: Beta-blocker, diltiazem, digoxin",
            "Ventricular arrhythmias: Amiodarone, lidocaine",
            "Amiodarone: Lung, thyroid, liver, eye monitoring"
          ],
          advancedConcepts: "The 2020 ESC AF guidelines emphasize early rhythm control in selected patients. Drug selection depends on presence of structural heart disease, QT interval, and comorbidities. The EAST-AFNET 4 trial showed rhythm control improves outcomes in early AF. Amiodarone remains the most effective but toxic antiarrhythmic, with newer agents (dronedarone) offering safer alternatives in selected patients.",
          evidenceBase: [
            "CAST trial: Class Ic drugs increase mortality post-MI",
            "EAST-AFNET 4: Early rhythm control improves outcomes",
            "AFFIRM: Rate vs rhythm control - no mortality difference",
            "ANDROMEDA: Dronedarone contraindicated in HF"
          ]
        },
        videos: [
          { id: "V3q6lBd0NvY", title: "Antiarrhythmic Drugs - Vaughan Williams", description: "Classification and mechanisms", duration: "16:00", source: "Osmosis" },
          { id: "yXFSXAq0HXg", title: "Amiodarone Mechanism and Toxicity", description: "Deep dive into amiodarone", duration: "12:00", source: "Medicosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Action_potential.png/800px-Action_potential.png", title: "Cardiac Action Potential", description: "Ion channels and drug targets" }
        ]
      },
      {
        id: 5,
        title: "Antianginal Agents",
        icon: "Activity",
        color: "orange",
        writtenContent: {
          introduction: "Antianginal therapy relieves symptoms and improves quality of life in patients with coronary artery disease. Multiple mechanisms provide benefit: reducing oxygen demand, increasing oxygen supply, or both. Modern therapy also includes disease-modifying treatments that improve prognosis.",
          coreConcepts: [
            "Nitrates: Venodilation reduces preload, coronary vasodilation",
            "Beta-blockers: Reduce heart rate and contractility",
            "Calcium channel blockers: Vasodilation, rate control",
            "Ranolazine: Reduces myocardial wall tension",
            "Ivabradine: Selective heart rate reduction"
          ],
          clinicalPearls: [
            "Short-acting nitrates for acute attacks, long-acting for prophylaxis",
            "Beta-blockers first-line post-MI and in HFrEF",
            "CCBs when beta-blockers contraindicated or inadequate",
            "Tolerance develops with continuous nitrate use - need nitrate-free interval"
          ],
          warnings: [
            "Nitrates contraindicated with PDE5 inhibitors (sildenafil)",
            "Avoid abrupt beta-blocker withdrawal",
            "Verapamil + beta-blocker = risk of heart block",
            "Ivabradine contraindicated in AF"
          ]
        },
        undergraduate: {
          focus: "What drugs are used to treat angina?",
          objectives: [
            "List main antianginal drug classes",
            "Understand basic mechanisms",
            "Know how to use short vs long-acting nitrates",
            "Identify common side effects"
          ],
          keyPoints: [
            "Nitrates: GTN spray/tablets for acute, patches for prevention",
            "Beta-blockers: Reduce oxygen demand",
            "CCBs: Amlodipine, diltiazem, verapamil",
            "Aspirin, statins for secondary prevention"
          ],
          simplifiedExplanation: "Angina is like a supply-demand mismatch - the heart needs more oxygen than it's getting. Antianginals help by either reducing demand (slowing the heart, reducing workload) or increasing supply (dilating coronary arteries). Think of it as either using less electricity or getting a bigger power line.",
          memoryAids: [
            "'ABC' for angina: Aspirin, Beta-blocker, Cholesterol lowering",
            "Nitrates = No preload = less work for heart",
            "Beta-blockers = Beating slower = less oxygen needed",
            "CCBs = Calcium Channels blocked = vessels relax"
          ]
        },
        postgraduate: {
          focus: "Comprehensive CAD management and refractory angina",
          objectives: [
            "Integrate antianginals with disease-modifying therapy",
            "Manage refractory angina",
            "Balance antianginal therapy with blood pressure",
            "Apply latest secondary prevention guidelines"
          ],
          keyPoints: [
            "Four pillars: Aspirin, beta-blocker, ACEi, statin",
            "Nitrates + beta-blocker + CCB for maximum symptom control",
            "Refractory angina: Consider ranolazine, ivabradine",
            "Revascularization when optimal medical therapy inadequate"
          ],
          advancedConcepts: "The 2019 ESC chronic coronary syndrome guidelines emphasize optimal medical therapy before considering revascularization. The ISCHEMIA trial showed that in stable CAD, initial invasive strategy did not reduce mortality compared to conservative management. Ranolazine and trimetazidine offer additional options for refractory angina through metabolic modulation.",
          evidenceBase: [
            "ISCHEMIA trial: OMT vs invasive - no mortality difference",
            "COURAGE: OMT + PCI vs OMT alone - similar outcomes",
            "SIGNIFY: Ivabradine not beneficial without angina",
            "MERLIN-TIMI: Ranolazine reduces recurrent ischemia"
          ]
        },
        videos: [
          { id: "ybWvJsKMcSo", title: "Antianginal Drugs", description: "Comprehensive antianginal therapy", duration: "13:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Coronary_artery_disease.png/800px-Coronary_artery_disease.png", title: "Coronary Artery Disease", description: "Pathophysiology and treatment targets" }
        ]
      }
    ],
    caseStudies: {
      undergraduate: {
        title: "Newly Diagnosed Hypertension",
        patient: "John, 55-year-old male",
        presentation: "Routine BP check shows 162/98 mmHg on two occasions. No symptoms. BMI 28, non-smoker. No significant past medical history.",
        findings: "BP 162/98, HR 76. No signs of end-organ damage. ECG normal. Creatinine 85, no proteinuria. Total cholesterol 5.8 mmol/L.",
        questions: ["What is the diagnosis and stage?", "What first-line treatment would you recommend?", "What lifestyle advice is needed?"],
        answers: ["Hypertension Stage 2 (>160/100)", "ACE inhibitor (e.g., lisinopril 10mg) or CCB (amlodipine 5mg)", "DASH diet, reduce salt, exercise, weight loss, limit alcohol"]
      },
      postgraduate: {
        title: "Heart Failure with Reduced Ejection Fraction",
        patient: "Mrs. Williams, 68-year-old female",
        presentation: "Progressive dyspnea on exertion, orthopnea, and leg swelling over 3 months. History of anterior MI 2 years ago, hypertension, type 2 diabetes.",
        findings: "BP 105/70, HR 78, JVP elevated, S3 gallop, bilateral crackles, pitting edema to knees. Echo: LVEF 30%, dilated LV. Creatinine 95, K+ 4.2.",
        questions: ["What is the diagnosis and staging?", "Outline the guideline-directed medical therapy.", "How would you approach uptitration?"],
        answers: ["HFrEF (NYHA Class III, Stage C)", "ARNI (or ACEi) + BB + MRA + SGLT2i + diuretic for symptoms", "Start low doses, uptitrate every 2 weeks, monitor BP, renal function, K+"]
      }
    }
  },

  // ==================== CNS PHARMACOLOGY COURSE ====================
  {
    id: "cns",
    title: "Central Nervous System Pharmacology",
    shortTitle: "CNS",
    description: "Comprehensive coverage of neuropharmacology including analgesics, antidepressants, antipsychotics, antiepileptics, and anxiolytics.",
    icon: "Brain",
    color: "purple",
    category: "Neurology/Psychiatry",
    totalModules: 5,
    duration: "12 hours",
    level: "All Levels",
    modules: [
      {
        id: 1,
        title: "Analgesics & Pain Management",
        icon: "Activity",
        color: "purple",
        writtenContent: {
          introduction: "Pain affects millions worldwide and is a leading cause of disability. The WHO analgesic ladder provides a framework for pain management, though chronic pain often requires multimodal approaches. Understanding opioid pharmacology is critical given the ongoing opioid crisis.",
          coreConcepts: [
            "Non-opioid analgesics: Paracetamol, NSAIDs",
            "Weak opioids: Codeine, tramadol",
            "Strong opioids: Morphine, oxycodone, fentanyl, methadone",
            "Adjuvant analgesics: Antidepressants, anticonvulsants for neuropathic pain",
            "Multimodal analgesia: Combining different mechanisms"
          ],
          clinicalPearls: [
            "Paracetamol is first-line for most pain types",
            "NSAIDs are particularly effective for inflammatory pain",
            "Opioids should be used at lowest effective dose for shortest duration",
            "Neuropathic pain often requires adjuvants: gabapentin, duloxetine"
          ],
          warnings: [
            "Paracetamol overdose causes hepatotoxicity",
            "NSAIDs: GI bleeding, renal impairment, cardiovascular risk",
            "Opioids: Respiratory depression, constipation, addiction risk",
            "Tramadol: Serotonin syndrome risk, seizure risk"
          ]
        },
        undergraduate: {
          focus: "What are the main classes of analgesics?",
          objectives: [
            "List analgesic classes per WHO ladder",
            "Understand basic mechanisms",
            "Know common side effects",
            "Identify appropriate use for each class"
          ],
          keyPoints: [
            "Step 1: Non-opioids (paracetamol, NSAIDs)",
            "Step 2: Weak opioids (codeine, tramadol)",
            "Step 3: Strong opioids (morphine, oxycodone)",
            "Adjuvants for specific pain types"
          ],
          simplifiedExplanation: "Pain signals travel through nerves to the brain. Different drugs block this pathway at different points: NSAIDs reduce inflammation at the source, paracetamol works in the brain to reduce pain perception, and opioids block pain signals in the spinal cord and brain. For nerve pain, drugs like gabapentin calm overactive nerves.",
          memoryAids: [
            "WHO Ladder = 1-2-3 steps for pain",
            "NSAIDs = Non-steroidal, Stop Inflammation",
            "Opioids = Only Prescribe If really needed, Avoid long-term",
            "Neuropathic = 'Nerves Need Different Drugs' (gabapentin, duloxetine)"
          ]
        },
        postgraduate: {
          focus: "Multimodal pain management and opioid stewardship",
          objectives: [
            "Implement multimodal analgesia strategies",
            "Manage complex chronic pain",
            "Apply opioid stewardship principles",
            "Treat neuropathic and cancer pain"
          ],
          keyPoints: [
            "Multimodal: Paracetamol + NSAID + opioid + adjuvant",
            "Neuropathic: Gabapentin/pregabalin or duloxetine first-line",
            "Cancer pain: Opioids mainstay, adjuvants for bone/nerve pain",
            "Opioid stewardship: Lowest dose, shortest duration, frequent review"
          ],
          advancedConcepts: "Modern pain management emphasizes multimodal approaches targeting multiple pain pathways simultaneously. Opioid stewardship programs aim to minimize opioid exposure while maintaining analgesia. The biopsychosocial model recognizes that chronic pain involves psychological and social factors requiring interdisciplinary management. Neuropathic pain mechanisms involve central and peripheral sensitization requiring specific treatments.",
          evidenceBase: [
            "SPRING trial: Multimodal analgesia reduces opioid requirements",
            "NeuPSIG guidelines: Gabapentinoids, SNRIs first-line for neuropathic pain",
            "CDC guidelines: Limit opioid duration for acute pain",
            "SPACE trial: Opioids not superior to non-opioids for chronic back/hip pain"
          ]
        },
        videos: [
          { id: "X9N8M4H0fjU", title: "Opioids Mechanism and Pharmacology", description: "How opioids work", duration: "14:00", source: "Osmosis" },
          { id: "spxRx6mdnH0", title: "NSAIDs Pharmacology", description: "Mechanism and clinical use", duration: "12:00", source: "Ninja Nerd" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/WHO%27s_pain_ladder.svg/800px-WHO%27s_pain_ladder.svg.png", title: "WHO Pain Ladder", description: "Stepwise approach to pain management" }
        ]
      },
      {
        id: 2,
        title: "Antidepressants",
        icon: "Sun",
        color: "yellow",
        writtenContent: {
          introduction: "Depression affects over 300 million people globally and is a leading cause of disability. Antidepressants work by modulating monoamine neurotransmitters. While effective, they require careful selection based on patient factors and potential side effects. Full therapeutic effect typically takes 4-6 weeks.",
          coreConcepts: [
            "SSRIs: Selective serotonin reuptake inhibitors - first-line for most",
            "SNRIs: Serotonin-norepinephrine reuptake inhibitors",
            "TCAs: Tricyclic antidepressants - older, more side effects",
            "MAOIs: Monoamine oxidase inhibitors - dietary restrictions",
            "Atypical: Bupropion, mirtazapine, vortioxetine"
          ],
          clinicalPearls: [
            "SSRIs first-line: Good efficacy, tolerable side effects",
            "Sexual dysfunction common with SSRIs/SNRIs",
            "Mirtazapine causes sedation and weight gain - useful for insomnia/anorexia",
            "Bupropion doesn't cause sexual dysfunction - good for augmentation"
          ],
          warnings: [
            "Black box warning: Increased suicidality in young adults",
            "Serotonin syndrome with multiple serotonergic agents",
            "Discontinuation syndrome - taper slowly",
            "TCAs: Cardiac toxicity in overdose"
          ]
        },
        undergraduate: {
          focus: "What are the main classes of antidepressants?",
          objectives: [
            "List major antidepressant classes",
            "Understand basic mechanism",
            "Know first-line agents",
            "Identify common side effects"
          ],
          keyPoints: [
            "SSRIs: Fluoxetine, sertraline, escitalopram",
            "SNRIs: Venlafaxine, duloxetine",
            "TCAs: Amitriptyline, nortriptyline",
            "Atypical: Mirtazapine, bupropion"
          ],
          simplifiedExplanation: "Depression involves imbalances in brain chemicals called neurotransmitters. SSRIs increase serotonin levels by blocking its reabsorption, like preventing a sponge from soaking up water. SNRIs boost both serotonin and norepinephrine. It takes 4-6 weeks to see full effects because the brain needs time to adapt.",
          memoryAids: [
            "SSRI = 'Selective Serotonin Reuptake Inhibitor' - most Safe",
            "TCA = 'Try Carefully, Adult' - cardiac toxicity",
            "'SAD' symptoms improved = Sleep, Appetite, Depression",
            "4-6 weeks for full effect"
          ]
        },
        postgraduate: {
          focus: "Treatment-resistant depression and augmentation strategies",
          objectives: [
            "Select appropriate first-line antidepressant",
            "Manage treatment-resistant depression",
            "Implement augmentation strategies",
            "Navigate switching and combining antidepressants"
          ],
          keyPoints: [
            "First-line: SSRI (sertraline, escitalopram often preferred)",
            "Inadequate response: Increase dose, then switch or augment",
            "Augmentation: Bupropion, lithium, atypical antipsychotics",
            "TRD: Consider ECT, TMS, ketamine/esketamine"
          ],
          advancedConcepts: "Treatment-resistant depression (TRD) affects approximately 30% of patients. The STAR*D trial showed diminishing returns with each treatment step. Augmentation strategies (adding bupropion to SSRI, adding aripiprazole) may be more effective than switching. Esketamine (intranasal) and rapid-acting interventions like ketamine infusion have transformed management of severe TRD.",
          evidenceBase: [
            "STAR*D: Sequential treatment outcomes in depression",
            "VAST-D: Augmentation vs switching strategies",
            "CANMAT guidelines: Evidence-based treatment selection",
            "SUSTAIN-2: Long-term esketamine efficacy"
          ]
        },
        videos: [
          { id: "DLn5Q9JpIyg", title: "Antidepressants - SSRIs, SNRIs, TCAs", description: "Comprehensive antidepressant overview", duration: "18:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Neurotransmitter_synapse.png/800px-Neurotransmitter_synapse.png", title: "Synaptic Transmission", description: "How antidepressants affect synapses" }
        ]
      },
      {
        id: 3,
        title: "Antipsychotics",
        icon: "Brain",
        color: "indigo",
        writtenContent: {
          introduction: "Antipsychotics are essential for managing schizophrenia, bipolar disorder, and other psychotic conditions. First-generation (typical) antipsychotics primarily block D2 receptors, while second-generation (atypical) agents have broader receptor profiles with different side effect patterns.",
          coreConcepts: [
            "First-generation (typical): High D2 blockade - haloperidol, chlorpromazine",
            "Second-generation (atypical): D2 + 5-HT2A blockade - risperidone, olanzapine, quetiapine",
            "Third-generation: Partial D2 agonism - aripiprazole",
            "Long-acting injectables: Improve adherence",
            "Clozapine: Most effective for treatment-resistant schizophrenia"
          ],
          clinicalPearls: [
            "Atypicals preferred: Lower EPS risk but higher metabolic effects",
            "Metabolic monitoring essential: Weight, glucose, lipids",
            "Clozapine for treatment-resistant: Requires blood monitoring",
            "LAIs improve adherence in schizophrenia"
          ],
          warnings: [
            "Neuroleptic malignant syndrome: Medical emergency",
            "QT prolongation: Monitor ECG with some agents",
            "Metabolic syndrome: Diabetes, dyslipidemia, weight gain",
            "Clozapine: Agranulocytosis risk - requires monitoring"
          ]
        },
        undergraduate: {
          focus: "What are the main antipsychotic drug classes?",
          objectives: [
            "Distinguish typical vs atypical antipsychotics",
            "Know common examples of each class",
            "Understand basic mechanism",
            "Identify major side effects"
          ],
          keyPoints: [
            "Typical: Haloperidol, chlorpromazine - more EPS",
            "Atypical: Risperidone, olanzapine, quetiapine - more metabolic",
            "Mechanism: D2 receptor blockade",
            "Clozapine: Reserved for resistant cases"
          ],
          simplifiedExplanation: "Psychosis involves overactivity of dopamine in certain brain pathways. Antipsychotics block dopamine D2 receptors, reducing this overactivity. Typical antipsychotics are 'strong blockers' causing more movement side effects. Atypicals have a 'gentler touch' with additional serotonin effects, causing fewer movement problems but more weight gain.",
          memoryAids: [
            "Typical = 'Typically more EPS'",
            "Atypical = 'Atypical side effects' (metabolic)",
            "Clozapine = 'Clozapine Cares' for resistant cases but needs blood Counts",
            "'THINC MED' for metabolic monitoring: Tendency to gain weight, etc."
          ]
        },
        postgraduate: {
          focus: "Optimizing antipsychotic therapy and managing side effects",
          objectives: [
            "Select appropriate antipsychotic based on profile",
            "Manage treatment-resistant schizophrenia",
            "Implement metabolic monitoring",
            "Navigate clozapine initiation and monitoring"
          ],
          keyPoints: [
            "First-episode: Start with atypical (risperidone, aripiprazole)",
            "Inadequate response: Try another atypical or clozapine",
            "Clozapine after 2 failed antipsychotics",
            "LAI consideration for adherence issues"
          ],
          advancedConcepts: "Antipsychotic selection involves balancing efficacy and side effect profiles for individual patients. The CATIE trial showed similar efficacy among atypicals but different tolerability. Clozapine remains the gold standard for treatment-resistant schizophrenia. Early intervention with LAIs may improve long-term outcomes. The concept of 'prescribing compassion' emphasizes shared decision-making.",
          evidenceBase: [
            "CATIE trial: Comparative effectiveness of antipsychotics",
            "CLAUDIA: Clozapine vs other antipsychotics in resistant schizophrenia",
            "PORT guidelines: Evidence-based schizophrenia treatment",
            "PALMIS: LAI vs oral in early psychosis"
          ]
        },
        videos: [
          { id: "8cKyIeZfmJY", title: "Antipsychotics Pharmacology", description: "Complete antipsychotic overview", duration: "20:00", source: "Osmosis" },
          { id: "pSb4rMP3Hcw", title: "Clozapine Mechanism and Monitoring", description: "Deep dive into clozapine", duration: "10:00", source: "Psychopharmacology Institute" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Dopamine_pathways.svg/800px-Dopamine_pathways.svg.png", title: "Dopamine Pathways", description: "Brain pathways affected by antipsychotics" }
        ]
      },
      {
        id: 4,
        title: "Antiepileptic Drugs",
        icon: "Zap",
        color: "orange",
        writtenContent: {
          introduction: "Epilepsy affects 50 million people worldwide. Antiepileptic drugs (AEDs) work through various mechanisms to suppress neuronal hyperexcitability. Selection depends on seizure type, patient factors, and potential drug interactions. Many AEDs are also used for other indications including neuropathic pain and mood disorders.",
          coreConcepts: [
            "Sodium channel blockers: Phenytoin, carbamazepine, lamotrigine",
            "Calcium channel blockers: Ethosuximide, gabapentin",
            "GABA enhancers: Benzodiazepines, barbiturates, valproate",
            "Synaptic release modifiers: Levetiracetam, brivaracetam",
            "Multiple mechanisms: Valproate, topiramate, zonisamide"
          ],
          clinicalPearls: [
            "Match AED to seizure type: Focal vs generalized",
            "Valproate: Most effective for generalized epilepsy but teratogenic",
            "Lamotrigine: Slow titration to avoid rash",
            "Levetiracetam: Few drug interactions, widely used"
          ],
          warnings: [
            "Valproate: Teratogenic - avoid in women of childbearing age",
            "Carbamazepine: HLA-B*1502 testing in Asian patients (SJS risk)",
            "Lamotrigine: Stevens-Johnson syndrome risk with rapid titration",
            "Many AEDs: Induce/inhibit cytochrome P450 enzymes"
          ]
        },
        undergraduate: {
          focus: "What are the main antiepileptic drug classes?",
          objectives: [
            "List major AED classes and examples",
            "Understand basic mechanisms",
            "Know importance of seizure type matching",
            "Identify common side effects"
          ],
          keyPoints: [
            "Sodium channel blockers: Phenytoin, carbamazepine, lamotrigine",
            "Broad spectrum: Valproate, levetiracetam, topiramate",
            "Focal seizures: Carbamazepine, lamotrigine, levetiracetam",
            "Generalized: Valproate, lamotrigine (avoid in absence)"
          ],
          simplifiedExplanation: "Seizures happen when brain cells fire excessively and synchronously. AEDs work by either stabilizing the 'gates' (sodium channels) that trigger firing, increasing natural 'brakes' (GABA), or reducing the 'gas pedal' (glutamate). Different seizure types respond to different mechanisms.",
          memoryAids: [
            "'SLOW' for sodium channel blockers: Stabilize, Limit, Over-excited, Wave",
            "Valproate = 'Very good for generalized, but Avoid in pregnancy'",
            "Lamotrigine = 'Low and slow' titration",
            "Levetiracetam = 'Less interactions, Effective'"
          ]
        },
        postgraduate: {
          focus: "Individualized AED selection and refractory epilepsy management",
          objectives: [
            "Select AEDs based on seizure type and patient factors",
            "Manage drug interactions",
            "Address women's health issues in epilepsy",
            "Consider surgical options for refractory cases"
          ],
          keyPoints: [
            "First-line focal: Lamotrigine, levetiracetam, carbamazepine",
            "First-line generalized: Valproate (men), lamotrigine (women)",
            "Women: Avoid valproate, consider enzyme interactions with OCPs",
            "Refractory: Add-on therapy, consider surgery, dietary therapy"
          ],
          advancedConcepts: "AED selection requires consideration of seizure type, epilepsy syndrome, comorbidities, drug interactions, and patient-specific factors. The SANAD trial informed first-line selection. For women of childbearing age, valproate should be avoided due to teratogenicity and neurodevelopmental effects. Refractory epilepsy (failure of 2 appropriate AEDs) should prompt evaluation for epilepsy surgery, which can be curative in selected cases.",
          evidenceBase: [
            "SANAD trial: Comparative effectiveness of AEDs",
            "VALPROATE pregnancy registry: Teratogenicity data",
            "ENGAGE study: Perampanel for generalized seizures",
            "ERICE study: Long-term outcomes with AEDs"
          ]
        },
        videos: [
          { id: "bHMF9mxZa5g", title: "Antiepileptic Drugs Overview", description: "Complete AED pharmacology", duration: "22:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Action_potential.png/800px-Action_potential.png", title: "Neuronal Action Potential", description: "Where AEDs act" }
        ]
      },
      {
        id: 5,
        title: "Anxiolytics & Sedatives",
        icon: "Moon",
        color: "slate",
        writtenContent: {
          introduction: "Anxiety disorders are among the most common psychiatric conditions. While benzodiazepines have been the mainstay of anxiolytic therapy, concerns about dependence and tolerance have led to increased use of alternatives. Understanding the risk-benefit profile of each agent is essential for safe prescribing.",
          coreConcepts: [
            "Benzodiazepines: Enhance GABA-A receptor function",
            "Buspirone: 5-HT1A partial agonist - no dependence risk",
            "Antidepressants: SSRIs/SNRIs first-line for chronic anxiety",
            "Beta-blockers: Propranolol for performance anxiety",
            "Non-benzodiazepine hypnotics: Z-drugs (zolpidem, zopiclone)"
          ],
          clinicalPearls: [
            "SSRIs first-line for GAD, panic, social anxiety",
            "Benzodiazepines: Short-term use, consider dependence risk",
            "Buspirone: No dependence, but delayed onset (2-4 weeks)",
            "Beta-blockers: Somatic symptoms of anxiety, performance anxiety"
          ],
          warnings: [
            "Benzodiazepines: Dependence, withdrawal, cognitive impairment",
            "Avoid long-term benzodiazepines when possible",
            "Withdrawal can be life-threatening - taper slowly",
            "Elderly: Increased fall risk, cognitive effects"
          ]
        },
        undergraduate: {
          focus: "What are the main anxiolytic and sedative drugs?",
          objectives: [
            "List major drug classes for anxiety",
            "Understand benzodiazepine mechanisms",
            "Know the risks of benzodiazepines",
            "Identify first-line alternatives"
          ],
          keyPoints: [
            "Benzodiazepines: Diazepam, lorazepam, alprazolam",
            "Z-drugs: Zolpidem, zopiclone for insomnia",
            "First-line for chronic anxiety: SSRIs",
            "Buspirone: Non-addictive alternative"
          ],
          simplifiedExplanation: "Anxiety involves overactivity in brain circuits. Benzodiazepines work like turning up the brain's 'calming' chemical (GABA). They work fast but can be addictive. SSRIs work by adjusting serotonin levels over time - slower but better for long-term anxiety. Beta-blockers block physical symptoms like racing heart.",
          memoryAids: [
            "Benzodiazepines = 'Benzos' - Be careful, Easy to become dependent",
            "Buspirone = 'Builds up slowly, No dependence'",
            "SSRIs = 'Slow, Sustained Relief for anxiety'",
            "'ASAP' for anxiety: Assess, SSRIs first, Add benzodiazepines short-term if needed, Plan for tapering"
          ]
        },
        postgraduate: {
          focus: "Rational anxiolytic selection and benzodiazepine stewardship",
          objectives: [
            "Select appropriate anxiolytic based on anxiety type",
            "Implement benzodiazepine stewardship",
            "Manage benzodiazepine withdrawal",
            "Address insomnia with non-pharmacological approaches"
          ],
          keyPoints: [
            "Acute anxiety: Short-term benzodiazepine",
            "Chronic anxiety: SSRI/SNRI first-line",
            "Insomnia: CBT-I first-line, short-term Z-drug if needed",
            "Benzodiazepine taper: 10% reduction every 1-2 weeks"
          ],
          advancedConcepts: "The choice of anxiolytic depends on the anxiety disorder, duration of treatment needed, and patient factors. Benzodiazepine stewardship programs aim to minimize long-term use while ensuring appropriate acute use. For insomnia, CBT-I is first-line, with medications reserved for short-term use. The benzodiazepine receptor antagonists (flumazenil) have limited use due to seizure risk.",
          evidenceBase: [
            "GAD guidelines: SSRIs/SNRIs first-line",
            "BZD stewardship: Reducing inappropriate prescribing",
            "CBT-I effectiveness for insomnia",
            "TAPER trial: Approaches to benzodiazepine discontinuation"
          ]
        },
        videos: [
          { id: "F1vlaGL-Yhk", title: "Benzodiazepines Pharmacology", description: "Complete benzo overview", duration: "16:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/GABA_receptor.png/800px-GABA_receptor.png", title: "GABA Receptor", description: "Benzodiazepine binding site" }
        ]
      }
    ],
    caseStudies: {
      undergraduate: {
        title: "New Diagnosis of Depression",
        patient: "Emma, 32-year-old female",
        presentation: "6 weeks of low mood, anhedonia, poor sleep, low energy, difficulty concentrating. No suicidal ideation. Works as a teacher, finding it increasingly difficult.",
        findings: "PHQ-9 score 16. No prior psychiatric history. Physical examination normal. Not on any medications.",
        questions: ["What is the diagnosis and severity?", "What first-line treatment would you recommend?", "What education is needed about the medication?"],
        answers: ["Major depressive disorder, moderate severity", "SSRI such as sertraline 50mg daily, consider CBT", "Takes 4-6 weeks for full effect, don't stop suddenly, possible side effects, contact if worsening or suicidal thoughts"]
      },
      postgraduate: {
        title: "Treatment-Resistant Depression",
        patient: "Mr. Davies, 48-year-old male",
        presentation: "Persistent depression despite sertraline 200mg for 8 weeks and then duloxetine 120mg for 10 weeks. Previous trial of fluoxetine also failed. Currently severely impaired functionally.",
        findings: "PHQ-9 score 20. No bipolar features. ECT not previously tried. No significant medical comorbidities. Willing to consider options.",
        questions: ["What defines treatment-resistant depression?", "What augmentation options are available?", "What monitoring is needed?"],
        answers: ["Failure to respond to ≥2 adequate antidepressant trials", "Augment with bupropion, lithium, or atypical antipsychotic (aripiprazole, quetiapine); consider ECT or TMS if severe", "Monitor mood, suicidality, metabolic parameters (if antipsychotic), lithium levels if lithium used"]
      }
    }
  },

  // ==================== ONCOLOGY COURSE ====================
  {
    id: "oncology",
    title: "Oncology Pharmacology",
    shortTitle: "Oncology",
    description: "Comprehensive coverage of cancer therapeutics including chemotherapy, targeted therapy, immunotherapy, and supportive care in oncology.",
    icon: "Radiation",
    color: "pink",
    category: "Oncology",
    totalModules: 5,
    duration: "10 hours",
    level: "All Levels",
    modules: [
      {
        id: 1,
        title: "Principles of Cancer Chemotherapy",
        icon: "FlaskConical",
        color: "pink",
        writtenContent: {
          introduction: "Chemotherapy remains a cornerstone of cancer treatment, either alone or in combination with surgery, radiation, and newer targeted agents. Understanding cell cycle kinetics, mechanisms of action, and toxicity profiles is essential for safe and effective chemotherapy administration.",
          coreConcepts: [
            "Cell cycle specificity: Some drugs act on dividing cells, others throughout the cycle",
            "Combination chemotherapy: Multiple agents with different mechanisms and toxicities",
            "Dose intensity: Relationship between dose and response",
            "Resistance mechanisms: MDR genes, DNA repair, target alterations",
            "Adjuvant vs neoadjuvant vs palliative: Treatment intent"
          ],
          clinicalPearls: [
            "Neutropenia: Most common dose-limiting toxicity",
            "Growth factor support: Reduces infection risk",
            "Extravasation: Some agents cause severe tissue damage",
            "Dose adjustments: Based on toxicity and renal/hepatic function"
          ],
          warnings: [
            "Myelosuppression: Risk of infection and bleeding",
            "Extravasation: Vesicants require central lines",
            "Organ toxicity: Cardiotoxicity (anthracyclines), nephrotoxicity (cisplatin)",
            "Drug interactions: Many, including CYP interactions"
          ]
        },
        undergraduate: {
          focus: "What is chemotherapy and how does it work?",
          objectives: [
            "Understand basic principles of chemotherapy",
            "Know major drug classes and mechanisms",
            "Identify common toxicities",
            "Learn about treatment intent"
          ],
          keyPoints: [
            "Alkylating agents: Cyclophosphamide, cisplatin",
            "Antimetabolites: Methotrexate, 5-FU, gemcitabine",
            "Vinca alkaloids: Vincristine, vinblastine",
            "Anthracyclines: Doxorubicin, daunorubicin"
          ],
          simplifiedExplanation: "Chemotherapy drugs target rapidly dividing cells - a hallmark of cancer. They work by damaging DNA, blocking DNA synthesis, or preventing cell division. Unfortunately, they also affect normal rapidly dividing cells (hair follicles, bone marrow, gut lining) causing side effects like hair loss, low blood counts, and nausea.",
          memoryAids: [
            "'AAVVA' for classes: Alkylating, Antimetabolites, Vinca, Varies (antibiotics), Assembled (miscellaneous)",
            "Myelosuppression = Bone Marrow suppressed = Low blood counts",
            "Extravasation = 'Escape' = Drug leaks into tissue"
          ]
        },
        postgraduate: {
          focus: "Optimizing chemotherapy regimens and managing toxicities",
          objectives: [
            "Select appropriate chemotherapy regimens",
            "Calculate doses and adjust for function",
            "Manage acute and chronic toxicities",
            "Implement supportive care protocols"
          ],
          keyPoints: [
            "BSA-based dosing: Adjust for renal/hepatic function",
            "G-CSF prophylaxis: Primary vs secondary prevention",
            "Antiemetic regimens: 5-HT3, NK1, dexamethasone",
            "Dose delays and reductions: Based on toxicity"
          ],
          advancedConcepts: "Modern chemotherapy delivery requires understanding of pharmacokinetics, drug interactions, and supportive care. The concept of dose intensity correlates with outcomes in sensitive tumors. Pharmacogenomics (DPD deficiency with 5-FU, UGT1A1 with irinotecan) guides personalized dosing. Growth factor support and antiemetics have transformed the tolerability of chemotherapy.",
          evidenceBase: [
            "ASCO guidelines: Growth factor support",
            "MASCC/ESMO guidelines: Antiemetic therapy",
            "NCCN guidelines: Disease-specific chemotherapy regimens",
            "Pharmacogenomic studies: DPD, UGT1A1 testing"
          ]
        },
        videos: [
          { id: "5Pz3jJf1f0Q", title: "Chemotherapy Mechanisms", description: "How chemotherapy works", duration: "15:00", source: "Osmosis" },
          { id: "Kx8n2A1nJzY", title: "Cell Cycle and Chemotherapy", description: "Cell cycle-specific agents", duration: "12:00", source: "Ninja Nerd" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Cell_cycle.svg/800px-Cell_cycle.svg.png", title: "Cell Cycle", description: "Chemotherapy targets in the cell cycle" }
        ]
      },
      {
        id: 2,
        title: "Targeted Cancer Therapy",
        icon: "Target",
        color: "violet",
        writtenContent: {
          introduction: "Targeted therapies represent a paradigm shift in oncology, exploiting specific molecular alterations in cancer cells. These agents offer improved efficacy and reduced toxicity compared to traditional chemotherapy, though resistance and specific adverse effects present new challenges.",
          coreConcepts: [
            "Tyrosine kinase inhibitors (TKIs): Block intracellular signaling",
            "Monoclonal antibodies: Target cell surface receptors or ligands",
            "PARP inhibitors: Synthetic lethality in BRCA-mutated cancers",
            "CDK inhibitors: Block cell cycle progression",
            "BCL-2 inhibitors: Promote apoptosis"
          ],
          clinicalPearls: [
            "EGFR inhibitors: Acneiform rash correlates with response",
            "VEGF inhibitors: Hypertension, proteinuria, wound healing issues",
            "ALK inhibitors: CNS-penetrant options for brain metastases",
            "BRAF inhibitors: Use with MEK inhibitor to reduce resistance"
          ],
          warnings: [
            "Skin toxicity with EGFR inhibitors",
            "Cardiotoxicity with HER2 and VEGF inhibitors",
            "Interstitial lung disease with some TKIs",
            "Bleeding/thrombosis with antiangiogenic agents"
          ]
        },
        undergraduate: {
          focus: "What are targeted cancer therapies?",
          objectives: [
            "Understand the concept of targeted therapy",
            "Know major drug classes and targets",
            "Identify common adverse effects",
            "Recognize need for biomarker testing"
          ],
          keyPoints: [
            "TKIs: Imatinib (CML), erlotinib (EGFR), sunitinib",
            "Monoclonal antibodies: Trastuzumab (HER2), bevacizumab (VEGF)",
            "PARP inhibitors: Olaparib, niraparib",
            "Biomarker testing essential for selection"
          ],
          simplifiedExplanation: "Targeted therapies are like 'smart bombs' that hit specific weaknesses in cancer cells. Instead of attacking all rapidly dividing cells, they block specific proteins that cancer cells need to grow. For example, trastuzumab targets HER2-positive breast cancer cells, and imatinib targets the abnormal protein in CML.",
          memoryAids: [
            "Targeted = 'Take Aim at specific targets'",
            "TKI = Tyrosine Kinase Inhibitor (oral)",
            "Monoclonal antibodies = 'mAb' (IV infusion)",
            "Biomarker = 'Better Matching Before Treatment'"
          ]
        },
        postgraduate: {
          focus: "Molecular selection and management of targeted therapies",
          objectives: [
            "Interpret molecular testing results",
            "Select appropriate targeted agents",
            "Manage class-specific toxicities",
            "Address resistance mechanisms"
          ],
          keyPoints: [
            "Comprehensive genomic profiling for advanced cancers",
            "EGFR mutation → EGFR TKI; ALK fusion → ALK inhibitor",
            "Resistance: T790M (EGFR), secondary mutations",
            "Sequential therapy: Third-gen TKI after resistance"
          ],
          advancedConcepts: "Precision oncology requires comprehensive molecular profiling. NGS panels identify actionable alterations. Resistance to targeted therapies often emerges through secondary mutations or bypass pathways. Third-generation TKIs (osimertinib, lorlatinib) address resistance mutations and have improved CNS penetration. Combination strategies and sequential therapy optimize outcomes.",
          evidenceBase: [
            "FLAURA: Osimertinib first-line for EGFR+ NSCLC",
            "ALEX: Alectinib for ALK+ NSCLC",
            "SOLO-1: Olaparib maintenance in BRCA+ ovarian cancer",
            "MONARCH-3: CDK4/6 inhibitors in HR+ breast cancer"
          ]
        },
        videos: [
          { id: "K3yJp1bXc7M", title: "Targeted Therapy Mechanisms", description: "How targeted therapies work", duration: "18:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Signal_transduction_pathways.svg/800px-Signal_transduction_pathways.svg.png", title: "Signaling Pathways", description: "Targets for kinase inhibitors" }
        ]
      },
      {
        id: 3,
        title: "Immunotherapy in Oncology",
        icon: "Shield",
        color: "teal",
        writtenContent: {
          introduction: "Cancer immunotherapy harnesses the immune system to fight cancer. Immune checkpoint inhibitors have transformed treatment of multiple malignancies. Understanding immune-related adverse events and their management is critical, as these differ significantly from traditional chemotherapy toxicities.",
          coreConcepts: [
            "Checkpoint inhibitors: CTLA-4, PD-1, PD-L1 inhibitors",
            "CAR T-cell therapy: Engineered T cells targeting tumor antigens",
            "Bispecific antibodies: Engage T cells with tumor cells",
            "Cancer vaccines: Prophylactic (HPV) and therapeutic",
            "Cytokines: IL-2, interferons - limited use due to toxicity"
          ],
          clinicalPearls: [
            "Checkpoint inhibitors: Durable responses in some patients",
            "PD-L1 expression: Predictive but not perfect biomarker",
            "IrAEs: Can affect any organ, require immunosuppression",
            "CAR T: Cytokine release syndrome and neurotoxicity"
          ],
          warnings: [
            "IrAEs: Can be life-threatening - early recognition critical",
            "Endocrine irAEs: Often permanent (hypophysitis, thyroiditis)",
            "CAR T: CRS and ICANS require specialized management",
            "Combination immunotherapy: Higher toxicity rates"
          ]
        },
        undergraduate: {
          focus: "What is cancer immunotherapy?",
          objectives: [
            "Understand the concept of immune checkpoint blockade",
            "Know major drug classes and examples",
            "Recognize immune-related adverse events",
            "Identify cancers where immunotherapy is used"
          ],
          keyPoints: [
            "PD-1 inhibitors: Pembrolizumab, nivolumab",
            "CTLA-4 inhibitor: Ipilimumab",
            "CAR T-cell therapy: For certain leukemias/lymphomas",
            "Used in: Melanoma, lung, kidney, bladder cancers"
          ],
          simplifiedExplanation: "Cancer cells can hide from the immune system using 'checkpoints' - molecular brakes that tell immune cells to stop attacking. Checkpoint inhibitors release these brakes, allowing the immune system to recognize and destroy cancer. CAR T-cells are patient's own T cells engineered to target their specific cancer.",
          memoryAids: [
            "Checkpoint = 'Check the brakes' on immune system",
            "PD-1 = 'Programmed Death-1' = Protein that turns off T cells",
            "IrAE = Immune-related Adverse Events = Body attacks itself",
            "CAR T = Chimeric Antigen Receptor T cells"
          ]
        },
        postgraduate: {
          focus: "Optimizing immunotherapy selection and managing irAEs",
          objectives: [
            "Select patients for immunotherapy based on biomarkers",
            "Grade and manage immune-related adverse events",
            "Understand combination immunotherapy strategies",
            "Manage CAR T-cell toxicities"
          ],
          keyPoints: [
            "Biomarkers: PD-L1, TMB, MSI-H/dMMR",
            "IrAE management: Corticosteroids first-line, biologics for refractory",
            "CRS grading: IL-6 blockade (tocilizumab)",
            "ICANS: Corticosteroids, supportive care"
          ],
          advancedConcepts: "Immunotherapy response patterns differ from chemotherapy - pseudoprogression, delayed responses, and durable complete remissions. The management of irAEs requires prompt recognition and treatment with immunosuppression, which does not appear to compromise antitumor effects in most cases. Combination checkpoint blockade improves response rates but increases toxicity. CAR T-cell therapy has transformed outcomes in refractory B-cell malignancies.",
          evidenceBase: [
            "KEYNOTE trials: Pembrolizumab across tumor types",
            "CheckMate trials: Nivolumab and combination therapy",
            "ZUMA trials: CAR T-cell therapy outcomes",
            "ASCO guidelines: irAE management"
          ]
        },
        videos: [
          { id: "pq_7F0F4Eo8", title: "Immunotherapy and Checkpoint Inhibitors", description: "How immunotherapy works", duration: "16:00", source: "Osmosis" },
          { id: "YytK4Y7D9Mo", title: "CAR T-Cell Therapy Explained", description: "Engineering immune cells", duration: "10:00", source: "Nature" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/T_cell_activation.svg/800px-T_cell_activation.svg.png", title: "T Cell Activation", description: "Checkpoint pathways" }
        ]
      },
      {
        id: 4,
        title: "Hormonal Therapy in Cancer",
        icon: "Activity",
        color: "amber",
        writtenContent: {
          introduction: "Hormonal therapy exploits the hormone dependence of certain cancers. It is a mainstay of treatment for hormone receptor-positive breast and prostate cancers, offering effective systemic therapy with generally favorable toxicity profiles compared to chemotherapy.",
          coreConcepts: [
            "SERMs: Tamoxifen - estrogen receptor modulator",
            "Aromatase inhibitors: Anastrozole, letrozole, exemestane",
            "SERDs: Fulvestrant - estrogen receptor downregulator",
            "Androgen deprivation therapy: LHRH agonists/antagonists, antiandrogens",
            "CDK4/6 inhibitors: Combine with endocrine therapy in breast cancer"
          ],
          clinicalPearls: [
            "Premenopausal: Tamoxifen or ovarian suppression + AI",
            "Postmenopausal: Aromatase inhibitors preferred",
            "Prostate cancer: Continuous LHRH agonist = androgen deprivation",
            "CDK4/6 + endocrine therapy: Standard in HR+ advanced breast cancer"
          ],
          warnings: [
            "Tamoxifen: VTE risk, endometrial cancer risk",
            "Aromatase inhibitors: Bone loss, arthralgias",
            "LHRH agonists: Tumor flare (use antiandrogen initially)",
            "Drug interactions: CYP interactions with many agents"
          ]
        },
        undergraduate: {
          focus: "What is hormonal therapy for cancer?",
          objectives: [
            "Understand hormone-dependent cancers",
            "Know major hormonal therapy classes",
            "Identify common side effects",
            "Recognize which cancers respond"
          ],
          keyPoints: [
            "Breast cancer: Tamoxifen, aromatase inhibitors",
            "Prostate cancer: LHRH agonists, antiandrogens",
            "Hormone receptor testing essential",
            "Generally well-tolerated compared to chemotherapy"
          ],
          simplifiedExplanation: "Some cancers need hormones to grow - like a car needs fuel. Hormonal therapies either remove the fuel (stop hormone production) or block the fuel tank (block hormone receptors). Breast cancers need estrogen; prostate cancers need testosterone. Depriving them of these hormones starves the cancer.",
          memoryAids: [
            "Hormonal = 'Halt the fuel' for hormone-driven cancers",
            "SERM = Selective Estrogen Receptor Modulator",
            "AI = Aromatase Inhibitor = All estrogen blocked",
            "ADT = Androgen Deprivation Therapy for prostate cancer"
          ]
        },
        postgraduate: {
          focus: "Optimizing hormonal therapy sequences and combinations",
          objectives: [
            "Select appropriate hormonal therapy based on menopausal status",
            "Manage resistance to hormonal therapy",
            "Implement CDK4/6 inhibitor combinations",
            "Address bone health with aromatase inhibitors"
          ],
          keyPoints: [
            "Early breast cancer: 5-10 years endocrine therapy",
            "Advanced breast cancer: CDK4/6 + endocrine therapy",
            "Prostate cancer: ADT backbone, add AR-targeted agents for castration-resistant",
            "Bone health: Bisphosphonates/denosumab with AIs"
          ],
          advancedConcepts: "Resistance to hormonal therapy develops through multiple mechanisms including ESR1 mutations, ligand-independent AR signaling, and cross-talk with growth factor pathways. Treatment sequencing (SERM → AI → SERD) and combination strategies (adding CDK4/6 inhibitors, PI3K inhibitors) extend the duration of hormonal sensitivity. Extended adjuvant therapy (10 years) improves outcomes in high-risk patients.",
          evidenceBase: [
            "ATAC, BIG 1-98: Aromatase inhibitors vs tamoxifen",
            "PALOMA, MONARCH, RIBBON trials: CDK4/6 inhibitors",
            "CHAARTED, STAMPEDE: ADT timing in prostate cancer",
            "SOFT/TEXT: Ovarian suppression in premenopausal breast cancer"
          ]
        },
        videos: [
          { id: "e3Y8xE4PoJQ", title: "Hormonal Therapy for Breast Cancer", description: "SERMs and AIs explained", duration: "14:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Estrogen_receptor_signaling.svg/800px-Estrogen_receptor_signaling.svg.png", title: "Estrogen Signaling", description: "Hormonal therapy targets" }
        ]
      },
      {
        id: 5,
        title: "Supportive Care in Oncology",
        icon: "Heart",
        color: "rose",
        writtenContent: {
          introduction: "Supportive care is integral to cancer treatment, improving quality of life and enabling patients to complete potentially curative therapies. Effective management of chemotherapy-induced nausea, pain, bone health, and infections is essential for optimal oncology outcomes.",
          coreConcepts: [
            "Antiemetics: 5-HT3 antagonists, NK1 antagonists, dexamethasone",
            "Growth factors: G-CSF for neutropenia, ESA for anemia",
            "Bone-modifying agents: Bisphosphonates, denosumab",
            "Pain management: Opioids, adjuvants, interventional approaches",
            "Infection prophylaxis: Vaccination, antivirals, antifungals"
          ],
          clinicalPearls: [
            "Antiemetic prophylaxis: Based on emetogenic potential",
            "G-CSF: Primary prophylaxis for high-risk regimens",
            "Bone health: Denosumab or zoledronic acid for bone metastases",
            "Cancer pain: WHO ladder, multimodal approaches"
          ],
          warnings: [
            "Febrile neutropenia: Medical emergency",
            "Tumor lysis syndrome: Prevention with hydration, allopurinol/rasburicase",
            "Bone-modifying agents: ONJ risk, hypocalcemia",
            "ESAs: Thromboembolic risk, potential tumor promotion"
          ]
        },
        undergraduate: {
          focus: "What is supportive care in oncology?",
          objectives: [
            "Understand the importance of supportive care",
            "Know major supportive care interventions",
            "Recognize oncologic emergencies",
            "Identify common supportive care medications"
          ],
          keyPoints: [
            "Antiemetics: Ondansetron, aprepitant, dexamethasone",
            "G-CSF: Filgrastim, pegfilgrastim",
            "Bone agents: Zoledronic acid, denosumab",
            "Pain: WHO analgesic ladder applies"
          ],
          simplifiedExplanation: "Supportive care helps patients tolerate cancer treatment and manage side effects. It includes preventing nausea, boosting blood counts, strengthening bones, controlling pain, and preventing infections. Good supportive care allows patients to complete their cancer treatment successfully.",
          memoryAids: [
            "Supportive = 'Support the patient through treatment'",
            "Antiemetic = 'Anti-emesis' = Prevent vomiting",
            "G-CSF = Growth factor = 'Grows' white blood cells",
            "ONJ = Osteonecrosis of Jaw (bone drug risk)"
          ]
        },
        postgraduate: {
          focus: "Comprehensive supportive care protocols",
          objectives: [
            "Implement risk-adapted supportive care",
            "Manage oncologic emergencies",
            "Coordinate palliative care integration",
            "Address survivorship issues"
          ],
          keyPoints: [
            "Antiemetic guidelines: MASCC/ESMO, NCCN",
            "Febrile neutropenia: Risk assessment, outpatient vs inpatient",
            "TLS: High-risk patients need rasburicase",
            "Early palliative care: Improves quality of life and survival"
          ],
          advancedConcepts: "Evidence-based supportive care protocols have transformed the tolerability of cancer treatment. Risk stratification (febrile neutropenia risk, emetogenic potential) guides prophylactic interventions. Early integration of palliative care improves outcomes. Survivorship care addresses long-term effects of treatment including secondary malignancies, cardiac effects, and psychosocial needs.",
          evidenceBase: [
            "MASCC/ESMO antiemetic guidelines",
            "ASCO G-CSF guidelines",
            "TEMPO trial: Outpatient management of low-risk FN",
            "Temel et al: Early palliative care in lung cancer"
          ]
        },
        videos: [
          { id: "9aT0f2J6qZU", title: "Supportive Care in Cancer", description: "Managing treatment effects", duration: "12:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Emetogenic_potential.svg/800px-Emetogenic_potential.svg.png", title: "Emetogenic Potential", description: "Antiemetic selection guide" }
        ]
      }
    ],
    caseStudies: {
      undergraduate: {
        title: "Newly Diagnosed Breast Cancer",
        patient: "Mrs. Thompson, 52-year-old female",
        presentation: "Screening mammogram showed 2cm mass. Core biopsy: Invasive ductal carcinoma, ER+, PR+, HER2-. Stage IIA.",
        findings: "Clinical stage T2N0M0. Patient postmenopausal. Good performance status. No significant comorbidities.",
        questions: ["What type of therapy is indicated?", "What targeted therapy is appropriate?", "What supportive care is needed?"],
        answers: ["Surgery followed by adjuvant chemotherapy consideration, then endocrine therapy", "None - HER2 negative, hormone receptor positive means endocrine therapy", "Antiemetics during chemo, bone health with aromatase inhibitor"]
      },
      postgraduate: {
        title: "Metastatic Non-Small Cell Lung Cancer",
        patient: "Mr. Chen, 65-year-old male, former smoker",
        presentation: "Progressive dyspnea and cough. CT shows 4cm right upper lobe mass with mediastinal nodes and liver lesions. Biopsy: Adenocarcinoma.",
        findings: "Stage IV (T3N2M1). EGFR mutation positive. PD-L1 20%. Good performance status (ECOG 1).",
        questions: ["What is the appropriate first-line systemic therapy?", "What molecular findings guide treatment?", "What monitoring is needed?"],
        answers: ["EGFR TKI (osimertinib) first-line for EGFR-mutated NSCLC", "EGFR mutation status is critical - TKIs highly effective; PD-L1 less relevant when EGFR+ for initial therapy", "Monitor for rash, diarrhea, pulmonary toxicity; serial imaging; resistance testing at progression"]
      }
    }
  },

  // ==================== ENDOCRINE COURSE ====================
  {
    id: "endocrine",
    title: "Endocrine Pharmacology",
    shortTitle: "Endocrine",
    description: "Complete coverage of endocrine pharmacology including diabetes medications, thyroid drugs, corticosteroids, and reproductive endocrinology.",
    icon: "Activity",
    color: "amber",
    category: "Endocrinology",
    totalModules: 4,
    duration: "8 hours",
    level: "All Levels",
    modules: [
      {
        id: 1,
        title: "Diabetes Medications",
        icon: "Droplet",
        color: "amber",
        writtenContent: {
          introduction: "Diabetes affects over 400 million people globally. Modern diabetes management offers multiple drug classes targeting different pathophysiological mechanisms. Selection depends on diabetes type, comorbidities, and patient factors. Cardiovascular and renal outcomes have become key considerations in drug selection.",
          coreConcepts: [
            "Insulin: Type 1 and advanced Type 2 - multiple formulations",
            "Metformin: First-line for T2DM - reduces hepatic glucose production",
            "Sulfonylureas: Insulin secretagogues - hypoglycemia risk",
            "SGLT2 inhibitors: Renal glucose excretion - CV/renal benefits",
            "GLP-1 receptor agonists: Incretin mimetics - weight loss, CV benefits"
          ],
          clinicalPearls: [
            "Metformin remains first-line for most T2DM patients",
            "SGLT2i: Preferred for patients with HF or CKD",
            "GLP-1 RA: Preferred for patients with ASCD or obesity",
            "Insulin: Required in Type 1, consider early in T2DM if catabolic"
          ],
          warnings: [
            "Hypoglycemia: Sulfonylureas, insulin, meglitinides",
            "DKA: SGLT2 inhibitors (euglycemic DKA possible)",
            "Lactic acidosis: Metformin (rare, usually with renal impairment)",
            "GI effects: Metformin, GLP-1 RA"
          ]
        },
        undergraduate: {
          focus: "What are the main diabetes medication classes?",
          objectives: [
            "List major antidiabetic drug classes",
            "Understand basic mechanisms",
            "Know first-line medications",
            "Identify common side effects"
          ],
          keyPoints: [
            "Insulin: Essential for Type 1, important in Type 2",
            "Metformin: First-line oral agent",
            "Sulfonylureas: Stimulate insulin release",
            "SGLT2i, GLP-1 RA: Newer agents with CV benefits"
          ],
          simplifiedExplanation: "Diabetes medications work in different ways: metformin stops the liver from making too much sugar, sulfonylureas squeeze more insulin from the pancreas, SGLT2 inhibitors help the kidneys dump sugar into urine, and GLP-1 agonists slow digestion and reduce appetite while boosting insulin. Insulin directly replaces what's missing.",
          memoryAids: [
            "Metformin = 'Metabolic Fixer' - first-line",
            "Sulfonylureas = 'Squeeze insulin' from pancreas",
            "SGLT2 = 'Sugar Goes Low Through kidneys'",
            "GLP-1 = 'Great for Losing Pounds and Glucose'"
          ]
        },
        postgraduate: {
          focus: "Individualized diabetes management and cardiorenal protection",
          objectives: [
            "Select appropriate agents based on comorbidities",
            "Implement cardiorenal protection strategies",
            "Intensify therapy appropriately",
            "Manage diabetes in special populations"
          ],
          keyPoints: [
            "T2DM with ASCVD: GLP-1 RA or SGLT2i with proven benefit",
            "T2DM with HF: SGLT2i (dapagliflozin, empagliflozin)",
            "T2DM with CKD: SGLT2i, finerenone",
            "Obesity: GLP-1 RA preferred"
          ],
          advancedConcepts: "Modern diabetes management focuses on cardio-renal-metabolic protection. Cardiovascular outcomes trials have established SGLT2 inhibitors and GLP-1 receptor agonists as cardioprotective and renoprotective. The ADA/EASD consensus emphasizes patient-centered care, considering comorbidities, cost, and patient preferences. Early combination therapy is increasingly recommended.",
          evidenceBase: [
            "UKPDS: Long-term benefits of good control",
            "EMPAREG-OUTCOME, CANVAS: SGLT2i CV benefits",
            "LEADER, SUSTAIN-6: GLP-1 RA CV benefits",
            "DAPA-HF, EMPEROR-Reduced: SGLT2i in HF"
          ]
        },
        videos: [
          { id: "2wL89H2UqzU", title: "Diabetes Medications Overview", description: "Complete antidiabetic drugs", duration: "20:00", source: "Osmosis" },
          { id: "yJqT3ZgR9WI", title: "Insulin Types and Pharmacokinetics", description: "Insulin formulations explained", duration: "14:00", source: "Ninja Nerd" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Insulin_glucose_metabolism.jpg/800px-Insulin_glucose_metabolism.jpg", title: "Glucose Metabolism", description: "Drug targets in glucose regulation" }
        ]
      },
      {
        id: 2,
        title: "Thyroid Medications",
        icon: "Activity",
        color: "cyan",
        writtenContent: {
          introduction: "Thyroid disorders are among the most common endocrine conditions. Hypothyroidism requires lifelong levothyroxine replacement, while hyperthyroidism management involves antithyroid drugs, radioactive iodine, or surgery. Understanding the pharmacology is essential for optimal management.",
          coreConcepts: [
            "Levothyroxine (T4): Standard replacement therapy",
            "Liothyronine (T3): Limited use, rapid onset",
            "Thionamides: Methimazole, PTU - block thyroid hormone synthesis",
            "Beta-blockers: Symptomatic control in hyperthyroidism",
            "Radioactive iodine: Definitive treatment for hyperthyroidism"
          ],
          clinicalPearls: [
            "Levothyroxine: Take on empty stomach, separate from other meds",
            "TSH monitoring: Guide for dose adjustment",
            "Methimazole preferred: PTU for first trimester pregnancy only",
            "Beta-blockers: For symptoms while awaiting antithyroid effect"
          ],
          warnings: [
            "Levothyroxine interactions: Calcium, iron, PPIs reduce absorption",
            "Thionamides: Agranulocytosis, hepatotoxicity",
            "PTU: Risk of severe hepatotoxicity",
            "Radioactive iodine: Contraindicated in pregnancy"
          ]
        },
        undergraduate: {
          focus: "What drugs treat thyroid disorders?",
          objectives: [
            "Know treatment for hypothyroidism",
            "List antithyroid drugs",
            "Understand basic monitoring",
            "Identify common interactions"
          ],
          keyPoints: [
            "Hypothyroidism: Levothyroxine replacement",
            "Hyperthyroidism: Methimazole, PTU",
            "Monitoring: TSH for hypothyroidism",
            "Interactions: Many drugs affect levothyroxine absorption"
          ],
          simplifiedExplanation: "For underactive thyroid (hypothyroidism), we replace the missing hormone with levothyroxine - a synthetic version of T4. For overactive thyroid (hyperthyroidism), we use drugs that block thyroid hormone production, or radioactive iodine that destroys overactive thyroid tissue.",
          memoryAids: [
            "Hypo = 'Low' = need replacement",
            "Hyper = 'High' = need to block",
            "Levothyroxine = 'Levo' = Long-acting T4",
            "Methimazole = 'Meth' for Most hyperthyroidism"
          ]
        },
        postgraduate: {
          focus: "Optimizing thyroid therapy and managing complex cases",
          objectives: [
            "Interpret thyroid function tests for dosing",
            "Manage thyroid disorders in pregnancy",
            "Handle thyroid storm and myxedema coma",
            "Address subclinical thyroid disease"
          ],
          keyPoints: [
            "TSH targets: Varies by age, pregnancy status",
            "Pregnancy: Increase levothyroxine dose 25-50%",
            "Thyroid storm: PTU + beta-blocker + steroids + iodine",
            "Subclinical hypothyroidism: Treat if TSH >10 or symptomatic"
          ],
          advancedConcepts: "Thyroid hormone replacement requires individualized dosing based on weight, age, cardiac status, and pregnancy. During pregnancy, thyroid hormone requirements increase, and tighter TSH control is recommended. Thyroid storm is an endocrine emergency requiring ICU care. Combination T3/T4 therapy remains controversial and not routinely recommended.",
          evidenceBase: [
            "ATA guidelines: Hypothyroidism and hyperthyroidism management",
            "Pregnancy thyroid guidelines: TSH targets by trimester",
            "Subclinical thyroid disease: When to treat",
            "Desiccated thyroid: Not recommended (ATA)"
          ]
        },
        videos: [
          { id: "O7pT4_uS5LI", title: "Thyroid Medications", description: "Hypo and hyperthyroidism drugs", duration: "12:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Thyroid_system.svg/800px-Thyroid_system.svg.png", title: "Thyroid Axis", description: "HPT axis and drug targets" }
        ]
      },
      {
        id: 3,
        title: "Corticosteroids",
        icon: "Sun",
        color: "yellow",
        writtenContent: {
          introduction: "Corticosteroids are among the most widely used medications, with applications across virtually all medical specialties. They have potent anti-inflammatory and immunosuppressive effects but also significant adverse effects with long-term use. Understanding their pharmacology is essential for safe prescribing.",
          coreConcepts: [
            "Glucocorticoids: Anti-inflammatory, metabolic effects",
            "Mineralocorticoids: Sodium retention, potassium loss",
            "Potency comparisons: Prednisone, methylprednisolone, dexamethasone",
            "Routes: Oral, IV, inhaled, topical, intra-articular",
            "HPA axis suppression: With prolonged use"
          ],
          clinicalPearls: [
            "Dose equivalency: Prednisone 5mg = hydrocortisone 20mg = dexamethasone 0.75mg",
            "Short-term: Few side effects; long-term: many complications",
            "Tapering: Required if >2-3 weeks of therapy",
            "Stress dosing: Increase during illness in adrenal insufficiency"
          ],
          warnings: [
            "Long-term effects: Osteoporosis, diabetes, infections, adrenal suppression",
            "Don't stop abruptly after prolonged use - taper",
            "Cautions: Diabetes, hypertension, osteoporosis, infections",
            "Drug interactions: CYP3A4"
          ]
        },
        undergraduate: {
          focus: "What are corticosteroids and how are they used?",
          objectives: [
            "Distinguish glucocorticoids from mineralocorticoids",
            "Know common corticosteroid drugs",
            "Understand when tapering is needed",
            "Identify major side effects"
          ],
          keyPoints: [
            "Glucocorticoids: Prednisone, dexamethasone, methylprednisolone",
            "Mineralocorticoid: Fludrocortisone",
            "Used for: Inflammation, autoimmune, replacement",
            "Side effects: Weight gain, diabetes, bone loss"
          ],
          simplifiedExplanation: "Corticosteroids are synthetic versions of hormones your body makes naturally. They're powerful anti-inflammatories that calm down an overactive immune system. Short-term use is usually safe, but long-term use can cause many problems including bone thinning, weight gain, diabetes, and increased infection risk.",
          memoryAids: [
            "Corticosteroid = 'Cortisol-like' = Anti-inflammatory",
            "Prednisone = 'Primary' oral corticosteroid",
            "Dexamethasone = 'Dexamethasone is Dexamethasone' (potent, long-acting)",
            "Tapering = 'Take Away gradually to Protect adrenal axis'"
          ]
        },
        postgraduate: {
          focus: "Optimizing corticosteroid therapy and managing complications",
          objectives: [
            "Select appropriate agent and route",
            "Implement bone and GI protection",
            "Manage adrenal insufficiency",
            "Navigate steroid-sparing strategies"
          ],
          keyPoints: [
            "Acute severe illness: Stress dose hydrocortisone",
            "Chronic use: Bone protection (bisphosphonate), PPI, monitor glucose",
            "Adrenal insufficiency: Hydrocortisone + fludrocortisone",
            "Steroid-sparing: Transition to other immunosuppressants"
          ],
          advancedConcepts: "The goal of long-term corticosteroid management is to minimize exposure while maintaining disease control. This involves finding the lowest effective dose, transitioning to steroid-sparing agents when possible, and prophylaxis against complications (bisphosphonates for osteoporosis, PPIs for GI protection). Critical illness-related corticosteroid insufficiency (CIRCI) requires recognition and treatment in ICU settings.",
          evidenceBase: [
            "Recommendations for glucocorticoid-induced osteoporosis",
            "COVACTA, RECOVERY: Dexamethasone in COVID-19",
            "Stress dosing guidelines for adrenal insufficiency",
            "Steroid-sparing strategies in autoimmune disease"
          ]
        },
        videos: [
          { id: "eT1Fp9hJpS0", title: "Corticosteroids Pharmacology", description: "Complete steroid overview", duration: "18:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Steroidogenesis.svg/800px-Steroidogenesis.svg.png", title: "Steroid Synthesis", description: "Pathways and drug targets" }
        ]
      },
      {
        id: 4,
        title: "Bone & Calcium Pharmacology",
        icon: "Activity",
        color: "slate",
        writtenContent: {
          introduction: "Bone disorders including osteoporosis affect millions worldwide. Pharmacotherapy can significantly reduce fracture risk. Understanding the bone remodeling cycle and drug mechanisms is essential for appropriate selection and monitoring of anti-osteoporotic therapy.",
          coreConcepts: [
            "Bisphosphonates: Inhibit osteoclast-mediated bone resorption",
            "Denosumab: RANKL inhibitor, monoclonal antibody",
            "Teriparatide: PTH analog, anabolic agent",
            "Romosozumab: Sclerostin inhibitor, anabolic + antiresorptive",
            "Calcium and vitamin D: Foundation of therapy"
          ],
          clinicalPearls: [
            "Bisphosphonates: First-line for most patients with osteoporosis",
            "Drug holiday: After 3-5 years of oral bisphosphonate",
            "Denosumab: Don't delay doses - rebound bone loss",
            "Anabolic agents: For very high risk or bisphosphonate failure"
          ],
          warnings: [
            "Bisphosphonates: Esophagitis (oral), ONJ, atypical femur fracture",
            "Denosumab: Hypocalcemia, ONJ, rebound fractures if stopped",
            "Teriparatide: Osteosarcoma risk (theoretical), limit 2 years",
            "Renal function: Adjust for CKD"
          ]
        },
        undergraduate: {
          focus: "What drugs treat bone disorders?",
          objectives: [
            "List major anti-osteoporosis drugs",
            "Understand basic mechanisms",
            "Know first-line therapy",
            "Identify common side effects"
          ],
          keyPoints: [
            "Bisphosphonates: Alendronate, zoledronic acid",
            "Denosumab: Injection every 6 months",
            "Teriparatide: Daily injection, builds bone",
            "Calcium + vitamin D: Foundation for all"
          ],
          simplifiedExplanation: "Bone constantly remodels itself - old bone is removed (by osteoclasts) and new bone is added (by osteoblasts). Osteoporosis happens when removal outpaces addition. Bisphosphonates and denosumab slow down removal, while teriparatide and romosozumab speed up new bone formation.",
          memoryAids: [
            "Bisphosphonate = 'Blocks bone Breakdown'",
            "Denosumab = 'Don't miss doses' (rebound effect)",
            "Teriparatide = 'Terra-forming' new bone",
            "ONJ = Osteonecrosis of Jaw (rare but serious)"
          ]
        },
        postgraduate: {
          focus: "Individualized osteoporosis management",
          objectives: [
            "Assess fracture risk and select therapy",
            "Sequence anabolic and antiresorptive agents",
            "Manage treatment complications",
            "Address special populations"
          ],
          keyPoints: [
            "Very high risk: Start with anabolic (teriparatide, romosozumab)",
            "Post-anabolic: Must follow with antiresorptive",
            "Glucocorticoid-induced: Treat earlier, bisphosphonate first-line",
            "CKD: Consider risks/benefits, adjust therapy"
          ],
          advancedConcepts: "Modern osteoporosis management involves risk stratification using tools like FRAX and consideration of 'very high risk' patients who may benefit from anabolic therapy first. Sequencing is important - anabolic agents should be followed by antiresorptives to maintain gains. Drug holidays are appropriate for bisphosphonates but not denosumab due to rebound bone loss.",
          evidenceBase: [
            "FRAX algorithm: Fracture risk prediction",
            "ARCH trial: Romosozumab efficacy and safety",
            "Fosamax, HORIZON trials: Bisphosphonate efficacy",
            "FREEDOM trial: Denosumab efficacy"
          ]
        },
        videos: [
          { id: "aJ8LwZr4QEs", title: "Osteoporosis Medications", description: "Anti-osteoporosis drugs", duration: "14:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Bone_remodeling_cycle.svg/800px-Bone_remodeling_cycle.svg.png", title: "Bone Remodeling", description: "Cycle and drug targets" }
        ]
      }
    ],
    caseStudies: {
      undergraduate: {
        title: "Newly Diagnosed Type 2 Diabetes",
        patient: "Robert, 58-year-old male",
        presentation: "Routine labs show HbA1c 8.2%. BMI 31. No symptoms of hyperglycemia. No known complications.",
        findings: "BP 138/88. Fasting glucose 9.2 mmol/L. Creatinine normal. Urine albumin:creatinine ratio normal. Lipids mildly elevated.",
        questions: ["What is the diagnosis?", "What first-line medication is recommended?", "What lifestyle modifications are needed?"],
        answers: ["Type 2 diabetes mellitus (HbA1c ≥6.5%)", "Metformin 500mg BD, titrate to 1g BD, plus lifestyle modifications", "Weight loss, Mediterranean diet, 150 min/week exercise, smoking cessation if applicable"]
      },
      postgraduate: {
        title: "Type 2 Diabetes with Cardiovascular Disease",
        patient: "Mrs. Garcia, 64-year-old female",
        presentation: "T2DM for 12 years. Recent MI 3 months ago. Currently on metformin 1g BD and glipizide 10mg BD. HbA1c 7.8%.",
        findings: "BP 128/78 on ramipril. BMI 29. Echo shows LVEF 45%. eGFR 72. Recent coronary stenting.",
        questions: ["What additional diabetes medication is indicated?", "What is the rationale for this choice?", "What monitoring is needed?"],
        answers: ["Add SGLT2 inhibitor (empagliflozin or dapagliflozin) for cardiorenal protection", "SGLT2 inhibitors have proven mortality and heart failure benefits in patients with ASCVD and HF", "Monitor for genital infections, volume status, eGFR; rare DKA risk; stop temporarily during acute illness/surgery"]
      }
    }
  },

  // ==================== RESPIRATORY COURSE ====================
  {
    id: "respiratory",
    title: "Respiratory Pharmacology",
    shortTitle: "Respiratory",
    description: "Comprehensive coverage of respiratory medications including bronchodilators, inhaled corticosteroids, antihistamines, and pulmonary therapies.",
    icon: "Wind",
    color: "sky",
    category: "Pulmonology",
    totalModules: 3,
    duration: "6 hours",
    level: "All Levels",
    modules: [
      {
        id: 1,
        title: "Bronchodilators",
        icon: "Wind",
        color: "sky",
        writtenContent: {
          introduction: "Bronchodilators are the mainstay of symptomatic treatment for asthma and COPD. They work by relaxing airway smooth muscle through different mechanisms. Combination therapy with inhaled corticosteroids provides optimal outcomes for most patients with obstructive airway disease.",
          coreConcepts: [
            "Short-acting beta-agonists (SABA): Quick relief - albuterol/salbutamol",
            "Long-acting beta-agonists (LABA): Maintenance - salmeterol, formoterol",
            "Short-acting anticholinergics (SAMA): Ipratropium",
            "Long-acting anticholinergics (LAMA): Tiotropium, aclidinium",
            "Methylxanthines: Theophylline - limited use due to toxicity"
          ],
          clinicalPearls: [
            "SABA: Rescue medication - should not be needed frequently if well-controlled",
            "LABA should not be used alone in asthma (increase risk of severe exacerbations)",
            "LAMA: Particularly effective in COPD",
            "Inhaler technique: Critical for effectiveness"
          ],
          warnings: [
            "LABA monotherapy in asthma: Increased risk of death",
            "Beta-agonists: Tachycardia, tremor, hypokalemia",
            "Anticholinergics: Dry mouth, urinary retention, glaucoma risk",
            "Theophylline: Narrow therapeutic index, many interactions"
          ]
        },
        undergraduate: {
          focus: "What are the main bronchodilator classes?",
          objectives: [
            "List bronchodilator classes and examples",
            "Understand basic mechanisms",
            "Know rescue vs maintenance therapy",
            "Identify common side effects"
          ],
          keyPoints: [
            "SABA: Albuterol - rescue inhaler",
            "LABA: Salmeterol, formoterol - long-term control",
            "SAMA/LAMA: Ipratropium, tiotropium - anticholinergic",
            "LABA + ICS: Standard for moderate-severe asthma"
          ],
          simplifiedExplanation: "Bronchodilators open up narrowed airways. Beta-agonists work by activating 'go' receptors on airway muscles, making them relax. Anticholinergics block 'no-go' signals that cause muscles to tighten. Short-acting drugs work fast for quick relief; long-acting drugs work all day for prevention.",
          memoryAids: [
            "SABA = Short Acting Beta Agonist = 'Save Airway Fast'",
            "LABA = Long Acting Beta Agonist = 'Lasts All day'",
            "SAMA/LAMA = Anti-cholinergic = 'Anti-constriction'",
            "'Blue for rescue, Brown/orange for prevention' (inhaler colors)"
          ]
        },
        postgraduate: {
          focus: "Optimizing inhaled therapy for asthma and COPD",
          objectives: [
            "Select appropriate inhaler therapy based on disease and severity",
            "Implement SMART/MART regimens",
            "Manage acute exacerbations",
            "Address inhaler technique and adherence"
          ],
          keyPoints: [
            "Asthma: Step-wise approach, ICS foundation, LABA add-on",
            "COPD: LAMA or LAMA/LABA for symptoms, ICS for eosinophilic phenotype",
            "SMART therapy: Budesonide-formoterol as both maintenance and rescue",
            "Triple therapy: ICS/LABA/LAMA for severe disease"
          ],
          advancedConcepts: "GINA guidelines now recommend against SABA-only therapy for asthma due to safety concerns, favoring low-dose ICS-formoterol as needed for mild asthma. In COPD, blood eosinophil count guides ICS use. Dual bronchodilation (LABA/LAMA) is more effective than either alone. Inhaler device selection should consider patient ability and preference.",
          evidenceBase: [
            "GINA guidelines: Asthma management",
            "GOLD guidelines: COPD management",
            "IMPACT trial: Triple therapy in COPD",
            "SYGMA trials: As-needed ICS-formoterol for mild asthma"
          ]
        },
        videos: [
          { id: "8eHj6b2FCoQ", title: "Bronchodilators Pharmacology", description: "Beta-agonists and anticholinergics", duration: "14:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Airway_cross-section.svg/800px-Airway_cross-section.svg.png", title: "Airway Structure", description: "Bronchodilator targets" }
        ]
      },
      {
        id: 2,
        title: "Inhaled Corticosteroids & Other Controllers",
        icon: "Shield",
        color: "orange",
        writtenContent: {
          introduction: "Inhaled corticosteroids (ICS) are the most effective anti-inflammatory medications for persistent asthma. They reduce airway hyperresponsiveness and improve lung function. Understanding ICS potency, delivery devices, and combination therapy is essential for optimal asthma and COPD management.",
          coreConcepts: [
            "ICS: Beclomethasone, budesonide, fluticasone, mometasone",
            "ICS potency: Low, medium, high dose categorization",
            "ICS/LABA combinations: Mainstay for moderate-severe asthma",
            "Leukotriene modifiers: Montelukast - alternative for mild asthma",
            "Biologics: Anti-IgE, anti-IL5 for severe asthma"
          ],
          clinicalPearls: [
            "ICS: Reduce exacerbations and improve quality of life in asthma",
            "Rinse mouth after ICS: Prevent oral candidiasis",
            "COPD: ICS only for eosinophilic phenotype or asthma-COPD overlap",
            "Step down: When controlled for 3 months, reduce dose"
          ],
          warnings: [
            "Oral candidiasis and dysphonia: Use spacer, rinse mouth",
            "Systemic effects: Rare at low doses, more concern with high doses",
            "Don't stop abruptly: Risk of severe exacerbation",
            "Pneumonia risk: With ICS in COPD"
          ]
        },
        undergraduate: {
          focus: "What are inhaled corticosteroids and when are they used?",
          objectives: [
            "Know common ICS medications",
            "Understand when ICS is indicated",
            "Identify local side effects",
            "Learn about ICS/LABA combinations"
          ],
          keyPoints: [
            "ICS: Fluticasone, budesonide, beclomethasone",
            "Indicated: Persistent asthma, some COPD",
            "Side effects: Oral thrush, hoarseness",
            "Combinations: Seretide, Symbicort, Breo"
          ],
          simplifiedExplanation: "Inhaled corticosteroids are anti-inflammatory medications that calm down the airway inflammation that causes asthma. Unlike oral steroids, inhaled ones work directly in the lungs with fewer systemic side effects. They're like putting out a fire at its source rather than flooding the whole building with water.",
          memoryAids: [
            "ICS = Inhaled Corticosteroid = 'Inflammation Control Substance'",
            "Rinse and spit after ICS = 'Remove residue from mouth'",
            "ICS + LABA = 'Better Together' for asthma control",
            "Low, medium, high = potency levels, not drug amounts"
          ]
        },
        postgraduate: {
          focus: "Optimizing anti-inflammatory therapy and severe asthma management",
          objectives: [
            "Select appropriate ICS dose based on severity",
            "Identify candidates for biologics",
            "Manage steroid-dependent asthma",
            "Implement step-down therapy appropriately"
          ],
          keyPoints: [
            "Severe asthma phenotype: Eosinophilic vs non-eosinophilic",
            "Biologics: Anti-IgE (omalizumab), anti-IL5 (mepolizumab, benralizumab)",
            "Steroid-sparing: Consider biologics, azithromycin",
            "Adherence check: Before escalating therapy"
          ],
          advancedConcepts: "Severe asthma is now approached with phenotyping to guide targeted therapy. Type 2 (eosinophilic) asthma responds to ICS and biologics targeting IL-5, IL-4/IL-13, or IgE. Non-Type 2 asthma is more challenging to treat. Biologics have transformed management of severe uncontrolled asthma, reducing exacerbations and allowing steroid reduction.",
          evidenceBase: [
            "DREAM, MENSA, MUSCA: Anti-IL5 in severe eosinophilic asthma",
            "PROSPERO: Real-world ICS effectiveness",
            "IMPACT trial: ICS discontinuation in COPD increases exacerbations",
            "ATS/ERS severe asthma guidelines"
          ]
        },
        videos: [
          { id: "RwM5VbZgKh4", title: "Inhaled Corticosteroids", description: "ICS pharmacology and use", duration: "12:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Asthma_pathophysiology.svg/800px-Asthma_pathophysiology.svg.png", title: "Asthma Pathophysiology", description: "Inflammatory pathways and targets" }
        ]
      },
      {
        id: 3,
        title: "Antihistamines & Allergy Treatments",
        icon: "Shield",
        color: "violet",
        writtenContent: {
          introduction: "Antihistamines and other allergy medications are widely used for allergic rhinitis, urticaria, and other allergic conditions. Modern second-generation antihistamines provide effective symptom relief with minimal sedation compared to first-generation agents.",
          coreConcepts: [
            "First-generation antihistamines: Diphenhydramine, chlorpheniramine - sedating",
            "Second-generation antihistamines: Cetirizine, loratadine, fexofenadine - non-sedating",
            "Intranasal antihistamines: Azelastine, olopatadine",
            "Leukotriene receptor antagonists: Montelukast",
            "Mast cell stabilizers: Cromolyn - limited use"
          ],
          clinicalPearls: [
            "Second-generation: Preferred for regular use - less sedation",
            "Intranasal antihistamines: Faster onset than oral for allergic rhinitis",
            "Montelukast: Also useful in asthma and exercise-induced bronchoconstriction",
            "Diphenhydramine: Use limited - anticholinergic effects in elderly"
          ],
          warnings: [
            "First-generation: Sedation, impairment - avoid in elderly",
            "Anticholinergic effects: Urinary retention, confusion in elderly",
            "Drug interactions: First-generation with other sedating medications",
            "Montelukast: Rare neuropsychiatric effects"
          ]
        },
        undergraduate: {
          focus: "What are antihistamines and how are they used?",
          objectives: [
            "List antihistamine generations and examples",
            "Understand basic mechanism",
            "Know which generation to prefer",
            "Identify common side effects"
          ],
          keyPoints: [
            "First-generation: Benadryl - sedating",
            "Second-generation: Claritin, Zyrtec, Allegra - non-sedating",
            "Used for: Allergies, hives, allergic rhinitis",
            "Mechanism: Block H1 histamine receptors"
          ],
          simplifiedExplanation: "When you have an allergic reaction, your body releases histamine which causes itching, sneezing, and runny nose. Antihistamines block histamine from attaching to its receptors, preventing these symptoms. Newer antihistamines don't cross into the brain as much, so they don't cause drowsiness.",
          memoryAids: [
            "Antihistamine = 'Anti-Histamine effects'",
            "First-gen = 'First in line = more side effects'",
            "Second-gen = 'Second thoughts = Safer'",
            "H1 blockers for allergies, H2 blockers for acid"
          ]
        },
        postgraduate: {
          focus: "Optimizing allergic disease management",
          objectives: [
            "Select appropriate antihistamine for specific conditions",
            "Manage chronic urticaria",
            "Implement immunotherapy when appropriate",
            "Address refractory allergic disease"
          ],
          keyPoints: [
            "Allergic rhinitis: Intranasal steroids + oral antihistamine",
            "Chronic urticaria: High-dose antihistamines, omalizumab",
            "Anaphylaxis: Epinephrine first, antihistamines adjunctive",
            "Immunotherapy: For severe allergen-specific disease"
          ],
          advancedConcepts: "Allergic rhinitis management follows a stepwise approach with intranasal corticosteroids as the most effective single therapy. Combination of intranasal antihistamine and corticosteroid provides additive benefit. For chronic urticaria, guidelines recommend up to 4x standard antihistamine dose before adding omalizumab. Allergen immunotherapy provides disease-modifying effects.",
          evidenceBase: [
            "ARIA guidelines: Allergic rhinitis management",
            "EAACI guidelines: Chronic urticaria",
            "XTEND trial: Omalizumab in chronic urticaria",
            "Immunotherapy efficacy studies"
          ]
        },
        videos: [
          { id: "NcYqTcNl1JE", title: "Antihistamines Pharmacology", description: "H1 blockers explained", duration: "10:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Allergic_reaction.svg/800px-Allergic_reaction.svg.png", title: "Allergic Reaction Pathway", description: "Histamine release and drug targets" }
        ]
      }
    ],
    caseStudies: {
      undergraduate: {
        title: "Newly Diagnosed Asthma",
        patient: "Lisa, 22-year-old female",
        presentation: "Recurrent episodes of wheezing and shortness of breath, worse with exercise and during spring. Nighttime symptoms 2-3 times per week.",
        findings: "Spirometry shows obstructive pattern with 15% reversibility after bronchodilator. Peak flow 75% predicted. No occupational exposures.",
        questions: ["What is the diagnosis and severity?", "What maintenance therapy is indicated?", "What rescue medication should be provided?"],
        answers: ["Mild persistent asthma (symptoms >2 days/week, nighttime symptoms)", "Low-dose inhaled corticosteroid daily, consider as-needed ICS-formoterol", "SABA (albuterol) as needed for symptoms - up to 2-3 times weekly if well-controlled"]
      },
      postgraduate: {
        title: "Severe Uncontrolled Asthma",
        patient: "Mr. Williams, 45-year-old male",
        presentation: "Asthma for 20 years, despite high-dose ICS/LABA and montelukast. Frequent exacerbations requiring oral steroids. Nighttime symptoms most nights.",
        findings: "Spirometry: FEV1 65%, 18% reversibility. Blood eosinophils 450/μL. FeNO 45 ppb. Skin prick test positive for dust mites. Not smoking.",
        questions: ["What phenotype does this patient have?", "What additional therapy should be considered?", "What workup is needed before biologics?"],
        answers: ["Severe eosinophilic (Type 2) asthma", "Anti-IL5 therapy (mepolizumab or benralizumab) or anti-IgE (omalizumab) - eosinophilic phenotype benefits from anti-IL5", "Confirm adherence and technique, assess for comorbidities (GERD, sinus disease), consider IgE level for omalizumab dosing"]
      }
    }
  }
]

export const courseCategories = [
  { id: "infectious", name: "Infectious Disease", icon: "Pill", courseIds: ["antibiotics"] },
  { id: "cardiovascular", name: "Cardiovascular", icon: "Heart", courseIds: ["cardiovascular"] },
  { id: "neurology", name: "Neurology/Psychiatry", icon: "Brain", courseIds: ["cns"] },
  { id: "oncology", name: "Oncology", icon: "Radiation", courseIds: ["oncology"] },
  { id: "endocrine", name: "Endocrinology", icon: "Activity", courseIds: ["endocrine"] },
  { id: "pulmonology", name: "Pulmonology", icon: "Wind", courseIds: ["respiratory"] }
]

export function getCourseById(id: string): Course | undefined {
  return courses.find(course => course.id === id)
}

export function getCoursesByCategory(categoryId: string): Course[] {
  const category = courseCategories.find(c => c.id === categoryId)
  if (!category) return []
  return courses.filter(course => category.courseIds.includes(course.id))
}
