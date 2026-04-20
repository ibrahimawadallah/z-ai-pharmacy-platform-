import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ==================== COMPREHENSIVE MEDICAL DATASET ====================
// Diseases with ICD-10 codes, symptoms, and treatment recommendations

const DISEASES: any[] = [
  // ===== CARDIOVASCULAR DISEASES =====
  {
    name: 'Hypertension',
    icd10Code: 'I10',
    category: 'Cardiology',
    description: 'Chronic high blood pressure',
    symptoms: JSON.stringify(['Headache', 'Dizziness', 'Blurred vision', 'Chest pain', 'Shortness of breath']),
    riskFactors: JSON.stringify(['Family history', 'Obesity', 'Sedentary lifestyle', 'High salt intake', 'Smoking', 'Age > 60']),
    diagnosticCriteria: JSON.stringify('BP ≥ 140/90 mmHg on two separate occasions'),
    investigations: JSON.stringify(['Blood pressure monitoring', 'ECG', 'Echocardiogram', 'Renal function tests', 'Lipid profile', 'Urinalysis']),
    complications: JSON.stringify(['Stroke', 'Myocardial infarction', 'Heart failure', 'Chronic kidney disease', 'Retinopathy']),
    treatmentGuidelines: JSON.stringify({
      lifestyle: 'Weight reduction, DASH diet, sodium restriction, exercise, moderate alcohol',
      first_line: 'ACE inhibitors or ARBs, Calcium channel blockers, Thiazide diuretics',
      second_line: 'Beta blockers, Aldosterone antagonists',
      targets: 'BP < 140/90 mmHg (< 130/80 if diabetes or CKD)'
    })
  },
  {
    name: 'Type 2 Diabetes Mellitus',
    icd10Code: 'E11',
    category: 'Endocrinology',
    description: 'Chronic metabolic disorder characterized by insulin resistance',
    symptoms: JSON.stringify(['Polyuria', 'Polydipsia', 'Polyphagia', 'Fatigue', 'Blurred vision', 'Slow wound healing']),
    riskFactors: JSON.stringify(['Obesity', 'Sedentary lifestyle', 'Family history', 'Age > 45', 'Gestational diabetes', 'PCOS']),
    diagnosticCriteria: JSON.stringify('FPG ≥ 126 mg/dL, or HbA1c ≥ 6.5%, or random glucose ≥ 200 mg/dL with symptoms'),
    investigations: JSON.stringify(['Fasting blood glucose', 'HbA1c', 'Oral glucose tolerance test', 'Lipid profile', 'Renal function', 'Urinary albumin']),
    complications: JSON.stringify(['Diabetic nephropathy', 'Retinopathy', 'Neuropathy', 'Cardiovascular disease', 'Diabetic foot']),
    treatmentGuidelines: JSON.stringify({
      lifestyle: 'Diet modification, exercise (150 min/week), weight management',
      first_line: 'Metformin',
      second_line: 'Sulfonylureas, DPP-4 inhibitors, SGLT2 inhibitors, GLP-1 agonists',
      insulin: 'Consider if HbA1c > 10% or symptomatic hyperglycemia',
      targets: 'HbA1c < 7%, FPG 80-130 mg/dL, postprandial < 180 mg/dL'
    })
  },
  {
    name: 'Coronary Artery Disease',
    icd10Code: 'I25',
    category: 'Cardiology',
    description: 'Atherosclerotic narrowing of coronary arteries',
    symptoms: JSON.stringify(['Chest pain (angina)', 'Shortness of breath', 'Fatigue', 'Palpitations', 'Diaphoresis']),
    riskFactors: JSON.stringify(['Smoking', 'Hypertension', 'Hyperlipidemia', 'Diabetes', 'Family history', 'Obesity']),
    diagnosticCriteria: JSON.stringify('Clinical presentation + ECG changes + cardiac biomarkers'),
    investigations: JSON.stringify(['ECG', 'Echocardiogram', 'Stress test', 'Coronary angiography', 'Cardiac enzymes (troponin)', 'Lipid profile']),
    complications: JSON.stringify(['Myocardial infarction', 'Heart failure', 'Arrhythmias', 'Sudden cardiac death']),
    treatmentGuidelines: JSON.stringify({
      lifestyle: 'Smoking cessation, heart-healthy diet, exercise, stress management',
      acute: 'Aspirin, Nitroglycerin, Oxygen, Morphine if needed',
      chronic: 'Aspirin, Beta blockers, Statins, ACE inhibitors/ARBs',
      interventions: 'PCI with stenting or CABG for significant disease'
    })
  },
  {
    name: 'Heart Failure',
    icd10Code: 'I50',
    category: 'Cardiology',
    description: 'Inability of heart to pump sufficient blood',
    symptoms: JSON.stringify(['Dyspnea', 'Fatigue', 'Peripheral edema', 'Orthopnea', 'Paroxysmal nocturnal dyspnea', 'Reduced exercise tolerance']),
    riskFactors: JSON.stringify(['Coronary artery disease', 'Hypertension', 'Diabetes', 'Valvular disease', 'Cardiomyopathy']),
    diagnosticCriteria: JSON.stringify('Clinical signs/symptoms + echocardiogram showing reduced EF (< 40%)'),
    investigations: JSON.stringify(['Echocardiogram', 'BNP/NT-proBNP', 'Chest X-ray', 'ECG', 'Renal function', 'Electrolytes']),
    complications: JSON.stringify(['Renal failure', 'Liver damage', 'Pulmonary hypertension', 'Arrhythmias', 'Sudden death']),
    treatmentGuidelines: JSON.stringify({
      lifestyle: 'Sodium restriction (< 2g/day), fluid restriction if severe, daily weights',
      first_line: 'ACE inhibitors/ARBs, Beta blockers, Spironolactone, Loop diuretics',
      second_line: 'Hydralazine + nitrates, Ivabradine, Sacubitril/valsartan',
      devices: 'ICD or CRT for selected patients'
    })
  },
  {
    name: 'Atrial Fibrillation',
    icd10Code: 'I48',
    category: 'Cardiology',
    description: 'Irregular, often rapid heart rhythm',
    symptoms: JSON.stringify(['Palpitations', 'Fatigue', 'Dizziness', 'Shortness of breath', 'Chest discomfort', 'Reduced exercise capacity']),
    riskFactors: JSON.stringify(['Age > 60', 'Hypertension', 'Heart disease', 'Hyperthyroidism', 'Obesity', 'Alcohol use']),
    diagnosticCriteria: JSON.stringify('ECG showing irregularly irregular rhythm with absent P waves'),
    investigations: JSON.stringify(['ECG', 'Holter monitor', 'Echocardiogram', 'Thyroid function', 'Electrolytes', 'Renal function']),
    complications: JSON.stringify(['Stroke', 'Heart failure', 'Dementia', 'Fatigue', 'Cardiac arrest']),
    treatmentGuidelines: JSON.stringify({
      rate_control: 'Beta blockers, Calcium channel blockers, Digoxin',
      rhythm_control: 'Amiodarone, Flecainide, Cardioversion, Ablation',
      anticoagulation: 'Warfarin (target INR 2-3) or DOACs (apixaban, rivaroxaban)',
      cha2ds2vasc: 'Score ≥ 2 in men or ≥ 3 in women: anticoagulate'
    })
  },

  // ===== RESPIRATORY DISEASES =====
  {
    name: 'Asthma',
    icd10Code: 'J45',
    category: 'Respiratory',
    description: 'Chronic inflammatory airway disease with reversible airflow obstruction',
    symptoms: JSON.stringify(['Wheezing', 'Shortness of breath', 'Chest tightness', 'Cough (worse at night/early morning)']),
    riskFactors: JSON.stringify(['Atopy', 'Family history', 'Allergies', 'Obesity', 'Smoking exposure', 'Occupational exposures']),
    diagnosticCriteria: JSON.stringify('Variable airflow obstruction on spirometry (FEV1/FVC < 0.7, improvement > 12% post-bronchodilator)'),
    investigations: JSON.stringify(['Spirometry', 'Peak flow monitoring', 'Allergy testing', 'Chest X-ray', 'FeNO measurement']),
    complications: JSON.stringify(['Status asthmaticus', 'Respiratory failure', 'Airway remodeling', 'Sleep disturbance']),
    treatmentGuidelines: JSON.stringify({
      step1: 'SABA PRN (albuterol)',
      step2: 'Low-dose ICS (budesonide, fluticasone)',
      step3: 'Low-dose ICS + LABA (formoterol, salmeterol)',
      step4: 'Medium/high-dose ICS + LABA',
      step5: 'Add tiotropium, consider biologics (omalizumab, mepolizumab)',
      acute: 'SABA, systemic corticosteroids, oxygen, ipratropium'
    })
  },
  {
    name: 'Chronic Obstructive Pulmonary Disease',
    icd10Code: 'J44',
    category: 'Respiratory',
    description: 'Progressive airflow limitation, usually due to smoking',
    symptoms: JSON.stringify(['Chronic cough', 'Sputum production', 'Dyspnea (progressive)', 'Wheezing', 'Frequent respiratory infections']),
    riskFactors: JSON.stringify(['Smoking (primary)', 'Occupational dust/chemicals', 'Air pollution', 'Alpha-1 antitrypsin deficiency']),
    diagnosticCriteria: JSON.stringify('Post-bronchodilator FEV1/FVC < 0.70'),
    investigations: JSON.stringify(['Spirometry', 'Chest X-ray', 'CT scan', 'Arterial blood gas', 'Alpha-1 antitrypsin level']),
    complications: JSON.stringify(['Respiratory failure', 'Cor pulmonale', 'Pneumonia', 'Pneumothorax', 'Lung cancer']),
    treatmentGuidelines: JSON.stringify({
      lifestyle: 'Smoking cessation (most important), pulmonary rehab, vaccination',
      stable: 'LAMA (tiotropium), LABA (salmeterol), ICS/LABA combination',
      acute_exacerbation: 'SABA, systemic corticosteroids, antibiotics if infected',
      oxygen: 'Long-term oxygen therapy if PaO2 < 55 mmHg or SaO2 < 88%'
    })
  },
  {
    name: 'Pneumonia',
    icd10Code: 'J18',
    category: 'Respiratory',
    description: 'Infection of the lungs',
    symptoms: JSON.stringify(['Fever', 'Cough with sputum', 'Shortness of breath', 'Chest pain', 'Fatigue', 'Confusion (elderly)']),
    riskFactors: JSON.stringify(['Age > 65 or < 2', 'Smoking', 'Chronic lung disease', 'Immunosuppression', 'Recent viral infection']),
    diagnosticCriteria: JSON.stringify('Clinical symptoms + chest X-ray showing infiltrate'),
    investigations: JSON.stringify(['Chest X-ray', 'CBC', 'Blood cultures', 'Sputum culture', 'Procalcitonin', 'Oxygen saturation']),
    complications: JSON.stringify(['Sepsis', 'Pleural effusion', 'Lung abscess', 'Respiratory failure', 'ARDS']),
    treatmentGuidelines: JSON.stringify({
      outpatient: 'Amoxicillin or doxycycline or macrolide',
      inpatient: 'Respiratory fluoroquinolone OR beta-lactam + macrolide',
      icu: 'Beta-lactam + azithromycin OR beta-lactam + fluoroquinolone',
      supportive: 'Oxygen, fluids, antipyretics, respiratory support if needed'
    })
  },

  // ===== INFECTIOUS DISEASES =====
  {
    name: 'Urinary Tract Infection',
    icd10Code: 'N39',
    category: 'Infectious Disease',
    description: 'Bacterial infection of urinary tract',
    symptoms: JSON.stringify(['Dysuria', 'Frequency', 'Urgency', 'Suprapubic pain', 'Hematuria', 'Cloudy urine']),
    riskFactors: JSON.stringify(['Female sex', 'Sexual activity', 'Diabetes', 'Urinary obstruction', 'Catheter use', 'Pregnancy']),
    diagnosticCriteria: JSON.stringify('Symptoms + urinalysis (leukocyte esterase, nitrites) + urine culture'),
    investigations: JSON.stringify(['Urinalysis', 'Urine culture and sensitivity', 'CBC', 'Renal function', 'Ultrasound if recurrent']),
    complications: JSON.stringify(['Pyelonephritis', 'Sepsis', 'Renal abscess', 'Preterm labor (pregnancy)', 'Recurrent infections']),
    treatmentGuidelines: JSON.stringify({
      uncomplicated: 'Nitrofurantoin 5-7 days OR trimethoprim-sulfamethoxazole 3 days OR fosfomycin single dose',
      complicated: 'Fluoroquinolone 7-14 days',
      pyelonephritis: 'Fluoroquinolone or ceftriaxone, hospitalize if severe',
      pregnancy: 'Nitrofurantoin (avoid at term), amoxicillin, cephalexin'
    })
  },
  {
    name: 'Tuberculosis',
    icd10Code: 'A15',
    category: 'Infectious Disease',
    description: 'Mycobacterium tuberculosis infection',
    symptoms: JSON.stringify(['Chronic cough (> 3 weeks)', 'Hemoptysis', 'Fever', 'Night sweats', 'Weight loss', 'Fatigue']),
    riskFactors: JSON.stringify(['Close contact with TB patient', 'Immunosuppression (HIV)', 'Healthcare workers', 'Prisoners', 'Homeless']),
    diagnosticCriteria: JSON.stringify('Positive PPD or IGRA + chest X-ray + sputum AFB smear/culture'),
    investigations: JSON.stringify(['Chest X-ray', 'Sputum AFB smear', 'Sputum culture', 'GeneXpert MTB/RIF', 'PPD skin test', 'IGRA blood test']),
    complications: JSON.stringify(['Miliary TB', 'TB meningitis', 'Pleural effusion', 'Drug-resistant TB', 'Pulmonary fibrosis']),
    treatmentGuidelines: JSON.stringify({
      initial: 'RIPE therapy: Rifampin + Isoniazid + Pyrazinamide + Ethambutol for 2 months',
      continuation: 'Rifampin + Isoniazid for 4 months',
      latent: 'Isoniazid for 9 months OR Rifampin for 4 months',
      monitoring: 'Liver function tests, visual acuity (ethambutol), sputum monthly'
    })
  },

  // ===== NEUROLOGICAL DISEASES =====
  {
    name: 'Epilepsy',
    icd10Code: 'G40',
    category: 'Neurology',
    description: 'Chronic neurological disorder with recurrent seizures',
    symptoms: JSON.stringify(['Generalized tonic-clonic seizures', 'Absence seizures', 'Focal seizures', 'Myoclonic jerks', 'Post-ictal confusion']),
    riskFactors: JSON.stringify(['Family history', 'Brain injury', 'Stroke', 'Brain tumor', 'Infection (meningitis)', 'Genetic factors']),
    diagnosticCriteria: JSON.stringify('Two or more unprovoked seizures > 24 hours apart'),
    investigations: JSON.stringify(['EEG', 'Brain MRI', 'CT head', 'Blood glucose', 'Electrolytes', 'Drug levels']),
    complications: JSON.stringify(['Status epilepticus', 'SUDEP', 'Injury from seizures', 'Cognitive impairment', 'Depression']),
    treatmentGuidelines: JSON.stringify({
      first_line_generalized: 'Valproic acid, Levetiracetam, Lamotrigine',
      first_line_focal: 'Carbamazepine, Levetiracetam, Lamotrigine',
      second_line: 'Topiramate, Zonisamide, Phenobarbital',
      status_epilepticus: 'Lorazepam IV, then phenytoin/fosphenytoin',
      monitoring: 'Drug levels, liver function, CBC, bone density (long-term AEDs)'
    })
  },
  {
    name: 'Migraine',
    icd10Code: 'G43',
    category: 'Neurology',
    description: 'Recurrent primary headache disorder',
    symptoms: JSON.stringify(['Unilateral throbbing headache', 'Photophobia', 'Phonophobia', 'Nausea', 'Vomiting', 'Aura (visual disturbances)']),
    riskFactors: JSON.stringify(['Family history', 'Female sex', 'Hormonal changes', 'Stress', 'Certain foods', 'Sleep disturbance']),
    diagnosticCriteria: JSON.stringify('≥ 5 attacks lasting 4-72 hours, with nausea and/or photophobia/phonophobia'),
    investigations: JSON.stringify(['Clinical diagnosis', 'Neurological exam', 'Brain imaging if atypical features']),
    complications: JSON.stringify(['Chronic migraine', 'Status migrainosus', 'Medication overuse headache', 'Depression', 'Anxiety']),
    treatmentGuidelines: JSON.stringify({
      acute: 'NSAIDs, Triptans (sumatriptan), Antiemetics (metoclopramide)',
      prophylaxis_indications: '≥ 4 attacks/month, prolonged attacks, acute meds failing',
      prophylaxis_first: 'Propranolol, Amitriptyline, Topiramate, Valproic acid',
      prophylaxis_second: 'Candesartan, Venlafaxine, Flunarizine',
      lifestyle: 'Regular sleep, hydration, stress management, trigger avoidance'
    })
  },

  // ===== GASTROINTESTINAL DISEASES =====
  {
    name: 'Gastroesophageal Reflux Disease',
    icd10Code: 'K21',
    category: 'Gastroenterology',
    description: 'Chronic reflux of gastric contents into esophagus',
    symptoms: JSON.stringify(['Heartburn', 'Regurgitation', 'Dysphagia', 'Chest pain', 'Chronic cough', 'Hoarseness']),
    riskFactors: JSON.stringify(['Obesity', 'Hiatal hernia', 'Pregnancy', 'Smoking', 'Certain foods', 'Large meals']),
    diagnosticCriteria: JSON.stringify('Typical symptoms + response to PPI trial'),
    investigations: JSON.stringify(['Upper endoscopy', '24-hour pH monitoring', 'Esophageal manometry', 'Barium swallow']),
    complications: JSON.stringify(['Esophagitis', 'Barrett esophagus', 'Esophageal stricture', 'Esophageal adenocarcinoma']),
    treatmentGuidelines: JSON.stringify({
      lifestyle: 'Weight loss, elevate head of bed, avoid late meals, trigger avoidance',
      first_line: 'PPI (omeprazole, pantoprazole) for 8 weeks',
      maintenance: 'Lowest effective PPI dose, H2 blockers (famotidine) for mild cases',
      refractory: 'Double PPI dose, add H2 blocker at night, consider surgery (fundoplication)'
    })
  },
  {
    name: 'Peptic Ulcer Disease',
    icd10Code: 'K27',
    category: 'Gastroenterology',
    description: 'Ulceration in stomach or duodenum',
    symptoms: JSON.stringify(['Epigastric pain', 'Burning sensation', 'Nausea', 'Bloating', 'Early satiety', 'Melena (if bleeding)']),
    riskFactors: JSON.stringify(['H. pylori infection', 'NSAID use', 'Smoking', 'Alcohol', 'Stress', 'Corticosteroids']),
    diagnosticCriteria: JSON.stringify('Endoscopic visualization of ulcer'),
    investigations: JSON.stringify(['Upper endoscopy', 'H. pylori testing (urea breath test, stool antigen)', 'CBC', 'Fecal occult blood']),
    complications: JSON.stringify(['GI bleeding', 'Perforation', 'Gastric outlet obstruction', 'Penetration']),
    treatmentGuidelines: JSON.stringify({
      hpylori_positive: 'Triple therapy: PPI + clarithromycin + amoxicillin for 14 days',
      hpylori_negative: 'PPI for 8 weeks, discontinue NSAIDs',
      nsaids_induced: 'PPI, switch to COX-2 inhibitor if NSAID needed',
      bleeding: 'IV PPI, endoscopic therapy, surgery if refractory'
    })
  },

  // ===== MUSCULOSKELETAL DISEASES =====
  {
    name: 'Rheumatoid Arthritis',
    icd10Code: 'M06',
    category: 'Rheumatology',
    description: 'Chronic autoimmune inflammatory arthritis',
    symptoms: JSON.stringify(['Joint pain and swelling', 'Morning stiffness > 1 hour', 'Symmetric polyarthritis', 'Fatigue', 'Low-grade fever', 'Rheumatoid nodules']),
    riskFactors: JSON.stringify(['Female sex', 'Family history', 'Smoking', 'Age 30-60', 'Obesity']),
    diagnosticCriteria: JSON.stringify('≥ 6 points on ACR/EULAR criteria: joint involvement, serology, acute phase reactants, symptom duration'),
    investigations: JSON.stringify(['RF', 'Anti-CCP', 'ESR', 'CRP', 'X-rays of hands/feet', 'CBC', 'Liver function']),
    complications: JSON.stringify(['Joint destruction', 'Osteoporosis', 'Cardiovascular disease', 'Lung disease', 'Felty syndrome']),
    treatmentGuidelines: JSON.stringify({
      first_line: 'Methotrexate (anchor drug) +/- short course prednisone',
      biologics: 'TNF inhibitors (adalimumab, etanercept) if MTX inadequate',
      alternatives: 'Leflunomide, Sulfasalazine, Hydroxychloroquine',
      adjunct: 'NSAIDs for symptom relief, Calcium + Vitamin D, exercise'
    })
  },
  {
    name: 'Osteoarthritis',
    icd10Code: 'M15',
    category: 'Rheumatology',
    description: 'Degenerative joint disease',
    symptoms: JSON.stringify(['Joint pain (worse with activity)', 'Stiffness (< 30 min)', 'Reduced range of motion', 'Joint crepitus', 'Bony enlargement']),
    riskFactors: JSON.stringify(['Age', 'Obesity', 'Joint injury', 'Family history', 'Repetitive use', 'Female sex']),
    diagnosticCriteria: JSON.stringify('Clinical: age > 50, activity-related pain, morning stiffness < 30 min, radiographic changes'),
    investigations: JSON.stringify(['X-rays (joint space narrowing, osteophytes)', 'MRI if unclear', 'Joint aspiration if effusion']),
    complications: JSON.stringify(['Chronic pain', 'Disability', 'Reduced quality of life', 'Depression', 'Obesity (reduced activity)']),
    treatmentGuidelines: JSON.stringify({
      non_pharmacologic: 'Weight loss, exercise, physical therapy, assistive devices',
      first_line: 'Acetaminophen, topical NSAIDs',
      oral: 'Oral NSAIDs (ibuprofen, naproxen, celecoxib)',
      injections: 'Intra-articular corticosteroids, hyaluronic acid',
      severe: 'Joint replacement surgery'
    })
  },

  // ===== ENDOCRINE DISEASES =====
  {
    name: 'Hypothyroidism',
    icd10Code: 'E03',
    category: 'Endocrinology',
    description: 'Underactive thyroid gland',
    symptoms: JSON.stringify(['Fatigue', 'Weight gain', 'Cold intolerance', 'Constipation', 'Dry skin', 'Hair loss', 'Depression', 'Menorrhagia']),
    riskFactors: JSON.stringify(['Female sex', 'Age > 60', 'Autoimmune disease', 'Previous thyroid surgery', 'Radiation', 'Family history']),
    diagnosticCriteria: JSON.stringify('Elevated TSH + low free T4'),
    investigations: JSON.stringify(['TSH', 'Free T4', 'Anti-TPO antibodies', 'Lipid profile', 'CBC']),
    complications: JSON.stringify(['Myxedema coma', 'Cardiovascular disease', 'Infertility', 'Depression', 'Peripheral neuropathy']),
    treatmentGuidelines: JSON.stringify({
      first_line: 'Levothyroxine 1.6 mcg/kg/day',
      monitoring: 'TSH every 6-8 weeks until stable, then every 6-12 months',
      target: 'TSH 0.5-5.0 mIU/L',
      administration: 'Empty stomach, 30-60 min before breakfast, separate from iron/calcium by 4 hours'
    })
  },
  {
    name: 'Hyperthyroidism',
    icd10Code: 'E05',
    category: 'Endocrinology',
    description: 'Overactive thyroid gland',
    symptoms: JSON.stringify(['Weight loss', 'Palpitations', 'Heat intolerance', 'Tremor', 'Anxiety', 'Diarrhea', 'Insomnia', 'Goiter']),
    riskFactors: JSON.stringify(['Graves disease', 'Toxic nodular goiter', 'Family history', 'Female sex', 'Smoking']),
    diagnosticCriteria: JSON.stringify('Low TSH + elevated free T4 and/or T3'),
    investigations: JSON.stringify(['TSH', 'Free T4', 'Total T3', 'Thyroid antibodies (TRAb)', 'Thyroid uptake scan', 'Thyroid ultrasound']),
    complications: JSON.stringify(['Thyroid storm', 'Atrial fibrillation', 'Osteoporosis', 'Heart failure', 'Ophthalmopathy (Graves)']),
    treatmentGuidelines: JSON.stringify({
      symptomatic: 'Propranolol for tremor/palpitations',
      antithyroid: 'Methimazole (first line) or Propylthiouracil (first trimester pregnancy)',
      definitive: 'Radioactive iodine ablation or thyroidectomy',
      monitoring: 'TSH, free T4 every 4-6 weeks, watch for agranulocytosis (methimazole)'
    })
  },

  // ===== PSYCHIATRIC DISEASES =====
  {
    name: 'Major Depressive Disorder',
    icd10Code: 'F32',
    category: 'Psychiatry',
    description: 'Persistent low mood and loss of interest',
    symptoms: JSON.stringify(['Depressed mood', 'Anhedonia', 'Sleep disturbance', 'Fatigue', 'Appetite changes', 'Guilt/worthlessness', 'Poor concentration', 'Suicidal thoughts']),
    riskFactors: JSON.stringify(['Family history', 'Trauma', 'Chronic illness', 'Substance abuse', 'Female sex', 'Social isolation']),
    diagnosticCriteria: JSON.stringify('≥ 5 symptoms for ≥ 2 weeks, causing functional impairment'),
    investigations: JSON.stringify(['Clinical interview', 'PHQ-9 screening', 'Rule out medical causes (TSH, CBC, metabolic panel)']),
    complications: JSON.stringify(['Suicide', 'Substance abuse', 'Social/occupational dysfunction', 'Chronic pain', 'Cardiovascular disease']),
    treatmentGuidelines: JSON.stringify({
      first_line: 'SSRIs (sertraline, escitalopram, fluoxetine)',
      alternatives: 'SNRIs (venlafaxine, duloxetine), Bupropion, Mirtazapine',
      psychotherapy: 'CBT, IPT (alone or with medication)',
      severe: 'Combination SSRI + psychotherapy, consider ECT if refractory',
      monitoring: 'Suicide risk, side effects, response at 4-6 weeks'
    })
  },
  {
    name: 'Generalized Anxiety Disorder',
    icd10Code: 'F41',
    category: 'Psychiatry',
    description: 'Excessive, uncontrollable worry',
    symptoms: JSON.stringify(['Excessive worry', 'Restlessness', 'Fatigue', 'Difficulty concentrating', 'Irritability', 'Muscle tension', 'Sleep disturbance']),
    riskFactors: JSON.stringify(['Family history', 'Trauma', 'Stressful life events', 'Female sex', 'Other mental health disorders']),
    diagnosticCriteria: JSON.stringify('Excessive worry more days than not for ≥ 6 months + ≥ 3 symptoms'),
    investigations: JSON.stringify(['Clinical interview', 'GAD-7 screening', 'Rule out medical causes (thyroid, cardiac)']),
    complications: JSON.stringify(['Depression', 'Substance abuse', 'Insomnia', 'GI problems', 'Social/occupational dysfunction']),
    treatmentGuidelines: JSON.stringify({
      first_line: 'SSRIs (escitalopram, sertraline) or SNRIs (venlafaxine)',
      short_term: 'Benzodiazepines (lorazepam) for acute anxiety - limit to 2-4 weeks',
      psychotherapy: 'CBT (first-line, alone or with medication)',
      alternatives: 'Buspirone, Pregabalin, Hydroxyzine'
    })
  },

  // ===== DERMATOLOGICAL DISEASES =====
  {
    name: 'Eczema (Atopic Dermatitis)',
    icd10Code: 'L20',
    category: 'Dermatology',
    description: 'Chronic inflammatory skin condition',
    symptoms: JSON.stringify(['Pruritus (hallmark)', 'Erythematous patches', 'Lichenification', 'Dry skin', 'Excoriations', 'Sleep disturbance']),
    riskFactors: JSON.stringify(['Family history of atopy', 'Asthma', 'Allergic rhinitis', 'Food allergies', 'Filaggrin mutation']),
    diagnosticCriteria: JSON.stringify('Pruritus + chronic/relapsing dermatitis + typical morphology/distribution'),
    investigations: JSON.stringify(['Clinical diagnosis', 'Patch testing if contact dermatitis suspected', 'Skin biopsy if unclear']),
    complications: JSON.stringify(['Skin infections (S. aureus)', 'Eczema herpeticum', 'Sleep deprivation', 'Psychological distress']),
    treatmentGuidelines: JSON.stringify({
      baseline: 'Emollients (liberal, frequent application)',
      flares: 'Topical corticosteroids (potency based on severity and site)',
      second_line: 'Topical calcineurin inhibitors (tacrolimus, pimecrolimus)',
      severe: 'Phototherapy, Systemic (cyclosporine, methotrexate), Biologics (dupilumab)'
    })
  },
  {
    name: 'Psoriasis',
    icd10Code: 'L40',
    category: 'Dermatology',
    description: 'Chronic immune-mediated skin disease',
    symptoms: JSON.stringify(['Well-demarcated erythematous plaques', 'Silvery scales', 'Itching', 'Joint pain (psoriatic arthritis)', 'Nail changes']),
    riskFactors: JSON.stringify(['Family history', 'Stress', 'Infection (strep throat)', 'Obesity', 'Smoking', 'Certain medications']),
    diagnosticCriteria: JSON.stringify('Clinical: erythematous plaques with silvery scales, Auspitz sign'),
    investigations: JSON.stringify(['Clinical diagnosis', 'Skin biopsy if uncertain', 'Joint exam for psoriatic arthritis', 'Metabolic screening']),
    complications: JSON.stringify(['Psoriatic arthritis', 'Cardiovascular disease', 'Metabolic syndrome', 'Depression', 'Increased infection risk']),
    treatmentGuidelines: JSON.stringify({
      mild: 'Topical corticosteroids, Vitamin D analogs (calcipotriene), Emollients',
      moderate: 'Phototherapy (narrowband UVB)',
      severe: 'Methotrexate, Cyclosporine, Biologics (TNF inhibitors, IL-17/23 inhibitors)',
      monitoring: 'Liver function (methotrexate), renal function (cyclosporine), infection screening (biologics)'
    })
  },

  // ===== HEMATOLOGICAL DISEASES =====
  {
    name: 'Iron Deficiency Anemia',
    icd10Code: 'D50',
    category: 'Hematology',
    description: 'Anemia due to insufficient iron',
    symptoms: JSON.stringify(['Fatigue', 'Weakness', 'Pallor', 'Shortness of breath', 'Dizziness', 'Pica', 'Restless legs']),
    riskFactors: JSON.stringify(['Menorrhagia', 'Pregnancy', 'GI blood loss', 'Poor diet', 'Malabsorption', 'Frequent blood donation']),
    diagnosticCriteria: JSON.stringify('Low Hb + low ferritin (< 30 ng/mL) + low transferrin saturation'),
    investigations: JSON.stringify(['CBC', 'Ferritin', 'Iron studies', 'Peripheral smear', 'Fecal occult blood', 'Endoscopy/colonoscopy if GI loss suspected']),
    complications: JSON.stringify(['Heart failure', 'Delayed development (children)', 'Preterm labor (pregnancy)', 'Increased infection risk']),
    treatmentGuidelines: JSON.stringify({
      first_line: 'Oral iron (ferrous sulfate 325 mg TID) with vitamin C',
      duration: 'Continue for 3-6 months after Hb normalizes to replenish stores',
      intolerance: 'Switch to different salt, reduce dose, or IV iron',
      severe: 'IV iron (ferric carboxymaltose) or blood transfusion if Hb < 7',
      underlying: 'Investigate and treat cause of iron loss'
    })
  },

  // ===== RENAL DISEASES =====
  {
    name: 'Chronic Kidney Disease',
    icd10Code: 'N18',
    category: 'Nephrology',
    description: 'Progressive loss of kidney function',
    symptoms: JSON.stringify(['Fatigue', 'Edema', 'Nausea', 'Decreased appetite', 'Pruritus', 'Nocturia', 'Confusion (advanced)']),
    riskFactors: JSON.stringify(['Diabetes', 'Hypertension', 'Age > 60', 'Family history', 'Cardiovascular disease', 'Obesity']),
    diagnosticCriteria: JSON.stringify('eGFR < 60 mL/min/1.73m² for > 3 months OR markers of kidney damage'),
    investigations: JSON.stringify(['Serum creatinine/eGFR', 'Urinalysis', 'Urine albumin-to-creatinine ratio', 'Renal ultrasound', 'Electrolytes', 'PTH']),
    complications: JSON.stringify(['End-stage renal disease', 'Cardiovascular disease', 'Anemia', 'Bone disease', 'Electrolyte abnormalities']),
    treatmentGuidelines: JSON.stringify({
      stage1_2: 'Treat underlying cause, ACE inhibitor/ARB if proteinuria',
      stage3: 'Monitor eGFR, manage complications, nephrology referral',
      stage4_5: 'Prepare for dialysis/transplant, manage all complications',
      all_stages: 'BP control (< 130/80), glycemic control, avoid nephrotoxins, dose-adjust all medications'
    })
  },
]

