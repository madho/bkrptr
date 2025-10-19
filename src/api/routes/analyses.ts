// src/api/routes/analyses.ts
import { Router, Request, Response } from 'express';
import { AnalysisService } from '../services/analysis-service';
import { DatabaseService } from '../models/database-postgres';
import { validateCreateAnalysis } from '../middleware/validation';
import { CreateAnalysisRequest, ListAnalysesResponse } from '../types';
import path from 'path';
import fs from 'fs/promises';

export function createAnalysesRouter(db: DatabaseService, analysisService: AnalysisService): Router {
  const router = Router();

  // Create new analysis
  router.post('/', validateCreateAnalysis, async (req: Request, res: Response) => {
    try {
      const request = req.body as CreateAnalysisRequest;
      const idempotencyKey = req.headers['idempotency-key'] as string | undefined;

      const analysis = await analysisService.createAnalysis(request, idempotencyKey);

      res.status(201).json(analysis);
    } catch (error) {
      console.error('Error creating analysis:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create analysis',
          details: error instanceof Error ? error.message : undefined,
        },
      });
    }
  });

  // Get analysis by ID
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const analysis = await analysisService.getAnalysis(id);

      if (!analysis) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: `Analysis ${id} not found`,
          },
        });
      }

      res.json(analysis);
    } catch (error) {
      console.error('Error fetching analysis:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch analysis',
        },
      });
    }
  });

  // List analyses
  router.get('/', async (req: Request, res: Response) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const offset = parseInt(req.query.offset as string) || 0;
      const status = req.query.status as string | undefined;

      const analyses = await analysisService.listAnalyses(limit, offset, status);
      const total = await db.countAnalyses(status);

      const response: ListAnalysesResponse = {
        data: analyses,
        pagination: {
          limit,
          offset,
          total,
          hasMore: offset + limit < total,
        },
      };

      res.json(response);
    } catch (error) {
      console.error('Error listing analyses:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to list analyses',
        },
      });
    }
  });

  // Get analysis documents
  router.get('/:id/documents', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const analysis = await db.getAnalysis(id);

      if (!analysis) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: `Analysis ${id} not found`,
          },
        });
      }

      if (analysis.status !== 'completed') {
        return res.status(400).json({
          error: {
            code: 'ANALYSIS_NOT_COMPLETE',
            message: `Analysis is ${analysis.status}, documents not available yet`,
          },
        });
      }

      // Read documents from filesystem
      const docsDir = path.join(process.cwd(), 'data', 'analyses', id);

      try {
        const [madhoSummary, detailed, summary, reference] = await Promise.all([
          fs.readFile(path.join(docsDir, 'MADHO_SUMMARY.md'), 'utf-8'),
          fs.readFile(path.join(docsDir, 'DETAILED_ANALYSIS.md'), 'utf-8'),
          fs.readFile(path.join(docsDir, 'SUMMARY.md'), 'utf-8'),
          fs.readFile(path.join(docsDir, 'QUICK_REFERENCE.md'), 'utf-8'),
        ]);

        res.json({
          id: analysis.id,
          documents: {
            madhoSummary,
            detailed,
            summary,
            reference,
          },
          metadata: {
            bookTitle: analysis.book_title,
            author: analysis.author,
            completedAt: analysis.completed_at,
            processingTimeMs: analysis.processing_time_ms,
            cost: analysis.cost,
          },
        });
      } catch (fileError) {
        console.error('Error reading document files:', fileError);
        res.status(500).json({
          error: {
            code: 'DOCUMENTS_NOT_FOUND',
            message: 'Analysis completed but documents not found',
          },
        });
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch documents',
        },
      });
    }
  });

  // Get specific document
  router.get('/:id/documents/:type', async (req: Request, res: Response) => {
    try {
      const { id, type } = req.params;
      const analysis = await db.getAnalysis(id);

      if (!analysis) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: `Analysis ${id} not found`,
          },
        });
      }

      if (analysis.status !== 'completed') {
        return res.status(400).json({
          error: {
            code: 'ANALYSIS_NOT_COMPLETE',
            message: `Analysis is ${analysis.status}, documents not available yet`,
          },
        });
      }

      const fileMap: Record<string, string> = {
        'madho-summary': 'MADHO_SUMMARY.md',
        'detailed': 'DETAILED_ANALYSIS.md',
        'summary': 'SUMMARY.md',
        'reference': 'QUICK_REFERENCE.md',
      };

      const fileName = fileMap[type];
      if (!fileName) {
        return res.status(400).json({
          error: {
            code: 'INVALID_DOCUMENT_TYPE',
            message: `Invalid document type. Must be one of: ${Object.keys(fileMap).join(', ')}`,
          },
        });
      }

      const filePath = path.join(process.cwd(), 'data', 'analyses', id, fileName);
      const content = await fs.readFile(filePath, 'utf-8');

      res.type('text/markdown').send(content);
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch document',
        },
      });
    }
  });

  return router;
}
