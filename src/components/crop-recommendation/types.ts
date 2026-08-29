import { type StaticImageData } from "next/image";

export type Season = "Kharif" | "Rabi" | "Zaid" | "Whole Year";

export interface FieldConditionState {
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  soilPh: number;
  season: Season;
  temperature: number; // in °C
  humidity: number; // in %
  rainfall: number; // in mm
  locationName: string;
  latitude?: number;
  longitude?: number;
  isLiveLocation: boolean;
  lastUpdatedText: string;
  farmArea: number; // in Acres or Hectares
}

export type SuitabilityLevel =
  "Highly Suitable" | "Suitable" | "Moderately Suitable" | "Low Suitability";

export interface CropProfitabilityData {
  expectedYieldValue: number; // quintals/ha or tons/ha
  expectedYieldUnit: string;
  marketPricePerQuintal: number; // in INR
  estimatedCostPerHectare: number; // in INR
  expectedRevenuePerHectare: number; // in INR
  expectedProfitPerHectare: number; // in INR
  totalRevenue: number; // scaled by farm area
  totalCost: number; // scaled by farm area
  totalProfit: number; // scaled by farm area
  roiPercentage: number; // %
}

export interface CropRiskData {
  overallRisk: number; // 0 - 100
  riskLevel: "Low" | "Moderate" | "High";
  weatherRisk: number;
  waterRisk: number;
  diseaseRisk: number;
  marketRisk: number;
  yieldRisk: number;
  mainRiskFactors: string[];
}

export interface CropRecommendationItem {
  id: string;
  name: string;
  hindiName?: string;
  suitability: SuitabilityLevel;
  badgeVariant: "high" | "suitable" | "moderate" | "low";
  expectedYield: string;
  matchScore: number;
  image: StaticImageData | string;
  reason: string;
  waterNeed?: string;
  growingPeriod?: string;
  profitPotential?: string;
  riskLevel?: "Low" | "Moderate" | "High";
  summary?: string;
  profitDots: { filled: number; total: number; color: "green" | "amber" };
  profitability?: CropProfitabilityData;
  risk?: CropRiskData;
  rankingScore?: number;
  soilMatchScore?: number;
  weatherFitScore?: number;
  seasonalFitScore?: number;
}

export interface RecommendationInsights {
  soilMatch: number;
  soilMatchLabel: string;
  weatherFit: number;
  weatherFitLabel: string;
  seasonalFit: number;
  seasonalFitLabel: string;
  marketDemand: "High" | "Medium" | "Moderate";
  marketDemandLabel: string;
  profitPotential: "High" | "Medium" | "Moderate";
  profitPotentialLabel: string;
  overallSuitability: number;
  aiInsight: string;
}

export interface RecommendationHistoryItem {
  id: string;
  createdAt: string;
  location: string;
  farmArea: number;
  season: Season;
  soilInfo: {
    n: number;
    p: number;
    k: number;
    ph: number;
  };
  weatherInfo: {
    temp: number;
    humidity: number;
    rainfall: number;
  };
  topCrop: string;
  suitability: number;
  crops: Array<{
    name: string;
    suitability: number;
    expectedYield: string;
    profitPotential: string;
    riskLevel: string;
  }>;
}

export interface RecommendationFeedback {
  recommendationId?: string;
  isHelpful: boolean;
  reason?: string;
  cropName?: string;
  createdAt?: string;
}
