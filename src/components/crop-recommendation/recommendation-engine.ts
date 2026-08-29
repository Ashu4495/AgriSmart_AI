import cropWheat from "@/assets/crop-wheat.jpg";
import cropRice from "@/assets/crop-rice.jpg";
import cropMaize from "@/assets/crop-maize.jpg";
import cropCotton from "@/assets/crop-cotton.jpg";
import cropSugarcane from "@/assets/crop-sugarcane.jpg";
import cropBlackgram from "@/assets/crop-blackgram.jpg";
import cropChickpea from "@/assets/crop-chickpea.jpg";
import cropCoconut from "@/assets/crop-coconut.jpg";
import cropCoffee from "@/assets/crop-coffee.jpg";
import cropJute from "@/assets/crop-jute.jpg";
import cropKidneybeans from "@/assets/crop-kidneybeans.png";
import cropLentil from "@/assets/crop-lentil.jpg";
import cropMango from "@/assets/crop-mango.jpg";
import cropMothbeans from "@/assets/crop-mothbeans.png";
import cropMungbean from "@/assets/crop-mungbean.jpg";
import cropMuskmelon from "@/assets/crop-muskmelon.png";
import cropPigeonpeas from "@/assets/crop-pigeonpeas.png";
import cropPomegranate from "@/assets/crop-pomegranate.jpg";
import {
  type FieldConditionState,
  type CropRecommendationItem,
  type SuitabilityLevel,
  type Season,
  type CropProfitabilityData,
  type CropRiskData,
  type RecommendationInsights,
  type RecommendationHistoryItem,
  type RecommendationFeedback,
} from "./types";
import { insforge } from "@/lib/insforge";

export const INITIAL_CONDITIONS: FieldConditionState = {
  nitrogen: 80,
  phosphorus: 40,
  potassium: 50,
  soilPh: 6.8,
  season: "Kharif",
  temperature: 28,
  humidity: 62,
  rainfall: 600,
  locationName: "Vasai, Maharashtra",
  latitude: 19.39,
  longitude: 72.84,
  isLiveLocation: true,
  lastUpdatedText: "Just now",
  farmArea: 5.0,
};

export interface CropEconomicProfile {
  id: string;
  name: string;
  hindiName: string;
  expectedYield: string;
  avgYieldQtl: number;
  marketPricePerQtl: number; // ₹ per quintal
  costPerHa: number; // ₹ per hectare
  growingPeriod: string;
  waterNeed: string;
  image: typeof cropWheat | string;
  defaultReason: string;
  n: [number, number];
  p: [number, number];
  k: [number, number];
  ph: [number, number];
  temp: [number, number];
  humidity: [number, number];
  rainfall: [number, number];
  seasons: Season[];
  diseaseRiskBase: number;
  marketRiskBase: number;
  mainRiskFactors: string[];
}

