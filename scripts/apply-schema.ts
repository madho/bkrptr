// scripts/apply-schema.ts
// Apply PostgreSQL schema to Supabase

import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Use direct connection for schema migration (pooler had connection issues)
const DATABASE_URL = 'postgresql://postgres:b5sU1XyhgfiqkAjw@db.cnyybzaoqroqsbthnjan.supabase.co:5432/postgres';

async function applySchema() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Connecting to Supabase PostgreSQL...');
    await client.connect();
    console.log('✅ Connected successfully');

    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'migrations', '001_initial_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    console.log('\n📝 Applying schema migration...');
    await client.query(schema);
    console.log('✅ Schema applied successfully');

    // Verify tables were created
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('\n📊 Created tables:');
    result.rows.forEach((row: any) => {
      console.log(`   - ${row.table_name}`);
    });

  } catch (error: any) {
    console.error('❌ Error applying schema:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('\n🔌 Connection closed');
  }
}

applySchema().catch(console.error);
