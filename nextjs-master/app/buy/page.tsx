"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { getProperties } from "@/lib/supabase";
import PropertyCard from "@/components/property-card";

export default function BuyPage() {
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const fetchedProperties = await getProperties();
      console.log("Fetched properties:", fetchedProperties);

      // ✅ Adaptamos campos aquí
      const adapted = fetchedProperties.map((p: any) => ({
        id: p.id || Math.random().toString(36).substr(2, 9), // genera id si no hay
        title: p.title || "Untitled Property",
        address: p.address || "Location not specified",  // ponemos texto default
        price: p.price || 0,
        type: p.type || "sale",
        bedrooms: p.bedrooms ?? 0,
        bathrooms: p.bathrooms ?? 0,
        squareFeet: p.sqft ?? 0,  // 👈 corregimos el nombre
        images: p.images || [],    // fallback si no hay imágenes
      }));

      setProperties(adapted);
    };
    fetchProperties();
  }, []);

  const newProperties = properties.filter((p) => p.type === "sale");
  const rentalProperties = properties.filter((p) => p.type === "rent");

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      {/* ... (todo igual aquí, omito para no repetir) ... */}

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight">Popular Homes for Sale</h2>
              <p className="max-w-2xl text-muted-foreground">
                Explore our most viewed properties for sale this week.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/search">View all</Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                address={property.address}
                price={property.price}
                type={property.type}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                squareFeet={property.squareFeet}
                imageUrl={Array.isArray(property.images) && property.images.length > 0 
                  ? property.images[0] 
                  : "/fallback.jpg"
                }
                isNew={false}
                isFeatured={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Rentals Section */}
      {/* Igual al de arriba solo cambiando properties */}
    </div>
  );
}
