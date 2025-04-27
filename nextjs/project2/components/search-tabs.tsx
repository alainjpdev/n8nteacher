"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SearchTabs() {
  const [searchLocation, setSearchLocation] = useState("");
  
  return (
    <div className="rounded-lg bg-white p-2 shadow-lg dark:bg-card">
      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="buy">For Sale</TabsTrigger>
          <TabsTrigger value="rent">For Rent</TabsTrigger>
         
        </TabsList>
        
        <TabsContent value="buy" className="mt-2 space-y-4 p-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="City, neighborhood, or ZIP"
                className="pl-10"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="rent" className="mt-2 space-y-4 p-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="City, neighborhood, or ZIP"
                className="pl-10"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="sell" className="mt-2 space-y-4 p-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter your address"
                className="pl-10"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <Button>
              Get Estimate
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}