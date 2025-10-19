# Next Steps - Deploy to Vercel

## What We've Done

✅ Migrated from SQLite (better-sqlite3) to Vercel Postgres
✅ Updated all database operations to async/await
✅ Created Vercel serverless function entry point
✅ Configured vercel.json for optimal serverless performance
✅ Built and verified TypeScript compilation
✅ Committed all changes to git

## What You Need to Do Now

### Step 1: Create Vercel Postgres Database (5 minutes)

1. Go to https://vercel.com/dashboard
2. Click on the **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Name it: `bkrptr-production`
6. Choose a region (pick closest to your users)
7. Click **Create**

### Step 2: Link Database to Your Project (2 minutes)

1. Go to https://vercel.com/[your-username]/bkrptr/settings
2. Navigate to **Storage** section
3. Click **Connect Database**
4. Select your `bkrptr-production` database
5. Choose **All Environments** (Production, Preview, Development)
6. Click **Connect**

This automatically adds these environment variables:
- `POSTGRES_URL` ← The @vercel/postgres SDK uses this
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### Step 3: Add Required Environment Variables (2 minutes)

Still in Project Settings → Environment Variables, add:

**ANTHROPIC_API_KEY** (Required for analysis processing)
- Get from: https://console.anthropic.com
- Value: `sk-ant-api03-...`
- Scope: Production, Preview, Development
- **Important**: Keep this secret!

**WEBHOOK_SECRET** (Optional, for webhook signature validation)
- Value: Any random string (e.g., `whsec_${generateRandomString()}`)
- Scope: Production, Preview, Development

**CORS_ORIGIN** (Optional, defaults to `*`)
- Value: Your frontend domain if you have one
- Example: `https://yourdomain.com`
- Scope: Production

### Step 4: Deploy to Vercel (1 minute)

**Option A: Push to Git (Recommended)**
```bash
git push origin main
```

Vercel will automatically:
- Detect the push
- Run `npm run build`
- Deploy to https://bkrptr.com

**Option B: Use Vercel CLI**
```bash
vercel --prod
```

### Step 5: Monitor Deployment (2 minutes)

1. Go to https://vercel.com/[your-username]/bkrptr/deployments
2. Click on the latest deployment
3. Watch the build logs
4. Once deployed, click **Visit** to see it live

Expected build time: 1-2 minutes

### Step 6: Verify It Works (3 minutes)

**Test Health Endpoint:**
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

If you get a 200 response, the API is working! 🎉

### Step 7: Create API Key (5 minutes)

You need an API key to access protected endpoints. There are two ways:

**Option A: Create Admin Endpoint (Temporary)**

Add this to `/Users/madho/Desktop/cc/bkrptr/src/api/server.ts` after line 79 (after the root endpoint):

```typescript
  // TEMPORARY: Admin endpoint to create API keys
  app.post('/admin/create-api-key', async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const { apiKey, record } = await db.createApiKey(name || 'Production Key');
      res.json({
        apiKey, // SAVE THIS - it won't be shown again
        id: record.id,
        keyPrefix: record.key_prefix,
        created: record.created_at
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create API key' });
    }
  });
```

Then:
```bash
# Rebuild
npm run build

# Commit and push
git add .
git commit -m "Add temporary admin endpoint for API key creation"
git push origin main

# Wait for deployment (~1 min), then create key
curl -X POST https://bkrptr.com/admin/create-api-key \
  -H "Content-Type: application/json" \
  -d '{"name": "Production Key"}'
```

**SAVE THE API KEY** - you'll get something like:
```json
{
  "apiKey": "bkrptr_live_XYZ123ABC456...",
  "id": "key_...",
  "keyPrefix": "bkrptr_live_...",
  "created": "2025-10-19T..."
}
```

**Important**: Remove the admin endpoint after creating keys!

**Option B: Query Database Directly**

Using Vercel Postgres dashboard:
1. Go to Storage → bkrptr-production → Query
2. Run:
```sql
-- This creates a new API key in the database
-- You'll need to create one via the application code instead
```

Actually, Option A is easier. Use that one.

### Step 8: Test Full API (2 minutes)

**List Analyses:**
```bash
curl https://bkrptr.com/api/v1/analyses \
  -H "Authorization: Bearer bkrptr_live_YOUR_API_KEY_HERE"
```

Expected: Empty list initially
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

**Create Analysis:**
```bash
curl -X POST https://bkrptr.com/api/v1/analyses \
  -H "Authorization: Bearer bkrptr_live_YOUR_API_KEY_HERE" \
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

Expected: Analysis created
```json
{
  "id": "ana_...",
  "status": "queued",
  "book": {
    "title": "The Lean Startup",
    "author": "Eric Ries"
  },
  "processingMode": "expedited",
  "estimatedCost": 0.06,
  "estimatedCompletionTime": "2025-10-19T...",
  "createdAt": "2025-10-19T..."
}
```

## Common Issues & Solutions

### Issue: "Connection refused" or Database Error
**Solution**: Make sure you linked the Postgres database to the project (Step 2)

### Issue: "Invalid API key"
**Solution**: Create an API key using the admin endpoint (Step 7)

### Issue: Build fails
**Solution**: Check the build logs in Vercel dashboard. Most likely a missing environment variable.

### Issue: Function timeout
**Solution**: We've set maxDuration to 60s. If you need more, upgrade to Vercel Pro.

## Monitoring

### View Logs
```bash
# Install Vercel CLI if you haven't
npm install -g vercel

# View logs
vercel logs https://bkrptr.com
```

Or via dashboard:
https://vercel.com/[your-username]/bkrptr/deployments → Click deployment → View Function Logs

### Performance Monitoring
- Enable Vercel Analytics in project settings
- Enable Speed Insights for real user metrics
- Monitor Core Web Vitals

## Cost Breakdown

### Vercel (Hobby Plan - FREE)
- 100 GB bandwidth/month
- Serverless function execution included
- 100 GB-hours compute time

### Vercel Postgres (Hobby - FREE)
- 256 MB storage
- 60 hours compute time/month
- Should be plenty for getting started

**Upgrade when needed**: If you exceed limits, upgrade to Pro ($20/month for Vercel + $24/month for Postgres)

## Architecture Diagram

```
User Request → bkrptr.com
    ↓
Vercel Edge Network (CDN)
    ↓
Serverless Function (api/index.ts)
    ↓
Express App (src/api/server.ts)
    ↓
Database Service (database-postgres.ts)
    ↓
Vercel Postgres (Managed PostgreSQL)
```

## Success Checklist

- [ ] Created Vercel Postgres database
- [ ] Linked database to project
- [ ] Added ANTHROPIC_API_KEY environment variable
- [ ] Pushed code to trigger deployment
- [ ] Health check returns 200 OK
- [ ] Created production API key
- [ ] Can list analyses (empty array)
- [ ] Can create new analysis
- [ ] Verified logs show no errors

## Need Help?

- **Deployment Guide**: See [VERCEL_DEPLOYMENT.md](/Users/madho/Desktop/cc/bkrptr/VERCEL_DEPLOYMENT.md)
- **Vercel Docs**: https://vercel.com/docs
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres

## What Changed?

The main issue was that `better-sqlite3` uses native C++ bindings that don't work in AWS Lambda (Vercel's serverless runtime). We replaced it with Vercel Postgres which:

- ✅ Works perfectly with serverless
- ✅ Has built-in connection pooling
- ✅ Scales automatically
- ✅ Is managed by Vercel (no ops)
- ✅ Provides better durability than local SQLite files

All your API endpoints remain the same - the migration is transparent to users!
