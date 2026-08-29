import { useQuery } from "@tanstack/react-query";
import { insforge } from "@/lib/insforge";

/**
 * Reactive auth-user query. The single onAuthStateChange subscriber in
 * src/routes/__root.tsx invalidates this query on SIGNED_IN / USER_UPDATED
 * and clears it on SIGNED_OUT, so every consumer stays in sync.
 */
export function useAuth() {
  const { data, isPending } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const { data } = await insforge.auth.getCurrentUser();
      return data?.user || null;
    },
    enabled: typeof window !== "undefined",
    staleTime: 60_000,
  });
  return { user: data ?? null, isLoading: isPending };
}
