"use client";

import { useEffect, useState } from "react";
import { supabase, toggleFavorite } from "@/lib/supabase"; // ✅
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toast } from "sonner"; // 👈 IMPORTANTE

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select(`
          id,
          property:property_id ( id, title, price, address, images )
        `)
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Error fetching favorites:", error);
      } else {
        setFavorites(data || []);
      }

      setLoading(false);
    };

    fetchFavorites();
  }, [router]);

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      await toggleFavorite(propertyId);
      setFavorites((prev) => prev.filter((fav) => fav.property?.id !== propertyId));
      
      toast.success("Removed from favorites"); // ✅ muestra toast
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove favorite"); // ✅ error
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div>Loading favorites...</div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-4">
        <h1 className="text-2xl font-bold mb-4">No favorite properties yet</h1>
        <p className="text-muted-foreground mb-6">Start exploring and add some homes to your favorites list!</p>
        <Button asChild>
          <Link href="/buy">Browse Properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Your Favorite Properties</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((fav) => {
          const property = fav.property;
          if (!property) return null;

          return (
            <Card key={property.id}>
              <CardContent className="p-4 relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  onClick={() => handleRemoveFavorite(property.id)}
                  title="Remove from favorites"
                >
                  <Trash2 className="h-5 w-5" />
                </button>

                <Link href={`/property/${property.id}`}>
                  <img
                    src={Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : "/fallback.jpg"}
                    alt={property.title}
                    className="rounded-md mb-4 w-full h-48 object-cover"
                  />
                  <h2 className="text-lg font-semibold mb-2">{property.title}</h2>
                  <p className="text-muted-foreground mb-1">{property.address}</p>
                  <p className="font-bold">${property.price.toLocaleString()}</p>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}