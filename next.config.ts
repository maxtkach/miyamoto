import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Экспорт статических файлов для GitHub Pages
  eslint: {
    // Отключаем проверку ESLint при сборке проекта
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Отключаем проверку TypeScript при сборке проекта
    ignoreBuildErrors: true,
  },
  images: {
    domains: [],
    unoptimized: true,
  },
  // Базовый путь для GitHub Pages, удалите, если развертываете в корне
  // basePath: '/miyamoto',
  // assetPrefix: '/miyamoto/',
  webpack(config) {
    // Поддержка для импорта изображений
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
      type: 'asset/resource',
    });
    
    return config;
  },
};

export default nextConfig;
