"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface AIInsightCardProps {
  insightText: string;
}

export function AIInsightCard({ insightText }: AIInsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-full flex-col justify-center rounded-2xl border border-purple-200/80 bg-[#fbf8ff] p-5 shadow-2xs dark:border-purple-800/40 dark:bg-purple-950/20"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
          <Lightbulb className="h-4 w-4" />
        </div>
        <h3 className="font-display text-sm font-bold text-purple-950 dark:text-purple-200">
          AI Insight
        </h3>
      </div>

      <p className="text-xs leading-relaxed text-purple-900/90 dark:text-purple-200/80">
        {insightText}
      </p>
    </motion.div>
  );
}
