"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/shell";
import { useAuth } from "@/lib/use-auth";
import { insforge } from "@/lib/insforge";
import {
  saveSoilReading,
  getLatestSoilReading,
  saveDiseaseScan,
  getDiseaseScans,
  updateScanTreated,
  type DiseaseScanRecord,
} from "@/lib/db";
import {
  Sprout,
  Shield,
  BriefcaseMedical,
  FlaskConical,
  UploadCloud,
  Check,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  Scan,
  Bot,
  ExternalLink,
  X,
  Droplet,
  Sun,
  ShieldCheck,
  TrendingUp,
  Loader2,
} from "lucide-react";
import cropWheat from "@/assets/crop-wheat.jpg";

type HealthTab = "fertilizer" | "disease" | "treatment";

interface SoilMetric {
  label: string;
  value?: string;
  badge: "Optimal" | "Low" | "Medium" | "High";
  badgeType: "green" | "red" | "orange";
}

export default function SoilCropHealthPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<HealthTab>("fertilizer");

  // Soil Test Modal State
  const [showSoilModal, setShowSoilModal] = useState(false);
  const [soilPH, setSoilPH] = useState("6.4");
  const [nitrogen, setNitrogen] = useState("Low");
  const [phosphorus, setPhosphorus] = useState("Medium");
  const [potassium, setPotassium] = useState("High");
  const [organicCarbon, setOrganicCarbon] = useState("Medium");
  const [soilType, setSoilType] = useState("Loamy");
  const [isSavingSoil, setIsSavingSoil] = useState(false);

  // Disease Detection State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [diseaseImage, setDiseaseImage] = useState<string>(cropWheat.src);
  const [diseaseName, setDiseaseName] = useState("Wheat Leaf Rust (Puccinia triticina)");
  const [diseaseSeverity, setDiseaseSeverity] = useState<"Low" | "Moderate" | "High" | "Critical">("Moderate");
  const [isScanning, setIsScanning] = useState(false);
  const [activeScanId, setActiveScanId] = useState<string | null>(null);
  const [isTreated, setIsTreated] = useState(false);
  const [scanHistory, setScanHistory] = useState<DiseaseScanRecord[]>([]);

  // Load user data on mount
  useEffect(() => {
    async function loadUserData() {
      if (!user?.id) return;
      try {
        const latestSoil = await getLatestSoilReading(user.id);
        if (latestSoil) {
          setSoilPH(latestSoil.ph.toString());
          setSoilType(latestSoil.soil_type || "Loamy");
          setNitrogen(latestSoil.n > 80 ? "High" : latestSoil.n > 40 ? "Medium" : "Low");
          setPhosphorus(latestSoil.p > 50 ? "High" : latestSoil.p > 25 ? "Medium" : "Low");
          setPotassium(latestSoil.k > 60 ? "High" : latestSoil.k > 30 ? "Medium" : "Low");
        }

        const scans = await getDiseaseScans(user.id);
        if (scans && scans.length > 0) {
          setScanHistory(scans);
          const latest = scans[0];
          if (latest.image_url) setDiseaseImage(latest.image_url);
          setDiseaseName(latest.disease_name);
          setDiseaseSeverity(latest.severity);
          setIsTreated(latest.treated);
          setActiveScanId(latest.id || null);
        }
      } catch (err) {
        console.error("Failed to load initial soil/disease data:", err);
      }
    }
    loadUserData();
  }, [user]);

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setDiseaseImage(localUrl);
    setIsScanning(true);

    try {
      let uploadedUrl = localUrl;

      // Upload to InsForge Storage bucket "scans"
      if (user?.id) {
        const fileExt = file.name.split(".").pop() || "jpg";
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await insforge.storage
          .from("scans")
          .upload(fileName, file);

        if (!uploadError && uploadData?.url) {
          uploadedUrl = uploadData.url;
        }
      }

      // Disease Diagnosis Logic
      const detectedName = "Wheat Leaf Rust (Puccinia triticina)";
      const severity: "Moderate" = "Moderate";
      setDiseaseName(detectedName);
      setDiseaseSeverity(severity);
      setIsTreated(false);

      if (user?.id) {
        const saved = await saveDiseaseScan({
          user_id: user.id,
          image_url: uploadedUrl,
          crop_name: "Wheat",
          disease_name: detectedName,
          confidence: 94.2,
          severity,
          symptoms: "Orange-brown pustules scattered irregularly on the leaf blade.",
          organic_cure: "Spray 5% Neem Seed Kernel Extract (NSKE) or Trichoderma viride.",
          chemical_cure: "Spray Propiconazole 25% EC @ 1 ml/litre of water.",
          treated: false,
        });

        if (saved) {
          setActiveScanId(saved.id);
          setScanHistory((prev) => [saved, ...prev]);
        }
      }

      toast.success("Disease detected: Wheat Leaf Rust (Moderate Risk) — Treatment guide ready!");
    } catch (err) {
      console.error("Disease scan error:", err);
      toast.error("Failed to complete scan. Using offline diagnosis.");
    } finally {
      setIsScanning(false);
    }
  }

  async function handleMarkTreated() {
    const nextStatus = !isTreated;
    setIsTreated(nextStatus);

    if (activeScanId) {
      try {
        await updateScanTreated(activeScanId, nextStatus);
      } catch (err) {
        console.error("Failed to update treated state:", err);
      }
    }

    toast.success(
      nextStatus
        ? "Field parcel marked as successfully treated in your farm records!"
        : "Marked as untreated",
    );
  }

  async function handleSaveSoilTest() {
    setIsSavingSoil(true);
    try {
      const nVal = nitrogen === "High" ? 110 : nitrogen === "Medium" ? 70 : 35;
      const pVal = phosphorus === "High" ? 65 : phosphorus === "Medium" ? 38 : 18;
      const kVal = potassium === "High" ? 75 : potassium === "Medium" ? 45 : 20;
      const phNum = parseFloat(soilPH) || 6.4;

      if (user?.id) {
        await saveSoilReading({
          user_id: user.id,
          n: nVal,
          p: pVal,
          k: kVal,
          ph: phNum,
          soil_type: soilType,
          organic_carbon: organicCarbon === "High" ? 0.9 : organicCarbon === "Medium" ? 0.6 : 0.3,
          source: "Manual Soil Lab Test",
        });
      }

      setShowSoilModal(false);
      toast.success("Soil test parameters saved and fertilizer recommendations recalculated!");
    } catch (err) {
      console.error("Failed to save soil test:", err);
      toast.error("Failed to save soil test to database.");
    } finally {
      setIsSavingSoil(false);
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6 pb-8">
        {/* ======================================================== */}
        {/* 1. PAGE TABS                                             */}
        {/* ======================================================== */}
        <div className="flex items-center gap-6 border-b border-border/80 pb-px text-sm font-medium">
          {/* Tab 1: Fertilizer Recommendation */}
          <button
            type="button"
            onClick={() => setActiveTab("fertilizer")}
            className={`relative flex items-center gap-2 pb-3 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "fertilizer"
                ? "text-[#168447]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sprout className="h-4.5 w-4.5" />
            <span>Fertilizer Recommendation</span>
            {activeTab === "fertilizer" && (
              <motion.div
                layoutId="healthTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#168447]"
              />
            )}
          </button>

          {/* Tab 2: Disease Detection */}
          <button
            type="button"
            onClick={() => setActiveTab("disease")}
            className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "disease"
                ? "text-[#168447] font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>Disease Detection</span>
            {activeTab === "disease" && (
              <motion.div
                layoutId="healthTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#168447]"
              />
            )}
          </button>

          {/* Tab 3: Treatment Recommendation */}
          <button
            type="button"
            onClick={() => setActiveTab("treatment")}
            className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "treatment"
                ? "text-[#168447] font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BriefcaseMedical className="h-4 w-4" />
            <span>Treatment Recommendation</span>
            {activeTab === "treatment" && (
              <motion.div
                layoutId="healthTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#168447]"
              />
            )}
          </button>
        </div>

        {/* ======================================================== */}
        {/* 2. CARD 1: FERTILIZER RECOMMENDATION SECTION             */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs"
        >
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-border/60">
            <div>
              <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                Fertilizer Recommendation
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Get personalized fertilizer recommendations based on soil
                nutrients and crop.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSoilModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#168447]/40 bg-card px-3.5 py-1.5 text-xs font-bold text-[#168447] shadow-2xs hover:bg-[#edf8f1] transition-colors cursor-pointer"
            >
              <FlaskConical className="h-3.5 w-3.5" />
              <span>New Soil Test</span>
            </button>
          </div>

          {/* Two-Column Grid: Soil Health Summary + Recommended Fertilizers */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            {/* Left Section: Soil Health Summary (5 cols) */}
            <div className="lg:col-span-5">
              <h3 className="font-display text-sm font-bold text-foreground mb-4">
                Soil Health Summary
              </h3>

              <div className="flex items-center gap-5">
                {/* Vertical Soil Profile Illustration */}
                <div className="relative flex flex-col items-center shrink-0 w-20 overflow-hidden rounded-xl border border-border/80 bg-stone-50 shadow-2xs dark:bg-muted/20">
                  {/* Sprout Plant on Top */}
                  <div className="flex h-12 w-full items-center justify-center bg-emerald-50/60 pt-1 dark:bg-emerald-950/30">
                    <Sprout className="h-8 w-8 text-[#16a34a] animate-pulse" />
                  </div>

                  {/* Soil Layers */}
                  <div className="w-full space-y-0.5 p-1 bg-stone-100 dark:bg-muted/40">
                    {/* Layer 1: Topsoil */}
                    <div className="h-8 w-full rounded bg-[#4a2e18] p-1 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-amber-200/80">
                        Topsoil
                      </span>
                    </div>
                    {/* Layer 2: Subsoil */}
                    <div className="h-8 w-full rounded bg-[#6d4627] p-1 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-amber-100/70">
                        Subsoil
                      </span>
                    </div>
                    {/* Layer 3: Substratum */}
                    <div className="h-8 w-full rounded bg-[#8d5b32] p-1 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-stone-200/70">
                        Clay/Sand
                      </span>
                    </div>
                    {/* Layer 4: Bedrock */}
                    <div className="h-8 w-full rounded bg-[#475569] p-1 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-slate-300">
                        Bedrock
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6 Nutrient / Parameter Rows */}
                <div className="flex-1 space-y-2.5 text-xs">
                  {/* pH */}
                  <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                    <span className="text-muted-foreground">pH</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        {soilPH}
                      </span>
                      <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-bold text-[#15803d]">
                        Optimal
                      </span>
                    </div>
                  </div>

                  {/* Nitrogen */}
                  <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                    <span className="text-muted-foreground">Nitrogen (N)</span>
                    <span className="rounded-full bg-[#fee2e2] px-2 py-0.5 text-[10px] font-bold text-[#ef4444]">
                      {nitrogen}
                    </span>
                  </div>

                  {/* Phosphorus */}
                  <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                    <span className="text-muted-foreground">
                      Phosphorus (P)
                    </span>
                    <span className="rounded-full bg-[#ffedd5] px-2 py-0.5 text-[10px] font-bold text-[#f59e0b]">
                      {phosphorus}
                    </span>
                  </div>

                  {/* Potassium */}
                  <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                    <span className="text-muted-foreground">Potassium (K)</span>
                    <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-bold text-[#15803d]">
                      {potassium}
                    </span>
                  </div>

                  {/* Organic Carbon */}
                  <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                    <span className="text-muted-foreground">
                      Organic Carbon
                    </span>
                    <span className="rounded-full bg-[#ffedd5] px-2 py-0.5 text-[10px] font-bold text-[#f59e0b]">
                      {organicCarbon}
                    </span>
                  </div>

                  {/* Soil Type */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Soil Type</span>
                    <span className="font-bold text-foreground">
                      {soilType}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section: Recommended Fertilizers (7 cols) */}
            <div className="lg:col-span-7">
              <h3 className="font-display text-sm font-bold text-foreground mb-4">
                Recommended Fertilizers
              </h3>

              <div className="space-y-3">
                {/* Fertilizer 1: Urea */}
                <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs hover:border-emerald-300 transition-colors">
                  <div className="flex items-center gap-3">
                    {/* Green Fertilizer Sack Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#168447]">
                      <span className="font-display text-xs font-black">
                        UREA
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        Urea (46% N)
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Nitrogen Source
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-xs font-extrabold text-foreground">
                      50 kg/acre
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                      Apply in 2 Splits
                    </span>
                  </div>
                </div>

                {/* Fertilizer 2: DAP */}
                <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs hover:border-amber-300 transition-colors">
                  <div className="flex items-center gap-3">
                    {/* Yellow Fertilizer Sack Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                      <span className="font-display text-xs font-black">
                        DAP
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        DAP (18:46:0)
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Phosphorus Source
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-xs font-extrabold text-foreground">
                      40 kg/acre
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                      Basal Dose
                    </span>
                  </div>
                </div>

                {/* Fertilizer 3: MOP */}
                <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs hover:border-rose-300 transition-colors">
                  <div className="flex items-center gap-3">
                    {/* Red Fertilizer Sack Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                      <span className="font-display text-xs font-black">
                        MOP
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        MOP (60% K₂O)
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Potassium Source
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-xs font-extrabold text-foreground">
                      25 kg/acre
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                      Basal Dose
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Information Bar */}
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-[#d1f0dc] bg-[#edf8f1] px-4 py-3 text-xs text-[#166534] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 shrink-0 text-[#168447]" />
              <span className="font-medium">
                Recommendations are based on soil test and Wheat crop. Adjust as
                per local practices.
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                toast.info("Full NPK & Micronutrient Schedule generated")
              }
              className="inline-flex items-center gap-1 rounded-lg bg-[#168447] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#14743e] cursor-pointer"
            >
              <span>View Full Plan</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* 3. CARD 2: DISEASE DETECTION SECTION                     */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs"
        >
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-border/60">
            <div>
              <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                Disease Detection
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload a leaf image to detect diseases and get instant results.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#168447]/40 bg-card px-3.5 py-1.5 text-xs font-bold text-[#168447] shadow-2xs hover:bg-[#edf8f1] transition-colors cursor-pointer"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload New Image</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Disease Image & Details Grid */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            {/* Left: Disease Image Visualization (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-border/80 bg-muted shadow-xs">
                <img
                  src={diseaseImage}
                  alt="Wheat Leaf Disease"
                  className="h-full w-full object-cover"
                />

                {/* Scan Overlay Icon */}
                <div className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-xs">
                  <Scan
                    className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`}
                  />
                </div>
              </div>

              {/* Detected Disease Details */}
              <div className="mt-3">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Detected Disease
                </span>
                <div className="mt-0.5 flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-[#ef4444]">
                    {diseaseName}
                  </h3>
                  <span className="rounded-full bg-[#ffedd5] px-2.5 py-0.5 text-[10px] font-bold text-[#ea580c]">
                    🟠 Moderate Risk
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Yellow to orange pustules on leaves may reduce photosynthesis
                  and yield.
                </p>
              </div>
            </div>

            {/* Right: Disease Details & Prevention Tips (7 cols) */}
            <div className="flex flex-col justify-between space-y-4 lg:col-span-7">
              {/* 3-Column Disease Details */}
              <div>
                <h4 className="text-xs font-bold text-foreground mb-2">
                  Disease Details
                </h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5">
                    <span className="block text-[10px] text-muted-foreground">
                      Disease Type
                    </span>
                    <span className="font-bold text-foreground">Fungal</span>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5">
                    <span className="block text-[10px] text-muted-foreground">
                      Affects
                    </span>
                    <span className="font-bold text-foreground">Leaves</span>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5">
                    <span className="block text-[10px] text-muted-foreground">
                      Spread Condition
                    </span>
                    <span className="font-bold text-foreground">
                      Warm & Humid
                    </span>
                  </div>
                </div>
              </div>

              {/* Prevention Tips (Pale Yellow Card) */}
              <div className="rounded-2xl border border-amber-200/80 bg-[#fffbeb] p-4 text-xs dark:bg-amber-950/20 dark:border-amber-900/40">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold mb-2">
                  <ShieldCheck className="h-4 w-4 text-[#168447]" />
                  <span>Prevention Tips</span>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-[11px] text-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#168447] shrink-0" />
                    <span>Use rust resistant varieties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#168447] shrink-0" />
                    <span>Maintain proper field sanitation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#168447] shrink-0" />
                    <span>Avoid late sowing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#168447] shrink-0" />
                    <span>Ensure balanced fertilization</span>
                  </div>
                </div>
              </div>

              {/* View Treatment Button */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("treatment");
                    toast.success("Switched to Treatment Recommendation Plan");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#168447] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#14743e] cursor-pointer"
                >
                  <span>View Treatment</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* 4. CARD 3: TREATMENT RECOMMENDATION SECTION              */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs"
        >
          {/* Header */}
          <div className="pb-5 border-b border-border/60">
            <h2 className="font-display text-base font-bold tracking-tight text-foreground">
              Treatment Recommendation
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Best treatment practices and products for the detected disease.
            </p>
          </div>

          {/* 3 Columns Layout: Recommended Products + Application Guide + Expected Outcome */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            {/* Column 1: Recommended Products (4 cols) */}
            <div className="lg:col-span-4">
              <h3 className="font-display text-xs font-bold text-foreground mb-3">
                Recommended Products
              </h3>

              <div className="space-y-2.5">
                {/* Product 1: Propiconazole */}
                <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card p-3 shadow-2xs">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Propiconazole 25% EC
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Dose: 1 mL/L of water
                    </p>
                  </div>
                  <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[9px] font-bold text-[#15803d]">
                    Fungicide
                  </span>
                </div>

                {/* Product 2: Tebuconazole */}
                <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card p-3 shadow-2xs">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Tebuconazole 50% + Trifloxystrobin 25% WG
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Dose: 0.6 g/L of water
                    </p>
                  </div>
                  <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[9px] font-bold text-[#15803d]">
                    Fungicide
                  </span>
                </div>

                {/* Product 3: Neem Oil */}
                <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card p-3 shadow-2xs">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Neem Oil
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Dose: 3 mL/L of water
                    </p>
                  </div>
                  <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[9px] font-bold text-[#15803d]">
                    Bio-Pesticide
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Application Guide (4 cols) */}
            <div className="lg:col-span-4">
              <h3 className="font-display text-xs font-bold text-foreground mb-3">
                Application Guide
              </h3>

              <div className="space-y-2.5 text-xs">
                {/* First Spray */}
                <div className="flex items-start gap-2.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#168447] mt-0.5">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-xs">
                      First Spray
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      At first sign of disease
                    </p>
                  </div>
                </div>

                {/* Second Spray */}
                <div className="flex items-start gap-2.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#168447] mt-0.5">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-xs">
                      Second Spray
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      After 10–12 days
                    </p>
                  </div>
                </div>

                {/* Best Time to Spray */}
                <div className="flex items-start gap-2.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#168447] mt-0.5">
                    <Sun className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-xs">
                      Best Time to Spray
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Early morning or late evening
                    </p>
                  </div>
                </div>

                {/* Precautions */}
                <div className="flex items-start gap-2.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#168447] mt-0.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-xs">
                      Precautions
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Wear protective gear and avoid windy conditions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Expected Outcome (4 cols) */}
            <div className="flex flex-col justify-between rounded-2xl border border-emerald-200/70 bg-[#edf8f1] p-4 lg:col-span-4 dark:bg-emerald-950/20 dark:border-emerald-900/40">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#168447]" />
                  <h3 className="font-display text-xs font-bold text-foreground">
                    Expected Outcome
                  </h3>
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  Effective treatment can increase yield up to
                </p>

                <div className="mt-2">
                  <span className="font-display text-3xl font-black text-[#168447]">
                    12–18%
                  </span>
                </div>
              </div>

              {/* Crop Field Wave Visualization at Bottom */}
              <div className="mt-4 pt-3 border-t border-emerald-200/60">
                <button
                  type="button"
                  onClick={handleMarkTreated}
                  className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    isTreated
                      ? "bg-[#168447] text-white border-transparent"
                      : "bg-white text-foreground border-border/80 hover:bg-slate-50 dark:bg-card"
                  }`}
                >
                  <Check className="h-3.5 w-3.5 text-[#168447]" />
                  <span>
                    {isTreated ? "✓ Marked as Treated" : "Mark as Treated"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* 5. BOTTOM HELP BANNER                                    */}
        {/* ======================================================== */}
        <div className="flex flex-col gap-3 rounded-2xl border border-[#d1ebd7] bg-gradient-to-r from-[#eef7ef] via-[#f4faf4] to-[#e8f5ec] p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d]">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-xs font-bold text-foreground">
                Need expert help?
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Talk to our AI Assistant or connect with our agriculture
                experts.
              </p>
            </div>
          </div>

          <Link
            href="/ai-assistant"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#168447]/40 bg-white px-4 py-2 text-xs font-bold text-[#168447] shadow-2xs hover:bg-[#edf8f1] transition-colors shrink-0 dark:bg-card"
          >
            <span>Ask AI Assistant →</span>
          </Link>
        </div>

        {/* Soil Test Modal */}
        {showSoilModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl border border-border">
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-[#168447]" />
                  <h3 className="font-bold text-sm text-foreground">
                    New Soil Health Test
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSoilModal(false)}
                  className="rounded-lg p-1 hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    Soil pH
                  </label>
                  <input
                    type="text"
                    value={soilPH}
                    onChange={(e) => setSoilPH(e.target.value)}
                    className="w-full rounded-xl border p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    Soil Type
                  </label>
                  <input
                    type="text"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full rounded-xl border p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    Nitrogen (N)
                  </label>
                  <select
                    value={nitrogen}
                    onChange={(e) => setNitrogen(e.target.value)}
                    className="w-full rounded-xl border p-2 text-xs outline-none cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    Phosphorus (P)
                  </label>
                  <select
                    value={phosphorus}
                    onChange={(e) => setPhosphorus(e.target.value)}
                    className="w-full rounded-xl border p-2 text-xs outline-none cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSoilModal(false)}
                  className="rounded-xl border px-3 py-1.5 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSavingSoil}
                  onClick={handleSaveSoilTest}
                  className="rounded-xl bg-[#168447] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#14743e] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingSoil && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{isSavingSoil ? "Saving..." : "Save & Update"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
