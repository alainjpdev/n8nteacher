"use client";

import { Bed, Bath, Square, MapPin, Calendar, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PropertyGallery from "@/components/property-gallery";
import PropertyMap from "@/components/property-map";
import PropertyFeatures from "@/components/property-features";
import PropertyContactForm from "@/components/property-contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: "sale" | "rent";
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  images: string[]; // o ajusta si tu campo en Supabase es diferente
}

export default function PropertyPageClient({ property }: { property: Property }) {
  return (
    <div className="container max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-6">
        <Button variant="ghost" className="mb-4 pl-0" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to listings
          </Link>
        </Button>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{property.address}</span>
            </div>
          </div>

          <div className="flex flex-col items-start justify-end gap-2 md:items-end">
            <div className="text-3xl font-bold md:text-4xl">
              ${property.price.toLocaleString()}
              {property.type === "rent" && (
                <span className="text-base font-normal text-muted-foreground">/month</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                <span>{property.squareFeet.toLocaleString()} sq ft</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PropertyGallery imageUrl={property.images[0]} propertyTitle={property.title} />

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Property Description</h2>
                <p className="text-muted-foreground">
                  Discover this {property.title.toLowerCase()} featuring {property.bedrooms} bedrooms and {property.bathrooms} bathrooms across {property.squareFeet.toLocaleString()} sq ft.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="features" className="mt-6">
              <PropertyFeatures />
            </TabsContent>

            <TabsContent value="map" className="mt-6">
              <PropertyMap address={property.address} />
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyContactForm propertyId={property.id} propertyTitle={property.title} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}