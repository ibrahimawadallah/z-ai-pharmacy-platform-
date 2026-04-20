#!/usr/bin/env node
/**
 * Export from upload/drug-intelligence.db to CSV
 */

import Database from 'better-sqlite3';
import { createWriteStream, mkdirSync } from 'fs';

const sqlite = new Database('upload/drug-intelligence.db', { readonly: true });

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

function exportTableToCsv(tableName, fileName, columns) {
  console.log(`\n📤 Exporting ${tableName}...`);
  
  try {
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
  } catch (e) {
    console.log(`   ❌ Error: ${e.message}`);
    return 0;
  }
}

console.log('══════════════════════════════════════════════════');
console.log('📊 EXPORTING UPLOAD DATABASE TO CSV');
console.log('══════════════════════════════════════════════════');
console.log('Source: upload/drug-intelligence.db');

// Export drugs (original schema)
const drugsCount = exportTableToCsv('drugs', 'drugs_full.csv', [
  'id', 'drug_name', 'generic_name', 'drug_code', 'category', 'strength',
  'dosage_form', 'package_size', 'manufacturer', 'ndc', 'price',
  'created_at', 'updated_at'
]);

// Export drug_codes (comprehensive)
const drugCodesCount = exportTableToCsv('drug_codes', 'drug_codes.csv', [
  'id', 'drug_id', 'code_type', 'code_value', 'description', 'created_at'
]);

// Export drug_interactions
const interactionsCount = exportTableToCsv('drug_interactions', 'drug_interactions_full.csv', [
  'id', 'drug_id', 'interacting_drug_id', 'interaction_type', 'severity',
  'description', 'created_at'
]);

// Export patients
const patientsCount = exportTableToCsv('patients', 'patients.csv', [
  'id', 'patient_id', 'name', 'date_of_birth', 'gender', 'phone',
  'email', 'address', 'emergency_contact', 'insurance_id', 'created_at'
]);

// Export academy courses
const coursesCount = exportTableToCsv('academy_courses', 'academy_courses.csv', [
  'id', 'title', 'description', 'category', 'duration', 'difficulty',
  'created_at', 'updated_at'
]);

// Export codes
const codesCount = exportTableToCsv('codes', 'codes.csv', [
  'id', 'code', 'code_type', 'description', 'category', 'created_at'
]);

// Summary
console.log('\n══════════════════════════════════════════════════');
console.log('✅ EXPORT COMPLETE');
console.log('══════════════════════════════════════════════════');
console.log(`📁 Files in export/ folder:`);
console.log(`   • drugs_full.csv (${drugsCount.toLocaleString()} rows)`);
console.log(`   • drug_codes.csv (${drugCodesCount.toLocaleString()} rows)`);
console.log(`   • drug_interactions_full.csv (${interactionsCount.toLocaleString()} rows)`);
console.log(`   • patients.csv (${patientsCount.toLocaleString()} rows)`);
console.log(`   • academy_courses.csv (${coursesCount.toLocaleString()} rows)`);
console.log(`   • codes.csv (${codesCount.toLocaleString()} rows)`);
console.log('══════════════════════════════════════════════════');

sqlite.close();
