# 🚀 Quick Start Deployment Guide

Get TeamLead deployed to Netlify in under 10 minutes!

## Prerequisites

- Node.js installed
- Git repository (GitHub, GitLab, or Bitbucket)
- Supabase project set up
- Google Gemini API key

## Step 1: Prepare Assets (5 minutes)

### Generate Favicons
1. Visit https://realfavicongenerator.net/
2. Upload `/public/logo.svg`
3. Download the generated package
4. Extract all files to `/public` directory

### Create OG Image
1. Visit https://www.canva.com/
2. Use "Facebook Post" template (1200x630)
3. Add your logo and tagline
4. Download as PNG
5. Save as `/public/og-image.png`

### Update Domain URLs
Replace `https://yourdomain.com/` in:
- `index.html` (search and replace all occurrences)
- `public/sitemap.xml` (update all `<loc>` tags)
- `package.json` (update lighthouse script)

## Step 2: Install Netlify CLI (1 minute)

```bash
npm install -g netlify-cli
```

## Step 3: Login to Netlify (1 minute)

```bash
netlify login
```

This will open your browser for authentication.

## Step 4: Initialize Site (1 minute)

```bash
netlify init
```

Follow the prompts:
1. Choose "Create & configure a new site"
2. Select your team
3. Enter site name (or leave blank for random)
4. Build command: `npm run build` (already configured)
5. Publish directory: `dist` (already configured)

## Step 5: Set Environment Variables (2 minutes)

```bash
netlify env:set VITE_SUPABASE_PROJECT_ID "your_project_id"
netlify env:set VITE_SUPABASE_PUBLISHABLE_KEY "your_publishable_key"
netlify env:set VITE_SUPABASE_URL "https://your_project_id.supabase.co"
netlify env:set VITE_GEMINI_TEAMLEAD_KEY "your_gemini_api_key"
```

Replace the values with your actual credentials from:
- Supabase: Project Settings → API
- Gemini: https://makersuite.google.com/app/apikey

## Step 6: Deploy! (2 minutes)

### Test Deploy First (Recommended)
```bash
netlify deploy
```

This creates a preview URL. Test it thoroughly:
- [ ] Login works
- [ ] Task creation works
- [ ] Team features work
- [ ] No console errors

### Production Deploy
```bash
netlify deploy --prod
```

🎉 Your site is now live!

## Step 7: Post-Deployment (Optional but Recommended)

### Submit to Search Engines
1. **Google Search Console**
   - Go to https://search.google.com/search-console
   - Add your property
   - Submit sitemap: `https://yourdomain.com/sitemap.xml`

2. **Bing Webmaster Tools**
   - Go to https://www.bing.com/webmasters
   - Add your site
   - Submit sitemap

### Run Lighthouse Audit
```bash
npm run lighthouse
```

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### Set Up Analytics (Optional)
Add Google Analytics to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Troubleshooting

### Build Fails
```bash
# Test build locally first
npm run build

# If successful locally, check Netlify logs
netlify logs
```

### Environment Variables Not Working
```bash
# List all environment variables
netlify env:list

# Verify they're set correctly
# Remember: Must be prefixed with VITE_
```

### 404 on Routes
- Verify `netlify.toml` exists in root
- Check that it contains the SPA redirect rule
- Redeploy if needed

## Continuous Deployment

### Automatic Deploys
Once connected to Git:
- Push to main branch → Auto-deploy to production
- Push to other branches → Create deploy previews
- Pull requests → Automatic preview deployments

### Manual Deploys
```bash
# Preview
npm run deploy:preview

# Production
npm run deploy:prod
```

## Custom Domain (Optional)

1. Go to Netlify dashboard
2. Site settings → Domain management
3. Add custom domain
4. Follow DNS configuration instructions
5. HTTPS is automatic!

## Monitoring

### Netlify Dashboard
- View deploy logs
- Monitor bandwidth
- Check build minutes
- Review analytics

### Uptime Monitoring
Consider:
- [UptimeRobot](https://uptimerobot.com/) (Free)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

## Next Steps

1. ✅ Site is deployed
2. ✅ Environment variables configured
3. ✅ Custom domain (optional)
4. ✅ Analytics set up (optional)
5. ✅ Monitoring in place (optional)

## Resources

- [Full Deployment Guide](./DEPLOYMENT.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Lighthouse Optimization](./LIGHTHOUSE_OPTIMIZATION.md)
- [SEO Guide](./SEO_GUIDE.md)

## Support

- Netlify Docs: https://docs.netlify.com/
- Netlify Support: https://www.netlify.com/support/
- Community: https://answers.netlify.com/

---

**Estimated Total Time: 10-15 minutes**

**Difficulty: Easy** ⭐⭐☆☆☆

Good luck with your deployment! 🚀
