#!/usr/bin/env node
/**
 * Fast Bulk Import using pg COPY protocol
 */

import 'dotenv/config';
import pg from 'pg';
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';

const { Client } = pg;

async function migrate() {
  console.log('══════════════════════════════════════════════════');
  console.log('🚀 FAST BULK IMPORT TO NEON');
  console.log('══════════════════════════════════════════════════\n');

  // Parse connection string
  const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
  
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });
  
  console.log('Connecting...');
  await client.connect();
  console.log('✅ Connected to Neon\n');

  const sqlite = new Database('db/custom.db', { readonly: true });

  // Clear tables
  console.log('🧹 Clearing tables...');
  await client.query('TRUNCATE TABLE "DrugInteraction", "ICD10Mapping", "Drug" CASCADE');
  console.log('✅ Tables cleared\n');

  // Import Drugs using COPY
  console.log('💊 Importing Drugs via COPY...');
  const drugs = sqlite.prepare('SELECT * FROM Drug').all();
  console.log(`   Source: ${drugs.length.toLocaleString()} drugs`);

  const drugCodeMap = new Map();
  
  // Build CSV data
  let csvData = 'id,drugCode,packageName,genericName,strength,dosageForm,packageSize,status,dispenseMode,packagePricePublic,packagePricePharmacy,unitPricePublic,unitPricePharmacy,agentName,manufacturerName,insurancePlan,govtFundedCoverage,uppScope,includedInThiqaABM,includedInBasic,includedInABM1,includedInABM7,pregnancyCategory,breastfeedingSafety,renalAdjustment,createdAt,updatedAt\n';
  
  for (const d of drugs) {
    const id = randomUUID();
    drugCodeMap.set(d.drugCode, id);
    
    csvData += [
      id, 
      escapeCsv(d.drugCode),
      escapeCsv(d.packageName),
      escapeCsv(d.genericName),
      escapeCsv(d.strength),
      escapeCsv(d.dosageForm),
      escapeCsv(d.packageSize),
      escapeCsv(d.status),
      escapeCsv(d.dispenseMode),
      d.packagePricePublic || '',
      d.packagePricePharmacy || '',
      d.unitPricePublic || '',
      d.unitPricePharmacy || '',
      escapeCsv(d.agentName),
      escapeCsv(d.manufacturerName),
      escapeCsv(d.insurancePlan),
      escapeCsv(d.govtFundedCoverage),
      escapeCsv(d.uppScope),
      escapeCsv(d.includedInThiqaABM),
      escapeCsv(d.includedInBasic),
      escapeCsv(d.includedInABM1),
      escapeCsv(d.includedInABM7),
      escapeCsv(d.pregnancyCategory),
      escapeCsv(d.breastfeedingSafety),
      escapeCsv(d.renalAdjustment),
      new Date().toISOString(),
      new Date().toISOString()
    ].join(',') + '\n';
  }
  
  // Use COPY
  const stream = Readable.from([csvData]);
  const copyQuery = `COPY "Drug" (id, "drugCode", "packageName", "genericName", strength, "dosageForm", "packageSize", status, "dispenseMode", "packagePricePublic", "packagePricePharmacy", "unitPricePublic", "unitPricePharmacy", "agentName", "manufacturerName", "insurancePlan", "govtFundedCoverage", "uppScope", "includedInThiqaABM", "includedInBasic", "includedInABM1", "includedInABM7", "pregnancyCategory", "breastfeedingSafety", "renalAdjustment", "createdAt", "updatedAt") FROM STDIN WITH (FORMAT csv, HEADER true)`;
  
  await client.query(copyQuery);
  
  console.log(`   ✅ Imported ${drugs.length.toLocaleString()} drugs via COPY\n`);

  // Import ICD10
  console.log('🏥 Importing ICD10 Mappings via COPY...');
  const mappings = sqlite.prepare('SELECT * FROM ICD10Mapping WHERE drugCode IS NOT NULL').all();
  
  let mappingCsv = 'id,drugId,code,description,system,createdAt,updatedAt\n';
  const seenKeys = new Set();
  let mappingCount = 0;
  
  for (const m of mappings) {
    const drugId = drugCodeMap.get(m.drugCode);
    if (!drugId) continue;
    
    const key = `${drugId}-${m.code}`;
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);
    
    mappingCsv += [
      randomUUID(),
      drugId,
      escapeCsv(m.code),
      escapeCsv(m.description),
      escapeCsv(m.system || 'ICD10'),
      new Date().toISOString(),
      new Date().toISOString()
    ].join(',') + '\n';
    mappingCount++;
  }
  
  await client.query(`COPY "ICD10Mapping" (id, "drugId", code, description, system, "createdAt", "updatedAt") FROM STDIN WITH (FORMAT csv, HEADER true)`);
  
  console.log(`   ✅ Imported ${mappingCount.toLocaleString()} mappings via COPY\n`);

  // Import Interactions
  console.log('⚡ Importing Interactions via COPY...');
  const interactions = sqlite.prepare('SELECT * FROM DrugInteraction WHERE drugCode IS NOT NULL AND interactingDrugCode IS NOT NULL').all();
  
  let ixCsv = 'id,drugId,interactingDrugId,interactingDrugName,severity,mechanism,recommendation,isHypothetical,references,createdAt,updatedAt\n';
  let ixCount = 0;
  
  for (const ix of interactions) {
    const drugId = drugCodeMap.get(ix.drugCode);
    const interactingId = drugCodeMap.get(ix.interactingDrugCode);
    if (!drugId || !interactingId) continue;
    
    ixCsv += [
      randomUUID(),
      drugId,
      interactingId,
      escapeCsv(ix.interactingDrugName),
      escapeCsv(ix.severity),
      escapeCsv(ix.mechanism),
      escapeCsv(ix.recommendation),
      ix.isHypothetical ? 'true' : 'false',
      escapeCsv(ix.references || '[]'),
      new Date().toISOString(),
      new Date().toISOString()
    ].join(',') + '\n';
    ixCount++;
  }
  
  if (ixCount > 0) {
    await client.query(`COPY "DrugInteraction" (id, "drugId", "interactingDrugId", "interactingDrugName", severity, mechanism, recommendation, "isHypothetical", references, "createdAt", "updatedAt") FROM STDIN WITH (FORMAT csv, HEADER true)`);
  }
  
  console.log(`   ✅ Imported ${ixCount.toLocaleString()} interactions via COPY\n`);

  sqlite.close();
  await client.end();

  console.log('══════════════════════════════════════════════════');
  console.log('✅ BULK IMPORT COMPLETE!');
  console.log('══════════════════════════════════════════════════');
}

function escapeCsv(str) {
  if (str === null || str === undefined) return '';
  const s = String(str);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

migrate().catch(err => {
  console.error('\n❌ Error:', err);
  process.exit(1);
});
