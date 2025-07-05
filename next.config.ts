// next.config.ts
import { NextConfig } from 'next';
import nextIntl from 'next-intl/plugin';

const withNextIntl = nextIntl();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
  // Next.js 15 最適化設定
  experimental: {
    optimizePackageImports: ['fuse.js', 'gray-matter'],
  },
  // HMR最適化
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);