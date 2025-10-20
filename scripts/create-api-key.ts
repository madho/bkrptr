// scripts/create-api-key.ts
// Script to create an API key
// Usage: tsx scripts/create-api-key.ts "Key Name"

import { DatabaseService } from '../src/api/models/database';

const keyName = process.argv[2] || 'New API Key';

console.log(`Creating API key for: ${keyName}`);

const db = new DatabaseService();
const { apiKey, record } = db.createApiKey(keyName);

console.log('\n✅ API Key Created Successfully!\n');
console.log('ID:', record.id);
console.log('Name:', record.name);
console.log('Prefix:', record.key_prefix);
console.log('Created:', record.created_at);
console.log('\n🔑 API Key (save this securely):');
console.log(apiKey);
console.log('\nThis key will not be shown again!');
