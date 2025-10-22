// scripts/retry-failed-local.ts
// Local script to retry failed analyses without HTTP timeout limits

import { DatabaseService } from '../src/api/models/database';
import { AnalysisService } from '../src/api/services/analysis-service';
import { WebhookService } from '../src/api/services/webhook-service';
import { StorageService } from '../src/api/services/storage-service';

async function retryFailedAnalyses() {
  console.log('🔄 Starting retry of failed analyses...\n');

  // Initialize services
  const db = new DatabaseService();
  const webhookService = new WebhookService(db, process.env.WEBHOOK_SECRET);
  const storageService = new StorageService();
  const analysisService = new AnalysisService(db, webhookService, storageService);

  try {
    // Get failed analyses
    const failedAnalyses = await db.listAnalyses(500, 0, 'failed');
    console.log(`Found ${failedAnalyses.length} failed analyses\n`);

    // Check if we should retry all failures or just deployment failures
    const retryAll = process.env.RETRY_ALL === 'true';

    const deploymentFailures = failedAnalyses.filter(a => !a.error_message);
    const otherFailures = failedAnalyses.filter(a => a.error_message);

    console.log(`  - ${deploymentFailures.length} deployment failures`);
    console.log(`  - ${otherFailures.length} other failures\n`);

    const toRetry = retryAll ? failedAnalyses : deploymentFailures;

    if (toRetry.length === 0) {
      console.log('✅ No failures to retry!');
      return;
    }

    console.log(`Retrying ${toRetry.length} analyses...\n`);
    let retried = 0;
    let errors = 0;

    for (const analysis of toRetry) {
      try {
        console.log(`  Retrying: ${analysis.book_title} by ${analysis.author} (${analysis.id})`);
        await analysisService.retryAnalysis(analysis.id);
        retried++;

        // Small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        errors++;
        console.error(`    ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    console.log(`\n✅ Retry complete!`);
    console.log(`   - Successfully queued: ${retried}`);
    console.log(`   - Errors: ${errors}`);
    console.log(`\nAnalyses are now queued and will process automatically.`);
    console.log(`Monitor progress with: npx tsx scripts/check-status.ts`);

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
retryFailedAnalyses()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
