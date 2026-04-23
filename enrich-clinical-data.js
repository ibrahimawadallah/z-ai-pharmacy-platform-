// Manually set environment variables to bypass dotenv issues
process.env.DATABASE_URL = "postgresql://neondb_owner:npg_QNEzlKjg4J3p@ep-shiny-king-adsne10e-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&pool_timeout=10&connection_limit=1"
process.env.DIRECT_URL = "postgresql://neondb_owner:npg_QNEzlKjg4J3p@ep-shiny-king-adsne10e-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

// Extended clinical data for common medications
const EXTENDED_CLINICAL_DATA = {
  'Amoxicillin': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Crosses placenta. Use only if clearly needed.', 
    breastfeedingSafety: 'Compatible. Excreted in low concentrations.', 
    g6pdSafety: 'Safe', 
    baseDoseMgPerKg: 25, 
    baseDoseIndication: 'Respiratory infection' 
  },
  'Metformin': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Continue use in pregnancy for diabetes control.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe', 
    baseDoseMgPerKg: 20, 
    baseDoseIndication: 'Type 2 Diabetes' 
  },
  'Atorvastatin': { 
    pregnancyCategory: 'X', 
    pregnancyPrecautions: 'CONTRAINDICATED IN PREGNANCY.', 
    breastfeedingSafety: 'Contraindicated.', 
    g6pdSafety: 'Safe' 
  },
  'Ibuprofen': { 
    pregnancyCategory: 'C', 
    pregnancyPrecautions: 'Avoid in 3rd trimester.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Caution', 
    g6pdWarning: 'May trigger hemolysis in G6PD deficiency', 
    baseDoseMgPerKg: 10, 
    baseDoseIndication: 'Pain/Inflammation' 
  },
  'Aspirin': { 
    pregnancyCategory: 'C', 
    pregnancyPrecautions: 'Avoid in 3rd trimester.', 
    breastfeedingSafety: 'Compatible in low doses.', 
    g6pdSafety: 'Caution', 
    baseDoseMgPerKg: 10 
  },
  'Co-trimoxazole': { 
    pregnancyCategory: 'C', 
    pregnancyPrecautions: 'Avoid near term.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Contraindicated', 
    g6pdWarning: 'CONTRAINDICATED in G6PD deficiency' 
  },
  'Paracetamol': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Safe at recommended doses.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe', 
    baseDoseMgPerKg: 15, 
    baseDoseIndication: 'Pain/Fever' 
  },
  'Augmentin': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Safe for most infections.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe', 
    baseDoseMgPerKg: 25, 
    baseDoseIndication: 'Respiratory infection' 
  },
  'Ciprofloxacin': { 
    pregnancyCategory: 'C', 
    pregnancyPrecautions: 'Avoid in pregnancy.', 
    breastfeedingSafety: 'Discontinue breastfeeding.', 
    g6pdSafety: 'Safe' 
  },
  'Azithromycin': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Use only if needed.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe', 
    baseDoseMgPerKg: 10, 
    baseDoseIndication: 'Respiratory infection' 
  },
  'Omeprazole': { 
    pregnancyCategory: 'C', 
    pregnancyPrecautions: 'Use only if benefits outweigh risks.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe' 
  },
  'Prednisolone': { 
    pregnancyCategory: 'C', 
    pregnancyPrecautions: 'Use lowest effective dose.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe', 
    baseDoseMgPerKg: 1, 
    baseDoseIndication: 'Inflammation' 
  },
  'Salbutamol': { 
    pregnancyCategory: 'C', 
    pregnancyPrecautions: 'Use only if needed.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe' 
  },
  'Glucophage': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Continue for diabetes control.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe', 
    baseDoseMgPerKg: 20 
  },
  'Amlodipine': { 
    pregnancyCategory: 'C', 
    pregnancyPrecautions: 'Use only if benefits outweigh risks.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe' 
  },
  'Ranitidine': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Safe.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe' 
  },
  'Metronidazole': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Avoid in 1st trimester.', 
    breastfeedingSafety: 'Discontinue for 24h.', 
    g6pdSafety: 'Safe' 
  },
  'Diclofenac': { 
    pregnancyCategory: 'C', 
    pregnancyPrecautions: 'Avoid in 3rd trimester.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe' 
  },
  'Warfarin': { 
    pregnancyCategory: 'D', 
    pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', 
    breastfeedingSafety: 'Not recommended.', 
    g6pdSafety: 'Safe' 
  },
  'Insulin': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Safe for use in pregnancy.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe', 
    baseDoseMgPerKg: 0.1, 
    baseDoseIndication: 'Diabetes' 
  },
  'Levothyroxine': { 
    pregnancyCategory: 'A', 
    pregnancyPrecautions: 'Continue replacement therapy in pregnancy.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe' 
  },
  'Sertraline': { 
    pregnancyCategory: 'C', 
    pregnancyPrecautions: 'Use only if benefits outweigh risks.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe' 
  },
  'Simvastatin': { 
    pregnancyCategory: 'X', 
    pregnancyPrecautions: 'CONTRAINDICATED IN PREGNANCY.', 
    breastfeedingSafety: 'Contraindicated.', 
    g6pdSafety: 'Safe' 
  },
  'Lisinopril': { 
    pregnancyCategory: 'D', 
    pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', 
    breastfeedingSafety: 'Not recommended.', 
    g6pdSafety: 'Safe' 
  },
  'Losartan': { 
    pregnancyCategory: 'D', 
    pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', 
    breastfeedingSafety: 'Not recommended.', 
    g6pdSafety: 'Safe' 
  },
  'Furosemide': { 
    pregnancyCategory: 'C', 
    pregnancyPrecautions: 'Use only if benefits outweigh risks.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe', 
    baseDoseMgPerKg: 1, 
    baseDoseIndication: 'Edema' 
  },
  'Hydrochlorothiazide': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Safe for use in pregnancy.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe', 
    baseDoseMgPerKg: 1, 
    baseDoseIndication: 'Hypertension' 
  },
  'Albuterol': { 
    pregnancyCategory: 'C', 
    pregnancyPrecautions: 'Use only if needed.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe' 
  },
  'Montelukast': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Safe for use in pregnancy.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe' 
  },
  'Cetirizine': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Safe for use in pregnancy.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe' 
  },
  'Loratadine': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Safe for use in pregnancy.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe' 
  },
  'Acetaminophen': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Safe at recommended doses.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe', 
    baseDoseMgPerKg: 15, 
    baseDoseIndication: 'Pain/Fever' 
  },
  'Codeine': { 
    pregnancyCategory: 'C', 
    pregnancyPrecautions: 'Use only if benefits outweigh risks.', 
    breastfeedingSafety: 'Use with caution.', 
    g6pdSafety: 'Safe' 
  },
  'Morphine': { 
    pregnancyCategory: 'C', 
    pregnancyPrecautions: 'Use only if benefits outweigh risks.', 
    breastfeedingSafety: 'Use with caution.', 
    g6pdSafety: 'Safe' 
  },
  'Oxycodone': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Use only if benefits outweigh risks.', 
    breastfeedingSafety: 'Use with caution.', 
    g6pdSafety: 'Safe' 
  },
  'Tramadol': { 
    pregnancyCategory: 'C', 
    pregnancyPrecautions: 'Use only if benefits outweigh risks.', 
    breastfeedingSafety: 'Use with caution.', 
    g6pdSafety: 'Safe' 
  },
  'Diazepam': { 
    pregnancyCategory: 'D', 
    pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', 
    breastfeedingSafety: 'Not recommended.', 
    g6pdSafety: 'Safe' 
  },
  'Lorazepam': { 
    pregnancyCategory: 'D', 
    pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', 
    breastfeedingSafety: 'Not recommended.', 
    g6pdSafety: 'Safe' 
  },
  'Clonazepam': { 
    pregnancyCategory: 'D', 
    pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', 
    breastfeedingSafety: 'Not recommended.', 
    g6pdSafety: 'Safe' 
  },
  'Digoxin': { 
    pregnancyCategory: 'C', 
    pregnancyPrecautions: 'Use only if benefits outweigh risks.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe' 
  },
  'Warfarin': { 
    pregnancyCategory: 'D', 
    pregnancyPrecautions: 'CONTRAINDICATED in pregnancy.', 
    breastfeedingSafety: 'Not recommended.', 
    g6pdSafety: 'Safe' 
  },
  'Heparin': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Safe for use in pregnancy.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe' 
  },
  'Enoxaparin': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Safe for use in pregnancy.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe' 
  },
  'Clopidogrel': { 
    pregnancyCategory: 'B', 
    pregnancyPrecautions: 'Safe for use in pregnancy.', 
    breastfeedingSafety: 'Compatible.', 
    g6pdSafety: 'Safe' 
  },
  'Aspirin': { 
    pregnancyCategory: 'D', 
    pregnancyPrecautions: 'Avoid in 3rd trimester.', 
    breastfeedingSafety: 'Use with caution.', 
    g6pdSafety: 'Safe', 
    baseDoseMgPerKg: 10 
  }
};

