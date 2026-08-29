import { NextResponse } from "next/server";
import { fetchLiveWeather } from "@/lib/weather";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/weather/current
 * Query: ?lat=&lon=&location=&refresh=1
 *
 * Returns full current weather data from Open-Meteo.
 * Cached for 5 minutes unless ?refresh=1 is supplied.
 * API keys are never exposed to the client.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location") || "Bhopal, Madhya Pradesh";
    const latParam = searchParams.get("lat");
    const lonParam = searchParams.get("lon");

    const coords =
      latParam && lonParam
        ? { latitude: parseFloat(latParam), longitude: parseFloat(lonParam) }
        : null;

    const weather = await fetchLiveWeather(location, coords);

    const isRefresh = searchParams.get("refresh") === "1";
    const cacheSeconds = isRefresh ? 0 : 300; // 5-min cache unless explicit refresh

    return NextResponse.json(
      { success: true, data: weather },
      {
        headers: {
          "Cache-Control": isRefresh
            ? "no-store"
            : `public, s-maxage=${cacheSeconds}, stale-while-revalidate=60`,
        },
      },
    );
  } catch (err) {
    console.error("[Weather Current API Error]", err);
    return NextResponse.json(
      {
        success: false,
        error:
          "Weather data is temporarily unavailable. Please try refreshing again.",
      },
      { status: 503 },
    );
  }
}
