const fs = require('fs');
const path = require('path');

try {
  const envPath = path.resolve('.env');
  const data = fs.readFileSync(envPath, 'utf8');
  console.log('File contents:');
  console.log(JSON.stringify(data));
  
  // Parse line by line
  const lines = data.split('\n');
  lines.forEach((line, index) => {
    console.log(`${index}: ${JSON.stringify(line)}`);
  });
  
  // Check for BOM
  if (data.charCodeAt(0) === 0xFEFF) {
    console.log('File has BOM');
  }
} catch (error) {
  console.error('Error reading file:', error);
}