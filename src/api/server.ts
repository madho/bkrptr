// src/api/server.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { DatabaseService } from './models/database-postgres';
import { WebhookService } from './services/webhook-service';
import { AnalysisService } from './services/analysis-service';
import { createAuthMiddleware } from './middleware/auth';
import { createAnalysesRouter } from './routes/analyses';
import { createHealthRouter } from './routes/health';

export function createServer(): Express {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  }));

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
    message: {
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later',
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/', limiter);

  // Request logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    });
    next();
  });

  // Initialize services
  const db = new DatabaseService();
  const webhookService = new WebhookService(db, process.env.WEBHOOK_SECRET);
  const analysisService = new AnalysisService(db, webhookService);

  // Public routes (no auth required)
  app.use('/api/v1/health', createHealthRouter(db));

  // Protected routes (auth required)
  const authMiddleware = createAuthMiddleware(db);
  app.use('/api/v1/analyses', authMiddleware, createAnalysesRouter(db, analysisService));

  // Root endpoint
  app.get('/', (req: Request, res: Response) => {
    res.json({
      name: 'bkrptr API',
      version: '1.0.0',
      description: 'AI-powered book analysis service',
      documentation: 'https://github.com/madho/bkrptr/blob/main/docs/api/specs/INTEGRATION-GUIDE.md',
      endpoints: {
        health: '/api/v1/health',
        analyses: '/api/v1/analyses',
      },
    });
  });

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Route ${req.method} ${req.path} not found`,
      },
    });
  });

  // Error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
    });
  });

  // Periodic webhook retry processing
  setInterval(() => {
    webhookService.processRetries().catch(error => {
      console.error('Error processing webhook retries:', error);
    });
  }, 60000); // Every minute

  return app;
}
