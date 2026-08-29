"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CreditCard,
  FlaskConical,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";
import { Reveal } from "./reveal";
import { useLanguage } from "@/lib/i18n";

const ICONS = [IndianRupee, ShieldCheck, FlaskConical, CreditCard];

export function Schemes() {
  const { t } = useLanguage();

  return (
    <section id="schemes" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            {t.schemes.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t.schemes.heading}
          </h2>
          <p className="mt-4 text-muted-foreground">{t.schemes.description}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.schemes.items.map((scheme, i) => {
            const Icon = ICONS[i]!;
            return (
              <Reveal key={scheme.name} delay={i * 100}>
                <Link
                  href="/government-resources"
                  className="group flex h-full flex-col rounded-2xl border border-border/80 bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 cursor-pointer block"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-115 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md">
                      <Icon
                        className="h-6 w-6 transition-transform duration-300 group-hover:-rotate-6"
                        strokeWidth={1.75}
                      />
                    </span>
                    <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-secondary-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                      {scheme.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold leading-snug group-hover:text-primary transition-colors">
                    {scheme.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {scheme.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {t.schemes.check}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
