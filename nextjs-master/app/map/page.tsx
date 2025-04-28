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
  const [clickedMarker, setClickedMarker] = useState(false);

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
    styles: [
      { featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }] },
      { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
      { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
      { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] },
    ],
  }}
  onClick={() => {
    if (!clickedMarker) {
      setSelectedProperty(null);
    }
    setClickedMarker(false);
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
    onMouseDown={(e) => {
      e.stopPropagation();
      setClickedMarker(true);
      if (selectedProperty?.id === property.id) {
        setSelectedProperty(null);
      } else {
        setSelectedProperty(property);
      }
    }}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      width: "60px", // 👈 más ancho del área de click
      height: "60px", // 👈 más alto del área de click
      background: "transparent", // invisible
      cursor: "pointer",
    }}
  >
    <div
      style={{
        background: "#14532d", // verde oscuro
        padding: property.price ? "8px 16px" : "10px 16px",
        color: "white",
        borderRadius: "30px",
        fontSize: property.price ? "14px" : "10px",
        textAlign: "center",
        userSelect: "none",
        boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
        position: "relative",
        zIndex: 1, // para estar arriba del div de padding
      }}
    >
      {property.price ? `$${(property.price / 1000).toFixed(0)}K` : ""}
      {/* Pico */}
      <div
        style={{
          position: "absolute",
          bottom: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "0",
          height: "0",
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid #14532d",
        }}
      />
    </div>
  </div>
</OverlayView>
          ) : null
        )}

{selectedProperty && (
  <div
    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg overflow-hidden w-[90%] max-w-md cursor-pointer"
    onClick={() => handleCardClick(selectedProperty.id)}
  >
    {selectedProperty.images && selectedProperty.images.length > 0 && (
      <div className="relative w-full h-48">
        <img
          src={selectedProperty.images[0]}
          alt="Property"
          className="w-full h-full object-cover"
        />
      </div>
    )}
    <div className="p-4">
      <h2 className="text-lg font-bold mb-1">{selectedProperty.title}</h2>
      <p className="text-gray-600 mb-1">{selectedProperty.address}</p>
      <p className="text-gray-800 font-semibold">
        {selectedProperty.price
          ? `$${selectedProperty.price.toLocaleString()}`
          : "Price on request"}
      </p>
    </div>
  </div>
)}
      </GoogleMap>
    </div>
  );
}