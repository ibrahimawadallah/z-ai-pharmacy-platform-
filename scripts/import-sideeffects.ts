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
  
  const beforeCount = db.prepare('SELECT COUNT(*) as count FROM DrugSideEffect').get() as { count: number };
  console.log(`Current side effects in database: ${beforeCount.count}`);
  
  // Read TSV file line by line (large file)
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
  
  // Find drugs by drugbank_id in the Drug table
  const findDrugStmt = db.prepare('SELECT id FROM Drug WHERE drugbankId = ? OR LOWER(packageName) LIKE LOWER(?)');
  
  // Skip header
  let isFirstLine = true;
  
  db.transaction(() => {
    for (const line of rl) {
      lineCount++;
      
      if (isFirstLine) {
        isFirstLine = false;
        continue;
      }
      
      const parts = line.split('\t');
      if (parts.length < 4) continue;
      
      const [drugbankId, drugbankName, umlsCui, sideEffectName] = parts;
      
      // Find drug by drugbank_id
      let drug = findDrugStmt.get(drugbankId, `%${drugbankName}%`) as { id: string } | undefined;
      
      if (!drug) {
        // Try matching by name
        const nameStmt = db.prepare('SELECT id FROM Drug WHERE LOWER(packageName) LIKE LOWER(?) OR LOWER(genericName) LIKE LOWER(?)');
        drug = nameStmt.get(`%${drugbankName}%`, `%${drugbankName}%`) as { id: string } | undefined;
      }
      
      if (!drug) {
        skipped++;
        if (skipped % 10000 === 0) {
          console.log(`Skipped ${skipped} side effects (drug not found)...`);
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
    }
  })();
  
  console.log(`\nImport complete!`);
  console.log(`- Imported: ${imported} side effects`);
  console.log(`- Skipped: ${skipped} (drug not found)`);
  console.log(`- Lines processed: ${lineCount}`);
  
  const finalCount = db.prepare('SELECT COUNT(*) as count FROM DrugSideEffect').get() as { count: number };
  console.log(`Total side effects in database: ${finalCount.count}`);
  
  db.close();
}

importSideEffects().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
