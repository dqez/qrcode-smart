import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  title: {
    default: "QRCode Smart - The Smartest Way to Share Links",
    template: "%s | QRCode Smart"
  },
  description: "Generate QR codes that come with beautiful social preview cards. Perfect for sharing on Twitter, LinkedIn, and Discord. Features instant generation, smart clipboard, and developer API.",
  openGraph: {
    title: "QRCode Smart - The Smartest Way to Share Links",
    description: "Generate QR codes that come with beautiful social preview cards. Perfect for sharing on Twitter, LinkedIn, and Discord.",
    siteName: "QRCode Smart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QRCode Smart - The Smartest Way to Share Links",
    description: "Generate QR codes that come with beautiful social preview cards. Perfect for sharing on Twitter, LinkedIn, and Discord.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
