import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Premium Google Fonts
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "First Contact E.I.S.",
  description: "AI Orchestration Platform for Homeless Services",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon-512.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
