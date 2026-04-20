import Database from 'better-sqlite3';

const db = new Database('./db/custom.db');

// Try to insert one record and see what happens
try {
  const result = db.prepare('INSERT INTO ICD10Mapping (drugId, icd10Code, description) VALUES (?, ?, ?)')
    .run('test-drug-id', 'A00.0', 'Test description');
  console.log('Insert result:', result);
  console.log('Changes:', result.changes);
  console.log('Last insert rowid:', result.lastInsertRowid);
} catch (e: any) {
  console.error('Insert error:', e.message);
  console.error('Error code:', e.code);
}

// Check count
const count = db.prepare('SELECT COUNT(*) as count FROM ICD10Mapping').get() as { count: number };
console.log('Total mappings after test insert:', count.count);

// Show any existing data
const data = db.prepare('SELECT * FROM ICD10Mapping LIMIT 5').all();
console.log('Sample data:', JSON.stringify(data, null, 2));

db.close();
