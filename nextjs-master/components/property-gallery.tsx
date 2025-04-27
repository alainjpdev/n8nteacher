"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PropertyGalleryProps {
  imageUrl: string;
  propertyTitle: string;
}

export default function PropertyGallery({ imageUrl, propertyTitle }: PropertyGalleryProps) {
  const images = [imageUrl]; // o tu lógica de galería
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-[300px]">
      <Image
        src={images[activeIndex]}
        alt={propertyTitle}
        fill
        className="object-cover"
      />
      {/* botones next/prev */}
      <Button onClick={prevImage}>←</Button>
      <Button onClick={nextImage}>→</Button>
    </div>
  );
}
