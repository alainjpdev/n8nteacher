/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      bufferutil: false,         // 🚫 ignorar bufferutil
      "utf-8-validate": false,   // 🚫 ignorar utf-8-validate también
    };
    return config;
  },
};

module.exports = nextConfig;
