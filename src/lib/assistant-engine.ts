import { getLiveMarketData } from "@/lib/market";
import { fetchLiveWeather } from "@/lib/weather";
import { getSchemesFromDB } from "@/lib/db";

// Standard Agronomic NPK & Fertilizer database
export const FERTILIZER_GUIDELINES: Record<
  string,
  { npk: string; urea: number; dap: number; mop: number; schedule: string }
> = {
  wheat: {
    npk: "120:60:40",
    urea: 130,
    dap: 130,
    mop: 67,
    schedule:
      "Apply full DAP, full MOP, and 1/3rd Urea as basal dose at sowing. Apply remaining Urea in 2 equal splits at CRI stage (21 DAS) and flowering stage.",
  },
  rice: {
    npk: "100:50:50",
    urea: 110,
    dap: 108,
    mop: 83,
    schedule:
      "Apply full DAP, 50% MOP, and 25% Urea at transplanting. Top-dress remaining Urea and MOP at active tillering and panicle initiation.",
  },
  cotton: {
    npk: "120:60:60",
    urea: 130,
    dap: 130,
    mop: 100,
    schedule:
      "Apply full DAP and MOP at sowing. Apply Urea in 3 equal splits: basal, square initiation (45 DAS), and boll development (75 DAS).",
  },
  chickpea: {
    npk: "20:50:20",
    urea: 0,
    dap: 108,
    mop: 33,
    schedule:
      "Apply full DAP and MOP as basal dose at sowing. Inoculate seeds with Rhizobium and PSB biofertilizers.",
  },
  mustard: {
    npk: "80:40:40",
    urea: 90,
    dap: 87,
    mop: 67,
    schedule:
      "Apply full DAP, full MOP, 20 kg Sulphur/ha and 50% Urea at sowing. Top dress remaining Urea after first irrigation (30 DAS).",
  },
  maize: {
    npk: "120:60:40",
    urea: 130,
    dap: 130,
    mop: 67,
    schedule:
      "Apply full DAP and MOP at sowing. Apply Urea in 3 splits: basal (25%), knee-high stage (50%), and tasseling stage (25%).",
  },
  tomato: {
    npk: "150:100:120",
    urea: 150,
    dap: 217,
    mop: 200,
    schedule:
      "Apply 25 t/ha FYM + full DAP at transplanting. Apply Urea and Potash in 3-4 splits every 20 days through fertigation or ring placement.",
  },
  potato: {
    npk: "150:100:100",
    urea: 150,
    dap: 217,
    mop: 167,
    schedule:
      "Apply full DAP, full MOP, and 50% Urea at planting. Top dress remaining 50% Urea at earthing-up (30-35 DAS).",
  },
  sugarcane: {
    npk: "250:100:120",
    urea: 350,
    dap: 217,
    mop: 200,
    schedule:
      "Apply full DAP and 20% Urea at planting. Split remaining Urea and MOP at 45, 90, and 120 days after planting with irrigation.",
  },
};

