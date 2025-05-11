// next.config.ts
const nextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = nextIntl({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
  // 他のNext.js設定があればここに追加
});

module.exports = nextConfig;