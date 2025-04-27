"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { getProperties } from "@/lib/supabase";
import PropertyCard from "@/components/property-card";

export default function RentPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      const fetchedProperties = await getProperties();
      console.log("Fetched rental properties:", fetchedProperties);

      const adapted = fetchedProperties.map((p: any) => ({
        id: p.id || Math.random().toString(36).substr(2, 9),
        title: p.title || "Untitled Property",
        address: p.address || "Location not specified",
        price: p.price || 0,
        type: p.type || "rent",
        bedrooms: p.bedrooms ?? 0,
        bathrooms: p.bathrooms ?? 0,
        squareFeet: p.sqft ?? 0,
        images: p.images || [],
      }));

      setProperties(adapted);
    };
    fetchProperties();
  }, []);

  const rentals = properties.filter((p) => p.type === "rent");

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>

        <div className="container relative z-10 flex h-full flex-col items-center justify-center px-4 text-center md:px-6">
          <h1 className="mb-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Find Your Perfect Rental
          </h1>
          <p className="mb-8 max-w-xl text-lg text-white/90">
            Browse thousands of rental properties across the Mexican Riviera.
          </p>

          <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={searchInput}
                readOnly
                placeholder="Select a location"
                className="bg-white pl-10 cursor-pointer"
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              />
              {showDropdown && (
                <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow z-50">
                  <ul>
                    <li
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSearchInput("Tulum");
                        setShowDropdown(false);
                      }}
                    >
                      Tulum
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Rentals Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight">Properties for Rent</h2>
              <p className="max-w-2xl text-muted-foreground">
                Check out our latest rental listings available today.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/search">View all</Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rentals.map((property) => (
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
    </div>
  );
}