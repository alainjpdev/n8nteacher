"use client";

import { useEffect, useState } from "react";
import { getProperties } from "@/lib/supabase";
import PropertyCard from "@/components/property-card";
import { type PropertyProps } from "@/components/property-card"; // 👈 Importa el tipo

export default function PropertyFeatured() {
  const [featured, setFeatured] = useState<PropertyProps[]>([]); // 👈 Especificamos que es un array de propiedades

  useEffect(() => {
    const fetchFeatured = async () => {
      const properties = await getProperties();
      setFeatured(properties.slice(0, 3)); // Puedes cambiar cómo seleccionas "featured"
    };

    fetchFeatured();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {featured.map((property: PropertyProps) => ( // 👈 Aquí también tipamos property
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
  );
}