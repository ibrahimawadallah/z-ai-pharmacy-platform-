import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as readline from 'readline';

const DB_PATH = './db/custom.db';
const SIDEEFFECTS_FILE = './upload/sider-side-effects.tsv';

async function importSideEffects() {
  console.log('Opening SQLite database...');
  const db = new Database(DB_PATH);
  
  // Enable WAL mode
  db.pragma('journal_mode = WAL');
  
  // Check if DrugSideEffect table exists
  const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='DrugSideEffect'").get();
  if (!tableCheck) {
    console.log('Creating DrugSideEffect table...');
    db.exec(`
      CREATE TABLE DrugSideEffect (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        drugId TEXT NOT NULL,
        sideEffect TEXT NOT NULL,
        frequency TEXT,
        severity TEXT,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX idx_sideeffect_drug ON DrugSideEffect(drugId);
    `);
  }
  
  // Clear existing data for fresh import
  db.exec('DELETE FROM DrugSideEffect');
  
  const beforeCount = db.prepare('SELECT COUNT(*) as count FROM DrugSideEffect').get() as { count: number };
  console.log(`Current side effects in database: ${beforeCount.count}`);
  
  // Read TSV file line by line
  const fileStream = fs.createReadStream(SIDEEFFECTS_FILE);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let imported = 0;
  let skipped = 0;
  let lineCount = 0;
  
  const insertStmt = db.prepare(`
    INSERT INTO DrugSideEffect (drugId, sideEffect)
    VALUES (?, ?)
  `);
  
  // Find drugs by name (better matching)
  const findDrugStmt = db.prepare('SELECT id FROM Drug WHERE LOWER(packageName) LIKE LOWER(?) OR LOWER(genericName) LIKE LOWER(?)');
  
  // Skip header
  let isFirstLine = true;
  
  for await (const line of rl) {
    lineCount++;
    
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }
    
    const parts = line.split('\t');
    if (parts.length < 4) continue;
    
    const [drugbankId, drugbankName, umlsCui, sideEffectName] = parts;
    
    // Try multiple matching strategies
    let drug: { id: string } | null = null;
    
    // Strategy 1: Exact drugbank name match
    const found = findDrugStmt.get(drugbankName, drugbankName) as { id: string } | undefined;
    if (found) drug = found;
    
    // Strategy 2: Partial name match (remove special characters)
    if (!drug) {
      const cleanName = drugbankName.replace(/[^\w\s]/g, '').trim();
      const found2 = findDrugStmt.get(`%${cleanName}%`, `%${cleanName}%`) as { id: string } | undefined;
      if (found2) drug = found2;
    }
    
    // Strategy 3: Word-based matching
    if (!drug && drugbankName.includes(' ')) {
      const words = drugbankName.split(' ').filter(w => w.length > 3);
      for (const word of words.slice(0, 2)) { // Try first 2 meaningful words
        const found3 = findDrugStmt.get(`%${word}%`, `%${word}%`) as { id: string } | undefined;
        if (found3) {
          drug = found3;
          break;
        }
      }
    }
    
    if (!drug) {
      skipped++;
      if (skipped % 10000 === 0) {
        console.log(`Skipped ${skipped} side effects (drug not found: ${drugbankName})...`);
      }
      continue;
    }
    
    try {
      insertStmt.run(drug.id, sideEffectName);
      imported++;
    } catch (e) {
      // Ignore duplicates
    }
    
    if (imported % 10000 === 0) {
      console.log(`Imported ${imported} side effects...`);
    }
    
    // Limit for testing - remove this for full import
    if (lineCount > 50000) break;
  }
  
  console.log(`\nImport complete!`);
  console.log(`- Imported: ${imported} side effects`);
  console.log(`- Skipped: ${skipped} (drug not found)`);
  console.log(`- Lines processed: ${lineCount}`);
  
  const finalCount = db.prepare('SELECT COUNT(*) as count FROM DrugSideEffect').get() as { count: number };
  console.log(`Total side effects in database: ${finalCount.count}`);
  
  // Show sample
  if (finalCount.count > 0) {
    const sample = db.prepare('SELECT * FROM DrugSideEffect LIMIT 5').all();
    console.log('Sample side effects:', JSON.stringify(sample, null, 2));
  }
  
  db.close();
}

importSideEffects().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
