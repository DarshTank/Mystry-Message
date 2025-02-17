import { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  webpack: (config: any, options: { isServer: any }) => {
    if (!options.isServer) {
      config.resolve.fallback = {
        fs: false,  // Prevents Webpack from bundling 'fs'
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
