import fs from "fs";
import path from "path";
import { getSchemeLiveStatus, type LiveSchemeStatus } from "./current-updates";

export interface RawScheme {
  id: string;
  name: string;
  level: "Central" | "State" | string;
  states: string[];
  districts: string[];
  farming_types: string[];
  interests: string[];
  benefits: string;
  eligibility: string;
  documents_required: string[];
  application_url: string;
  source_url: string;
  active: boolean;
}

export type EligibilityStatus = "eligible" | "possibly_eligible" | "not_eligible";

export interface SchemeMatch extends RawScheme {
  matchScore: number;
  matchPercentage: number;
  matchBadgeText: string;
  eligibilityStatus: EligibilityStatus;
  statusBadge: {
    label: string;
    icon: "🟢" | "🟡" | "🔴";
    badgeText: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
  };
  whyConditions: string[];
  whySummary: string;
  recommendationReason: string;
  liveStatus: LiveSchemeStatus;
  category: "financial" | "equipment" | "insurance" | "irrigation" | "solar" | "soil" | "training" | "credit" | "other";
  iconType: "money" | "tractor" | "umbrella" | "droplet" | "sun" | "sprout" | "book" | "credit";
  iconBg: string;
  iconColor: string;
  badgeText: string;
}

export interface SchemeFilterParams {
  state?: string;
  district?: string;
  farmingType?: string;
  landHolding?: string;
  annualIncome?: string;
  age?: string;
  interests?: string[];
  query?: string;
  showAllStates?: boolean;
}

/**
 * Maps scheme interests & farming types to visual categories and icons
 */
export function categorizeScheme(scheme: RawScheme): {
  category: SchemeMatch["category"];
  iconType: SchemeMatch["iconType"];
  iconBg: string;
  iconColor: string;
} {
  const interestsJoined = (scheme.interests || []).join(" ").toLowerCase();
  const nameLower = scheme.name.toLowerCase();

  if (
    interestsJoined.includes("insurance") ||
    nameLower.includes("bima") ||
    nameLower.includes("insurance")
  ) {
    return {
      category: "insurance",
      iconType: "umbrella",
      iconBg: "bg-[#f3e8ff]",
      iconColor: "text-[#9333ea]",
    };
  }

  if (
    interestsJoined.includes("solar") ||
    nameLower.includes("kusum") ||
    nameLower.includes("saur") ||
    nameLower.includes("suryoday")
  ) {
    return {
      category: "solar",
      iconType: "sun",
      iconBg: "bg-[#fef3c7]",
      iconColor: "text-[#d97706]",
    };
  }

  if (
    interestsJoined.includes("irrigation") ||
    interestsJoined.includes("water") ||
    nameLower.includes("sinchayee") ||
    nameLower.includes("irrigation")
  ) {
    return {
      category: "irrigation",
      iconType: "droplet",
      iconBg: "bg-[#e0f2fe]",
      iconColor: "text-[#0284c7]",
    };
  }

  if (
    interestsJoined.includes("machinery") ||
    interestsJoined.includes("equipment") ||
    interestsJoined.includes("mechanization") ||
    nameLower.includes("mechanization") ||
    nameLower.includes("equipment") ||
    nameLower.includes("smam")
  ) {
    return {
      category: "equipment",
      iconType: "tractor",
      iconBg: "bg-[#ffedd5]",
      iconColor: "text-[#ea580c]",
    };
  }

  if (
    interestsJoined.includes("soil") ||
    interestsJoined.includes("fertilizer") ||
    interestsJoined.includes("organic") ||
    nameLower.includes("soil") ||
    nameLower.includes("bhoochetana") ||
    nameLower.includes("pkvy")
  ) {
    return {
      category: "soil",
      iconType: "sprout",
      iconBg: "bg-[#dcfce7]",
      iconColor: "text-[#16a34a]",
    };
  }

  if (
    interestsJoined.includes("training") ||
    interestsJoined.includes("extension") ||
    nameLower.includes("atma") ||
    nameLower.includes("agri-clinics")
  ) {
    return {
      category: "training",
      iconType: "book",
      iconBg: "bg-[#ede9fe]",
      iconColor: "text-[#7c3aed]",
    };
  }

  if (
    interestsJoined.includes("credit") ||
    nameLower.includes("kcc") ||
    nameLower.includes("kisan credit") ||
    nameLower.includes("rin portal") ||
    nameLower.includes("aif") ||
    nameLower.includes("fund")
  ) {
    return {
      category: "credit",
      iconType: "credit",
      iconBg: "bg-[#ccfbf1]",
      iconColor: "text-[#0d9488]",
    };
  }

  // Default to financial
  return {
    category: "financial",
    iconType: "money",
    iconBg: "bg-[#dcfce7]",
    iconColor: "text-[#16a34a]",
  };
}

