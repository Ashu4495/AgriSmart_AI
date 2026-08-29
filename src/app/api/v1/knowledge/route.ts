import { NextRequest, NextResponse } from "next/server";
import { getRawKnowledgeResources, filterAndRankKnowledge, type KnowledgeFilterParams } from "@/lib/knowledge";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category") || "All";
    const query = searchParams.get("query") || "";
    const state = searchParams.get("state") || "";
    const crop = searchParams.get("crop") || "";
    const farmingType = searchParams.get("farmingType") || "";

    const filters: KnowledgeFilterParams = {
      category,
      query,
      state,
      crop,
      farmingType,
    };

    const allResources = getRawKnowledgeResources();

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
      Videos: allResources.filter(r => r.is_video || r.category.toLowerCase().includes("video")).length,
      Blogs: allResources.filter(r => r.category.toLowerCase().includes("blog") || r.category.toLowerCase().includes("article")).length,
      "Success Stories": allResources.filter(r => r.category.toLowerCase().includes("success") || r.category.toLowerCase().includes("story")).length,
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
