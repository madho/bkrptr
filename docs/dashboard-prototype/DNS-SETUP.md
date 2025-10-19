# DNS Configuration for bkrptr.com

## 🚀 Deployment Status

✅ **Deployed to Vercel**: https://bkrptr.vercel.app
✅ **GitHub Repository**: https://github.com/madho/bkrptr
✅ **Project**: bkrptr (madhos-projects)

## DNS Records Required

Configure these DNS records in your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):

### Option 1: Apex Domain (bkrptr.com)

```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto or 3600
```

**Alternate A Records** (add all 3 for redundancy):
```
Type: A
Name: @
Value: 76.76.21.21

Type: A
Name: @
Value: 76.76.21.22

Type: A
Name: @
Value: 76.76.21.23
```

### Option 2: www Subdomain (www.bkrptr.com)

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com.
TTL: Auto or 3600
```

### Recommended: Both Apex + www

Set up both configurations above, then add a redirect:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com.
```

And configure Vercel to redirect www → apex (or vice versa) in the dashboard.

---

## Step-by-Step Setup

### Step 1: Access Your DNS Provider

Log in to your domain registrar where you purchased bkrptr.com:
- GoDaddy: domains.godaddy.com
- Namecheap: namecheap.com
- Cloudflare: dash.cloudflare.com
- Google Domains: domains.google.com

### Step 2: Navigate to DNS Settings

Find the DNS management page. Usually under:
- "DNS Settings"
- "Manage DNS"
- "DNS Records"
- "Advanced DNS"

### Step 3: Add A Records

**For Apex Domain (bkrptr.com)**:

1. Click "Add Record" or "+"
2. Select record type: **A**
3. Name/Host: **@** (represents root domain)
4. Value/Points to: **76.76.21.21**
5. TTL: **Auto** or **3600** (1 hour)
6. Save

Repeat for all 3 IP addresses:
- 76.76.21.21
- 76.76.21.22
- 76.76.21.23

### Step 4: Add CNAME for www (Optional but Recommended)

1. Click "Add Record"
2. Select record type: **CNAME**
3. Name/Host: **www**
4. Value/Points to: **cname.vercel-dns.com.**
5. TTL: **Auto** or **3600**
6. Save

**Important**: Include the trailing dot (`.`) after `com`

### Step 5: Remove Conflicting Records

Delete any existing A or CNAME records for:
- `@` (root/apex)
- `www`

These might be pointing to old hosting providers.

### Step 6: Verify in Vercel Dashboard

1. Go to: https://vercel.com/madhos-projects/bkrptr
2. Click "Domains" tab
3. You should see: `bkrptr.com` listed
4. Status should show: **Valid** or **Configured**

---

## DNS Propagation

**Timeline**: DNS changes take 15 minutes to 48 hours to propagate globally.

**Check propagation**:
```bash
# Check A record
dig bkrptr.com

# Check CNAME record
dig www.bkrptr.com

# Check from different locations
https://www.whatsmydns.net/#A/bkrptr.com
```

---

## Verification Commands

### Check A Records
```bash
nslookup bkrptr.com
# Should return: 76.76.21.21, 76.76.21.22, 76.76.21.23
```

### Check CNAME
```bash
nslookup www.bkrptr.com
# Should return: cname.vercel-dns.com
```

### Check from Multiple Locations
Visit: https://www.whatsmydns.net/#A/bkrptr.com

### Test in Browser
Once DNS propagates:
- http://bkrptr.com → Should load your dashboard
- http://www.bkrptr.com → Should load your dashboard

---

## Expected Configuration Summary

After setup, your DNS should look like this:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 3600 |
| A | @ | 76.76.21.22 | 3600 |
| A | @ | 76.76.21.23 | 3600 |
| CNAME | www | cname.vercel-dns.com. | 3600 |

---

## SSL Certificate (HTTPS)

Vercel automatically provisions SSL certificates via Let's Encrypt.

**After DNS propagates**:
1. Vercel detects your domain
2. Requests SSL certificate
3. Certificate issued (usually < 5 minutes)
4. HTTPS enabled automatically

**Force HTTPS**: Vercel redirects HTTP → HTTPS by default.

---

## Troubleshooting

### "Domain not working after 48 hours"

**Check DNS with**:
```bash
dig bkrptr.com
```

