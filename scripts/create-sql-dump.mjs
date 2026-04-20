#!/usr/bin/env node
/**
 * Create SQL INSERT dump for psql import
 */

import Database from 'better-sqlite3';
import { createWriteStream } from 'fs';

const sqlite = new Database('db/custom.db');
const dump = createWriteStream('export/dump.sql');

dump.write('-- Neon PostgreSQL Import Dump\n');
dump.write('-- Generated: ' + new Date().toISOString() + '\n\n');

// Truncate tables
dump.write('TRUNCATE TABLE "Drug", "ICD10Mapping", "DrugInteraction", "DrugSideEffect" CASCADE;\n\n');

// Import Drugs
console.log('💊 Exporting Drugs to SQL...');
const drugs = sqlite.prepare('SELECT * FROM Drug').all();
let drugCount = 0;

for (const drug of drugs) {
  const id = generateUUID();
  const sql = `INSERT INTO "Drug" (id, "drugCode", "packageName", "genericName", strength, "dosageForm", "packageSize", status, "dispenseMode", "packagePricePublic", "packagePricePharmacy", "unitPricePublic", "unitPricePharmacy", "agentName", "manufacturerName", "insurancePlan", "govtFundedCoverage", "uppScope", "includedInThiqaABM", "includedInBasic", "includedInABM1", "includedInABM7", "pregnancyCategory", "breastfeedingSafety", "renalAdjustment", "createdAt", "updatedAt") VALUES ('${id}', ${escape(drug.drugCode)}, ${escape(drug.packageName)}, ${escape(drug.genericName)}, ${escape(drug.strength)}, ${escape(drug.dosageForm)}, ${escape(drug.packageSize)}, ${escape(drug.status)}, ${escape(drug.dispenseMode)}, ${escapeNum(drug.packagePricePublic)}, ${escapeNum(drug.packagePricePharmacy)}, ${escapeNum(drug.unitPricePublic)}, ${escapeNum(drug.unitPricePharmacy)}, ${escape(drug.agentName)}, ${escape(drug.manufacturerName)}, ${escape(drug.insurancePlan)}, ${escape(drug.govtFundedCoverage)}, ${escape(drug.uppScope)}, ${escape(drug.includedInThiqaABM)}, ${escape(drug.includedInBasic)}, ${escape(drug.includedInABM1)}, ${escape(drug.includedInABM7)}, ${escape(drug.pregnancyCategory)}, ${escape(drug.breastfeedingSafety)}, ${escape(drug.renalAdjustment)}, NOW(), NOW());\n`;
  dump.write(sql);
  drugCount++;
  
  if (drugCount % 1000 === 0) {
    process.stdout.write(`\r   ${drugCount}/${drugs.length}`);
  }
}
console.log(`\r   ✅ ${drugCount} drugs exported`);

// Build drug code map
const drugCodeMap = new Map();
const drugRows = sqlite.prepare('SELECT drugCode, id FROM Drug').all();
for (const row of drugRows) {
  drugCodeMap.set(row.drugCode, row.id);
}

// Import ICD10 Mappings
console.log('\n🏥 Exporting ICD10 Mappings...');
const icd10s = sqlite.prepare('SELECT * FROM ICD10Mapping').all();
let icd10Count = 0;

for (const m of icd10s) {
  const drugId = drugCodeMap.get(m.drugCode);
  if (!drugId) continue;
  
  const sql = `INSERT INTO "ICD10Mapping" (id, "drugId", code, description, system, "createdAt", "updatedAt") VALUES ('${generateUUID()}', '${drugId}', ${escape(m.code)}, ${escape(m.description)}, ${escape(m.system || 'ICD10')}, NOW(), NOW());\n`;
  dump.write(sql);
  icd10Count++;
  
  if (icd10Count % 1000 === 0) {
    process.stdout.write(`\r   ${icd10Count}/${icd10s.length}`);
  }
}
console.log(`\r   ✅ ${icd10Count} ICD10 mappings exported`);

// Import Drug Interactions
console.log('\n⚡ Exporting Drug Interactions...');
const interactions = sqlite.prepare('SELECT * FROM DrugInteraction').all();
let interactionCount = 0;

for (const ix of interactions) {
  const drugId = drugCodeMap.get(ix.drugCode);
  const interactingDrugId = drugCodeMap.get(ix.interactingDrugCode);
  if (!drugId || !interactingDrugId) continue;
  
  const sql = `INSERT INTO "DrugInteraction" (id, "drugId", "interactingDrugId", "interactingDrugName", severity, mechanism, recommendation, "isHypothetical", references, "createdAt", "updatedAt") VALUES ('${generateUUID()}', '${drugId}', '${interactingDrugId}', ${escape(ix.interactingDrugName)}, ${escape(ix.severity)}, ${escape(ix.mechanism)}, ${escape(ix.recommendation)}, ${ix.isHypothetical ? 'true' : 'false'}, ${escape(ix.references || '[]')}, NOW(), NOW());\n`;
  dump.write(sql);
  interactionCount++;
}
console.log(`   ✅ ${interactionCount} interactions exported`);

dump.write('\n-- Import Complete\n');
dump.end();

sqlite.close();

console.log('\n══════════════════════════════════════════════════');
console.log('✅ SQL DUMP CREATED: export/dump.sql');
console.log('══════════════════════════════════════════════════');
console.log(`📊 Drugs: ${drugCount}`);
console.log(`📊 ICD10 Mappings: ${icd10Count}`);
console.log(`📊 Interactions: ${interactionCount}`);
console.log('══════════════════════════════════════════════════');
console.log('\nTo import:');
console.log('psql "$DIRECT_URL" -f export/dump.sql');

function escape(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function escapeNum(num) {
  if (num === null || num === undefined || num === '') return 'NULL';
  return num;
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
