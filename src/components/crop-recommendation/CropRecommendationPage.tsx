"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Sprout,
  MapPin,
  LocateFixed,
  FlaskConical,
  Calendar,
  CloudSun,
  Thermometer,
  Droplets,
  CloudRain,
  Sparkles,
  Check,
  Info,
  ChevronDown,
  Loader2,
  X,
  ShieldCheck,
  RefreshCw,
  Layers,
  TrendingUp,
  IndianRupee,
  ShieldAlert,
  History,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/use-auth";
import { useLocation } from "@/lib/location";
import { fetchLiveWeather } from "@/lib/weather";
import {
  INITIAL_CONDITIONS,
  INITIAL_RECOMMENDATIONS,
  fetchRecommendationFromApi,
  persistRecommendationToInsForge,
  getSavedRecommendationHistory,
} from "./recommendation-engine";
import {
  type FieldConditionState,
  type CropRecommendationItem,
  type Season,
  type RecommendationInsights,
  type RecommendationHistoryItem,
} from "./types";
import {
  getReliableRegionalSoilData,
  type RegionalSoilBenchmark,
} from "./regional-soil-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const STATE_LOCATIONS: { state: string; locations: string[] }[] = [
  {
    state: "Maharashtra",
    locations: [
      "Vasai, Maharashtra",
      "Pune, Maharashtra",
      "Nashik, Maharashtra",
      "Nagpur, Maharashtra",
      "Mumbai, Maharashtra",
      "Aurangabad, Maharashtra",
      "Kolhapur, Maharashtra",
      "Solapur, Maharashtra",
      "Amravati, Maharashtra",
    ],
  },
  {
    state: "Punjab",
    locations: [
      "Ludhiana, Punjab",
      "Amritsar, Punjab",
      "Jalandhar, Punjab",
      "Patiala, Punjab",
      "Bathinda, Punjab",
    ],
  },
  {
    state: "Madhya Pradesh",
    locations: [
      "Bhopal, Madhya Pradesh",
      "Indore, Madhya Pradesh",
      "Jabalpur, Madhya Pradesh",
      "Gwalior, Madhya Pradesh",
      "Ujjain, Madhya Pradesh",
      "Hoshangabad, Madhya Pradesh",
    ],
  },
  {
    state: "Uttar Pradesh",
    locations: [
      "Lucknow, Uttar Pradesh",
      "Varanasi, Uttar Pradesh",
      "Kanpur, Uttar Pradesh",
      "Agra, Uttar Pradesh",
      "Meerut, Uttar Pradesh",
      "Prayagraj, Uttar Pradesh",
      "Bareilly, Uttar Pradesh",
    ],
  },
  {
    state: "Rajasthan",
    locations: [
      "Jaipur, Rajasthan",
      "Jodhpur, Rajasthan",
      "Kota, Rajasthan",
      "Udaipur, Rajasthan",
      "Bikaner, Rajasthan",
      "Sri Ganganagar, Rajasthan",
    ],
  },
  {
    state: "Gujarat",
    locations: [
      "Ahmedabad, Gujarat",
      "Surat, Gujarat",
      "Rajkot, Gujarat",
      "Vadodara, Gujarat",
      "Junagadh, Gujarat",
      "Bhavnagar, Gujarat",
    ],
  },
  {
    state: "Haryana",
    locations: [
      "Karnal, Haryana",
      "Hisar, Haryana",
      "Rohtak, Haryana",
      "Ambala, Haryana",
      "Panipat, Haryana",
    ],
  },
  {
    state: "Karnataka",
    locations: [
      "Bengaluru, Karnataka",
      "Mysuru, Karnataka",
      "Belagavi, Karnataka",
      "Hubballi-Dharwad, Karnataka",
      "Mandya, Karnataka",
    ],
  },
  {
    state: "Tamil Nadu",
    locations: [
      "Chennai, Tamil Nadu",
      "Coimbatore, Tamil Nadu",
      "Madurai, Tamil Nadu",
      "Thanjavur, Tamil Nadu",
      "Salem, Tamil Nadu",
    ],
  },
  {
    state: "Andhra Pradesh & Telangana",
    locations: [
      "Hyderabad, Telangana",
      "Warangal, Telangana",
      "Vijayawada, Andhra Pradesh",
      "Guntur, Andhra Pradesh",
      "Visakhapatnam, Andhra Pradesh",
    ],
  },
  {
    state: "West Bengal",
    locations: [
      "Kolkata, West Bengal",
      "Bardhaman, West Bengal",
      "Siliguri, West Bengal",
      "Murshidabad, West Bengal",
    ],
  },
  {
    state: "Bihar",
    locations: [
      "Patna, Bihar",
      "Muzaffarpur, Bihar",
      "Gaya, Bihar",
      "Bhagalpur, Bihar",
    ],
  },
  {
    state: "Kerala",
    locations: [
      "Thiruvananthapuram, Kerala",
      "Kochi, Kerala",
      "Palakkad, Kerala",
    ],
  },
  {
    state: "Odisha & Assam",
    locations: [
      "Bhubaneswar, Odisha",
      "Cuttack, Odisha",
      "Sambalpur, Odisha",
      "Guwahati, Assam",
      "Jorhat, Assam",
    ],
  },
  {
    state: "Delhi & UTs",
    locations: ["Delhi, NCR", "Chandigarh, UT", "Ranchi, Jharkhand"],
  },
];

