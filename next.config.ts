import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "sharp$": false,
    };
    // Fix for onnxruntime-node binaries - treat as external
    if (isServer) {
      config.externals.push('onnxruntime-node', 'sharp');
    }
    return config;
  },
};

export default nextConfig;
