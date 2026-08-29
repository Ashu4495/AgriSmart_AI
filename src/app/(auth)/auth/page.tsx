"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { insforge } from "@/lib/insforge";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { setSessionExpiry } from "@/lib/session";
import emblemAsset from "@/assets/agrismart-emblem.png.asset.json";
import authSide from "@/assets/auth-side.jpg";

type Mode = "signin" | "signup";
type View = "form" | "forgot";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

function AuthContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextTarget = searchParams.get("next") || "/dashboard";
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<Mode>("signin");
  const [view, setView] = useState<View>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState<"email" | "google" | null>(null);

  // Already signed in → redirect to target or dashboard
  useEffect(() => {
    void insforge.auth.getCurrentUser().then(({ data }) => {
      if (data?.user) router.replace(nextTarget);
    });
  }, [router, nextTarget]);

  const emailSchema = z.string().trim().email().max(255);
  const passwordSchema = z.string().min(6).max(72);
  const nameSchema = z.string().trim().min(1).max(100);

  function switchMode(next: Mode) {
    setMode(next);
    setErrors({});
    setServerError(null);
    setNotice(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    setNotice(null);

    const next: Record<string, string> = {};
    if (!emailSchema.safeParse(email).success) next["email"] = t.auth.errEmail;

    if (view === "forgot") {
      setErrors(next);
      if (Object.keys(next).length > 0) {
        toast.error(next["email"]!);
        return;
      }
      setLoading("email");
      const { error } = await insforge.auth.sendResetPasswordEmail({
        email: email.trim(),
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(null);
      if (error) {
        setServerError(error.message);
        toast.error(error.message);
        return;
      }
      setNotice(t.auth.resetSent);
      toast.success(t.auth.resetSent);
      return;
    }

    if (mode === "signup" && !nameSchema.safeParse(name).success)
      next["name"] = t.auth.errName;
    if (!passwordSchema.safeParse(password).success)
      next["password"] = t.auth.errPassword;
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error(Object.values(next)[0]!);
      return;
    }

    setLoading("email");
    if (mode === "signin") {
      const { data, error } = await insforge.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      setLoading(null);
      if (error) {
        setServerError(error.message);
        toast.error(error.message);
        return;
      }
      setSessionExpiry();
      toast.success(t.auth.signIn);
      if (data?.user) {
        queryClient.setQueryData(["auth-user"], data.user);
      }
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      router.replace(nextTarget);
    } else {
      // 1. Sign up user
      const { data, error } = await insforge.auth.signUp({
        email: email.trim(),
        password,
        name: name.trim(),
      });

      if (error) {
        setLoading(null);
        setServerError(error.message);
        toast.error(error.message);
        return;
      }

      setSessionExpiry();

      // If already logged in from signup
      if (data?.user && data?.accessToken) {
        queryClient.setQueryData(["auth-user"], data.user);
        await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
        setLoading(null);
        toast.success(t.auth.signUp || "Welcome to AgriSmart AI!");
        router.replace(nextTarget);
        return;
      }

      // Otherwise automatically sign in directly
      const signInRes = await insforge.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      setLoading(null);

      if (signInRes.error) {
        setServerError(signInRes.error.message);
        toast.error(signInRes.error.message);
        return;
      }

      setSessionExpiry();
      const activeUser = signInRes.data?.user || data?.user;
      if (activeUser) {
        queryClient.setQueryData(["auth-user"], activeUser);
      }
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });

      toast.success(t.auth.signUp || "Welcome to AgriSmart AI!");
      router.replace(nextTarget);
    }
  }

  async function handleGoogle() {
    setServerError(null);
    setLoading("google");
    try {
      setSessionExpiry();
      const { data, error } = await insforge.auth.signInWithOAuth("google", {
        redirectTo: `${window.location.origin}${nextTarget.startsWith("/") ? nextTarget : "/dashboard"}`,
      });
      if (error) {
        setLoading(null);
        setServerError(error.message);
        toast.error(error.message);
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      setLoading(null);
      router.replace(nextTarget);
    } catch {
      setLoading(null);
      setServerError(t.auth.errGeneric);
      toast.error(t.auth.errGeneric);
    }
  }

  const inputClass =
    "h-11 w-full rounded-lg border bg-background pl-10 pr-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-forest lg:flex lg:flex-col lg:justify-between">
        <img
          src={authSide.src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/35 to-forest/10" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-forest/70 to-transparent" />
        <div className="relative flex items-center gap-3 p-10">
          <img
            src={emblemAsset.url}
            alt="AgriSmart AI logo"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
          <span className="font-display text-2xl font-extrabold tracking-tight text-forest-foreground">
            AgriSmart <span className="text-leaf">AI</span>
          </span>
        </div>
        <div className="relative p-10 pb-14">
          <h2 className="font-display text-4xl font-bold leading-tight text-forest-foreground">
            {t.hero.titleA}
            <br />
            <span className="text-leaf">{t.hero.titleB}</span>
          </h2>
          <ul className="mt-8 space-y-3">
            {t.app.benefits.slice(0, 3).map((b) => (
              <li
                key={b}
                className="flex items-center gap-3 text-sm text-forest-foreground/85"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-leaf/20">
                  <Check className="h-3.5 w-3.5 text-leaf" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form column */}
      <div className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.auth.backHome}
          </Link>
          <img
            src={emblemAsset.url}
            alt="AgriSmart AI logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain lg:hidden"
          />
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-16 sm:px-6">
          <div className="w-full max-w-md">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              {view === "forgot"
                ? t.auth.forgot
                : mode === "signin"
                  ? t.auth.signInTitle
                  : t.auth.signUpTitle}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {view === "forgot"
                ? t.auth.resetSub
                : mode === "signin"
                  ? t.auth.signInSub
                  : t.auth.signUpSub}
            </p>

            {view === "form" && (
              <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border bg-muted/60 p-1">
                {(["signin", "signup"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-semibold transition-all cursor-pointer",
                      mode === m
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {m === "signin" ? t.auth.signIn : t.auth.signUp}
                  </button>
                ))}
              </div>
            )}

            {notice && (
              <p className="mt-4 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm text-primary">
                {notice}
              </p>
            )}

            {serverError && (
              <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                {serverError}
              </p>
            )}

            {view === "form" && (
              <>
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loading !== null}
                  className="mt-6 flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border bg-card text-sm font-semibold text-foreground transition-all hover:bg-accent disabled:opacity-60 cursor-pointer"
                >
                  {loading === "google" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <GoogleIcon className="h-4.5 w-4.5" />
                  )}
                  Google
                </button>

                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t.auth.or}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {view === "form" && mode === "signup" && (
                <div>
                  <label
                    htmlFor="auth-name"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {t.auth.name}
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="auth-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.auth.namePh}
                      autoComplete="name"
                      maxLength={100}
                      className={inputClass}
                    />
                  </div>
                  {errors["name"] && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors["name"]}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="auth-email"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  {t.auth.email}
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.auth.emailPh}
                    autoComplete="email"
                    maxLength={255}
                    className={inputClass}
                  />
                </div>
                {errors["email"] && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors["email"]}
                  </p>
                )}
              </div>

              {view === "form" && (
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="auth-password"
                      className="block text-sm font-medium text-foreground"
                    >
                      {t.auth.password}
                    </label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => {
                          setView("forgot");
                          setErrors({});
                          setServerError(null);
                          setNotice(null);
                        }}
                        className="text-xs font-medium text-primary hover:underline cursor-pointer"
                      >
                        {t.auth.forgot}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="auth-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.auth.passwordPh}
                      autoComplete={
                        mode === "signin" ? "current-password" : "new-password"
                      }
                      maxLength={72}
                      className={cn(inputClass, "pr-10")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors["password"] && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors["password"]}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading !== null}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60 cursor-pointer"
              >
                {loading === "email" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {view === "forgot"
                  ? t.auth.forgot
                  : mode === "signin"
                    ? t.auth.signIn
                    : t.auth.signUp}
              </button>

              {view === "forgot" && (
                <button
                  type="button"
                  onClick={() => {
                    setView("form");
                    setErrors({});
                    setServerError(null);
                    setNotice(null);
                  }}
                  className="w-full text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                >
                  {t.auth.signIn}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
