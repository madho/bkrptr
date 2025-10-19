# bkrptr TypeScript SDK Specification

## Overview

The bkrptr TypeScript SDK provides a type-safe, promise-based interface for interacting with the bkrptr API. It handles authentication, rate limiting, retries, and webhook signature verification.

## Package Information

```json
{
  "name": "@bkrptr/typescript-sdk",
  "version": "1.0.0",
  "description": "Official TypeScript SDK for bkrptr API",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "module": "dist/index.esm.js",
  "license": "MIT",
  "engines": {
    "node": ">=14.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/bkrptr/typescript-sdk"
  },
  "keywords": [
    "bkrptr",
    "book-analysis",
    "ai",
    "api",
    "sdk",
    "typescript"
  ]
}
```

## Installation

```bash
npm install @bkrptr/typescript-sdk
# or
yarn add @bkrptr/typescript-sdk
# or
pnpm add @bkrptr/typescript-sdk
```

## Architecture

### Module Structure

```
@bkrptr/typescript-sdk/
├── src/
│   ├── index.ts                 # Main entry point
│   ├── client.ts                # BkrptrClient class
│   ├── types/
│   │   ├── index.ts             # Type exports
│   │   ├── analyses.ts          # Analysis types
│   │   ├── documents.ts         # Document types
│   │   ├── webhooks.ts          # Webhook types
│   │   ├── account.ts           # Account types
│   │   └── common.ts            # Shared types
│   ├── resources/
│   │   ├── analyses.ts          # Analyses resource
│   │   ├── documents.ts         # Documents resource
│   │   ├── webhooks.ts          # Webhooks resource
│   │   └── account.ts           # Account resource
│   ├── utils/
│   │   ├── http.ts              # HTTP client wrapper
│   │   ├── retry.ts             # Retry logic
│   │   ├── signature.ts         # Webhook signatures
│   │   ├── errors.ts            # Error classes
│   │   └── validation.ts        # Input validation
│   └── constants.ts             # SDK constants
├── test/
│   ├── client.test.ts
│   ├── resources/
│   └── utils/
├── examples/
│   ├── basic-usage.ts
│   ├── webhook-handler.ts
│   ├── batch-processing.ts
│   └── error-handling.ts
└── dist/                        # Compiled output
```

---

## Core Interfaces & Types

### Client Configuration

```typescript
interface BkrptrConfig {
  /**
   * API key for authentication
   */
  apiKey: string;

  /**
   * Base URL for API requests
   * @default "https://api.bkrptr.com/v1"
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;

  /**
   * Maximum number of retries for failed requests
   * @default 3
   */
  maxRetries?: number;

  /**
   * Retry configuration
   */
  retryConfig?: RetryConfig;

  /**
   * Custom HTTP agent (for proxy support)
   */
  httpAgent?: Agent;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;

  /**
   * Telemetry options
   */
  telemetry?: TelemetryConfig;
}

interface RetryConfig {
  /**
   * Initial delay in milliseconds
   * @default 1000
   */
  initialDelay?: number;

  /**
   * Maximum delay in milliseconds
   * @default 32000
   */
  maxDelay?: number;

  /**
   * Backoff multiplier
   * @default 2
   */
  backoffMultiplier?: number;

  /**
   * Add jitter to delays
   * @default true
   */
  jitter?: boolean;

  /**
   * Retry on these status codes
   * @default [429, 500, 502, 503, 504]
   */
  retryableStatuses?: number[];
}

interface TelemetryConfig {
  /**
   * Enable telemetry
   * @default true
   */
  enabled?: boolean;

  /**
   * Include in user agent
   */
  appInfo?: {
    name: string;
    version: string;
  };
}
```

### Analysis Types

