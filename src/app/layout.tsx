import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Inventaris TIK",
    template: "%s | Inventaris TIK",
  },
  description:
    "Aplikasi manajemen aset yang membantu pencatatan, monitoring, dan pelaporan secara efisien.",
  keywords: ["manajemen aset", "dashboard", "next.js", "web app"],
  publisher:
    "Dinas Komunikasi Informasi Persandian dan Statistik Kabupaten Serang.",

  metadataBase: new URL(`${process.env.NEXT_PUBLIC_APP_URL}`),

  openGraph: {
    title: "Inventaris TIK",
    description: "Aplikasi manajemen aset berbasis web yang cepat dan modern.",
    url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    siteName: "Inventaris TIK",
    images: [
      {
        url: "/kominfo_logo.png",
        width: 1200,
        height: 630,
        alt: "Preview Inventaris TIK",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Inventaris TIK",
    description: "Aplikasi manajemen aset berbasis web yang cepat dan modern.",
    images: ["/og-image.png"],
    creator: "@username_twitter",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-linear-to-b from-slate-900 via-indigo-900 to-slate-800 `}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
