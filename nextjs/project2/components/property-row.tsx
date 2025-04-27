import PropertyCard from "@/components/property-card";
import { newProperties, rentalProperties } from "@/lib/data";

interface PropertyRowProps {
  title: string;
  category: "buy" | "rent";
}

export default function PropertyRow({ title, category }: PropertyRowProps) {
  const properties = category === "buy" ? newProperties : rentalProperties;
  
  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            address={property.address}
            price={property.price}
            type={property.type}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            squareFeet={property.squareFeet}
            imageUrl={property.imageUrl}
            isNew={category === "buy"}
          />
        ))}
      </div>
    </div>
  );
}