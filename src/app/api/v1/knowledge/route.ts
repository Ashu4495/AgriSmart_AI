import { NextRequest, NextResponse } from "next/server";
import { fetchAllKnowledgeResources, filterAndRankKnowledge, type KnowledgeFilterParams } from "@/lib/knowledge";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category") || "All";
    const resourceType = searchParams.get("resourceType") || "All";
    const query = searchParams.get("query") || "";
    const state = searchParams.get("state") || "";
    const crop = searchParams.get("crop") || "";
    const farmingType = searchParams.get("farmingType") || "";

    const filters: KnowledgeFilterParams = {
      category,
      resourceType,
      query,
      state,
      crop,
      farmingType,
    };

    const allResources = await fetchAllKnowledgeResources();

    if (!allResources || allResources.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No knowledge resources found in the database.",
          data: [],
          total: 0,
        },
        { status: 500 }
      );
    }

    const filtered = filterAndRankKnowledge(allResources, filters);

    // Compute categories distribution
    const categoryCounts: Record<string, number> = {
      All: allResources.length,
      "Best Practices": allResources.filter(r => r.category.toLowerCase().includes("practice")).length,
      "Crop Guide": allResources.filter(r => r.category.toLowerCase().includes("crop") || r.category.toLowerCase().includes("guide")).length,
      "Government Schemes": allResources.filter(r => r.category.toLowerCase().includes("scheme")).length,
      "Videos": allResources.filter(r => r.resource_type === "VIDEO").length,
    };

    return NextResponse.json({
      success: true,
      total: filtered.length,
      counts: categoryCounts,
      filtersApplied: filters,
      data: filtered,
    });
  } catch (error) {
    console.error("[Knowledge API Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch knowledge resources.",
        data: [],
      },
      { status: 500 }
    );
  }
}
