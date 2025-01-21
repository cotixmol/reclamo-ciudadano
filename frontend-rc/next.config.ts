import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8000/api/v1',
  },
};

export default nextConfig;
