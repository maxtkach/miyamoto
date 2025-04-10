/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Отключаем проверку ESLint при сборке проекта
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Отключаем проверку TypeScript при сборке проекта
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
};

module.exports = nextConfig; 