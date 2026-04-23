// Manually set environment variables to bypass dotenv issues
process.env.DATABASE_URL = "postgresql://neondb_owner:npg_QNEzlKjg4J3p@ep-shiny-king-adsne10e-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&pool_timeout=10&connection_limit=1"
process.env.DIRECT_URL = "postgresql://neondb_owner:npg_QNEzlKjg4J3p@ep-shiny-king-adsne10e-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

// Enhanced clinical data extraction from FDA
async function fetchFromFDA(searchTerm) {
  try {
    const url = `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(searchTerm)}&limit=10`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`FDA API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.warn(`FDA fetch error for '${searchTerm}':`, error.message);
    return [];
  }
}

function extractPregnancyCategory(pregnancyText) {
  if (!pregnancyText) return null;
  
  const text = pregnancyText.toLowerCase();
  if (text.includes('category a')) return 'A';
  if (text.includes('category b')) return 'B';
  if (text.includes('category c')) return 'C';
  if (text.includes('category d')) return 'D';
  if (text.includes('category x')) return 'X';
  
  return null;
}

function extractBreastfeedingSafety(breastfeedingText) {
  if (!breastfeedingText) return null;
  
  const text = breastfeedingText.toLowerCase();
  if (text.includes('contraindicated') || text.includes('avoid')) return 'Contraindicated';
  if (text.includes('compatible') || text.includes('safe')) return 'Compatible';
  if (text.includes('use with caution') || text.includes('caution')) return 'Caution';
  
  return breastfeedingText; // Return original if no clear classification
}

async function enrichDrugWithFDAData(drugId, packageName, genericName) {
  try {
    // Try multiple search terms
    const searchTerms = [
      genericName,
      packageName,
      ...(packageName ? packageName.split(' ') : []),
      ...(genericName ? genericName.split(' ') : [])
    ].filter(term => term && term.length > 2); // Avoid too short terms
    
    // Try each search term until we get results
    let fdaResults = [];
    for (const term of searchTerms) {
      const results = await fetchFromFDA(term);
      if (results.length > 0) {
        fdaResults = results;
        break;
      }
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (fdaResults.length === 0) {
      return { enriched: false, reason: 'No FDA data found' };
    }
    
    // Extract clinical data from FDA results
    const updateData = {};
    let hasPregnancyData = false;
    let hasG6PDData = false;
    
    for (const result of fdaResults) {
      // Pregnancy category
      if (!hasPregnancyData && result.pregnancy && result.pregnancy[0]) {
        const category = extractPregnancyCategory(result.pregnancy[0]);
        if (category) {
          updateData.pregnancyCategory = category;
          updateData.pregnancyPrecautions = result.pregnancy[0];
          hasPregnancyData = true;
        }
      }
      
      // Breastfeeding safety
      if (result.breastfeeding && result.breastfeeding[0]) {
        updateData.breastfeedingSafety = extractBreastfeedingSafety(result.breastfeeding[0]);
      }
      
      // G6PD safety (look for mentions in warnings or precautions)
      const allText = [
        result.warnings,
        result.precautions,
        result.adverse_reactions
      ].filter(Boolean).join(' ').toLowerCase();
      
      if (!hasG6PDData && allText.includes('g6pd') && allText.includes('deficiency')) {
        updateData.g6pdSafety = 'Contraindicated';
        updateData.g6pdWarning = 'May cause hemolysis in G6PD deficiency';
        hasG6PDData = true;
      } else if (!hasG6PDData && allText.includes('g6pd')) {
        updateData.g6pdSafety = 'Caution';
        updateData.g6pdWarning = 'Use with caution in G6PD deficiency';
        hasG6PDData = true;
      }
    }
    
    // Check if we actually have useful data to update
    const hasUsefulData = Object.keys(updateData).length > 0;
    
    return {
      enriched: hasUsefulData,
      data: updateData,
      source: 'FDA'
    };
  } catch (error) {
    console.error(`Error enriching drug ${drugId}:`, error);
    return { enriched: false, error: error.message };
  }
}

async function enrichAllDrugsWithFDAData() {
  console.log('Starting FDA-based clinical data enrichment...\n');
  
  // Get drugs missing key clinical data
  const drugs = await db.drug.findMany({
    where: {
      status: 'Active',
      OR: [
        { pregnancyCategory: null },
        { g6pdSafety: null }
      ]
    },
    select: {
      id: true,
      packageName: true,
      genericName: true
    },
    orderBy: { packageName: 'asc' }
  });
  
  console.log(`Found ${drugs.length} drugs missing clinical data`);
  
  let enrichedCount = 0;
  let processedCount = 0;
  const batchSize = 25; // Even smaller batch size to be extra careful with rate limits
  
  for (let i = 0; i < drugs.length; i += batchSize) {
    const batch = drugs.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i/batchSize) + 1} (${batch.length} drugs)...`);
    
    for (const drug of batch) {
      processedCount++;
      
      const result = await enrichDrugWithFDAData(
        drug.id, 
        drug.packageName, 
        drug.genericName
      );
      
      if (result.enriched && result.data) {
        try {
          await db.drug.update({
            where: { id: drug.id },
            data: result.data
          });
          
          enrichedCount++;
          
          if (enrichedCount % 5 === 0) {
            console.log(`Enriched ${enrichedCount} drugs so far...`);
          }
        } catch (error) {
          console.error(`Error updating drug ${drug.id}:`, error);
        }
      }
      
      // Rate limiting - delay between drugs
      await new Promise(resolve => setTimeout(resolve, 500)); // Increased delay
    }
    
    // Longer delay between batches
    if (i + batchSize < drugs.length) {
      console.log('Waiting before next batch...');
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay between batches
    }
  }
  
  console.log(`\n=== FDA ENRICHMENT COMPLETE ===`);
  console.log(`Total drugs processed: ${processedCount}`);
  console.log(`Drugs enriched with FDA data: ${enrichedCount}`);
  
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

// Run the enrichment
enrichAllDrugsWithFDAData()
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });