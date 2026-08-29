import type { Metadata } from "next";
import { CropRecommendationPage } from "@/components/crop-recommendation/CropRecommendationPage";
import { DashboardShell } from "@/components/dashboard/shell";

export const metadata: Metadata = {
  title: "Crop Recommendation — AgriSmart AI",
  description:
    "AI-powered crop recommendation based on real-time soil condition, weather, rainfall, and market trends.",
};

export default function CropRecommendationRoute() {
  return (
    <DashboardShell>
      <CropRecommendationPage />
    </DashboardShell>
  );
}
