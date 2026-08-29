"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocation } from "@/lib/location";
import { useAuth } from "@/lib/use-auth";
import { Loader2 } from "lucide-react";

function DashboardLocationSync() {
  const { fetchLiveLocation } = useLocation();
  const requestedRef = useRef(false);

  useEffect(() => {
    // Only request once per dashboard mount session
    if (!requestedRef.current) {
      requestedRef.current = true;
      // Triggers browser location permission prompt & updates location
      void fetchLiveLocation();
    }
  }, [fetchLiveLocation]);

  return null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      const nextUrl = pathname
        ? `/auth?next=${encodeURIComponent(pathname)}`
        : "/auth";
      router.replace(nextUrl);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Verifying AgriSmart AI Account...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <DashboardLocationSync />
      {children}
    </>
  );
}
