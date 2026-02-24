# 🚀 TODO Before Launch

Quick checklist of remaining tasks before your first deployment.

## ⏰ Time Required: ~15 minutes

---

## 1️⃣ Generate Favicons (5 minutes)

### What to do:
1. Visit https://realfavicongenerator.net/
2. Upload `/public/logo.svg`
3. Download the generated package
4. Extract ALL files to `/public/` directory

### Files you'll get:
- ✅ favicon.ico
- ✅ favicon-16x16.png
- ✅ favicon-32x32.png
- ✅ apple-touch-icon.png
- ✅ icon-192.png
- ✅ icon-512.png
- ✅ mstile-150x150.png (optional)

### Why:
Your site needs proper favicons for browser tabs, bookmarks, and mobile home screens.

---

## 2️⃣ Create OG Image (5 minutes)

### What to do:
1. Visit https://www.canva.com/
2. Create new design → "Facebook Post" (1200x630)
3. Add your logo and tagline: "AI-Powered Team Management"
4. Download as PNG
5. Save as `/public/og-image.png`

### Design tips:
- Use your brand color: #2563eb (blue)
- Keep text large and readable
- Center important content
- High contrast

### Why:
This image appears when someone shares your site on social media (Facebook, Twitter, LinkedIn).

---

## 3️⃣ Update Domain URLs (2 minutes)

### What to do:
Replace `https://yourdomain.com/` with your actual domain in:

#### File: `index.html`
Search for: `https://yourdomain.com/`
Replace with: `https://your-actual-domain.com/`
(Appears in multiple meta tags)

#### File: `public/sitemap.xml`
Search for: `https://yourdomain.com/`
Replace with: `https://your-actual-domain.com/`
(Appears in all `<loc>` tags)

#### File: `package.json`
Update the lighthouse script:
```json
"lighthouse": "lighthouse https://your-actual-domain.com --view"
```

### Why:
Proper URLs are essential for SEO, social sharing, and sitemaps.

---

## 4️⃣ Verify Environment Variables (1 minute)

### What to check:
Make sure you have these values ready:

```bash
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_key"
VITE_SUPABASE_URL="https://your_project_id.supabase.co"
VITE_GEMINI_TEAMLEAD_KEY="your_gemini_key"
```

### Where to find them:
- **Supabase**: Project Settings → API
- **Gemini**: https://makersuite.google.com/app/apikey

### Why:
Your app won't work without these credentials.

---

## 5️⃣ Test Build Locally (2 minutes)

### What to do:
```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

### What to test:
- [ ] Site loads
- [ ] Login works
- [ ] No console errors
- [ ] All routes work

### Why:
Catch any issues before deploying to production.

---

## ✅ Ready to Deploy!

Once you've completed all 5 steps above, you're ready to deploy:

```bash
# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Login
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

---

## 📋 Quick Checklist

Before running `netlify deploy --prod`:

- [ ] Favicons generated and in `/public/`
- [ ] OG image created as `/public/og-image.png`
- [ ] Domain URLs updated in all files
- [ ] Environment variables ready
- [ ] Local build tested successfully
- [ ] No console errors in preview
- [ ] All features work in preview

---

## 🆘 Need Help?

### Detailed Guides:
- **Quick Start**: `QUICK_START_DEPLOYMENT.md`
- **Full Guide**: `DEPLOYMENT.md`
- **Checklist**: `DEPLOYMENT_CHECKLIST.md`
- **Assets**: `public/ASSETS_README.md`
- **Favicons**: `scripts/generate-favicons.md`

### Common Issues:

**Q: Build fails locally?**
A: Run `npm install` and try again. Check for TypeScript errors.

**Q: Don't have a domain yet?**
A: Use the Netlify-provided domain (e.g., `your-site.netlify.app`) for now. You can add a custom domain later.

**Q: Don't have all environment variables?**
A: You need at least Supabase credentials. Get them from your Supabase project dashboard.

---

## 🎉 After Launch

Once deployed:

1. **Test everything** on the live site
2. **Submit sitemap** to Google Search Console
3. **Test social sharing** on Facebook/Twitter
4. **Run Lighthouse audit**: `npm run lighthouse`
5. **Monitor** for errors in Netlify dashboard

---

**Estimated Total Time**: 15 minutes
**Difficulty**: Easy ⭐⭐☆☆☆

You've got this! 🚀
