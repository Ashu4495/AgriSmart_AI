"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bot,
  Check,
  ChevronDown,
  ClipboardList,
  CloudSun,
  Crown,
  FlaskConical,
  Globe,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sprout,
  Sun,
  TrendingUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccount } from "@/components/landing/user-controls";
import { useTheme } from "@/lib/theme";
import { LANGUAGES, useLanguage } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import emblemAsset from "@/assets/agrismart-emblem.png.asset.json";
import sidebarLandscape from "@/assets/sidebar-landscape.jpg";
import farmerRamSingh from "@/assets/farmer-ram-singh.jpg";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NEW_SIDEBAR_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "crop-intelligence",
    label: "Crop Intelligence",
    href: "/crop-intelligence",
    icon: Sprout,
  },
  {
    id: "weather-climate",
    label: "Weather & Climate",
    href: "/weather-climate",
    icon: CloudSun,
  },
  {
    id: "soil-crop-health",
    label: "Soil & Crop Health",
    href: "/soil-crop-health",
    icon: FlaskConical,
  },
  {
    id: "farm-planning",
    label: "Farm Planning",
    href: "/farm-planning",
    icon: ClipboardList,
  },
  {
    id: "market-finance",
    label: "Market & Finance",
    href: "/market-finance",
    icon: TrendingUp,
  },
  {
    id: "government-resources",
    label: "Government & Resources",
    href: "/government-resources",
    icon: Landmark,
  },
  {
    id: "ai-assistant",
    label: "AI Assistant",
    href: "/ai-assistant",
    icon: Bot,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

function SidebarNav({
  onNavigate,
  onSignOut,
}: {
  onNavigate: () => void;
  onSignOut: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 px-3" aria-label="Main Navigation">
      {NEW_SIDEBAR_ITEMS.map((item) => {
        const isExactActive = pathname === item.href;
        const isChildActive =
          pathname.startsWith(item.href + "/") ||
          (item.id === "crop-intelligence" &&
            pathname.startsWith("/crop-recommendation")) ||
          (item.id === "settings" && pathname.startsWith("/profile"));
        const isActive = isExactActive || isChildActive;

        const IconComponent = item.icon;

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex min-h-[44px] items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer",
              isActive
                ? "bg-[#168447] font-semibold text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/20"
                : "text-emerald-100/75 hover:bg-white/10 hover:text-white",
            )}
          >
            <IconComponent
              className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                isActive
                  ? "text-white"
                  : "text-emerald-300/80 group-hover:text-white",
              )}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}

      {/* 10. Logout Navigation Item */}
      <div className="pt-2">
        <div className="my-2 border-t border-emerald-900/40" />
        <button
          type="button"
          onClick={() => {
            onNavigate();
            onSignOut();
          }}
          className="flex min-h-[44px] w-full items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-400 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-300 cursor-pointer"
        >
          <LogOut className="h-5 w-5 shrink-0 text-rose-400" />
          <span className="truncate">Logout</span>
        </button>
      </div>
    </nav>
  );
}

