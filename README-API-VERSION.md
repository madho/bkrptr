# bkrptr - Universal Book Analysis Platform

<div align="center">

[![API Status](https://img.shields.io/badge/API-v1.0-blue)](https://api.bkrptr.io)
[![Dashboard](https://img.shields.io/badge/Dashboard-Live-green)](https://app.bkrptr.io)
[![Docs](https://img.shields.io/badge/Docs-Available-orange)](https://docs.bkrptr.io)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)
[![Cost](https://img.shields.io/badge/Cost-$0.03%2Fbook-brightgreen)](https://bkrptr.io/pricing)

**Transform any book into actionable AI-powered analysis in minutes**

[Get Started](https://docs.bkrptr.io/getting-started) • [API Docs](https://docs.bkrptr.io/api-reference) • [Dashboard](https://app.bkrptr.io) • [Support](https://bkrptr.io/support)

</div>

---

## 🚀 What is bkrptr?

bkrptr (Book Reporter) is an AI-powered platform that transforms books into comprehensive, actionable analyses using Claude Sonnet. Available as a CLI tool, REST API, and web dashboard, it's perfect for individuals, teams, and enterprises looking to extract maximum value from their reading.

### Key Features

- **📚 4 Analysis Formats**: MADHO Summary, Detailed Analysis, Executive Summary, Quick Reference
- **💰 50% Cost Savings**: Batch processing at $0.03/book (vs $0.06 expedited)
- **⚡ Flexible Processing**: 24-hour batch or 8-minute expedited options
- **🔌 API-First Design**: RESTful API for seamless integration
- **🌐 Web Dashboard**: User-friendly interface for non-technical users
- **🎯 12+ Genres**: Automated genre detection and specialized analysis
- **👥 Multi-Audience**: Tailored insights for leaders, students, professionals

---

## 📊 Quick Stats

| Metric | Value |
|--------|-------|
| **Analysis Time** | 8-10 minutes (expedited) / <24 hours (batch) |
| **Cost per Book** | $0.03 (batch) / $0.06 (expedited) |
| **API Uptime** | 99.9% SLA |
| **Languages** | 10+ supported |
| **Formats** | Text, PDF, EPUB |
| **Output** | Markdown, PDF, DOCX |

---

## 🎯 Use Cases

<details>
<summary><strong>For Leaders & Executives</strong></summary>

- Extract actionable insights from business books
- Create executive summaries for team sharing
- Build a knowledge base of industry insights
- Track reading progress across the organization

</details>

<details>
<summary><strong>For Learning & Development</strong></summary>

- Process recommended reading lists at scale
- Generate study materials for training programs
- Create discussion guides for book clubs
- Track employee learning engagement

</details>

<details>
<summary><strong>For Researchers & Students</strong></summary>

- Analyze multiple sources for literature reviews
- Generate comprehensive notes and citations
- Create study guides from textbooks
- Budget-friendly batch processing for large reading lists

</details>

<details>
<summary><strong>For Developers & Platforms</strong></summary>

- Integrate book analysis into your LMS
- Add AI summaries to digital libraries
- Enhance reading apps with insights
- Build knowledge management systems

</details>

---

## 🚀 Getting Started

### Option 1: Web Dashboard (Easiest)

1. **Sign up** at [app.bkrptr.io](https://app.bkrptr.io)
2. **Add a book** using the simple web form
3. **Choose processing**: Batch (save 50%) or Expedited
4. **Get results** via email or dashboard

### Option 2: REST API (For Developers)

```bash
# 1. Install CLI to generate API key
npm install -g bkrptr

# 2. Generate your API key
bkrptr api-key create --name "My App"
# Output: bkrptr_live_k3x9mP2nQ8vR5tY7wA4zB6cD1eF3gH2j_a7c9

# 3. Make your first API call
curl -X POST https://api.bkrptr.io/v1/books \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Lean Startup",
    "author": "Eric Ries",
    "processingMode": "batch"
  }'
```

### Option 3: CLI Tool (Power Users)

```bash
# Install globally
npm install -g bkrptr

# Configure API key
export ANTHROPIC_API_KEY="your-key-here"

# Analyze a book
bkrptr analyze
# Follow interactive prompts
```

---

## 📡 API Overview

### Base URL
```
https://api.bkrptr.io/v1
```

### Authentication
All requests require an API key in the header:
```
X-API-Key: your_api_key_here
```

### Core Endpoints

#### Submit Book for Analysis
```http
POST /api/books
Content-Type: application/json

{
  "title": "Atomic Habits",
  "author": "James Clear",
  "processingMode": "batch",  // or "expedited"
  "analysisDepth": "standard"  // or "quick" or "comprehensive"
}
```

#### Check Analysis Status
```http
GET /api/books/{bookId}
```

#### Retrieve Analysis Results
```http
GET /api/books/{bookId}/results/madho_summary
```

#### Submit Batch of Books
```http
POST /api/batches
Content-Type: application/json

{
  "books": [
    {"title": "Book 1", "author": "Author 1"},
    {"title": "Book 2", "author": "Author 2"}
  ]
}
```

[Full API Documentation →](https://docs.bkrptr.io/api-reference)

---

## 🛠 Installation & Setup

### Prerequisites
- Node.js 20+ (for CLI/SDK)
- API key from [app.bkrptr.io](https://app.bkrptr.io)

### Install CLI
```bash
npm install -g bkrptr
```

### Install SDK (Node.js)
```bash
npm install @bkrptr/node-sdk
```

### Quick Example
```javascript
const Bkrptr = require('@bkrptr/node-sdk');

const client = new Bkrptr({
  apiKey: process.env.BKRPTR_API_KEY
});

// Submit a book for analysis
const book = await client.books.create({
  title: 'The Phoenix Project',
  author: 'Gene Kim',
  processingMode: 'batch'
});

console.log(`Analysis queued! ID: ${book.bookId}`);
console.log(`Estimated completion: ${book.estimatedCompletion}`);
```

---

## 💰 Pricing

### Processing Modes

| Mode | Cost | Speed | Use Case |
|------|------|-------|----------|
| **Batch** | $0.03/book | <24 hours | Default, cost-optimized |
| **Expedited** | $0.06/book | 8-10 minutes | Urgent needs |

### API Plans

| Plan | Monthly Price | Included Books | Rate Limit |
|------|--------------|----------------|------------|
| **Free** | $0 | 10 books | 100 req/hour |
| **Starter** | $29 | 100 books | 1,000 req/hour |
| **Professional** | $99 | 500 books | 10,000 req/hour |
| **Enterprise** | Custom | Unlimited | Unlimited |

[View Full Pricing →](https://bkrptr.io/pricing)

---

## 📚 Documentation

### For Users
- [Getting Started Guide](https://docs.bkrptr.io/getting-started)
- [Web Dashboard Tutorial](https://docs.bkrptr.io/dashboard)
- [Analysis Types Explained](https://docs.bkrptr.io/analysis-types)

### For Developers
- [API Reference](https://docs.bkrptr.io/api-reference)
- [Authentication](https://docs.bkrptr.io/authentication)
- [SDKs & Libraries](https://docs.bkrptr.io/sdks)
- [Postman Collection](https://docs.bkrptr.io/postman)

### Guides
- [Batch Processing Best Practices](https://docs.bkrptr.io/guides/batch-processing)
- [Cost Optimization](https://docs.bkrptr.io/guides/cost-optimization)
- [Enterprise Integration](https://docs.bkrptr.io/guides/enterprise)

---

## 📈 Performance & Reliability

### System Status
- **Current Status**: 🟢 All Systems Operational
- **API Uptime** (30 days): 99.97%
- **Average Response Time**: 142ms
- [Live Status Page →](https://status.bkrptr.io)

### Infrastructure
- **API**: Auto-scaling Node.js on AWS
- **Database**: PostgreSQL with read replicas
- **Queue**: Redis for job management
- **Storage**: S3 for analysis documents
- **CDN**: CloudFlare for global delivery

---

## 🧩 Integrations

### Official Integrations
- **Slack**: Get notifications when analyses complete
- **Zapier**: Connect to 5000+ apps
- **Microsoft Teams**: Share insights with your team
- **Google Drive**: Auto-save analyses

### Community Integrations
- [Obsidian Plugin](https://github.com/community/obsidian-bkrptr)
- [Notion Integration](https://github.com/community/notion-bkrptr)
- [Chrome Extension](https://github.com/community/bkrptr-extension)

---

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Clone the repository
git clone https://github.com/bkrptr/bkrptr.git
cd bkrptr

# Install dependencies
npm install

# Run tests
npm test

# Start development server
npm run dev
```

### Areas for Contribution
- 🌍 Translations
- 🔧 SDK Development
- 📖 Documentation
- 🐛 Bug Reports
- 💡 Feature Requests

---

## 📊 Roadmap

### Q1 2025 (Current)
- ✅ REST API v1.0
- ✅ Web Dashboard
- ✅ Batch Processing
- 🚧 Python SDK
- 🚧 Webhook Support

### Q2 2025
- [ ] GraphQL API
- [ ] Team Collaboration Features
- [ ] Mobile Apps (iOS/Android)
- [ ] Advanced Analytics Dashboard

### Q3 2025
- [ ] AI Model Fine-tuning
- [ ] Custom Analysis Templates
- [ ] Enterprise SSO
- [ ] White-label Options

[Full Roadmap →](https://github.com/bkrptr/bkrptr/projects/1)

---

## 💬 Support & Community

### Get Help
- 📧 Email: [support@bkrptr.io](mailto:support@bkrptr.io)
- 💬 Discord: [Join our community](https://discord.gg/bkrptr)
- 🐦 Twitter: [@bkrptr](https://twitter.com/bkrptr)
- 📖 Docs: [docs.bkrptr.io](https://docs.bkrptr.io)

### Resources
- [FAQ](https://docs.bkrptr.io/faq)
- [Video Tutorials](https://youtube.com/@bkrptr)
- [Blog](https://bkrptr.io/blog)
- [Case Studies](https://bkrptr.io/case-studies)

---

## 📜 License

bkrptr is open source software licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Powered by [Claude Sonnet](https://anthropic.com) by Anthropic
- Built with [Node.js](https://nodejs.org) and [TypeScript](https://typescriptlang.org)
- Hosted on [AWS](https://aws.amazon.com)

---

<div align="center">

**Ready to transform your reading?**

[Get Started Free](https://app.bkrptr.io/signup) • [View Demo](https://bkrptr.io/demo) • [Book a Call](https://calendly.com/bkrptr/demo)

Made with ❤️ by the bkrptr team

© 2025 bkrptr. All rights reserved.

</div>