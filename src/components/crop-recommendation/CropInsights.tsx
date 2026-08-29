"use client";

import { CloudRain, IndianRupee, Sprout, TrendingUp } from "lucide-react";
import { AIInsightCard } from "./AIInsightCard";
import { type RecommendationInsights } from "./types";

interface CropInsightsProps {
  insights: RecommendationInsights;
}

export function CropInsights({ insights }: CropInsightsProps) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="font-display text-base font-bold tracking-tight text-foreground">
          Why These Crops?
        </h2>
        <p className="text-xs text-muted-foreground">
          AI analysis based on your field conditions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-stretch">
        {/* Left 4 Metric Cards (8 cols on lg) */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
          {/* Metric 1: Soil Match */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Sprout className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">
                Soil Match
              </span>
            </div>

            <div className="mt-3">
              <p className="font-display text-xl font-bold text-foreground">
                {insights.soilMatch}%
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
                {insights.soilMatchLabel}
              </p>
              {/* Progress bar */}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-500"
                  style={{ width: `${insights.soilMatch}%` }}
                />
              </div>
            </div>
          </div>

          {/* Metric 2: Weather Fit */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400">
                <CloudRain className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">
                Weather Fit
              </span>
            </div>

            <div className="mt-3">
              <p className="font-display text-xl font-bold text-foreground">
                {insights.weatherFit}%
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
                {insights.weatherFitLabel}
              </p>
              {/* Progress bar */}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-500"
                  style={{ width: `${insights.weatherFit}%` }}
                />
              </div>
            </div>
          </div>

          {/* Metric 3: Market Demand */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">
                Market Demand
              </span>
            </div>

            <div className="mt-3">
              <p className="font-display text-xl font-bold text-foreground">
                {insights.marketDemand}
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
                {insights.marketDemandLabel}
              </p>
            </div>
          </div>

          {/* Metric 4: Profit Potential */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                <IndianRupee className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">
                Profit Potential
              </span>
            </div>

            <div className="mt-3">
              <p className="font-display text-xl font-bold text-foreground">
                {insights.profitPotential}
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
                {insights.profitPotentialLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Right AI Insight Card (4 cols on lg) */}
        <div className="lg:col-span-4">
          <AIInsightCard insightText={insights.aiInsight} />
        </div>
      </div>
    </div>
  );
}
