// src/api/services/analysis-service.ts
import { BookAnalyzer } from '../../core/analyzer';
import { DatabaseService, Analysis } from '../models/database';
import { WebhookService } from './webhook-service';
import { StorageService } from './storage-service';
import { CreateAnalysisRequest, AnalysisResponse } from '../types';
import { AnalysisInput } from '../../types';
import path from 'path';

export class AnalysisService {
  private db: DatabaseService;
  private webhookService: WebhookService;
  private storageService: StorageService;
  private processingQueue: Map<string, Promise<void>>;

  constructor(db: DatabaseService, webhookService: WebhookService, storageService: StorageService) {
    this.db = db;
    this.webhookService = webhookService;
    this.storageService = storageService;
    this.processingQueue = new Map();

    // Recover stuck analyses on startup
    this.recoverStuckAnalyses().catch(error => {
      console.error('Failed to recover stuck analyses:', error);
    });
  }

  /**
   * Recovers analyses stuck in "processing" state (likely due to deployment restart)
   * Resets analyses that have been processing for more than 30 minutes back to "queued"
   */
  private async recoverStuckAnalyses(): Promise<void> {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

      // Find analyses stuck in processing for > 30 minutes
      const allProcessing = await this.db.listAnalyses(500, 0, 'processing');
      const stuckAnalyses = allProcessing.filter(a =>
        a.started_at && a.started_at < thirtyMinutesAgo
      );

      if (stuckAnalyses.length === 0) {
        console.log('✅ No stuck analyses found');
        return;
      }

      console.log(`🔄 Found ${stuckAnalyses.length} stuck analyses, recovering...`);

      for (const analysis of stuckAnalyses) {
        try {
          // Reset to queued state
          await this.db.updateAnalysis(analysis.id, {
            status: 'queued',
            started_at: undefined,
          });

          // Reconstruct request and retry
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

          // Start processing (non-blocking)
          this.processAnalysis(analysis.id, request).catch(error => {
            console.error(`Failed to recover analysis ${analysis.id}:`, error);
          });

          console.log(`  ✓ Recovered: ${analysis.book_title} by ${analysis.author}`);

          // Small delay to avoid overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`  ✗ Failed to recover ${analysis.id}:`, error);
        }
      }

      console.log(`✅ Recovery complete: ${stuckAnalyses.length} analyses requeued`);
    } catch (error) {
      console.error('Error during stuck analysis recovery:', error);
      throw error;
    }
  }

  async createAnalysis(request: CreateAnalysisRequest, idempotencyKey?: string): Promise<AnalysisResponse> {
    // Check for duplicate idempotency key
    if (idempotencyKey) {
      const existing = (await this.db.listAnalyses(1, 0)).find(a => a.idempotency_key === idempotencyKey);
      if (existing) {
        return this.mapToResponse(existing);
      }
    }

    // Calculate cost
    const cost = request.options.processingMode === 'batch' ? 0.03 : 0.06;

    // Create analysis record
    const analysis = await this.db.createAnalysis({
      book_title: request.book.title,
      author: request.book.author,
      genre: request.book.genre || 'business',
      purpose: request.options.purpose || 'reference',
      audience: request.options.audience || 'general audience',
      processing_mode: request.options.processingMode,
      status: 'queued',
      webhook_url: request.webhookUrl,
      idempotency_key: idempotencyKey,
      cost,
    });

    // Process based on mode
    if (request.options.processingMode === 'expedited') {
      // Start processing immediately (non-blocking)
      this.processAnalysis(analysis.id, request).catch(error => {
        console.error(`Failed to process analysis ${analysis.id}:`, error);
      });
    } else {
      // Queue for batch processing
      console.log(`Analysis ${analysis.id} queued for batch processing`);
      // In production, this would add to a proper queue (Bull, BeeQueue, etc.)
      // For now, we'll process after a delay to simulate batch
      setTimeout(() => {
        this.processAnalysis(analysis.id, request).catch(error => {
          console.error(`Failed to process analysis ${analysis.id}:`, error);
        });
      }, 5000); // 5 second delay to simulate batch queue
    }

    return this.mapToResponse(analysis);
  }

  async getAnalysis(id: string): Promise<AnalysisResponse | null> {
    const analysis = await this.db.getAnalysis(id);
    return analysis ? this.mapToResponse(analysis) : null;
  }

  async listAnalyses(limit: number, offset: number, status?: string): Promise<AnalysisResponse[]> {
    const analyses = await this.db.listAnalyses(limit, offset, status);
    return analyses.map(a => this.mapToResponse(a));
  }

  private async processAnalysis(analysisId: string, request: CreateAnalysisRequest): Promise<void> {
    // Prevent duplicate processing
    if (this.processingQueue.has(analysisId)) {
      return this.processingQueue.get(analysisId);
    }

    const processingPromise = (async () => {
      try {
        const startTime = Date.now();

        // Update status to processing
        await this.db.updateAnalysis(analysisId, {
          status: 'processing',
          started_at: new Date().toISOString(),
        });

        // Prepare input for BookAnalyzer
        const analysisInput: AnalysisInput = {
          bookTitle: request.book.title,
          author: request.book.author,
          publicationYear: request.book.publicationYear,
          genre: (request.book.genre as any) || 'business',
          purpose: (request.options.purpose as any) || 'reference',
          audience: request.options.audience || 'general audience',
          analysisDepth: request.options.analysisDepth || 'standard',
          focusAreas: request.options.focusAreas,
          specificContext: request.options.specificContext,
        };

        // Determine model based on processing mode
        const modelId = request.options.processingMode === 'batch'
          ? 'claude-sonnet-4-5-20250929'  // Batch uses standard sonnet
          : 'claude-sonnet-4-5-20250929'; // Expedited also uses sonnet for now

        // Run analysis
        const analyzer = new BookAnalyzer(modelId);
        const outputDir = path.join(process.cwd(), 'data', 'analyses', analysisId);

        const result = await analyzer.analyze(analysisInput, {
          stream: false,
          save: true,
          outputDir,
        });

        const processingTime = Date.now() - startTime;

        // Upload documents to Supabase Storage
        console.log(`Uploading documents to Supabase Storage for ${analysisId}...`);
        try {
          await this.storageService.uploadAllDocuments(analysisId, result.documents);
          console.log(`✅ Documents uploaded successfully for ${analysisId}`);
        } catch (uploadError) {
          console.error(`⚠️ Failed to upload documents to Supabase for ${analysisId}:`, uploadError);
          // Continue anyway - documents are still on local filesystem as fallback
        }

        // Update analysis with result
        const resultUrl = `/api/v1/analyses/${analysisId}/documents`;
        await this.db.updateAnalysis(analysisId, {
          status: 'completed',
          result_url: resultUrl,
          processing_time_ms: processingTime,
          completed_at: new Date().toISOString(),
        });

        // Send webhook if configured
        const analysis = (await this.db.getAnalysis(analysisId))!;
        if (analysis.webhook_url) {
          await this.webhookService.sendWebhook(analysis, 'analysis.completed');
        }

        console.log(`Analysis ${analysisId} completed in ${processingTime}ms`);
      } catch (error) {
        console.error(`Analysis ${analysisId} failed:`, error);

        // Update analysis with error
        await this.db.updateAnalysis(analysisId, {
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          completed_at: new Date().toISOString(),
        });

        // Send failure webhook if configured
        const analysis = await this.db.getAnalysis(analysisId);
        if (analysis?.webhook_url) {
          await this.webhookService.sendWebhook(analysis, 'analysis.failed');
        }
      } finally {
        this.processingQueue.delete(analysisId);
      }
    })();

    this.processingQueue.set(analysisId, processingPromise);
    return processingPromise;
  }

  async retryAnalysis(analysisId: string): Promise<AnalysisResponse> {
    const analysis = await this.db.getAnalysis(analysisId);

    if (!analysis) {
      throw new Error(`Analysis ${analysisId} not found`);
    }

    if (analysis.status !== 'failed') {
      throw new Error(`Analysis ${analysisId} is not in failed state (current: ${analysis.status})`);
    }

    // Reset analysis to queued state
    await this.db.updateAnalysis(analysisId, {
      status: 'queued',
      error_message: undefined,
      completed_at: undefined,
      started_at: undefined,
    });

    // Reconstruct the original request from the database record
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

    // Start processing (non-blocking) - NO CHARGE for retry
    this.processAnalysis(analysisId, request).catch(error => {
      console.error(`Failed to retry analysis ${analysisId}:`, error);
    });

    const updatedAnalysis = await this.db.getAnalysis(analysisId);
    return this.mapToResponse(updatedAnalysis!);
  }

  async retryFailedAnalyses(onlyDeploymentFailures: boolean = true): Promise<{ retried: number; skipped: number; errors: string[] }> {
    const errors: string[] = [];
    let retried = 0;
    let skipped = 0;

    // Get all failed analyses
    const failedAnalyses = await this.db.listAnalyses(500, 0, 'failed');

    for (const analysis of failedAnalyses) {
      try {
        // If onlyDeploymentFailures is true, only retry analyses with no error message
        // (these likely failed due to deployment restart)
        if (onlyDeploymentFailures && analysis.error_message) {
          skipped++;
          continue;
        }

        await this.retryAnalysis(analysis.id);
        retried++;

        // Add small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        const errorMsg = `Failed to retry ${analysis.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    return { retried, skipped, errors };
  }

  private mapToResponse(analysis: Analysis): AnalysisResponse {
    const estimatedTime = analysis.processing_mode === 'batch'
      ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      : new Date(Date.now() + 9 * 60 * 1000).toISOString(); // 9 minutes

    return {
      id: analysis.id,
      status: analysis.status,
      book: {
        title: analysis.book_title,
        author: analysis.author,
      },
      processingMode: analysis.processing_mode,
      estimatedCost: analysis.cost,
      estimatedCompletionTime: analysis.status === 'queued' ? estimatedTime : undefined,
      resultUrl: analysis.result_url,
      createdAt: analysis.created_at,
      updatedAt: analysis.updated_at,
      completedAt: analysis.completed_at,
    };
  }
}
