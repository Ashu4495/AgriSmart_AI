"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Loader2,
  LogOut,
  Mail,
  Pencil,
  Phone,
  User,
  X,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { insforge } from "@/lib/insforge";
import { useAuth } from "@/lib/use-auth";
import { useLanguage } from "@/lib/i18n";
import { clearSessionExpiry } from "@/lib/session";
import emblemAsset from "@/assets/agrismart-emblem.png.asset.json";

const nameSchema = z.string().trim().min(1).max(100);
const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[\d\s()-]{7,18}$/);

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = user?.id;

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/auth");
    }
  }, [user, isAuthLoading, router]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await insforge.database
        .from("farm_profiles")
        .select("full_name, phone, state, district, village, farm_size_acres, primary_crop, soil_type, irrigation_source")
        .eq("user_id", userId!)
        .maybeSingle();
      return data;
    },
  });

  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setNameInput(
        profile.full_name ||
          (user?.metadata?.["full_name"] as string | undefined) ||
          "",
      );
      setPhoneInput(profile.phone || "");
    }
  }, [profile, user]);

  const displayName =
    profile?.full_name ??
    (user?.metadata?.["full_name"] as string | undefined) ??
    user?.email?.split("@")[0] ??
    "";
  const avatarUrl =
    (user?.metadata?.["avatar_url"] as string | undefined) ??
    null;
  const initials = displayName.trim().charAt(0).toUpperCase() || "U";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  function startEdit() {
    setNameInput(
      profile?.full_name ??
        (user?.metadata?.["full_name"] as string | undefined) ??
        "",
    );
    setPhoneInput(profile?.phone ?? "");
    setFieldErrors({});
    setEditing(true);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setFieldErrors({});

    const errs: Record<string, string> = {};
    if (!nameSchema.safeParse(nameInput).success) errs["name"] = t.auth.errName;
    if (phoneInput && !phoneSchema.safeParse(phoneInput).success)
      errs["phone"] = "Please enter a valid phone number";
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      toast.error(Object.values(errs)[0]!);
      return;
    }

    setSaving(true);
    const { error } = await insforge.database.from("farm_profiles").upsert(
      [
        {
          user_id: userId,
          full_name: nameInput.trim(),
          phone: phoneInput.trim() || null,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: "user_id" },
    );
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    setEditing(false);
    toast.success(t.auth.profileUpdated);
  }

  async function handleSignOut() {
    clearSessionExpiry();
    await queryClient.cancelQueries();
    queryClient.clear();
    await insforge.auth.signOut();
    router.replace("/");
  }

  const rows = [
    { icon: Mail, label: t.auth.email, value: user?.email ?? "—" },
    {
      icon: Phone,
      label: t.auth.phone,
      value: profile?.phone || t.auth.notSet,
    },
    {
      icon: Calendar,
      label: t.auth.memberSince,
      value: memberSince ?? "—",
    },
  ];

  const inputClass =
    "h-11 w-full rounded-lg border bg-background pl-10 pr-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="min-h-screen bg-background">
      {/* Header band */}
      <div className="relative overflow-hidden bg-forest">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-leaf/15 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-harvest/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-foreground/80 transition-colors hover:text-forest-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.auth.backHome}
          </Link>
          <span className="flex items-center gap-2">
            <img
              src={emblemAsset.url}
              alt="AgriSmart AI logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="font-display text-lg font-extrabold text-forest-foreground">
              AgriSmart <span className="text-leaf">AI</span>
            </span>
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <div className="-mt-1 rounded-2xl border bg-card p-6 shadow-lg shadow-foreground/5 sm:p-8">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-full object-cover ring-4 ring-primary/20"
                  />
                ) : (
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary font-display text-3xl font-bold text-primary-foreground ring-4 ring-primary/20">
                    {initials}
                  </span>
                )}
                <div className="mt-4 sm:mt-0">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {displayName || t.auth.profile}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>

              {editing ? (
                <form
                  onSubmit={handleSave}
                  className="mt-8 space-y-4"
                  noValidate
                >
                  <div>
                    <label
                      htmlFor="profile-name"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      {t.auth.name}
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="profile-name"
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder={t.auth.namePh}
                        autoComplete="name"
                        maxLength={100}
                        className={inputClass}
                      />
                    </div>
                    {fieldErrors["name"] && (
                      <p className="mt-1 text-xs text-destructive">
                        {fieldErrors["name"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="profile-phone"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      {t.auth.phone}
                    </label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="profile-phone"
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder={t.auth.phonePh}
                        autoComplete="tel"
                        maxLength={18}
                        className={inputClass}
                      />
                    </div>
                    {fieldErrors["phone"] && (
                      <p className="mt-1 text-xs text-destructive">
                        {fieldErrors["phone"]}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
                    >
                      {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                      {t.auth.save}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      disabled={saving}
                      className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:opacity-60"
                    >
                      <X className="h-4 w-4" />
                      {t.auth.cancel}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mt-8 divide-y rounded-xl border">
                    {rows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center gap-4 px-4 py-3.5"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <row.icon className="h-4 w-4 text-primary" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {row.label}
                          </p>
                          <p className="truncate text-sm font-semibold text-foreground">
                            {row.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={startEdit}
                    className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                  >
                    <Pencil className="h-4 w-4" />
                    {t.auth.editProfile}
                  </button>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-destructive/30 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    {t.auth.signOut}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
