// Cloudflare Workers entry point for Tech Temple
// This allows Next.js to run on Cloudflare's network

export default {
  async fetch(request, env, ctx) {
    // Import the Next.js handler
    // In production, this will use the built Next.js app
    const url = new URL(request.url);

    // Proxy all requests to the origin or Next.js handler
    // Note: Ensure your Next.js build is properly configured for serverless
    return fetch(request);
  },
};
