# Deploying to Vercel

This guide covers deploying the bkrptr dashboard to Vercel.

## Prerequisites

- [Vercel account](https://vercel.com/signup)
- [Vercel CLI](https://vercel.com/docs/cli) installed (optional, but recommended)

## Quick Deploy

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Configure project:
     - **Framework Preset**: Vite
     - **Root Directory**: Leave blank (or set to `docs/dashboard-prototype` if deploying from monorepo)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-project.vercel.app`

### Option 2: Deploy via CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd /Users/madho/Desktop/cc/bkrptr/docs/dashboard-prototype
   vercel
   ```

4. **Follow prompts**:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? `bkrptr-dashboard`
   - In which directory is your code located? `./`
   - Want to override settings? **N**

5. **Production deploy**:
   ```bash
   vercel --prod
   ```

## Configuration

### Environment Variables

If you need environment variables (e.g., for API endpoints), add them in Vercel:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add variables like:
   - `VITE_API_URL` = `https://api.bkrptr.com`
   - `VITE_AUTH_SECRET` = `your-secret-key`

### Custom Domain

1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain (e.g., `dashboard.bkrptr.com`)
4. Follow DNS configuration instructions

### Routing Configuration

The `vercel.json` file is already configured to handle client-side routing:
- All routes redirect to `/index.html`
- This enables:
  - Homepage at `/`
  - Admin login at `/admin`
  - All admin pages under `/admin/*`

### SEO Configuration

The app automatically sets meta tags:
- **Homepage** (`/`): Indexed by search engines
- **Admin pages** (`/admin`, `/admin/*`): `noindex, nofollow` (hidden from search engines)

## Build Optimization

### Performance Checks

Before deploying, optimize your build:

```bash
npm run build
npm run preview
```

Check:
- [ ] Build completes without errors
- [ ] Homepage loads correctly at `/`
- [ ] Admin login works at `/admin`
- [ ] All routes function properly
- [ ] Assets load correctly

### Bundle Size

Monitor your bundle size:
```bash
npm run build
# Check dist/ folder size
du -sh dist/
```

Typical sizes:
- Small app: < 500KB
- Medium app: 500KB - 2MB
- Large app: > 2MB

## Post-Deployment

### Testing

After deployment, test:

1. **Homepage**:
   - Visit https://your-project.vercel.app
   - Submit a book request
   - Verify form submission

2. **Admin**:
   - Visit https://your-project.vercel.app/admin
   - Login with password (demo: `admin123`)
   - Navigate through all pages
   - Test analysis creation
   - Check API keys page
   - Test bulk upload

3. **SEO**:
   - Check homepage is indexable (view source, look for `<meta name="robots" content="index, follow">`)
   - Check /admin has noindex (view source, look for `<meta name="robots" content="noindex, nofollow">`)

### Monitoring

Vercel provides built-in monitoring:
- **Analytics**: Track visitors, page views
- **Speed Insights**: Monitor performance
- **Logs**: View deployment and runtime logs

Access these in your Vercel dashboard.

## Updating

To deploy updates:

### Via GitHub (automatic):
1. Push changes to your main branch
2. Vercel automatically rebuilds and deploys

### Via CLI:
```bash
vercel --prod
```

## Troubleshooting

### Build Fails

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error: Out of memory**
- Increase Node memory: Add to `package.json`:
  ```json
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
  }
  ```

### Routes Not Working

If you see 404 errors:
1. Verify `vercel.json` exists with rewrites configuration
2. Check build output directory is set to `dist`
3. Ensure all routes in App.tsx match your URL structure

### Meta Tags Not Updating

If SEO tags aren't working:
1. Clear browser cache
2. Check App.tsx `useEffect` for meta tag logic
3. View page source (not devtools) to see actual meta tags

## Security

### Authentication

Current setup uses simple password authentication for demo purposes.

For production:
1. Implement proper backend authentication
2. Use environment variables for secrets
3. Add rate limiting
4. Implement session management
5. Use HTTPS only (Vercel provides this by default)

### Environment Secrets

Never commit:
- API keys
- Passwords
- Auth secrets

Store these in Vercel Environment Variables.

## Cost

Vercel provides:
- **Free tier**: 100GB bandwidth, unlimited projects
- **Pro**: $20/month, more bandwidth and features
- **Enterprise**: Custom pricing

For bkrptr dashboard:
- **Hobby/Free tier** is likely sufficient for development and small-scale production
- Upgrade to Pro if you need:
  - More bandwidth (>100GB/month)
  - Password protection
  - Team collaboration

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [bkrptr GitHub Issues](https://github.com/yourrepo/bkrptr/issues)
