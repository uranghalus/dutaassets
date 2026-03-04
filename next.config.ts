import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block", // Mencegah Cross-Site Scripting (XSS)
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN", // Mencegah Clickjacking
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff", // Mencegah MIME-sniffing attacks
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        // Terapkan header keamanan ini di seluruh route aplikasi
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // OPSI PROXY (Rewrites):
  // Menggunakan fungsi rewrites() Next.js berfungsi sebagai Reverse Proxy untuk menyembunyikan API Asli
  // uncomment fungsi di bawah jika Anda mengambil data dari API External (misal: backend golang/java)
  /*
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'https://api-rahasia-anda.com/:path*', // URL asli tidak akan terlihat oleh user/hacker
      },
    ]
  },
  */
};

export default withNextIntl(nextConfig);