```typescript
/**
 * Book input for analysis
 */
interface BookInput {
  /** Book title (required) */
  title: string;

  /** Book author(s) (required) */
  author: string;

  /** ISBN-10 or ISBN-13 */
  isbn?: string;

  /** Book genre/category */
  genre?: BookGenre;

  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Analysis processing options
 */
interface AnalysisOptions {
  /** Processing speed preference */
  processingMode?: ProcessingMode;

  /** Depth of analysis */
  analysisDepth?: AnalysisDepth;

  /** Target audience */
  targetAudience?: TargetAudience;

  /** Additional context to guide analysis */
  additionalContext?: string;

  /** Custom parameters */
  customParameters?: Record<string, any>;
}

/**
 * Analysis request
 */
interface AnalysisRequest {
  /** Book details */
  book: BookInput;

  /** Processing options */
  options?: AnalysisOptions;

  /** Webhook configuration */
  webhook?: WebhookConfig;

  /** Idempotency key for request deduplication */
  idempotencyKey?: string;

  /** Request metadata */
  metadata?: Record<string, any>;
}

/**
 * Analysis response
 */
interface Analysis {
  /** Unique analysis identifier */
  id: string;

  /** Book details */
  book: BookInput;

  /** Current status */
  status: AnalysisStatus;

  /** Processing options used */
  options: Required<AnalysisOptions>;

  /** Submission timestamp */
  submittedAt: Date;

  /** Processing start timestamp */
  startedAt?: Date;

  /** Completion timestamp */
  completedAt?: Date;

  /** Estimated completion time */
  estimatedCompletion: Date;

  /** Processing time in seconds */
  processingTime?: number;

  /** Cost in USD */
  cost: number;

  /** Available documents (when completed) */
  documents?: Document[];

  /** Error details (if failed) */
  error?: AnalysisError;

  /** Custom metadata */
  metadata?: Record<string, any>;
}

/**
 * Enums
 */
enum ProcessingMode {
  Batch = "batch",
  Expedited = "expedited"
}

enum AnalysisDepth {
  Quick = "quick",
  Standard = "standard",
  Comprehensive = "comprehensive"
}

enum AnalysisStatus {
  Pending = "pending",
  Processing = "processing",
  Completed = "completed",
  Failed = "failed",
  Cancelled = "cancelled"
}

enum TargetAudience {
  General = "general",
  BusinessProfessionals = "business-professionals",
  Students = "students",
  Researchers = "researchers",
  Educators = "educators"
}

enum BookGenre {
  SelfHelp = "self-help",
  Business = "business",
  Fiction = "fiction",
  NonFiction = "non-fiction",
  Technology = "technology",
  Science = "science",
  History = "history",
  Biography = "biography",
  Philosophy = "philosophy",
  Psychology = "psychology",
  Economics = "economics",
  Politics = "politics",
  Education = "education",
  Health = "health",
  Spirituality = "spirituality",
  Other = "other"
}
```

### Document Types

```typescript
/**
 * Document information
 */
interface Document {
  /** Document type */
  type: DocumentType;

  /** Download URL */
  url: string;

  /** File size in bytes */
  size: number;

  /** Document format */
  format: DocumentFormat;

  /** Generation timestamp */
  generatedAt: Date;

  /** SHA256 checksum */
  checksum?: string;

  /** Expiration time for URL */
  expiresAt?: Date;
}

/**
 * Document types
 */
enum DocumentType {
  MadhoSummary = "madho-summary",
  DetailedAnalysis = "detailed-analysis",
  ExecutiveSummary = "executive-summary",
  QuickReference = "quick-reference"
}

/**
 * Document formats
 */
enum DocumentFormat {
  Markdown = "markdown",
  PDF = "pdf",
  DOCX = "docx",
  HTML = "html"
}

/**
 * Document download options
 */
interface DocumentDownloadOptions {
  /** Desired format */
  format?: DocumentFormat;

  /** Include metadata */
  includeMetadata?: boolean;
}
```

### Webhook Types

