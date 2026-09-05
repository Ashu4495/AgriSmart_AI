import { NextResponse } from "next/server";
import { insforge } from "@/lib/insforge";

export const dynamic = "force-dynamic";

// GET profile
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    const { data, error } = await insforge.database
      .from("farm_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("[Settings GET Error]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || {} });
  } catch (err: any) {
    console.error("[Settings GET Exception]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH profile
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, ...updates } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
      user_id: userId,
    };

    const { data: existing } = await insforge.database
      .from("farm_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    let result;
    if (existing && existing.id) {
      result = await insforge.database
        .from("farm_profiles")
        .update(payload)
        .eq("user_id", userId)
        .select()
        .single();
    } else {
      result = await insforge.database
        .from("farm_profiles")
        .insert([payload])
        .select()
        .single();
    }

    const { data, error } = result;

    if (error) {
      console.error("[Settings PATCH Error]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("[Settings PATCH Exception]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
