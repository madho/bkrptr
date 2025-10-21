// src/api/routes/admin.ts
// Temporary admin routes for initial setup
// TODO: Remove or secure properly after initial setup

import { Router, Request, Response } from 'express';
import { DatabaseService } from '../models/database';

export function createAdminRouter(db: DatabaseService): Router {
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

  return router;
}
