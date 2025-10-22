# bkrptr API Integration Guide

## Quick Start Tutorial

### Step 1: Get Your API Key

First, request an API key from the bkrptr admin dashboard or via CLI:

```bash
# Via CLI (if you have admin access)
bkrptr api-key create --name "My Integration" --permissions read,write
```

Your API key will look like:
```
bkrptr_live_k3x9mP2nQ8vR5tY7wA4zB6cD1eF3gH2j_a7c9
```

**Important**: Store this key securely. It won't be shown again!

### Step 2: Make Your First Request

Test your API key with a simple request:

```bash
curl -X GET https://api.bkrptr.com/v1/account \
  -H "X-API-Key: YOUR_API_KEY_HERE"
```

Expected response:
```json
{
  "id": "acc_123abc",
  "email": "user@example.com",
  "plan": "standard",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

### Step 3: Submit Your First Book Analysis

```bash
curl -X POST https://api.bkrptr.com/v1/analyses \
  -H "X-API-Key: YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "book": {
      "title": "Atomic Habits",
      "author": "James Clear"
    },
    "options": {
      "processingMode": "batch"
    }
  }'
```

Response:
```json
{
  "id": "ana_xyz789abc",
  "book": {
    "title": "Atomic Habits",
    "author": "James Clear"
  },
  "status": "pending",
  "submittedAt": "2025-10-19T12:00:00Z",
  "estimatedCompletion": "2025-10-20T12:00:00Z",
  "cost": 0.03
}
```

### Step 4: Check Analysis Status

```bash
curl -X GET https://api.bkrptr.com/v1/analyses/ana_xyz789abc/status \
  -H "X-API-Key: YOUR_API_KEY_HERE"
```

### Step 5: Retrieve Results

Once completed, download the analysis:

```bash
curl -X GET https://api.bkrptr.com/v1/analyses/ana_xyz789abc/documents/madho-summary \
  -H "X-API-Key: YOUR_API_KEY_HERE" \
  -o atomic-habits-summary.md
```

---

## Code Examples

### JavaScript/TypeScript

#### Basic Setup

```typescript
// bkrptr-client.ts
import axios, { AxiosInstance } from 'axios';

class BkrptrClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string, baseURL: string = 'https://api.bkrptr.com/v1') {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL,
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          console.log(`Rate limited. Retry after ${retryAfter} seconds`);
        }
        return Promise.reject(error);
      }
    );
  }

  // Submit analysis
  async createAnalysis(data: AnalysisRequest): Promise<Analysis> {
    const response = await this.client.post('/analyses', data);
    return response.data;
  }

  // Check status
  async getAnalysisStatus(id: string): Promise<AnalysisStatus> {
    const response = await this.client.get(`/analyses/${id}/status`);
    return response.data;
  }

  // Get analysis details
  async getAnalysis(id: string): Promise<Analysis> {
    const response = await this.client.get(`/analyses/${id}`);
    return response.data;
  }

  // Download document
  async getDocument(
    analysisId: string,
    documentType: DocumentType,
    format: DocumentFormat = 'markdown'
  ): Promise<string> {
    const response = await this.client.get(
      `/analyses/${analysisId}/documents/${documentType}`,
      { params: { format } }
    );
    return response.data;
  }

  // List analyses with pagination
  async listAnalyses(params?: ListParams): Promise<AnalysesList> {
    const response = await this.client.get('/analyses', { params });
    return response.data;
  }
}

// Types
interface AnalysisRequest {
  book: {
    title: string;
    author: string;
    isbn?: string;
    genre?: string;
  };
  options?: {
    processingMode?: 'batch' | 'expedited';
    analysisDepth?: 'quick' | 'standard' | 'comprehensive';
    targetAudience?: string;
    additionalContext?: string;
  };
  webhook?: {
    url: string;
    events?: string[];
  };
  idempotencyKey?: string;
}

interface Analysis {
  id: string;
  book: BookInput;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  submittedAt: string;
  completedAt?: string;
  estimatedCompletion: string;
  cost: number;
  documents?: Document[];
}

