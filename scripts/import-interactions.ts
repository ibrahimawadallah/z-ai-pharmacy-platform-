import Database from 'better-sqlite3';
import * as fs from 'fs';

const DB_PATH = './db/custom.db';
const INTERACTIONS_FILE = './upload/drug-interactions.json';

async function importInteractions() {
  console.log('Opening SQLite database...');
  const db = new Database(DB_PATH);
  
  // Enable WAL mode
  db.pragma('journal_mode = WAL');
  
  // Check if DrugInteraction table exists
  const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='DrugInteraction'").get();
  if (!tableCheck) {
    console.log('Creating DrugInteraction table...');
    db.exec(`
      CREATE TABLE DrugInteraction (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        drugId TEXT NOT NULL,
        interactingDrugId TEXT,
        interactingDrugName TEXT,
        severity TEXT,
        description TEXT,
        mechanism TEXT,
        recommendation TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX idx_interaction_drug ON DrugInteraction(drugId);
    `);
  }
  
  // Check current count
  const beforeCount = db.prepare('SELECT COUNT(*) as count FROM DrugInteraction').get() as { count: number };
  console.log(`Current interactions in database: ${beforeCount.count}`);
  
  console.log('Reading drug interactions...');
  const interactionsData = JSON.parse(fs.readFileSync(INTERACTIONS_FILE, 'utf-8'));
  const drugNames = Object.keys(interactionsData);
  console.log(`Found ${drugNames.length} drugs with interactions`);
  
  let imported = 0;
  let skipped = 0;
  
  const insertStmt = db.prepare(`
    INSERT INTO DrugInteraction (drugId, interactingDrugName, severity, description, mechanism, recommendation)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const findDrugStmt = db.prepare('SELECT id FROM Drug WHERE LOWER(packageName) = LOWER(?) OR LOWER(genericName) = LOWER(?)');
  const partialStmt = db.prepare('SELECT id FROM Drug WHERE LOWER(packageName) LIKE LOWER(?) OR LOWER(genericName) LIKE LOWER(?)');
  
  for (const drugName of drugNames) {
    const interactions = interactionsData[drugName];
    if (!interactions) continue;
    
    // Find primary drug
    let drug = findDrugStmt.get(drugName, drugName) as { id: string } | undefined;
    if (!drug) {
      const partialDrug = partialStmt.get(`%${drugName}%`, `%${drugName}%`) as { id: string } | undefined;
      if (!partialDrug) {
        skipped++;
        continue;
      }
      drug = partialDrug;
    }
    
    // Insert each interaction
    const interactingDrugs = Object.keys(interactions);
    for (const interactingName of interactingDrugs) {
      const interaction = interactions[interactingName];
      try {
        insertStmt.run(
          drug.id,
          interactingName,
          interaction.severity || null,
          interaction.description || null,
          interaction.mechanism || null,
          interaction.recommendation || null
        );
        imported++;
      } catch (e) {
        // Ignore errors
      }
    }
    
    if (imported % 100 === 0) {
      console.log(`Imported ${imported} interactions...`);
    }
  }
  
  console.log(`\nImport complete!`);
  console.log(`- Imported: ${imported} interactions`);
  console.log(`- Skipped: ${skipped} drugs (not found)`);
  
  const finalCount = db.prepare('SELECT COUNT(*) as count FROM DrugInteraction').get() as { count: number };
  console.log(`Total interactions in database: ${finalCount.count}`);
  
  db.close();
}

importInteractions().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
