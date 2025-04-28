import { notFound } from "next/navigation";
import { getPropertyById, getProperties } from "@/lib/supabase";
import PropertyPageClient from "./client";
import { parseImages } from "@/lib/parse-images";

interface PropertyPageProps {
  params: { id: string };
}

// ✅ GENERAMOS TODOS LOS ID DE LAS PROPIEDADES
export async function generateStaticParams() {
  const properties = await getProperties(); // 🚀 Trae todas las propiedades
  return properties.map((property) => ({
    id: property.id, // 🔥 Devuelve todos los IDs
  }));
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  console.log('🧩 PropertyPage -> ID recibido:', params.id);
  
  const property = await getPropertyById(params.id);
  
  console.log('🏡 Property encontrado:', property);

  if (!property) {
    console.error('🚨 No se encontró la propiedad, enviando a 404');
    notFound();
  }

  const formattedProperty = {
    id: property.id,
    title: property.title,
    address: property.address,
    price: property.price,
    type: property.type || "sale",
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    sqft: property.sqft ?? null,
    images: parseImages(property.images),
    description: property.description, 
    year_built: property.year_built,
    city: property.city,
    state: property.state,
  };

  return <PropertyPageClient property={formattedProperty} />;
}