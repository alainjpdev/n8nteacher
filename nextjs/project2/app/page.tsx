"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProperties } from "@/lib/supabase"; // <-- Corregido el import
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SearchTabs from "@/components/search-tabs";
import { Listing } from "../lib/types"; 
import PropertyCard from "@/components/property-card"; 
import CTASection from "@/components/cta-section";

export default function Home() {
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [newProperties, setNewProperties] = useState<Listing[]>([]);
  const [rentals, setRentals] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const properties = await getProperties();
      
      setFeatured(properties.slice(0, 3)); 
      setNewProperties(properties.filter((p) => p.type === "sale"));
      setRentals(properties.filter((p) => p.type === "rent"));
    };

    fetchProperties();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            backgroundPosition: "center 30%"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>
        
        <div className="container relative z-10 flex h-full flex-col items-center justify-center px-4 text-center md:px-6">
          <h1 className="mb-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Find Your Perfect Home
          </h1>
          <p className="mb-8 max-w-xl text-lg text-white/90">
            Discover thousands of properties for sale and rent across the Mexican Riviera
          </p>
          
          <div className="w-full max-w-3xl">
            <SearchTabs />
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="mb-10 flex flex-col items-center text-center">
            <h2 className="mb-2 text-3xl font-bold tracking-tight">Featured Properties</h2>
            <p className="max-w-2xl text-muted-foreground">
              Explore our handpicked selection of outstanding properties across the country.
            </p>
          </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featured.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                address={property.address}
                price={property.price}
                type={property.type as "sale" | "rent"}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                squareFeet={property.square_feet}
                imageUrl={Array.isArray(property.images) ? property.images[0] : ""}
                isNew={false}
                isFeatured={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* New Listings */}
      <section className="bg-muted/30 py-16">
        <div className="container px-4 md:px-6">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight">New Listings</h2>
              <p className="max-w-2xl text-muted-foreground">
                Be the first to discover these newly listed properties.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/search">View all</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {newProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                address={property.address}
                price={property.price}
                type={property.type as "sale" | "rent"}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                squareFeet={property.square_feet}
                imageUrl={Array.isArray(property.images) ? property.images[0] : ""}
                isNew={true}
                isFeatured={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Rentals */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight">Popular Rentals</h2>
              <p className="max-w-2xl text-muted-foreground">
                Explore highly-rated rental properties in prime locations.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/rent">View all</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {rentals.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                address={property.address}
                price={property.price}
                type={property.type as "sale" | "rent"}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                squareFeet={property.square_feet}
                imageUrl={Array.isArray(property.images) ? property.images[0] : ""}
                isNew={false}
                isFeatured={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}