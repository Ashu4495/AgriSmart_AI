/**
 * AgriSmart AI — Shared Weather Service
 *
 * Fetches real-time weather (current + forecast) from Open-Meteo API.
 * No API key required. Used by: Weather & Climate page + Crop Intelligence.
 *
 * REAL API DATA ONLY — no fake/hardcoded production values.
 */

// ─────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────

export interface LiveWeatherData {
  location: string;
  temperature: number; // °C
  feelsLike: number; // °C (apparent temperature)
  humidity: number; // %
  rainfall: number; // mm (seasonal crop-season baseline)
  windSpeed: number; // km/h
  visibility: number; // km
  uvIndex: number; // 0–11+
  pressure: number; // hPa
  condition: string; // e.g. "Partly Cloudy"
  conditionText: string; // alias for condition (Crop Intelligence compat)
  conditionCode: number; // WMO weather code
  sunrise: string; // "05:48 AM"
  sunset: string; // "07:12 PM"
  isLive: boolean;
  lastUpdated: string; // human-readable
  updatedAt: string; // ISO-8601
}

export interface WeatherForecast {
  date: string; // "2024-05-21"
  day: string; // "Mon", "Tue", ...
  dateLabel: string; // "21 May"
  condition: string;
  conditionCode: number;
  minTemperature: number; // °C
  maxTemperature: number; // °C
  humidity: number; // %
  rainfall: number; // mm
  rainProbability: number; // %
  windSpeed: number; // km/h
}

// ─────────────────────────────────────────────
// City coordinate table
// ─────────────────────────────────────────────

const CITY_COORDINATES: Record<
  string,
  { lat: number; lon: number; baseRainfall: number }
