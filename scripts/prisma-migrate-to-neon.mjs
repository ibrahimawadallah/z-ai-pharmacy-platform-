#!/usr/bin/env node
/**
 * Migrate data from SQLite to Neon using Prisma
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

// Initialize Prisma with Neon connection
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function migrateData() {
  console.log('🚀 Connecting to Neon PostgreSQL via Prisma...');
  await prisma.$connect();
  console.log('✅ Connected\n');

  // Connect to SQLite source
  const sqlite = new Database('db/custom.db', { readonly: true });

  // 1. Import Drugs
  console.log('💊 Importing Drugs...');
  const drugs = sqlite.prepare('SELECT * FROM Drug').all();
  console.log(`   Source: ${drugs.length} drugs`);

  let drugCount = 0;
  const drugIdMap = new Map(); // old drugCode -> new id

  for (const d of drugs) {
    try {
      const result = await prisma.drug.create({
        data: {
          id: randomUUID(),
          drugCode: d.drugCode,
          packageName: d.packageName,
          genericName: d.genericName,
          strength: d.strength,
          dosageForm: d.dosageForm,
          packageSize: d.packageSize,
          status: d.status,
          dispenseMode: d.dispenseMode,
          packagePricePublic: d.packagePricePublic,
          packagePricePharmacy: d.packagePricePharmacy,
          unitPricePublic: d.unitPricePublic,
          unitPricePharmacy: d.unitPricePharmacy,
          agentName: d.agentName,
          manufacturerName: d.manufacturerName,
          insurancePlan: d.insurancePlan,
          govtFundedCoverage: d.govtFundedCoverage,
          uppScope: d.uppScope,
          includedInThiqaABM: d.includedInThiqaABM,
          includedInBasic: d.includedInBasic,
          includedInABM1: d.includedInABM1,
          includedInABM7: d.includedInABM7,
          pregnancyCategory: d.pregnancyCategory,
          breastfeedingSafety: d.breastfeedingSafety,
          renalAdjustment: d.renalAdjustment
        }
      });
      drugIdMap.set(d.drugCode, result.id);
      drugCount++;
    } catch (e) {
      if (e.code === 'P2002') {
        // Already exists, get existing
        const existing = await prisma.drug.findUnique({
          where: { drugCode: d.drugCode },
          select: { id: true }
        });
        if (existing) drugIdMap.set(d.drugCode, existing.id);
      }
    }

    if (drugCount % 1000 === 0) {
      process.stdout.write(`\r   Progress: ${drugCount}/${drugs.length}`);
    }
  }
  console.log(`\r   ✅ Imported ${drugCount} drugs\n`);

  // 2. Import ICD10 Mappings
  console.log('🏥 Importing ICD10 Mappings...');
  const mappings = sqlite.prepare('SELECT * FROM ICD10Mapping').all();
  console.log(`   Source: ${mappings.length} mappings`);

  let mappingCount = 0;
  for (const m of mappings) {
    const drugId = drugIdMap.get(m.drugCode);
    if (!drugId) continue;

    try {
      await prisma.iCD10Mapping.create({
        data: {
          id: randomUUID(),
          drugId: drugId,
          code: m.code,
          description: m.description,
          system: m.system || 'ICD10'
        }
      });
      mappingCount++;
    } catch (e) {}

    if (mappingCount % 1000 === 0) {
      process.stdout.write(`\r   Progress: ${mappingCount}/${mappings.length}`);
    }
  }
  console.log(`\r   ✅ Imported ${mappingCount} ICD10 mappings\n`);

  // 3. Import Drug Interactions
  console.log('⚡ Importing Drug Interactions...');
  const interactions = sqlite.prepare('SELECT * FROM DrugInteraction').all();
  console.log(`   Source: ${interactions.length} interactions`);

  let ixCount = 0;
  for (const ix of interactions) {
    const drugId = drugIdMap.get(ix.drugCode);
    const interactingDrugId = drugIdMap.get(ix.interactingDrugCode);
    
    if (!drugId || !interactingDrugId) continue;

    try {
      await prisma.drugInteraction.create({
        data: {
          id: randomUUID(),
          drugId: drugId,
          interactingDrugId: interactingDrugId,
          interactingDrugName: ix.interactingDrugName,
          severity: ix.severity,
          mechanism: ix.mechanism,
          recommendation: ix.recommendation,
          isHypothetical: ix.isHypothetical || false,
          references: ix.references || '[]'
        }
      });
      ixCount++;
    } catch (e) {}
  }
  console.log(`   ✅ Imported ${ixCount} interactions\n`);

  sqlite.close();
  await prisma.$disconnect();

  // Summary
  console.log('══════════════════════════════════════════════════');
  console.log('✅ MIGRATION COMPLETE');
  console.log('══════════════════════════════════════════════════');
  console.log(`💊 Drugs: ${drugCount.toLocaleString()}`);
  console.log(`🏥 ICD10 Mappings: ${mappingCount.toLocaleString()}`);
  console.log(`⚡ Interactions: ${ixCount.toLocaleString()}`);
  console.log('══════════════════════════════════════════════════');
}

migrateData().catch(err => {
  console.error('❌ Error:', err);
  prisma.$disconnect();
  process.exit(1);
});
