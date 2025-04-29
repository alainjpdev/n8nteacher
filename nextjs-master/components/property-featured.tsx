"use client";

import { useEffect, useState } from "react";
import { getProperties, getFavoritePropertyIds } from "@/lib/supabase";
import PropertyCard, { type PropertyProps } from "@/components/property-card";

export default function PropertyFeatured() {
  const [featured, setFeatured] = useState<PropertyProps[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const properties = await getProperties();
      const favoriteIds = await getFavoritePropertyIds(); // 👈 traer favoritos del usuario

      const formatted = properties.slice(0, 3).map((property) => ({
        id: property.id,
        title: property.title,
        address: property.address,
        price: property.price,
        type: property.type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        sqft: property.sqft,
        imageUrl: property.images?.[0] || "",
        isNew: false,
        isFeatured: true,
        isFavorite: favoriteIds.includes(property.id), // 👈 importante
      }));

      setFeatured(formatted);
    };

    fetchFeatured();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {featured.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
  );
}