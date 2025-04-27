import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import PropertyRow from "@/components/property-row";

export default function BuyPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>
        
        <div className="container relative z-10 flex h-full flex-col items-center justify-center px-4 text-center md:px-6">
          <h1 className="mb-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Find Your Dream Home
          </h1>
          <p className="mb-8 max-w-xl text-lg text-white/90">
            Discover thousands of properties for sale across the country.
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
      
      {/* Featured Properties */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight">Popular Homes for Sale</h2>
              <p className="max-w-2xl text-muted-foreground">
                Explore our most viewed properties for sale this week.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/search">View all</Link>
            </Button>
          </div>
          
          <PropertyRow title="Popular Properties for Sale" category="buy" />
        </div>
      </section>
      
      {/* New Construction */}
      <section className="bg-muted/30 py-16">
        <div className="container px-4 md:px-6">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight">New Construction</h2>
              <p className="max-w-2xl text-muted-foreground">
                Brand new homes and developments with modern amenities.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/buy/new-construction">View all</Link>
            </Button>
          </div>
          
          <PropertyRow title="New Construction Properties" category="buy" />
        </div>
      </section>
      
      {/* Buying Guide */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold tracking-tight">Home Buying Guide</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Everything you need to know about purchasing your new home.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 transition-all hover:shadow-md">
              <div className="mb-4 text-2xl font-bold">01</div>
              <h3 className="mb-2 text-xl font-semibold">Get Pre-Approved</h3>
              <p className="text-muted-foreground">
                Start by getting pre-approved for a mortgage to understand your budget and show sellers you're serious.
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 transition-all hover:shadow-md">
              <div className="mb-4 text-2xl font-bold">02</div>
              <h3 className="mb-2 text-xl font-semibold">Find Your Home</h3>
              <p className="text-muted-foreground">
                Work with a real estate agent to find properties that match your criteria and visit open houses.
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 transition-all hover:shadow-md">
              <div className="mb-4 text-2xl font-bold">03</div>
              <h3 className="mb-2 text-xl font-semibold">Close the Deal</h3>
              <p className="text-muted-foreground">
                Make an offer, negotiate terms, complete inspections, and finalize your mortgage to close on your new home.
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/resources/buying-guide">Read Full Guide</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}