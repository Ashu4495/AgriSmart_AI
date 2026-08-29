"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/shell";
import { useAccount } from "@/components/landing/user-controls";
import { useTheme } from "@/lib/theme";
import farmerRamSingh from "@/assets/farmer-ram-singh.jpg";
import {
  Globe,
  Sliders,
  Shield,
  User,
  Check,
  ChevronDown,
  Lock,
  Smartphone,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Trash2,
  AlertTriangle,
  X,
  Wind,
  CreditCard,
  Bell,
} from "lucide-react";

type SettingsTab = "language" | "preferences" | "security" | "account";

export default function SettingsPage() {
  const { user, displayName, avatarUrl } = useAccount();
  const { theme, setTheme } = useTheme();

  // Tab State
  const [activeTab, setActiveTab] = useState<SettingsTab>("language");

  // 1. Language State
  const [appLanguage, setAppLanguage] = useState("English");
  const [regionalFormat, setRegionalFormat] = useState("India (English)");

  // 2. Preferences State
  const [units, setUnits] = useState("Metric (°C, km/h, kg, ha)");
  const [refreshInterval, setRefreshInterval] = useState("30 Minutes");
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [marketUpdates, setMarketUpdates] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // 3. Security Modals & State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Account Profile Details
  const farmerName = displayName || "Ram Singh";
  const farmerAvatar = avatarUrl || farmerRamSingh.src;
  const farmerEmail = user?.email || "ram.singh@email.com";
  const [farmerPhone, setFarmerPhone] = useState("+91 98765 43210");
  const [farmerLocation, setFarmerLocation] = useState(
    "Bhopal, Madhya Pradesh, India",
  );

  // Save Handlers
  function handleSaveLanguage() {
    toast.success(`Language updated to ${appLanguage} (${regionalFormat})`);
  }

  function handleSavePreferences() {
    toast.success("Preferences saved successfully!");
  }

  return (
    <DashboardShell
      headerTitle="Settings"
      headerSubtitle="Manage your account, preferences and app settings."
    >
      <div className="space-y-6 pb-8">
        {/* ======================================================== */}
        {/* 1. SETTINGS TABS                                         */}
        {/* ======================================================== */}
        <div className="flex items-center gap-6 border-b border-border/80 pb-px text-sm font-medium">
          {/* Tab 1: Language */}
          <button
            type="button"
            onClick={() => setActiveTab("language")}
            className={`relative flex items-center gap-2 pb-3 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "language"
                ? "text-[#168447]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe className="h-4.5 w-4.5" />
            <span>Language</span>
            {activeTab === "language" && (
              <motion.div
                layoutId="settingsTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#168447]"
              />
            )}
          </button>

          {/* Tab 2: Preferences */}
          <button
            type="button"
            onClick={() => setActiveTab("preferences")}
            className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "preferences"
                ? "text-[#168447] font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sliders className="h-4.5 w-4.5" />
            <span>Preferences</span>
            {activeTab === "preferences" && (
              <motion.div
                layoutId="settingsTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#168447]"
              />
            )}
          </button>

          {/* Tab 3: Security */}
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "security"
                ? "text-[#168447] font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield className="h-4.5 w-4.5" />
            <span>Security</span>
            {activeTab === "security" && (
              <motion.div
                layoutId="settingsTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#168447]"
              />
            )}
          </button>

          {/* Tab 4: Account */}
          <button
            type="button"
            onClick={() => setActiveTab("account")}
            className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "account"
                ? "text-[#168447] font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="h-4.5 w-4.5" />
            <span>Account</span>
            {activeTab === "account" && (
              <motion.div
                layoutId="settingsTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#168447]"
              />
            )}
          </button>
        </div>

        {/* ======================================================== */}
        {/* 2. CARD 1: LANGUAGE SECTION                              */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs"
        >
          {/* Header */}
          <div className="flex items-center gap-3 pb-5 border-b border-border/60">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf7ee] text-[#168447]">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                Language
              </h2>
              <p className="text-xs text-muted-foreground">
                Choose your preferred language for the application.
              </p>
            </div>
          </div>

          {/* Form & Illustration Grid */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-center">
            {/* Left Form Controls (7 cols) */}
            <div className="space-y-4 lg:col-span-6">
              {/* App Language */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  App Language
                </label>
                <div className="relative">
                  <select
                    value={appLanguage}
                    onChange={(e) => setAppLanguage(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs font-medium text-foreground outline-none focus:border-[#168447] focus:ring-1 focus:ring-[#168447] cursor-pointer appearance-none"
                  >
                    <option value="English">English</option>
                    <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                    <option value="Marathi (मराठी)">Marathi (मराठी)</option>
                    <option value="Gujarati (ગુજરાતી)">
                      Gujarati (ગુજરાતી)
                    </option>
                    <option value="Punjabi (ਪੰਜਾਬੀ)">Punjabi (ਪੰਜਾਬੀ)</option>
                    <option value="Tamil (தமிழ்)">Tamil (தமிழ்)</option>
                    <option value="Telugu (తెలుగు)">Telugu (తెలుగు)</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              {/* Regional Format */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Regional Format
                </label>
                <div className="relative">
                  <select
                    value={regionalFormat}
                    onChange={(e) => setRegionalFormat(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs font-medium text-foreground outline-none focus:border-[#168447] focus:ring-1 focus:ring-[#168447] cursor-pointer appearance-none"
                  >
                    <option value="India (English)">India (English)</option>
                    <option value="India (Hindi)">India (Hindi)</option>
                    <option value="International">International</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveLanguage}
                  className="rounded-xl bg-[#168447] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#14743e] cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Right Language World Map & Floating Bubbles (6 cols) */}
            <div className="relative flex items-center justify-center rounded-2xl bg-slate-50/70 p-6 lg:col-span-6 dark:bg-muted/10">
              <svg viewBox="0 0 360 180" className="h-44 w-full opacity-20">
                {/* World map stylized outline dots */}
                <circle cx="80" cy="50" r="18" fill="#94a3b8" />
                <circle cx="110" cy="70" r="24" fill="#94a3b8" />
                <circle cx="140" cy="110" r="14" fill="#94a3b8" />
                <circle cx="200" cy="40" r="28" fill="#94a3b8" />
                <circle cx="230" cy="70" r="22" fill="#94a3b8" />
                <circle cx="260" cy="80" r="20" fill="#94a3b8" />
                <circle cx="290" cy="120" r="16" fill="#94a3b8" />
              </svg>

              {/* Floating Language Bubbles */}
              <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-3 p-4">
                <span className="rounded-xl border border-emerald-200 bg-[#eaf7ee] px-3.5 py-1.5 text-xs font-bold text-[#15803d] shadow-2xs">
                  Hello
                </span>
                <span className="rounded-xl border border-green-200 bg-[#f0fdf4] px-3.5 py-1.5 text-xs font-bold text-[#16a34a] shadow-2xs">
                  नमस्ते
                </span>
                <span className="rounded-xl border border-emerald-200 bg-[#dcfce7] px-3.5 py-1.5 text-xs font-bold text-[#15803d] shadow-2xs">
                  नमस्कार
                </span>
                <span className="rounded-xl border border-amber-200 bg-[#fffbeb] px-3.5 py-1.5 text-xs font-bold text-amber-700 shadow-2xs">
                  Hola
                </span>
                <span className="rounded-xl border border-blue-200 bg-[#eff6ff] px-3.5 py-1.5 text-xs font-bold text-blue-700 shadow-2xs">
                  Bonjour
                </span>
                <span className="rounded-xl border border-purple-200 bg-[#faf5ff] px-3.5 py-1.5 text-xs font-bold text-purple-700 shadow-2xs">
                  வணக்கம்
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* 3. CARD 2: PREFERENCES SECTION                           */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs"
        >
          {/* Header */}
          <div className="flex items-center gap-3 pb-5 border-b border-border/60">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf7ee] text-[#168447]">
              <Wind className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                Preferences
              </h2>
              <p className="text-xs text-muted-foreground">
                Customize the app experience as per your needs.
              </p>
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="mt-6 grid gap-8 lg:grid-cols-12">
            {/* Left Side: Units, Theme, Refresh Interval (6 cols) */}
            <div className="space-y-4 lg:col-span-6">
              {/* Units */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Units</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Choose measurement units for easier understanding.
                  </p>
                </div>
                <div className="relative min-w-[200px] mt-1 sm:mt-0">
                  <select
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs font-medium text-foreground outline-none cursor-pointer appearance-none"
                  >
                    <option value="Metric (°C, km/h, kg, ha)">
                      Metric (°C, km/h, kg, ha)
                    </option>
                    <option value="Imperial (°F, mph, lbs, ac)">
                      Imperial (°F, mph, lbs, ac)
                    </option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              {/* Theme */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-border/40">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Theme</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Select your preferred theme for the application.
                  </p>
                </div>
                <div className="relative min-w-[200px] mt-1 sm:mt-0">
                  <select
                    value={theme}
                    onChange={(e) =>
                      setTheme(e.target.value as "light" | "dark")
                    }
                    className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs font-medium text-foreground outline-none cursor-pointer appearance-none capitalize"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              {/* Data Refresh Interval */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-border/40">
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Data Refresh Interval
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Set how often data should be refreshed.
                  </p>
                </div>
                <div className="relative min-w-[200px] mt-1 sm:mt-0">
                  <select
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs font-medium text-foreground outline-none cursor-pointer appearance-none"
                  >
                    <option value="15 Minutes">15 Minutes</option>
                    <option value="30 Minutes">30 Minutes</option>
                    <option value="1 Hour">1 Hour</option>
                    <option value="Manual">Manual</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="rounded-xl bg-[#168447] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#14743e] cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </div>

            {/* Right Side: Toggles (6 cols) with left border */}
            <div className="space-y-4 lg:col-span-6 lg:border-l lg:border-border/60 lg:pl-8">
              {/* 1. Enable Weather Alerts */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Enable Weather Alerts
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Get notified about severe weather.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWeatherAlerts((v) => !v)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    weatherAlerts
                      ? "bg-[#168447]"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      weatherAlerts ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* 2. Enable Market Updates */}
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Enable Market Updates
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Receive daily market price updates.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMarketUpdates((v) => !v)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    marketUpdates
                      ? "bg-[#168447]"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      marketUpdates ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* 3. Enable AI Recommendations */}
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Enable AI Recommendations
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Get smart suggestions and tips.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAiRecommendations((v) => !v)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    aiRecommendations
                      ? "bg-[#168447]"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      aiRecommendations ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* 4. Email Notifications */}
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Email Notifications
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Receive updates on your email.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailNotifications((v) => !v)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    emailNotifications
                      ? "bg-[#168447]"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      emailNotifications ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* 4. CARD 3: SECURITY SECTION                              */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs"
        >
          {/* Header */}
          <div className="flex items-center gap-3 pb-5 border-b border-border/60">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf7ee] text-[#168447]">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                Security
              </h2>
              <p className="text-xs text-muted-foreground">
                Keep your account secure and protected.
              </p>
            </div>
          </div>

          {/* Security Rows & Illustration Grid */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-center">
            {/* Left Rows (7 cols) */}
            <div className="space-y-4 lg:col-span-7">
              {/* Row 1: Password */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Password
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Update your password regularly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="rounded-xl border border-border/80 bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  Change Password
                </button>
              </div>

              {/* Row 2: Two-Factor Authentication */}
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Add an extra layer of security to your account.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTwoFAEnabled(!twoFAEnabled);
                    toast.success(
                      twoFAEnabled
                        ? "2FA Disabled"
                        : "2FA Enabled via Authenticator App",
                    );
                  }}
                  className="rounded-xl border border-border/80 bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  {twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
                </button>
              </div>

              {/* Row 3: Login Sessions */}
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Login Sessions
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Manage your active sessions and devices.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    toast.info("1 Active Session on Windows Chrome (Current)")
                  }
                  className="rounded-xl border border-border/80 bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  Manage Sessions
                </button>
              </div>
            </div>

            {/* Right Security Illustration (5 cols) */}
            <div className="relative flex items-center justify-center p-4 lg:col-span-5">
              <div className="relative flex h-48 w-48 items-center justify-center">
                {/* Outer Dotted Circle */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 animate-[spin_60s_linear_infinite]" />

                {/* Center Green Shield */}
                <div className="flex h-20 w-16 items-center justify-center rounded-2xl bg-[#168447] text-white shadow-md">
                  <Lock className="h-8 w-8 text-white" />
                </div>

                {/* Orbiting Icons */}
                {/* 1. Top-Left Lock */}
                <div className="absolute -top-1 left-4 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700 shadow-2xs dark:bg-muted">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                {/* 2. Top-Right Device */}
                <div className="absolute -top-1 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700 shadow-2xs dark:bg-muted">
                  <Smartphone className="h-3.5 w-3.5" />
                </div>
                {/* 3. Bottom-Left Check Shield */}
                <div className="absolute -bottom-1 left-4 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700 shadow-2xs dark:bg-muted">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                {/* 4. Bottom-Right User */}
                <div className="absolute -bottom-1 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700 shadow-2xs dark:bg-muted">
                  <User className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* 5. CARD 4: ACCOUNT SECTION                               */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs"
        >
          {/* Header */}
          <div className="flex items-center gap-3 pb-5 border-b border-border/60">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf7ee] text-[#168447]">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                Account
              </h2>
              <p className="text-xs text-muted-foreground">
                Manage your account information and preferences.
              </p>
            </div>
          </div>

          {/* Account Rows & Profile Card Grid */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-center">
            {/* Left Rows (7 cols) */}
            <div className="space-y-4 lg:col-span-7">
              {/* Row 1: Personal Information */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf7ee] text-[#168447]">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Personal Information
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Update your name, email and contact details.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    toast.info("Profile details are synced with InsForge")
                  }
                  className="rounded-xl border border-border/80 bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Row 2: Location */}
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf7ee] text-[#168447]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Location
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Manage your default location and fields.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    toast.info("Change location in the top header dropdown")
                  }
                  className="rounded-xl border border-border/80 bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Row 3: Subscription */}
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf7ee] text-[#168447]">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Subscription
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      View your plan details and billing info.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    toast.info("You are currently on the Premium Farmer Plan")
                  }
                  className="rounded-xl border border-border/80 bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  Manage
                </button>
              </div>

              {/* Row 4: Delete Account (Red Danger) */}
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-rose-600">
                      Delete Account
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Permanently delete your account and all data.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer dark:bg-rose-950/20 dark:border-rose-900"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Right Account Profile Card (5 cols) */}
            <div className="rounded-2xl border border-border/80 bg-slate-50/70 p-5 lg:col-span-5 dark:bg-muted/10">
              <div className="flex items-center gap-3">
                <img
                  src={farmerAvatar}
                  alt={farmerName}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-[#168447]/30"
                />
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">
                    {farmerName}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Premium Farmer
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-[#168447]" />
                  <span>{farmerEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#168447]" />
                  <span>{farmerPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#168447]" />
                  <span>{farmerLocation}</span>
                </div>
              </div>

              <div className="my-3 border-t border-border/60" />

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Member Since</span>
                <span className="font-bold text-foreground">12 Jan 2024</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-card p-5 shadow-xl border border-border">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="font-bold text-sm text-foreground">
                  Change Password
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="rounded-lg p-1 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-xl border p-2 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-xl border p-2 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="rounded-xl border px-3 py-1.5 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    toast.success("Password changed successfully");
                  }}
                  className="rounded-xl bg-[#168447] px-4 py-1.5 text-xs font-bold text-white"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-card p-5 shadow-xl border border-rose-200">
              <div className="flex items-center gap-2 text-rose-600 pb-2 border-b">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-bold text-sm">
                  Delete Account Confirmation
                </h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Are you sure you want to permanently delete your account? All
                your farm records, field data, and predictions will be
                permanently removed.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-xl border px-3 py-1.5 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    toast.error("Account deletion request recorded");
                  }}
                  className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
