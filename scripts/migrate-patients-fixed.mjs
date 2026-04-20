#!/usr/bin/env node
/**
 * Migrate Patients from Desktop DB with proper field mapping
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

const sql = neon(process.env.DIRECT_URL || process.env.DATABASE_URL);

async function migrate() {
  console.log('══════════════════════════════════════════════════');
  console.log('🚀 MIGRATING PATIENTS TO NEON');
  console.log('══════════════════════════════════════════════════\n');

  const sqlite = new Database('C:/Users/Admin/OneDrive/Desktop/drug-intelligence.db', { readonly: true });
  await sql`SELECT NOW()`;
  console.log('✅ Connected to Neon\n');

  // First, ensure we have a default clinician (admin)
  console.log('👤 Ensuring default clinician exists...');
  let clinicianId;
  const admin = await sql`SELECT id FROM "User" WHERE email = 'admin@drugeye.com' LIMIT 1`;
  if (admin.length > 0) {
    clinicianId = admin[0].id;
    console.log(`   Using admin as clinician: ${clinicianId}\n`);
  } else {
    // Create a system clinician
    clinicianId = randomUUID();
    await sql`
      INSERT INTO "User" (id, email, password, name, role, "isVerified", "createdAt", "updatedAt")
      VALUES (${clinicianId}, 'system@drugeye.com', 'system', 'System Clinician', 'user', true, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `;
    console.log(`   Created system clinician: ${clinicianId}\n`);
  }

  // ========== PATIENTS ==========
  console.log('🏥 Migrating Patients...');
  const patients = sqlite.prepare('SELECT * FROM patients').all();
  console.log(`   Source: ${patients.length.toLocaleString()} patients`);
  
  let imported = 0;
  let skipped = 0;
  
  for (const p of patients) {
    try {
      // Parse name into first/last
      const nameParts = (p.name || '').split(' ');
      const firstName = nameParts[0] || 'Unknown';
      const lastName = nameParts.slice(1).join(' ') || 'Patient';
      
      // Calculate DOB from age
      const age = parseInt(p.age) || 30;
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - age);
      
      const id = randomUUID();
      
      await sql`
        INSERT INTO "Patient" (id, "clinicianId", mrn, "firstName", "lastName", "dateOfBirth", gender, "weightKg", "heightCm", allergies, conditions, "createdAt", "updatedAt")
        VALUES (${id}, ${clinicianId}, ${p.id?.toString() || null}, ${firstName}, ${lastName}, ${dob}, ${p.gender || ''}, null, null, null, ${p.medical_condition || null}, NOW(), NOW())
      `;
      imported++;
      if (imported % 1000 === 0) process.stdout.write(`\r   Progress: ${imported.toLocaleString()}/${patients.length.toLocaleString()}`);
    } catch (e) {
      skipped++;
    }
  }
  console.log(`\n   ✅ Imported ${imported.toLocaleString()} patients (skipped: ${skipped.toLocaleString()})\n`);

  sqlite.close();

  // Verify
  console.log('══════════════════════════════════════════════════');
  console.log('📊 FINAL COUNTS');
  console.log('══════════════════════════════════════════════════');
  const counts = await sql`SELECT (SELECT COUNT(*) FROM "Patient") as patients`;
  console.log(`🏥 Patients: ${counts[0].patients.toLocaleString()}`);
  console.log('══════════════════════════════════════════════════');
  console.log('✅ MIGRATION COMPLETE!');
}

migrate().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