```typescript
/**
 * Webhook configuration
 */
interface WebhookConfig {
  /** Webhook endpoint URL (HTTPS required) */
  url: string;

  /** Events to subscribe to */
  events?: WebhookEventType[];

  /** Shared secret for signature verification */
  secret?: string;

  /** Custom headers to include */
  headers?: Record<string, string>;
}

/**
 * Webhook registration
 */
interface Webhook {
  /** Webhook identifier */
  id: string;

  /** Endpoint URL */
  url: string;

  /** Subscribed events */
  events: WebhookEventType[];

  /** Active status */
  active: boolean;

  /** Shared secret (masked) */
  secret: string;

  /** Creation timestamp */
  createdAt: Date;

  /** Last trigger timestamp */
  lastTriggeredAt?: Date;

  /** Consecutive failure count */
  failureCount: number;

  /** Custom headers */
  headers?: Record<string, string>;
}

/**
 * Webhook event types
 */
enum WebhookEventType {
  AnalysisStarted = "analysis.started",
  AnalysisCompleted = "analysis.completed",
  AnalysisFailed = "analysis.failed",
  AnalysisCancelled = "analysis.cancelled",
  DocumentGenerated = "document.generated",
  DocumentReady = "document.ready",
  ProcessingExpedited = "processing.expedited",
  ProcessingQueued = "processing.queued"
}

/**
 * Webhook event
 */
interface WebhookEvent<T = any> {
  /** Event identifier */
  id: string;

  /** Event type */
  type: WebhookEventType;

  /** Unix timestamp */
  created: number;

  /** Event data */
  data: T;

  /** Optional metadata */
  metadata?: {
    apiVersion: string;
    retryCount?: number;
    originalEventId?: string;
  };
}
```

---

## Client Implementation

### Main Client Class

```typescript
import { EventEmitter } from 'events';

/**
 * Main bkrptr client
 */
export class BkrptrClient extends EventEmitter {
  private config: Required<BkrptrConfig>;
  private http: HttpClient;

  // Resource accessors
  public readonly analyses: AnalysesResource;
  public readonly documents: DocumentsResource;
  public readonly webhooks: WebhooksResource;
  public readonly account: AccountResource;

  constructor(config: BkrptrConfig | string) {
    super();

    // Allow passing just API key as string
    if (typeof config === 'string') {
      config = { apiKey: config };
    }

    // Validate and set defaults
    this.config = this.validateConfig(config);

    // Initialize HTTP client
    this.http = new HttpClient(this.config);

    // Initialize resources
    this.analyses = new AnalysesResource(this.http);
    this.documents = new DocumentsResource(this.http);
    this.webhooks = new WebhooksResource(this.http);
    this.account = new AccountResource(this.http);

    // Set up event forwarding
    this.setupEventForwarding();
  }

  /**
   * Validate configuration
   */
  private validateConfig(config: BkrptrConfig): Required<BkrptrConfig> {
    if (!config.apiKey) {
      throw new BkrptrError('API key is required', 'MISSING_API_KEY');
    }

    if (!config.apiKey.startsWith('bkrptr_')) {
      throw new BkrptrError('Invalid API key format', 'INVALID_API_KEY');
    }

    return {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || 'https://api.bkrptr.com/v1',
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      retryConfig: {
        initialDelay: 1000,
        maxDelay: 32000,
        backoffMultiplier: 2,
        jitter: true,
        retryableStatuses: [429, 500, 502, 503, 504],
        ...config.retryConfig
      },
      httpAgent: config.httpAgent,
      debug: config.debug || false,
      telemetry: {
        enabled: true,
        ...config.telemetry
      }
    };
  }

  /**
   * Set up event forwarding from resources
   */
  private setupEventForwarding(): void {
    [this.analyses, this.documents, this.webhooks, this.account].forEach(resource => {
      resource.on('request', (data) => this.emit('request', data));
      resource.on('response', (data) => this.emit('response', data));
      resource.on('error', (error) => this.emit('error', error));
    });
  }

  /**
   * Update configuration
   */
  public updateConfig(updates: Partial<BkrptrConfig>): void {
    this.config = {
      ...this.config,
      ...updates
    };
    this.http.updateConfig(this.config);
  }

  /**
   * Get current configuration (without sensitive data)
   */
  public getConfig(): Partial<BkrptrConfig> {
    const { apiKey, ...safeConfig } = this.config;
    return {
      ...safeConfig,
      apiKey: `${apiKey.substring(0, 20)}...`
    };
  }

  /**
   * Static webhook signature verification
   */
  public static verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
    secret: string
  ): boolean {
    return verifyWebhookSignature(payload, signature, secret);
  }

  /**
   * Create webhook event handler
   */
  public createWebhookHandler(secret: string): WebhookHandler {
    return new WebhookHandler(secret);
  }
}
```

