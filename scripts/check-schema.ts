import Database from 'better-sqlite3';

const db = new Database('./db/custom.db');

// Get all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as { name: string }[];
console.log('Tables:', tables.map(t => t.name).join(', '));

// Get schema for drugs table
const cols = db.prepare('PRAGMA table_info(drugs)').all() as { name: string }[];
console.log('\ndrugs table columns:');
cols.forEach(c => console.log(`  - ${c.name}`));

// Get schema for Drug table (if it exists differently)
try {
  const drugCols = db.prepare('PRAGMA table_info(Drug)').all() as { name: string }[];
  console.log('\nDrug table columns:');
  drugCols.forEach(c => console.log(`  - ${c.name}`));
} catch (e) {
  console.log('\nNo Drug table (capital D)');
}

db.close();
