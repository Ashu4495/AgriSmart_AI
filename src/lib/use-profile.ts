import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/use-auth";

export interface ProfileData {
  id?: string;
  user_id?: string;
  full_name?: string;
  phone?: string;
  dob?: string;
  language?: string;
  preferred_units?: string;
  profile_photo?: string;
  farm_name?: string;
  farming_type?: string;
  farm_size_acres?: number;
  years_experience?: number;
  primary_crop?: string;
  organic_farming?: boolean;
  soil_type?: string;
  irrigation_source?: string;
  state?: string;
  district?: string;
  village?: string;
  pin_code?: string;
  preferences_json?: any;
  notifications_json?: any;
}

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async (): Promise<ProfileData | null> => {
      if (!user?.id) return null;
      const res = await fetch(`/api/v1/settings/profile?userId=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      const result = await res.json();
      return result.data || null;
    },
    enabled: !!user?.id,
  });

  const mutation = useMutation({
    mutationFn: async (updates: Partial<ProfileData>) => {
      if (!user?.id) throw new Error("Not logged in");
      const res = await fetch(`/api/v1/settings/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...updates }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const result = await res.json();
      return result.data;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile", user?.id], updatedProfile);
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    updateProfile: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
