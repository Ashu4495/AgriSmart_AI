import fs from "fs";
import path from "path";
import { createClient } from "@insforge/sdk";

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL || "https://5xs4vbzv.us-east.insforge.app",
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_KEY || "ik_353ddb6e0431aef14578c5d66e897e98",
});

async function seedSchemes() {
  console.log("Reading schemes.json...");
  const rawData = fs.readFileSync(path.join(process.cwd(), "Government scheme", "schemes.json"), "utf8");
  const rawSchemes = JSON.parse(rawData);

  console.log(`Found ${rawSchemes.length} schemes in schemes.json.`);

  const mapped = rawSchemes.map((s) => ({
    id: s.id,
    name: s.name,
    authority: s.level === "Central" ? "Ministry of Agriculture & Farmers Welfare (Central)" : `${s.states?.[0] || "State"} Govt`,
    summary: s.benefits || s.eligibility || "Agricultural development and financial assistance scheme.",
    benefit: s.benefits || "Direct benefits for eligible farmers.",
    apply_url: s.application_url || s.source_url || "https://agricoop.gov.in/",
    eligibility_rules_json: {
      farming_types: s.farming_types || [],
      interests: s.interests || [],
      documents_required: s.documents_required || [],
      eligibility_text: s.eligibility || "",
    },
    state: Array.isArray(s.states) && s.states.includes("ALL") ? "All India" : (s.states?.[0] || "All India"),
    category: s.interests?.[0] || "General Support",
    icon_type: s.interests?.[0]?.toLowerCase().includes("credit") || s.interests?.[0]?.toLowerCase().includes("financial")
      ? "coins"
      : s.interests?.[0]?.toLowerCase().includes("insurance")
      ? "shield"
      : s.interests?.[0]?.toLowerCase().includes("irrigation") || s.interests?.[0]?.toLowerCase().includes("solar")
      ? "droplet"
      : "sprout",
  }));

  // Batch insert into InsForge
  console.log("Upserting schemes into database...");
  for (let i = 0; i < mapped.length; i += 10) {
    const batch = mapped.slice(i, i + 10);
    const { data, error } = await insforge.database
      .from("schemes")
      .upsert(batch, { onConflict: "id" });
    if (error) {
      console.error(`Error in batch ${i}:`, error);
    } else {
      console.log(`Upserted batch ${i + 1} to ${Math.min(i + 10, mapped.length)}`);
    }
  }

  console.log("Schemes seed completed successfully.");
}

seedSchemes().catch(console.error);
