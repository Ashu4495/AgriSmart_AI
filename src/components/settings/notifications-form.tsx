import { toast } from "sonner";
import { Bell, CloudLightning, Sprout, TrendingUp, Landmark } from "lucide-react";
import { useProfile, ProfileData } from "@/lib/use-profile";

export function NotificationsForm() {
  const { profile, updateProfile } = useProfile();
  
  const handleToggle = async (key: string, currentValue: boolean) => {
    try {
      const currentNotifs = profile?.notifications_json || {};
      const newNotifs = { ...currentNotifs, [key]: !currentValue };
      
      await updateProfile({ notifications_json: newNotifs });
      toast.success("Notification preferences updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update notification preferences");
    }
  };

  if (!profile) return null;
  const notifs = profile.notifications_json || {
    weather: true,
    tasks: true,
    market: false,
    schemes: true
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm dark:bg-card">
      <div className="flex items-center gap-3 pb-4 border-b border-border/60">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf7ee] text-[#168447]">
          <Bell className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-foreground">Notifications</h2>
          <p className="text-xs text-muted-foreground">Manage your alerts and reminders.</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <ToggleRow 
          icon={<CloudLightning className="h-4 w-4 text-emerald-600" />}
          label="Weather Alerts" 
          active={notifs.weather !== false} 
          onToggle={() => handleToggle("weather", notifs.weather !== false)} 
        />
        <ToggleRow 
          icon={<Sprout className="h-4 w-4 text-emerald-600" />}
          label="Farming Task Reminders" 
          active={notifs.tasks !== false} 
          onToggle={() => handleToggle("tasks", notifs.tasks !== false)} 
        />
        <ToggleRow 
          icon={<TrendingUp className="h-4 w-4 text-emerald-600" />}
          label="Market Price Alerts" 
          active={notifs.market === true} 
          onToggle={() => handleToggle("market", notifs.market === true)} 
        />
        <ToggleRow 
          icon={<Landmark className="h-4 w-4 text-emerald-600" />}
          label="Government Scheme Alerts" 
          active={notifs.schemes !== false} 
          onToggle={() => handleToggle("schemes", notifs.schemes !== false)} 
        />
      </div>
    </div>
  );
}

function ToggleRow({ icon, label, active, onToggle }: { icon: React.ReactNode; label: string; active: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <button 
        onClick={onToggle}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${active ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'}`}
      >
        <span aria-hidden="true" className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${active ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
