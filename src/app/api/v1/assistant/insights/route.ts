import { NextResponse } from "next/server";
import { resolveCoords } from "@/lib/weather";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location") || "Bhopal, Madhya Pradesh";
    const latParam = searchParams.get("lat");
    const lonParam = searchParams.get("lon");

    const inputCoords =
      latParam && lonParam
        ? { latitude: parseFloat(latParam), longitude: parseFloat(lonParam) }
        : null;

    const { lat, lon } = await resolveCoords(location, inputCoords);

    // Query Open-Meteo for 3-day forecast
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum,temperature_2m_max&forecast_days=3&timezone=auto`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3500) });

    if (res.ok) {
      const data = await res.json();
      const daily = data.daily || {};
      const precip = daily.precipitation_sum || [0, 0, 0];
      const tmaxList = daily.temperature_2m_max || [30, 30, 30];

      const rain3d = precip.reduce((a: number, b: number) => a + (b || 0), 0);
      const maxTemp = Math.max(...tmaxList);

      let title = `Favorable weather conditions prevailing for crop growth in ${location}.`;
      let desc = "Continue standard crop scouting, weed management, and scheduled irrigation.";
      let link = "/weather-climate";

      if (rain3d > 20) {
        title = `Rainfall (${rain3d.toFixed(1)} mm) expected over the next 3 days in ${location}.`;
        desc = "Consider completing field sowing and avoid chemical spray operations before the showers.";
        link = "/weather-climate";
      } else if (maxTemp > 36) {
        title = `High temperature alert (${maxTemp.toFixed(1)}°C) in ${location}.`;
        desc = "Apply light evening irrigation or organic mulching to protect standing crops against canopy heat stress.";
        link = "/weather-climate";
      } else if (rain3d < 2) {
        title = `Dry weather conditions prevailing across ${location}.`;
        desc = "Ideal window for intercultural operations, soil preparation, and scheduled drip fertigation.";
        link = "/soil-crop-health";
      }

      return NextResponse.json({
        success: true,
        data: {
          title,
          description: desc,
          link,
          location,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        title: `Favorable weather conditions prevailing in ${location}.`,
        description: "Continue standard crop scouting and balanced nutrient management.",
        link: "/weather-climate",
        location,
      },
    });
  } catch (err) {
    return NextResponse.json({
      success: true,
      data: {
        title: "Favorable weather conditions prevailing for standing crops.",
        description: "Continue standard crop scouting and balanced nutrient management.",
        link: "/weather-climate",
        location: "Your Area",
      },
    });
  }
}
