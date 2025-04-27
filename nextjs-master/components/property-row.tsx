"use client";

import PropertyCard from "@/components/property-card";

interface PropertyRowProps {
  title: string;
  properties: any[]; // (o tu tipo real si quieres ponerlo luego bien tipado)
}

export default function PropertyRow({ title, properties }: PropertyRowProps) {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>

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
            squareFeet={property.square_feet}
            imageUrl={Array.isArray(property.images) ? property.images[0] : ""}
            isNew={false} // Puedes cambiar esto si quieres pasar otra prop
          />
        ))}
      </div>
    </div>
  );
}
