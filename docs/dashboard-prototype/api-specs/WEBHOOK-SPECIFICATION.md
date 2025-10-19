# bkrptr Webhook Specification

## Overview

bkrptr webhooks provide real-time notifications when events occur in your account. Instead of polling for status updates, you can receive HTTP POST requests to your specified endpoint when analyses complete, fail, or when documents are generated.

## Quick Start

### 1. Register a Webhook Endpoint

```bash
curl -X POST https://api.bkrptr.com/v1/webhooks \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://yourapp.com/webhooks/bkrptr",
    "events": ["analysis.completed", "analysis.failed"],
    "secret": "your-webhook-secret-min-16-chars"
  }'
```

### 2. Handle Webhook Events

```javascript
app.post('/webhooks/bkrptr', (req, res) => {
  // Verify signature (important!)
  const signature = req.headers['x-bkrptr-signature'];
  if (!verifySignature(req.body, signature, SECRET)) {
    return res.status(401).send('Invalid signature');
  }

  // Process event
  const event = req.body;
  console.log(`Received ${event.type} event`);

  // Always respond quickly
  res.status(200).json({ received: true });

  // Process asynchronously
  processWebhookEvent(event);
});
```

---

## Event Types Catalog

### Analysis Events

#### `analysis.started`
Fired when an analysis begins processing.

```json
{
  "id": "evt_1a2b3c4d5e",
  "type": "analysis.started",
  "created": 1698765432,
  "data": {
    "analysisId": "ana_xyz789abc",
    "book": {
      "title": "Atomic Habits",
      "author": "James Clear",
      "isbn": "9780735211292",
      "genre": "self-help"
    },
    "processingMode": "batch",
    "startedAt": "2025-10-19T12:00:00Z",
    "estimatedCompletion": "2025-10-20T12:00:00Z"
  }
}
```

#### `analysis.completed`
Fired when an analysis successfully completes.

```json
{
  "id": "evt_2b3c4d5e6f",
  "type": "analysis.completed",
  "created": 1698851832,
  "data": {
    "analysisId": "ana_xyz789abc",
    "book": {
      "title": "Atomic Habits",
      "author": "James Clear",
      "isbn": "9780735211292",
      "genre": "self-help"
    },
    "status": "completed",
    "processingMode": "batch",
    "submittedAt": "2025-10-19T12:00:00Z",
    "completedAt": "2025-10-20T11:45:00Z",
    "processingTime": 85500,
    "cost": 0.03,
    "documents": [
      {
        "type": "madho-summary",
        "url": "https://api.bkrptr.com/v1/analyses/ana_xyz789abc/documents/madho-summary",
        "size": 6400,
        "format": "markdown"
      },
      {
        "type": "detailed-analysis",
        "url": "https://api.bkrptr.com/v1/analyses/ana_xyz789abc/documents/detailed-analysis",
        "size": 15200,
        "format": "markdown"
      },
      {
        "type": "executive-summary",
        "url": "https://api.bkrptr.com/v1/analyses/ana_xyz789abc/documents/executive-summary",
        "size": 3200,
        "format": "markdown"
      },
      {
        "type": "quick-reference",
        "url": "https://api.bkrptr.com/v1/analyses/ana_xyz789abc/documents/quick-reference",
        "size": 2100,
        "format": "markdown"
      }
    ]
  }
}
```

#### `analysis.failed`
Fired when an analysis fails to complete.

```json
{
  "id": "evt_3c4d5e6f7g",
  "type": "analysis.failed",
  "created": 1698765932,
  "data": {
    "analysisId": "ana_xyz789abc",
    "book": {
      "title": "Unknown Book",
      "author": "Unknown Author"
    },
    "status": "failed",
    "submittedAt": "2025-10-19T12:00:00Z",
    "failedAt": "2025-10-19T12:05:00Z",
    "error": {
      "code": "PROCESSING_ERROR",
      "message": "Failed to process book content",
      "details": {
        "reason": "Book content not accessible",
        "retryable": true
      }
    },
    "cost": 0.00
  }
}
```

#### `analysis.cancelled`
Fired when an analysis is cancelled by user request.

```json
{
  "id": "evt_4d5e6f7g8h",
  "type": "analysis.cancelled",
  "created": 1698765632,
  "data": {
    "analysisId": "ana_xyz789abc",
    "book": {
      "title": "Sample Book",
      "author": "Sample Author"
    },
    "status": "cancelled",
    "submittedAt": "2025-10-19T12:00:00Z",
    "cancelledAt": "2025-10-19T12:30:00Z",
    "reason": "User requested cancellation",
    "refunded": true,
    "refundAmount": 0.03
  }
}
```

### Document Events

#### `document.generated`
Fired when an individual document is generated (useful for streaming results).

```json
{
  "id": "evt_5e6f7g8h9i",
  "type": "document.generated",
  "created": 1698766432,
  "data": {
    "analysisId": "ana_xyz789abc",
    "documentType": "madho-summary",
    "url": "https://api.bkrptr.com/v1/analyses/ana_xyz789abc/documents/madho-summary",
    "size": 6400,
    "format": "markdown",
    "generatedAt": "2025-10-19T12:15:00Z",
    "checksum": "sha256:abc123def456..."
  }
}
```

#### `document.ready`
Fired when all documents for an analysis are ready.

```json
{
  "id": "evt_6f7g8h9i0j",
  "type": "document.ready",
  "created": 1698767432,
  "data": {
    "analysisId": "ana_xyz789abc",
    "documentsCount": 4,
    "totalSize": 26900,
    "documents": [
      "madho-summary",
      "detailed-analysis",
      "executive-summary",
      "quick-reference"
    ],
    "downloadUrl": "https://api.bkrptr.com/v1/analyses/ana_xyz789abc/documents/download",
    "expiresAt": "2025-10-26T12:00:00Z"
  }
}
```

### Processing Events

#### `processing.expedited`
Fired when a batch analysis is upgraded to expedited processing.

```json
{
  "id": "evt_7g8h9i0j1k",
  "type": "processing.expedited",
  "created": 1698765732,
  "data": {
    "analysisId": "ana_xyz789abc",
    "previousMode": "batch",
    "newMode": "expedited",
    "additionalCost": 0.03,
    "previousEstimation": "2025-10-20T12:00:00Z",
    "newEstimation": "2025-10-19T12:09:00Z",
    "upgradedAt": "2025-10-19T12:01:00Z"
  }
}
```

#### `processing.queued`
Fired when an analysis enters the processing queue.

```json
{
  "id": "evt_8h9i0j1k2l",
  "type": "processing.queued",
  "created": 1698765532,
  "data": {
    "analysisId": "ana_xyz789abc",
    "queuePosition": 42,
    "estimatedStartTime": "2025-10-19T13:00:00Z",
    "processingMode": "batch"
  }
}
```

---

## Payload Structure

### Standard Event Envelope

All webhook events follow this structure:

```typescript
interface WebhookEvent {
  id: string;           // Unique event identifier
  type: string;         // Event type (e.g., "analysis.completed")
  created: number;      // Unix timestamp
  data: object;         // Event-specific data
  metadata?: {          // Optional metadata
    apiVersion: string;
    retryCount?: number;
    originalEventId?: string;  // For retried events
  };
}
```

### Common Data Fields

Most events include these common fields in the `data` object:

```typescript
interface CommonEventData {
  analysisId: string;
  book: {
    title: string;
    author: string;
    isbn?: string;
    genre?: string;
  };
  timestamp: string;  // ISO 8601 format
}
```

---

## Signature Verification

### Algorithm

bkrptr uses HMAC-SHA256 signatures to verify webhook authenticity.

### Signature Format

```
X-Bkrptr-Signature: t=1698765432,v1=5257a869e7ecb5a2d949f0d29c9c424b4a1a8c7b6e5d4c3b2a1
```

Components:
- `t`: Unix timestamp when signature was generated
- `v1`: Version 1 signature (HMAC-SHA256)

### Verification Process

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(
  payload,        // Raw request body (Buffer or string)
  signature,      // X-Bkrptr-Signature header value
  secret         // Your webhook secret
) {
  // Parse signature header
  const elements = signature.split(',');
  const timestamp = elements.find(e => e.startsWith('t='))?.split('=')[1];
  const receivedSig = elements.find(e => e.startsWith('v1='))?.split('=')[1];

  if (!timestamp || !receivedSig) {
    throw new Error('Invalid signature format');
  }

  // Prevent replay attacks (5-minute window)
  const currentTime = Math.floor(Date.now() / 1000);
  const tolerance = 300; // 5 minutes

  if (currentTime - parseInt(timestamp) > tolerance) {
    throw new Error('Webhook timestamp is too old');
  }

  // Compute expected signature
  const signedPayload = `${timestamp}.${payload}`;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  // Compare signatures (timing-safe)
  const valid = crypto.timingSafeEqual(
    Buffer.from(receivedSig),
    Buffer.from(expectedSig)
  );

  if (!valid) {
    throw new Error('Invalid signature');
  }

  return true;
}
```

### Implementation Examples

#### Node.js/Express

```javascript
const express = require('express');
const app = express();

// Important: Get raw body for signature verification
app.use(express.raw({ type: 'application/json' }));

app.post('/webhooks/bkrptr', (req, res) => {
  const signature = req.headers['x-bkrptr-signature'];

  try {
    // Verify signature using raw body
    verifyWebhookSignature(req.body, signature, process.env.WEBHOOK_SECRET);

    // Parse JSON after verification
    const event = JSON.parse(req.body);

    // Process event
    console.log(`Received ${event.type} event`);

    // Respond immediately
    res.status(200).json({ received: true });

    // Process asynchronously
    setImmediate(() => processEvent(event));

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(401).json({ error: 'Invalid signature' });
  }
});
```

#### Python/Flask

```python
from flask import Flask, request, jsonify
import hashlib
import hmac
import time
import json

app = Flask(__name__)

def verify_webhook_signature(payload, signature, secret):
    """Verify webhook signature."""
    # Parse signature
    elements = signature.split(',')
    timestamp = None
    received_sig = None

    for element in elements:
        if element.startswith('t='):
            timestamp = element.split('=')[1]
        elif element.startswith('v1='):
            received_sig = element.split('=')[1]

    if not timestamp or not received_sig:
        raise ValueError('Invalid signature format')

    # Check timestamp
    current_time = int(time.time())
    if current_time - int(timestamp) > 300:  # 5 minutes
        raise ValueError('Webhook timestamp is too old')

    # Compute expected signature
    signed_payload = f"{timestamp}.{payload}"
    expected_sig = hmac.new(
        secret.encode(),
        signed_payload.encode(),
        hashlib.sha256
    ).hexdigest()

    # Compare signatures
    if not hmac.compare_digest(received_sig, expected_sig):
        raise ValueError('Invalid signature')

    return True

@app.route('/webhooks/bkrptr', methods=['POST'])
def webhook_handler():
    signature = request.headers.get('X-Bkrptr-Signature')
    secret = os.environ.get('WEBHOOK_SECRET')

    try:
        # Get raw body for signature verification
        raw_body = request.get_data(as_text=True)

        # Verify signature
        verify_webhook_signature(raw_body, signature, secret)

        # Parse event
        event = json.loads(raw_body)

        # Process event
        print(f"Received {event['type']} event")

        # Respond immediately
        response = jsonify({'received': True})

        # Process asynchronously (use task queue in production)
        threading.Thread(target=process_event, args=(event,)).start()

        return response, 200

    except Exception as e:
        print(f"Webhook error: {e}")
        return jsonify({'error': str(e)}), 401
```

---

## Retry Logic

### Retry Schedule

bkrptr will retry failed webhook deliveries with exponential backoff:

| Attempt | Delay | Cumulative Time |
|---------|-------|-----------------|
| 1 | Immediate | 0 seconds |
| 2 | 1 second | 1 second |
| 3 | 2 seconds | 3 seconds |
| 4 | 4 seconds | 7 seconds |
| 5 | 8 seconds | 15 seconds |
| 6 | 16 seconds | 31 seconds |
| 7 | 32 seconds | 1 minute 3 seconds |
| 8 | 64 seconds | 2 minutes 7 seconds |
| 9 | 128 seconds | 4 minutes 15 seconds |
| 10 | 256 seconds | 8 minutes 31 seconds |

After 10 failed attempts, the webhook is marked as failed and no further retries are attempted.

### Retry Headers

Failed webhooks include retry information:

```http
X-Bkrptr-Delivery-Attempt: 3
X-Bkrptr-Original-Event-Id: evt_original123
X-Bkrptr-Original-Timestamp: 1698765432
```

### Handling Retries

```javascript
app.post('/webhooks/bkrptr', async (req, res) => {
  const eventId = req.body.id;
  const attemptNumber = req.headers['x-bkrptr-delivery-attempt'] || '1';

  // Check if we've already processed this event (idempotency)
  if (await isEventProcessed(eventId)) {
    console.log(`Event ${eventId} already processed, skipping`);
    return res.status(200).json({ received: true, duplicate: true });
  }

  try {
    // Process event
    await processEvent(req.body);

    // Mark as processed
    await markEventProcessed(eventId);

    res.status(200).json({ received: true });

  } catch (error) {
    console.error(`Failed to process event (attempt ${attemptNumber}):`, error);

    // Return 500 to trigger retry
    res.status(500).json({ error: 'Processing failed', retry: true });
  }
});
```

---

## Best Practices

### 1. Respond Quickly

Webhook endpoints must respond within 10 seconds. Process events asynchronously:

```javascript
app.post('/webhooks/bkrptr', (req, res) => {
  // Validate and respond immediately
  if (!isValidSignature(req)) {
    return res.status(401).send();
  }

  // Respond with 200 OK
  res.status(200).json({ received: true });

  // Queue for async processing
  eventQueue.push(req.body);
});
```

### 2. Implement Idempotency

Prevent duplicate processing:

```javascript
const processedEvents = new Set();

async function processEvent(event) {
  // Check if already processed
  if (processedEvents.has(event.id)) {
    console.log(`Duplicate event ${event.id}, skipping`);
    return;
  }

  // Process event
  await handleEvent(event);

  // Mark as processed
  processedEvents.add(event.id);

  // In production, use persistent storage
  await redis.set(`processed:${event.id}`, '1', 'EX', 86400);
}
```

### 3. Handle Out-of-Order Events

Events may arrive out of order. Check timestamps:

```javascript
async function handleAnalysisEvent(event) {
  const analysisId = event.data.analysisId;

  // Get current state
  const currentState = await getAnalysisState(analysisId);

  // Check if this event is newer
  if (event.created <= currentState.lastEventTimestamp) {
    console.log('Received out-of-order event, ignoring');
    return;
  }

  // Process event
  await updateAnalysisState(analysisId, event);
}
```

### 4. Secure Your Endpoint

```javascript
const security = {
  // 1. Always verify signatures
  verifySignature: true,

  // 2. Use HTTPS only
  enforceHttps: true,

  // 3. Whitelist bkrptr IPs (optional)
  allowedIps: [
    '54.231.0.0/16',    // AWS CloudFront
    '52.84.0.0/15',     // AWS CloudFront
    '13.32.0.0/15'      // AWS CloudFront
  ],

  // 4. Rate limit webhook endpoint
  rateLimit: {
    windowMs: 60000,    // 1 minute
    max: 100            // 100 requests per minute
  }
};
```

### 5. Monitor Webhook Health

```javascript
class WebhookMonitor {
  constructor() {
    this.metrics = {
      received: 0,
      processed: 0,
      failed: 0,
      duplicates: 0,
      signatureFailures: 0
    };
  }

  recordEvent(type, success) {
    this.metrics.received++;

    if (success) {
      this.metrics.processed++;
    } else {
      this.metrics.failed++;
    }

    // Alert if failure rate is high
    const failureRate = this.metrics.failed / this.metrics.received;
    if (failureRate > 0.05) { // 5% failure rate
      this.sendAlert('High webhook failure rate', failureRate);
    }
  }

  getHealthStatus() {
    return {
      healthy: this.metrics.failed / this.metrics.received < 0.05,
      metrics: this.metrics,
      lastCheck: new Date().toISOString()
    };
  }
}
```

---

## Testing Webhooks

### Test Endpoint

Send a test event to verify your webhook is working:

```bash
curl -X POST https://api.bkrptr.com/v1/webhooks/{webhookId}/test \
  -H "X-API-Key: YOUR_API_KEY"
```

Response:
```json
{
  "success": true,
  "statusCode": 200,
  "responseTime": 145,
  "body": "{\"received\":true}",
  "headers": {
    "content-type": "application/json"
  }
}
```

### Local Testing with ngrok

Test webhooks locally using ngrok:

```bash
# 1. Start your local server
npm run dev  # Runs on port 3000

# 2. Create tunnel
ngrok http 3000

# 3. Register webhook with ngrok URL
curl -X POST https://api.bkrptr.com/v1/webhooks \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "url": "https://abc123.ngrok.io/webhooks/bkrptr",
    "events": ["analysis.completed"]
  }'
```

### Webhook Testing Tool

```javascript
// webhook-tester.js
const express = require('express');
const crypto = require('crypto');

class WebhookTester {
  constructor(secret) {
    this.secret = secret;
    this.app = express();
    this.events = [];
    this.setupRoutes();
  }

  setupRoutes() {
    this.app.use(express.raw({ type: 'application/json' }));

    this.app.post('/webhook', (req, res) => {
      const signature = req.headers['x-bkrptr-signature'];

      try {
        // Verify signature
        this.verifySignature(req.body, signature);

        // Parse and store event
        const event = JSON.parse(req.body);
        this.events.push({
          id: event.id,
          type: event.type,
          receivedAt: new Date().toISOString(),
          data: event.data
        });

        console.log(`✓ Received ${event.type} event`);
        res.status(200).json({ received: true });

      } catch (error) {
        console.error(`✗ Webhook error: ${error.message}`);
        res.status(401).json({ error: error.message });
      }
    });

    this.app.get('/events', (req, res) => {
      res.json({
        count: this.events.length,
        events: this.events
      });
    });
  }

  verifySignature(payload, signature) {
    // Implementation from earlier
    // ...
  }

  start(port = 3000) {
    this.app.listen(port, () => {
      console.log(`Webhook tester listening on port ${port}`);
      console.log(`Endpoint: http://localhost:${port}/webhook`);
      console.log(`Events: http://localhost:${port}/events`);
    });
  }

  // Generate mock event for testing
  generateMockEvent(type) {
    const event = {
      id: `evt_test_${Date.now()}`,
      type: type,
      created: Math.floor(Date.now() / 1000),
      data: this.getMockData(type)
    };

    // Generate signature
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(`${timestamp}.${JSON.stringify(event)}`)
      .digest('hex');

    return {
      event,
      signature: `t=${timestamp},v1=${signature}`
    };
  }

  getMockData(type) {
    const mockData = {
      'analysis.completed': {
        analysisId: 'ana_test123',
        book: {
          title: 'Test Book',
          author: 'Test Author'
        },
        status: 'completed',
        processingTime: 500,
        cost: 0.03,
        documents: [
          {
            type: 'madho-summary',
            url: 'https://api.bkrptr.com/test',
            size: 1000
          }
        ]
      },
      'analysis.failed': {
        analysisId: 'ana_test456',
        book: {
          title: 'Failed Book',
          author: 'Test Author'
        },
        status: 'failed',
        error: {
          code: 'TEST_ERROR',
          message: 'This is a test error'
        }
      }
    };

    return mockData[type] || {};
  }
}

// Usage
const tester = new WebhookTester('test-webhook-secret');
tester.start();

// Test with mock event
const { event, signature } = tester.generateMockEvent('analysis.completed');
// Send to your endpoint with signature header
```

---

## Troubleshooting

### Common Issues

#### 1. Signature Verification Fails

**Symptoms**: 401 responses, "Invalid signature" errors

**Solutions**:
- Ensure you're using the raw request body (not parsed JSON)
- Check the webhook secret matches exactly
- Verify timestamp is within 5-minute window
- Use timing-safe comparison for signatures

#### 2. Events Not Received

**Symptoms**: No webhook calls despite completed analyses

**Solutions**:
- Verify webhook is active: `GET /v1/webhooks`
- Check URL is accessible from internet
- Ensure HTTPS is working correctly
- Review firewall/security group settings

#### 3. Duplicate Events

**Symptoms**: Same event processed multiple times

**Solutions**:
- Implement idempotency using event ID
- Store processed events in persistent storage
- Return 200 OK for already-processed events

#### 4. Out-of-Order Events

**Symptoms**: Events arrive in wrong sequence

**Solutions**:
- Use event timestamps for ordering
- Store state with version/timestamp
- Handle each event type independently

### Debug Headers

Enable debug mode for additional headers:

```bash
curl -X POST https://api.bkrptr.com/v1/webhooks \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "url": "https://yourapp.com/webhooks/bkrptr",
    "events": ["analysis.completed"],
    "debug": true
  }'
```

Debug headers included:
```http
X-Bkrptr-Debug: true
X-Bkrptr-Event-Queue-Size: 42
X-Bkrptr-Processing-Latency: 145ms
X-Bkrptr-Retry-Count: 0
```

---

## Webhook Management API

### List Webhooks

```bash
curl -X GET https://api.bkrptr.com/v1/webhooks \
  -H "X-API-Key: YOUR_API_KEY"
```

### Update Webhook

```bash
curl -X PUT https://api.bkrptr.com/v1/webhooks/{webhookId} \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["analysis.completed", "analysis.failed", "document.ready"],
    "active": true
  }'
```

### Pause/Resume Webhook

```bash
# Pause
curl -X PUT https://api.bkrptr.com/v1/webhooks/{webhookId} \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"active": false}'

# Resume
curl -X PUT https://api.bkrptr.com/v1/webhooks/{webhookId} \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"active": true}'
```

### Delete Webhook

```bash
curl -X DELETE https://api.bkrptr.com/v1/webhooks/{webhookId} \
  -H "X-API-Key: YOUR_API_KEY"
```

---

## Migration Guide

### Migrating from Polling to Webhooks

#### Before (Polling):

```javascript
// Inefficient polling approach
async function pollForCompletion(analysisId) {
  while (true) {
    const status = await checkStatus(analysisId);

    if (status === 'completed' || status === 'failed') {
      return await getAnalysis(analysisId);
    }

    await sleep(60000); // Wait 1 minute
  }
}
```

#### After (Webhooks):

```javascript
// Efficient webhook approach
app.post('/webhooks/bkrptr', async (req, res) => {
  const event = req.body;

  if (event.type === 'analysis.completed') {
    // Process immediately when ready
    await processCompletedAnalysis(event.data);
  }

  res.status(200).json({ received: true });
});

// Submit with webhook
async function submitAnalysis(book) {
  return await client.createAnalysis({
    book,
    webhook: {
      url: 'https://myapp.com/webhooks/bkrptr',
      events: ['analysis.completed', 'analysis.failed']
    }
  });
}
```

### Benefits of Migration:
- **Reduced API calls**: No polling needed
- **Lower latency**: Immediate notifications
- **Better reliability**: Automatic retries
- **Cost savings**: Fewer requests = lower costs

---

## Appendix: Event Type Reference

| Event Type | When Triggered | Retry on Failure | Contains Documents |
|------------|---------------|------------------|-------------------|
| `analysis.started` | Processing begins | Yes | No |
| `analysis.completed` | Successfully completed | Yes | Yes |
| `analysis.failed` | Processing failed | Yes | No |
| `analysis.cancelled` | User cancelled | No | No |
| `document.generated` | Each document ready | Yes | Partial |
| `document.ready` | All documents ready | Yes | Yes |
| `processing.expedited` | Upgraded to expedited | No | No |
| `processing.queued` | Entered queue | No | No |

---

*End of Webhook Specification*