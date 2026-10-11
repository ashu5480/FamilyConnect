/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep output 가볍고: no static export quirks, keep asset prefixes behavior safe on Vercel.
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'family-connect-app-puce.vercel.app' },
    ],
  },
};

export default nextConfig;
