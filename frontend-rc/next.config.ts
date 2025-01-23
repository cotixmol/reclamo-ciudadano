import type { NextConfig } from 'next';

/**
1) Define your base Next.js config here (any standard Next.js settings).
 */
const nextConfig: NextConfig = {
  // Remote image patterns
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*', // Allow images from any HTTPS domain
      },
    ],
  },

  env: {
    API_URL: process.env.API_URL || 'http://localhost:8000/api/v1',
  },
};

/**
 * 2) Require (or import) `next-pwa` and call it with ONLY your PWA-specific options:
 *    - `dest`: Where to output the service worker files
 *    - `register`: Automatically registers the service worker in the client
 *    - `skipWaiting`: Immediately activate the new service worker on update
 */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

/**
 * 3) Export the merged config by calling `withPWA(...)` with:
 *    - Your base Next.js config (`...nextConfig`)
 *    - Any additional top-level Next.js options you'd like to override
 */
module.exports = withPWA({
  ...nextConfig,
  reactStrictMode: true, // Enforce React Strict Mode
});
