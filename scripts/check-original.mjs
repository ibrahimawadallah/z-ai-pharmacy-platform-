#!/usr/bin/env node
import Database from 'better-sqlite3';

console.log('Checking original drug-intelligence.db...\n');

try {
  const db = new Database('upload/drug-intelligence.db', { readonly: true });
  console.log('✅ Database opened!');
  
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
  console.log(`\n📊 ${tables.length} tables found:\n`);
  
  for (const table of tables) {
    try {
      const count = db.prepare(`SELECT COUNT(*) as count FROM "${table.name}"`).get();
      console.log(`   ✅ ${table.name.padEnd(25)} : ${count.count.toLocaleString()} rows`);
    } catch (e) {
      console.log(`   ⚠️ ${table.name.padEnd(25)} : ERROR - ${e.message}`);
    }
  }
  
  // Check specific tables
  console.log('\n─'.repeat(50));
  
  // Drug interactions
  try {
    const ixCount = db.prepare('SELECT COUNT(*) as count FROM drug_interactions').get();
    console.log(`\n💊 Drug Interactions: ${ixCount.count.toLocaleString()}`);
    
    if (ixCount.count > 0) {
      const sample = db.prepare('SELECT * FROM drug_interactions LIMIT 3').all();
      console.log('   Sample:');
      sample.forEach((row, i) => {
        console.log(`   ${i+1}. Drug ${row.drug_id} ↔ Drug ${row.interacting_drug_id} (${row.severity})`);
      });
    }
  } catch (e) {
    console.log(`\n⚠️ drug_interactions: ${e.message}`);
  }
  
  // Side effects
  try {
    const seCount = db.prepare('SELECT COUNT(*) as count FROM drug_side_effects').get();
    console.log(`\n😷 Side Effects: ${seCount.count.toLocaleString()}`);
  } catch (e) {
    console.log(`\n⚠️ drug_side_effects: ${e.message}`);
  }
  
  // Drugs
  try {
    const drugCount = db.prepare('SELECT COUNT(*) as count FROM drugs').get();
    console.log(`\n💉 Drugs: ${drugCount.count.toLocaleString()}`);
  } catch (e) {
    console.log(`\n⚠️ drugs: ${e.message}`);
  }
  
  db.close();
  
  console.log('\n' + '═'.repeat(50));
  console.log('✅ Database is readable!');
  console.log('═'.repeat(50));
  
} catch (e) {
  console.log(`❌ Error: ${e.message}`);
  console.log('\nDatabase appears corrupted or incompatible.');
}
