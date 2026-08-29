import { NextResponse } from "next/server";
import { fetchLiveWeather } from "@/lib/weather";
import { getLiveMarketData } from "@/lib/market";
import { insforge } from "@/lib/insforge";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const location = searchParams.get("location") || "Vasai, Maharashtra";
    const latParam = searchParams.get("lat");
    const lonParam = searchParams.get("lon");

    const coords =
      latParam && lonParam
        ? { latitude: parseFloat(latParam), longitude: parseFloat(lonParam) }
        : null;

    // 1. Fetch Profile (Farm Overview)
    let profile = null;
    if (userId) {
      const { data, error } = await insforge.database
        .from("farm_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (!error && data) {
        profile = {
          ...data,
          farm_area: data.farm_size_acres ? `${data.farm_size_acres} Acres` : "5.0 Acres",
          current_crop: data.primary_crop || "Wheat / Rice",
          crop_stage: "Vegetative / Growth Stage",
        };
      }
    }

    // 2. Fetch Latest Crop Recommendation
    let cropRecommendation = null;
    if (userId) {
      const { data, error } = await insforge.database
        .from("crop_recommendations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!error && data) {
        cropRecommendation = {
          ...data,
          recommended_crop: data.crop_name,
          confidence_score: data.confidence,
        };
      }
    }

    // 3. Fetch Latest Soil Reading
    let soilHealth = null;
    if (userId) {
      const { data } = await insforge.database
        .from("soil_readings")
        .select("*")
        .eq("user_id", userId)
        .order("recorded_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        const ph = Number(data.ph) || 6.5;
        const isOptimal = ph >= 6.0 && ph <= 7.5;
        soilHealth = {
          score: isOptimal ? 88 : 72,
          status: isOptimal ? "Optimal Soil Chemistry" : "Slightly Acidic / Sub-optimal",
          n: data.n,
          p: data.p,
          k: data.k,
          ph: data.ph,
          soilType: data.soil_type || "Loamy Soil",
        };
      }
    }

    // Default fallback soil health if none recorded yet
    if (!soilHealth) {
      soilHealth = {
        score: 85,
        status: "Optimal Soil Quality",
        n: 80,
        p: 40,
        k: 50,
        ph: 6.8,
        soilType: "Loamy Soil",
      };
    }

    // 4. Fetch Tasks
    let tasks: any[] = [];
    if (userId) {
      const { data } = await insforge.database
        .from("farm_tasks")
        .select("*")
        .eq("user_id", userId)
        .eq("completed", false)
        .order("due_date", { ascending: true })
        .limit(5);

      if (data && data.length > 0) {
        tasks = data.map((t) => ({
          id: t.id,
          name: t.title,
          description: t.description || `${t.category} task scheduled for your farm.`,
          dueDate: t.due_date,
        }));
      }
    }

    // Default default tasks if user has none
    if (tasks.length === 0) {
      tasks = [
        {
          id: "t-default-1",
          name: "Soil Moisture Inspection",
          description: "Check root zone soil moisture before morning irrigation.",
          dueDate: "Tomorrow",
        },
        {
          id: "t-default-2",
          name: "Secondary Nutrient Top-Dressing",
          description: "Apply scheduled split dose of Urea/Potash.",
          dueDate: "In 3 days",
        },
      ];
    }

    // 5. Fetch Notifications
    let notifications: any[] = [];
    if (userId) {
      const { data } = await insforge.database
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (data && data.length > 0) {
        notifications = data.map((n) => ({
          id: n.id,
          title: n.title,
          description: n.message,
          time: new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }));
      }
    }

    // 6. Fetch Weather & Alerts
    let weather = null;
    try {
      weather = await fetchLiveWeather(location, coords);
    } catch (err) {
      console.error("[Dashboard API] Weather fetch failed:", err);
    }

    // 7. Fetch Market Prices
    let marketPrices = null;
    try {
      marketPrices = getLiveMarketData();
    } catch (err) {
      console.error("[Dashboard API] Market fetch failed:", err);
    }

    return NextResponse.json({
      success: true,
      data: {
        profile,
        cropRecommendation,
        weather,
        marketPrices,
        soilHealth,
        tasks,
        notifications: notifications.length > 0 ? notifications : [
          {
            id: "n-default-1",
            title: `Weather Advisory for ${location}`,
            description: "Favorable conditions for crop growth. Maintain balanced irrigation.",
            time: "Today",
          },
        ],
      },
    });
  } catch (err) {
    console.error("[Dashboard API Error]", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load dashboard data.",
      },
      { status: 500 },
    );
  }
}
