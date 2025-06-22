/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true, // Solo deja esto
  },
};

module.exports = nextConfig;