### Resource Classes

```typescript
/**
 * Analyses resource
 */
export class AnalysesResource extends BaseResource {
  /**
   * Create a new analysis
   */
  async create(request: AnalysisRequest): Promise<Analysis> {
    const response = await this.http.post<Analysis>('/analyses', request, {
      headers: request.idempotencyKey
        ? { 'X-Idempotency-Key': request.idempotencyKey }
        : undefined
    });

    return this.transformAnalysis(response.data);
  }

  /**
   * Get analysis by ID
   */
  async get(id: string): Promise<Analysis> {
    const response = await this.http.get<Analysis>(`/analyses/${id}`);
    return this.transformAnalysis(response.data);
  }

  /**
   * List analyses with filters
   */
  async list(params?: ListAnalysesParams): Promise<PaginatedResponse<Analysis>> {
    const response = await this.http.get<PaginatedResponse<Analysis>>(
      '/analyses',
      { params }
    );

    return {
      ...response.data,
      data: response.data.data.map(a => this.transformAnalysis(a))
    };
  }

  /**
   * Get analysis status (lightweight)
   */
  async getStatus(id: string): Promise<AnalysisStatus> {
    const response = await this.http.get<{ status: AnalysisStatus }>(
      `/analyses/${id}/status`
    );
    return response.data.status;
  }

  /**
   * Cancel pending analysis
   */
  async cancel(id: string): Promise<void> {
    await this.http.delete(`/analyses/${id}`);
  }

  /**
   * Expedite batch analysis
   */
  async expedite(id: string): Promise<ExpediteResponse> {
    const response = await this.http.post<ExpediteResponse>(
      `/analyses/${id}/expedite`
    );
    return response.data;
  }

  /**
   * Wait for analysis completion
   */
  async waitForCompletion(
    id: string,
    options?: WaitOptions
  ): Promise<Analysis> {
    const {
      pollInterval = 60000,
      timeout = 86400000,
      onProgress
    } = options || {};

    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const analysis = await this.get(id);

      if (onProgress) {
        onProgress(analysis);
      }

      if (analysis.status === AnalysisStatus.Completed ||
          analysis.status === AnalysisStatus.Failed ||
          analysis.status === AnalysisStatus.Cancelled) {
        return analysis;
      }

      await sleep(pollInterval);
    }

    throw new BkrptrError(
      `Analysis ${id} did not complete within ${timeout}ms`,
      'TIMEOUT'
    );
  }

  /**
   * Transform raw API response to Analysis object
   */
  private transformAnalysis(data: any): Analysis {
    return {
      ...data,
      submittedAt: new Date(data.submittedAt),
      startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
      completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
      estimatedCompletion: new Date(data.estimatedCompletion),
      documents: data.documents?.map(this.transformDocument)
    };
  }

  private transformDocument(data: any): Document {
    return {
      ...data,
      generatedAt: new Date(data.generatedAt),
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined
    };
  }
}

/**
 * List analyses parameters
 */
interface ListAnalysesParams {
  /** Filter by status */
  status?: AnalysisStatus;

  /** Filter by processing mode */
  processingMode?: ProcessingMode;

  /** Start date filter */
  startDate?: Date | string;

  /** End date filter */
  endDate?: Date | string;

  /** Page number */
  page?: number;

  /** Items per page */
  perPage?: number;

  /** Sort field */
  sortBy?: 'submittedAt' | 'completedAt' | 'title' | 'status';

  /** Sort order */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Wait options
 */
interface WaitOptions {
  /** Poll interval in milliseconds */
  pollInterval?: number;

  /** Timeout in milliseconds */
  timeout?: number;

  /** Progress callback */
  onProgress?: (analysis: Analysis) => void;
}
```

