import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [],
    unoptimized: true,
  },
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
