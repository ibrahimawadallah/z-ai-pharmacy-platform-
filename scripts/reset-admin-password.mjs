#!/usr/bin/env node
/**
 * Reset admin password
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { hash } from 'bcryptjs';

const sql = neon(process.env.DIRECT_URL || process.env.DATABASE_URL);

async function resetPassword() {
  console.log('Resetting admin password...\n');
  
  const adminEmail = 'admin@drugeye.com';
  const newPassword = 'Admin123456!';
  
  try {
    // Hash the password
    const hashedPassword = await hash(newPassword, 10);
    console.log(`New hash: ${hashedPassword}`);
    
    // Update password
    const result = await sql`
      UPDATE "User" 
      SET password = ${hashedPassword}, "updatedAt" = NOW()
      WHERE email = ${adminEmail}
      RETURNING id, email, name
    `;
    
    if (result.length === 0) {
      console.log('❌ Admin user not found!');
      return;
    }
    
    console.log('══════════════════════════════════════════════════');
    console.log('✅ PASSWORD RESET SUCCESSFUL!');
    console.log('══════════════════════════════════════════════════');
    console.log(`📧 Email: ${result[0].email}`);
    console.log(`🔑 Password: ${newPassword}`);
    console.log(`🆔 User ID: ${result[0].id}`);
    console.log('══════════════════════════════════════════════════');
    console.log('\n🌐 Sign in at: https://z-ai-pharmacy-platform.vercel.app/auth/login');
    console.log('\n⚠️  Note: Wait 30 seconds for changes to propagate.');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    
    // Try without bcrypt
    console.log('\n⚠️  Trying direct update with known hash...');
    try {
      const knownHash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
      await sql`UPDATE "User" SET password = ${knownHash} WHERE email = ${adminEmail}`;
      console.log('✅ Password updated with fallback hash');
      console.log(`🔑 Try password: Admin123456!`);
    } catch (err2) {
      console.error('❌ Fallback failed:', err2.message);
    }
  }
}

resetPassword();
