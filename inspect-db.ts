import Database from 'better-sqlite3';

const db = new Database('db/custom.db');

// Get tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(r => r.name).join(', '));

// Check row counts
for (const table of tables) {
  const count = db.prepare(`SELECT COUNT(*) as count FROM "${table.name}"`).get();
  console.log(`${table.name}: ${count.count} rows`);
}

// Show sample data from first table
if (tables.length > 0) {
  const firstTable = tables[0].name;
  const columns = db.prepare(`PRAGMA table_info("${firstTable}")`).all();
  console.log(`\n${firstTable} columns:`, columns.map(c => c.name).join(', '));
  
  const sample = db.prepare(`SELECT * FROM "${firstTable}" LIMIT 3`).all();
  console.log(`\nSample data from ${firstTable}:`, JSON.stringify(sample, null, 2));
}

db.close();