---

## Error Handling

### Error Classes

```typescript
/**
 * Base error class for SDK errors
 */
export class BkrptrError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: any,
    public requestId?: string
  ) {
    super(message);
    this.name = 'BkrptrError';
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Check if error is retryable
   */
  isRetryable(): boolean {
    return this.statusCode
      ? [429, 500, 502, 503, 504].includes(this.statusCode)
      : false;
  }

  /**
   * Get retry delay in milliseconds
   */
  getRetryDelay(): number | undefined {
    if (this.code === 'RATE_LIMIT_EXCEEDED' && this.details?.retryAfter) {
      return this.details.retryAfter * 1000;
    }
    return undefined;
  }

  /**
   * Convert to plain object
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      requestId: this.requestId,
      stack: this.stack
    };
  }
}

/**
 * Specific error types
 */
export class ValidationError extends BkrptrError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends BkrptrError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends BkrptrError {
  constructor(retryAfter?: number) {
    super(
      'Rate limit exceeded',
      'RATE_LIMIT_EXCEEDED',
      429,
      { retryAfter }
    );
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends BkrptrError {
  constructor(message: string, originalError?: Error) {
    super(message, 'NETWORK_ERROR', undefined, { originalError });
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends BkrptrError {
  constructor(message: string) {
    super(message, 'TIMEOUT');
    this.name = 'TimeoutError';
  }
}
```

### Error Handler

```typescript
/**
 * Global error handler
 */
export class ErrorHandler {
  private handlers: Map<string, (error: BkrptrError) => void> = new Map();

  /**
   * Register error handler for specific code
   */
  on(code: string, handler: (error: BkrptrError) => void): void {
    this.handlers.set(code, handler);
  }

  /**
   * Handle error
   */
  handle(error: BkrptrError): boolean {
    const handler = this.handlers.get(error.code);
    if (handler) {
      handler(error);
      return true;
    }
    return false;
  }

  /**
   * Create default handler
   */
  static createDefault(): ErrorHandler {
    const handler = new ErrorHandler();

    handler.on('RATE_LIMIT_EXCEEDED', (error) => {
      console.warn(`Rate limited. Retry after ${error.details?.retryAfter} seconds`);
    });

    handler.on('AUTHENTICATION_ERROR', (error) => {
      console.error('Authentication failed. Check your API key.');
    });

    handler.on('VALIDATION_ERROR', (error) => {
      console.error('Validation error:', error.details);
    });

    return handler;
  }
}
```

---

## Utilities

### Webhook Handler