type DocumentType = 'madho-summary' | 'detailed-analysis' | 'executive-summary' | 'quick-reference';
type DocumentFormat = 'markdown' | 'pdf' | 'docx' | 'html';
```

#### Complete Integration Example

```typescript
// app.ts
import { BkrptrClient } from './bkrptr-client';

const client = new BkrptrClient(process.env.BKRPTR_API_KEY!);

async function analyzeBook(title: string, author: string) {
  try {
    // 1. Submit with idempotency key
    const idempotencyKey = `book-${Buffer.from(`${title}-${author}`).toString('base64')}`;

    const analysis = await client.createAnalysis({
      book: { title, author },
      options: {
        processingMode: 'batch',
        analysisDepth: 'standard',
        targetAudience: 'general',
      },
      webhook: {
        url: 'https://myapp.com/webhooks/bkrptr',
        events: ['analysis.completed', 'analysis.failed'],
      },
      idempotencyKey,
    });

    console.log(`Analysis submitted: ${analysis.id}`);
    console.log(`Estimated completion: ${analysis.estimatedCompletion}`);

    // 2. Poll for completion (if not using webhooks)
    let status = 'pending';
    while (status === 'pending' || status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute

      const result = await client.getAnalysisStatus(analysis.id);
      status = result.status;
      console.log(`Status: ${status} (${result.percentComplete}% complete)`);
    }

    // 3. Retrieve results
    if (status === 'completed') {
      const summary = await client.getDocument(analysis.id, 'madho-summary');
      console.log('Analysis complete! Summary:', summary.substring(0, 500));

      // Download all documents
      const documents = ['madho-summary', 'detailed-analysis', 'executive-summary', 'quick-reference'];
      for (const docType of documents) {
        const content = await client.getDocument(analysis.id, docType as DocumentType);
        // Save to file or process as needed
        await fs.promises.writeFile(`${title}-${docType}.md`, content);
      }
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Run the example
analyzeBook('Atomic Habits', 'James Clear');
```

#### Webhook Handler

```typescript
// webhook-handler.ts
import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

const WEBHOOK_SECRET = process.env.BKRPTR_WEBHOOK_SECRET!;

// Verify webhook signature
function verifyWebhookSignature(
  payload: any,
  signature: string,
  secret: string
): boolean {
  const parts = signature.split(',');
  const timestamp = parts[0].split('=')[1];
  const receivedSig = parts[1].split('=')[1];

  // Check timestamp (prevent replay attacks)
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime - parseInt(timestamp) > 300) {
    throw new Error('Webhook timestamp too old');
  }

  // Verify signature
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${JSON.stringify(payload)}`)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(receivedSig),
    Buffer.from(expectedSig)
  );
}

// Webhook endpoint
app.post('/webhooks/bkrptr', async (req, res) => {
  try {
    // Verify signature
    const signature = req.headers['x-bkrptr-signature'] as string;
    if (!verifyWebhookSignature(req.body, signature, WEBHOOK_SECRET)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Process webhook event
    const event = req.body;
    console.log(`Received event: ${event.type}`);

    switch (event.type) {
      case 'analysis.completed':
        await handleAnalysisCompleted(event.data);
        break;

      case 'analysis.failed':
        await handleAnalysisFailed(event.data);
        break;

      case 'document.generated':
        await handleDocumentGenerated(event.data);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function handleAnalysisCompleted(data: any) {
  console.log(`Analysis ${data.analysisId} completed!`);
  console.log(`Book: ${data.book.title} by ${data.book.author}`);
  console.log(`Processing time: ${data.processingTime} seconds`);
  console.log(`Cost: $${data.cost}`);

  // Download and process documents
  const client = new BkrptrClient(process.env.BKRPTR_API_KEY!);

  for (const doc of data.documents) {
    const content = await client.getDocument(data.analysisId, doc.type);
    // Process the document (save to database, send email, etc.)
    await saveToDatabase(data.analysisId, doc.type, content);
  }
}

async function handleAnalysisFailed(data: any) {
  console.error(`Analysis ${data.analysisId} failed:`, data.error);
  // Notify user, log error, etc.
}

async function handleDocumentGenerated(data: any) {
  console.log(`Document ${data.documentType} generated for ${data.analysisId}`);
  // Process individual document as it's generated
}

app.listen(3000, () => {
  console.log('Webhook handler listening on port 3000');
});
```

### Python

#### Basic Client

```python
# bkrptr_client.py
import requests
import time
import hashlib
import hmac
from typing import Optional, Dict, Any, List
from dataclasses import dataclass
from enum import Enum

class ProcessingMode(Enum):
    BATCH = "batch"
    EXPEDITED = "expedited"

class DocumentType(Enum):
    MADHO_SUMMARY = "madho-summary"
    DETAILED_ANALYSIS = "detailed-analysis"
    EXECUTIVE_SUMMARY = "executive-summary"
    QUICK_REFERENCE = "quick-reference"

@dataclass
class Book:
    title: str
    author: str
    isbn: Optional[str] = None
    genre: Optional[str] = None

class BkrptrClient:
    def __init__(self, api_key: str, base_url: str = "https://api.bkrptr.com/v1"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            "X-API-Key": api_key,
            "Content-Type": "application/json"
        })

    def create_analysis(
        self,
        book: Book,
        processing_mode: ProcessingMode = ProcessingMode.BATCH,
        webhook_url: Optional[str] = None,
        idempotency_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """Submit a book for analysis."""

        payload = {
            "book": {
                "title": book.title,
                "author": book.author
            },
            "options": {
                "processingMode": processing_mode.value
            }
        }

        if book.isbn:
            payload["book"]["isbn"] = book.isbn

        if book.genre:
            payload["book"]["genre"] = book.genre

        if webhook_url:
            payload["webhook"] = {
                "url": webhook_url,
                "events": ["analysis.completed", "analysis.failed"]
            }

        headers = {}
        if idempotency_key:
            headers["X-Idempotency-Key"] = idempotency_key

        response = self.session.post(
            f"{self.base_url}/analyses",
            json=payload,
            headers=headers
        )
        response.raise_for_status()
        return response.json()

    def get_analysis(self, analysis_id: str) -> Dict[str, Any]:
        """Get analysis details."""
        response = self.session.get(f"{self.base_url}/analyses/{analysis_id}")
        response.raise_for_status()
        return response.json()

    def get_analysis_status(self, analysis_id: str) -> Dict[str, Any]:
        """Check analysis status."""
        response = self.session.get(f"{self.base_url}/analyses/{analysis_id}/status")
        response.raise_for_status()
        return response.json()

    def get_document(
        self,
        analysis_id: str,
        document_type: DocumentType,
        format: str = "markdown"
    ) -> str:
        """Download a specific document."""
        response = self.session.get(
            f"{self.base_url}/analyses/{analysis_id}/documents/{document_type.value}",
            params={"format": format}
        )
        response.raise_for_status()
        return response.text

    def list_analyses(
        self,
        status: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> Dict[str, Any]:
        """List analyses with optional filters.

        Args:
            status: Filter by status (queued, processing, completed, failed)
            limit: Number of results per page (default: 50, max: 500)
            offset: Number of results to skip (default: 0)
        """
        params = {"limit": limit, "offset": offset}
        if status:
            params["status"] = status

        response = self.session.get(f"{self.base_url}/analyses", params=params)
        response.raise_for_status()
        return response.json()

    def wait_for_completion(
        self,
        analysis_id: str,
        poll_interval: int = 60,
        max_wait: int = 86400
    ) -> Dict[str, Any]:
        """Poll and wait for analysis completion."""
        start_time = time.time()

        while time.time() - start_time < max_wait:
            status_response = self.get_analysis_status(analysis_id)
            status = status_response["status"]

            if status in ["completed", "failed", "cancelled"]:
                return self.get_analysis(analysis_id)

            print(f"Status: {status} ({status_response.get('percentComplete', 0)}% complete)")
            time.sleep(poll_interval)

        raise TimeoutError(f"Analysis {analysis_id} did not complete within {max_wait} seconds")
```

#### Complete Python Example

```python
# example.py
import os
import asyncio
from bkrptr_client import BkrptrClient, Book, ProcessingMode, DocumentType

def main():
    # Initialize client
    client = BkrptrClient(api_key=os.environ["BKRPTR_API_KEY"])

    # Submit multiple books
    books = [
        Book("Atomic Habits", "James Clear", genre="self-help"),
        Book("The Lean Startup", "Eric Ries", genre="business"),
        Book("Deep Work", "Cal Newport", genre="productivity")
    ]

    analyses = []

    for book in books:
        try:
            # Create idempotency key
            idempotency_key = f"book-{book.title}-{book.author}".replace(" ", "-")

            # Submit analysis
            analysis = client.create_analysis(
                book=book,
                processing_mode=ProcessingMode.BATCH,
                idempotency_key=idempotency_key
            )

            analyses.append(analysis)
            print(f"Submitted: {book.title} - Analysis ID: {analysis['id']}")
            print(f"Estimated completion: {analysis['estimatedCompletion']}")
            print(f"Cost: ${analysis['cost']}")
            print("-" * 50)

        except requests.HTTPError as e:
            print(f"Error submitting {book.title}: {e}")

    # Wait for all analyses to complete
    print("\nWaiting for analyses to complete...")
    completed_analyses = []

    for analysis in analyses:
        try:
            result = client.wait_for_completion(
                analysis["id"],
                poll_interval=300  # Check every 5 minutes
            )
            completed_analyses.append(result)
            print(f"Completed: {result['book']['title']}")

        except TimeoutError as e:
            print(f"Timeout: {e}")

    # Download all documents
    print("\nDownloading documents...")

    for analysis in completed_analyses:
        if analysis["status"] == "completed":
            book_title = analysis["book"]["title"].replace(" ", "_")

            for doc_type in DocumentType:
                try:
                    content = client.get_document(
                        analysis["id"],
                        doc_type
                    )

                    filename = f"{book_title}_{doc_type.value}.md"
                    with open(filename, "w") as f:
                        f.write(content)

                    print(f"Saved: {filename}")

                except Exception as e:
                    print(f"Error downloading {doc_type.value}: {e}")

def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    """Verify webhook signature."""
    parts = signature.split(',')
    timestamp = parts[0].split('=')[1]
    received_sig = parts[1].split('=')[1]

    # Check timestamp
    import time
    current_time = int(time.time())
    if current_time - int(timestamp) > 300:  # 5 minutes
        raise ValueError("Webhook timestamp too old")

    # Verify signature
    expected_sig = hmac.new(
        secret.encode(),
        f"{timestamp}.{payload.decode()}".encode(),
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(received_sig, expected_sig)

# Flask webhook handler example
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhooks/bkrptr', methods=['POST'])
def handle_webhook():
    """Handle bkrptr webhook events."""
    try:
        # Verify signature
        signature = request.headers.get('X-Bkrptr-Signature')
        secret = os.environ.get('BKRPTR_WEBHOOK_SECRET')

        if not verify_webhook_signature(request.data, signature, secret):
            return jsonify({"error": "Invalid signature"}), 401

        # Process event
        event = request.json
        event_type = event.get('type')

        if event_type == 'analysis.completed':
            handle_analysis_completed(event['data'])
        elif event_type == 'analysis.failed':
            handle_analysis_failed(event['data'])

        return jsonify({"received": True}), 200

    except Exception as e:
        print(f"Webhook error: {e}")
        return jsonify({"error": "Internal server error"}), 500

def handle_analysis_completed(data):
    """Process completed analysis."""
    print(f"Analysis completed: {data['analysisId']}")
    print(f"Book: {data['book']['title']}")
    print(f"Processing time: {data['processingTime']} seconds")

    # Download and save documents
    client = BkrptrClient(api_key=os.environ["BKRPTR_API_KEY"])

    for doc in data['documents']:
        content = client.get_document(data['analysisId'], DocumentType(doc['type']))
        # Save to database, send notifications, etc.

def handle_analysis_failed(data):
    """Handle failed analysis."""
    print(f"Analysis failed: {data['analysisId']}")
    print(f"Error: {data.get('error', 'Unknown error')}")
    # Send alert, retry logic, etc.

if __name__ == "__main__":
    main()
```

### cURL Examples

#### Submit Analysis with Webhook

```bash
curl -X POST https://api.bkrptr.com/v1/analyses \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: unique-request-123" \
  -d '{
    "book": {
      "title": "Thinking, Fast and Slow",
      "author": "Daniel Kahneman",
      "genre": "psychology"
    },
    "options": {
      "processingMode": "batch",
      "analysisDepth": "comprehensive",
      "targetAudience": "researchers"
    },
    "webhook": {
      "url": "https://yourapp.com/webhooks/bkrptr",
      "events": ["analysis.completed", "analysis.failed"]
    }
  }'
```

#### List Analyses with Filters

```bash
# Pagination uses limit (default: 50, max: 500) and offset (default: 0)
curl -X GET "https://api.bkrptr.com/v1/analyses?status=completed&limit=100&offset=0" \
  -H "X-API-Key: YOUR_API_KEY"
```

**Query Parameters:**
- `limit` (optional): Number of results per page. Default: 50, Max: 500
- `offset` (optional): Number of results to skip. Default: 0
- `status` (optional): Filter by status (`queued`, `processing`, `completed`, `failed`)

#### Expedite an Analysis

```bash
curl -X POST https://api.bkrptr.com/v1/analyses/ana_xyz789/expedite \
  -H "X-API-Key: YOUR_API_KEY"
```

#### Download All Documents as ZIP

```bash
curl -X GET https://api.bkrptr.com/v1/analyses/ana_xyz789/documents/download?format=markdown \
  -H "X-API-Key: YOUR_API_KEY" \
  -o "analysis-documents.zip"
```

---

## Idempotency Best Practices

### Why Use Idempotency Keys?

Idempotency keys prevent duplicate submissions when network issues cause retries:

```typescript
// Generate unique idempotency key
function generateIdempotencyKey(book: Book): string {
  const data = `${book.title}-${book.author}-${Date.now()}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Use in requests
const idempotencyKey = generateIdempotencyKey(book);

// First attempt
const analysis1 = await client.createAnalysis({
  book,
  idempotencyKey
});

// Network error occurs, client retries...

// Second attempt (returns same response, no duplicate created)
const analysis2 = await client.createAnalysis({
  book,
  idempotencyKey
});

console.log(analysis1.id === analysis2.id); // true
```

### Idempotency Key Guidelines

1. **Uniqueness**: Each logical operation should have a unique key
2. **Persistence**: Store keys for at least 24 hours
3. **Format**: Use UUIDs or hashes of request parameters
4. **Scope**: Keys are scoped to your API key

---

## Testing with Sandbox Mode

### Sandbox Environment

Use the sandbox environment for testing without incurring costs:

```typescript
const client = new BkrptrClient(
  process.env.BKRPTR_SANDBOX_KEY!,
  'https://sandbox-api.bkrptr.com/v1'
);
```

### Sandbox Behavior

| Feature | Sandbox | Production |
|---------|---------|------------|
| API Endpoints | ✓ All available | ✓ All available |
| Processing Time | ~30 seconds | Batch: 24h, Expedited: 9min |
| Cost | $0 | $0.03/$0.06 |
| Documents | Mock data | Real analysis |
| Rate Limits | Higher limits | Standard limits |
| Webhooks | ✓ Fully functional | ✓ Fully functional |

### Test Data

The sandbox provides consistent test responses for specific book titles:

```javascript
// These books return predictable results in sandbox
const testBooks = [
  { title: "Test Success", author: "Test Author" }, // Always succeeds
  { title: "Test Failure", author: "Test Author" }, // Always fails
  { title: "Test Timeout", author: "Test Author" }, // Times out
];
```

---

## Rate Limiting & Retry Strategies

### Understanding Rate Limits

Check response headers to monitor your usage:

```javascript
function handleRateLimit(response: Response) {
  const limit = response.headers.get('X-RateLimit-Limit');
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const reset = response.headers.get('X-RateLimit-Reset');

  console.log(`Rate limit: ${remaining}/${limit}`);

  if (remaining === '0') {
    const resetTime = new Date(parseInt(reset) * 1000);
    console.log(`Rate limit will reset at: ${resetTime}`);
  }

  // Implement backoff when approaching limit
  if (parseInt(remaining) < 10) {
    console.log('Approaching rate limit, slowing down requests...');
    return true; // Signal to add delay
  }

  return false;
}
```

### Exponential Backoff Implementation

```javascript
class ExponentialBackoff {
  constructor(
    private baseDelay: number = 1000,
    private maxDelay: number = 32000,
    private maxAttempts: number = 5
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt < this.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        // Don't retry client errors (except rate limits)
        if (error.response?.status >= 400 &&
            error.response?.status < 500 &&
            error.response?.status !== 429) {
          throw error;
        }

        // Calculate delay with jitter
        const delay = Math.min(
          this.baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
          this.maxDelay
        );

        console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }
}

// Usage
const backoff = new ExponentialBackoff();
const analysis = await backoff.execute(() =>
  client.createAnalysis(analysisRequest)
);
```

---

## Error Handling Patterns

### Comprehensive Error Handler

```typescript
class BkrptrError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    public details?: any,
    public requestId?: string
  ) {
    super(`[${code}] ${details?.message || 'An error occurred'}`);
  }
}

async function handleApiCall<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error.response;

      if (response) {
        const { error: apiError } = response.data;

        throw new BkrptrError(
          apiError.code,
          response.status,
          apiError.details,
          apiError.requestId
        );
      }

      // Network error
      throw new BkrptrError(
        'NETWORK_ERROR',
        0,
        { message: error.message }
      );
    }

    throw error;
  }
}

