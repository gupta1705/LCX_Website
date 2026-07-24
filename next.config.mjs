/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The site is fully static (no API routes, server actions, middleware, or
  // next/image) — export plain HTML/CSS/JS so any static host (Cloudflare
  // Pages, Netlify, GitHub Pages) can serve it directly with no adapter.
  // This specifically sidesteps Cloudflare's default Workers build path,
  // which runs Next through @opennextjs/cloudflare — an adapter for apps
  // that need live SSR on the edge, and one that refuses to build on this
  // Next version (14.2.35 is outside Next's 2-year support window).
  output: "export",
};

export default nextConfig;
