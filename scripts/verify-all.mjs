#!/usr/bin/env node
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DIRECT_URL || process.env.DATABASE_URL);

async function verify() {
  console.log('📊 NEON DATABASE - FULL COUNTS\n');
  
  const counts = await sql`SELECT 
    (SELECT COUNT(*) FROM "Drug") as drugs,
    (SELECT COUNT(*) FROM "ICD10Mapping") as icd10,
    (SELECT COUNT(*) FROM "DrugInteraction") as interactions,
    (SELECT COUNT(*) FROM "Patient") as patients,
    (SELECT COUNT(*) FROM "User") as users,
    (SELECT COUNT(*) FROM "Course") as courses`;
  
  console.log('══════════════════════════════════════════════════');
  console.log(`💊 Drugs:             ${counts[0].drugs.toLocaleString()}`);
  console.log(`🏥 ICD10 Mappings:    ${counts[0].icd10.toLocaleString()}`);
  console.log(`⚡ Interactions:      ${counts[0].interactions.toLocaleString()}`);
  console.log(`👤 Patients:          ${counts[0].patients.toLocaleString()}`);
  console.log(`👥 Users:             ${counts[0].users.toLocaleString()}`);
  console.log(`📚 Courses:           ${counts[0].courses.toLocaleString()}`);
  console.log('══════════════════════════════════════════════════');
  
  const total = counts[0].drugs + counts[0].icd10 + counts[0].interactions + counts[0].patients;
  console.log(`\n📈 Total Records: ${total.toLocaleString()}`);
}

verify().catch(console.error);
