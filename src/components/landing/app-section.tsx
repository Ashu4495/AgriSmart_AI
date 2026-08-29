"use client";

import {
  Bot,
  CircleCheck,
  CloudSun,
  FlaskConical,
  Home,
  Landmark,
  MessageCircle,
  Play,
  Sprout,
  TrendingUp,
} from "lucide-react";
import { Reveal } from "./reveal";
import { useLanguage } from "@/lib/i18n";

const TILE_ICONS = [Sprout, FlaskConical, CloudSun, TrendingUp, Landmark, Bot];

function PhoneMockup() {
  const { t } = useLanguage();

  return (
    <div className="animate-float-slow">
      <div className="relative mx-auto w-64 -rotate-6 transition-transform duration-500 hover:rotate-0">
        <div className="overflow-hidden rounded-[2.5rem] border-[10px] border-foreground bg-card shadow-2xl">
          <div className="relative space-y-3 p-4 pt-9">
            <div className="absolute left-1/2 top-2.5 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground" />
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sprout className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[10px] text-muted-foreground">
                  {t.app.greeting}
                </p>
                <p className="text-xs font-bold">{t.app.farmer}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {t.app.tiles.map((label, i) => {
                const Icon = TILE_ICONS[i]!;
                return (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 rounded-xl bg-muted p-3 transition-transform hover:scale-105"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-[10px] font-semibold">{label}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-around border-t pt-2.5">
              <Home className="h-4 w-4 text-primary" />
              <CloudSun className="h-4 w-4 text-muted-foreground" />
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="absolute -left-6 top-16 -z-10 h-24 w-24 rounded-full bg-leaf/30 blur-2xl" />
        <div className="absolute -bottom-4 -right-6 -z-10 h-28 w-28 rounded-full bg-harvest/30 blur-2xl" />
      </div>
    </div>
  );
}

export function AppSection() {
  const { t } = useLanguage();

  return (
    <section id="app" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 rounded-[2rem] bg-gradient-to-br from-secondary to-accent/60 p-8 md:p-14 lg:grid-cols-2">
          <Reveal>
            <PhoneMockup />
          </Reveal>
          <Reveal delay={150}>
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {t.app.heading}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {t.app.description}
            </p>
            <ul className="mt-8 space-y-3.5">
              {t.app.benefits.map((benefit, i) => (
                <li
                  key={benefit}
                  style={{ animationDelay: `${i * 120}ms` }}
                  className="flex animate-grow-in items-center gap-3"
                >
                  <CircleCheck className="h-5 w-5 shrink-0 text-primary" />
                  <span className="font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
            <a
              href="#app"
              className="mt-9 inline-flex items-center gap-3 rounded-xl bg-foreground px-6 py-3.5 text-background transition-transform hover:-translate-y-0.5 hover:scale-105"
            >
              <Play className="h-7 w-7 fill-current" />
              <span className="leading-tight">
                <span className="block text-[10px] font-medium uppercase tracking-widest opacity-70">
                  {t.app.getItOn}
                </span>
                <span className="block font-display text-lg font-bold">
                  {t.app.store}
                </span>
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