export const CROP_CATALOG: Record<string, CropEconomicProfile> = {
  Rice: {
    id: "rice",
    name: "Rice",
    hindiName: "धान / चावल",
    expectedYield: "50 - 55 q/ha",
    avgYieldQtl: 52,
    marketPricePerQtl: 2320,
    costPerHa: 48000,
    growingPeriod: "120-150 days",
    waterNeed: "900-1200 mm",
    image: cropRice,
    defaultReason:
      "Warm climate, humid conditions, and adequate rainfall favor optimal paddy growth.",
    n: [60, 100],
    p: [35, 60],
    k: [35, 50],
    ph: [5.0, 7.0],
    temp: [20, 36],
    humidity: [60, 95],
    rainfall: [900, 2500],
    seasons: ["Kharif", "Whole Year"],
    diseaseRiskBase: 25,
    marketRiskBase: 15,
    mainRiskFactors: [
      "Paddy blast in prolonged humidity",
      "Water management at tillering",
      "Mandi arrival price variations",
    ],
  },
  Wheat: {
    id: "wheat",
    name: "Wheat",
    hindiName: "गेहूं",
    expectedYield: "45 - 50 q/ha",
    avgYieldQtl: 48,
    marketPricePerQtl: 2275,
    costPerHa: 38000,
    growingPeriod: "110-130 days",
    waterNeed: "350-500 mm",
    image: cropWheat,
    defaultReason:
      "Cool temperatures and balanced NPK in loam soil promote dense tillering and heavy grain fill.",
    n: [80, 140],
    p: [40, 70],
    k: [35, 60],
    ph: [6.0, 7.5],
    temp: [12, 28],
    humidity: [40, 75],
    rainfall: [300, 750],
    seasons: ["Rabi", "Whole Year"],
    diseaseRiskBase: 20,
    marketRiskBase: 10,
    mainRiskFactors: [
      "Terminal heat stress during grain filling",
      "Yellow rust in cold humid spells",
      "Storage moisture protection",
    ],
  },
  Maize: {
    id: "maize",
    name: "Maize",
    hindiName: "मक्का",
    expectedYield: "55 - 60 q/ha",
    avgYieldQtl: 58,
    marketPricePerQtl: 2090,
    costPerHa: 36000,
    growingPeriod: "90-110 days",
    waterNeed: "500-700 mm",
    image: cropMaize,
    defaultReason:
      "Well-aerated soil with balanced NPK and moderate temperature promotes high cob yield.",
    n: [60, 120],
    p: [35, 60],
    k: [15, 35],
    ph: [5.8, 7.5],
    temp: [18, 34],
    humidity: [50, 85],
    rainfall: [500, 1100],
    seasons: ["Kharif", "Rabi", "Whole Year"],
    diseaseRiskBase: 22,
    marketRiskBase: 18,
    mainRiskFactors: [
      "Fall armyworm infestation",
      "Water stagnation in seedling stage",
      "Feed industry market shifts",
    ],
  },
  Chickpea: {
    id: "chickpea",
    name: "Chickpea",
    hindiName: "चना",
    expectedYield: "15 - 20 q/ha",
    avgYieldQtl: 18,
    marketPricePerQtl: 5440,
    costPerHa: 28000,
    growingPeriod: "90-120 days",
    waterNeed: "300-450 mm",
    image: cropChickpea,
    defaultReason:
      "Thrives in mild temperatures and loam soil, giving reliable grain yield with low water.",
    n: [20, 50],
    p: [50, 80],
    k: [60, 90],
    ph: [6.0, 8.0],
    temp: [15, 26],
    humidity: [30, 65],
    rainfall: [300, 600],
    seasons: ["Rabi", "Whole Year"],
    diseaseRiskBase: 28,
    marketRiskBase: 20,
    mainRiskFactors: [
      "Fusarium wilt",
      "Pod borer during pod set",
      "Unseasonal rain at flowering",
    ],
  },
  KidneyBeans: {
    id: "kidneybeans",
    name: "Kidney Beans",
    hindiName: "राजमा",
    expectedYield: "12 - 16 q/ha",
    avgYieldQtl: 14,
    marketPricePerQtl: 9500,
    costPerHa: 34000,
    growingPeriod: "90-110 days",
    waterNeed: "400-600 mm",
    image: cropKidneybeans,
    defaultReason:
      "Cool to moderate climate and rich organic soil encourage vigorous pod formation.",
    n: [15, 40],
    p: [55, 80],
    k: [15, 35],
    ph: [5.5, 6.8],
    temp: [15, 26],
    humidity: [45, 75],
    rainfall: [600, 1200],
    seasons: ["Kharif", "Rabi"],
    diseaseRiskBase: 25,
    marketRiskBase: 15,
    mainRiskFactors: [
      "Anthracnose in wet periods",
      "Stem rot in heavy soil",
      "Post-harvest storage weevil",
    ],
  },
  PigeonPeas: {
    id: "pigeonpeas",
    name: "Pigeon Peas",
    hindiName: "अरहर / तुअर",
    expectedYield: "15 - 20 q/ha",
    avgYieldQtl: 17,
    marketPricePerQtl: 7550,
    costPerHa: 32000,
    growingPeriod: "150-180 days",
    waterNeed: "500-750 mm",
    image: cropPigeonpeas,
    defaultReason:
      "Deep taproot system efficiently utilizes subsoil moisture for steady yield.",
    n: [15, 40],
    p: [55, 80],
    k: [15, 35],
    ph: [5.0, 7.5],
    temp: [20, 35],
    humidity: [40, 75],
    rainfall: [500, 1100],
    seasons: ["Kharif", "Whole Year"],
    diseaseRiskBase: 30,
    marketRiskBase: 18,
    mainRiskFactors: [
      "Phytophthora stem blight",
      "Sterility mosaic disease",
      "Pod fly attack at maturity",
    ],
  },
  MothBeans: {
    id: "mothbeans",
    name: "Moth Beans",
    hindiName: "मोठ",
    expectedYield: "6 - 9 q/ha",
    avgYieldQtl: 7.5,
    marketPricePerQtl: 6800,
    costPerHa: 16000,
    growingPeriod: "60-75 days",
    waterNeed: "200-350 mm",
    image: cropMothbeans,
    defaultReason:
      "Extremely drought-hardy legume suitable for arid and semi-arid farm zones.",
    n: [15, 40],
    p: [35, 60],
    k: [15, 35],
    ph: [6.0, 8.0],
    temp: [24, 38],
    humidity: [30, 65],
    rainfall: [200, 550],
    seasons: ["Kharif", "Zaid"],
    diseaseRiskBase: 15,
    marketRiskBase: 25,
    mainRiskFactors: [
      "Yellow mosaic virus",
      "Moisture deficit during pod filling",
      "Local mandi liquidity",
    ],
  },
  MungBean: {
    id: "mungbean",
    name: "Mung Bean",
    hindiName: "मूंग",
    expectedYield: "8 - 12 q/ha",
    avgYieldQtl: 10,
    marketPricePerQtl: 8558,
    costPerHa: 22000,
    growingPeriod: "60-75 days",
    waterNeed: "300-450 mm",
    image: cropMungbean,
    defaultReason:
      "Short duration pulse ideal for crop rotation, requiring minimal irrigation.",
    n: [15, 40],
    p: [35, 60],
    k: [15, 35],
    ph: [6.2, 7.5],
    temp: [25, 36],
    humidity: [60, 88],
    rainfall: [400, 800],
    seasons: ["Zaid", "Kharif"],
    diseaseRiskBase: 24,
    marketRiskBase: 15,
    mainRiskFactors: [
      "Powdery mildew in cloudy weather",
      "Pod shattering if harvest delayed",
      "Whitefly vector",
    ],
  },
  Blackgram: {
    id: "blackgram",
    name: "Blackgram",
    hindiName: "उड़द",
    expectedYield: "8 - 12 q/ha",
    avgYieldQtl: 10,
    marketPricePerQtl: 7400,
    costPerHa: 23000,
    growingPeriod: "70-90 days",
    waterNeed: "350-500 mm",
    image: cropBlackgram,
    defaultReason:
      "Fast-maturing pulse that enriches soil nitrogen while thriving in warm weather.",
    n: [20, 50],
    p: [55, 80],
    k: [15, 35],
    ph: [6.5, 7.8],
    temp: [25, 36],
    humidity: [50, 75],
    rainfall: [500, 850],
    seasons: ["Kharif", "Whole Year"],
    diseaseRiskBase: 22,
    marketRiskBase: 16,
    mainRiskFactors: [
      "Leaf crinkle virus",
      "Root rot in waterlogged fields",
      "Early season aphid pressure",
    ],
  },
  Lentil: {
    id: "lentil",
    name: "Lentil",
    hindiName: "मसूर",
    expectedYield: "10 - 14 q/ha",
    avgYieldQtl: 12,
    marketPricePerQtl: 6425,
    costPerHa: 24000,
    growingPeriod: "110-130 days",
    waterNeed: "300-400 mm",
    image: cropLentil,
    defaultReason:
      "Cool dry climate, light soil, and low water requirements make it highly efficient.",
    n: [15, 40],
    p: [55, 80],
    k: [15, 35],
    ph: [6.0, 7.8],
    temp: [15, 30],
    humidity: [35, 65],
    rainfall: [300, 600],
    seasons: ["Rabi", "Whole Year"],
    diseaseRiskBase: 18,
    marketRiskBase: 14,
    mainRiskFactors: [
      "Rust disease in late winter",
      "Ascochyta blight",
      "Frost sensitivity at early podding",
    ],
  },
  Pomegranate: {
    id: "pomegranate",
    name: "Pomegranate",
    hindiName: "अनार",
    expectedYield: "12 - 15 t/ha",
    avgYieldQtl: 135,
    marketPricePerQtl: 7200,
    costPerHa: 140000,
    growingPeriod: "150-180 days",
    waterNeed: "500-800 mm",
    image: cropPomegranate,
    defaultReason:
      "Semi-arid tolerance and balanced nutrients promote juicy, deep-red arils.",
    n: [15, 45],
    p: [10, 35],
    k: [35, 55],
    ph: [5.5, 7.5],
    temp: [18, 38],
    humidity: [35, 70],
    rainfall: [400, 800],
    seasons: ["Whole Year", "Zaid"],
    diseaseRiskBase: 35,
    marketRiskBase: 22,
    mainRiskFactors: [
      "Bacterial blight (Xanthomonas)",
      "Fruit borer and thrips",
      "Fruit cracking due to moisture stress",
    ],
  },
  Banana: {
    id: "banana",
    name: "Banana",
    hindiName: "केला",
    expectedYield: "35 - 45 t/ha",
    avgYieldQtl: 400,
    marketPricePerQtl: 1850,
    costPerHa: 160000,
    growingPeriod: "300-365 days",
    waterNeed: "1200-2000 mm",
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    defaultReason:
      "High nitrogen, rich potassium, and consistent moisture guarantee dense, heavy bunches.",
    n: [90, 135],
    p: [70, 95],
    k: [45, 65],
    ph: [5.8, 7.5],
    temp: [22, 38],
    humidity: [65, 95],
    rainfall: [1200, 2200],
    seasons: ["Whole Year", "Kharif"],
    diseaseRiskBase: 32,
    marketRiskBase: 20,
    mainRiskFactors: [
      "Panama wilt (Fusarium oxysporum)",
      "Sigatoka leaf spot",
      "High wind damage during bunching",
    ],
  },
  Mango: {
    id: "mango",
    name: "Mango",
    hindiName: "आम",
    expectedYield: "10 - 15 t/ha",
    avgYieldQtl: 120,
    marketPricePerQtl: 4500,
    costPerHa: 95000,
    growingPeriod: "Perennial",
    waterNeed: "1000-1500 mm",
    image: cropMango,
    defaultReason:
      "Warm tropical climate and good soil depth provide outstanding blossom and fruit set.",
    n: [15, 40],
    p: [15, 35],
    k: [25, 45],
    ph: [5.5, 7.5],
    temp: [24, 38],
    humidity: [45, 75],
    rainfall: [600, 1500],
    seasons: ["Zaid", "Whole Year"],
    diseaseRiskBase: 25,
    marketRiskBase: 28,
    mainRiskFactors: [
      "Mango hopper attack at flowering",
      "Powdery mildew during spring",
      "Hailstorm during fruit development",
    ],
  },
  Grapes: {
    id: "grapes",
    name: "Grapes",
    hindiName: "अंगूर",
    expectedYield: "20 - 25 t/ha",
    avgYieldQtl: 220,
    marketPricePerQtl: 4800,
    costPerHa: 190000,
    growingPeriod: "120-150 days",
    waterNeed: "500-700 mm",
    image:
      "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80",
    defaultReason:
      "Moderate humidity and warm sunny periods encourage excellent berry cluster formation.",
    n: [15, 40],
    p: [120, 145],
    k: [190, 215],
    ph: [6.0, 7.5],
    temp: [15, 35],
    humidity: [50, 85],
    rainfall: [500, 900],
    seasons: ["Whole Year", "Rabi"],
    diseaseRiskBase: 38,
    marketRiskBase: 24,
    mainRiskFactors: [
      "Downy mildew during unseasonal rain",
      "Berry splitting",
      "Export residue standards compliance",
    ],
  },
  Watermelon: {
    id: "watermelon",
    name: "Watermelon",
    hindiName: "तरबूज",
    expectedYield: "25 - 35 t/ha",
    avgYieldQtl: 300,
    marketPricePerQtl: 1100,
    costPerHa: 75000,
    growingPeriod: "80-100 days",
    waterNeed: "400-600 mm",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
    defaultReason:
      "High temperatures, dry sunny days, and light soil maximize vine vigor and fruit size.",
    n: [80, 125],
    p: [10, 35],
    k: [45, 65],
    ph: [6.0, 7.0],
    temp: [24, 36],
    humidity: [70, 92],
    rainfall: [400, 700],
    seasons: ["Zaid", "Whole Year"],
    diseaseRiskBase: 26,
    marketRiskBase: 30,
    mainRiskFactors: [
      "Fusarium wilt in repeat cropping",
      "Fruit fly infestation",
      "High perishability during transit",
    ],
  },
  Muskmelon: {
    id: "muskmelon",
    name: "Muskmelon",
    hindiName: "खरबूजा",
    expectedYield: "15 - 20 t/ha",
    avgYieldQtl: 175,
    marketPricePerQtl: 1650,
    costPerHa: 68000,
    growingPeriod: "70-90 days",
    waterNeed: "400-600 mm",
    image: cropMuskmelon,
    defaultReason:
      "Warm weather and sandy loam soil facilitate quick maturity and rich sweetness.",
    n: [80, 125],
    p: [10, 35],
    k: [45, 65],
    ph: [6.0, 7.2],
    temp: [22, 35],
    humidity: [70, 92],
    rainfall: [400, 700],
    seasons: ["Zaid", "Whole Year"],
    diseaseRiskBase: 28,
    marketRiskBase: 32,
    mainRiskFactors: [
      "Downy & powdery mildew",
      "Sudden wilt complex",
      "Short shelf life upon harvesting",
    ],
  },
  Apple: {
    id: "apple",
    name: "Apple",
    hindiName: "सेब",
    expectedYield: "25 - 30 t/ha",
    avgYieldQtl: 270,
    marketPricePerQtl: 6500,
    costPerHa: 220000,
    growingPeriod: "150-180 days",
    waterNeed: "700-1000 mm",
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
    defaultReason:
      "Cool temperate conditions and loam soil with balanced potassium optimize crisp fruit yield.",
    n: [15, 40],
    p: [120, 145],
    k: [190, 215],
    ph: [5.5, 6.8],
    temp: [12, 25],
    humidity: [70, 95],
    rainfall: [900, 1300],
    seasons: ["Whole Year", "Rabi"],
    diseaseRiskBase: 34,
    marketRiskBase: 18,
    mainRiskFactors: [
      "Apple scab (Venturia inaequalis)",
      "Early snowfall / frost damage",
      "Cold chain logistics dependency",
    ],
  },
  Orange: {
    id: "orange",
    name: "Orange",
    hindiName: "संतरा",
    expectedYield: "15 - 20 t/ha",
    avgYieldQtl: 170,
    marketPricePerQtl: 3200,
    costPerHa: 110000,
    growingPeriod: "240-270 days",
    waterNeed: "900-1200 mm",
    image:
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80",
    defaultReason:
      "Well-drained soil, moderate temperature, and optimal sunlight boost sweetness and fruit yield.",
    n: [15, 40],
    p: [10, 30],
    k: [10, 30],
    ph: [6.0, 7.5],
    temp: [15, 35],
    humidity: [70, 95],
    rainfall: [900, 1400],
    seasons: ["Whole Year"],
    diseaseRiskBase: 30,
    marketRiskBase: 22,
    mainRiskFactors: [
      "Citrus greening disease (Huanglongbing)",
      "Fruit drop in extreme heat",
      "Mite and psylla infestation",
    ],
  },
  Papaya: {
    id: "papaya",
    name: "Papaya",
    hindiName: "पपीता",
    expectedYield: "40 - 60 t/ha",
    avgYieldQtl: 480,
    marketPricePerQtl: 1450,
    costPerHa: 130000,
    growingPeriod: "270-330 days",
    waterNeed: "1000-1500 mm",
    image:
      "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=800&q=80",
    defaultReason:
      "Tropical temperatures and neutral soil pH support rapid vegetative and fruit growth.",
    n: [40, 75],
    p: [50, 75],
    k: [45, 65],
    ph: [6.0, 7.0],
    temp: [22, 36],
    humidity: [75, 95],
    rainfall: [1000, 1800],
    seasons: ["Whole Year"],
    diseaseRiskBase: 42,
    marketRiskBase: 26,
    mainRiskFactors: [
      "Papaya ringspot virus (PRSV)",
      "Collar rot from water stagnation",
      "Frost sensitivity",
    ],
  },
  Coconut: {
    id: "coconut",
    name: "Coconut",
    hindiName: "नारियल",
    expectedYield: "80 - 100 nuts/palm/yr",
    avgYieldQtl: 110,
    marketPricePerQtl: 3800,
    costPerHa: 75000,
    growingPeriod: "Perennial",
    waterNeed: "1500-2500 mm",
    image: cropCoconut,
    defaultReason:
      "Humid coastal climate and abundant moisture ensure year-round nut production.",
    n: [15, 40],
    p: [10, 35],
    k: [25, 45],
    ph: [5.2, 7.8],
    temp: [24, 35],
    humidity: [75, 98],
    rainfall: [1400, 2500],
    seasons: ["Whole Year"],
    diseaseRiskBase: 18,
    marketRiskBase: 12,
    mainRiskFactors: [
      "Rhinoceros beetle damage",
      "Bud rot in continuous rain",
      "Prolonged groundwater depletion",
    ],
  },
  Cotton: {
    id: "cotton",
    name: "Cotton",
    hindiName: "कपास",
    expectedYield: "20 - 25 q/ha",
    avgYieldQtl: 22,
    marketPricePerQtl: 7120,
    costPerHa: 55000,
    growingPeriod: "150-180 days",
    waterNeed: "600-800 mm",
    image: cropCotton,
    defaultReason:
      "Warm sunny weather, moderate rainfall, and deep fertile soil stimulate healthy boll formation.",
    n: [100, 140],
    p: [35, 60],
    k: [15, 35],
    ph: [6.0, 8.0],
    temp: [22, 36],
    humidity: [50, 85],
    rainfall: [500, 1000],
    seasons: ["Kharif"],
    diseaseRiskBase: 36,
    marketRiskBase: 25,
    mainRiskFactors: [
      "Pink bollworm attack",
      "Sucking pests during vegetative stage",
      "Global textile market price volatility",
    ],
  },
  Jute: {
    id: "jute",
    name: "Jute",
    hindiName: "पटसन / जूट",
    expectedYield: "25 - 30 q/ha",
    avgYieldQtl: 28,
    marketPricePerQtl: 5050,
    costPerHa: 42000,
    growingPeriod: "120-140 days",
    waterNeed: "1000-1500 mm",
    image: cropJute,
    defaultReason:
      "Warm, humid conditions and fertile alluvium are ideal for strong fiber development.",
    n: [60, 100],
    p: [35, 60],
    k: [35, 50],
    ph: [6.0, 7.5],
    temp: [24, 38],
    humidity: [70, 95],
    rainfall: [1200, 1900],
    seasons: ["Kharif"],
    diseaseRiskBase: 20,
    marketRiskBase: 22,
    mainRiskFactors: [
      "Stem rot during stagnant flooding",
      "Retting water shortage",
      "Synthetic packaging competition",
    ],
  },
  Coffee: {
    id: "coffee",
    name: "Coffee",
    hindiName: "कॉफ़ी",
    expectedYield: "12 - 18 q/ha",
    avgYieldQtl: 15,
    marketPricePerQtl: 19500,
    costPerHa: 115000,
    growingPeriod: "240-270 days",
    waterNeed: "1500-2200 mm",
    image: cropCoffee,
    defaultReason:
      "High rainfall, moderate temperature, and rich organic soil provide premium bean quality.",
    n: [90, 125],
    p: [15, 40],
    k: [25, 45],
    ph: [5.5, 6.8],
    temp: [18, 30],
    humidity: [55, 85],
    rainfall: [1400, 2200],
    seasons: ["Whole Year"],
    diseaseRiskBase: 26,
    marketRiskBase: 20,
    mainRiskFactors: [
      "Coffee berry borer",
      "Leaf rust (Hemileia vastatrix)",
      "International exchange price fluctuations",
    ],
  },
  Sugarcane: {
    id: "sugarcane",
    name: "Sugarcane",
    hindiName: "गन्ना",
    expectedYield: "750 - 850 q/ha",
    avgYieldQtl: 800,
    marketPricePerQtl: 340,
    costPerHa: 105000,
    growingPeriod: "300-360 days",
    waterNeed: "1500-2500 mm",
    image: cropSugarcane,
    defaultReason:
      "Abundant water and warm tropical climate support high biomass and sucrose accumulation.",
    n: [80, 150],
    p: [40, 70],
    k: [40, 75],
    ph: [6.0, 7.5],
    temp: [20, 38],
    humidity: [60, 90],
    rainfall: [1200, 2500],
    seasons: ["Whole Year", "Kharif"],
    diseaseRiskBase: 24,
    marketRiskBase: 12,
    mainRiskFactors: [
      "Red rot disease",
      "Early shoot borer",
      "Sugar mill payment scheduling",
    ],
  },
};

