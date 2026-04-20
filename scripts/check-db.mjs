#!/usr/bin/env node
import Database from 'better-sqlite3';

const dbs = [
  'db/custom.db',
  'prisma/db/custom.db'
];

for (const dbPath of dbs) {
  try {
    const db = new Database(dbPath);
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log(`\n📁 ${dbPath}`);
    console.log('─'.repeat(50));
    for (const table of tables) {
      const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get();
      const icon = count.count > 0 ? '✅' : '⚪';
      console.log(`${icon} ${table.name.padEnd(25)} : ${count.count}`);
    }
    db.close();
  } catch (e) {
    console.log(`\n❌ ${dbPath}: ${e.message}`);
  }
}
