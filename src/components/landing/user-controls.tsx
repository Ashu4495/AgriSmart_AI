"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BadgeCheck,
  Check,
  ChevronDown,
  Globe,
  LayoutDashboard,
  Loader2,
  LogOut,
  MailWarning,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LANGUAGES, useLanguage } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/use-auth";
import { insforge } from "@/lib/insforge";
import { clearSessionExpiry } from "@/lib/session";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Shared account state + actions used by the desktop controls and mobile menu. */
export function useAccount() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [resending, setResending] = useState(false);

  const displayName =
    (user?.metadata?.["full_name"] as string | undefined) ??
    user?.email?.split("@")[0] ??
    "";
  const avatarUrl =
    (user?.metadata?.["avatar_url"] as string | undefined) ?? null;
  const initials = displayName.trim().charAt(0).toUpperCase() || "U";
  const emailVerified = Boolean(user?.emailVerified);

  async function handleSignOut() {
    clearSessionExpiry();
    await queryClient.cancelQueries();
    queryClient.clear();
    await insforge.auth.signOut();
    router.replace("/");
  }

  async function handleResendVerification() {
    if (!user?.email) return;
    setResending(true);
    const { error } = await insforge.auth.resendVerificationEmail({
      email: user.email,
    });
    setResending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t.auth.emailResent);
  }

  return {
    user,
    displayName,
    avatarUrl,
    initials,
    emailVerified,
    resending,
    handleSignOut,
    handleResendVerification,
  };
}

/** Theme toggle + language picker + account menu (or Sign In). */
export function UserControls() {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const {
    user,
    displayName,
    avatarUrl,
    initials,
    emailVerified,
    handleSignOut,
  } = useAccount();

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
        className="flex h-9 w-9 items-center justify-center rounded-lg border text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger className="hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground md:flex">
          <Globe className="h-4 w-4" />
          {LANGUAGES.find((l) => l.code === lang)?.native}
          <ChevronDown className="h-3.5 w-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {LANGUAGES.map((l) => (
            <DropdownMenuItem
              key={l.code}
              onClick={() => setLang(l.code)}
              className="flex items-center justify-between gap-4"
            >
              <span>{l.native}</span>
              {lang === l.code && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {user ? (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Account menu"
              className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground transition-shadow hover:ring-4 hover:ring-primary/25"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <div className="px-2 py-2">
                <p className="truncate text-sm font-semibold text-foreground">
                  {displayName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
                <p
                  className={cn(
                    "mt-1.5 flex items-center gap-1 text-[11px] font-semibold",
                    emailVerified
                      ? "text-leaf"
                      : "text-amber-600 dark:text-amber-400",
                  )}
                >
                  {emailVerified ? (
                    <>
                      <BadgeCheck className="h-3.5 w-3.5" />
                      {t.auth.verifiedBadge}
                    </>
                  ) : (
                    <>
                      <MailWarning className="h-3.5 w-3.5" />
                      {t.auth.verifyTitle}
                    </>
                  )}
                </p>
              </div>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard")}
                className="gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                {t.nav.dashboard}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                {t.auth.profile}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="gap-2 text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                {t.auth.signOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Link
          href="/auth"
          className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
        >
          {t.auth.signIn}
        </Link>
      )}
    </>
  );
}
