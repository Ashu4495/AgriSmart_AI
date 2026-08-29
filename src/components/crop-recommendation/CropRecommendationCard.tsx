"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type CropRecommendationItem } from "./types";

interface CropRecommendationCardProps {
  crop: CropRecommendationItem;
  index: number;
}

export function CropRecommendationCard({
  crop,
  index,
}: CropRecommendationCardProps) {
  const isHigh = crop.suitability === "Highly Suitable";
  const isSuitable = crop.suitability === "Suitable";
  const isModerate = crop.suitability === "Moderately Suitable";

  const imgSrc = typeof crop.image === "string" ? crop.image : crop.image.src;

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs transition-all hover:border-emerald-500/40 hover:shadow-sm dark:hover:border-emerald-500/30"
    >
      {/* Left: Thumbnail + Crop Name + Badge */}
      <div className="flex items-center gap-3.5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
          <img
            src={imgSrc}
            alt={crop.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-bold text-foreground">
              {crop.name}
            </h3>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold tracking-tight",
                isHigh &&
                  "bg-emerald-100/90 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
                isSuitable &&
                  "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
                isModerate &&
                  "bg-amber-100/80 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
                !isHigh &&
                  !isSuitable &&
                  !isModerate &&
                  "bg-muted text-muted-foreground",
              )}
            >
              {crop.suitability}
            </span>
          </div>

          <div className="mt-1">
            <span className="text-[11px] font-medium text-muted-foreground">
              Expected Yield
            </span>
            <p className="text-xs font-bold text-foreground">
              {crop.expectedYield}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Profit Potential + Indicator Dots */}
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-border/50">
        <span className="text-[11px] font-medium text-muted-foreground">
          Profit Potential
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={cn(
              "text-xs font-bold",
              crop.profitPotential === "High" &&
                "text-emerald-700 dark:text-emerald-400",
              crop.profitPotential === "Medium" &&
                "text-amber-600 dark:text-amber-400",
              crop.profitPotential === "Low" && "text-muted-foreground",
            )}
          >
            {crop.profitPotential}
          </span>

          {/* 5 Indicator Dots */}
          <div className="flex items-center gap-1 ml-1">
            {Array.from({ length: crop.profitDots.total }).map((_, i) => {
              const isFilled = i < crop.profitDots.filled;
              const isAmber = crop.profitDots.color === "amber";

              return (
                <span
                  key={i}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    isFilled &&
                      !isAmber &&
                      "bg-emerald-600 dark:bg-emerald-400",
                    isFilled && isAmber && "bg-amber-500 dark:bg-amber-400",
                    !isFilled && "bg-slate-200 dark:bg-slate-700",
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
