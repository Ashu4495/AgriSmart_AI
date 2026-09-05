import { useState } from "react";
import { toast } from "sonner";
import { User, Camera } from "lucide-react";
import { useProfile, ProfileData } from "@/lib/use-profile";
import { useAccount } from "@/components/landing/user-controls";

export function ProfileForm() {
  const { profile, updateProfile } = useProfile();
  const { user } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});

  const handleEdit = () => {
    setFormData({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      dob: profile?.dob || "",
      language: profile?.language || "English",
      preferred_units: profile?.preferred_units || "Metric",
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
      toast.success("Profile updated successfully.");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    }
  };

  if (!profile) return null;

  return (
    <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm dark:bg-card">
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf7ee] text-[#168447]">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Personal Information</h2>
            <p className="text-xs text-muted-foreground">Update your basic details and account information.</p>
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
          <div className="relative h-24 w-24 shrink-0">
            <img
              src={profile.profile_photo || "https://images.unsplash.com/photo-1595822363717-3843e93bd8f0?w=200&h=200&fit=crop"}
              alt="Profile"
              className="h-full w-full rounded-full object-cover border-4 border-white shadow-sm"
            />
            <button className="absolute bottom-0 right-0 rounded-full bg-[#168447] p-1.5 text-white shadow-sm cursor-pointer">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid flex-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Full Name</p>
              <p className="font-semibold text-foreground">{profile.full_name || "Not set"}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Email Address</p>
              <p className="font-semibold text-foreground">{user?.email}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Phone Number</p>
              <p className="font-semibold text-foreground">{profile.phone || "Not set"}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Account Type</p>
              <p className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                👑 Premium Farmer
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Member Since</p>
              <p className="font-semibold text-foreground">Jan 2025</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Date of Birth</p>
              <p className="font-semibold text-foreground">{profile.dob || "Not set"}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Preferred Units</p>
              <p className="font-semibold text-foreground">{profile.preferred_units || "Metric (kg, hectare)"}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
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
