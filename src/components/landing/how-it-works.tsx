"use client";

import { Fragment } from "react";
import {
  ArrowRight,
  BrainCircuit,
  LineChart,
  Sprout,
  UserRound,
} from "lucide-react";
import { Reveal } from "./reveal";
import { useLanguage } from "@/lib/i18n";

const ICONS = [UserRound, BrainCircuit, Sprout, LineChart];

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            {t.how.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t.how.heading}
          </h2>
        </Reveal>

        <div className="mt-14 flex flex-col items-center justify-center gap-10 md:flex-row md:items-start md:gap-4">
          {t.how.steps.map((step, i) => {
            const Icon = ICONS[i]!;
            return (
              <Fragment key={step.title}>
                <Reveal
                  delay={i * 120}
                  className="group flex max-w-xs flex-1 flex-col items-center text-center p-4 rounded-2xl transition-all duration-300 hover:bg-card hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                >
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20 bg-card text-primary shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-xl group-hover:shadow-primary/20">
                    <Icon
                      className="h-8 w-8 transition-transform duration-300 group-hover:rotate-6"
                      strokeWidth={1.75}
                    />
                    <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground transition-transform duration-300 group-hover:scale-120 group-hover:bg-emerald-700 shadow-md">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-base font-bold group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </Reveal>
                {i < t.how.steps.length - 1 && (
                  <ArrowRight className="mt-10 hidden h-6 w-6 shrink-0 animate-bounce-soft text-primary/60 md:block" />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
