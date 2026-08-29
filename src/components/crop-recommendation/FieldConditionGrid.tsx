"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  CloudRain,
  Droplets,
  FlaskConical,
  Loader2,
  Sparkles,
  Sprout,
  Thermometer,
} from "lucide-react";
import { FieldConditionCard } from "./FieldConditionCard";
import { type FieldConditionState, type Season } from "./types";

interface FieldConditionGridProps {
  conditions: FieldConditionState;
  onChange: (updated: Partial<FieldConditionState>) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function FieldConditionGrid({
  conditions,
  onChange,
  onSubmit,
  isLoading = false,
}: FieldConditionGridProps) {
  const phOptions = [
    { label: "5.5 (Acidic)", value: 5.5 },
    { label: "6.0 (Slightly Acidic)", value: 6.0 },
    { label: "6.5 (Neutral-Ideal)", value: 6.5 },
    { label: "6.8 (Optimal)", value: 6.8 },
    { label: "7.2 (Neutral)", value: 7.2 },
    { label: "7.8 (Alkaline)", value: 7.8 },
    { label: "8.2 (High Alkaline)", value: 8.2 },
  ];

  const rainfallOptions = [
    { label: "350 mm (Low)", value: 350 },
    { label: "500 mm (Moderate)", value: 500 },
    { label: "600 mm (Optimal)", value: 600 },
    { label: "750 mm (Good)", value: 750 },
    { label: "900 mm (High)", value: 900 },
    { label: "1200 mm (Heavy)", value: 1200 },
  ];

  const tempOptions = [
    { label: "18 °C (Cool)", value: 18 },
    { label: "22 °C (Mild)", value: 22 },
    { label: "25 °C (Warm)", value: 25 },
    { label: "28 °C (Optimal)", value: 28 },
    { label: "32 °C (Hot)", value: 32 },
    { label: "36 °C (Very Hot)", value: 36 },
  ];

  const humidityOptions = [
    { label: "45 % (Dry)", value: 45 },
    { label: "55 % (Moderate)", value: 55 },
    { label: "62 % (Optimal)", value: 62 },
    { label: "70 % (Humid)", value: 70 },
    { label: "80 % (Very Humid)", value: 80 },
  ];

  const seasonOptions: { label: string; value: Season }[] = [
    { label: "Kharif (Monsoon)", value: "Kharif" },
    { label: "Rabi (Winter)", value: "Rabi" },
    { label: "Zaid (Summer)", value: "Zaid" },
    { label: "Whole Year", value: "Whole Year" },
  ];

  return (
    <div className="space-y-4">
      {/* Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Soil pH */}
        <FieldConditionCard
          icon={
            <FlaskConical className="h-4 w-4 text-sky-700 dark:text-sky-300" />
          }
          iconBg="bg-sky-100/70 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300"
          label="Soil pH"
          value={`${conditions.soilPh}`}
          options={phOptions}
          onSelect={(val) => onChange({ soilPh: Number(val) })}
        />

        {/* Card 2: Rainfall */}
        <FieldConditionCard
          icon={
            <CloudRain className="h-4 w-4 text-blue-700 dark:text-blue-300" />
          }
          iconBg="bg-blue-100/70 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
          label="Rainfall"
          value={`${conditions.rainfall} mm`}
          options={rainfallOptions}
          onSelect={(val) => onChange({ rainfall: Number(val) })}
        />

        {/* Card 3: Temperature */}
        <FieldConditionCard
          icon={
            <Thermometer className="h-4 w-4 text-amber-700 dark:text-amber-300" />
          }
          iconBg="bg-amber-100/70 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
          label="Temperature"
          value={`${conditions.temperature} °C`}
          options={tempOptions}
          onSelect={(val) => onChange({ temperature: Number(val) })}
        />

        {/* Card 4: Humidity */}
        <FieldConditionCard
          icon={
            <Droplets className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
          }
          iconBg="bg-cyan-100/70 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300"
          label="Humidity"
          value={`${conditions.humidity} %`}
          options={humidityOptions}
          onSelect={(val) => onChange({ humidity: Number(val) })}
        />

        {/* Card 5: Season */}
        <FieldConditionCard
          icon={
            <Calendar className="h-4 w-4 text-emerald-800 dark:text-emerald-300" />
          }
          iconBg="bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
          label="Season"
          value={conditions.season}
          options={seasonOptions}
          onSelect={(val) => onChange({ season: val })}
        />
      </div>

      {/* Action Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onSubmit}
        disabled={isLoading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#14532d] px-6 text-sm font-bold text-white shadow-md shadow-emerald-950/20 transition-all hover:bg-[#166534] disabled:opacity-75 dark:bg-emerald-700 dark:hover:bg-emerald-600 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-emerald-300" />
            <span>Analyzing Farm Conditions...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <span>Get AI Recommendation</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
