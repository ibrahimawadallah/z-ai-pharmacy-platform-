#!/usr/bin/env node
/**
 * Batch INSERT for Neon PostgreSQL
 * Faster than row-by-row, simpler than COPY
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

const sql = neon(process.env.DIRECT_URL || process.env.DATABASE_URL);
const BATCH_SIZE = 100;

async function batchInsert(table, columns, valuesList) {
  if (valuesList.length === 0) return 0;
  
  const placeholders = valuesList.map((_, i) => 
    `(${columns.map((_, j) => `$${i * columns.length + j + 1}`).join(', ')})`
  ).join(', ');
  
  const flatValues = valuesList.flat();
  
  const query = `INSERT INTO "${table}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES ${placeholders}`;
  
  await sql.query(query, flatValues);
  return valuesList.length;
}

async function migrate() {
  console.log('══════════════════════════════════════════════════');
  console.log('🚀 BATCH INSERT MIGRATION TO NEON');
  console.log('══════════════════════════════════════════════════\n');

  console.log('Connecting...');
  await sql`SELECT NOW()`;
  console.log('✅ Connected to Neon\n');

  const sqlite = new Database('db/custom.db', { readonly: true });

  // Clear tables
  console.log('🧹 Clearing tables...');
  await sql`TRUNCATE TABLE "DrugInteraction", "ICD10Mapping", "Drug" CASCADE`;
  console.log('✅ Tables cleared\n');

  // Import Drugs
  console.log('💊 Importing Drugs...');
  const drugs = sqlite.prepare('SELECT * FROM Drug').all();
  console.log(`   Source: ${drugs.length.toLocaleString()} drugs`);

  let drugImported = 0;
  const drugIdMap = new Map(); // sqlite id -> UUID
  let batch = [];

  for (const d of drugs) {
    const id = randomUUID();
    drugIdMap.set(d.id, id);
    
    batch.push([
      id, d.drugCode, d.packageName, d.genericName, d.strength, d.dosageForm,
      d.packageSize, d.status, d.dispenseMode, d.packagePricePublic, d.packagePricePharmacy,
      d.unitPricePublic, d.unitPricePharmacy, d.agentName, d.manufacturerName,
      d.insurancePlan, d.govtFundedCoverage, d.uppScope, d.includedInThiqaABM,
      d.includedInBasic, d.includedInABM1, d.includedInABM7, d.pregnancyCategory,
      d.breastfeedingSafety, d.renalAdjustment, new Date(), new Date()
    ]);
    
    if (batch.length >= BATCH_SIZE) {
      await batchInsert('Drug', [
        'id', 'drugCode', 'packageName', 'genericName', 'strength', 'dosageForm',
        'packageSize', 'status', 'dispenseMode', 'packagePricePublic', 'packagePricePharmacy',
        'unitPricePublic', 'unitPricePharmacy', 'agentName', 'manufacturerName',
        'insurancePlan', 'govtFundedCoverage', 'uppScope', 'includedInThiqaABM',
        'includedInBasic', 'includedInABM1', 'includedInABM7', 'pregnancyCategory',
        'breastfeedingSafety', 'renalAdjustment', 'createdAt', 'updatedAt'
      ], batch);
      drugImported += batch.length;
      batch = [];
      
      if (drugImported % 1000 === 0) {
        process.stdout.write(`\r   Progress: ${drugImported.toLocaleString()}/${drugs.length.toLocaleString()} (${Math.round(drugImported/drugs.length*100)}%)`);
      }
    }
  }
  
  // Insert remaining
  if (batch.length > 0) {
    await batchInsert('Drug', [
      'id', 'drugCode', 'packageName', 'genericName', 'strength', 'dosageForm',
      'packageSize', 'status', 'dispenseMode', 'packagePricePublic', 'packagePricePharmacy',
      'unitPricePublic', 'unitPricePharmacy', 'agentName', 'manufacturerName',
      'insurancePlan', 'govtFundedCoverage', 'uppScope', 'includedInThiqaABM',
      'includedInBasic', 'includedInABM1', 'includedInABM7', 'pregnancyCategory',
      'breastfeedingSafety', 'renalAdjustment', 'createdAt', 'updatedAt'
    ], batch);
    drugImported += batch.length;
  }
  
  console.log(`\n   ✅ Imported ${drugImported.toLocaleString()} drugs\n`);

  // Import ICD10
  console.log('🏥 Importing ICD10 Mappings...');
  const mappings = sqlite.prepare('SELECT * FROM ICD10Mapping').all();
  console.log(`   Source: ${mappings.length.toLocaleString()} mappings`);

  let mappingImported = 0;
  let mappingSkipped = 0;
  const seenKeys = new Set();
  batch = [];

  for (const m of mappings) {
    const drugId = drugIdMap.get(m.drugId);
    if (!drugId) {
      mappingSkipped++;
      continue;
    }
    
    const key = `${drugId}-${m.icd10Code}`;
    if (seenKeys.has(key)) {
      mappingSkipped++;
      continue;
    }
    seenKeys.add(key);
    
    batch.push([
      randomUUID(), drugId, m.icd10Code, m.description, m.category, new Date()
    ]);
    
    if (batch.length >= BATCH_SIZE) {
      await batchInsert('ICD10Mapping', ['id', 'drugId', 'icd10Code', 'description', 'category', 'createdAt'], batch);
      mappingImported += batch.length;
      batch = [];
      
      if (mappingImported % 1000 === 0) {
        process.stdout.write(`\r   Progress: ${mappingImported.toLocaleString()}/${mappings.length.toLocaleString()}`);
      }
    }
  }
  
  if (batch.length > 0) {
    await batchInsert('ICD10Mapping', ['id', 'drugId', 'icd10Code', 'description', 'category', 'createdAt'], batch);
    mappingImported += batch.length;
  }
  
  console.log(`\n   ✅ Imported ${mappingImported.toLocaleString()} mappings (skipped: ${mappingSkipped.toLocaleString()})\n`);

  // Import Interactions
  console.log('⚡ Importing Interactions...');
  const interactions = sqlite.prepare('SELECT * FROM DrugInteraction').all();
  console.log(`   Source: ${interactions.length.toLocaleString()} interactions`);

  let ixImported = 0;
  batch = [];

  for (const ix of interactions) {
    const drugId = drugIdMap.get(ix.drugId);
    const interactingId = drugIdMap.get(ix.interactingDrugId);
    if (!drugId || !interactingId) continue;
    
    batch.push([
      randomUUID(), drugId, interactingId, ix.interactingDrugName, ix.severity,
      ix.description, ix.mechanism, ix.recommendation, new Date()
    ]);
    
    if (batch.length >= BATCH_SIZE) {
      await batchInsert('DrugInteraction', [
        'id', 'drugId', 'secondaryDrugId', 'secondaryDrugName', 'severity',
        'description', 'interactionType', 'management', 'createdAt'
      ], batch);
      ixImported += batch.length;
      batch = [];
    }
  }
  
  if (batch.length > 0) {
    await batchInsert('DrugInteraction', [
      'id', 'drugId', 'secondaryDrugId', 'secondaryDrugName', 'severity',
      'description', 'interactionType', 'management', 'createdAt'
    ], batch);
    ixImported += batch.length;
  }
  
  console.log(`   ✅ Imported ${ixImported.toLocaleString()} interactions\n`);

  sqlite.close();

  // Verify
  console.log('══════════════════════════════════════════════════');
  console.log('📊 FINAL COUNTS');
  console.log('══════════════════════════════════════════════════');
  
  const counts = await sql`SELECT (SELECT COUNT(*) FROM "Drug") as drugs, (SELECT COUNT(*) FROM "ICD10Mapping") as icd10, (SELECT COUNT(*) FROM "DrugInteraction") as interactions`;
  
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