function SidebarExtras() {
  return (
    <div className="space-y-3 p-3 pt-2">
      {/* Upgrade to Pro Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0f3423] p-4 text-forest-foreground border border-emerald-500/20 shadow-md">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-400/20 text-amber-400">
            <Crown className="h-3.5 w-3.5" />
          </div>
          <span className="font-display text-xs font-bold text-white tracking-tight">
            Upgrade to Pro
          </span>
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-emerald-100/75">
          Get advanced weather alerts, climate risk insights and priority
          support.
        </p>

        <Link
          href="/ai-assistant"
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#168447] px-3 py-2 text-xs font-bold text-white shadow-sm transition-transform hover:scale-[1.02] hover:bg-[#14743e]"
        >
          <span>Upgrade Now →</span>
        </Link>
      </div>

      {/* Landscape Illustration at Sidebar Bottom */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/10 shadow-sm">
        <img
          src={sidebarLandscape.src}
          alt="Agricultural farm landscape"
          loading="lazy"
          className="h-28 w-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081f15] via-[#081f15]/20 to-transparent" />
      </div>
    </div>
  );
}

const ROUTE_HEADER_TITLES: { prefix: string; title: string }[] = [
  { prefix: "/crop-intelligence", title: "Crop Intelligence" },
  { prefix: "/crop-recommendation", title: "Crop Intelligence" },
  { prefix: "/weather-climate", title: "Weather & Climate" },
  { prefix: "/soil-crop-health", title: "Soil & Crop Health" },
  { prefix: "/farm-planning", title: "Farm Planning" },
  { prefix: "/market-finance", title: "Market & Finance" },
  { prefix: "/government-resources", title: "Government & Resources" },
  { prefix: "/ai-assistant", title: "AI Assistant" },
  { prefix: "/settings", title: "Settings" },
  { prefix: "/profile", title: "Settings" },
];

function getHeaderTitle(pathname: string): string {
  return (
    ROUTE_HEADER_TITLES.find((route) => pathname.startsWith(route.prefix))
      ?.title ?? "Dashboard"
  );
}

export function DashboardShell({
  children,
  headerTitle,
  headerSubtitle,
  selectedLocation,
  onLocationChange,
}: {
  children: ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  selectedLocation?: string;
  onLocationChange?: (loc: string) => void;
}) {
  const pathname = usePathname();
  const { user, displayName, avatarUrl, handleSignOut } = useAccount();
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, setLang } = useLanguage();

  const [navOpen, setNavOpen] = useState(false);
  const closeNav = () => setNavOpen(false);

  const farmerName = displayName || "Ram Singh";
  const farmerAvatar = avatarUrl || farmerRamSingh.src;
  const resolvedTitle = headerTitle || getHeaderTitle(pathname);

  return (
    <div className="flex min-h-screen bg-[#f8faf9] font-sans text-foreground antialiased dark:bg-[#0c1410]">
      {navOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeNav}
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#081f15] text-forest-foreground transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 border-r border-emerald-950/40",
          navOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Branding */}
        <div className="flex items-center justify-between gap-2 px-5 pb-3 pt-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5"
            onClick={closeNav}
          >
            <img
              src={emblemAsset.url}
              alt="AgriSmart AI logo"
              width={38}
              height={38}
              className="h-9 w-9 shrink-0 object-contain drop-shadow"
            />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-base font-extrabold tracking-tight text-white">
                AgriSmart <span className="text-[#22c55e]">AI</span>
              </span>
              <span className="text-[10px] font-medium text-emerald-200/70">
                Smart Farming, Better Future
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={closeNav}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-100/70 hover:bg-white/10 lg:hidden cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Items + Extras (Scrollable) */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-4 scrollbar-thin">
          <SidebarNav onNavigate={closeNav} onSignOut={handleSignOut} />
          <SidebarExtras />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-40 border-b border-border/80 bg-white/95 backdrop-blur-md dark:bg-[#0e1713]/90">
          <div className="flex h-18 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            {/* Left Header Title / Hamburger */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setNavOpen(true)}
                aria-label="Open menu"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-foreground/80 transition-colors hover:bg-accent lg:hidden cursor-pointer"
              >
                <Menu className="h-4.5 w-4.5" />
              </button>

              <div className="flex flex-col justify-center">
                <h1 className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {resolvedTitle}
                </h1>
                {headerSubtitle && (
                  <p className="hidden text-xs text-muted-foreground sm:block">
                    {headerSubtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Right Header: Theme Toggle + Language Selector + Notification Bell + Farmer Avatar */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                className="flex h-9.5 w-9.5 items-center justify-center rounded-full border border-border/80 bg-white text-foreground/80 transition-colors hover:bg-accent hover:text-foreground dark:bg-card cursor-pointer"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-9.5 items-center gap-1.5 rounded-full border border-border/80 bg-white px-3 text-xs font-semibold text-foreground shadow-2xs transition-colors hover:bg-accent dark:bg-card cursor-pointer">
                  <Globe className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{LANGUAGES.find((l) => l.code === lang)?.native}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5 shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {LANGUAGES.map((l) => (
                    <DropdownMenuItem
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className="flex items-center justify-between gap-4 text-xs font-semibold cursor-pointer"
                    >
                      <span>{l.native}</span>
                      {lang === l.code && (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notification Bell with red badge '3' */}
              <Link
                href="/weather-climate#alerts"
                aria-label="Alerts"
                className="relative flex h-9.5 w-9.5 items-center justify-center rounded-full border border-border/80 bg-white text-foreground/80 transition-colors hover:bg-accent dark:bg-card"
              >
                <Bell className="h-4.5 w-4.5 text-foreground/75" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-2xs">
                  3
                </span>
              </Link>

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full border border-border/80 bg-white p-1 pr-3 shadow-2xs transition-shadow hover:ring-2 hover:ring-emerald-500/20 dark:bg-card cursor-pointer">
                  <img
                    src={farmerAvatar}
                    alt={farmerName}
                    className="h-8.5 w-8.5 rounded-full object-cover ring-1 ring-emerald-500/40"
                  />
                  <div className="hidden flex-col items-start leading-tight text-left sm:flex">
                    <span className="max-w-28 truncate text-xs font-bold text-foreground">
                      {farmerName}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      Premium Farmer
                    </span>
                  </div>
                  <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2 border-b">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {farmerName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.email || "farmer@agrismart.ai"}
                    </p>
                  </div>
                  <DropdownMenuItem
                    asChild
                    className="gap-2 text-xs cursor-pointer"
                  >
                    <Link href="/settings">
                      <Settings className="h-4 w-4" />
                      Settings & Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="mx-auto w-full max-w-[1540px] flex-1 p-4 sm:p-6 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
