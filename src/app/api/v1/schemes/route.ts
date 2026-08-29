import { NextRequest, NextResponse } from "next/server";
import { getRawSchemes, matchAndRankSchemes, type SchemeFilterParams } from "@/lib/schemes";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const state = searchParams.get("state") || "Madhya Pradesh";
    const district = searchParams.get("district") || "";
    const farmingType = searchParams.get("farmingType") || "Crop Farming";
    const landHolding = searchParams.get("landHolding") || "2 - 5 Acres (Small)";
    const annualIncome = searchParams.get("annualIncome") || "₹1.5 - ₹3 Lakh";
    const age = searchParams.get("age") || "35";
    const interestsParam = searchParams.get("interests");
    const query = searchParams.get("query") || "";
    const showAllStates = searchParams.get("showAllStates") === "true";

    const interests = interestsParam
      ? interestsParam.split(",").map((i) => i.trim()).filter(Boolean)
      : [
          "Financial Assistance",
          "Crop Insurance",
        ];

    const filters: SchemeFilterParams = {
      state,
      district,
      farmingType,
      landHolding,
      annualIncome,
      age,
      interests,
      query,
      showAllStates,
    };

    const allSchemes = getRawSchemes();

    if (!allSchemes || allSchemes.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No scheme records available in the database.",
          data: [],
          total: 0,
        },
        { status: 500 }
      );
    }

    const rankedSchemes = matchAndRankSchemes(allSchemes, filters);

    // Group counts for metrics
    const centralCount = rankedSchemes.filter((s) => s.level.toLowerCase() === "central").length;
    const stateCount = rankedSchemes.filter((s) => s.level.toLowerCase() === "state").length;
    const eligibleCount = rankedSchemes.filter((s) => s.eligibilityStatus === "eligible").length;
    const possiblyEligibleCount = rankedSchemes.filter((s) => s.eligibilityStatus === "possibly_eligible").length;
    const notEligibleCount = rankedSchemes.filter((s) => s.eligibilityStatus === "not_eligible").length;

    return NextResponse.json({
      success: true,
      total: rankedSchemes.length,
      counts: {
        central: centralCount,
        state: stateCount,
        eligible: eligibleCount,
        possiblyEligible: possiblyEligibleCount,
        notEligible: notEligibleCount,
        allIndiaRawCount: allSchemes.length,
      },
      filtersApplied: {
        state,
        district,
        farmingType,
        landHolding,
        annualIncome,
        age,
        interests,
      },
      data: rankedSchemes,
      topRecommended: rankedSchemes.slice(0, 3),
    });
  } catch (error) {
    console.error("[Schemes API Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to query and rank government schemes.",
        data: [],
      },
      { status: 500 }
    );
  }
}
