import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        // Proxy all /api/* requests to the actual backend API
        source: '/api/:path*',
        destination: 'https://api.salesone.co.kr/:path*', // Forward to backend API
      },
    ];
  },
};

export default nextConfig;
