import { NextResponse } from "next/server";
import { fetchLiveWeather } from "@/lib/weather";

export const dynamic = "force-dynamic";

/**
 * Crop weather requirement ranges used for suitability scoring.
 * Source: ICAR crop-specific agro-climatic requirement guidelines.
 *
 * Format: [min, max] for each parameter.
 */
const CROP_WEATHER_REQUIREMENTS: Record<
  string,
  {
    tempMin: number;
    tempMax: number;
    humidityMin: number;
    humidityMax: number;
    rainfallMin: number; // mm/season
    rainfallMax: number;
    windMax: number; // km/h max tolerable
  }
> = {
  rice: {
    tempMin: 20,
    tempMax: 35,
    humidityMin: 70,
    humidityMax: 100,
    rainfallMin: 900,
    rainfallMax: 2000,
    windMax: 50,
  },
  wheat: {
    tempMin: 12,
    tempMax: 25,
    humidityMin: 40,
    humidityMax: 75,
    rainfallMin: 400,
    rainfallMax: 900,
    windMax: 60,
  },
  maize: {
    tempMin: 18,
    tempMax: 32,
    humidityMin: 50,
    humidityMax: 85,
    rainfallMin: 500,
    rainfallMax: 1000,
    windMax: 55,
  },
  cotton: {
    tempMin: 20,
    tempMax: 38,
    humidityMin: 40,
    humidityMax: 75,
    rainfallMin: 500,
    rainfallMax: 1000,
    windMax: 50,
  },
  sugarcane: {
    tempMin: 20,
    tempMax: 38,
    humidityMin: 60,
    humidityMax: 90,
    rainfallMin: 1000,
    rainfallMax: 2000,
    windMax: 40,
  },
  chickpea: {
    tempMin: 15,
    tempMax: 30,
    humidityMin: 30,
    humidityMax: 65,
    rainfallMin: 400,
    rainfallMax: 800,
    windMax: 60,
  },
  soybean: {
    tempMin: 20,
    tempMax: 35,
    humidityMin: 60,
    humidityMax: 85,
    rainfallMin: 600,
    rainfallMax: 1200,
    windMax: 50,
  },
  groundnut: {
    tempMin: 22,
    tempMax: 35,
    humidityMin: 50,
    humidityMax: 80,
    rainfallMin: 500,
    rainfallMax: 1000,
    windMax: 55,
  },
  tomato: {
    tempMin: 15,
    tempMax: 30,
    humidityMin: 50,
    humidityMax: 75,
    rainfallMin: 400,
    rainfallMax: 800,
    windMax: 45,
  },
  onion: {
    tempMin: 13,
    tempMax: 28,
    humidityMin: 40,
    humidityMax: 70,
    rainfallMin: 300,
    rainfallMax: 700,
    windMax: 55,
  },
  potato: {
    tempMin: 10,
    tempMax: 25,
    humidityMin: 55,
    humidityMax: 80,
    rainfallMin: 500,
    rainfallMax: 900,
    windMax: 50,
  },
  mustard: {
    tempMin: 10,
    tempMax: 25,
    humidityMin: 35,
    humidityMax: 65,
    rainfallMin: 300,
    rainfallMax: 700,
    windMax: 60,
  },
  jute: {
    tempMin: 22,
    tempMax: 35,
    humidityMin: 70,
    humidityMax: 100,
    rainfallMin: 1200,
    rainfallMax: 2000,
    windMax: 45,
  },
  blackgram: {
    tempMin: 25,
    tempMax: 35,
    humidityMin: 60,
    humidityMax: 90,
    rainfallMin: 600,
    rainfallMax: 1000,
    windMax: 50,
  },
  lentil: {
    tempMin: 15,
    tempMax: 30,
    humidityMin: 35,
    humidityMax: 65,
    rainfallMin: 300,
    rainfallMax: 700,
    windMax: 60,
  },
  mango: {
    tempMin: 22,
    tempMax: 38,
    humidityMin: 50,
    humidityMax: 80,
    rainfallMin: 700,
    rainfallMax: 1500,
    windMax: 40,
  },
  coconut: {
    tempMin: 20,
    tempMax: 35,
    humidityMin: 70,
    humidityMax: 100,
    rainfallMin: 1500,
    rainfallMax: 3000,
    windMax: 35,
  },
  coffee: {
    tempMin: 15,
    tempMax: 28,
    humidityMin: 65,
    humidityMax: 90,
    rainfallMin: 1500,
    rainfallMax: 3000,
    windMax: 30,
  },
};

/** Score a single parameter within a range: 100 if inside, decreasing outside */
function scoreInRange(value: number, min: number, max: number): number {
  if (value >= min && value <= max) return 100;
  if (value < min)
    return Math.max(0, Math.round(100 - ((min - value) / min) * 150));
  return Math.max(0, Math.round(100 - ((value - max) / max) * 150));
}

function labelFromScore(score: number): "Good" | "Moderate" | "Poor" {
  if (score >= 70) return "Good";
  if (score >= 40) return "Moderate";
  return "Poor";
}

/**
 * GET /api/v1/weather/crop-impact
 * Query: ?lat=&lon=&location=&crop=
 *
 * Returns weather suitability breakdown for a specific crop.
 * If crop is not provided or unknown, returns noCrop: true.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location") || "Bhopal, Madhya Pradesh";
    const cropParam = (searchParams.get("crop") || "").toLowerCase().trim();
    const latParam = searchParams.get("lat");
    const lonParam = searchParams.get("lon");

    if (!cropParam) {
      return NextResponse.json({ success: true, noCrop: true });
    }

    const reqs = CROP_WEATHER_REQUIREMENTS[cropParam];
    if (!reqs) {
      return NextResponse.json({
        success: true,
        noCrop: true,
        reason: "crop_not_found",
      });
    }

    const coords =
      latParam && lonParam
        ? { latitude: parseFloat(latParam), longitude: parseFloat(lonParam) }
        : null;

    const weather = await fetchLiveWeather(location, coords);

    const tempScore = scoreInRange(
      weather.temperature,
      reqs.tempMin,
      reqs.tempMax,
    );
    const humidityScore = scoreInRange(
      weather.humidity,
      reqs.humidityMin,
      reqs.humidityMax,
    );
    const rainfallScore = scoreInRange(
      weather.rainfall,
      reqs.rainfallMin,
      reqs.rainfallMax,
    );
    const windScore = scoreInRange(weather.windSpeed, 0, reqs.windMax);

    const overall = Math.round(
      tempScore * 0.3 +
        rainfallScore * 0.3 +
        humidityScore * 0.25 +
        windScore * 0.15,
    );

    return NextResponse.json({
      success: true,
      noCrop: false,
      crop: cropParam,
      location,
      data: {
        temperature: {
          score: tempScore,
          label: labelFromScore(tempScore),
          value: `${weather.temperature}°C`,
        },
        humidity: {
          score: humidityScore,
          label: labelFromScore(humidityScore),
          value: `${weather.humidity}%`,
        },
        rainfall: {
          score: rainfallScore,
          label: labelFromScore(rainfallScore),
          value: `${weather.rainfall} mm`,
        },
        wind: {
          score: windScore,
          label: labelFromScore(windScore),
          value: `${weather.windSpeed} km/h`,
        },
        overall,
      },
    });
  } catch (err) {
    console.error("[Crop Impact API Error]", err);
    return NextResponse.json(
      {
        success: false,
        error:
          "Crop impact data is temporarily unavailable. Please try refreshing again.",
      },
      { status: 503 },
    );
  }
}
