import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pino', 'thread-stream', 'pino-pretty'],
  transpilePackages: ['@walletconnect/universal-provider'],
};

export default nextConfig;