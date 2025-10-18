# User Stories - bkrptr Web Dashboard & API

## Story Format Guidelines

All stories follow the INVEST criteria:
- **I**ndependent - Can be developed separately
- **N**egotiable - Details can be discussed
- **V**aluable - Delivers user value
- **E**stimable - Can be sized
- **S**mall - Fits in one sprint
- **T**estable - Has clear acceptance criteria

---

## Epic 1: API Foundation

### Story API-001: Generate API Key via CLI
**Priority**: P0 (Critical)
**Size**: 3 points
**Sprint**: 1

**As a** developer
**I want to** generate API keys using the CLI
**So that** I can integrate bkrptr into my applications

#### Acceptance Criteria
```gherkin
GIVEN I have bkrptr CLI installed
WHEN I run "bkrptr api-key create --name 'Production' --permissions read,write"
THEN a new API key is generated
  AND the key is displayed once (never shown again)
  AND the key is stored securely (hashed) in the database
  AND I receive a key ID for future reference

GIVEN I have an API key
WHEN I run "bkrptr api-key list"
THEN I see all my API keys with metadata
  BUT I cannot see the actual key values

GIVEN I have an API key ID
WHEN I run "bkrptr api-key revoke <key-id>"
THEN the key is marked as revoked
  AND API calls with that key return 401
```

#### Technical Notes
- Use crypto.randomBytes(32) for key generation
- Store SHA-256 hash of keys
- Include checksum for key validation
- Log key creation/revocation events

#### Definition of Done
- [ ] CLI commands implemented
- [ ] Keys stored securely in database
- [ ] Unit tests written (>90% coverage)
- [ ] Integration tests pass
- [ ] Documentation updated
- [ ] Security review completed

---

### Story API-002: Submit Book for Analysis
**Priority**: P0 (Critical)
**Size**: 5 points
**Sprint**: 1

**As a** microservice developer
**I want to** submit books for analysis via API
**So that** I can automate book processing in my workflow

#### Acceptance Criteria
```gherkin
GIVEN I have a valid API key
WHEN I POST to /api/books with book details
THEN the book is queued for processing
  AND I receive a unique book ID
  AND the response includes estimated completion time
  AND the response includes estimated cost

GIVEN I submit a book without required fields
WHEN I POST to /api/books
THEN I receive a 400 error
  AND the error message indicates missing fields

GIVEN I submit with an invalid API key
WHEN I POST to /api/books
THEN I receive a 401 error

GIVEN I exceed my rate limit
WHEN I POST to /api/books
THEN I receive a 429 error
  AND the response includes retry-after header
```

#### Request/Response Schema
```typescript
// Request
{
  title: string (required),
  author: string (required),
  isbn?: string,
  genre?: string,
  audience?: string,
  processingMode?: "batch" | "expedited",
  analysisDepth?: "quick" | "standard" | "comprehensive"
}

// Response
{
  bookId: string,
  status: "queued",
  estimatedCompletion: ISO8601,
  estimatedCost: number,
  processingMode: string
}
```

#### Technical Notes
- Default to batch processing if not specified
- Validate ISBN format if provided
- Queue job in Redis with priority based on mode
- Generate UUID v4 for book IDs

---

### Story API-003: Check Analysis Status
**Priority**: P0 (Critical)
**Size**: 2 points
**Sprint**: 1

**As an** API consumer
**I want to** check the status of my book analysis
**So that** I know when results are ready

#### Acceptance Criteria
```gherkin
GIVEN I have submitted a book for analysis
WHEN I GET /api/books/{bookId}
THEN I receive current status and metadata

GIVEN analysis is complete
WHEN I GET /api/books/{bookId}
THEN status shows "completed"
  AND response includes document URLs
  AND response includes actual cost
  AND response includes processing duration

GIVEN analysis failed
WHEN I GET /api/books/{bookId}
THEN status shows "failed"
  AND response includes error message
  AND response includes retry options
```

