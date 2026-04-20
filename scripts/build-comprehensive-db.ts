import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const DB_PATH = './upload/drug-intelligence.db';

// Data source paths
const DRUGS_CSV_PATH = './upload/UAE drug list.csv';
const INTERACTIONS_JSON_PATH = './upload/comprehensive-drug-interactions.json';
const SIDE_EFFECTS_TSV_PATH = './upload/sider-side-effects.tsv';
const ICD10_MAPPINGS_PATH = './upload/uae-drugs-complete-icd10-mappings.json';

interface Drug {
  id?: string;
  drugCode: string;
  packageName: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  packageSize?: string;
  status: string;
  dispenseMode?: string;
  packagePricePublic?: number;
  packagePricePharmacy?: number;
  unitPricePublic?: number;
  unitPricePharmacy?: number;
  agentName?: string;
  manufacturerName?: string;
  insurancePlan?: string;
  govtFundedCoverage?: string;
  uppScope?: string;
  includedInThiqaABM?: string;
  includedInBasic?: string;
  includedInABM1?: string;
  includedInABM7?: string;
  pregnancyCategory?: string;
  breastfeedingSafety?: string;
  renalAdjustment?: string;
  hepaticAdjustment?: string;
  warnings?: string;
  lastChangeDate?: string;
  uppEffectiveDate?: string;
  uppUpdatedDate?: string;
  uppExpiryDate?: string;
}

async function buildComprehensiveDatabase() {
  console.log('Building comprehensive SQLite database...');
  
  // Remove existing database
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
  }
  
  const db = new Database(DB_PATH);
  
  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  
  try {
    // Create tables
    console.log('Creating database schema...');
    await createTables(db);
    
    // Import drugs
    console.log('Importing drugs...');
    const drugCount = await importDrugs(db);
    
    // Import ICD-10 mappings
    console.log('Importing ICD-10 mappings...');
    const icd10Count = await importICD10Mappings(db);
    
    // Import interactions
    console.log('Importing drug interactions...');
    const interactionCount = await importInteractions(db);
    
    // Import side effects
    console.log('Importing side effects...');
    const sideEffectCount = await importSideEffects(db);
    
    // Create indexes
    console.log('Creating indexes...');
    await createIndexes(db);
    
    console.log('\n✅ Database build complete!');
    console.log(`- Drugs: ${drugCount}`);
    console.log(`- ICD-10 Mappings: ${icd10Count}`);
    console.log(`- Interactions: ${interactionCount}`);
    console.log(`- Side Effects: ${sideEffectCount}`);
    console.log(`- Database: ${DB_PATH}`);
    
  } catch (error) {
    console.error('Error building database:', error);
    throw error;
  } finally {
    db.close();
  }
}

