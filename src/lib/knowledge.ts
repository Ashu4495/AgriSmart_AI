import { insforge } from "@/lib/insforge";

export interface KnowledgeResource {
  id: string;
  title: string;
  description: string;
  resource_type: "PDF" | "WEBSITE" | "ARTICLE" | "VIDEO" | "GUIDE" | "GOVERNMENT_DOCUMENT" | "RESEARCH_PUBLICATION" | string;
  category: string;
  source_name: string;
  source_url: string;
  document_url?: string;
  thumbnail_url?: string;
  content?: string;
  state: string;
  scope: string;
  crop?: string;
  language: string;
  tags?: string[];
  author?: string;
  published_date?: string;
  updated_date?: string;
  page_count?: number;
  duration?: string;
  read_time?: string;
  image?: string;
  source?: string;
  resource_url?: string;
  is_video?: boolean;
  is_verified: boolean;
  is_featured: boolean;
  created_at: string;
  categoryBg?: string;
  relevanceScore?: number;
  relevanceReasons?: string[];
}

export interface KnowledgeFilterParams {
  category?: string;
  resourceType?: string;
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
    return { bgClass: "bg-[#168447]", textClass: "text-white" };
  }
  if (catLower.includes("crop") || catLower.includes("guide")) {
    return { bgClass: "bg-[#d97706]", textClass: "text-white" };
  }
  if (catLower.includes("video")) {
    return { bgClass: "bg-[#9333ea]", textClass: "text-white" };
  }
  if (catLower.includes("scheme") || catLower.includes("government")) {
    return { bgClass: "bg-[#2563eb]", textClass: "text-white" };
  }
  if (catLower.includes("story") || catLower.includes("success")) {
    return { bgClass: "bg-[#0284c7]", textClass: "text-white" };
  }
  if (catLower.includes("blog") || catLower.includes("article")) {
    return { bgClass: "bg-[#475569]", textClass: "text-white" };
  }
  return { bgClass: "bg-[#168447]", textClass: "text-white" };
}

/**
 * Fetches all resources from the InsForge database
 */
export async function fetchAllKnowledgeResources(): Promise<KnowledgeResource[]> {
  try {
    const { data, error } = await insforge.database
      .from("knowledge_resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Knowledge Service] Database error:", error);
      return [];
    }

    return data as KnowledgeResource[];
  } catch (error) {
    console.error("[Knowledge Service] Failed to fetch resources:", error);
    return [];
  }
}

/**
 * Filters and prioritizes knowledge resources based on farmer profile
 */
export function filterAndRankKnowledge(
  resources: KnowledgeResource[],
  filters: KnowledgeFilterParams
): KnowledgeResource[] {
  const selectedCat = (filters.category || "all").trim().toLowerCase();
  const selectedType = (filters.resourceType || "all").trim().toLowerCase();
  const searchQuery = (filters.query || "").trim().toLowerCase();
  const selectedState = (filters.state || "").trim().toLowerCase();
  const selectedCrop = (filters.crop || "").trim().toLowerCase();
  const selectedFarmingType = (filters.farmingType || "").trim().toLowerCase();

  const results: KnowledgeResource[] = [];

  for (const item of resources) {
    const itemCatLower = item.category.toLowerCase();
    const itemTypeLower = item.resource_type.toLowerCase();

    // 1. Category Filter
    if (selectedCat && selectedCat !== "all") {
      let matchesCat = false;
      if (
        (selectedCat.includes("practice") && itemCatLower.includes("practice")) ||
        (selectedCat.includes("guide") && itemCatLower.includes("guide")) ||
        (selectedCat.includes("video") && itemTypeLower === "video") ||
        (selectedCat.includes("scheme") && itemCatLower.includes("scheme")) ||
        itemCatLower === selectedCat
      ) {
        matchesCat = true;
      }
      if (!matchesCat) continue;
    }

    // 2. Resource Type Filter
    if (selectedType && selectedType !== "all") {
      if (itemTypeLower !== selectedType) {
        continue;
      }
    }

    // 3. Search Query Filter
    if (searchQuery) {
      const corpus = `${item.title} ${item.description || ""} ${item.crop || ""} ${item.source_name} ${(item.tags || []).join(" ")}`.toLowerCase();
      if (!corpus.includes(searchQuery)) {
        continue;
      }
    }

    // 4. Relevance & Prioritization Score
    let relevanceScore = 10;
    const reasons: string[] = [];

    const itemState = (item.state || "").toLowerCase();
    if (selectedState && selectedState !== "all" && itemState === selectedState) {
      relevanceScore += 30;
      reasons.push(`Relevant for ${filters.state}`);
    } else if (itemState === "pan_india" || item.scope === "PAN_INDIA") {
      relevanceScore += 15;
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
