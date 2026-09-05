import { CreditCard, CheckCircle } from "lucide-react";

export function SubscriptionCard() {
  return (
    <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm dark:bg-card">
      <div className="flex items-center gap-3 pb-4 border-b border-border/60">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-foreground">Subscription</h2>
          <p className="text-xs text-muted-foreground">Manage your billing and plan details.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6 rounded-xl border border-border/60 bg-slate-50 p-5 dark:bg-card/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-foreground">Premium Farmer</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
              Active
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Your plan renews on <span className="font-semibold text-foreground">12 Jun 2027</span>.</p>
          
          <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Advanced AI Crop Disease Detection
            </li>
            <li className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Hyper-local Weather Alerts
            </li>
            <li className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Expert Market Price Forecasts
            </li>
          </ul>
        </div>
        
        <div className="shrink-0 text-center md:text-right w-full md:w-auto">
          <p className="text-2xl font-bold text-foreground mb-1">₹499<span className="text-sm font-medium text-muted-foreground">/year</span></p>
          <button className="w-full md:w-auto mt-2 rounded-lg border border-border/80 bg-white px-5 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors shadow-xs cursor-pointer">
            Manage Billing
          </button>
        </div>
      </div>
    </div>
  );
}
