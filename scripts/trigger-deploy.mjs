#!/usr/bin/env node
/**
 * Trigger Vercel deployment
 */

import 'dotenv/config';

async function deploy() {
  console.log('🚀 Triggering Vercel deployment...\n');
  
  // Using Vercel CLI to deploy
  const { execSync } = await import('child_process');
  
  try {
    console.log('📦 Deploying to Vercel...');
    const result = execSync('npx vercel --prod --yes', { 
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log(result);
    console.log('\n✅ Deployment triggered!');
    console.log('🌐 Monitor at: https://vercel.com/ibrahims-projects-d7ee9352/z-ai-pharmacy-platform');
  } catch (err) {
    console.error('❌ Deployment failed:', err.message);
    console.log('\n⚠️  Trying alternative method...');
    
    // Try using git push to trigger deployment
    try {
      console.log('📤 Pushing to git...');
      execSync('git add . && git commit -m "Fix chat window responsiveness" && git push', {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: 'pipe'
      });
      console.log('✅ Changes pushed - Vercel will auto-deploy');
    } catch (gitErr) {
      console.error('❌ Git push failed:', gitErr.message);
    }
  }
}

deploy();
