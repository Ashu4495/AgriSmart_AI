import { insforge } from "@/lib/insforge";

export interface FarmerProfileRecord {
  id?: string;
  user_id: string;
  full_name: string;
  phone?: string;
  dob?: string;
  language?: string;
  preferred_units?: string;
  profile_photo?: string;
  farm_name?: string;
  farming_type?: string;
  farm_size_acres?: number;
  years_experience?: number;
  primary_crop?: string;
  organic_farming?: boolean;
  soil_type?: string;
  irrigation_source?: string;
  state?: string;
  district?: string;
  village?: string;
  pin_code?: string;
  preferences_json?: any;
  notifications_json?: any;
  updated_at?: string;
}

export interface SoilReadingRecord {
  id?: string;
  user_id: string;
  n: number;
  p: number;
  k: number;
  ph: number;
  organic_carbon?: number;
  soil_type?: string;
  source?: string;
  recorded_at?: string;
}

export interface DiseaseScanRecord {
  id?: string;
  user_id: string;
  image_url: string;
  image_key?: string;
  disease_id?: string;
  crop_name: string;
  disease_name: string;
  confidence: number;
  severity: "Low" | "Moderate" | "High" | "Critical";
  symptoms?: string;
  organic_cure?: string;
  chemical_cure?: string;
  treated: boolean;
  scanned_at?: string;
}

export interface PlannedCropRecord {
  id?: string;
  user_id: string;
  name: string;
  variety?: string;
  area_acres: number;
  sowing_date: string;
  harvest_date: string;
  expected_yield_quintal?: number;
  status: "Planned" | "Growing" | "Harvested";
  created_at?: string;
}

export interface FarmTaskRecord {
  id?: string;
  user_id: string;
  crop_id?: string;
  title: string;
  description?: string;
  category: "soil" | "sowing" | "irrigation" | "fertilizer" | "pest" | "harvest" | "general";
  due_date: string;
  completed: boolean;
  completed_at?: string;
  created_at?: string;
}

export interface CropRecommendationRecord {
  id?: string;
  user_id: string;
  crop_name: string;
  confidence: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  location?: string;
  reason?: string;
  created_at?: string;
}

export interface ChatMessageRecord {
  id?: string;
  user_id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  has_crops?: boolean;
  crops_json?: any;
  sources_json?: any;
  created_at?: string;
}

export interface NotificationRecord {
  id?: string;
  user_id: string;
  title: string;
  message: string;
  type: "weather" | "crop" | "task" | "market" | "scheme";
  is_read: boolean;
  link?: string;
  created_at?: string;
}

export interface SchemeRecord {
  id: string;
  name: string;
  authority?: string;
  summary: string;
  benefit?: string;
  apply_url?: string;
  eligibility_rules_json?: any;
  state?: string;
  category?: string;
  icon_type?: string;
  created_at?: string;
}

// ---------------------------------------------------------------------------
// 1. Farmer Profile
// ---------------------------------------------------------------------------
export async function getFarmerProfile(userId: string): Promise<FarmerProfileRecord | null> {
  const { data, error } = await insforge.database
    .from("farm_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    console.error("[DB getFarmerProfile Error]", error);
  }
  return data || null;
}

export async function upsertFarmerProfile(profile: Partial<FarmerProfileRecord> & { user_id: string }) {
  const payload = {
    ...profile,
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await insforge.database
    .from("farm_profiles")
    .select("id")
    .eq("user_id", profile.user_id)
    .maybeSingle();

  let result;
  if (existing && existing.id) {
    result = await insforge.database
      .from("farm_profiles")
      .update(payload)
      .eq("user_id", profile.user_id)
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
    console.error("[DB upsertFarmerProfile Error]", error);
    throw error;
  }
  return data;
}

// ---------------------------------------------------------------------------
// 2. Soil Readings
// ---------------------------------------------------------------------------
export async function getLatestSoilReading(userId: string): Promise<SoilReadingRecord | null> {
  const { data, error } = await insforge.database
    .from("soil_readings")
    .select("*")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) console.error("[DB getLatestSoilReading Error]", error);
  return data || null;
}

export async function saveSoilReading(reading: Omit<SoilReadingRecord, "id" | "recorded_at">) {
  const payload = {
    ...reading,
    recorded_at: new Date().toISOString(),
  };

  const { data, error } = await insforge.database
    .from("soil_readings")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("[DB saveSoilReading Error]", error);
    throw error;
  }
  return data;
}

// ---------------------------------------------------------------------------
// 3. Disease Scans
// ---------------------------------------------------------------------------
export async function getDiseaseScans(userId: string): Promise<DiseaseScanRecord[]> {
  const { data, error } = await insforge.database
    .from("disease_scans")
    .select("*")
    .eq("user_id", userId)
    .order("scanned_at", { ascending: false });

  if (error) {
    console.error("[DB getDiseaseScans Error]", error);
    return [];
  }
  return data || [];
}

