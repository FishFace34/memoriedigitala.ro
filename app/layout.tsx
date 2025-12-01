import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "./contexts/LanguageContext";
import GoogleAnalytics from "./components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://memoriedigitala.ro';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "MemorieDigitala.ro - Colectează toate amintirile evenimentului într-un singur loc",
    template: "%s | MemorieDigitala.ro",
  },
  description: "Colectează fără efort toate fotografiile, videoclipurile și mesajele de la invitați cu un singur cod QR. Fără aplicații, fără înregistrări. Perfect pentru nunți, botezuri și evenimente speciale.",
  keywords: [
    "fotografii eveniment",
    "QR code eveniment",
    "galerie foto eveniment",
    "colectare fotografii nunta",
    "fotografii nunta online",
    "QR code pentru nunta",
    "botez fotografii",
    "evenimente romania",
    "colectare poze eveniment",
    "galerie foto nunta"
  ],
  authors: [{ name: "MemorieDigitala.ro" }],
  creator: "MemorieDigitala.ro",
  publisher: "MemorieDigitala.ro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: baseUrl,
    siteName: "MemorieDigitala.ro",
    title: "MemorieDigitala.ro - Colectează toate amintirile evenimentului",
    description: "Colectează fără efort toate fotografiile, videoclipurile și mesajele de la invitați cu un singur cod QR. Fără aplicații, fără înregistrări.",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "MemorieDigitala.ro - QR Code pentru Evenimente",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MemorieDigitala.ro - Colectează toate amintirile evenimentului",
    description: "Colectează fără efort toate fotografiile, videoclipurile și mesajele de la invitați cu un singur cod QR.",
    images: [`${baseUrl}/og-image.jpg`],
    creator: "@memoriedigitala",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "033VlMTQROMz7XwKzYz1OBtoxTnYdhCfeQP5CIyp_80",
  },
  alternates: {
    canonical: baseUrl,
  },
  category: "event planning",
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
        <GoogleAnalytics />
        <LanguageProvider>
          {children}
          <Toaster position="top-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}
