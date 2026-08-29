"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { LanguageProvider } from "@/lib/i18n";
import { LocationProvider } from "@/lib/location";
import { insforge } from "@/lib/insforge";
import {
  clearSessionExpiry,
  getSessionExpiry,
  setSessionExpiry,
} from "@/lib/session";

function AuthSessionManager({ queryClient }: { queryClient: QueryClient }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const performAutoLogout = async () => {
      clearSessionExpiry();
      try {
        await insforge.auth.signOut();
      } catch {
        // Ignore network failure on sign out
      }
      queryClient.clear();
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      toast.warning(
        "Your session has expired after 2 hours. Please sign in again.",
      );

      // If user is currently on a protected or dashboard route, redirect to auth
      if (
        pathname?.startsWith("/dashboard") ||
        pathname?.startsWith("/crop-") ||
        pathname?.startsWith("/weather-") ||
        pathname?.startsWith("/soil-") ||
        pathname?.startsWith("/farm-") ||
        pathname?.startsWith("/market-") ||
        pathname?.startsWith("/government-") ||
        pathname?.startsWith("/ai-assistant") ||
        pathname?.startsWith("/settings") ||
        pathname?.startsWith("/profile")
      ) {
        router.replace("/auth");
      }
    };

    const checkSession = async () => {
      try {
        const { data } = await insforge.auth.getCurrentUser();
        const user = data?.user;

        if (!user) {
          clearSessionExpiry();
          if (timeoutId) clearTimeout(timeoutId);
          return;
        }

        let expiry = getSessionExpiry();
        if (!expiry) {
          // New active session detected; start 2-hour window
          expiry = setSessionExpiry();
        }

        const remaining = expiry - Date.now();
        if (remaining <= 0) {
          await performAutoLogout();
          return;
        }

        if (timeoutId) clearTimeout(timeoutId);
        // Safe setTimeout (capped at 2^31 - 1 ms)
        const safeDelay = Math.min(remaining, 2147483647);
        timeoutId = setTimeout(() => {
          void performAutoLogout();
        }, safeDelay);
      } catch {
        // Ignore transient auth check error
      }
    };

    // Check immediately on mount
    void checkSession();

    // Check periodically (every 15s) in case device was sleeping
    const intervalId = setInterval(() => {
      void checkSession();
    }, 15000);

    // Check when user returns to tab / focuses window
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        void checkSession();
      }
    };
    window.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);

    // Sync across browser tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "agrismart_session_expires_at") {
        void checkSession();
      }
    };
    window.addEventListener("storage", handleStorage);

    // Listen to SDK auth state changes
    const unsubscribe = insforge.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      void checkSession();
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      clearInterval(intervalId);
      window.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      window.removeEventListener("storage", handleStorage);
      unsubscribe();
    };
  }, [queryClient, router, pathname]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem("agrismart-theme");
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // Ignore localStorage access restrictions
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionManager queryClient={queryClient} />
      <LanguageProvider>
        <LocationProvider>{children}</LocationProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
