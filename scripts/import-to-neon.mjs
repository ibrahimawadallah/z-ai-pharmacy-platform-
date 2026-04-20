#!/usr/bin/env node
/**
 * Import upload database to Neon PostgreSQL
 * Maps old schema to new Prisma schema
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

const sql = neon(process.env.DIRECT_URL || process.env.DATABASE_URL);

async function importData() {
  console.log('🚀 Connecting to Neon PostgreSQL...');
  await sql`SELECT NOW()`;
  console.log('✅ Connected\n');

  const sqlite = new Database('upload/drug-intelligence.db', { readonly: true });

  // 1. Import Drugs
  console.log('💊 Importing Drugs...');
  const drugs = sqlite.prepare('SELECT * FROM drugs').all();
  console.log(`   Source: ${drugs.length} drugs`);

  let drugImported = 0;
  let drugSkipped = 0;
  const drugIdMap = new Map(); // old_id -> new_id

  for (let i = 0; i < drugs.length; i++) {
    const d = drugs[i];
    try {
      const result = await sql`
        INSERT INTO "Drug" (
          id, "drugCode", "packageName", "genericName", strength, "dosageForm", 
          "packageSize", status, "createdAt", "updatedAt"
        ) VALUES (
          ${randomUUID()}, 
          ${d.drug_code || d.id?.toString()}, 
          ${d.drug_name}, 
          ${d.generic_name}, 
          ${d.strength}, 
          ${d.dosage_form},
          ${d.package_size},
          'active',
          NOW(), 
          NOW()
        )
        ON CONFLICT ("drugCode") DO UPDATE SET
          "packageName" = EXCLUDED."packageName",
          "genericName" = EXCLUDED."genericName"
        RETURNING id, "drugCode"
      `;
      
      if (result && result[0]) {
        drugIdMap.set(d.id, result[0].id);
        drugImported++;
      }
    } catch (e) {
      drugSkipped++;
    }

    if ((i + 1) % 500 === 0) {
      process.stdout.write(`\r   Progress: ${i + 1}/${drugs.length} (imported: ${drugImported}, skipped: ${drugSkipped})`);
    }
  }
  console.log(`\r   ✅ Imported ${drugImported} drugs (skipped: ${drugSkipped})\n`);

  // 2. Build drug code map
  console.log('🗺️  Building drug code map...');
  const allDrugs = await sql`SELECT id, "drugCode" FROM "Drug"`;
  const drugCodeToId = new Map();
  for (const d of allDrugs) {
    drugCodeToId.set(d.drugCode, d.id);
  }
  console.log(`   Mapped ${drugCodeToId.size} drugs\n`);

  // 3. Import Patients
  console.log('👤 Importing Patients...');
  const patients = sqlite.prepare('SELECT * FROM patients').all();
  console.log(`   Source: ${patients.length} patients`);

  let patientImported = 0;
  for (let i = 0; i < patients.length; i++) {
    const p = patients[i];
    try {
      await sql`
        INSERT INTO "Patient" (
          id, "userId", name, "dateOfBirth", gender, phone, email,
          "emergencyContact", "insuranceId", "medicalRecordNumber", "createdAt", "updatedAt"
        ) VALUES (
          ${randomUUID()},
          NULL,
          ${p.name},
          ${p.date_of_birth},
          ${p.gender},
          ${p.phone},
          ${p.email},
          ${p.emergency_contact},
          ${p.insurance_id},
          ${p.patient_id},
          ${p.created_at || new Date()},
          NOW()
        )
        ON CONFLICT DO NOTHING
      `;
      patientImported++;
    } catch (e) {}

    if ((i + 1) % 500 === 0) {
      process.stdout.write(`\r   Progress: ${i + 1}/${patients.length} (imported: ${patientImported})`);
    }
  }
  console.log(`\r   ✅ Imported ${patientImported} patients\n`);

  // 4. Import Drug Interactions
  console.log('⚡ Importing Drug Interactions...');
  const interactions = sqlite.prepare('SELECT * FROM drug_interactions').all();
  console.log(`   Source: ${interactions.length} interactions`);

  let ixImported = 0;
  for (const ix of interactions) {
    const drugId = drugIdMap.get(ix.drug_id);
    const interactingId = drugIdMap.get(ix.interacting_drug_id);
    
    if (!drugId || !interactingId) continue;

    try {
      await sql`
        INSERT INTO "DrugInteraction" (
          id, "drugId", "interactingDrugId", "interactingDrugName", 
          severity, mechanism, "isHypothetical", "createdAt", "updatedAt"
        ) VALUES (
          ${randomUUID()},
          ${drugId},
          ${interactingId},
          ${ix.interacting_drug_id?.toString()},
          ${ix.severity},
          ${ix.interaction_type},
          false,
          NOW(),
          NOW()
        )
      `;
      ixImported++;
    } catch (e) {}
  }
  console.log(`   ✅ Imported ${ixImported} interactions\n`);

  sqlite.close();

  // Final Counts
  console.log('📊 Final Database Counts:');
  const counts = await sql`
    SELECT 
      (SELECT COUNT(*) FROM "Drug") as drugs,
      (SELECT COUNT(*) FROM "Patient") as patients,
      (SELECT COUNT(*) FROM "DrugInteraction") as interactions
  `;
  console.log(`   💊 Drugs: ${counts[0].drugs.toLocaleString()}`);
  console.log(`   👤 Patients: ${counts[0].patients.toLocaleString()}`);
  console.log(`   ⚡ Interactions: ${counts[0].interactions.toLocaleString()}`);

  console.log('\n✅ Import Complete!');
}

importData().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
