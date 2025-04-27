"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, User, Menu, Home, MapPin } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full backdrop-blur transition-all duration-300",
      isScrolled
        ? "bg-white/90 shadow-md dark:bg-background/80"
        : "bg-transparent"
    )}>
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left side: Logo + Menu (mobile) */}
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                <SheetClose asChild>
                  <Link href="/" className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-md">
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/buy" className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-md">
                    <MapPin className="h-5 w-5" />
                    <span>For Sale</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/rent" className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-md">
                    <MapPin className="h-5 w-5" />
                    <span>For Rent</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                 {false && <Link href="/sell" className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-md">
                    <Home className="h-5 w-5" />
                    <span>Sell</span>
                  </Link>}
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">MiCasApp</span>
          </Link>
        </div>

        {/* Center: Navigation (desktop) */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>For Sale</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[400px] grid-cols-2">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/buy/homes" className="flex flex-col gap-1 p-3 hover:bg-muted rounded-md">
                        <div className="font-medium">Homes for Sale</div>
                        <div className="text-sm text-muted-foreground">Find your perfect home to buy</div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/buy/new-construction" className="flex flex-col gap-1 p-3 hover:bg-muted rounded-md">
                        <div className="font-medium">New Construction</div>
                        <div className="text-sm text-muted-foreground">Brand new homes and developments</div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>For Rent</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[400px] grid-cols-2">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/rent/apartments" className="flex flex-col gap-1 p-3 hover:bg-muted rounded-md">
                        <div className="font-medium">Apartments</div>
                        <div className="text-sm text-muted-foreground">Find apartments for rent</div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/rent/houses" className="flex flex-col gap-1 p-3 hover:bg-muted rounded-md">
                        <div className="font-medium">Houses</div>
                        <div className="text-sm text-muted-foreground">Find houses for rent</div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* You can activate "Sell" later */}
            {false && (
              <NavigationMenuItem>
                <Link href="/sell" legacyBehavior passHref>
                  <NavigationMenuLink className="px-4 py-2">
                    Sell
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right: User Icon */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">User account</span>
          </Button>
        </div>
      </div>
    </header>
  );
}