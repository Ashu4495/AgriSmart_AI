"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/shell";
import { useAccount } from "@/components/landing/user-controls";
import { useLocation } from "@/lib/location";
import { useLanguage } from "@/lib/i18n";
import {
  Sprout,
  Sun,
  FlaskConical,
  Coins,
  ShieldAlert,
  Calendar,
  ArrowRight,
  Check,
  CloudRain,
  TrendingUp,
  Bell,
  Stethoscope,
  BarChart3,
  Bot,
  Landmark,
  Loader2,
} from "lucide-react";
import cropWheat from "@/assets/crop-wheat.jpg";

import type { CropMarketData } from "@/lib/market";
import type { LiveWeatherData } from "@/lib/weather";

interface DashboardProfile {
  id?: string;
  farm_area?: string | number | null;
  current_crop?: string | null;
  crop_stage?: string | null;
  expected_harvest_date?: string | null;
  [key: string]: unknown;
}

interface DashboardCropRecommendation {
  id?: string;
  recommended_crop: string;
  confidence_score: number;
  [key: string]: unknown;
}

interface DashboardSoilHealth {
  score: number;
  status: string;
}

interface DashboardCropRisk {
  level: string;
}

interface DashboardTask {
  id?: string;
  name: string;
  description: string;
  dueDate: string;
}

interface DashboardNotification {
  id?: string;
  title: string;
  description?: string;
  time?: string;
}

interface DashboardData {
  profile: DashboardProfile | null;
  cropRecommendation: DashboardCropRecommendation | null;
  cropRisk?: DashboardCropRisk | null;
  weather: LiveWeatherData | null;
  marketPrices: CropMarketData[] | null;
  soilHealth: DashboardSoilHealth | null;
  tasks: DashboardTask[];
  notifications: DashboardNotification[];
}

