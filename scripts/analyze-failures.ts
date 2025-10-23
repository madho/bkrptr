// scripts/analyze-failures.ts
// Analyze error patterns in failed analyses

import { Pool } from 'pg';

async function analyzeFailures() {
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
        error_message,
        updated_at,
        started_at
      FROM analyses
      WHERE status = 'failed'
      ORDER BY updated_at DESC
    `);

    console.log(`\n❌ Failed Analyses - Error Analysis\n`);
    console.log(`Total failed: ${result.rows.length}\n`);

    // Group by error message
    const errorGroups: { [key: string]: any[] } = {};

    result.rows.forEach(row => {
      const errorMsg = row.error_message || 'No error message recorded';
      if (!errorGroups[errorMsg]) {
        errorGroups[errorMsg] = [];
      }
      errorGroups[errorMsg].push({
        title: row.book_title,
        author: row.author,
        id: row.id,
        updated_at: row.updated_at
      });
    });

    // Sort error groups by frequency
    const sortedErrors = Object.entries(errorGroups)
      .sort((a, b) => b[1].length - a[1].length);

    // Print grouped errors
    sortedErrors.forEach(([error, books], index) => {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`📋 Error Pattern #${index + 1} (${books.length} books affected)`);
      console.log(`${'='.repeat(80)}`);
      console.log(`\nError Message:`);
      console.log(`  ${error}\n`);

      console.log(`Affected books (showing first 10):`);
      books.slice(0, 10).forEach((book: any, i: number) => {
        console.log(`  ${i + 1}. ${book.title} by ${book.author}`);
        console.log(`     ID: ${book.id}`);
      });

      if (books.length > 10) {
        console.log(`  ... and ${books.length - 10} more books`);
      }
    });

    console.log(`\n${'='.repeat(80)}\n`);
    console.log(`📊 Summary:`);
    console.log(`  - Total failed analyses: ${result.rows.length}`);
    console.log(`  - Distinct error types: ${sortedErrors.length}`);
    console.log(`  - Most common error: ${sortedErrors[0][1].length} occurrences\n`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

analyzeFailures();
