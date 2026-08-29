export interface TrendPoint {
  date: string;
  val: number;
}

export interface MarketBid {
  market: string;
  price: number;
  priceStr: string;
  change: string;
  up: boolean;
  diff: number;
}

export interface StatePrice {
  state: string;
  market: string;
  price: number;
  priceStr: string;
  change: string;
  up: boolean;
}

export interface CropMarketData {
  id: string;
  name: string;
  hindiName: string;
  category: "Cereals" | "Pulses" | "Fruits" | "Cash Crops";
  price: number;
  unit: string;
  image?: string;
  change: string;
  up: boolean;
  sparkline: number[];
  highest: number;
  highestDate: string;
  lowest: number;
  lowestDate: string;
  avg: number;
  defaultCost: number;
  defaultYield: number;
  trendPoints: TrendPoint[];
  topMarkets: MarketBid[];
  statePrices: StatePrice[];
}

export interface RawCropMeta {
  id: string;
  name: string;
  hindiName: string;
  category: "Cereals" | "Pulses" | "Fruits" | "Cash Crops";
  basePrice: number;
  msp?: number;
  cost: number;
  yield: number;
  volatility: number;
  image: string;
  aliases: string[];
}

export const ALL_24_MARKET_CROPS: RawCropMeta[] = [
  // CEREALS (3)
  {
    id: "wheat",
    name: "Wheat",
    hindiName: "गेहूं",
    category: "Cereals",
    basePrice: 2375,
    msp: 2275,
    cost: 28000,
    yield: 45,
    volatility: 45,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80",
    aliases: ["wheat", "gehu", "gehun"],
  },
  {
    id: "rice",
    name: "Rice",
    hindiName: "धान / चावल",
    category: "Cereals",
    basePrice: 2980,
    msp: 2183,
    cost: 32000,
    yield: 50,
    volatility: 55,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    aliases: ["rice", "paddy", "dhan", "chawal"],
  },
  {
    id: "maize",
    name: "Maize",
    hindiName: "मक्का",
    category: "Cereals",
    basePrice: 1940,
    msp: 2090,
    cost: 22000,
    yield: 40,
    volatility: 40,
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80",
    aliases: ["maize", "corn", "makka"],
  },

  // PULSES (7)
  {
    id: "chickpea",
    name: "Chickpea",
    hindiName: "चना",
    category: "Pulses",
    basePrice: 5850,
    msp: 5440,
    cost: 23000,
    yield: 18,
    volatility: 95,
    image: "https://images.unsplash.com/photo-1583064313642-a7c14d49a5a1?auto=format&fit=crop&w=400&q=80",
    aliases: ["chickpea", "gram", "chana", "bengal gram"],
  },
  {
    id: "blackgram",
    name: "Blackgram",
    hindiName: "उड़द",
    category: "Pulses",
    basePrice: 7200,
    msp: 6950,
    cost: 24000,
    yield: 16,
    volatility: 120,
    image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=400&q=80",
    aliases: ["blackgram", "urad", "mash"],
  },
  {
    id: "lentil",
    name: "Lentil",
    hindiName: "मसूर",
    category: "Pulses",
    basePrice: 6450,
    msp: 6425,
    cost: 22000,
    yield: 15,
    volatility: 85,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
    aliases: ["lentil", "masoor"],
  },
  {
    id: "kidneybeans",
    name: "Kidney Beans",
    hindiName: "राजमा",
    category: "Pulses",
    basePrice: 8400,
    cost: 30000,
    yield: 14,
    volatility: 140,
    image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=400&q=80",
    aliases: ["kidneybeans", "rajma", "kidney beans"],
  },
  {
    id: "mungbean",
    name: "Mung Bean",
    hindiName: "मूंग",
    category: "Pulses",
    basePrice: 7950,
    msp: 8558,
    cost: 25000,
    yield: 15,
    volatility: 110,
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=400&q=80",
    aliases: ["mungbean", "moong", "green gram"],
  },
  {
    id: "mothbeans",
    name: "Moth Beans",
    hindiName: "मोठ",
    category: "Pulses",
    basePrice: 6600,
    cost: 21000,
    yield: 12,
    volatility: 90,
    image: "https://images.unsplash.com/photo-1583064313642-a7c14d49a5a1?auto=format&fit=crop&w=400&q=80",
    aliases: ["mothbeans", "moth", "matki"],
  },
  {
    id: "pigeonpeas",
    name: "Pigeon Peas",
    hindiName: "अरहर / तुअर",
    category: "Pulses",
    basePrice: 9100,
    msp: 7000,
    cost: 28000,
    yield: 18,
    volatility: 160,
    image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=400&q=80",
    aliases: ["pigeonpeas", "arhar", "tur", "toor"],
  },

  // FRUITS (9)
  {
    id: "apple",
    name: "Apple",
    hindiName: "सेब",
    category: "Fruits",
    basePrice: 7800,
    cost: 65000,
    yield: 80,
    volatility: 180,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80",
    aliases: ["apple", "seb"],
  },
  {
    id: "banana",
    name: "Banana",
    hindiName: "केला",
    category: "Fruits",
    basePrice: 1950,
    cost: 45000,
    yield: 140,
    volatility: 65,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80",
    aliases: ["banana", "kela"],
  },
  {
    id: "grapes",
    name: "Grapes",
    hindiName: "अंगूर",
    category: "Fruits",
    basePrice: 6200,
    cost: 75000,
    yield: 90,
    volatility: 190,
    image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=400&q=80",
    aliases: ["grapes", "angoor"],
  },
  {
    id: "mango",
    name: "Mango",
    hindiName: "आम",
    category: "Fruits",
    basePrice: 4800,
    cost: 55000,
    yield: 70,
    volatility: 175,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80",
    aliases: ["mango", "aam"],
  },
  {
    id: "orange",
    name: "Orange",
    hindiName: "संतरा",
    category: "Fruits",
    basePrice: 3400,
    cost: 42000,
    yield: 85,
    volatility: 110,
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=400&q=80",
    aliases: ["orange", "santra", "mosambi"],
  },
  {
    id: "papaya",
    name: "Papaya",
    hindiName: "पपीता",
    category: "Fruits",
    basePrice: 1650,
    cost: 38000,
    yield: 130,
    volatility: 70,
    image: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=400&q=80",
    aliases: ["papaya", "papita"],
  },
  {
    id: "pomegranate",
    name: "Pomegranate",
    hindiName: "अनार",
    category: "Fruits",
    basePrice: 9200,
    cost: 80000,
    yield: 60,
    volatility: 220,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80",
    aliases: ["pomegranate", "anaar", "anar"],
  },
  {
    id: "muskmelon",
    name: "Muskmelon",
    hindiName: "खरबूजा",
    category: "Fruits",
    basePrice: 1550,
    cost: 32000,
    yield: 110,
    volatility: 80,
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80",
    aliases: ["muskmelon", "kharbooja", "kharbuja"],
  },
  {
    id: "watermelon",
    name: "Watermelon",
    hindiName: "तरबूज",
    category: "Fruits",
    basePrice: 1250,
    cost: 28000,
    yield: 160,
    volatility: 60,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80",
    aliases: ["watermelon", "tarbooj", "tarbuz"],
  },

  // CASH & COMMERCIAL (5)
  {
    id: "cotton",
    name: "Cotton",
    hindiName: "कपास",
    category: "Cash Crops",
    basePrice: 6350,
    msp: 6620,
    cost: 38000,
    yield: 30,
    volatility: 140,
    image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=400&q=80",
    aliases: ["cotton", "kapas", "rui"],
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    hindiName: "गन्ना",
    category: "Cash Crops",
    basePrice: 340,
    msp: 315,
    cost: 48000,
    yield: 400,
    volatility: 15,
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=400&q=80",
    aliases: ["sugarcane", "ganna", "ikshu"],
  },
  {
    id: "jute",
    name: "Jute",
    hindiName: "जूट / पटसन",
    category: "Cash Crops",
    basePrice: 5150,
    msp: 5050,
    cost: 27000,
    yield: 28,
    volatility: 90,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
    aliases: ["jute", "pat", "patsan"],
  },
  {
    id: "coconut",
    name: "Coconut",
    hindiName: "नारियल",
    category: "Cash Crops",
    basePrice: 3100,
    msp: 2800,
    cost: 35000,
    yield: 90,
    volatility: 75,
    image: "https://images.unsplash.com/photo-1544604667-5407d79b29cb?auto=format&fit=crop&w=400&q=80",
    aliases: ["coconut", "nariyal", "copra"],
  },
  {
    id: "coffee",
    name: "Coffee",
    hindiName: "कॉफ़ी",
    category: "Cash Crops",
    basePrice: 18500,
    cost: 60000,
    yield: 18,
    volatility: 260,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
    aliases: ["coffee", "kafi", "arabica", "robusta"],
  },
];

