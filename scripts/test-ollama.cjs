// Since this is a CommonJS file, we need to dynamically import the ES module
async function testOllamaIntegration() {
  console.log('Testing Ollama integration with biomistral model...');
  
  try {
    // Import the Ollama library - use the Ollama class
    const { Ollama } = require('ollama');
    const ollama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://localhost:11434' });
    
    const config = {
      model: process.env.OLLAMA_MODEL || 'cniongolo/biomistral:latest',
      timeout: parseInt(process.env.OLLAMA_TIMEOUT || '120000')
    };
    
    // Test connection
    console.log('1. Testing connection to Ollama...');
    try {
      await ollama.list();
      console.log('✅ Connected to Ollama');
    } catch (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('❌ Make sure Ollama is running on localhost:11434');
      return;
    }
    
    // Test model availability
    console.log('\n2. Checking model availability...');
    const models = await ollama.list();
    const isModelAvailable = models.models.some(model => model.name === config.model);
    console.log(`Model status: ${isModelAvailable ? '✅ Available' : '❌ Not found'}`);
    
    if (!isModelAvailable) {
      console.log('⚠️  Model cniongolo/biomistral:latest not found. Attempting to pull...');
      try {
        console.log('Pulling model... (this may take several minutes)');
        await ollama.pull({ model: config.model });
        console.log('✅ Model pulled successfully');
      } catch (pullError) {
        console.log('❌ Failed to pull model:', pullError.message);
        console.log('💡 You can manually pull the model with: ollama pull cniongolo/biomistral:latest');
        return;
      }
    }
    
    // Test generation
    console.log('\n3. Testing response generation...');
    const testPrompt = "What is the recommended renal adjustment for paracetamol in patients with severe renal impairment?";
    const systemPrompt = "You are a clinical pharmacy assistant. Provide concise, evidence-based responses.";
    
    console.log('Generating response (this may take a minute)...');
    const startTime = Date.now();
    
    const response = await ollama.generate({
      model: config.model,
      prompt: `${systemPrompt}\n\n${testPrompt}`,
      system: systemPrompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 500,
      }
    });
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`✅ Response generated in ${duration.toFixed(2)} seconds`);
    console.log('\n--- Response ---');
    console.log(response.response);
    console.log('----------------\n');
    
    console.log('🎉 Ollama integration test completed successfully!');
    console.log('💡 The biomistral model is now ready for use in your pharmacy platform.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Ensure Ollama is running: ollama serve');
    console.log('2. Check if port 11434 is accessible');
    console.log('3. Verify model is installed: ollama list');
    console.log('4. Pull model if needed: ollama pull cniongolo/biomistral:latest');
  }
}

// Run the test
testOllamaIntegration();