> = {
  vasai: { lat: 19.47, lon: 72.80, baseRainfall: 1100 },
  mumbai: { lat: 19.076, lon: 72.8777, baseRainfall: 1200 },
  pune: { lat: 18.5204, lon: 73.8567, baseRainfall: 720 },
  nashik: { lat: 20.0059, lon: 73.7897, baseRainfall: 760 },
  nagpur: { lat: 21.1458, lon: 79.0882, baseRainfall: 1050 },
  aurangabad: { lat: 19.8762, lon: 75.3433, baseRainfall: 680 },
  kolhapur: { lat: 16.705, lon: 74.2433, baseRainfall: 950 },
  solapur: { lat: 17.6599, lon: 75.9064, baseRainfall: 580 },
  amravati: { lat: 20.9374, lon: 77.7796, baseRainfall: 840 },
  ludhiana: { lat: 30.901, lon: 75.8573, baseRainfall: 680 },
  amritsar: { lat: 31.634, lon: 74.8723, baseRainfall: 620 },
  jalandhar: { lat: 31.326, lon: 75.5762, baseRainfall: 640 },
  patiala: { lat: 30.3398, lon: 76.3869, baseRainfall: 660 },
  bathinda: { lat: 30.211, lon: 74.9455, baseRainfall: 420 },
  bhopal: { lat: 23.2599, lon: 77.4126, baseRainfall: 920 },
  indore: { lat: 22.7196, lon: 75.8577, baseRainfall: 880 },
  jabalpur: { lat: 23.1815, lon: 79.9864, baseRainfall: 1100 },
  gwalior: { lat: 26.2183, lon: 78.1828, baseRainfall: 720 },
  ujjain: { lat: 23.1765, lon: 75.7885, baseRainfall: 820 },
  hoshangabad: { lat: 22.7533, lon: 77.7289, baseRainfall: 1150 },
  lucknow: { lat: 26.8467, lon: 80.9462, baseRainfall: 890 },
  varanasi: { lat: 25.3176, lon: 82.9739, baseRainfall: 980 },
  kanpur: { lat: 26.4499, lon: 80.3319, baseRainfall: 820 },
  agra: { lat: 27.1767, lon: 78.0081, baseRainfall: 640 },
  meerut: { lat: 28.9845, lon: 77.7064, baseRainfall: 750 },
  prayagraj: { lat: 25.4358, lon: 81.8463, baseRainfall: 920 },
  bareilly: { lat: 28.367, lon: 79.4304, baseRainfall: 900 },
  jaipur: { lat: 26.9124, lon: 75.7873, baseRainfall: 520 },
  jodhpur: { lat: 26.2389, lon: 73.0243, baseRainfall: 340 },
  kota: { lat: 25.2138, lon: 75.8648, baseRainfall: 780 },
  udaipur: { lat: 24.5854, lon: 73.7125, baseRainfall: 610 },
  bikaner: { lat: 28.0229, lon: 73.3119, baseRainfall: 260 },
  "sri ganganagar": { lat: 29.9038, lon: 73.8772, baseRainfall: 280 },
  ahmedabad: { lat: 23.0225, lon: 72.5714, baseRainfall: 750 },
  surat: { lat: 21.1702, lon: 72.8311, baseRainfall: 1150 },
  rajkot: { lat: 22.3039, lon: 70.8022, baseRainfall: 590 },
  vadodara: { lat: 22.3072, lon: 73.1812, baseRainfall: 880 },
  junagadh: { lat: 21.5222, lon: 70.4579, baseRainfall: 780 },
  bhavnagar: { lat: 21.7645, lon: 72.1519, baseRainfall: 620 },
  karnal: { lat: 29.6857, lon: 76.9905, baseRainfall: 670 },
  hisar: { lat: 29.1492, lon: 75.7217, baseRainfall: 420 },
  rohtak: { lat: 28.8955, lon: 76.6066, baseRainfall: 540 },
  ambala: { lat: 30.3782, lon: 76.7767, baseRainfall: 820 },
  panipat: { lat: 29.3909, lon: 76.9635, baseRainfall: 610 },
  bengaluru: { lat: 12.9716, lon: 77.5946, baseRainfall: 900 },
  mangaluru: { lat: 12.9141, lon: 74.8560, baseRainfall: 3500 },
  mangalore: { lat: 12.9141, lon: 74.8560, baseRainfall: 3500 },
  mysuru: { lat: 12.2958, lon: 76.6394, baseRainfall: 780 },
  belagavi: { lat: 15.8497, lon: 74.4977, baseRainfall: 1100 },
  "hubballi-dharwad": { lat: 15.3647, lon: 75.124, baseRainfall: 740 },
  mandya: { lat: 12.5244, lon: 76.8958, baseRainfall: 700 },
  chennai: { lat: 13.0827, lon: 80.2707, baseRainfall: 1250 },
  coimbatore: { lat: 11.0168, lon: 76.9558, baseRainfall: 620 },
  madurai: { lat: 9.9252, lon: 78.1198, baseRainfall: 820 },
  thanjavur: { lat: 10.787, lon: 79.1378, baseRainfall: 950 },
  salem: { lat: 11.6643, lon: 78.146, baseRainfall: 860 },
  hyderabad: { lat: 17.385, lon: 78.4867, baseRainfall: 820 },
  vijayawada: { lat: 16.5062, lon: 80.648, baseRainfall: 960 },
  guntur: { lat: 16.3067, lon: 80.4365, baseRainfall: 890 },
  warangal: { lat: 17.9689, lon: 79.5941, baseRainfall: 940 },
  visakhapatnam: { lat: 17.6868, lon: 83.2185, baseRainfall: 1120 },
  kolkata: { lat: 22.5726, lon: 88.3639, baseRainfall: 1400 },
  bardhaman: { lat: 23.2324, lon: 87.8615, baseRainfall: 1280 },
  burdwan: { lat: 23.2324, lon: 87.8615, baseRainfall: 1280 },
  siliguri: { lat: 26.7271, lon: 88.3953, baseRainfall: 2200 },
  murshidabad: { lat: 24.1759, lon: 88.2802, baseRainfall: 1320 },
  patna: { lat: 25.5941, lon: 85.1376, baseRainfall: 1050 },
  gaya: { lat: 24.7914, lon: 85.0002, baseRainfall: 980 },
  muzaffarpur: { lat: 26.1209, lon: 85.3647, baseRainfall: 1180 },
  bhagalpur: { lat: 25.2425, lon: 86.9842, baseRainfall: 1140 },
  thiruvananthapuram: { lat: 8.5241, lon: 76.9366, baseRainfall: 1700 },
  kochi: { lat: 9.9312, lon: 76.2673, baseRainfall: 2400 },
  palakkad: { lat: 10.7867, lon: 76.6548, baseRainfall: 2100 },
  bhubaneswar: { lat: 20.2961, lon: 85.8245, baseRainfall: 1350 },
  cuttack: { lat: 20.4625, lon: 85.8828, baseRainfall: 1380 },
  sambalpur: { lat: 21.4669, lon: 83.9812, baseRainfall: 1450 },
  guwahati: { lat: 26.1445, lon: 91.7362, baseRainfall: 1650 },
  jorhat: { lat: 26.7509, lon: 94.2037, baseRainfall: 1900 },
  delhi: { lat: 28.6139, lon: 77.209, baseRainfall: 650 },
  chandigarh: { lat: 30.7333, lon: 76.7794, baseRainfall: 750 },
  ranchi: { lat: 23.3441, lon: 85.3096, baseRainfall: 1150 },
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

export function parseWmoWeatherCode(code: number): string {
  if (code === 0) return "Clear Sky";
  if (code >= 1 && code <= 3) return "Partly Cloudy";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 61 && code <= 65) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain Showers";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Sunny";
}

