# Product Requirements Document (PRD)
# bkrptr Web Dashboard & API Platform

---

## Document Metadata

| Field | Value |
|-------|-------|
| **Document Version** | 1.0.0 |
| **Created Date** | 2025-10-18 |
| **Author** | Product Team |
| **Status** | Draft |
| **Review Date** | TBD |
| **Stakeholders** | Engineering, Product, Customer Success |
| **Epic ID** | BKRPTR-001 |

---

## 1. Executive Summary

### Product Vision
Transform bkrptr from a standalone CLI tool into a scalable, API-first platform that enables both direct user interaction via a web dashboard and programmatic integration for enterprise microservices.

### Problem Statement
Current bkrptr users must interact via CLI only, limiting adoption among non-technical users and preventing integration with existing enterprise systems. Organizations need:
- Web-based access for non-technical team members
- Programmatic API access for automation workflows
- Batch processing capabilities to reduce costs
- Centralized analysis management across teams

### Solution Overview
Build an **API-first platform** with:
1. **REST API** - Core service layer for all operations
2. **Web Dashboard** - User-friendly interface consuming the API
3. **API Key System** - Secure access for microservices integration
4. **Batch Processing Engine** - Cost-optimized default processing using Anthropic Batches API

### Key Benefits
- **50% Cost Reduction** - Default batch processing ($0.03 vs $0.06 per book)
- **Enterprise Integration** - RESTful API for microservices
- **Accessibility** - Web dashboard for non-technical users
- **Scalability** - Handle thousands of concurrent analyses
- **Flexibility** - Real-time expedite option when urgency matters

---

## 2. User Personas & Use Cases

### Primary Personas

#### 1. Knowledge Worker (Sarah)
- **Role**: Executive/Team Lead
- **Technical Level**: Low to Medium
- **Needs**: Quick book insights, team knowledge sharing
- **Pain Points**: CLI intimidating, wants browser-based access
- **Use Case**: Submits 5-10 books monthly for team development

#### 2. DevOps Engineer (Marcus)
- **Role**: Platform Integration Specialist
- **Technical Level**: High
- **Needs**: API integration, automation capabilities
- **Pain Points**: Manual CLI operations don't scale
- **Use Case**: Integrate bkrptr into learning management system

#### 3. Learning & Development Manager (Priya)
- **Role**: Corporate Training Lead
- **Technical Level**: Medium
- **Needs**: Bulk book processing, team access management
- **Pain Points**: Managing analyses for 100+ employees
- **Use Case**: Monthly batch processing of recommended reading

### Secondary Personas

#### 4. Student Researcher (Alex)
- **Role**: Graduate Student
- **Technical Level**: Medium
- **Needs**: Cost-effective analysis, citation support
- **Pain Points**: Budget constraints, need batch processing
- **Use Case**: Analyze 20+ books for thesis research

---

## 3. Functional Requirements

### 3.1 Web Dashboard

#### 3.1.1 Book Management

**Add Books**
- Single book submission form
- Bulk CSV upload (title, author, genre, audience)
- Auto-detection of book metadata via ISBN lookup
- Genre suggestion based on title/author
- Audience targeting options

**Book Queue Management**
- View all books (pending, processing, completed, failed)
- Filter by: status, date range, genre, audience
- Search by: title, author, analysis ID
- Sort by: submission date, completion date, title
- Pagination (25/50/100 items per page)

**Analysis Configuration**
- Processing mode selection (Batch/Expedited)
- Analysis depth (Quick/Standard/Comprehensive)
- Output format preferences
- Custom prompting options (advanced users)

#### 3.1.2 Analysis Results

**Viewing Results**
- In-browser markdown rendering
- Side-by-side document comparison
- Full-text search within analyses
- Syntax highlighting for code snippets
- Table of contents navigation

**Download Options**
- Individual document download (PDF/MD/DOCX)
- Bulk download as ZIP archive
- Direct link sharing (expiring URLs)
- Export to cloud storage (Google Drive, Dropbox)

#### 3.1.3 Cost & Usage

**Dashboard Metrics**
- Current month usage & costs
- Processing time averages
- Success/failure rates
- Batch vs expedited breakdown
- Projected monthly costs

**Usage History**
- Detailed transaction log
- Cost per analysis breakdown
- Processing time tracking
- API usage statistics