// Usage with specific error handling
try {
  const analysis = await handleApiCall(() =>
    client.createAnalysis(request)
  );
} catch (error) {
  if (error instanceof BkrptrError) {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        console.error('Validation failed:', error.details);
        // Fix validation issues
        break;

      case 'RATE_LIMIT_EXCEEDED':
        console.log('Rate limited, waiting...');
        await delay(error.details.retryAfter * 1000);
        // Retry
        break;

      case 'INSUFFICIENT_CREDITS':
        console.error('Out of credits');
        // Handle billing
        break;

      default:
        console.error('API Error:', error.message);
    }
  }
}
```

---

## Batch Processing Best Practices

### Efficient Batch Submission

```typescript
async function submitBatch(books: Book[], batchSize: number = 10) {
  const results = [];

  // Process in chunks to avoid rate limits
  for (let i = 0; i < books.length; i += batchSize) {
    const batch = books.slice(i, i + batchSize);

    const promises = batch.map(book =>
      client.createAnalysis({
        book,
        options: { processingMode: 'batch' },
        idempotencyKey: `batch-${Date.now()}-${book.title}`
      }).catch(error => ({
        book,
        error: error.message
      }))
    );

    const batchResults = await Promise.allSettled(promises);
    results.push(...batchResults);

    // Add delay between batches
    if (i + batchSize < books.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Summary
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  console.log(`Submitted ${successful} books successfully, ${failed} failed`);
  return results;
}
```

---

## Integration Checklist

Before going to production, ensure:

### Security
- [ ] API key stored securely (environment variables, secrets manager)
- [ ] Webhook secret configured and verified
- [ ] HTTPS enforced for all communications
- [ ] No sensitive data logged

### Error Handling
- [ ] Retry logic implemented with exponential backoff
- [ ] All error types handled appropriately
- [ ] Timeout handling for long-running operations
- [ ] Graceful degradation when service unavailable

### Performance
- [ ] Connection pooling configured
- [ ] Response caching where appropriate
- [ ] Batch operations for multiple items
- [ ] Rate limit monitoring and throttling

### Monitoring
- [ ] Request/response logging
- [ ] Error tracking and alerting
- [ ] Performance metrics collection
- [ ] Webhook delivery monitoring

### Testing
- [ ] Sandbox environment tested
- [ ] Idempotency verified
- [ ] Webhook signature verification tested
- [ ] Error scenarios handled

---

## Support Resources

- **API Documentation**: https://docs.bkrptr.com
- **OpenAPI Spec**: https://api.bkrptr.com/v1/openapi.yaml
- **Status Page**: https://status.bkrptr.com
- **Support Email**: api@bkrptr.com
- **GitHub Examples**: https://github.com/bkrptr/api-examples

---

*End of Integration Guide*