#!/usr/bin/env node
/**
 * Check the desktop drug-intelligence.db
 */

import Database from 'better-sqlite3';

const db = new Database('C:/Users/Admin/OneDrive/Desktop/drug-intelligence.db', { readonly: true });

console.log('══════════════════════════════════════════════════');
console.log('📊 DESKTOP drug-intelligence.db');
console.log('══════════════════════════════════════════════════\n');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log(`Found ${tables.length} tables:\n`);

tables.forEach(t => {
  try {
    const count = db.prepare(`SELECT COUNT(*) as c FROM "${t.name}"`).get();
    console.log(`  📁 ${t.name}: ${count.c.toLocaleString()} rows`);
  } catch (e) {
    console.log(`  📁 ${t.name}: (error: ${e.message})`);
  }
});

// Check first drug sample
console.log('\n══════════════════════════════════════════════════');
console.log('📋 SAMPLE DATA');
console.log('══════════════════════════════════════════════════');

const drugTable = tables.find(t => t.name.toLowerCase().includes('drug'));
if (drugTable) {
  const sample = db.prepare(`SELECT * FROM "${drugTable.name}" LIMIT 1`).get();
  console.log(`\n${drugTable.name} columns:`, Object.keys(sample).join(', '));
}

db.close();