### 3.2 REST API Endpoints

#### 3.2.1 Authentication
```
POST /api/auth/keys
Description: Generate new API key
Request: { "name": "string", "permissions": ["read", "write"] }
Response: { "apiKey": "string", "keyId": "string", "createdAt": "ISO8601" }

DELETE /api/auth/keys/{keyId}
Description: Revoke API key
Response: 204 No Content
```

#### 3.2.2 Book Operations
```
POST /api/books
Description: Submit book for analysis
Request: {
  "title": "string",
  "author": "string",
  "isbn": "string (optional)",
  "genre": "string (optional)",
  "audience": "string (optional)",
  "processingMode": "batch|expedited",
  "analysisDepth": "quick|standard|comprehensive"
}
Response: {
  "bookId": "uuid",
  "status": "queued",
  "estimatedCompletion": "ISO8601",
  "estimatedCost": 0.03
}

GET /api/books
Description: List all books
Query Parameters:
  - status: pending|processing|completed|failed
  - page: number
  - limit: number (max 100)
  - sortBy: submittedAt|completedAt|title
  - order: asc|desc
Response: {
  "books": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 25,
    "pages": 6
  }
}

GET /api/books/{bookId}
Description: Get book analysis status
Response: {
  "bookId": "uuid",
  "title": "string",
  "status": "completed",
  "submittedAt": "ISO8601",
  "completedAt": "ISO8601",
  "processingMode": "batch",
  "cost": 0.03,
  "documents": [
    {
      "type": "madho_summary",
      "url": "/api/books/{bookId}/results/madho_summary"
    }
  ]
}

POST /api/books/{bookId}/expedite
Description: Upgrade to expedited processing
Response: {
  "bookId": "uuid",
  "previousMode": "batch",
  "newMode": "expedited",
  "additionalCost": 0.03,
  "estimatedCompletion": "ISO8601"
}

GET /api/books/{bookId}/results/{documentType}
Description: Get analysis document
Parameters:
  - documentType: madho_summary|detailed|executive|quick_reference
Query Parameters:
  - format: markdown|pdf|html
Response: Document content or binary
```

#### 3.2.3 Batch Operations
```
POST /api/batches
Description: Submit multiple books
Request: {
  "books": [array of book objects],
  "defaultProcessingMode": "batch",
  "defaultAnalysisDepth": "standard"
}
Response: {
  "batchId": "uuid",
  "booksQueued": 25,
  "estimatedCost": 0.75,
  "estimatedCompletion": "ISO8601"
}

GET /api/batches/{batchId}
Description: Get batch status
Response: {
  "batchId": "uuid",
  "status": "processing",
  "progress": {
    "total": 25,
    "completed": 10,
    "failed": 1,
    "processing": 14
  }
}
```

#### 3.2.4 Usage & Billing
```
GET /api/usage
Description: Get usage statistics
Query Parameters:
  - startDate: ISO8601
  - endDate: ISO8601
Response: {
  "period": { "start": "ISO8601", "end": "ISO8601" },
  "totalBooks": 150,
  "totalCost": 4.50,
  "byMode": {
    "batch": { "count": 140, "cost": 4.20 },
    "expedited": { "count": 10, "cost": 0.30 }
  }
}
```

### 3.3 API Key Provisioning System

#### CLI Commands
```bash
# Generate API key
bkrptr api-key create --name "Production LMS" --permissions read,write

# List API keys
bkrptr api-key list

# Revoke API key
bkrptr api-key revoke <key-id>

# View key usage
bkrptr api-key usage <key-id> --days 30
```

#### Key Features
- Cryptographically secure key generation
- Granular permissions (read, write, expedite, admin)
- Rate limiting per key (configurable)
- Usage tracking and analytics
- Key rotation reminders
- IP whitelisting (optional)

---

## 4. Non-Functional Requirements

### 4.1 Performance
- API response time: < 200ms (p95)
- Dashboard page load: < 2 seconds
- Batch submission: Support 1000+ books per batch
- Concurrent users: Support 1000+ simultaneous dashboard users
- File upload: Support CSV files up to 10MB

### 4.2 Reliability
- API uptime: 99.9% availability
- Data durability: All analyses stored redundantly
- Retry logic: Automatic retry for failed Anthropic API calls
- Graceful degradation: Queue system continues accepting jobs during processing outages

