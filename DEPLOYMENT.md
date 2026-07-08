# Cloudflare Deployment Guide

Tech Temple is configured for deployment on Cloudflare Workers using Wrangler.

## Prerequisites

1. Cloudflare account (free tier works)
2. Node.js 18+
3. Wrangler CLI

## Setup

### 1. Install Wrangler
```bash
npm install
```

### 2. Authenticate with Cloudflare
```bash
npx wrangler login
```

This will open your browser and authenticate your local environment with Cloudflare.

### 3. Configure Your Domain (Optional)

Edit `wrangler.toml` to set your domain:

```toml
name = "tech-temple"
route = "your-domain.com/*"
zone_id = "your-zone-id"  # Find in Cloudflare dashboard
```

Get your zone_id from:
1. Log in to Cloudflare dashboard
2. Select your domain
3. Copy Zone ID from the right sidebar

## Deployment

### Build and Deploy
```bash
npm run deploy
```

Or manually:
```bash
npm run build
wrangler deploy
```

### Deploy to Staging/Preview
```bash
wrangler deploy --env production
```

## Local Testing

Test locally before deploying:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Environment Variables

Add secrets for webhook URLs in `wrangler.toml`:

```toml
[env.production]
vars = { BOOKING_WEBHOOK_URL = "https://your-webhook-url.com/webhook" }
```

Or use Wrangler to set secrets:
```bash
wrangler secret put BOOKING_WEBHOOK_URL
```

Access in your code:
```javascript
const webhookUrl = process.env.BOOKING_WEBHOOK_URL;
```

## Troubleshooting

### Build Errors
- Ensure Next.js build succeeds: `npm run build`
- Check Node.js version: `node --version` (should be 18+)

### Deployment Fails
- Verify authentication: `wrangler whoami`
- Check zone_id is correct in `wrangler.toml`
- Review deploy logs: `wrangler deploy --verbose`

### Workers Limits
- Free tier: 100k requests/day
- Timeout: 30 seconds per request (includes video streaming)
- Memory: Limited, video frame count may need tuning on mobile

## Video Streaming on Cloudflare

The video scrubbing works well on Cloudflare Workers. For optimal performance:

1. **Keep video file small**: Use H.264 codec, 1-2 second duration
2. **Use Cloudflare Cache**: Add caching headers
3. **Monitor frame count**: Reduce from 64 to 48 if memory is tight

Add cache headers in your response:
```javascript
response.headers.set('Cache-Control', 'public, max-age=3600');
```

## Advanced: Custom Builds

For production optimization, create a `wrangler-build.js`:

```javascript
import { build } from "next/dist/build/index";

export default {
  async build() {
    await build({
      dir: ".",
      minimalMode: true,
    });
  },
};
```

## Support

For issues:
- Wrangler docs: https://developers.cloudflare.com/workers/
- Next.js Edge: https://nextjs.org/docs/app/building-your-application/deploying
