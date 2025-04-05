/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Tạm thời bỏ qua lỗi TypeScript trong build
  },
  eslint: {
    ignoreDuringBuilds: true, // Bỏ qua lỗi ESLint trong build
  },
};

module.exports = nextConfig;