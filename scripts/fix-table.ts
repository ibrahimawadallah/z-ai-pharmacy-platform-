import Database from 'better-sqlite3';

const db = new Database('./db/custom.db');

// Drop and recreate the table with proper schema
console.log('Dropping old ICD10Mapping table...');
db.exec('DROP TABLE IF EXISTS ICD10Mapping');

console.log('Creating new ICD10Mapping table with proper schema...');
db.exec(`
  CREATE TABLE ICD10Mapping (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    drugId TEXT NOT NULL,
    icd10Code TEXT NOT NULL,
    description TEXT,
    category TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX idx_icd10_drug ON ICD10Mapping(drugId);
  CREATE INDEX idx_icd10_code ON ICD10Mapping(icd10Code);
`);

// Verify
const count = db.prepare('SELECT COUNT(*) as count FROM ICD10Mapping').get() as { count: number };
console.log('Table recreated. Current count:', count.count);

db.close();
console.log('Done!');
