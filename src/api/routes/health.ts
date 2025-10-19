// src/api/routes/health.ts
import { Router, Request, Response } from 'express';
import { DatabaseService } from '../models/database';

export function createHealthRouter(db: DatabaseService): Router {
  const router = Router();

  router.get('/', (req: Request, res: Response) => {
    try {
      // Check database connection
      const analyses = db.listAnalyses(1, 0);

      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        service: 'bkrptr-api',
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  return router;
}
