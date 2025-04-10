import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import SplashScreen from "./components/SplashScreen";
import SmoothScroll from "./components/SmoothScroll";
import SakuraBackground from "./components/SakuraBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  weight: ["400", "700"],
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Miyamoto Soundworks - Sound Studio",
  description: "Professional Japanese-style studio for recording, mastering and mixing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Предварительная загрузка не нужна, так как мы используем data URL */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerifJP.variable} bg-background text-foreground antialiased root-texture`}
      >
        <SplashScreen />
        <SmoothScroll>
          <SakuraBackground />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
