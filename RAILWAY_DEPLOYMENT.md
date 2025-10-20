# Railway Deployment Guide

## Quick Deploy (5 minutes)

### Step 1: Create Project on Railway

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Select your `bkrptr` repository
5. Railway will auto-detect the configuration

### Step 2: Configure Environment Variables

In the Railway dashboard, go to your project → **Variables** tab:

```
ANTHROPIC_API_KEY=your_claude_api_key_here
NODE_ENV=production
PORT=3000
```

Optional:
```
WEBHOOK_SECRET=your_random_secret_here
```

### Step 3: Deploy

Railway will automatically:
- Run `npm install && npm run build` (from railway.json)
- Start the server with `node dist/api/index.js`
- Provide a URL like: `https://bkrptr-production-xxxx.up.railway.app`

### Step 4: Configure Custom Domain (Optional)

1. In Railway dashboard, go to **Settings** → **Domains**
2. Click **"Add Custom Domain"**
3. Enter: `api.bkrptr.com`
4. Railway will provide DNS configuration:
   - Add a CNAME record in Hover: `api → your-app.up.railway.app`

### Step 5: Test Your API

```bash
# Health check
curl https://your-url.up.railway.app/api/v1/health

# Should return:
{
  "status": "healthy",
  "timestamp": "2025-10-19T...",
  "version": "1.0.0",
  "service": "bkrptr-api"
}
```

## What Railway Will Do Automatically

1. **Build**: Runs TypeScript compilation
2. **Database**: Creates SQLite file at `data/bkrptr.db` (persists on disk)
3. **API Key**: Auto-generates default API key on first request
4. **Monitoring**: Provides logs, metrics, and health checks
5. **SSL**: Automatic HTTPS certificates

## Getting Your API Key

After first deployment, check Railway logs:

```bash
railway logs
```

Look for:
```
Default API key created: bkrptr_live_xxxxx...
```

Or use the API to create a new key (see NEXT_STEPS.md).

## Cost

**Railway Starter Plan**: $5/month
- 500 hours of execution time
- Persistent storage included
- No database fees (SQLite is a file)

## Troubleshooting

### Build Fails
- Check Railway logs for errors
- Ensure `npm run build` works locally first

### API Returns 500 Error
- Check environment variables are set (especially `ANTHROPIC_API_KEY`)
- Check Railway logs for crash details

### Database Issues
- Railway provides persistent disk storage
- SQLite file location: `data/bkrptr.db`
- Database resets if you delete the service (backup important!)

## CLI Deployment (Alternative)

If you prefer CLI:

```bash
# Login to Railway
railway login

# Link project
railway link

# Deploy
railway up

# View logs
railway logs
```

## Architecture

```
Internet → Railway (api.bkrptr.com)
              ↓
          Express Server (Node.js)
              ↓
          SQLite Database (data/bkrptr.db)
```

Simple, predictable, and cost-effective.

---

**Need help?** Check Railway docs: https://docs.railway.app
