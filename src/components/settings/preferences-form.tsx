import { useState } from "react";
import { toast } from "sonner";
import { Settings, Globe, Thermometer, Maximize } from "lucide-react";
import { useProfile, ProfileData } from "@/lib/use-profile";
import { useLanguage } from "@/lib/i18n";

export function PreferencesForm() {
  const { profile, updateProfile } = useProfile();
  const { setLang } = useLanguage();
  
  const handlePreferenceChange = async (key: string, value: any) => {
    try {
      const currentPrefs = profile?.preferences_json || {};
      const newPrefs = { ...currentPrefs, [key]: value };
      
      const updates: Partial<ProfileData> = { preferences_json: newPrefs };
      if (key === "language") {
        updates.language = value;
        setLang(value.substring(0, 2).toLowerCase() as any); // Assuming "English" -> "en", "Hindi" -> "hi"
      }
      if (key === "temperature_unit" || key === "area_unit") {
        updates.preferred_units = `${newPrefs.temperature_unit || "Celsius"}, ${newPrefs.area_unit || "Hectares"}`;
      }
      
      await updateProfile(updates);
      toast.success("Preferences updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update preferences");
    }
  };

  if (!profile) return null;
  const prefs = profile.preferences_json || {};

  return (
    <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm dark:bg-card">
      <div className="flex items-center gap-3 pb-4 border-b border-border/60">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf7ee] text-[#168447]">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-foreground">Preferences</h2>
          <p className="text-xs text-muted-foreground">Customize your experience.</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium">Language</span>
          </div>
          <select 
            value={prefs.language || profile.language || "English"}
            onChange={(e) => handlePreferenceChange("language", e.target.value)}
            className="rounded-lg border border-border/80 bg-background px-3 py-1.5 text-sm outline-none cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Marathi">Marathi (मराठी)</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Thermometer className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium">Temperature Unit</span>
          </div>
          <select 
            value={prefs.temperature_unit || "Celsius"}
            onChange={(e) => handlePreferenceChange("temperature_unit", e.target.value)}
            className="rounded-lg border border-border/80 bg-background px-3 py-1.5 text-sm outline-none cursor-pointer"
          >
            <option value="Celsius">Celsius (°C)</option>
            <option value="Fahrenheit">Fahrenheit (°F)</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Maximize className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium">Area Unit</span>
          </div>
          <select 
            value={prefs.area_unit || "Hectares"}
            onChange={(e) => handlePreferenceChange("area_unit", e.target.value)}
            className="rounded-lg border border-border/80 bg-background px-3 py-1.5 text-sm outline-none cursor-pointer"
          >
            <option value="Hectares">Hectares</option>
            <option value="Acres">Acres</option>
          </select>
        </div>
      </div>
    </div>
  );
}
