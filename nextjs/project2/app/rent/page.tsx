import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import PropertyRow from "@/components/property-row";

export default function RentPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>
        
        <div className="container relative z-10 flex h-full flex-col items-center justify-center px-4 text-center md:px-6">
          <h1 className="mb-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Find Your Perfect Rental
          </h1>
          <p className="mb-8 max-w-xl text-lg text-white/90">
            Discover thousands of properties for rent across the country!!
          </p>
          
          <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="City, neighborhood, or ZIP"
                className="bg-white pl-10"
              />
            </div>
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Rentals */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight">Popular Rentals</h2>
              <p className="max-w-2xl text-muted-foreground">
                Explore our most viewed rental properties this week.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/search">View all</Link>
            </Button>
          </div>
          
          <PropertyRow title="Popular Rental Properties" category="rent" />
        </div>
      </section>
      
      {/* Luxury Rentals */}
      <section className="bg-muted/30 py-16">
        <div className="container px-4 md:px-6">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight">Luxury Rentals</h2>
              <p className="max-w-2xl text-muted-foreground">
                Premium properties with exclusive amenities and features.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/rent/luxury">View all</Link>
            </Button>
          </div>
          
          <PropertyRow title="Luxury Rental Properties" category="rent" />
        </div>
      </section>
      
      {/* Renting Guide */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold tracking-tight">Renting Guide</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Everything you need to know about renting your next home.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 transition-all hover:shadow-md">
              <div className="mb-4 text-2xl font-bold">01</div>
              <h3 className="mb-2 text-xl font-semibold">Set Your Budget</h3>
              <p className="text-muted-foreground">
                Determine how much you can afford to spend on rent, including utilities and other monthly expenses.
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 transition-all hover:shadow-md">
              <div className="mb-4 text-2xl font-bold">02</div>
              <h3 className="mb-2 text-xl font-semibold">Research Neighborhoods</h3>
              <p className="text-muted-foreground">
                Explore different areas to find a location that suits your lifestyle, commute, and preferences.
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 transition-all hover:shadow-md">
              <div className="mb-4 text-2xl font-bold">03</div>
              <h3 className="mb-2 text-xl font-semibold">Apply and Sign</h3>
              <p className="text-muted-foreground">
                Submit rental applications, review lease terms carefully, and prepare for move-in day.
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/resources/renting-guide">Read Full Guide</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}