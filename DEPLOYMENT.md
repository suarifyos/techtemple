# Cloudflare Pages Deployment Guide

Tech Temple deploys to **Cloudflare Pages** as a static export + one Pages Function.

## How it's wired

- `next.config.mjs` has `output: "export"` → the whole site builds to `./out` as static HTML/JS.
- The booking API lives in `functions/api/book.js` — a **Pages Function** that serves
  `POST /api/book`. (Static exports can't run Next.js route handlers, so the API
  moved here. The browser still calls `/api/book` exactly as before.)
- `wrangler.toml` sets `pages_build_output_dir = "out"`.

> ⚠️ Do **not** try to deploy the `.next` folder or use `@cloudflare/next-on-pages`
> (deprecated). This project uses a plain static export, which is simpler and reliable.

## Local development

Normal Next.js dev (hot reload, but the `/api/book` Function is NOT active here):
```bash
npm install
npm run dev            # http://localhost:3000
```

Test the **real** production output — static site + the `/api/book` Function — exactly
as Cloudflare will run it:
```bash
npm run build          # produces ./out
npx wrangler pages dev out
```
Then open the printed URL (default `http://127.0.0.1:8788`).

Verified working locally:
- `GET /` → 200 (static page)
- `GET /video/hero.mp4` → 200 `video/mp4`
- `GET /favicon.svg` → 200 `image/svg+xml`
- `POST /api/book` (missing fields) → 400
- `POST /api/book` (valid) → 200 `{ ok: true }` and forwards to the webhook

## Deploy

### Option A — Git integration (recommended)
1. Push to GitHub.
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Pick the repo. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
4. **Save and Deploy.** Every push auto-deploys; PRs get preview URLs.

### Option B — CLI (Wrangler v4)
```bash
npm run build
npx wrangler login
npx wrangler pages deploy out
```
> In Wrangler v4 the command is `pages deploy` (the old `pages publish` is removed).

## Environment variables

The webhook URL defaults to `https://kau.lol/webhook/tech-temple-bookimg`. Override it
with `BOOKING_WEBHOOK_URL`:

- **Dashboard:** Pages project → **Settings → Environment variables** → add
  `BOOKING_WEBHOOK_URL`.
- **CLI (encrypted secret):**
  ```bash
  npx wrangler pages secret put BOOKING_WEBHOOK_URL --project-name tech-temple
  ```

The Function reads it via `env.BOOKING_WEBHOOK_URL` (see `functions/api/book.js`).

## Custom domain

Pages project → **Custom domains** → add your domain and follow the DNS steps.

## Troubleshooting

**Build fails on the API route** — make sure `app/api/` no longer exists; the API is
now `functions/api/book.js`. A stray `app/api/**/route.js` breaks `output: "export"`.

**`/api/book` returns 404 locally** — you're on `npm run dev` (Next.js only). Use
`npx wrangler pages dev out` to exercise Pages Functions.

**Video/assets 404 after deploy** — confirm they're in `public/` so they land in `out/`.
Check `ls out/video/`.

**Wrangler asks about entry-point / "Missing entry-point"** — you ran `wrangler deploy`
(Workers). Use `wrangler pages deploy out` instead.

## Reference
- Pages direct upload: https://developers.cloudflare.com/pages/get-started/direct-upload/
- Pages Functions: https://developers.cloudflare.com/pages/functions/
- Next.js static exports: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
