"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  CloudRain,
  FlaskConical,
  PlayCircle,
  ShieldCheck,
  Sprout,
  Thermometer,
  TrendingUp,
} from "lucide-react";
import heroFarmer from "@/assets/hero-farmer.jpg";
import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/lib/use-auth";

const CARD_META = [
  { icon: Sprout, tint: "bg-emerald-500/15 text-emerald-500", delay: "0s" },
  { icon: CloudRain, tint: "bg-blue-500/15 text-blue-500", delay: "0.8s" },
  { icon: Thermometer, tint: "bg-amber-500/15 text-amber-500", delay: "1.6s" },
  {
    icon: TrendingUp,
    tint: "bg-emerald-500/15 text-emerald-500",
    delay: "2.4s",
  },
];

export function Hero() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <section id="home" className="relative overflow-hidden bg-background">
      {/* Background Hero Image with Enhanced Gradient Mask */}
      <div className="absolute inset-0 scale-x-[-1] select-none">
        <img
          src={heroFarmer.src}
          alt="Farmer checking AgriSmart AI insights on a smartphone in his field"
          width={1920}
          height={1080}
          className="h-full w-full object-cover object-[75%_center] lg:object-[65%_center]"
        />
      </div>
      {/* Dynamic gradient overlay to ensure text is 100% readable on all screens */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30 lg:via-background/80" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl 2xl:max-w-[1536px] flex-col justify-center px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-10 2xl:px-12">
        {/* Left Column: Heading, Farmer Intro & Action Buttons */}
        <div className="z-10 max-w-2xl py-6 lg:py-12 2xl:max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/90 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur-md">
            <BadgeCheck className="h-4 w-4 text-primary" />
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl 2xl:text-7xl">
            {t.hero.titleA}{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-400 bg-clip-text text-transparent">
              {t.hero.titleB}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
            {t.hero.subtitle}
          </p>

          {/* Quick Farmer Benefits Chips */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-lg border bg-card/80 px-3 py-1.5 shadow-sm">
              <FlaskConical className="h-3.5 w-3.5 text-primary" />
              {t.hero.chips.soil}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border bg-card/80 px-3 py-1.5 shadow-sm">
              <CloudRain className="h-3.5 w-3.5 text-blue-500" />
              {t.hero.chips.weather}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border bg-card/80 px-3 py-1.5 shadow-sm">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              {t.hero.chips.mandi}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border bg-card/80 px-3 py-1.5 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
              {t.hero.chips.schemes}
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={user ? "/dashboard" : "/auth"}
              className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40 active:translate-y-0"
            >
              <span>{user ? t.nav.dashboard : t.hero.ctaPrimary}</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-7 py-4 text-base font-semibold text-foreground backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-card hover:shadow-md"
            >
              <PlayCircle className="h-5 w-5 text-primary" />
              <span>{t.hero.ctaSecondary}</span>
            </a>
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
            <BadgeCheck className="h-4 w-4 text-primary" />
            <span>{t.hero.trust}</span>
          </p>
        </div>

        {/* Right Column: High-Contrast Live Insights Cards with Floating Animation */}
        <div className="z-10 mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-0 lg:flex lg:w-72 2xl:w-80 lg:shrink-0 lg:flex-col lg:gap-3.5">
          {t.hero.cards.map((card, i) => {
            const meta = CARD_META[i]!;
            const floatClass =
              i % 2 === 0 ? "animate-float" : "animate-float-slow";
            return (
              <div
                key={card.label}
                style={{ animationDelay: meta.delay }}
                className={`flex items-center gap-3.5 rounded-2xl border border-border/80 bg-card/90 p-3.5 shadow-lg shadow-black/5 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 ${floatClass}`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${meta.tint}`}
                >
                  <meta.icon className="h-5.5 w-5.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="truncate font-display text-base font-bold text-foreground">
                    {card.value}
                  </p>
                  <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    {card.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll Down Hint */}
      <a
        href="#features"
        className="absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
        aria-label={t.hero.scroll}
      >
        <span>{t.hero.scroll}</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  );
}
