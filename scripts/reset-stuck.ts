// scripts/reset-stuck.ts
// Reset analyses stuck in processing for >30 minutes

import { Pool } from 'pg';

async function resetStuck() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    // Find stuck analyses
    const result = await pool.query(`
      SELECT id, book_title, author, started_at
      FROM analyses
      WHERE status = 'processing'
      AND started_at < $1
      ORDER BY started_at DESC
    `, [thirtyMinutesAgo]);

    console.log(`\n🔄 Found ${result.rows.length} stuck analyses\n`);

    if (result.rows.length === 0) {
      console.log('No stuck analyses to reset.');
      return;
    }

    // Reset each one
    for (const row of result.rows) {
      await pool.query(`
        UPDATE analyses
        SET status = 'failed',
            error_message = 'Analysis stuck in processing - reset by recovery script',
            completed_at = NOW()
        WHERE id = $1
      `, [row.id]);

      console.log(`  ✓ Reset: ${row.book_title} by ${row.author}`);
    }

    console.log(`\n✅ Reset ${result.rows.length} stuck analyses to failed status\n`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

resetStuck();
