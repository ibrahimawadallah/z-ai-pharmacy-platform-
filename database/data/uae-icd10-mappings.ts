// Enhanced drug-to-ICD mapping for UAE medications
// Ported from server/routes/icd10-codes.js

export interface IcdCode {
  code: string;
  description: string;
}

export const UAE_DRUG_ICD_MAPPING: Record<string, IcdCode[]> = {
  'uralyt-u': [
    { code: 'N20.0', description: 'Calculus of kidney' },
    { code: 'N20.1', description: 'Calculus of ureter' },
    { code: 'N20.9', description: 'Urinary calculus, unspecified' },
    {
      code: 'E79.0',
      description: 'Hyperuricemia without signs of inflammatory arthritis and tophaceous disease',
    },
  ],
  // Diabetes medications
  metformin: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia' },
  ],
  insulin: [
    { code: 'E10.9', description: 'Type 1 diabetes mellitus without complications' },
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
  ],
  glimepiride: [{ code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' }],
  gliclazide: [{ code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' }],
  sitagliptin: [{ code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' }],
  empagliflozin: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'I50.9', description: 'Heart failure, unspecified' },
  ],
  liraglutide: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'E66.9', description: 'Obesity, unspecified' },
  ],
  ozempic: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'E66.9', description: 'Obesity, unspecified' },
  ],

  // Cardiovascular medications
  lisinopril: [
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'I50.9', description: 'Heart failure, unspecified' },
  ],
  amlodipine: [{ code: 'I10', description: 'Essential (primary) hypertension' }],
  atorvastatin: [
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
    { code: 'E78.2', description: 'Mixed hyperlipidemia' },
  ],
  simvastatin: [{ code: 'E78.5', description: 'Hyperlipidemia, unspecified' }],
  rosuvastatin: [{ code: 'E78.5', description: 'Hyperlipidemia, unspecified' }],
  carvedilol: [
    { code: 'I50.9', description: 'Heart failure, unspecified' },
    { code: 'I10', description: 'Essential (primary) hypertension' },
  ],
  bisoprolol: [
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'I50.9', description: 'Heart failure, unspecified' },
  ],
  warfarin: [
    { code: 'I48.91', description: 'Unspecified atrial fibrillation' },
    { code: 'Z79.01', description: 'Long term (current) use of anticoagulants' },
  ],
  clopidogrel: [
    { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery' },
  ],

  // Antibiotics (Added for Amoxicillin & others)
  amoxicillin: [
    { code: 'J01.90', description: 'Acute sinusitis, unspecified' },
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'H66.90', description: 'Otitis media, unspecified' },
    { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
  ],
  augmentin: [
    { code: 'J01.90', description: 'Acute sinusitis, unspecified' },
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'H66.90', description: 'Otitis media, unspecified' },
    { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
  ],
  'amoxicillin clavulanate': [
    { code: 'J01.90', description: 'Acute sinusitis, unspecified' },
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'H66.90', description: 'Otitis media, unspecified' },
    { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
  ],
  azithromycin: [
    { code: 'J01.90', description: 'Acute sinusitis, unspecified' },
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J20.9', description: 'Acute bronchitis, unspecified' },
  ],

  // Respiratory medications
  albuterol: [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
  ],
  montelukast: [{ code: 'J45.909', description: 'Unspecified asthma, uncomplicated' }],
  fluticasone: [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
  ],

  // Gastrointestinal medications
  omeprazole: [
    { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' },
    { code: 'K29.60', description: 'Other gastritis without bleeding' },
  ],
  pantoprazole: [
    { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' },
  ],
  esomeprazole: [
    { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' },
  ],

  // Endocrine medications
  levothyroxine: [
    { code: 'E03.9', description: 'Hypothyroidism, unspecified' },
    { code: 'E89.0', description: 'Postprocedural hypothyroidism' },
  ],

  // Pain medications
  tramadol: [
    { code: 'G89.29', description: 'Other chronic pain' },
    { code: 'M79.3', description: 'Panniculitis, unspecified' },
  ],
  gabapentin: [
    { code: 'G89.29', description: 'Other chronic pain' },
    {
      code: 'G40.909',
      description: 'Epilepsy, unspecified, not intractable, without status epilepticus',
    },
  ],
  pregabalin: [
    { code: 'G89.29', description: 'Other chronic pain' },
    {
      code: 'G40.909',
      description: 'Epilepsy, unspecified, not intractable, without status epilepticus',
    },
  ],

  // Psychiatric medications
  sertraline: [
    { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
    { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
  ],
  escitalopram: [
    { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
    { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
  ],
  duloxetine: [
    { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
    { code: 'G89.29', description: 'Other chronic pain' },
  ],

  // Common medications
  aspirin: [
    { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery' },
    { code: 'Z79.82', description: 'Long term (current) use of aspirin' },
  ],
  paracetamol: [
    { code: 'R50.9', description: 'Fever, unspecified' },
    { code: 'G89.29', description: 'Other chronic pain' },
  ],
  ibuprofen: [
    { code: 'G89.29', description: 'Other chronic pain' },
    { code: 'R50.9', description: 'Fever, unspecified' },
  ],

  // Topical/localized pain medications
  'lidocaine patch': [
    { code: 'G89.29', description: 'Other chronic pain' },
    { code: 'B02.29', description: 'Postherpetic neuralgia' },
    { code: 'M79.3', description: 'Panniculitis, unspecified' },
    { code: 'G50.9', description: 'Disorder of trigeminal nerve, unspecified' },
  ],
  lidoderm: [
    { code: 'G89.29', description: 'Other chronic pain' },
    { code: 'B02.29', description: 'Postherpetic neuralgia' },
    { code: 'M79.3', description: 'Panniculitis, unspecified' },
    { code: 'G50.9', description: 'Disorder of trigeminal nerve, unspecified' },
  ],
  'lidocaine transdermal': [
    { code: 'G89.29', description: 'Other chronic pain' },
    { code: 'B02.29', description: 'Postherpetic neuralgia' },
    { code: 'M79.3', description: 'Panniculitis, unspecified' },
  ],
  'lidocaine hydrochloride': [
    { code: 'G89.29', description: 'Other chronic pain' },
    { code: 'B02.29', description: 'Postherpetic neuralgia' },
    { code: 'M79.3', description: 'Panniculitis, unspecified' },
    { code: 'G50.9', description: 'Disorder of trigeminal nerve, unspecified' },
  ],

  // Topical NSAIDs (localized application)
  'diclofenac gel': [
    { code: 'M25.50', description: 'Pain in unspecified joint' },
    { code: 'M79.3', description: 'Panniculitis, unspecified' },
    { code: 'M15.9', description: 'Osteoarthritis, unspecified' },
  ],
  'diclofenac cream': [
    { code: 'M25.50', description: 'Pain in unspecified joint' },
    { code: 'M79.3', description: 'Panniculitis, unspecified' },
    { code: 'M15.9', description: 'Osteoarthritis, unspecified' },
  ],

  // Vitamins & Minerals
  'vitamin d': [{ code: 'E55.9', description: 'Vitamin D deficiency, unspecified' }],
  cholecalciferol: [{ code: 'E55.9', description: 'Vitamin D deficiency, unspecified' }],
  ergocalciferol: [{ code: 'E55.9', description: 'Vitamin D deficiency, unspecified' }],
  'ferrous sulfate': [{ code: 'D50.9', description: 'Iron deficiency anemia, unspecified' }],
  'folic acid': [{ code: 'D52.9', description: 'Folate deficiency anemia, unspecified' }],
  neurobion: [
    { code: 'E56.9', description: 'Vitamin deficiency, unspecified' },
    { code: 'G60.9', description: 'Hereditary and idiopathic neuropathy, unspecified' },
  ],

  // Antihistamines & Allergy
  loratadine: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'L50.9', description: 'Urticaria, unspecified' },
  ],
  desloratadine: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'L50.9', description: 'Urticaria, unspecified' },
  ],
  cetirizine: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'L50.9', description: 'Urticaria, unspecified' },
  ],
  fexofenadine: [
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'L50.9', description: 'Urticaria, unspecified' },
  ],

  // Gastrointestinal (Nausea/Vomiting/Spasms)
  metoclopramide: [
    { code: 'R11.10', description: 'Vomiting, unspecified' },
    { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' },
  ],
  domperidone: [
    { code: 'R11.10', description: 'Vomiting, unspecified' },
    { code: 'R11.0', description: 'Nausea' },
  ],
  hyoscine: [{ code: 'R10.9', description: 'Unspecified abdominal pain' }],
  buscopan: [{ code: 'R10.9', description: 'Unspecified abdominal pain' }],

  // Steroids
  prednisolone: [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'M06.9', description: 'Rheumatoid arthritis, unspecified' },
    { code: 'L20.9', description: 'Atopic dermatitis, unspecified' },
  ],
  // Daman Formulary Additions
  glucophage: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia' },
  ],
  januvia: [{ code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' }],
  lantus: [
    { code: 'E10.9', description: 'Type 1 diabetes mellitus without complications' },
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
  ],
  diamicron: [{ code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' }],
  norvasc: [{ code: 'I10', description: 'Essential (primary) hypertension' }],
  lipitor: [
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
    { code: 'E78.2', description: 'Mixed hyperlipidemia' },
  ],
  ventolin: [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
  ],
  symbicort: [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
  ],
  zithromax: [
    { code: 'J01.90', description: 'Acute sinusitis, unspecified' },
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J20.9', description: 'Acute bronchitis, unspecified' },
  ],
  panadol: [
    { code: 'R50.9', description: 'Fever, unspecified' },
    { code: 'G89.29', description: 'Other chronic pain' },
  ],
  brufen: [
    { code: 'G89.29', description: 'Other chronic pain' },
    { code: 'R50.9', description: 'Fever, unspecified' },
  ],
  voltaren: [
    { code: 'M25.50', description: 'Pain in unspecified joint' },
    { code: 'M79.3', description: 'Panniculitis, unspecified' },
    { code: 'M15.9', description: 'Osteoarthritis, unspecified' },
  ],
  nexium: [{ code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' }],
  crestor: [{ code: 'E78.5', description: 'Hyperlipidemia, unspecified' }],
  singulair: [{ code: 'J45.909', description: 'Unspecified asthma, uncomplicated' }],
  lyrica: [
    { code: 'G89.29', description: 'Other chronic pain' },
    { code: 'G40.909', description: 'Epilepsy, unspecified' },
  ],
  ciprobay: [
    { code: 'N39.0', description: 'Urinary tract infection, site not specified' },
    { code: 'A09', description: 'Infectious gastroenteritis and colitis, unspecified' },
  ],
  klacid: [
    { code: 'J01.90', description: 'Acute sinusitis, unspecified' },
    { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
  ],
  flagyl: [
    { code: 'A09', description: 'Infectious gastroenteritis and colitis, unspecified' },
    { code: 'N76.0', description: 'Acute vaginitis' },
  ],
  ganaton: [
    { code: 'K30', description: 'Functional dyspepsia' },
    { code: 'R10.13', description: 'Epigastric pain' },
    { code: 'R11.10', description: 'Vomiting, unspecified' },
  ],
  itopride: [
    { code: 'K30', description: 'Functional dyspepsia' },
    { code: 'R10.13', description: 'Epigastric pain' },
  ],
};
