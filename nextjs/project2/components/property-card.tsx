"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon, Bed, Bath, Square, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/lib/supabase"; // ⭐

export interface PropertyProps {
  id: string;
  title: string;
  address: string;
  price: number;
  type: "sale" | "rent";
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  imageUrl: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export default function PropertyCard({
  id,
  title,
  address,
  price,
  type,
  bedrooms,
  bathrooms,
  squareFeet,
  imageUrl,
  isNew,
  isFeatured,
}: PropertyProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = async () => {
    try {
      const newState = await toggleFavorite(id);
      setIsFavorite(newState);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative">
        <AspectRatio ratio={4 / 3}>
          <Image
            src={imageUrl || "/fallback-image.jpg"} // fallback en caso de que no haya imagen
            alt={title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </AspectRatio>

        <div className="absolute left-2 right-2 top-2 flex justify-between">
          {isNew && (
            <Badge className="bg-accent text-accent-foreground">New</Badge>
          )}

          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={handleFavorite}
          >
            <HeartIcon
              className={cn(
                "h-4 w-4",
                isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )}
            />
            <span className="sr-only">Add to favorites</span>
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="font-semibold line-clamp-1">{title}</h3>
          {isFeatured && (
            <p className="flex items-center text-yellow-500 text-sm">
              <Star className="mr-1 h-3 w-3 fill-yellow-500" />
              Featured
            </p>
          )}
        </div>

        <p className="mb-2 text-sm text-muted-foreground line-clamp-1">{address}</p>

        <p className="mb-4 text-xl font-bold">
          ${price ? price.toLocaleString() : "N/A"}
          {type === "rent" && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{bedrooms != null ? `${bedrooms} ${bedrooms === 1 ? "bed" : "beds"}` : "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{bathrooms != null ? `${bathrooms} ${bathrooms === 1 ? "bath" : "baths"}` : "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{squareFeet ? `${squareFeet.toLocaleString()} sq ft` : "N/A"}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/property/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}