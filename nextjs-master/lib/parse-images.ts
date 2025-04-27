export function parseImages(images: any): string[] {
  if (!images) return [];

  if (Array.isArray(images)) {
    return images.map((url) => typeof url === "string" ? url.trim() : "").filter(Boolean);
  }

  if (typeof images === "string") {
    return images.replace("{", "").replace("}", "").split(",").map(url => url.trim()).filter(Boolean);
  }

  return [];
}
