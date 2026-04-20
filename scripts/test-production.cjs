const https = require('https');

async function testProductionAPI() {
  console.log('🧪 Testing Pharmacy AI Platform Production...\n');
  
  const baseUrl = 'https://z-ai-pharmacy-platform.vercel.app';
  
  // Test 1: Basic API connectivity
  console.log('1. 🌐 Testing API connectivity...');
  try {
    const response = await fetch(`${baseUrl}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'What are the side effects of paracetamol?',
        history: []
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', data.role);
      console.log('📝 Content preview:', data.content?.substring(0, 100) + '...');
      console.log('🤖 Model used:', data.model || 'heuristic');
    } else {
      console.log('❌ API Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Connection Error:', error.message);
  }
  
  // Test 2: Drug search
  console.log('\n2. 🔍 Testing drug search...');
  try {
    const response = await fetch(`${baseUrl}/api/drugs/search?query=paracetamol`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Drug search works:', data.length, 'drugs found');
    } else {
      console.log('❌ Drug search failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Drug search error:', error.message);
  }
  
  // Test 3: ICD-10 search
  console.log('\n3. 🏥 Testing ICD-10 search...');
  try {
    const response = await fetch(`${baseUrl}/api/drugs/icd10/search?query=diabetes`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ ICD-10 search works:', data.length, 'codes found');
    } else {
      console.log('❌ ICD-10 search failed:', response.status);
    }
  } catch (error) {
    console.log('❌ ICD-10 search error:', error.message);
  }
  
  console.log('\n🎯 Test Summary:');
  console.log('📱 Open the app: https://z-ai-pharmacy-platform.vercel.app');
  console.log('💬 Try the AI chat in bottom-right corner');
  console.log('🔍 Test drug search functionality');
  console.log('🏥 Verify medical data accuracy');
}

// Run the test
testProductionAPI().catch(console.error);
