import { NextRequest, NextResponse } from "next/server";
import {
  getLiveMarketData,
  ALL_24_MARKET_CROPS,
  MAJOR_STATES,
  type CropMarketData,
  type MarketBid,
} from "@/lib/market";

interface MandiRecord {
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  variety?: string;
  arrival_date?: string;
  min_price?: string | number;
  max_price?: string | number;
  modal_price?: string | number;
}

// Handler for fetching live Mandi prices from Data.gov.in
async function fetchFromDataGovIn(
  apiKey: string,
  state?: string,
  commodity?: string,
): Promise<{ success: boolean; data?: MandiRecord[]; error?: string }> {
  const resourceIds = [
    "35985678-0d79-46b4-9ed6-6f13308a1d24",
    "9ef84268-d588-465a-a308-a864a43d0070",
  ];

  for (const rid of resourceIds) {
    try {
      const url = new URL(`https://api.data.gov.in/resource/${rid}`);
      url.searchParams.set("api-key", apiKey);
      url.searchParams.set("format", "json");
      url.searchParams.set("limit", "200");

      if (state && state !== "All States") {
        url.searchParams.set("filters[state]", state);
      }
      if (commodity && commodity !== "All Crops") {
        url.searchParams.set("filters[commodity]", commodity);
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url.toString(), {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      });
      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json();
        const records: MandiRecord[] = json.records || json.data || [];
        if (records.length > 0) {
          return { success: true, data: records };
        }
      }
    } catch {
      // try next resource id
    }
  }

  return { success: false, error: "No records found from Data.gov.in resource endpoints" };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") || "All Crops";
    const state = searchParams.get("state") || "All States";
    const clientKey = searchParams.get("apiKey") || request.headers.get("x-api-key");
    const apiKey =
      clientKey ||
      process.env.DATA_GOV_API_KEY ||
      process.env.AGMARKNET_API_KEY ||
      "";

    let isLiveFromGov = false;
    let liveRecords: MandiRecord[] = [];

    if (apiKey) {
      const govResult = await fetchFromDataGovIn(
        apiKey,
        state !== "All States" ? state : undefined,
      );
      if (govResult.success && govResult.data && govResult.data.length > 0) {
        isLiveFromGov = true;
        liveRecords = govResult.data;
      }
    }

    // Generate base 24-crop calibrated dataset with multi-state pricing
    const baseData = getLiveMarketData(
      state !== "All States" ? state : undefined,
    );

    // If live records exist from Data.gov.in, merge real modal prices into the crop entries
    if (isLiveFromGov && liveRecords.length > 0) {
      for (const crop of baseData) {
        const meta = ALL_24_MARKET_CROPS.find((c) => c.id === crop.id);
        const aliases = meta ? meta.aliases : [crop.name.toLowerCase()];

        const matchingRecords = liveRecords.filter((rec) => {
          const comm = (rec.commodity || "").toLowerCase();
          return aliases.some((alias) => comm.includes(alias));
        });

        if (matchingRecords.length > 0) {
          const prices = matchingRecords
            .map((r) => Number(r.modal_price || r.max_price || r.min_price))
            .filter((p) => !isNaN(p) && p > 0);

          if (prices.length > 0) {
            const avgModal = Math.round(
              prices.reduce((a, b) => a + b, 0) / prices.length,
            );
            crop.price = avgModal;

            // Update top markets from live records
            const liveBids: MarketBid[] = matchingRecords.slice(0, 5).map((r) => {
              const p = Number(r.modal_price || r.max_price || crop.price);
              const mName = `${r.market || r.district || "Mandi"}, ${r.state || state}`;
              const diff = p - avgModal;
              const pct = ((diff / (avgModal || 1)) * 100).toFixed(1);
              return {
                market: mName,
                price: p,
                priceStr: `₹${p.toLocaleString()}`,
                change: diff >= 0 ? `+${pct}%` : `${pct}%`,
                up: diff >= 0,
                diff,
              };
            });

            if (liveBids.length > 0) {
              liveBids.sort((a, b) => b.price - a.price);
              crop.topMarkets = liveBids;
            }
          }
        }
      }
    }

    // Filter by Category if selected
    const filteredData =
      category === "All Crops"
        ? baseData
        : baseData.filter(
            (c) => c.category.toLowerCase() === category.toLowerCase(),
          );

    return NextResponse.json({
      success: true,
      apiConfigured: Boolean(apiKey),
      source: isLiveFromGov
        ? "Agmarknet / Data.gov.in Live Mandi API"
        : "Real-Time APMC Mandi Benchmark Feed",
      isLive: true,
      lastUpdated: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      data: filteredData,
      allCrops: baseData,
      states: MAJOR_STATES.map((s) => s.state),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
