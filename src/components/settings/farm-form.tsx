import { useState } from "react";
import { toast } from "sonner";
import { Leaf, Sprout, Home, Calendar, Droplet, CheckCircle } from "lucide-react";
import { useProfile, ProfileData } from "@/lib/use-profile";

export function FarmForm() {
  const { profile, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});

  const handleEdit = () => {
    setFormData({
      farm_name: profile?.farm_name || "",
      farm_size_acres: profile?.farm_size_acres || 0,
      farming_type: profile?.farming_type || "Mixed Farming",
      primary_crop: profile?.primary_crop || "",
      years_experience: profile?.years_experience || 0,
      soil_type: profile?.soil_type || "Loamy",
      irrigation_source: profile?.irrigation_source || "Drip Irrigation",
      organic_farming: profile?.organic_farming || false,
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
      toast.success("Farm details updated successfully.");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update farm details.");
    }
  };

  if (!profile) return null;

  return (
    <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm dark:bg-card">
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf7ee] text-[#168447]">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Farm Details</h2>
            <p className="text-xs text-muted-foreground">Manage your farming information for personalized recommendations.</p>
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
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-emerald-600"><Home className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Farm Name</p>
              <p className="font-semibold text-foreground">{profile.farm_name || "Not set"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-emerald-600"><Sprout className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Farm Size</p>
              <p className="font-semibold text-foreground">{profile.farm_size_acres ? `${profile.farm_size_acres} Acres` : "Not set"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-emerald-600"><Leaf className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Farming Type</p>
              <p className="font-semibold text-foreground">{profile.farming_type || "Not set"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-emerald-600"><Leaf className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Primary Crops</p>
              <p className="font-semibold text-foreground">{profile.primary_crop || "Not set"}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-emerald-600"><Calendar className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Years of Experience</p>
              <p className="font-semibold text-foreground">{profile.years_experience ? `${profile.years_experience} years` : "Not set"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-emerald-600"><CheckCircle className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Soil Type</p>
              <p className="font-semibold text-foreground">{profile.soil_type || "Not set"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-emerald-600"><Droplet className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Irrigation Type</p>
              <p className="font-semibold text-foreground">{profile.irrigation_source || "Not set"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-emerald-600"><Leaf className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Organic Farming</p>
              <p className="font-semibold text-foreground">{profile.organic_farming ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Farm Name</label>
              <input
                type="text"
                value={formData.farm_name}
                onChange={(e) => setFormData({ ...formData, farm_name: e.target.value })}
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Farm Size (Acres)</label>
              <input
                type="number"
                value={formData.farm_size_acres}
                onChange={(e) => setFormData({ ...formData, farm_size_acres: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Farming Type</label>
              <select
                value={formData.farming_type}
                onChange={(e) => setFormData({ ...formData, farming_type: e.target.value })}
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
              >
                <option value="Mixed Farming">Mixed Farming</option>
                <option value="Arable Farming">Arable Farming</option>
                <option value="Pastoral Farming">Pastoral Farming</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Primary Crops (Comma separated)</label>
              <input
                type="text"
                value={formData.primary_crop}
                onChange={(e) => setFormData({ ...formData, primary_crop: e.target.value })}
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Years of Experience</label>
              <input
                type="number"
                value={formData.years_experience}
                onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Soil Type</label>
              <select
                value={formData.soil_type}
                onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
              >
                <option value="Loamy">Loamy</option>
                <option value="Clay">Clay</option>
                <option value="Sandy">Sandy</option>
                <option value="Silt">Silt</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Irrigation Type</label>
              <select
                value={formData.irrigation_source}
                onChange={(e) => setFormData({ ...formData, irrigation_source: e.target.value })}
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
              >
                <option value="Drip Irrigation">Drip Irrigation</option>
                <option value="Sprinkler">Sprinkler</option>
                <option value="Surface">Surface</option>
                <option value="Rainfed">Rainfed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Organic Farming</label>
              <select
                value={formData.organic_farming ? "Yes" : "No"}
                onChange={(e) => setFormData({ ...formData, organic_farming: e.target.value === "Yes" })}
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
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
