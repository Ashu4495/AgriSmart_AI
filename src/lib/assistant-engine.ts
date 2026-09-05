import { getLiveMarketData } from "@/lib/market";
import { fetchLiveWeather } from "@/lib/weather";
import { getSchemesFromDB } from "@/lib/db";
import { insforge } from "@/lib/insforge";

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

interface LLMRouterResponse {
  intent: "GREETING" | "GENERAL_FARMING" | "CROP_RECOMMENDATION" | "IRRIGATION" | "FERTILIZER" | "SOIL" | "DISEASE" | "PEST" | "WEATHER" | "MARKET" | "YIELD" | "PROFIT" | "GOVERNMENT_SCHEME" | "CROP_GUIDE" | "FARMING_TASK" | "CLIMATE_RISK" | "UNKNOWN";
  requires_tool: boolean;
  requires_rag: boolean;
  extracted_crop: string | null;
}

/**
 * Log chat interaction asynchronously
 */
async function logChatInteraction(sessionId: string, userMsg: string, aiReply: string, intent: string, metadata: any) {
  try {
    const timestamp = new Date().toISOString();
    // Insert session if not exists
    await insforge.database.from("chat_sessions").upsert(
      { id: sessionId, updated_at: timestamp },
      { onConflict: 'id' }
    );
    
    // Insert user message
    await insforge.database.from("chat_messages").insert({
      session_id: sessionId,
      role: "user",
      content: userMsg,
      timestamp: timestamp,
      metadata: {}
    });

    // Insert AI message
    await insforge.database.from("chat_messages").insert({
      session_id: sessionId,
      role: "assistant",
      content: aiReply,
      timestamp: new Date().toISOString(),
      metadata: { intent, ...metadata }
    });
  } catch (error) {
    console.error("[Chat Logging Error]", error); // Silently fail to not disrupt user
  }
}

/**
 * Searches InsForge Knowledge Hub DB for RAG context
 */
