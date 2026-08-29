import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import {
  fetchWeatherForecast,
  fetchLiveWeather,
  resolveCoords,
  type WeatherForecast,
} from "@/lib/weather";

export interface FarmingAlert {
  id: string;
  type: string;
  title: string;
  value: string;
  expectedAt: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  impact: string;
  action: string;
  iconType: string;
}

/**
 * Deterministically computes practical, farmer-friendly alerts from real weather & forecast data.
 * No hardcoded static values. No Pest & Disease alerts.
 */
function computeAlerts(
  forecast: WeatherForecast[],
  current: { temperature: number; humidity: number },
): FarmingAlert[] {
  const alerts: FarmingAlert[] = [];
  const f7 = forecast.slice(0, 7);

  // 1. Rainfall & Heavy Rain alerts
  f7.forEach((day) => {
    if (day.rainfall >= 50) {
      alerts.push({
        id: `very-heavy-rain-${day.date}`,
        type: "very-heavy-rain",
        title: "Very Heavy Rainfall",
        value: `${day.rainfall} mm intense rainfall on ${day.dateLabel}`,
        expectedAt: day.dateLabel,
        severity: "Critical",
        impact:
          "Severe downpours can cause swift waterlogging, topsoil loss, and drown standing crops.",
        action:
          "Clear and open all field drainage immediately. Avoid all field operations and protect produce.",
        iconType: "heavy-rain",
      });
    } else if (day.rainfall >= 25) {
      alerts.push({
        id: `heavy-rain-${day.date}`,
        type: "heavy-rain",
        title: "Heavy Rainfall",
        value: `${day.rainfall} mm rainfall expected on ${day.dateLabel}`,
        expectedAt: day.dateLabel,
        severity: "High",
        impact:
          "Heavy rainfall may cause waterlogging and wash off fertilizer or pesticide sprays.",
        action:
          "Clear drainage channels, delay irrigation/spraying, and protect harvested crops.",
        iconType: "heavy-rain",
      });
    } else if (day.rainfall >= 8) {
      alerts.push({
        id: `rain-${day.date}`,
        type: "rain",
        title: "Rain Expected",
        value: `${day.rainfall} mm rainfall expected on ${day.dateLabel}`,
        expectedAt: day.dateLabel,
        severity: "Medium",
        impact:
          "Moderate rainfall may affect irrigation schedules and ongoing field activities.",
        action:
          "Delay irrigation and avoid spraying pesticides or fertilizers immediately before rainfall.",
        iconType: "rain",
      });
    }
  });

  // 2. Flood Risk: cumulative 3-day precipitation >= 50mm
  for (let i = 0; i <= f7.length - 3; i++) {
    const sum = f7[i].rainfall + f7[i + 1].rainfall + f7[i + 2].rainfall;
    if (sum >= 50) {
      alerts.push({
        id: `flood-${f7[i].date}`,
        type: "flood",
        title: "Elevated Flood Risk",
        value: `${Math.round(sum)} mm cumulative rain (${f7[i].dateLabel} – ${f7[i + 2].dateLabel})`,
        expectedAt: `${f7[i].dateLabel} – ${f7[i + 2].dateLabel}`,
        severity: "Critical",
        impact:
          "Sustained heavy rainfall will saturate topsoil and risk submerging low-lying field patches.",
        action:
          "Inspect and open drainage outlets. Move machinery and harvested produce to higher ground.",
        iconType: "flood",
      });
      break; // one cumulative flood alert
    }
  }

  // 3. Extended Dry Period Alert (Drought condition)
  const totalRain7 = f7.reduce((s, d) => s + d.rainfall, 0);
  const avgMaxTemp =
    f7.reduce((s, d) => s + d.maxTemperature, 0) / (f7.length || 1);
  if (totalRain7 < 2 && avgMaxTemp > 32) {
    alerts.push({
      id: "extended-dry-period",
      type: "dry-period",
      title: "Extended Dry Period",
      value: `${Math.round(totalRain7)} mm rain, ${Math.round(avgMaxTemp)}°C avg high over next 7 days`,
      expectedAt: "Next 7 days",
      severity: "High",
      impact:
        "Prolonged dry weather with elevated temperatures depletes root zone soil moisture rapidly.",
      action:
        "Increase irrigation frequency, apply mulching to conserve moisture, and check soil depth moisture.",
      iconType: "drought",
    });
  }

  // 4. Extreme Heat / High Temperature Alert
  f7.forEach((day) => {
    if (day.maxTemperature >= 40) {
      alerts.push({
        id: `extreme-heat-${day.date}`,
        type: "extreme-heat",
        title: "Extreme Heat",
        value: `${day.maxTemperature}°C max temperature on ${day.dateLabel}`,
        expectedAt: day.dateLabel,
        severity: "Critical",
        impact:
          "Severe heat stress accelerates moisture loss, induces leaf burn, and can cause flower drop.",
        action:
          "Irrigate in early morning or evening. Avoid field labor and chemical sprays during peak heat.",
        iconType: "heat",
      });
    } else if (day.maxTemperature >= 35) {
      alerts.push({
        id: `high-temp-${day.date}`,
        type: "high-temp",
        title: "High Temperature",
        value: `${day.maxTemperature}°C max temperature on ${day.dateLabel}`,
        expectedAt: day.dateLabel,
        severity: "High",
        impact:
          "High daytime temperatures increase crop transpiration and plant moisture stress.",
        action:
          "Monitor crop stress, irrigate at recommended cooler hours, and avoid peak heat spraying.",
        iconType: "heat",
      });
    }
  });

  // 5. Strong Wind Alert
  f7.forEach((day) => {
    if (day.windSpeed >= 35) {
      alerts.push({
        id: `wind-${day.date}`,
        type: "wind",
        title: "Strong Wind",
        value: `${day.windSpeed} km/h wind speed on ${day.dateLabel}`,
        expectedAt: day.dateLabel,
        severity: day.windSpeed >= 50 ? "High" : "Medium",
        impact:
          "Strong winds can lodge tall standing crops, damage light farm structures, and cause spray drift.",
        action:
          "Secure young plants/support structures and avoid pesticide spraying during strong winds.",
        iconType: "wind",
      });
    }
  });

  // 6. Sudden Temperature Change Alert
  for (let i = 1; i < f7.length; i++) {
    const tempDiff = f7[i].maxTemperature - f7[i - 1].maxTemperature;
    if (Math.abs(tempDiff) >= 6) {
      const isDrop = tempDiff < 0;
      alerts.push({
        id: `temp-change-${f7[i].date}`,
        type: "temp-change",
        title: "Sudden Temperature Change",
        value: `${isDrop ? "" : "+"}${tempDiff.toFixed(1)}°C shift on ${f7[i].dateLabel}`,
        expectedAt: f7[i].dateLabel,
        severity: "Medium",
        impact:
          "Rapid temperature shifts can induce physiological stress in sensitive young crops.",
        action:
          "Monitor vulnerable crops for stress and adjust watering schedules to buffer soil temperature.",
        iconType: "temp-change",
      });
      break; // one sudden temp change alert
    }
  }

  // 7. Cold Wave Alert
  f7.forEach((day) => {
    if (day.minTemperature <= 10) {
      alerts.push({
        id: `cold-${day.date}`,
        type: "cold",
        title: "Cold Wave Alert",
        value: `${day.minTemperature}°C min temperature on ${day.dateLabel}`,
        expectedAt: day.dateLabel,
        severity: day.minTemperature <= 5 ? "Critical" : "Medium",
        impact:
          "Low night temperatures can stunt seedling development and cause chilling injury.",
        action:
          "Cover sensitive crops overnight and avoid heavy field flooding during cold spells.",
        iconType: "cold",
      });
    }
  });

  // Deduplicate by id
  const seen = new Set<string>();
  return alerts.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });
}

/**
 * GET /api/v1/weather/alerts
 * Query: ?lat=&lon=&location=
 */
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
    const coords = { latitude: lat, longitude: lon };

    const [forecast, current] = await Promise.all([
      fetchWeatherForecast(location, coords, 7),
      fetchLiveWeather(location, coords),
    ]);

    const alerts = computeAlerts(forecast, {
      temperature: current.temperature,
      humidity: current.humidity,
    });

    return NextResponse.json(
      { success: true, count: alerts.length, data: alerts },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=180",
        },
      },
    );
  } catch (err) {
    console.error("[Weather Alerts API Error]", err);
    return NextResponse.json(
      {
        success: false,
        error:
          "Alert data is temporarily unavailable. Please try refreshing again.",
      },
      { status: 503 },
    );
  }
}
