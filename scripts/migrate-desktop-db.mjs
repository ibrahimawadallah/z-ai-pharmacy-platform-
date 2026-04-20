#!/usr/bin/env node
/**
 * Migrate ALL data from Desktop drug-intelligence.db to Neon
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

const sql = neon(process.env.DIRECT_URL || process.env.DATABASE_URL);
const BATCH_SIZE = 100;

async function batchInsert(table, columns, valuesList) {
  if (valuesList.length === 0) return 0;
  const placeholders = valuesList.map((_, i) => 
    `(${columns.map((_, j) => `$${i * columns.length + j + 1}`).join(', ')})`
  ).join(', ');
  const flatValues = valuesList.flat();
  const query = `INSERT INTO "${table}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES ${placeholders}`;
  await sql.query(query, flatValues);
  return valuesList.length;
}

async function migrate() {
  console.log('══════════════════════════════════════════════════');
  console.log('🚀 MIGRATING DESKTOP DB TO NEON');
  console.log('══════════════════════════════════════════════════\n');

  const sqlite = new Database('C:/Users/Admin/OneDrive/Desktop/drug-intelligence.db', { readonly: true });

  // Test connection
  await sql`SELECT NOW()`;
  console.log('✅ Connected to Neon\n');

  // ========== PATIENTS ==========
  console.log('🏥 Migrating Patients...');
  const patients = sqlite.prepare('SELECT * FROM patients').all();
  console.log(`   Source: ${patients.length.toLocaleString()} patients`);
  
  let batch = [];
  let imported = 0;
  for (const p of patients) {
    batch.push([
      p.id || randomUUID(),
      p.clinician_id || null,
      p.mrn || null,
      p.first_name || '',
      p.last_name || '',
      p.date_of_birth || new Date(),
      p.gender || '',
      p.weight_kg || null,
      p.height_cm || null,
      p.allergies || null,
      p.conditions || null,
      p.creatinine_clearance || null,
      p.hepatic_impairment || false,
      p.is_pregnant || false,
      new Date(),
      new Date()
    ]);
    
    if (batch.length >= BATCH_SIZE) {
      await batchInsert('Patient', [
        'id', 'clinicianId', 'mrn', 'firstName', 'lastName', 'dateOfBirth',
        'gender', 'weightKg', 'heightCm', 'allergies', 'conditions',
        'creatinineClearance', 'hepaticImpairment', 'isPregnant', 'createdAt', 'updatedAt'
      ], batch);
      imported += batch.length;
      batch = [];
      if (imported % 1000 === 0) process.stdout.write(`\r   Progress: ${imported.toLocaleString()}/${patients.length.toLocaleString()}`);
    }
  }
  if (batch.length > 0) {
    await batchInsert('Patient', [
      'id', 'clinicianId', 'mrn', 'firstName', 'lastName', 'dateOfBirth',
      'gender', 'weightKg', 'heightCm', 'allergies', 'conditions',
      'creatinineClearance', 'hepaticImpairment', 'isPregnant', 'createdAt', 'updatedAt'
    ], batch);
    imported += batch.length;
  }
  console.log(`\n   ✅ Imported ${imported.toLocaleString()} patients\n`);

  // ========== ACADEMY COURSES ==========
  console.log('📚 Migrating Academy Courses...');
  const courses = sqlite.prepare('SELECT * FROM academy_courses').all();
  console.log(`   Source: ${courses.length.toLocaleString()} courses`);
  
  batch = [];
  imported = 0;
  for (const c of courses) {
    batch.push([
      c.id || randomUUID(),
      c.title || '',
      c.description || null,
      c.category || 'General',
      c.difficulty || 'Beginner',
      c.duration || 0,
      c.is_published || true,
      new Date(),
      new Date()
    ]);
    
    if (batch.length >= BATCH_SIZE) {
      await sql`INSERT INTO "Course" (id, title, description, category, difficulty, duration, "isPublished", "createdAt", "updatedAt") VALUES ${sql.join(batch.map(b => sql`(${sql.join(b)})`))}`;
      imported += batch.length;
      batch = [];
    }
  }
  console.log(`   ✅ Imported ${imported.toLocaleString()} courses\n`);

  sqlite.close();

  // Verify
  console.log('══════════════════════════════════════════════════');
  console.log('📊 FINAL COUNTS');
  console.log('══════════════════════════════════════════════════');
  const counts = await sql`SELECT 
    (SELECT COUNT(*) FROM "Patient") as patients,
    (SELECT COUNT(*) FROM "Course") as courses`;
  console.log(`🏥 Patients: ${counts[0].patients.toLocaleString()}`);
  console.log(`📚 Courses: ${counts[0].courses.toLocaleString()}`);
  console.log('══════════════════════════════════════════════════');
  console.log('✅ MIGRATION COMPLETE!');
}

migrate().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