```typescript
/**
 * Webhook handler for Express/Node.js
 */
export class WebhookHandler {
  constructor(private secret: string) {}

  /**
   * Create Express middleware
   */
  middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const signature = req.headers['x-bkrptr-signature'] as string;

        if (!signature) {
          throw new Error('Missing signature header');
        }

        // Verify signature
        const rawBody = req.body;
        if (!verifyWebhookSignature(rawBody, signature, this.secret)) {
          throw new Error('Invalid signature');
        }

        // Parse and attach event
        req.bkrptrEvent = JSON.parse(rawBody.toString());
        next();

      } catch (error) {
        res.status(401).json({ error: 'Webhook verification failed' });
      }
    };
  }

  /**
   * Verify and parse event
   */
  verifyAndParse(
    payload: string | Buffer,
    signature: string
  ): WebhookEvent {
    if (!verifyWebhookSignature(payload, signature, this.secret)) {
      throw new AuthenticationError('Invalid webhook signature');
    }

    return JSON.parse(payload.toString());
  }

  /**
   * Create event handler
   */
  on<T = any>(
    eventType: WebhookEventType,
    handler: (event: WebhookEvent<T>) => void | Promise<void>
  ): void {
    // Implementation
  }
}
```

### Rate Limiter

```typescript
/**
 * Client-side rate limiter
 */
export class RateLimiter {
  private tokens: Map<string, TokenBucket> = new Map();

  constructor(
    private limit: number,
    private windowMs: number
  ) {}

  /**
   * Check if request is allowed
   */
  async checkLimit(key: string = 'default'): Promise<boolean> {
    const bucket = this.getBucket(key);
    return bucket.consume();
  }

  /**
   * Wait for available token
   */
  async waitForToken(key: string = 'default'): Promise<void> {
    const bucket = this.getBucket(key);
    await bucket.waitForToken();
  }

  private getBucket(key: string): TokenBucket {
    if (!this.tokens.has(key)) {
      this.tokens.set(key, new TokenBucket(this.limit, this.windowMs));
    }
    return this.tokens.get(key)!;
  }
}

class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private capacity: number,
    private refillRate: number
  ) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  consume(): boolean {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens--;
      return true;
    }
    return false;
  }

  async waitForToken(): Promise<void> {
    while (!this.consume()) {
      await sleep(100);
    }
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = (elapsed / this.refillRate) * this.capacity;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}
```

---

## Usage Examples

### Basic Usage

```typescript
import { BkrptrClient, ProcessingMode, AnalysisDepth } from '@bkrptr/typescript-sdk';

// Initialize client
const client = new BkrptrClient({
  apiKey: process.env.BKRPTR_API_KEY!,
  debug: true
});

// Submit analysis
const analysis = await client.analyses.create({
  book: {
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '9780735211292',
    genre: BookGenre.SelfHelp
  },
  options: {
    processingMode: ProcessingMode.Batch,
    analysisDepth: AnalysisDepth.Standard,
    targetAudience: TargetAudience.General
  },
  idempotencyKey: 'unique-request-123'
});

console.log(`Analysis submitted: ${analysis.id}`);
console.log(`Estimated completion: ${analysis.estimatedCompletion}`);

// Wait for completion
const completed = await client.analyses.waitForCompletion(analysis.id, {
  pollInterval: 60000, // Check every minute
  onProgress: (analysis) => {
    console.log(`Status: ${analysis.status}`);
  }
});

// Download documents
for (const doc of completed.documents!) {
  const content = await client.documents.download(
    completed.id,
    doc.type,
    { format: DocumentFormat.Markdown }
  );
  console.log(`Downloaded ${doc.type}: ${content.length} bytes`);
}
```

### Advanced Error Handling

```typescript
import { BkrptrClient, BkrptrError, RateLimitError } from '@bkrptr/typescript-sdk';

const client = new BkrptrClient(process.env.BKRPTR_API_KEY!);

// Set up error handling
const errorHandler = ErrorHandler.createDefault();

errorHandler.on('INSUFFICIENT_CREDITS', (error) => {
  // Handle billing issues
  notifyBilling(error);
});

async function submitWithRetry(book: BookInput): Promise<Analysis> {
  let lastError: BkrptrError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await client.analyses.create({ book });

    } catch (error) {
      if (error instanceof BkrptrError) {
        lastError = error;

        // Handle specific errors
        if (!errorHandler.handle(error)) {
          // Default handling
          if (error instanceof RateLimitError) {
            const delay = error.getRetryDelay() || 60000;
            console.log(`Rate limited, waiting ${delay}ms...`);
            await sleep(delay);
            continue;
          }

          if (error.isRetryable()) {
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`Retrying in ${delay}ms...`);
            await sleep(delay);
            continue;
          }
        }

        // Non-retryable error
        throw error;
      }

      throw error;
    }
  }

  throw lastError!;
}
```

