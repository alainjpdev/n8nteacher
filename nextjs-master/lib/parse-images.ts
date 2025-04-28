export function parseImages(images: any): string[] {
  if (!images) return []; // Si no hay imágenes, regreso array vacío

  if (Array.isArray(images)) {
    // Si es array, limpio cada URL
    return images
      .map((url) => typeof url === "string" ? url.trim() : "") // Elimino espacios
      .filter(Boolean); // Elimino strings vacíos
  }

  if (typeof images === "string") {
    // Si es un string como "{url1,url2,url3}", limpio las llaves y separo
    return images
      .replace("{", "")
      .replace("}", "")
      .split(",")
      .map(url => url.trim())
      .filter(Boolean);
  }

  return []; // Si no es ni array ni string, regreso array vacío
}