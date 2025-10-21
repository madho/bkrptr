// scripts/submit-books-batch.ts
// Submit books from JSON file to bkrptr API

import * as fs from 'fs';
import * as path from 'path';

interface Book {
  title: string;
  author: string;
  year: string;
  category: string;
}

const API_URL = 'https://api.bkrptr.com';
const API_KEY = 'bkrptr_live_P4oqLbCWGwckyotMeXBAHI4H8TWKsO7J';

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
      console.error(`❌ [${index + 1}/${total}] Failed: ${book.title}`);
      console.error(`   Error: ${JSON.stringify(error)}`);
      return false;
    }

    const result = await response.json();
    console.log(`✅ [${index + 1}/${total}] ${book.title}`);
    console.log(`   ID: ${result.id} | Status: ${result.status} | Cost: $${result.estimatedCost}`);
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
  const books: Book[] = JSON.parse(booksData);

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📚  McKinsey Book Batch Submission`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`Total books: ${books.length}`);
  console.log(`Mode: Batch ($0.03 per book)`);
  console.log(`Total cost: $${(books.length * 0.03).toFixed(2)}`);
  console.log(`Est. time: ~75 minutes`);
  console.log(`API: ${API_URL}\n`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  const startTime = Date.now();
  let successCount = 0;
  let failCount = 0;

  // Submit books with small delay to be gentle on the API
  for (let i = 0; i < books.length; i++) {
    const success = await submitBook(books[i], i, books.length);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // 100ms delay between submissions
    if (i < books.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Progress update every 10 books
    if ((i + 1) % 10 === 0) {
      const pct = ((i + 1) / books.length * 100).toFixed(0);
      console.log(`\n📊 Progress: ${i + 1}/${books.length} (${pct}%) | Success: ${successCount} | Failed: ${failCount}\n`);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✨  Submission Complete`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`Total submitted: ${successCount} / ${books.length}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Time taken: ${duration}s`);
  console.log(`\nAll books are now queued for batch processing.`);
  console.log(`They will complete in approximately 75 minutes.`);
  console.log(`\nCheck status: ${API_URL}/api/v1/analyses`);
  console.log(`View results: ${API_URL}/api/v1/analyses/{id}/documents\n`);
}

main().catch(console.error);
