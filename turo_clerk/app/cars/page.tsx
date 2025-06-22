"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavigationHeader } from '@/components/ui/navigation-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Star,
  MapPin,
  Users,
  Fuel,
  Zap,
  Settings,
  Search,
  Filter,
  Heart,
  Navigation,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Mock data - in real app this would come from Supabase
const mockCars = [
  {
    id: '1',
    title: '2023 Tesla Model 3',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    price: 89,
    rating: 4.9,
    reviewCount: 127,
    location: 'Downtown, San Francisco',
    distance: '0.8 miles away',
    images: ['https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg'],
    features: ['Electric', 'Autopilot', 'Premium Interior'],
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Electric',
    isInstantBook: true,
    hostName: 'Sarah M.',
    hostRating: 4.8,
  },
  {
    id: '2',
    title: '2022 BMW X3',
    make: 'BMW',
    model: 'X3',
    year: 2022,
    price: 75,
    rating: 4.7,
    reviewCount: 89,
    location: 'Mission District, San Francisco',
    distance: '1.2 miles away',
    images: ['https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg'],
    features: ['All-Wheel Drive', 'Premium Audio', 'Navigation'],
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    isInstantBook: false,
    hostName: 'Michael R.',
    hostRating: 4.9,
  },
  {
    id: '3',
    title: '2023 Porsche 911',
    make: 'Porsche',
    model: '911',
    year: 2023,
    price: 299,
    rating: 5.0,
    reviewCount: 45,
    location: 'Nob Hill, San Francisco',
    distance: '2.1 miles away',
    images: ['https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg'],
    features: ['Sport Package', 'Premium Interior', 'Track Mode'],
    seats: 2,
    transmission: 'Manual',
    fuelType: 'Gasoline',
    isInstantBook: true,
    hostName: 'David L.',
    hostRating: 5.0,
  },
  {
    id: '4',
    title: '2021 Toyota Prius',
    make: 'Toyota',
    model: 'Prius',
    year: 2021,
    price: 45,
    rating: 4.6,
    reviewCount: 203,
    location: 'Castro District, San Francisco',
    distance: '1.8 miles away',
    images: ['https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg'],
    features: ['Hybrid', 'Fuel Efficient', 'Backup Camera'],
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    isInstantBook: true,
    hostName: 'Jennifer K.',
    hostRating: 4.7,
  },
];

export default function CarsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price-low');
  const [priceRange, setPriceRange] = useState('all');
  const [carType, setCarType] = useState('all');
  const [filteredCars, setFilteredCars] = useState(mockCars);

  useEffect(() => {
    let filtered = mockCars.filter(car =>
      car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter by price range
    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under-50':
          filtered = filtered.filter(car => car.price < 50);
          break;
        case '50-100':
          filtered = filtered.filter(car => car.price >= 50 && car.price <= 100);
          break;
        case 'over-100':
          filtered = filtered.filter(car => car.price > 100);
          break;
      }
    }

    // Filter by car type
    if (carType !== 'all') {
      filtered = filtered.filter(car =>
        car.features.some(feature =>
          feature.toLowerCase().includes(carType.toLowerCase())
        )
      );
    }

    // Sort results
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
    }

    setFilteredCars(filtered);
  }, [searchQuery, sortBy, priceRange, carType]);

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <div className="pt-20">
        {/* Header */}
        <section className="bg-muted/30 border-b border-border/50 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-8"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Find Your Perfect Car
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose from thousands of unique vehicles from trusted local hosts
              </p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              className="bg-card rounded-2xl p-6 shadow-lg border border-border/50"
              variants={fadeInUp}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by car or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="distance">Closest</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-50">Under $50/day</SelectItem>
                    <SelectItem value="50-100">$50-100/day</SelectItem>
                    <SelectItem value="over-100">Over $100/day</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={carType} onValueChange={setCarType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Car Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="sport">Sport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="flex items-center justify-between mb-8"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <h2 className="text-2xl font-bold text-foreground">
                {filteredCars.length} cars available
              </h2>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              {filteredCars.map((car) => (
                <motion.div key={car.id} variants={fadeInUp}>
                  <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50 overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={car.images[0]}
                        alt={car.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        {car.isInstantBook && (
                          <Badge className="bg-success text-success-foreground">
                            Instant Book
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-3 right-3 bg-background/80 hover:bg-background"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {car.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{car.rating}</span>
                          <span className="text-muted-foreground">
                            ({car.reviewCount})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4" />
                        <span>{car.location}</span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{car.seats}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Settings className="h-4 w-4" />
                          <span>{car.transmission}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {car.fuelType === 'Electric' ? (
                            <Zap className="h-4 w-4" />
                          ) : (
                            <Fuel className="h-4 w-4" />
                          )}
                          <span>{car.fuelType}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {car.features.slice(0, 2).map((feature, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                        {car.features.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{car.features.length - 2} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Navigation className="h-4 w-4" />
                        <span>{car.distance}</span>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="text-2xl font-bold text-foreground">
                            ${car.price}
                            <span className="text-sm font-normal text-muted-foreground">
                              /day
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Host: {car.hostName} ⭐ {car.hostRating}
                          </div>
                        </div>
                        <Link href={`/cars/${car.id}`}>
                          <Button size="sm" className="shrink-0">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {filteredCars.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial="initial"
                animate="animate"
                variants={fadeInUp}
              >
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No cars found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or browse all cars.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setPriceRange('all');
                    setCarType('all');
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}