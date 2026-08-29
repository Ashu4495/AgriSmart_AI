import fs from "fs";
import path from "path";

export interface KnowledgeResource {
  id: string;
  title: string;
  category: "Best Practice" | "Crop Guide" | "Video" | "Blog" | "Success Story" | string;
  crop: string;
  farming_type?: string;
  state: string;
  description: string;
  read_time: string;
  is_video: boolean;
  image: string;
  resource_url: string;
  source: string;
  tags?: string[];
  categoryBg?: string;
  relevanceScore?: number;
  relevanceReasons?: string[];
}

export interface KnowledgeFilterParams {
  category?: string;
  query?: string;
  state?: string;
  crop?: string;
  farmingType?: string;
}

/**
 * Returns category badge color based on category name
 */
export function getCategoryBadgeClass(category: string): {
  bgClass: string;
  textClass: string;
} {
  const catLower = (category || "").toLowerCase();
  if (catLower.includes("best") || catLower.includes("practice")) {
    return {
      bgClass: "bg-[#168447]",
      textClass: "text-white",
    };
  }
  if (catLower.includes("crop") || catLower.includes("guide")) {
    return {
      bgClass: "bg-[#d97706]",
      textClass: "text-white",
    };
  }
  if (catLower.includes("video")) {
    return {
      bgClass: "bg-[#9333ea]",
      textClass: "text-white",
    };
  }
  if (catLower.includes("story") || catLower.includes("success")) {
    return {
      bgClass: "bg-[#0284c7]",
      textClass: "text-white",
    };
  }
  if (catLower.includes("blog") || catLower.includes("article")) {
    return {
      bgClass: "bg-[#475569]",
      textClass: "text-white",
    };
  }
  return {
    bgClass: "bg-[#168447]",
    textClass: "text-white",
  };
}

/**
 * Reads knowledge.json from Government scheme/data
 */
export function getRawKnowledgeResources(): KnowledgeResource[] {
  try {
    const filePath = path.join(process.cwd(), "Government scheme", "data", "knowledge.json");
    if (!fs.existsSync(filePath)) {
      console.warn("[Knowledge Service] knowledge.json not found at:", filePath);
      return [];
    }

    const rawData = fs.readFileSync(filePath, "utf-8");
    const parsed: KnowledgeResource[] = JSON.parse(rawData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("[Knowledge Service] Failed to read knowledge.json:", error);
    return [];
  }
}

/**
 * Filters and prioritizes knowledge resources based on farmer profile
 * Step 5 Requirement 8: If farmer has selected crop/state/farming type, prioritize relevant resources.
 */
export function filterAndRankKnowledge(
  resources: KnowledgeResource[],
  filters: KnowledgeFilterParams
): KnowledgeResource[] {
  const selectedCat = (filters.category || "all").trim().toLowerCase();
  const searchQuery = (filters.query || "").trim().toLowerCase();
  const selectedState = (filters.state || "").trim().toLowerCase();
  const selectedCrop = (filters.crop || "").trim().toLowerCase();
  const selectedFarmingType = (filters.farmingType || "").trim().toLowerCase();

  const results: KnowledgeResource[] = [];

  for (const item of resources) {
    const itemCatLower = item.category.toLowerCase();

    // 1. Category Filter
    if (selectedCat && selectedCat !== "all") {
      let matchesCat = false;
      if (
        (selectedCat.includes("practice") && itemCatLower.includes("practice")) ||
        (selectedCat.includes("guide") && itemCatLower.includes("guide")) ||
        (selectedCat.includes("video") && (item.is_video || itemCatLower.includes("video"))) ||
        (selectedCat.includes("blog") && (itemCatLower.includes("blog") || itemCatLower.includes("article"))) ||
        (selectedCat.includes("success") && (itemCatLower.includes("success") || itemCatLower.includes("story"))) ||
        itemCatLower === selectedCat
      ) {
        matchesCat = true;
      }

      if (!matchesCat) {
        continue;
      }
    }

    // 2. Search Query Filter (Title, description, crop, tags, source)
    if (searchQuery) {
      const corpus = `${item.title} ${item.description} ${item.crop} ${item.source} ${(item.tags || []).join(" ")}`.toLowerCase();
      if (!corpus.includes(searchQuery)) {
        continue;
      }
    }

    // 3. Relevance & Prioritization Score (Deterministic)
    let relevanceScore = 10;
    const reasons: string[] = [];

    const itemState = item.state.toLowerCase();
    if (selectedState && selectedState !== "all" && itemState === selectedState) {
      relevanceScore += 30;
      reasons.push(`Relevant for ${filters.state}`);
    } else if (itemState === "all") {
      relevanceScore += 15;
    }

    if (selectedFarmingType && item.farming_type) {
      const itemFarmingType = item.farming_type.toLowerCase();
      if (itemFarmingType.includes(selectedFarmingType) || selectedFarmingType.includes(itemFarmingType)) {
        relevanceScore += 25;
        reasons.push(`Matches ${filters.farmingType}`);
      }
    }

    if (selectedCrop && item.crop) {
      const itemCrop = item.crop.toLowerCase();
      if (itemCrop.includes(selectedCrop) || selectedCrop.includes(itemCrop)) {
        relevanceScore += 20;
        reasons.push(`Tailored for ${item.crop}`);
      }
    }

    const { bgClass } = getCategoryBadgeClass(item.category);

    results.push({
      ...item,
      categoryBg: bgClass,
      relevanceScore,
      relevanceReasons: reasons,
    });
  }

  // Sort by relevance score descending
  results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

  return results;
}
