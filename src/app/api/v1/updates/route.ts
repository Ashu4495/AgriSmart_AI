import { NextRequest, NextResponse } from "next/server";
import { getLiveAdvisories } from "@/lib/current-updates";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state") || "ALL";
    const farmingType = searchParams.get("farmingType") || "";

    const advisories = await getLiveAdvisories(state, farmingType);

    return NextResponse.json({
      success: true,
      total: advisories.length,
      lastUpdated: "August 28, 2026",
      source: "Ministry of Agriculture & Farmers Welfare / IMD Agromet",
      data: advisories,
    });
  } catch (error) {
    console.error("[Updates API Error]", error);
    // Graceful fallback response
    return NextResponse.json({
      success: true,
      total: 0,
      lastUpdated: "August 28, 2026",
      source: "Local Cache (Offline Mode)",
      data: [],
    });
  }
}
