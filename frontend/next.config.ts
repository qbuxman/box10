import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pino', 'thread-stream', 'pino-pretty', 'viem'],
  transpilePackages: ['@walletconnect/universal-provider'],
};

export default nextConfig;