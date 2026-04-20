#!/usr/bin/env node
/**
 * Fix admin password with correct bcrypt hash
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DIRECT_URL || process.env.DATABASE_URL);

async function fixPassword() {
  console.log('Fixing admin password with bcrypt...\n');
  
  const adminEmail = 'admin@drugeye.com';
  const password = 'Admin123456!';
  
  // Generate proper bcrypt hash
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('Generated hash:', hash);
  
  // Verify the hash works
  const isValid = await bcrypt.compare(password, hash);
  console.log('Hash verification:', isValid ? '✅ Valid' : '❌ Invalid');
  
  // Update in database
  try {
    await sql`UPDATE "User" SET password = ${hash}, "updatedAt" = NOW() WHERE email = ${adminEmail}`;
    
    console.log('\n══════════════════════════════════════════════════');
    console.log('✅ PASSWORD UPDATED SUCCESSFULLY!');
    console.log('══════════════════════════════════════════════════');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${password}`);
    console.log('══════════════════════════════════════════════════');
    console.log('\n🌐 Sign in: https://z-ai-pharmacy-platform.vercel.app/auth/login');
    
  } catch (err) {
    console.error('❌ Database error:', err.message);
  }
}

fixPassword();
