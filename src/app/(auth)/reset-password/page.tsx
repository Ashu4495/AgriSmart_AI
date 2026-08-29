"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { insforge } from "@/lib/insforge";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import emblemAsset from "@/assets/agrismart-emblem.png.asset.json";

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [valid, setValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) setValid(true);
    const unsubscribe = insforge.auth.onAuthStateChange((event) => {
      // @ts-expect-error type
      if (event === "PASSWORD_RECOVERY") setValid(true);
    });
    // If no recovery token arrives shortly, the link is invalid/expired
    const timer = window.setTimeout(() => {
      setValid((v) => (v === null ? false : v));
    }, 2500);
    return () => {
      unsubscribe();
      window.clearTimeout(timer);
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!z.string().min(6).max(72).safeParse(password).success) {
      setError(t.auth.errPassword);
      toast.error(t.auth.errPassword);
      return;
    }
    setLoading(true);
    const { error: updateError } = await insforge.auth.resetPassword({
      newPassword: password,
      otp: "",
    });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      toast.error(updateError.message);
      return;
    }
    toast.success(t.auth.resetSuccessTitle);
    setDone(true);
    window.setTimeout(() => router.push("/auth"), 3000);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
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
          className="h-10 w-10 object-contain"
        />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          {valid === null ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !valid ? (
            <div className="rounded-2xl border bg-card p-8 text-center shadow-lg shadow-foreground/5">
              <h1 className="font-display text-2xl font-bold text-foreground">
                {t.auth.resetTitle}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t.auth.invalidReset}
              </p>
              <Link
                href="/auth"
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t.auth.signIn}
              </Link>
            </div>
          ) : done ? (
            <div className="rounded-2xl border bg-card p-8 text-center shadow-lg shadow-foreground/5">
              <span className="mx-auto flex h-16 w-16 animate-grow-in items-center justify-center rounded-full bg-primary/10">
                <Check className="h-8 w-8 text-primary" />
              </span>
              <h1 className="mt-5 font-display text-2xl font-bold text-foreground">
                {t.auth.resetSuccessTitle}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t.auth.resetSuccessSub}
              </p>
              <Link
                href="/auth"
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t.auth.backToSignIn}
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                {t.auth.resetTitle}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {t.auth.resetSub}
              </p>

              {error && (
                <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                  {error}
                </p>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-4"
                noValidate
              >
                <div>
                  <label
                    htmlFor="new-password"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {t.auth.newPassword}
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="new-password"
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.auth.passwordPh}
                      autoComplete="new-password"
                      maxLength={72}
                      className={cn(
                        "h-11 w-full rounded-lg border bg-background pl-10 pr-10 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShow((v) => !v)}
                      aria-label={show ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {show ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t.auth.updatePassword}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
