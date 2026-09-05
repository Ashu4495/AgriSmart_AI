"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/shell";
import { useLocation } from "@/lib/location";
import { cn } from "@/lib/utils";
import {
  CloudSun,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  AlertTriangle,
  Info,
  Sprout,
  ArrowRight,
  Sparkles,
  Gauge,
  RefreshCw,
  CloudLightning,
  Snowflake,
  Cloud,
  MapPin,
  LocateFixed,
  Search,
  ChevronDown,
  Check,
  Compass,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATE_LOCATIONS } from "@/components/crop-recommendation/CropRecommendationPage";
import type { LiveWeatherData, WeatherForecast } from "@/lib/weather";
import type { FarmingAlert } from "@/app/api/v1/weather/alerts/route";
import type { ClimateRiskResult } from "@/app/api/v1/weather/climate-risk/route";

function conditionIcon(condition: string, cls = "h-7 w-7") {
  const c = condition.toLowerCase();
  if (c.includes("thunder"))
    return <CloudLightning className={`${cls} text-purple-500`} />;
  if (c.includes("snow"))
    return <Snowflake className={`${cls} text-sky-300`} />;
  if (c.includes("rain") || c.includes("drizzle"))
    return <CloudRain className={`${cls} text-sky-500`} />;
  if (c.includes("fog")) return <Cloud className={`${cls} text-slate-400`} />;
  if (c.includes("partly"))
    return <CloudSun className={`${cls} text-amber-500`} />;
  if (c.includes("clear") || c.includes("sunny"))
    return <Sun className={`${cls} text-amber-500`} />;
  return <CloudSun className={`${cls} text-amber-500`} />;
}

function alertIconComponent(iconType: string) {
  switch (iconType) {
    case "rain":
    case "heavy-rain":
    case "very-heavy-rain":
    case "flood":
      return CloudRain;
    case "wind":
      return Wind;
    case "heat":
    case "extreme-heat":
    case "high-temp":
      return Thermometer;
    case "cold":
      return Snowflake;
    case "drought":
    case "dry-period":
      return AlertTriangle;
    case "temp-change":
      return RefreshCw;
    default:
      return AlertTriangle;
  }
}

function alertIconBg(severity: string): string {
  switch (severity) {
    case "Critical":
      return "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400";
    case "High":
      return "bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400";
    case "Medium":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300";
    default:
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300";
  }
}

function alertSeverityColor(severity: string): string {
  switch (severity) {
    case "Critical":
      return "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/60";
    case "High":
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800/60";
    case "Medium":
      return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/60";
    default:
      return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/60";
  }
}

