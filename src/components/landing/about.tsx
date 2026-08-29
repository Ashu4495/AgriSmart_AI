"use client";

import {
  BrainCircuit,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Sparkles,
  Users,
  Target,
  Award,
  Globe2,
} from "lucide-react";
import { Reveal } from "./reveal";
import { useLanguage } from "@/lib/i18n";

export function AboutUs() {
  const { t } = useLanguage();

  const ICONS = [BrainCircuit, HeartHandshake, ShieldCheck, Leaf];
  const TINTS = [
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "bg-leaf/10 text-leaf border-leaf/20",
  ];

  const about = t.about;

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-background py-24 border-t"
    >
      {/* Background Decorative Blur Orbs */}
      <div className="pointer-events-none absolute -left-20 top-1/4 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 -z-10 h-80 w-80 rounded-full bg-harvest/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{about.eyebrow}</span>
          </div>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {about.headingA}{" "}
            <span className="bg-gradient-to-r from-primary via-leaf to-amber-500 bg-clip-text text-transparent">
              {about.headingB}
            </span>
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {about.description}
          </p>
        </Reveal>

        {/* Mission & Vision Bento Box */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal delay={100}>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card to-card/50 p-8 shadow-lg shadow-black/5 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold text-foreground">
                {about.missionTitle}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {about.missionDesc}
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-primary">
                <Globe2 className="h-4 w-4" />
                <span>{about.missionFooter}</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card to-card/50 p-8 shadow-lg shadow-black/5 transition-all duration-300 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-transform duration-300 group-hover:scale-110">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold text-foreground">
                {about.visionTitle}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {about.visionDesc}
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Users className="h-4 w-4" />
                <span>{about.visionFooter}</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="mt-12">
          <Reveal className="mb-6">
            <h3 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {about.pillarsHeading}
            </h3>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.pillars.map((pillar, i) => {
              const Icon = ICONS[i] ?? BrainCircuit;
              const tint = TINTS[i] ?? TINTS[0];
              return (
                <Reveal key={pillar.title} delay={i * 100}>
                  <div className="group flex h-full flex-col rounded-2xl border border-border/80 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110 ${tint}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <h4 className="mt-5 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {pillar.title}
                    </h4>

                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