// ==================== SEED FUNCTION ====================

async function seedMedicalDataset() {
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║     SEED MEDICAL DATASET - DISEASES & TREATMENTS        ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  let diseaseCount = 0
  let treatmentCount = 0

  for (const diseaseData of DISEASES) {
    try {
      // Check if disease already exists
      const existing = await prisma.disease.findFirst({
        where: { OR: [{ name: diseaseData.name }, { icd10Code: diseaseData.icd10Code }] }
      })

      if (existing) {
        console.log(`⏭️  Skipping ${diseaseData.name} (already exists)`)
        continue
      }

      // Create disease
      const disease = await prisma.disease.create({
        data: {
          name: diseaseData.name,
          icd10Code: diseaseData.icd10Code,
          category: diseaseData.category,
          description: diseaseData.description,
          symptoms: diseaseData.symptoms,
          riskFactors: diseaseData.riskFactors,
          diagnosticCriteria: diseaseData.diagnosticCriteria,
          investigations: diseaseData.investigations,
          complications: diseaseData.complications,
          treatmentGuidelines: diseaseData.treatmentGuidelines,
        }
      })

      diseaseCount++
      console.log(`✅ Created disease: ${disease.name} (${disease.icd10Code})`)

      // Create disease-treatment mappings based on treatment guidelines
      const treatments = getTreatmentsForDisease(disease.name, disease.icd10Code)

      for (const treatment of treatments) {
        try {
          // Find the drug
          const drug = await prisma.drug.findFirst({
            where: {
              OR: [
                { genericName: { contains: treatment.drugName, mode: 'insensitive' } },
                { packageName: { contains: treatment.drugName, mode: 'insensitive' } }
              ]
            }
          })

          if (!drug) {
            console.log(`   ⚠️  Drug not found: ${treatment.drugName}`)
            continue
          }

          await prisma.diseaseTreatment.create({
            data: {
              diseaseId: disease.id,
              drugId: drug.id,
              lineOfTherapy: treatment.lineOfTherapy,
              indication: treatment.indication,
              dose: treatment.dose,
              notes: treatment.notes,
            }
          })

          treatmentCount++
        } catch (e: any) {
          console.log(`   ❌ Error creating treatment for ${treatment.drugName}: ${e.message}`)
        }
      }
    } catch (e: any) {
      console.log(`❌ Error creating ${diseaseData.name}: ${e.message}`)
    }
  }

  console.log(`\n╔═══════════════════════════════════════════════════════════╗`)
  console.log(`║               SEEDING COMPLETE                           ║`)
  console.log(`╚═══════════════════════════════════════════════════════════╝\n`)
  console.log(`Diseases created: ${diseaseCount}`)
  console.log(`Treatments mapped: ${treatmentCount}`)

  return { diseaseCount, treatmentCount }
}

