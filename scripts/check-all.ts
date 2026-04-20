import Database from 'better-sqlite3';

const db = new Database('./db/custom.db');

// Check tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map((t: any) => t.name));

// Check counts
const icd10 = db.prepare('SELECT COUNT(*) as count FROM ICD10Mapping').get() as { count: number };
const interactions = db.prepare('SELECT COUNT(*) as count FROM DrugInteraction').get() as { count: number };
const sideEffects = db.prepare('SELECT COUNT(*) as count FROM DrugSideEffect').get() as { count: number };

console.log('ICD-10 Mappings:', icd10.count);
console.log('Drug Interactions:', interactions.count);
console.log('Side Effects:', sideEffects.count);

db.close();