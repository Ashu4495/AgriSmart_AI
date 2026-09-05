import { NextResponse } from "next/server";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

import {
  fetchWeatherForecast,
  fetchLiveWeather,
  resolveCoords,
  type WeatherForecast,
} from "@/lib/weather";

export interface DetailedRiskItem {
  label: string;
  level: "Low" | "Medium" | "High" | "Critical";
  score: number; // 0-100
  why: string;
  action: string;
}

export interface ClimateRiskResult {
  drought: number; // 0–100
  flood: number;
  heatStress: number;
  overall: number;
  level: "Low" | "Medium" | "High" | "Critical";
  explanation: string;
  risks: {
    drought: DetailedRiskItem;
    flood: DetailedRiskItem;
    heat_stress: DetailedRiskItem;
  };
  model_source?: string;
  updated_at?: string;
}

function getLevelFromScore(score: number): "Low" | "Medium" | "High" | "Critical" {
  if (score >= 75) return "Critical";
  if (score >= 50) return "High";
  if (score >= 25) return "Medium";
  return "Low";
}

function generateFarmerFriendlyExplanations(
  droughtScore: number,
  floodScore: number,
  heatScore: number,
) {
  // Drought
  let droughtWhy =
    "Soil moisture and recent rainfall are currently adequate for standing crops.";
  let droughtAction =
    "Maintain standard irrigation schedules and check soil moisture regularly.";
  if (droughtScore >= 75) {
    droughtWhy =
      "Severe dry spell and high evaporative demand are rapidly depleting root zone moisture.";
    droughtAction =
      "Increase irrigation frequency immediately and apply organic mulching to conserve moisture.";
  } else if (droughtScore >= 50) {
    droughtWhy =
      "Extended low rainfall and warm weather are reducing available soil moisture.";
    droughtAction =
      "Schedule drip irrigation during early morning or late evening to minimize evaporation.";
  } else if (droughtScore >= 25) {
    droughtWhy =
      "Slight moisture deficit developing, but adequate for well-rooted crops.";
    droughtAction =
      "Monitor soil moisture at root depth before the next scheduled watering.";
  }

  // Flood
  let floodWhy =
    "Expected rainfall is within normal absorption limits with minimal waterlogging threat.";
  let floodAction =
    "Keep primary farm drainage outlets clear as routine preventative maintenance.";
  if (floodScore >= 75) {
    floodWhy =
      "Heavy cumulative rainfall forecast creates high risk of waterlogging and soil saturation.";
    floodAction =
      "Inspect and clear all drainage channels immediately. Move equipment and produce to higher ground.";
  } else if (floodScore >= 50) {
    floodWhy =
      "Rainfall forecast indicates increased precipitation over the next few days.";
    floodAction =
      "Check field drainage and avoid unnecessary field operations during heavy rain.";
  } else if (floodScore >= 25) {
    floodWhy =
      "Moderate rainfall expected; field soil should absorb moisture with normal drainage.";
    floodAction =
      "Ensure field drainage paths are unobstructed before incoming showers.";
  }

  // Heat Stress
  let heatWhy =
    "Temperatures remain within optimal physiological ranges for healthy crop growth.";
  let heatAction =
    "Continue standard crop management and routine field operations.";
  if (heatScore >= 75) {
    heatWhy =
      "Extreme daytime temperatures (>38°C) may induce severe wilting, flower drop, and leaf burn.";
    heatAction =
      "Provide light cooling irrigation during peak heat, apply shade netting where feasible, and avoid midday field labor.";
  } else if (heatScore >= 50) {
    heatWhy =
      "High daytime temperatures may stress sensitive crops and increase transpiration rates.";
    heatAction =
      "Irrigate in early morning or evening. Avoid applying chemical sprays during maximum heat hours.";
  } else if (heatScore >= 25) {
    heatWhy =
      "Warm daytime conditions; mild thermal stress during peak afternoon hours.";
    heatAction =
      "Ensure adequate soil moisture before peak midday heat.";
  }

  // Overall combined explanation
  const maxScore = Math.max(droughtScore, floodScore, heatScore);
  let overallExp =
    "Current meteorological conditions are favorable with no severe climate stress detected for standing crops.";
  if (maxScore >= 75) {
    if (floodScore >= 75) {
      overallExp =
        "High flood and waterlogging risk detected this week; prioritize drainage clearance and field safety.";
    } else if (droughtScore >= 75) {
      overallExp =
        "Severe drought conditions prevailing; prioritize critical crop irrigation and soil moisture conservation.";
    } else {
      overallExp =
        "Extreme heat stress forecast this week; protect sensitive crops and adjust irrigation timing.";
    }
  } else if (maxScore >= 50) {
    if (floodScore >= 50) {
      overallExp =
        "Rainfall is expected, but current conditions do not indicate severe climate stress.";
    } else if (droughtScore >= 50) {
      overallExp =
        "Warm and dry conditions expected; maintain regular irrigation to support crop growth.";
    } else {
      overallExp =
        "Elevated daytime temperatures expected; monitor crop stress and irrigate during cooler hours.";
    }
  } else if (maxScore >= 25) {
    overallExp =
      "Moderate climate conditions prevailing with low overall risk to crop yields.";
  }

  return {
    drought: { why: droughtWhy, action: droughtAction },
    flood: { why: floodWhy, action: floodAction },
    heat: { why: heatWhy, action: heatAction },
    overallExplanation: overallExp,
  };
}

