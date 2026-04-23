// Enhanced condition-to-drug mapping with priority and ICD-10 support
export interface EnhancedConditionData {
  drugs: string[];
  priority: string[];
  icd10: string[];
}

export const ENHANCED_CONDITION_MAPPING: Record<string, EnhancedConditionData> = {
  // Enhanced condition-to-drug mapping with priority and ICD-10 support
  // Includes comprehensive mappings from legacy system

  // ==================== DIABETES ====================
  'type 2 diabetes': {
    drugs: [
      'metformin',
      'glimepiride',
      'sitagliptin',
      'empagliflozin',
      'dapagliflozin',
      'liraglutide',
    ],
    priority: ['metformin', 'glimepiride'],
    icd10: ['E11.9', 'E11.65'],
  },
  'type 1 diabetes': {
    drugs: ['insulin', 'insulin glargine', 'insulin aspart', 'insulin lispro'],
    priority: ['insulin'],
    icd10: ['E10.9'],
  },
  diabetes: {
    drugs: ['metformin', 'insulin', 'glimepiride', 'sitagliptin', 'gliclazide', 'empagliflozin'],
    priority: ['metformin', 'insulin'],
    icd10: ['E11.9', 'E10.9'],
  },
  diabetic: {
    drugs: ['metformin', 'insulin', 'glimepiride'],
    priority: ['metformin', 'insulin'],
    icd10: ['E11.9'],
  },
  'blood sugar': {
    drugs: ['metformin', 'glimepiride', 'insulin'],
    priority: ['metformin'],
    icd10: ['E11.9'],
  },
  'high sugar': {
    drugs: ['metformin', 'glimepiride', 'insulin'],
    priority: ['metformin'],
    icd10: ['E11.9'],
  },
  hyperglycemia: {
    drugs: ['metformin', 'insulin', 'glimepiride'],
    priority: ['metformin', 'insulin'],
    icd10: ['E11.65', 'R73.9'],
  },

  // ==================== CARDIOVASCULAR ====================
  hypertension: {
    drugs: ['lisinopril', 'amlodipine', 'atenolol', 'losartan', 'valsartan', 'telmisartan'],
    priority: ['lisinopril', 'amlodipine'],
    icd10: ['I10'],
  },
  'high blood pressure': {
    drugs: ['lisinopril', 'amlodipine', 'atenolol', 'losartan'],
    priority: ['lisinopril', 'amlodipine'],
    icd10: ['I10'],
  },
  'blood pressure': {
    drugs: ['lisinopril', 'amlodipine', 'losartan', 'valsartan'],
    priority: ['lisinopril', 'amlodipine'],
    icd10: ['I10'],
  },
  'heart failure': {
    drugs: ['furosemide', 'lisinopril', 'carvedilol', 'spironolactone', 'bisoprolol'],
    priority: ['furosemide', 'lisinopril'],
    icd10: ['I50.9'],
  },
  'chest pain': {
    drugs: ['aspirin', 'nitroglycerin', 'isosorbide', 'atenolol'],
    priority: ['aspirin'],
    icd10: ['I20.9', 'I21.9', 'R07.9'],
  },
  angina: {
    drugs: ['aspirin', 'atenolol', 'nitroglycerin', 'isosorbide', 'amlodipine'],
    priority: ['nitroglycerin', 'aspirin'],
    icd10: ['I20.9'],
  },
  arrhythmia: {
    drugs: ['amiodarone', 'metoprolol', 'digoxin', 'propranolol'],
    priority: ['amiodarone', 'metoprolol'],
    icd10: ['I49.9'],
  },
  'irregular heartbeat': {
    drugs: ['amiodarone', 'metoprolol', 'digoxin'],
    priority: ['amiodarone'],
    icd10: ['I49.9'],
  },
  'atrial fibrillation': {
    drugs: ['warfarin', 'rivaroxaban', 'apixaban', 'metoprolol'],
    priority: ['warfarin', 'rivaroxaban'],
    icd10: ['I48.91'],
  },
  afib: {
    drugs: ['warfarin', 'rivaroxaban', 'apixaban', 'metoprolol'],
    priority: ['warfarin', 'rivaroxaban'],
    icd10: ['I48.91'],
  },
  'high cholesterol': {
    drugs: ['atorvastatin', 'simvastatin', 'rosuvastatin', 'pravastatin'],
    priority: ['atorvastatin', 'simvastatin'],
    icd10: ['E78.5'],
  },
  hyperlipidemia: {
    drugs: ['atorvastatin', 'simvastatin', 'rosuvastatin', 'fenofibrate'],
    priority: ['atorvastatin', 'simvastatin'],
    icd10: ['E78.5'],
  },
  cholesterol: {
    drugs: ['atorvastatin', 'simvastatin', 'rosuvastatin'],
    priority: ['atorvastatin'],
    icd10: ['E78.5'],
  },
  'blood clot': {
    drugs: ['warfarin', 'rivaroxaban', 'apixaban', 'enoxaparin', 'heparin'],
    priority: ['warfarin', 'rivaroxaban'],
    icd10: ['I82.90', 'I26.99'],
  },
  dvt: {
    drugs: ['warfarin', 'rivaroxaban', 'enoxaparin'],
    priority: ['enoxaparin', 'warfarin'],
    icd10: ['I82.90'],
  },
  'deep vein thrombosis': {
    drugs: ['warfarin', 'rivaroxaban', 'enoxaparin'],
    priority: ['enoxaparin'],
    icd10: ['I82.90'],
  },
  stroke: {
    drugs: ['aspirin', 'clopidogrel', 'warfarin', 'rivaroxaban'],
    priority: ['aspirin', 'clopidogrel'],
    icd10: ['I63.9'],
  },

  // ==================== INFECTIONS ====================
  infection: {
    drugs: ['amoxicillin', 'azithromycin', 'ciprofloxacin', 'cefixime', 'cephalexin'],
    priority: ['amoxicillin', 'azithromycin'],
    icd10: ['B99.9'],
  },
  'bacterial infection': {
    drugs: ['amoxicillin', 'azithromycin', 'ciprofloxacin', 'cefixime'],
    priority: ['amoxicillin'],
    icd10: ['B96.89'],
  },
  'urinary tract infection': {
    drugs: ['ciprofloxacin', 'nitrofurantoin', 'trimethoprim', 'cefixime', 'amoxicillin'],
    priority: ['ciprofloxacin', 'nitrofurantoin'],
    icd10: ['N39.0'],
  },
  uti: {
    drugs: ['ciprofloxacin', 'nitrofurantoin', 'trimethoprim', 'cefixime'],
    priority: ['ciprofloxacin', 'nitrofurantoin'],
    icd10: ['N39.0'],
  },
  'bladder infection': {
    drugs: ['ciprofloxacin', 'nitrofurantoin', 'trimethoprim'],
    priority: ['ciprofloxacin'],
    icd10: ['N30.90'],
  },
  'kidney infection': {
    drugs: ['ciprofloxacin', 'ceftriaxone', 'amoxicillin'],
    priority: ['ciprofloxacin'],
    icd10: ['N10'],
  },
  'upper respiratory infection': {
    drugs: ['amoxicillin', 'azithromycin', 'cefixime'],
    priority: ['amoxicillin'],
    icd10: ['J06.9'],
  },
  'respiratory infection': {
    drugs: ['amoxicillin', 'azithromycin', 'cefixime', 'levofloxacin'],
    priority: ['amoxicillin'],
    icd10: ['J98.8'],
  },
  pneumonia: {
    drugs: ['amoxicillin', 'azithromycin', 'cefixime', 'levofloxacin', 'ceftriaxone'],
    priority: ['amoxicillin', 'azithromycin'],
    icd10: ['J18.9'],
  },
  bronchitis: {
    drugs: ['amoxicillin', 'azithromycin', 'doxycycline'],
    priority: ['amoxicillin', 'azithromycin'],
    icd10: ['J20.9'],
  },
  'skin infection': {
    drugs: ['amoxicillin', 'clindamycin', 'doxycycline', 'cephalexin', 'flucloxacillin'],
    priority: ['amoxicillin', 'cephalexin'],
    icd10: ['L08.9'],
  },
  cellulitis: {
    drugs: ['flucloxacillin', 'clindamycin', 'cephalexin'],
    priority: ['flucloxacillin', 'cephalexin'],
    icd10: ['L03.90'],
  },
  'ear infection': {
    drugs: ['amoxicillin', 'azithromycin', 'ciprofloxacin ear drops'],
    priority: ['amoxicillin'],
    icd10: ['H66.9'],
  },
  otitis: {
    drugs: ['amoxicillin', 'azithromycin', 'ciprofloxacin'],
    priority: ['amoxicillin'],
    icd10: ['H66.9'],
  },
  'sinus infection': {
    drugs: ['amoxicillin', 'azithromycin', 'cefixime', 'moxifloxacin'],
    priority: ['amoxicillin'],
    icd10: ['J01.90'],
  },
  sinusitis: {
    drugs: ['amoxicillin', 'azithromycin', 'moxifloxacin', 'fluticasone nasal'],
    priority: ['amoxicillin', 'fluticasone nasal'],
    icd10: ['J01.90'],
  },
  'dental infection': {
    drugs: ['amoxicillin', 'metronidazole', 'clindamycin'],
    priority: ['amoxicillin', 'metronidazole'],
    icd10: ['K04.7'],
  },
  'tooth infection': {
    drugs: ['amoxicillin', 'metronidazole', 'clindamycin'],
    priority: ['amoxicillin'],
    icd10: ['K04.7'],
  },
  'gum infection': {
    drugs: ['metronidazole', 'amoxicillin', 'chlorhexidine'],
    priority: ['metronidazole', 'chlorhexidine'],
    icd10: ['K05.1'],
  },
  sepsis: {
    drugs: ['ceftriaxone', 'meropenem', 'vancomycin', 'piperacillin'],
    priority: ['ceftriaxone'],
    icd10: ['A41.9'],
  },

  // ==================== THROAT CONDITIONS ====================
  'sore throat': {
    drugs: ['paracetamol', 'ibuprofen', 'strepsils', 'benzydamine', 'chlorhexidine', 'amoxicillin'],
    priority: ['paracetamol', 'strepsils'],
    icd10: ['J02.9'],
  },
  pharyngitis: {
    drugs: ['amoxicillin', 'azithromycin', 'paracetamol', 'benzydamine'],
    priority: ['amoxicillin'],
    icd10: ['J02.9'],
  },
  tonsillitis: {
    drugs: ['amoxicillin', 'azithromycin', 'penicillin', 'paracetamol'],
    priority: ['amoxicillin', 'penicillin'],
    icd10: ['J03.90'],
  },
  'strep throat': {
    drugs: ['amoxicillin', 'penicillin', 'azithromycin'],
    priority: ['amoxicillin', 'penicillin'],
    icd10: ['J02.0'],
  },
  laryngitis: {
    drugs: ['paracetamol', 'ibuprofen', 'benzydamine'],
    priority: ['paracetamol'],
    icd10: ['J04.0'],
  },
  'throat pain': {
    drugs: ['paracetamol', 'ibuprofen', 'strepsils', 'benzydamine'],
    priority: ['paracetamol', 'strepsils'],
    icd10: ['R07.0'],
  },
  'throat infection': {
    drugs: ['amoxicillin', 'azithromycin', 'benzydamine'],
    priority: ['amoxicillin'],
    icd10: ['J02.9'],
  },

  // ==================== FUNGAL INFECTIONS ====================
  fungal: {
    drugs: ['fluconazole', 'clotrimazole', 'miconazole', 'terbinafine', 'ketoconazole', 'nystatin'],
    priority: ['fluconazole', 'clotrimazole'],
    icd10: ['B35.9'],
  },
  'fungal infection': {
    drugs: ['fluconazole', 'clotrimazole', 'miconazole', 'terbinafine', 'ketoconazole', 'nystatin'],
    priority: ['fluconazole', 'clotrimazole'],
    icd10: ['B35.9'],
  },
  mycosis: {
    drugs: [
      'fluconazole',
      'clotrimazole',
      'miconazole',
      'terbinafine',
      'ketoconazole',
      'itraconazole',
    ],
    priority: ['fluconazole'],
    icd10: ['B35.9'],
  },
  'skin fungus': {
    drugs: ['clotrimazole', 'miconazole', 'terbinafine', 'ketoconazole'],
    priority: ['clotrimazole', 'miconazole'],
    icd10: ['B35.9'],
  },
  'nail fungus': {
    drugs: ['terbinafine', 'itraconazole', 'fluconazole'],
    priority: ['terbinafine'],
    icd10: ['B35.1'],
  },
  onychomycosis: {
    drugs: ['terbinafine', 'itraconazole', 'fluconazole'],
    priority: ['terbinafine'],
    icd10: ['B35.1'],
  },
  'oral thrush': {
    drugs: ['nystatin', 'fluconazole', 'clotrimazole'],
    priority: ['nystatin', 'fluconazole'],
    icd10: ['B37.0'],
  },
  thrush: {
    drugs: ['nystatin', 'fluconazole', 'clotrimazole'],
    priority: ['nystatin'],
    icd10: ['B37.9'],
  },
  candidiasis: {
    drugs: ['fluconazole', 'nystatin', 'clotrimazole', 'miconazole'],
    priority: ['fluconazole'],
    icd10: ['B37.9'],
  },
  candida: {
    drugs: ['fluconazole', 'nystatin', 'clotrimazole'],
    priority: ['fluconazole'],
    icd10: ['B37.9'],
  },
  'yeast infection': {
    drugs: ['fluconazole', 'clotrimazole', 'miconazole'],
    priority: ['fluconazole', 'clotrimazole'],
    icd10: ['B37.9'],
  },
  'vaginal yeast': {
    drugs: ['fluconazole', 'clotrimazole', 'miconazole'],
    priority: ['fluconazole', 'clotrimazole'],
    icd10: ['B37.3'],
  },
  'athlete foot': {
    drugs: ['terbinafine', 'clotrimazole', 'miconazole'],
    priority: ['terbinafine', 'clotrimazole'],
    icd10: ['B35.3'],
  },

  // ==================== PAIN & OTHER ====================
  pain: {
    drugs: ['paracetamol', 'ibuprofen', 'diclofenac', 'tramadol'],
    priority: ['paracetamol', 'ibuprofen'],
    icd10: ['R52'],
  },
  'joint pain': {
    drugs: ['ibuprofen', 'diclofenac', 'naproxen', 'celecoxib'],
    priority: ['ibuprofen', 'diclofenac'],
    icd10: ['M25.5'],
  },
  'back pain': {
    drugs: ['ibuprofen', 'diclofenac', 'tramadol', 'cyclobenzaprine'],
    priority: ['ibuprofen', 'diclofenac'],
    icd10: ['M54.5'],
  },
  headache: {
    drugs: ['paracetamol', 'ibuprofen', 'aspirin'],
    priority: ['paracetamol', 'ibuprofen'],
    icd10: ['R51'],
  },
  migraine: {
    drugs: ['sumatriptan', 'paracetamol', 'ibuprofen', 'topiramate'],
    priority: ['sumatriptan', 'paracetamol'],
    icd10: ['G43.909'],
  },
  'nerve pain': {
    drugs: ['gabapentin', 'pregabalin', 'amitriptyline', 'duloxetine'],
    priority: ['gabapentin', 'pregabalin'],
    icd10: ['G89.29'],
  },

  // GI conditions
  gerd: {
    drugs: ['omeprazole', 'pantoprazole', 'lansoprazole', 'esomeprazole', 'ranitidine'],
    priority: ['omeprazole', 'pantoprazole'],
    icd10: ['K21.9'],
  },
  'acid reflux': {
    drugs: ['omeprazole', 'pantoprazole', 'esomeprazole'],
    priority: ['omeprazole'],
    icd10: ['K21.9'],
  },
  nausea: {
    drugs: ['ondansetron', 'domperidone', 'metoclopramide', 'promethazine'],
    priority: ['ondansetron', 'domperidone'],
    icd10: ['R11'],
  },
  diarrhea: {
    drugs: ['loperamide', 'oral rehydration salts'],
    priority: ['loperamide'],
    icd10: ['K59.1'],
  },
  constipation: {
    drugs: ['lactulose', 'bisacodyl', 'senna'],
    priority: ['lactulose'],
    icd10: ['K59.00'],
  },

  // Respiratory
  asthma: {
    drugs: ['salbutamol', 'montelukast', 'fluticasone', 'budesonide'],
    priority: ['salbutamol', 'montelukast'],
    icd10: ['J45.909'],
  },
  copd: {
    drugs: ['tiotropium', 'salbutamol', 'fluticasone', 'ipratropium'],
    priority: ['tiotropium', 'salbutamol'],
    icd10: ['J44.9'],
  },
  cough: {
    drugs: ['dextromethorphan', 'guaifenesin', 'codeine'],
    priority: ['dextromethorphan'],
    icd10: ['R05'],
  },

  // Mental health
  depression: {
    drugs: ['sertraline', 'escitalopram', 'fluoxetine', 'venlafaxine'],
    priority: ['sertraline', 'escitalopram'],
    icd10: ['F32.9'],
  },
  anxiety: {
    drugs: ['sertraline', 'escitalopram', 'buspirone', 'alprazolam'],
    priority: ['sertraline', 'escitalopram'],
    icd10: ['F41.9'],
  },
  insomnia: {
    drugs: ['zolpidem', 'zopiclone', 'melatonin', 'trazodone'],
    priority: ['zolpidem', 'melatonin'],
    icd10: ['G47.00'],
  },

  // Fever and flu
  fever: {
    drugs: ['paracetamol', 'ibuprofen'],
    priority: ['paracetamol'],
    icd10: ['R50.9'],
  },
  flu: {
    drugs: ['oseltamivir', 'seltaflu', 'paracetamol', 'ibuprofen'],
    priority: ['oseltamivir', 'seltaflu', 'paracetamol'],
    icd10: ['J11.1'],
  },
  influenza: {
    drugs: ['oseltamivir', 'seltaflu', 'paracetamol', 'ibuprofen'],
    priority: ['oseltamivir', 'seltaflu'],
    icd10: ['J11.1', 'J10.1'],
  },
  seltaflu: {
    drugs: ['oseltamivir', 'seltaflu'],
    priority: ['seltaflu', 'oseltamivir'],
    icd10: ['J11.1'],
  },

  // Iron deficiency
  'iron deficiency': {
    drugs: ['ferosac', 'ferrous sulfate', 'iron'],
    priority: ['ferosac', 'ferrous sulfate'],
    icd10: ['D50.9'],
  },
  anemia: {
    drugs: ['ferosac', 'ferrous sulfate', 'iron', 'folic acid'],
    priority: ['ferosac', 'ferrous sulfate'],
    icd10: ['D50.9', 'D64.9'],
  },
  ferosac: {
    drugs: ['ferosac', 'iron'],
    priority: ['ferosac'],
    icd10: ['D50.9'],
  },

  // Allergies
  allergy: {
    drugs: ['cetirizine', 'loratadine', 'fexofenadine', 'chlorpheniramine'],
    priority: ['cetirizine', 'loratadine'],
    icd10: ['T78.4'],
  },
  'allergic rhinitis': {
    drugs: ['cetirizine', 'loratadine', 'fluticasone nasal'],
    priority: ['cetirizine', 'loratadine'],
    icd10: ['J30.9'],
  },

  // Direct Drug Mappings (for priority drugs)
  paracetamol: {
    drugs: ['paracetamol'],
    priority: ['paracetamol'],
    icd10: ['R52', 'R50.9'],
  },
  ibuprofen: {
    drugs: ['ibuprofen'],
    priority: ['ibuprofen'],
    icd10: ['R52', 'M25.5'],
  },
  amoxicillin: {
    drugs: ['amoxicillin'],
    priority: ['amoxicillin'],
    icd10: ['J02.9', 'J18.9'],
  },
  augmentin: {
    drugs: ['augmentin', 'amoxicillin clavulanate'],
    priority: ['augmentin'],
    icd10: ['J01.90', 'J18.9'],
  },
  metformin: {
    drugs: ['metformin'],
    priority: ['metformin'],
    icd10: ['E11.9'],
  },
  atorvastatin: {
    drugs: ['atorvastatin'],
    priority: ['atorvastatin'],
    icd10: ['E78.5'],
  },
  amlodipine: {
    drugs: ['amlodipine'],
    priority: ['amlodipine'],
    icd10: ['I10'],
  },
  omeprazole: {
    drugs: ['omeprazole'],
    priority: ['omeprazole'],
    icd10: ['K21.9'],
  },
  salbutamol: {
    drugs: ['salbutamol'],
    priority: ['salbutamol'],
    icd10: ['J45.909'],
  },
  cetirizine: {
    drugs: ['cetirizine'],
    priority: ['cetirizine'],
    icd10: ['T78.4'],
  },
  lisinopril: {
    drugs: ['lisinopril'],
    priority: ['lisinopril'],
    icd10: ['I10'],
  },
  simvastatin: {
    drugs: ['simvastatin'],
    priority: ['simvastatin'],
    icd10: ['E78.5'],
  },
  azithromycin: {
    drugs: ['azithromycin'],
    priority: ['azithromycin'],
    icd10: ['J18.9', 'J02.9'],
  },
  ciprofloxacin: {
    drugs: ['ciprofloxacin'],
    priority: ['ciprofloxacin'],
    icd10: ['N39.0'],
  },
  sertraline: {
    drugs: ['sertraline'],
    priority: ['sertraline'],
    icd10: ['F32.9'],
  },
  diclofenac: {
    drugs: ['diclofenac'],
    priority: ['diclofenac'],
    icd10: ['R52', 'M19.9'],
  },
  losartan: {
    drugs: ['losartan'],
    priority: ['losartan'],
    icd10: ['I10'],
  },
  pantoprazole: {
    drugs: ['pantoprazole'],
    priority: ['pantoprazole'],
    icd10: ['K21.9'],
  },
  montelukast: {
    drugs: ['montelukast'],
    priority: ['montelukast'],
    icd10: ['J45.9'],
  },
  cefixime: {
    drugs: ['cefixime'],
    priority: ['cefixime'],
    icd10: ['N39.0'],
  },
};
