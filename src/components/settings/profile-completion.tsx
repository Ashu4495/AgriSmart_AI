import { Trophy, CheckCircle2, Circle } from "lucide-react";
import { useProfile } from "@/lib/use-profile";

export function ProfileCompletion() {
  const { profile } = useProfile();

  if (!profile) return null;

  // Calculate completion
  const steps = [
    { id: "basic", label: "Basic Information", isComplete: !!(profile.full_name && profile.phone && profile.dob) },
    { id: "farm", label: "Farm Details", isComplete: !!(profile.farm_name && profile.farm_size_acres && profile.primary_crop) },
    { id: "location", label: "Location", isComplete: !!(profile.state && profile.district && profile.village) },
    { id: "preferences", label: "Preferences", isComplete: !!(profile.language && profile.preferred_units) },
    { id: "photo", label: "Add Profile Photo", isComplete: !!profile.profile_photo },
  ];

  const completedCount = steps.filter(s => s.isComplete).length;
  const percentage = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm dark:bg-card h-full">
      <h3 className="font-bold text-foreground mb-6">Profile Completion</h3>
      
      <div className="flex items-center gap-5 mb-8">
        <div className="relative h-20 w-20 shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="3.8"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-emerald-500 transition-all duration-1000 ease-out"
              strokeWidth="3.8"
              strokeDasharray={`${percentage}, 100`}
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-foreground">{percentage}%</span>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-foreground">{percentage === 100 ? "All set!" : "Great progress!"}</h4>
          <p className="text-xs text-muted-foreground mt-1">Complete your profile to get more accurate recommendations.</p>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step.isComplete ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-gray-300 shrink-0" />
              )}
              <span className={`text-sm ${step.isComplete ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${step.isComplete ? 'text-emerald-600' : 'text-gray-400'}`}>
              {step.isComplete ? 'Completed' : 'Pending'}
            </span>
          </div>
        ))}
      </div>

      {percentage < 100 && (
        <div className="mt-8 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-4 border border-amber-100 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-900/30">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-white p-1.5 text-amber-500 shadow-sm dark:bg-card">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-900 dark:text-amber-500">Unlock Better Recommendations</h5>
              <p className="text-[10px] font-medium text-amber-800/80 mt-1 dark:text-amber-400/80">Complete your profile to get personalized crop advice, weather alerts and more.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
