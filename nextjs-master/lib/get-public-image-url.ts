import { supabase } from "./supabase";

export function getPublicImageUrl(path: string | null | undefined): string {
  if (!path) return "/fallback-image.jpg";

  const { data } = supabase.storage.from("listings").getPublicUrl(path);
  return data?.publicUrl || "/fallback-image.jpg";
}