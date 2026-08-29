import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriSmart AI — Intelligent Farming Assistant",
  description:
    "AgriSmart AI helps farmers make the right decisions with personalized crop recommendations, soil analysis, weather forecasts, market insights and government scheme guidance.",
  authors: [{ name: "AgriSmart AI" }],
  openGraph: {
    title: "AgriSmart AI — Intelligent Farming Assistant",
    description:
      "Personalized crop recommendations, soil analysis, weather forecasts, market insights and government scheme guidance for farmers.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Outfit:wght@300..700&family=Mukta:wght@300;400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
