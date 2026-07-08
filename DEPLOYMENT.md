# Cloudflare Pages Deployment Guide

Tech Temple is configured for fast, easy deployment on **Cloudflare Pages** (recommended for Next.js).

## Quick Start (Easiest)

### 1. Local Setup
```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to test locally.

### 2. Deploy to Cloudflare Pages

**Option A: Direct from GitHub (Recommended)**
1. Push code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. **Pages** → **Create a project** → **Connect to Git**
4. Select your `tech-temple` repo
5. Build settings auto-detect Next.js:
   - Framework: Next.js
   - Build command: `npm run build`
   - Build output directory: `.next`
6. Click **Deploy**

**Option B: CLI Deploy**
```bash
npm install -g wrangler
wrangler login
wrangler pages deploy .next
```

## Environment Variables

Set webhook URL for booking form:

1. **GitHub + Pages**: 
   - Go to Pages project settings
   - **Environment variables** → Add `BOOKING_WEBHOOK_URL`

2. **CLI**: 
   ```bash
   wrangler pages publish .next --env production
   ```

In your code:
```javascript
const webhookUrl = process.env.BOOKING_WEBHOOK_URL || "https://kau.lol/webhook/tech-temple-bookimg";
```

## Custom Domain

1. In Cloudflare Dashboard → Pages → tech-temple
2. **Custom domains** → Add your domain
3. Update DNS records as instructed

## Production Builds

Before deploying, ensure build is clean:
```bash
npm run build
```

Check output folder:
```bash
ls -la .next/
```

Deploy only `.next/` folder (not node_modules):
```bash
wrangler pages publish .next
```

## Local Testing Before Deploy

Always test production build locally:
```bash
npm run build
npm start
```

Visit `http://localhost:3000`

## Video & Performance

- Video streaming works great on Cloudflare Pages
- Free tier includes unlimited bandwidth
- Edge caching automatically handles `.mp4` files
- Frame decoding is client-side (no server load)

## Troubleshooting

**Build fails?**
```bash
npm run build
```

Check for errors. Most common: missing env vars.

**Can't access site after deploy?**
- Check Pages build logs in dashboard
- Ensure `.next` folder builds successfully
- Verify DNS if using custom domain

**Static assets not loading?**
- Check `.next/static` folder exists
- Verify public folder has `/video/hero.mp4`

## Clean Redeploy

```bash
rm -rf .next node_modules
npm install
npm run build
wrangler pages publish .next
```

## Support

- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Next.js: https://nextjs.org/docs/deployment
