"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SearchTabs() {
  const [searchLocation, setSearchLocation] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("buy"); // Track which tab is active
  const router = useRouter();

  const handleSelectLocation = () => {
    setSearchLocation("Tulum");
    setShowDropdown(false);
  };

  const handleSearch = () => {
    if (searchLocation === "Tulum") {
      if (activeTab === "buy") {
        router.push("/search"); // If on For Sale tab
      } else if (activeTab === "rent") {
        router.push("/searchRent"); // If on For Rent tab
      }
    }
  };

  const renderInputWithDropdown = (placeholder: string) => (
    <div className="relative flex-1">
      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchLocation}
        readOnly
        className="pl-10 cursor-pointer"
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
      />
      {showDropdown && (
        <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow z-50">
          <ul>
            <li
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSelectLocation}
            >
              Tulum
            </li>
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="rounded-lg bg-white p-2 shadow-lg dark:bg-card">
      <Tabs
        defaultValue="buy"
        className="w-full"
        onValueChange={(value) => setActiveTab(value)} // Capture tab changes!
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy">For Sale</TabsTrigger>
          <TabsTrigger value="rent">For Rent</TabsTrigger>
        </TabsList>

        {/* For Sale */}
        <TabsContent value="buy" className="mt-2 space-y-4 p-2">
          <div className="flex items-center gap-2">
            {renderInputWithDropdown("City, neighborhood, or ZIP")}
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </TabsContent>

        {/* For Rent */}
        <TabsContent value="rent" className="mt-2 space-y-4 p-2">
          <div className="flex items-center gap-2">
            {renderInputWithDropdown("City, neighborhood, or ZIP")}
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}