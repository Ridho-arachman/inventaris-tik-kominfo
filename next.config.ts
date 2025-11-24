import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["cdn-icons-png.flaticon.com", "images.pexels.com"],
  },
};

export default nextConfig;