function DonutChart({
  risk,
  level,
}: {
  risk: ClimateRiskResult | null;
  level: string;
}) {
  const size = 136;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = risk
    ? [
        { percent: Math.max(1, risk.drought), color: "#f97316" }, // Drought
        { percent: Math.max(1, risk.flood), color: "#0284c7" },   // Flood
        { percent: Math.max(1, risk.heatStress), color: "#ef4444" }, // Heat Stress
      ]
    : [
        { percent: 33, color: "#f97316" },
        { percent: 33, color: "#0284c7" },
        { percent: 34, color: "#ef4444" },
      ];

  const total = segments.reduce((s, sg) => s + sg.percent, 0) || 100;
  const normed = segments.map((sg) => ({
    ...sg,
    percent: (sg.percent / total) * 100,
  }));

  let accumulatedPercent = 0;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {normed.map((seg, idx) => {
          const strokeDasharray = `${(seg.percent / 100) * circumference} ${circumference}`;
          const strokeDashoffset = -(
            (accumulatedPercent / 100) *
            circumference
          );
          accumulatedPercent += seg.percent;
          return (
            <circle
              key={idx}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="butt"
              className="transition-all duration-700"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] font-medium text-muted-foreground">
          Risk Level
        </span>
        <span className="font-display text-sm font-black text-foreground">
          {risk ? risk.level : level}
        </span>
        <span className="text-[9px] text-muted-foreground font-semibold">This Week</span>
      </div>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <span
      className={`block animate-pulse rounded bg-muted ${className ?? ""}`}
    />
  );
}

export default function WeatherClimatePage() {
  const {
    location,
    coords,
    isLive,
    isLoading: isLocationLoading,
    fetchLiveLocation,
    setLocation,
  } = useLocation();

  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);
  const [alerts, setAlerts] = useState<FarmingAlert[]>([]);
  const [risk, setRisk] = useState<ClimateRiskResult | null>(null);

  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingForecast, setLoadingForecast] = useState(true);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [loadingRisk, setLoadingRisk] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [riskError, setRiskError] = useState<string | null>(null);
  const [unreadAlertCount, setUnreadAlertCount] = useState(0);
  const alertsOpenedRef = useRef(false);

  // Location selector & forecast view state
  const [locationSearch, setLocationSearch] = useState("");
  const [customLocationInput, setCustomLocationInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [forecastDaysTab, setForecastDaysTab] = useState<5 | 7 | 10>(5);

  function buildQS(extra?: Record<string, string>) {
    const p = new URLSearchParams();
    if (isLive && coords?.latitude && coords?.longitude) {
      p.set("lat", String(coords.latitude));
      p.set("lon", String(coords.longitude));
    }
    p.set("location", location);
    if (extra) Object.entries(extra).forEach(([k, v]) => p.set(k, v));
    return p.toString();
  }

  const loadWeather = useCallback(
    async (refresh = false) => {
      setLoadingWeather(true);
      setWeatherError(null);
      try {
        const qs = buildQS(refresh ? { refresh: "1" } : undefined);
        const res = await fetch(`/api/v1/weather/current?${qs}`);
        const json = await res.json();
        if (json.success && json.data) {
          setWeather(json.data as LiveWeatherData);
        } else {
          setWeatherError(
            json.error ||
              "Weather data is temporarily unavailable. Please try refreshing again.",
          );
        }
      } catch {
        setWeatherError(
          "Weather data is temporarily unavailable. Please try refreshing again.",
        );
      } finally {
        setLoadingWeather(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location, coords, isLive],
  );

  const loadForecast = useCallback(async () => {
    setLoadingForecast(true);
    try {
      const qs = buildQS({ days: "10" });
      const res = await fetch(`/api/v1/weather/forecast?${qs}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setForecast(json.data as WeatherForecast[]);
      }
    } catch {
      /* silently keep empty */
    } finally {
      setLoadingForecast(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, coords, isLive]);

  const loadAlerts = useCallback(async () => {
    setLoadingAlerts(true);
    try {
      const qs = buildQS();
      const res = await fetch(`/api/v1/weather/alerts?${qs}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const newAlerts = json.data as FarmingAlert[];
        setAlerts(newAlerts);
        if (!alertsOpenedRef.current) setUnreadAlertCount(newAlerts.length);
      }
    } catch {
      /* silently keep empty */
    } finally {
      setLoadingAlerts(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, coords, isLive]);

  const loadRisk = useCallback(async () => {
    setLoadingRisk(true);
    setRisk(null);
    setRiskError(null);
    try {
      const qs = buildQS();
      const res = await fetch(`/api/v1/weather/climate-risk?${qs}`);
      const json = await res.json();
      if (json.success && json.data) {
        setRisk(json.data as ClimateRiskResult);
      } else {
        setRiskError(json.error || "Climate risk data unavailable. Please refresh.");
      }
    } catch {
      setRiskError("Climate risk data unavailable. Please refresh.");
    } finally {
      setLoadingRisk(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, coords, isLive]);

  useEffect(() => {
    void loadWeather();
    void loadForecast();
    void loadAlerts();
    void loadRisk();
  }, [loadWeather, loadForecast, loadAlerts, loadRisk]);

  async function handleRefresh() {
    setIsRefreshing(true);
    await Promise.all([
      loadWeather(true),
      loadForecast(),
      loadAlerts(),
      loadRisk(),
    ]);
    setIsRefreshing(false);
  }

  async function handleAutoDetectGps() {
    try {
      const detected = await fetchLiveLocation();
      if (detected) {
        toast.success(`Live GPS location synchronized: ${detected}`);
        await handleRefresh();
      }
    } catch {
      toast.error(
        "Unable to auto-detect GPS. Please choose your location from the list.",
      );
    }
  }

  function handleSelectLocation(loc: string) {
    setLocation(loc, false);
    setShowCustomInput(false);
    toast.success(`Location set to ${loc}. Live weather synchronized!`);
  }

  function handleApplyCustomLocation(e: React.FormEvent) {
    e.preventDefault();
    if (!customLocationInput.trim()) return;
    const clean = customLocationInput.trim();
    setLocation(clean, false);
    setShowCustomInput(false);
    toast.success(`Location updated to ${clean}. Fetching live weather...`);
  }

  const forecastDisplay = forecast.slice(0, forecastDaysTab);

  const climateRisks = risk
    ? [
        {
          label: "Drought Risk",
          level:
            risk.risks?.drought?.level ||
            (risk.drought >= 75
              ? "Critical"
              : risk.drought >= 50
                ? "High"
                : risk.drought >= 25
                  ? "Medium"
                  : "Low"),
          colorText:
            risk.drought >= 50
              ? "text-[#dc2626]"
              : risk.drought >= 25
                ? "text-[#ea580c]"
                : "text-[#16a34a]",
          colorBar:
            risk.drought >= 50
              ? "bg-[#ef4444]"
              : risk.drought >= 25
                ? "bg-[#f97316]"
                : "bg-[#22c55e]",
          percent: risk.drought,
          why:
            risk.risks?.drought?.why ||
            (risk.drought >= 50
              ? "Extended dry spell and high evaporative demand are rapidly depleting root zone moisture."
              : "Soil moisture and recent rainfall are currently adequate for standing crops."),
          action:
            risk.risks?.drought?.action ||
            (risk.drought >= 50
              ? "Increase irrigation frequency immediately and apply organic mulching to conserve moisture."
              : "Maintain standard irrigation schedules and check soil moisture regularly."),
          icon: AlertTriangle,
          iconColor: risk.drought >= 50 ? "text-red-500" : "text-amber-500",
        },
        {
          label: "Flood Risk",
          level:
            risk.risks?.flood?.level ||
            (risk.flood >= 75
              ? "Critical"
              : risk.flood >= 50
                ? "High"
                : risk.flood >= 25
                  ? "Medium"
                  : "Low"),
          colorText:
            risk.flood >= 50
              ? "text-[#dc2626]"
              : risk.flood >= 25
                ? "text-[#ea580c]"
                : "text-[#16a34a]",
          colorBar:
            risk.flood >= 50
              ? "bg-[#ef4444]"
              : risk.flood >= 25
                ? "bg-[#f97316]"
                : "bg-[#22c55e]",
          percent: risk.flood,
          why:
            risk.risks?.flood?.why ||
            (risk.flood >= 50
              ? "Rainfall forecast indicates increased precipitation over the next few days."
              : "Expected rainfall is within normal absorption limits with minimal waterlogging threat."),
          action:
            risk.risks?.flood?.action ||
            (risk.flood >= 50
              ? "Check field drainage and avoid unnecessary field operations during heavy rain."
              : "Keep primary farm drainage outlets clear as routine preventative maintenance."),
          icon: CloudRain,
          iconColor: risk.flood >= 50 ? "text-red-500" : "text-sky-500",
        },
        {
          label: "Heat Stress Risk",
          level:
            risk.risks?.heat_stress?.level ||
            (risk.heatStress >= 75
              ? "Critical"
              : risk.heatStress >= 50
                ? "High"
                : risk.heatStress >= 25
                  ? "Medium"
                  : "Low"),
          colorText:
            risk.heatStress >= 50
              ? "text-[#dc2626]"
              : risk.heatStress >= 25
                ? "text-[#ea580c]"
                : "text-[#16a34a]",
          colorBar:
            risk.heatStress >= 50
              ? "bg-[#ef4444]"
              : risk.heatStress >= 25
                ? "bg-[#f97316]"
                : "bg-[#22c55e]",
          percent: risk.heatStress,
          why:
            risk.risks?.heat_stress?.why ||
            (risk.heatStress >= 50
              ? "High daytime temperatures may stress sensitive crops and increase transpiration rates."
              : "Temperatures remain within optimal physiological ranges for healthy crop growth."),
          action:
            risk.risks?.heat_stress?.action ||
            (risk.heatStress >= 50
              ? "Irrigate in early morning or evening. Avoid applying chemical sprays during maximum heat hours."
              : "Continue standard crop management and routine field operations."),
          icon: Thermometer,
          iconColor: risk.heatStress >= 50 ? "text-rose-500" : "text-amber-500",
        },
      ]
    : [];

  const forecastBannerText = (() => {
    if (loadingForecast) return "Loading forecast...";
    if (!forecast.length) return "Forecast data unavailable.";
    const rainyDays = forecast.slice(1, 5).filter((d) => d.rainfall > 5);
    if (!rainyDays.length)
      return "No significant rainfall expected in the coming days.";
    if (rainyDays.length === 1)
      return `Expecting rainfall on ${rainyDays[0].day} (${rainyDays[0].rainfall} mm).`;
    return `Expecting rainfall on ${rainyDays.map((d) => d.day).join(" & ")} over the coming days.`;
  })();

  // Filter locations by search and state
  const filteredStateGroups = STATE_LOCATIONS.map((grp) => {
    const matchingLocs = grp.locations.filter((loc) =>
      loc.toLowerCase().includes(locationSearch.toLowerCase()),
    );
    if (matchingLocs.length === 0) return null;
    return {
      state: grp.state,
      locations: matchingLocs,
    };
  }).filter(Boolean) as { state: string; locations: string[] }[];

  return (
    <DashboardShell>
      <div className="space-y-6 pb-8">
        {/* ======================================================== */}
        {/* 1. INTERACTIVE LIVE LOCATION & CONTROLS TOOLBAR         */}
        {/* ======================================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 rounded-2xl border border-border/80 bg-white p-3.5 shadow-xs dark:bg-card">
          {/* Location Selector */}
          <div className="flex flex-wrap items-center gap-2.5">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-10 items-center gap-2 rounded-xl border border-border/80 bg-background px-3.5 text-xs font-bold text-foreground shadow-2xs hover:bg-accent transition-all cursor-pointer">
                <div className="relative flex items-center">
                  <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                  {isLive && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
                <span className="truncate max-w-[200px] sm:max-w-[280px]">
                  {location}
                </span>
                <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {isLive ? "Live GPS" : "Region"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-1 shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-72 sm:w-80 max-h-80 overflow-y-auto p-2"
              >
                {/* Search Header */}
                <div className="p-1 pb-2 border-b border-border/60 sticky top-0 bg-popover z-10 space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search city, district, state..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      className="w-full h-8 pl-8 pr-2.5 text-xs rounded-lg border border-border/80 bg-background text-foreground outline-none focus:border-primary"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    className="w-full text-left text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline px-1"
                  >
                    {showCustomInput
                      ? "← Back to presets"
                      : "+ Enter Custom Location"}
                  </button>
                </div>

                {/* Custom input mode */}
                {showCustomInput ? (
                  <form
                    onSubmit={handleApplyCustomLocation}
                    className="p-2 space-y-2"
                  >
                    <p className="text-[11px] text-muted-foreground">
                      Type any village, town, or city name:
                    </p>
                    <input
                      type="text"
                      placeholder="e.g. Nashik, Maharashtra"
                      value={customLocationInput}
                      onChange={(e) => setCustomLocationInput(e.target.value)}
                      className="w-full h-8 px-2.5 text-xs rounded-lg border border-border/80 bg-background text-foreground outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      className="w-full h-8 rounded-lg bg-[#087a36] text-xs font-bold text-white hover:bg-[#06632b]"
                    >
                      Apply Location
                    </button>
                  </form>
                ) : (
                  <>
                    {/* Auto-detect GPS button inside dropdown */}
                    <DropdownMenuItem
                      onClick={handleAutoDetectGps}
                      className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40 cursor-pointer flex items-center justify-between py-2 border-b my-1 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <LocateFixed className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Auto-Detect Current GPS</span>
                      </div>
                      {isLocationLoading && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      )}
                    </DropdownMenuItem>

                    {/* Filtered state groupings */}
                    {filteredStateGroups.map((grp) => (
                      <div key={grp.state} className="py-1">
                        <span className="block px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80">
                          {grp.state}
                        </span>
                        {grp.locations.map((loc) => (
                          <DropdownMenuItem
                            key={loc}
                            onClick={() => handleSelectLocation(loc)}
                            className="flex items-center justify-between text-xs py-1.5 px-2 rounded-md cursor-pointer hover:bg-accent"
                          >
                            <span>{loc}</span>
                            {location === loc && !isLive && (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </div>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Direct Auto-Detect GPS Button */}
            <button
              type="button"
              onClick={handleAutoDetectGps}
              disabled={isLocationLoading}
              className="flex h-10 items-center gap-1.5 rounded-xl border border-emerald-600/30 bg-emerald-50/60 px-3 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100/70 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
              title="Detect exact coordinates via GPS"
            >
              {isLocationLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
              ) : (
                <LocateFixed className="h-3.5 w-3.5 text-emerald-600" />
              )}
              <span className="hidden sm:inline">Auto-Detect GPS</span>
            </button>
          </div>

          {/* Right Toolbar Status & Refresh */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
              🛰️ Open-Meteo Satellite Feed
            </span>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex h-10 items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3.5 text-xs font-bold text-foreground shadow-2xs hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-emerald-600 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>{isRefreshing ? "Updating..." : "Refresh Live"}</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. TOP ROW: REDESIGNED LIVE WEATHER + FORECAST CARDS     */}
        {/* ======================================================== */}
        <div className="grid gap-6 lg:grid-cols-12 items-stretch">
          {/* CARD A: REDESIGNED LIVE WEATHER (6 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative overflow-hidden rounded-3xl border border-sky-200/70 bg-gradient-to-br from-[#f4f9ff] via-[#f9fcff] to-white p-6 shadow-sm dark:from-[#0a1b24] dark:via-[#0b161c] dark:to-card dark:border-sky-900/40 flex flex-col justify-between lg:col-span-6"
          >
            {/* Top Header Row */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-sky-800 dark:bg-sky-950/80 dark:text-sky-300">
                      Live Weather
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      {weather?.isLive ? "Live API Feed" : "Synchronized"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground font-medium">
                    {loadingWeather ? (
                      <Skeleton className="h-3.5 w-44 mt-1" />
                    ) : weather ? (
                      `${weather.lastUpdated} — ${weather.location}`
                    ) : (
                      "Agricultural Weather Station"
                    )}
                  </p>
                </div>
              </div>

              {/* Weather Error message */}
              {weatherError && !loadingWeather && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{weatherError}</span>
                </div>
              )}

              {/* Big Temperature Hero Section */}
              <div className="mt-5 flex items-center justify-between">
                <div>
                  {loadingWeather ? (
                    <>
                      <Skeleton className="h-16 w-32 mb-2 rounded-xl" />
                      <Skeleton className="h-5 w-40 rounded-lg" />
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-6xl font-black tracking-tight text-foreground sm:text-7xl">
                          {weather ? `${weather.temperature}°C` : "--°C"}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="rounded-full bg-sky-50 dark:bg-sky-950/50 border border-sky-200/60 dark:border-sky-800/40 px-3 py-1 text-xs font-bold text-foreground">
                          {weather?.condition ?? "Partly Cloudy"}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          Feels like {weather?.feelsLike ?? "--"}°C
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Big Condition Icon */}
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/30 p-2 shadow-xs">
                  {loadingWeather ? (
                    <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                  ) : (
                    conditionIcon(
                      weather?.condition ?? "partly cloudy",
                      "h-12 w-12",
                    )
                  )}
                </div>
              </div>

              {/* 5-Metric Rounded Pills Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {/* 1. Feels Like */}
                <div className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-2.5 text-center dark:bg-amber-950/20 dark:border-amber-900/40">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                    <Thermometer className="h-3.5 w-3.5" />
                    <span>Feels Like</span>
                  </div>
                  <p className="mt-1 font-display text-sm font-extrabold text-foreground">
                    {loadingWeather ? (
                      <Skeleton className="h-4 w-10 mx-auto" />
                    ) : (
                      `${weather?.feelsLike ?? "--"}°C`
                    )}
                  </p>
                </div>

                {/* 2. Humidity */}
                <div className="rounded-2xl border border-sky-200/70 bg-sky-50/50 p-2.5 text-center dark:bg-sky-950/20 dark:border-sky-900/40">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-sky-700 dark:text-sky-400">
                    <Droplets className="h-3.5 w-3.5" />
                    <span>Humidity</span>
                  </div>
                  <p className="mt-1 font-display text-sm font-extrabold text-foreground">
                    {loadingWeather ? (
                      <Skeleton className="h-4 w-10 mx-auto" />
                    ) : (
                      `${weather?.humidity ?? "--"}%`
                    )}
                  </p>
                </div>

                {/* 3. Wind */}
                <div className="rounded-2xl border border-teal-200/70 bg-teal-50/50 p-2.5 text-center dark:bg-teal-950/20 dark:border-teal-900/40">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-teal-700 dark:text-teal-400">
                    <Wind className="h-3.5 w-3.5" />
                    <span>Wind</span>
                  </div>
                  <p className="mt-1 font-display text-sm font-extrabold text-foreground">
                    {loadingWeather ? (
                      <Skeleton className="h-4 w-10 mx-auto" />
                    ) : (
                      `${weather?.windSpeed ?? "--"} km/h`
                    )}
                  </p>
                </div>

                {/* 4. Visibility */}
                <div className="rounded-2xl border border-indigo-200/70 bg-indigo-50/50 p-2.5 text-center dark:bg-indigo-950/20 dark:border-indigo-900/40">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-400">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Visibility</span>
                  </div>
                  <p className="mt-1 font-display text-sm font-extrabold text-foreground">
                    {loadingWeather ? (
                      <Skeleton className="h-4 w-10 mx-auto" />
                    ) : (
                      `${weather?.visibility ?? "--"} km`
                    )}
                  </p>
                </div>

                {/* 5. UV Index */}
                <div className="col-span-2 sm:col-span-1 rounded-2xl border border-orange-200/70 bg-orange-50/50 p-2.5 text-center dark:bg-orange-950/20 dark:border-orange-900/40">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-orange-700 dark:text-orange-400">
                    <Sun className="h-3.5 w-3.5" />
                    <span>UV Index</span>
                  </div>
                  <p className="mt-1 font-display text-sm font-extrabold text-foreground">
                    {loadingWeather ? (
                      <Skeleton className="h-4 w-12 mx-auto" />
                    ) : (
                      `${weather?.uvIndex ?? "--"} ${weather ? (weather.uvIndex <= 2 ? "Low" : weather.uvIndex <= 5 ? "Mod" : "High") : ""}`
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Atmospheric & Solar Strip */}
            <div className="mt-5 grid grid-cols-3 divide-x divide-sky-200/60 dark:divide-sky-900/40 rounded-2xl bg-white/80 dark:bg-card/90 border border-border/80 py-3 text-center text-xs shadow-2xs backdrop-blur-xs">
              <div className="flex items-center justify-center gap-2 px-1">
                <Sun className="h-4 w-4 text-amber-500 shrink-0" />
                <div className="text-left leading-tight">
                  <span className="block text-[10px] text-muted-foreground font-semibold">
                    Sunrise
                  </span>
                  <span className="font-bold text-foreground">
                    {loadingWeather
                      ? "--:--"
                      : (weather?.sunrise ?? "06:22 am")}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 px-1">
                <Sun className="h-4 w-4 text-orange-500 shrink-0" />
                <div className="text-left leading-tight">
                  <span className="block text-[10px] text-muted-foreground font-semibold">
                    Sunset
                  </span>
                  <span className="font-bold text-foreground">
                    {loadingWeather ? "--:--" : (weather?.sunset ?? "06:57 pm")}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 px-1">
                <Gauge className="h-4 w-4 text-sky-600 shrink-0" />
                <div className="text-left leading-tight">
                  <span className="block text-[10px] text-muted-foreground font-semibold">
                    Pressure
                  </span>
                  <span className="font-bold text-foreground">
                    {loadingWeather
                      ? "-- hPa"
                      : `${weather?.pressure ?? "--"} hPa`}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CARD B: REDESIGNED EXTENDED FORECAST (6 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-3xl border border-border/80 bg-white dark:bg-card p-6 shadow-sm flex flex-col justify-between lg:col-span-6"
          >
            <div>
              {/* Header with Title & Day View Selector Tabs */}
              <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
                <div>
                  <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                    {forecastDaysTab}-Day Forecast
                  </h2>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Daily high/low temperature & precipitation chances
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-1">
                  <button
                    type="button"
                    onClick={() => setForecastDaysTab(5)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer",
                      forecastDaysTab === 5
                        ? "bg-white text-foreground shadow-xs dark:bg-card"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    5 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setForecastDaysTab(7)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer",
                      forecastDaysTab === 7
                        ? "bg-white text-foreground shadow-xs dark:bg-card"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setForecastDaysTab(10)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer",
                      forecastDaysTab === 10
                        ? "bg-white text-foreground shadow-xs dark:bg-card"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    10 Days
                  </button>
                </div>
              </div>

              {/* Forecast Grid */}
              {loadingForecast ? (
                <div className="mt-4 grid grid-cols-5 gap-2 text-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-border/60 p-3 space-y-2"
                    >
                      <Skeleton className="h-3 w-10 mx-auto" />
                      <Skeleton className="h-3 w-8 mx-auto" />
                      <Skeleton className="h-8 w-8 mx-auto rounded-full" />
                      <Skeleton className="h-4 w-12 mx-auto" />
                      <Skeleton className="h-3 w-8 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={cn(
                    "mt-4 grid gap-2 text-center",
                    forecastDaysTab === 5
                      ? "grid-cols-5"
                      : forecastDaysTab === 7
                        ? "grid-cols-4 sm:grid-cols-7"
                        : "grid-cols-5 sm:grid-cols-5 lg:grid-cols-5",
                  )}
                >
                  {forecastDisplay.map((item, idx) => {
                    const isToday = item.day === "Today" || idx === 0;
                    return (
                      <div
                        key={item.date}
                        className={cn(
                          "flex flex-col items-center justify-between rounded-2xl border p-2.5 sm:p-3 transition-all hover:scale-[1.02]",
                          isToday
                            ? "border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/30 dark:border-emerald-500/40 shadow-xs"
                            : "border-border/70 bg-card/60 hover:bg-accent/40",
                        )}
                      >
                        {/* Day & Date */}
                        <div className="space-y-0.5">
                          <p
                            className={cn(
                              "text-xs font-bold",
                              isToday
                                ? "text-emerald-700 dark:text-emerald-300"
                                : "text-foreground",
                            )}
                          >
                            {item.day}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-semibold">
                            {item.dateLabel}
                          </p>
                        </div>

                        {/* Weather Icon */}
                        <div className="my-2.5 flex items-center justify-center">
                          {conditionIcon(item.condition, "h-7 w-7")}
                        </div>

                        {/* Temp Max / Min */}
                        <div className="space-y-0.5">
                          <p className="font-display text-sm font-black text-foreground">
                            {item.maxTemperature}°C
                          </p>
                          <p className="text-[10px] font-semibold text-muted-foreground">
                            {item.minTemperature}°C
                          </p>
                        </div>

                        {/* Rain Probability Pill */}
                        <div
                          className={cn(
                            "mt-2 inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                            item.rainProbability >= 50
                              ? "bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          <Droplets className="h-2.5 w-2.5 text-sky-500 shrink-0" />
                          <span>{item.rainProbability}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Advisory Alert Banner */}
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3 text-xs text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800/40 dark:text-emerald-200">
              <Info className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              <span className="font-semibold leading-relaxed">
                {forecastBannerText}
              </span>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM ROW: FARMING ALERTS + CLIMATE RISK */}
        <div className="grid gap-5 lg:grid-cols-12">
          {/* CARD C: FARMING ALERTS */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs lg:col-span-6"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                    Farming Alerts
                  </h2>
                </div>
                {alerts.length > 0 && (
                  <span className="rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                    {alerts.length} Active {alerts.length === 1 ? "Alert" : "Alerts"}
                  </span>
                )}
              </div>

              <div className="mt-3.5 space-y-3">
                {loadingAlerts ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border/60 p-3.5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-3 w-48" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                    </div>
                  ))
                ) : alerts.length === 0 ? (
                  <div className="py-8 text-center rounded-xl border border-dashed border-border/70 bg-muted/20 p-4">
                    <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 mb-2">
                      <Check className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-foreground">
                      No major farming alerts today.
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs mx-auto">
                      Favorable weather conditions expected. All parameters are within safe ranges for crop operations.
                    </p>
                  </div>
                ) : (
                  alerts.map((alert) => {
                    const IconComponent = alertIconComponent(alert.iconType);
                    return (
                      <div
                        key={alert.id}
                        className="rounded-xl border border-border/80 bg-background/70 hover:bg-background/90 p-3.5 transition-all space-y-2.5 shadow-2xs"
                      >
                        {/* Header: Title + Severity Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${alertIconBg(alert.severity)}`}
                            >
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="text-xs font-bold text-foreground">
                                {alert.title}
                              </h3>
                              <p className="text-[11px] font-semibold text-foreground/80">
                                {alert.value}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end shrink-0">
                            <span
                              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${alertSeverityColor(alert.severity)}`}
                            >
                              {alert.severity}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-0.5">
                              {alert.expectedAt}
                            </span>
                          </div>
                        </div>

                        {/* Impact & What to do structured section */}
                        <div className="space-y-1.5 pt-1 border-t border-border/50 text-[11px]">
                          <div>
                            <span className="font-bold text-foreground">Impact: </span>
                            <span className="text-muted-foreground leading-relaxed">
                              {alert.impact}
                            </span>
                          </div>
                          <div className="rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 p-2 text-emerald-950 dark:text-emerald-200">
                            <span className="font-bold text-emerald-800 dark:text-emerald-300">
                              What to do:{" "}
                            </span>
                            <span className="leading-relaxed font-medium">
                              {alert.action}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>

          {/* CARD D: CLIMATE RISK OVERVIEW */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs lg:col-span-6"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <Compass className="h-4 w-4" />
                  </div>
                  <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                    Climate Risk Overview
                  </h2>
                </div>
                {risk && (
                  <span className="rounded-full bg-muted/80 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    3 Risk Factors
                  </span>
                )}
              </div>

              {loadingRisk ? (
                <div className="mt-4 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-5 pb-3 border-b border-border/50">
                    <Skeleton className="h-32 w-32 rounded-full shrink-0" />
                    <div className="w-full space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-4/5" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                  </div>
                </div>
              ) : riskError || !risk ? (
                <div className="py-8 text-center rounded-xl border border-dashed border-rose-200 bg-rose-50/40 dark:bg-rose-950/20 p-4 mt-3">
                  <AlertTriangle className="h-6 w-6 text-rose-500 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-rose-700 dark:text-rose-400">
                    {riskError || "Climate risk data unavailable. Please refresh."}
                  </p>
                  <button
                    type="button"
                    onClick={() => void loadRisk()}
                    className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Retry
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {/* Top: Donut chart + High level summary */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 pb-3 border-b border-border/50">
                    <div className="shrink-0 flex justify-center">
                      <DonutChart risk={risk} level={risk.level} />
                    </div>
                    <div className="flex-1 space-y-1.5 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-xs font-bold text-foreground">
                          Overall Climate Risk:
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${alertSeverityColor(risk.level)}`}
                        >
                          {risk.level} ({risk.overall}%)
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {risk.explanation}
                      </p>
                    </div>
                  </div>

                  {/* 3 Climate Risks: Drought, Flood, Heat Stress */}
                  <div className="space-y-3">
                    {climateRisks.map((r) => {
                      const Icon = r.icon;
                      return (
                        <div
                          key={r.label}
                          className="rounded-xl border border-border/70 bg-background/60 p-3 space-y-2 shadow-2xs"
                        >
                          {/* Risk Title, Level, Score & Progress Bar */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5 font-bold text-foreground">
                                <Icon className={`h-3.5 w-3.5 ${r.iconColor}`} />
                                <span>{r.label}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-bold ${r.colorText}`}>
                                  {r.level}
                                </span>
                                <span className="text-[11px] font-semibold text-muted-foreground">
                                  ({r.percent}%)
                                </span>
                              </div>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${r.percent}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={`h-full rounded-full ${r.colorBar}`}
                              />
                            </div>
                          </div>

                          {/* Farmer-Friendly Why & Action */}
                          <div className="space-y-1 pt-1 text-[11px] border-t border-border/40">
                            <div>
                              <span className="font-bold text-foreground">Why? </span>
                              <span className="text-muted-foreground leading-relaxed">
                                {r.why}
                              </span>
                            </div>
                            <div>
                              <span className="font-bold text-emerald-800 dark:text-emerald-400">
                                What to do:{" "}
                              </span>
                              <span className="text-foreground/90 font-medium leading-relaxed">
                                {r.action}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Summary Bar */}
            {risk && !loadingRisk && !riskError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#d1f0dc] bg-[#edf8f1] dark:bg-emerald-950/30 dark:border-emerald-800/40 px-3.5 py-2.5 text-xs text-[#166534] dark:text-emerald-300">
                <Sprout className="h-4 w-4 shrink-0 text-[#168447]" />
                <span className="font-medium text-[11.5px] leading-relaxed">
                  {risk.explanation}
                </span>
              </div>
            )}
          </motion.div>
        </div>




      </div>
    </DashboardShell>
  );
}
