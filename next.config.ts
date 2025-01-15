import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tan-accessible-rhinoceros-506.mypinata.cloud",
        pathname: "/**", // Cho phép tất cả các đường dẫn từ hostname này
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
