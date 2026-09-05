"use client";

import { DashboardShell } from "@/components/dashboard/shell";
import { ProfileForm } from "@/components/settings/profile-form";
import { FarmForm } from "@/components/settings/farm-form";
import { LocationForm } from "@/components/settings/location-form";
import { PreferencesForm } from "@/components/settings/preferences-form";
import { NotificationsForm } from "@/components/settings/notifications-form";
import { SecurityForm } from "@/components/settings/security-form";
import { SubscriptionCard } from "@/components/settings/subscription-card";
import { ProfileCompletion } from "@/components/settings/profile-completion";
import { useProfile } from "@/lib/use-profile";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type TabId = "profile" | "farm" | "location" | "preferences" | "notifications" | "security" | "subscription";

export default function SettingsPage() {
  const { isLoading, profile } = useProfile();
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const tabs = [
    { id: "profile" as TabId, label: "Profile" },
    { id: "farm" as TabId, label: "Farm Details" },
    { id: "location" as TabId, label: "Location & Weather" },
    { id: "preferences" as TabId, label: "Preferences" },
    { id: "notifications" as TabId, label: "Notifications" },
    { id: "security" as TabId, label: "Security" },
    { id: "subscription" as TabId, label: "Subscription" },
  ];

  if (isLoading) {
    return (
      <DashboardShell headerTitle="Settings" headerSubtitle="Manage your profile, farm details, preferences and account settings.">
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      headerTitle="Settings"
      headerSubtitle="Manage your profile, farm details, preferences and account settings."
    >
      <div className="flex flex-col gap-6 lg:flex-row pb-12">
        {/* Left Content Area (approx 8 cols) */}
        <div className="flex-1 space-y-6 min-w-0">
          
          {/* Top Horizontal Navigation */}
          <div className="flex overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex items-center gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    document.getElementById(tab.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                    activeTab === tab.id 
                      ? "bg-[#168447] text-white" 
                      : "bg-white text-muted-foreground border border-border/80 hover:bg-accent dark:bg-card"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Sections */}
          <div className="space-y-6 mt-4">
            <div id="profile"><ProfileForm /></div>
            <div id="farm"><FarmForm /></div>
            <div id="location"><LocationForm /></div>
            <div id="preferences"><PreferencesForm /></div>
            <div id="notifications"><NotificationsForm /></div>
            <div id="security"><SecurityForm /></div>
            <div id="subscription"><SubscriptionCard /></div>
            
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:bg-red-950/20 dark:border-red-900/30">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-red-700 dark:text-red-400">Danger Zone</h3>
                  <p className="text-xs text-red-600/80 mt-1 dark:text-red-400/80">These actions are permanent and cannot be undone.</p>
                </div>
              </div>
              <div className="mt-4">
                <button className="w-full sm:w-auto rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors shadow-sm dark:bg-card dark:border-red-900/40 dark:hover:bg-red-950/40 cursor-pointer">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar (approx 4 cols) */}
        <div className="w-full lg:w-[320px] xl:w-[380px] shrink-0">
          <div className="sticky top-24">
            <ProfileCompletion />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
