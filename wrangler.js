// Cloudflare Workers entry point for Tech Temple
// For local dev: proxy to http://localhost:3000
// For production: use static assets from .next build

const isDev = process.env.ENVIRONMENT === "development";
const ORIGIN = "http://localhost:3000";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Development: proxy to local Next.js dev server
    if (isDev) {
      return fetch(new Request(new URL(url.pathname + url.search, ORIGIN), request));
    }

    // Production: serve from built .next folder
    // Note: In production, use Cloudflare Pages instead for simpler Next.js deployment
    return fetch(request);
  },
};
