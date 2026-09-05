import { useState } from "react";
import { toast } from "sonner";
import { Shield, Lock } from "lucide-react";
import { insforge } from "@/lib/insforge";

export function SecurityForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match.");
    }
    
    setIsUpdating(true);
    
    try {
      // In a real flow, you might need to re-authenticate with the current password first.
      // But Supabase/InsForge allows updating password if the user is already logged in.
      const { error } = await (insforge.auth as any).updateUser({ password: newPassword });
      
      if (error) throw error;
      
      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm dark:bg-card">
      <div className="flex items-center gap-3 pb-4 border-b border-border/60">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-foreground">Security</h2>
          <p className="text-xs text-muted-foreground">Manage your account security and passwords.</p>
        </div>
      </div>

      <div className="mt-6 space-y-4 max-w-sm">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">Current Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border border-border/80 bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-red-500"
              placeholder="••••••••"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-border/80 bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-red-500"
              placeholder="New password"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-border/80 bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-red-500"
              placeholder="Confirm new password"
            />
          </div>
        </div>
        
        <div className="pt-2">
          <button
            onClick={handlePasswordChange}
            disabled={isUpdating}
            className="w-full rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 cursor-pointer disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