/**
 * Runs prediction through Python Climate Risk ML model bridge
 */
async function runPythonClimateRiskBridge(
  latitude: number,
  longitude: number,
): Promise<ClimateRiskResult | null> {
  return new Promise((resolve) => {
    const projectRoot = process.cwd();
    const isWindows = process.platform === "win32";
    const venvPython = isWindows
      ? path.join(projectRoot, "backend", "ml", "crop_recommendation", ".venv", "Scripts", "python.exe")
      : path.join(projectRoot, "backend", "ml", "crop_recommendation", ".venv", "bin", "python");

    const scriptPath = path.join(
      projectRoot,
      "backend",
      "ml",
      "climate_risk",
      "predict_bridge.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return resolve(null);
    }

    const pythonCandidates = [venvPython, "python", "py"];
    let resolved = false;

    for (const pyExe of pythonCandidates) {
      if (pyExe === venvPython && !fs.existsSync(venvPython)) continue;

      try {
        const jsonPayload = JSON.stringify({ latitude, longitude });
        const child = execFile(
          /*turbopackIgnore: true*/ pyExe,
          [scriptPath, jsonPayload],
          { timeout: 12000 },
          (error, stdout, stderr) => {
            if (resolved) return;
            if (!error && stdout) {
              try {
                const trimmed = stdout.trim();
                const jsonStart = trimmed.indexOf("{");
                const jsonEnd = trimmed.lastIndexOf("}");
                if (jsonStart !== -1 && jsonEnd !== -1) {
                  const jsonStr = trimmed.substring(jsonStart, jsonEnd + 1);
                  const res = JSON.parse(jsonStr);
                  if (res.success && res.risks) {
                    resolved = true;
                    const droughtScore = Math.max(5, Math.min(98, Number(res.risks?.drought?.score ?? 20)));
                    const floodScore = Math.max(5, Math.min(98, Number(res.risks?.flood?.score ?? 20)));
                    const heatScore = Math.max(5, Math.min(98, Number(res.risks?.heat_stress?.score ?? 20)));
                    const overallScore = Math.round(
                      droughtScore * 0.35 + floodScore * 0.35 + heatScore * 0.3,
                    );
                    const overallLvl = getLevelFromScore(overallScore);

                    const texts = generateFarmerFriendlyExplanations(
                      droughtScore,
                      floodScore,
                      heatScore,
                    );

                    const transformed: ClimateRiskResult = {
                      drought: droughtScore,
                      flood: floodScore,
                      heatStress: heatScore,
                      overall: overallScore,
                      level: overallLvl,
                      explanation: texts.overallExplanation,
                      risks: {
                        drought: {
                          label: "Drought Risk",
                          level: getLevelFromScore(droughtScore),
                          score: droughtScore,
                          why: texts.drought.why,
                          action: texts.drought.action,
                        },
                        flood: {
                          label: "Flood Risk",
                          level: getLevelFromScore(floodScore),
                          score: floodScore,
                          why: texts.flood.why,
                          action: texts.flood.action,
                        },
                        heat_stress: {
                          label: "Heat Stress Risk",
                          level: getLevelFromScore(heatScore),
                          score: heatScore,
                          why: texts.heat.why,
                          action: texts.heat.action,
                        },
                      },
                      model_source: "AgriSmart AI Climate Risk ML Ensemble",
                      updated_at: res.updated_at,
                    };
                    return resolve(transformed);
                  }
                }
              } catch {
                // parse error, try next
              }
            }
          },
        );

        child.stdin?.end();
      } catch {
        // proceed
      }
    }

    setTimeout(() => {
      if (!resolved) resolve(null);
    }, 12000);
  });
}

/**
 * Deterministic climate risk calculation based on live meteorological data
 */