export async function saveDiseaseScan(scan: Omit<DiseaseScanRecord, "id" | "scanned_at">) {
  const payload = {
    ...scan,
    scanned_at: new Date().toISOString(),
  };

  const { data, error } = await insforge.database
    .from("disease_scans")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("[DB saveDiseaseScan Error]", error);
    throw error;
  }
  return data;
}

export async function updateScanTreated(scanId: string, treated: boolean) {
  const { data, error } = await insforge.database
    .from("disease_scans")
    .update({ treated })
    .eq("id", scanId)
    .select()
    .single();

  if (error) {
    console.error("[DB updateScanTreated Error]", error);
    throw error;
  }
  return data;
}

// ---------------------------------------------------------------------------
// 4. Planned Crops & Tasks
// ---------------------------------------------------------------------------
export async function getPlannedCrops(userId: string): Promise<PlannedCropRecord[]> {
  const { data, error } = await insforge.database
    .from("planned_crops")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[DB getPlannedCrops Error]", error);
    return [];
  }
  return data || [];
}

export async function addPlannedCrop(crop: Omit<PlannedCropRecord, "id" | "created_at">) {
  const payload = {
    ...crop,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await insforge.database
    .from("planned_crops")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("[DB addPlannedCrop Error]", error);
    throw error;
  }
  return data;
}

export async function deletePlannedCrop(cropId: string, userId: string) {
  const { error } = await insforge.database
    .from("planned_crops")
    .delete()
    .eq("id", cropId)
    .eq("user_id", userId);

  if (error) throw error;
  return true;
}

export async function getFarmTasks(userId: string): Promise<FarmTaskRecord[]> {
  const { data, error } = await insforge.database
    .from("farm_tasks")
    .select("*")
    .eq("user_id", userId)
    .order("due_date", { ascending: true });

  if (error) {
    console.error("[DB getFarmTasks Error]", error);
    return [];
  }
  return data || [];
}

export async function addFarmTask(task: Omit<FarmTaskRecord, "id" | "created_at">) {
  const payload = {
    ...task,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await insforge.database
    .from("farm_tasks")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("[DB addFarmTask Error]", error);
    throw error;
  }
  return data;
}

export async function toggleFarmTask(taskId: string, completed: boolean) {
  const { data, error } = await insforge.database
    .from("farm_tasks")
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    console.error("[DB toggleFarmTask Error]", error);
    throw error;
  }
  return data;
}

export async function deleteFarmTask(taskId: string, userId: string) {
  const { error } = await insforge.database
    .from("farm_tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", userId);

  if (error) throw error;
  return true;
}

// ---------------------------------------------------------------------------
// 5. Crop Recommendations History
// ---------------------------------------------------------------------------
export async function saveCropRecommendationRecord(rec: Omit<CropRecommendationRecord, "id" | "created_at">) {
  const payload = {
    ...rec,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await insforge.database
    .from("crop_recommendations")
    .insert([payload])
    .select()
    .single();

  if (error) console.error("[DB saveCropRecommendation Error]", error);
  return data;
}

export async function getCropRecommendationHistory(userId: string): Promise<CropRecommendationRecord[]> {
  const { data, error } = await insforge.database
    .from("crop_recommendations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("[DB getCropRecommendationHistory Error]", error);
    return [];
  }
  return data || [];
}

// ---------------------------------------------------------------------------
// 6. Chat Messages History
// ---------------------------------------------------------------------------
export async function saveChatMessage(msg: Omit<ChatMessageRecord, "id" | "created_at">) {
  const payload = {
    ...msg,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await insforge.database
    .from("chat_messages")
    .insert([payload])
    .select()
    .single();

  if (error) console.error("[DB saveChatMessage Error]", error);
  return data;
}

export async function getChatMessages(userId: string, sessionId?: string): Promise<ChatMessageRecord[]> {
  let query = insforge.database
    .from("chat_messages")
    .select("*")
    .eq("user_id", userId);

  if (sessionId) {
    query = query.eq("session_id", sessionId);
  }

  const { data, error } = await query.order("created_at", { ascending: true });
  if (error) {
    console.error("[DB getChatMessages Error]", error);
    return [];
  }
  return data || [];
}

// ---------------------------------------------------------------------------
// 7. Schemes & Notifications
// ---------------------------------------------------------------------------
export async function getSchemesFromDB(state?: string, category?: string): Promise<SchemeRecord[]> {
  let query = insforge.database.from("schemes").select("*");

  if (state && state !== "All India" && state !== "All States") {
    query = query.or(`state.eq.${state},state.eq.All India,state.eq.ALL`);
  }

  if (category && category !== "All Categories") {
    query = query.eq("category", category);
  }

  const { data, error } = await query.order("name", { ascending: true });
  if (error) {
    console.error("[DB getSchemesFromDB Error]", error);
    return [];
  }
  return data || [];
}

export async function getNotifications(userId: string): Promise<NotificationRecord[]> {
  const { data, error } = await insforge.database
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[DB getNotifications Error]", error);
    return [];
  }
  return data || [];
}

export async function markNotificationRead(id: string) {
  const { error } = await insforge.database
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);

  if (error) console.error("[DB markNotificationRead Error]", error);
}
