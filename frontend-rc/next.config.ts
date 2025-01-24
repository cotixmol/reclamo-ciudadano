import type { NextConfig } from 'next';

// Start with a base Next.js config
// 1) Add the `images` config to allow images from any HTTPS domain
// 2) Add the `env` config to expose the API_URL environment variable
const nextConfig: NextConfig = {
  // Images from any HTTPS domain are allowed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },

  env: {
    API_URL: process.env.API_URL
  },
};


// 2) Require `next-pwa` library and call it with ONLY your PWA-specific options:
//    - `dest`: Where to output the service worker files
//    - `register`: Automatically registers the service worker in the client
//    - `skipWaiting`: Immediately activate the new service worker on update
const nextPWACustom = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});


// 3) Export the merged config by calling `nextPWACustom(...)` with:
//   - Your base Next.js config (`...nextConfig`)
//   - Any additional top-level Next.js options you'd like to override
module.exports = nextPWACustom({
  ...nextConfig,
  reactStrictMode: true,
});
