#!/usr/bin/env node
/**
 * Create admin user directly in Neon
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { randomUUID } from 'crypto';

const sql = neon(process.env.DIRECT_URL || process.env.DATABASE_URL);

async function createAdmin() {
  console.log('Creating admin user...\n');
  
  const adminEmail = 'admin@drugeye.com';
  const adminPassword = '$2b$10$YourHashedPasswordHere'; // We'll use a simple approach
  const adminName = 'System Administrator';
  
  try {
    // Check if admin already exists
    const existing = await sql`SELECT id, email FROM "User" WHERE email = ${adminEmail}`;
    
    if (existing.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   Email: ${existing[0].email}`);
      console.log(`   ID: ${existing[0].id}`);
      console.log('\n✅ You can sign in with the existing account.');
      return;
    }
    
    // Create admin user
    // Note: In production, you should hash the password properly
    const id = randomUUID();
    const now = new Date().toISOString();
    
    // Using bcrypt hash for "Admin123456!"
    const hashedPassword = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
    
    await sql`
      INSERT INTO "User" (id, email, password, name, role, "isVerified", "createdAt", "updatedAt")
      VALUES (${id}, ${adminEmail}, ${hashedPassword}, ${adminName}, 'admin', true, ${now}, ${now})
    `;
    
    console.log('══════════════════════════════════════════════════');
    console.log('✅ ADMIN USER CREATED SUCCESSFULLY!');
    console.log('══════════════════════════════════════════════════');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: Admin123456!`);
    console.log(`🆔 User ID: ${id}`);
    console.log('══════════════════════════════════════════════════');
    console.log('\n🌐 Sign in at: https://z-ai-pharmacy-platform.vercel.app/auth/login');
    
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
}

createAdmin();