async function enrichClinicalData() {
  console.log('Starting clinical data enrichment...\n');
  
  let updatedCount = 0;
  let processedCount = 0;
  
  // Process drugs in batches to avoid memory issues
  const batchSize = 500;
  let offset = 0;
  
  while (true) {
    const drugs = await db.drug.findMany({
      where: { status: 'Active' },
      select: { id: true, packageName: true, genericName: true, pregnancyCategory: true },
      orderBy: { packageName: 'asc' },
      skip: offset,
      take: batchSize
    });
    
    if (drugs.length === 0) break;
    
    console.log(`Processing batch of ${drugs.length} drugs (offset: ${offset})...`);
    
    for (const drug of drugs) {
      processedCount++;
      
      // Skip if already has pregnancy data
      if (drug.pregnancyCategory) continue;
      
      const drugName = (drug.genericName || drug.packageName || '').toLowerCase();
      
      // Find matching clinical data
      let clinicalData = null;
      for (const [key, value] of Object.entries(EXTENDED_CLINICAL_DATA)) {
        if (drugName.includes(key.toLowerCase()) || key.toLowerCase().includes(drugName)) {
          clinicalData = value;
          break;
        }
      }
      
      if (clinicalData) {
        try {
          await db.drug.update({
            where: { id: drug.id },
            data: {
              pregnancyCategory: clinicalData.pregnancyCategory,
              pregnancyPrecautions: clinicalData.pregnancyPrecautions,
              breastfeedingSafety: clinicalData.breastfeedingSafety,
              g6pdSafety: clinicalData.g6pdSafety,
              g6pdWarning: clinicalData.g6pdWarning,
              baseDoseMgPerKg: clinicalData.baseDoseMgPerKg,
              baseDoseIndication: clinicalData.baseDoseIndication
            }
          });
          
          updatedCount++;
          
          if (updatedCount % 50 === 0) {
            console.log(`Updated ${updatedCount} drugs so far...`);
          }
        } catch (error) {
          console.error(`Error updating drug ${drug.id}:`, error);
        }
      }
    }
    
    offset += batchSize;
    console.log(`Completed batch. Total processed: ${processedCount}, Updated: ${updatedCount}\n`);
  }
  
  console.log(`\n=== ENRICHMENT COMPLETE ===`);
  console.log(`Total drugs processed: ${processedCount}`);
  console.log(`Drugs updated with clinical data: ${updatedCount}`);
  
  // Final verification
  const totalWithPregnancy = await db.drug.count({
    where: {
      status: 'Active',
      pregnancyCategory: { not: null }
    }
  });
  
  const totalWithG6PD = await db.drug.count({
    where: {
      status: 'Active',
      g6pdSafety: { not: null }
    }
  });
  
  console.log(`Drugs with pregnancy data: ${totalWithPregnancy}`);
  console.log(`Drugs with G6PD data: ${totalWithG6PD}`);
  
  await db.$disconnect();
}

enrichClinicalData()
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });