# API Documentation Plan - bkrptr

## Documentation Architecture

### 1. Documentation Site Structure

```
docs.bkrptr.io/
├── index.html                    # Landing page with quick links
├── getting-started/
│   ├── quickstart.md             # 5-minute integration guide
│   ├── authentication.md         # API key setup and usage
│   ├── first-request.md          # Hello World example
│   └── postman-collection.json   # Importable collection
│
├── api-reference/
│   ├── overview.md               # REST principles, base URL, versioning
│   ├── authentication.md         # Detailed auth documentation
│   ├── rate-limiting.md          # Rate limit rules and headers
│   ├── errors.md                 # Error codes and handling
│   ├── pagination.md             # Cursor-based pagination
│   │
│   ├── endpoints/
│   │   ├── books.md              # Books endpoints
│   │   ├── batches.md            # Batch operations
│   │   ├── usage.md              # Usage and billing
│   │   └── webhooks.md           # Webhook configuration
│   │
│   └── schemas/
│       ├── book.md               # Book object schema
│       ├── analysis.md           # Analysis result schema
│       └── batch.md              # Batch object schema
│
├── sdks/
│   ├── nodejs.md                 # Node.js SDK documentation
│   ├── python.md                 # Python SDK documentation
│   ├── go.md                     # Go SDK documentation
│   └── examples/
│       ├── nodejs/               # Node.js code examples
│       ├── python/               # Python code examples
│       └── go/                   # Go code examples
│
├── guides/
│   ├── batch-processing.md       # When and how to use batches
│   ├── cost-optimization.md      # Best practices for cost savings
│   ├── webhook-integration.md    # Setting up webhooks
│   ├── error-handling.md         # Robust error handling
│   ├── migration-guide.md        # Migrating from CLI to API
│   └── best-practices.md         # API best practices
│
├── use-cases/
│   ├── learning-platform.md      # LMS integration example
│   ├── research-tool.md          # Academic research workflow
│   ├── corporate-training.md     # Enterprise training system
│   └── personal-library.md       # Individual user workflow
│
├── api-explorer/                  # Interactive API testing
│   └── swagger-ui.html           # Swagger UI interface
│
└── support/
    ├── faq.md                    # Frequently asked questions
    ├── changelog.md              # API version history
    ├── status.md                 # Service status page
    ├── contact.md                # Support contact info
    └── sla.md                    # Service level agreement
```

---

## 2. OpenAPI Specification

### OpenAPI 3.0 Structure

```yaml
openapi: 3.0.0
info:
  title: bkrptr API
  version: 1.0.0
  description: Transform books into actionable AI-powered analyses
  contact:
    email: api@bkrptr.io
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.bkrptr.io/v1
    description: Production server
  - url: https://sandbox.api.bkrptr.io/v1
    description: Sandbox server

security:
  - ApiKeyAuth: []

components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key

  schemas:
    Book:
      type: object
      required:
        - title
        - author
      properties:
        id:
          type: string
          format: uuid
          example: "550e8400-e29b-41d4-a716-446655440000"
        title:
          type: string
          example: "The Lean Startup"
        author:
          type: string
          example: "Eric Ries"
        isbn:
          type: string
          pattern: '^(97[89])?[0-9]{10}$'
        genre:
          type: string
          enum: [business, technology, fiction, non-fiction, ...]
        processingMode:
          type: string
          enum: [batch, expedited]
          default: batch

    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string
            details:
              type: object

paths:
  /books:
    post:
      summary: Submit a book for analysis
      operationId: createBook
      tags:
        - Books
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Book'
      responses:
        '201':
          description: Book successfully queued
        '400':
          description: Invalid request
        '401':
          description: Unauthorized
        '429':
          description: Rate limit exceeded
```

---

## 3. Documentation Content Templates

### 3.1 Endpoint Documentation Template

