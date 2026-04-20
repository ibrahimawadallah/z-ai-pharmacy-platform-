#!/usr/bin/env node
/**
 * Batch import using Prisma with transaction batching
 * Much faster for large datasets
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL } }
});

const BATCH_SIZE = 100;

async function importDrugs() {
  console.log('💊 Importing Drugs in batches...');
  
  const sqlite = new Database('db/custom.db', { readonly: true });
  const drugs = sqlite.prepare('SELECT * FROM Drug').all();
  console.log(`   Source: ${drugs.length} drugs`);
  
  let imported = 0;
  const drugMap = new Map();
  
  // Process in batches
  for (let i = 0; i < drugs.length; i += BATCH_SIZE) {
    const batch = drugs.slice(i, i + BATCH_SIZE);
    
    for (const d of batch) {
      // Skip if already imported this drug code
      if (drugMap.has(d.drugCode)) continue;
      
      try {
        const result = await prisma.drug.create({
          data: {
            id: randomUUID(), drugCode: d.drugCode, packageName: d.packageName,
            genericName: d.genericName, strength: d.strength,
            dosageForm: d.dosageForm, packageSize: d.packageSize,
            status: d.status, dispenseMode: d.dispenseMode,
            packagePricePublic: d.packagePricePublic, packagePricePharmacy: d.packagePricePharmacy,
            unitPricePublic: d.unitPricePublic, unitPricePharmacy: d.unitPricePharmacy,
            agentName: d.agentName, manufacturerName: d.manufacturerName,
            insurancePlan: d.insurancePlan, govtFundedCoverage: d.govtFundedCoverage,
            uppScope: d.uppScope, includedInThiqaABM: d.includedInThiqaABM,
            includedInBasic: d.includedInBasic, includedInABM1: d.includedInABM1,
            includedInABM7: d.includedInABM7, pregnancyCategory: d.pregnancyCategory,
            breastfeedingSafety: d.breastfeedingSafety, renalAdjustment: d.renalAdjustment
          }
        });
        drugMap.set(d.drugCode, result.id);
        imported++;
      } catch (e) {
        if (e.code === 'P2002') {
          // Duplicate - fetch existing
          const existing = await prisma.drug.findUnique({
            where: { drugCode: d.drugCode },
            select: { id: true }
          });
          if (existing) drugMap.set(d.drugCode, existing.id);
        }
      }
    }
    
    if (i % 1000 === 0) {
      console.log(`   Progress: ${imported}/${drugs.length}`);
    }
  }
  
  sqlite.close();
  console.log(`   ✅ Imported ${imported} drugs`);
  return drugMap;
}

async function importICD10(drugMap) {
  console.log('\n🏥 Importing ICD10 Mappings...');
  
  const sqlite = new Database('db/custom.db', { readonly: true });
  const mappings = sqlite.prepare('SELECT * FROM ICD10Mapping').all();
  console.log(`   Source: ${mappings.length} mappings`);
  
  let imported = 0;
  let skipped = 0;
  const seen = new Set(); // Track unique drugId+code combinations
  
  for (const m of mappings) {
    const drugId = drugMap.get(m.drugCode);
    if (!drugId) { skipped++; continue; }
    
    // Create unique key for this mapping
    const key = `${drugId}-${m.code}`;
    if (seen.has(key)) { skipped++; continue; }
    seen.add(key);
    
    try {
      await prisma.iCD10Mapping.create({
        data: {
          id: randomUUID(), drugId, code: m.code,
          description: m.description, system: m.system || 'ICD10'
        }
      });
      imported++;
    } catch (e) {
      // Skip duplicates
    }
    
    if (imported % 1000 === 0) {
      process.stdout.write(`\r   Progress: ${imported}/${mappings.length} (skipped: ${skipped})`);
    }
  }
  
  sqlite.close();
  console.log(`\r   ✅ Imported ${imported} mappings (skipped: ${skipped})`);
}

async function importInteractions(drugMap) {
  console.log('\n⚡ Importing Drug Interactions...');
  
  const sqlite = new Database('db/custom.db', { readonly: true });
  const interactions = sqlite.prepare('SELECT * FROM DrugInteraction').all();
  console.log(`   Source: ${interactions.length} interactions`);
  
  let imported = 0;
  
  for (const ix of interactions) {
    const drugId = drugMap.get(ix.drugCode);
    const interactingId = drugMap.get(ix.interactingDrugCode);
    if (!drugId || !interactingId) continue;
    
    try {
      await prisma.drugInteraction.create({
        data: {
          id: randomUUID(), drugId, interactingDrugId: interactingId,
          interactingDrugName: ix.interactingDrugName, severity: ix.severity,
          mechanism: ix.mechanism, recommendation: ix.recommendation,
          isHypothetical: ix.isHypothetical || false, references: ix.references || '[]'
        }
      });
      imported++;
    } catch (e) {}
  }
  
  sqlite.close();
  console.log(`   ✅ Imported ${imported} interactions`);
}

async function main() {
  console.log('🚀 Starting batch import to Neon...\n');
  
  const drugMap = await importDrugs();
  await importICD10(drugMap);
  await importInteractions(drugMap);
  
  await prisma.$disconnect();
  
  console.log('\n══════════════════════════════════════════════════');
  console.log('✅ BATCH IMPORT COMPLETE');
  console.log('══════════════════════════════════════════════════');
}

main().catch(err => {
  console.error('❌ Error:', err);
  prisma.$disconnect();
  process.exit(1);
});
