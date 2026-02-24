# Assets Setup Guide

This document explains the required assets for production deployment.

## Required Assets

### Favicons
Create the following favicon files and place them in the `/public` directory:

1. **favicon-16x16.png** - 16x16px PNG
2. **favicon-32x32.png** - 32x32px PNG
3. **apple-touch-icon.png** - 180x180px PNG (for iOS devices)
4. **favicon.ico** - Multi-size ICO file (16x16, 32x32, 48x48)

### PWA Icons
For Progressive Web App support:

1. **icon-192.png** - 192x192px PNG
2. **icon-512.png** - 512x512px PNG

### Social Media Images
For optimal social media sharing:

1. **og-image.png** - 1200x630px PNG (Open Graph image for Facebook, LinkedIn, etc.)
   - Should include your logo and a brief tagline
   - Use high contrast and readable text
   - Keep important content in the center (safe zone)

## Design Recommendations

### Logo Design
Your logo should:
- Be simple and recognizable at small sizes
- Work well in both light and dark modes
- Use your brand colors (primary: #2563eb - blue)
- Be scalable (vector format recommended)

### Color Scheme
Based on your current theme:
- Primary: #2563eb (Blue)
- Background: #ffffff (White)
- Text: #1f2937 (Dark Gray)

### Tools for Creating Assets

#### Online Tools (Free)
- **Favicon Generator**: https://realfavicongenerator.net/
- **PWA Icon Generator**: https://www.pwabuilder.com/imageGenerator
- **Social Media Image**: https://www.canva.com/ (use "Facebook Post" template)

#### Design Software
- **Figma** (Free): https://www.figma.com/
- **Adobe Express** (Free tier): https://www.adobe.com/express/
- **GIMP** (Free): https://www.gimp.org/

## Quick Setup Steps

1. **Create your logo** in SVG or high-resolution PNG format
2. **Generate favicons** using https://realfavicongenerator.net/
   - Upload your logo
   - Download the generated package
   - Extract files to `/public` directory
3. **Create PWA icons** by resizing your logo to 192x192 and 512x512
4. **Design og-image.png** with your logo and tagline (1200x630px)
5. **Update URLs** in `index.html` and `public/sitemap.xml` with your actual domain

## Verification

After adding assets, verify:
- [ ] Favicon appears in browser tab
- [ ] Apple touch icon works on iOS devices
- [ ] PWA icons display correctly when installed
- [ ] Social media preview shows correct image when sharing links
- [ ] All images are optimized (compressed) for web

## Current Placeholders

The following files are currently using placeholders:
- `/public/placeholder.svg` - Replace with actual logo
- All favicon files need to be created
- `og-image.png` needs to be created

## Domain Configuration

Don't forget to update these files with your actual domain:
- `index.html` - Update all `https://yourdomain.com/` references
- `public/sitemap.xml` - Update all URLs
- `public/manifest.json` - Already configured, but verify URLs if needed