function computeFallbackClimateRisk(
  forecast: WeatherForecast[],
  current: { temperature: number; humidity: number },
): ClimateRiskResult {
  const f7 = forecast.slice(0, 7);
  const n = f7.length || 1;

  const dryDays = f7.filter((d) => d.rainfall < 1).length;
  const avgMaxTemp = f7.reduce((s, d) => s + d.maxTemperature, 0) / n;
  let drought = Math.min(70, dryDays * 10) + (avgMaxTemp > 34 ? 30 : 0);
  drought = Math.min(95, Math.max(10, Math.round(drought)));

  const totalRain = f7.reduce((s, d) => s + d.rainfall, 0);
  const flood = Math.min(95, Math.max(10, Math.round(totalRain * 1.5)));

  const heatRaw =
    f7.reduce((s, d) => s + Math.max(0, (d.maxTemperature - 30) * 10), 0) / n;
  const heatStress = Math.min(95, Math.max(10, Math.round(heatRaw)));

  const overall = Math.round(drought * 0.35 + flood * 0.35 + heatStress * 0.3);
  const level = getLevelFromScore(overall);

  const texts = generateFarmerFriendlyExplanations(drought, flood, heatStress);

  return {
    drought,
    flood,
    heatStress,
    overall,
    level,
    explanation: texts.overallExplanation,
    risks: {
      drought: {
        label: "Drought Risk",
        level: getLevelFromScore(drought),
        score: drought,
        why: texts.drought.why,
        action: texts.drought.action,
      },
      flood: {
        label: "Flood Risk",
        level: getLevelFromScore(flood),
        score: flood,
        why: texts.flood.why,
        action: texts.flood.action,
      },
      heat_stress: {
        label: "Heat Stress Risk",
        level: getLevelFromScore(heatStress),
        score: heatStress,
        why: texts.heat.why,
        action: texts.heat.action,
      },
    },
    model_source: "Calibrated Live Meteorological Estimation",
    updated_at: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

/**
 * GET /api/v1/weather/climate-risk
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

    const mlApiUrl =
      process.env.ML_API_URL ||
      process.env.NEXT_PUBLIC_ML_API_URL ||
      "http://localhost:8000";

    // 1. Try FastAPI Climate Risk Endpoint
    try {
      const fastApiRes = await fetch(
        `${mlApiUrl.replace(/\/+$/, "")}/api/climate-risk?latitude=${lat}&longitude=${lon}`,
        {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(3500),
          next: { revalidate: 1800 },
        },
      );

      if (fastApiRes.ok) {
        const json = await fastApiRes.json();
        if (json && json.risks) {
          const droughtScore = Math.max(5, Math.min(98, Number(json.risks?.drought?.score ?? 20)));
          const floodScore = Math.max(5, Math.min(98, Number(json.risks?.flood?.score ?? 20)));
          const heatScore = Math.max(5, Math.min(98, Number(json.risks?.heat_stress?.score ?? 20)));
          const overallScore = Math.round(
            droughtScore * 0.35 + floodScore * 0.35 + heatScore * 0.3,
          );
          const overallLvl = getLevelFromScore(overallScore);

          const texts = generateFarmerFriendlyExplanations(
            droughtScore,
            floodScore,
            heatScore,
          );

          const responseData: ClimateRiskResult = {
            drought: droughtScore,
            flood: floodScore,
            heatStress: heatScore,
            overall: overallScore,
            level: overallLvl,
            explanation: texts.overallExplanation,
            risks: {
              drought: {
                label: "Drought Risk",
                level: getLevelFromScore(droughtScore),
                score: droughtScore,
                why: texts.drought.why,
                action: texts.drought.action,
              },
              flood: {
                label: "Flood Risk",
                level: getLevelFromScore(floodScore),
                score: floodScore,
                why: texts.flood.why,
                action: texts.flood.action,
              },
              heat_stress: {
                label: "Heat Stress Risk",
                level: getLevelFromScore(heatScore),
                score: heatScore,
                why: texts.heat.why,
                action: texts.heat.action,
              },
            },
            model_source: "FastAPI Climate Risk ML Ensemble",
            updated_at: json.updated_at,
          };

          return NextResponse.json({ success: true, data: responseData });
        }
      }
    } catch {
      // fallback to python bridge
    }

    // 2. Try direct Python bridge
    const bridgeResult = await runPythonClimateRiskBridge(lat, lon);
    if (bridgeResult) {
      return NextResponse.json({ success: true, data: bridgeResult });
    }

    // 3. Fallback to live meteorological weather estimation
    const coords = { latitude: lat, longitude: lon };
    const [forecast, current] = await Promise.all([
      fetchWeatherForecast(location, coords, 7),
      fetchLiveWeather(location, coords),
    ]);

    const fallbackResult = computeFallbackClimateRisk(forecast, {
      temperature: current.temperature,
      humidity: current.humidity,
    });

    return NextResponse.json({ success: true, data: fallbackResult });
  } catch (err) {
    console.error("[Climate Risk API Error]", err);
    return NextResponse.json(
      {
        success: false,
        error: "Climate risk data unavailable. Please refresh.",
      },
      { status: 503 },
    );
  }
}
