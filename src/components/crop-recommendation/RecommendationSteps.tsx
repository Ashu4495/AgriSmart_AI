"use client";

import {
  ArrowRight,
  BrainCircuit,
  Database,
  Lightbulb,
  Target,
} from "lucide-react";

const STEPS = [
  {
    number: "1",
    title: "1. Data Collection",
    desc: "We collect real-time soil, weather & market data.",
    icon: Database,
    iconBg:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30",
  },
  {
    number: "2",
    title: "2. ML Model Analysis",
    desc: "Our ML model analyzes 1000+ data points.",
    icon: BrainCircuit,
    iconBg:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30",
  },
  {
    number: "3",
    title: "3. Smart Prediction",
    desc: "AI predicts the best crops for your field.",
    icon: Target,
    iconBg:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30",
  },
  {
    number: "4",
    title: "4. Actionable Insights",
    desc: "Get crop, yield & profit recommendations.",
    icon: Lightbulb,
    iconBg:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30",
  },
];

export function RecommendationSteps() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs">
      <h2 className="font-display text-base font-bold tracking-tight text-foreground mb-4">
        How AI Recommendation Works
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-center">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isNotLast = idx < STEPS.length - 1;

          return (
            <div key={step.number} className="relative flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${step.iconBg} shadow-2xs`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1 pr-6">
                <h3 className="font-display text-xs font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                  {step.desc}
                </p>
              </div>

              {/* Connecting Arrow for larger screens */}
              {isNotLast && (
                <div className="absolute right-0 top-3 hidden text-muted-foreground/40 lg:block">
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