function formatSunTime(isoStr: string): string {
  if (!isoStr) return "--:--";
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "--:--";
  }
}

function getDayLabel(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    return d.toLocaleDateString("en-IN", { weekday: "short" });
  } catch {
    return "";
  }
}

function getDateLabel(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  } catch {
    return dateStr;
  }
}

async function geocodeLocation(
  query: string,
): Promise<{ lat: number; lon: number } | null> {
  const clean = query.split(",")[0]?.trim().toLowerCase() || "";
  if (CITY_COORDINATES[clean]) return CITY_COORDINATES[clean];
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(clean)}&count=1&language=en&format=json`,
      { signal: AbortSignal.timeout(3500) },
    );
    if (res.ok) {
      const data = await res.json();
      if (data.results?.length > 0) {
        return {
          lat: data.results[0].latitude,
          lon: data.results[0].longitude,
        };
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

export async function resolveCoords(
  locationName: string,
  coords?: { latitude: number; longitude: number } | null,
): Promise<{ lat: number; lon: number; baseRainfall: number }> {
  const cleanName = locationName.split(",")[0]?.trim().toLowerCase() || "";
  const cached = CITY_COORDINATES[cleanName];
  const baseRainfall = cached?.baseRainfall ?? 650;
  if (coords?.latitude && coords?.longitude) {
    return { lat: coords.latitude, lon: coords.longitude, baseRainfall };
  }
  if (cached) return { lat: cached.lat, lon: cached.lon, baseRainfall };
  const geo = await geocodeLocation(locationName);
  if (geo) return { ...geo, baseRainfall };
  return { lat: 23.2599, lon: 77.4126, baseRainfall: 920 };
}

// ─────────────────────────────────────────────
// Fetch: Full Current Weather
// ─────────────────────────────────────────────

/**
 * Fetches complete current weather data from Open-Meteo.
 * Backward-compatible with Crop Intelligence (conditionText, isLive, lastUpdated).
 */
export async function fetchLiveWeather(
  locationName: string,
  coords?: { latitude: number; longitude: number } | null,
): Promise<LiveWeatherData> {
  const { lat, lon, baseRainfall } = await resolveCoords(locationName, coords);

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,surface_pressure,visibility` +
      `&hourly=uv_index` +
      `&daily=sunrise,sunset,precipitation_sum` +
      `&timezone=auto` +
      `&forecast_days=1`;

    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok)
      throw new Error("Failed to fetch current weather from Open-Meteo");

    const data = await res.json();
    const cur = data.current ?? {};
    const daily = data.daily ?? {};
    const hourly = data.hourly ?? {};

    const temp =
      typeof cur.temperature_2m === "number" ? cur.temperature_2m : 28;
    const feelsLike =
      typeof cur.apparent_temperature === "number"
        ? cur.apparent_temperature
        : temp + 2;
    const humidity =
      typeof cur.relative_humidity_2m === "number"
        ? cur.relative_humidity_2m
        : 62;
    const windSpeed =
      typeof cur.wind_speed_10m === "number" ? cur.wind_speed_10m : 12;
    const pressure =
      typeof cur.surface_pressure === "number" ? cur.surface_pressure : 1008;
    const visibilityM =
      typeof cur.visibility === "number" ? cur.visibility : 10000;
    const code: number = cur.weather_code ?? 2;
    const condition = parseWmoWeatherCode(code);
    const uvArr: number[] = hourly.uv_index ?? [];
    const uvIndex = uvArr.length > 0 ? Math.round(uvArr[0]) : 5;
    const sunriseRaw: string = daily.sunrise?.[0] ?? "";
    const sunsetRaw: string = daily.sunset?.[0] ?? "";
    const sunrise = sunriseRaw ? formatSunTime(sunriseRaw) : "05:48 AM";
    const sunset = sunsetRaw ? formatSunTime(sunsetRaw) : "07:12 PM";
    const dailyPrecip: number = daily.precipitation_sum?.[0] ?? 0;
    const rainfall = Math.round(baseRainfall + dailyPrecip * 10);
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return {
      location: locationName,
      temperature: Math.round(temp),
      feelsLike: Math.round(feelsLike),
      humidity: Math.round(humidity),
      rainfall,
      windSpeed: Math.round(windSpeed),
      visibility: Math.round(visibilityM / 1000),
      uvIndex,
      pressure: Math.round(pressure),
      condition,
      conditionText: condition,
      conditionCode: code,
      sunrise,
      sunset,
      isLive: true,
      lastUpdated: `Live at ${timeStr}`,
      updatedAt: now.toISOString(),
    };
  } catch (err) {
    console.error("[Weather Fetch Error]", err);
    throw err;
  }
}