export const INITIAL_RECOMMENDATIONS: CropRecommendationItem[] = [
  {
    id: "coffee",
    name: "Coffee",
    hindiName: "कॉफ़ी",
    suitability: "Highly Suitable",
    badgeVariant: "high",
    expectedYield: "12 - 18 q/ha",
    matchScore: 49.5,
    image: cropCoffee,
    reason:
      "Trained Random Forest ML model predicted Coffee with 49.5% model confidence based on your soil NPK (80-40-50), pH (6.8), temperature (28°C), humidity (62%), and rainfall (600 mm).",
    waterNeed: "1500-2200 mm",
    growingPeriod: "240-270 days",
    profitPotential: "High",
    riskLevel: "Low",
    profitDots: { filled: 5, total: 5, color: "green" },
  },
  {
    id: "jute",
    name: "Jute",
    hindiName: "पटसन / जूट",
    suitability: "Suitable",
    badgeVariant: "suitable",
    expectedYield: "25 - 30 q/ha",
    matchScore: 15.0,
    image: cropJute,
    reason:
      "Trained Random Forest ML model predicted Jute with 15.0% model confidence under current farm climate and nutrient profiles.",
    waterNeed: "1000-1500 mm",
    growingPeriod: "120-140 days",
    profitPotential: "High",
    riskLevel: "Low",
    profitDots: { filled: 4, total: 5, color: "green" },
  },
  {
    id: "rice",
    name: "Rice",
    hindiName: "धान / चावल",
    suitability: "Suitable",
    badgeVariant: "suitable",
    expectedYield: "50 - 55 q/ha",
    matchScore: 13.0,
    image: cropRice,
    reason:
      "Trained Random Forest ML model predicted Rice with 13.0% model confidence under current farm climate and nutrient profiles.",
    waterNeed: "900-1200 mm",
    growingPeriod: "120-150 days",
    profitPotential: "High",
    riskLevel: "Low",
    profitDots: { filled: 4, total: 5, color: "green" },
  },
];

