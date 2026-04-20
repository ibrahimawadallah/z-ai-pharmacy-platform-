#!/usr/bin/env node
/**
 * Check Vercel deployment status
 */

import 'dotenv/config';

const PROJECT_ID = 'prj_jrrD5SViMEmIp1vxq1keuysb29zP';
const TOKEN = process.env.VERCEL_TOKEN;

async function checkDeployment() {
  console.log('Checking deployment status...\n');
  
  try {
    const response = await fetch(`https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&limit=1`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    
    if (!response.ok) {
      console.log('Could not fetch deployment status via API.');
      console.log('Check manually at: https://vercel.com/ibrahims-projects-d7ee9352/z-ai-pharmacy-platform');
      return;
    }
    
    const data = await response.json();
    const latest = data.deployments[0];
    
    console.log('══════════════════════════════════════════════════');
    console.log('📊 LATEST DEPLOYMENT');
    console.log('══════════════════════════════════════════════════');
    console.log(`🔢 ID: ${latest.uid}`);
    console.log(`🌐 URL: ${latest.url}`);
    console.log(`📌 Status: ${latest.state}`);
    console.log(`👤 Creator: ${latest.creator?.username || 'Unknown'}`);
    console.log(`🕐 Created: ${new Date(latest.createdAt).toLocaleString()}`);
    console.log('══════════════════════════════════════════════════');
    
    if (latest.state === 'READY') {
      console.log('✅ Deployment is LIVE!');
      console.log(`🌐 Visit: https://${latest.url}`);
    } else if (latest.state === 'BUILDING') {
      console.log('🏗️  Build in progress...');
      console.log('⏳ Check again in 1-2 minutes');
    } else if (latest.state === 'ERROR') {
      console.log('❌ Build failed');
      console.log(`📋 Check logs: https://vercel.com/ibrahims-projects-d7ee9352/z-ai-pharmacy-platform`);
    }
    
  } catch (err) {
    console.log('Check deployment at:');
    console.log('https://vercel.com/ibrahims-projects-d7ee9352/z-ai-pharmacy-platform');
  }
}

checkDeployment();
