import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bdtfiles.blob.core.windows.net",
      },
    ],
  },
};

export default nextConfig;
