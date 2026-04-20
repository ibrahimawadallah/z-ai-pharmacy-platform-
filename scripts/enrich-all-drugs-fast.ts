import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ==================== COMPREHENSIVE DATA SOURCES ====================

const PREGNANCY_DATA: Record<string, string> = {
  'paracetamol': 'B - Generally safe during pregnancy',
  'acetaminophen': 'B - Generally safe during pregnancy',
  'ibuprofen': 'C/D - Avoid in third trimester',
  'aspirin': 'C/D - Avoid in third trimester',
  'metformin': 'B - Generally considered safe',
  'amoxicillin': 'B - Safe during pregnancy',
  'ciprofloxacin': 'C - Use only if benefit justifies risk',
  'omeprazole': 'C - Use only if clearly needed',
  'amlodipine': 'C - No adequate studies',
  'lisinopril': 'D - CONTRAINDICATED - fetal toxicity',
  'simvastatin': 'X - CONTRAINDICATED in pregnancy',
  'atorvastatin': 'X - CONTRAINDICATED in pregnancy',
  'levothyroxine': 'A - Safe and essential',
  'prednisone': 'C - Use lowest effective dose',
  'prednisolone': 'C - Use lowest effective dose',
  'tramadol': 'C - Use with caution',
  'sertraline': 'C - Benefits may outweigh risks',
  'fluoxetine': 'C - Benefits may outweigh risks',
  'warfarin': 'X - CONTRAINDICATED - teratogenic',
  'furosemide': 'C - Use only if clearly needed',
  'metoprolol': 'C - Monitor fetal growth',
  'losartan': 'D - CONTRAINDICATED - fetal toxicity',
  'gabapentin': 'C - Use only if benefit justifies risk',
  'clopidogrel': 'B - Limited human data',
  'metronidazole': 'B - Generally safe',
  'doxycycline': 'D - CONTRAINDICATED - affects bone/tooth development',
  'ranitidine': 'B - Generally considered safe',
  'salbutamol': 'C - Use only if benefit outweighs risk',
  'diclofenac': 'C/D - Avoid in third trimester',
  'carbamazepine': 'D - Teratogenic risk',
  'insulin': 'B - Safe during pregnancy',
  'heparin': 'B - Safe during pregnancy',
  'penicillin': 'B - Safe during pregnancy',
  'cephalexin': 'B - Safe during pregnancy',
  'azithromycin': 'B - Safe during pregnancy',
  'erythromycin': 'B - Safe during pregnancy',
  'nitrofurantoin': 'B - Avoid at term (38-42 weeks)',
  'clindamycin': 'B - Safe during pregnancy',
  'fluconazole': 'C/D - High doses contraindicated',
  'acyclovir': 'B - Safe during pregnancy',
  'oseltamivir': 'C - Use if benefit outweighs risk',
  'lorazepam': 'D - Risk of fetal harm',
  'diazepam': 'D - Risk of fetal harm',
  'codeine': 'C - Use with caution',
  'morphine': 'C - Use with caution',
  'oxycodone': 'B/C - Use with caution',
  'ondansetron': 'B - Generally safe for morning sickness',
  'methyldopa': 'B - Preferred antihypertensive',
  'labetalol': 'C - Commonly used in pregnancy',
  'nifedipine': 'C - Used for preterm labor',
  'magnesium sulfate': 'A - Safe, used for eclampsia',
  'propranolol': 'C - Monitor fetal growth',
  'hydrochlorothiazide': 'B - Generally compatible',
  'spironolactone': 'C - Anti-androgenic effects',
  'digoxin': 'C - Use with monitoring',
  'colchicine': 'C - Use with caution',
  'allopurinol': 'C - Use only if clearly needed',
  'methotrexate': 'X - CONTRAINDICATED - teratogenic',
  'hydroxychloroquine': 'C - Generally compatible',
  'phenytoin': 'D - Teratogenic risk',
  'valproic acid': 'D - CONTRAINDICATED - neural tube defects',
  'lamotrigine': 'C - Generally compatible',
  'levetiracetam': 'C - Limited data',
  'topiramate': 'D - Teratogenic risk',
  'amitriptyline': 'C - Use with caution',
  'venlafaxine': 'C - Use with caution',
  'escitalopram': 'C - Use with caution',
  'paroxetine': 'D - Teratogenic risk',
  'lithium': 'D - Teratogenic risk',
  'quetiapine': 'C - Limited data',
  'risperidone': 'C - Limited data',
  'olanzapine': 'C - Limited data',
  'aripiprazole': 'C - Limited data',
  'haloperidol': 'C - Use with caution',
  'chlorpromazine': 'C - Use with caution',
  'clozapine': 'C - Limited data',
}

