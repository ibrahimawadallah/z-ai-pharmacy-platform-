import Database from 'better-sqlite3';

const db = new Database('./db/custom.db');

// Clear existing data
console.log('Clearing ICD10Mapping table...');
db.exec('DELETE FROM ICD10Mapping');

// Verify
const count = db.prepare('SELECT COUNT(*) as count FROM ICD10Mapping').get() as { count: number };
console.log('Cleared. Current count:', count.count);

db.close();