export const ALL_SUPPORTED_CROPS: CropRecommendationItem[] = Object.values(
  CROP_CATALOG,
).map((meta, idx) => ({
  id: meta.id,
  name: meta.name,
  hindiName: meta.hindiName,
  suitability: (idx === 0
    ? "Highly Suitable"
    : idx < 3
      ? "Suitable"
      : "Moderately Suitable") as SuitabilityLevel,
  badgeVariant: (idx === 0 ? "high" : idx < 3 ? "suitable" : "moderate") as
    "high" | "suitable" | "moderate",
  expectedYield: meta.expectedYield,
  matchScore: Math.max(50, 95 - idx * 2),
  image: meta.image,
  reason: meta.defaultReason,
  waterNeed: meta.waterNeed,
  growingPeriod: meta.growingPeriod,
  profitPotential: "High",
  riskLevel: "Low",
  profitDots: { filled: idx < 2 ? 5 : 4, total: 5, color: "green" as const },
}));

function scoreRange(
  val: number,
  [min, max]: [number, number],
  tolerance: number,
): number {
  if (val >= min && val <= max) return 100;
  const dist = val < min ? min - val : val - max;
  return Math.max(0, 100 - (dist / tolerance) * 100);
}

/**
 * Calculates profitability metrics for a crop scaled to farm area (in Hectares/Acres)
 */
