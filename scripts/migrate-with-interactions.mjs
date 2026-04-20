#!/usr/bin/env node
/**
 * Migration that preserves original CUIDs for proper interaction mapping
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import Database from 'better-sqlite3';

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
  console.log('🚀 MIGRATION WITH INTERACTIONS TO NEON');
  console.log('══════════════════════════════════════════════════\n');

  console.log('Connecting...');
  await sql`SELECT NOW()`;
  console.log('✅ Connected to Neon\n');

  const sqlite = new Database('db/custom.db', { readonly: true });

  // Clear tables
  console.log('🧹 Clearing tables...');
  await sql`TRUNCATE TABLE "DrugInteraction", "ICD10Mapping", "Drug" CASCADE`;
  console.log('✅ Tables cleared\n');

  // Import Drugs - PRESERVE ORIGINAL CUIDs
  console.log('💊 Importing Drugs (preserving original IDs)...');
  const drugs = sqlite.prepare('SELECT * FROM Drug').all();
  console.log(`   Source: ${drugs.length.toLocaleString()} drugs`);

  let drugImported = 0;
  let batch = [];

  for (const d of drugs) {
    // Use the original CUID from SQLite
    batch.push([
      d.id, d.drugCode, d.packageName, d.genericName, d.strength, d.dosageForm,
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

  // Get valid drugIds first
  console.log('🗂️  Building valid drug ID list...');
  const validDrugIds = new Set(drugs.map(d => d.id));
  console.log(`   Found ${validDrugIds.size} valid drug IDs`);

  // Import ICD10 Mappings
  console.log('🏥 Importing ICD10 Mappings...');
  const mappings = sqlite.prepare('SELECT * FROM ICD10Mapping').all();
  console.log(`   Source: ${mappings.length.toLocaleString()} mappings`);

  let mappingImported = 0;
  let mappingSkipped = 0;
  const seenKeys = new Set();
  batch = [];

  for (const m of mappings) {
    // Skip if no drugId or no icd10Code or invalid drugId
    if (!m.drugId || !m.icd10Code || !validDrugIds.has(m.drugId)) {
      mappingSkipped++;
      continue;
    }
    
    // Skip duplicates
    const key = `${m.drugId}-${m.icd10Code}`;
    if (seenKeys.has(key)) {
      mappingSkipped++;
      continue;
    }
    seenKeys.add(key);
    
    batch.push([
      crypto.randomUUID(), m.drugId, m.icd10Code, m.description, m.category, new Date()
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

  // Import Drug Interactions
  console.log('⚡ Importing Drug Interactions...');
  const interactions = sqlite.prepare('SELECT * FROM DrugInteraction').all();
  console.log(`   Source: ${interactions.length.toLocaleString()} interactions`);

  let ixImported = 0;
  let ixSkipped = 0;
  batch = [];

  for (const ix of interactions) {
    // Skip if no drugId or invalid drugId
    if (!ix.drugId || !validDrugIds.has(ix.drugId)) {
      ixSkipped++;
      continue;
    }
    
    // Use original drugId (CUID), and interactingDrugId if available
    const drugId = ix.drugId;
    const secondaryDrugId = ix.interactingDrugId || null;
    
    batch.push([
      crypto.randomUUID(), drugId, secondaryDrugId, ix.interactingDrugName, ix.severity,
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
  
  console.log(`   ✅ Imported ${ixImported.toLocaleString()} interactions (skipped: ${ixSkipped.toLocaleString()})\n`);

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