```markdown
# [Endpoint Name]

[Brief description of what this endpoint does]

## Endpoint

```http
[METHOD] /api/v1/[path]
```

## Authentication

This endpoint requires an API key with `[permission]` permission.

## Request

### Headers

| Name | Required | Description |
|------|----------|-------------|
| X-API-Key | Yes | Your API key |
| Content-Type | Yes | Must be `application/json` |

### Parameters

#### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | The book ID |

#### Query Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 25 | Results per page |

### Request Body

```json
{
  "title": "string",
  "author": "string",
  "processingMode": "batch"
}
```

## Response

### Success Response (200 OK)

```json
{
  "bookId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "estimatedCompletion": "2025-10-19T15:30:00Z"
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required field: title"
  }
}
```

## Examples

### cURL

```bash
curl -X POST https://api.bkrptr.io/v1/books \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"title":"The Lean Startup","author":"Eric Ries"}'
```

### Node.js

```javascript
const response = await fetch('https://api.bkrptr.io/v1/books', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'The Lean Startup',
    author: 'Eric Ries'
  })
});
```

### Python

```python
import requests

response = requests.post(
    'https://api.bkrptr.io/v1/books',
    headers={
        'X-API-Key': 'your_api_key',
        'Content-Type': 'application/json'
    },
    json={
        'title': 'The Lean Startup',
        'author': 'Eric Ries'
    }
)
```

## Rate Limiting

This endpoint is subject to rate limiting. See [Rate Limiting](/api-reference/rate-limiting) for details.

## Related Endpoints

- [GET /books/{id}](/api-reference/endpoints/books#get-book) - Check book status
- [GET /books/{id}/results](/api-reference/endpoints/books#get-results) - Retrieve analysis

```

---

## 4. Interactive Features

### 4.1 API Explorer Components

```javascript
// Swagger UI Configuration
const swaggerConfig = {
  url: '/openapi.yaml',
  dom_id: '#swagger-ui',
  presets: [
    SwaggerUIBundle.presets.apis,
    SwaggerUIStandalonePreset
  ],
  layout: 'BaseLayout',
  requestInterceptor: (request) => {
    // Add API key from user session
    if (userApiKey) {
      request.headers['X-API-Key'] = userApiKey;
    }
    return request;
  },
  onComplete: () => {
    // Add "Try it out" analytics
    trackApiExplorerUsage();
  }
};
```

### 4.2 Code Generation Features

```yaml
# Code generation config
generators:
  - language: javascript
    framework: axios
    output: ./examples/javascript/
  - language: python
    framework: requests
    output: ./examples/python/
  - language: go
    framework: net/http
    output: ./examples/go/
  - language: curl
    output: ./examples/curl/
```

---

## 5. Documentation Automation

### 5.1 API Change Detection

```yaml
# GitHub Action for API documentation
name: Update API Documentation

on:
  push:
    paths:
      - 'src/api/**'
      - 'openapi.yaml'

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Validate OpenAPI Spec
        run: npx @apidevtools/swagger-cli validate openapi.yaml

      - name: Generate Documentation
        run: npx @redocly/openapi-cli build-docs openapi.yaml

      - name: Generate SDK Code Samples
        run: npx openapi-generator-cli generate

      - name: Deploy to Documentation Site
        run: |
          npm run build:docs
          aws s3 sync ./dist/docs s3://docs.bkrptr.io
```

### 5.2 Postman Collection Generation

```javascript
// Generate Postman collection from OpenAPI
const converter = require('openapi-to-postmanv2');
const fs = require('fs');

const openapiData = fs.readFileSync('openapi.yaml', 'utf8');

converter.convert({
  type: 'string',
  data: openapiData
}, {}, (err, result) => {
  if (!err && result.result) {
    fs.writeFileSync(
      'postman-collection.json',
      JSON.stringify(result.output[0].data)
    );
  }
});
```

---

## 6. SDK Documentation Template

### 6.1 SDK README Structure

```markdown
# bkrptr Node.js SDK

Official Node.js SDK for the bkrptr API.

## Installation

```bash
npm install @bkrptr/node-sdk
```

## Quick Start

```javascript
const Bkrptr = require('@bkrptr/node-sdk');

const client = new Bkrptr({
  apiKey: 'your_api_key_here'
});

// Submit a book
const book = await client.books.create({
  title: 'The Lean Startup',
  author: 'Eric Ries',
  processingMode: 'batch'
});

// Check status
const status = await client.books.get(book.id);

