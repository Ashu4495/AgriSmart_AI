"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const PRICES = [
  { name: "Wheat", price: "₹2,350/qtl", change: "+2.4%", up: true },
  { name: "Rice (Basmati)", price: "₹4,180/qtl", change: "+1.1%", up: true },
  { name: "Cotton", price: "₹7,120/qtl", change: "-0.8%", up: false },
  { name: "Maize", price: "₹2,225/qtl", change: "+0.9%", up: true },
  { name: "Sugarcane", price: "₹315/qtl", change: "+0.3%", up: true },
  { name: "Onion", price: "₹1,450/qtl", change: "-1.6%", up: false },
  { name: "Soybean", price: "₹4,892/qtl", change: "+2.0%", up: true },
  { name: "Mustard", price: "₹5,650/qtl", change: "-0.4%", up: false },
];

function TickerItems({
  prices,
  hidden = false,
}: {
  prices: { name: string; price: string; change: string; up: boolean }[];
  hidden?: boolean;
}) {
  return (
    <div className="flex w-max items-center" aria-hidden={hidden}>
      {prices.map((item) => (
        <span key={item.name} className="mr-12 flex items-center gap-2 text-sm">
          <span className="font-semibold text-forest-foreground">
            {item.name}
          </span>
          <span className="text-forest-foreground/70">{item.price}</span>
          <span
            className={`flex items-center gap-1 text-xs font-semibold ${
              item.up ? "text-leaf" : "text-destructive"
            }`}
          >
            {item.up ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {item.change}
          </span>
        </span>
      ))}
    </div>
  );
}

export function PriceTicker() {
  const { t } = useLanguage();
  const prices = t.ticker.prices;

  return (
    <section
      id="market"
      aria-label={t.ticker.live}
      className="flex items-center overflow-hidden border-y border-forest-foreground/10 bg-forest py-3"
    >
      <div className="hidden shrink-0 items-center gap-2 border-r border-forest-foreground/15 px-5 md:flex">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf" />
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-leaf">
          {t.ticker.live}
        </span>
      </div>
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        <TickerItems prices={prices} />
        <TickerItems prices={prices} hidden />
      </div>
    </section>
  );
}
