"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/shell";
import {
  Sprout,
  BookOpen,
  Search,
  RotateCw,
  ArrowRight,
  ExternalLink,
  Bookmark,
  Play,
  Check,
  Tractor,
  Umbrella,
  FileCheck2,
  Coins,
  Droplets,
  Sun,
  CreditCard,
  AlertCircle,
  X,
  Award,
  CheckCircle2,
  Sparkles,
  Radio,
  ShieldCheck,
  BellRing,
} from "lucide-react";
import type { SchemeMatch } from "@/lib/schemes";
import type { KnowledgeResource } from "@/lib/knowledge";
import type { AgriculturalAdvisory } from "@/lib/current-updates";

// Major Indian States with state-specific schemes + pan-India coverage
const INDIAN_STATES = [
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Gujarat",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Rajasthan",
  "Haryana",
  "Odisha",
  "West Bengal",
  "Andhra Pradesh",
  "Telangana",
  "Bihar",
  "Kerala",
  "Assam",
  "Chhattisgarh",
  "Jharkhand",
  "Himachal Pradesh",
  "Uttarakhand",
];

// District mapping by state
const DISTRICTS_BY_STATE: Record<string, string[]> = {
  "Madhya Pradesh": ["All Districts", "Bhopal", "Indore", "Vidisha", "Ujjain", "Sehore", "Jabalpur", "Gwalior", "Sagar", "Rewa"],
  "Maharashtra": ["All Districts", "Pune", "Mumbai", "Nagpur", "Nashik", "Chhatrapati Sambhajinagar", "Kolhapur", "Solapur", "Amravati", "Ahmednagar", "Vasai"],
  "Punjab": ["All Districts", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Sangrur", "Firozpur", "Hoshiarpur"],
  "Gujarat": ["All Districts", "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand"],
  "Karnataka": ["All Districts", "Bengaluru", "Mysuru", "Hubballi", "Belagavi", "Kalaburagi", "Mangaluru", "Tumakuru", "Shivamogga", "Dharwad"],
  "Tamil Nadu": ["All Districts", "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thanjavur"],
  "Uttar Pradesh": ["All Districts", "Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Meerut", "Bareilly", "Aligarh", "Gorakhpur", "Jhansi"],
  "Rajasthan": ["All Districts", "Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Sikar", "Bhilwara", "Alwar", "Pali"],
  "Haryana": ["All Districts", "Gurugram", "Faridabad", "Karnal", "Hisar", "Panipat", "Rohtak", "Ambala", "Sonipat", "Sirsa"],
  "Odisha": ["All Districts", "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada"],
  "West Bengal": ["All Districts", "Kolkata", "Howrah", "Darjeeling", "Siliguri", "Asansol", "Murshidabad", "Bardhaman", "Malda", "Nadia"],
  "Andhra Pradesh": ["All Districts", "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Kakinada", "Rajahmundry", "Tirupati"],
  "Telangana": ["All Districts", "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Nalgonda"],
  "Bihar": ["All Districts", "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah"],
  "Kerala": ["All Districts", "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur"],
};

const FARMING_TYPES = [
  "Crop Farming",
  "Horticulture",
  "Dairy & Livestock",
  "Organic Farming",
  "Fisheries",
  "Beekeeping",
  "Agroforestry",
  "Agribusiness",
];

const LAND_HOLDINGS = [
  "< 2 Acres (Marginal)",
  "2 - 5 Acres (Small)",
  "5 - 10 Acres (Medium)",
  "> 10 Acres (Large)",
];

const ANNUAL_INCOME_OPTIONS = [
  "< ₹1.5 Lakh",
  "₹1.5 - ₹3 Lakh",
  "₹3 - ₹5 Lakh",
  "> ₹5 Lakh",
];

const AGE_OPTIONS = [
  "28 yrs (Young Farmer)",
  "38 yrs (Adult Farmer)",
  "52 yrs (Experienced)",
  "62 yrs (Senior Farmer)",
];

const INTEREST_OPTIONS = [
  { id: "Financial Assistance", label: "Financial Assistance" },
  { id: "Crop Insurance", label: "Crop Insurance" },
  { id: "Agriculture Equipment", label: "Agriculture Equipment" },
  { id: "Training & Capacity Building", label: "Training & Capacity Building" },
  { id: "Irrigation & Water Management", label: "Irrigation & Water" },
  { id: "Soil Health & Fertilizer", label: "Soil Health" },
  { id: "Credit & Loans", label: "Credit & Working Capital" },
  { id: "Solar Energy & Pumps", label: "Solar Energy" },
];

export default function GovernmentResourcesPage() {
  // Extended Farmer Profile Inputs
  const [stateVal, setStateVal] = useState("Madhya Pradesh");
  const [districtVal, setDistrictVal] = useState("All Districts");
  const [farmingType, setFarmingType] = useState("Crop Farming");
  const [landHolding, setLandHolding] = useState("2 - 5 Acres (Small)");
  const [annualIncome, setAnnualIncome] = useState("₹1.5 - ₹3 Lakh");
  const [ageVal, setAgeVal] = useState("38 yrs (Adult Farmer)");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Schemes Data & Recommendation Engine State
  const [schemes, setSchemes] = useState<SchemeMatch[]>([]);
  const [topSchemes, setTopSchemes] = useState<SchemeMatch[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [eligibleCount, setEligibleCount] = useState<number>(0);
  const [possiblyEligibleCount, setPossiblyEligibleCount] = useState<number>(0);
  const [stateCount, setStateCount] = useState<number>(0);
  const [centralCount, setCentralCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Scheme Modals State
  const [selectedScheme, setSelectedScheme] = useState<SchemeMatch | null>(null);
  const [showAllModal, setShowAllModal] = useState<boolean>(false);
  const [modalSearch, setModalSearch] = useState<string>("");
  const [modalCategoryFilter, setModalCategoryFilter] = useState<string>("All");

  // Dynamic Knowledge Hub State (Step 5)
  const [knowledgeResources, setKnowledgeResources] = useState<KnowledgeResource[]>([]);
  const [knowledgeLoading, setKnowledgeLoading] = useState<boolean>(true);
  const [knowledgeError, setKnowledgeError] = useState<string | null>(null);
  const [knowledgeCategory, setKnowledgeCategory] = useState<string>("All");
  const [knowledgeType, setKnowledgeType] = useState<string>("All");
  const [knowledgeSearch, setKnowledgeSearch] = useState<string>("");
  const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeResource | null>(null);
  const [showAllKnowledgeModal, setShowAllKnowledgeModal] = useState<boolean>(false);
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  // Current Information Integration State (Step 6)
  const [advisories, setAdvisories] = useState<AgriculturalAdvisory[]>([]);
  const [advisoriesLoading, setAdvisoriesLoading] = useState<boolean>(true);
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>("August 28, 2026");
  const [officialDataSource, setOfficialDataSource] = useState<string>("Ministry of Agriculture & Farmers Welfare / IMD Agromet");

  // Update district dropdown when state changes
  const availableDistricts = DISTRICTS_BY_STATE[stateVal] || ["All Districts"];

  const handleStateChange = (newState: string) => {
    setStateVal(newState);
    setDistrictVal("All Districts");
  };

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((i) => i !== interestId)
        : [...prev, interestId]
    );
  };

  // Fetch schemes from dynamic backend API
  const fetchSchemes = useCallback(
    async (showToast = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set("state", stateVal);
        if (districtVal && districtVal !== "All Districts") {
          params.set("district", districtVal);
        }
        params.set("farmingType", farmingType);
        params.set("landHolding", landHolding);
        params.set("annualIncome", annualIncome);
        params.set("age", ageVal.replace(/\D/g, "").slice(0, 2) || "38");
        if (selectedInterests.length > 0) {
          params.set("interests", selectedInterests.join(","));
        }

        const res = await fetch(`/api/v1/schemes?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`Server returned HTTP ${res.status}`);
        }

        const data = await res.json();
        if (data.success) {
          const list: SchemeMatch[] = data.data || [];
          setSchemes(list);
          setTopSchemes(data.topRecommended || list.slice(0, 3));
          setTotalCount(data.total || list.length);
          setCentralCount(data.counts?.central || 0);
          setStateCount(data.counts?.state || 0);
          setEligibleCount(data.counts?.eligible || 0);
          setPossiblyEligibleCount(data.counts?.possiblyEligible || 0);

          if (showToast) {
            toast.success(
              `Top Personalized Schemes for ${stateVal} updated based on your profile!`
            );
          }
        } else {
          throw new Error(data.error || "Failed to load schemes");
        }
      } catch (err) {
        console.error("[Schemes Fetch Error]", err);
        setError("Unable to load recommendations. Please verify your connection.");
        if (showToast) {
          toast.error("Failed to fetch recommendations. Please retry.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [stateVal, districtVal, farmingType, landHolding, annualIncome, ageVal, selectedInterests]
  );

  // Fetch dynamic Knowledge Hub resources
  const fetchKnowledge = useCallback(
    async () => {
      setKnowledgeLoading(true);
      setKnowledgeError(null);
      try {
        const params = new URLSearchParams();
        if (knowledgeCategory && knowledgeCategory !== "All") {
          params.set("category", knowledgeCategory);
        }
        if (knowledgeSearch.trim()) {
          params.set("query", knowledgeSearch.trim());
        }
        params.set("state", stateVal);
        params.set("farmingType", farmingType);

        const res = await fetch(`/api/v1/knowledge?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`Knowledge API returned HTTP ${res.status}`);
        }

        const data = await res.json();
        if (data.success) {
          setKnowledgeResources(data.data || []);
        } else {
          throw new Error(data.error || "Failed to load knowledge resources");
        }
      } catch (err) {
        console.error("[Knowledge Fetch Error]", err);
        setKnowledgeError("Unable to load knowledge resources at this time.");
      } finally {
        setKnowledgeLoading(false);
      }
    },
    [knowledgeCategory, knowledgeType, knowledgeSearch, stateVal, farmingType]
  );

  // Fetch live advisories & government announcements (Step 6)
  const fetchAdvisories = useCallback(
    async () => {
      setAdvisoriesLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("state", stateVal);
        params.set("farmingType", farmingType);

        const res = await fetch(`/api/v1/updates?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setAdvisories(data.data);
            if (data.lastUpdated) setLastUpdatedDate(data.lastUpdated);
            if (data.source) setOfficialDataSource(data.source);
          }
        }
      } catch (err) {
        console.error("[Advisories Fetch Error]", err);
        // Seamless fallback to baseline data
      } finally {
        setAdvisoriesLoading(false);
      }
    },
    [stateVal, farmingType]
  );

  // NOTE: schemes are NOT fetched on mount — only on "Find Schemes" click

  useEffect(() => {
    fetchKnowledge();
  }, [fetchKnowledge]);

  useEffect(() => {
    fetchAdvisories();
  }, [fetchAdvisories]);

  // Find schemes button click
  const handleFindSchemes = () => {
    setHasSearched(true);
    fetchSchemes(true);
    fetchKnowledge();
    fetchAdvisories();
  };

  // Reset filters
  const handleReset = () => {
    setStateVal("Madhya Pradesh");
    setDistrictVal("All Districts");
    setFarmingType("Crop Farming");
    setLandHolding("2 - 5 Acres (Small)");
    setAnnualIncome("₹1.5 - ₹3 Lakh");
    setAgeVal("38 yrs (Adult Farmer)");
    setSelectedInterests([]);
    setHasSearched(false);
    setSchemes([]);
    setTopSchemes([]);
    setTotalCount(0);
    setEligibleCount(0);
    setPossiblyEligibleCount(0);
    setKnowledgeCategory("All");
    setKnowledgeSearch("");
    toast.info("Farmer profile and knowledge search reset to default");
  };

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = !prev[id];
      toast.success(
        next ? "Resource saved to your bookmarks!" : "Bookmark removed"
      );
      return { ...prev, [id]: next };
    });
  };

  // Filter schemes for the "View All Schemes" modal
  const filteredModalSchemes = schemes.filter((s) => {
    const matchesCategory =
      modalCategoryFilter === "All" ||
      (modalCategoryFilter === "Eligible" && s.eligibilityStatus === "eligible") ||
      (modalCategoryFilter === "Possibly" && s.eligibilityStatus === "possibly_eligible") ||
      (modalCategoryFilter === "Central" && s.level.toLowerCase() === "central") ||
      (modalCategoryFilter === "State" && s.level.toLowerCase() === "state") ||
      (modalCategoryFilter === "Financial" && (s.category === "financial" || s.category === "credit")) ||
      (modalCategoryFilter === "Insurance" && s.category === "insurance") ||
      (modalCategoryFilter === "Equipment" && (s.category === "equipment" || s.category === "solar")) ||
      (modalCategoryFilter === "Irrigation" && s.category === "irrigation");

    const matchesSearch =
      !modalSearch ||
      s.name.toLowerCase().includes(modalSearch.toLowerCase()) ||
      s.benefits.toLowerCase().includes(modalSearch.toLowerCase()) ||
      (s.interests || []).some((i) => i.toLowerCase().includes(modalSearch.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Render Scheme Category Icon helper
  const renderSchemeIcon = (scheme: SchemeMatch) => {
    switch (scheme.iconType) {
      case "tractor":
        return <Tractor className="h-4.5 w-4.5" />;
      case "umbrella":
        return <Umbrella className="h-4.5 w-4.5" />;
      case "droplet":
        return <Droplets className="h-4.5 w-4.5" />;
      case "sun":
        return <Sun className="h-4.5 w-4.5" />;
      case "credit":
        return <CreditCard className="h-4.5 w-4.5" />;
      case "sprout":
        return <Sprout className="h-4.5 w-4.5" />;
      case "book":
        return <BookOpen className="h-4.5 w-4.5" />;
      default:
        return <Coins className="h-4.5 w-4.5" />;
    }
  };

  // Status Badge Component Helper
  const renderStatusBadge = (scheme: SchemeMatch) => {
    switch (scheme.eligibilityStatus) {
      case "eligible":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
            <span className="text-[9px]">🟢</span>
            <span>Eligible</span>
          </span>
        );
      case "possibly_eligible":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
            <span className="text-[9px]">🟡</span>
            <span>Possibly</span>
          </span>
        );
      case "not_eligible":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-300 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-800 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800">
            <span className="text-[9px]">🔴</span>
            <span>Not Eligible</span>
          </span>
        );
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-5 pb-6">
        {/* ======================================================== */}
        {/* 1. TOP INFORMATION BANNER                                */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl border border-[#d1ebd7] bg-gradient-to-r from-[#eef7ef] via-[#f4faf4] to-[#e8f5ec] p-5 shadow-xs"
        >
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Left text */}
            <div className="flex items-start gap-4 max-w-xl">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d] shadow-xs">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h2 className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
                  Personalized Schemes & Live Government Advisories
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Real-time matching for 60+ Central and State welfare schemes with live application status, verified official portals, and IMD Agromet alerts.
                </p>
              </div>
            </div>

          </div>
        </motion.div>



        {/* ======================================================== */}
        {/* 3. MAIN CONTENT 2-COLUMN GRID                            */}
        {/* ======================================================== */}
        <div className="grid gap-5 lg:grid-cols-12">
          {/* -------------------------------------------------------- */}
          {/* CARD 1: FIND SCHEMES FOR YOU (Top-Left 6 Cols)           */}
          {/* -------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs lg:col-span-6"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                    Farmer Profile & Preferences
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Adjust options to personalize scheme ranking in real-time
                  </p>
                </div>
                {hasSearched && (
                <span className="text-[11px] font-bold text-[#168447] bg-[#dcfce7] px-2.5 py-0.5 rounded-full">
                  {eligibleCount} 🟢 Eligible
                </span>
                )}
              </div>

              {/* 6 Profile Selectors Grid */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {/* 1. State */}
                <div className="rounded-xl border border-border/80 bg-background p-2">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    State
                  </label>
                  <select
                    value={stateVal}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="mt-0.5 w-full bg-transparent text-xs font-bold text-foreground outline-none cursor-pointer"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. District */}
                <div className="rounded-xl border border-border/80 bg-background p-2">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    District
                  </label>
                  <select
                    value={districtVal}
                    onChange={(e) => setDistrictVal(e.target.value)}
                    className="mt-0.5 w-full bg-transparent text-xs font-bold text-foreground outline-none cursor-pointer"
                  >
                    {availableDistricts.map((dst) => (
                      <option key={dst} value={dst}>
                        {dst}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Farming Type */}
                <div className="rounded-xl border border-border/80 bg-background p-2">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Farming Type
                  </label>
                  <select
                    value={farmingType}
                    onChange={(e) => setFarmingType(e.target.value)}
                    className="mt-0.5 w-full bg-transparent text-xs font-bold text-foreground outline-none cursor-pointer"
                  >
                    {FARMING_TYPES.map((ft) => (
                      <option key={ft} value={ft}>
                        {ft}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Land Holding (acres) */}
                <div className="rounded-xl border border-border/80 bg-background p-2">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Land Holding
                  </label>
                  <select
                    value={landHolding}
                    onChange={(e) => setLandHolding(e.target.value)}
                    className="mt-0.5 w-full bg-transparent text-xs font-bold text-foreground outline-none cursor-pointer"
                  >
                    {LAND_HOLDINGS.map((lh) => (
                      <option key={lh} value={lh}>
                        {lh}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Annual Income */}
                <div className="rounded-xl border border-border/80 bg-background p-2">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Annual Income
                  </label>
                  <select
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    className="mt-0.5 w-full bg-transparent text-xs font-bold text-foreground outline-none cursor-pointer"
                  >
                    {ANNUAL_INCOME_OPTIONS.map((inc) => (
                      <option key={inc} value={inc}>
                        {inc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 6. Farmer Age */}
                <div className="rounded-xl border border-border/80 bg-background p-2">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Farmer Age
                  </label>
                  <select
                    value={ageVal}
                    onChange={(e) => setAgeVal(e.target.value)}
                    className="mt-0.5 w-full bg-transparent text-xs font-bold text-foreground outline-none cursor-pointer"
                  >
                    {AGE_OPTIONS.map((ag) => (
                      <option key={ag} value={ag}>
                        {ag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Interest Filter Checkbox Pills */}
              <div className="mt-4">
                <p className="text-xs font-bold text-foreground mb-2">
                  Preferred Support Interests (Select any)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {INTEREST_OPTIONS.map((item) => {
                    const isSelected = selectedInterests.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleInterest(item.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#dcfce7] border-[#86efac] text-[#15803d] font-semibold shadow-2xs"
                            : "bg-card border-border/80 text-foreground hover:bg-accent"
                        }`}
                      >
                        <span>{isSelected ? "✓" : "□"}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleFindSchemes}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-[#168447] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#14743e] cursor-pointer disabled:opacity-75"
              >
                <span>{isLoading ? "Re-Ranking…" : "Find Schemes"}</span>
                {isLoading ? (
                  <RotateCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Search className="h-3.5 w-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-accent cursor-pointer disabled:opacity-50"
              >
                <span>Reset</span>
                <RotateCw className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          </motion.div>

          {/* -------------------------------------------------------- */}
          {/* CARD 2: TOP RECOMMENDED SCHEMES (Top-Right 6 Cols)       */}
          {/* -------------------------------------------------------- */}
          {!hasSearched ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card p-8 shadow-xs lg:col-span-6 text-center gap-3"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                <Search className="h-7 w-7" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                No Schemes Loaded Yet
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                Set your farmer profile preferences on the left, then click{" "}
                <span className="font-bold text-[#168447]">&quot;Find Schemes&quot;</span>{" "}
                to see personalized government scheme recommendations.
              </p>
            </motion.div>
          ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs lg:col-span-6"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                    Top Recommended Schemes
                  </h2>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {stateVal}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllModal(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#168447] hover:underline cursor-pointer"
                >
                  <span>View All ({totalCount})</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {/* Dynamic Scheme Rows / Loading / Empty / Error States */}
              {isLoading ? (
                <div className="mt-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-3 py-3 animate-pulse border-b border-border/40 last:border-0"
                    >
                      <div className="flex items-start gap-3 w-3/4">
                        <div className="h-9 w-9 rounded-full bg-muted shrink-0" />
                        <div className="space-y-1.5 w-full">
                          <div className="h-3.5 bg-muted rounded w-2/3" />
                          <div className="h-2.5 bg-muted rounded w-full" />
                          <div className="h-2.5 bg-muted rounded w-4/5" />
                        </div>
                      </div>
                      <div className="h-6 w-20 bg-muted rounded-full shrink-0" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="my-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center dark:bg-red-950/20 dark:border-red-900/40">
                  <AlertCircle className="mx-auto h-6 w-6 text-red-600 mb-1" />
                  <p className="text-xs font-semibold text-red-800 dark:text-red-300">{error}</p>
                  <button
                    type="button"
                    onClick={() => fetchSchemes(true)}
                    className="mt-2 text-xs font-bold text-red-700 underline hover:text-red-900 cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              ) : topSchemes.length === 0 ? (
                <div className="my-8 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-2">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="text-xs font-bold text-foreground">No Schemes Found</h3>
                  <p className="mt-1 text-[11px] text-muted-foreground max-w-xs mx-auto">
                    Try broadening your interests or selecting another farming type to view eligible schemes.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-3 text-xs font-bold text-[#168447] hover:underline cursor-pointer"
                  >
                    Reset Search Filters
                  </button>
                </div>
              ) : (
                <div className="mt-2.5 divide-y divide-border/60">
                  {topSchemes.slice(0, 3).map((scheme) => (
                    <div
                      key={scheme.id}
                      className="flex items-start justify-between gap-3 py-3 first:pt-1.5 group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Circle Icon */}
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${scheme.iconBg} ${scheme.iconColor} shadow-2xs mt-0.5`}
                        >
                          {renderSchemeIcon(scheme)}
                        </div>

                        <div className="space-y-1 max-w-sm">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-xs font-bold text-foreground group-hover:text-[#168447] transition-colors">
                              {scheme.name}
                            </h3>
                            {scheme.level.toLowerCase() === "state" && (
                              <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                State Scheme
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-1">
                            {scheme.benefits}
                          </p>

                          {/* Short farmer-friendly explanation */}
                          <div className="rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 p-1.5 text-[10px] text-emerald-900 dark:text-emerald-200 border border-emerald-200/70 dark:border-emerald-900/40">
                            <p className="leading-tight font-medium">
                              💡 {scheme.recommendationReason}
                            </p>
                          </div>

                          {/* Live Operational Status badge (Step 6) */}
                          <div className="flex items-center gap-2 pt-0.5 text-[10px] text-muted-foreground">
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>{scheme.liveStatus?.applicationStatus || "Applications Open"}</span>
                            </span>
                            <span>•</span>
                            <span>Updated: {scheme.liveStatus?.lastUpdated || lastUpdatedDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Match % Badge + Status Badge + View Details */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0 pt-0.5">
                        <div className="flex items-center gap-1">
                          <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-bold text-[#15803d]">
                            {scheme.matchBadgeText || `${scheme.matchScore}% Match`}
                          </span>
                          {renderStatusBadge(scheme)}
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedScheme(scheme)}
                          className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-card px-2.5 py-1 text-[11px] font-bold text-foreground hover:bg-accent hover:border-[#168447]/50 transition-all cursor-pointer shadow-2xs"
                        >
                          <span>View Details</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Centered Link */}
            <button
              type="button"
              onClick={() => setShowAllModal(true)}
              className="mt-3 inline-flex w-full items-center justify-center gap-1 text-xs font-bold text-[#168447] hover:underline cursor-pointer pt-2"
            >
              <span>View All {totalCount} Schemes for {stateVal} ({eligibleCount} 🟢 Eligible)</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </motion.div>
          )}

          {/* -------------------------------------------------------- */}
          {/* CARD 3: DYNAMIC KNOWLEDGE HUB (Full Width 12 Cols)        */}
          {/* -------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs lg:col-span-12"
          >
            <div>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-border/60">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                      Dynamic Knowledge Hub
                    </h2>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {knowledgeResources.length} Resources
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Verified agronomical guides, sustainable farming practices, video tutorials, and farmer success stories tailored to {stateVal}.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAllKnowledgeModal(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#168447] hover:underline cursor-pointer"
                  >
                    <span>Browse All ({knowledgeResources.length})</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Filters & Search Row */}
              <div className="mt-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                  {[
                    "All",
                    "Best Practices",
                    "Crop Guide",
                    "Videos",
                    "Blogs",
                    "Success Stories",
                  ].map((cat) => {
                    const isSelected = knowledgeCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setKnowledgeCategory(cat)}
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? "bg-[#168447] text-white shadow-2xs"
                            : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Resource Type Pills */}
                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                  {[
                    "All",
                    "PDF",
                    "WEBSITE",
                    "ARTICLE",
                    "VIDEO",
                    "GUIDE",
                  ].map((type) => {
                    const isSelected = knowledgeType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setKnowledgeType(type)}
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? "bg-[#0284c7] text-white shadow-2xs"
                            : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[240px] md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={knowledgeSearch}
                    onChange={(e) => setKnowledgeSearch(e.target.value)}
                    placeholder="Search guides, crops, practices…"
                    className="w-full rounded-xl border border-border/80 bg-background pl-9 pr-7 py-1.5 text-xs text-foreground outline-none focus:border-[#168447] transition-colors"
                  />
                  {knowledgeSearch && (
                    <button
                      type="button"
                      onClick={() => setKnowledgeSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic Resource Cards Grid */}
              {knowledgeLoading ? (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex flex-col justify-between overflow-hidden rounded-xl border border-border/70 bg-card p-3 animate-pulse space-y-3"
                    >
                      <div className="h-28 w-full bg-muted rounded-lg" />
                      <div className="space-y-1.5">
                        <div className="h-3 bg-muted rounded w-3/4" />
                        <div className="h-2.5 bg-muted rounded w-full" />
                        <div className="h-2.5 bg-muted rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : knowledgeError ? (
                <div className="my-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center dark:bg-red-950/20 dark:border-red-900/40">
                  <AlertCircle className="mx-auto h-6 w-6 text-red-600 mb-1" />
                  <p className="text-xs font-semibold text-red-800 dark:text-red-300">{knowledgeError}</p>
                  <button
                    type="button"
                    onClick={() => fetchKnowledge()}
                    className="mt-2 text-xs font-bold text-red-700 underline hover:text-red-900 cursor-pointer"
                  >
                    Retry Loading Knowledge
                  </button>
                </div>
              ) : knowledgeResources.length === 0 ? (
                <div className="my-8 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-2">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="text-xs font-bold text-foreground">No Knowledge Resources Found</h3>
                  <p className="mt-1 text-[11px] text-muted-foreground max-w-xs mx-auto">
                    Try switching category or clearing your search term to see more agricultural resources.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setKnowledgeCategory("All");
                      setKnowledgeType("All");
                      setKnowledgeSearch("");
                    }}
                    className="mt-3 text-xs font-bold text-[#168447] hover:underline cursor-pointer"
                  >
                    Reset Knowledge Filters
                  </button>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                  {knowledgeResources.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border/70 bg-card hover:border-[#168447]/40 hover:shadow-xs transition-all"
                    >
                      <div>
                        {/* Image with Tag badge and play icon */}
                        <div className="relative h-28 w-full overflow-hidden bg-muted">
                          {item.thumbnail_url || item.image ? (
                            <img
                              src={item.thumbnail_url || item.image}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="h-full w-full bg-[#eaf7ee] flex items-center justify-center text-[#168447]">
                              <BookOpen className="h-8 w-8 opacity-50" />
                            </div>
                          )}
                          <span
                            className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[9px] font-bold text-white shadow-xs ${item.categoryBg || "bg-[#168447]"}`}
                          >
                            {item.category}
                          </span>

                          {/* State or Crop Pill */}
                          <span className="absolute top-2 right-2 rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9px] font-semibold text-white">
                            {item.resource_type}
                          </span>

                          {item.resource_type === 'VIDEO' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm">
                                <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-3">
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
                            <span>{item.source_name || item.source}</span>
                            {item.is_verified && (
                              <span className="flex items-center gap-0.5 text-[#168447] ml-1 font-semibold">
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                <span>Verified Source</span>
                              </span>
                            )}
                          </div>
                          <h3 className="text-xs font-bold text-foreground leading-snug line-clamp-2 group-hover:text-[#168447] transition-colors">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer with read time, action & bookmark */}
                      <div className="flex items-center justify-between p-3 pt-0 border-t border-border/40 text-[10px] text-muted-foreground">
                        <span>{item.page_count ? `${item.page_count} pages` : item.duration ? item.duration : 'Resource'}</span>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/knowledge/${item.id}`}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#168447] hover:underline cursor-pointer"
                          >
                            <span>
                              {item.resource_type === 'PDF' ? "Open PDF" : 
                               item.resource_type === 'WEBSITE' ? "Visit Website" :
                               item.resource_type === 'VIDEO' ? "Watch Video" :
                               item.resource_type === 'ARTICLE' ? "Read Article" :
                               item.resource_type === 'GOVERNMENT_DOCUMENT' ? "View Document" :
                               "Read Guide"}
                            </span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => toggleBookmark(item.id)}
                            className={`hover:text-foreground cursor-pointer ${
                              bookmarked[item.id] ? "text-[#168447]" : ""
                            }`}
                            title="Bookmark Resource"
                          >
                            <Bookmark
                              className={`h-3.5 w-3.5 ${
                                bookmarked[item.id] ? "fill-current" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. SCHEME DETAILS MODAL (Personalized + Current Status)   */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedScheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScheme(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-3 border-b border-border/70 p-5 bg-muted/20">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${selectedScheme.iconBg} ${selectedScheme.iconColor} shadow-xs mt-0.5`}
                  >
                    {renderSchemeIcon(selectedScheme)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        selectedScheme.level.toLowerCase() === "central"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}>
                        {selectedScheme.level} Scheme
                      </span>

                      <span className="rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-[10px] font-bold text-[#15803d]">
                        {selectedScheme.matchBadgeText || `${selectedScheme.matchScore}% Match`}
                      </span>

                      {renderStatusBadge(selectedScheme)}

                      <span className="text-[11px] text-muted-foreground">
                        ID: {selectedScheme.id}
                      </span>
                    </div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-foreground leading-snug">
                      {selectedScheme.name}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedScheme(null)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                {/* 1. Live Operational Status & Announcement Banner (Step 6) */}
                <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-3.5 dark:bg-emerald-950/40 dark:border-emerald-900/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200 text-xs">
                      <ShieldCheck className="h-4 w-4 text-[#168447]" />
                      <span>Current Application Status</span>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{selectedScheme.liveStatus?.applicationStatus || "Applications Open"}</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">
                    📢 {selectedScheme.liveStatus?.recentAnnouncement || "Official portal actively receiving eligible farmer applications via DBT."}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1.5 border-t border-emerald-200/60 dark:border-emerald-900/40">
                    <span>Source: {selectedScheme.liveStatus?.officialSource || "Ministry of Agriculture & Farmers Welfare"}</span>
                    <span>Last verified: {selectedScheme.liveStatus?.lastUpdated || lastUpdatedDate}</span>
                  </div>
                </div>

                {/* 2. Personalized Farmer-Friendly Recommendation Banner */}
                <div className="rounded-xl border border-border/70 bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-[#168447] text-xs">
                      <Sparkles className="h-4 w-4" />
                      <span>Why This Scheme is Recommended for You</span>
                    </div>
                    <span className="font-bold text-foreground">
                      {selectedScheme.matchBadgeText || `${selectedScheme.matchScore}% Match`}
                    </span>
                  </div>

                  <p className="text-foreground text-xs font-semibold leading-relaxed">
                    {selectedScheme.recommendationReason}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-border/60">
                    {selectedScheme.whyConditions.map((cond, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-foreground/90">
                        <Check className="h-3.5 w-3.5 text-[#168447] shrink-0 mt-0.5" />
                        <span>{cond}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Benefits Section */}
                <div className="rounded-xl border border-border/70 bg-background p-4 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-[#168447] text-xs">
                    <Award className="h-4 w-4" />
                    <span>Key Scheme Benefits</span>
                  </div>
                  <p className="text-foreground leading-relaxed font-medium">
                    {selectedScheme.benefits}
                  </p>
                </div>

                {/* 4. Eligibility Section */}
                <div className="rounded-xl border border-border/70 bg-background p-4 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-foreground text-xs">
                    <CheckCircle2 className="h-4 w-4 text-[#168447]" />
                    <span>Official Eligibility Guidelines</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedScheme.eligibility}
                  </p>
                </div>

                {/* 5. Required Documents */}
                <div className="rounded-xl border border-border/70 bg-background p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-foreground text-xs">
                    <FileCheck2 className="h-4 w-4 text-[#168447]" />
                    <span>Required Documents</span>
                  </div>
                  <ul className="space-y-1">
                    {(selectedScheme.documents_required || ["Standard farmer identity and land ownership documents"]).map(
                      (doc, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-[#168447] shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* 6. Applicable Scope & Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/70 bg-background p-3.5">
                    <span className="block text-[11px] font-bold text-muted-foreground mb-1.5">
                      Applicable Coverage
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedScheme.states.map((st) => (
                        <span
                          key={st}
                          className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground"
                        >
                          {st === "ALL" ? "All India (Central)" : st}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/70 bg-background p-3.5">
                    <span className="block text-[11px] font-bold text-muted-foreground mb-1.5">
                      Supported Farming Types
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedScheme.farming_types.map((ft) => (
                        <span
                          key={ft}
                          className="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 text-[11px] font-medium dark:bg-emerald-950/40 dark:text-emerald-300"
                        >
                          {ft}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer with Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/70 p-4 bg-muted/20">
                <div className="text-[11px] text-muted-foreground text-center sm:text-left">
                  Last verified: {selectedScheme.liveStatus?.lastUpdated || lastUpdatedDate} • Check official guidelines before applying.
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedScheme(null)}
                    className="flex-1 sm:flex-none rounded-xl border border-border/80 bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent cursor-pointer"
                  >
                    Close
                  </button>

                  {selectedScheme.application_url && (
                    <a
                      href={selectedScheme.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#168447] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#14743e] cursor-pointer transition-colors"
                    >
                      <span>Apply on Portal</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 6. VIEW ALL SCHEMES MODAL (Ranked by Match %)             */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showAllModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/70 p-4 sm:p-5 bg-muted/20">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-base sm:text-lg font-bold text-foreground">
                      All Evaluated Schemes ({filteredModalSchemes.length})
                    </h2>
                    <span className="rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-[10px] font-bold text-[#15803d]">
                      {stateVal}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {eligibleCount} 🟢 Eligible • {possiblyEligibleCount} 🟡 Possibly Eligible • {stateCount} State schemes • Last verified: {lastUpdatedDate}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllModal(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 border-b border-border/60 p-3.5 bg-background">
                <div className="relative w-full sm:flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    placeholder="Search by scheme name or benefits…"
                    className="w-full rounded-xl border border-border/80 bg-card pl-9 pr-3 py-1.5 text-xs text-foreground outline-none focus:border-[#168447]"
                  />
                  {modalSearch && (
                    <button
                      type="button"
                      onClick={() => setModalSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Quick Category Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {[
                    "All",
                    "Eligible",
                    "Possibly",
                    "Central",
                    "State",
                    "Financial",
                    "Insurance",
                    "Equipment",
                    "Irrigation",
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setModalCategoryFilter(cat)}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        modalCategoryFilter === cat
                          ? "bg-[#168447] text-white shadow-2xs"
                          : "border border-border/80 bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat === "Eligible" ? "🟢 Eligible" : cat === "Possibly" ? "🟡 Possibly" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schemes Grid (Sorted with Top Match % first) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                {filteredModalSchemes.length === 0 ? (
                  <div className="py-12 text-center">
                    <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-xs font-bold text-foreground">No matching schemes found</p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Try adjusting your search terms or category filter.
                    </p>
                  </div>
                ) : (
                  filteredModalSchemes.map((scheme) => (
                    <div
                      key={scheme.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/70 bg-background p-3.5 hover:border-[#168447]/40 hover:shadow-xs transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${scheme.iconBg} ${scheme.iconColor} shadow-2xs mt-0.5`}
                        >
                          {renderSchemeIcon(scheme)}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xs font-bold text-foreground">
                              {scheme.name}
                            </h3>
                            <span
                              className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                                scheme.level.toLowerCase() === "central"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                              }`}
                            >
                              {scheme.level}
                            </span>
                            <span className="rounded-full bg-[#dcfce7] px-2 py-0.2 text-[10px] font-bold text-[#15803d]">
                              {scheme.matchBadgeText || `${scheme.matchScore}% Match`}
                            </span>
                            {renderStatusBadge(scheme)}
                          </div>

                          <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-1">
                            {scheme.benefits}
                          </p>

                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span className="text-[#15803d] dark:text-emerald-400 font-medium">
                              💡 {scheme.recommendationReason}
                            </span>
                            <span>•</span>
                            <span>{scheme.liveStatus?.applicationStatus || "Active"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedScheme(scheme);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-accent cursor-pointer"
                        >
                          <span>View Details</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                        {scheme.application_url && (
                          <a
                            href={scheme.application_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-lg bg-[#168447] p-1.5 text-white hover:bg-[#14743e]"
                            title="Open Official Portal"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border/70 p-3.5 bg-muted/20 text-xs">
                <span className="text-muted-foreground text-[11px]">
                  Showing {filteredModalSchemes.length} of {totalCount} schemes ({eligibleCount} 🟢 Eligible)
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllModal(false)}
                  className="rounded-lg bg-foreground px-4 py-1.5 text-xs font-bold text-background hover:opacity-90 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 7. KNOWLEDGE RESOURCE DETAILS MODAL                      */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedKnowledge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedKnowledge(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl"
            >
              {/* Header */}
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                <img
                  src={selectedKnowledge.image}
                  alt={selectedKnowledge.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <button
                  type="button"
                  onClick={() => setSelectedKnowledge(null)}
                  className="absolute top-3 right-3 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${selectedKnowledge.categoryBg || "bg-[#168447]"}`}>
                      {selectedKnowledge.category}
                    </span>
                    <span className="rounded-full bg-white/20 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-semibold">
                      {selectedKnowledge.crop}
                    </span>
                    <span className="text-[11px] opacity-80">
                      {selectedKnowledge.read_time}
                    </span>
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold leading-snug">
                    {selectedKnowledge.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                {/* Source & Coverage */}
                <div className="flex items-center justify-between gap-2 rounded-xl bg-muted/40 p-3 border border-border/60">
                  <div>
                    <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Official Source / Author
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {selectedKnowledge.source}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Geographic Scope
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {selectedKnowledge.state === "ALL" ? "Pan-India" : selectedKnowledge.state}
                    </span>
                  </div>
                </div>

                {/* Description / Content */}
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground text-xs">Overview & Key Takeaways</h4>
                  <p className="text-muted-foreground leading-relaxed text-xs">
                    {selectedKnowledge.description}
                  </p>
                </div>

                {/* Tags */}
                {selectedKnowledge.tags && selectedKnowledge.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground text-xs">Topic Tags</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedKnowledge.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 border-t border-border/70 p-4 bg-muted/20">
                <button
                  type="button"
                  onClick={() => toggleBookmark(selectedKnowledge.id)}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                    bookmarked[selectedKnowledge.id] ? "text-[#168447]" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${bookmarked[selectedKnowledge.id] ? "fill-current" : ""}`} />
                  <span>{bookmarked[selectedKnowledge.id] ? "Saved" : "Save Bookmark"}</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedKnowledge(null)}
                    className="rounded-xl border border-border/80 bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent cursor-pointer"
                  >
                    Close
                  </button>

                  {selectedKnowledge.resource_url && (
                    <a
                      href={selectedKnowledge.resource_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#168447] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#14743e] cursor-pointer transition-colors"
                    >
                      <span>{selectedKnowledge.is_video ? "Watch on Portal" : "Open Source Article"}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 8. VIEW ALL KNOWLEDGE MODAL                              */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showAllKnowledgeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllKnowledgeModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/70 p-4 sm:p-5 bg-muted/20">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-base sm:text-lg font-bold text-foreground">
                      Agricultural Knowledge Library ({knowledgeResources.length})
                    </h2>
                    <span className="rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-[10px] font-bold text-[#15803d]">
                      {stateVal} Focus
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Full catalog of best practices, crop manuals, ICAR research bulletins, and video masterclasses.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllKnowledgeModal(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 border-b border-border/60 p-3.5 bg-background">
                <div className="relative w-full sm:flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={knowledgeSearch}
                    onChange={(e) => setKnowledgeSearch(e.target.value)}
                    placeholder="Search all knowledge resources…"
                    className="w-full rounded-xl border border-border/80 bg-card pl-9 pr-3 py-1.5 text-xs text-foreground outline-none focus:border-[#168447]"
                  />
                  {knowledgeSearch && (
                    <button
                      type="button"
                      onClick={() => setKnowledgeSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {[
                    "All",
                    "Best Practices",
                    "Crop Guide",
                    "Videos",
                    "Blogs",
                    "Success Stories",
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setKnowledgeCategory(cat)}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        knowledgeCategory === cat
                          ? "bg-[#168447] text-white shadow-2xs"
                          : "border border-border/80 bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                {knowledgeResources.length === 0 ? (
                  <div className="py-12 text-center">
                    <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-xs font-bold text-foreground">No resources found</p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Try adjusting your search criteria or category filter.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {knowledgeResources.map((item) => (
                      <div
                        key={item.id}
                        className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border/70 bg-card hover:border-[#168447]/40 hover:shadow-xs transition-all"
                      >
                        <div>
                          <div className="relative h-28 w-full overflow-hidden bg-muted">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <span
                              className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[9px] font-bold text-white shadow-xs ${item.categoryBg || "bg-[#168447]"}`}
                            >
                              {item.category}
                            </span>
                            <span className="absolute top-2 right-2 rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9px] font-semibold text-white">
                              {item.crop !== "General" ? item.crop : item.state !== "ALL" ? item.state : "Pan-India"}
                            </span>

                            {item.is_video && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm">
                                  <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-3">
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
                              <span>{item.source}</span>
                            </div>
                            <h3 className="text-xs font-bold text-foreground leading-snug line-clamp-2 group-hover:text-[#168447] transition-colors">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 pt-0 border-t border-border/40 text-[10px] text-muted-foreground">
                          <span>{item.read_time}</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedKnowledge(item)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#168447] hover:underline cursor-pointer"
                            >
                              <span>{item.is_video ? "Watch" : "Read"}</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleBookmark(item.id)}
                              className={`hover:text-foreground cursor-pointer ${
                                bookmarked[item.id] ? "text-[#168447]" : ""
                              }`}
                            >
                              <Bookmark className={`h-3.5 w-3.5 ${bookmarked[item.id] ? "fill-current" : ""}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border/70 p-3.5 bg-muted/20 text-xs">
                <span className="text-muted-foreground text-[11px]">
                  Showing {knowledgeResources.length} resources
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllKnowledgeModal(false)}
                  className="rounded-lg bg-foreground px-4 py-1.5 text-xs font-bold text-background hover:opacity-90 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