async function createTables(db: Database.Database) {
  // Create drugs table
  db.exec(`
    CREATE TABLE drugs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      drug_code TEXT NOT NULL UNIQUE,
      package_name TEXT NOT NULL,
      generic_name TEXT NOT NULL,
      strength TEXT,
      dosage_form TEXT,
      package_size TEXT,
      status TEXT,
      dispense_mode TEXT,
      package_price_public REAL,
      package_price_pharmacy REAL,
      unit_price_public REAL,
      unit_price_pharmacy REAL,
      agent_name TEXT,
      manufacturer_name TEXT,
      insurance_plan TEXT,
      govt_funded_coverage TEXT,
      upp_scope TEXT,
      included_in_thiqa_abm TEXT,
      included_in_basic TEXT,
      included_in_abm1 TEXT,
      included_in_abm7 TEXT,
      pregnancy_category TEXT,
      breastfeeding_safety TEXT,
      renal_adjustment TEXT,
      hepatic_adjustment TEXT,
      warnings TEXT,
      last_change_date TEXT,
      upp_effective_date TEXT,
      upp_updated_date TEXT,
      upp_expiry_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create ICD-10 mappings table
  db.exec(`
    CREATE TABLE icd10_mappings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      drug_id INTEGER NOT NULL,
      icd10_code TEXT NOT NULL,
      description TEXT,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (drug_id) REFERENCES drugs (id)
    )
  `);
  
  // Create drug interactions table
  db.exec(`
    CREATE TABLE drug_interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      drug_id INTEGER NOT NULL,
      secondary_drug_id INTEGER,
      secondary_drug_name TEXT,
      severity TEXT,
      description TEXT,
      mechanism TEXT,
      recommendation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (drug_id) REFERENCES drugs (id),
      FOREIGN KEY (secondary_drug_id) REFERENCES drugs (id)
    )
  `);
  
  // Create drug side effects table
  db.exec(`
    CREATE TABLE drug_side_effects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      drug_id INTEGER NOT NULL,
      side_effect TEXT NOT NULL,
      frequency TEXT,
      severity TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (drug_id) REFERENCES drugs (id)
    )
  `);
}

async function importDrugs(db: Database.Database): Promise<number> {
  if (!fs.existsSync(DRUGS_CSV_PATH)) {
    throw new Error(`Drugs CSV file not found: ${DRUGS_CSV_PATH}`);
  }
  
  const csvContent = fs.readFileSync(DRUGS_CSV_PATH, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length <= 1) {
    throw new Error('No drug data found in CSV');
  }
  
  const headers = lines[0].split(',').map(h => h.trim());
  const insertStmt = db.prepare(`
    INSERT INTO drugs (
      drug_code, package_name, generic_name, strength, dosage_form, package_size,
      status, dispense_mode, package_price_public, package_price_pharmacy,
      unit_price_public, unit_price_pharmacy, agent_name, manufacturer_name,
      insurance_plan, govt_funded_coverage, upp_scope, included_in_thiqa_abm,
      included_in_basic, included_in_abm1, included_in_abm7
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  let imported = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const values = parseCSVLine(line);
    if (values.length < headers.length) continue;
    
    try {
      const drug: Drug = {
        drugCode: values[0] || '',
        packageName: values[2] || 'Unknown',
        genericName: values[4] || '',
        strength: values[5] || '',
        dosageForm: values[6] || '',
        packageSize: values[7],
        status: values[13] || 'Active',
        dispenseMode: values[8],
        packagePricePublic: parseFloat(values[9] || '0'),
        packagePricePharmacy: parseFloat(values[10] || '0'),
        unitPricePublic: parseFloat(values[11] || '0'),
        unitPricePharmacy: parseFloat(values[12] || '0'),
        agentName: values[16],
        manufacturerName: values[17],
        insurancePlan: values[1],
        govtFundedCoverage: values[18],
        uppScope: values[19],
        includedInThiqaABM: values[20],
        includedInBasic: values[21],
        includedInABM1: values[22],
        includedInABM7: values[23]
      };
      
      insertStmt.run(
        drug.drugCode, drug.packageName, drug.genericName, drug.strength, drug.dosageForm,
        drug.packageSize, drug.status, drug.dispenseMode, drug.packagePricePublic,
        drug.packagePricePharmacy, drug.unitPricePublic, drug.unitPricePharmacy,
        drug.agentName, drug.manufacturerName, drug.insurancePlan, drug.govtFundedCoverage,
        drug.uppScope, drug.includedInThiqaABM, drug.includedInBasic, drug.includedInABM1,
        drug.includedInABM7
      );
      
      imported++;
      
      if (imported % 1000 === 0) {
        console.log(`Imported ${imported} drugs...`);
      }
    } catch (error) {
      console.warn(`Failed to import drug at line ${i + 1}:`, error);
    }
  }
  
  return imported;
}

async function importICD10Mappings(db: Database.Database): Promise<number> {
  if (!fs.existsSync(ICD10_MAPPINGS_PATH)) {
    console.warn(`ICD-10 mappings file not found: ${ICD10_MAPPINGS_PATH}`);
    return 0;
  }
  
  const mappingsData = JSON.parse(fs.readFileSync(ICD10_MAPPINGS_PATH, 'utf-8'));
  const drugNames = Object.keys(mappingsData);
  
  const insertStmt = db.prepare(`
    INSERT INTO icd10_mappings (drug_id, icd10_code, description, category)
    VALUES (?, ?, ?, ?)
  `);
  
  const findDrugStmt = db.prepare(`
    SELECT id FROM drugs 
    WHERE LOWER(package_name) LIKE LOWER(?) OR LOWER(generic_name) LIKE LOWER(?)
    LIMIT 1
  `);
  
  let imported = 0;
  
  for (const drugName of drugNames) {
    const mappings = mappingsData[drugName];
    if (!mappings || !Array.isArray(mappings)) continue;
    
    // Find drug by name
    const drug = findDrugStmt.get(`%${drugName}%`, `%${drugName}%`) as { id: number } | undefined;
    if (!drug) continue;
    
    for (const mapping of mappings) {
      try {
        insertStmt.run(drug.id, mapping.code, mapping.description, mapping.category || null);
        imported++;
      } catch (error) {
        console.warn(`Failed to import ICD-10 mapping for ${drugName}:`, error);
      }
    }
    
    if (imported % 1000 === 0) {
      console.log(`Imported ${imported} ICD-10 mappings...`);
    }
  }
  
  return imported;
}

