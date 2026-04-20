#!/usr/bin/env node
/**
 * Import data using Neon REST API (PostgREST)
 * Endpoint: https://ep-shiny-king-adsne10e.apirest.c-2.us-east-1.aws.neon.tech/neondb/rest/v1/
 */

import 'dotenv/config';
import { readFileSync } from 'fs';
import { randomUUID } from 'crypto';

const API_URL = 'https://ep-shiny-king-adsne10e.apirest.c-2.us-east-1.aws.neon.tech/neondb/rest/v1';
const API_KEY = 'napi_6ink8fkrihs1lnbfdcui3w690hnmi551cyhj664o98e0jg6satpsio5rni08uzyv';

// Parse CSV line
function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
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

// Make API request
async function apiPost(table, data) {
  const response = await fetch(`${API_URL}/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'Prefer': 'resolution=ignore-duplicates,return=minimal'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  
  return response;
}

// Clear table
async function clearTable(table) {
  console.log(`   🧹 Clearing ${table}...`);
  const response = await fetch(`${API_URL}/${table}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });
  return response.ok;
}

async function importDrugs() {
  console.log('\n💊 Importing Drugs...');
  
  const content = readFileSync('export/drugs.csv', 'utf-8');
  const lines = content.trim().split('\n');
  console.log(`   Found ${lines.length - 1} rows`);
  
  // Clear existing
  await clearTable('Drug');
  
  const batchSize = 50;
  let imported = 0;
  let skipped = 0;
  
  for (let i = 1; i < lines.length; i += batchSize) {
    const batch = [];
    
    for (let j = i; j < Math.min(i + batchSize, lines.length); j++) {
      const values = parseCsvLine(lines[j]);
      if (values.length < 5 || !values[0]) {
        skipped++;
        continue;
      }
      
      batch.push({
        id: randomUUID(),
        drugCode: values[0],
        packageName: values[1],
        genericName: values[2],
        strength: values[3],
        dosageForm: values[4],
        packageSize: values[5] || null,
        status: values[6] || null,
        dispenseMode: values[7] || null,
        packagePricePublic: values[8] ? parseFloat(values[8]) : null,
        packagePricePharmacy: values[9] ? parseFloat(values[9]) : null,
        unitPricePublic: values[10] ? parseFloat(values[10]) : null,
        unitPricePharmacy: values[11] ? parseFloat(values[11]) : null,
        agentName: values[12] || null,
        manufacturerName: values[13] || null,
        insurancePlan: values[14] || null,
        govtFundedCoverage: values[15] || null,
        uppScope: values[16] || null,
        includedInThiqaABM: values[17] || null,
        includedInBasic: values[18] || null,
        includedInABM1: values[19] || null,
        includedInABM7: values[20] || null,
        pregnancyCategory: values[21] || null,
        breastfeedingSafety: values[22] || null,
        renalAdjustment: values[23] || null
      });
    }
    
    if (batch.length > 0) {
      try {
        await apiPost('Drug', batch);
        imported += batch.length;
      } catch (e) {
        console.log(`\n   ⚠️ Batch failed: ${e.message}`);
        skipped += batch.length;
      }
    }
    
    const progress = Math.min(i + batchSize - 1, lines.length - 1);
    process.stdout.write(`\r   Progress: ${progress}/${lines.length - 1} (imported: ${imported}, skipped: ${skipped})`);
    
    // Small delay between batches
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log(`\r   ✅ Imported ${imported} drugs (skipped: ${skipped})`);
  return imported;
}

async function buildDrugMap() {
  console.log('\n🗺️  Building drug code map...');
  
  const response = await fetch(`${API_URL}/Drug?select=id,drugCode`, {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });
  
  const rows = await response.json();
  const map = new Map();
  for (const row of rows) {
    if (row.drugCode) map.set(row.drugCode, row.id);
  }
  console.log(`   Mapped ${map.size} drugs`);
  return map;
}

async function importICD10(drugMap) {
  console.log('\n🏥 Importing ICD10 Mappings...');
  
  const content = readFileSync('export/icd10_mappings.csv', 'utf-8');
  const lines = content.trim().split('\n');
  console.log(`   Found ${lines.length - 1} rows`);
  
  await clearTable('ICD10Mapping');
  
  const batchSize = 100;
  let imported = 0;
  let skipped = 0;
  
  for (let i = 1; i < lines.length; i += batchSize) {
    const batch = [];
    
    for (let j = i; j < Math.min(i + batchSize, lines.length); j++) {
      const values = parseCsvLine(lines[j]);
      const drugId = drugMap.get(values[0]);
      
      if (!drugId || values.length < 3) {
        skipped++;
        continue;
      }
      
      batch.push({
        id: randomUUID(),
        drugId: drugId,
        code: values[1],
        description: values[2],
        system: values[3] || 'ICD10'
      });
    }
    
    if (batch.length > 0) {
      try {
        await apiPost('ICD10Mapping', batch);
        imported += batch.length;
      } catch (e) {
        skipped += batch.length;
      }
    }
    
    const progress = Math.min(i + batchSize - 1, lines.length - 1);
    process.stdout.write(`\r   Progress: ${progress}/${lines.length - 1} (imported: ${imported}, skipped: ${skipped})`);
    await new Promise(r => setTimeout(r, 50));
  }
  
  console.log(`\r   ✅ Imported ${imported} ICD10 mappings (skipped: ${skipped})`);
}

async function importInteractions(drugMap) {
  console.log('\n⚡ Importing Drug Interactions...');
  
  const content = readFileSync('export/drug_interactions.csv', 'utf-8');
  const lines = content.trim().split('\n');
  console.log(`   Found ${lines.length - 1} rows`);
  
  await clearTable('DrugInteraction');
  
  const batchSize = 50;
  let imported = 0;
  let skipped = 0;
  
  for (let i = 1; i < lines.length; i += batchSize) {
    const batch = [];
    
    for (let j = i; j < Math.min(i + batchSize, lines.length); j++) {
      const values = parseCsvLine(lines[j]);
      const drugId = drugMap.get(values[0]);
      const interactingDrugId = drugMap.get(values[1]);
      
      if (!drugId || !interactingDrugId || values.length < 6) {
        skipped++;
        continue;
      }
      
      batch.push({
        id: randomUUID(),
        drugId: drugId,
        interactingDrugId: interactingDrugId,
        interactingDrugName: values[2],
        severity: values[3],
        mechanism: values[4],
        recommendation: values[5],
        isHypothetical: values[6] === 'true',
        references: values[7] || '[]'
      });
    }
    
    if (batch.length > 0) {
      try {
        await apiPost('DrugInteraction', batch);
        imported += batch.length;
      } catch (e) {
        skipped += batch.length;
      }
    }
    
    const progress = Math.min(i + batchSize - 1, lines.length - 1);
    process.stdout.write(`\r   Progress: ${progress}/${lines.length - 1} (imported: ${imported}, skipped: ${skipped})`);
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log(`\r   ✅ Imported ${imported} interactions (skipped: ${skipped})`);
}

async function importSideEffects(drugMap) {
  console.log('\n💊 Importing Side Effects...');
  
  const content = readFileSync('export/drug_side_effects.csv', 'utf-8');
  const lines = content.trim().split('\n');
  console.log(`   Found ${lines.length - 1} rows`);
  
  await clearTable('DrugSideEffect');
  
  const batchSize = 200;
  let imported = 0;
  let skipped = 0;
  
  for (let i = 1; i < lines.length; i += batchSize) {
    const batch = [];
    
    for (let j = i; j < Math.min(i + batchSize, lines.length); j++) {
      const values = parseCsvLine(lines[j]);
      const drugId = drugMap.get(values[0]);
      
      if (!drugId || values.length < 4) {
        skipped++;
        continue;
      }
      
      batch.push({
        id: randomUUID(),
        drugId: drugId,
        effect: values[1],
        frequency: values[2],
        severity: values[3],
        isCommon: values[4] === 'true'
      });
    }
    
    if (batch.length > 0) {
      try {
        await apiPost('DrugSideEffect', batch);
        imported += batch.length;
      } catch (e) {
        skipped += batch.length;
      }
    }
    
    const progress = Math.min(i + batchSize - 1, lines.length - 1);
    process.stdout.write(`\r   Progress: ${progress}/${lines.length - 1} (imported: ${imported}, skipped: ${skipped})`);
    await new Promise(r => setTimeout(r, 50));
  }
  
  console.log(`\r   ✅ Imported ${imported} side effects (skipped: ${skipped})`);
}

async function getCounts() {
  try {
    const drugs = await fetch(`${API_URL}/Drug?select=count`, { headers: { 'Authorization': `Bearer ${API_KEY}` } });
    const icd10 = await fetch(`${API_URL}/ICD10Mapping?select=count`, { headers: { 'Authorization': `Bearer ${API_KEY}` } });
    const interactions = await fetch(`${API_URL}/DrugInteraction?select=count`, { headers: { 'Authorization': `Bearer ${API_KEY}` } });
    const sideEffects = await fetch(`${API_URL}/DrugSideEffect?select=count`, { headers: { 'Authorization': `Bearer ${API_KEY}` } });
    
    return {
      drugs: (await drugs.json()).length,
      icd10: (await icd10.json()).length,
      interactions: (await interactions.json()).length,
      sideEffects: (await sideEffects.json()).length
    };
  } catch (e) {
    return { drugs: 0, icd10: 0, interactions: 0, sideEffects: 0 };
  }
}

async function main() {
  console.log('══════════════════════════════════════════════════');
  console.log('🚀 NEON REST API IMPORT');
  console.log(`   Endpoint: ${API_URL}`);
  console.log('══════════════════════════════════════════════════');
  
  const startTime = Date.now();
  
  await importDrugs();
  
  const drugMap = await buildDrugMap();
  
  await importICD10(drugMap);
  await importInteractions(drugMap);
  await importSideEffects(drugMap);
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  
  const counts = await getCounts();
  
  console.log('\n══════════════════════════════════════════════════');
  console.log('✅ IMPORT COMPLETE');
  console.log(`⏱️  Duration: ${duration}s`);
  console.log('══════════════════════════════════════════════════');
  console.log(`📊 Drugs: ${counts.drugs}`);
  console.log(`📊 ICD10 Mappings: ${counts.icd10}`);
  console.log(`📊 Interactions: ${counts.interactions}`);
  console.log(`📊 Side Effects: ${counts.sideEffects}`);
  console.log('══════════════════════════════════════════════════');
}

main().catch(err => {
  console.error('\n❌ Import failed:', err.message);
  process.exit(1);
});
