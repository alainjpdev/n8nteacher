import { notFound } from "next/navigation";
import { getPropertyById, getProperties } from "@/lib/supabase"; // ahora usas 2 funciones
import PropertyClient from "./client"; // la UI del detalle de propiedad

interface PropertyPageProps {
  params: { id: string }; // capturamos el ID de la URL
}

// Static generation (SSG)
export async function generateStaticParams() {
  const properties = await getProperties(); // traer todas las propiedades
  return properties.map((property) => ({
    id: property.id, // generamos un path para cada id
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

  return <PropertyClient property={property} />;
}