#!/usr/bin/env node
/**
 * Migrate Patients and Academy data from Desktop DB
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

const sql = neon(process.env.DIRECT_URL || process.env.DATABASE_URL);
const BATCH_SIZE = 50;

async function migrate() {
  console.log('══════════════════════════════════════════════════');
  console.log('🚀 MIGRATING PATIENTS & ACADEMY TO NEON');
  console.log('══════════════════════════════════════════════════\n');

  const sqlite = new Database('C:/Users/Admin/OneDrive/Desktop/drug-intelligence.db', { readonly: true });
  await sql`SELECT NOW()`;
  console.log('✅ Connected to Neon\n');

  // ========== PATIENTS ==========
  console.log('🏥 Migrating Patients...');
  const patients = sqlite.prepare('SELECT * FROM patients').all();
  console.log(`   Source: ${patients.length.toLocaleString()} patients`);
  
  let imported = 0;
  let skipped = 0;
  
  for (const p of patients) {
    try {
      const id = p.id?.startsWith('c') ? p.id : randomUUID();
      
      await sql`
        INSERT INTO "Patient" (id, "clinicianId", mrn, "firstName", "lastName", "dateOfBirth", gender, "weightKg", "heightCm", allergies, conditions, "creatinineClearance", "hepaticImpairment", "isPregnant", "createdAt", "updatedAt")
        VALUES (${id}, ${p.clinician_id || null}, ${p.mrn || null}, ${p.first_name || ''}, ${p.last_name || ''}, ${p.date_of_birth || new Date()}, ${p.gender || ''}, ${p.weight_kg || null}, ${p.height_cm || null}, ${p.allergies || null}, ${p.conditions || null}, ${p.creatinine_clearance || null}, ${p.hepatic_impairment || false}, ${p.is_pregnant || false}, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `;
      imported++;
      if (imported % 1000 === 0) process.stdout.write(`\r   Progress: ${imported.toLocaleString()}/${patients.length.toLocaleString()}`);
    } catch (e) {
      skipped++;
    }
  }
  console.log(`\n   ✅ Imported ${imported.toLocaleString()} patients (skipped: ${skipped.toLocaleString()})\n`);

  // ========== COURSES ==========
  console.log('📚 Migrating Academy Courses...');
  const courses = sqlite.prepare('SELECT * FROM academy_courses').all();
  console.log(`   Source: ${courses.length.toLocaleString()} courses`);
  
  imported = 0;
  for (const c of courses) {
    try {
      await sql`
        INSERT INTO "Course" (id, title, "titleAr", description, category, difficulty, credits, duration, "isPublished", "createdAt", "updatedAt")
        VALUES (${c.id || randomUUID()}, ${c.title || ''}, null, ${c.description || null}, ${c.category || 'General'}, ${c.difficulty || 'Beginner'}, 0, ${c.duration || 0}, ${c.is_published || true}, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `;
      imported++;
    } catch (e) {}
  }
  console.log(`   ✅ Imported ${imported.toLocaleString()} courses\n`);

  // ========== LESSONS ==========
  console.log('📖 Migrating Academy Lessons...');
  const lessons = sqlite.prepare('SELECT * FROM academy_lessons').all();
  console.log(`   Source: ${lessons.length.toLocaleString()} lessons`);
  
  imported = 0;
  for (const l of lessons) {
    try {
      await sql`
        INSERT INTO "CourseModule" (id, "courseId", "moduleNumber", title, content, "estimatedMinutes", "createdAt", "updatedAt")
        VALUES (${l.id || randomUUID()}, ${l.course_id || null}, ${l.lesson_number || 1}, ${l.title || ''}, ${l.content || null}, ${l.duration || 30}, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `;
      imported++;
    } catch (e) {}
  }
  console.log(`   ✅ Imported ${imported.toLocaleString()} lessons\n`);

  sqlite.close();

  // Verify
  console.log('══════════════════════════════════════════════════');
  console.log('📊 FINAL COUNTS');
  console.log('══════════════════════════════════════════════════');
  const counts = await sql`SELECT 
    (SELECT COUNT(*) FROM "Patient") as patients,
    (SELECT COUNT(*) FROM "Course") as courses,
    (SELECT COUNT(*) FROM "CourseModule") as lessons`;
  console.log(`🏥 Patients: ${counts[0].patients.toLocaleString()}`);
  console.log(`📚 Courses: ${counts[0].courses.toLocaleString()}`);
  console.log(`📖 Lessons: ${counts[0].lessons.toLocaleString()}`);
  console.log('══════════════════════════════════════════════════');
  console.log('✅ MIGRATION COMPLETE!');
}

migrate().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
