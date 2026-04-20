#!/usr/bin/env node
/**
 * Final Import using Neon Serverless Driver
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { randomUUID } from 'crypto';

const sql = neon(process.env.DIRECT_URL || process.env.DATABASE_URL);

async function importFromSqlite() {
  console.log('🚀 Connecting to Neon PostgreSQL...');
  
  // Test connection
  const result = await sql`SELECT NOW()`;
  console.log('✅ Connected');
  
  // Clear tables
  console.log('\n🧹 Clearing existing data...');
  await sql`TRUNCATE TABLE "Drug", "ICD10Mapping", "DrugInteraction" CASCADE`;
  
  // Import Drugs
  console.log('\n💊 Importing Drugs...');
  const drugsData = readFileSync('db/custom.db'); // We'll query directly
  
  const Database = (await import('better-sqlite3')).default;
  const sqlite = new Database('db/custom.db');
  
  const drugs = sqlite.prepare('SELECT * FROM Drug').all();
  console.log(`   Found ${drugs.length} drugs`);
  
  let imported = 0;
  let skipped = 0;
  
  for (let i = 0; i < drugs.length; i++) {
    const drug = drugs[i];
    try {
      await sql`
        INSERT INTO "Drug" (
          id, "drugCode", "packageName", "genericName", strength, "dosageForm", "packageSize", 
          status, "dispenseMode", "packagePricePublic", "packagePricePharmacy", 
          "unitPricePublic", "unitPricePharmacy", "agentName", "manufacturerName", 
          "insurancePlan", "govtFundedCoverage", "uppScope", "includedInThiqaABM", 
          "includedInBasic", "includedInABM1", "includedInABM7", "pregnancyCategory", 
          "breastfeedingSafety", "renalAdjustment", "createdAt", "updatedAt"
        ) VALUES (
          ${randomUUID()}, ${drug.drugCode}, ${drug.packageName}, ${drug.genericName}, 
          ${drug.strength}, ${drug.dosageForm}, ${drug.packageSize}, ${drug.status}, 
          ${drug.dispenseMode}, ${drug.packagePricePublic}, ${drug.packagePricePharmacy}, 
          ${drug.unitPricePublic}, ${drug.unitPricePharmacy}, ${drug.agentName}, 
          ${drug.manufacturerName}, ${drug.insurancePlan}, ${drug.govtFundedCoverage}, 
          ${drug.uppScope}, ${drug.includedInThiqaABM}, ${drug.includedInBasic}, 
          ${drug.includedInABM1}, ${drug.includedInABM7}, ${drug.pregnancyCategory}, 
          ${drug.breastfeedingSafety}, ${drug.renalAdjustment}, NOW(), NOW()
        )
        ON CONFLICT ("drugCode") DO NOTHING
      `;
      imported++;
    } catch (e) {
      skipped++;
    }
    
    if ((i + 1) % 500 === 0) {
      process.stdout.write(`\r   Progress: ${i + 1}/${drugs.length} (imported: ${imported}, skipped: ${skipped})`);
    }
  }
  
  console.log(`\r   ✅ Imported ${imported} drugs (skipped: ${skipped})`);
  
  // Build drug map
  console.log('\n🗺️  Building drug map...');
  const drugRows = await sql`SELECT id, "drugCode" FROM "Drug"`;
  const drugMap = new Map();
  for (const row of drugRows) {
    drugMap.set(row.drugCode, row.id);
  }
  console.log(`   Mapped ${drugMap.size} drugs`);
  
  // Import ICD10
  console.log('\n🏥 Importing ICD10 Mappings...');
  const icd10s = sqlite.prepare('SELECT * FROM ICD10Mapping').all();
  let icd10Imported = 0;
  
  for (let i = 0; i < icd10s.length; i++) {
    const m = icd10s[i];
    const drugId = drugMap.get(m.drugCode);
    if (!drugId) continue;
    
    try {
      await sql`
        INSERT INTO "ICD10Mapping" (id, "drugId", code, description, system, "createdAt", "updatedAt")
        VALUES (${randomUUID()}, ${drugId}, ${m.code}, ${m.description}, ${m.system || 'ICD10'}, NOW(), NOW())
      `;
      icd10Imported++;
    } catch (e) {}
    
    if ((i + 1) % 500 === 0) {
      process.stdout.write(`\r   Progress: ${i + 1}/${icd10s.length} (imported: ${icd10Imported})`);
    }
  }
  console.log(`\r   ✅ Imported ${icd10Imported} ICD10 mappings`);
  
  // Import Interactions
  console.log('\n⚡ Importing Drug Interactions...');
  const interactions = sqlite.prepare('SELECT * FROM DrugInteraction').all();
  let ixImported = 0;
  
  for (let i = 0; i < interactions.length; i++) {
    const ix = interactions[i];
    const drugId = drugMap.get(ix.drugCode);
    const interactingDrugId = drugMap.get(ix.interactingDrugCode);
    if (!drugId || !interactingDrugId) continue;
    
    try {
      await sql`
        INSERT INTO "DrugInteraction" (
          id, "drugId", "interactingDrugId", "interactingDrugName", severity, 
          mechanism, recommendation, "isHypothetical", references, "createdAt", "updatedAt"
        ) VALUES (
          ${randomUUID()}, ${drugId}, ${interactingDrugId}, ${ix.interactingDrugName}, 
          ${ix.severity}, ${ix.mechanism}, ${ix.recommendation}, ${ix.isHypothetical || false}, 
          ${ix.references || '[]'}, NOW(), NOW()
        )
      `;
      ixImported++;
    } catch (e) {}
  }
  console.log(`   ✅ Imported ${ixImported} interactions`);
  
  sqlite.close();
  
  // Final counts
  console.log('\n📊 Final Counts:');
  const counts = await sql`
    SELECT 
      (SELECT COUNT(*) FROM "Drug") as drugs,
      (SELECT COUNT(*) FROM "ICD10Mapping") as icd10,
      (SELECT COUNT(*) FROM "DrugInteraction") as interactions
  `;
  console.log(`   Drugs: ${counts[0].drugs}`);
  console.log(`   ICD10: ${counts[0].icd10}`);
  console.log(`   Interactions: ${counts[0].interactions}`);
}

importFromSqlite().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