const SEASONS: Season[] = ["Kharif", "Rabi", "Zaid", "Whole Year"];
const RANK_MEDALS = ["🥇", "🥈", "🥉"];

type SubCategoryView =
  "recommendation" | "ranking" | "explanation" | "profitability" | "risk";

const LOADING_STEPS = [
  { id: 1, text: "Collecting farm data" },
  { id: 2, text: "Checking weather" },
  { id: 3, text: "Validating soil parameters" },
  { id: 4, text: "Executing ML model" },
  { id: 5, text: "Preparing recommendations" },
];

export function CropRecommendationPage() {
  const { user } = useAuth();
  const {
    location: globalLocation,
    coords: globalCoords,
    fetchLiveLocation,
    setLocation: setGlobalLocation,
  } = useLocation();

  const [conditions, setConditions] =
    useState<FieldConditionState>(INITIAL_CONDITIONS);
  const [crops, setCrops] = useState<CropRecommendationItem[]>(
    INITIAL_RECOMMENDATIONS,
  );
  const [allRankedCrops, setAllRankedCrops] = useState<
    CropRecommendationItem[]
  >(INITIAL_RECOMMENDATIONS);
  const [insights, setInsights] = useState<RecommendationInsights>({
    soilMatch: 95,
    soilMatchLabel: "High Soil Chemistry Alignment",
    weatherFit: 92,
    weatherFitLabel: "Optimal Weather Fit",
    seasonalFit: 94,
    seasonalFitLabel: "High Season Alignment",
    marketDemand: "High",
    marketDemandLabel: "High Local Mandi Demand",
    profitPotential: "High",
    profitPotentialLabel: "Strong ROI Potential",
    overallSuitability: 49.5,
    aiInsight:
      "Trained Random Forest ML model identified Coffee (49.5%) as the primary recommendation based on your soil NPK (80-40-50 kg/ha), pH 6.8, and weather (28°C, 62% humidity, 600 mm rainfall).",
  });

  const [activeSubView, setActiveSubView] =
    useState<SubCategoryView>("recommendation");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [isLocating, setIsLocating] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState("Partly Cloudy");
  const [locationSearch, setLocationSearch] = useState("");
  const [manualCustomLocation, setManualCustomLocation] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Estimated Soil Data State
  const [isUsingEstimatedSoil, setIsUsingEstimatedSoil] = useState(false);
  const [estimatedSoilBenchmark, setEstimatedSoilBenchmark] =
    useState<RegionalSoilBenchmark | null>(null);

  // Modals & History
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyItems, setHistoryItems] = useState<RecommendationHistoryItem[]>(
    [],
  );

  // Live weather fetcher
  const loadWeather = useCallback(
    async (
      locName: string,
      coords?: { latitude: number; longitude: number } | null,
    ) => {
      setIsWeatherLoading(true);
      try {
        const liveData = await fetchLiveWeather(locName, coords);
        setConditions((prev) => ({
          ...prev,
          temperature: liveData.temperature,
          humidity: liveData.humidity,
          rainfall: liveData.rainfall,
          lastUpdatedText: liveData.lastUpdated,
          latitude: coords?.latitude ?? prev.latitude,
          longitude: coords?.longitude ?? prev.longitude,
        }));
        setWeatherCondition(liveData.conditionText);
      } catch (err) {
        console.warn("Weather fetch error:", err);
      } finally {
        setIsWeatherLoading(false);
      }
    },
    [],
  );

  // Initial mount live weather fetch & load history
  useEffect(() => {
    const loc = globalLocation || conditions.locationName;
    void loadWeather(loc, globalCoords);
    setHistoryItems(getSavedRecommendationHistory());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync with global location context if set
  useEffect(() => {
    if (globalLocation && globalLocation !== conditions.locationName) {
      setConditions((prev) => ({
        ...prev,
        locationName: globalLocation,
      }));
      void loadWeather(globalLocation, globalCoords);
      // Re-evaluate estimated soil if currently active
      if (isUsingEstimatedSoil) {
        const benchmark = getReliableRegionalSoilData(globalLocation);
        if (benchmark) {
          setEstimatedSoilBenchmark(benchmark);
          setConditions((prev) => ({
            ...prev,
            nitrogen: benchmark.nitrogen,
            phosphorus: benchmark.phosphorus,
            potassium: benchmark.potassium,
            soilPh: benchmark.soilPh,
          }));
        }
      }
    }
  }, [
    globalLocation,
    globalCoords,
    loadWeather,
    conditions.locationName,
    isUsingEstimatedSoil,
  ]);

  // Handle Location Selection
  function handleSelectLocation(loc: string) {
    setConditions((prev) => ({
      ...prev,
      locationName: loc,
      isLiveLocation: false,
    }));
    setGlobalLocation(loc, false);
    setShowManualInput(false);
    void loadWeather(loc);
    toast.success(`Location set to ${loc}. Live weather data fetched!`);

    if (isUsingEstimatedSoil) {
      const benchmark = getReliableRegionalSoilData(loc);
      if (benchmark) {
        setEstimatedSoilBenchmark(benchmark);
        setConditions((prev) => ({
          ...prev,
          nitrogen: benchmark.nitrogen,
          phosphorus: benchmark.phosphorus,
          potassium: benchmark.potassium,
          soilPh: benchmark.soilPh,
        }));
      }
    }
  }

  // Handle Manual Custom Location Submission
  function handleApplyCustomLocation(e: React.FormEvent) {
    e.preventDefault();
    if (!manualCustomLocation.trim()) return;
    const clean = manualCustomLocation.trim();
    setConditions((prev) => ({
      ...prev,
      locationName: clean,
      isLiveLocation: false,
    }));
    setGlobalLocation(clean, false);
    setShowManualInput(false);
    void loadWeather(clean);
    toast.success(`Location set to ${clean}. Live weather synchronized!`);
  }

  // Handle GPS / Current Location
  async function handleUseCurrentLocation() {
    setIsLocating(true);
    try {
      const detected = await fetchLiveLocation();
      if (detected) {
        setConditions((prev) => ({
          ...prev,
          locationName: detected,
          isLiveLocation: true,
        }));
        await loadWeather(detected, globalCoords);
        toast.success(`Live GPS location active: ${detected}`);
      }
    } catch {
      toast.error(
        "Unable to detect your location. Please select or enter it manually.",
      );
    } finally {
      setIsLocating(false);
    }
  }

  // Handle Estimated Soil Data Toggle
  function handleUseEstimatedSoilData() {
    const benchmark = getReliableRegionalSoilData(conditions.locationName);

    if (benchmark) {
      setIsUsingEstimatedSoil(true);
      setEstimatedSoilBenchmark(benchmark);
      setConditions((prev) => ({
        ...prev,
        nitrogen: benchmark.nitrogen,
        phosphorus: benchmark.phosphorus,
        potassium: benchmark.potassium,
        soilPh: benchmark.soilPh,
      }));
      setErrors({});
      toast.success(
        `Applied estimated soil data from ${benchmark.region} (${benchmark.source})`,
      );
    } else {
      setIsUsingEstimatedSoil(false);
      setEstimatedSoilBenchmark(null);
      toast.error(
        "Soil data is required for an accurate ML recommendation. Please provide N, P, K and pH values.",
      );
    }
  }

  function handleClearEstimatedSoilData() {
    setIsUsingEstimatedSoil(false);
    setEstimatedSoilBenchmark(null);
  }

  // Handle Numeric Field Changes with Real-time Validation
  function handleNumericChange(
    field: "nitrogen" | "phosphorus" | "potassium" | "soilPh" | "farmArea",
    val: string,
  ) {
    setIsUsingEstimatedSoil(false);
    const num = parseFloat(val);
    if (isNaN(num)) {
      setConditions((prev) => ({ ...prev, [field]: 0 }));
      return;
    }
    setConditions((prev) => ({ ...prev, [field]: num }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  // Validate inputs before running recommendation
  function validateInputs(): boolean {
    const newErrors: Record<string, string> = {};
    if (
      conditions.nitrogen === undefined ||
      conditions.nitrogen < 0 ||
      conditions.nitrogen > 350
    ) {
      newErrors["nitrogen"] =
        "Nitrogen must be a valid non-negative value (0–350 kg/ha)";
    }
    if (
      conditions.phosphorus === undefined ||
      conditions.phosphorus < 0 ||
      conditions.phosphorus > 250
    ) {
      newErrors["phosphorus"] =
        "Phosphorus must be a valid non-negative value (0–250 kg/ha)";
    }
    if (
      conditions.potassium === undefined ||
      conditions.potassium < 0 ||
      conditions.potassium > 300
    ) {
      newErrors["potassium"] =
        "Potassium must be a valid non-negative value (0–300 kg/ha)";
    }
    if (
      conditions.soilPh === undefined ||
      conditions.soilPh <= 0 ||
      conditions.soilPh > 14
    ) {
      newErrors["soilPh"] = "Soil pH must be between 0.1 and 14.0";
    }
    if (!conditions.farmArea || conditions.farmArea <= 0) {
      newErrors["farmArea"] = "Farm area must be greater than 0";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(
        "Soil data is required for an accurate ML recommendation. Please provide N, P, K and pH values.",
      );
      return false;
    }
    return true;
  }

  // Run AI Recommendation via ML API / Backend with multi-step animation
  async function handleGetAIRecommendation() {
    if (!validateInputs()) return;

    setIsLoading(true);
    setLoadingStepIndex(0);

    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => {
        if (prev < LOADING_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 250);

    try {
      const result = await fetchRecommendationFromApi(conditions);
      clearInterval(interval);
      setLoadingStepIndex(LOADING_STEPS.length - 1);

      setCrops(result.crops);
      setAllRankedCrops(result.allRankedCrops);
      setInsights(result.insights);

      toast.success(
        `ML Model predicted top crop: ${result.crops[0]?.name} (${result.crops[0]?.matchScore}%)`,
      );

      if (result.crops[0]) {
        void persistRecommendationToInsForge(
          user?.id,
          conditions,
          result.crops[0].name,
          result.crops[0].matchScore,
        );
        setHistoryItems(getSavedRecommendationHistory());
      }
    } catch (err: unknown) {
      clearInterval(interval);
      console.error(err);
      const msg =
        err instanceof Error && err.message
          ? err.message
          : "Unable to generate a crop recommendation right now. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }



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
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* 1. PAGE HEADER & SUB-CATEGORY NAVIGATION                 */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Crop Intelligence
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm mt-0.5">
              Trained Machine Learning crop recommendations, personalized
              ranking, profitability & risk
            </p>
          </div>
        </div>

        {/* History Action Button */}
        <button
          type="button"
          onClick={() => {
            setHistoryItems(getSavedRecommendationHistory());
            setShowHistoryModal(true);
          }}
          className="inline-flex items-center gap-2 self-start sm:self-center rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs font-bold text-foreground shadow-2xs hover:bg-accent transition-colors cursor-pointer"
        >
          <History className="h-4 w-4 text-emerald-600" />
          <span>Recommendation History ({historyItems.length})</span>
        </button>
      </div>

      {/* Sub-Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mt-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSubView("recommendation")}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer",
            activeSubView === "recommendation"
              ? "bg-[#087a36] text-white shadow-xs"
              : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-accent",
          )}
        >
          <Sprout className="h-3.5 w-3.5" />
          <span>AI Crop Recommendation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubView("ranking")}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer",
            activeSubView === "ranking"
              ? "bg-[#087a36] text-white shadow-xs"
              : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-accent",
          )}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Personalized Crop Ranking</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubView("explanation")}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer",
            activeSubView === "explanation"
              ? "bg-[#087a36] text-white shadow-xs"
              : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-accent",
          )}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Why These Crops? (ML Explanation)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubView("profitability")}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer",
            activeSubView === "profitability"
              ? "bg-[#087a36] text-white shadow-xs"
              : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-accent",
          )}
        >
          <IndianRupee className="h-3.5 w-3.5" />
          <span>Crop Profitability</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubView("risk")}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer",
            activeSubView === "risk"
              ? "bg-[#087a36] text-white shadow-xs"
              : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-accent",
          )}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Crop Risk Prediction</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN TWO-COLUMN LAYOUT                                */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* ====================================================== */}
        {/* LEFT CARD: FARM INPUT (7 cols on lg)                   */}
        {/* ====================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-3xl border border-border/80 bg-white p-6 shadow-xs dark:bg-card lg:col-span-7 space-y-6"
        >
          {/* SECTION 1: Location & Farm Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <h2 className="font-display text-base font-bold text-foreground">
                  1. Location & Farm Area
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowManualInput(!showManualInput)}
                className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                {showManualInput
                  ? "Choose from list"
                  : "+ Enter custom location"}
              </button>
            </div>

            {/* Custom Location Input Form when toggled */}
            {showManualInput ? (
              <form onSubmit={handleApplyCustomLocation} className="flex gap-2">
                <input
                  type="text"
                  value={manualCustomLocation}
                  onChange={(e) => setManualCustomLocation(e.target.value)}
                  placeholder="e.g. Baramati, Pune, Maharashtra"
                  className="h-11 flex-1 rounded-xl border border-border/80 bg-background px-3.5 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#087a36] px-4 text-xs font-bold text-white hover:bg-[#06632b] cursor-pointer"
                >
                  Apply
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                {/* Location Select Dropdown */}
                <div className="sm:col-span-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-11 w-full items-center justify-between rounded-xl border border-border/80 bg-background px-3.5 text-sm font-medium text-foreground shadow-2xs hover:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-left">
                      <span className="truncate flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold">
                          {conditions.locationName}
                        </span>
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-72 sm:w-80 max-h-80 overflow-y-auto p-2"
                    >
                      {/* Search Bar */}
                      <div className="p-1 pb-2 border-b border-border/60 sticky top-0 bg-popover z-10 space-y-1.5">
                        <input
                          type="text"
                          placeholder="Search district or state..."
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                          className="w-full h-8 px-2.5 text-xs rounded-lg border border-border/80 bg-background text-foreground outline-none focus:border-primary"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      <div className="mt-1 space-y-2">
                        {filteredStateGroups.map((grp) => (
                          <div key={grp.state} className="space-y-0.5">
                            <div className="px-2 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-md">
                              🏛️ {grp.state}
                            </div>
                            {grp.locations.map((loc) => (
                              <DropdownMenuItem
                                key={loc}
                                onClick={() => handleSelectLocation(loc)}
                                className="text-xs font-medium cursor-pointer flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-accent"
                              >
                                <span>{loc}</span>
                                {conditions.locationName === loc && (
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                )}
                              </DropdownMenuItem>
                            ))}
                          </div>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Use Current Location Button */}
                <div className="sm:col-span-4">
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className={cn(
                      "flex h-11 w-full items-center justify-center gap-2 rounded-xl border px-3 text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-60",
                      conditions.isLiveLocation
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
                        : "border-emerald-600/40 bg-white dark:bg-card text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
                    )}
                  >
                    {isLocating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LocateFixed
                        className={cn(
                          "h-4 w-4",
                          conditions.isLiveLocation
                            ? "text-emerald-700 animate-pulse"
                            : "text-emerald-600",
                        )}
                      />
                    )}
                    <span>
                      {conditions.isLiveLocation
                        ? "GPS Active"
                        : "Use Current Location"}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Farm Area Field */}
            <div className="pt-1">
              <label className="flex items-center justify-between text-xs font-semibold text-foreground mb-1.5">
                <span className="flex items-center gap-1">
                  <span>Farm Area</span>
                  <span
                    title="Total cultivated area of your land in Acres"
                    className="cursor-help text-muted-foreground/70 hover:text-foreground"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </span>
                </span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  Used for total yield & profit calculation
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={conditions.farmArea || ""}
                  onChange={(e) =>
                    handleNumericChange("farmArea", e.target.value)
                  }
                  className={cn(
                    "h-11 w-full rounded-xl border bg-background px-3.5 pr-20 text-sm font-semibold text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20",
                    errors["farmArea"] ? "border-rose-500" : "border-border/80",
                  )}
                  placeholder="5.0"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground pointer-events-none">
                  Acres
                </span>
              </div>
            </div>

            {/* Location Status Message */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-0.5">
              <Check className="h-3.5 w-3.5" />
              <span>
                {conditions.isLiveLocation
                  ? `Live GPS location active (${conditions.locationName}) • High accuracy weather connected`
                  : `Location set to ${conditions.locationName} • High accuracy weather connected`}
              </span>
            </div>
          </div>

          {/* SECTION 2: Soil Data */}
          <div className="space-y-3.5 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-emerald-600" />
                <h2 className="font-display text-base font-bold text-foreground">
                  2. Soil Data
                </h2>
              </div>

              {/* Farmer Doesn't Know Soil Data Option */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground">
                  Don&apos;t know your soil data?
                </span>
                <button
                  type="button"
                  onClick={handleUseEstimatedSoilData}
                  className="rounded-lg border border-emerald-600/40 bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 transition-colors cursor-pointer"
                >
                  Use Estimated Soil Data
                </button>
              </div>
            </div>

            {/* Estimated Soil Data Active Alert */}
            {isUsingEstimatedSoil && estimatedSoilBenchmark && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between gap-2 rounded-xl border border-amber-300/80 bg-amber-50/80 dark:border-amber-900/40 dark:bg-amber-950/30 px-3.5 py-2.5 text-xs text-amber-900 dark:text-amber-200"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold">
                      ⚠️ Using estimated soil data
                    </span>
                    <span className="block text-[11px] opacity-90">
                      Regional Soil Benchmark for{" "}
                      {estimatedSoilBenchmark.region}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearEstimatedSoilData}
                  className="text-[11px] font-bold underline hover:text-amber-950 cursor-pointer shrink-0"
                >
                  Edit / Enter Manually
                </button>
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Nitrogen (N) */}
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-foreground mb-1.5">
                  <span>Nitrogen (N)</span>
                  <span
                    title="Available Nitrogen in soil (0–350 kg/ha)"
                    className="cursor-help text-muted-foreground/70 hover:text-foreground"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={conditions.nitrogen || ""}
                    onChange={(e) =>
                      handleNumericChange("nitrogen", e.target.value)
                    }
                    className={cn(
                      "h-11 w-full rounded-xl border bg-background px-3.5 pr-14 text-sm font-semibold text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20",
                      errors["nitrogen"]
                        ? "border-rose-500"
                        : "border-border/80",
                    )}
                    placeholder="80"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground pointer-events-none">
                    kg/ha
                  </span>
                </div>
              </div>

              {/* Phosphorus (P) */}
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-foreground mb-1.5">
                  <span>Phosphorus (P)</span>
                  <span
                    title="Available Phosphorus in soil (0–250 kg/ha)"
                    className="cursor-help text-muted-foreground/70 hover:text-foreground"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={conditions.phosphorus || ""}
                    onChange={(e) =>
                      handleNumericChange("phosphorus", e.target.value)
                    }
                    className={cn(
                      "h-11 w-full rounded-xl border bg-background px-3.5 pr-14 text-sm font-semibold text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20",
                      errors["phosphorus"]
                        ? "border-rose-500"
                        : "border-border/80",
                    )}
                    placeholder="40"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground pointer-events-none">
                    kg/ha
                  </span>
                </div>
              </div>

              {/* Potassium (K) */}
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-foreground mb-1.5">
                  <span>Potassium (K)</span>
                  <span
                    title="Available Potassium in soil (0–300 kg/ha)"
                    className="cursor-help text-muted-foreground/70 hover:text-foreground"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={conditions.potassium || ""}
                    onChange={(e) =>
                      handleNumericChange("potassium", e.target.value)
                    }
                    className={cn(
                      "h-11 w-full rounded-xl border bg-background px-3.5 pr-14 text-sm font-semibold text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20",
                      errors["potassium"]
                        ? "border-rose-500"
                        : "border-border/80",
                    )}
                    placeholder="50"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground pointer-events-none">
                    kg/ha
                  </span>
                </div>
              </div>

              {/* Soil pH */}
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-foreground mb-1.5">
                  <span>Soil pH</span>
                  <span
                    title="Soil Acidity/Alkalinity measure (0.1 – 14.0)"
                    className="cursor-help text-muted-foreground/70 hover:text-foreground"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="14"
                  value={conditions.soilPh || ""}
                  onChange={(e) =>
                    handleNumericChange("soilPh", e.target.value)
                  }
                  className={cn(
                    "h-11 w-full rounded-xl border bg-background px-3.5 text-sm font-semibold text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20",
                    errors["soilPh"] ? "border-rose-500" : "border-border/80",
                  )}
                  placeholder="6.8"
                />
              </div>
            </div>

            {/* Soil Info Helper */}
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-[#f0fdf4] dark:bg-emerald-950/20 px-3.5 py-2 text-xs text-emerald-800 dark:text-emerald-300">
              <FlaskConical className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                Soil N, P, K & pH values are passed directly into the trained ML
                model for maximum yield prediction accuracy.
              </span>
            </div>
          </div>

          {/* SECTION 3: Season */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600" />
              <h2 className="font-display text-base font-bold text-foreground">
                3. Season
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Select Season
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-11 w-full items-center justify-between rounded-xl border border-border/80 bg-background px-3.5 text-sm font-medium text-foreground shadow-2xs hover:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-left">
                  <span className="font-semibold">{conditions.season}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  {SEASONS.map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() =>
                        setConditions((prev) => ({ ...prev, season: s }))
                      }
                      className="text-xs font-semibold cursor-pointer flex items-center justify-between py-2 rounded-lg"
                    >
                      <span>🌾 {s}</span>
                      {conditions.season === s && (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* SECTION 4: Current Weather (Auto-Fetched Live) */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudSun className="h-4 w-4 text-emerald-600" />
                <h2 className="font-display text-base font-bold text-foreground">
                  4. Current Weather{" "}
                  <span className="font-semibold text-emerald-600">
                    (Auto-Fetched Live)
                  </span>
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  {weatherCondition}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    void loadWeather(conditions.locationName, globalCoords)
                  }
                  disabled={isWeatherLoading}
                  title="Refresh live weather"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/80 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw
                    className={cn(
                      "h-3.5 w-3.5",
                      isWeatherLoading && "animate-spin text-emerald-600",
                    )}
                  />
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground -mt-1">
              Live meteorological metrics for {conditions.locationName} via
              Open-Meteo
            </p>

            {/* 3 Weather Cards Grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* Temperature */}
              <div className="relative overflow-hidden flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card p-3 shadow-2xs">
                <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500 dark:bg-rose-950/30">
                  <Thermometer className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-muted-foreground">
                    Temperature
                  </span>
                  <span className="font-display text-sm font-bold text-foreground sm:text-base">
                    {isWeatherLoading ? "..." : `${conditions.temperature}°C`}
                  </span>
                </div>
              </div>

              {/* Humidity */}
              <div className="relative overflow-hidden flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card p-3 shadow-2xs">
                <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500 dark:bg-sky-950/30">
                  <Droplets className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-muted-foreground">
                    Humidity
                  </span>
                  <span className="font-display text-sm font-bold text-foreground sm:text-base">
                    {isWeatherLoading ? "..." : `${conditions.humidity}%`}
                  </span>
                </div>
              </div>

              {/* Rainfall */}
              <div className="relative overflow-hidden flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card p-3 shadow-2xs">
                <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/30">
                  <CloudRain className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-muted-foreground">
                    Rainfall
                  </span>
                  <span className="font-display text-sm font-bold text-foreground sm:text-base">
                    {isWeatherLoading ? "..." : `${conditions.rainfall} mm`}
                  </span>
                </div>
              </div>
            </div>

            {/* Last updated note */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Check className="h-3.5 w-3.5" />
              <span>
                {isWeatherLoading
                  ? "Fetching live satellite weather..."
                  : `Last updated: ${conditions.lastUpdatedText}`}
              </span>
            </div>
          </div>

          {/* GET AI RECOMMENDATION BUTTON */}
          <div className="pt-2">
            <motion.button
              type="button"
              onClick={handleGetAIRecommendation}
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#087a36] hover:bg-[#06632b] text-white text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    {LOADING_STEPS[loadingStepIndex]?.text || "Analyzing..."}...
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4.5 w-4.5 text-emerald-200" />
                  <span>Get AI Recommendation</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* ====================================================== */}
        {/* RIGHT CARD: DYNAMIC CROP INTELLIGENCE VIEWS (5 cols)   */}
        {/* ====================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="rounded-3xl border border-border/80 bg-white p-6 shadow-xs dark:bg-card lg:col-span-5 space-y-5"
        >
          {/* SUB-VIEW 1: AI CROP RECOMMENDATION */}
          {activeSubView === "recommendation" && (
            <>
              {/* Top Title & AI Analysis Badge */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-foreground">
                      🌾 Top Recommended Crops
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    Random Forest ML
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Live ML predictions based on your soil NPK, pH & weather
                  conditions
                </p>
              </div>

              {/* Crop Recommendation Cards */}
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {crops.map((crop, idx) => {
                    const isModerate = crop.badgeVariant === "moderate";
                    const isHigh = crop.badgeVariant === "high";
                    const medal = RANK_MEDALS[idx] || "🌱";

                    return (
                      <motion.div
                        key={`${crop.id}-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.04 }}
                        className="rounded-2xl border border-border/70 bg-card p-4 shadow-2xs space-y-3"
                      >
                        {/* Header Row: Thumbnail + Crop Details + Score */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
                              <Image
                                src={crop.image}
                                alt={crop.name}
                                fill
                                unoptimized={typeof crop.image === "string"}
                                className="object-cover"
                              />
                              <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[11px]">
                                {medal}
                              </span>
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-display text-base font-bold text-foreground">
                                  {crop.name}
                                </h3>
                                <span
                                  className={cn(
                                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                    isHigh
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                                      : isModerate
                                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                                        : "bg-emerald-50 text-emerald-700",
                                  )}
                                >
                                  {crop.suitability}
                                </span>
                              </div>

                              <div className="mt-1 flex items-center gap-2">
                                <span className="text-[11px] text-muted-foreground">
                                  {crop.hindiName}
                                </span>
                                <span className="text-muted-foreground/40">
                                  •
                                </span>
                                <span className="font-display text-xs font-bold text-foreground">
                                  {crop.expectedYield}
                                </span>
                              </div>

                              {/* Profit & Risk quick badges */}
                              <div className="mt-1.5 flex items-center gap-1.5">
                                <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                                  Profit: {crop.profitPotential}
                                </span>
                                <span
                                  className={cn(
                                    "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                                    crop.riskLevel === "Low"
                                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                      : crop.riskLevel === "High"
                                        ? "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
                                  )}
                                >
                                  Risk: {crop.riskLevel || "Low"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Suitability Score */}
                          <div className="text-right shrink-0">
                            <span className="block text-[10px] font-medium text-muted-foreground">
                              Model Confidence
                            </span>
                            <span
                              className={cn(
                                "font-display text-2xl font-extrabold",
                                isModerate
                                  ? "text-amber-500"
                                  : "text-emerald-600",
                              )}
                            >
                              {crop.matchScore}%
                            </span>
                          </div>
                        </div>

                        {/* Why Recommended Explanation Box */}
                        <div
                          className={cn(
                            "rounded-xl border p-3 text-xs",
                            isModerate
                              ? "border-amber-100 bg-[#fffbeb] text-amber-900 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-200"
                              : "border-emerald-100 bg-[#f0fdf4] text-emerald-900 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-200",
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <div
                              className={cn(
                                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                                isModerate
                                  ? "bg-amber-200 text-amber-800"
                                  : "bg-emerald-200 text-emerald-800",
                              )}
                            >
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="block font-bold">
                                ML Prediction Details:
                              </span>
                              <p className="leading-relaxed opacity-90 text-[11.5px]">
                                {crop.reason}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

            </>
          )}

          {/* SUB-VIEW 2: PERSONALIZED CROP RANKING */}
          {activeSubView === "ranking" && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground">
                    📊 Personalized Crop Ranking
                  </h3>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                    Season: {conditions.season}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ranked in exact order of Random Forest ML probability
                  confidence
                </p>
              </div>

              <div className="space-y-3">
                {allRankedCrops.slice(0, 6).map((crop, index) => (
                  <div
                    key={crop.id}
                    className="rounded-2xl border border-border/70 bg-card p-3.5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                          #{index + 1}
                        </span>
                        <div>
                          <span className="font-bold text-sm text-foreground">
                            {crop.name}
                          </span>
                          <span className="text-xs text-muted-foreground ml-1.5">
                            ({crop.hindiName})
                          </span>
                        </div>
                      </div>
                      <span className="font-display text-base font-extrabold text-emerald-600">
                        {crop.matchScore}% ML Prob
                      </span>
                    </div>

                    {/* Breakdown bars */}
                    <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                      <div className="rounded-lg bg-muted/40 p-2">
                        <span className="text-muted-foreground block">
                          Soil Match
                        </span>
                        <span className="font-bold text-foreground">
                          {crop.soilMatchScore ?? 90}%
                        </span>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-2">
                        <span className="text-muted-foreground block">
                          Climate Fit
                        </span>
                        <span className="font-bold text-foreground">
                          {crop.weatherFitScore ?? 88}%
                        </span>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-2">
                        <span className="text-muted-foreground block">
                          Seasonal Fit
                        </span>
                        <span className="font-bold text-foreground">
                          {crop.seasonalFitScore ?? 94}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: WHY THESE CROPS? (ML EXPLANATION) */}
          {activeSubView === "explanation" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  💡 Why These Crops?
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ML model analysis for {conditions.locationName}
                </p>
              </div>

              {/* 4 Metric Cards Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <FlaskConical className="h-4 w-4 text-emerald-600" />
                    <span>Soil Chemistry</span>
                  </div>
                  <p className="font-display text-xl font-bold text-foreground">
                    {insights.soilMatch}%
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {insights.soilMatchLabel}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <CloudRain className="h-4 w-4 text-sky-600" />
                    <span>Weather Fit</span>
                  </div>
                  <p className="font-display text-xl font-bold text-foreground">
                    {insights.weatherFit}%
                  </p>
                  <p className="text-[11px] font-semibold text-sky-700 dark:text-sky-400 mt-0.5">
                    {insights.weatherFitLabel}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    <span>Seasonal Fit</span>
                  </div>
                  <p className="font-display text-xl font-bold text-foreground">
                    {insights.seasonalFit}%
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {insights.seasonalFitLabel}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span>Market Demand</span>
                  </div>
                  <p className="font-display text-xl font-bold text-foreground">
                    {insights.marketDemand}
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {insights.marketDemandLabel}
                  </p>
                </div>
              </div>

              {/* AI Insight Box */}
              <div className="rounded-2xl border border-emerald-200/80 bg-[#f0fdf4] dark:bg-emerald-950/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span>ML Feature Interpretation</span>
                </div>
                <p className="text-xs leading-relaxed text-emerald-950 dark:text-emerald-200">
                  {insights.aiInsight}
                </p>
              </div>
            </div>
          )}

          {/* SUB-VIEW 4: CROP PROFITABILITY PREDICTION */}
          {activeSubView === "profitability" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  💰 Crop Profitability Prediction
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Calculated based on {conditions.farmArea} Acres farm area &
                  market price indices
                </p>
              </div>

              <div className="space-y-3">
                {crops.map((crop) => {
                  const prof = crop.profitability;
                  if (!prof) return null;

                  return (
                    <div
                      key={crop.id}
                      className="rounded-2xl border border-border/70 bg-card p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-foreground">
                            {crop.name}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            Market: ₹{prof.marketPricePerQuintal}/qtl • Yield:{" "}
                            {crop.expectedYield}
                          </span>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                          {prof.roiPercentage}% ROI
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-xl bg-muted/40 p-2.5">
                          <span className="text-muted-foreground block text-[11px]">
                            Total Estimated Cost
                          </span>
                          <span className="font-bold text-foreground">
                            ₹{prof.totalCost.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="rounded-xl bg-muted/40 p-2.5">
                          <span className="text-muted-foreground block text-[11px]">
                            Expected Net Profit
                          </span>
                          <span className="font-bold text-emerald-600">
                            ₹{prof.totalProfit.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-VIEW 5: CROP RISK PREDICTION */}
          {activeSubView === "risk" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  🛡️ Crop Risk Prediction
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Multi-factor vulnerability assessment under current weather &
                  soil conditions
                </p>
              </div>

              <div className="space-y-3">
                {crops.map((crop) => {
                  const risk = crop.risk;
                  if (!risk) return null;

                  return (
                    <div
                      key={crop.id}
                      className="rounded-2xl border border-border/70 bg-card p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-foreground">
                            {crop.name}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            Overall Risk Score: {risk.overallRisk}/100
                          </span>
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-bold",
                            risk.riskLevel === "Low"
                              ? "bg-emerald-100 text-emerald-800"
                              : risk.riskLevel === "High"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800",
                          )}
                        >
                          {risk.riskLevel} Risk
                        </span>
                      </div>

                      {/* Main risk factors */}
                      <div className="space-y-1 text-xs">
                        <span className="font-semibold text-foreground text-[11px]">
                          Key Risk Factors & Mitigations:
                        </span>
                        <ul className="list-disc list-inside text-muted-foreground space-y-0.5 text-[11.5px]">
                          {risk.mainRiskFactors.map((rf, i) => (
                            <li key={i}>{rf}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ======================================================== */}
      {/* 3. BOTTOM INFORMATION BANNER                             */}
      {/* ======================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-white dark:bg-card p-4 shadow-xs"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
            <Info className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-foreground">
              How Random Forest Recommendation Works
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Our trained ML model processes 7 key features: Nitrogen,
              Phosphorus, Potassium, Temperature, Humidity, pH, and Rainfall.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHowItWorksModal(true)}
          className="inline-flex shrink-0 items-center gap-1.5 self-start sm:self-center rounded-xl border border-border/80 bg-white dark:bg-card px-4 py-2 text-xs font-bold text-foreground shadow-2xs hover:bg-accent transition-colors cursor-pointer"
        >
          <span>Learn More →</span>
        </button>
      </motion.div>



      {/* ======================================================== */}
      {/* MODAL: RECOMMENDATION HISTORY                            */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-border bg-white p-6 shadow-xl dark:bg-card space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-emerald-600" />
                  <h2 className="font-display text-base font-bold text-foreground">
                    Recommendation History
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {historyItems.length === 0 ? (
                <p className="text-xs text-muted-foreground py-6 text-center">
                  No recommendation history saved yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {historyItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-border/70 p-3.5 space-y-2 bg-card/60"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">
                          {item.location}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          Top Crop: {item.topCrop}
                        </span>
                        <span className="font-bold text-foreground">
                          Suitability: {item.suitability}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: HOW AI RECOMMENDATION WORKS / LEARN MORE          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showHowItWorksModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-border bg-white p-6 shadow-xl dark:bg-card space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-base font-bold text-foreground">
                      AgriSmart ML Decision Engine
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      99.55% Accuracy Random Forest Classifier
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHowItWorksModal(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-foreground/90 leading-relaxed">
                <p>
                  AgriSmart AI processes your soil chemical properties
                  (Nitrogen, Phosphorus, Potassium, and pH) combined with
                  meteorological parameters (temperature, relative humidity, and
                  rainfall) to recommend crops with maximum yield potential.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="rounded-xl border bg-muted/40 p-3">
                    <span className="font-bold text-foreground block">
                      🧪 Soil Nutrition (NPK & pH)
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Evaluates soil chemistry to match specific crop nutrient
                      needs.
                    </span>
                  </div>
                  <div className="rounded-xl border bg-muted/40 p-3">
                    <span className="font-bold text-foreground block">
                      🌤️ Climate Matching
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Matches crop thermal, humidity & moisture thresholds with
                      local conditions.
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
