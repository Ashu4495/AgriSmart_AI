import type { Metadata } from "next";
import { CropRecommendationPage } from "@/components/crop-recommendation/CropRecommendationPage";
import { DashboardShell } from "@/components/dashboard/shell";

export const metadata: Metadata = {
  title: "Crop Intelligence — AgriSmart AI",
  description:
    "AI-powered crop recommendation, ranking, profitability predictions, and suitability analysis.",
};

export default function CropIntelligenceRoute() {
  return (
    <DashboardShell>
      <CropRecommendationPage />
    </DashboardShell>
  );
}
