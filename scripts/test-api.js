const http = require('http');

const makeRequest = () => {
  const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/admin/import-interactions?secret=drugeye-import-2026',
    method: 'POST',
    timeout: 30000
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
    });
  });

  req.on('error', (e) => {
    console.error('Error:', e.message);
    setTimeout(makeRequest, 2000);
  });
  
  req.on('timeout', () => {
    req.destroy();
    console.error('Request timeout');
  });

  req.end();
};

makeRequest();