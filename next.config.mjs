/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static HTML export for Cloudflare Pages.
  // The one API route (/api/book) is served by a Pages Function
  // in functions/api/book.js instead of a Next.js route handler.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
