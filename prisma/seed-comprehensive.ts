import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Comprehensive drug list with ICD-10 mappings
const drugs = [
  // === ANTIBIOTICS ===
  { drugCode: 'NORFLOX-400-14', packageName: 'NORACIN', genericName: 'Norfloxacin', strength: '400 mg', dosageForm: 'Tablets', packageSize: '14s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 22, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'N39.0', description: 'Urinary tract infection, site not specified' }] },
  { drugCode: 'AMOX-500-20', packageName: 'AMOXIL', genericName: 'Amoxicillin', strength: '500 mg', dosageForm: 'Capsules', packageSize: '20s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 25, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'J02.9', description: 'Acute pharyngitis' }, { code: 'J18.9', description: 'Pneumonia' }, { code: 'N39.0', description: 'UTI' }, { code: 'N30.00', description: 'Acute cystitis' }] },
  { drugCode: 'AMOX-250-16', packageName: 'NORCIPEN', genericName: 'Ampicillin', strength: '250 mg', dosageForm: 'Capsules', packageSize: '16s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 4.5, includedInThiqaABM: 'No', icd10Codes: [{ code: 'J02.9', description: 'Acute pharyngitis' }, { code: 'J18.9', description: 'Pneumonia' }, { code: 'N39.0', description: 'UTI' }] },
  { drugCode: 'AMOX-500-16', packageName: 'NORCIPEN FORTE', genericName: 'Ampicillin', strength: '500 mg', dosageForm: 'Capsules', packageSize: '16s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 8, includedInThiqaABM: 'No', icd10Codes: [{ code: 'J02.9', description: 'Acute pharyngitis' }, { code: 'J18.9', description: 'Pneumonia' }] },
  { drugCode: 'COTRI-240-60', packageName: 'NORTRIME', genericName: 'Cotrimoxazole', strength: '240 mg/5ml', dosageForm: 'Oral Suspension', packageSize: '60ml', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 3, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'N39.0', description: 'UTI' }, { code: 'J18.9', description: 'Pneumonia' }] },
  { drugCode: 'COTRI-480-20', packageName: 'NORTRIME', genericName: 'Cotrimoxazole', strength: '480 mg', dosageForm: 'Tablets', packageSize: '20s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 6, includedInThiqaABM: 'No', icd10Codes: [{ code: 'N39.0', description: 'UTI' }, { code: 'J18.9', description: 'Pneumonia' }, { code: 'N30.00', description: 'Acute cystitis' }] },
  { drugCode: 'ROXITH-100-10', packageName: 'ROMAC', genericName: 'Roxithromycin', strength: '100 mg', dosageForm: 'Tablets', packageSize: '10s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 21, includedInThiqaABM: 'No', icd10Codes: [{ code: 'J02.9', description: 'Acute pharyngitis' }, { code: 'J18.9', description: 'Pneumonia' }] },
  { drugCode: 'ROXITH-150-10', packageName: 'ROMAC', genericName: 'Roxithromycin', strength: '150 mg', dosageForm: 'Tablets', packageSize: '10s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 27, includedInThiqaABM: 'No', icd10Codes: [{ code: 'J02.9', description: 'Acute pharyngitis' }, { code: 'J18.9', description: 'Pneumonia' }] },
  { drugCode: 'ROXITH-300-10', packageName: 'ROMAC', genericName: 'Roxithromycin', strength: '300 mg', dosageForm: 'Tablets', packageSize: '10s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 44.5, includedInThiqaABM: 'No', icd10Codes: [{ code: 'J02.9', description: 'Acute pharyngitis' }, { code: 'J18.9', description: 'Pneumonia' }] },
  { drugCode: 'DOXY-100-10', packageName: 'UNIDOX', genericName: 'Doxycycline Hyclate', strength: '100 mg', dosageForm: 'Capsules', packageSize: '10s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 14, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'A70', description: 'Chlamydia infection' }, { code: 'J18.9', description: 'Pneumonia' }, { code: 'L70.0', description: 'Acne vulgaris' }] },
  { drugCode: 'CEFAD-500-12', packageName: 'DROXIL', genericName: 'Cefadroxil', strength: '500 mg', dosageForm: 'Capsules', packageSize: '12s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 19.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'J02.9', description: 'Acute pharyngitis' }, { code: 'N39.0', description: 'UTI' }] },
  { drugCode: 'NITRO-100-20', packageName: 'NITRUST', genericName: 'Nitrofurantoin', strength: '100 mg/ml', dosageForm: 'Oral Suspension', packageSize: '100ml', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 62.1, includedInThiqaABM: 'No', icd10Codes: [{ code: 'N39.0', description: 'UTI' }, { code: 'N30.00', description: 'Acute cystitis' }] },
  { drugCode: 'FOSFO-4-50', packageName: 'FOSFOCINA', genericName: 'Fosfomycin', strength: '40 mg/ml', dosageForm: 'Powder for Solution', packageSize: '50 vials', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 8120.5, includedInThiqaABM: 'No', icd10Codes: [{ code: 'N39.0', description: 'UTI' }, { code: 'N30.00', description: 'Acute cystitis' }] },

  // === CARDIOVASCULAR ===
  { drugCode: 'ATORVA-10-30', packageName: 'TORVACOL', genericName: 'Atorvastatin Calcium', strength: '10 mg', dosageForm: 'Tablets', packageSize: '30s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 64.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'E78.5', description: 'Hyperlipidemia' }, { code: 'I25.10', description: 'Atherosclerotic heart disease' }] },
  { drugCode: 'ATORVA-20-30', packageName: 'TORVACOL', genericName: 'Atorvastatin Calcium', strength: '20 mg', dosageForm: 'Tablets', packageSize: '30s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 103.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'E78.5', description: 'Hyperlipidemia' }, { code: 'I25.10', description: 'Atherosclerotic heart disease' }, { code: 'I10', description: 'Essential hypertension' }] },
  { drugCode: 'ATORVA-40-30', packageName: 'TORVACOL', genericName: 'Atorvastatin Calcium', strength: '40 mg', dosageForm: 'Tablets', packageSize: '30s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 121.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'E78.5', description: 'Hyperlipidemia' }, { code: 'I25.10', description: 'Atherosclerotic heart disease' }] },
  { drugCode: 'SPIRONO-25-30', packageName: 'NORACTONE', genericName: 'Spironolactone', strength: '25 mg', dosageForm: 'Tablets', packageSize: '30s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 8, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'I50.9', description: 'Heart failure' }, { code: 'I10', description: 'Essential hypertension' }] },
  { drugCode: 'GEMFI-600-30', packageName: 'LOW-LIP', genericName: 'Gemfibrozil', strength: '600 mg', dosageForm: 'Tablets', packageSize: '30s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 23.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'E78.5', description: 'Hyperlipidemia' }, { code: 'E78.1', description: 'Pure hyperglyceridemia' }] },
  { drugCode: 'TELMIS-80-5-28', packageName: 'COVATEL', genericName: 'Telmisartan/Amlodipine', strength: '80mg/5mg', dosageForm: 'Tablets', packageSize: '28s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 58.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'I10', description: 'Essential hypertension' }, { code: 'I50.9', description: 'Heart failure' }] },
  { drugCode: 'TELMIS-80-10-28', packageName: 'COVATEL', genericName: 'Telmisartan/Amlodipine', strength: '80mg/10mg', dosageForm: 'Tablets', packageSize: '28s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 58.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'I10', description: 'Essential hypertension' }, { code: 'I50.9', description: 'Heart failure' }] },
  { drugCode: 'ADENO-3-6', packageName: 'REVARDIA', genericName: 'Adenosine', strength: '3 mg/1ml', dosageForm: 'Solution For Injection', packageSize: '6 vials', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 52, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'I47.1', description: 'Supraventricular tachycardia' }, { code: 'I47.9', description: 'Paroxysmal tachycardia' }] },
  { drugCode: 'HEPARIN-5000-100', packageName: 'HEPARIN SODIUM STEROP', genericName: 'Heparin', strength: '5000 IU/ml', dosageForm: 'Solution For Injection', packageSize: '100 ampoules', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 1265, includedInThiqaABM: 'No', icd10Codes: [{ code: 'I26.99', description: 'Pulmonary embolism' }, { code: 'I82.90', description: 'Venous thrombosis' }] },
  { drugCode: 'CISATRAC-2-5', packageName: 'SALOCAN', genericName: 'Cisatracurium', strength: '2 mg/1 ml', dosageForm: 'Solution for Injection', packageSize: '5 ampoules', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 61, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'Z96.0', description: 'Surgical procedure' }] },
  { drugCode: 'TIROFIB-0.25-50', packageName: 'AGRIPLAT', genericName: 'Tirofiban', strength: '0.25 mg/1ml', dosageForm: 'Concentrate For Infusion', packageSize: '1 vial', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 524, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'I21.9', description: 'Acute myocardial infarction' }, { code: 'I20.0', description: 'Unstable angina' }] },

  // === CNS / NEUROLOGY ===
  { drugCode: 'LEVETI-1000-30', packageName: 'TIRACETAM', genericName: 'Levetiracetam', strength: '1000 mg', dosageForm: 'Tablets', packageSize: '30s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 134.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'G40.909', description: 'Epilepsy, unspecified' }, { code: 'G40.301', description: 'Generalized idiopathic epilepsy' }] },
  { drugCode: 'LEVETI-100-300', packageName: 'TIRACETAM', genericName: 'Levetiracetam', strength: '100 mg/ml', dosageForm: 'Oral Solution', packageSize: '300ml', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 189.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'G40.909', description: 'Epilepsy' }] },
  { drugCode: 'LEVETI-250-30', packageName: 'TIRACETAM', genericName: 'Levetiracetam', strength: '250 mg', dosageForm: 'Tablets', packageSize: '30s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 48.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'G40.909', description: 'Epilepsy' }] },
  { drugCode: 'LEVETI-500-100', packageName: 'TIRACETAM', genericName: 'Levetiracetam', strength: '500 mg', dosageForm: 'Tablets', packageSize: '100s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 192, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'G40.909', description: 'Epilepsy' }] },
  { drugCode: 'LACOS-100-60', packageName: 'LAZURE', genericName: 'Lacosamide', strength: '100 mg', dosageForm: 'Tablets', packageSize: '60s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 250, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'G40.909', description: 'Epilepsy' }] },
  { drugCode: 'LACOS-200-60', packageName: 'LAZURE', genericName: 'Lacosamide', strength: '200 mg', dosageForm: 'Tablets', packageSize: '60s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 488, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'G40.909', description: 'Epilepsy' }] },
  { drugCode: 'LACOS-50-60', packageName: 'LAZURE', genericName: 'Lacosamide', strength: '50 mg', dosageForm: 'Tablets', packageSize: '60s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 129.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'G40.909', description: 'Epilepsy' }] },
  { drugCode: 'PHENYTOIN-250-100', packageName: 'PHENYTOIN STEROP', genericName: 'Phenytoin Sodium', strength: '250 mg/5ml', dosageForm: 'Solution For Injection', packageSize: '100 ampoules', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 748, includedInThiqaABM: 'No', icd10Codes: [{ code: 'G40.909', description: 'Epilepsy' }] },
  { drugCode: 'ELETRI-40-4', packageName: 'MIGROTAN', genericName: 'Eletriptan', strength: '40 mg', dosageForm: 'Film Coated Tablets', packageSize: '4s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 56.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'G43.909', description: 'Migraine, unspecified' }] },
  { drugCode: 'ELETRI-40-10', packageName: 'MIGROTAN', genericName: 'Eletriptan', strength: '40 mg', dosageForm: 'Film Coated Tablets', packageSize: '10s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 126, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'G43.909', description: 'Migraine' }] },
  { drugCode: 'ATROPINE-0.1-10', packageName: 'ATROPINE SULPHATE STEROP', genericName: 'Atropine Sulfate', strength: '0.1 mg/ml', dosageForm: 'Solution For Injection', packageSize: '10 PFS', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 37.95, includedInThiqaABM: 'No', icd10Codes: [{ code: 'R05.9', description: 'Cough' }, { code: 'J45.909', description: 'Asthma' }] },

  // === MENTAL HEALTH ===
  { drugCode: 'SERTRAL-50-10', packageName: 'SETRAL', genericName: 'Sertraline Hydrochloride', strength: '50 mg', dosageForm: 'Tablets', packageSize: '10s', status: 'Active', dispenseMode: 'Semi-Controlled Drug', packagePricePublic: 31, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'F32.9', description: 'Major depressive disorder' }, { code: 'F41.9', description: 'Anxiety disorder' }] },
  { drugCode: 'SERTRAL-100-10', packageName: 'SETRAL', genericName: 'Sertraline Hydrochloride', strength: '100 mg', dosageForm: 'Tablets', packageSize: '10s', status: 'Active', dispenseMode: 'Semi-Controlled Drug', packagePricePublic: 52, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'F32.9', description: 'Major depressive disorder' }, { code: 'F41.9', description: 'Anxiety disorder' }] },
  { drugCode: 'FLUOX-20-10', packageName: 'OXETINE', genericName: 'Fluoxetine Hydrochloride', strength: '20 mg', dosageForm: 'Tablets', packageSize: '10s', status: 'Active', dispenseMode: 'Semi-Controlled Drug', packagePricePublic: 52, includedInThiqaABM: 'No', icd10Codes: [{ code: 'F32.9', description: 'Major depressive disorder' }, { code: 'F33.9', description: 'Recurrent depressive disorder' }] },
  { drugCode: 'FLUOX-20-20', packageName: 'OXETINE', genericName: 'Fluoxetine Hydrochloride', strength: '20 mg', dosageForm: 'Tablets', packageSize: '20s', status: 'Active', dispenseMode: 'Semi-Controlled Drug', packagePricePublic: 99.5, includedInThiqaABM: 'No', icd10Codes: [{ code: 'F32.9', description: 'Major depressive disorder' }] },
  { drugCode: 'FLUOX-20-30', packageName: 'OXETINE', genericName: 'Fluoxetine Hydrochloride', strength: '20 mg', dosageForm: 'Tablets', packageSize: '30s', status: 'Active', dispenseMode: 'Semi-Controlled Drug', packagePricePublic: 141.5, includedInThiqaABM: 'No', icd10Codes: [{ code: 'F32.9', description: 'Major depressive disorder' }] },

  // === ENDOCRINE / DIABETES ===
  { drugCode: 'METFORM-500-50', packageName: 'DIAPHAGE', genericName: 'Metformin Hydrochloride', strength: '500 mg', dosageForm: 'Tablets', packageSize: '50s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 8, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'E11.9', description: 'Type 2 diabetes mellitus' }] },
  { drugCode: 'METFORM-850-30', packageName: 'DIAPHAGE', genericName: 'Metformin Hydrochloride', strength: '850 mg', dosageForm: 'Tablets', packageSize: '30s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 8.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'E11.9', description: 'Type 2 diabetes mellitus' }] },
  { drugCode: 'GLICL-60-28', packageName: 'G-ZIDE MR', genericName: 'Gliclazide', strength: '60 mg', dosageForm: 'Modified Release Tablets', packageSize: '28s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 20.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'E11.9', description: 'Type 2 diabetes mellitus' }] },
  { drugCode: 'ALFACAL-0.25-30', packageName: 'OSTEO-ALFA', genericName: 'Alfacalcidol', strength: '0.25 mcg', dosageForm: 'Capsules', packageSize: '30s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 22.39, includedInThiqaABM: 'No', icd10Codes: [{ code: 'E55.9', description: 'Vitamin D deficiency' }, { code: 'M81.0', description: 'Osteoporosis' }] },
  { drugCode: 'ALFACAL-1-30', packageName: 'OSTEO-ALFA', genericName: 'Alfacalcidol', strength: '1 mcg', dosageForm: 'Capsules', packageSize: '30s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 63.74, includedInThiqaABM: 'No', icd10Codes: [{ code: 'E55.9', description: 'Vitamin D deficiency' }] },

  // === RESPIRATORY ===
  { drugCode: 'MONTLUK-4-28', packageName: 'SINCAST', genericName: 'Montelukast Sodium', strength: '4 mg', dosageForm: 'Chewable Tablets', packageSize: '28s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 110, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'J45.909', description: 'Asthma, unspecified' }, { code: 'J30.9', description: 'Allergic rhinitis' }] },
  { drugCode: 'MONTLUK-5-30', packageName: 'SINCAST', genericName: 'Montelukast Sodium', strength: '5 mg', dosageForm: 'Chewable Tablets', packageSize: '30s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 118, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'J45.909', description: 'Asthma' }, { code: 'J30.9', description: 'Allergic rhinitis' }] },
  { drugCode: 'TERBU-1.5-100', packageName: 'TALIN', genericName: 'Terbutaline Sulfate', strength: '1.5 mg/5ml', dosageForm: 'Syrup', packageSize: '100ml', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 5.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'J45.909', description: 'Asthma' }, { code: 'J44.1', description: 'COPD with exacerbation' }] },
  { drugCode: 'KETOT-1-30', packageName: 'TEFANYL', genericName: 'Ketotifen Fumarate', strength: '1 mg', dosageForm: 'Tablets', packageSize: '30s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 18.5, includedInThiqaABM: 'No', icd10Codes: [{ code: 'J45.909', description: 'Asthma' }, { code: 'J30.9', description: 'Allergic rhinitis' }] },
  { drugCode: 'KETOT-1-120', packageName: 'PROFILAR', genericName: 'Ketotifen Fumarate', strength: '1 mg/5ml', dosageForm: 'Syrup', packageSize: '120ml', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 8.84, includedInThiqaABM: 'No', icd10Codes: [{ code: 'J45.909', description: 'Asthma' }] },

  // === GASTROINTESTINAL ===
  { drugCode: 'PANTO-40-14', packageName: 'RAZON', genericName: 'Pantoprazole Sodium', strength: '40 mg', dosageForm: 'Enteric Coated Tablets', packageSize: '14s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 52.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'K21.9', description: 'GERD' }, { code: 'K25.9', description: 'Gastric ulcer' }] },
  { drugCode: 'PANTO-40-28', packageName: 'RAZON', genericName: 'Pantoprazole Sodium', strength: '40 mg', dosageForm: 'Enteric Coated Tablets', packageSize: '28s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 64.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'K21.9', description: 'GERD' }, { code: 'K25.9', description: 'Gastric ulcer' }] },
  { drugCode: 'DEXLAN-30-14', packageName: 'DEXILANT', genericName: 'Dexlansoprazole', strength: '30 mg', dosageForm: 'Modified Release Capsules', packageSize: '14s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 89.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'K21.9', description: 'GERD' }, { code: 'K25.9', description: 'Gastric ulcer' }] },
  { drugCode: 'DEXLAN-60-14', packageName: 'DEXILANT', genericName: 'Dexlansoprazole', strength: '60 mg', dosageForm: 'Modified Release Capsules', packageSize: '14s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 122, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'K21.9', description: 'GERD' }] },
  { drugCode: 'RANIT-150-20', packageName: 'RANIDINE', genericName: 'Ranitidine Hydrochloride', strength: '150 mg', dosageForm: 'Tablets', packageSize: '20s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 18.5, includedInThiqaABM: 'No', icd10Codes: [{ code: 'K21.9', description: 'GERD' }, { code: 'K25.9', description: 'Gastric ulcer' }] },
  { drugCode: 'RANIT-300-10', packageName: 'RANIDINE', genericName: 'Ranitidine Hydrochloride', strength: '300 mg', dosageForm: 'Tablets', packageSize: '10s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 16, includedInThiqaABM: 'No', icd10Codes: [{ code: 'K21.9', description: 'GERD' }] },
  { drugCode: 'METOC-10-30', packageName: 'PYLOMID', genericName: 'Metoclopramide Hydrochloride', strength: '10 mg', dosageForm: 'Tablets', packageSize: '30s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 2, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'R11.2', description: 'Nausea with vomiting' }, { code: 'K30', description: 'Functional dyspepsia' }] },

  // === PAIN / ANALGESICS ===
  { drugCode: 'PARACET-500-24', packageName: 'PANADOL', genericName: 'Paracetamol', strength: '500 mg', dosageForm: 'Tablets', packageSize: '24s', status: 'Active', dispenseMode: 'Over The Counter - Pharmacy', packagePricePublic: 12, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'R50.9', description: 'Fever' }, { code: 'R52', description: 'Pain' }, { code: 'R51.9', description: 'Headache' }] },
  { drugCode: 'CODEIN-PARA-20', packageName: 'NORACOD', genericName: 'Codeine/Paracetamol', strength: '10mg/500mg', dosageForm: 'Tablets', packageSize: '20s', status: 'Active', dispenseMode: 'Semi-Controlled Drug', packagePricePublic: 4, includedInThiqaABM: 'No', icd10Codes: [{ code: 'R50.9', description: 'Fever' }, { code: 'R51.9', description: 'Headache' }, { code: 'R52', description: 'Pain' }] },
  { drugCode: 'TENOX-20-8', packageName: 'TENOX', genericName: 'Tenoxicam', strength: '20 mg', dosageForm: 'Capsules', packageSize: '8s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 18, includedInThiqaABM: 'No', icd10Codes: [{ code: 'M79.3', description: 'Panniculitis' }, { code: 'M19.90', description: 'Osteoarthritis' }] },
  { drugCode: 'DICLO-OME-21', packageName: 'DIVIDO COMBO', genericName: 'Diclofenac/Omeprazole', strength: '75mg/20mg', dosageForm: 'Modified Release Capsules', packageSize: '21s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 111.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'M79.3', description: 'Panniculitis' }, { code: 'M25.50', description: 'Pain in joint' }] },
  { drugCode: 'PROBEN-500-100', packageName: 'PROBENECID', genericName: 'Probenecid', strength: '500 mg', dosageForm: 'Tablets', packageSize: '100s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 448, includedInThiqaABM: 'No', icd10Codes: [{ code: 'M10.9', description: 'Gout, unspecified' }] },

  // === COLD / ALLERGY ===
  { drugCode: 'CHLORPH-PSEUDO-100', packageName: 'RHINOSTOP', genericName: 'Chlorpheniramine/Paracetamol/Pseudoephedrine', strength: '1mg/200mg/20mg/5ml', dosageForm: 'Syrup', packageSize: '100ml', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'R50.9', description: 'Fever' }, { code: 'J30.9', description: 'Allergic rhinitis' }] },
  { drugCode: 'TRIPROLIDINE-120', packageName: 'UNIFED', genericName: 'Pseudoephedrine/Triprolidine', strength: '30mg/1.25mg/5ml', dosageForm: 'Syrup', packageSize: '120ml', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 5.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'J30.9', description: 'Allergic rhinitis' }, { code: 'R05.9', description: 'Cough' }] },
  { drugCode: 'GUAIFEN-PSEUDO-120', packageName: 'UNIFED', genericName: 'Guaifenesin/Pseudoephedrine/Triprolidine', strength: '100mg/30mg/1.25mg/5ml', dosageForm: 'Syrup', packageSize: '120ml', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 6.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'R05.9', description: 'Cough' }, { code: 'J30.9', description: 'Allergic rhinitis' }] },
  { drugCode: 'DICLO-10-30', packageName: 'DICLOFEN', genericName: 'Diclofenac Sodium', strength: '10 mg/g', dosageForm: 'Cream', packageSize: '30g', status: 'Active', dispenseMode: 'Pharmacist Only Medicine', packagePricePublic: 12.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'M79.1', description: 'Myalgia' }, { code: 'M25.50', description: 'Joint pain' }] },

  // === VITAMINS / SUPPLEMENTS ===
  { drugCode: 'OMEGA3-60', packageName: 'OPTITECT DEEP OCEAN OMEGA', genericName: 'Fish Oil', strength: '667 mg/Capsule', dosageForm: 'Capsules', packageSize: '30s', status: 'Active', dispenseMode: 'Pharmacist Only Medicine', packagePricePublic: 97, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'E56.9', description: 'Vitamin deficiency' }, { code: 'E55.9', description: 'Vitamin D deficiency' }] },
  { drugCode: 'MAGNESIUM-60', packageName: 'LAPERVERA MAGNESIUM BISGLYCINATE', genericName: 'Magnesium Bisglycinate', strength: '200 mg', dosageForm: 'Capsules', packageSize: '60s', status: 'Active', dispenseMode: 'Pharmacist Only Medicine', packagePricePublic: 125, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'E61.2', description: 'Magnesium deficiency' }] },
  { drugCode: 'ZINC-C-60', packageName: 'LAPERVERA TRIPLE ZINC WITH VITAMIN C', genericName: 'Vitamin C/Zinc', strength: '100mg/25mg', dosageForm: 'Chewable Tablets', packageSize: '60s', status: 'Active', dispenseMode: 'Pharmacist Only Medicine', packagePricePublic: 97, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'E56.9', description: 'Vitamin deficiency' }, { code: 'D53.9', description: 'Nutritional anemia' }] },
  { drugCode: 'CALCIUM-MAGNESIUM-ZINC-100', packageName: 'BLUEBERRY NATURALS CALCIUM MAGNESIUM & ZINC', genericName: 'Calcium/Magnesium/Zinc', strength: '974.9/294.4/14.2 mg', dosageForm: 'Film Coated Tablets', packageSize: '100s', status: 'Active', dispenseMode: 'Pharmacist Only Medicine', packagePricePublic: 66, includedInThiqaABM: 'No', icd10Codes: [{ code: 'E58', description: 'Calcium deficiency' }, { code: 'M81.0', description: 'Osteoporosis' }] },
  { drugCode: 'B6-100-100', packageName: 'VITAMIN B6 STEROP', genericName: 'Pyridoxine Hydrochloride', strength: '100 mg/2ml', dosageForm: 'Solution For Injection', packageSize: '100 ampoules', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 863, includedInThiqaABM: 'No', icd10Codes: [{ code: 'E53.8', description: 'Vitamin B deficiency' }, { code: 'E56.9', description: 'Vitamin deficiency' }] },
  { drugCode: 'B1-100-100', packageName: 'VITAMINE-B1-STEROP', genericName: 'Thiamine', strength: '100 mg/2ml', dosageForm: 'Solution For Injection', packageSize: '100 ampoules', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 672, includedInThiqaABM: 'No', icd10Codes: [{ code: 'E51.9', description: 'Thiamine deficiency' }] },
  { drugCode: 'MULTIVIT-200', packageName: 'MULTI SANOSTOL', genericName: 'Multivitamin', strength: 'Combination', dosageForm: 'Syrup', packageSize: '200g', status: 'Active', dispenseMode: 'Over The Counter - Pharmacy', packagePricePublic: 14, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'E56.9', description: 'Vitamin deficiency' }] },

  // === DERMATOLOGY ===
  { drugCode: 'MICONAZOLE-MOMETASONE-30', packageName: 'ZYNOVATE M', genericName: 'Miconazole/Mometasone', strength: '20mg/1mg/1g', dosageForm: 'Cream', packageSize: '30g', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 13, includedInThiqaABM: 'No', icd10Codes: [{ code: 'J30.9', description: 'Allergic rhinitis' }, { code: 'L30.9', description: 'Dermatitis' }, { code: 'B37.9', description: 'Candidiasis' }] },
  { drugCode: 'SITOSTEROL-30', packageName: 'MELODERM OINTMENT', genericName: 'Beta-Sitosterol', strength: '0.25%', dosageForm: 'Ointment', packageSize: '30g', status: 'Active', dispenseMode: 'Over The Counter - Pharmacy', packagePricePublic: 66, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'L30.9', description: 'Dermatitis' }, { code: 'L20.9', description: 'Atopic dermatitis' }] },
  { drugCode: 'ISOTRETINOIN-30', packageName: 'ISOTREX', genericName: 'Isotretinoin', strength: '0.5 mg/g', dosageForm: 'Gel', packageSize: '30g', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 23.5, includedInThiqaABM: 'No', icd10Codes: [{ code: 'L70.0', description: 'Acne vulgaris' }] },
  { drugCode: 'ISOTRETINOIN-ERYTHRO-30', packageName: 'ISOTREXIN', genericName: 'Erythromycin/Isotretinoin', strength: '20mg/0.5mg/g', dosageForm: 'Gel', packageSize: '30g', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 43.5, includedInThiqaABM: 'No', icd10Codes: [{ code: 'L70.0', description: 'Acne vulgaris' }] },
  { drugCode: 'LACTIC-SALICYLIC-15', packageName: 'DUOFILM', genericName: 'Lactic Acid/Salicylic Acid', strength: '167mg/ml each', dosageForm: 'Topical Lotion', packageSize: '15ml', status: 'Grace', dispenseMode: 'Over The Counter - Pharmacy', packagePricePublic: 11, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'B07.9', description: 'Viral wart' }] },

  // === ONCOLOGY ===
  { drugCode: 'ATEZO-1875', packageName: 'TECENTRIQ', genericName: 'Atezolizumab', strength: '1875 mg', dosageForm: 'Solution For Injection', packageSize: '1 vial', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 23685, includedInThiqaABM: 'No', icd10Codes: [{ code: 'C34.90', description: 'Lung cancer' }, { code: 'C50.919', description: 'Breast cancer' }] },
  { drugCode: 'BRENTUX-50', packageName: 'ADCETRIS', genericName: 'Brentuximab Vedotin', strength: '50 mg', dosageForm: 'Powder For Injection', packageSize: '1 vial', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 19181.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'C81.9', description: 'Hodgkin lymphoma' }, { code: 'C82.9', description: 'Non-Hodgkin lymphoma' }] },
  { drugCode: 'VEDO-300', packageName: 'ENTYVIO', genericName: 'Vedolizumab', strength: '300 mg', dosageForm: 'Powder For Injection', packageSize: '1 vial', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 15751, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'K50.90', description: 'Crohn disease' }, { code: 'K51.90', description: 'Ulcerative colitis' }] },
  { drugCode: 'FRUQUIN-5-21', packageName: 'FRUZAQLA', genericName: 'Fruquintinib', strength: '5 mg', dosageForm: 'Capsules', packageSize: '21s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 28665, includedInThiqaABM: 'No', icd10Codes: [{ code: 'C18.9', description: 'Colon cancer' }, { code: 'C20', description: 'Rectal cancer' }] },
  { drugCode: 'TEGAFUR-56', packageName: 'TS-1', genericName: 'Tegafur/Gimeracil/Oteracil', strength: '25mg/7.25mg/24.5mg', dosageForm: 'Capsules', packageSize: '56s', status: 'Active', dispenseMode: 'Over The Counter - Pharmacy', packagePricePublic: 8372, includedInThiqaABM: 'No', icd10Codes: [{ code: 'C16.9', description: 'Stomach cancer' }, { code: 'C18.9', description: 'Colon cancer' }] },

  // === EMERGENCY / CRITICAL CARE ===
  { drugCode: 'MORPHINE-10-100', packageName: 'MORPHINE SULFATE STEROP', genericName: 'Morphine Sulfate', strength: '10 mg/ml', dosageForm: 'Solution For Injection', packageSize: '100 ampoules', status: 'Active', dispenseMode: 'Narcotic Drug', packagePricePublic: 322, includedInThiqaABM: 'No', icd10Codes: [{ code: 'R52', description: 'Pain' }, { code: 'G89.29', description: 'Chronic pain' }] },
  { drugCode: 'NOREPI-8-10', packageName: 'NOREPINE', genericName: 'Norepinephrine', strength: '8 mg/4ml', dosageForm: 'Solution For Injection', packageSize: '10 ampoules', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 285, includedInThiqaABM: 'No', icd10Codes: [{ code: 'R57.9', description: 'Shock' }, { code: 'I95.9', description: 'Hypotension' }] },
  { drugCode: 'PHENYLEPH-10-100', packageName: 'PHENYLEPHRINE', genericName: 'Phenylephrine Hydrochloride', strength: '10 mg/ml', dosageForm: 'Solution For Injection', packageSize: '100 ampoules', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 989, includedInThiqaABM: 'No', icd10Codes: [{ code: 'J30.9', description: 'Allergic rhinitis' }, { code: 'I95.9', description: 'Hypotension' }] },
  { drugCode: 'QUININE-600-100', packageName: 'QUININE HYDROCHLORIDE', genericName: 'Quinine Hydrochloride', strength: '600 mg/2ml', dosageForm: 'Solution For Injection', packageSize: '100 ampoules', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 902.75, includedInThiqaABM: 'No', icd10Codes: [{ code: 'B50.9', description: 'Plasmodium falciparum malaria' }] },
  { drugCode: 'CALCIUM-10-100', packageName: 'CALCICLO STEROP', genericName: 'Calcium Chloride', strength: '10%', dosageForm: 'Solution For Injection', packageSize: '100 ampoules', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 1316, includedInThiqaABM: 'No', icd10Codes: [{ code: 'E58', description: 'Calcium deficiency' }, { code: 'E83.51', description: 'Hypocalcemia' }] },
  { drugCode: 'MAGNESIUM-100-10', packageName: 'MAGNESIUM SULFATE STEROP', genericName: 'Magnesium Sulfate', strength: '100 mg/ml', dosageForm: 'Solution For Injection', packageSize: '10 ampoules', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 57.5, includedInThiqaABM: 'No', icd10Codes: [{ code: 'E61.2', description: 'Magnesium deficiency' }, { code: 'O14.9', description: 'Pre-eclampsia' }] },
  { drugCode: 'SODIUM-BICARB-50', packageName: 'SODIUM BICARBONATE 8.4%', genericName: 'Sodium Bicarbonate', strength: '8.4%', dosageForm: 'Solution For Infusion', packageSize: '50ml vial', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 14.83, includedInThiqaABM: 'No', icd10Codes: [{ code: 'E87.2', description: 'Acidosis' }, { code: 'T54.2', description: 'Toxic effect of corrosive substance' }] },
  { drugCode: 'SUXAMETH-100-5', packageName: 'LYSTHENON', genericName: 'Suxamethonium Chloride', strength: '100 mg/2ml', dosageForm: 'Solution For Injection', packageSize: '5 ampoules', status: 'Grace', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 75, includedInThiqaABM: 'No', icd10Codes: [{ code: 'Z96.0', description: 'Surgical procedure' }] },
  { drugCode: 'PROMETH-25-5', packageName: 'PROMETHAZINE', genericName: 'Promethazine', strength: '25 mg/ml', dosageForm: 'Solution For Injection', packageSize: '5 ampoules', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 28.8, includedInThiqaABM: 'No', icd10Codes: [{ code: 'R11.2', description: 'Nausea with vomiting' }, { code: 'J30.9', description: 'Allergic rhinitis' }] },
  { drugCode: 'PAPAVERINE-20-100', packageName: 'PAPAVERIN', genericName: 'Papaverine Hydrochloride', strength: '20 mg/ml', dosageForm: 'Solution For Injection', packageSize: '100 ampoules', status: 'Active', dispenseMode: 'Semi-Controlled Drug', packagePricePublic: 3600, includedInThiqaABM: 'No', icd10Codes: [{ code: 'I73.9', description: 'Peripheral vascular disease' }] },

  // === INFECTIOUS DISEASE ===
  { drugCode: 'PYRAZINAMIDE-500-100', packageName: 'PYRAZINAMIDE STEROP', genericName: 'Pyrazinamide', strength: '500 mg', dosageForm: 'Tablets', packageSize: '100s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 40, includedInThiqaABM: 'No', icd10Codes: [{ code: 'A15.0', description: 'Tuberculosis of lung' }] },
  { drugCode: 'DISODIUM-PHOS-22-10', packageName: 'SODIPHOS', genericName: 'Disodium Phosphate', strength: '22 meq/10ml', dosageForm: 'Concentrate For Infusion', packageSize: '10 ampoules', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 153.5, includedInThiqaABM: 'No', icd10Codes: [{ code: 'E87.5', description: 'Hyperkalemia' }, { code: 'E87.6', description: 'Hypokalemia' }] },
  { drugCode: 'POTASSIUM-PHOS-3-10', packageName: 'POTASSIUM PHOSPHATES STEROP', genericName: 'Potassium Phosphate', strength: '3 mmol/ml', dosageForm: 'Solution For Injection', packageSize: '10 ampoules', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 142.6, includedInThiqaABM: 'No', icd10Codes: [{ code: 'E87.6', description: 'Hypokalemia' }, { code: 'E83.39', description: 'Phosphorus deficiency' }] },

  // === VACCINES ===
  { drugCode: 'SMALLPOX-MONKEYPOX-20', packageName: 'JYNNEOS', genericName: 'Smallpox and Monkeypox Vaccine', strength: '0.5-3.95 x 10^8 IU', dosageForm: 'Suspension for Injection', packageSize: '20 vials', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 0.1, includedInThiqaABM: 'No', icd10Codes: [{ code: 'Z23', description: 'Vaccination' }, { code: 'B04', description: 'Monkeypox' }] },
  { drugCode: 'RABIES-IG-300', packageName: 'KAMRAB', genericName: 'Rabies Immunoglobulin', strength: '300 IU', dosageForm: 'Solution For IM Injection', packageSize: '1 vial', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 485, includedInThiqaABM: 'No', icd10Codes: [{ code: 'Z20.3', description: 'Contact with rabies' }, { code: 'A82.9', description: 'Rabies' }] },

  // === WEIGHT MANAGEMENT ===
  { drugCode: 'PHENTERMINE-TOPIRAMATE-30', packageName: 'QSYMIA', genericName: 'Phentermine/Topiramate', strength: '7.5mg/46mg', dosageForm: 'Extended Release Capsules', packageSize: '30s', status: 'Active', dispenseMode: 'Controlled Drug', packagePricePublic: 1010.5, includedInThiqaABM: 'No', icd10Codes: [{ code: 'E66.9', description: 'Obesity, unspecified' }, { code: 'G43.909', description: 'Migraine' }] },

  // === OTC / MISC ===
  { drugCode: 'OMEGA3-GUMMIES-60', packageName: 'SUNSHINE NUTRITION OMEGA-3', genericName: 'Fish Oil', strength: '50 mg/3 gummies', dosageForm: 'Gumee', packageSize: '60s', status: 'Active', dispenseMode: 'Over The Counter - Pharmacy', packagePricePublic: 59, includedInThiqaABM: 'Yes', icd10Codes: [] },
  { drugCode: 'GLYCEROL-15', packageName: 'ALLERSPRAY', genericName: 'Filmogen Glycerol', strength: '2%', dosageForm: 'Nasal Spray', packageSize: '15ml', status: 'Active', dispenseMode: 'Pharmacist Only Medicine', packagePricePublic: 67, includedInThiqaABM: 'No', icd10Codes: [{ code: 'J30.9', description: 'Allergic rhinitis' }, { code: 'J01.90', description: 'Acute sinusitis' }] },
  { drugCode: 'GLYCEROL-20', packageName: 'OROSOL ORAL SPRAY', genericName: 'Filmogen Glycerol', strength: '73.85%/1ml', dosageForm: 'Oromucosal Spray', packageSize: '20ml', status: 'Active', dispenseMode: 'Pharmacist Only Medicine', packagePricePublic: 78, includedInThiqaABM: 'No', icd10Codes: [] },
  { drugCode: 'GLYCEROL-50', packageName: 'PILESEPTIN GEL', genericName: 'Glycerol', strength: '97.33%', dosageForm: 'Gel', packageSize: '50ml', status: 'Active', dispenseMode: 'Pharmacist Only Medicine', packagePricePublic: 109, includedInThiqaABM: 'No', icd10Codes: [{ code: 'L30.9', description: 'Dermatitis' }, { code: 'M79.3', description: 'Panniculitis' }] },
  { drugCode: 'GLYCEROL-30', packageName: 'PILESEPTINE SPRAY', genericName: 'Glycerol', strength: '64.8%', dosageForm: 'Liquid Spray', packageSize: '30ml', status: 'Active', dispenseMode: 'Pharmacist Only Medicine', packagePricePublic: 96, includedInThiqaABM: 'No', icd10Codes: [] },
  { drugCode: 'HYOSCINE-10-5', packageName: 'SPASMANORE', genericName: 'Hyoscine Butylbromide', strength: '10 mg', dosageForm: 'Rectal Suppositories', packageSize: '5s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 1.5, includedInThiqaABM: 'No', icd10Codes: [{ code: 'M62.830', description: 'Muscle spasm of back' }] },
  { drugCode: 'HYOSCINE-10-30', packageName: 'SPASMONORE', genericName: 'Hyoscine Butylbromide', strength: '10 mg', dosageForm: 'Tablets', packageSize: '30s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 7.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'M62.830', description: 'Muscle spasm of back' }] },
  { drugCode: 'MECLOZINE-PYRIDOXINE-20', packageName: 'VOMINORE', genericName: 'Meclozine/Pyridoxine', strength: '25mg/50mg', dosageForm: 'Tablets', packageSize: '20s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 8, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'E56.9', description: 'Vitamin deficiency' }, { code: 'R11.2', description: 'Nausea with vomiting' }] },
  { drugCode: 'SILICONE-SHEET', packageName: 'SCAR FX SILICONE SHEETING', genericName: 'Silicone Gel', strength: '50%', dosageForm: 'Patch', packageSize: '15x120cm', status: 'Active', dispenseMode: 'Pharmacist Only Medicine', packagePricePublic: 1200, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'R52', description: 'Pain' }, { code: 'L90.5', description: 'Scar' }] },
  { drugCode: 'TAMSULOSIN-0.4-30', packageName: 'EZIFLO', genericName: 'Tamsulosin Hydrochloride', strength: '0.4 mg', dosageForm: 'Tablets', packageSize: '30s', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 46.5, includedInThiqaABM: 'Yes', icd10Codes: [{ code: 'N40.1', description: 'Benign prostatic hyperplasia' }] },
  { drugCode: 'CALCITONIN-100-5', packageName: 'MIACALCIC', genericName: 'Calcitonin', strength: '100 U/ml', dosageForm: 'Solution For Injection', packageSize: '5 ampoules', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 312.48, includedInThiqaABM: 'No', icd10Codes: [{ code: 'M81.0', description: 'Osteoporosis' }, { code: 'M80.9', description: 'Osteoporosis with fracture' }] },
  { drugCode: 'ATROPINE-0.1-5', packageName: 'MYATRO', genericName: 'Atropine Sulfate', strength: '0.1 mg/ml', dosageForm: 'Eye Drops', packageSize: '5ml', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 19.04, includedInThiqaABM: 'No', icd10Codes: [{ code: 'H52.4', description: 'Myopia' }] },
  { drugCode: 'HYPMELLOSE-15', packageName: 'VISTA GONIO', genericName: 'Hypromellose', strength: '2.5%', dosageForm: 'Ophthalmic Solution', packageSize: '15ml', status: 'Active', dispenseMode: 'Prescription Only Medicine', packagePricePublic: 179.2, includedInThiqaABM: 'No', icd10Codes: [{ code: 'H18.9', description: 'Corneal disorder' }] },
]

function getCategory(code: string): string {
  if (!code || code.length < 1) return 'Other'
  
  const categoryMap: Record<string, string> = {
    'A': 'Infectious Disease',
    'B': 'Infectious Disease',
    'C': 'Oncology',
    'D': 'Hematology',
    'E': 'Endocrine',
    'F': 'Mental Health',
    'G': 'Neurology',
    'H': 'Ophthalmology',
    'I': 'Cardiovascular',
    'J': 'Respiratory',
    'K': 'Gastrointestinal',
    'L': 'Dermatology',
    'M': 'Musculoskeletal',
    'N': 'Genitourinary',
    'O': 'Obstetrics',
    'P': 'Perinatal',
    'Q': 'Congenital',
    'R': 'Symptoms',
    'S': 'Injury',
    'T': 'Injury',
    'Z': 'Other'
  }
  
  const categoryChar = code.charAt(0).toUpperCase()
  return categoryMap[categoryChar] || 'Other'
}

async function main() {
  console.log('Importing comprehensive UAE Drug List with ICD-10 mappings...')
  
  // Clear existing data
  await prisma.iCD10Mapping.deleteMany({})
  await prisma.drug.deleteMany({})
  console.log('Cleared existing data')
  
  console.log(`Importing ${drugs.length} drugs...`)
  
  let imported = 0
  let mappingsImported = 0
  
  for (const drug of drugs) {
    try {
      const created = await prisma.drug.create({
        data: {
          drugCode: drug.drugCode,
          packageName: drug.packageName,
          genericName: drug.genericName,
          strength: drug.strength,
          dosageForm: drug.dosageForm,
          packageSize: drug.packageSize,
          status: drug.status,
          dispenseMode: drug.dispenseMode,
          packagePricePublic: drug.packagePricePublic,
          includedInThiqaABM: drug.includedInThiqaABM
        }
      })
      
      imported++
      
      for (const icd of drug.icd10Codes) {
        try {
          await prisma.iCD10Mapping.create({
            data: {
              drugId: created.id,
              icd10Code: icd.code,
              description: icd.description,
              category: getCategory(icd.code)
            }
          })
          mappingsImported++
        } catch (e) {
          console.error(`Error creating ICD-10 mapping:`, e)
        }
      }
    } catch (e) {
      console.error(`Error creating drug ${drug.packageName}:`, e)
    }
  }
  
  console.log(`\n✅ Imported ${imported} drugs with ${mappingsImported} ICD-10 mappings`)
  
  const total = await prisma.drug.count()
  const totalMappings = await prisma.iCD10Mapping.count()
  
  // Get statistics by category
  const categories = await prisma.iCD10Mapping.groupBy({
    by: ['category'],
    _count: true
  })
  
  console.log('\n=== Database Statistics ===')
  console.log(`Total drugs: ${total}`)
  console.log(`Total ICD-10 mappings: ${totalMappings}`)
  console.log('\nBy Category:')
  categories.forEach(c => console.log(`  ${c.category}: ${c._count}`))
  
  await prisma.$disconnect()
  console.log('\nDone!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