---

## Epic 2: Batch Processing Engine

### Story BATCH-001: Submit Multiple Books via API
**Priority**: P0 (Critical)
**Size**: 5 points
**Sprint**: 2

**As a** learning platform developer
**I want to** submit multiple books in one request
**So that** I can efficiently process reading lists

#### Acceptance Criteria
```gherkin
GIVEN I have a list of 25 books
WHEN I POST to /api/batches
THEN all books are queued as a single batch
  AND I receive a batch ID
  AND response shows total estimated cost
  AND response shows estimated completion time

GIVEN some books in my batch are invalid
WHEN I POST to /api/batches
THEN valid books are queued
  AND invalid books are returned with errors
  AND I can choose to proceed or cancel
```

#### Technical Notes
- Max 1000 books per batch
- Atomic operation (all or nothing)
- Create batch job in Anthropic API
- Track batch progress in database

---

### Story BATCH-002: Process Books Using Anthropic Batches API
**Priority**: P0 (Critical)
**Size**: 8 points
**Sprint**: 2

**As a** system administrator
**I want** the system to use Anthropic's batch API
**So that** we reduce costs by 50%

#### Acceptance Criteria
```gherkin
GIVEN books are queued for batch processing
WHEN the batch processor runs
THEN it creates an Anthropic batch request
  AND monitors batch status every 5 minutes
  AND processes results when complete
  AND stores analyses in S3

GIVEN Anthropic batch fails
WHEN processor detects failure
THEN individual books are retried
  AND users are notified of delays
  AND system logs detailed error
```

#### Technical Notes
- Implement exponential backoff for retries
- Store Anthropic batch ID for tracking
- Update book statuses as batch progresses
- Handle partial batch failures gracefully

---

## Epic 3: Web Dashboard

### Story WEB-001: User Registration and Login
**Priority**: P1 (High)
**Size**: 5 points
**Sprint**: 3

**As a** non-technical user
**I want to** create an account and login
**So that** I can use the web interface

#### Acceptance Criteria
```gherkin
GIVEN I'm a new user
WHEN I register with email and password
THEN my account is created
  AND I receive a verification email
  AND I can login after verification

GIVEN I'm registered
WHEN I login with correct credentials
THEN I'm redirected to dashboard
  AND a JWT token is stored
  AND my session persists for 7 days

GIVEN I forget my password
WHEN I request password reset
THEN I receive reset email
  AND I can set new password
```

---

### Story WEB-002: Submit Book via Web Form
**Priority**: P1 (High)
**Size**: 3 points
**Sprint**: 3

**As a** dashboard user
**I want to** submit books through a web form
**So that** I don't need to use the CLI

#### Acceptance Criteria
```gherkin
GIVEN I'm logged into dashboard
WHEN I click "Add Book"
THEN I see a form with fields
  AND genre is auto-suggested
  AND I can select processing mode
  AND cost estimate updates dynamically

GIVEN I submit the form
WHEN all fields are valid
THEN book is queued
  AND I see success message
  AND book appears in my queue
```

---

### Story WEB-003: View Analysis Queue
**Priority**: P1 (High)
**Size**: 3 points
**Sprint**: 3

**As a** dashboard user
**I want to** see all my submitted books
**So that** I can track their progress

#### Acceptance Criteria
```gherkin
GIVEN I have submitted books
WHEN I view the queue page
THEN I see all books with status
  AND I can filter by status
  AND I can search by title/author
  AND I can sort by date/status

GIVEN a book is processing
WHEN I view its row
THEN I see progress indicator
  AND estimated completion time
  AND option to expedite
```

---

### Story WEB-004: Read Analysis Results
**Priority**: P1 (High)
**Size**: 5 points
**Sprint**: 4

**As a** dashboard user
**I want to** read analyses in my browser
**So that** I can quickly review insights

