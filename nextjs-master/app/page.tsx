"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 👈 Agregado
import { Button } from "@/components/ui/button";
import { getProperties } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import SearchTabs from "@/components/search-tabs";
import { Listing } from "../lib/types";
import PropertyCard from "@/components/property-card";
import CTASection from "@/components/cta-section";
import { parseImages } from "@/lib/parse-images";

export default function Home() {
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [newProperties, setNewProperties] = useState<Listing[]>([]);
  const [rentals, setRentals] = useState<Listing[]>([]);
  const [playingIntro, setPlayingIntro] = useState(false); // 👈 Nuevo estado
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      const properties = await getProperties();

      const parsedProperties = properties.map((p) => ({
        ...p,
        images: parseImages(p.images),
      }));

      setFeatured(parsedProperties.slice(0, 3));
      setNewProperties(parsedProperties.filter((p) => p.type === "sale"));
      setRentals(parsedProperties.filter((p) => p.type === "rent"));
    };

    fetchProperties();
  }, []);

  const handleAIButtonClick = () => {
    setPlayingIntro(true);

    setTimeout(() => {
      router.push("/ai-assistant");
    }, 6000); // ⏱ después de 6 segundos (6000 ms)
  };

  if (playingIntro) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <video
          src="https://msfnvmxeohsanzobbqrt.supabase.co/storage/v1/object/public/videos//ai.mp4" // 👈 Cambia aquí tu video intro
          autoPlay
          playsInline
          
          className="w-full h-full object-cover"
        />
        {/* Optional: Puedes agregar un mensaje encima del video */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white animate-pulse">Loading AI Experience...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="https://msfnvmxeohsanzobbqrt.supabase.co/storage/v1/object/public/videos/0427%20(1).mov"
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />

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

      {/* AI Button */}
      <div className="fixed bottom-8 right-8 z-50 animate-fade-up">
        <Button
          variant="default"
          size="lg"
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-105 hover:opacity-90 transition-all duration-300 shadow-xl"
          onClick={handleAIButtonClick}
        >
          <Sparkles className="h-5 w-5" />
          AI Assistant
        </Button>
      </div>

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
                address={property.address ?? ''}
                price={property.price}
                type={property.type as "sale" | "rent"}
                bedrooms={property.bedrooms ?? 0}
                bathrooms={property.bathrooms ?? 0}
                sqft={property.sqft ?? 0}
                imageUrl={property.images[0] || ""}
                isNew={false}
                isFeatured={true}
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