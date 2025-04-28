"use client";

import { useState, useEffect } from "react";
import PropertyCard from "@/components/property-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, Home, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getProperties } from "@/lib/supabase";
import { parseImages } from "@/lib/parse-images"; // 👈 IMPORTANTE

export default function SearchRentPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000000]);
 {/* const [propertyType, setPropertyType] = useState<"all" | "sale" | "rent">("all");*/}
  const [propertyType, setPropertyType] = useState<string>("rent");
  const [bedrooms, setBedrooms] = useState<string>("any");
  const [bathrooms, setBathrooms] = useState<string>("any");

  // 👇 Estado para sugerencias (autocomplete)
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions] = useState(["Tulum"]); // Puedes agregar más aquí: ["Tulum", "Playa del Carmen", "Cancún"]

  useEffect(() => {
    const fetchProperties = async () => {
      const fetchedProperties = await getProperties();

      // 🔥 Parseamos imágenes
      const parsed = fetchedProperties.map((p: any) => ({
        ...p,
        images: parseImages(p.images),
      }));

      setProperties(parsed);
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice =
      property.price >= priceRange[0] && property.price <= priceRange[1];

    const matchesPropertyType =
      propertyType === "all" || property.type === propertyType;

    const matchesBedrooms =
      bedrooms === "any" ||
      (bedrooms === "4+" && property.bedrooms >= 4) ||
      property.bedrooms.toString() === bedrooms;

    const matchesBathrooms =
      bathrooms === "any" ||
      (bathrooms === "4+" && property.bathrooms >= 4) ||
      property.bathrooms.toString() === bathrooms;

    return (
      matchesSearch &&
      matchesPrice &&
      matchesPropertyType &&
      matchesBedrooms &&
      matchesBathrooms
    );
  });

  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 5000000]);
    setPropertyType("sale");
    setBedrooms("any");
    setBathrooms("any");
  };

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
        Popular Homes for Rent
      </h1>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end">
        {/* Search Bar con Sugerencias */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search by location, property name..."
            value={searchTerm}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />

          {showSuggestions && (
            <div className="absolute left-0 right-0 top-full mt-1 rounded-md border bg-white shadow-lg z-10">
              {suggestions
                .filter((item) =>
                  item.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item, index) => (
                  <div
                    key={index}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setSearchTerm(item);
                      setShowSuggestions(false);
                    }}
                  >
                    {item}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Filtros Botón */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filter Properties</SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Price Filter */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-medium">Price Range</h3>
                  <span className="text-sm">
                    ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  min={0}
                  max={5000000}
                  step={50000}
                  onValueChange={setPriceRange}
                  className="my-6"
                />
              </div>

              {/* Property Type Filter */}
              <div>
                <h3 className="mb-3 font-medium">Property Type</h3>
                <div className="flex flex-wrap gap-2">
                  {["all", "sale", "rent"].map((type) => (
                    <Button
                      key={type}
                      variant={propertyType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPropertyType(type as "all" | "sale" | "rent")}
                    >
                      {type === "all" ? "All" : type === "sale" ? "For Sale" : "For Rent"}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Bedrooms Filter */}
              <div>
                <h3 className="mb-3 font-medium">Bedrooms</h3>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4+">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bathrooms Filter */}
              <div>
                <h3 className="mb-3 font-medium">Bathrooms</h3>
                <Select value={bathrooms} onValueChange={setBathrooms}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4+">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Filters Button */}
              <Button variant="outline" className="w-full" onClick={resetFilters}>
                <X className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Botón de búsqueda */}
        <Button>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {/* Resultados */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {filteredProperties.length} Properties Found
          </h2>
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                address={property.address}
                price={property.price}
                type={property.type}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                sqft={property.sqft}
                imageUrl={property.images[0] || ""}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <Home className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-medium">No properties found</h3>
            <p className="mb-6 text-center text-muted-foreground">
              Try adjusting your search criteria or explore our featured listings.
            </p>
            <Button onClick={resetFilters}>Reset Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}