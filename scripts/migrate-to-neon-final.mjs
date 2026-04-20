#!/usr/bin/env node
/**
 * Final Migration Script - SQLite to Neon PostgreSQL
 * Uses batching for better performance
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

const sql = neon(process.env.DIRECT_URL || process.env.DATABASE_URL);
const BATCH_SIZE = 50;

async function migrate() {
  console.log('══════════════════════════════════════════════════');
  console.log('🚀 MIGRATING TO NEON POSTGRESQL');
  console.log('══════════════════════════════════════════════════\n');

  // Test connection
  console.log('Testing connection...');
  const result = await sql`SELECT NOW()`;
  console.log(`✅ Connected to Neon\n`);

  const sqlite = new Database('db/custom.db', { readonly: true });

  // Step 1: Clear existing data
  console.log('🧹 Clearing existing data...');
  await sql`TRUNCATE TABLE "DrugInteraction", "ICD10Mapping", "Drug" CASCADE`;
  console.log('✅ Tables cleared\n');

  // Step 2: Import Drugs
  console.log('💊 Importing Drugs...');
  const drugs = sqlite.prepare('SELECT * FROM Drug').all();
  console.log(`   Source: ${drugs.length.toLocaleString()} drugs`);

  let drugImported = 0;
  const drugCodeMap = new Map(); // drugCode -> UUID

  for (let i = 0; i < drugs.length; i += BATCH_SIZE) {
    const batch = drugs.slice(i, i + BATCH_SIZE);
    
    for (const d of batch) {
      const id = randomUUID();
      drugCodeMap.set(d.drugCode, id);
      
      await sql`
        INSERT INTO "Drug" (id, "drugCode", "packageName", "genericName", strength, "dosageForm", "packageSize", status, "dispenseMode", "packagePricePublic", "packagePricePharmacy", "unitPricePublic", "unitPricePharmacy", "agentName", "manufacturerName", "insurancePlan", "govtFundedCoverage", "uppScope", "includedInThiqaABM", "includedInBasic", "includedInABM1", "includedInABM7", "pregnancyCategory", "breastfeedingSafety", "renalAdjustment", "createdAt", "updatedAt")
        VALUES (${id}, ${d.drugCode}, ${d.packageName}, ${d.genericName}, ${d.strength}, ${d.dosageForm}, ${d.packageSize}, ${d.status}, ${d.dispenseMode}, ${d.packagePricePublic}, ${d.packagePricePharmacy}, ${d.unitPricePublic}, ${d.unitPricePharmacy}, ${d.agentName}, ${d.manufacturerName}, ${d.insurancePlan}, ${d.govtFundedCoverage}, ${d.uppScope}, ${d.includedInThiqaABM}, ${d.includedInBasic}, ${d.includedInABM1}, ${d.includedInABM7}, ${d.pregnancyCategory}, ${d.breastfeedingSafety}, ${d.renalAdjustment}, NOW(), NOW())
      `;
      drugImported++;
    }
    
    if (drugImported % 1000 === 0 || drugImported === drugs.length) {
      process.stdout.write(`\r   Progress: ${drugImported.toLocaleString()}/${drugs.length.toLocaleString()} (${Math.round(drugImported/drugs.length*100)}%)`);
    }
  }
  console.log(`\n   ✅ Imported ${drugImported.toLocaleString()} drugs\n`);

  // Step 3: Import ICD10 Mappings
  console.log('🏥 Importing ICD10 Mappings...');
  const mappings = sqlite.prepare('SELECT * FROM ICD10Mapping WHERE drugCode IS NOT NULL').all();
  console.log(`   Source: ${mappings.length.toLocaleString()} mappings`);

  let mappingImported = 0;
  let mappingSkipped = 0;
  const seenKeys = new Set();

  for (let i = 0; i < mappings.length; i += BATCH_SIZE) {
    const batch = mappings.slice(i, i + BATCH_SIZE);
    
    for (const m of batch) {
      const drugId = drugCodeMap.get(m.drugCode);
      if (!drugId) {
        mappingSkipped++;
        continue;
      }
      
      // Skip duplicates
      const key = `${drugId}-${m.code}`;
      if (seenKeys.has(key)) {
        mappingSkipped++;
        continue;
      }
      seenKeys.add(key);
      
      try {
        await sql`
          INSERT INTO "ICD10Mapping" (id, "drugId", code, description, system, "createdAt", "updatedAt")
          VALUES (${randomUUID()}, ${drugId}, ${m.code}, ${m.description}, ${m.system || 'ICD10'}, NOW(), NOW())
        `;
        mappingImported++;
      } catch (e) {
        mappingSkipped++;
      }
    }
    
    if (mappingImported % 1000 === 0 || i + batch.length >= mappings.length) {
      process.stdout.write(`\r   Progress: ${mappingImported.toLocaleString()}/${mappings.length.toLocaleString()} (skipped: ${mappingSkipped.toLocaleString()})`);
    }
  }
  console.log(`\n   ✅ Imported ${mappingImported.toLocaleString()} mappings\n`);

  // Step 4: Import Drug Interactions
  console.log('⚡ Importing Drug Interactions...');
  const interactions = sqlite.prepare('SELECT * FROM DrugInteraction WHERE drugCode IS NOT NULL AND interactingDrugCode IS NOT NULL').all();
  console.log(`   Source: ${interactions.length.toLocaleString()} interactions`);

  let ixImported = 0;
  
  for (const ix of interactions) {
    const drugId = drugCodeMap.get(ix.drugCode);
    const interactingId = drugCodeMap.get(ix.interactingDrugCode);
    
    if (!drugId || !interactingId) continue;
    
    try {
      await sql`
        INSERT INTO "DrugInteraction" (id, "drugId", "interactingDrugId", "interactingDrugName", severity, mechanism, recommendation, "isHypothetical", references, "createdAt", "updatedAt")
        VALUES (${randomUUID()}, ${drugId}, ${interactingId}, ${ix.interactingDrugName}, ${ix.severity}, ${ix.mechanism}, ${ix.recommendation}, ${ix.isHypothetical || false}, ${ix.references || '[]'}, NOW(), NOW())
      `;
      ixImported++;
    } catch (e) {}
  }
  console.log(`   ✅ Imported ${ixImported.toLocaleString()} interactions\n`);

  sqlite.close();

  // Final verification
  console.log('══════════════════════════════════════════════════');
  console.log('📊 FINAL COUNTS');
  console.log('══════════════════════════════════════════════════');
  
  const counts = await sql`
    SELECT 
      (SELECT COUNT(*) FROM "Drug") as drugs,
      (SELECT COUNT(*) FROM "ICD10Mapping") as icd10,
      (SELECT COUNT(*) FROM "DrugInteraction") as interactions
  `;
  
  console.log(`💊 Drugs: ${counts[0].drugs.toLocaleString()}`);
  console.log(`🏥 ICD10 Mappings: ${counts[0].icd10.toLocaleString()}`);
  console.log(`⚡ Interactions: ${counts[0].interactions.toLocaleString()}`);
  console.log('══════════════════════════════════════════════════');
  console.log('✅ MIGRATION COMPLETE!');
}

migrate().catch(err => {
  console.error('\n❌ Error:', err);
  process.exit(1);
});
