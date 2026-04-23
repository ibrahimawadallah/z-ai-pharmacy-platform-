const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function test() {
  const xml = await fetch('https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/4dcb79e6-19de-67fb-e063-6294a90afde0.xml');
  
  console.log('XML length:', xml.length);
  
  // The structure has title followed by text inside nested components
  // Find sections by title and get following text
  
  // Pattern: title with "6 ADVERSE REACTIONS" and then the text
  const adversePattern = /<title>6 ADVERSE REACTIONS<\/title>[\s\S]*?<text>([\s\S]*?)<\/text>/i;
  const adverseMatch = xml.match(adversePattern);
  
  if (adverseMatch) {
    console.log('\n=== ADVERSE REACTIONS ===');
    let content = adverseMatch[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    console.log(content.substring(0, 1500));
  }
  
  // Check for pregnancy by title
  const pregPattern = /<title>[^<]*PREGNANCY[^<]*<\/title>[\s\S]*?<text>([\s\S]*?)<\/text>/i;
  const pregMatch = xml.match(pregPattern);
  
  if (pregMatch) {
    console.log('\n=== PREGNANCY ===');
    let content = pregMatch[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    console.log(content.substring(0, 800));
  }
  
  // Check contraindications
  const contraPattern = /<title>4 CONTRAINDICATIONS<\/title>[\s\S]*?<text>([\s\S]*?)<\/text>/i;
  const contraMatch = xml.match(contraPattern);
  
  if (contraMatch) {
    console.log('\n=== CONTRAINDICATIONS ===');
    let content = contraMatch[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    console.log(content.substring(0, 800));
  }
}

test().catch(console.error);
