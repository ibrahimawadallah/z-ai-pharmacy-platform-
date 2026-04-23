import { db } from 'https'

function fetch(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) } 
        catch { resolve({ error: 'Parse error' }) }
      })
    }).on('error', reject)
  })
}

async function main() {
  console.log('Testing FDA endpoints...\n')
  
  const endpoints = [
    'https://api.fda.gov/drug/label.json?search=active_ingredient:ibuprofen&limit=1',
    'https://api.fda.gov/drug/ndc.json?search=brand_name:TYLENOL&limit=1',
    'https://api.fda.gov/drug/event.json?search=brandsponsorname:TYLENOL&limit=1',
  ]
  
  for (const url of endpoints) {
    try {
      console.log('Testing:', url.split('?')[0])
      const data = await fetch(url)
      console.log('Result:', data.meta?.results?.total || data.error || 'OK')
    } catch (e) {
      console.log('Error:', e.message)
    }
  }
}

main()