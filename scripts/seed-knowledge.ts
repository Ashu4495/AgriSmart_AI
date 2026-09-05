import { createClient } from '@insforge/sdk';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_INSFORGE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing InsForge URL or Key. Please check .env.local");
  process.exit(1);
}

const supabase = createClient({ baseUrl: supabaseUrl, anonKey: supabaseKey });

const SEED_RESOURCES = [
  {
    title: "ICAR Kharif Agro-Advisories for Farmers",
    description: "Farmer-oriented seasonal agricultural advisories covering crop and farming practices for the Kharif season.",
    resource_type: "PDF",
    category: "Best Practices",
    source_name: "ICAR",
    source_url: "https://icar.gov.in/",
    document_url: "https://icar.gov.in/sites/default/files/2024-05/Kharif-Advisory-2024.pdf",
    state: "PAN_INDIA",
    scope: "PAN_INDIA",
    language: "English",
    is_verified: true,
    page_count: 45
  },
  {
    title: "Soil Health Card Information & Guidelines",
    description: "Official information about soil health parameters, nutrient status and soil-based recommendations provided by the Government of India.",
    resource_type: "GOVERNMENT_DOCUMENT",
    category: "Soil Management",
    source_name: "Government of India",
    source_url: "https://soilhealth.dac.gov.in/",
    document_url: "https://soilhealth.dac.gov.in/public/images/SHC_Guidelines.pdf",
    state: "PAN_INDIA",
    scope: "PAN_INDIA",
    language: "English",
    is_verified: true,
    page_count: 20
  },
  {
    title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    description: "Official information about PM-KISAN, eligibility, registration, and beneficiary services.",
    resource_type: "WEBSITE",
    category: "Government Schemes",
    source_name: "Government of India",
    source_url: "https://pmkisan.gov.in/",
    state: "PAN_INDIA",
    scope: "PAN_INDIA",
    language: "English",
    is_verified: true
  },
  {
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY) Guidelines",
    description: "Official crop insurance scheme guidelines and farmer information for financial support during crop loss/damage.",
    resource_type: "PDF",
    category: "Government Schemes",
    source_name: "Ministry of Agriculture & Farmers Welfare",
    source_url: "https://pmfby.gov.in/",
    document_url: "https://pmfby.gov.in/pdf/Revised_Operational_Guidelines.pdf",
    state: "PAN_INDIA",
    scope: "PAN_INDIA",
    language: "English",
    is_verified: true,
    page_count: 82
  },
  {
    title: "Drip Irrigation for Water Saving",
    description: "Precision water delivery techniques to save water and increase yield. A comprehensive guide by ICAR.",
    resource_type: "GUIDE",
    category: "Irrigation",
    source_name: "ICAR",
    source_url: "https://icar.gov.in/",
    state: "PAN_INDIA",
    scope: "PAN_INDIA",
    language: "English",
    is_verified: true
  },
  {
    title: "Maharashtra Agriculture Department - Official Portal",
    description: "State-specific schemes, advisories, and resources for farmers in Maharashtra.",
    resource_type: "WEBSITE",
    category: "Government Schemes",
    source_name: "State Agriculture Department",
    source_url: "https://krishi.maharashtra.gov.in/",
    state: "Maharashtra",
    scope: "STATE",
    language: "Marathi",
    is_verified: true
  },
  {
    title: "Madhya Pradesh Krishi Net",
    description: "Official portal for farmers in Madhya Pradesh providing scheme details, market prices, and advisories.",
    resource_type: "WEBSITE",
    category: "Government Schemes",
    source_name: "State Agriculture Department",
    source_url: "https://mpkrishi.mp.gov.in/",
    state: "Madhya Pradesh",
    scope: "STATE",
    language: "Hindi",
    is_verified: true
  },
  {
    title: "Handbook of Agriculture",
    description: "Comprehensive agricultural reference covering major areas of Indian agriculture. Published by ICAR.",
    resource_type: "RESEARCH_PUBLICATION",
    category: "Crop Guides",
    source_name: "ICAR",
    source_url: "https://icar.gov.in/en/all-publications",
    state: "PAN_INDIA",
    scope: "PAN_INDIA",
    language: "English",
    is_verified: true
  },
  {
    title: "Organic Farming Best Practices",
    description: "Detailed guide on organic farming methods, certification process, and benefits.",
    resource_type: "ARTICLE",
    category: "Organic Farming",
    source_name: "National Centre of Organic Farming",
    source_url: "https://ncof.dacnet.nic.in/",
    state: "PAN_INDIA",
    scope: "PAN_INDIA",
    language: "English",
    is_verified: true
  },
  {
    title: "Integrated Pest Management (IPM) Strategies",
    description: "Learn how to manage crop pests effectively using biological and environmentally safe methods.",
    resource_type: "VIDEO",
    category: "Pest Management",
    source_name: "Krishi Vigyan Kendra",
    source_url: "https://www.youtube.com/watch?v=placeholder-ipm-video",
    state: "PAN_INDIA",
    scope: "PAN_INDIA",
    language: "English",
    is_verified: true,
    duration: "12:45"
  }
];

async function seedKnowledgeResources() {
  console.log("Seeding real knowledge resources...");

  // First, clear existing to avoid duplicates in this demo script
  console.log("Clearing existing resources...");
  const { error: deleteError } = await supabase.database
    .from("knowledge_resources")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all

  if (deleteError) {
    console.error("Error clearing existing resources:", deleteError);
  }

  const { data, error } = await supabase.database
    .from("knowledge_resources")
    .insert(SEED_RESOURCES)
    .select();

  if (error) {
    console.error("Error inserting seed data:", error);
    process.exit(1);
  }

  console.log(`Successfully inserted ${data.length} resources!`);
}

seedKnowledgeResources();
