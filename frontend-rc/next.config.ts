// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },   
    ],
  },
  env: {
    API_URL: process.env.API_URL,
  },
};

const nextPWACustom = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = nextPWACustom({
  ...nextConfig,
  reactStrictMode: true,
});