// ==================== TREATMENT MAPPING HELPER ====================

function getTreatmentsForDisease(diseaseName: string, icd10Code: string): any[] {
  const treatments: any[] = []

  switch (diseaseName) {
    case 'Hypertension':
      treatments.push(
        { drugName: 'lisinopril', lineOfTherapy: 'first_line', indication: 'ACE inhibitor - first-line antihypertensive', dose: '10-40 mg daily', notes: 'Monitor potassium and renal function' },
        { drugName: 'amlodipine', lineOfTherapy: 'first_line', indication: 'Calcium channel blocker', dose: '5-10 mg daily', notes: 'Watch for peripheral edema' },
        { drugName: 'losartan', lineOfTherapy: 'first_line', indication: 'ARB - alternative to ACE inhibitor', dose: '50-100 mg daily', notes: 'Use if ACE inhibitor not tolerated (cough)' },
        { drugName: 'hydrochlorothiazide', lineOfTherapy: 'first_line', indication: 'Thiazide diuretic', dose: '12.5-25 mg daily', notes: 'Monitor electrolytes' },
        { drugName: 'metoprolol', lineOfTherapy: 'second_line', indication: 'Beta blocker', dose: '50-200 mg daily', notes: 'Second-line, especially if CAD or heart failure' }
      )
      break

    case 'Type 2 Diabetes Mellitus':
      treatments.push(
        { drugName: 'metformin', lineOfTherapy: 'first_line', indication: 'First-line oral antidiabetic', dose: '500-2000 mg daily', notes: 'Contraindicated if eGFR < 30' },
        { drugName: 'glimepiride', lineOfTherapy: 'second_line', indication: 'Sulfonylurea - add-on therapy', dose: '1-4 mg daily', notes: 'Risk of hypoglycemia' },
        { drugName: 'empagliflozin', lineOfTherapy: 'second_line', indication: 'SGLT2 inhibitor - cardio-renal benefits', dose: '10-25 mg daily', notes: 'Monitor for genital infections' },
        { drugName: 'sitagliptin', lineOfTherapy: 'second_line', indication: 'DPP-4 inhibitor', dose: '100 mg daily', notes: 'Well tolerated, weight neutral' },
        { drugName: 'insulin', lineOfTherapy: 'alternative', indication: 'Insulin therapy', dose: 'Variable, titrate to glucose', notes: 'Consider if HbA1c > 10% or oral agents failing' }
      )
      break

    case 'Asthma':
      treatments.push(
        { drugName: 'salbutamol', lineOfTherapy: 'first_line', indication: 'SABA - rescue inhaler', dose: '2 puffs PRN', notes: 'For acute symptom relief' },
        { drugName: 'budesonide', lineOfTherapy: 'first_line', indication: 'ICS - controller medication', dose: '200-800 mcg daily', notes: 'First-line maintenance therapy' },
        { drugName: 'fluticasone', lineOfTherapy: 'first_line', indication: 'ICS - alternative controller', dose: '100-500 mcg daily', notes: 'Alternative to budesonide' },
        { drugName: 'formoterol', lineOfTherapy: 'second_line', indication: 'LABA - add to ICS', dose: '12-24 mcg twice daily', notes: 'Never use as monotherapy' },
        { drugName: 'montelukast', lineOfTherapy: 'alternative', indication: 'Leukotriene receptor antagonist', dose: '10 mg daily', notes: 'Alternative or add-on therapy' }
      )
      break

    case 'Urinary Tract Infection':
      treatments.push(
        { drugName: 'nitrofurantoin', lineOfTherapy: 'first_line', indication: 'Uncomplicated UTI', dose: '100 mg twice daily for 5-7 days', notes: 'Avoid if eGFR < 30' },
        { drugName: 'amoxicillin', lineOfTherapy: 'first_line', indication: 'UTI in pregnancy', dose: '500 mg three times daily', notes: 'Safe in pregnancy' },
        { drugName: 'ciprofloxacin', lineOfTherapy: 'second_line', indication: 'Complicated UTI', dose: '500 mg twice daily for 7-14 days', notes: 'Avoid in pregnancy' },
        { drugName: 'cotrimoxazole', lineOfTherapy: 'first_line', indication: 'Uncomplicated UTI', dose: '160/800 mg twice daily for 3 days', notes: 'Check local resistance patterns' }
      )
      break

    case 'Gastroesophageal Reflux Disease':
      treatments.push(
        { drugName: 'omeprazole', lineOfTherapy: 'first_line', indication: 'PPI - acid suppression', dose: '20-40 mg daily', notes: 'First-line for 8 weeks' },
        { drugName: 'pantoprazole', lineOfTherapy: 'first_line', indication: 'PPI - alternative', dose: '40 mg daily', notes: 'Alternative to omeprazole' },
        { drugName: 'ranitidine', lineOfTherapy: 'alternative', indication: 'H2 blocker', dose: '150 mg twice daily', notes: 'For mild symptoms or maintenance' }
      )
      break

    case 'Major Depressive Disorder':
      treatments.push(
        { drugName: 'sertraline', lineOfTherapy: 'first_line', indication: 'SSRI - first-line antidepressant', dose: '50-200 mg daily', notes: 'Well tolerated, minimal drug interactions' },
        { drugName: 'escitalopram', lineOfTherapy: 'first_line', indication: 'SSRI - alternative', dose: '10-20 mg daily', notes: 'Selective, fewer side effects' },
        { drugName: 'fluoxetine', lineOfTherapy: 'first_line', indication: 'SSRI - long half-life', dose: '20-60 mg daily', notes: 'Long half-life, good for non-adherence' },
        { drugName: 'venlafaxine', lineOfTherapy: 'second_line', indication: 'SNRI', dose: '75-225 mg daily', notes: 'Monitor blood pressure' },
        { drugName: 'amitriptyline', lineOfTherapy: 'alternative', indication: 'TCA', dose: '25-150 mg at bedtime', notes: 'More side effects, useful if pain comorbidity' }
      )
      break

    case 'Hypothyroidism':
      treatments.push(
        { drugName: 'levothyroxine', lineOfTherapy: 'first_line', indication: 'Thyroid hormone replacement', dose: '1.6 mcg/kg/day', notes: 'Take on empty stomach, monitor TSH' }
      )
      break

    case 'Hyperthyroidism':
      treatments.push(
        { drugName: 'methimazole', lineOfTherapy: 'first_line', indication: 'Antithyroid medication', dose: '10-30 mg daily', notes: 'Monitor for agranulocytosis' },
        { drugName: 'propranolol', lineOfTherapy: 'adjunct', indication: 'Symptom control', dose: '20-40 mg three times daily', notes: 'Controls tremor, palpitations' }
      )
      break

    case 'Rheumatoid Arthritis':
      treatments.push(
        { drugName: 'methotrexate', lineOfTherapy: 'first_line', indication: 'DMARD - anchor drug', dose: '7.5-25 mg weekly', notes: 'Monitor liver function, give folic acid' },
        { drugName: 'prednisone', lineOfTherapy: 'adjunct', indication: 'Short-term bridge therapy', dose: '5-10 mg daily', notes: 'Use lowest dose, shortest duration' },
        { drugName: 'hydroxychloroquine', lineOfTherapy: 'alternative', indication: 'DMARD for mild disease', dose: '200-400 mg daily', notes: 'Monitor retinal function' }
      )
      break

    case 'Osteoarthritis':
      treatments.push(
        { drugName: 'paracetamol', lineOfTherapy: 'first_line', indication: 'Analgesic', dose: '500-1000 mg every 6 hours', notes: 'First-line, safer than NSAIDs' },
        { drugName: 'ibuprofen', lineOfTherapy: 'first_line', indication: 'NSAID', dose: '400-800 mg three times daily', notes: 'Monitor renal function and GI risk' },
        { drugName: 'diclofenac', lineOfTherapy: 'first_line', indication: 'NSAID - alternative', dose: '50 mg three times daily', notes: 'Higher CV risk than other NSAIDs' }
      )
      break

    case 'Epilepsy':
      treatments.push(
        { drugName: 'levetiracetam', lineOfTherapy: 'first_line', indication: 'Antiepileptic', dose: '500-1500 mg twice daily', notes: 'Well tolerated, minimal interactions' },
        { drugName: 'carbamazepine', lineOfTherapy: 'first_line', indication: 'Antiepileptic for focal seizures', dose: '200-800 mg twice daily', notes: 'Monitor levels, many drug interactions' },
        { drugName: 'valproic acid', lineOfTherapy: 'first_line', indication: 'Antiepileptic for generalized seizures', dose: '500-2000 mg daily', notes: 'Contraindicated in pregnancy' },
        { drugName: 'lamotrigine', lineOfTherapy: 'first_line', indication: 'Antiepileptic', dose: '100-400 mg daily', notes: 'Titrate slowly, watch for rash' }
      )
      break

    case 'Migraine':
      treatments.push(
        { drugName: 'sumatriptan', lineOfTherapy: 'first_line', indication: 'Acute migraine treatment', dose: '50-100 mg at onset', notes: 'Take at onset of headache' },
        { drugName: 'ibuprofen', lineOfTherapy: 'first_line', indication: 'NSAID for mild migraine', dose: '400-800 mg at onset', notes: 'For mild to moderate attacks' },
        { drugName: 'propranolol', lineOfTherapy: 'first_line', indication: 'Migraine prophylaxis', dose: '80-160 mg daily', notes: 'If ≥ 4 attacks/month' },
        { drugName: 'topiramate', lineOfTherapy: 'first_line', indication: 'Migraine prophylaxis', dose: '50-100 mg daily', notes: 'Alternative prophylaxis' },
        { drugName: 'amitriptyline', lineOfTherapy: 'alternative', indication: 'Migraine prophylaxis', dose: '10-75 mg at bedtime', notes: 'If comorbid tension headache or insomnia' }
      )
      break
  }

  return treatments
}

// ==================== MAIN ====================

async function main() {
  try {
    const result = await seedMedicalDataset()

    // Verify
    const diseaseTotal = await prisma.disease.count()
    const treatmentTotal = await prisma.diseaseTreatment.count()

    console.log(`\n📊 DATABASE STATUS:`)
    console.log(`   Diseases: ${diseaseTotal}`)
    console.log(`   Disease-Treatment mappings: ${treatmentTotal}`)

  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