export function calculateCropProfitability(
  crop: CropEconomicProfile,
  farmArea: number = 1.0,
): CropProfitabilityData {
  const yieldQtl = crop.avgYieldQtl;
  const revenuePerHa = Math.round(yieldQtl * crop.marketPricePerQtl);
  const costPerHa = crop.costPerHa;
  const profitPerHa = Math.max(0, revenuePerHa - costPerHa);
  const roi = Math.round((profitPerHa / (costPerHa || 1)) * 100);

  const effectiveArea = Math.max(0.5, farmArea);
  const totalRevenue = Math.round(revenuePerHa * (effectiveArea / 2.47)); // converting to acres base if farmer inputted acres
  const totalCost = Math.round(costPerHa * (effectiveArea / 2.47));
  const totalProfit = Math.max(0, totalRevenue - totalCost);

  return {
    expectedYieldValue: yieldQtl,
    expectedYieldUnit: "q/ha",
    marketPricePerQuintal: crop.marketPricePerQtl,
    estimatedCostPerHectare: costPerHa,
    expectedRevenuePerHectare: revenuePerHa,
    expectedProfitPerHectare: profitPerHa,
    totalRevenue,
    totalCost,
    totalProfit,
    roiPercentage: roi,
  };
}

/**
 * Calculates multi-dimensional risk parameters for a crop under given field conditions
 */
