"use client";

import { useState } from "react";
import { MapPin, RefreshCw, Sprout, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLocation } from "@/lib/location";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LocationSelectorProps {
  locationName: string;
  isLive: boolean;
  onLocationChange: (name: string, isLive: boolean) => void;
  onRefreshWeather: () => void;
  isRefreshing?: boolean;
}

const POPULAR_LOCATIONS = [
  "Bhopal, Madhya Pradesh, India",
  "Indore, Madhya Pradesh, India",
  "Pune, Maharashtra, India",
  "Ludhiana, Punjab, India",
  "Nashik, Maharashtra, India",
  "Karnal, Haryana, India",
  "Jaipur, Rajasthan, India",
  "Nagpur, Maharashtra, India",
  "Varanasi, Uttar Pradesh, India",
  "Guntur, Andhra Pradesh, India",
];

export function LocationSelector({
  locationName,
  isLive,
  onLocationChange,
  onRefreshWeather,
  isRefreshing = false,
}: LocationSelectorProps) {
  const { fetchLiveLocation } = useLocation();
  const [activeTab, setActiveTab] = useState<"live" | "manual">(
    isLive ? "live" : "manual",
  );
  const [manualInput, setManualInput] = useState("");
  const [showManualSearch, setShowManualSearch] = useState(false);

  async function handleTabChange(tab: "live" | "manual") {
    setActiveTab(tab);
    if (tab === "live") {
      setShowManualSearch(false);
      const detected = await fetchLiveLocation();
      if (detected) {
        onLocationChange(detected, true);
      }
    } else {
      setShowManualSearch(true);
    }
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (manualInput.trim()) {
      onLocationChange(manualInput.trim(), false);
      setShowManualSearch(false);
      toast.success(`Location set to ${manualInput.trim()}`);
    }
  }

  return (
    <div className="space-y-4 pb-1 border-b border-border/60">
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border/40 pb-0">
        <button
          type="button"
          onClick={() => handleTabChange("live")}
          className={cn(
            "flex items-center gap-2 pb-2.5 text-xs sm:text-sm font-semibold transition-colors relative",
            activeTab === "live"
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Sprout className="h-4 w-4" />
          <span>Use Current Location</span>
          {activeTab === "live" && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("manual")}
          className={cn(
            "flex items-center gap-2 pb-2.5 text-xs sm:text-sm font-semibold transition-colors relative",
            activeTab === "manual"
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <MapPin className="h-4 w-4" />
          <span>Enter Location Manually</span>
          {activeTab === "manual" && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
          )}
        </button>
      </div>

      {/* Location Details and Refresh Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
          <DropdownMenu>
            <DropdownMenuTrigger className="text-left font-bold text-foreground hover:underline focus:outline-none">
              <span>{locationName}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              <div className="px-3 py-2 text-[11px] font-semibold text-muted-foreground">
                Select Region / District
              </div>
              {POPULAR_LOCATIONS.map((loc) => (
                <DropdownMenuItem
                  key={loc}
                  onClick={() => onLocationChange(loc, activeTab === "live")}
                  className="text-xs cursor-pointer"
                >
                  {loc}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <button
          type="button"
          onClick={onRefreshWeather}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/40 bg-emerald-50/60 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-2xs transition-colors hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50 disabled:opacity-50"
        >
          <RefreshCw
            className={cn(
              "h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400",
              isRefreshing && "animate-spin",
            )}
          />
          <span>Refresh Live Data</span>
        </button>
      </div>

      {/* Optional Manual Input Search Popup if manual tab is selected */}
      {showManualSearch && activeTab === "manual" && (
        <form onSubmit={handleManualSubmit} className="flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="e.g. Nagpur, Maharashtra, India"
              className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-xs text-foreground outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800"
          >
            Apply
          </button>
        </form>
      )}
    </div>
  );
}