#### Acceptance Criteria
```gherkin
GIVEN analysis is complete
WHEN I click "View Results"
THEN markdown renders beautifully
  AND I can navigate via TOC
  AND code blocks have syntax highlighting
  AND tables are properly formatted

GIVEN I'm viewing results
WHEN I click "Download"
THEN I can choose format (MD/PDF/DOCX)
  AND file downloads immediately
  AND formatting is preserved
```

---

## Epic 4: Cost Optimization

### Story COST-001: Expedite Processing
**Priority**: P1 (High)
**Size**: 3 points
**Sprint**: 4

**As a** user with urgent needs
**I want to** expedite specific analyses
**So that** I get results in minutes instead of hours

#### Acceptance Criteria
```gherkin
GIVEN a book is in batch queue
WHEN I click "Expedite"
THEN I see cost difference (+$0.03)
  AND I can confirm or cancel
  AND book moves to priority queue

GIVEN I expedite a book
WHEN processing completes
THEN it finishes in 8-10 minutes
  AND I'm notified immediately
  AND cost reflects expedited price
```

---

### Story COST-002: Usage Tracking Dashboard
**Priority**: P2 (Medium)
**Size**: 3 points
**Sprint**: 5

**As a** cost-conscious user
**I want to** track my usage and costs
**So that** I can manage my budget

#### Acceptance Criteria
```gherkin
GIVEN I've processed books
WHEN I view usage dashboard
THEN I see current month costs
  AND breakdown by processing mode
  AND projection for full month
  AND historical trend chart

GIVEN I set a budget alert
WHEN I approach 80% of budget
THEN I receive email warning
  AND dashboard shows alert
  AND I can increase or pause
```

---

## Epic 5: API Documentation

### Story DOCS-001: Interactive API Documentation
**Priority**: P1 (High)
**Size**: 5 points
**Sprint**: 5

**As a** developer
**I want** interactive API documentation
**So that** I can test endpoints before coding

#### Acceptance Criteria
```gherkin
GIVEN I visit docs site
WHEN I browse API reference
THEN I see all endpoints documented
  AND request/response examples
  AND I can try requests in browser
  AND I see my results immediately

GIVEN I'm authenticated
WHEN I use "Try It" feature
THEN requests use my real API key
  AND I see actual responses
  AND rate limits apply
```

---

### Story DOCS-002: SDK Development
**Priority**: P2 (Medium)
**Size**: 8 points
**Sprint**: 6

**As a** Node.js developer
**I want** an official SDK
**So that** integration is simpler

#### Acceptance Criteria
```gherkin
GIVEN I install @bkrptr/node-sdk
WHEN I import and configure
THEN I can make API calls easily
  AND TypeScript types are included
  AND errors are handled gracefully
  AND retries work automatically

GIVEN SDK is published
WHEN developers use it
THEN weekly downloads > 100
  AND GitHub issues < 5/month
  AND documentation is complete
```

---

## Epic 6: Security & Compliance

### Story SEC-001: Rate Limiting Implementation
**Priority**: P0 (Critical)
**Size**: 5 points
**Sprint**: 1

**As a** system administrator
**I want** rate limiting per API key
**So that** we prevent abuse and ensure fair usage

#### Acceptance Criteria
```gherkin
GIVEN an API key with 100 req/hour limit
WHEN client exceeds limit
THEN 429 response is returned
  AND Retry-After header is set
  AND counter resets after window

GIVEN distributed API servers
WHEN rate limiting is applied
THEN limits are synchronized
  AND Redis tracks global state
  AND no race conditions occur
```

---

### Story SEC-002: API Key Permissions
**Priority**: P1 (High)
**Size**: 3 points
**Sprint**: 2

**As an** enterprise admin
**I want** granular API permissions
**So that** I can limit access appropriately

#### Acceptance Criteria
```gherkin
GIVEN I create an API key
WHEN I set permissions to "read"
THEN key cannot submit new books
  BUT can read existing analyses
  AND cannot expedite processing

GIVEN key has "write" permission
WHEN used to submit books
THEN request succeeds
  AND usage is logged
  AND audit trail created
```

