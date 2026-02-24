# Favicon Generation Guide

This guide helps you generate all required favicon and icon files for TeamLead.

## Quick Method: Online Generator (Recommended)

### Using RealFaviconGenerator (Free)

1. **Visit**: https://realfavicongenerator.net/

2. **Upload Your Logo**
   - Use `/public/logo.svg` or a high-resolution PNG (at least 512x512px)
   - The logo should be square with transparent background

3. **Configure Settings**
   - **iOS**: Keep default settings (180x180)
   - **Android Chrome**: Use theme color `#2563eb`
   - **Windows Metro**: Use tile color `#2563eb`
   - **macOS Safari**: Keep default
   - **Favicon**: Generate all sizes

4. **Generate**
   - Click "Generate your Favicons and HTML code"
   - Download the package

5. **Install**
   ```bash
   # Extract the downloaded zip
   # Copy all files to /public directory
   # The generator provides the HTML code, but we already have it configured
   ```

## Manual Method: Using ImageMagick

If you prefer command-line tools:

```bash
# Install ImageMagick
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: apt-get install imagemagick

# Convert your logo to different sizes
convert logo.png -resize 16x16 favicon-16x16.png
convert logo.png -resize 32x32 favicon-32x32.png
convert logo.png -resize 180x180 apple-touch-icon.png
convert logo.png -resize 192x192 icon-192.png
convert logo.png -resize 512x512 icon-512.png

# Create multi-size ICO file
convert logo.png -define icon:auto-resize=16,32,48 favicon.ico
```

## Required Files Checklist

Place all these files in the `/public` directory:

- [ ] `favicon.ico` - Multi-size ICO (16x16, 32x32, 48x48)
- [ ] `favicon-16x16.png` - 16x16 PNG
- [ ] `favicon-32x32.png` - 32x32 PNG
- [ ] `apple-touch-icon.png` - 180x180 PNG (for iOS)
- [ ] `icon-192.png` - 192x192 PNG (for PWA)
- [ ] `icon-512.png` - 512x512 PNG (for PWA)
- [ ] `og-image.png` - 1200x630 PNG (for social media)

## Design Tips

### Logo Requirements
- **Format**: SVG or high-resolution PNG (minimum 512x512px)
- **Background**: Transparent
- **Shape**: Square or circular
- **Colors**: Should work on both light and dark backgrounds
- **Simplicity**: Should be recognizable at small sizes (16x16)

### Color Scheme
Based on TeamLead's theme:
- Primary: `#2563eb` (Blue)
- Background: `#ffffff` (White)
- Text: `#1f2937` (Dark Gray)

### Testing
After generating, test your favicons:
1. Clear browser cache
2. Reload your site
3. Check favicon in:
   - Browser tab
   - Bookmarks
   - iOS home screen
   - Android home screen
   - Windows taskbar

## Optimization

### Compress Images
Use these tools to reduce file size:

- **TinyPNG**: https://tinypng.com/
- **Squoosh**: https://squoosh.app/
- **ImageOptim** (Mac): https://imageoptim.com/

### Target Sizes
- `favicon.ico`: < 15KB
- `favicon-16x16.png`: < 1KB
- `favicon-32x32.png`: < 2KB
- `apple-touch-icon.png`: < 10KB
- `icon-192.png`: < 15KB
- `icon-512.png`: < 30KB
- `og-image.png`: < 300KB

## Verification

### Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Search for "favicon"
5. Verify all files load with 200 status

### Online Tools
- [Favicon Checker](https://realfavicongenerator.net/favicon_checker)
- [Favicon.io](https://favicon.io/)

## Current Status

The project includes:
- ✅ `logo.svg` - Basic team icon logo
- ✅ `logo-text.svg` - Logo with text
- ⏳ Favicon files need to be generated
- ⏳ OG image needs to be created

## Next Steps

1. Generate all favicon files using RealFaviconGenerator
2. Create og-image.png (1200x630) for social media
3. Place all files in `/public` directory
4. Test on multiple devices
5. Verify with online tools

## Resources

- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)
- [Favicon Cheat Sheet](https://github.com/audreyfeldroy/favicon-cheat-sheet)
- [Web App Manifest](https://web.dev/add-manifest/)
