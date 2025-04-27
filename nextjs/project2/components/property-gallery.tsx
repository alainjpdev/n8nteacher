"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyGalleryProps {
  imageUrl: string;
  propertyTitle: string;
}

// Mock additional images for the gallery
const getMockImages = (mainImage: string) => {
  return [
    mainImage,
    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  ];
};

export default function PropertyGallery({ imageUrl, propertyTitle }: PropertyGalleryProps) {
  const images = getMockImages(imageUrl);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  return (
    <div className="space-y-4">
      <div className="relative h-[300px] overflow-hidden rounded-lg sm:h-[400px] md:h-[500px]">
        <Image
          src={images[activeIndex]}
          alt={`${propertyTitle} - Image ${activeIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
        />
        
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full opacity-80 backdrop-blur-sm"
          onClick={prevImage}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous image</span>
        </Button>
        
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full opacity-80 backdrop-blur-sm"
          onClick={nextImage}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next image</span>
        </Button>
        
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-background/50 px-3 py-1.5 backdrop-blur-sm">
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === activeIndex ? "bg-primary" : "bg-primary/30"
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <span className="sr-only">View image {index + 1}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {images.map((img, index) => (
          <button
            key={index}
            className={`relative h-20 overflow-hidden rounded-md ${
              index === activeIndex
                ? "ring-2 ring-primary ring-offset-2"
                : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => setActiveIndex(index)}
          >
            <Image
              src={img}
              alt={`${propertyTitle} - Thumbnail ${index + 1}`}
              fill
              className="object-cover transition-all"
              sizes="(max-width: 768px) 20vw, 100px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}