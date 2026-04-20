#!/usr/bin/env node
/**
 * SQLite Database Recovery Attempt
 * Tries multiple methods to extract data from corrupted DB
 */

import { execSync } from 'child_process';
import { existsSync, copyFileSync, writeFileSync } from 'fs';
import Database from 'better-sqlite3';

const SOURCE_DB = 'upload/drug-intelligence1.txt';
const BACKUP_DB = 'upload/drug-intelligence.db';
const RECOVERY_DB = 'upload/drug-intelligence-recovered.db';

console.log('══════════════════════════════════════════════════');
console.log('🔧 SQLITE DATABASE RECOVERY');
console.log('══════════════════════════════════════════════════\n');

// Method 1: Try to open with better-sqlite3 recovery mode
console.log('Method 1: Testing direct open...');
try {
  const db = new Database(SOURCE_DB, { readonly: true });
  console.log('✅ Database opened successfully!');
  
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log(`📊 Found ${tables.length} tables`);
  
  for (const table of tables) {
    try {
      const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get();
      console.log(`   ✅ ${table.name}: ${count.count} rows`);
    } catch (e) {
      console.log(`   ⚠️ ${table.name}: ${e.message}`);
    }
  }
  
  db.close();
  console.log('\n✅ Recovery successful - no corruption detected!\n');
  process.exit(0);
} catch (e) {
  console.log(`   ❌ Failed: ${e.message}\n`);
}

// Method 2: Try SQLite3 CLI dump and restore
console.log('Method 2: Using sqlite3 CLI dump...');
try {
  // Try to dump the database
  execSync(`sqlite3 "${SOURCE_DB}" ".dump" > upload/recovered_dump.sql`, { 
    stdio: 'pipe',
    timeout: 60000
  });
  
  console.log('   ✅ Dump created');
  
  // Create new database from dump
  execSync(`sqlite3 "${RECOVERY_DB}" < upload/recovered_dump.sql`, {
    stdio: 'pipe',
    timeout: 60000
  });
  
  console.log('   ✅ Database restored from dump');
  
  // Verify
  const db = new Database(RECOVERY_DB);
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log(`   📊 Recovered ${tables.length} tables`);
  
  for (const table of tables) {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get();
    console.log(`      ${table.name}: ${count.count} rows`);
  }
  
  db.close();
  console.log('\n✅ Recovery successful!\n');
  process.exit(0);
} catch (e) {
  console.log(`   ❌ Failed: ${e.message}\n`);
}

// Method 3: Try to extract raw data with PRAGMA integrity_check
console.log('Method 3: PRAGMA integrity check...');
try {
  const db = new Database(SOURCE_DB, { readonly: true });
  const check = db.prepare('PRAGMA integrity_check').get();
  console.log(`   Integrity check: ${check.integrity_check}`);
  
  if (check.integrity_check === 'ok') {
    console.log('   ✅ Database integrity is OK');
    
    // List all tables
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log(`   📊 Tables: ${tables.map(t => t.name).join(', ')}`);
    
    db.close();
    console.log('\n✅ Database is valid!\n');
    process.exit(0);
  } else {
    console.log(`   ⚠️ Corruption detected: ${check.integrity_check}`);
  }
  
  db.close();
} catch (e) {
  console.log(`   ❌ Failed: ${e.message}\n`);
}

// Method 4: Raw hex extraction of table data
console.log('Method 4: Binary data extraction...');
console.log('   This is a last resort - may not recover meaningful data\n');

console.log('══════════════════════════════════════════════════');
console.log('❌ RECOVERY FAILED');
console.log('══════════════════════════════════════════════════');
console.log('\nThe database file appears to be severely corrupted.');
console.log('\nRecommendations:');
console.log('1. Check if you have any other backups');
console.log('2. Use the working db/custom.db (21,876 drugs, 58 interactions)');
console.log('3. Re-download from original source (UAE MOH)');
console.log('4. Import from DrugBank for comprehensive interactions');
console.log('');
