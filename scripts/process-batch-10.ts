// scripts/process-batch-10.ts
// Process exactly 10 analyses to test queue and calculate true cost

import { DatabaseService } from '../src/api/models/database';
import { AnalysisService } from '../src/api/services/analysis-service';
import { WebhookService } from '../src/api/services/webhook-service';
import { StorageService } from '../src/api/services/storage-service';
import { CreateAnalysisRequest } from '../src/api/types';

async function processBatchOfTen() {
  console.log('\n🧪 Test Batch: Processing 10 analyses with queue controls\n');

  const db = new DatabaseService();
  const webhookService = new WebhookService(db, process.env.WEBHOOK_SECRET);
  const storageService = new StorageService();
  const analysisService = new AnalysisService(db, webhookService, storageService);

  try {
    // Get 10 failed or stuck analyses
    const failed = await db.listAnalyses(10, 0, 'failed');
    let batch = failed.slice(0, 10);

    // If we don't have 10 failed, get some from processing (likely stuck)
    if (batch.length < 10) {
      const processing = await db.listAnalyses(10 - batch.length, 0, 'processing');
      batch = [...batch, ...processing];
    }

    console.log(`📦 Selected ${batch.length} analyses for test batch:\n`);
    batch.forEach((a, i) => {
      console.log(`  ${i + 1}. ${a.book_title} by ${a.author}`);
      console.log(`     Status: ${a.status}, Mode: ${a.processing_mode}`);
      console.log(`     ID: ${a.id}\n`);
    });

    if (batch.length === 0) {
      console.log('✅ No analyses to process!');
      return;
    }

    console.log(`\n🚀 Starting batch processing with queue (max 3 concurrent)...\n`);

    let processed = 0;
    const startTime = Date.now();

    for (const analysis of batch) {
      try {
        // Reconstruct request
        const request: CreateAnalysisRequest = {
          book: {
            title: analysis.book_title,
            author: analysis.author,
            genre: analysis.genre || 'business',
          },
          options: {
            processingMode: analysis.processing_mode as 'batch' | 'expedited',
            purpose: analysis.purpose as any,
            audience: analysis.audience || 'general audience',
          },
          webhookUrl: analysis.webhook_url,
        };

        // Reset to queued and retry (uses queue automatically)
        await db.updateAnalysis(analysis.id, {
          status: 'failed', // Temporarily set to failed so retryAnalysis works
          error_message: 'Reset for test batch',
        });

        await analysisService.retryAnalysis(analysis.id);
        processed++;

        console.log(`  ✓ Queued: ${analysis.book_title} (${processed}/${batch.length})`);

        // Small delay between queueing
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`  ✗ Failed to queue ${analysis.id}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }

    const queueTime = Date.now() - startTime;

    console.log(`\n✅ Batch queued successfully!`);
    console.log(`   - Analyses queued: ${processed}`);
    console.log(`   - Queue time: ${(queueTime / 1000).toFixed(1)}s`);
    console.log(`\n📊 Queue will process max 3 at a time with rate limit protection`);
    console.log(`\n⏰ Estimated completion time: ${Math.ceil((batch.length / 3) * 5)} minutes`);
    console.log(`   (Assuming ~5 min per analysis with 3 concurrent)\n`);

    console.log(`📈 Monitor progress with:`);
    console.log(`   DATABASE_URL="..." npx tsx scripts/check-status.ts\n`);

    console.log(`💰 Check Anthropic usage at:`);
    console.log(`   https://console.anthropic.com/settings/usage\n`);

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
processBatchOfTen()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