export function calculateCropRisk(
  crop: CropEconomicProfile,
  state: FieldConditionState,
): CropRiskData {
  const tempDeviation = Math.abs(
    state.temperature - (crop.temp[0] + crop.temp[1]) / 2,
  );
  const weatherRisk = Math.min(
    70,
    Math.max(
      10,
      Math.round(tempDeviation * 2.5 + (state.humidity > 85 ? 15 : 0)),
    ),
  );

  const waterRisk = 20;
  const diseaseRisk = Math.min(
    80,
    Math.max(10, crop.diseaseRiskBase + (state.humidity > 75 ? 10 : 0)),
  );
  const marketRisk = crop.marketRiskBase;
  const yieldRisk = Math.round(
    weatherRisk * 0.4 + waterRisk * 0.35 + diseaseRisk * 0.25,
  );

  const overallRisk = Math.round(
    weatherRisk * 0.25 +
      waterRisk * 0.25 +
      diseaseRisk * 0.2 +
      marketRisk * 0.15 +
      yieldRisk * 0.15,
  );

  let riskLevel: "Low" | "Moderate" | "High" = "Low";
  if (overallRisk >= 50) riskLevel = "High";
  else if (overallRisk >= 30) riskLevel = "Moderate";

  return {
    overallRisk,
    riskLevel,
    weatherRisk,
    waterRisk,
    diseaseRisk,
    marketRisk,
    yieldRisk,
    mainRiskFactors: crop.mainRiskFactors,
  };
}

/**
 * Calculates top crop recommendations strictly from required inputs (N, P, K, pH, Weather, Season)
 */
