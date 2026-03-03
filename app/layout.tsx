import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DirectionProvider } from "@/context/direction-provider";
import { FontProvider } from "@/context/font-provider";
import { QueryProvider } from "@/context/query-provider";
import ToastProvider from "@/context/toast-providers";
import { ThemeProvider } from "@/context/theme-provider";
import { ColorProvider } from "@/context/color-provider";

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
    default: "DutaAssets",
    template: "DutaAssets - %s", // <-- template judul dinamis
  },
  description: "Aplikasi manajemen verifikasi data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider>
            <ColorProvider>
              <FontProvider>
                <DirectionProvider>
                  <ToastProvider>{children}</ToastProvider>
                </DirectionProvider>
              </FontProvider>
            </ColorProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