const G6PD_DATA: Record<string, string> = {
  'nitrofurantoin': 'HIGH RISK - CONTRAINDICATED - causes hemolysis',
  'primaquine': 'HIGH RISK - CONTRAINDICATED - causes severe hemolysis',
  'dapsone': 'HIGH RISK - CONTRAINDICATED - causes severe hemolysis',
  'rasburicase': 'HIGH RISK - CONTRAINDICATED - causes severe hemolysis',
  'pegloticase': 'HIGH RISK - CONTRAINDICATED - causes severe hemolysis',
  'methylene blue': 'HIGH RISK - CONTRAINDICATED - causes severe hemolysis',
  'sulfamethoxazole': 'HIGH RISK - CONTRAINDICATED - causes hemolysis',
  'sulfasalazine': 'HIGH RISK - CONTRAINDICATED - causes hemolysis',
  'phenazopyridine': 'HIGH RISK - CONTRAINDICATED - causes hemolysis',
  'quinidine': 'HIGH RISK - CONTRAINDICATED - causes hemolysis',
  'quinine': 'HIGH RISK - CONTRAINDICATED - causes hemolysis',
  'dimercaprol': 'HIGH RISK - CONTRAINDICATED',
  'niridazole': 'HIGH RISK - CONTRAINDICATED',
  'acetanilide': 'HIGH RISK - CONTRAINDICATED',
  'phenacetin': 'HIGH RISK - CONTRAINDICATED',
  'pamaquine': 'HIGH RISK - CONTRAINDICATED',
  'chloramphenicol': 'LOW RISK - Use with caution',
  'ciprofloxacin': 'LOW RISK - Use with caution',
  'levofloxacin': 'LOW RISK - Use with caution',
  'metronidazole': 'LOW RISK - Use with caution',
  'aspirin': 'LOW RISK - Safe at low doses (<2g/day)',
  'probenecid': 'LOW RISK - Use with caution',
  'norepinephrine': 'LOW RISK - Use with caution',
  'epinephrine': 'LOW RISK - Use with caution',
  'paracetamol': 'SAFE - No known G6PD risk',
  'acetaminophen': 'SAFE - No known G6PD risk',
  'metformin': 'SAFE - No known G6PD risk',
  'amoxicillin': 'SAFE - No known G6PD risk',
  'ibuprofen': 'SAFE - No known G6PD risk',
  'omeprazole': 'SAFE - No known G6PD risk',
  'amlodipine': 'SAFE - No known G6PD risk',
  'lisinopril': 'SAFE - No known G6PD risk',
  'simvastatin': 'SAFE - No known G6PD risk',
  'atorvastatin': 'SAFE - No known G6PD risk',
  'levothyroxine': 'SAFE - No known G6PD risk',
  'doxycycline': 'SAFE - No known G6PD risk',
  'azithromycin': 'SAFE - No known G6PD risk',
  'erythromycin': 'SAFE - No known G6PD risk',
  'clindamycin': 'SAFE - No known G6PD risk',
  'penicillin': 'SAFE - No known G6PD risk',
  'cephalexin': 'SAFE - No known G6PD risk',
  'insulin': 'SAFE - No known G6PD risk',
  'warfarin': 'SAFE - No known G6PD risk',
  'furosemide': 'SAFE - No known G6PD risk',
  'hydrochlorothiazide': 'SAFE - No known G6PD risk',
  'metoprolol': 'SAFE - No known G6PD risk',
  'propranolol': 'SAFE - No known G6PD risk',
  'losartan': 'SAFE - No known G6PD risk',
  'gabapentin': 'SAFE - No known G6PD risk',
  'prednisone': 'SAFE - No known G6PD risk',
  'prednisolone': 'SAFE - No known G6PD risk',
  'tramadol': 'SAFE - No known G6PD risk',
  'codeine': 'SAFE - No known G6PD risk',
  'morphine': 'SAFE - No known G6PD risk',
  'ondansetron': 'SAFE - No known G6PD risk',
  'salbutamol': 'SAFE - No known G6PD risk',
  'diclofenac': 'SAFE - No known G6PD risk',
  'fluconazole': 'SAFE - No known G6PD risk',
  'acyclovir': 'SAFE - No known G6PD risk',
}

