#!/usr/bin/env node
import Database from 'better-sqlite3';

const db = new Database('upload/drug-intelligence.db');

console.log('📁 upload/drug-intelligence.db');
console.log('─'.repeat(50));

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
for (const table of tables) {
  const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get();
  const icon = count.count > 0 ? '✅' : '⚪';
  console.log(`${icon} ${table.name.padEnd(25)} : ${count.count}`);
}

db.close();
