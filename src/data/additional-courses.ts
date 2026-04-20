// Additional courses data - exported for use in main application

import { Course } from './courses'

export const additionalCourses: Course[] = [
  // ==================== GASTROINTESTINAL PHARMACOLOGY ====================
  {
    id: "gastrointestinal",
    title: "Gastrointestinal Pharmacology",
    shortTitle: "GI Pharmacology",
    description: "Complete coverage of GI medications including antiulcer drugs, antacids, antiemetics, laxatives, and drugs for IBD and liver disease.",
    icon: "Activity",
    color: "orange",
    category: "Gastroenterology",
    totalModules: 5,
    duration: "8 hours",
    level: "All Levels",
    modules: [
      {
        id: 1,
        title: "Antiulcer Drugs & Acid Suppressants",
        icon: "Shield",
        color: "orange",
        writtenContent: {
          introduction: "Acid-related disorders including GERD, peptic ulcer disease, and Zollinger-Ellison syndrome affect millions worldwide. Understanding acid physiology and pharmacology of acid suppressants is fundamental to managing these conditions effectively.",
          coreConcepts: [
            "Proton pump inhibitors (PPIs): Most potent acid suppression - omeprazole, esomeprazole, pantoprazole",
            "H2 receptor antagonists: Cimetidine, ranitidine, famotidine - moderate acid suppression",
            "Antacids: Immediate but short-lasting neutralization",
            "Cytoprotective agents: Sucralfate, misoprostol - protect mucosa",
            "Helicobacter pylori eradication: Combination therapy required"
          ],
          clinicalPearls: [
            "PPIs should be taken 30-60 minutes before meals for optimal effect",
            "Long-term PPI use: Consider risks - osteoporosis, B12 deficiency, infections",
            "H. pylori: Triple/quadruple therapy for 14 days",
            "Stress ulcer prophylaxis: Indicated in critically ill patients"
          ],
          warnings: [
            "PPI: Increased risk of C. difficile, pneumonia, hypomagnesemia",
            "Cimetidine: Multiple drug interactions via CYP450 inhibition",
            "Misoprostol: Contraindicated in pregnancy (abortifacient)",
            "PPI rebound hypersecretion on discontinuation"
          ]
        },
        undergraduate: {
          focus: "What drugs reduce stomach acid?",
          objectives: [
            "List major antiulcer drug classes",
            "Understand basic mechanism of PPIs and H2 blockers",
            "Know common indications for each class",
            "Identify major side effects"
          ],
          keyPoints: [
            "PPIs: Block H+/K+ ATPase pump - most effective",
            "H2 blockers: Block histamine receptors on parietal cells",
            "Antacids: Neutralize existing acid - rapid relief",
            "Triple therapy: PPI + 2 antibiotics for H. pylori"
          ],
          simplifiedExplanation: "Your stomach produces acid to digest food. Too much acid causes heartburn and ulcers. PPIs are like turning off the acid faucet at the source (the proton pump). H2 blockers are like partially closing the valve. Antacids neutralize the acid that's already there - like adding baking soda to vinegar.",
          memoryAids: [
            "PPI = 'Pump Prevents Increment' of acid",
            "H2 blocker = 'Halt Hydrochloric acid'",
            "PPIs: '-prazole' drugs (omeprazole, esomeprazole)",
            "H2 blockers: '-tidine' drugs (ranitidine, famotidine)"
          ]
        },
        postgraduate: {
          focus: "Optimizing acid suppression therapy and managing complications",
          objectives: [
            "Select appropriate acid suppressant based on indication",
            "Implement H. pylori testing and treatment protocols",
            "Manage PPI long-term complications",
            "Navigate drug interactions with acid suppressants"
          ],
          keyPoints: [
            "GERD: PPI for 8 weeks, then step-down approach",
            "PUD: Test and treat H. pylori, continue PPI",
            "Long-term PPI: Lowest effective dose, consider deprescribing",
            "Drug interactions: PPIs affect absorption of drugs needing acid"
          ],
          advancedConcepts: "PPIs have transformed management of acid-related disorders but long-term use requires careful consideration of risks including osteoporotic fractures, hypomagnesemia, B12 deficiency, and increased infection risk. The concept of 'deprescribing' PPIs is increasingly important as many patients remain on therapy unnecessarily.",
          evidenceBase: [
            "Cochrane reviews: PPI effectiveness in GERD and PUD",
            "CONSORT trial: H. pylori eradication regimens",
            "FDA warnings: Long-term PPI adverse effects",
            "Choosing Wisely: Deprescribing recommendations"
          ]
        },
        videos: [
          { id: "CwQjhktB2l0", title: "Proton Pump Inhibitors Mechanism", description: "How PPIs work", duration: "10:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Gastric_acid_regulation.svg/800px-Gastric_acid_regulation.svg.png", title: "Gastric Acid Regulation", description: "Cellular mechanisms and drug targets" }
        ]
      },
      {
        id: 2,
        title: "Antiemetics & Antiemetic Therapy",
        icon: "Shield",
        color: "green",
        writtenContent: {
          introduction: "Nausea and vomiting are common symptoms with many causes. The vomiting center in the brain integrates signals from multiple pathways. Understanding these pathways guides antiemetic selection based on the underlying cause.",
          coreConcepts: [
            "5-HT3 antagonists: Ondansetron, granisetron - serotonin pathway",
            "NK1 antagonists: Aprepitant, fosaprepitant - substance P pathway",
            "Dopamine antagonists: Metoclopramide, prochlorperazine",
            "Antihistamines: Dimenhydrinate, meclizine - vestibular pathway",
            "Anticholinergics: Scopolamine - motion sickness"
          ],
          clinicalPearls: [
            "Chemotherapy: 5-HT3 + NK1 antagonist + dexamethasone",
            "Postoperative: 5-HT3 antagonists first-line",
            "Motion sickness: Antihistamines or scopolamine",
            "Gastroparesis: Metoclopramide or domperidone"
          ],
          warnings: [
            "Metoclopramide: EPS risk, especially in young patients",
            "5-HT3 antagonists: QT prolongation risk",
            "Ondansetron: Serotonin syndrome risk with other serotonergic drugs",
            "Scopolamine: Anticholinergic effects - avoid in elderly"
          ]
        },
        undergraduate: {
          focus: "What drugs treat nausea and vomiting?",
          objectives: [
            "List major antiemetic classes",
            "Understand basic mechanisms",
            "Know common side effects",
            "Match antiemetics to causes"
          ],
          keyPoints: [
            "5-HT3 blockers: Ondansetron - chemo-induced",
            "Dopamine blockers: Metoclopramide - GI causes",
            "Antihistamines: Dimenhydrinate - motion sickness",
            "NK1 blockers: Aprepitant - chemotherapy"
          ],
          simplifiedExplanation: "Nausea involves different pathways to the brain's vomiting center. 5-HT3 blockers work on the gut-brain serotonin pathway. Dopamine blockers affect the brain's dopamine signals. Antihistamines and anticholinergics work on the balance system. Matching the drug to the cause gives the best results.",
          memoryAids: [
            "5-HT3 = 'Halt The Three' (3rd receptor)",
            "Ondansetron = 'On Deck' for chemotherapy nausea",
            "Metoclopramide = 'Moves things along' (prokinetic too)",
            "Scopolamine = 'Stops Seasickness'"
          ]
        },
        postgraduate: {
          focus: "Evidence-based antiemetic protocols",
          objectives: [
            "Implement risk-stratified antiemetic protocols",
            "Manage breakthrough nausea and vomiting",
            "Navigate antiemetic combinations",
            "Address special populations"
          ],
          keyPoints: [
            "Emetogenic risk: High, moderate, low, minimal",
            "Prophylaxis: Based on emetogenic potential",
            "Breakthrough: Add agent from different class",
            "Multimodal: Target multiple pathways"
          ],
          advancedConcepts: "Modern antiemetic therapy uses combination approaches targeting multiple receptor pathways. The MASCC/ESMO guidelines provide evidence-based protocols based on chemotherapy emetogenic potential.",
          evidenceBase: [
            "MASCC/ESMO antiemetic guidelines",
            "NCCN antiemesis guidelines",
            "APEX trial: NK1 antagonists in chemotherapy",
            "Guidelines for PONV prevention"
          ]
        },
        videos: [
          { id: "L7p2hOjFjvQ", title: "Antiemetics Overview", description: "Complete antiemetic pharmacology", duration: "14:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Vomiting_reflex.svg/800px-Vomiting_reflex.svg.png", title: "Vomiting Pathways", description: "Neural pathways and drug targets" }
        ]
      },
      {
        id: 3,
        title: "Laxatives & Bowel Preparations",
        icon: "Activity",
        color: "amber",
        writtenContent: {
          introduction: "Constipation affects up to 20% of the population. Multiple laxative classes work through different mechanisms. Proper selection based on constipation type and underlying cause is essential for effective management.",
          coreConcepts: [
            "Bulk-forming: Psyllium, methylcellulose - increase stool mass",
            "Osmotic: Polyethylene glycol, lactulose - draw water into lumen",
            "Stimulant: Bisacodyl, senna - increase motility",
            "Stool softeners: Docusate - emulsify stool",
            "Secretagogues: Linaclotide, lubiprostone - chloride channel activation"
          ],
          clinicalPearls: [
            "First-line: Bulk-forming + adequate fluid and fiber",
            "Opioid-induced constipation: Methylnaltrexone, naloxegol",
            "Chronic constipation: PEG preferred over stimulants",
            "Bowel prep: Split-dose regimens most effective"
          ],
          warnings: [
            "Stimulant laxatives: Concern for dependency with chronic use",
            "Lactulose: Can cause bloating, gas",
            "PEG: Electrolyte disturbances in renal impairment",
            "Bowel prep: Ensure adequate hydration"
          ]
        },
        undergraduate: {
          focus: "What are the different types of laxatives?",
          objectives: [
            "List major laxative classes",
            "Understand mechanism of each class",
            "Know first-line options",
            "Identify common side effects"
          ],
          keyPoints: [
            "Bulk-forming: Most gentle, first-line",
            "Osmotic: Effective, PEG is preferred",
            "Stimulant: For acute use, avoid long-term",
            "Stool softeners: Often insufficient alone"
          ],
          simplifiedExplanation: "Laxatives work in different ways: bulk-forming agents add volume to stool (like adding fiber). Osmotic laxatives pull water into the bowel (like a sponge). Stimulant laxatives make the bowel squeeze harder. Stool softeners make stool slippery. The choice depends on the problem and how fast you need results.",
          memoryAids: [
            "Bulk-forming = 'Big stool' from fiber",
            "Osmotic = 'Osmosis' pulls water",
            "Stimulant = 'Stimulates' contractions",
            "PEG = Polyethylene Glycol = 'Preferred Excellent Gentle'"
          ]
        },
        postgraduate: {
          focus: "Management of chronic constipation and special populations",
          objectives: [
            "Evaluate constipation etiology",
            "Implement stepwise treatment approach",
            "Manage opioid-induced constipation",
            "Navigate newer secretagogue agents"
          ],
          keyPoints: [
            "Assessment: Rule out structural causes, medications",
            "Stepwise: Lifestyle → bulk → osmotic → stimulant → secretagogues",
            "OIC: Peripherally acting mu-opioid receptor antagonists",
            "Refractory: Consider biofeedback, surgery"
          ],
          advancedConcepts: "Chronic constipation management requires identifying the subtype: normal transit, slow transit, or pelvic floor dysfunction. Peripherally acting mu-opioid receptor antagonists (PAMORAs) have transformed management of opioid-induced constipation. Newer secretagogue agents offer effective options for chronic constipation and IBS-C.",
          evidenceBase: [
            "AGA guidelines: Constipation management",
            "PACE trial: Linaclotide efficacy",
            "PAMORA trials: Methylnaltrexone, naloxegol",
            "Bowel preparation guidelines"
          ]
        },
        videos: [
          { id: "4LxY3AnYEbc", title: "Laxatives Pharmacology", description: "All laxative classes explained", duration: "11:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Constipation_mechanisms.svg/800px-Constipation_mechanisms.svg.png", title: "Constipation Mechanisms", description: "Types and treatment approaches" }
        ]
      },
      {
        id: 4,
        title: "Inflammatory Bowel Disease Medications",
        icon: "Shield",
        color: "red",
        writtenContent: {
          introduction: "Inflammatory bowel disease (IBD), including Crohn's disease and ulcerative colitis, requires a stepwise approach to therapy. Understanding the therapeutic pyramid and individualizing treatment based on disease location, severity, and patient factors is essential.",
          coreConcepts: [
            "5-ASA agents: Mesalamine - mild-moderate UC, limited Crohn's",
            "Corticosteroids: Induction only - not maintenance",
            "Immunomodulators: Azathioprine, 6-MP, methotrexate",
            "Biologics: Anti-TNF, anti-integrin, anti-IL12/23",
            "Small molecules: JAK inhibitors (tofacitinib, upadacitinib)"
          ],
          clinicalPearls: [
            "5-ASA: First-line for mild-moderate UC",
            "Corticosteroids: Bridge to maintenance therapy",
            "Anti-TNF: Infliximab, adalimumab for moderate-severe disease",
            "Therapeutic drug monitoring: Optimize biologic levels"
          ],
          warnings: [
            "Anti-TNF: Risk of serious infections, lymphoma",
            "Thiopurines: TPMT testing before starting",
            "JAK inhibitors: VTE risk, malignancy, infections",
            "Live vaccines: Contraindicated with biologics"
          ]
        },
        undergraduate: {
          focus: "What drugs are used for IBD?",
          objectives: [
            "List major IBD drug classes",
            "Understand the treatment pyramid",
            "Know when biologics are used",
            "Identify major side effects"
          ],
          keyPoints: [
            "5-ASA: Mild disease, especially UC",
            "Steroids: For flares, not long-term",
            "Immunomodulators: Maintenance therapy",
            "Biologics: Moderate-severe disease"
          ],
          simplifiedExplanation: "IBD treatment follows a 'pyramid' approach. At the base are mild drugs like 5-ASA for mild disease. Moving up, steroids calm flares quickly but aren't for long-term use. Immunomodulators and biologics are stronger medications for more severe disease, working by calming the overactive immune system.",
          memoryAids: [
            "5-ASA = 'Mild to Moderate' disease",
            "Biologics = 'Big guns' for severe disease",
            "Anti-TNF = 'Tumor Necrosis Factor blocker'",
            "Step-up vs top-down: Treatment approach choices"
          ]
        },
        postgraduate: {
          focus: "Advanced IBD therapeutics and treatment optimization",
          objectives: [
            "Implement treat-to-target approach",
            "Select appropriate biologic based on patient factors",
            "Apply therapeutic drug monitoring",
            "Manage biologic failures and switching"
          ],
          keyPoints: [
            "Treat-to-target: Mucosal healing as goal",
            "Biologic selection: Prioritize based on efficacy and safety",
            "TDM: Proactive vs reactive monitoring",
            "Combination therapy: Biologic + immunomodulator"
          ],
          advancedConcepts: "Modern IBD management follows a treat-to-target approach aiming for mucosal healing. Biologic selection involves consideration of efficacy, safety, patient factors, and cost. Therapeutic drug monitoring guides dose optimization.",
          evidenceBase: [
            "SONIC trial: Combination therapy in Crohn's",
            "SUCCESS trial: Infliximab in UC",
            "GEMINI trials: Vedolizumab efficacy",
            "UNITI trials: Ustekinumab in Crohn's"
          ]
        },
        videos: [
          { id: "H5QVzJGfNuM", title: "IBD Pharmacology", description: "Crohn's and UC medications", duration: "16:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/IBD_treatment_pyramid.svg/800px-IBD_treatment_pyramid.svg.png", title: "IBD Treatment Pyramid", description: "Stepwise treatment approach" }
        ]
      },
      {
        id: 5,
        title: "Liver Disease Pharmacology",
        icon: "Droplet",
        color: "brown",
        writtenContent: {
          introduction: "Liver disease management spans from viral hepatitis treatment to management of cirrhosis complications. Many drugs require dose adjustment in liver disease, and some are contraindicated.",
          coreConcepts: [
            "Antiviral therapy: Direct-acting antivirals for HCV, nucleos(t)ide analogs for HBV",
            "Portal hypertension: Non-selective beta-blockers, octreotide",
            "Ascites: Diuretics (spironolactone + furosemide)",
            "Hepatic encephalopathy: Lactulose, rifaximin",
            "Drug dosing: CP classification guides adjustments"
          ],
          clinicalPearls: [
            "HCV: DAAs cure >95% of patients",
            "HBV: Nucleos(t)ide analogs for viral suppression",
            "Variceal prophylaxis: Non-selective beta-blockers",
            "Ascites: Spironolactone:furosemide ratio 100:40 mg"
          ],
          warnings: [
            "NSAIDs: Avoid in cirrhosis - renal failure risk",
            "Sedatives: Can precipitate hepatic encephalopathy",
            "Aminoglycosides: Increased nephrotoxicity risk",
            "Many drugs: Require dose adjustment in liver disease"
          ]
        },
        undergraduate: {
          focus: "What drugs are used for liver disease?",
          objectives: [
            "Know treatment for viral hepatitis",
            "Understand ascites management",
            "Recognize drugs to avoid in liver disease",
            "Understand hepatic encephalopathy treatment"
          ],
          keyPoints: [
            "Hepatitis C: Direct-acting antivirals - curative",
            "Hepatitis B: Entecavir, tenofovir - viral suppression",
            "Ascites: Spironolactone + furosemide",
            "Encephalopathy: Lactulose, rifaximin"
          ],
          simplifiedExplanation: "The liver processes many drugs, so liver disease changes how drugs work. For hepatitis viruses, we have drugs that can cure hepatitis C or suppress hepatitis B. For cirrhosis complications, diuretics remove excess fluid, and lactulose helps clear toxins from the gut.",
          memoryAids: [
            "DAA = Direct-Acting Antivirals = 'Defeat All virus' for HCV",
            "Spironolactone = 'Saves potassium' = potassium-sparing",
            "Lactulose = 'Low ammonia' in encephalopathy",
            "Child-Pugh = Classification for drug dosing"
          ]
        },
        postgraduate: {
          focus: "Advanced liver disease management and transplant pharmacology",
          objectives: [
            "Implement antiviral protocols for HCV/HBV",
            "Manage complications of cirrhosis",
            "Navigate drug dosing in liver disease",
            "Understand transplant immunosuppression"
          ],
          keyPoints: [
            "HCV: DAA selection based on genotype, drug interactions",
            "HBV: Long-term suppression, monitor for resistance",
            "Refractory ascites: Paracentesis, TIPS consideration",
            "Transplant: Tacrolimus-based immunosuppression"
          ],
          advancedConcepts: "Modern hepatology has been transformed by DAAs achieving HCV cure in most patients. HBV management requires long-term viral suppression with monitoring for resistance and HCC surveillance. Drug dosing in cirrhosis follows Child-Pugh classification.",
          evidenceBase: [
            "AASLD guidelines: HCV and HBV treatment",
            "Baveno guidelines: Portal hypertension",
            "AASLD guidance: Drug-induced liver injury",
            "Transplant immunosuppression protocols"
          ]
        },
        videos: [
          { id: "PxrL98s1Xwg", title: "Hepatitis C Treatment", description: "Direct-acting antivirals", duration: "14:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/HCV_lifecycle.svg/800px-HCV_lifecycle.svg.png", title: "HCV Lifecycle", description: "DAA targets in viral replication" }
        ]
      }
    ],
    caseStudies: {
      undergraduate: {
        title: "GERD Management",
        patient: "Tom, 45-year-old male",
        presentation: "Heartburn 3-4 times per week for 3 months. Worse after meals and when lying down. Over-the-counter antacids provide partial relief.",
        findings: "No alarm features (no weight loss, dysphagia, or bleeding). Normal BMI. No medication use.",
        questions: ["What is the likely diagnosis?", "What first-line treatment is recommended?", "What lifestyle modifications should be advised?"],
        answers: ["Gastroesophageal reflux disease (GERD) - typical symptoms", "PPI therapy (omeprazole 20mg daily) for 8 weeks", "Elevate head of bed, avoid late meals, limit alcohol/caffeine, weight loss if overweight"]
      },
      postgraduate: {
        title: "Crohn's Disease with Failure of First-line Therapy",
        patient: "Ms. Rodriguez, 32-year-old female",
        presentation: "Crohn's disease diagnosed 2 years ago. Currently on mesalamine with persistent symptoms: diarrhea 4-5 times daily, abdominal pain, fatigue, weight loss of 5 kg.",
        findings: "CRP elevated 25 mg/L. Fecal calprotectin 450 μg/g. Colonoscopy shows moderate ileocolonic inflammation with deep ulcers. No perianal disease.",
        questions: ["What is the appropriate next step in therapy?", "What testing is needed before starting biologics?", "Which biologic would be appropriate?"],
        answers: ["Escalate to biologic therapy - mesalamine inadequate for moderate-severe Crohn's", "TB screening (Quantiferon/PPD), hepatitis B serology, vaccination status", "Anti-TNF (infliximab or adalimumab) or anti-IL12/23 (ustekinumab) or anti-integrin (vedolizumab) - consider patient factors"]
      }
    }
  },

  // ==================== RENAL PHARMACOLOGY ====================
  {
    id: "renal",
    title: "Renal Pharmacology",
    shortTitle: "Renal",
    description: "Complete coverage of diuretics, drugs for CKD, electrolyte disorders, and renal replacement therapy considerations.",
    icon: "Droplet",
    color: "cyan",
    category: "Nephrology",
    totalModules: 4,
    duration: "6 hours",
    level: "All Levels",
    modules: [
      {
        id: 1,
        title: "Diuretics",
        icon: "Droplet",
        color: "cyan",
        writtenContent: {
          introduction: "Diuretics are among the most commonly prescribed medications, used for hypertension, heart failure, and edema. Understanding site and mechanism of action is essential for appropriate selection and managing side effects.",
          coreConcepts: [
            "Loop diuretics: Furosemide, torsemide, bumetanide - ascending limb",
            "Thiazides: Hydrochlorothiazide, chlorthalidone - distal tubule",
            "Potassium-sparing: Spironolactone, eplerenone, amiloride",
            "Carbonic anhydrase inhibitors: Acetazolamide - proximal tubule",
            "Osmotic diuretics: Mannitol - not commonly used"
          ],
          clinicalPearls: [
            "Loop diuretics: Most potent, essential for pulmonary edema",
            "Thiazides: First-line for hypertension, less effective at GFR <30",
            "Spironolactone: Effective in resistant hypertension and HFrEF",
            "Diuretic resistance: Combination therapy, IV administration"
          ],
          warnings: [
            "Electrolyte abnormalities: Hypokalemia, hyponatremia, hypomagnesemia",
            "Loop diuretics: Ototoxicity at high IV doses",
            "Thiazides: Hyperuricemia, hyperglycemia, hyperlipidemia",
            "Spironolactone: Hyperkalemia, gynecomastia"
          ]
        },
        undergraduate: {
          focus: "What are the different types of diuretics?",
          objectives: [
            "List major diuretic classes",
            "Understand where each works in the nephron",
            "Know common indications",
            "Identify major side effects"
          ],
          keyPoints: [
            "Loop: Most powerful - pulmonary edema, severe edema",
            "Thiazides: Hypertension first-line",
            "K-sparing: Prevent hypokalemia, treat ascites",
            "Each works at different nephron site"
          ],
          simplifiedExplanation: "Diuretics make you pee more by blocking salt reabsorption at different parts of the kidney's filtering system. Loop diuretics work at the 'loop' and are strongest. Thiazides work later and are good for blood pressure. Potassium-sparing ones are milder and prevent potassium loss.",
          memoryAids: [
            "LOOP = 'Lots Of Output' - most powerful",
            "Thiazides = 'Treat Hypertension' - HTN first-line",
            "K-sparing = 'Keep potassium'",
            "Ascending Loop = Loop diuretics site"
          ]
        },
        postgraduate: {
          focus: "Diuretic optimization and managing resistance",
          objectives: [
            "Select appropriate diuretic for clinical scenario",
            "Manage diuretic resistance",
            "Navigate combination diuretic therapy",
            "Monitor and manage electrolyte complications"
          ],
          keyPoints: [
            "Acute pulmonary edema: IV loop diuretic",
            "Chronic HF: Loop + thiazide sequential nephron blockade",
            "Resistant HTN: Add spironolactone",
            "Monitor: Electrolytes, renal function, volume status"
          ],
          advancedConcepts: "Diuretic resistance is common in advanced heart failure and CKD. Strategies include increasing dose, IV administration, continuous infusion, and combination therapy. Aldosterone antagonists have proven mortality benefit in HFrEF.",
          evidenceBase: [
            "RALES trial: Spironolactone in HFrEF",
            "EMPHASIS-HF: Eplerenone in mild HF",
            "CARRESS-HF: Diuretic strategies in acute HF",
            "PATHWAY-2: Spironolactone in resistant hypertension"
          ]
        },
        videos: [
          { id: "CqFpaFX4RGk", title: "Diuretics Pharmacology", description: "Complete diuretic overview", duration: "16:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Diuretics_site_of_action.svg/800px-Diuretics_site_of_action.svg.png", title: "Diuretic Sites of Action", description: "Nephron sites for each class" }
        ]
      },
      {
        id: 2,
        title: "Chronic Kidney Disease Management",
        icon: "Activity",
        color: "purple",
        writtenContent: {
          introduction: "Chronic kidney disease affects 10-15% of the population. Medical management focuses on slowing progression, managing complications, and preparing for renal replacement therapy when needed.",
          coreConcepts: [
            "RAAS blockade: ACEi/ARB - slow progression",
            "SGLT2 inhibitors: Proven renal protection",
            "BP control: Target <130/80 in CKD",
            "Anemia management: ESA, iron supplementation",
            "Mineral bone disease: Phosphate binders, vitamin D, calcimimetics"
          ],
          clinicalPearls: [
            "ACEi/ARB: First-line in proteinuric CKD",
            "SGLT2i: Dapagliflozin approved for CKD regardless of diabetes",
            "ESA: Target Hb 10-11 g/dL, ensure iron replete first",
            "Avoid nephrotoxins: NSAIDs, contrast, certain antibiotics"
          ],
          warnings: [
            "ACEi/ARB: Hyperkalemia, AKI risk in bilateral RAS",
            "ESA: Cardiovascular risk with high Hb targets",
            "Phosphate binders: Calcium load, vascular calcification",
            "Drug dosing: Adjust for eGFR"
          ]
        },
        undergraduate: {
          focus: "What drugs are used to manage CKD?",
          objectives: [
            "Know medications that slow CKD progression",
            "Understand anemia treatment in CKD",
            "Recognize drugs to avoid in CKD",
            "Understand basic CKD staging"
          ],
          keyPoints: [
            "ACEi/ARB: Slow progression, especially proteinuric",
            "SGLT2i: New option for renal protection",
            "ESA: Treat anemia when Hb <10",
            "Avoid NSAIDs, adjust drug doses"
          ],
          simplifiedExplanation: "CKD management focuses on protecting remaining kidney function and treating complications. ACE inhibitors and SGLT2 inhibitors slow kidney decline. Anemia is treated with iron and ESAs. Bone health requires managing calcium and phosphorus.",
          memoryAids: [
            "ACEi/ARB = 'Always Consider for kidneys'",
            "SGLT2i = 'Slows Glomerular Loss'",
            "ESA = Erythropoiesis Stimulating Agent",
            "Avoid NSAIDs = 'No Safe Anti-inflammatory In Damaged kidneys'"
          ]
        },
        postgraduate: {
          focus: "CKD progression prevention and complication management",
          objectives: [
            "Implement evidence-based CKD progression strategies",
            "Manage CKD complications (anemia, MBD, acidosis)",
            "Navigate complex drug dosing in CKD",
            "Prepare for renal replacement therapy"
          ],
          keyPoints: [
            "Multipronged approach: BP, RAASi, SGLT2i, diet",
            "Anemia: Iron first, then ESA, avoid overcorrection",
            "MBD: Phosphate binders, vitamin D, calcimimetics",
            "Acidosis: Oral bicarbonate"
          ],
          advancedConcepts: "Modern CKD management uses multiple interventions to slow progression: RAAS blockade, SGLT2 inhibition, blood pressure control, glycemic control, and dietary modifications. The DAPA-CKD trial established SGLT2 inhibitors as renoprotective regardless of diabetes status.",
          evidenceBase: [
            "DAPA-CKD: Dapagliflozin in CKD",
            "EMPA-KIDNEY: Empagliflozin renal outcomes",
            "KDIGO guidelines: CKD management",
            "TREAT trial: ESA targeting in CKD"
          ]
        },
        videos: [
          { id: "5sMVdpBKrH4", title: "CKD Management", description: "Medical management of CKD", duration: "14:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Chronic_kidney_disease_progression.svg/800px-Chronic_kidney_disease_progression.svg.png", title: "CKD Progression", description: "Stages and interventions" }
        ]
      },
      {
        id: 3,
        title: "Electrolyte Disorders",
        icon: "Zap",
        color: "yellow",
        writtenContent: {
          introduction: "Electrolyte disorders are common in clinical practice. Understanding the pharmacology of electrolyte replacement and management is essential for safe and effective treatment.",
          coreConcepts: [
            "Potassium disorders: Causes, ECG changes, treatment",
            "Sodium disorders: Hyponatremia, hypernatremia management",
            "Calcium disorders: Hypo/hypercalcemia treatment",
            "Magnesium: Often overlooked, critical for many processes",
            "Phosphate: Disorders in CKD, malignancy"
          ],
          clinicalPearls: [
            "Severe hyperkalemia: IV calcium, insulin+glucose, beta-agonist",
            "Hyponatremia: Calculate sodium deficit, correct slowly",
            "Hypocalcemia: Calcium gluconate IV for symptomatic",
            "Magnesium: Replace before treating refractory hypokalemia"
          ],
          warnings: [
            "Hyperkalemia: Can be fatal - ECG monitoring essential",
            "Hyponatremia correction: Risk of ODS if too rapid",
            "IV potassium: Never bolus, maximum concentration limits",
            "Calcium: Tissue extravasation causes necrosis"
          ]
        },
        undergraduate: {
          focus: "How do we treat electrolyte disorders?",
          objectives: [
            "Know emergency treatment for hyperkalemia",
            "Understand hyponatremia correction principles",
            "Identify ECG changes with electrolyte disorders",
            "Know replacement routes and forms"
          ],
          keyPoints: [
            "Hyperkalemia: Calcium gluconate, insulin+glucose",
            "Hypokalemia: Oral preferred over IV",
            "Hyponatremia: Correct slowly to avoid brain damage",
            "Magnesium: Replace first in hypokalemia"
          ],
          simplifiedExplanation: "Electrolytes are charged particles essential for nerve and muscle function. Too much or too little causes problems - especially for the heart. Hyperkalemia (high potassium) is dangerous and needs quick treatment. Hyponatremia (low sodium) needs careful correction - too fast causes brain damage.",
          memoryAids: [
            "Hyperkalemia treatment: 'C BIG K' - Calcium, Bicarb, Insulin+Glucose, Kayexalate",
            "ODS = Osmotic Demyelination Syndrome (from rapid Na correction)",
            "Mg = 'Must give' before treating refractory hypokalemia",
            "Peaked T waves = Potassium high on ECG"
          ]
        },
        postgraduate: {
          focus: "Complex electrolyte disorders and management protocols",
          objectives: [
            "Differentiate causes of electrolyte disorders",
            "Implement evidence-based correction protocols",
            "Navigate complex cases (SIADH, cerebral salt wasting)",
            "Manage refractory electrolyte disorders"
          ],
          keyPoints: [
            "Hyperkalemia: Stabilize membrane → shift K+ → remove K+",
            "Hyponatremia: Hypovolemic, euvolemic, hypervolemic approach",
            "SIADH: Fluid restriction, vaptans, hypertonic saline if severe",
            "Refractory hypokalemia: Check magnesium, aldosterone"
          ],
          advancedConcepts: "Electrolyte management requires understanding pathophysiology and applying systematic approaches. For hyperkalemia: membrane stabilization (calcium), intracellular shift (insulin, beta-agonists), and elimination (diuretics, binders, dialysis). Hyponatremia classification by volume status guides treatment.",
          evidenceBase: [
            "KDIGO guidelines: Electrolyte management",
            "Hyperkalemia management protocols",
            "Hyponatremia correction guidelines",
            "Saline vs albumin in hypovolemia"
          ]
        },
        videos: [
          { id: "eSbLELwH3a0", title: "Hyperkalemia Management", description: "Emergency treatment", duration: "12:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Hyperkalemia_ECG.svg/800px-Hyperkalemia_ECG.svg.png", title: "Hyperkalemia ECG Changes", description: "Progressive ECG findings" }
        ]
      },
      {
        id: 4,
        title: "Renal Replacement Therapy & Transplant",
        icon: "Activity",
        color: "green",
        writtenContent: {
          introduction: "When kidney function declines severely, renal replacement therapy becomes necessary. Understanding dialysis and transplant pharmacology is essential for managing these patients safely.",
          coreConcepts: [
            "Dialysis types: Hemodialysis, peritoneal dialysis",
            "Drug removal by dialysis: Factors affecting clearance",
            "Transplant immunosuppression: Induction and maintenance",
            "Antimicrobial prophylaxis: Post-transplant infections",
            "Drug interactions: Calcineurin inhibitors"
          ],
          clinicalPearls: [
            "Many drugs need dosing adjustments for dialysis",
            "Calcineurin inhibitors: Therapeutic drug monitoring essential",
            "Antimetabolites: MMF most common, reduce in renal impairment",
            "Prophylaxis: TMP-SMX, antivirals, antifungals"
          ],
          warnings: [
            "Nephrotoxic drugs: Avoid or adjust after transplant",
            "Drug interactions: Many affect CNI levels",
            "Infection risk: Immunosuppression requires vigilance",
            "Rejection vs infection: Diagnostic challenge"
          ]
        },
        undergraduate: {
          focus: "What drugs are used in dialysis and transplant?",
          objectives: [
            "Know common immunosuppressants",
            "Understand drugs removed by dialysis",
            "Recognize drug interactions with transplant medications",
            "Know common post-transplant infections"
          ],
          keyPoints: [
            "CNIs: Tacrolimus, cyclosporine - mainstay",
            "Antimetabolites: Mycophenolate, azathioprine",
            "Steroids: Prednisone - most patients",
            "Prophylaxis: TMP-SMX for PCP"
          ],
          simplifiedExplanation: "Kidney transplant requires lifelong immunosuppression to prevent rejection. The main drugs (tacrolimus, mycophenolate, prednisone) suppress the immune system but increase infection risk. Many drugs interact with transplant medications.",
          memoryAids: [
            "CNIs = Calcineurin Inhibitors = 'Core' immunosuppression",
            "Tacrolimus = 'Tac' = Target levels critical",
            "MMF = Mycophenolate = 'Maintenance For most'",
            "TMP-SMX = Prevents PCP pneumonia"
          ]
        },
        postgraduate: {
          focus: "Optimizing immunosuppression and managing complications",
          objectives: [
            "Individualize immunosuppression protocols",
            "Manage drug interactions with CNIs",
            "Treat rejection episodes",
            "Navigate post-transplant infections and malignancy"
          ],
          keyPoints: [
            "TDM: Keep tacrolimus in target range",
            "Interactions: Azoles, macrolides, calcium channel blockers",
            "Rejection: High-dose steroids, antithymocyte globulin",
            "Infections: BK virus, CMV, opportunistic infections"
          ],
          advancedConcepts: "Transplant pharmacology requires balancing immunosuppression against infection and malignancy risk. CNI dosing follows therapeutic drug monitoring with target levels varying by time post-transplant. Drug interactions are numerous - especially CYP3A4 inhibitors and inducers.",
          evidenceBase: [
            "KDIGO transplant guidelines",
            "CNI TDM recommendations",
            "AST infectious diseases guidelines",
            "Rejection treatment protocols"
          ]
        },
        videos: [
          { id: "rT7PvB0cGbI", title: "Transplant Immunosuppression", description: "Post-transplant medications", duration: "15:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/T_cell_activation.svg/800px-T_cell_activation.svg.png", title: "T Cell Activation", description: "Immunosuppressant targets" }
        ]
      }
    ],
    caseStudies: {
      undergraduate: {
        title: "Acute Hyperkalemia",
        patient: "Mr. Brown, 68-year-old male",
        presentation: "Found confused at home. History of CKD stage 4, heart failure, diabetes. Medications include lisinopril, spironolactone, furosemide.",
        findings: "BP 100/60, HR 52, irregular. ECG shows peaked T waves, widened QRS. K+ 7.8 mmol/L. Creatinine 350 μmol/L (baseline 220).",
        questions: ["What is the immediate priority?", "What medications may have contributed?", "What is the treatment sequence?"],
        answers: ["IV calcium gluconate - stabilize cardiac membrane", "ACE inhibitor, spironolactone, possible AKI", "Calcium → insulin+glucose → salbutamol neb → consider dialysis; stop offending drugs"]
      },
      postgraduate: {
        title: "Hyponatremia Evaluation",
        patient: "Mrs. Chen, 72-year-old female",
        presentation: "Confusion and falls. History of hypertension on hydrochlorothiazide. Recent pneumonia treated with IV fluids.",
        findings: "BP 135/85, no edema, no dehydration. Na 118 mmol/L. Osmolality low, urine osmolality high, urine Na 45. Cortisol and thyroid normal.",
        questions: ["What is the likely diagnosis?", "What is the appropriate initial management?", "What is the target correction rate?"],
        answers: ["SIADH secondary to pneumonia", "Fluid restriction 1-1.5L/day; consider salt tablets or hypertonic saline if symptomatic", "Maximum 8-10 mmol/L in 24 hours to avoid ODS; more conservative in malnutrition/alcoholism"]
      }
    }
  },

  // ==================== TOXICOLOGY ====================
  {
    id: "toxicology",
    title: "Toxicology & Poisoning Management",
    shortTitle: "Toxicology",
    description: "Complete coverage of poisoning management, antidotes, overdose treatment, and toxicology principles.",
    icon: "AlertTriangle",
    color: "red",
    category: "Emergency/Toxicology",
    totalModules: 4,
    duration: "6 hours",
    level: "All Levels",
    modules: [
      {
        id: 1,
        title: "General Toxicology Principles",
        icon: "AlertTriangle",
        color: "red",
        writtenContent: {
          introduction: "Toxicology involves the recognition and management of poisoning. Systematic approaches including decontamination, enhanced elimination, and antidote administration are essential for optimal outcomes.",
          coreConcepts: [
            "Decontamination: Activated charcoal, gastric lavage",
            "Enhanced elimination: Multi-dose charcoal, hemodialysis",
            "Antidotes: Specific treatments for specific poisons",
            "Supportive care: Mainstay of management",
            "Toxicdromes: Recognition of classic presentations"
          ],
          clinicalPearls: [
            "Activated charcoal: Most effective within 1 hour",
            "Gastric lavage: Rarely indicated",
            "Hemodialysis: For dialyzable toxins",
            "Supportive care: Often most important"
          ],
          warnings: [
            "Charcoal: Contraindicated with bowel obstruction",
            "Lavage: Risk of aspiration",
            "Some toxins: Worsen with certain treatments",
            "Polypharmacy: Common in overdoses"
          ]
        },
        undergraduate: {
          focus: "How do we approach a poisoned patient?",
          objectives: [
            "Know the ABCDE approach",
            "Understand decontamination methods",
            "Know common antidotes",
            "Recognize toxicdromes"
          ],
          keyPoints: [
            "ABCDE: Airway, Breathing, Circulation first",
            "Charcoal: Absorbs many toxins",
            "Supportive care: Often most important",
            "History: What, when, how much"
          ],
          simplifiedExplanation: "Poisoned patients need ABCDE first - make sure they're breathing and have circulation. Then try to figure out what they took. Activated charcoal can absorb many poisons in the stomach. Some poisons have specific antidotes. Often, supportive care while the body eliminates the poison is the main treatment.",
          memoryAids: [
            "ABCDE = Airway, Breathing, Circulation, Disability, Exposure",
            "Charcoal = 'Catches' toxins in gut",
            "Antidote = 'Anti' to the toxin",
            "Toxidrome = 'Toxic syndrome' pattern"
          ]
        },
        postgraduate: {
          focus: "Advanced toxicology management",
          objectives: [
            "Implement evidence-based decontamination",
            "Select appropriate enhanced elimination",
            "Navigate complex polypharmacy overdoses",
            "Apply toxicokinetic principles"
          ],
          keyPoints: [
            "Charcoal: Consider if within 1 hour, alert patient",
            "Whole bowel irrigation: For sustained-release",
            "Hemodialysis: Selected toxins, severe cases",
            "ICP: For prolonged QT, sodium channel blockade"
          ],
          advancedConcepts: "Modern toxicology management emphasizes evidence-based approaches. Gastric lavage is rarely indicated. Multi-dose activated charcoal enhances elimination of drugs with enterohepatic circulation. Hemodialysis is useful for specific toxins (lithium, toxic alcohols, salicylates).",
          evidenceBase: [
            "AACT/EAPCCT position statements",
            "Toxicology guidelines",
            "Hemodialysis indications",
            "Antidote availability studies"
          ]
        },
        videos: [
          { id: "SMDTn8vSnZI", title: "Toxicology Overview", description: "General poisoning management", duration: "15:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Poison_treatment_algorithm.svg/800px-Poison_treatment_algorithm.svg.png", title: "Poisoning Treatment Algorithm", description: "Stepwise approach" }
        ]
      },
      {
        id: 2,
        title: "Antidotes",
        icon: "Shield",
        color: "green",
        writtenContent: {
          introduction: "Antidotes are specific treatments that counteract the effects of specific poisons. Knowing when and how to use antidotes is essential for managing serious poisonings.",
          coreConcepts: [
            "Naloxone: Opioid reversal",
            "Flumazenil: Benzodiazepine reversal",
            "N-acetylcysteine: Acetaminophen antidote",
            "Atropine + pralidoxime: Organophosphate poisoning",
            "Digoxin immune fab: Digoxin toxicity"
          ],
          clinicalPearls: [
            "Naloxone: Short duration, may need repeated doses",
            "NAC: Most effective within 8-10 hours of ingestion",
            "Atropine: Titrate to drying of secretions",
            "Fomepizole: Alcohol dehydrogenase inhibitor"
          ],
          warnings: [
            "Flumazenil: Risk of seizures in chronic benzodiazepine users",
            "Naloxone: Precipitates withdrawal in dependent patients",
            "Atropine: Can cause anticholinergic toxicity",
            "Timing: Earlier antidote = better outcome"
          ]
        },
        undergraduate: {
          focus: "What are the main antidotes?",
          objectives: [
            "Know common antidotes",
            "Match antidotes to toxins",
            "Understand timing importance",
            "Know when antidotes are harmful"
          ],
          keyPoints: [
            "Naloxone: Reverses opioids",
            "NAC: For acetaminophen overdose",
            "Flumazenil: Reverses benzodiazepines",
            "Atropine: For organophosphates"
          ],
          simplifiedExplanation: "Antidotes are like keys that unlock specific poisons. Naloxone wakes up someone overdosed on opioids. NAC protects the liver from acetaminophen damage. Flumazenil reverses benzodiazepines but can cause seizures in regular users. Timing is critical - most antidotes work best when given early.",
          memoryAids: [
            "Naloxone = 'Narcan' = Opioid reversal",
            "NAC = 'N-acetylcysteine' = Acetaminophen antidote",
            "Flumazenil = 'Flips' benzo effects",
            "Atropine = 'Anti-toxic' for organophosphates"
          ]
        },
        postgraduate: {
          focus: "Advanced antidote use and complications",
          objectives: [
            "Select appropriate antidote dosing",
            "Manage antidote complications",
            "Navigate complex scenarios",
            "Implement new antidotes"
          ],
          keyPoints: [
            "High-dose insulin: For calcium channel blocker toxicity",
            "Lipid emulsion: Local anesthetic and other toxicity",
            "Methylene blue: Methemoglobinemia",
            "Sodium bicarbonate: Salicylates, TCA, sodium channel"
          ],
          advancedConcepts: "Antidote use requires understanding mechanisms, dosing, and complications. High-dose insulin-euglycemia therapy (HIET) is used for calcium channel blocker and beta-blocker toxicity. Intravenous lipid emulsion treats LAST and other lipophilic drug toxicity. Hydroxocobalamin is the preferred cyanide antidote.",
          evidenceBase: [
            "Antidote dosing guidelines",
            "High-dose insulin studies",
            "Lipid emulsion case series",
            "Toxicology society recommendations"
          ]
        },
        videos: [
          { id: "8Ggz_d3IyYk", title: "Antidotes Overview", description: "Common antidotes and their uses", duration: "14:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Antidotes_table.svg/800px-Antidotes_table.svg.png", title: "Antidote Reference", description: "Toxin-antidote matching" }
        ]
      },
      {
        id: 3,
        title: "Drug-Specific Toxicology",
        icon: "AlertTriangle",
        color: "orange",
        writtenContent: {
          introduction: "Each class of drugs has characteristic toxicity patterns. Understanding the specific management for common overdose scenarios is essential for emergency care.",
          coreConcepts: [
            "Acetaminophen: Hepatotoxicity, NAC treatment",
            "Salicylates: Respiratory alkalosis then metabolic acidosis",
            "Tricyclic antidepressants: Sodium channel blockade",
            "Iron: GI bleeding, hepatotoxicity, chelation",
            "Lithium: Neurotoxicity, dialysis for severe cases"
          ],
          clinicalPearls: [
            "Acetaminophen: Check level at 4 hours post-ingestion",
            "Salicylates: Alkalinize urine, consider dialysis",
            "TCA: Sodium bicarbonate for QRS widening",
            "Iron: Deferoxamine for significant ingestion"
          ],
          warnings: [
            "Acetaminophen: Delayed presentation still treat",
            "Salicylates: Avoid intubation if possible",
            "TCA: Seizures, cardiac toxicity",
            "Lithium: Chronic toxicity more dangerous"
          ]
        },
        undergraduate: {
          focus: "What are common drug overdoses?",
          objectives: [
            "Know acetaminophen toxicity management",
            "Understand salicylate poisoning",
            "Recognize TCA toxicity signs",
            "Know iron overdose treatment"
          ],
          keyPoints: [
            "Acetaminophen: Liver damage, NAC helps",
            "Salicylates: Ringing ears, fast breathing",
            "TCAs: Wide QRS, seizures",
            "Iron: Vomiting, bloody stool"
          ],
          simplifiedExplanation: "Each drug overdose has its own pattern. Acetaminophen kills the liver but NAC can prevent it. Salicylates cause ringing ears and over-breathing. TCAs cause heart rhythm problems and seizures - sodium bicarbonate helps. Iron damages the gut and liver.",
          memoryAids: [
            "Acetaminophen = 'Acute liver danger' - use NAC",
            "Salicylates = 'Sick' - respiratory symptoms",
            "TCA = 'Toxic Cardiac Arrhythmias'",
            "Iron = 'I' = IV deferoxamine for treatment"
          ]
        },
        postgraduate: {
          focus: "Management of complex and severe poisonings",
          objectives: [
            "Apply nomogram and timing principles",
            "Manage severe cardiotoxicity",
            "Navigate dialysis decisions",
            "Address chronic toxicity"
          ],
          keyPoints: [
            "Acetaminophen: Rumack-Matthew nomogram, treat if level above line",
            "Salicylates: Consider dialysis at >100 mg/dL, clinical signs",
            "TCA: Bicarbonate for QRS >100ms, pH 7.5-7.55",
            "Lithium: Dialysis for severe symptoms, levels >4 mEq/L (acute)"
          ],
          advancedConcepts: "Advanced management requires understanding of toxicokinetics and specific interventions. For acetaminophen, massive ingestions may require extended NAC protocols. Salicylate-induced cerebral edema is life-threatening. ECMO can support patients with severe cardiotoxicity.",
          evidenceBase: [
            "Acetaminophen nomogram studies",
            "TCA bicarbonate studies",
            "Lithium dialysis criteria",
            "Toxicology consultation outcomes"
          ]
        },
        videos: [
          { id: "BmVcgPvsfuQ", title: "Acetaminophen Toxicity", description: "Mechanism and treatment", duration: "12:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Acetaminophen_metabolism.svg/800px-Acetaminophen_metabolism.svg.png", title: "Acetaminophen Metabolism", description: "NAC mechanism of action" }
        ]
      },
      {
        id: 4,
        title: "Environmental & Industrial Toxicology",
        icon: "Wind",
        color: "cyan",
        writtenContent: {
          introduction: "Environmental and industrial toxins present unique challenges. Recognition of exposure patterns and appropriate management is essential for emergency and occupational medicine.",
          coreConcepts: [
            "Carbon monoxide: Carboxyhemoglobin, hyperbaric oxygen",
            "Cyanide: Cellular hypoxia, hydroxocobalamin",
            "Methanol/ethylene glycol: Toxic alcohols, fomepizole",
            "Organophosphates: Cholinergic crisis, atropine/2-PAM",
            "Heavy metals: Lead, mercury, arsenic - chelation"
          ],
          clinicalPearls: [
            "CO: Carboxyhemoglobin level, HBO controversial",
            "Cyanide: Lactate elevated, hydroxocobalamin preferred",
            "Toxic alcohols: Anion gap metabolic acidosis",
            "Organophosphates: SLUDGE and DUMBBELSS"
          ],
          warnings: [
            "CO: Delayed neuropsychiatric syndrome",
            "Cyanide: Rapidly fatal without treatment",
            "Toxic alcohols: Don't wait for levels",
            "Organophosphates: Intermediate syndrome"
          ]
        },
        undergraduate: {
          focus: "What are common environmental poisonings?",
          objectives: [
            "Know carbon monoxide poisoning",
            "Understand cyanide toxicity",
            "Recognize toxic alcohol ingestion",
            "Know organophosphate signs"
          ],
          keyPoints: [
            "CO: Headache, confusion, red skin",
            "Cyanide: 'Bitter almond' smell, cardiac arrest",
            "Toxic alcohols: Drunk, acidosis, kidney failure",
            "Organophosphates: Runny nose, drooling, seizures"
          ],
          simplifiedExplanation: "Environmental toxins come from many sources. Carbon monoxide from fires and heaters causes headache and confusion - oxygen is the treatment. Cyanide from fires and industry causes rapid collapse - there are antidotes. Toxic alcohols (methanol, antifreeze) cause acidosis and organ damage. Organophosphate pesticides cause excess secretions and muscle weakness.",
          memoryAids: [
            "CO = 'Carbon monoxide' = 'Can't Oxygenate'",
            "Cyanide = 'Cell death' quickly",
            "SLUDGE = Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis",
            "Fomepizole = 'For methanol and ethylene glycol'"
          ]
        },
        postgraduate: {
          focus: "Management of severe environmental exposures",
          objectives: [
            "Apply hyperbaric oxygen appropriately",
            "Manage toxic alcohol acidosis",
            "Navigate chelation therapy",
            "Address mass exposure scenarios"
          ],
          keyPoints: [
            "CO HBO: Consider for severe poisoning, pregnancy",
            "Toxic alcohols: Fomepizole or ethanol, dialysis",
            "Chelation: DMSA, DMPS, CaNa2EDTA based on metal",
            "Mass exposure: Decontamination, PPE, antidote stocks"
          ],
          advancedConcepts: "Environmental toxicology requires understanding of exposure scenarios and appropriate resource utilization. Hyperbaric oxygen for CO remains controversial but is indicated in specific scenarios. Toxic alcohol management combines inhibition of metabolism (fomepizole or ethanol) with removal (hemodialysis). Chelation therapy is metal-specific.",
          evidenceBase: [
            "CO HBO studies",
            "Toxic alcohol management guidelines",
            "Chelation therapy protocols",
            "Mass exposure preparedness guidelines"
          ]
        },
        videos: [
          { id: "wE3nzNwAC9I", title: "Carbon Monoxide Poisoning", description: "Recognition and treatment", duration: "11:00", source: "Osmosis" }
        ],
        diagrams: [
          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Oxygen_hemoglobin_dissociation_curve.svg/800px-Oxygen_hemoglobin_dissociation_curve.svg.png", title: "Oxygen Dissociation", description: "CO effect on oxygen transport" }
        ]
      }
    ],
    caseStudies: {
      undergraduate: {
        title: "Acetaminophen Overdose",
        patient: "Sarah, 19-year-old female",
        presentation: "Took 20 tablets of extra-strength acetaminophen (500mg) 4 hours ago after argument with boyfriend. Now in ED.",
        findings: "Alert, crying. No symptoms currently. 4-hour acetaminophen level 280 μg/mL (above treatment line). LFTs currently normal.",
        questions: ["What is the treatment?", "What monitoring is needed?", "What counseling is appropriate?"],
        answers: ["Start N-acetylcysteine (NAC) IV protocol - 21-hour regimen", "Serial LFTs, INR, acetaminophen level; watch for liver failure signs", "Psychiatric evaluation for suicidal ideation; safety planning"]
      },
      postgraduate: {
        title: "Polypharmacy Overdose",
        patient: "Mr. Williams, 45-year-old male",
        presentation: "Found unresponsive at home. Empty bottles of amitriptyline, metoprolol, and ibuprofen nearby. GCS 6.",
        findings: "BP 80/50, HR 120, irregular. QRS 160ms. Seizure witnessed in ED. Temperature 35.5°C. Pupils dilated.",
        questions: ["What are the immediate priorities?", "What specific treatments are indicated?", "What complications should be anticipated?"],
        answers: ["Intubation for airway protection; IV access; cardiac monitoring; activated charcoal via NG after intubation", "Sodium bicarbonate bolus and infusion for TCA cardiotoxicity; vasopressors for hypotension; seizure treatment (benzodiazepines)", "Refractory hypotension, seizures, ventricular arrhythmias; may need high-dose insulin, IV lipid emulsion, ECMO if refractory"]
      }
    }
  }
]

export const allCourseCategories = [
  { id: "infectious", name: "Infectious Disease", icon: "Pill", courseIds: ["antibiotics"] },
  { id: "cardiovascular", name: "Cardiovascular", icon: "Heart", courseIds: ["cardiovascular"] },
  { id: "neurology", name: "Neurology/Psychiatry", icon: "Brain", courseIds: ["cns"] },
  { id: "oncology", name: "Oncology", icon: "Radiation", courseIds: ["oncology"] },
  { id: "endocrine", name: "Endocrinology", icon: "Activity", courseIds: ["endocrine"] },
  { id: "pulmonology", name: "Pulmonology", icon: "Wind", courseIds: ["respiratory"] },
  { id: "gastro", name: "Gastroenterology", icon: "Activity", courseIds: ["gastrointestinal"] },
  { id: "nephrology", name: "Nephrology", icon: "Droplet", courseIds: ["renal"] },
  { id: "toxicology", name: "Emergency/Toxicology", icon: "AlertTriangle", courseIds: ["toxicology"] }
]