### Webhook Integration

```typescript
import express from 'express';
import { BkrptrClient, WebhookEventType } from '@bkrptr/typescript-sdk';

const app = express();
const client = new BkrptrClient(process.env.BKRPTR_API_KEY!);

// Create webhook handler
const webhookHandler = client.createWebhookHandler(
  process.env.WEBHOOK_SECRET!
);

// Use as middleware
app.use('/webhooks/bkrptr',
  express.raw({ type: 'application/json' }),
  webhookHandler.middleware()
);

// Handle events
app.post('/webhooks/bkrptr', (req, res) => {
  const event = req.bkrptrEvent;

  switch (event.type) {
    case WebhookEventType.AnalysisCompleted:
      handleAnalysisCompleted(event.data);
      break;

    case WebhookEventType.AnalysisFailed:
      handleAnalysisFailed(event.data);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
});

async function handleAnalysisCompleted(data: any) {
  console.log(`Analysis ${data.analysisId} completed!`);

  // Download summary
  const summary = await client.documents.download(
    data.analysisId,
    DocumentType.MadhoSummary
  );

  // Process summary...
}
```

### Batch Processing

```typescript
import { BkrptrClient, BookInput } from '@bkrptr/typescript-sdk';
import pLimit from 'p-limit';

const client = new BkrptrClient(process.env.BKRPTR_API_KEY!);

async function processBatch(books: BookInput[]): Promise<void> {
  // Limit concurrent requests
  const limit = pLimit(5);

  // Submit all analyses
  const submissions = books.map(book =>
    limit(() => client.analyses.create({
      book,
      options: { processingMode: ProcessingMode.Batch },
      idempotencyKey: `batch-${book.title}-${book.author}`
    }).catch(error => ({
      book,
      error: error.message
    })))
  );

  const results = await Promise.all(submissions);

  // Track successful submissions
  const successful = results.filter(r => 'id' in r);
  const failed = results.filter(r => 'error' in r);

  console.log(`Submitted: ${successful.length}/${books.length}`);

  if (failed.length > 0) {
    console.error('Failed submissions:', failed);
  }

  // Set up webhook to handle completions
  await client.webhooks.create({
    url: 'https://myapp.com/webhooks/batch',
    events: [
      WebhookEventType.AnalysisCompleted,
      WebhookEventType.AnalysisFailed
    ],
    secret: generateSecret()
  });

  console.log('Batch processing started. Waiting for webhooks...');
}
```

### Stream Processing

```typescript
import { BkrptrClient } from '@bkrptr/typescript-sdk';
import { Readable } from 'stream';

const client = new BkrptrClient(process.env.BKRPTR_API_KEY!);

/**
 * Stream document content
 */
async function* streamDocument(
  analysisId: string,
  documentType: DocumentType
): AsyncGenerator<string> {
  const content = await client.documents.download(
    analysisId,
    documentType
  );

  // Stream in chunks
  const chunkSize = 1024;
  for (let i = 0; i < content.length; i += chunkSize) {
    yield content.slice(i, i + chunkSize);
  }
}

// Usage
async function processStream() {
  const stream = streamDocument('ana_xyz789', DocumentType.MadhoSummary);

  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }
}
```

---

## Testing

### Test Setup

