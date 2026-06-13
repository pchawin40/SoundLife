/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export keeps the app Capacitor-ready: `next build` emits ./out,
  // which can be served from any CDN or bundled into a native shell.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