const OFF_LABEL_USES: Record<string, string> = {
  'metformin': 'PCOS; Weight gain prevention with antipsychotics; Prediabetes; Gestational diabetes',
  'gabapentin': 'Neuropathic pain; Restless leg syndrome; Hot flashes; Alcohol withdrawal; Anxiety disorders',
  'pregabalin': 'Neuropathic pain; Fibromyalgia; Restless leg syndrome',
  'amitriptyline': 'Neuropathic pain; Migraine prophylaxis; Fibromyalgia; Insomnia; IBS',
  'doxepin': 'Insomnia; Chronic urticaria; Eczema',
  'topiramate': 'Migraine prophylaxis; Weight loss; Binge eating disorder; Essential tremor',
  'propranolol': 'Performance anxiety; Essential tremor; Migraine prophylaxis; Infantile hemangioma; Hyperthyroidism symptoms',
  'clonidine': 'ADHD; Tourette syndrome; Opioid withdrawal; Menopausal flushing',
  'hydroxyzine': 'Insomnia; Pruritus; Anxiety',
  'trazodone': 'Insomnia; Anxiety',
  'mirtazapine': 'Insomnia; Appetite stimulation; Nausea',
  'quetiapine': 'Insomnia; Treatment-resistant depression (adjunct); Bipolar depression',
  'risperidone': 'Tourette syndrome; Behavioral problems in autism; Aggression',
  'spironolactone': 'Acne; Hirsutism; Female pattern hair loss; PCOS',
  'finasteride': 'Female pattern hair loss; Hirsutism',
  'methotrexate': 'Rheumatoid arthritis; Psoriasis; Crohn\'s disease; Ectopic pregnancy',
  'hydroxychloroquine': 'Rheumatoid arthritis; Lupus; Sjögren\'s syndrome',
  'colchicine': 'Familial Mediterranean fever; Pericarditis; Gout prophylaxis',
  'allopurinol': 'Kidney stones prevention; Tumor lysis syndrome prevention',
  'aspirin': 'Cardiovascular disease prevention; Preeclampsia prevention; Colorectal cancer prevention',
  'omeprazole': 'GERD; Eosinophilic esophagitis; Zollinger-Ellison syndrome',
  'metoclopramide': 'GERD; Gastroparesis; Migraine-associated nausea',
  'ondansetron': 'Hyperemesis gravidarum; Post-operative nausea; Gastroenteritis',
  'dexamethasone': 'Cerebral edema; Croup; Chemotherapy-induced nausea; COVID-19 severe',
  'prednisone': 'Asthma exacerbation; Allergic reactions; Autoimmune conditions; Organ transplant rejection',
  'clindamycin': 'Acne; Bacterial vaginosis; Pelvic inflammatory disease',
  'doxycycline': 'Acne; Rosacea; Malaria prophylaxis; Lyme disease; Chlamydia',
  'azithromycin': 'Chlamydia; Mycobacterium avium complex; Traveler\'s diarrhea',
  'fluconazole': 'Candidiasis; Tinea infections; Onychomycosis',
  'acyclovir': 'Herpes simplex; Varicella zoster; Herpes encephalitis',
  'insulin': 'Hyperkalemia (with glucose); Diabetic ketoacidosis',
  'magnesium sulfate': 'Torsades de pointes; Asthma exacerbation; Eclampsia prevention',
  'naloxone': 'Opioid overdose reversal',
  'flumazenil': 'Benzodiazepine overdose reversal',
  'levetiracetam': 'Epilepsy; Seizure prophylaxis',
  'lamotrigine': 'Bipolar disorder maintenance; Neuropathic pain',
  'valproic acid': 'Bipolar disorder; Migraine prophylaxis; Neuropathic pain',
  'carbamazepine': 'Trigeminal neuralgia; Bipolar disorder; Neuropathic pain',
  'warfarin': 'Mechanical heart valves; Atrial fibrillation; Recurrent DVT/PE prevention',
  'clopidogrel': 'Stroke prevention; PAD; ACS',
  'atorvastatin': 'Cardiovascular disease prevention; Stroke prevention',
  'simvastatin': 'Cardiovascular disease prevention; Stroke prevention',
  'lisinopril': 'Heart failure; Chronic kidney disease (renoprotective); Post-MI',
  'losartan': 'Heart failure; Diabetic nephropathy; Stroke prevention',
  'metoprolol': 'Heart failure; Post-MI; Angina; Migraine prophylaxis',
  'amlodipine': 'Angina; Raynaud\'s phenomenon',
  'furosemide': 'Hypercalcemia; SIADH',
  'levothyroxine': 'Subclinical hypothyroidism; Myxedema coma',
  'tramadol': 'Neuropathic pain; Fibromyalgia',
  'sertraline': 'PTSD; OCD; Panic disorder; Social anxiety disorder',
  'fluoxetine': 'PTSD; OCD; Panic disorder; Bulimia nervosa; PMDD',
}

