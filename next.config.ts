import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // 🔒 Anti sniffing (mencegah browser menebak MIME type)
          { key: "X-Content-Type-Options", value: "nosniff" },

          // 🚫 Cegah embedding ke iframe
          { key: "X-Frame-Options", value: "DENY" },

          // 🧱 Perlindungan dasar XSS
          { key: "X-XSS-Protection", value: "1; mode=block" },

          // 🔍 Batasi referrer agar tidak bocor ke situs lain
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          // 🔐 Content Security Policy (CSP)
          // NOTE: pastikan disesuaikan kalau kamu load font, script, atau image dari luar
          {
            key: "Content-Security-Policy",
            value: [
              // ✅ default-src hanya sekali
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
              "style-src 'self' 'unsafe-inline';",
              "img-src 'self' data: blob:;",
              "font-src 'self';",
              "connect-src 'self' https://* ws://* wss://*;",
              "frame-src 'self' https://www.google.com;", // ✅ pindahkan ke sini
              "frame-ancestors 'none';",
              "object-src 'none';",
            ].join(" "),
          },

          // 🧭 Browser permission (opsional tapi direkomendasikan)
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
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