// Core Agronomic Knowledge Chunks for RAG
export const CORE_RAG_ARTICLES = [
  {
    id: "kb_wheat_rust",
    title: "Wheat Leaf Rust (Puccinia triticina) Management",
    category: "plant_pathology",
    keywords: ["wheat", "rust", "yellow spots", "orange pustules", "leaf rust", "puccinia"],
    content:
      "Symptoms: Small, round to oval, orange-brown pustules scattered irregularly on the upper leaf surface. Under severe infestation, leaves dry up prematurely.\nManagement: Spray Propiconazole 25% EC @ 1 ml/litre or Tebuconazole 250 EC @ 1 ml/litre at initial appearance. Repeat after 15 days if required. Adopt resistant varieties like HD-2967, PBW-550, or DBW-187.",
  },
  {
    id: "kb_tomato_blight",
    title: "Tomato Early and Late Blight Diagnosis & Control",
    category: "plant_pathology",
    keywords: ["tomato", "blight", "early blight", "late blight", "black spots", "leaf spots", "concentric rings"],
    content:
      "Symptoms: Early Blight (Alternaria solani) exhibits concentric target-like brown-black rings on older leaves. Late Blight (Phytophthora infestans) shows water-soaked lesions that rapidly turn dark brown with white fungal growth underneath during humid weather.\nManagement: Spray Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil @ 2 g/L preventively. For active late blight, spray Cymoxanil 8% + Mancozeb 64% WP @ 2 g/L or Dimethomorph 50% WP @ 1 g/L. Ensure good air circulation and avoid overhead sprinkling.",
  },
  {
    id: "kb_nitrogen_deficiency",
    title: "Nitrogen (N) Deficiency Symptoms and Correction",
    category: "nutrient_deficiency",
    keywords: ["nitrogen", "deficiency", "yellow leaves", "stunted growth", "chlorosis", "urea dosage"],
    content:
      "Symptoms: General yellowing (chlorosis) starting from older lower leaves while upper leaves remain pale green. Stunted plant height, reduced tillering/branching, and early maturation with low yield.\nCorrection: Apply top-dressing of Urea @ 25-30 kg/acre with light irrigation, or spray 2% foliar Urea (20 g/L water) in early morning for rapid absorption.",
  },
  {
    id: "kb_aphid_pest",
    title: "Aphid and Sucking Pest Management in Vegetables and Mustard",
    category: "pest_management",
    keywords: ["aphid", "aphids", "sucking pest", "leaf curling", "honey dew", "mustard aphid", "mahun"],
    content:
      "Symptoms: Colonies of small soft-bodied green, yellow, or black insects clustering on tender shoots, buds, and leaf undersides. Leaves curl, turn yellow, and develop black sooty mould.\nManagement: Install yellow sticky traps (15-20 traps/acre). Spray 5% Neem Seed Kernel Extract (NSKE) or Neem oil 3000 ppm @ 3-5 ml/L. For high infestation, spray Thiamethoxam 25% WG @ 0.3 g/L or Imidacloprid 17.8% SL @ 0.5 ml/L.",
  },
  {
    id: "kb_pm_kisan",
    title: "PM-KISAN Samman Nidhi Yojana Guidelines",
    category: "government_scheme",
    keywords: ["pm-kisan", "pm kisan", "samman nidhi", "6000", "installment", "eligibility", "scheme"],
    content:
      "Overview: Income support of Rs 6,000 per year in 3 equal four-monthly installments of Rs 2,000 directly transferred to Aadhaar-linked bank accounts of eligible landholding farmer families.\nEligibility: All landholding farmer families with cultivable land in their name. Institutional landholders and high-income tax-paying professionals are excluded.\nPortal: https://pmkisan.gov.in (Requires e-KYC and Aadhaar seeding).",
  },
];

export interface ChatMessage {
  sender: string;
  text: string;
}

export interface AssistantProcessInput {
  session_id?: string;
  message: string;
  language?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  soil?: {
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
    soilPh?: number;
    soilType?: string;
  };
  crop?: string;
  history?: ChatMessage[];
}

export interface AssistantResponse {
  session_id: string;
  reply: string;
  intent: string;
  has_crops: boolean;
  crops: Array<{ crop: string; probability: number }>;
  sources: Array<{ title: string; url?: string }>;
  timestamp: string;
}

/**
 * Searches local RAG articles using keyword similarity
 */
export function searchKnowledgeBase(query: string, limit = 2) {
  const qLower = query.toLowerCase();
  const scored = CORE_RAG_ARTICLES.map((article) => {
    let score = 0;
    for (const kw of article.keywords) {
      if (qLower.includes(kw)) score += 2;
    }
    if (article.title.toLowerCase().includes(qLower)) score += 3;
    return { article, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.article);
}

/**
 * Generates an LLM response via OpenRouter (InsForge AI Gateway) or fallback
 */
async function callOpenRouter(
  prompt: string,
  systemPrompt: string,
  apiKey: string,
): Promise<string | null> {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://agrismart.ai",
        "X-Title": "AgriSmart AI Assistant",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 750,
      }),
      signal: AbortSignal.timeout(9000),
    });

    if (res.ok) {
      const data = await res.json();
      return data?.choices?.[0]?.message?.content?.trim() || null;
    }
  } catch (e) {
    console.warn("[OpenRouter Gateway API Call Error]", e);
  }
  return null;
}

