# Vercel Deployment Guide - bkrptr API

## Overview

The bkrptr REST API has been migrated from SQLite (better-sqlite3) to **Vercel Postgres** to enable serverless deployment on Vercel. This guide covers the complete setup and deployment process.

## Architecture Changes

### Before (SQLite)
- **Database**: better-sqlite3 with local .db file
- **Issue**: Native C++ bindings incompatible with AWS Lambda (Vercel's serverless runtime)
- **Error**: FUNCTION_INVOCATION_FAILED

### After (PostgreSQL)
- **Database**: Vercel Postgres (serverless PostgreSQL)
- **Connection**: @vercel/postgres SDK with automatic connection pooling
- **Compatibility**: Fully serverless-ready, no native dependencies

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **Vercel CLI** (optional): `npm install -g vercel`
3. **Vercel Postgres Database**: Create through Vercel dashboard

## Step 1: Create Vercel Postgres Database

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Navigate to the **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose a database name (e.g., `bkrptr-production`)
6. Select a region (choose closest to your users)
7. Click **Create**

## Step 2: Link Database to Project

### Option A: Via Vercel Dashboard (Recommended)

1. Go to your project settings at https://vercel.com/[your-username]/bkrptr/settings
2. Navigate to **Storage**
3. Click **Connect Database**
4. Select your Postgres database
5. Choose **All Environments** or select specific ones (Production, Preview, Development)
6. Click **Connect**

This automatically adds the required environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### Option B: Via Vercel CLI

```bash
vercel env pull .env.local
```

This downloads all environment variables including database credentials.

## Step 3: Configure Environment Variables

The following environment variables are automatically set when you connect the database:

### Required (Auto-configured)
- `POSTGRES_URL` - Connection string with pooling (used by @vercel/postgres)
- `NODE_ENV` - Set to "production" automatically

### Optional (Manual Configuration)

Add these in **Project Settings → Environment Variables**:

1. **WEBHOOK_SECRET** (optional)
   - Purpose: Secret for signing webhook payloads
   - Example: `whsec_${generateRandomString()}`
   - Scope: Production, Preview, Development

2. **CORS_ORIGIN** (optional)
   - Purpose: Allowed CORS origins
   - Default: `*` (allow all)
   - Example: `https://yourdomain.com`
   - Scope: Production

3. **ANTHROPIC_API_KEY** (required for analysis processing)
   - Purpose: Claude API key for book analysis
   - Get from: https://console.anthropic.com
   - Scope: Production, Preview
   - **Important**: Keep this secret!

## Step 4: Update Code (Already Completed)

The following changes have been made to support Vercel Postgres:

### New Files
- `src/api/models/database-postgres.ts` - PostgreSQL implementation of DatabaseService
- `api/index.ts` - Vercel serverless function entry point

### Updated Files
- `src/api/server.ts` - Import from database-postgres
- `src/api/routes/analyses.ts` - Async database operations
- `src/api/routes/health.ts` - Async health check
- `src/api/middleware/auth.ts` - Async API key validation
- `src/api/services/analysis-service.ts` - Async database calls
- `vercel.json` - Serverless function configuration
- `package.json` - Added @vercel/postgres dependency

## Step 5: Deploy to Vercel

### Option A: Git-based Deployment (Recommended)

1. **Commit and push changes:**
```bash
git add .
git commit -m "Migrate to Vercel Postgres for serverless compatibility"
git push origin main
```

2. **Automatic deployment:**
   - Vercel automatically detects the push
   - Builds the project using `npm run build`
   - Deploys to production at https://bkrptr.com

### Option B: CLI Deployment

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

## Step 6: Initialize Database Schema

The database schema is automatically initialized on the first request to any endpoint. The schema includes:

### Tables Created
1. **analyses** - Stores book analysis jobs
2. **api_keys** - Stores hashed API keys
3. **webhooks** - Tracks webhook delivery attempts

### Indexes Created
- `idx_analyses_status`
- `idx_analyses_created_at`
- `idx_analyses_idempotency_key`
- `idx_webhooks_status`
- `idx_webhooks_analysis_id`

### Default Data
- One default API key is created automatically on first run

To retrieve the default API key, you'll need to query the database directly or create a new one via API.

## Step 7: Create API Key

### Option 1: Query Database Directly

Using Vercel Postgres dashboard or CLI:

```sql
-- View existing API keys (hashed)
SELECT id, key_prefix, name, is_active, created_at FROM api_keys;
```

**Note**: The actual API key is not stored (only the hash). You'll need to create a new one.

### Option 2: Add Admin Endpoint (Temporary)

Add this to `src/api/server.ts` temporarily to generate a key:

```typescript
app.post('/admin/create-api-key', async (req, res) => {
  const { name } = req.body;
  const { apiKey, record } = await db.createApiKey(name || 'New API Key');
  res.json({
    apiKey, // SAVE THIS - it won't be shown again
    id: record.id,
    keyPrefix: record.key_prefix
  });
});
```

Then call it:
```bash
curl -X POST https://bkrptr.com/admin/create-api-key \
  -H "Content-Type: application/json" \
  -d '{"name": "Production Key"}'
```

**Important**: Remove this endpoint after creating keys!

## Step 8: Verify Deployment

### Test Health Endpoint
```bash
curl https://bkrptr.com/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-19T...",
  "version": "1.0.0",
  "service": "bkrptr-api"
}
```

### Test API with Authentication
```bash
curl https://bkrptr.com/api/v1/analyses \
  -H "Authorization: Bearer bkrptr_live_YOUR_API_KEY"
```

Expected response:
```json
{
  "data": [],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 0,
    "hasMore": false
  }
}
```

### Test Analysis Creation
```bash
curl -X POST https://bkrptr.com/api/v1/analyses \
  -H "Authorization: Bearer bkrptr_live_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "book": {
      "title": "The Lean Startup",
      "author": "Eric Ries"
    },
    "options": {
      "processingMode": "expedited"
    }
  }'
```

## Monitoring & Debugging

### View Function Logs

**Via Dashboard:**
1. Go to your project on Vercel
2. Click **Deployments**
3. Click on the latest deployment
4. Click **View Function Logs**

**Via CLI:**
```bash
vercel logs https://bkrptr.com
```

### Common Issues & Solutions

#### Issue: Database Connection Error
**Error**: "Connection refused" or "Could not connect to database"

**Solution**: Verify environment variables are set correctly
```bash
vercel env ls
```

#### Issue: Function Timeout
**Error**: "FUNCTION_INVOCATION_TIMEOUT"

**Solution**: Increase timeout in vercel.json (already set to 60s)
```json
{
  "functions": {
    "api/index.ts": {
      "maxDuration": 60
    }
  }
}
```

#### Issue: Cold Start Latency
**Symptom**: First request after idle period is slow

**Solutions**:
1. Enable Vercel Pro for better cold start performance
2. Use connection pooling (already implemented with @vercel/postgres)
3. Implement warming function (ping endpoint periodically)

#### Issue: Missing API Key
**Error**: "Invalid or inactive API key"

**Solution**: Create new API key using admin endpoint or database query

## Performance Optimization

### Current Configuration
- **Memory**: 1024 MB (good for analysis processing)
- **Timeout**: 60 seconds (sufficient for most analyses)
- **Connection Pooling**: Enabled via @vercel/postgres

### Monitoring
- Use Vercel Analytics for performance metrics
- Enable Speed Insights in project settings
- Monitor Core Web Vitals and function duration

## Security Best Practices

### Environment Variables
- Never commit `.env` files
- Use different API keys for development/production
- Rotate API keys periodically

### Database
- Use connection pooling (already enabled)
- Never expose `POSTGRES_URL` in client code
- Keep database in same region as functions for low latency

### API Keys
- Store only hashed versions in database
- Use strong random generation (nanoid with 32 characters)
- Implement rate limiting (already configured: 100 req/15min)

## Rollback Procedure

If deployment fails:

### Via Dashboard
1. Go to **Deployments**
2. Find the last working deployment
3. Click the three dots menu
4. Select **Promote to Production**

### Via CLI
```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url] --prod
```

## Cost Estimation

### Vercel Pricing
- **Hobby Plan**: Free
  - 100 GB bandwidth
  - Serverless function execution included
  - 100 GB-hours compute time

- **Pro Plan**: $20/month
  - Unlimited bandwidth
  - Better cold start performance
  - Priority support

### Vercel Postgres Pricing
- **Hobby**: Free
  - 256 MB storage
  - 60 hours compute time/month

- **Pro**: Starting at $24/month
  - 512 MB storage
  - Unlimited compute time

**Recommendation**: Start with Hobby plan, upgrade when needed

## Next Steps

1. Set up custom domain (bkrptr.com already configured)
2. Enable deployment protection for preview branches
3. Set up monitoring and alerts
4. Implement automated backups for database
5. Add comprehensive error tracking (Sentry, DataDog)
6. Set up CI/CD pipeline for automated testing

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
- **@vercel/postgres SDK**: https://vercel.com/docs/storage/vercel-postgres/sdk
- **Vercel CLI**: https://vercel.com/docs/cli

## Migration Checklist

- [x] Install @vercel/postgres dependency
- [x] Create PostgreSQL database service class
- [x] Update all database imports to use PostgreSQL version
- [x] Make all database operations async
- [x] Update vercel.json for serverless configuration
- [x] Create Vercel serverless function entry point
- [ ] Create Vercel Postgres database
- [ ] Connect database to project
- [ ] Set ANTHROPIC_API_KEY environment variable
- [ ] Deploy to Vercel
- [ ] Test health endpoint
- [ ] Create production API key
- [ ] Test full API flow
- [ ] Monitor function logs for errors
- [ ] Document API key for users
