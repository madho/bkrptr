// src/api/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { CreateAnalysisRequest } from '../types';

export function validateCreateAnalysis(req: Request, res: Response, next: NextFunction) {
  const body = req.body as CreateAnalysisRequest;

  // Validate book
  if (!body.book || typeof body.book !== 'object') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Missing or invalid book object',
      },
    });
  }

  if (!body.book.title || typeof body.book.title !== 'string' || body.book.title.trim().length === 0) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'book.title is required and must be a non-empty string',
      },
    });
  }

  if (!body.book.author || typeof body.book.author !== 'string' || body.book.author.trim().length === 0) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'book.author is required and must be a non-empty string',
      },
    });
  }

  // Validate options
  if (!body.options || typeof body.options !== 'object') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Missing or invalid options object',
      },
    });
  }

  if (!body.options.processingMode || !['batch', 'expedited'].includes(body.options.processingMode)) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'options.processingMode must be either "batch" or "expedited"',
      },
    });
  }

  // Validate optional fields
  if (body.options.analysisDepth && !['quick', 'standard', 'comprehensive'].includes(body.options.analysisDepth)) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'options.analysisDepth must be "quick", "standard", or "comprehensive"',
      },
    });
  }

  if (body.webhookUrl && typeof body.webhookUrl !== 'string') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'webhookUrl must be a string',
      },
    });
  }

  if (body.webhookUrl && !isValidUrl(body.webhookUrl)) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'webhookUrl must be a valid HTTP/HTTPS URL',
      },
    });
  }

  next();
}

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
