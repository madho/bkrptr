// scripts/check-status.ts
// Quick script to check analysis status counts

import { Pool } from 'pg';

async function checkStatus() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const result = await pool.query(`
      SELECT
        status,
        COUNT(*) as count
      FROM analyses
      GROUP BY status
      ORDER BY count DESC
    `);

    console.log('\n📊 Analysis Status Breakdown:\n');
    console.log('Status          Count');
    console.log('─────────────── ─────');

    let total = 0;
    result.rows.forEach(row => {
      const emoji = row.status === 'completed' ? '✅' :
                   row.status === 'failed' ? '❌' :
                   row.status === 'processing' ? '⚙️' :
                   row.status === 'queued' ? '⏳' : '❓';
      console.log(`${emoji} ${row.status.padEnd(13)} ${row.count}`);
      total += parseInt(row.count);
    });

    console.log('─────────────── ─────');
    console.log(`Total           ${total}\n`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkStatus();
