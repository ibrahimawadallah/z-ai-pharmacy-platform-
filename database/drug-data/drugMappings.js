export const drugToIcd10Mapping = {
  // Topical Lidocaine Products (Patches/Plasters)
  versatis: [
    { code: 'G89.29', description: 'Other chronic pain' },
    { code: 'B02.29', description: 'Postherpetic neuralgia' },
    { code: 'M79.3', description: 'Myalgia' },
    { code: 'G50.9', description: 'Disorder of trigeminal nerve, unspecified' },
    { code: 'G89.3', description: 'Neoplastic related pain (acute) (chronic)' },
  ],
  // Pain & Fever Medications
  paracetamol: [
    { code: 'R50.9', description: 'Fever' },
    { code: 'R51', description: 'Headache' },
    { code: 'M79.3', description: 'Myalgia' },
    { code: 'M25.5', description: 'Joint pain' },
    { code: 'R52', description: 'Pain' },
    { code: 'G43.909', description: 'Migraine' },
    { code: 'M54.5', description: 'Low back pain' },
  ],
  acetaminophen: [
    { code: 'R50.9', description: 'Fever' },
    { code: 'R51', description: 'Headache' },
    { code: 'M79.3', description: 'Myalgia' },
    { code: 'M25.5', description: 'Joint pain' },
    { code: 'R52', description: 'Pain' },
    { code: 'G43.909', description: 'Migraine' },
    { code: 'M54.5', description: 'Low back pain' },
  ],
  ibuprofen: [
    { code: 'M25.5', description: 'Joint pain' },
    { code: 'R50.9', description: 'Fever' },
    { code: 'M15.9', description: 'Osteoarthritis' },
    { code: 'M79.3', description: 'Myalgia' },
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'M05.9', description: 'Rheumatoid arthritis' },
    { code: 'R52', description: 'Pain' },
    { code: 'M10.9', description: 'Gout' },
  ],
  diclofenac: [
    { code: 'M25.5', description: 'Joint pain' },
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'M15.9', description: 'Osteoarthritis' },
    { code: 'M05.9', description: 'Rheumatoid arthritis' },
    { code: 'M79.3', description: 'Myalgia' },
    { code: 'M10.9', description: 'Gout' },
    { code: 'R52', description: 'Pain' },
    { code: 'M89.9', description: 'Disorder of bone' },
  ],
  naproxen: [
    { code: 'M25.5', description: 'Joint pain' },
    { code: 'M79.3', description: 'Myalgia' },
    { code: 'M15.9', description: 'Osteoarthritis' },
    { code: 'M05.9', description: 'Rheumatoid arthritis' },
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'M10.9', description: 'Gout' },
    { code: 'R50.9', description: 'Fever' },
    { code: 'R52', description: 'Pain' },
  ],
  aspirin: [
    { code: 'I25.10', description: 'Coronary artery disease' },
    { code: 'R51', description: 'Headache' },
    { code: 'I21.9', description: 'Acute myocardial infarction' },
    { code: 'I63.9', description: 'Cerebral infarction' },
    { code: 'I48.91', description: 'Atrial fibrillation' },
    { code: 'Z79.82', description: 'Long term use of aspirin' },
    { code: 'M25.5', description: 'Joint pain' },
    { code: 'R50.9', description: 'Fever' },
  ],
  celecoxib: [
    { code: 'M05.9', description: 'Rheumatoid arthritis' },
    { code: 'M15.9', description: 'Osteoarthritis' },
    { code: 'M25.5', description: 'Joint pain' },
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'M79.3', description: 'Myalgia' },
    { code: 'M10.9', description: 'Gout' },
    { code: 'R52', description: 'Pain' },
  ],
  indomethacin: [
    { code: 'M10.9', description: 'Gout' },
    { code: 'M25.5', description: 'Joint pain' },
    { code: 'M15.9', description: 'Osteoarthritis' },
    { code: 'M05.9', description: 'Rheumatoid arthritis' },
    { code: 'M79.3', description: 'Myalgia' },
    { code: 'R52', description: 'Pain' },
  ],
  ketorolac: [
    { code: 'R52', description: 'Pain' },
    { code: 'M25.5', description: 'Joint pain' },
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'M79.3', description: 'Myalgia' },
    { code: 'M89.9', description: 'Disorder of bone' },
    { code: 'R50.9', description: 'Fever' },
  ],
  tramadol: [
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'R52', description: 'Chronic pain' },
    { code: 'M25.5', description: 'Joint pain' },
    { code: 'M79.3', description: 'Myalgia' },
    { code: 'G89.29', description: 'Chronic pain' },
    { code: 'M15.9', description: 'Osteoarthritis' },
    { code: 'M05.9', description: 'Rheumatoid arthritis' },
  ],
  codeine: [
    { code: 'R52', description: 'Pain' },
    { code: 'R05', description: 'Cough' },
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'M25.5', description: 'Joint pain' },
    { code: 'R50.9', description: 'Fever' },
    { code: 'G89.29', description: 'Chronic pain' },
  ],
  morphine: [
    { code: 'R52', description: 'Severe pain' },
    { code: 'C80.1', description: 'Cancer pain' },
    { code: 'G89.29', description: 'Chronic pain' },
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'I21.9', description: 'Acute myocardial infarction' },
    { code: 'R50.9', description: 'Fever' },
  ],
  oxycodone: [
    { code: 'R52', description: 'Severe pain' },
    { code: 'G89.29', description: 'Chronic pain' },
    { code: 'C80.1', description: 'Cancer pain' },
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'M25.5', description: 'Joint pain' },
  ],
  hydrocodone: [
    { code: 'R52', description: 'Pain' },
    { code: 'R05', description: 'Cough' },
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'M25.5', description: 'Joint pain' },
    { code: 'G89.29', description: 'Chronic pain' },
  ],
  fentanyl: [
    { code: 'R52', description: 'Severe chronic pain' },
    { code: 'C80.1', description: 'Cancer pain' },
    { code: 'G89.29', description: 'Chronic pain' },
    { code: 'M54.5', description: 'Low back pain' },
  ],

  // Antibiotics - Penicillins
  amoxicillin: [
    { code: 'J02.9', description: 'Pharyngitis' },
    { code: 'N39.0', description: 'UTI' },
    { code: 'J01.90', description: 'Sinusitis' },
    { code: 'J20.9', description: 'Bronchitis' },
    { code: 'H66.9', description: 'Otitis media' },
    { code: 'J03.90', description: 'Tonsillitis' },
    { code: 'L03.90', description: 'Cellulitis' },
    { code: 'J18.9', description: 'Pneumonia' },
  ],
  augmentin: [
    { code: 'J01.90', description: 'Sinusitis' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'J02.9', description: 'Pharyngitis' },
    { code: 'J20.9', description: 'Bronchitis' },
    { code: 'N39.0', description: 'UTI' },
    { code: 'L03.90', description: 'Cellulitis' },
    { code: 'H66.9', description: 'Otitis media' },
    { code: 'J03.90', description: 'Tonsillitis' },
    { code: 'K61.0', description: 'Anal abscess' },
    { code: 'K04.7', description: 'Periapical abscess' },
  ],
  'amoxicillin-clavulanate': [
    { code: 'J01.90', description: 'Sinusitis' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'J02.9', description: 'Pharyngitis' },
    { code: 'J20.9', description: 'Bronchitis' },
    { code: 'N39.0', description: 'UTI' },
    { code: 'L03.90', description: 'Cellulitis' },
    { code: 'H66.9', description: 'Otitis media' },
    { code: 'J03.90', description: 'Tonsillitis' },
    { code: 'K61.0', description: 'Anal abscess' },
    { code: 'K04.7', description: 'Periapical abscess' },
  ],
  'amoxicillin clavulanate': [
    { code: 'J01.90', description: 'Sinusitis' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'J02.9', description: 'Pharyngitis' },
    { code: 'J20.9', description: 'Bronchitis' },
    { code: 'N39.0', description: 'UTI' },
    { code: 'L03.90', description: 'Cellulitis' },
    { code: 'H66.9', description: 'Otitis media' },
    { code: 'J03.90', description: 'Tonsillitis' },
    { code: 'K61.0', description: 'Anal abscess' },
    { code: 'K04.7', description: 'Periapical abscess' },
  ],
  'amoxicillin+clavulanate': [
    { code: 'J01.90', description: 'Sinusitis' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'J02.9', description: 'Pharyngitis' },
    { code: 'J20.9', description: 'Bronchitis' },
    { code: 'N39.0', description: 'UTI' },
    { code: 'L03.90', description: 'Cellulitis' },
    { code: 'H66.9', description: 'Otitis media' },
    { code: 'J03.90', description: 'Tonsillitis' },
    { code: 'K61.0', description: 'Anal abscess' },
    { code: 'K04.7', description: 'Periapical abscess' },
  ],

  // Antibiotics - Macrolides
  azithromycin: [
    { code: 'J02.9', description: 'Pharyngitis' },
    { code: 'J20.9', description: 'Bronchitis' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'J01.90', description: 'Sinusitis' },
    { code: 'A54.9', description: 'Gonorrhea' },
    { code: 'A56.00', description: 'Chlamydial infection' },
    { code: 'J03.90', description: 'Tonsillitis' },
    { code: 'H66.9', description: 'Otitis media' },
  ],
  clarithromycin: [
    { code: 'J02.9', description: 'Pharyngitis' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'J01.90', description: 'Sinusitis' },
    { code: 'J20.9', description: 'Bronchitis' },
    { code: 'J03.90', description: 'Tonsillitis' },
    { code: 'H66.9', description: 'Otitis media' },
    { code: 'K29.70', description: 'Helicobacter pylori gastritis' },
  ],
  erythromycin: [
    { code: 'J02.9', description: 'Pharyngitis' },
    { code: 'L70.0', description: 'Acne' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'J20.9', description: 'Bronchitis' },
    { code: 'J01.90', description: 'Sinusitis' },
    { code: 'A54.9', description: 'Gonorrhea' },
  ],

  // Antibiotics - Fluoroquinolones
  ciprofloxacin: [
    { code: 'N39.0', description: 'UTI' },
    { code: 'K52.9', description: 'Gastroenteritis' },
    { code: 'L03.90', description: 'Cellulitis' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'A54.9', description: 'Gonorrhea' },
    { code: 'K61.0', description: 'Anal abscess' },
    { code: 'N41.9', description: 'Prostatitis' },
  ],
  levofloxacin: [
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'N39.0', description: 'UTI' },
    { code: 'J01.90', description: 'Sinusitis' },
    { code: 'L03.90', description: 'Cellulitis' },
    { code: 'J20.9', description: 'Bronchitis' },
    { code: 'N41.9', description: 'Prostatitis' },
  ],
  moxifloxacin: [
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'J01.90', description: 'Sinusitis' },
    { code: 'L03.90', description: 'Cellulitis' },
    { code: 'J20.9', description: 'Bronchitis' },
    { code: 'N39.0', description: 'UTI' },
  ],

  // Antibiotics - Cephalosporins
  cephalexin: [
    { code: 'L03.90', description: 'Cellulitis' },
    { code: 'N39.0', description: 'UTI' },
    { code: 'J02.9', description: 'Pharyngitis' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'J01.90', description: 'Sinusitis' },
    { code: 'H66.9', description: 'Otitis media' },
    { code: 'J03.90', description: 'Tonsillitis' },
  ],
  cefuroxime: [
    { code: 'J02.9', description: 'Pharyngitis' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'J01.90', description: 'Sinusitis' },
    { code: 'J20.9', description: 'Bronchitis' },
    { code: 'L03.90', description: 'Cellulitis' },
    { code: 'H66.9', description: 'Otitis media' },
  ],
  ceftriaxone: [
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'A54.9', description: 'Gonorrhea' },
    { code: 'A41.9', description: 'Sepsis' },
    { code: 'L03.90', description: 'Cellulitis' },
    { code: 'N39.0', description: 'UTI' },
    { code: 'J01.90', description: 'Sinusitis' },
    { code: 'M00.9', description: 'Arthritis' },
  ],
  cefixime: [
    { code: 'J02.9', description: 'Pharyngitis' },
    { code: 'N39.0', description: 'UTI' },
    { code: 'J01.90', description: 'Sinusitis' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'A54.9', description: 'Gonorrhea' },
  ],

  // Antibiotics - Tetracyclines
  doxycycline: [
    { code: 'L70.0', description: 'Acne' },
    { code: 'J02.9', description: 'Pharyngitis' },
    { code: 'A69.20', description: 'Lyme disease' },
    { code: 'A56.00', description: 'Chlamydial infection' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'J01.90', description: 'Sinusitis' },
    { code: 'A54.9', description: 'Gonorrhea' },
  ],
  minocycline: [
    { code: 'L70.0', description: 'Acne' },
    { code: 'J02.9', description: 'Pharyngitis' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'A69.20', description: 'Lyme disease' },
  ],
  tetracycline: [
    { code: 'L70.0', description: 'Acne' },
    { code: 'A69.20', description: 'Lyme disease' },
    { code: 'J02.9', description: 'Pharyngitis' },
    { code: 'A56.00', description: 'Chlamydial infection' },
    { code: 'A54.9', description: 'Gonorrhea' },
  ],

  // Antibiotics - Others
  clindamycin: [
    { code: 'L70.0', description: 'Acne' },
    { code: 'L03.90', description: 'Cellulitis' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'K61.0', description: 'Anal abscess' },
    { code: 'K04.7', description: 'Periapical abscess' },
    { code: 'J01.90', description: 'Sinusitis' },
  ],
  metronidazole: [
    { code: 'A07.9', description: 'Protozoal infection' },
    { code: 'K29.70', description: 'Gastritis' },
    { code: 'A59.9', description: 'Trichomoniasis' },
    { code: 'K61.0', description: 'Anal abscess' },
    { code: 'K04.7', description: 'Periapical abscess' },
    { code: 'N39.0', description: 'UTI' },
  ],
  vancomycin: [
    { code: 'A41.9', description: 'Sepsis' },
    { code: 'L03.90', description: 'Cellulitis' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'A49.9', description: 'Bacterial infection' },
  ],
  gentamicin: [
    { code: 'A41.9', description: 'Sepsis' },
    { code: 'N39.0', description: 'UTI' },
    { code: 'L03.90', description: 'Cellulitis' },
    { code: 'J18.9', description: 'Pneumonia' },
  ],
  'trimethoprim-sulfamethoxazole': [
    { code: 'N39.0', description: 'UTI' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'L03.90', description: 'Cellulitis' },
    { code: 'A41.9', description: 'Sepsis' },
    { code: 'J20.9', description: 'Bronchitis' },
  ],
  nitrofurantoin: [
    { code: 'N39.0', description: 'UTI' },
    { code: 'N30.90', description: 'Cystitis' },
    { code: 'N10', description: 'Acute pyelonephritis' },
  ],

  // Diabetes Medications
  metformin: [
    { code: 'E11.9', description: 'Type 2 diabetes' },
    { code: 'E11.65', description: 'Type 2 diabetes with hyperglycemia' },
    { code: 'E11.21', description: 'Type 2 diabetes with diabetic nephropathy' },
    { code: 'E11.40', description: 'Type 2 diabetes with diabetic neuropathy' },
    { code: 'E11.22', description: 'Type 2 diabetes with diabetic chronic kidney disease' },
  ],
  glimepiride: [
    { code: 'E11.9', description: 'Type 2 diabetes' },
    { code: 'E11.65', description: 'Type 2 diabetes with hyperglycemia' },
  ],
  glyburide: [
    { code: 'E11.9', description: 'Type 2 diabetes' },
    { code: 'E11.65', description: 'Type 2 diabetes with hyperglycemia' },
  ],
  glipizide: [
    { code: 'E11.9', description: 'Type 2 diabetes' },
    { code: 'E11.65', description: 'Type 2 diabetes with hyperglycemia' },
  ],
  sitagliptin: [
    { code: 'E11.9', description: 'Type 2 diabetes' },
    { code: 'E11.65', description: 'Type 2 diabetes with hyperglycemia' },
    { code: 'E11.21', description: 'Type 2 diabetes with diabetic nephropathy' },
  ],
  linagliptin: [
    { code: 'E11.9', description: 'Type 2 diabetes' },
    { code: 'E11.65', description: 'Type 2 diabetes with hyperglycemia' },
  ],
  saxagliptin: [
    { code: 'E11.9', description: 'Type 2 diabetes' },
    { code: 'E11.65', description: 'Type 2 diabetes with hyperglycemia' },
  ],
  empagliflozin: [
    { code: 'E11.9', description: 'Type 2 diabetes' },
    { code: 'E11.65', description: 'Type 2 diabetes with hyperglycemia' },
    { code: 'E11.22', description: 'Type 2 diabetes with diabetic chronic kidney disease' },
    { code: 'I50.9', description: 'Heart failure' },
  ],
  dapagliflozin: [
    { code: 'E11.9', description: 'Type 2 diabetes' },
    { code: 'E11.65', description: 'Type 2 diabetes with hyperglycemia' },
    { code: 'E11.22', description: 'Type 2 diabetes with diabetic chronic kidney disease' },
    { code: 'I50.9', description: 'Heart failure' },
  ],
  canagliflozin: [
    { code: 'E11.9', description: 'Type 2 diabetes' },
    { code: 'E11.65', description: 'Type 2 diabetes with hyperglycemia' },
    { code: 'E11.22', description: 'Type 2 diabetes with diabetic chronic kidney disease' },
  ],
  insulin: [
    { code: 'E10.9', description: 'Type 1 diabetes' },
    { code: 'E11.9', description: 'Type 2 diabetes' },
    { code: 'E11.65', description: 'Type 2 diabetes with hyperglycemia' },
    { code: 'E10.65', description: 'Type 1 diabetes with hyperglycemia' },
  ],
  'insulin glargine': [
    { code: 'E10.9', description: 'Type 1 diabetes' },
    { code: 'E11.9', description: 'Type 2 diabetes' },
    { code: 'E11.65', description: 'Type 2 diabetes with hyperglycemia' },
    { code: 'E10.65', description: 'Type 1 diabetes with hyperglycemia' },
  ],
  'insulin lispro': [
    { code: 'E10.9', description: 'Type 1 diabetes' },
    { code: 'E11.9', description: 'Type 2 diabetes' },
    { code: 'E11.65', description: 'Type 2 diabetes with hyperglycemia' },
    { code: 'E10.65', description: 'Type 1 diabetes with hyperglycemia' },
  ],
  'insulin aspart': [
    { code: 'E10.9', description: 'Type 1 diabetes' },
    { code: 'E11.9', description: 'Type 2 diabetes' },
    { code: 'E11.65', description: 'Type 2 diabetes with hyperglycemia' },
    { code: 'E10.65', description: 'Type 1 diabetes with hyperglycemia' },
  ],

  // Cardiovascular - Calcium Channel Blockers
  amlodipine: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'I20.9', description: 'Angina' },
    { code: 'I25.10', description: 'Coronary artery disease' },
    { code: 'I50.9', description: 'Heart failure' },
  ],
  nifedipine: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'I20.9', description: 'Angina' },
    { code: 'I25.10', description: 'Coronary artery disease' },
  ],
  diltiazem: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'I48.91', description: 'Atrial fibrillation' },
    { code: 'I20.9', description: 'Angina' },
    { code: 'I25.10', description: 'Coronary artery disease' },
  ],
  verapamil: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'I48.91', description: 'Atrial fibrillation' },
    { code: 'I20.9', description: 'Angina' },
    { code: 'I25.10', description: 'Coronary artery disease' },
  ],

  // Cardiovascular - ACE Inhibitors
  lisinopril: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'I25.10', description: 'Coronary artery disease' },
    { code: 'N18.9', description: 'Chronic kidney disease' },
    { code: 'E11.22', description: 'Type 2 diabetes with diabetic chronic kidney disease' },
  ],
  enalapril: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'I25.10', description: 'Coronary artery disease' },
    { code: 'N18.9', description: 'Chronic kidney disease' },
  ],
  ramipril: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'I25.10', description: 'Coronary artery disease' },
    { code: 'I21.9', description: 'Acute myocardial infarction' },
    { code: 'N18.9', description: 'Chronic kidney disease' },
  ],
  perindopril: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'I25.10', description: 'Coronary artery disease' },
  ],

  // Cardiovascular - ARBs
  losartan: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'N18.9', description: 'Chronic kidney disease' },
    { code: 'E11.22', description: 'Type 2 diabetes with diabetic chronic kidney disease' },
  ],
  valsartan: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'I21.9', description: 'Acute myocardial infarction' },
    { code: 'N18.9', description: 'Chronic kidney disease' },
  ],
  irbesartan: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'N18.9', description: 'Chronic kidney disease' },
  ],
  telmisartan: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'N18.9', description: 'Chronic kidney disease' },
  ],
  candesartan: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'N18.9', description: 'Chronic kidney disease' },
  ],

  // Cardiovascular - Beta Blockers
  atenolol: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'I20.9', description: 'Angina' },
    { code: 'I25.10', description: 'Coronary artery disease' },
    { code: 'I48.91', description: 'Atrial fibrillation' },
    { code: 'I21.9', description: 'Acute myocardial infarction' },
  ],
  metoprolol: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'I25.10', description: 'Coronary artery disease' },
    { code: 'I21.9', description: 'Acute myocardial infarction' },
    { code: 'I48.91', description: 'Atrial fibrillation' },
  ],
  bisoprolol: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'I25.10', description: 'Coronary artery disease' },
    { code: 'I21.9', description: 'Acute myocardial infarction' },
  ],
  carvedilol: [
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'I10', description: 'Hypertension' },
    { code: 'I25.10', description: 'Coronary artery disease' },
    { code: 'I21.9', description: 'Acute myocardial infarction' },
  ],
  propranolol: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'G43.909', description: 'Migraine' },
    { code: 'F41.9', description: 'Anxiety disorder' },
    { code: 'I48.91', description: 'Atrial fibrillation' },
  ],

  // Cardiovascular - Statins
  atorvastatin: [
    { code: 'E78.5', description: 'Hyperlipidemia' },
    { code: 'I25.10', description: 'Coronary artery disease' },
    { code: 'I21.9', description: 'Acute myocardial infarction' },
    { code: 'I63.9', description: 'Cerebral infarction' },
  ],
  simvastatin: [
    { code: 'E78.5', description: 'Hyperlipidemia' },
    { code: 'I25.10', description: 'Coronary artery disease' },
    { code: 'I21.9', description: 'Acute myocardial infarction' },
  ],
  rosuvastatin: [
    { code: 'E78.5', description: 'Hyperlipidemia' },
    { code: 'I25.10', description: 'Coronary artery disease' },
    { code: 'I21.9', description: 'Acute myocardial infarction' },
  ],
  pravastatin: [
    { code: 'E78.5', description: 'Hyperlipidemia' },
    { code: 'I25.10', description: 'Coronary artery disease' },
  ],
  lovastatin: [
    { code: 'E78.5', description: 'Hyperlipidemia' },
    { code: 'I25.10', description: 'Coronary artery disease' },
  ],
  fluvastatin: [
    { code: 'E78.5', description: 'Hyperlipidemia' },
    { code: 'I25.10', description: 'Coronary artery disease' },
  ],
  ezetimibe: [
    { code: 'E78.5', description: 'Hyperlipidemia' },
    { code: 'I25.10', description: 'Coronary artery disease' },
  ],
  fenofibrate: [
    { code: 'E78.5', description: 'Hyperlipidemia' },
    { code: 'E78.2', description: 'Mixed hyperlipidemia' },
  ],
  gemfibrozil: [
    { code: 'E78.5', description: 'Hyperlipidemia' },
    { code: 'E78.2', description: 'Mixed hyperlipidemia' },
  ],

  // Cardiovascular - Antiplatelets & Anticoagulants
  clopidogrel: [
    { code: 'I25.10', description: 'Coronary artery disease' },
    { code: 'I21.9', description: 'Acute myocardial infarction' },
    { code: 'I63.9', description: 'Cerebral infarction' },
    { code: 'I74.9', description: 'Peripheral vascular disease' },
  ],
  warfarin: [
    { code: 'I48.91', description: 'Atrial fibrillation' },
    { code: 'I26.99', description: 'Pulmonary embolism' },
    { code: 'I82.90', description: 'Deep vein thrombosis' },
    { code: 'I25.10', description: 'Coronary artery disease' },
    { code: 'I21.9', description: 'Acute myocardial infarction' },
  ],
  rivaroxaban: [
    { code: 'I48.91', description: 'Atrial fibrillation' },
    { code: 'I26.99', description: 'Pulmonary embolism' },
    { code: 'I82.90', description: 'Deep vein thrombosis' },
  ],
  apixaban: [
    { code: 'I48.91', description: 'Atrial fibrillation' },
    { code: 'I26.99', description: 'Pulmonary embolism' },
    { code: 'I82.90', description: 'Deep vein thrombosis' },
  ],
  dabigatran: [
    { code: 'I48.91', description: 'Atrial fibrillation' },
    { code: 'I26.99', description: 'Pulmonary embolism' },
    { code: 'I82.90', description: 'Deep vein thrombosis' },
  ],
  edoxaban: [
    { code: 'I48.91', description: 'Atrial fibrillation' },
    { code: 'I26.99', description: 'Pulmonary embolism' },
    { code: 'I82.90', description: 'Deep vein thrombosis' },
  ],

  // Cardiovascular - Diuretics & Others
  furosemide: [
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'R60.9', description: 'Edema' },
    { code: 'N18.9', description: 'Chronic kidney disease' },
    { code: 'I10', description: 'Hypertension' },
  ],
  hydrochlorothiazide: [
    { code: 'I10', description: 'Hypertension' },
    { code: 'R60.9', description: 'Edema' },
    { code: 'N18.9', description: 'Chronic kidney disease' },
  ],
  spironolactone: [
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'I10', description: 'Hypertension' },
    { code: 'N18.9', description: 'Chronic kidney disease' },
  ],
  digoxin: [
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'I48.91', description: 'Atrial fibrillation' },
    { code: 'I25.10', description: 'Coronary artery disease' },
  ],
  amiodarone: [
    { code: 'I48.91', description: 'Atrial fibrillation' },
    { code: 'I49.9', description: 'Cardiac arrhythmia' },
    { code: 'I50.9', description: 'Heart failure' },
  ],

  // Respiratory Medications
  salbutamol: [
    { code: 'J45.909', description: 'Asthma' },
    { code: 'J44.9', description: 'COPD' },
    { code: 'J20.9', description: 'Bronchitis' },
    { code: 'J18.9', description: 'Pneumonia' },
  ],
  albuterol: [
    { code: 'J45.909', description: 'Asthma' },
    { code: 'J44.9', description: 'COPD' },
    { code: 'J20.9', description: 'Bronchitis' },
  ],
  terbutaline: [
    { code: 'J45.909', description: 'Asthma' },
    { code: 'J44.9', description: 'COPD' },
    { code: 'J20.9', description: 'Bronchitis' },
  ],
  salmeterol: [
    { code: 'J45.909', description: 'Asthma' },
    { code: 'J44.9', description: 'COPD' },
  ],
  formoterol: [
    { code: 'J45.909', description: 'Asthma' },
    { code: 'J44.9', description: 'COPD' },
  ],
  montelukast: [
    { code: 'J45.909', description: 'Asthma' },
    { code: 'J30.9', description: 'Allergic rhinitis' },
    { code: 'J44.9', description: 'COPD' },
  ],
  budesonide: [
    { code: 'J45.909', description: 'Asthma' },
    { code: 'J44.9', description: 'COPD' },
    { code: 'J30.9', description: 'Allergic rhinitis' },
  ],
  fluticasone: [
    { code: 'J45.909', description: 'Asthma' },
    { code: 'J30.9', description: 'Allergic rhinitis' },
    { code: 'J44.9', description: 'COPD' },
  ],
  beclomethasone: [
    { code: 'J45.909', description: 'Asthma' },
    { code: 'J30.9', description: 'Allergic rhinitis' },
    { code: 'J44.9', description: 'COPD' },
  ],
  ipratropium: [
    { code: 'J44.9', description: 'COPD' },
    { code: 'J45.909', description: 'Asthma' },
    { code: 'J20.9', description: 'Bronchitis' },
  ],
  tiotropium: [
    { code: 'J44.9', description: 'COPD' },
    { code: 'J45.909', description: 'Asthma' },
  ],

  // GI Medications
  omeprazole: [
    { code: 'K21.9', description: 'GERD' },
    { code: 'K25.9', description: 'Gastric ulcer' },
    { code: 'K29.70', description: 'Gastritis' },
    { code: 'K27.9', description: 'Peptic ulcer' },
  ],
  pantoprazole: [
    { code: 'K21.9', description: 'GERD' },
    { code: 'K25.9', description: 'Gastric ulcer' },
    { code: 'K29.70', description: 'Gastritis' },
    { code: 'K27.9', description: 'Peptic ulcer' },
  ],
  esomeprazole: [
    { code: 'K21.9', description: 'GERD' },
    { code: 'K25.9', description: 'Gastric ulcer' },
    { code: 'K29.70', description: 'Gastritis' },
    { code: 'K27.9', description: 'Peptic ulcer' },
  ],
  lansoprazole: [
    { code: 'K21.9', description: 'GERD' },
    { code: 'K25.9', description: 'Gastric ulcer' },
    { code: 'K29.70', description: 'Gastritis' },
    { code: 'K27.9', description: 'Peptic ulcer' },
  ],
  ranitidine: [
    { code: 'K21.9', description: 'GERD' },
    { code: 'K25.9', description: 'Gastric ulcer' },
    { code: 'K29.70', description: 'Gastritis' },
  ],
  famotidine: [
    { code: 'K21.9', description: 'GERD' },
    { code: 'K25.9', description: 'Gastric ulcer' },
    { code: 'K29.70', description: 'Gastritis' },
  ],
  ondansetron: [
    { code: 'R11.2', description: 'Nausea and vomiting' },
    { code: 'Z51.11', description: 'Chemotherapy' },
    { code: 'R11.0', description: 'Nausea' },
  ],
  metoclopramide: [
    { code: 'R11.2', description: 'Nausea and vomiting' },
    { code: 'K31.84', description: 'Gastroparesis' },
    { code: 'R11.0', description: 'Nausea' },
  ],
  domperidone: [
    { code: 'R11.2', description: 'Nausea and vomiting' },
    { code: 'K31.84', description: 'Gastroparesis' },
    { code: 'R11.0', description: 'Nausea' },
  ],
  loperamide: [
    { code: 'K59.1', description: 'Diarrhea' },
    { code: 'K52.9', description: 'Gastroenteritis' },
    { code: 'A09', description: 'Infectious gastroenteritis' },
  ],
  bisacodyl: [
    { code: 'K59.00', description: 'Constipation' },
    { code: 'K59.09', description: 'Other functional intestinal disorders' },
  ],
  lactulose: [
    { code: 'K59.00', description: 'Constipation' },
    { code: 'K72.90', description: 'Hepatic encephalopathy' },
    { code: 'K59.09', description: 'Other functional intestinal disorders' },
  ],

  // Antihistamines
  cetirizine: [
    { code: 'J30.9', description: 'Allergic rhinitis' },
    { code: 'L50.9', description: 'Urticaria' },
    { code: 'T78.40XA', description: 'Allergy' },
  ],
  loratadine: [
    { code: 'J30.9', description: 'Allergic rhinitis' },
    { code: 'L50.9', description: 'Urticaria' },
    { code: 'T78.40XA', description: 'Allergy' },
  ],
  fexofenadine: [
    { code: 'J30.9', description: 'Allergic rhinitis' },
    { code: 'L50.9', description: 'Urticaria' },
    { code: 'T78.40XA', description: 'Allergy' },
  ],
  diphenhydramine: [
    { code: 'J30.9', description: 'Allergic rhinitis' },
    { code: 'L50.9', description: 'Urticaria' },
    { code: 'G47.00', description: 'Insomnia' },
    { code: 'T78.40XA', description: 'Allergy' },
  ],

  // Corticosteroids
  prednisone: [
    { code: 'J45.909', description: 'Asthma' },
    { code: 'M05.9', description: 'Rheumatoid arthritis' },
    { code: 'L40.0', description: 'Psoriasis' },
    { code: 'M79.3', description: 'Myalgia' },
    { code: 'D69.3', description: 'Immune thrombocytopenia' },
  ],
  prednisolone: [
    { code: 'J45.909', description: 'Asthma' },
    { code: 'M05.9', description: 'Rheumatoid arthritis' },
    { code: 'L40.0', description: 'Psoriasis' },
    { code: 'M79.3', description: 'Myalgia' },
  ],
  dexamethasone: [
    { code: 'R11.2', description: 'Nausea and vomiting' },
    { code: 'G93.1', description: 'Cerebral edema' },
    { code: 'C80.1', description: 'Cancer pain' },
    { code: 'J45.909', description: 'Asthma' },
  ],
  hydrocortisone: [
    { code: 'L20.9', description: 'Atopic dermatitis' },
    { code: 'L40.0', description: 'Psoriasis' },
    { code: 'L50.9', description: 'Urticaria' },
    { code: 'E27.2', description: 'Addison disease' },
  ],
  betamethasone: [
    { code: 'L40.0', description: 'Psoriasis' },
    { code: 'L20.9', description: 'Atopic dermatitis' },
    { code: 'L50.9', description: 'Urticaria' },
  ],

  // Endocrine
  levothyroxine: [
    { code: 'E03.9', description: 'Hypothyroidism' },
    { code: 'E89.0', description: 'Postprocedural hypothyroidism' },
    { code: 'E03.1', description: 'Congenital hypothyroidism' },
  ],

  // Mental Health - Antidepressants
  sertraline: [
    { code: 'F32.9', description: 'Major depression' },
    { code: 'F41.9', description: 'Anxiety disorder' },
    { code: 'F41.1', description: 'Generalized anxiety disorder' },
    { code: 'F42', description: 'Obsessive-compulsive disorder' },
  ],
  fluoxetine: [
    { code: 'F32.9', description: 'Major depression' },
    { code: 'F41.9', description: 'Anxiety disorder' },
    { code: 'F42', description: 'Obsessive-compulsive disorder' },
  ],
  escitalopram: [
    { code: 'F32.9', description: 'Major depression' },
    { code: 'F41.9', description: 'Anxiety disorder' },
    { code: 'F41.1', description: 'Generalized anxiety disorder' },
  ],
  citalopram: [
    { code: 'F32.9', description: 'Major depression' },
    { code: 'F41.9', description: 'Anxiety disorder' },
  ],
  paroxetine: [
    { code: 'F32.9', description: 'Major depression' },
    { code: 'F41.9', description: 'Anxiety disorder' },
    { code: 'F42', description: 'Obsessive-compulsive disorder' },
  ],
  venlafaxine: [
    { code: 'F32.9', description: 'Major depression' },
    { code: 'F41.9', description: 'Anxiety disorder' },
    { code: 'F41.1', description: 'Generalized anxiety disorder' },
  ],
  duloxetine: [
    { code: 'F32.9', description: 'Major depression' },
    { code: 'F41.9', description: 'Anxiety disorder' },
    { code: 'G89.29', description: 'Chronic pain' },
    { code: 'M54.5', description: 'Low back pain' },
  ],
  amitriptyline: [
    { code: 'F32.9', description: 'Major depression' },
    { code: 'G89.29', description: 'Chronic pain' },
    { code: 'G43.909', description: 'Migraine' },
    { code: 'F41.9', description: 'Anxiety disorder' },
  ],

  // Mental Health - Anxiolytics
  alprazolam: [
    { code: 'F41.9', description: 'Anxiety disorder' },
    { code: 'F41.1', description: 'Generalized anxiety disorder' },
    { code: 'F41.0', description: 'Panic disorder' },
  ],
  diazepam: [
    { code: 'F41.9', description: 'Anxiety disorder' },
    { code: 'F41.1', description: 'Generalized anxiety disorder' },
    { code: 'G40.909', description: 'Epilepsy' },
    { code: 'M62.81', description: 'Muscle spasm' },
  ],
  lorazepam: [
    { code: 'F41.9', description: 'Anxiety disorder' },
    { code: 'F41.1', description: 'Generalized anxiety disorder' },
    { code: 'F41.0', description: 'Panic disorder' },
  ],
  clonazepam: [
    { code: 'F41.0', description: 'Panic disorder' },
    { code: 'G40.909', description: 'Epilepsy' },
    { code: 'F41.9', description: 'Anxiety disorder' },
  ],

  // Sleep Medications
  zolpidem: [
    { code: 'G47.00', description: 'Insomnia' },
    { code: 'G47.01', description: 'Insomnia with sleep apnea' },
  ],
  melatonin: [
    { code: 'G47.00', description: 'Insomnia' },
    { code: 'G47.2', description: 'Circadian rhythm sleep disorder' },
  ],

  // Neurological - Pain & Seizures
  gabapentin: [
    { code: 'G89.29', description: 'Chronic pain' },
    { code: 'G40.909', description: 'Epilepsy' },
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'G50.1', description: 'Trigeminal neuralgia' },
  ],
  pregabalin: [
    { code: 'G89.29', description: 'Chronic pain' },
    { code: 'G40.909', description: 'Epilepsy' },
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'G50.1', description: 'Trigeminal neuralgia' },
    { code: 'F41.9', description: 'Anxiety disorder' },
  ],
  carbamazepine: [
    { code: 'G40.909', description: 'Epilepsy' },
    { code: 'G50.1', description: 'Trigeminal neuralgia' },
    { code: 'F31.9', description: 'Bipolar disorder' },
  ],
  'valproic acid': [
    { code: 'G40.909', description: 'Epilepsy' },
    { code: 'F31.9', description: 'Bipolar disorder' },
    { code: 'G43.909', description: 'Migraine' },
  ],
  levetiracetam: [
    { code: 'G40.909', description: 'Epilepsy' },
    { code: 'G40.901', description: 'Localization-related epilepsy' },
  ],
  phenytoin: [
    { code: 'G40.909', description: 'Epilepsy' },
    { code: 'G50.1', description: 'Trigeminal neuralgia' },
  ],
  lamotrigine: [
    { code: 'G40.909', description: 'Epilepsy' },
    { code: 'F31.9', description: 'Bipolar disorder' },
  ],

  // Gout Medications
  allopurinol: [
    { code: 'M10.9', description: 'Gout' },
    { code: 'M10.00', description: 'Idiopathic gout' },
    { code: 'N18.9', description: 'Chronic kidney disease' },
  ],
  colchicine: [
    { code: 'M10.9', description: 'Gout' },
    { code: 'M10.00', description: 'Idiopathic gout' },
    { code: 'M79.3', description: 'Myalgia' },
  ],

  // Rheumatology
  methotrexate: [
    { code: 'M05.9', description: 'Rheumatoid arthritis' },
    { code: 'L40.0', description: 'Psoriasis' },
    { code: 'M45', description: 'Ankylosing spondylitis' },
  ],
  hydroxychloroquine: [
    { code: 'M05.9', description: 'Rheumatoid arthritis' },
    { code: 'M32.9', description: 'Systemic lupus erythematosus' },
    { code: 'L40.0', description: 'Psoriasis' },
  ],

  // Throat Medications - Pharyngitis/Tonsillitis
  orofar: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'J31.2', description: 'Chronic pharyngitis' },
  ],
  tanaflex: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'K12.1', description: 'Other forms of stomatitis' },
  ],
  betadine: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'L08.9', description: 'Local infection of skin' },
  ],
  'betadine gargle': [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
  ],
  strepsils: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
  ],
  difflam: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'K12.1', description: 'Other forms of stomatitis' },
  ],
  tantum: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
  ],
  hexoral: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'K12.1', description: 'Other forms of stomatitis' },
  ],
  benzydamine: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J03.90', description: 'Acute tonsillitis, unspecified' },
    { code: 'K12.1', description: 'Other forms of stomatitis' },
  ],
  chlorhexidine: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'K05.10', description: 'Chronic gingivitis, plaque induced' },
    { code: 'K12.1', description: 'Other forms of stomatitis' },
  ],

  // Urology
  finasteride: [
    { code: 'N40.0', description: 'Benign prostatic hyperplasia' },
    {
      code: 'N40.1',
      description: 'Benign prostatic hyperplasia with lower urinary tract symptoms',
    },
  ],
  tamsulosin: [
    { code: 'N40.0', description: 'Benign prostatic hyperplasia' },
    {
      code: 'N40.1',
      description: 'Benign prostatic hyperplasia with lower urinary tract symptoms',
    },
  ],
  // Omnic brand names (tamsulosin)
  omnic: [
    { code: 'N40.0', description: 'Benign prostatic hyperplasia' },
    {
      code: 'N40.1',
      description: 'Benign prostatic hyperplasia with lower urinary tract symptoms',
    },
  ],
  'omnic ocas': [
    { code: 'N40.0', description: 'Benign prostatic hyperplasia' },
    {
      code: 'N40.1',
      description: 'Benign prostatic hyperplasia with lower urinary tract symptoms',
    },
  ],
  // Omnicef is a DIFFERENT drug (antibiotic cefdinir) - NOT the same as Omnic!
  omnicef: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
    { code: 'J01.90', description: 'Acute sinusitis, unspecified' },
    { code: 'L03.90', description: 'Cellulitis, unspecified' },
    { code: 'H66.90', description: 'Otitis media, unspecified' },
  ],
  sildenafil: [
    { code: 'N52.9', description: 'Erectile dysfunction' },
    { code: 'I27.0', description: 'Pulmonary hypertension' },
  ],
  tadalafil: [
    { code: 'N52.9', description: 'Erectile dysfunction' },
    { code: 'I27.0', description: 'Pulmonary hypertension' },
    { code: 'N40.0', description: 'Benign prostatic hyperplasia' },
  ],

  // Dermatology
  isotretinoin: [
    { code: 'L70.0', description: 'Acne vulgaris' },
    { code: 'L70.1', description: 'Acne conglobata' },
  ],
  tretinoin: [
    { code: 'L70.0', description: 'Acne vulgaris' },
    { code: 'L57.0', description: 'Actinic keratosis' },
  ],

  // Antivirals
  acyclovir: [
    { code: 'B00.9', description: 'Herpes simplex' },
    { code: 'B02.9', description: 'Herpes zoster' },
    { code: 'B00.2', description: 'Herpesviral meningitis' },
  ],
  valacyclovir: [
    { code: 'B00.9', description: 'Herpes simplex' },
    { code: 'B02.9', description: 'Herpes zoster' },
    { code: 'B00.2', description: 'Herpesviral meningitis' },
  ],

  // Antifungals
  fluconazole: [
    { code: 'B37.9', description: 'Candidiasis' },
    { code: 'B37.2', description: 'Candidiasis of skin and nail' },
    { code: 'B37.3', description: 'Candidiasis of vulva and vagina' },
  ],
  ketoconazole: [
    { code: 'B37.9', description: 'Candidiasis' },
    { code: 'B35.1', description: 'Tinea unguium' },
    { code: 'B35.0', description: 'Tinea barbae and tinea capitis' },
  ],
  terbinafine: [
    { code: 'B35.1', description: 'Tinea unguium' },
    { code: 'B35.3', description: 'Tinea pedis' },
    { code: 'B35.4', description: 'Tinea corporis' },
  ],

  // Vitamins & Supplements
  'vitamin d': [
    { code: 'E55.9', description: 'Vitamin D deficiency' },
    { code: 'M81.0', description: 'Age-related osteoporosis' },
    { code: 'E55.0', description: 'Rickets' },
  ],
  'vitamin b12': [
    { code: 'E53.8', description: 'Vitamin B12 deficiency' },
    { code: 'D51.9', description: 'Vitamin B12 deficiency anemia' },
    { code: 'E53.8', description: 'Deficiency of other B group vitamins' },
  ],
  'folic acid': [
    { code: 'D52.9', description: 'Folate deficiency anemia' },
    {
      code: 'O35.3XX0',
      description: 'Maternal care for (suspected) chromosomal abnormality in fetus',
    },
  ],
  iron: [
    { code: 'D50.9', description: 'Iron deficiency anemia' },
    { code: 'D50.0', description: 'Iron deficiency anemia secondary to blood loss' },
  ],
  calcium: [
    { code: 'E58', description: 'Calcium deficiency' },
    { code: 'M81.0', description: 'Age-related osteoporosis' },
    { code: 'E83.52', description: 'Hypocalcemia' },
  ],
  magnesium: [
    { code: 'E61.2', description: 'Magnesium deficiency' },
    { code: 'E83.42', description: 'Hypomagnesemia' },
  ],
  zinc: [
    { code: 'E60', description: 'Zinc deficiency' },
    { code: 'E50.9', description: 'Vitamin A deficiency' },
  ],

  // ===============================================
  // BRAND NAME MAPPINGS - Common UAE/Gulf brands
  // ===============================================

  // Allergy medications
  claritin: [
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
    { code: 'L50.0', description: 'Allergic urticaria' },
  ],
  clarityn: [
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
    { code: 'L50.0', description: 'Allergic urticaria' },
  ],
  zyrtec: [
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
    { code: 'L50.0', description: 'Allergic urticaria' },
    { code: 'L20.9', description: 'Atopic dermatitis' },
  ],
  xyzal: [
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
    { code: 'L50.0', description: 'Allergic urticaria' },
  ],
  telfast: [
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
    { code: 'L50.0', description: 'Allergic urticaria' },
  ],
  aerius: [
    { code: 'J30.1', description: 'Allergic rhinitis due to pollen' },
    { code: 'L50.0', description: 'Allergic urticaria' },
  ],

  // Cardiovascular - Brand names
  norvasc: [
    { code: 'I10', description: 'Essential hypertension' },
    { code: 'I20.9', description: 'Angina pectoris' },
  ],
  lipitor: [
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
    { code: 'E78.0', description: 'Pure hypercholesterolemia' },
  ],
  crestor: [
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
    { code: 'E78.0', description: 'Pure hypercholesterolemia' },
  ],
  plavix: [
    { code: 'I25.10', description: 'Coronary artery disease' },
    { code: 'I63.9', description: 'Cerebral infarction' },
    { code: 'I74.9', description: 'Embolism and thrombosis' },
  ],
  concor: [
    { code: 'I10', description: 'Essential hypertension' },
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'I25.10', description: 'Coronary artery disease' },
  ],
  'concor cor': [
    { code: 'I50.9', description: 'Heart failure' },
    { code: 'I25.10', description: 'Coronary artery disease' },
  ],
  atacand: [
    { code: 'I10', description: 'Essential hypertension' },
    { code: 'I50.9', description: 'Heart failure' },
  ],
  diovan: [
    { code: 'I10', description: 'Essential hypertension' },
    { code: 'I50.9', description: 'Heart failure' },
  ],
  coversyl: [
    { code: 'I10', description: 'Essential hypertension' },
    { code: 'I50.9', description: 'Heart failure' },
  ],

  // GI medications - Brand names
  nexium: [
    { code: 'K21.0', description: 'GERD with esophagitis' },
    { code: 'K25.9', description: 'Gastric ulcer' },
    { code: 'K27.9', description: 'Peptic ulcer' },
  ],
  losec: [
    { code: 'K21.0', description: 'GERD with esophagitis' },
    { code: 'K25.9', description: 'Gastric ulcer' },
  ],
  'losec mups': [
    { code: 'K21.0', description: 'GERD with esophagitis' },
    { code: 'K25.9', description: 'Gastric ulcer' },
  ],
  pariet: [
    { code: 'K21.0', description: 'GERD with esophagitis' },
    { code: 'K25.9', description: 'Gastric ulcer' },
  ],
  controloc: [
    { code: 'K21.0', description: 'GERD with esophagitis' },
    { code: 'K25.9', description: 'Gastric ulcer' },
  ],
  motilium: [
    { code: 'R11.2', description: 'Nausea with vomiting' },
    { code: 'K30', description: 'Functional dyspepsia' },
  ],

  // Diabetes - Brand names
  glucophage: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus' },
    { code: 'E11.65', description: 'Type 2 DM with hyperglycemia' },
  ],
  'glucophage xr': [{ code: 'E11.9', description: 'Type 2 diabetes mellitus' }],
  januvia: [{ code: 'E11.9', description: 'Type 2 diabetes mellitus' }],
  jardiance: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus' },
    { code: 'I50.9', description: 'Heart failure' },
  ],
  lantus: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus' },
    { code: 'E10.9', description: 'Type 1 diabetes mellitus' },
  ],
  levemir: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus' },
    { code: 'E10.9', description: 'Type 1 diabetes mellitus' },
  ],
  novorapid: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus' },
    { code: 'E10.9', description: 'Type 1 diabetes mellitus' },
  ],
  humalog: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus' },
    { code: 'E10.9', description: 'Type 1 diabetes mellitus' },
  ],

  // Respiratory - Brand names
  ventolin: [
    { code: 'J45.909', description: 'Unspecified asthma' },
    { code: 'J44.9', description: 'COPD' },
    { code: 'R06.2', description: 'Wheezing' },
  ],
  seretide: [
    { code: 'J45.909', description: 'Unspecified asthma' },
    { code: 'J44.9', description: 'COPD' },
  ],
  'symbicort turbuhaler': [
    { code: 'J45.909', description: 'Unspecified asthma' },
    { code: 'J44.9', description: 'COPD' },
  ],
  'symbicort rapihaler': [
    { code: 'J45.909', description: 'Unspecified asthma' },
    { code: 'J44.9', description: 'COPD' },
  ],
  singulair: [
    { code: 'J45.909', description: 'Unspecified asthma' },
    { code: 'J30.1', description: 'Allergic rhinitis' },
  ],
  flixotide: [{ code: 'J45.909', description: 'Unspecified asthma' }],
  pulmicort: [
    { code: 'J45.909', description: 'Unspecified asthma' },
    { code: 'J44.9', description: 'COPD' },
  ],

  // Pain/Inflammation - Brand names
  voltaren: [
    { code: 'M25.50', description: 'Pain in unspecified joint' },
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'M79.3', description: 'Myalgia' },
  ],
  celebrex: [
    { code: 'M15.9', description: 'Osteoarthritis' },
    { code: 'M05.9', description: 'Rheumatoid arthritis' },
    { code: 'M54.5', description: 'Low back pain' },
  ],
  arcoxia: [
    { code: 'M15.9', description: 'Osteoarthritis' },
    { code: 'M05.9', description: 'Rheumatoid arthritis' },
    { code: 'M10.9', description: 'Gout' },
  ],
  brufen: [
    { code: 'M25.50', description: 'Pain in unspecified joint' },
    { code: 'R50.9', description: 'Fever' },
    { code: 'M79.3', description: 'Myalgia' },
  ],

  // Antibiotics - Brand names
  'augmentin es': [
    { code: 'J02.9', description: 'Acute pharyngitis' },
    { code: 'H66.90', description: 'Otitis media' },
  ],
  amoxil: [
    { code: 'J02.9', description: 'Acute pharyngitis' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'H66.90', description: 'Otitis media' },
  ],
  zithromax: [
    { code: 'J02.9', description: 'Acute pharyngitis' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'J20.9', description: 'Acute bronchitis' },
  ],
  ciprobay: [
    { code: 'N39.0', description: 'UTI' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'A09', description: 'Infectious gastroenteritis' },
  ],
  tavanic: [
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'N39.0', description: 'UTI' },
    { code: 'J01.90', description: 'Acute sinusitis' },
  ],
  klacid: [
    { code: 'J02.9', description: 'Acute pharyngitis' },
    { code: 'J18.9', description: 'Pneumonia' },
    { code: 'K29.70', description: 'H. pylori gastritis' },
  ],

  // Mental health - Brand names
  lexapro: [
    { code: 'F32.9', description: 'Major depressive disorder' },
    { code: 'F41.1', description: 'Generalized anxiety disorder' },
  ],
  zoloft: [
    { code: 'F32.9', description: 'Major depressive disorder' },
    { code: 'F41.1', description: 'Generalized anxiety disorder' },
    { code: 'F40.10', description: 'Social anxiety disorder' },
  ],
  prozac: [
    { code: 'F32.9', description: 'Major depressive disorder' },
    { code: 'F50.9', description: 'Eating disorder' },
    { code: 'F42.9', description: 'OCD' },
  ],
  effexor: [
    { code: 'F32.9', description: 'Major depressive disorder' },
    { code: 'F41.1', description: 'Generalized anxiety disorder' },
  ],
  xanax: [
    { code: 'F41.1', description: 'Generalized anxiety disorder' },
    { code: 'F41.0', description: 'Panic disorder' },
  ],
  stilnox: [
    { code: 'G47.00', description: 'Insomnia' },
    { code: 'F51.01', description: 'Primary insomnia' },
  ],

  // Thyroid - Brand names
  eltroxin: [
    { code: 'E03.9', description: 'Hypothyroidism' },
    { code: 'E06.3', description: 'Autoimmune thyroiditis' },
  ],
  euthyrox: [{ code: 'E03.9', description: 'Hypothyroidism' }],
  neomercazole: [
    { code: 'E05.90', description: 'Hyperthyroidism' },
    { code: 'E05.00', description: 'Graves disease' },
  ],
};
