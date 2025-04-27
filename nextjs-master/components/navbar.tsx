"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { User, Menu, Home, MapPin, Heart, Sparkles, Map } from "lucide-react"; // 👈 Agregado icono Map
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data?.session);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

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
      isScrolled ? "bg-white/90 shadow-md dark:bg-background/80" : "bg-transparent"
    )}>
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">

        {/* Left: Logo + Mobile Menu */}
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
                  <Link href="/search" className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-md">
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
                  <Link href="/map" className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-md">
                    <Map className="h-5 w-5" />
                    <span>Map</span>
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo animado */}
          <Link href="/" className="flex items-center gap-2 group">
            <Home className="h-6 w-6 text-primary animate-pulse-slow" />
            <span className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
              MiCasApp
            </span>
          </Link>
        </div>

        {/* Right: AI Power + Map + Heart + User */}
        <div className="flex items-center gap-2">
          {/* AI Power button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/aipower")}
          >
            <Sparkles className="h-5 w-5" />
          </Button>

          {/* Map button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/map")}
          >
            <Map className="h-5 w-5" />
          </Button>

          {isLoggedIn ? (
            <>
              {/* Heart to favorites */}
              <Button asChild variant="ghost" size="icon">
                <Link href="/favorites">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="ghost" size="icon">
              <Link href="/login">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}