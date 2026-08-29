import { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { PriceTicker } from "@/components/landing/price-ticker";
import { Features } from "@/components/landing/features";
import { Stats } from "@/components/landing/stats";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Crops } from "@/components/landing/crops";
import { Schemes } from "@/components/landing/schemes";
import { AboutUs } from "@/components/landing/about";
import { AppSection } from "@/components/landing/app-section";
import { Footer } from "@/components/landing/footer";
import { Assistant } from "@/components/landing/assistant";

export const metadata: Metadata = {
  title: "AgriSmart AI — AI-Powered Insights for Smarter Farming",
  description:
    "AgriSmart AI helps farmers make the right decisions with AI crop recommendations, soil health analysis, weather forecasts, live mandi prices and government scheme guidance.",
  openGraph: {
    title: "AgriSmart AI — AI-Powered Insights for Smarter Farming",
    description:
      "AI crop recommendations, soil health analysis, weather forecasts, live mandi prices and government scheme guidance — built for farmers.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Navbar />
      <main>
        <Hero />
        <PriceTicker />
        <Features />
        <Stats />
        <HowItWorks />
        <Crops />
        <Schemes />
        <AboutUs />
        <AppSection />
      </main>
      <Footer />
      <Assistant />
    </div>
  );
}
