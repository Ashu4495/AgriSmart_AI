import { useState } from "react";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import { useProfile, ProfileData } from "@/lib/use-profile";
import { useLocation } from "@/lib/location";

export function LocationForm() {
  const { profile, updateProfile } = useProfile();
  const { setLocation } = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});

  const handleEdit = () => {
    setFormData({
      state: profile?.state || "",
      district: profile?.district || "",
      village: profile?.village || "",
      pin_code: profile?.pin_code || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      if (formData.village || formData.district || formData.state) {
        const parts = [formData.village, formData.district, formData.state].filter(Boolean);
        if (parts.length > 0) {
          setLocation(parts.join(", "));
        }
      }
      toast.success("Location details updated successfully.");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update location details.");
    }
  };

  if (!profile) return null;

  return (
    <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm dark:bg-card">
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf7ee] text-[#168447]">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Location & Weather Preferences</h2>
            <p className="text-xs text-muted-foreground">Set your location for accurate weather updates and regional information.</p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 rounded-full border border-border/80 px-4 py-1.5 text-xs font-medium hover:bg-accent cursor-pointer"
          >
            Edit
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="mt-6 flex flex-col sm:flex-row gap-8">
          <div className="grid flex-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">State</p>
              <p className="font-semibold text-foreground">{profile.state || "Not set"}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">District</p>
              <p className="font-semibold text-foreground">{profile.district || "Not set"}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">City / Village</p>
              <p className="font-semibold text-foreground">{profile.village || "Not set"}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">PIN Code</p>
              <p className="font-semibold text-foreground">{profile.pin_code || "Not set"}</p>
            </div>
          </div>
          <div className="shrink-0 rounded-xl border border-border/80 p-3 flex flex-col items-center justify-center bg-slate-50 dark:bg-card/50">
            <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
              <MapPin className="h-4 w-4" />
              <span className="text-xs font-semibold">{profile.village || "Unknown"}, {profile.state || "Unknown"}</span>
            </div>
            <button
              onClick={handleEdit}
              className="text-[10px] font-medium text-emerald-600 hover:underline mt-2 cursor-pointer"
            >
              Change Location
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">District</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">City / Village</label>
              <input
                type="text"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">PIN Code</label>
              <input
                type="text"
                value={formData.pin_code}
                onChange={(e) => setFormData({ ...formData, pin_code: e.target.value })}
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleSave}
              className="rounded-lg bg-[#168447] px-5 py-2 text-sm font-medium text-white hover:bg-[#14743e] cursor-pointer"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="rounded-lg border border-border/80 px-5 py-2 text-sm font-medium text-foreground hover:bg-accent cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