---

## Epic 7: Monitoring & Observability

### Story MON-001: API Metrics Dashboard
**Priority**: P1 (High)
**Size**: 5 points
**Sprint**: 6

**As a** DevOps engineer
**I want** comprehensive API metrics
**So that** I can monitor system health

#### Acceptance Criteria
```gherkin
GIVEN Prometheus is configured
WHEN I view Grafana dashboard
THEN I see request rates
  AND response time percentiles
  AND error rates by endpoint
  AND active user counts

GIVEN an endpoint degrades
WHEN response time > 500ms (p95)
THEN alert is triggered
  AND on-call is paged
  AND runbook link provided
```

---

## Prioritization Matrix

### Sprint 1-2 (MVP)
- API-001: Generate API Keys (P0)
- API-002: Submit Books (P0)
- API-003: Check Status (P0)
- SEC-001: Rate Limiting (P0)
- BATCH-001: Batch Submission (P0)
- BATCH-002: Anthropic Integration (P0)

### Sprint 3-4 (Dashboard Beta)
- WEB-001: User Auth (P1)
- WEB-002: Submit via Web (P1)
- WEB-003: View Queue (P1)
- WEB-004: Read Results (P1)
- COST-001: Expedite Feature (P1)
- SEC-002: Permissions (P1)

### Sprint 5-6 (Production)
- DOCS-001: API Docs (P1)
- COST-002: Usage Tracking (P2)
- MON-001: Metrics (P1)
- DOCS-002: SDK (P2)

---

## Risk Mitigation Stories

### Story RISK-001: Anthropic API Fallback
**Priority**: P1 (High)
**Size**: 5 points

**As a** system
**I want** fallback handling for Anthropic outages
**So that** service remains partially operational

#### Acceptance Criteria
```gherkin
GIVEN Anthropic API is down
WHEN new books are submitted
THEN they queue successfully
  AND users see warning message
  AND status page updates
  AND processing resumes when available
```

---

## Story Template

### Story [ID]: [Title]
**Priority**: P[0-3]
**Size**: [1-13] points
**Sprint**: [1-N]
**Epic**: [Epic Name]
**Dependencies**: [List any dependent stories]

**As a** [persona]
**I want to** [action]
**So that** [benefit/value]

#### Acceptance Criteria
```gherkin
GIVEN [context]
WHEN [action]
THEN [expected outcome]
  AND [additional outcomes]
```

#### Technical Notes
- Implementation details
- Architecture decisions
- Performance considerations

#### Design Notes
- UI/UX considerations
- Mockup references
- Style guide adherence

#### Definition of Done
- [ ] Code complete and reviewed
- [ ] Unit tests written (>90% coverage)
- [ ] Integration tests pass
- [ ] Documentation updated
- [ ] Accessibility tested
- [ ] Security review if needed
- [ ] Performance validated
- [ ] Deployed to staging
- [ ] Product owner approval

---

## Estimation Guidelines

### Story Points Scale
- **1 point**: Trivial change (< 2 hours)
- **2 points**: Simple feature (< 1 day)
- **3 points**: Standard feature (1-2 days)
- **5 points**: Complex feature (2-3 days)
- **8 points**: Very complex (3-5 days)
- **13 points**: Needs breakdown (> 5 days)

### Velocity Assumptions
- Sprint length: 2 weeks
- Team size: 3 developers
- Velocity: 30-40 points/sprint

---

## Success Metrics Per Story

### API Stories
- Response time < 200ms
- Error rate < 0.1%
- Adoption rate > 10% week-over-week

### Dashboard Stories
- Page load < 2 seconds
- User task completion > 90%
- Support tickets < 5% of users

### Processing Stories
- Cost reduction = 50%
- Processing success > 99%
- Queue time < 24 hours (batch)

---

*End of User Stories Document*