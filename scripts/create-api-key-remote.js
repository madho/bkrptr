// scripts/create-api-key-remote.js
// Script to create an API key via the admin endpoint using Railway environment

const https = require('https');

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const API_URL = 'api.bkrptr.com';

if (!WEBHOOK_SECRET) {
  console.error('Error: WEBHOOK_SECRET environment variable not set');
  process.exit(1);
}

const data = JSON.stringify({ name: 'inbound-asst' });

const options = {
  hostname: API_URL,
  port: 443,
  path: '/api/v1/admin/create-key',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'x-admin-secret': WEBHOOK_SECRET
  }
};

const req = https.request(options, (res) => {
  let body = '';

  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);

    try {
      const result = JSON.parse(body);
      if (result.success) {
        console.log('\n✅ API Key Created Successfully!\n');
        console.log('ID:', result.keyInfo.id);
        console.log('Name:', result.keyInfo.name);
        console.log('Prefix:', result.keyInfo.prefix);
        console.log('Created:', result.keyInfo.createdAt);
        console.log('\n🔑 API Key (save this securely):');
        console.log(result.apiKey);
        console.log('\nThis key will not be shown again!');
      }
    } catch (e) {
      // Response wasn't JSON or parsing failed
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
  process.exit(1);
});

req.write(data);
req.end();
