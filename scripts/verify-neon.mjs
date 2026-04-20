#!/usr/bin/env node
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DIRECT_URL || process.env.DATABASE_URL);

async function verify() {
  console.log('Verifying Neon database...\n');
  
  const counts = await sql`SELECT 
    (SELECT COUNT(*) FROM "Drug") as drugs, 
    (SELECT COUNT(*) FROM "ICD10Mapping") as icd10, 
    (SELECT COUNT(*) FROM "DrugInteraction") as interactions`;
  
  console.log('══════════════════════════════════════════════════');
  console.log('📊 NEON DATABASE COUNTS');
  console.log('══════════════════════════════════════════════════');
  console.log(`💊 Drugs: ${counts[0].drugs.toLocaleString()}`);
  console.log(`🏥 ICD10 Mappings: ${counts[0].icd10.toLocaleString()}`);
  console.log(`⚡ Interactions: ${counts[0].interactions.toLocaleString()}`);
  console.log('══════════════════════════════════════════════════');
}

verify().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
