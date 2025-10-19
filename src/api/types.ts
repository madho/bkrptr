// src/api/types.ts

export interface CreateAnalysisRequest {
  book: {
    title: string;
    author: string;
    publicationYear?: string;
    genre?: string;
  };
  options: {
    processingMode: 'batch' | 'expedited';
    purpose?: string;
    audience?: string;
    analysisDepth?: 'quick' | 'standard' | 'comprehensive';
    focusAreas?: string[];
    specificContext?: string;
  };
  webhookUrl?: string;
}

export interface AnalysisResponse {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  book: {
    title: string;
    author: string;
  };
  processingMode: 'batch' | 'expedited';
  estimatedCost: number;
  estimatedCompletionTime?: string;
  resultUrl?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface WebhookPayload {
  event: 'analysis.completed' | 'analysis.failed';
  analysis: {
    id: string;
    book: {
      title: string;
      author: string;
    };
    status: string;
    resultUrl?: string;
    errorMessage?: string;
    completedAt: string;
  };
  timestamp: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface ListAnalysesResponse {
  data: AnalysisResponse[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}
