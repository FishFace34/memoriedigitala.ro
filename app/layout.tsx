import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "./contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MemorieDigitala.ro - Colectează toate amintirile evenimentului într-un singur loc",
  description: "Colectează fără efort toate fotografiile, videoclipurile și mesajele de la invitați cu un singur cod QR. Fără aplicații, fără înregistrări.",
  keywords: "fotografii eveniment, QR code, galerie foto, evenimente, nunți, botezuri",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          {children}
          <Toaster position="top-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}
