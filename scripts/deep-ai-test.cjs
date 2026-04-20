const https = require('https');

async function deepAITest() {
  console.log('🧠 Deep AI Medical Test - Pharmacy Platform');
  console.log('==========================================\n');

  const baseUrl = 'https://z-ai-pharmacy-platform.vercel.app';
  
  // Medical test cases
  const testCases = [
    {
      category: '🏥 Basic Drug Information',
      questions: [
        'What is paracetamol used for?',
        'What are the common side effects of ibuprofen?',
        'Is aspirin safe for children?'
      ]
    },
    {
      category: '🤰 Pregnancy and Lactation',
      questions: [
        'What pregnancy category is metformin?',
        'Is amoxicillin safe during breastfeeding?',
        'Can I take antihistamines while pregnant?'
      ]
    },
    {
      category: '👴 Geriatric Considerations',
      questions: [
        'What are the renal dose adjustments for elderly patients?',
        'Which medications should be avoided in patients over 65?',
        'What is the starting dose of lisinopril in seniors?'
      ]
    },
    {
      category: '🚨 Emergency Situations',
      questions: [
        'What is the treatment for paracetamol overdose?',
        'What are the signs of warfarin toxicity?',
        'How to manage severe hypoglycemia?'
      ]
    },
    {
      category: '💊 Drug Interactions',
      questions: [
        'What are the interactions between statins and grapefruit?',
        'Can I take NSAIDs with ACE inhibitors?',
        'What antibiotics interact with warfarin?'
      ]
    }
  ];

  for (const category of testCases) {
    console.log(`\n${category.category}`);
    console.log('='.repeat(50));
    
    for (const question of category.questions) {
      console.log(`\n❓ Question: ${question}`);
      
      try {
        const startTime = Date.now();
        
        const response = await fetch(`${baseUrl}/api/ai/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Pharmacy-AI-Test/1.0'
          },
          body: JSON.stringify({
            message: question,
            history: []
          })
        });
        
        const endTime = Date.now();
        const responseTime = (endTime - startTime) / 1000;
        
        if (response.ok) {
          const data = await response.json();
          
          console.log(`⏱️  Response Time: ${responseTime}s`);
          console.log(`🤖 Model: ${data.model || 'unknown'}`);
          console.log(`📝 Response: ${data.content?.substring(0, 200)}...`);
          
          // Analyze response quality
          const analysis = analyzeResponse(data.content, question);
          console.log(`🔍 Quality Score: ${analysis.score}/10`);
          console.log(`📊 Analysis: ${analysis.feedback}`);
          
        } else {
          console.log(`❌ Error: ${response.status} ${response.statusText}`);
        }
        
      } catch (error) {
        console.log(`❌ Network Error: ${error.message}`);
      }
      
      console.log('-'.repeat(30));
      
      // Wait between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n🎯 Test Summary:');
  console.log('================');
  console.log('📱 Test the UI: https://z-ai-pharmacy-platform.vercel.app');
  console.log('💬 Try the AI chat with real medical questions');
  console.log('📊 Monitor response times and accuracy');
  console.log('🏥 Verify medical information quality');
}

function analyzeResponse(response, question) {
  let score = 5; // Base score
  let feedback = [];
  
  // Check for medical content
  if (response && response.length > 50) {
    score += 1;
    feedback.push('Substantial response');
  } else {
    feedback.push('Response too short');
  }
  
  // Check for medical terminology
  const medicalTerms = ['dosage', 'mg', 'patient', 'medication', 'treatment', 'side effects', 'contraindication'];
  const hasMedicalTerms = medicalTerms.some(term => 
    response.toLowerCase().includes(term.toLowerCase())
  );
  
  if (hasMedicalTerms) {
    score += 1;
    feedback.push('Contains medical terminology');
  } else {
    feedback.push('Lacks medical terminology');
  }
  
  // Check for safety warnings
  if (response.toLowerCase().includes('warning') || 
      response.toLowerCase().includes('caution') ||
      response.toLowerCase().includes('consult')) {
    score += 1;
    feedback.push('Includes safety warnings');
  }
  
  // Check for specific information
  if (response.includes('mg') || response.includes('dose') || response.includes('frequency')) {
    score += 1;
    feedback.push('Provides specific dosing information');
  }
  
  // Check for disclaimers
  if (response.toLowerCase().includes('disclaimer') || 
      response.toLowerCase().includes('consult doctor')) {
    score += 1;
    feedback.push('Includes appropriate disclaimers');
  }
  
  // Cap the score
  score = Math.min(score, 10);
  
  return {
    score,
    feedback: feedback.join(', ')
  };
}

// Performance monitoring
async function performanceTest() {
  console.log('\n⚡ Performance Test');
  console.log('==================');
  
  const concurrentRequests = 5;
  const testQuestion = 'What are the side effects of paracetamol?';
  
  console.log(`Testing ${concurrentRequests} concurrent requests...`);
  
  const startTime = Date.now();
  const promises = [];
  
  for (let i = 0; i < concurrentRequests; i++) {
    promises.push(
      fetch('https://z-ai-pharmacy-platform.vercel.app/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testQuestion,
          history: []
        })
      })
    );
  }
  
  try {
    const results = await Promise.allSettled(promises);
    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`⏱️  Total Time: ${totalTime}s`);
    console.log(`✅ Successful: ${successful}/${concurrentRequests}`);
    console.log(`❌ Failed: ${failed}/${concurrentRequests}`);
    console.log(`📊 Average per request: ${(totalTime/concurrentRequests).toFixed(2)}s`);
    
  } catch (error) {
    console.log(`❌ Performance test failed: ${error.message}`);
  }
}

// Run tests
async function runAllTests() {
  await deepAITest();
  await performanceTest();
  
  console.log('\n🎉 Deep Testing Complete!');
  console.log('============================');
  console.log('📋 Key Findings:');
  console.log('- AI response quality and accuracy');
  console.log('- Response times under load');
  console.log('- Medical information completeness');
  console.log('- Safety warning inclusion');
  console.log('\n📱 Manual Testing Recommended:');
  console.log('- Test the live UI');
  console.log('- Try real medical scenarios');
  console.log('- Test with patient context');
  console.log('- Verify mobile experience');
}

runAllTests().catch(console.error);
