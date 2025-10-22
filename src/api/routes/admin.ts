// src/api/routes/admin.ts
// Temporary admin routes for initial setup
// TODO: Remove or secure properly after initial setup

import { Router, Request, Response } from 'express';
import { DatabaseService } from '../models/database';
import { AnalysisService } from '../services/analysis-service';

export function createAdminRouter(db: DatabaseService, analysisService: AnalysisService): Router {
  const router = Router();

  // Create API key endpoint - protected by WEBHOOK_SECRET env var
  router.post('/create-key', async (req: Request, res: Response) => {
    const secret = req.headers['x-admin-secret'];

    if (secret !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Name is required' });
    }

    try {
      const { apiKey, record } = await db.createApiKey(name);

      res.json({
        success: true,
        apiKey: apiKey,
        keyInfo: {
          id: record.id,
          name: record.name,
          prefix: record.key_prefix,
          createdAt: record.created_at
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Retry failed analyses endpoint
  router.post('/retry-failed', async (req: Request, res: Response) => {
    const secret = req.headers['x-admin-secret'];

    if (secret !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { onlyDeploymentFailures = true } = req.body;

    try {
      const result = await analysisService.retryFailedAnalyses(onlyDeploymentFailures);

      res.json({
        success: true,
        retried: result.retried,
        skipped: result.skipped,
        errors: result.errors,
        message: `Retried ${result.retried} analyses, skipped ${result.skipped}`,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Retry single analysis endpoint
  router.post('/retry/:id', async (req: Request, res: Response) => {
    const secret = req.headers['x-admin-secret'];

    if (secret !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    try {
      const analysis = await analysisService.retryAnalysis(id);

      res.json({
        success: true,
        analysis,
        message: `Analysis ${id} queued for retry`,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
