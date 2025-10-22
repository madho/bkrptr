// scripts/check-processing.ts
// Check which analyses are currently processing

import { Pool } from 'pg';

async function checkProcessing() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const result = await pool.query(`
      SELECT
        id,
        book_title,
        author,
        status,
        started_at,
        error_message
      FROM analyses
      WHERE status = 'processing'
      ORDER BY started_at DESC
      LIMIT 15
    `);

    console.log('\n⚙️ Currently Processing Analyses:\n');

    if (result.rows.length === 0) {
      console.log('No analyses currently processing.\n');
    } else {
      result.rows.forEach((row, index) => {
        const startTime = new Date(row.started_at).toLocaleTimeString();
        console.log(`${index + 1}. ${row.book_title} by ${row.author}`);
        console.log(`   ID: ${row.id}`);
        console.log(`   Started: ${startTime}\n`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkProcessing();
