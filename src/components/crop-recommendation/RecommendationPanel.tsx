"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sprout, X, Sparkles } from "lucide-react";
import { CropRecommendationCard } from "./CropRecommendationCard";
import { type CropRecommendationItem } from "./types";

interface RecommendationPanelProps {
  crops: CropRecommendationItem[];
  allCrops?: CropRecommendationItem[];
}

export function RecommendationPanel({
  crops,
  allCrops = [],
}: RecommendationPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const displayCrops = crops.slice(0, 3);

  return (
    <div className="flex h-full flex-col justify-between space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Sprout className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="font-display text-base font-bold tracking-tight text-foreground">
            Top Recommended Crops
          </h2>
        </div>

        <span className="rounded-full bg-emerald-100/70 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
          Based on AI Analysis
        </span>
      </div>

      {/* Crop Cards List */}
      <div className="space-y-2.5 flex-1">
        {displayCrops.map((crop, idx) => (
          <CropRecommendationCard key={crop.id} crop={crop} index={idx} />
        ))}
      </div>

      {/* Footer View All CTA */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setModalOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ecfdf3] py-2.5 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/60 cursor-pointer"
      >
        <span>View All Recommended Crops</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </motion.button>

      {/* Modal for All Recommended Crops */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative z-10 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-card p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-display text-lg font-bold text-foreground">
                    All Recommended Crops
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {(allCrops.length > 0 ? allCrops : crops).map((c, i) => (
                  <div
                    key={c.id}
                    className="flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between hover:border-emerald-500/40"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          typeof c.image === "string" ? c.image : c.image.src
                        }
                        alt={c.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-foreground">
                            {c.name}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            ({c.hindiName})
                          </span>
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                            {c.suitability}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {c.summary}
                        </p>
                      </div>
                    </div>

                    <div className="text-right sm:shrink-0 text-xs">
                      <p className="font-semibold text-foreground">
                        Yield: {c.expectedYield}
                      </p>
                      <p className="text-muted-foreground">
                        Water: {c.waterNeed}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