export const MAJOR_STATES = [
  { state: "Maharashtra", mandis: ["Pune", "Nashik", "Nagpur", "Lasalgaon", "Kolhapur"] },
  { state: "Madhya Pradesh", mandis: ["Indore", "Bhopal", "Vidisha", "Ujjain", "Sagar"] },
  { state: "Punjab", mandis: ["Khanna", "Ludhiana", "Jalandhar", "Amritsar", "Bathinda"] },
  { state: "Gujarat", mandis: ["Rajkot", "Unjha", "Gondal", "Surat", "Ahmedabad"] },
  { state: "Rajasthan", mandis: ["Kota", "Jaipur", "Bikaner", "Jodhpur", "Sri Ganganagar"] },
  { state: "Uttar Pradesh", mandis: ["Kanpur", "Agra", "Bareilly", "Varanasi", "Lucknow"] },
  { state: "Haryana", mandis: ["Karnal", "Kurukshetra", "Sirsa", "Ambala", "Hisar"] },
  { state: "Karnataka", mandis: ["Bengaluru", "Hubballi", "Mysuru", "Belagavi", "Raichur"] },
  { state: "Andhra Pradesh", mandis: ["Guntur", "Kurnool", "Vijayawada", "Tirupati", "Anantapur"] },
  { state: "Tamil Nadu", mandis: ["Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Erode"] },
  { state: "West Bengal", mandis: ["Kolkata", "Siliguri", "Burdwan", "Malda", "Midnapore"] },
  { state: "Bihar", mandis: ["Patna", "Muzaffarpur", "Bhagalpur", "Gaya", "Purnea"] },
];

