import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeHandler from "@/components/ThemeHandler";
import AuthGuard from "@/components/AuthGuard";
import Providers from "@/components/Providers";
import GlobalBackground from "@/components/GlobalBackground";
import BackgroundMusic from "@/components/BackgroundMusic";

import SplashWrapper from "@/components/SplashWrapper";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "GeologicalPuzzle - Jelajahi Bencana Geologi",
  description: "Platform pembelajaran interaktif untuk memahami fenomena geologi melalui pendekatan gamifikasi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <AuthGuard>
            <ThemeHandler />
            <GlobalBackground />
            <BackgroundMusic />
            <Navbar />
            <main className="grow flex flex-col relative text-earth-900 overflow-x-hidden max-w-full">
              <SplashWrapper>
                {children}
              </SplashWrapper>
            </main>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