async function importInteractions(db: Database.Database): Promise<number> {
  if (!fs.existsSync(INTERACTIONS_JSON_PATH)) {
    console.warn(`Interactions file not found: ${INTERACTIONS_JSON_PATH}`);
    return 0;
  }
  
  const interactionsData = JSON.parse(fs.readFileSync(INTERACTIONS_JSON_PATH, 'utf-8'));
  const primaryDrugNames = Object.keys(interactionsData);
  
  const insertStmt = db.prepare(`
    INSERT INTO drug_interactions (
      drug_id, secondary_drug_id, secondary_drug_name, severity, description, mechanism, recommendation
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const findDrugStmt = db.prepare(`
    SELECT id FROM drugs 
    WHERE LOWER(package_name) LIKE LOWER(?) OR LOWER(generic_name) LIKE LOWER(?)
    LIMIT 1
  `);
  
  let imported = 0;
  
  for (const primaryDrugName of primaryDrugNames) {
    const interactions = interactionsData[primaryDrugName];
    if (!interactions) continue;
    
    // Find primary drug
    const primaryDrug = findDrugStmt.get(`%${primaryDrugName}%`, `%${primaryDrugName}%`) as { id: number } | undefined;
    if (!primaryDrug) continue;
    
    const secondaryDrugNames = Object.keys(interactions);
    
    for (const secondaryDrugName of secondaryDrugNames) {
      const interaction = interactions[secondaryDrugName];
      
      // Find secondary drug
      const secondaryDrug = findDrugStmt.get(`%${secondaryDrugName}%`, `%${secondaryDrugName}%`) as { id: number } | undefined;
      
      try {
        insertStmt.run(
          primaryDrug.id,
          secondaryDrug?.id || null,
          secondaryDrugName,
          interaction.severity || null,
          interaction.description || null,
          interaction.mechanism || null,
          interaction.recommendation || null
        );
        
        imported++;
      } catch (error) {
        console.warn(`Failed to import interaction ${primaryDrugName} - ${secondaryDrugName}:`, error);
      }
    }
    
    if (imported % 1000 === 0) {
      console.log(`Imported ${imported} interactions...`);
    }
  }
  
  return imported;
}

async function importSideEffects(db: Database.Database): Promise<number> {
  if (!fs.existsSync(SIDE_EFFECTS_TSV_PATH)) {
    console.warn(`Side effects file not found: ${SIDE_EFFECTS_TSV_PATH}`);
    return 0;
  }
  
  const fileStream = fs.createReadStream(SIDE_EFFECTS_TSV_PATH);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  const insertStmt = db.prepare(`
    INSERT INTO drug_side_effects (drug_id, side_effect, frequency, severity)
    VALUES (?, ?, ?, ?)
  `);
  
  const findDrugStmt = db.prepare(`
    SELECT id FROM drugs 
    WHERE LOWER(package_name) LIKE LOWER(?) OR LOWER(generic_name) LIKE LOWER(?)
    LIMIT 1
  `);
  
  let imported = 0;
  let lineCount = 0;
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
    
    if (!drugbankName || !sideEffectName) continue;
    
    // Find drug by name
    const drug = findDrugStmt.get(`%${drugbankName}%`, `%${drugbankName}%`) as { id: number } | undefined;
    if (!drug) continue;
    
    try {
      insertStmt.run(drug.id, sideEffectName, 'unknown', 'unknown');
      imported++;
    } catch (error) {
      console.warn(`Failed to import side effect for ${drugbankName}:`, error);
    }
    
    if (imported % 10000 === 0) {
      console.log(`Imported ${imported} side effects...`);
    }
  }
  
  return imported;
}

async function createIndexes(db: Database.Database) {
  console.log('Creating indexes...');
  
  db.exec(`
    CREATE INDEX idx_drugs_code ON drugs(drug_code);
    CREATE INDEX idx_drugs_package_name ON drugs(package_name);
    CREATE INDEX idx_drugs_generic_name ON drugs(generic_name);
    CREATE INDEX idx_drugs_status ON drugs(status);
    
    CREATE INDEX idx_icd10_drug ON icd10_mappings(drug_id);
    CREATE INDEX idx_icd10_code ON icd10_mappings(icd10_code);
    
    CREATE INDEX idx_interactions_drug ON drug_interactions(drug_id);
    CREATE INDEX idx_interactions_secondary ON drug_interactions(secondary_drug_id);
    CREATE INDEX idx_interactions_severity ON drug_interactions(severity);
    
    CREATE INDEX idx_side_effects_drug ON drug_side_effects(drug_id);
    CREATE INDEX idx_side_effects_effect ON drug_side_effects(side_effect);
  `);
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  
  return values;
}

// Run the build process
buildComprehensiveDatabase()
  .then(() => console.log('✅ Comprehensive database build completed successfully!'))
  .catch(error => {
    console.error('❌ Database build failed:', error);
    process.exit(1);
  });