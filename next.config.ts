import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    removeConsole: {
      exclude: ["error"],
    },
  },
  reactCompiler: true,
  turbopack: {
    root: path.resolve(__dirname), // ← pastikan root = direktori proyek ini
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
