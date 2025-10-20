// src/api/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../models/database';

export interface AuthenticatedRequest extends Request {
  apiKey?: {
    id: string;
    name: string;
  };
}

export function createAuthMiddleware(db: DatabaseService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing or invalid Authorization header. Expected: Bearer <api_key>',
        },
      });
    }

    const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const keyRecord = await db.validateApiKey(apiKey);

      if (!keyRecord) {
        return res.status(401).json({
          error: {
            code: 'INVALID_API_KEY',
            message: 'Invalid or inactive API key',
          },
        });
      }

      // Attach API key info to request
      (req as AuthenticatedRequest).apiKey = {
        id: keyRecord.id,
        name: keyRecord.name,
      };

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Authentication failed',
        },
      });
    }
  };
}
