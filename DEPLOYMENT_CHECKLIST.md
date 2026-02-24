# 🚀 Deployment Checklist

Use this checklist to ensure your TeamLead deployment is production-ready.

## 📋 Pre-Deployment

### Assets & Branding
- [ ] Create favicon files (16x16, 32x32, 180x180)
  - Use [RealFaviconGenerator](https://realfavicongenerator.net/)
  - Upload `/public/logo.svg` to generate all sizes
- [ ] Create PWA icons (192x192, 512x512)
- [ ] Create Open Graph image (1200x630px) as `/public/og-image.png`
- [ ] Replace placeholder logo in `/public/logo.svg` with your brand
- [ ] Update domain URLs in:
  - [ ] `index.html` (all meta tags)
  - [ ] `public/sitemap.xml` (all URLs)
  - [ ] `public/manifest.json` (verify URLs)

### Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set all required environment variables:
  - [ ] `VITE_SUPABASE_PROJECT_ID`
  - [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_GEMINI_TEAMLEAD_KEY`
- [ ] Verify `.env` is in `.gitignore`
- [ ] Never commit `.env` to version control

### Code Quality
- [ ] Run linting: `npm run lint`
- [ ] Fix all linting errors
- [ ] Run tests: `npm run test`
- [ ] All tests passing
- [ ] Run security audit: `npm audit`
- [ ] Fix critical vulnerabilities: `npm audit fix`

### Build Testing
- [ ] Test production build: `npm run build`
- [ ] Build completes without errors
- [ ] Check bundle size (dist folder < 2MB)
- [ ] Preview build locally: `npm run preview`
- [ ] Test all routes in preview
- [ ] Verify authentication works
- [ ] Test task creation and management
- [ ] Test team features

### Database Setup
- [ ] Supabase project created
- [ ] Database migrations applied
- [ ] Row Level Security policies enabled
- [ ] Test database connection
- [ ] Verify authentication works

## 🌐 Netlify Setup

### Initial Configuration
- [ ] Install Netlify CLI: `npm install -g netlify-cli`
- [ ] Login to Netlify: `netlify login`
- [ ] Check status: `netlify status`
- [ ] Initialize site: `netlify init` (or link existing)

### Environment Variables
Set all environment variables in Netlify:
```bash
netlify env:set VITE_SUPABASE_PROJECT_ID "your_value"
netlify env:set VITE_SUPABASE_PUBLISHABLE_KEY "your_value"
netlify env:set VITE_SUPABASE_URL "your_value"
netlify env:set VITE_GEMINI_TEAMLEAD_KEY "your_value"
```

- [ ] All environment variables set
- [ ] Verify variables in Netlify dashboard

### Deployment
- [ ] Test deploy: `netlify deploy`
- [ ] Review preview URL
- [ ] Test all functionality on preview
- [ ] Production deploy: `netlify deploy --prod`
- [ ] Verify production URL works

## ✅ Post-Deployment Verification

### Functionality Testing
- [ ] Homepage loads correctly
- [ ] Login/signup works
- [ ] Task creation works
- [ ] Team management works
- [ ] AI features work (task generation)
- [ ] All routes accessible
- [ ] No console errors
- [ ] Mobile responsive design works

### SEO Verification
- [ ] Meta tags visible in page source
- [ ] robots.txt accessible: `https://yourdomain.com/robots.txt`
- [ ] Sitemap accessible: `https://yourdomain.com/sitemap.xml`
- [ ] Test social sharing:
  - [ ] Facebook: [Sharing Debugger](https://developers.facebook.com/tools/debug/)
  - [ ] Twitter: [Card Validator](https://cards-dev.twitter.com/validator)
  - [ ] LinkedIn: [Post Inspector](https://www.linkedin.com/post-inspector/)
- [ ] Verify with [Meta Tags Debugger](https://metatags.io/)

### Performance Testing
- [ ] Run Lighthouse audit (Chrome DevTools)
  - [ ] Performance: 90+ ✅
  - [ ] Accessibility: 95+ ✅
  - [ ] Best Practices: 95+ ✅
  - [ ] SEO: 100 ✅
- [ ] Test on mobile device
- [ ] Page load time < 3 seconds
- [ ] Images load properly
- [ ] No layout shift (CLS < 0.1)

### Security Testing
- [ ] HTTPS enabled (automatic with Netlify)
- [ ] Security headers present: [SecurityHeaders.com](https://securityheaders.com/)
- [ ] No mixed content warnings
- [ ] CSP headers working
- [ ] No exposed API keys in client code

### Search Engine Setup
- [ ] Create Google Search Console account
- [ ] Add and verify your domain
- [ ] Submit sitemap to Google Search Console
- [ ] Create Bing Webmaster Tools account
- [ ] Submit sitemap to Bing

### Analytics (Optional)
- [ ] Set up Google Analytics
- [ ] Enable Netlify Analytics
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Configure uptime monitoring

## 📊 Monitoring

### Regular Checks
- [ ] Monitor Netlify deploy logs
- [ ] Check error rates
- [ ] Monitor performance metrics
- [ ] Review user feedback
- [ ] Check for security updates: `npm audit`

### Weekly Tasks
- [ ] Review analytics
- [ ] Check uptime status
- [ ] Monitor bundle size
- [ ] Review Lighthouse scores

### Monthly Tasks
- [ ] Update dependencies: `npm update`
- [ ] Run security audit: `npm audit`
- [ ] Review and update content
- [ ] Check broken links
- [ ] Update sitemap if routes changed

## 🔧 Troubleshooting

### Build Fails
1. Check Netlify build logs
2. Verify Node version matches local
3. Test build locally: `npm run build`
4. Check for missing dependencies

### Environment Variables Not Working
1. Verify variables are prefixed with `VITE_`
2. Rebuild site after adding variables
3. Check variable names match exactly
4. Clear cache and redeploy

### Routes Return 404
1. Verify `netlify.toml` exists
2. Check SPA redirect rule is present
3. Verify `publish` directory is `dist`

### Performance Issues
1. Run Lighthouse audit
2. Check bundle size
3. Optimize images
4. Review LIGHTHOUSE_OPTIMIZATION.md

## 📚 Documentation

Keep these documents updated:
- [ ] README.md with current setup instructions
- [ ] DEPLOYMENT.md with deployment process
- [ ] Update version in package.json
- [ ] Document any custom configurations

## 🎉 Launch

- [ ] All checklist items completed
- [ ] Team notified of launch
- [ ] Documentation shared
- [ ] Support channels ready
- [ ] Monitoring in place

## 📞 Support Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev/)

---

**Last Updated:** February 24, 2026

**Deployment Status:** ⏳ Pending

Update this checklist as you complete each item!
