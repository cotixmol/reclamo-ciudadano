// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow any https host
      },
      {
        protocol: 'http',
        hostname: 'minio.reputacion.digital',
        port: '9000',
        pathname: '/**',
      }      
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
