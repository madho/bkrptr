// scripts/fix-invalid-genres.ts
// Fix invalid genre values in failed analyses

import { Pool } from 'pg';

// Map invalid genres to valid ones
const genreMap: { [key: string]: string } = {
  'politics': 'history',
  'technology': 'technical',
  'health': 'science',
  'sustainability': 'science'
};

async function fixInvalidGenres() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\n🔧 Fixing invalid genres in failed analyses...\n');

    for (const [invalidGenre, validGenre] of Object.entries(genreMap)) {
      // Find analyses with this invalid genre
      const result = await pool.query(`
        SELECT id, book_title, author, genre
        FROM analyses
        WHERE status = 'failed'
        AND error_message LIKE $1
      `, [`%Invalid genre: ${invalidGenre}%`]);

      if (result.rows.length > 0) {
        console.log(`\n📝 Fixing ${result.rows.length} analyses with genre "${invalidGenre}" → "${validGenre}"`);

        for (const row of result.rows) {
          // Update the genre and reset the analysis
          await pool.query(`
            UPDATE analyses
            SET
              genre = $1,
              status = 'queued',
              error_message = NULL,
              completed_at = NULL,
              started_at = NULL
            WHERE id = $2
          `, [validGenre, row.id]);

          console.log(`  ✓ ${row.book_title} by ${row.author}`);
        }
      } else {
        console.log(`\n✓ No analyses found with genre "${invalidGenre}"`);
      }
    }

    console.log('\n✅ All invalid genres have been fixed!\n');

    // Show summary of what needs to be retried
    const queuedResult = await pool.query(`
      SELECT COUNT(*) as count
      FROM analyses
      WHERE status = 'queued'
    `);

    console.log(`📊 ${queuedResult.rows[0].count} analyses are now queued and ready to be processed.\n`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

fixInvalidGenres();