**Should show**:
```
;; ANSWER SECTION:
bkrptr.com.    3600    IN    A    76.76.21.21
bkrptr.com.    3600    IN    A    76.76.21.22
bkrptr.com.    3600    IN    A    76.76.21.23
```

**If not, verify**:
- A records point to Vercel IPs
- No conflicting records exist
- TTL isn't set too high (keep < 3600)

### "Invalid Configuration" in Vercel

1. Go to Vercel Dashboard → Domains
2. Click "Refresh" or "Re-verify"
3. Check for nameserver issues
4. Ensure domain isn't locked or transferred

### "Certificate Error" or "Not Secure"

**SSL takes 5-60 minutes after DNS propagates.**

If delayed:
1. Check DNS is fully propagated
2. Visit: vercel.com/dashboard → Domains → "Request Certificate"
3. Clear browser cache
4. Try incognito/private mode

### "www works but apex doesn't" (or vice versa)

Ensure BOTH A records and CNAME are configured:
- A records for apex (@)
- CNAME for www

Then configure redirect in Vercel:
1. Domains tab
2. Click domain → Settings
3. Set redirect: www → apex or apex → www

---

## Provider-Specific Instructions

### GoDaddy
1. My Products → Domain → DNS
2. Records section → Add
3. Type: A, Name: @, Value: 76.76.21.21
4. Repeat for all 3 IPs
5. Add CNAME: www → cname.vercel-dns.com

### Namecheap
1. Domain List → Manage
2. Advanced DNS tab
3. Add New Record
4. Type: A Record, Host: @, Value: 76.76.21.21
5. Add CNAME: Host: www, Value: cname.vercel-dns.com

### Cloudflare
1. Websites → Select domain
2. DNS → Records
3. Add record: A, Name: @, IPv4: 76.76.21.21
4. **Important**: Set proxy status to "DNS only" (gray cloud)
5. Add CNAME: www → cname.vercel-dns.com

### Google Domains
1. My domains → Manage
2. DNS → Manage custom records
3. Create record: A, @, 76.76.21.21
4. Create record: CNAME, www, cname.vercel-dns.com

---

## Vercel Dashboard Setup

### Add Domain in Vercel

1. Visit: https://vercel.com/madhos-projects/bkrptr
2. Click "Domains" tab
3. Click "Add" or "Add Domain"
4. Enter: **bkrptr.com**
5. Click "Add"
6. Follow verification instructions

### Configure Redirects

**Option 1: www → apex**
- Primary: bkrptr.com
- Redirect: www.bkrptr.com → bkrptr.com

**Option 2: apex → www**
- Primary: www.bkrptr.com
- Redirect: bkrptr.com → www.bkrptr.com

**Recommended**: Use apex (bkrptr.com) as primary for cleaner URLs.

---

## Testing Checklist

Once DNS propagates, test:

- [ ] http://bkrptr.com loads homepage
- [ ] http://www.bkrptr.com loads homepage
- [ ] https://bkrptr.com loads (SSL works)
- [ ] https://www.bkrptr.com loads (SSL works)
- [ ] HTTP redirects to HTTPS
- [ ] www redirects to apex (if configured)
- [ ] /admin loads login page
- [ ] Homepage shows book request form
- [ ] Admin login works (password: admin123)
- [ ] No mixed content warnings
- [ ] Meta robots tags correct (view source)

---

## Current Deployment URLs

**Production Vercel URL**: https://bkrptr.vercel.app

**Custom Domain** (after DNS setup):
- Primary: https://bkrptr.com
- www: https://www.bkrptr.com (redirects to primary)

---

## Support

**Vercel Support**: https://vercel.com/support
**DNS Propagation Checker**: https://www.whatsmydns.net
**SSL Checker**: https://www.ssllabs.com/ssltest/

**Need help?**
- Check Vercel deployment logs: `vercel logs`
- View domain status: https://vercel.com/madhos-projects/bkrptr/settings/domains
- Contact Vercel support if domain won't verify after 48 hours

---

## Summary

1. **Add 3 A records** pointing @ to Vercel IPs
2. **Add 1 CNAME** pointing www to cname.vercel-dns.com
3. **Wait 15min-48hrs** for DNS propagation
4. **Verify in Vercel** dashboard that domain shows "Valid"
5. **Test HTTPS** works on both bkrptr.com and www.bkrptr.com
6. **Done!** 🎉

Your dashboard will be live at **bkrptr.com**!
