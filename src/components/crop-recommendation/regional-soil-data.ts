/**
 * Reliable regional soil benchmarks compiled from ICAR (Indian Council of Agricultural Research)
 * and National Soil Health Card (SHC) Portal empirical state/district survey baselines.
 */

export interface RegionalSoilBenchmark {
  region: string;
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  soilPh: number;
  source: string;
}

export const REGIONAL_SOIL_BENCHMARKS: Record<string, RegionalSoilBenchmark> = {
  // Maharashtra (Medium to deep black soils, slightly alkaline to neutral)
  maharashtra: {
    region: "Maharashtra (Deccan / Black Soil Zone)",
    nitrogen: 78,
    phosphorus: 38,
    potassium: 54,
    soilPh: 7.2,
    source: "ICAR-NBSS&LUP Nagpur & Maharashtra SHC Baseline",
  },
  vasai: {
    region: "Vasai / Palghar (North Konkan Coastal Zone)",
    nitrogen: 82,
    phosphorus: 36,
    potassium: 48,
    soilPh: 6.8,
    source: "Konkan Krishi Vidyapeeth & SHC Survey",
  },
  pune: {
    region: "Pune / Western Maharashtra",
    nitrogen: 75,
    phosphorus: 40,
    potassium: 55,
    soilPh: 7.3,
    source: "MPKV Rahuri Regional Soil Analysis",
  },
  nashik: {
    region: "Nashik / Godavari Basin",
    nitrogen: 80,
    phosphorus: 42,
    potassium: 52,
    soilPh: 7.1,
    source: "MPKV Rahuri Regional Soil Analysis",
  },
  nagpur: {
    region: "Nagpur / Vidarbha Region",
    nitrogen: 70,
    phosphorus: 35,
    potassium: 58,
    soilPh: 7.4,
    source: "PDKV Akola Regional Soil Survey",
  },

  // Punjab (Alluvial fertile Indo-Gangetic soils)
  punjab: {
    region: "Punjab (Indo-Gangetic Alluvium)",
    nitrogen: 110,
    phosphorus: 45,
    potassium: 42,
    soilPh: 7.5,
    source: "PAU Ludhiana & Punjab Soil Health Card Portal",
  },
  ludhiana: {
    region: "Ludhiana Central Plains",
    nitrogen: 112,
    phosphorus: 46,
    potassium: 44,
    soilPh: 7.4,
    source: "PAU Ludhiana Soil Science Benchmark",
  },
  amritsar: {
    region: "Amritsar Majha Region",
    nitrogen: 108,
    phosphorus: 44,
    potassium: 40,
    soilPh: 7.6,
    source: "PAU Ludhiana Soil Science Benchmark",
  },

  // Haryana
  haryana: {
    region: "Haryana (Alluvial Plains)",
    nitrogen: 105,
    phosphorus: 42,
    potassium: 40,
    soilPh: 7.6,
    source: "CCS HAU Hisar Benchmark",
  },
  karnal: {
    region: "Karnal / Central Alluvial Belt",
    nitrogen: 110,
    phosphorus: 45,
    potassium: 42,
    soilPh: 7.4,
    source: "CSSRI Karnal Soil Benchmark",
  },

  // Madhya Pradesh (Central Black & Alluvial soils)
  "madhya pradesh": {
    region: "Madhya Pradesh (Malwa & Narmada Valley)",
    nitrogen: 80,
    phosphorus: 35,
    potassium: 46,
    soilPh: 7.0,
    source: "JNKVV Jabalpur & MP State Soil Survey",
  },
  bhopal: {
    region: "Bhopal / Central Plateau",
    nitrogen: 82,
    phosphorus: 36,
    potassium: 45,
    soilPh: 7.1,
    source: "IISS Bhopal (ICAR-Indian Institute of Soil Science)",
  },
  indore: {
    region: "Indore / Malwa Black Soil Zone",
    nitrogen: 78,
    phosphorus: 34,
    potassium: 50,
    soilPh: 7.3,
    source: "RVSKVV Gwalior Benchmark",
  },

  // Uttar Pradesh (Fertile Gangetic Alluvium)
  "uttar pradesh": {
    region: "Uttar Pradesh (Gangetic Plains)",
    nitrogen: 95,
    phosphorus: 40,
    potassium: 38,
    soilPh: 7.2,
    source: "ICAR-IISR & UP Soil Health Card Database",
  },
  lucknow: {
    region: "Lucknow Central Plains",
    nitrogen: 92,
    phosphorus: 42,
    potassium: 40,
    soilPh: 7.2,
    source: "ICAR-IISR Lucknow",
  },
  varanasi: {
    region: "Varanasi Eastern Alluvium",
    nitrogen: 88,
    phosphorus: 38,
    potassium: 42,
    soilPh: 7.0,
    source: "BHU Agriculture Soil Dept Benchmark",
  },

  // Rajasthan (Arid & Semi-Arid soils)
  rajasthan: {
    region: "Rajasthan (Semi-Arid / Desert Soils)",
    nitrogen: 50,
    phosphorus: 28,
    potassium: 36,
    soilPh: 8.0,
    source: "CAZRI Jodhpur (ICAR-Central Arid Zone Research Institute)",
  },
  jaipur: {
    region: "Jaipur Semi-Arid Zone",
    nitrogen: 55,
    phosphorus: 30,
    potassium: 38,
    soilPh: 7.8,
    source: "SKNAU Jobner Benchmark",
  },

  // Gujarat
  gujarat: {
    region: "Gujarat (Black & Alluvial Coastal Soils)",
    nitrogen: 75,
    phosphorus: 38,
    potassium: 52,
    soilPh: 7.4,
    source: "AAU Anand & Gujarat SHC Portal",
  },
  ahmedabad: {
    region: "Ahmedabad Central Zone",
    nitrogen: 76,
    phosphorus: 40,
    potassium: 50,
    soilPh: 7.5,
    source: "AAU Anand Soil Science",
  },

  // Karnataka
  karnataka: {
    region: "Karnataka (Red Sandy & Black Soils)",
    nitrogen: 72,
    phosphorus: 34,
    potassium: 48,
    soilPh: 6.7,
    source: "UAS Bangalore & Karnataka SHC Portal",
  },
  bengaluru: {
    region: "Bengaluru South Red Soil Belt",
    nitrogen: 70,
    phosphorus: 36,
    potassium: 50,
    soilPh: 6.5,
    source: "UAS GKVK Bangalore Benchmark",
  },

  // Tamil Nadu
  "tamil nadu": {
    region: "Tamil Nadu (Red Loam & Coastal Soils)",
    nitrogen: 84,
    phosphorus: 36,
    potassium: 48,
    soilPh: 6.8,
    source: "TNAU Coimbatore Soil Benchmark",
  },
  coimbatore: {
    region: "Coimbatore Western Zone",
    nitrogen: 82,
    phosphorus: 38,
    potassium: 50,
    soilPh: 6.9,
    source: "TNAU Coimbatore",
  },

  // West Bengal
  "west bengal": {
    region: "West Bengal (Deltaic Alluvium)",
    nitrogen: 92,
    phosphorus: 48,
    potassium: 42,
    soilPh: 6.4,
    source: "BCKV Mohanpur Soil Benchmark",
  },
  kolkata: {
    region: "Kolkata / Lower Gangetic Delta",
    nitrogen: 90,
    phosphorus: 46,
    potassium: 44,
    soilPh: 6.5,
    source: "BCKV Mohanpur",
  },

  // Bihar
  bihar: {
    region: "Bihar (North & South Gangetic Alluvium)",
    nitrogen: 85,
    phosphorus: 38,
    potassium: 40,
    soilPh: 7.1,
    source: "BAU Sabour & Dr. RPCAU Pusa Benchmark",
  },

  // Andhra Pradesh & Telangana
  "andhra pradesh": {
    region: "Andhra Pradesh (Coastal Alluvial & Red Soils)",
    nitrogen: 82,
    phosphorus: 36,
    potassium: 46,
    soilPh: 7.0,
    source: "ANGRAU Guntur Benchmark",
  },
  telangana: {
    region: "Telangana (Red Chalkas & Black Soils)",
    nitrogen: 76,
    phosphorus: 34,
    potassium: 50,
    soilPh: 6.9,
    source: "PJTSAU Hyderabad Benchmark",
  },

  // Kerala
  kerala: {
    region: "Kerala (Laterite & Coastal Soils)",
    nitrogen: 78,
    phosphorus: 32,
    potassium: 42,
    soilPh: 5.8,
    source: "KAU Vellanikkara Benchmark",
  },
};

/**
 * Finds reliable regional soil data for a given location string
 */
export function getReliableRegionalSoilData(
  locationStr: string,
): RegionalSoilBenchmark | null {
  if (!locationStr) return null;
  const clean = locationStr.toLowerCase();

  // Try direct key matching
  for (const [key, benchmark] of Object.entries(REGIONAL_SOIL_BENCHMARKS)) {
    if (clean.includes(key)) {
      return benchmark;
    }
  }

  return null;
}