### 4.3 Security
- API keys: SHA-256 hashed storage
- HTTPS: All API traffic encrypted
- Rate limiting: Per-key and per-IP limits
- Authentication: JWT tokens for dashboard sessions
- Authorization: Role-based access control (RBAC)
- Input validation: Sanitize all user inputs
- CORS: Configurable allowed origins

### 4.4 Scalability
- Horizontal scaling: Stateless API servers
- Queue system: Redis/RabbitMQ for job management
- Database: PostgreSQL with read replicas
- Storage: S3-compatible object storage for analyses
- CDN: Static asset delivery

### 4.5 Usability
- Mobile responsive dashboard
- Accessibility: WCAG 2.1 AA compliance
- Internationalization: Support for multiple languages
- Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions)

---

## 5. Technical Architecture

### 5.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Users                               │
└─────────────┬────────────────────┬──────────────────────────┘
              │                    │
              ▼                    ▼
┌──────────────────────┐  ┌──────────────────────┐
│   Web Dashboard      │  │   Microservices      │
│   (React/Next.js)    │  │   (API Clients)      │
└──────────┬───────────┘  └──────────┬───────────┘
           │                          │
           ▼                          ▼
┌─────────────────────────────────────────────────┐
│            API Gateway (Kong/Nginx)             │
│         • Rate Limiting                         │
│         • API Key Validation                    │
│         • Request Routing                       │
└─────────────────────────┬───────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────┐
│           REST API Service (Node.js)            │
│         • Express.js Framework                  │
│         • Request Validation                    │
│         • Business Logic                        │
└──────┬──────────────────┬──────────────┬───────┘
       │                  │              │
       ▼                  ▼              ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │  Redis Queue │  │  S3 Storage  │
│  (Metadata)  │  │   (Jobs)     │  │  (Analyses)  │
└──────────────┘  └──────┬───────┘  └──────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────┐
│           Processing Workers                    │
│         • Batch Processor                       │
│         • Expedited Processor                   │
│         • Anthropic API Client                  │
└─────────────────────────────────────────────────┘
```

### 5.2 Technology Stack

**Frontend**
- Framework: React 18+ with Next.js 14
- State Management: Zustand/Redux Toolkit
- UI Components: Tailwind CSS + Shadcn/ui
- API Client: Axios with React Query
- Markdown Rendering: react-markdown

**Backend API**
- Runtime: Node.js 20+ with TypeScript
- Framework: Express.js / Fastify
- Validation: Zod/Joi
- Authentication: Passport.js
- Documentation: OpenAPI/Swagger

**Infrastructure**
- Database: PostgreSQL 15+
- Queue: Redis with Bull/BullMQ
- Storage: AWS S3 or compatible
- Monitoring: Prometheus + Grafana
- Logging: Winston + ELK Stack

**Processing**
- Existing bkrptr Core (TypeScript)
- Anthropic SDK
- Batch job orchestration

### 5.3 Database Schema (Simplified)

```sql
-- API Keys
CREATE TABLE api_keys (
  id UUID PRIMARY KEY,
  key_hash VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  permissions JSONB NOT NULL,
  rate_limit INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP,
  revoked_at TIMESTAMP
);

-- Books
CREATE TABLE books (
  id UUID PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  author VARCHAR(500),
  isbn VARCHAR(20),
  genre VARCHAR(100),
  audience VARCHAR(100),
  processing_mode VARCHAR(20) NOT NULL,
  analysis_depth VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  api_key_id UUID REFERENCES api_keys(id),
  submitted_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  cost DECIMAL(10,4),
  error_message TEXT
);

