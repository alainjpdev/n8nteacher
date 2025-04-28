"use client";

import { useEffect, useState, useCallback } from "react";
import { GoogleMap, OverlayView, useLoadScript } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { getProperties } from "@/lib/supabase";
import { parseImages } from "@/lib/parse-images";
import { Listing } from "@/lib/types";

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 4rem)",
};

const center = {
  lat: 20.2111,
  lng: -87.4654,
};

export default function MapPage() {
  const [properties, setProperties] = useState<Listing[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Listing | null>(null);
  const router = useRouter();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const fetchProperties = useCallback(async () => {
    try {
      const data = await getProperties();
      const parsed = data.map((p) => ({
        ...p,
        images: parseImages(p.images),
      }));
      setProperties(parsed);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  if (loadError) {
    return <div className="flex items-center justify-center h-[calc(100vh-4rem)]">Error loading map</div>;
  }

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-[calc(100vh-4rem)]">Loading Map...</div>;
  }

  const handleCardClick = (propertyId: string) => {
    router.push(`/property/${propertyId}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {properties.map((property) =>
          property.latitude && property.longitude ? (
            <OverlayView
              key={property.id}
              position={{ lat: property.latitude, lng: property.longitude }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div
                onClick={() => setSelectedProperty(property)}
                style={{
                  background: "#900c0c",
                  padding: property.price ? "6px 10px" : "8px",
                  color: "white",
                  borderRadius: "9999px",
                  fontWeight: "bold",
                  fontSize: property.price ? "14px" : "10px",
                  minWidth: "30px",
                  textAlign: "center",
                  cursor: "pointer",
                  border: "2px solid white",
                  boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
                }}
              >
                {property.price ? `$${(property.price / 1000).toFixed(0)}K` : ""}
              </div>
            </OverlayView>
          ) : null
        )}

        {selectedProperty && (
          <div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 w-[90%] max-w-md cursor-pointer"
            onClick={() => handleCardClick(selectedProperty.id)}
          >
            <h2 className="text-lg font-bold mb-2">{selectedProperty.title}</h2>
            {selectedProperty.images && selectedProperty.images.length > 0 && (
              <img
                src={selectedProperty.images[0]}
                alt="Property"
                className="w-full h-48 object-cover rounded-md mb-2"
              />
            )}
            <p className="text-gray-600 mb-1">{selectedProperty.address}</p>
            <p className="text-gray-800 font-semibold">
              {selectedProperty.price ? `$${selectedProperty.price.toLocaleString()}` : "Price on request"}
            </p>
          </div>
        )}
      </GoogleMap>
    </div>
  );
}