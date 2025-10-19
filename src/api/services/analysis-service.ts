// src/api/services/analysis-service.ts
import { BookAnalyzer } from '../../core/analyzer';
import { DatabaseService, Analysis } from '../models/database';
import { WebhookService } from './webhook-service';
import { CreateAnalysisRequest, AnalysisResponse } from '../types';
import { AnalysisInput } from '../../types';
import path from 'path';

export class AnalysisService {
  private db: DatabaseService;
  private webhookService: WebhookService;
  private processingQueue: Map<string, Promise<void>>;

  constructor(db: DatabaseService, webhookService: WebhookService) {
    this.db = db;
    this.webhookService = webhookService;
    this.processingQueue = new Map();
  }

  async createAnalysis(request: CreateAnalysisRequest, idempotencyKey?: string): Promise<AnalysisResponse> {
    // Check for duplicate idempotency key
    if (idempotencyKey) {
      const existing = this.db.listAnalyses(1, 0).find(a => a.idempotency_key === idempotencyKey);
      if (existing) {
        return this.mapToResponse(existing);
      }
    }

    // Calculate cost
    const cost = request.options.processingMode === 'batch' ? 0.03 : 0.06;

    // Create analysis record
    const analysis = this.db.createAnalysis({
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
    const analysis = this.db.getAnalysis(id);
    return analysis ? this.mapToResponse(analysis) : null;
  }

  async listAnalyses(limit: number, offset: number, status?: string): Promise<AnalysisResponse[]> {
    const analyses = this.db.listAnalyses(limit, offset, status);
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
        this.db.updateAnalysis(analysisId, {
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

        // Update analysis with result
        const resultUrl = `/api/v1/analyses/${analysisId}/documents`;
        this.db.updateAnalysis(analysisId, {
          status: 'completed',
          result_url: resultUrl,
          processing_time_ms: processingTime,
          completed_at: new Date().toISOString(),
        });

        // Send webhook if configured
        const analysis = this.db.getAnalysis(analysisId)!;
        if (analysis.webhook_url) {
          await this.webhookService.sendWebhook(analysis, 'analysis.completed');
        }

        console.log(`Analysis ${analysisId} completed in ${processingTime}ms`);
      } catch (error) {
        console.error(`Analysis ${analysisId} failed:`, error);

        // Update analysis with error
        this.db.updateAnalysis(analysisId, {
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          completed_at: new Date().toISOString(),
        });

        // Send failure webhook if configured
        const analysis = this.db.getAnalysis(analysisId);
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
