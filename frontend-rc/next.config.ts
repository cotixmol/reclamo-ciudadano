// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'us-southeast-1.linodeobjects.com',
        port: '',
        pathname: '/**',
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
