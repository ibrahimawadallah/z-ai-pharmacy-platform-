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

// Test with aspirin
async function testAspirin() {
  console.log('Testing aspirin...');
  
  // Search for aspirin
  const searchUrl = 'https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.xml?pagesize=5&search=aspirin';
  let searchXml = '';
  
  try {
    searchXml = await fetch(searchUrl);
    console.log('Search XML length:', searchXml.length);
    
    // Extract setid and title
    const setidMatch = searchXml.match(/<setid>([^<]+)<\/setid>/);
    const titleMatch = searchXml.match(/<title>([^<]+)<\/title>/);
    
    if (setidMatch && titleMatch) {
      const setid = setidMatch[1];
      const title = titleMatch[1];
      console.log('Found:', title, '(SETID:', setid, ')');
      
      // Get the full SPL
      const splUrl = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/${setid}.xml`;
      const splXml = await fetch(splUrl);
      console.log('SPL XML length:', splXml.length);
      
      // Check for key sections
      console.log('Has PREGNANCY:', splXml.includes('PREGNANCY'));
      console.log('Has ADVERSE REACTIONS:', splXml.includes('ADVERSE REACTIONS'));
      console.log('Has CONTRAINDICATIONS:', splXml.includes('CONTRAINDICATIONS'));
      console.log('Has WARNINGS:', splXml.includes('WARNINGS'));
      
      // Extract text content from a section
      const adversePattern = /<title>6 ADVERSE REACTIONS<\/title>[\s\S]*?<text>([\s\S]*?)<\/text>/i;
      const adverseMatch = splXml.match(adversePattern);
      
      if (adverseMatch) {
        console.log('\\n=== ADVERSE REACTIONS ===');
        let clean = adverseMatch[1].replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
        console.log(clean.substring(0, 800));
      } else {
        console.log('\\nAdverse reactions not found with standard pattern');
        // Try alternative
        const altPattern = /ADVERSE REACTIONS[\s\S]{0,1000}<text>([\s\S]*?)<\/text>/i;
        const altMatch = splXml.match(altPattern);
        if (altMatch) {
          console.log('Found with alternative pattern');
          let clean = altMatch[1].replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
          console.log(clean.substring(0, 800));
        }
      }
      
      // Pregnancy section
      const pregPattern = /<title>[^<]*PREGNANCY[^<]*<\/title>[\s\S]*?<text>([\s\S]*?)<\/text>/i;
      const pregMatch = splXml.match(pregPattern);
      
      if (pregMatch) {
        console.log('\\n=== PREGNANCY ===');
        let clean = pregMatch[1].replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
        console.log(clean.substring(0, 800));
      }
    } else {
      console.log('No results found');
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

testAspirin().catch(console.error);