export async function searchKnowledgeBase(query: string, limit = 2) {
  try {
    // Fetch all resources and perform a basic relevance check (mocking vector search for simplicity)
    const { data, error } = await insforge.database
      .from("knowledge_resources")
      .select("*");
      
    if (error || !data) return [];
    
    const qLower = query.toLowerCase();
    
    const scored = data.map((article) => {
      let score = 0;
      const titleLower = (article.title || "").toLowerCase();
      const descLower = (article.description || "").toLowerCase();
      
      // Keywords to check
      const queryWords = qLower.split(' ').filter(w => w.length > 3);
      for (const w of queryWords) {
        if (titleLower.includes(w)) score += 5;
        if (descLower.includes(w)) score += 2;
      }
      
      // Intent specific boosts
      if (qLower.includes("irrigation") && (titleLower.includes("irrigation") || descLower.includes("irrigation"))) score += 10;
      if (qLower.includes("soil") && (titleLower.includes("soil") || descLower.includes("soil"))) score += 10;
      if (qLower.includes("pest") && (titleLower.includes("pest") || descLower.includes("pest"))) score += 10;
      
      return { article, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.article);
      
  } catch (err) {
    console.error("[RAG Error]", err);
    return [];
  }
}

/**
 * Uses LLM to detect the intent of the user's question with conversation history
 */
async function detectIntentWithLLM(
  prompt: string,
  history: ChatMessage[],
  apiKey: string
): Promise<LLMRouterResponse> {
  try {
    const historyContext = history.slice(-4).map(m => `${m.sender}: ${m.text}`).join('\n');
    
    const systemPrompt = `You are an intent router for an agricultural chatbot.
Classify the user's latest query into exactly one of the following intents:
GREETING, GENERAL_FARMING, CROP_RECOMMENDATION, IRRIGATION, FERTILIZER, SOIL, DISEASE, PEST, WEATHER, MARKET, YIELD, PROFIT, GOVERNMENT_SCHEME, CROP_GUIDE, FARMING_TASK, CLIMATE_RISK, UNKNOWN.

Context (History):
${historyContext}

Latest User Query: "${prompt}"

Also extract the crop name if they are referring to one (e.g. "them" might refer to "tomatoes" based on history).
Respond in pure JSON format:
{
  "intent": "...",
  "requires_tool": true/false, // True if live data like WEATHER or MARKET is needed
  "requires_rag": true/false, // True if knowledge like IRRIGATION, DISEASE, GOVERNMENT_SCHEME is needed
  "extracted_crop": "crop name or null"
}
Ensure the output is ONLY valid JSON.`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://agrismart.ai",
        "X-Title": "AgriSmart AI Assistant",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct",
        messages: [{ role: "user", content: systemPrompt }],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (res.ok) {
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content?.trim();
      if (content) {
        // Strip markdown if any
        const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned) as LLMRouterResponse;
      }
    } else {
      const errorText = await res.text();
      console.error(`[Intent LLM Error] HTTP ${res.status} ${res.statusText}:`, errorText);
    }
  } catch (e) {
    console.warn("[Intent LLM Error]", e);
  }
  
  // Safe Fallback if LLM fails
  const qLower = prompt.toLowerCase();
  return {
    intent: qLower.match(/hi|hello|namaste|hey/) ? "GREETING" : "GENERAL_FARMING",
    requires_tool: false,
    requires_rag: false,
    extracted_crop: null
  };
}

/**
 * Generates the final LLM response providing context and tools
 */
async function callLLMForResponse(
  userMsg: string,
  history: ChatMessage[],
  systemPrompt: string,
  apiKey: string,
): Promise<string | null> {
  try {
    const messages = [
      { role: "system", content: systemPrompt }
    ];
    
    // Append last 5 messages for context
    const recentHistory = history.slice(-5);
    for (const msg of recentHistory) {
      // Don't duplicate the latest message if it's already in history
      if (msg.text !== userMsg) {
        messages.push({
          role: msg.sender === "assistant" ? "assistant" : "user",
          content: msg.text
        });
      }
    }
    
    // Add latest message
    messages.push({ role: "user", content: userMsg });

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://agrismart.ai",
        "X-Title": "AgriSmart AI Assistant",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct",
        messages,
        temperature: 0.3,
        max_tokens: 750,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (res.ok) {
      const data = await res.json();
      return data?.choices?.[0]?.message?.content?.trim() || null;
    } else {
      const errorText = await res.text();
      console.error(`[OpenRouter Response Error] HTTP ${res.status} ${res.statusText}:`, errorText);
    }
  } catch (e) {
    console.warn("[OpenRouter Response Error]", e);
  }
  return null;
}

export async function processAssistantQuery(input: AssistantProcessInput): Promise<AssistantResponse> {
  const query = (input.message || "").trim();
  const qLower = query.toLowerCase();
  const isHindi = (input.language || "").startsWith("hi");
  const loc = input.location || "your farm area";
  const session_id = input.session_id || `session-${Date.now()}`;
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  let hasCrops = false;
  let cropsList: Array<{ crop: string; probability: number }> = [];
  let sourcesList: Array<{ title: string; url?: string }> = [];
  let toolData: any = null;
  let ragDocs: any[] = [];
  
  // 1. Determine Intent via LLM
  let routerResult: LLMRouterResponse = {
    intent: "UNKNOWN",
    requires_tool: false,
    requires_rag: false,
    extracted_crop: null
  };

  if (openRouterKey) {
     routerResult = await detectIntentWithLLM(query, input.history || [], openRouterKey);
  } else {
     // Basic fallback if no LLM key
     if (qLower.match(/hi|hello|namaste|hey/)) routerResult.intent = "GREETING";
     else if (qLower.includes("weather") || qLower.includes("rain")) { routerResult.intent = "WEATHER"; routerResult.requires_tool = true; }
     else if (qLower.includes("price") || qLower.includes("mandi")) { routerResult.intent = "MARKET"; routerResult.requires_tool = true; }
     else { routerResult.intent = "GENERAL_FARMING"; routerResult.requires_rag = true; }
  }

  const intent = routerResult.intent;

  // 2. Fetch Tools or RAG based on Intent
  if (intent === "WEATHER") {
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
      toolData = { location: loc, status: "Weather information is temporarily unavailable." };
    }
  } else if (intent === "MARKET") {
    const market = getLiveMarketData();
    const matchedCrop = market.find((c) => qLower.includes(c.id) || (routerResult.extracted_crop && c.name.toLowerCase() === routerResult.extracted_crop.toLowerCase()));
    if (matchedCrop) {
      toolData = { crop: matchedCrop.name, modalPrice: `₹${matchedCrop.price} / ${matchedCrop.unit}` };
      sourcesList.push({ title: `${matchedCrop.name} Mandi Rates`, url: "/market-finance" });
    } else {
      toolData = { topCrops: market.slice(0, 4).map((c) => ({ name: c.name, price: `₹${c.price}/${c.unit}` })) };
      sourcesList.push({ title: "Live Mandi Prices", url: "/market-finance" });
    }
  } else if (intent === "CROP_RECOMMENDATION") {
    hasCrops = true;
    cropsList = [
      { crop: "Rice", probability: 93.5 },
      { crop: "Jute", probability: 6.5 },
      { crop: "Maize", probability: 4.2 },
    ];
    sourcesList.push({ title: "Random Forest Crop Recommendation Model", url: "/crop-recommendation" });
    toolData = { recommendations: cropsList, location: loc };
  } else if (intent === "GOVERNMENT_SCHEME") {
    try {
      const schemes = await getSchemesFromDB();
      toolData = { schemes: schemes.slice(0, 3).map((s) => ({ name: s.name, benefit: s.benefit })) };
      sourcesList.push({ title: "Government Schemes Portal", url: "/government-resources" });
    } catch {
      toolData = { scheme: "PM-KISAN, PMFBY" };
    }
  } else if (intent === "FERTILIZER") {
     const cropKey = Object.keys(FERTILIZER_GUIDELINES).find((k) => (routerResult.extracted_crop?.toLowerCase().includes(k) || qLower.includes(k))) || "wheat";
     toolData = { fertilizer_guide: FERTILIZER_GUIDELINES[cropKey] || FERTILIZER_GUIDELINES.wheat };
     sourcesList.push({ title: `${cropKey.toUpperCase()} Fertilizer Advisory`, url: "/soil-crop-health" });
  } else if (intent !== "GREETING") {
    // For Irrigation, Soil, Disease, Pest, General - Fetch RAG
    ragDocs = await searchKnowledgeBase(query, 2);
    for (const doc of ragDocs) {
      sourcesList.push({ title: doc.title, url: `/knowledge/${doc.id}` });
    }
  }

  // 3. Generate Final Reply using LLM
  let generatedReply: string | null = null;
  
  if (intent === "GREETING") {
    generatedReply = isHindi
      ? `नमस्ते! मैं आपका एग्रीस्मार्ट कृषि सलाहकार हूँ। आप मुझसे फसल चयन, मौसम, खाद की सही मात्रा, सिंचाई या रोग नियंत्रण के बारे में पूछ सकते हैं।`
      : `Hello! I am your AgriSmart AI Farming Advisor. You can ask me about irrigation tips, live weather forecasts, fertilizer dosage, pest diagnosis, or crop selection.`;
  } else if (openRouterKey) {
    const systemPrompt = `You are "AgriSmart AI Assistant", an expert, friendly agricultural scientist assisting Indian farmers.
Principles:
1. Provide accurate, practical, actionable advice. Format cleanly with bullet points if needed.
2. Rely strictly on provided Tool Data and Knowledge Base context to answer the user's question. 
3. If tool data indicates an error (e.g., weather unavailable), clearly tell the farmer the specific data is temporarily unavailable.
4. Answer concisely without overly technical jargon.
5. If the user asks about an image/disease, state that they can upload a leaf photo to the Soil & Crop Health scanner for AI diagnosis.
6. Language: If language is Hindi, reply in natural Devanagari Hindi. Otherwise English.

[CONTEXT DATA]:
Intent Detected: ${intent}
Extracted Crop Context: ${routerResult.extracted_crop || 'None'}
Location: ${loc}
Language: ${isHindi ? "Hindi" : "English"}
Tool Data: ${JSON.stringify(toolData || {})}
Knowledge Base Articles: ${JSON.stringify(ragDocs.map(r => r.title + ': ' + r.description))}

Answer the user's latest question directly using the context provided above.`;

    generatedReply = await callLLMForResponse(query, input.history || [], systemPrompt, openRouterKey);
  } else {
    // Mock response if no API key is provided for local testing
    if (intent === "FERTILIZER" && toolData?.fertilizer_guide) {
      generatedReply = `Based on standard guidelines, here is the fertilizer schedule: ${toolData.fertilizer_guide.schedule}`;
    } else if (intent === "MARKET" && toolData?.modalPrice) {
      generatedReply = `The current market rate for ${toolData.crop} is ${toolData.modalPrice}.`;
    } else if (intent === "WEATHER" && toolData?.temperature) {
      generatedReply = `The current weather in ${loc} is ${toolData.temperature} and ${toolData.condition}.`;
    } else if (ragDocs.length > 0) {
      generatedReply = `I found some relevant information: ${ragDocs[0].description}`;
    } else {
      generatedReply = `(Simulated AI Response - OPENROUTER_API_KEY is missing) I would typically provide detailed agricultural advice here based on your query: "${query}".`;
    }
  }

  // 4. Safe Fallbacks if LLM Generation Failed completely
  if (!generatedReply) {
    if (ragDocs && ragDocs.length > 0) {
      generatedReply = `I found some relevant information: ${ragDocs[0].description}`;
    } else if (intent === "WEATHER" && toolData?.temperature) {
      generatedReply = `The current weather in ${loc} is ${toolData.temperature} and ${toolData.condition}.`;
    } else if (intent === "MARKET" && toolData?.modalPrice) {
      generatedReply = `The current market rate for ${toolData.crop} is ${toolData.modalPrice}.`;
    } else if (intent === "FERTILIZER" && toolData?.fertilizer_guide) {
      generatedReply = `Based on standard guidelines, here is the fertilizer schedule: ${toolData.fertilizer_guide.schedule}`;
    } else {
      generatedReply = isHindi 
        ? `मुझे खेद है, मैं अभी इस प्रश्न का उत्तर देने में अस्थायी रूप से असमर्थ हूँ। कृपया पुनः प्रयास करें।`
        : `I'm temporarily unable to process your question. Please try again.`;
    }
  }

  // Log to database asynchronously
  logChatInteraction(session_id, query, generatedReply, intent, { toolData, ragSources: sourcesList.length });

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
