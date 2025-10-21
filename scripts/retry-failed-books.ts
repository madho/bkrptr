// scripts/retry-failed-books.ts
// Retry submitting books with rate limit awareness

import * as fs from 'fs';
import * as path from 'path';

interface Book {
  title: string;
  author: string;
  year: string;
  category: string;
}

const API_URL = 'https://api.bkrptr.com';
const API_KEY = 'bkrptr_live_U_Ev-IMazxxPojtERiyk0mSuMuMAMT3D';
const RATE_LIMIT = 100; // requests per 15 minutes
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Map categories to genres
const categoryToGenre: Record<string, string> = {
  'Artificial Intelligence': 'technology',
  'Biography & Memoir': 'biography',
  'Business & Economics': 'business',
  'Fiction': 'fiction',
  'Health': 'health',
  'History': 'history',
  'Personal Development': 'leadership',
  'Politics': 'politics',
  'Sustainability': 'sustainability',
  'Technology': 'technology',
  'Workplace Culture': 'business',
};

async function submitBook(book: Book, index: number, total: number): Promise<boolean> {
  const genre = categoryToGenre[book.category] || 'business';

  const payload = {
    book: {
      title: book.title,
      author: book.author,
      publicationYear: book.year,
      genre: genre,
    },
    options: {
      processingMode: 'batch',
      purpose: 'reference',
      audience: 'senior executives and leadership teams',
      analysisDepth: 'standard',
      specificContext: 'McKinsey book recommendations for business leaders',
    },
  };

  try {
    const response = await fetch(`${API_URL}/api/v1/analyses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      if (error.error?.code === 'RATE_LIMIT_EXCEEDED') {
        console.log(`⏸️  [${index + 1}/${total}] Rate limited: ${book.title}`);
        return false;
      }
      console.error(`❌ [${index + 1}/${total}] Failed: ${book.title}`);
      console.error(`   Error: ${JSON.stringify(error)}`);
      return false;
    }

    const result = await response.json();
    console.log(`✅ [${index + 1}/${total}] ${book.title}`);
    console.log(`   ID: ${result.id} | Cost: $${result.estimatedCost}`);
    return true;
  } catch (error: any) {
    console.error(`❌ [${index + 1}/${total}] Error: ${book.title}`);
    console.error(`   ${error.message}`);
    return false;
  }
}

async function main() {
  // Load books from JSON file
  const booksFile = path.join(__dirname, '..', 'data', 'mckinsey-books-2024-2025.json');
  const booksData = fs.readFileSync(booksFile, 'utf-8');
  const allBooks: Book[] = JSON.parse(booksData);

  // Skip first 100 books (already submitted)
  const remainingBooks = allBooks.slice(100);

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🔄 McKinsey Books - Retry Remaining`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`Remaining books: ${remainingBooks.length}`);
  console.log(`Rate limit: ${RATE_LIMIT} requests per ${RATE_WINDOW_MS / 60000} minutes`);
  console.log(`Strategy: Submit in batches of ${RATE_LIMIT - 5} with 15min delays\n`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  const startTime = Date.now();
  let successCount = 0;
  let failCount = 0;
  let requestsThisWindow = 0;
  let windowStartTime = Date.now();

  for (let i = 0; i < remainingBooks.length; i++) {
    // Check if we're approaching the rate limit
    if (requestsThisWindow >= RATE_LIMIT - 5) {
      const elapsed = Date.now() - windowStartTime;
      if (elapsed < RATE_WINDOW_MS) {
        const waitTime = RATE_WINDOW_MS - elapsed;
        console.log(`\n⏰ Rate limit reached (${requestsThisWindow} requests)`);
        console.log(`⏳ Waiting ${Math.ceil(waitTime / 1000)}s for rate limit to reset...\n`);
        await new Promise(resolve => setTimeout(resolve, waitTime + 1000)); // Add 1s buffer
      }
      // Reset counters
      requestsThisWindow = 0;
      windowStartTime = Date.now();
    }

    const success = await submitBook(remainingBooks[i], i + 100, allBooks.length);
    requestsThisWindow++;

    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Small delay between requests (200ms)
    if (i < remainingBooks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Progress update every 10 books
    if ((i + 1) % 10 === 0) {
      console.log(`\n📊 Batch progress: ${i + 1}/${remainingBooks.length} | Success: ${successCount} | Failed: ${failCount}\n`);
    }
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✨  Retry Complete`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`Submitted: ${successCount} / ${remainingBooks.length}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Time taken: ${duration} minutes`);
  console.log(`\nTotal McKinsey books now processing: ${100 + successCount} / ${allBooks.length}`);
  console.log(`Total cost so far: $${((100 + successCount) * 0.03).toFixed(2)}`);
  console.log(`\nCheck status: ${API_URL}/api/v1/analyses\n`);
}

main().catch(console.error);
