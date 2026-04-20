#!/usr/bin/env node
/**
 * Deploy to Vercel using available methods
 */

import 'dotenv/config';
import { readFileSync } from 'fs';

async function deploy() {
  console.log('🚀 Deploying to Vercel...\n');
  
  // Try to get deploy hook from env or check vercel.json
  const deployHook = process.env.VERCEL_DEPLOY_HOOK;
  
  if (deployHook) {
    console.log('📡 Using deploy hook...');
    try {
      const response = await fetch(deployHook, { method: 'POST' });
      if (response.ok) {
        console.log('✅ Deploy hook triggered successfully!');
        console.log('🌐 URL: https://z-ai-pharmacy-platform.vercel.app');
        return;
      }
    } catch (e) {
      console.log('⚠️  Deploy hook failed, trying CLI...');
    }
  }
  
  // Use Vercel CLI
  console.log('📦 Using Vercel CLI...');
  const { spawn } = await import('child_process');
  
  const vercel = spawn('npx', ['vercel', '--prod', '--yes'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true
  });
  
  vercel.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Deployment successful!');
      console.log('🌐 https://z-ai-pharmacy-platform.vercel.app');
    } else {
      console.log('\n❌ Deployment failed with code:', code);
    }
  });
}

deploy().catch(console.error);