/**
 * Loads schemes from the existing schemes.json file inside Government scheme folder
 */
export function getRawSchemes(): RawScheme[] {
  try {
    const filePath = path.join(process.cwd(), "backend", "knowledge", "sources", "schemes.json");
    if (!fs.existsSync(filePath)) {
      console.error("[Schemes Service] schemes.json not found at:", filePath);
      return [];
    }
    const rawData = fs.readFileSync(filePath, "utf-8");
    const parsed: RawScheme[] = JSON.parse(rawData);
    return parsed.filter((s) => s && s.active !== false);
  } catch (error) {
    console.error("[Schemes Service] Failed to read schemes.json:", error);
    return [];
  }
}

/**
 * Step 4 & 6: Personalized Scheme Recommendations Engine with Current Information Integration
 */
export function matchAndRankSchemes(
  schemes: RawScheme[],
  filters: SchemeFilterParams
): SchemeMatch[] {
  const selectedState = (filters.state || "").trim().toLowerCase();
  const selectedDistrict = (filters.district || "").trim().toLowerCase();
  const selectedFarmingType = (filters.farmingType || "Crop Farming").trim().toLowerCase();
  const selectedLand = (filters.landHolding || "2 - 5 Acres (Small)").trim().toLowerCase();
  const selectedIncome = (filters.annualIncome || "₹1.5 - ₹3 Lakh").trim().toLowerCase();
  const selectedAge = (filters.age || "38").trim();
  const ageNum = parseInt(selectedAge, 10) || 38;
  const selectedInterests = (filters.interests || []).map((i) => i.trim().toLowerCase());
  const searchQuery = (filters.query || "").trim().toLowerCase();

  const results: SchemeMatch[] = [];

  for (const scheme of schemes) {
    // 1. State Coverage Evaluation
    const isCentral =
      scheme.level.toLowerCase() === "central" ||
      scheme.states.some((s) => s.toUpperCase() === "ALL");

    const isStateSchemeForUser =
      !isCentral &&
      scheme.states.some(
        (st) => st.toLowerCase() === selectedState
      );

    const isStateSchemeOther =
      !isCentral && !isStateSchemeForUser;

    // Filter out other states when browsing for a specific state
    if (isStateSchemeOther && !filters.showAllStates) {
      continue;
    }

    // 2. District Filter (if specified and not "ALL")
    if (
      selectedDistrict &&
      selectedDistrict !== "all" &&
      selectedDistrict !== "all districts" &&
      scheme.districts &&
      scheme.districts.length > 0 &&
      !scheme.districts.some((d) => d.toUpperCase() === "ALL")
    ) {
      const hasDistrict = scheme.districts.some(
        (d) => d.toLowerCase() === selectedDistrict
      );
      if (!hasDistrict) {
        continue;
      }
    }

    // 3. Search query filter
    if (searchQuery) {
      const textCorpus = `${scheme.name} ${scheme.benefits} ${scheme.eligibility} ${(
        scheme.interests || []
      ).join(" ")} ${(scheme.farming_types || []).join(" ")}`.toLowerCase();

      if (!textCorpus.includes(searchQuery)) {
        continue;
      }
    }

    // -------------------------------------------------------------
    // PERSONALIZED SCORING & FACET MATCHING
    // -------------------------------------------------------------
    let score = 20; // Base score
    const whyConditions: string[] = [];
    const matchedInterestsList: string[] = [];
    let statePassed = false;
    let farmingPassed = false;
    let landPassed = false;
    let incomePassed = false;
    let agePassed = false;

    // A. STATE SPECIFICITY PRIORITY
    if (isStateSchemeForUser) {
      score += 30;
      statePassed = true;
      whyConditions.push(`State: Official ${filters.state} State Scheme`);
    } else if (isCentral) {
      score += 18;
      statePassed = true;
      whyConditions.push("State: Central Scheme (All India)");
    } else {
      score -= 40;
      statePassed = false;
      whyConditions.push(`State: Restricted to ${scheme.states.join(", ")}`);
    }

    // B. EXACT FARMING TYPE MATCH
    const schemeFarmingTypes = (scheme.farming_types || []).map((t) => t.toLowerCase());
    if (selectedFarmingType) {
      let exactMatched = false;
      let alliedMatched = false;

      if (schemeFarmingTypes.some((t) => t === selectedFarmingType || selectedFarmingType === t)) {
        exactMatched = true;
      } else if (schemeFarmingTypes.some((t) => t.includes(selectedFarmingType) || selectedFarmingType.includes(t))) {
        exactMatched = true;
      } else if (
        (selectedFarmingType.includes("crop") && schemeFarmingTypes.includes("crop farming")) ||
        (selectedFarmingType.includes("dairy") && (schemeFarmingTypes.includes("dairy") || schemeFarmingTypes.includes("livestock"))) ||
        (selectedFarmingType.includes("livestock") && (schemeFarmingTypes.includes("livestock") || schemeFarmingTypes.includes("dairy") || schemeFarmingTypes.includes("poultry") || schemeFarmingTypes.includes("sheep") || schemeFarmingTypes.includes("goat"))) ||
        (selectedFarmingType.includes("horticulture") && (schemeFarmingTypes.includes("horticulture") || schemeFarmingTypes.includes("agroforestry"))) ||
        (selectedFarmingType.includes("organic") && (schemeFarmingTypes.includes("crop farming") || (scheme.interests || []).some(i => i.toLowerCase().includes("organic"))))
      ) {
        alliedMatched = true;
      }

      if (exactMatched) {
        score += 25;
        farmingPassed = true;
        whyConditions.push(`Farming: Exact match with ${filters.farmingType}`);
      } else if (alliedMatched) {
        score += 18;
        farmingPassed = true;
        whyConditions.push(`Farming: Compatible with ${filters.farmingType}`);
      } else {
        score += 5;
        farmingPassed = false;
        whyConditions.push(`Farming: Targets ${scheme.farming_types.join(", ")}`);
      }
    } else {
      score += 15;
      farmingPassed = true;
    }

    // C. MATCHING FARMER INTERESTS
    if (selectedInterests.length > 0) {
      const schemeInterests = (scheme.interests || []).map((i) => i.toLowerCase());
      const schemeNameLower = scheme.name.toLowerCase();
      let matchedCount = 0;

      for (const uInt of selectedInterests) {
        let matched = false;
        let matchedLabel = uInt;

        if (
          uInt.includes("financial") &&
          (schemeInterests.some(i => i.includes("financial") || i.includes("credit") || i.includes("income") || i.includes("development")) ||
            schemeNameLower.includes("kisan") ||
            schemeNameLower.includes("kalia") ||
            schemeNameLower.includes("bandhu") ||
            schemeNameLower.includes("mahasanman") ||
            schemeNameLower.includes("kalyan"))
        ) {
          matched = true;
          matchedLabel = "Financial Assistance";
        } else if (
          uInt.includes("insurance") &&
          (schemeInterests.some(i => i.includes("insurance")) || schemeNameLower.includes("bima") || schemeNameLower.includes("fasal"))
        ) {
          matched = true;
          matchedLabel = "Crop Insurance";
        } else if (
          (uInt.includes("equipment") || uInt.includes("machinery")) &&
          (schemeInterests.some(i => i.includes("machinery") || i.includes("equipment") || i.includes("mechanization") || i.includes("yantrikikaran")) ||
            schemeNameLower.includes("mechanization") ||
            schemeNameLower.includes("equipment") ||
            schemeNameLower.includes("machinery") ||
            schemeNameLower.includes("yantrikikaran") ||
            schemeNameLower.includes("anudan"))
        ) {
          matched = true;
          matchedLabel = "Agriculture Equipment";
        } else if (
          (uInt.includes("training") || uInt.includes("capacity")) &&
          (schemeInterests.some(i => i.includes("training") || i.includes("extension")) || schemeNameLower.includes("atma") || schemeNameLower.includes("centre"))
        ) {
          matched = true;
          matchedLabel = "Training & Capacity";
        } else if (
          (uInt.includes("irrigation") || uInt.includes("water")) &&
          (schemeInterests.some(i => i.includes("irrigation") || i.includes("water") || i.includes("solar") || i.includes("sinchayee")) ||
            schemeNameLower.includes("sinchayee") ||
            schemeNameLower.includes("drop") ||
            schemeNameLower.includes("pump") ||
            schemeNameLower.includes("irrigation") ||
            schemeNameLower.includes("suryoday"))
        ) {
          matched = true;
          matchedLabel = "Irrigation & Water";
        } else if (
          (uInt.includes("solar") || uInt.includes("energy")) &&
          (schemeInterests.some(i => i.includes("solar") || i.includes("energy")) || schemeNameLower.includes("kusum") || schemeNameLower.includes("saur") || schemeNameLower.includes("suryoday"))
        ) {
          matched = true;
          matchedLabel = "Solar Energy";
        } else if (
          uInt.includes("soil") &&
          (schemeInterests.some(i => i.includes("soil") || i.includes("fertilizer") || i.includes("nutrient")) || schemeNameLower.includes("soil") || schemeNameLower.includes("bhoochetana"))
        ) {
          matched = true;
          matchedLabel = "Soil Health";
        } else if (
          uInt.includes("credit") &&
          (schemeInterests.some(i => i.includes("credit") || i.includes("loan")) || schemeNameLower.includes("kcc") || schemeNameLower.includes("rin") || schemeNameLower.includes("fund"))
        ) {
          matched = true;
          matchedLabel = "Credit & Loans";
        } else if (
          schemeInterests.some((si) => si.includes(uInt) || uInt.includes(si))
        ) {
          matched = true;
          matchedLabel = uInt;
        }

        if (matched) {
          matchedCount++;
          if (!matchedInterestsList.includes(matchedLabel)) {
            matchedInterestsList.push(matchedLabel);
          }
        }
      }

      if (matchedCount > 0) {
        score += Math.min(matchedCount * 18, 36);
        whyConditions.push(`Interests: Matches ${matchedCount} selected focus area(s)`);
      }
    }

    // D. LAND HOLDING REQUIREMENTS
    const isMarginal = selectedLand.includes("< 2") || selectedLand.includes("marginal");
    const isSmall = selectedLand.includes("2 - 5") || selectedLand.includes("small");
    const isMedium = selectedLand.includes("5 - 10") || selectedLand.includes("medium");

    const schemeNameLower = scheme.name.toLowerCase();
    const isSmallholderTargeted =
      schemeNameLower.includes("kisan") ||
      schemeNameLower.includes("kalia") ||
      schemeNameLower.includes("bandhu") ||
      schemeNameLower.includes("micro") ||
      schemeNameLower.includes("kalyan");

    if (isMarginal || isSmall) {
      score += 15;
      landPassed = true;
      whyConditions.push(`Land: Smallholder landholding (< 5 Acres) matches subsidy priority`);
    } else if (isMedium) {
      score += isSmallholderTargeted ? 10 : 15;
      landPassed = true;
      whyConditions.push(`Land: Medium landholding (5-10 Acres) matches allocation`);
    } else {
      score += isSmallholderTargeted ? 8 : 15;
      landPassed = !isSmallholderTargeted;
      whyConditions.push(`Land: Large landholding (> 10 Acres) matches infrastructure/credit`);
    }

    // E. ANNUAL INCOME REQUIREMENTS
    const isLowIncome = selectedIncome.includes("< 1.5") || selectedIncome.includes("1.5 - 3");
    const isMidIncome = selectedIncome.includes("3 - 5");

    if (isLowIncome) {
      score += 12;
      incomePassed = true;
      whyConditions.push(`Income: Income (< ₹3L) meets priority DBT rate criteria`);
    } else if (isMidIncome) {
      score += 10;
      incomePassed = true;
      whyConditions.push(`Income: Income (₹3L-₹5L) eligible for standard subsidy tier`);
    } else {
      score += 8;
      incomePassed = true;
      whyConditions.push(`Income: Income (> ₹5L) eligible for credit & infrastructure funds`);
    }

    // F. AGE SUITABILITY
    if (ageNum >= 18 && ageNum <= 65) {
      score += 10;
      agePassed = true;
      whyConditions.push(`Age: ${ageNum} yrs meets active adult operator criteria`);
    } else if (ageNum > 65) {
      score += 8;
      agePassed = true;
      whyConditions.push(`Age: ${ageNum} yrs qualifies under senior farmer family provision`);
    } else {
      score -= 25;
      agePassed = false;
      whyConditions.push(`Age: ${ageNum} yrs below legal applicant requirement (18+)`);
    }

    // Determine Eligibility Status & Match Percentage
    const normalizedScore = Math.min(Math.max(score, 20), 99);
    let eligibilityStatus: EligibilityStatus;
    let statusBadge: SchemeMatch["statusBadge"];
    let whySummary = "";

    if (!statePassed || ageNum < 18 || normalizedScore < 45) {
      eligibilityStatus = "not_eligible";
      statusBadge = {
        label: "Not Eligible",
        icon: "🔴",
        badgeText: "Not Eligible",
        bgClass: "bg-red-50 dark:bg-red-950/40",
        textClass: "text-red-700 dark:text-red-300",
        borderClass: "border-red-200 dark:border-red-900/50",
      };
      whySummary = !statePassed
        ? `Not applicable in ${filters.state}.`
        : `Does not meet primary criteria.`;
    } else if (normalizedScore >= 70 && statePassed && (farmingPassed || isCentral)) {
      eligibilityStatus = "eligible";
      statusBadge = {
        label: "Eligible",
        icon: "🟢",
        badgeText: "Eligible",
        bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
        textClass: "text-emerald-700 dark:text-emerald-300",
        borderClass: "border-emerald-200 dark:border-emerald-900/50",
      };
      whySummary = `Meets state, landholding, income, age (${ageNum}y), and farming criteria.`;
    } else {
      eligibilityStatus = "possibly_eligible";
      statusBadge = {
        label: "Possibly Eligible",
        icon: "🟡",
        badgeText: "Possibly Eligible",
        bgClass: "bg-amber-50 dark:bg-amber-950/40",
        textClass: "text-amber-700 dark:text-amber-300",
        borderClass: "border-amber-200 dark:border-amber-900/50",
      };
      whySummary = `Partially matches profile; verify specific crop & scheme guidelines.`;
    }

    // Personalized Recommendation Reason
    let recommendationReason = "";
    const matchedFacets: string[] = [];

    if (isStateSchemeForUser && filters.state) {
      matchedFacets.push(`state (${filters.state})`);
    } else if (isCentral) {
      matchedFacets.push("national coverage");
    }

    if (farmingPassed && filters.farmingType) {
      matchedFacets.push(`farming type (${filters.farmingType})`);
    }

    if (matchedInterestsList.length > 0) {
      matchedFacets.push(`selected interest (${matchedInterestsList.slice(0, 2).join(", ")})`);
    } else if (landPassed && filters.landHolding) {
      matchedFacets.push(`landholding (${filters.landHolding})`);
    }

    if (matchedFacets.length >= 3) {
      recommendationReason = `Recommended because this scheme matches your ${matchedFacets[0]}, ${matchedFacets[1]} and ${matchedFacets[2]}.`;
    } else if (matchedFacets.length === 2) {
      recommendationReason = `Recommended because this scheme matches your ${matchedFacets[0]} and ${matchedFacets[1]}.`;
    } else {
      recommendationReason = `Recommended because this scheme matches your state, farming type and selected interest.`;
    }

    const matchBadgeText = `${normalizedScore}% Match`;
    const visualConfig = categorizeScheme(scheme);

    // Step 6: Attach current operational status & verified source info
    const liveStatus = getSchemeLiveStatus(scheme.id, scheme.name, scheme.level, filters.state);

    results.push({
      ...scheme,
      matchScore: normalizedScore,
      matchPercentage: normalizedScore,
      matchBadgeText,
      eligibilityStatus,
      statusBadge,
      whyConditions,
      whySummary,
      recommendationReason,
      liveStatus,
      category: visualConfig.category,
      iconType: visualConfig.iconType,
      iconBg: visualConfig.iconBg,
      iconColor: visualConfig.iconColor,
      badgeText: matchBadgeText,
    });
  }

  // -------------------------------------------------------------
  // MULTI-TIER PERSONALIZED RANKING
  // -------------------------------------------------------------
  const statusRank: Record<EligibilityStatus, number> = {
    eligible: 3,
    possibly_eligible: 2,
    not_eligible: 1,
  };

  results.sort((a, b) => {
    const rankDiff = statusRank[b.eligibilityStatus] - statusRank[a.eligibilityStatus];
    if (rankDiff !== 0) return rankDiff;

    const scoreDiff = b.matchScore - a.matchScore;
    if (scoreDiff !== 0) return scoreDiff;

    const aIsState = a.level.toLowerCase() === "state" ? 1 : 0;
    const bIsState = b.level.toLowerCase() === "state" ? 1 : 0;
    return bIsState - aIsState;
  });

  return results;
}
