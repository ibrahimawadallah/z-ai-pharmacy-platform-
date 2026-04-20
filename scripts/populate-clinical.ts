import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const CLINICAL_DATA: Record<string, any> = {
  'amoxicillin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Crosses placenta. Use only if clearly needed.', breastfeedingSafety: 'Compatible. Excreted in low concentrations.', g6pdSafety: 'Safe', baseDoseMgPerKg: 25, baseDoseIndication: 'Respiratory infection' },
  'metformin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Continue use in pregnancy for diabetes control.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 20, baseDoseIndication: 'Type 2 Diabetes' },
  'atorvastatin': { pregnancyCategory: 'X', pregnancyPrecautions: 'CONTRAINDICATED IN PREGNANCY.', breastfeedingSafety: 'Contraindicated.', g6pdSafety: 'Safe' },
  'ibuprofen': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in 3rd trimester.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Caution', g6pdWarning: 'May trigger hemolysis in G6PD deficiency', baseDoseMgPerKg: 10, baseDoseIndication: 'Pain/Inflammation' },
  'paracetamol': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe at recommended doses.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 15, baseDoseIndication: 'Pain/Fever' },
  'panadol': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe at recommended doses.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 15, baseDoseIndication: 'Pain/Fever' },
  'augmentin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe for infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 25, baseDoseIndication: 'Respiratory infection' },
  'azithromycin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use only if needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 10, baseDoseIndication: 'Respiratory infection' },
  'omeprazole': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'losartan': { pregnancyCategory: 'D', pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'lisinopril': { pregnancyCategory: 'D', pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'amlodipine': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'gliclazide': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only in 2nd/3rd trimester if needed.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'salbutamol': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'prednisolone': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use lowest effective dose.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 1, baseDoseIndication: 'Inflammation' },
  'ranitidine': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'metronidazole': { pregnancyCategory: 'B', pregnancyPrecautions: 'Avoid in 1st trimester.', breastfeedingSafety: 'Discontinue for 24h.', g6pdSafety: 'Safe' },
  'diclofenac': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in 3rd trimester.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'cetirizine': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'loratadine': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'ciprofloxacin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in pregnancy.', breastfeedingSafety: 'Discontinue breastfeeding.', g6pdSafety: 'Safe', baseDoseMgPerKg: 15 },
  'levofloxacin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in pregnancy.', breastfeedingSafety: 'Discontinue breastfeeding.', g6pdSafety: 'Safe', baseDoseMgPerKg: 15 },
  'moxifloxacin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in pregnancy.', breastfeedingSafety: 'Discontinue breastfeeding.', g6pdSafety: 'Safe', baseDoseMgPerKg: 15 },
  'co-trimoxazole': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid near term.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Contraindicated', g6pdWarning: 'CONTRAINDICATED in G6PD deficiency' },
  'dapsone': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Contraindicated.', g6pdSafety: 'Contraindicated' },
  'nitrofurantoin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Avoid in G6PD-deficient infants.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Caution' },
  'warfarin': { pregnancyCategory: 'X', pregnancyPrecautions: 'CONTRAINDICATED - teratogenic.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'simvastatin': { pregnancyCategory: 'X', pregnancyPrecautions: 'CONTRAINDICATED IN PREGNANCY.', breastfeedingSafety: 'Contraindicated.', g6pdSafety: 'Safe' },
  'fluvastatin': { pregnancyCategory: 'X', pregnancyPrecautions: 'CONTRAINDICATED IN PREGNANCY.', breastfeedingSafety: 'Contraindicated.', g6pdSafety: 'Safe' },
  'rosuvastatin': { pregnancyCategory: 'X', pregnancyPrecautions: 'CONTRAINDICATED IN PREGNANCY.', breastfeedingSafety: 'Contraindicated.', g6pdSafety: 'Safe' },
  'furosemide': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if clearly needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'spironolactone': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'hydrochlorothiazide': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use with caution.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'metoprolol': { pregnancyCategory: 'C', pregnancyPrecautions: 'Monitor fetal growth.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 2 },
  'atenolol': { pregnancyCategory: 'D', pregnancyPrecautions: 'Risk of fetal growth restriction.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'bisoprolol': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  ' carvedilol': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'digoxin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use with caution.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'amiodarone': { pregnancyCategory: 'D', pregnancyPrecautions: 'CONTRAINDICATED - contains iodine.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'clopidogrel': { pregnancyCategory: 'B', pregnancyPrecautions: 'Limited human data.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'enoxaparin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe for anticoagulation.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'heparin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe for anticoagulation.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'omeprazole': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'pantoprazole': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'esomeprazole': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'lansoprazole': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'levothyroxine': { pregnancyCategory: 'A', pregnancyPrecautions: 'Safe and essential during pregnancy.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'carbimazole': { pregnancyCategory: 'D', pregnancyPrecautions: 'Risk of fetal malformations.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'propafenone': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'sotalol': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use with caution.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'gabapentin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefit justifies potential fetal risk.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'pregabalin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefit justifies potential fetal risk.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'lamotrigine': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use with caution - may need dose adjustment.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'valproate': { pregnancyCategory: 'X', pregnancyPrecautions: 'CONTRAINDICATED - teratogenic.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'phenytoin': { pregnancyCategory: 'D', pregnancyPrecautions: 'Risk of fetal malformations.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'phenobarbital': { pregnancyCategory: 'D', pregnancyPrecautions: 'Risk of fetal malformations.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'carbamazepine': { pregnancyCategory: 'D', pregnancyPrecautions: 'Risk of fetal malformations.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'topiramate': { pregnancyCategory: 'D', pregnancyPrecautions: 'Risk of fetal malformations.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'sertraline': { pregnancyCategory: 'C', pregnancyPrecautions: 'Benefits may outweigh risks in depression.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 1 },
  'fluoxetine': { pregnancyCategory: 'C', pregnancyPrecautions: 'Benefits may outweigh risks in depression.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 1 },
  'escitalopram': { pregnancyCategory: 'C', pregnancyPrecautions: 'Benefits may outweigh risks in depression.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 0.5 },
  'paroxetine': { pregnancyCategory: 'D', pregnancyPrecautions: 'Risk of fetal malformations.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'venlafaxine': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use with caution.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 1 },
  'duloxetine': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'tramadol': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use with caution.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe', baseDoseMgPerKg: 1 },
  'codeine': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use with caution; risk of neonatal withdrawal.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'morphine': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use with caution.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'fentanyl': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use with caution.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'methadone': { pregnancyCategory: 'C', pregnancyPrecautions: 'Neonatal withdrawal possible.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'lithium': { pregnancyCategory: 'D', pregnancyPrecautions: 'Risk of fetal cardiac anomalies.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'acyclovir': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use for active herpes infection.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'valacyclovir': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use for active herpes infection.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'oseltamivir': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only for confirmed influenza.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'ribavirin': { pregnancyCategory: 'X', pregnancyPrecautions: 'CONTRAINDICATED - teratogenic.', breastfeedingSafety: 'Contraindicated.', g6pdSafety: 'Safe' },
  'interferon': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if clearly needed.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'chloroquine': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only for malaria prophylaxis.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'hydroxychloroquine': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if clearly needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'mefloquine': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid if possible.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'atovaquone': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'doxycycline': { pregnancyCategory: 'D', pregnancyPrecautions: 'Contraindicated - affects fetal bone and tooth development.', breastfeedingSafety: 'Contraindicated.', g6pdSafety: 'Safe' },
  'minocycline': { pregnancyCategory: 'D', pregnancyPrecautions: 'Contraindicated - affects fetal bone and tooth development.', breastfeedingSafety: 'Contraindicated.', g6pdSafety: 'Safe' },
  'tetracycline': { pregnancyCategory: 'D', pregnancyPrecautions: 'Contraindicated - affects fetal bone and tooth development.', breastfeedingSafety: 'Contraindicated.', g6pdSafety: 'Safe' },
  'ciprofloxacin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in pregnancy.', breastfeedingSafety: 'Discontinue breastfeeding.', g6pdSafety: 'Safe' },
  'norfloxacin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in pregnancy.', breastfeedingSafety: 'Discontinue breastfeeding.', g6pdSafety: 'Safe' },
  'ofloxacin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid in pregnancy.', breastfeedingSafety: 'Discontinue breastfeeding.', g6pdSafety: 'Safe' },
  'gentamicin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if clearly needed - potential ototoxicity.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'tobramycin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if clearly needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'amikacin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if clearly needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'vancomycin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use for serious infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'linezolid': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'daptomycin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use for serious infections.', breastfeedingSafety: 'Unknown.', g6pdSafety: 'Safe' },
  'colistin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'polymyxin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'ertapenem': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use for serious infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'meropenem': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use for serious infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'imipenem': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use for serious infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'piperacillin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use for serious infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'cefotaxime': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use for serious infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'ceftriaxone': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use for serious infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'cefuroxime': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use for respiratory infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'cefixime': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use for respiratory infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'cephalexin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use for skin infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'clindamycin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use for anaerobic infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'erythromycin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use for respiratory infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'clarithromycin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if clearly needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'roxithromycin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if clearly needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'telithromycin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if clearly needed.', breastfeedingSafety: 'Unknown.', g6pdSafety: 'Safe' },
  'streptomycin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only for TB - potential ototoxicity.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'isoniazid': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use with pyridoxine supplementation.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'rifampicin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use for TB treatment.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'ethambutol': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use for TB treatment.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'pyrazinamide': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use for TB treatment.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'ethionamide': { pregnancyCategory: 'X', pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'cycloserine': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'para-aminosalicylic': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if clearly needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'capreomycin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only for MDR-TB.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'fluconazole': { pregnancyCategory: 'C', pregnancyPrecautions: 'High doses - risk of fetal abnormalities.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'itraconazole': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if clearly needed.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'voriconazole': { pregnancyCategory: 'D', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'posaconazole': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only for invasive fungal infections.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'ketoconazole': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only for systemic fungal infections.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'miconazole': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if clearly needed.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'clotrimazole': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe for topical fungal infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'nystatin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe for topical fungal infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'amphotericin': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use for serious fungal infections.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'flucytosine': { pregnancyCategory: 'C', pregnancyPrecautions: 'Use only if benefits outweigh risks.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'griseofulvin': { pregnancyCategory: 'C', pregnancyPrecautions: 'Avoid if possible.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'terbinafine': { pregnancyCategory: 'B', pregnancyPrecautions: 'Use only if clearly needed.', breastfeedingSafety: 'Not recommended.', g6pdSafety: 'Safe' },
  'butenafine': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe for topical use.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'naftifine': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe for topical use.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'tolnaftate': { pregnancyCategory: 'D', pregnancyPrecautions: 'Avoid if possible.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' },
  'butenafine': { pregnancyCategory: 'B', pregnancyPrecautions: 'Safe for topical use.', breastfeedingSafety: 'Compatible.', g6pdSafety: 'Safe' }
}

async function populateClinicalData() {
  console.log('Populating clinical data...')
  
  const drugs = await prisma.drug.findMany({
    where: { status: 'Active' },
    select: { id: true, packageName: true, genericName: true },
    take: 5000
  })
  
  console.log(`Found ${drugs.length} active drugs`)
  
  let updated = 0
  for (const drug of drugs) {
    const name = ((drug.genericName || drug.packageName || '').toLowerCase()).trim()
    
    let data: any = null
    for (const [key, value] of Object.entries(CLINICAL_DATA)) {
      if (name.includes(key) || key.includes(name)) {
        data = value
        break
      }
    }
    
    if (data) {
      await prisma.drug.update({
        where: { id: drug.id },
        data: {
          pregnancyCategory: data.pregnancyCategory || null,
          pregnancyPrecautions: data.pregnancyPrecautions || null,
          breastfeedingSafety: data.breastfeedingSafety || null,
          g6pdSafety: data.g6pdSafety || null,
          g6pdWarning: data.g6pdWarning || null,
          baseDoseMgPerKg: data.baseDoseMgPerKg || null,
          baseDoseIndication: data.baseDoseIndication || null
        }
      })
      updated++
      if (updated % 50 === 0) console.log(`Updated ${updated} drugs...`)
    }
  }
  
  console.log(`\n✅ Complete! Updated ${updated} drugs with clinical data`)
  
  await prisma.$disconnect()
}

populateClinicalData().catch(console.error)