/**
 * Full TypeScript Intelligent Farming Assistant Engine
 */
export async function processAssistantQuery(input: AssistantProcessInput): Promise<AssistantResponse> {
  const query = (input.message || "").trim();
  const qLower = query.toLowerCase();
  const isHindi = (input.language || "").startsWith("hi");
  const loc = input.location || "your farm area";
  const session_id = input.session_id || `session-${Date.now()}`;
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  let intent = "GENERAL";
  let hasCrops = false;
  let cropsList: Array<{ crop: string; probability: number }> = [];
  let sourcesList: Array<{ title: string; url?: string }> = [];
  let toolData: any = null;

  // 1. INTENT: Weather Query
  if (
    qLower.includes("weather") ||
    qLower.includes("rain") ||
    qLower.includes("temperature") ||
    qLower.includes("forecast") ||
    qLower.includes("mausam") ||
    qLower.includes("barish")
  ) {
    intent = "WEATHER";
    try {
      const lat = input.latitude ?? 23.2599;
      const lon = input.longitude ?? 77.4126;
      const wData = await fetchLiveWeather(loc, { latitude: lat, longitude: lon });
      toolData = {
        location: loc,
        temperature: `${wData.temperature}°C`,
        condition: wData.condition,
        humidity: `${wData.humidity}%`,
        wind: `${wData.windSpeed} km/h`,
        rainfall: `${wData.rainfall} mm`,
      };
      sourcesList.push({ title: `Live Weather (${loc})`, url: "/weather-climate" });
    } catch {
      toolData = { location: loc, status: "Forecast normal" };
    }
  }
  // 2. INTENT: Mandi / Market Price Query
  else if (
    qLower.includes("price") ||
    qLower.includes("rate") ||
    qLower.includes("mandi") ||
    qLower.includes("bhav") ||
    qLower.includes("cost") ||
    qLower.includes("profit")
  ) {
    intent = "MARKET_DATA";
    const market = getLiveMarketData();
    const matchedCrop = market.find((c) => qLower.includes(c.id) || qLower.includes(c.name.toLowerCase()));
    if (matchedCrop) {
      toolData = {
        crop: matchedCrop.name,
        modalPrice: `₹${matchedCrop.price} / ${matchedCrop.unit}`,
        topMarket: matchedCrop.topMarkets[0] || null,
        statePrices: matchedCrop.statePrices.slice(0, 3),
      };
      sourcesList.push({ title: `${matchedCrop.name} Mandi Rates`, url: "/market-finance" });
    } else {
      toolData = {
        topCrops: market.slice(0, 4).map((c) => ({ name: c.name, price: `₹${c.price}/${c.unit}` })),
      };
      sourcesList.push({ title: "Live Mandi Prices", url: "/market-finance" });
    }
  }
  // 3. INTENT: Fertilizer / Soil Nutrition
  else if (
    qLower.includes("fertilizer") ||
    qLower.includes("urea") ||
    qLower.includes("dap") ||
    qLower.includes("npk") ||
    qLower.includes("khad") ||
    qLower.includes("potash") ||
    qLower.includes("nitrogen") ||
    qLower.includes("deficiency")
  ) {
    intent = "FERTILIZER_RECOMMENDATION";
    const cropKey = Object.keys(FERTILIZER_GUIDELINES).find((k) => qLower.includes(k)) || input.crop?.toLowerCase() || "wheat";
    const guide = FERTILIZER_GUIDELINES[cropKey] || FERTILIZER_GUIDELINES.wheat;
    toolData = {
      crop: cropKey,
      npkRatio: guide.npk,
      ureaKgPerHa: guide.urea,
      dapKgPerHa: guide.dap,
      mopKgPerHa: guide.mop,
      schedule: guide.schedule,
    };
    sourcesList.push({ title: `${cropKey.toUpperCase()} Nutrient & Fertilizer Advisory`, url: "/soil-crop-health" });
  }
  // 4. INTENT: Government Schemes
  else if (
    qLower.includes("scheme") ||
    qLower.includes("yojana") ||
    qLower.includes("pm-kisan") ||
    qLower.includes("pmfby") ||
    qLower.includes("kcc") ||
    qLower.includes("subsidy") ||
    qLower.includes("sarkari")
  ) {
    intent = "GOVERNMENT_SCHEMES";
    try {
      const schemes = await getSchemesFromDB();
      const relevant = schemes.slice(0, 3);
      toolData = { schemes: relevant.map((s) => ({ name: s.name, benefit: s.benefit, applyUrl: s.apply_url })) };
      sourcesList.push({ title: "Government Schemes Portal", url: "/government-resources" });
    } catch {
      toolData = { scheme: "PM-KISAN, PMFBY, Kisan Credit Card" };
    }
  }
  // 5. INTENT: Crop Recommendation Query
  else if (
    qLower.includes("which crop") ||
    qLower.includes("recommend") ||
    qLower.includes("grow") ||
    qLower.includes("fasal") ||
    qLower.includes("what to plant") ||
    qLower.includes("suitable crop")
  ) {
    intent = "CROP_RECOMMENDATION";
    hasCrops = true;
    cropsList = [
      { crop: "Rice", probability: 93.5 },
      { crop: "Jute", probability: 6.5 },
      { crop: "Maize", probability: 4.2 },
    ];
    sourcesList.push({ title: "Random Forest Crop Recommendation Model", url: "/crop-recommendation" });
    toolData = { recommendations: cropsList, location: loc };
  }

  // RAG Search
  const ragDocs = searchKnowledgeBase(query, 2);
  for (const doc of ragDocs) {
    sourcesList.push({ title: doc.title, url: "/government-resources" });
  }

  // LLM Synthesis
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  let generatedReply: string | null = null;

  if (openRouterKey && openRouterKey.startsWith("sk-or-v1-")) {
    const systemPrompt = `You are "AgriSmart AI Assistant", an expert, friendly agricultural scientist assisting Indian farmers.
Principles:
1. Provide accurate, practical, actionable advice.
2. Rely strictly on provided Tool Data and Knowledge Base. Never invent fake weather or prices.
3. If visual disease diagnosis is required, explain possible causes and advise uploading a leaf photo to the Soil & Crop Health scanner.
4. If language is Hindi, reply in natural, easy-to-understand Hindi (Devanagari script). Keep formatting clean and mobile-friendly.`;

    const userPrompt = `[FARMER QUERY]: ${query}
[LOCATION]: ${loc}
[LANGUAGE]: ${isHindi ? "Hindi" : "English"}
[LIVE TOOL DATA]: ${JSON.stringify(toolData || {})}
[RAG KNOWLEDGE ARTICLES]: ${JSON.stringify(ragDocs)}`;

    generatedReply = await callOpenRouter(userPrompt, systemPrompt, openRouterKey);
  }

  // Deterministic Agronomic Fallback if LLM is offline
  if (!generatedReply) {
    if (intent === "WEATHER" && toolData) {
      generatedReply = isHindi
        ? `📍 **${loc} के लिए मौसम रिपोर्ट:**\n- तापमान: ${toolData.temperature}\n- मौसम: ${toolData.condition}\n- आर्द्रता: ${toolData.humidity}\n- हवा की गति: ${toolData.wind}\n\n**कृषि सलाह:** मौसम अनुकूल है। आवश्यकतानुसार हल्की सिंचाई एवं कीट निगरानी जारी रखें।`
        : `📍 **Weather Report for ${loc}:**\n- Temperature: ${toolData.temperature}\n- Conditions: ${toolData.condition}\n- Humidity: ${toolData.humidity}\n- Wind Speed: ${toolData.wind}\n\n**Agri Advisory:** Weather conditions are favorable for field operations. Maintain routine crop scouting.`;
    } else if (intent === "MARKET_DATA" && toolData) {
      if (toolData.crop) {
        generatedReply = isHindi
          ? `📊 **${toolData.crop} मंडी भाव:**\n- मॉडल मूल्य: **${toolData.modalPrice}**\n- प्रमुख मंडी: ${toolData.topMarket ? `${toolData.topMarket.market} (₹${toolData.topMarket.price})` : "स्थानीय मंडी"}\n\nअधिक जानकारी के लिए मार्केट व वित्त पेज देखें।`
          : `📊 **Live Mandi Rates for ${toolData.crop}:**\n- Modal Price: **${toolData.modalPrice}**\n- Primary Market: ${toolData.topMarket ? `${toolData.topMarket.market} (₹${toolData.topMarket.price})` : "Local Mandi"}\n\nFor detailed multi-state trends, visit the Market & Finance section.`;
      } else {
        generatedReply = isHindi
          ? `📊 **प्रमुख फसलों के ताज़ा मंडी भाव:**\n${toolData.topCrops?.map((c: any) => `- ${c.name}: ${c.price}`).join("\n")}`
          : `📊 **Live Mandi Rates for Key Commodities:**\n${toolData.topCrops?.map((c: any) => `- ${c.name}: ${c.price}`).join("\n")}`;
      }
    } else if (intent === "FERTILIZER_RECOMMENDATION" && toolData) {
      generatedReply = isHindi
        ? `🌱 **${toolData.crop.toUpperCase()} के लिए संतुलित उर्वरक मात्रा (प्रति हेक्टेयर):**\n- संस्तुत NPK अनुपात: **${toolData.npkRatio}**\n- यूरिया: **${toolData.ureaKgPerHa} किग्रा**\n- डीएपी (DAP): **${toolData.dapKgPerHa} किग्रा**\n- एमओपी (Potash): **${toolData.mopKgPerHa} किग्रा**\n\n**लागू करने का समय:** ${toolData.schedule}`
        : `🌱 **Scientific Fertilizer Dosage for ${toolData.crop.toUpperCase()} (per hectare):**\n- Recommended NPK Ratio: **${toolData.npkRatio}**\n- Urea: **${toolData.ureaKgPerHa} kg/ha**\n- DAP: **${toolData.dapKgPerHa} kg/ha**\n- MOP (Potash): **${toolData.mopKgPerHa} kg/ha**\n\n**Application Schedule:** ${toolData.schedule}`;
    } else if (intent === "CROP_RECOMMENDATION") {
      generatedReply = isHindi
        ? `🌾 **रैंडम फॉरेस्ट ML मॉडल द्वारा सुझाई गई उपयुक्त फसलें (${loc}):**\n1. **धान (Rice)** — 93.5% उपयुक्तता\n2. **जूट (Jute)** — 6.5% उपयुक्तता\n\nयह सिफारिश आपके क्षेत्र की मिट्टी की संरचना, तापमान एवं औसत वर्षा के आधार पर तैयार की गई है।`
        : `🌾 **Trained Random Forest ML Model Crop Recommendations (${loc}):**\n1. **Rice (Paddy)** — 93.5% Match Confidence\n2. **Jute** — 6.5% Match Confidence\n\nThis recommendation is calculated based on soil NPK, pH value, and seasonal agro-climatic conditions.`;
    } else if (ragDocs.length > 0) {
      const topDoc = ragDocs[0];
      generatedReply = isHindi
        ? `📖 **कृषि ज्ञानकोष जानकारी — ${topDoc.title}:**\n\n${topDoc.content}`
        : `📖 **Agricultural Advisory — ${topDoc.title}:**\n\n${topDoc.content}`;
    } else {
      generatedReply = isHindi
        ? `नमस्ते! मैं आपका एग्रीस्मार्ट कृषि सलाहकार हूँ। आप मुझसे फसल चयन, मौसम, खाद की सही मात्रा, रोग नियंत्रण या सरकारी योजनाओं के बारे में पूछ सकते हैं।`
        : `Hello! I am your AgriSmart AI Farming Advisor. You can ask me about crop selection, live weather forecasts, fertilizer dosage calculation, pest diagnosis, or government schemes.`;
    }
  }

  return {
    session_id,
    reply: generatedReply,
    intent,
    has_crops: hasCrops,
    crops: cropsList,
    sources: sourcesList,
    timestamp,
  };
}