function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate realistic market data deterministically for today for all 24 crops
export function getLiveMarketData(stateFilter?: string): CropMarketData[] {
  const today = new Date();
  const daySeed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  return ALL_24_MARKET_CROPS.map((crop, i) => {
    const trendPoints: TrendPoint[] = [];
    const sparkline: number[] = [];

    let currentSimPrice = crop.basePrice;
    let highest = 0;
    let lowest = 999999;
    let highestDate = "";
    let lowestDate = "";
    let sum = 0;

    // Simulate past 30 days
    for (let d = 30; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);
      const seed = daySeed - d + i * 117;

      const change = Math.round((seededRandom(seed) - 0.46) * crop.volatility);
      currentSimPrice = Math.max(10, currentSimPrice + change);

      if (currentSimPrice > highest) {
        highest = currentSimPrice;
        highestDate = `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`;
      }
      if (currentSimPrice < lowest) {
        lowest = currentSimPrice;
        lowestDate = `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`;
      }

      sum += currentSimPrice;

      if (d < 7) {
        sparkline.push(currentSimPrice);
      }

      if (d % 5 === 0 || d === 0) {
        trendPoints.push({
          date: `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`,
          val: currentSimPrice,
        });
      }
    }

    const todayPrice = sparkline[sparkline.length - 1] || crop.basePrice;
    const yesterdayPrice = sparkline[sparkline.length - 2] || todayPrice;
    const diffVal = todayPrice - yesterdayPrice;
    const pctChange = (
      ((todayPrice - yesterdayPrice) / (yesterdayPrice || 1)) *
      100
    ).toFixed(1);
    const isUp = diffVal >= 0;

    // Generate Multi-State Prices across 12 Indian states
    const statePrices: StatePrice[] = MAJOR_STATES.map((stObj, sIdx) => {
      const sSeed = daySeed + i * 31 + sIdx * 19;
      const stateOffset = Math.round((seededRandom(sSeed) * 2 - 0.95) * crop.volatility * 1.5);
      const stPrice = Math.max(10, todayPrice + stateOffset);
      const stDiff = stPrice - todayPrice;
      const stPct = ((stDiff / (todayPrice || 1)) * 100).toFixed(1);
      const mandiName = stObj.mandis[(i + sIdx) % stObj.mandis.length];

      return {
        state: stObj.state,
        market: `${mandiName}, ${stObj.state}`,
        price: stPrice,
        priceStr: `₹${stPrice.toLocaleString()}`,
        change: stDiff >= 0 ? `+${stPct}%` : `${stPct}%`,
        up: stDiff >= 0,
      };
    });

    // Sort states by highest price first
    statePrices.sort((a, b) => b.price - a.price);

    // Top Mandi Bids
    const topMarkets: MarketBid[] = statePrices.slice(0, 5).map((sp) => ({
      market: sp.market,
      price: sp.price,
      priceStr: sp.priceStr,
      change: sp.change,
      up: sp.up,
      diff: sp.price - todayPrice,
    }));

    return {
      id: crop.id,
      name: crop.name,
      hindiName: crop.hindiName,
      category: crop.category,
      price: todayPrice,
      unit: crop.id === "sugarcane" ? "/quintal" : "/qtl",
      image: crop.image,
      change: isUp ? `+${pctChange}%` : `${pctChange}%`,
      up: isUp,
      sparkline,
      highest,
      highestDate,
      lowest,
      lowestDate,
      avg: Math.round(sum / 31),
      defaultCost: crop.cost,
      defaultYield: crop.yield,
      trendPoints,
      topMarkets,
      statePrices,
    };
  });
}