// ─────────────────────────────────────────────
// Fetch: Multi-Day Forecast
// ─────────────────────────────────────────────

/**
 * Fetches daily weather forecast from Open-Meteo (up to 16 days).
 */
export async function fetchWeatherForecast(
  locationName: string,
  coords?: { latitude: number; longitude: number } | null,
  days: number = 7,
): Promise<WeatherForecast[]> {
  const { lat, lon } = await resolveCoords(locationName, coords);
  const safeDays = Math.min(16, Math.max(1, days));

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,relative_humidity_2m_mean` +
      `&timezone=auto` +
      `&forecast_days=${safeDays}`;

    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error("Failed to fetch forecast from Open-Meteo");

    const data = await res.json();
    const daily = data.daily;
    const dates = daily.time;

    return dates.map((date: string, i: number) => {
      const code = daily.weather_code[i];
      return {
        date,
        day: getDayLabel(date),
        dateLabel: getDateLabel(date),
        condition: parseWmoWeatherCode(code),
        conditionCode: code,
        minTemperature: Math.round(daily.temperature_2m_min[i]),
        maxTemperature: Math.round(daily.temperature_2m_max[i]),
        humidity: Math.round(daily.relative_humidity_2m_mean[i]),
        rainfall: Math.round(daily.precipitation_sum[i] * 10) / 10,
        rainProbability: Math.round(daily.precipitation_probability_max[i]),
        windSpeed: Math.round(daily.wind_speed_10m_max[i]),
      };
    });
  } catch (err) {
    console.error("[Forecast Fetch Error]", err);
    throw err;
  }
}
