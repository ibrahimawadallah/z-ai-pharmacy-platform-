import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = './db/custom.db';
const MAPPINGS_FILE = './upload/uae-drugs-complete-icd10-mappings.json';

async function importToSQLite() {
  console.log('Opening SQLite database...');
  const db = new Database(DB_PATH);
  
  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL');
  
  // Check if ICD10Mapping table exists
  const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='ICD10Mapping'").get();
  if (!tableCheck) {
    console.log('ICD10Mapping table does not exist. Creating table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS ICD10Mapping (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        drugId TEXT NOT NULL,
        icd10Code TEXT NOT NULL,
        icd10Description TEXT,
        confidence REAL DEFAULT 0.95,
        isApproved INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_icd10_drug ON ICD10Mapping(drugId);
      CREATE INDEX IF NOT EXISTS idx_icd10_code ON ICD10Mapping(icd10Code);
    `);
    console.log('Table created');
  }
  
  // Check if Drug table exists and has drugs
  const drugCount = db.prepare('SELECT COUNT(*) as count FROM Drug').get() as { count: number };
  console.log(`Found ${drugCount.count} drugs in database`);
  
  console.log('Reading ICD-10 mappings...');
  const mappingsData = JSON.parse(fs.readFileSync(MAPPINGS_FILE, 'utf-8'));
  const drugNames = Object.keys(mappingsData);
  console.log(`Found ${drugNames.length} drugs with ICD-10 mappings`);
  
  let imported = 0;
  let skipped = 0;
  let errorCount = 0;
  
  // Prepare statements
  const insertStmt = db.prepare(`
    INSERT INTO ICD10Mapping (drugId, icd10Code, description)
    VALUES (?, ?, ?)
  `);
  
  const findDrugStmt = db.prepare('SELECT id FROM Drug WHERE LOWER(packageName) = LOWER(?) OR LOWER(genericName) = LOWER(?)');
  const partialStmt = db.prepare('SELECT id FROM Drug WHERE LOWER(packageName) LIKE LOWER(?) OR LOWER(genericName) LIKE LOWER(?)');
  
  // Process without a giant transaction - better-sqlite3 has limits
  for (const drugName of drugNames) {
    const mappings = mappingsData[drugName];
    if (!mappings || mappings.length === 0) continue;
    
    // Find drug by name
    let drug = findDrugStmt.get(drugName, drugName) as { id: string } | undefined;
    
    if (!drug) {
      // Try partial match
      const partialDrug = partialStmt.get(`%${drugName}%`, `%${drugName}%`) as { id: string } | undefined;
      if (!partialDrug) {
        skipped++;
        if (skipped <= 5) {
          console.log(`Not found: ${drugName}`);
        }
        if (skipped % 1000 === 0) {
          console.log(`Skipped ${skipped} drugs (not found in database)...`);
        }
        continue;
      }
      if (skipped <= 5) {
        console.log(`Partial match: ${drugName} -> ${partialDrug.id}`);
      }
      drug = partialDrug;
    } else {
      if (imported < 5) {
        console.log(`Found: ${drugName} -> ${drug.id}`);
      }
    }
    
    // Insert mappings one by one with retry for locked errors
    for (const mapping of mappings) {
      let retries = 3;
      while (retries > 0) {
        try {
          const result = insertStmt.run(drug.id, mapping.code, mapping.description || null);
          if (result.changes > 0) {
            imported++;
          }
          break;
        } catch (e: any) {
          if (e.message.includes('database is locked') && retries > 1) {
            retries--;
            // Small delay before retry
            const start = Date.now();
            while (Date.now() - start < 10) {} // 10ms busy wait
          } else {
            errorCount++;
            if (errorCount <= 5) {
              console.log(`Insert error for drug ${drug.id}:`, e.message);
            }
            break;
          }
        }
      }
    }
    
    if (imported % 5000 === 0) {
      console.log(`Imported ${imported} ICD-10 mappings...`);
    }
  }
  
  console.log(`\nImport complete!`);
  console.log(`- Imported: ${imported} ICD-10 mappings`);
  console.log(`- Skipped: ${skipped} drugs (not found)`);
  
  // Verify count
  const finalCount = db.prepare('SELECT COUNT(*) as count FROM ICD10Mapping').get() as { count: number };
  console.log(`Total ICD-10 mappings in database: ${finalCount.count}`);
  
  db.close();
}

importToSQLite().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
