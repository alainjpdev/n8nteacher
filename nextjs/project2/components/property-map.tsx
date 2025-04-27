"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

interface PropertyMapProps {
  address: string;
}

export default function PropertyMap({ address }: PropertyMapProps) {
  // In a real implementation, this would use a mapping API like Google Maps, Mapbox, etc.
  // For our demo, we'll create a simple placeholder map
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Location</h2>
      
      <div className="relative h-[400px] overflow-hidden rounded-lg border bg-muted">
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-2 text-lg font-medium">{address}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Map integration would be implemented here using Google Maps, Mapbox or similar.
            </p>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-lg font-medium">Neighborhood Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Nearby Schools</h4>
            <ul className="mt-1 space-y-1 text-sm">
              <li>Jefferson Elementary - 0.8 miles</li>
              <li>Washington Middle School - 1.2 miles</li>
              <li>Lincoln High School - 1.5 miles</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Transportation</h4>
            <ul className="mt-1 space-y-1 text-sm">
              <li>Downtown Transit Station - 0.4 miles</li>
              <li>Highway Access - 1.0 miles</li>
              <li>International Airport - 12 miles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}