export default function DashboardPage() {
  const { user, displayName } = useAccount();
  const { location, coords } = useLocation();
  const { t, lang } = useLanguage();

  const farmerGreeting = useMemo(() => {
    const hour = new Date().getHours();
    const timeGreeting =
      hour < 12
        ? t.dashboard.morning
        : hour < 17
          ? t.dashboard.afternoon
          : t.dashboard.evening;

    return displayName
      ? `${timeGreeting}, ${displayName}! 👋`
      : `${timeGreeting}, ${t.app.farmer}! 👋`;
  }, [displayName, t]);

  const dateStr = useMemo(() => {
    const localeMap: Record<string, string> = {
      en: "en-GB",
      hi: "hi-IN",
      mr: "mr-IN",
      pa: "pa-IN",
    };
    try {
      return new Date().toLocaleDateString(localeMap[lang] || "en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  }, [lang]);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      if (!user) return; // Wait for user

      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("userId", user.id);
        if (location) params.append("location", location);
        if (coords) {
          params.append("lat", coords.latitude.toString());
          params.append("lon", coords.longitude.toString());
        }

        const res = await fetch(`/api/v1/dashboard?${params.toString()}`);
        const json = await res.json();

        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error || "Failed to load dashboard data.");
        }
      } catch (err) {
        console.error(err);
        setError("Network error. Could not fetch dashboard data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, [user, location, coords]);

  return (
    <DashboardShell
      headerTitle={t.dashboard.page.dashboard}
      headerSubtitle={t.dashboard.page.smartFarmingTagline}
    >
      <div className="space-y-6 pb-8">
        {/* ======================================================== */}
        {/* 1. GREETING & DATE ROW                                   */}
        {/* ======================================================== */}
        {error && (
          <div className="mb-4 rounded-xl border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {farmerGreeting}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t.dashboard.page.intelligenceToday}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-border/80 bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-2xs">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span>{dateStr}</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. SIX TOP INTELLIGENCE CARDS                            */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {/* 1. Recommended Crop (Green) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.02 }}
            className="flex flex-col justify-between rounded-2xl border border-emerald-200/80 bg-[#f0fdf4] p-3.5 shadow-2xs hover:shadow-sm transition-all dark:bg-emerald-950/20 dark:border-emerald-900/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-[#168447]">
                  <Sprout className="h-4 w-4" />
                </div>
              </div>
              <span className="mt-2 block text-[10px] font-medium text-muted-foreground">
                {t.dashboard.page.recommendedCrop}
              </span>
              <div className="mt-0.5 flex items-center justify-between">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : data?.cropRecommendation ? (
                  <>
                    <span className="font-display text-sm font-bold text-foreground">
                      {data.cropRecommendation.recommended_crop || "Unknown"}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-[#168447]">
                      {Math.round(
                        data.cropRecommendation.confidence_score * 100,
                      )}
                      % {t.dashboard.page.match}
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] font-bold text-muted-foreground">
                    {t.dashboard.page.dataUnavailable}
                  </span>
                )}
              </div>
            </div>
            <Link
              href="/crop-intelligence"
              className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-[#168447] hover:underline"
            >
              <span>{t.dashboard.page.viewDetails}</span>
              <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          </motion.div>

          {/* 2. Weather Today (Blue) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.04 }}
            className="flex flex-col justify-between rounded-2xl border border-blue-200/80 bg-[#eff6ff] p-3.5 shadow-2xs hover:shadow-sm transition-all dark:bg-blue-950/20 dark:border-blue-900/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Sun className="h-4 w-4" />
                </div>
              </div>
              <span className="mt-2 block text-[10px] font-medium text-muted-foreground">
                {t.dashboard.page.weatherToday}
              </span>
              <div className="mt-0.5 flex items-baseline justify-between">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : data?.weather ? (
                  <>
                    <span className="font-display text-sm font-bold text-foreground">
                      {data.weather.temperature}°C
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      {data.weather.humidity}% {t.dashboard.page.humidity}
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] font-bold text-muted-foreground">
                    {t.dashboard.page.unavailable}
                  </span>
                )}
              </div>
            </div>
            <Link
              href="/weather-climate"
              className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline dark:text-blue-400"
            >
              <span>{t.dashboard.page.viewForecast}</span>
              <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          </motion.div>

          {/* 3. Soil Health Score (Yellow) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.06 }}
            className="flex flex-col justify-between rounded-2xl border border-amber-200/80 bg-[#fefce8] p-3.5 shadow-2xs hover:shadow-sm transition-all dark:bg-amber-950/20 dark:border-amber-900/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <FlaskConical className="h-4 w-4" />
                </div>
              </div>
              <span className="mt-2 block text-[10px] font-medium text-muted-foreground">
                {t.dashboard.page.soilHealthScore}
              </span>
              <div className="mt-0.5 flex items-center justify-between">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : data?.soilHealth ? (
                  <>
                    <span className="font-display text-sm font-bold text-foreground">
                      {data.soilHealth.score}/100
                    </span>
                    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                      {data.soilHealth.status}
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] font-medium text-amber-800 dark:text-amber-400">
                    {t.dashboard.page.addSoilData}
                  </span>
                )}
              </div>
            </div>
            <Link
              href="/soil-crop-health"
              className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 hover:underline dark:text-amber-400"
            >
              <span>{t.dashboard.page.viewSoilReport}</span>
              <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          </motion.div>

          {/* 4. Market Price (Purple) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.08 }}
            className="flex flex-col justify-between rounded-2xl border border-purple-200/80 bg-[#faf5ff] p-3.5 shadow-2xs hover:shadow-sm transition-all dark:bg-purple-950/20 dark:border-purple-900/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                  <Coins className="h-4 w-4" />
                </div>
              </div>
              <span className="mt-2 block text-[10px] font-medium text-muted-foreground">
                {t.dashboard.page.marketPrice}{" "}
                {data?.marketPrices?.[0]
                  ? `(${data.marketPrices[0].name})`
                  : ""}
              </span>
              <div className="mt-0.5 flex items-center justify-between">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : data?.marketPrices?.[0] ? (
                  <>
                    <span className="font-display text-xs font-bold text-foreground">
                      ₹{data.marketPrices[0].price.toLocaleString()}{" "}
                      <span className="text-[9px] text-muted-foreground font-normal">
                        {data.marketPrices[0].unit}
                      </span>
                    </span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${data.marketPrices[0].up ? "bg-purple-100 text-purple-700" : "bg-rose-100 text-rose-700"}`}
                    >
                      {data.marketPrices[0].change}
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] font-bold text-muted-foreground">
                    {t.dashboard.page.unavailable}
                  </span>
                )}
              </div>
            </div>
            <Link
              href="/market-finance"
              className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 hover:underline dark:text-purple-400"
            >
              <span>{t.dashboard.page.viewMarket}</span>
              <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          </motion.div>

          {/* 5. Crop Risk (Red/Pink) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="flex flex-col justify-between rounded-2xl border border-rose-200/80 bg-[#fff1f2] p-3.5 shadow-2xs hover:shadow-sm transition-all dark:bg-rose-950/20 dark:border-rose-900/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                  <ShieldAlert className="h-4 w-4" />
                </div>
              </div>
              <span className="mt-2 block text-[10px] font-medium text-muted-foreground">
                {t.dashboard.page.cropRisk}
              </span>
              <div className="mt-0.5 flex items-baseline justify-between">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : data?.cropRisk ? (
                  <>
                    <span className="font-display text-sm font-bold text-foreground">
                      {data.cropRisk.level}
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      {t.dashboard.page.riskLevel}
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] font-medium text-rose-800 dark:text-rose-400">
                    {t.dashboard.page.analysisUnavailable}
                  </span>
                )}
              </div>
            </div>
            <Link
              href="/weather-climate#risk"
              className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:underline dark:text-rose-400"
            >
              <span>{t.dashboard.page.viewAnalysis}</span>
              <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          </motion.div>

          {/* 6. Next Task (Cyan/Teal) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.12 }}
            className="flex flex-col justify-between rounded-2xl border border-teal-200/80 bg-[#f0fdfa] p-3.5 shadow-2xs hover:shadow-sm transition-all dark:bg-teal-950/20 dark:border-teal-900/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                  <Calendar className="h-4 w-4" />
                </div>
              </div>
              <span className="mt-2 block text-[10px] font-medium text-muted-foreground">
                {t.dashboard.page.nextTask}
              </span>
              <div className="mt-0.5 flex items-baseline justify-between">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : data?.tasks && data.tasks.length > 0 ? (
                  <>
                    <span className="font-display text-xs font-bold text-foreground truncate max-w-[80px]">
                      {data.tasks[0].name}
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      {data.tasks[0].dueDate}
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] font-medium text-teal-800 dark:text-teal-400">
                    {t.dashboard.page.noUpcomingTasks}
                  </span>
                )}
              </div>
            </div>

          </motion.div>
        </div>

        {/* ======================================================== */}
        {/* 3. MAIN DASHBOARD GRID (3-COLUMN LAYOUT)                 */}
        {/* ======================================================== */}
        <div className="grid gap-5 lg:grid-cols-12">
          {/* -------------------------------------------------------- */}
          {/* COLUMN 1: AI CROP RECOMMENDATION (5 Cols)                */}
          {/* -------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs lg:col-span-5"
          >
            <div>
              <div className="flex items-center gap-2 pb-3.5 border-b border-border/60">
                <Sprout className="h-4.5 w-4.5 text-[#168447]" />
                <h3 className="font-display text-sm font-bold text-foreground">
                  {t.dashboard.page.aiCropRecommendation}
                </h3>
              </div>

              {isLoading ? (
                <div className="mt-8 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/40" />
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.dashboard.page.loadingInsights}
                  </p>
                </div>
              ) : data?.cropRecommendation ? (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Left Photo & Title */}
                  <div>
                    <div className="h-32 w-full overflow-hidden rounded-xl bg-muted">
                      <img
                        src={cropWheat.src}
                        alt={data.cropRecommendation.recommended_crop}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-2.5">
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {t.dashboard.page.bestCropForFarm}
                      </span>
                      <div className="flex items-center justify-between mt-0.5">
                        <h4 className="font-display text-base font-extrabold text-foreground capitalize">
                          {data.cropRecommendation.recommended_crop}
                        </h4>
                        <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-bold text-[#15803d]">
                          {Math.round(
                            data.cropRecommendation.confidence_score * 100,
                          )}
                          % {t.dashboard.page.suitability}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                        {t.dashboard.page.basedOnSoil},{" "}
                        {data.cropRecommendation.recommended_crop}{" "}
                        {t.dashboard.page.isTheBest}
                      </p>
                    </div>
                  </div>

                  {/* Right Checklist */}
                  <div>
                    <h4 className="text-xs font-bold text-foreground mb-2 capitalize">
                      Why {data.cropRecommendation.recommended_crop}?
                    </h4>
                    <div className="space-y-1.5 text-[11px] text-muted-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-[#168447] shrink-0" />
                        <span>{t.dashboard.page.suitableConditions}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-[#168447] shrink-0" />
                        <span>{t.dashboard.page.optimalTemp}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-[#168447] shrink-0" />
                        <span>{t.dashboard.page.goodRainfall}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-[#168447] shrink-0" />
                        <span>{t.dashboard.page.highMarketDemand}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-[#168447] shrink-0" />
                        <span>{t.dashboard.page.higherProfitability}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-[#168447] shrink-0" />
                        <span>{t.dashboard.page.lowDiseaseRisk}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-8 flex flex-col items-center justify-center space-y-3 rounded-xl border border-dashed border-border/60 bg-muted/30 p-6 text-center">
                  <Bot className="h-8 w-8 text-muted-foreground/40" />
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {t.dashboard.page.noRecommendation}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {t.dashboard.page.completeSoilInfo}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end pt-3 border-t border-border/40">
              <Link
                href="/crop-intelligence"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#168447] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#14743e]"
              >
                <span>{t.dashboard.page.viewFullRecommendation}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* -------------------------------------------------------- */}
          {/* COLUMN 2: WEATHER ALERT + MARKET PRICES (4 Cols)         */}
          {/* -------------------------------------------------------- */}
          <div className="space-y-5 lg:col-span-4">
            {/* Weather Alert */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="rounded-2xl border border-blue-200/80 bg-[#eff6ff] p-4 shadow-xs dark:bg-blue-950/20 dark:border-blue-900/40"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-blue-200/50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <CloudRain className="h-4 w-4 text-blue-600" />
                  <span>{t.dashboard.page.weatherAlert}</span>
                </div>
                <Link
                  href="/weather-climate"
                  className="text-[10px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  {t.dashboard.page.viewDetails}
                </Link>
              </div>

              {isLoading ? (
                <div className="mt-4 flex items-center justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500/50" />
                </div>
              ) : (data?.weather?.rainfall ?? 0) > 50 ? (
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-foreground leading-snug">
                      {t.dashboard.page.heavyRainfallAlert}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      <strong className="text-foreground">
                        {t.dashboard.page.recommendedAction}
                      </strong>{" "}
                      {t.dashboard.page.avoidIrrigation}
                    </p>
                    <Link
                      href="/weather-climate"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline pt-1 dark:text-blue-400"
                    >
                      <span>{t.dashboard.page.viewDetails}</span>
                      <ArrowRight className="h-2.5 w-2.5" />
                    </Link>
                  </div>

                  {/* Rain Cloud SVG Illustration */}
                  <div className="flex h-12 w-14 shrink-0 items-center justify-center text-blue-400">
                    <svg
                      viewBox="0 0 48 36"
                      className="h-10 w-12 drop-shadow-xs"
                      fill="currentColor"
                    >
                      <path
                        d="M12 24C8 24 4 21 4 16C4 12 7 9 11 9C12 5 16 2 21 2C26 2 30 5 31 9C35 9 38 12 38 16C38 21 34 24 30 24 Z"
                        fill="#64748b"
                        opacity="0.8"
                      />
                      <line
                        x1="12"
                        y1="28"
                        x2="10"
                        y2="34"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="20"
                        y1="28"
                        x2="18"
                        y2="34"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="28"
                        y1="28"
                        x2="26"
                        y2="34"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-center p-4">
                  <span className="text-[11px] font-medium text-blue-600/70 dark:text-blue-400/70">
                    {t.dashboard.page.noWeatherAlerts}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Market Prices */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <TrendingUp className="h-4 w-4 text-[#168447]" />
                  <span>{t.dashboard.page.marketPrices}</span>
                </div>
                <Link
                  href="/market-finance"
                  className="text-[10px] font-semibold text-[#168447] hover:underline"
                >
                  {t.dashboard.page.viewAll}
                </Link>
              </div>

              <div className="mt-2.5 overflow-x-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
                  </div>
                ) : data?.marketPrices && data.marketPrices.length > 0 ? (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-muted-foreground text-[10px] border-b border-border/40">
                        <th className="pb-1.5 text-left font-semibold">
                          {t.dashboard.page.crop}
                        </th>
                        <th className="pb-1.5 text-left font-semibold">
                          {t.dashboard.page.market}
                        </th>
                        <th className="pb-1.5 text-right font-semibold">
                          {t.dashboard.page.pricePerQtl}
                        </th>
                        <th className="pb-1.5 text-right font-semibold">
                          {t.dashboard.page.change}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 text-[11px] font-medium">
                      {data.marketPrices
                        .slice(0, 4)
                        .map((marketData: CropMarketData, index: number) => (
                          <tr key={index} className="hover:bg-muted/20">
                            <td className="py-1.5 font-bold text-foreground">
                              {marketData.name}
                            </td>
                            <td className="py-1.5 text-muted-foreground">
                              {marketData.topMarkets[0]?.market.split(",")[0]}
                            </td>
                            <td className="py-1.5 text-right font-bold text-foreground">
                              ₹{marketData.price.toLocaleString()}
                            </td>
                            <td
                              className={`py-1.5 text-right font-bold ${marketData.up ? "text-[#16a34a]" : "text-rose-500"}`}
                            >
                              {marketData.up ? "↑" : "↓"}{" "}
                              {marketData.change
                                .replace("+", "")
                                .replace("-", "")}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex items-center justify-center py-6">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {t.dashboard.page.marketUnavailable}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* -------------------------------------------------------- */}
          {/* COLUMN 3: TODAY'S TASKS + SMART NOTIFICATIONS (3 Cols)   */}
          {/* -------------------------------------------------------- */}
          <div className="space-y-5 lg:col-span-3">
            {/* Today's Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Sprout className="h-4 w-4 text-[#168447]" />
                  <span>{t.dashboard.page.todaysTasks}</span>
                </div>

              </div>

              <div className="mt-2.5 space-y-2 text-xs">
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
                  </div>
                ) : data?.tasks && data.tasks.length > 0 ? (
                  data.tasks
                    .slice(0, 5)
                    .map((task: DashboardTask, index: number) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between gap-2 ${index > 0 ? "pt-1.5 border-t border-border/30" : ""}`}
                      >
                        <div>
                          <h4 className="font-bold text-foreground text-[11px]">
                            {task.name}
                          </h4>
                          <p className="text-[10px] text-muted-foreground">
                            {task.description}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#fef9c3] px-2 py-0.5 text-[9px] font-bold text-[#ca8a04]">
                          {task.dueDate}
                        </span>
                      </div>
                    ))
                ) : (
                  <div className="flex items-center justify-center py-6">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {t.dashboard.page.noUpcomingTasks}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Smart Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Bell className="h-4 w-4 text-[#168447]" />
                  <span>{t.dashboard.page.smartNotifications}</span>
                </div>
                <Link
                  href="/weather-climate#alerts"
                  className="text-[10px] font-semibold text-[#168447] hover:underline"
                >
                  {t.dashboard.page.viewAll}
                </Link>
              </div>

              <div className="mt-2.5 space-y-2 text-xs">
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
                  </div>
                ) : data?.notifications && data.notifications.length > 0 ? (
                  data.notifications
                    .slice(0, 4)
                    .map(
                      (notification: DashboardNotification, index: number) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between gap-2 ${index > 0 ? "pt-1.5 border-t border-border/30" : ""}`}
                        >
                          <div className="flex items-center gap-2">
                            <Bell className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                            <span className="text-[11px] text-foreground font-medium">
                              {notification.title}
                            </span>
                          </div>
                          <span className="text-[9px] text-muted-foreground">
                            {notification.time}
                          </span>
                        </div>
                      ),
                    )
                ) : (
                  <div className="flex items-center justify-center py-6">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {t.dashboard.page.noNotifications}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. FARM OVERVIEW & QUICK ACTIONS                         */}
        {/* ======================================================== */}
        <div className="grid gap-5 lg:grid-cols-12">
          {/* Farm Overview (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.18 }}
            className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs lg:col-span-7"
          >
            <h3 className="font-display text-sm font-bold text-foreground pb-3 border-b border-border/60">
              {t.dashboard.page.farmOverview}
            </h3>

            {isLoading ? (
              <div className="mt-4 flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
              </div>
            ) : data?.profile ? (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5 text-center">
                {/* 1. Total Area */}
                <div>
                  <span className="block text-[10px] text-muted-foreground">
                    {t.dashboard.page.totalArea}
                  </span>
                  <span className="font-display text-sm font-black text-foreground">
                    {data.profile.farm_area || "N/A"} {t.dashboard.page.acres}
                  </span>
                </div>
                {/* 2. Current Crop */}
                <div>
                  <span className="block text-[10px] text-muted-foreground">
                    {t.dashboard.page.currentCrop}
                  </span>
                  <span className="font-display text-sm font-black text-foreground">
                    {data.profile.current_crop || t.dashboard.page.none}
                  </span>
                </div>
                {/* 3. Crop Stage */}
                <div>
                  <span className="block text-[10px] text-muted-foreground">
                    {t.dashboard.page.cropStage}
                  </span>
                  <span className="font-display text-sm font-black text-foreground">
                    {data.profile.crop_stage || "N/A"}
                  </span>
                </div>
                {/* 4. Expected Harvest */}
                <div>
                  <span className="block text-[10px] text-muted-foreground">
                    {t.dashboard.page.expectedHarvest}
                  </span>
                  <span className="font-display text-xs font-bold text-foreground">
                    {data.profile.expected_harvest_date
                      ? new Date(
                          String(data.profile.expected_harvest_date),
                        ).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
                {/* 5. Irrigation Status */}
                <div>
                  <span className="block text-[10px] text-muted-foreground">
                    {t.dashboard.page.irrigationStatus}
                  </span>
                  <span className="font-display text-sm font-bold text-[#16a34a]">
                    {t.dashboard.page.irrigationGood}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-center justify-center py-4">
                <span className="text-[11px] font-medium text-muted-foreground">
                  {t.dashboard.page.completeProfile}
                </span>
              </div>
            )}
          </motion.div>

          {/* Quick Actions (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs lg:col-span-5"
          >
            <h3 className="font-display text-sm font-bold text-foreground pb-3 border-b border-border/60">
              {t.dashboard.page.quickActions}
            </h3>

            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6 text-center">
              {/* Action 1 */}
              <Link
                href="/crop-intelligence"
                className="flex flex-col items-center justify-center rounded-xl border border-border/70 bg-background p-2 hover:border-[#168447] hover:bg-accent transition-all"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-[#168447] mb-1">
                  <Sprout className="h-3.5 w-3.5" />
                </div>
                <span className="text-[9px] font-bold text-foreground leading-tight">
                  {t.dashboard.page.cropRec}
                </span>
              </Link>

              {/* Action 2 */}
              <Link
                href="/soil-crop-health"
                className="flex flex-col items-center justify-center rounded-xl border border-border/70 bg-background p-2 hover:border-amber-500 hover:bg-accent transition-all"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700 mb-1">
                  <FlaskConical className="h-3.5 w-3.5" />
                </div>
                <span className="text-[9px] font-bold text-foreground leading-tight">
                  {t.dashboard.page.soilTest}
                </span>
              </Link>

              {/* Action 3 */}
              <Link
                href="/soil-crop-health#disease"
                className="flex flex-col items-center justify-center rounded-xl border border-border/70 bg-background p-2 hover:border-emerald-500 hover:bg-accent transition-all"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime-100 text-lime-700 mb-1">
                  <Stethoscope className="h-3.5 w-3.5" />
                </div>
                <span className="text-[9px] font-bold text-foreground leading-tight">
                  {t.dashboard.page.disease}
                </span>
              </Link>

              {/* Action 4 */}
              <Link
                href="/market-finance"
                className="flex flex-col items-center justify-center rounded-xl border border-border/70 bg-background p-2 hover:border-purple-500 hover:bg-accent transition-all"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700 mb-1">
                  <BarChart3 className="h-3.5 w-3.5" />
                </div>
                <span className="text-[9px] font-bold text-foreground leading-tight">
                  {t.dashboard.page.market}
                </span>
              </Link>

              {/* Action 5 */}
              <Link
                href="/ai-assistant"
                className="flex flex-col items-center justify-center rounded-xl border border-border/70 bg-background p-2 hover:border-[#168447] hover:bg-accent transition-all"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 mb-1">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <span className="text-[9px] font-bold text-foreground leading-tight">
                  {t.dashboard.page.aiChat}
                </span>
              </Link>

              {/* Action 6 */}
              <Link
                href="/government-resources"
                className="flex flex-col items-center justify-center rounded-xl border border-border/70 bg-background p-2 hover:border-emerald-500 hover:bg-accent transition-all"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-[#168447] mb-1">
                  <Landmark className="h-3.5 w-3.5" />
                </div>
                <span className="text-[9px] font-bold text-foreground leading-tight">
                  {t.dashboard.page.govtResources || "Schemes"}
                </span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ======================================================== */}
        {/* 5. BOTTOM TAGLINE                                        */}
        {/* ======================================================== */}
        <div className="flex items-center justify-center gap-2 pt-2 text-center text-xs text-muted-foreground font-medium">
          <Sprout className="h-4 w-4 text-[#168447]" />
          <span>{t.dashboard.page.empoweringFarmers}</span>
          <span>•</span>
          <span>{t.dashboard.page.dataDriven}</span>
          <span>•</span>
          <span>{t.dashboard.page.betterYield}</span>
          <span>•</span>
          <span>{t.dashboard.page.higherProfit}</span>
        </div>
      </div>
    </DashboardShell>
  );
}
