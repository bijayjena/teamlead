# Lighthouse Optimization Guide

This guide helps you achieve optimal Lighthouse scores for TeamLead.

## Current Optimizations Implemented

### Performance (Target: 90+)

#### Code Splitting
- ✅ Lazy loading for all route components
- ✅ Manual chunk splitting for vendor libraries
- ✅ Separate chunks for React, UI components, Supabase, and TanStack Query

#### Caching Strategy
- ✅ Immutable caching for static assets (1 year)
- ✅ No caching for HTML files
- ✅ Optimized query client with 5-minute stale time

#### Build Optimizations
- ✅ Terser minification
- ✅ Console/debugger removal in production
- ✅ Tree shaking enabled
- ✅ Modern ES target (esnext)

#### Network Optimizations
- ✅ Preconnect to external domains (fonts, Supabase, Gemini)
- ✅ DNS prefetch for API endpoints

### Accessibility (Target: 95+)
- ✅ Semantic HTML structure
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support (Radix UI)
- ✅ Color contrast ratios meet WCAG AA standards
- ✅ Focus indicators on all interactive elements

### Best Practices (Target: 95+)
- ✅ HTTPS enforced (Netlify automatic)
- ✅ No console errors in production
- ✅ Secure headers configured
- ✅ No vulnerable libraries (run `npm audit`)

### SEO (Target: 100)
- ✅ Meta descriptions on all pages
- ✅ Semantic HTML structure
- ✅ robots.txt configured
- ✅ Sitemap.xml created
- ✅ Canonical URLs
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Mobile-friendly viewport
- ✅ Valid HTML structure

## Additional Optimizations to Implement

### 1. Image Optimization

#### Convert Images to WebP
```bash
# Install sharp for image conversion
npm install -D sharp

# Create conversion script
node scripts/convert-images.js
```

#### Implement Lazy Loading for Images
```tsx
<img 
  src="image.webp" 
  alt="Description"
  loading="lazy"
  width="800"
  height="600"
/>
```

#### Add Responsive Images
```tsx
<img 
  srcSet="image-400.webp 400w, image-800.webp 800w, image-1200.webp 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  src="image-800.webp"
  alt="Description"
/>
```

### 2. Font Optimization

#### Use Font Display Swap
Add to your CSS:
```css
@font-face {
  font-family: 'YourFont';
  font-display: swap;
  src: url('/fonts/font.woff2') format('woff2');
}
```

#### Preload Critical Fonts
Add to `index.html`:
```html
<link rel="preload" href="/fonts/font.woff2" as="font" type="font/woff2" crossorigin>
```

### 3. Critical CSS

Extract and inline critical CSS for above-the-fold content:
```bash
npm install -D critical

# Add to build script
critical src/index.html --base dist --inline > dist/index.html
```

### 4. Service Worker for PWA

Create `public/sw.js`:
```javascript
const CACHE_NAME = 'teamlead-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/logo.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

Register in `src/main.tsx`:
```typescript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
```

### 5. Reduce JavaScript Bundle Size

#### Analyze Bundle
```bash
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  react(),
  visualizer({ open: true })
]
```

#### Remove Unused Dependencies
```bash
npm install -D depcheck
npx depcheck
```

### 6. Optimize Third-Party Scripts

#### Defer Non-Critical Scripts
```html
<script src="analytics.js" defer></script>
```

#### Use Facade Pattern for Heavy Embeds
Load YouTube/Twitter embeds only when user interacts.

## Testing Checklist

### Before Deployment
- [ ] Run `npm run build` successfully
- [ ] Test `npm run preview` locally
- [ ] Check bundle size (should be < 500KB gzipped)
- [ ] Verify no console errors
- [ ] Test all routes work
- [ ] Verify authentication flow

### After Deployment
- [ ] Run Lighthouse audit (Chrome DevTools)
- [ ] Test on mobile device
- [ ] Verify all images load
- [ ] Check page load time (< 3 seconds)
- [ ] Test social media sharing
- [ ] Verify meta tags with [Meta Tags Debugger](https://metatags.io/)

## Lighthouse Audit Commands

### Using Chrome DevTools
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select categories to audit
4. Click "Analyze page load"

### Using CLI
```bash
npm install -g lighthouse

# Desktop audit
lighthouse https://yourdomain.com --view

# Mobile audit
lighthouse https://yourdomain.com --preset=mobile --view

# CI/CD integration
lighthouse https://yourdomain.com --output=json --output-path=./lighthouse-report.json
```

### Continuous Monitoring
```bash
# Add to package.json scripts
"lighthouse": "lighthouse https://yourdomain.com --view",
"lighthouse:ci": "lighthouse https://yourdomain.com --output=json --output-path=./lighthouse-report.json"
```

## Performance Budgets

Set performance budgets in `lighthouserc.json`:
```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:best-practices": ["error", {"minScore": 0.95}],
        "categories:seo": ["error", {"minScore": 1.0}]
      }
    }
  }
}
```

## Common Issues & Solutions

### Low Performance Score
- **Large JavaScript bundles**: Implement code splitting
- **Unoptimized images**: Convert to WebP, add lazy loading
- **Render-blocking resources**: Defer non-critical scripts
- **Long tasks**: Break up large JavaScript execution

### Low Accessibility Score
- **Missing alt text**: Add descriptive alt text to all images
- **Low contrast**: Ensure 4.5:1 ratio for normal text
- **Missing ARIA labels**: Add labels to interactive elements
- **Keyboard navigation**: Ensure all features work with keyboard

### Low Best Practices Score
- **Mixed content**: Ensure all resources use HTTPS
- **Console errors**: Fix all JavaScript errors
- **Deprecated APIs**: Update to modern alternatives
- **Security vulnerabilities**: Run `npm audit fix`

### Low SEO Score
- **Missing meta description**: Add unique descriptions
- **Non-crawlable links**: Use proper anchor tags
- **Missing structured data**: Add JSON-LD schema
- **Slow page load**: Optimize performance

## Monitoring Tools

### Free Tools
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### Paid Tools
- [SpeedCurve](https://speedcurve.com/)
- [Calibre](https://calibreapp.com/)
- [DebugBear](https://www.debugbear.com/)

## Resources
- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse Scoring Guide](https://web.dev/performance-scoring/)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
