"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from '@/components/ui/mode-toggle';
import {
  Car,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Plus,
  Calendar,
  Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function NavigationHeader() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Browse Cars', href: '/cars' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Become a Host', href: '/become-host' },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border/50'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">CarFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            
            {!isLoaded ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.imageUrl}
                        alt={user.fullName || ''}
                      />
                      <AvatarFallback>
                        {user.firstName?.charAt(0)}
                        {user.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.fullName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/reservations" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      My Reservations
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/host/dashboard" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Host Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <SignOutButton>
                      <span className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </span>
                    </SignOutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <Button variant="ghost">Sign In</Button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button>Sign Up</Button>
                </SignInButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md"
            >
              <div className="px-4 py-6 space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <ModeToggle />
                    
                    {!isLoaded ? (
                      <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                    ) : isSignedIn ? (
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.imageUrl}
                            alt={user.fullName || ''}
                          />
                          <AvatarFallback>
                            {user.firstName?.charAt(0)}
                            {user.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {user.fullName}
                        </span>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <SignInButton mode="modal">
                          <Button variant="ghost" size="sm">
                            Sign In
                          </Button>
                        </SignInButton>
                        <SignInButton mode="modal">
                          <Button size="sm">Sign Up</Button>
                        </SignInButton>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}