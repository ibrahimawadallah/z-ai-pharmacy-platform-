import Database from 'better-sqlite3';

const db = new Database('./db/custom.db');

// Check if table exists
const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='ICD10Mapping'").get();
console.log('ICD10Mapping table exists:', !!tableCheck);

if (tableCheck) {
  // Check columns
  const cols = db.prepare('PRAGMA table_info(ICD10Mapping)').all() as { name: string }[];
  console.log('Columns:', cols.map(c => c.name).join(', '));
  
  // Count
  const count = db.prepare('SELECT COUNT(*) as count FROM ICD10Mapping').get() as { count: number };
  console.log('Total mappings:', count.count);
  
  // Sample data
  if (count.count > 0) {
    const sample = db.prepare('SELECT * FROM ICD10Mapping LIMIT 3').all();
    console.log('Sample rows:', JSON.stringify(sample, null, 2));
  }
}

db.close();
