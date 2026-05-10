import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://issvdwkurrdpeynrfobh.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlzc3Zkd2t1cnJkcGV5bnJmb2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzcyNTQsImV4cCI6MjA5MzkxMzI1NH0.rzi_0DFrPjgkf6V7bbwA78dIhYZSdF5pe_Mw5MlX3M0";

// Browser/client-side Supabase client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================
// Database Types
// ============================================================

export type UploadStatus = "pending" | "processing" | "completed" | "failed";

export interface User {
  id: string;
  email: string;
  invitation_code: string | null;
  plan: string;
  created_at: string;
}

export interface Upload {
  id: string;
  user_id: string;
  catalog_name: string | null;
  file_url: string | null;
  file_size: number | null;
  page_count: number | null;
  status: UploadStatus;
  breeder_name: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface Variety {
  id: string;
  crop: string | null;
  series: string | null;
  variety: string | null;
  code: string | null;
  breeder: string | null;
  image_url: string | null;
  quality_score: number | null;
  source_upload_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExtractedImage {
  id: string;
  upload_id: string;
  variety_id: string | null;
  page_number: number | null;
  confidence_score: number | null;
  quality_score: number | null;
  raw_image_url: string | null;
  processed_image_url: string | null;
  detected_crop: string | null;
  detected_series: string | null;
  detected_variety: string | null;
  detected_code: string | null;
  validated: boolean;
  validated_by: string | null;
  created_at: string;
}

export interface Space {
  id: string;
  user_id: string;
  space_name: string;
  description: string | null;
  created_at: string;
}

export interface SpaceItem {
  id: string;
  space_id: string;
  variety_id: string;
  added_at: string;
  variety?: Variety;
}

export interface BreederTemplate {
  id: string;
  breeder_name: string;
  layout_pattern: Record<string, unknown> | null;
  page_types: Record<string, unknown> | null;
  extraction_config: Record<string, unknown> | null;
  success_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Auth helpers
// ============================================================

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
}

// ============================================================
// User profile helpers
// ============================================================

export async function getUserProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data as User;
}

export async function updateInvitationCode(
  userId: string,
  code: string
): Promise<boolean> {
  const { error } = await supabase
    .from("users")
    .update({ invitation_code: code })
    .eq("id", userId);
  return !error;
}

export const VALID_INVITATION_CODE =
  process.env.NEXT_PUBLIC_INVITATION_CODE ?? "SJ9597";

// ============================================================
// Varieties helpers
// ============================================================

export async function searchVarieties(
  query: string,
  crop?: string,
  series?: string,
  limit = 40
): Promise<Variety[]> {
  let req = supabase.from("varieties").select("*").limit(limit);

  if (query) {
    req = req.or(
      `crop.ilike.%${query}%,series.ilike.%${query}%,variety.ilike.%${query}%,code.ilike.%${query}%`
    );
  }
  if (crop && crop !== "all") {
    req = req.ilike("crop", crop);
  }
  if (series && series !== "all") {
    req = req.ilike("series", series);
  }

  const { data, error } = await req.order("created_at", { ascending: false });
  if (error) {
    console.error("searchVarieties error:", error);
    return [];
  }
  return (data as Variety[]) ?? [];
}

export async function getDistinctCrops(): Promise<string[]> {
  const { data } = await supabase
    .from("varieties")
    .select("crop")
    .not("crop", "is", null)
    .order("crop");
  if (!data) return [];
  const unique = [...new Set(data.map((r) => r.crop as string))];
  return unique;
}

export async function getDistinctSeries(): Promise<string[]> {
  const { data } = await supabase
    .from("varieties")
    .select("series")
    .not("series", "is", null)
    .order("series");
  if (!data) return [];
  const unique = [...new Set(data.map((r) => r.series as string))];
  return unique;
}

// ============================================================
// Uploads helpers
// ============================================================

export async function createUploadRecord(
  userId: string,
  catalogName: string,
  fileSize: number
): Promise<Upload | null> {
  const { data, error } = await supabase
    .from("uploads")
    .insert({
      user_id: userId,
      catalog_name: catalogName,
      file_size: fileSize,
      status: "pending",
    })
    .select()
    .single();
  if (error) {
    console.error("createUploadRecord error:", error);
    return null;
  }
  return data as Upload;
}

export async function updateUploadFileUrl(
  uploadId: string,
  fileUrl: string
): Promise<boolean> {
  const { error } = await supabase
    .from("uploads")
    .update({ file_url: fileUrl, status: "pending" })
    .eq("id", uploadId);
  return !error;
}

export async function getUpload(uploadId: string): Promise<Upload | null> {
  const { data, error } = await supabase
    .from("uploads")
    .select("*")
    .eq("id", uploadId)
    .single();
  if (error) return null;
  return data as Upload;
}

export async function getUserUploads(userId: string): Promise<Upload[]> {
  const { data, error } = await supabase
    .from("uploads")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data as Upload[]) ?? [];
}

// ============================================================
// Spaces helpers
// ============================================================

export async function getUserSpaces(userId: string): Promise<Space[]> {
  const { data, error } = await supabase
    .from("spaces")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data as Space[]) ?? [];
}

export async function createSpace(
  userId: string,
  spaceName: string,
  description?: string
): Promise<Space | null> {
  const { data, error } = await supabase
    .from("spaces")
    .insert({ user_id: userId, space_name: spaceName, description })
    .select()
    .single();
  if (error) {
    console.error("createSpace error:", error);
    return null;
  }
  return data as Space;
}

export async function deleteSpace(spaceId: string): Promise<boolean> {
  const { error } = await supabase.from("spaces").delete().eq("id", spaceId);
  return !error;
}

export async function getSpaceItems(spaceId: string): Promise<SpaceItem[]> {
  const { data, error } = await supabase
    .from("space_items")
    .select("*, variety:varieties(*)")
    .eq("space_id", spaceId)
    .order("added_at", { ascending: false });
  if (error) return [];
  return (data as SpaceItem[]) ?? [];
}

export async function addToSpace(
  spaceId: string,
  varietyId: string
): Promise<boolean> {
  const { error } = await supabase
    .from("space_items")
    .insert({ space_id: spaceId, variety_id: varietyId });
  return !error;
}

export async function removeFromSpace(
  spaceId: string,
  varietyId: string
): Promise<boolean> {
  const { error } = await supabase
    .from("space_items")
    .delete()
    .eq("space_id", spaceId)
    .eq("variety_id", varietyId);
  return !error;
}

// ============================================================
// Storage helpers
// ============================================================

export async function uploadCatalogPDF(
  userId: string,
  file: File,
  uploadId: string
): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "pdf";
  const path = `${userId}/${uploadId}.${ext}`;

  const { error } = await supabase.storage
    .from("catalogs")
    .upload(path, file, { upsert: false, contentType: "application/pdf" });

  if (error) {
    console.error("uploadCatalogPDF error:", error);
    return null;
  }

  const { data } = supabase.storage.from("catalogs").getPublicUrl(path);
  return data.publicUrl;
}

export async function getVarietyImageUrl(path: string): Promise<string> {
  const { data } = supabase.storage.from("varieties").getPublicUrl(path);
  return data.publicUrl;
}