```typescript
import { BkrptrClient } from '@bkrptr/typescript-sdk';
import { MockServer } from '@bkrptr/typescript-sdk/test';

describe('BkrptrClient', () => {
  let client: BkrptrClient;
  let mockServer: MockServer;

  beforeAll(() => {
    // Start mock server
    mockServer = new MockServer();
    mockServer.start(3001);

    // Create client pointing to mock
    client = new BkrptrClient({
      apiKey: 'bkrptr_test_key',
      baseUrl: 'http://localhost:3001'
    });
  });

  afterAll(() => {
    mockServer.stop();
  });

  describe('analyses', () => {
    it('should create analysis', async () => {
      // Set up mock response
      mockServer.onPost('/analyses').reply(201, {
        id: 'ana_test123',
        status: 'pending',
        // ...
      });

      const analysis = await client.analyses.create({
        book: {
          title: 'Test Book',
          author: 'Test Author'
        }
      });

      expect(analysis.id).toBe('ana_test123');
      expect(analysis.status).toBe('pending');
    });
  });
});
```

### Mock Utilities

```typescript
/**
 * Mock server for testing
 */
export class MockServer {
  private server: Server;
  private routes: Map<string, MockRoute> = new Map();

  onGet(path: string): MockRoute {
    const route = new MockRoute('GET', path);
    this.routes.set(`GET ${path}`, route);
    return route;
  }

  onPost(path: string): MockRoute {
    const route = new MockRoute('POST', path);
    this.routes.set(`POST ${path}`, route);
    return route;
  }

  // ... other methods
}

class MockRoute {
  constructor(
    private method: string,
    private path: string
  ) {}

  reply(status: number, data: any): void {
    // Store response
  }

  replyWithError(status: number, error: any): void {
    // Store error response
  }

  times(n: number): MockRoute {
    // Set expected call count
    return this;
  }
}
```

---

## Migration Guide

### From v0.x to v1.0

```typescript
// Old (v0.x)
const bkrptr = new Bkrptr(apiKey);
const result = await bkrptr.analyzeBook(title, author);

// New (v1.0)
const client = new BkrptrClient(apiKey);
const analysis = await client.analyses.create({
  book: { title, author }
});
```

### From REST API to SDK

```typescript
// Before (direct API calls)
const response = await fetch('https://api.bkrptr.com/v1/analyses', {
  method: 'POST',
  headers: {
    'X-API-Key': apiKey,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    book: { title, author }
  })
});
const analysis = await response.json();

// After (SDK)
const client = new BkrptrClient(apiKey);
const analysis = await client.analyses.create({
  book: { title, author }
});
```

---

## Performance Considerations

### Connection Pooling

```typescript
import { Agent } from 'https';

const client = new BkrptrClient({
  apiKey: process.env.BKRPTR_API_KEY!,
  httpAgent: new Agent({
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 25,
    maxFreeSockets: 5
  })
});
```

### Caching

```typescript
import { LRUCache } from 'lru-cache';

class CachedClient extends BkrptrClient {
  private cache = new LRUCache<string, any>({
    max: 500,
    ttl: 1000 * 60 * 5 // 5 minutes
  });

  async get(id: string): Promise<Analysis> {
    const cacheKey = `analysis:${id}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const analysis = await super.analyses.get(id);
    this.cache.set(cacheKey, analysis);
    return analysis;
  }
}
```

---

## Browser Support

The SDK can be used in browsers with some limitations:

```typescript
// browser.ts
import { BkrptrClient } from '@bkrptr/typescript-sdk/browser';

// Note: API key will be exposed in browser
// Consider using a proxy server for production
const client = new BkrptrClient({
  apiKey: 'bkrptr_live_key', // Use restricted key
  // No httpAgent in browser
});

// CORS must be configured on API
```

---

## Contributing

See [CONTRIBUTING.md](https://github.com/bkrptr/typescript-sdk/blob/main/CONTRIBUTING.md) for development setup and guidelines.

---

## License

MIT License - see [LICENSE](https://github.com/bkrptr/typescript-sdk/blob/main/LICENSE)

---

*End of TypeScript SDK Specification*