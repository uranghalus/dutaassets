import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DirectionProvider } from "@/context/direction-provider";
import { FontProvider } from "@/context/font-provider";
import { QueryProvider } from "@/context/query-provider";
import ToastProvider from "@/context/toast-providers";
import { ThemeProvider } from "@/context/theme-provider";
import { ColorProvider } from "@/context/color-provider";
import { PreferencesProvider } from "@/context/preferences-provider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

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
    template: "DutaAssets - %s",
  },
  description: "Aplikasi manajemen verifikasi data",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <ThemeProvider>
              <ColorProvider>
                <FontProvider>
                  <PreferencesProvider>
                    <DirectionProvider>
                      <ToastProvider>{children}</ToastProvider>
                    </DirectionProvider>
                  </PreferencesProvider>
                </FontProvider>
              </ColorProvider>
            </ThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
