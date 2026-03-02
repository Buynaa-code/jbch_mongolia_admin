/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api.churchapp.mn'],
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