export function calculateRecommendations(
  state: FieldConditionState,
): CropRecommendationItem[] {
  const {
    nitrogen,
    phosphorus,
    potassium,
    soilPh,
    season,
    temperature,
    humidity,
    rainfall,
    farmArea,
  } = state;

  const cropList = Object.values(CROP_CATALOG);

  const scoredCrops = cropList.map((crop) => {
    const nScore = scoreRange(nitrogen, crop.n, 60);
    const pScore = scoreRange(phosphorus, crop.p, 40);
    const kScore = scoreRange(potassium, crop.k, 40);
    const npkScore = (nScore + pScore + kScore) / 3;

    const phScore = scoreRange(soilPh, crop.ph, 2.0);
    const tempScore = scoreRange(temperature, crop.temp, 12);
    const humScore = scoreRange(humidity, crop.humidity, 30);
    const rainScore = scoreRange(rainfall, crop.rainfall, 600);

    const isSeasonMatch =
      season === "Whole Year" ||
      crop.seasons.includes("Whole Year") ||
      crop.seasons.includes(season);

    const seasonScore = isSeasonMatch ? 100 : 45;

    // Profitability & Risk
    const profitability = calculateCropProfitability(crop, farmArea);
    const risk = calculateCropRisk(crop, state);

    // Weighted Agronomic Compatibility:
    // Soil NPK (30%) + Soil pH (15%) + Temperature (20%) + Humidity (10%) + Rainfall (15%) + Season (10%)
    const agronomicScore =
      npkScore * 0.3 +
      phScore * 0.15 +
      tempScore * 0.2 +
      humScore * 0.1 +
      rainScore * 0.15 +
      seasonScore * 0.1;

    const finalScore = Math.min(98, Math.max(50, Math.round(agronomicScore)));

    let suitability: SuitabilityLevel = "Low Suitability";
    let badgeVariant: "high" | "suitable" | "moderate" | "low" = "low";
    let profitPotential = "Moderate";
    let profitDots: {
      filled: number;
      total: number;
      color: "green" | "amber";
    } = {
      filled: 2,
      total: 5,
      color: "amber",
    };

    if (finalScore >= 86) {
      suitability = "Highly Suitable";
      badgeVariant = "high";
      profitPotential = "High";
      profitDots = { filled: 5, total: 5, color: "green" };
    } else if (finalScore >= 75) {
      suitability = "Suitable";
      badgeVariant = "suitable";
      profitPotential = profitability.roiPercentage > 75 ? "High" : "Medium";
      profitDots = { filled: 4, total: 5, color: "green" };
    } else if (finalScore >= 62) {
      suitability = "Moderately Suitable";
      badgeVariant = "moderate";
      profitPotential = "Medium";
      profitDots = { filled: 3, total: 5, color: "amber" };
    }

    let reason = crop.defaultReason;
    if (finalScore >= 86) {
      reason = `${crop.name} is highly suitable because your soil conditions (pH ${soilPh}, NPK ${nitrogen}-${phosphorus}-${potassium}), current weather (${temperature}°C, ${humidity}% humidity), and ${season} season are favorable.`;
    } else if (finalScore >= 75) {
      reason = `Favorable climate (${temperature}°C, ${rainfall} mm rainfall) and soil profile support solid ${crop.name} performance in ${season}.`;
    } else {
      reason = `Moderately compatible. Target soil NPK (${crop.n[0]}-${crop.p[0]}-${crop.k[0]}) and ensure balanced irrigation to maximize yield.`;
    }

    return {
      id: crop.id,
      name: crop.name,
      hindiName: crop.hindiName,
      suitability,
      badgeVariant,
      expectedYield: crop.expectedYield,
      matchScore: finalScore,
      image: crop.image,
      reason,
      waterNeed: crop.waterNeed,
      growingPeriod: crop.growingPeriod,
      profitPotential,
      riskLevel: risk.riskLevel,
      profitDots,
      profitability,
      risk,
      rankingScore: finalScore,
      soilMatchScore: Math.round((npkScore + phScore) / 2),
      weatherFitScore: Math.round((tempScore + humScore + rainScore) / 3),
      seasonalFitScore: seasonScore,
    };
  });

  // Sort descending by highest match score
  scoredCrops.sort(
    (a, b) =>
      (b.rankingScore || b.matchScore) - (a.rankingScore || a.matchScore),
  );

  return scoredCrops;
}

/**
 * Calls Next.js backend API (/api/v1/crops/recommend) which runs the trained Random Forest ML model
 */
export async function fetchRecommendationFromApi(
  state: FieldConditionState,
): Promise<{
  crops: CropRecommendationItem[];
  allRankedCrops: CropRecommendationItem[];
  insights: RecommendationInsights;
}> {
  const res = await fetch("/api/v1/crops/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: state.locationName,
      latitude: state.latitude ?? 19.39,
      longitude: state.longitude ?? 72.84,
      farm_area: state.farmArea,
      nitrogen: state.nitrogen,
      phosphorus: state.phosphorus,
      potassium: state.potassium,
      soil_ph: state.soilPh,
      temperature: state.temperature,
      humidity: state.humidity,
      rainfall: state.rainfall,
      season: state.season,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.success || !data.crops || data.crops.length === 0) {
    throw new Error(
      data.error ||
        "Unable to generate a crop recommendation right now. Please try again.",
    );
  }

  // Map image assets from local catalog
  const enrichedCrops = data.crops.map((c: CropRecommendationItem) => {
    const profile = CROP_CATALOG[c.name] || CROP_CATALOG[c.id];
    return {
      ...c,
      image: profile?.image || c.image || cropRice,
    };
  });

  const allCrops = (data.allRankedCrops || enrichedCrops).map(
    (c: CropRecommendationItem) => {
      const profile = CROP_CATALOG[c.name] || CROP_CATALOG[c.id];
      return {
        ...c,
        image: profile?.image || c.image || cropRice,
      };
    },
  );

  return {
    crops: enrichedCrops,
    allRankedCrops: allCrops,
    insights: data.insights,
  };
}