-- Analysis Documents
CREATE TABLE analysis_documents (
  id UUID PRIMARY KEY,
  book_id UUID REFERENCES books(id),
  document_type VARCHAR(50) NOT NULL,
  storage_path VARCHAR(500) NOT NULL,
  file_size_bytes INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usage Tracking
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY,
  api_key_id UUID REFERENCES api_keys(id),
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## 6. User Flows

### 6.1 Submit Batch Analysis (Dashboard)

```
1. User logs into dashboard
2. Clicks "New Batch Analysis"
3. Uploads CSV file with book list
4. System validates and shows preview
5. User confirms settings (batch mode, standard depth)
6. System calculates cost estimate ($0.03 × 25 books = $0.75)
7. User approves submission
8. Books queued for batch processing
9. User receives email when complete (< 24 hours)
```

### 6.2 Expedite Single Analysis

```
1. User views pending analyses
2. Identifies urgent book needing faster processing
3. Clicks "Expedite" button on book row
4. System shows cost difference (+$0.03)
5. User confirms expedite
6. Book moved to expedited queue
7. Processing completes in ~8-10 minutes
8. User notified via dashboard and email
```

### 6.3 API Integration Flow

```
1. Developer generates API key via CLI
2. Configures key in microservice environment
3. Service makes POST request to /api/books
4. API validates key and rate limits
5. Book queued for processing
6. Service polls /api/books/{id} for status
7. Once complete, fetches results via /api/books/{id}/results
8. Service processes and stores analysis
```

---

## 7. Success Metrics

### 7.1 Primary Metrics (KPIs)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **API Adoption Rate** | 50% of analyses via API within 6 months | API vs CLI usage ratio |
| **Cost Savings** | 75% of analyses use batch mode | Batch vs expedited ratio |
| **Processing Volume** | 10,000 books/month by Month 6 | Total books processed |
| **User Retention** | 80% monthly active users | MAU/Total Users |
| **API Uptime** | 99.9% availability | Monitoring tools |

### 7.2 Secondary Metrics

- **Average Processing Cost**: < $0.035 per book
- **Dashboard Load Time**: < 2 seconds (p95)
- **API Response Time**: < 200ms (p95)
- **Customer Satisfaction**: NPS > 50
- **Support Ticket Volume**: < 5% of users/month

### 7.3 Counter Metrics (Watch for negative impacts)

- **Error Rate**: < 1% of analyses fail
- **Expedite Rate**: < 25% (ensure batch remains default)
- **API Abuse**: < 0.1% of requests blocked
- **Storage Costs**: < $0.001 per analysis/month

---

## 8. Rollout Strategy

### 8.1 Phase 1: MVP (Weeks 1-6)
**Goal**: Core API functionality for early adopters

**Features**:
- Basic REST API (submit, status, retrieve)
- API key generation via CLI
- Simple rate limiting
- Batch processing integration
- Basic monitoring

**Success Criteria**:
- 10 beta users successfully integrate
- < 1% API error rate

### 8.2 Phase 2: Dashboard Beta (Weeks 7-12)
**Goal**: Web interface for non-technical users

**Features**:
- Authentication & user accounts
- Book submission interface
- Queue management view
- Result viewing (markdown)
- Basic usage metrics

**Success Criteria**:
- 100 beta users onboarded
- 80% prefer dashboard over CLI

### 8.3 Phase 3: Production Release (Weeks 13-16)
**Goal**: General availability with full features

**Features**:
- Bulk CSV upload
- Expedite functionality
- Advanced filtering/search
- Download options
- Cost tracking
- API documentation site

**Success Criteria**:
- 1000+ books processed/month
- < 0.5% error rate
- 99.9% uptime

### 8.4 Phase 4: Enterprise Features (Months 5-6)
**Goal**: Scale for enterprise customers

**Features**:
- Team management
- SSO integration
- Advanced API analytics
- SLA guarantees
- Custom integrations

---

## 9. Security & Authentication Design

### 9.1 API Key Structure
```
Format: bkrptr_live_[32-char-random]_[checksum]
Example: bkrptr_live_k3x9mP2nQ8vR5tY7wA4zB6cD1eF3gH2j_a7c9

Components:
- Prefix: Environment identifier (live/test)
- Random: Cryptographically secure random string
- Checksum: Validation digits
```

### 9.2 Rate Limiting Tiers

| Tier | Requests/Hour | Burst Limit | Target User |
|------|--------------|-------------|-------------|
| **Free** | 100 | 10 | Individual developers |
| **Standard** | 1,000 | 50 | Small teams |
| **Premium** | 10,000 | 200 | Growing companies |
| **Enterprise** | Unlimited | Custom | Large organizations |

### 9.3 Security Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1697640000
X-Request-ID: uuid-v4
X-Response-Time: 145ms
```

---

## 10. API Documentation Requirements

### 10.1 Documentation Site Structure
```
/
├── Getting Started
│   ├── Quick Start Guide
│   ├── Authentication
│   └── Your First Request
├── API Reference
│   ├── Books
│   ├── Batches
│   ├── Usage
│   └── Errors
├── SDKs & Libraries
│   ├── Node.js
│   ├── Python
│   └── Go
├── Guides
│   ├── Batch Processing
│   ├── Webhooks
│   └── Best Practices
└── Support
    ├── FAQ
    ├── Status Page
    └── Contact
```

### 10.2 OpenAPI Specification
- Full OpenAPI 3.0 spec
- Interactive API explorer (Swagger UI)
- Request/response examples
- Error code documentation
- Versioning strategy

---

## 11. Risk Assessment & Mitigation

### 11.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Anthropic API Outages** | Medium | High | Queue persistence, retry logic, status page |
| **Database Scaling Issues** | Low | High | Read replicas, connection pooling, caching |
| **Cost Overruns** | Medium | Medium | Usage alerts, hard limits, prepaid credits |
| **Security Breach** | Low | High | Penetration testing, security audits, encryption |

### 11.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Low API Adoption** | Medium | High | Developer evangelism, excellent docs, SDKs |
| **Batch Processing Too Slow** | Medium | Medium | Set expectations, expedite option, progress tracking |
| **Competition** | High | Medium | Focus on quality, unique features, pricing |

---

## 12. Dependencies

### 12.1 External Dependencies
- **Anthropic Batches API**: Core processing engine
- **Cloud Infrastructure**: AWS/GCP/Azure for hosting
- **Payment Processing**: Stripe for billing (future)
- **Email Service**: SendGrid for notifications
- **CDN**: CloudFlare for static assets

### 12.2 Internal Dependencies
- **bkrptr Core**: Existing CLI codebase
- **Design System**: UI component library
- **DevOps Team**: Infrastructure setup
- **Security Team**: Penetration testing

---

## 13. Open Questions

### Technical Questions
1. **Webhook Support**: Should we implement webhooks for completion notifications?
2. **GraphQL**: Consider GraphQL API alongside REST?
3. **Real-time Updates**: WebSocket support for live progress tracking?
4. **Multi-region**: Deploy across regions for lower latency?

### Business Questions
1. **Pricing Model**: Subscription vs pay-per-use?
2. **Free Tier**: What limits for free tier users?
3. **Enterprise Features**: SSO priority? SAML or OAuth?
4. **White Labeling**: Allow custom branding?

### Product Questions
1. **Book Database**: Integrate with Google Books API for metadata?
2. **Collaboration**: Share analyses between team members?
3. **Annotations**: Allow users to annotate analyses?
4. **Export Formats**: Which formats beyond MD/PDF?

---

## 14. Acceptance Criteria

### MVP Acceptance
- [ ] API can accept book submissions
- [ ] Batch processing works with Anthropic API
- [ ] Results retrievable via API
- [ ] API keys can be generated/revoked
- [ ] Basic rate limiting functional
- [ ] Error handling for common scenarios
- [ ] API documentation complete

### Dashboard Acceptance
- [ ] Users can register/login
- [ ] Books can be submitted via web form
- [ ] Queue status visible
- [ ] Results viewable in browser
- [ ] Responsive design works on mobile
- [ ] Accessibility standards met

### Production Acceptance
- [ ] Load testing passed (1000 concurrent users)
- [ ] Security audit completed
- [ ] Monitoring/alerting configured
- [ ] Backup/recovery tested
- [ ] SLA metrics achieved (99.9% uptime)
- [ ] Documentation reviewed and complete

---

## Appendices

### A. API Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid API key |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error, please retry |
| 503 | Service Unavailable | Temporary outage |

### B. Glossary

- **Batch Processing**: Queue books for processing within 24 hours at 50% cost
- **Expedited Processing**: Real-time processing (~8-10 minutes) at standard cost
- **MADHO Summary**: Primary analysis output format
- **Analysis Depth**: Quick (5 min), Standard (8 min), Comprehensive (15 min)

### C. References

- [Anthropic Batches API Documentation](https://docs.anthropic.com/batches)
- [OpenAPI Specification](https://swagger.io/specification/)
- [REST API Best Practices](https://restfulapi.net/)
- [OWASP Security Guidelines](https://owasp.org/www-project-api-security/)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-10-18 | Product Team | Initial PRD creation |

---

## Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Manager | | | |
| Engineering Lead | | | |
| Security Lead | | | |
| CTO | | | |

---

*End of Document*