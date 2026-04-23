// Test if fetch is available in Node.js
console.log('Node.js version:', process.version);
console.log('Fetch available:', typeof fetch !== 'undefined');

// Test a simple FDA call
async function testFDA() {
  try {
    console.log('Testing FDA API...');
    const response = await fetch('https://api.fda.gov/drug/label.json?search=aspirin&limit=1');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('FDA API test successful');
    console.log('Results count:', data.results?.length || 0);
    if (data.results && data.results.length > 0) {
      console.log('First result keys:', Object.keys(data.results[0]));
    }
  } catch (error) {
    console.error('FDA API test failed:', error);
  }
}

testFDA();