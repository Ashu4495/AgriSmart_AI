"use client";

import {
  CloudSun,
  FlaskConical,
  Landmark,
  Sprout,
  TrendingUp,
} from "lucide-react";
import { Reveal } from "./reveal";
import { useLanguage } from "@/lib/i18n";

const ICONS = [Sprout, FlaskConical, CloudSun, TrendingUp, Landmark];

export function Features() {
  const { t } = useLanguage();

  return (
    <section id="features" className="bg-card py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0 lg:divide-x">
          {t.features.items.map((feature, i) => {
            const Icon = ICONS[i]!;
            return (
              <Reveal
                key={feature.title}
                delay={i * 100}
                className="group rounded-2xl p-4 transition-all duration-300 hover:bg-muted/50 hover:shadow-lg hover:shadow-primary/5 lg:px-8 lg:first:pl-0 lg:last:pr-0"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-115 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/20">
                  <Icon
                    className="h-6 w-6 transition-transform duration-300 group-hover:-rotate-6"
                    strokeWidth={1.75}
                  />
                </div>
                <h2 className="mt-4 font-display text-base font-bold leading-snug group-hover:text-primary transition-colors">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