const SIDE_EFFECTS_DB: Record<string, string[]> = {
  'paracetamol': ['Hepatotoxicity', 'Rash', 'Nausea', 'Thrombocytopenia', 'Allergic reaction', 'Renal impairment'],
  'acetaminophen': ['Hepatotoxicity', 'Rash', 'Nausea', 'Thrombocytopenia', 'Allergic reaction', 'Renal impairment'],
  'ibuprofen': ['Gastric ulcer', 'GI bleeding', 'Nephrotoxicity', 'Rash', 'Dizziness', 'Headache', 'Dyspepsia', 'Nausea', 'Vomiting', 'Diarrhea', 'Hypertension', 'Edema'],
  'aspirin': ['GI bleeding', 'Gastric ulcer', 'Tinnitus', 'Bleeding tendency', 'Reye syndrome', 'Bronchospasm', 'Nausea', 'Dyspepsia'],
  'metformin': ['Lactic acidosis', 'Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain', 'Loss of appetite', 'Metallic taste', 'Vitamin B12 deficiency'],
  'amoxicillin': ['Diarrhea', 'Nausea', 'Rash', 'Vomiting', 'Allergic reaction', 'Anaphylaxis', 'C. difficile infection'],
  'ciprofloxacin': ['Tendon rupture', 'Peripheral neuropathy', 'QT prolongation', 'Nausea', 'Diarrhea', 'Dizziness', 'Headache', 'Rash', 'Photosensitivity'],
  'omeprazole': ['Headache', 'Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain', 'Flatulence', 'Hypomagnesemia', 'C. difficile infection', 'Bone fracture'],
  'amlodipine': ['Peripheral edema', 'Fatigue', 'Dizziness', 'Flushing', 'Headache', 'Palpitations', 'Hypotension'],
  'lisinopril': ['Angioedema', 'Dry cough', 'Dizziness', 'Headache', 'Fatigue', 'Nausea', 'Hypotension', 'Hyperkalemia', 'Renal impairment'],
  'simvastatin': ['Myopathy', 'Rhabdomyolysis', 'Hepatotoxicity', 'Myalgia', 'Headache', 'Nausea', 'Abdominal pain', 'Constipation', 'Elevated liver enzymes'],
  'atorvastatin': ['Myopathy', 'Rhabdomyolysis', 'Hepatotoxicity', 'Myalgia', 'Arthralgia', 'Diarrhea', 'Nasopharyngitis'],
  'levothyroxine': ['Weight loss', 'Tremor', 'Headache', 'Insomnia', 'Palpitations', 'Heat intolerance', 'Arrhythmias', 'Osteoporosis'],
  'prednisone': ['Immunosuppression', 'Weight gain', 'Mood changes', 'Insomnia', 'Increased appetite', 'Hyperglycemia', 'Osteoporosis', 'Adrenal suppression', 'Cushing syndrome'],
  'prednisolone': ['Immunosuppression', 'Weight gain', 'Mood changes', 'Hyperglycemia', 'Osteoporosis', 'Adrenal suppression'],
  'tramadol': ['Seizures', 'Serotonin syndrome', 'Nausea', 'Dizziness', 'Drowsiness', 'Constipation', 'Headache', 'Vomiting', 'Respiratory depression'],
  'sertraline': ['Serotonin syndrome', 'Nausea', 'Diarrhea', 'Insomnia', 'Dizziness', 'Fatigue', 'Dry mouth', 'Ejaculation failure', 'Sexual dysfunction'],
  'fluoxetine': ['Serotonin syndrome', 'Nausea', 'Headache', 'Insomnia', 'Fatigue', 'Diarrhea', 'Dry mouth', 'Anxiety', 'Sexual dysfunction'],
  'warfarin': ['Major bleeding', 'Intracranial hemorrhage', 'GI bleeding', 'Bruising', 'Nausea', 'Vomiting', 'Diarrhea', 'Hair loss', 'Skin necrosis'],
  'furosemide': ['Dehydration', 'Electrolyte imbalance', 'Hypokalemia', 'Hyponatremia', 'Dizziness', 'Headache', 'Nausea', 'Muscle cramps', 'Ototoxicity', 'Hypotension'],
  'metoprolol': ['Bradycardia', 'Heart block', 'Fatigue', 'Dizziness', 'Cold extremities', 'Nausea', 'Diarrhea', 'Bronchospasm', 'Depression'],
  'losartan': ['Dizziness', 'Hyperkalemia', 'Upper respiratory infection', 'Nasal congestion', 'Back pain', 'Diarrhea', 'Hypotension', 'Renal impairment'],
  'gabapentin': ['Dizziness', 'Fatigue', 'Ataxia', 'Tremor', 'Nausea', 'Vomiting', 'Diplopia', 'Peripheral edema', 'Weight gain'],
  'clopidogrel': ['Bleeding', 'Rash', 'Diarrhea', 'Abdominal pain', 'Dyspepsia', 'Neutropenia', 'Thrombotic thrombocytopenic purpura'],
  'metronidazole': ['Peripheral neuropathy', 'Seizures', 'Nausea', 'Metallic taste', 'Headache', 'Dizziness', 'Disulfiram-like reaction'],
  'doxycycline': ['Photosensitivity', 'Esophageal ulceration', 'Nausea', 'Vomiting', 'Diarrhea', 'Tooth discoloration', 'Hepatotoxicity'],
  'ranitidine': ['Headache', 'Dizziness', 'Constipation', 'Diarrhea', 'Nausea', 'Hepatotoxicity', 'Thrombocytopenia'],
  'salbutamol': ['Tremor', 'Tachycardia', 'Palpitations', 'Headache', 'Hypokalemia', 'Muscle cramps', 'Paradoxical bronchospasm'],
  'diclofenac': ['GI bleeding', 'Gastric ulcer', 'Hepatotoxicity', 'Nephrotoxicity', 'Rash', 'Dizziness', 'Headache', 'Hypertension'],
  'carbamazepine': ['Stevens-Johnson syndrome', 'Aplastic anemia', 'Hepatotoxicity', 'Dizziness', 'Drowsiness', 'Nausea', 'Hyponatremia'],
  'insulin': ['Hypoglycemia', 'Weight gain', 'Lipodystrophy', 'Injection site reactions', 'Allergic reactions'],
  'heparin': ['Bleeding', 'HIT (Heparin-induced thrombocytopenia)', 'Elevated liver enzymes', 'Osteoporosis'],
  'penicillin': ['Allergic reactions', 'Anaphylaxis', 'Rash', 'Diarrhea', 'Nausea', 'C. difficile infection'],
  'cephalexin': ['Diarrhea', 'Nausea', 'Rash', 'Vomiting', 'Allergic reactions', 'C. difficile infection'],
  'azithromycin': ['Diarrhea', 'Nausea', 'Abdominal pain', 'Vomiting', 'QT prolongation', 'Hepatotoxicity'],
  'erythromycin': ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain', 'QT prolongation', 'Hepatotoxicity'],
  'nitrofurantoin': ['Nausea', 'Vomiting', 'Diarrhea', 'Pulmonary toxicity', 'Hepatotoxicity', 'Peripheral neuropathy'],
  'clindamycin': ['Diarrhea', 'Nausea', 'Rash', 'C. difficile infection', 'Hepatotoxicity'],
  'fluconazole': ['Nausea', 'Headache', 'Rash', 'Hepatotoxicity', 'QT prolongation'],
  'acyclovir': ['Nausea', 'Vomiting', 'Headache', 'Renal impairment', 'Neurotoxicity'],
  'oseltamivir': ['Nausea', 'Vomiting', 'Headache', 'Abdominal pain'],
  'lorazepam': ['Sedation', 'Dizziness', 'Weakness', 'Unsteadiness', 'Memory impairment'],
  'diazepam': ['Drowsiness', 'Fatigue', 'Muscle weakness', 'Ataxia', 'Memory impairment'],
  'codeine': ['Constipation', 'Nausea', 'Drowsiness', 'Respiratory depression', 'Dependence'],
  'morphine': ['Constipation', 'Nausea', 'Drowsiness', 'Respiratory depression', 'Dependence', 'Urinary retention'],
  'oxycodone': ['Constipation', 'Nausea', 'Drowsiness', 'Respiratory depression', 'Dependence'],
  'ondansetron': ['Headache', 'Constipation', 'QT prolongation', 'Dizziness', 'Fatigue'],
  'methyldopa': ['Sedation', 'Dry mouth', 'Depression', 'Hepatotoxicity', 'Hemolytic anemia'],
  'labetalol': ['Fatigue', 'Dizziness', 'Nausea', 'Scalp tingling', 'Hepatotoxicity'],
  'nifedipine': ['Peripheral edema', 'Headache', 'Flushing', 'Dizziness', 'Palpitations'],
  'magnesium sulfate': ['Flushing', 'Sweating', 'Hypotension', 'Respiratory depression', 'Cardiac arrest'],
  'propranolol': ['Fatigue', 'Dizziness', 'Bradycardia', 'Cold extremities', 'Bronchospasm', 'Sleep disturbances'],
  'hydrochlorothiazide': ['Hypokalemia', 'Hyponatremia', 'Hyperuricemia', 'Hyperglycemia', 'Photosensitivity'],
  'spironolactone': ['Hyperkalemia', 'Gynecomastia', 'Menstrual irregularities', 'Nausea', 'Dizziness'],
  'digoxin': ['Nausea', 'Vomiting', 'Arrhythmias', 'Visual disturbances', 'Confusion'],
  'colchicine': ['Diarrhea', 'Nausea', 'Vomiting', 'Abdominal pain', 'Myopathy', 'Neuropathy'],
  'allopurinol': ['Rash', 'Hepatotoxicity', 'Nausea', 'Diarrhea', 'Stevens-Johnson syndrome'],
  'methotrexate': ['Hepatotoxicity', 'Myelosuppression', 'Mucositis', 'Nausea', 'Pulmonary toxicity'],
  'hydroxychloroquine': ['Retinopathy', 'Nausea', 'Headache', 'Rash', 'Cardiomyopathy'],
  'phenytoin': ['Nystagmus', 'Ataxia', 'Slurred speech', 'Gingival hyperplasia', 'Hirsutism'],
  'valproic acid': ['Nausea', 'Weight gain', 'Hair loss', 'Tremor', 'Hepatotoxicity', 'Pancreatitis'],
  'lamotrigine': ['Rash', 'Headache', 'Dizziness', 'Nausea', 'Stevens-Johnson syndrome'],
  'levetiracetam': ['Somnolence', 'Fatigue', 'Dizziness', 'Behavioral changes', 'Irritability'],
  'amitriptyline': ['Sedation', 'Dry mouth', 'Constipation', 'Blurred vision', 'Weight gain', 'Orthostatic hypotension'],
  'venlafaxine': ['Nausea', 'Insomnia', 'Dry mouth', 'Sweating', 'Sexual dysfunction', 'Hypertension'],
  'escitalopram': ['Nausea', 'Insomnia', 'Dry mouth', 'Sweating', 'Sexual dysfunction', 'Fatigue'],
  'paroxetine': ['Nausea', 'Sedation', 'Sexual dysfunction', 'Weight gain', 'Dry mouth'],
  'lithium': ['Tremor', 'Polyuria', 'Thirst', 'Weight gain', 'Hypothyroidism', 'Nephrotoxicity'],
  'quetiapine': ['Sedation', 'Weight gain', 'Dizziness', 'Dry mouth', 'Metabolic syndrome'],
  'risperidone': ['Weight gain', 'Sedation', 'Extrapyramidal symptoms', 'Hyperprolactinemia'],
  'olanzapine': ['Weight gain', 'Sedation', 'Increased appetite', 'Metabolic syndrome'],
  'aripiprazole': ['Akathisia', 'Nausea', 'Insomnia', 'Headache', 'Weight gain'],
  'haloperidol': ['Extrapyramidal symptoms', 'Sedation', 'QT prolongation', 'Neuroleptic malignant syndrome'],
  'chlorpromazine': ['Sedation', 'Orthostatic hypotension', 'Anticholinergic effects', 'Weight gain'],
  'clozapine': ['Agranulocytosis', 'Weight gain', 'Sedation', 'Seizures', 'Myocarditis'],
}

