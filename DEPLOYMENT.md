# Deployment Guide

This guide covers deploying TeamLead to Netlify with optimal configuration.

## Pre-Deployment Checklist

### 1. Assets Setup
- [ ] Create and add all favicon files (see `public/ASSETS_README.md`)
- [ ] Create og-image.png for social media sharing (1200x630px)
- [ ] Create PWA icons (192x192 and 512x512)
- [ ] Update domain URLs in `index.html` and `public/sitemap.xml`

### 2. Environment Variables
Ensure you have these environment variables ready:
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_GEMINI_TEAMLEAD_KEY`

### 3. Code Quality
```bash
# Run linting
npm run lint

# Run tests
npm run test

# Test production build locally
npm run build
npm run preview
```

## Netlify Deployment

### Option 1: Netlify CLI (Recommended)

#### Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Check Status
```bash
netlify status
```

#### Login (if needed)
```bash
netlify login
```

#### Link or Create Site
```bash
# If you have a Git repository
netlify init

# Or link to existing site
netlify link
```

#### Set Environment Variables
```bash
netlify env:set VITE_SUPABASE_PROJECT_ID "your_project_id"
netlify env:set VITE_SUPABASE_PUBLISHABLE_KEY "your_key"
netlify env:set VITE_SUPABASE_URL "your_url"
netlify env:set VITE_GEMINI_TEAMLEAD_KEY "your_gemini_key"
```

#### Deploy
```bash
# Preview deploy (test first)
netlify deploy

# Production deploy
netlify deploy --prod
```

### Option 2: Git-Based Deployment

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider (GitHub, GitLab, Bitbucket)
   - Select your repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - (These are already configured in `netlify.toml`)

3. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add all required variables from the checklist above

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically deploy on every push to your main branch

## Post-Deployment

### 1. Verify Deployment
- [ ] Site loads correctly
- [ ] All routes work (test navigation)
- [ ] Authentication works (login/signup)
- [ ] Environment variables are working
- [ ] Images and assets load properly

### 2. SEO Verification
- [ ] Test social media sharing (Facebook, Twitter, LinkedIn)
- [ ] Verify meta tags using [Meta Tags Debugger](https://metatags.io/)
- [ ] Check robots.txt is accessible: `https://yourdomain.com/robots.txt`
- [ ] Verify sitemap: `https://yourdomain.com/sitemap.xml`
- [ ] Submit sitemap to Google Search Console

### 3. Performance Testing
Run Lighthouse audit:
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://yourdomain.com --view
```

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### 4. Security Headers
Verify security headers are applied:
- Use [Security Headers](https://securityheaders.com/) to test
- All headers are configured in `netlify.toml`

### 5. Custom Domain (Optional)
1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS records as instructed
4. Enable HTTPS (automatic with Netlify)

## Monitoring & Maintenance

### Analytics
Consider adding:
- Google Analytics
- Netlify Analytics (built-in)
- Sentry for error tracking

### Regular Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Continuous Deployment
With Git-based deployment:
- Push to main branch → Auto-deploy to production
- Push to other branches → Create deploy previews
- Pull requests → Automatic preview deployments

## Troubleshooting

### Build Fails
1. Check Netlify build logs
2. Verify all dependencies are in `package.json`
3. Test build locally: `npm run build`
4. Check Node version compatibility

### Environment Variables Not Working
1. Verify variables are prefixed with `VITE_`
2. Rebuild site after adding variables
3. Check variable names match exactly

### Routes Return 404
- Verify `netlify.toml` has the SPA redirect rule
- Check that `publish` directory is set to `dist`

### Performance Issues
1. Check bundle size: `npm run build` and review output
2. Optimize images (use WebP format)
3. Enable Netlify's asset optimization
4. Review Lighthouse report for specific recommendations

## Rollback
If something goes wrong:
```bash
# Via CLI
netlify rollback

# Or via Dashboard
# Go to Deploys → Click on previous successful deploy → "Publish deploy"
```

## Support Resources
- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Documentation](https://supabase.com/docs)
