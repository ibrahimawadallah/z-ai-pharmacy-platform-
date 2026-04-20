#!/usr/bin/env node
/**
 * Export SQLite data to CSV for Neon import
 */

import Database from 'better-sqlite3';
import { createWriteStream, mkdirSync } from 'fs';

const sqlite = new Database('db/custom.db');

// Ensure export directory exists
try {
  mkdirSync('export', { recursive: true });
} catch (e) {}

function escapeCsv(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function exportTableToCsv(tableName, columns, fileName) {
  console.log(`\n📤 Exporting ${tableName}...`);
  
  const rows = sqlite.prepare(`SELECT * FROM ${tableName}`).all();
  console.log(`   Found ${rows.length} rows`);
  
  const stream = createWriteStream(`export/${fileName}`);
  
  // Header
  stream.write(columns.join(',') + '\n');
  
  // Data rows
  for (const row of rows) {
    const values = columns.map(col => escapeCsv(row[col]));
    stream.write(values.join(',') + '\n');
  }
  
  stream.end();
  console.log(`   ✅ Saved to export/${fileName}`);
  return rows.length;
}

console.log('══════════════════════════════════════════════════');
console.log('📊 EXPORTING SQLITE TO CSV');
console.log('══════════════════════════════════════════════════');

// Export drugs
const drugsCount = exportTableToCsv('Drug', [
  'drugCode', 'packageName', 'genericName', 'strength', 'dosageForm',
  'packageSize', 'status', 'dispenseMode', 'packagePricePublic',
  'packagePricePharmacy', 'unitPricePublic', 'unitPricePharmacy',
  'agentName', 'manufacturerName', 'insurancePlan', 'govtFundedCoverage',
  'uppScope', 'includedInThiqaABM', 'includedInBasic',
  'includedInABM1', 'includedInABM7', 'pregnancyCategory',
  'breastfeedingSafety', 'renalAdjustment'
], 'drugs.csv');

// Export ICD10 mappings
const icd10Count = exportTableToCsv('ICD10Mapping', [
  'drugCode', 'code', 'description', 'system'
], 'icd10_mappings.csv');

// Export drug interactions
const interactionsCount = exportTableToCsv('DrugInteraction', [
  'drugCode', 'interactingDrugCode', 'interactingDrugName',
  'severity', 'mechanism', 'recommendation', 'isHypothetical', 'references'
], 'drug_interactions.csv');

// Export side effects - skip if table doesn't exist
try {
  sqlite.prepare('SELECT COUNT(*) FROM DrugSideEffect').get();
  const sideEffectsCount = exportTableToCsv('DrugSideEffect', [
    'drugCode', 'effect', 'frequency', 'severity', 'isCommon'
  ], 'drug_side_effects.csv');
} catch (e) {
  console.log('\n⚠️ DrugSideEffect table not found, skipping...');
  var sideEffectsCount = 0;
}

console.log('\n══════════════════════════════════════════════════');
console.log('✅ EXPORT COMPLETE');
console.log('══════════════════════════════════════════════════');
console.log(`📁 Files created in: export/`);
console.log(`   • drugs.csv (${drugsCount} rows)`);
console.log(`   • icd10_mappings.csv (${icd10Count} rows)`);
console.log(`   • drug_interactions.csv (${interactionsCount} rows)`);
console.log(`   • drug_side_effects.csv (${sideEffectsCount} rows)`);
console.log('══════════════════════════════════════════════════');

sqlite.close();
