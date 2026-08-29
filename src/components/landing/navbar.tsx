"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANGUAGES, useLanguage } from "@/lib/i18n";
import emblemAsset from "@/assets/agrismart-emblem.png.asset.json";
import { UserControls, useAccount } from "./user-controls";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { user, displayName, handleSignOut } = useAccount();

  const NAV_LINKS = [
    { label: t.nav.home, href: "#home" },
    { label: t.nav.features, href: "#features" },
    { label: t.nav.how, href: "#how-it-works" },
    { label: t.nav.crops, href: "#crops" },
    { label: t.nav.schemes, href: "#schemes" },
    { label: t.nav.about, href: "#about" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-2.5">
          <img
            src={emblemAsset.url}
            alt="AgriSmart AI logo"
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 object-contain"
          />
          <span className="flex flex-col justify-center leading-none">
            <span className="font-display text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
              AgriSmart <span className="text-leaf">AI</span>
            </span>
            <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:block">
              Intelligent Farming Assistant
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm font-medium text-foreground/80 transition-colors hover:text-foreground",
                "after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-primary after:transition-all hover:after:w-full",
                i === 0 && "text-foreground after:w-full",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <UserControls />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t bg-background px-4 py-4 lg:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-3">
            {user ? (
              <div className="rounded-lg border px-3 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {displayName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      void handleSignOut();
                    }}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    {t.auth.signOut}
                  </button>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  {t.nav.dashboard}
                </Link>
              </div>
            ) : (
              <Link
                href="/auth"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t.auth.signIn}
              </Link>
            )}
          </div>

          <div className="mt-3 border-t pt-3">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.nav.language}
            </p>
            <div className="flex flex-wrap gap-2 px-3">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                    lang === l.code
                      ? "border-primary bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:bg-accent",
                  )}
                >
                  {l.native}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