// Get results
if (status.status === 'completed') {
  const analysis = await client.books.getResults(book.id);
}
```

## Configuration

```javascript
const client = new Bkrptr({
  apiKey: process.env.BKRPTR_API_KEY,
  baseUrl: 'https://api.bkrptr.io/v1',
  timeout: 30000,
  maxRetries: 3,
  retryDelay: 1000
});
```

## Error Handling

```javascript
try {
  const book = await client.books.create({...});
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    // Wait and retry
    await sleep(error.retryAfter * 1000);
  } else if (error.code === 'INVALID_REQUEST') {
    // Handle validation error
    console.error(error.message);
  }
}
```

## Methods

### Books

- `client.books.create(data)` - Submit a book
- `client.books.get(id)` - Get book status
- `client.books.list(params)` - List all books
- `client.books.getResults(id)` - Get analysis
- `client.books.expedite(id)` - Expedite processing

### Batches

- `client.batches.create(books)` - Submit batch
- `client.batches.get(id)` - Get batch status
- `client.batches.list()` - List batches

## Examples

See the [examples directory](./examples) for more detailed examples.

## Support

- [API Documentation](https://docs.bkrptr.io)
- [GitHub Issues](https://github.com/bkrptr/node-sdk/issues)
- [Email Support](mailto:api@bkrptr.io)
```

---

## 7. Documentation Metrics

### 7.1 Analytics to Track

```javascript
// Documentation analytics events
const documentationMetrics = {
  // Page views
  'doc.page.view': {
    page: string,
    referrer: string,
    userType: 'anonymous' | 'authenticated'
  },

  // API Explorer usage
  'api.explorer.try': {
    endpoint: string,
    method: string,
    success: boolean
  },

  // Code sample interactions
  'code.sample.copy': {
    language: string,
    endpoint: string
  },

  // Search behavior
  'doc.search': {
    query: string,
    resultsFound: number,
    clickedResult: string
  },

  // Support interactions
  'support.feedback': {
    helpful: boolean,
    page: string,
    comment: string
  }
};
```

### 7.2 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to First API Call | < 30 minutes | From key generation to first request |
| Documentation Completeness | 100% | All endpoints documented |
| Code Sample Coverage | 100% | Every endpoint has examples |
| Search Success Rate | > 80% | Users find what they're looking for |
| Support Ticket Reduction | 50% | Fewer docs-related tickets |

---

## 8. Documentation Maintenance

### 8.1 Review Schedule

- **Weekly**: Check for broken links, outdated examples
- **Monthly**: Review analytics, update FAQs
- **Quarterly**: Full documentation audit
- **Per Release**: Update for API changes

### 8.2 Documentation Checklist

For each new API feature:

- [ ] OpenAPI spec updated
- [ ] Endpoint documentation written
- [ ] Code samples created (3+ languages)
- [ ] Error responses documented
- [ ] Rate limits specified
- [ ] Postman collection updated
- [ ] SDK methods added
- [ ] Migration guide updated (if breaking)
- [ ] Changelog entry added
- [ ] Interactive examples work
- [ ] Search index updated

---

## 9. Developer Experience Enhancements

### 9.1 Quick Start Wizard

```javascript
// Interactive onboarding flow
const OnboardingWizard = {
  steps: [
    {
      id: 'generate-key',
      title: 'Generate Your API Key',
      action: 'Copy the CLI command',
      validation: 'Key appears in dashboard'
    },
    {
      id: 'first-request',
      title: 'Make Your First Request',
      action: 'Try the example code',
      validation: 'Receive 201 response'
    },
    {
      id: 'check-status',
      title: 'Check Analysis Status',
      action: 'Poll for completion',
      validation: 'Status changes to completed'
    },
    {
      id: 'get-results',
      title: 'Retrieve Your Analysis',
      action: 'Download the results',
      validation: 'Markdown content received'
    }
  ]
};
```

### 9.2 API Playground Features

- Live request/response editing
- Environment variable management
- Request history
- Response mocking for testing
- Performance metrics display
- Share request snippets via URL

---

## 10. Localization Plan

### Supported Languages (Phase 1)
- English (en-US) - Primary
- Spanish (es-ES)
- Japanese (ja-JP)
- German (de-DE)

### Localization Structure
```
/docs/
  /en/
  /es/
  /ja/
  /de/
```

---

*End of API Documentation Plan*