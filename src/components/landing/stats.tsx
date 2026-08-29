"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Target, Users, Wheat } from "lucide-react";
import { Reveal } from "./reveal";
import { useLanguage } from "@/lib/i18n";

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1600;
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(value * eased));
          if (progress < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

const META = [
  { icon: Users, value: 25, suffix: "K+" },
  { icon: MapPin, value: 500, suffix: "+" },
  { icon: Wheat, value: 20, suffix: "+" },
  { icon: Target, value: 98, suffix: "%" },
];

export function Stats() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-forest py-16">
      <div className="absolute -left-24 -top-24 h-72 w-72 animate-float-slow rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 animate-float rounded-full bg-leaf/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-0">
          {META.map((stat, i) => (
            <Reveal
              key={t.stats.labels[i]}
              delay={i * 100}
              className={`group flex items-center gap-4 ${
                i > 0
                  ? "lg:border-l lg:border-forest-foreground/10 lg:pl-10"
                  : ""
              }`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-leaf/25 bg-leaf/10 text-leaf transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <stat.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-3xl font-bold text-forest-foreground md:text-4xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-sm text-forest-foreground/70">
                  {t.stats.labels[i]}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
