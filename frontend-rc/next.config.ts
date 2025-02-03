// next.config.js
const nextConfig = {
  images: {
    domains: ['us-southeast-1.linodeobjects.com'],
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
