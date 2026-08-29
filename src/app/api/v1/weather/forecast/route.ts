import { NextResponse } from "next/server";
import { fetchWeatherForecast } from "@/lib/weather";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/weather/forecast
 * Query: ?lat=&lon=&location=&days=7
 *
 * Returns daily forecast array from Open-Meteo (1–16 days).
 * Cached for 30 minutes.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location") || "Bhopal, Madhya Pradesh";
    const latParam = searchParams.get("lat");
    const lonParam = searchParams.get("lon");
    const daysParam = parseInt(searchParams.get("days") || "7", 10);
    const days = Math.min(16, Math.max(1, isNaN(daysParam) ? 7 : daysParam));

    const coords =
      latParam && lonParam
        ? { latitude: parseFloat(latParam), longitude: parseFloat(lonParam) }
        : null;

    const forecast = await fetchWeatherForecast(location, coords, days);

    return NextResponse.json(
      { success: true, days: forecast.length, data: forecast },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=300",
        },
      },
    );
  } catch (err) {
    console.error("[Weather Forecast API Error]", err);
    return NextResponse.json(
      {
        success: false,
        error:
          "Forecast data is temporarily unavailable. Please try refreshing again.",
      },
      { status: 503 },
    );
  }
}
