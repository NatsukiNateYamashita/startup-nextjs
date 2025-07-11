// next.config.ts
import { NextConfig } from 'next';
import nextIntl from 'next-intl/plugin';

const withNextIntl = nextIntl();

const nextConfig: NextConfig = {
  images: {
    // WebP/AVIF形式での画像配信
    formats: ['image/webp', 'image/avif'],
    // デバイスサイズの設定
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // 画像サイズの設定
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // リモートパターン
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
    // ローカル画像のパス設定
    domains: [],
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