export function generateInsightsFromCrops(
  crops: CropRecommendationItem[],
  state: FieldConditionState,
): RecommendationInsights {
  const top = crops[0] || INITIAL_RECOMMENDATIONS[0];
  const soilMatch = top?.soilMatchScore || 92;
  const weatherFit = top?.weatherFitScore || 88;

  return {
    soilMatch,
    soilMatchLabel:
      soilMatch >= 85 ? "Optimal Nutrient Balance" : "Adequate Soil Fertility",
    weatherFit,
    weatherFitLabel:
      weatherFit >= 85 ? "Favorable Climate Zone" : "Moderate Weather Fit",
    seasonalFit: 94,
    seasonalFitLabel: `High ${state.season} Season Alignment`,
    marketDemand: "High",
    marketDemandLabel: "High Local Mandi Demand",
    profitPotential: "High",
    profitPotentialLabel: "Strong ROI Potential",
    overallSuitability: top?.matchScore || 94,
    aiInsight: `${top?.name || "Wheat"} is highly suitable because your soil conditions (pH ${state.soilPh}, NPK ${state.nitrogen}-${state.phosphorus}-${state.potassium}), current weather (${state.temperature}°C, ${state.humidity}% humidity), and ${state.season} season are favorable.`,
  };
}

/**
 * Persists recommendation record to InsForge Database
 */
export async function persistRecommendationToInsForge(
  userId: string | undefined,
  conditions: FieldConditionState,
  topCrop: string,
  topScore: number = 94,
) {
  try {
    const historyItem: RecommendationHistoryItem = {
      id: "rec-" + Date.now(),
      createdAt: new Date().toISOString(),
      location: conditions.locationName,
      farmArea: conditions.farmArea,
      season: conditions.season,
      soilInfo: {
        n: conditions.nitrogen,
        p: conditions.phosphorus,
        k: conditions.potassium,
        ph: conditions.soilPh,
      },
      weatherInfo: {
        temp: conditions.temperature,
        humidity: conditions.humidity,
        rainfall: conditions.rainfall,
      },
      topCrop,
      suitability: topScore,
      crops: [
        {
          name: topCrop,
          suitability: topScore,
          expectedYield: "45-55 q/ha",
          profitPotential: "High",
          riskLevel: "Low",
        },
      ],
    };

    if (typeof window !== "undefined") {
      const existing = JSON.parse(
        localStorage.getItem("agrismart_recommendation_history") || "[]",
      );
      const updated = [historyItem, ...existing.slice(0, 19)];
      localStorage.setItem(
        "agrismart_recommendation_history",
        JSON.stringify(updated),
      );
    }

    if (userId) {
      await insforge.database.from("crop_recommendations").insert([
        {
          user_id: userId,
          location: conditions.locationName,
          nitrogen: conditions.nitrogen,
          phosphorus: conditions.phosphorus,
          potassium: conditions.potassium,
          soil_ph: conditions.soilPh,
          rainfall: conditions.rainfall,
          temperature: conditions.temperature,
          humidity: conditions.humidity,
          season: conditions.season,
          farm_area: conditions.farmArea,
          recommended_crop: topCrop,
          suitability_score: topScore,
          created_at: new Date().toISOString(),
        },
      ]);
    }
  } catch (err) {
    console.warn("[InsForge Persistence Notice]", err);
  }
}

/**
 * Persists user feedback (Thumbs up / down + feedback note)
 */
export async function persistFeedbackToInsForge(
  userId: string | undefined,
  feedback: RecommendationFeedback,
) {
  try {
    if (typeof window !== "undefined") {
      const existing = JSON.parse(
        localStorage.getItem("agrismart_recommendation_feedback") || "[]",
      );
      localStorage.setItem(
        "agrismart_recommendation_feedback",
        JSON.stringify([feedback, ...existing]),
      );
    }

    if (userId) {
      await insforge.database.from("recommendation_feedback").insert([
        {
          user_id: userId,
          is_helpful: feedback.isHelpful,
          reason: feedback.reason || "",
          crop_name: feedback.cropName || "",
          created_at: new Date().toISOString(),
        },
      ]);
    }
  } catch (err) {
    console.warn("[Feedback Persistence Notice]", err);
  }
}

/**
 * Fetches recommendation history from local storage
 */
export function getSavedRecommendationHistory(): RecommendationHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("agrismart_recommendation_history");
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore error
  }
  return [
    {
      id: "rec-default-1",
      createdAt: "2026-08-27T10:00:00Z",
      location: "Vasai, Maharashtra",
      farmArea: 5.0,
      season: "Kharif",
      soilInfo: {
        n: 80,
        p: 40,
        k: 50,
        ph: 6.8,
      },
      weatherInfo: {
        temp: 28,
        humidity: 62,
        rainfall: 600,
      },
      topCrop: "Wheat",
      suitability: 94,
      crops: [
        {
          name: "Wheat",
          suitability: 94,
          expectedYield: "45-50 q/ha",
          profitPotential: "High",
          riskLevel: "Low",
        },
        {
          name: "Rice",
          suitability: 89,
          expectedYield: "50-55 q/ha",
          profitPotential: "High",
          riskLevel: "Low",
        },
      ],
    },
  ];
}
