"use client";

import { motion } from "framer-motion";
import { CloudRain, FileSpreadsheet, Sprout, TrendingUp } from "lucide-react";
import headerLandscape from "@/assets/header-farm-panoramic.jpg";

interface SatelliteNode {
  id: string;
  icon: typeof Sprout;
  iconColor: string;
  label: string[];
  positionClass: string;
}

const SATELLITE_NODES: SatelliteNode[] = [
  {
    id: "soil",
    icon: Sprout,
    iconColor: "text-[#166534] dark:text-emerald-400",
    label: ["Soil Data"],
    positionClass: "-top-2 left-1/2 -translate-x-1/2",
  },
  {
    id: "weather",
    icon: CloudRain,
    iconColor: "text-[#0284c7] dark:text-sky-400",
    label: ["Weather", "Data"],
    positionClass: "-left-2 top-1/2 -translate-y-1/2",
  },
  {
    id: "market",
    icon: TrendingUp,
    iconColor: "text-[#168447] dark:text-emerald-400",
    label: ["Market", "Trends"],
    positionClass: "-right-2 top-1/2 -translate-y-1/2",
  },
  {
    id: "yields",
    icon: FileSpreadsheet,
    iconColor: "text-[#334155] dark:text-slate-300",
    label: ["Historical", "Yields"],
    positionClass: "-bottom-2 left-1/2 -translate-x-1/2",
  },
];

export function CropRecommendationBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative mb-6 min-h-[172px] lg:h-[176px] w-full overflow-hidden rounded-xl border border-[#d0e6da]/80 bg-[#edf7f2] shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-emerald-800/30 dark:bg-emerald-950/40"
    >
      {/* Right-Side Agricultural Landscape Background */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-7/12 overflow-hidden md:block lg:w-3/5">
        <img
          src={headerLandscape.src}
          alt="Agricultural landscape with rolling hills, barn, and windmill"
          className="h-full w-full object-cover object-right opacity-85 mix-blend-multiply dark:opacity-40 dark:mix-blend-luminosity"
        />
        {/* Soft horizontal gradient fade toward the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#edf7f2] via-[#edf7f2]/75 via-40% to-transparent dark:from-emerald-950 dark:via-emerald-950/75" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:px-8 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Text Block */}
        <div className="max-w-sm lg:max-w-md shrink-0">
          <p className="text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#168447] dark:text-[#4ade80]">
            AI-POWERED RECOMMENDATION
          </p>

          <h1 className="mt-1 font-display text-xl sm:text-[22px] lg:text-[23px] font-bold tracking-tight text-[#111827] dark:text-white leading-[1.18]">
            Get the Best Crop
            <br />
            Recommendations
          </h1>

          <p className="mt-1.5 text-[10.5px] sm:text-[11px] leading-relaxed text-[#475569] dark:text-slate-300 max-w-[310px]">
            Our ML model analyzes your soil, weather & market data
            <br className="hidden sm:inline" />
            to suggest the most profitable crops for your field.
          </p>
        </div>

        {/* Center AI MODEL Visualization */}
        <div className="relative mx-auto my-2 flex h-36 w-36 shrink-0 items-center justify-center sm:h-40 sm:w-40 lg:my-0 lg:mr-10 xl:mr-24">
          {/* Subtle Outer Dashed Circular Orbit Ring */}
          <div className="absolute h-28 w-28 rounded-full border border-dashed border-[#86efac]/80 dark:border-emerald-600/50 sm:h-32 sm:w-32" />

          {/* Radial Crosshair Lines */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 160 160"
          >
            <line
              x1="80"
              y1="22"
              x2="80"
              y2="138"
              stroke="#86efac"
              strokeWidth="1"
              strokeDasharray="2.5 2.5"
              strokeOpacity="0.7"
              className="dark:stroke-emerald-600/40"
            />
            <line
              x1="22"
              y1="80"
              x2="138"
              y2="80"
              stroke="#86efac"
              strokeWidth="1"
              strokeDasharray="2.5 2.5"
              strokeOpacity="0.7"
              className="dark:stroke-emerald-600/40"
            />
          </svg>

          {/* Center AI MODEL Circle */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="relative z-20 flex h-[52px] w-[52px] sm:h-14 sm:w-14 flex-col items-center justify-center rounded-full bg-[#075B3A] text-center shadow-md shadow-emerald-950/25 ring-3 ring-[#4ade80]/20 dark:bg-emerald-800"
          >
            {/* White 3-leaf sprout emblem */}
            <svg
              className="h-4.5 w-4.5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 10v10" />
              <path d="M12 10a5 5 0 0 1 5-5 5 5 0 0 1 0 10c-3 0-5-5-5-5Z" />
              <path d="M12 10a5 5 0 0 0-5-5 5 5 0 0 0 0 10c3 0 5-5 5-5Z" />
              <circle cx="12" cy="4" r="1.2" fill="currentColor" />
            </svg>
            <span className="mt-0.5 text-[8.5px] font-black uppercase tracking-wider text-white">
              AI MODEL
            </span>
          </motion.div>

          {/* 4 Surrounding Satellite Data Circles */}
          {SATELLITE_NODES.map((node, index) => {
            const Icon = node.icon;
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                className={`absolute z-20 flex flex-col items-center ${node.positionClass}`}
              >
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 flex-col items-center justify-center rounded-full border border-slate-100/90 bg-white p-0.5 shadow-sm shadow-slate-900/5 dark:border-emerald-800 dark:bg-card text-center">
                  <Icon className={`h-3.5 w-3.5 ${node.iconColor}`} />
                  <span className="mt-0.5 text-[7px] sm:text-[7.5px] font-bold leading-[1.05] text-[#1e293b] dark:text-slate-200">
                    {node.label.map((line, idx) => (
                      <span key={idx} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
