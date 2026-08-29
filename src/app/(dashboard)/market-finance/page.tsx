"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/shell";
import {
  TrendingUp,
  RotateCw,
  Search,
  ArrowRight,
  Lightbulb,
  Sprout,
  MapPin,
  Flame,
  Award,
  ChevronDown,
  Building2,
  Calendar,
} from "lucide-react";

import {
  getLiveMarketData,
  MAJOR_STATES,
  type CropMarketData,
  type TrendPoint,
  type StatePrice,
} from "@/lib/market";
import { ALL_SUPPORTED_CROPS_LIST } from "@/components/landing/crops";

const LANDING_CROP_IMAGE_MAP: Record<string, string> = Object.fromEntries(
  ALL_SUPPORTED_CROPS_LIST.map((c) => [c.id.toLowerCase(), c.image]),
);

const INITIAL_CROPS = getLiveMarketData();

/** Mini Sparkline for Market Cards */
function MiniSparkline({
  data,
  isPositive,
}: {
  data: number[];
  isPositive: boolean;
}) {
  const w = 120;
  const h = 28;
  const safeData = data && data.length > 0 ? data : [2000, 2050, 2020, 2100, 2150];
  const min = Math.min(...safeData);
  const max = Math.max(...safeData);
  const range = max - min || 1;

  const points = safeData.map((v, i) => {
    const x = (i / Math.max(1, safeData.length - 1)) * w;
    const y = h - 4 - ((v - min) / range) * (h - 8);
    return [x, y] as const;
  });

  const linePath = points
    .map(
      ([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`,
    )
    .join(" ");

  const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;
  const strokeColor = isPositive ? "#16a34a" : "#ef4444";
  const fillColor = isPositive
    ? "rgba(22, 163, 74, 0.15)"
    : "rgba(239, 68, 68, 0.15)";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-full overflow-visible">
      <path d={areaPath} fill={fillColor} />
      <path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Interactive 30-Day Main Trend Chart with Dynamic Hover Tooltip */
function InteractiveMarketTrendChart({
  data,
  min,
  max,
  isPositive,
  activeCropName,
  unit,
}: {
  data: TrendPoint[];
  min: number;
  max: number;
  isPositive: boolean;
  activeCropName: string;
  unit: string;
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const w = 560;
  const h = 210;
  const padL = 45;
  const padR = 20;
  const padT = 20;
  const padB = 30;

  const safeData =
    data && data.length > 0
      ? data
      : [
          { date: "1 May", val: min },
          { date: "15 May", val: Math.round((min + max) / 2) },
          { date: "30 May", val: max },
        ];

  const safeRange = max > min ? max - min : 100;
  const getX = (i: number) =>
    padL + (i / Math.max(1, safeData.length - 1)) * (w - padL - padR);
  const getY = (val: number) =>
    padT + (1 - (val - min) / safeRange) * (h - padT - padB);

  const pts = safeData.map((d, i) => [getX(i), getY(d.val)] as const);
  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${w - padR},${h - padB} L${padL},${h - padB} Z`;

  const primaryColor = isPositive ? "#168447" : "#e11d48";
  const gradId = isPositive ? "greenMarketGrad" : "redMarketGrad";

  const yTicks = Array.from({ length: 5 }, (_, i) => {
    return Math.round(min + (safeRange / 4) * i);
  });

  const activePoint = hoverIdx !== null ? safeData[hoverIdx] : safeData[safeData.length - 1];
  const activePtPos = hoverIdx !== null ? pts[hoverIdx] : pts[pts.length - 1];

  return (
    <div className="relative w-full">
      {/* Live Hover Info Floating Ribbon */}
      <div className="mb-2 flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{activePoint?.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Spot Rate:</span>
          <span
            className="font-display text-sm font-black"
            style={{ color: primaryColor }}
          >
            ₹{activePoint?.val.toLocaleString()} {unit}
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-full w-full overflow-visible cursor-crosshair select-none"
      >
        <defs>
          <linearGradient id="greenMarketGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="redMarketGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e11d48" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#e11d48" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines & Y Axis */}
        {yTicks.map((val) => {
          const y = getY(val);
          return (
            <g key={val}>
              <line
                x1={padL}
                y1={y}
                x2={w - padR}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="4 4"
              />
              <text
                x={padL - 8}
                y={y + 3.5}
                textAnchor="end"
                fontSize="9.5"
                fill="#94a3b8"
                fontFamily="sans-serif"
                fontWeight="500"
              >
                {val.toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* Dynamic Gradient Area & Smooth Line */}
        <motion.path
          key={`${activeCropName}-area`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          d={area}
          fill={`url(#${gradId})`}
        />
        <motion.path
          key={`${activeCropName}-line`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          d={line}
          fill="none"
          stroke={primaryColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Vertical Crosshair Line on Active Hover */}
        {activePtPos && (
          <line
            x1={activePtPos[0]}
            y1={padT}
            x2={activePtPos[0]}
            y2={h - padB}
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.8"
          />
        )}

        {/* Data Interactive Nodes */}
        {pts.map(([x, y], idx) => {
          const isSelected = idx === hoverIdx;
          return (
            <g
              key={idx}
              onMouseEnter={() => setHoverIdx(idx)}
              className="cursor-pointer"
            >
              {/* Invisible larger hit area for easy hovering */}
              <circle cx={x} cy={y} r="12" fill="transparent" />
              <circle
                cx={x}
                cy={y}
                r={isSelected ? "5" : "3.5"}
                fill={primaryColor}
                stroke="#ffffff"
                strokeWidth={isSelected ? "2" : "1.5"}
                className="transition-all"
              />
            </g>
          );
        })}

        {/* X Axis Date Labels */}
        {safeData.map((d, i) => {
          if (i % 2 !== 0 && i !== safeData.length - 1) return null;
          const x = getX(i);
          return (
            <text
              key={i}
              x={x}
              y={h - 6}
              textAnchor="middle"
              fontSize="9.5"
              fill="#94a3b8"
              fontFamily="sans-serif"
              fontWeight="600"
            >
              {d.date}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default function MarketFinancePage() {
  const [cropsData, setCropsData] = useState<CropMarketData[]>(INITIAL_CROPS);
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedState, setSelectedState] = useState("All States");
  const [cropSearch, setCropSearch] = useState("");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiSource, setApiSource] = useState("APMC Mandi Real-Time Feed");
  const [lastUpdated, setLastUpdated] = useState(() => {
    return new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  // Fetch live prices from API
  const fetchMarketPrices = useCallback(
    async (refresh = false) => {
      setIsLoading(true);
      try {
        const storedKey =
          typeof window !== "undefined"
            ? localStorage.getItem("agrismart_market_api_key") || ""
            : "";

        const params = new URLSearchParams();
        if (selectedCategory !== "All") params.set("category", selectedCategory);
        if (selectedState !== "All States") params.set("state", selectedState);
        if (refresh) params.set("refresh", "1");
        if (storedKey) params.set("apiKey", storedKey);

        const res = await fetch(`/api/v1/market/prices?${params.toString()}`);
        const json = await res.json();

        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCropsData(json.data);
          if (json.source) setApiSource(json.source);
          if (json.lastUpdated) setLastUpdated(json.lastUpdated);
        }
      } catch {
        // keep fallback
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategory, selectedState],
  );

  useEffect(() => {
    void fetchMarketPrices();
  }, [fetchMarketPrices]);

  // Load from Crop Intelligence if available
  useEffect(() => {
    const savedCrop = localStorage.getItem("agrismart-selected-crop");
    if (savedCrop && cropsData.length > 0) {
      const match = cropsData.find(
        (c) => c.name.toLowerCase() === savedCrop.toLowerCase(),
      );
      if (match) {
        setSelectedCrop(match.name);
      }
    }
  }, [cropsData]);

  // Selected Data
  const currentCropData = useMemo(() => {
    return (
      cropsData.find((c) => c.name.toLowerCase() === selectedCrop.toLowerCase()) ||
      cropsData[0] ||
      INITIAL_CROPS[0]
    );
  }, [cropsData, selectedCrop]);

  // Filter crops by category and search text
  const filteredCrops = useMemo(() => {
    return cropsData.filter((crop) => {
      const matchesCat =
        selectedCategory === "All" ||
        crop.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !cropSearch.trim() ||
        crop.name.toLowerCase().includes(cropSearch.toLowerCase()) ||
        (crop.hindiName && crop.hindiName.includes(cropSearch.trim()));

      return matchesCat && matchesSearch;
    });
  }, [cropsData, selectedCategory, cropSearch]);

  // Dynamic Insight Logic
  function getMarketInsights(crop: CropMarketData) {
    const isRising = crop.up;
    const diffPct = parseFloat(crop.change.replace("%", "").replace("+", ""));
    const isSignificant = Math.abs(diffPct) > 1.5;

    const trendTitle = isRising ? "Prices Rising" : "Prices Easing";
    const trendDesc = isRising
      ? `${crop.name} wholesale spot rates are trading higher across major mandis.`
      : `${crop.name} wholesale bids have eased with steady market arrivals.`;

    const demandTitle = isRising ? "High Mandi Demand" : "Balanced Trading";
    const demandDesc = isRising
      ? "Active mill & trader buying reported across regional trading centers."
      : "Adequate market supply with stable daily mandi arrivals.";

    let sellAdvice = null;
    if (isRising && isSignificant) {
      sellAdvice = {
        title: "Favorable Selling Window",
        desc: "Current spot prices are above recent 30-day averages. Consider selling harvested stock.",
      };
    }

    return { trendTitle, trendDesc, demandTitle, demandDesc, sellAdvice };
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    await fetchMarketPrices(true);
    setIsRefreshing(false);
    toast.success("Live APMC Mandi commodity rates refreshed!");
  }

  // Find best state with highest price
  const bestState = currentCropData?.statePrices?.[0] || null;

  return (
    <DashboardShell
      headerTitle="Market & Finance"
      headerSubtitle="Live APMC Mandi prices, 24 crop commodity feeds, multi-state comparison, and financial calculators."
    >
      <div className="space-y-6 pb-8">
        {/* Top 24 Crop Selector Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs"
        >
              {/* Header & Filter Controls */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-border/60">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-display text-base font-extrabold tracking-tight text-foreground">
                      Commodity Market Rates
                    </h2>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-[#dcfce7] px-2.5 py-0.5 text-[11px] font-extrabold text-[#15803d] dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Feed
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
                      • {apiSource}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground font-medium">
                    Updated: {lastUpdated} • Click on any crop card to inspect price graphs and multi-state Mandi rates.
                  </p>
                </div>

                {/* Search & Category Tabs */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search crop or fruit..."
                      value={cropSearch}
                      onChange={(e) => setCropSearch(e.target.value)}
                      className="h-9 w-40 sm:w-48 rounded-xl border border-border/80 bg-background pl-8 pr-2.5 text-xs font-semibold text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-1">
                    {(["All", "Cereals", "Pulses", "Fruits", "Cash Crops"] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-white text-foreground shadow-xs dark:bg-card"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Refresh Button */}
                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={isRefreshing || isLoading}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 font-bold text-foreground hover:bg-accent disabled:opacity-60 transition-all cursor-pointer shadow-2xs"
                  >
                    <RotateCw
                      className={`h-3.5 w-3.5 text-[#168447] ${
                        isRefreshing || isLoading ? "animate-spin" : ""
                      }`}
                    />
                    <span className="hidden sm:inline">
                      {isRefreshing ? "Syncing..." : "Refresh"}
                    </span>
                  </button>
                </div>
              </div>

              {/* 24 Crop Cards Grid with Images, Prices & Sparklines */}
              <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 max-h-[460px] overflow-y-auto pr-1">
                {filteredCrops.map((crop) => {
                  const isSelected = selectedCrop.toLowerCase() === crop.name.toLowerCase();
                  const cropImg = LANDING_CROP_IMAGE_MAP[crop.id.toLowerCase()] || crop.image;
                  return (
                    <motion.div
                      key={crop.id}
                      layout
                      onClick={() => setSelectedCrop(crop.name)}
                      className={`group relative flex flex-col justify-between rounded-2xl border p-3.5 transition-all cursor-pointer hover:shadow-md ${
                        isSelected
                          ? "border-[#168447] bg-[#f4faf6] ring-2 ring-[#168447]/40 dark:bg-emerald-950/20 dark:border-emerald-500/60"
                          : "border-border/80 bg-card hover:border-emerald-300"
                      }`}
                    >
                      <div>
                        {/* Crop Image + Name & Category */}
                        <div className="flex items-center gap-2.5">
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/30 shadow-2xs">
                            {cropImg ? (
                              <img
                                src={cropImg}
                                alt={crop.name}
                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-emerald-100 text-emerald-700">
                                <Sprout className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-xs font-bold text-foreground">
                              {crop.name}
                            </h3>
                            <p className="truncate text-[10px] text-muted-foreground font-semibold">
                              {crop.hindiName}
                            </p>
                          </div>
                        </div>

                        {/* Price Row */}
                        <div className="mt-3 flex items-baseline justify-between">
                          <div>
                            <span className="font-display text-base font-black text-foreground">
                              ₹{crop.price.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-semibold ml-0.5">
                              {crop.unit}
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
                              crop.up
                                ? "text-[#16a34a] dark:text-emerald-400"
                                : "text-rose-500 dark:text-rose-400"
                            }`}
                          >
                            {crop.change} {crop.up ? "↑" : "↓"}
                          </span>
                        </div>
                      </div>

                      {/* Mini Sparkline Chart */}
                      <div className="mt-2.5 pt-1.5 border-t border-border/40">
                        <MiniSparkline
                          data={crop.sparkline}
                          isPositive={crop.up}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* ======================================================== */}
            {/* 3. DYNAMIC PRICE MOVEMENT GRAPH + MULTI-STATE COMPARISON */}
            {/* ======================================================== */}
            <div className="grid gap-6 lg:grid-cols-12 items-stretch">
              {/* -------------------------------------------------------- */}
              {/* COLUMN 1: DYNAMIC PRICE GRAPH (6 Cols)                   */}
              {/* -------------------------------------------------------- */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-xs lg:col-span-6"
              >
                <div>
                  {/* Selected Crop Header Hero */}
                  <div className="flex items-start justify-between pb-4 border-b border-border/60">
                    <div className="flex items-center gap-3.5">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-muted/30 shadow-xs">
                        {LANDING_CROP_IMAGE_MAP[currentCropData.id.toLowerCase()] || currentCropData.image ? (
                          <img
                            src={LANDING_CROP_IMAGE_MAP[currentCropData.id.toLowerCase()] || currentCropData.image}
                            alt={currentCropData.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-emerald-100 text-emerald-700">
                            <Sprout className="h-7 w-7" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-display text-lg font-black text-foreground">
                            {currentCropData.name}
                          </h2>
                          <span className="text-xs font-bold text-muted-foreground">
                            ({currentCropData.hindiName})
                          </span>
                          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                            {currentCropData.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                          Interactive 30-day wholesale Mandi price trajectory
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-display text-2xl sm:text-3xl font-black text-foreground block">
                        ₹{currentCropData.price.toLocaleString()}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold ${
                          currentCropData.up
                            ? "text-[#16a34a] dark:text-emerald-400"
                            : "text-rose-500 dark:text-rose-400"
                        }`}
                      >
                        {currentCropData.up ? "↑" : "↓"} {currentCropData.change}{" "}
                        <span className="font-normal text-muted-foreground text-[10px]">
                          (30 days)
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Interactive Dynamic Price Graph */}
                  <div className="mt-4">
                    <InteractiveMarketTrendChart
                      data={currentCropData.trendPoints}
                      min={Math.floor(currentCropData.lowest * 0.95)}
                      max={Math.ceil(currentCropData.highest * 1.05)}
                      isPositive={currentCropData.up}
                      activeCropName={currentCropData.name}
                      unit={currentCropData.unit}
                    />
                  </div>
                </div>

                {/* 3 Key Stats Badges */}
                <div className="mt-5 grid grid-cols-3 gap-3 pt-4 border-t border-border/60">
                  <div className="rounded-2xl border border-border/60 bg-muted/20 p-3 text-center">
                    <span className="block text-[10px] text-muted-foreground font-semibold">
                      Highest Price
                    </span>
                    <span className="font-display text-sm font-black text-foreground mt-0.5 block">
                      ₹{currentCropData.highest.toLocaleString()}{" "}
                      <span className="text-[10px] text-muted-foreground font-normal">
                        {currentCropData.unit}
                      </span>
                    </span>
                    <span className="block text-[10px] text-muted-foreground mt-0.5">
                      on {currentCropData.highestDate}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-muted/20 p-3 text-center">
                    <span className="block text-[10px] text-muted-foreground font-semibold">
                      Lowest Price
                    </span>
                    <span className="font-display text-sm font-black text-foreground mt-0.5 block">
                      ₹{currentCropData.lowest.toLocaleString()}{" "}
                      <span className="text-[10px] text-muted-foreground font-normal">
                        {currentCropData.unit}
                      </span>
                    </span>
                    <span className="block text-[10px] text-muted-foreground mt-0.5">
                      on {currentCropData.lowestDate}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-muted/20 p-3 text-center">
                    <span className="block text-[10px] text-muted-foreground font-semibold">
                      30-Day Average
                    </span>
                    <span className="font-display text-sm font-black text-foreground mt-0.5 block">
                      ₹{currentCropData.avg.toLocaleString()}{" "}
                      <span className="text-[10px] text-muted-foreground font-normal">
                        {currentCropData.unit}
                      </span>
                    </span>
                    <span className="block text-[10px] text-muted-foreground mt-0.5">
                      Benchmark rate
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* -------------------------------------------------------- */}
              {/* COLUMN 2: MULTI-STATE MANDI PRICES (6 Cols)              */}
              {/* -------------------------------------------------------- */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-xs lg:col-span-6"
              >
                <div>
                  {/* Header & Best Price State Callout */}
                  <div className="pb-3.5 border-b border-border/60 flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-base font-bold tracking-tight text-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                        <span>State-Wise Mandi Prices ({currentCropData.name})</span>
                      </h2>
                      <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                        Live comparison across major Indian state markets
                      </p>
                    </div>

                    {bestState && (
                      <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300">
                        <Award className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Best: {bestState.state} ({bestState.priceStr})</span>
                      </div>
                    )}
                  </div>

                  {/* Multi-State Price Table */}
                  <div className="mt-4 max-h-[290px] overflow-y-auto pr-1">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-muted-foreground border-b border-border/60 text-[11px] sticky top-0 bg-card z-10">
                          <th className="pb-2 text-left font-semibold">State & Mandi</th>
                          <th className="pb-2 text-right font-semibold">Live Spot Rate</th>
                          <th className="pb-2 text-right font-semibold">Spread vs Base</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 font-medium">
                        {currentCropData.statePrices?.map((sp, idx) => {
                          const isTop = idx === 0;
                          return (
                            <tr
                              key={sp.state}
                              className={`hover:bg-muted/40 transition-colors ${
                                isTop ? "bg-emerald-50/40 dark:bg-emerald-950/20" : ""
                              }`}
                            >
                              <td className="py-2.5 text-left">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-foreground">
                                    {sp.state}
                                  </span>
                                  {isTop && (
                                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[9px] font-extrabold dark:bg-emerald-900 dark:text-emerald-200">
                                      HIGHEST
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-muted-foreground block">
                                  {sp.market}
                                </span>
                              </td>
                              <td className="py-2.5 text-right font-display text-sm font-black text-foreground">
                                {sp.priceStr}
                              </td>
                              <td
                                className={`py-2.5 text-right font-bold ${
                                  sp.up
                                    ? "text-[#16a34a] dark:text-emerald-400"
                                    : "text-rose-500 dark:text-rose-400"
                                }`}
                              >
                                {sp.change} {sp.up ? "↑" : "↓"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bottom Market Intelligence Tip */}
                <div className="mt-4 pt-3 border-t border-border/60 flex items-start gap-2 text-xs text-muted-foreground">
                  <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-[11.5px] leading-relaxed">
                    {getMarketInsights(currentCropData).trendDesc}{" "}
                    {getMarketInsights(currentCropData).sellAdvice?.desc}
                  </span>
                </div>
              </motion.div>
            </div>
      </div>
    </DashboardShell>
  );
}