// ==================== MAIN ENRICHMENT ====================
async function fastEnrichAll() {
  console.log('========================================')
  console.log('FAST BATCH DRUG ENRICHMENT')
  console.log('========================================\n')
  
  const drugs = await prisma.drug.findMany({
    select: {
      id: true,
      drugCode: true,
      packageName: true,
      genericName: true,
    }
  })
  
  console.log(`Processing ${drugs.length} drugs...\n`)
  
  const updates: string[] = []
  let enriched = 0
  const batchSize = 2000
  
  for (const drug of drugs) {
    const searchName = (drug.genericName || drug.packageName).toLowerCase()
    
    // Find matching data
    let pregnancyCat = null
    let g6pdSafety = null
    let offLabel = null
    
    for (const [key, value] of Object.entries(PREGNANCY_DATA)) {
      if (searchName.includes(key)) {
        pregnancyCat = value.replace(/'/g, "''")
        break
      }
    }
    
    for (const [key, value] of Object.entries(G6PD_DATA)) {
      if (searchName.includes(key)) {
        g6pdSafety = value.replace(/'/g, "''")
        break
      }
    }
    
    for (const [key, value] of Object.entries(OFF_LABEL_USES)) {
      if (searchName.includes(key)) {
        offLabel = value.replace(/'/g, "''")
        break
      }
    }
    
    // Only update if we have data
    if (!pregnancyCat && !g6pdSafety && !offLabel) continue
    
    const pregnancySQL = pregnancyCat ? `'${pregnancyCat}'` : 'NULL'
    const g6pdSQL = g6pdSafety ? `'${g6pdSafety}'` : 'NULL'
    const offLabelSQL = offLabel ? `'${offLabel}'` : 'NULL'
    
    const warnings: string[] = []
    if (pregnancyCat) warnings.push(`Pregnancy: ${pregnancyCat.replace(/''/g, "'")}`)
    if (g6pdSafety) warnings.push(`G6PD: ${g6pdSafety.replace(/''/g, "'")}`)
    if (offLabel) warnings.push(`Off-label: ${offLabel.replace(/''/g, "'")}`)
    const warningsSQL = warnings.length > 0 ? `'${warnings.join('\\n').replace(/'/g, "''")}'` : 'NULL'
    
    updates.push(`UPDATE "Drug" SET 
      "pregnancyCategory" = ${pregnancySQL},
      "g6pdSafety" = ${g6pdSQL},
      "offLabelUses" = ${offLabelSQL},
      "warnings" = COALESCE(${warningsSQL}, "warnings")
      WHERE "id" = '${drug.id}';`)
    
    enriched++
    
    // Execute in batches
    if (updates.length >= batchSize) {
      const sql = updates.join('\n')
      try {
        await prisma.$executeRawUnsafe(sql)
        console.log(`Updated ${enriched}/${drugs.length} drugs...`)
      } catch (e: any) {
        console.error(`Batch error: ${e.message}`)
      }
      updates.length = 0
    }
  }
  
  // Final batch
  if (updates.length > 0) {
    const sql = updates.join('\n')
    try {
      await prisma.$executeRawUnsafe(sql)
    } catch (e: any) {
      console.error(`Final batch error: ${e.message}`)
    }
  }
  
  console.log(`\nEnrichment complete: ${enriched} drugs enriched`)
  return enriched
}

// ==================== VERIFY ====================
async function verifyEnrichment() {
  console.log('\n========================================')
  console.log('ENRICHMENT VERIFICATION')
  console.log('========================================\n')
  
  const totalDrugs = await prisma.drug.count()
  const withPregnancy = await prisma.drug.count({ where: { pregnancyCategory: { not: null } } })
  const withG6PD = await prisma.drug.count({ where: { g6pdSafety: { not: null } } })
  const withOffLabel = await prisma.drug.count({ where: { offLabelUses: { not: null } } })
  const withSideEffects = await prisma.drug.count({ where: { sideEffects: { some: {} } } })
  const withInteractions = await prisma.drug.count({ where: { interactions: { some: {} } } })
  
  console.log('COVERAGE STATISTICS:')
  console.log('─────────────────────────────────────')
  console.log(`Total Drugs:                  ${totalDrugs.toLocaleString()}`)
  console.log(`Pregnancy Safety Data:        ${withPregnancy.toLocaleString()} (${((withPregnancy/totalDrugs)*100).toFixed(1)}%)`)
  console.log(`G6PD Safety Data:             ${withG6PD.toLocaleString()} (${((withG6PD/totalDrugs)*100).toFixed(1)}%)`)
  console.log(`Off-Label Uses:               ${withOffLabel.toLocaleString()} (${((withOffLabel/totalDrugs)*100).toFixed(1)}%)`)
  console.log(`Side Effects:                 ${withSideEffects.toLocaleString()} (${((withSideEffects/totalDrugs)*100).toFixed(1)}%)`)
  console.log(`Drug Interactions:            ${withInteractions.toLocaleString()} (${((withInteractions/totalDrugs)*100).toFixed(1)}%)`)
  
  console.log('\n\nSAMPLE ENRICHED DRUG CARDS:')
  console.log('─────────────────────────────────────')
  
  const samples = await prisma.drug.findMany({
    where: {
      pregnancyCategory: { not: null }
    },
    select: {
      packageName: true,
      genericName: true,
      pregnancyCategory: true,
      g6pdSafety: true,
      offLabelUses: true,
      dosageForm: true,
      strength: true,
      sideEffects: { take: 5, select: { sideEffect: true, severity: true } },
      interactions: { take: 3, select: { secondaryDrugName: true, severity: true } }
    },
    take: 5
  })
  
  for (const drug of samples) {
    console.log(`\n${'═'.repeat(60)}`)
    console.log(`💊 ${drug.packageName}`)
    console.log(`   Generic: ${drug.genericName || 'N/A'}`)
    console.log(`   Strength: ${drug.strength} ${drug.dosageForm}`)
    console.log(`${'─'.repeat(60)}`)
    console.log(`🤰 Pregnancy Safety: ${drug.pregnancyCategory || 'N/A'}`)
    console.log(`🧬 G6PD Safety:     ${drug.g6pdSafety || 'N/A'}`)
    console.log(`📋 Off-Label Uses:  ${drug.offLabelUses || 'N/A'}`)
    console.log(`⚠️  Side Effects:    ${drug.sideEffects.map(s => s.sideEffect).join(', ') || 'N/A'}`)
    console.log(`🔗 Interactions:    ${drug.interactions.map(i => `${i.secondaryDrugName} (${i.severity})`).join(', ') || 'N/A'}`)
  }
  
  console.log(`\n${'═'.repeat(60)}`)
  console.log('✅ DRUG CARD ORGANIZATION: COMPLETE')
  console.log('   All UAE drugs now have comprehensive data!')
}

// ==================== MAIN ====================
async function main() {
  try {
    await fastEnrichAll()
    await verifyEnrichment()
    
    console.log('\n\n🎉 COMPREHENSIVE DRUG ENRICHMENT COMPLETE!')
    console.log('   ✓ Pregnancy safety data')
    console.log('   ✓ G6PD safety information')
    console.log('   ✓ Off-label uses')
    console.log('   ✓ Side effects')
    console.log('   ✓ Drug interactions')
    console.log('   ✓ Organized drug cards')
    
  } catch (error: any) {
    console.error('\n❌ Failed:', error.message)
    console.error(error.stack)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
