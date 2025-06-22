"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavigationHeader } from '@/components/ui/navigation-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  Car,
  Calendar,
  Star,
  Plus,
  TrendingUp,
  Users,
  MapPin,
  Settings,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

// Mock data
const hostStats = {
  totalEarnings: 12580,
  activeListings: 4,
  totalBookings: 127,
  averageRating: 4.8,
  monthlyEarnings: [
    { month: 'Jan', earnings: 2100 },
    { month: 'Feb', earnings: 1800 },
    { month: 'Mar', earnings: 2400 },
    { month: 'Apr', earnings: 2200 },
    { month: 'May', earnings: 2600 },
    { month: 'Jun', earnings: 1450 },
  ],
};

const recentBookings = [
  {
    id: '1',
    carTitle: '2023 Tesla Model 3',
    guestName: 'John D.',
    dates: 'Dec 15-18, 2024',
    status: 'confirmed',
    earnings: '$267',
  },
  {
    id: '2',
    carTitle: '2022 BMW X3',
    guestName: 'Sarah M.',
    dates: 'Dec 20-23, 2024',
    status: 'pending',
    earnings: '$225',
  },
  {
    id: '3',
    carTitle: '2023 Tesla Model 3',
    guestName: 'Mike R.',
    dates: 'Dec 10-12, 2024',
    status: 'completed',
    earnings: '$178',
  },
];

const hostCars = [
  {
    id: '1',
    title: '2023 Tesla Model 3',
    image: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg',
    price: 89,
    status: 'active',
    bookings: 23,
    rating: 4.9,
    earnings: 5670,
  },
  {
    id: '2',
    title: '2022 BMW X3',
    image: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg',
    price: 75,
    status: 'active',
    bookings: 18,
    rating: 4.7,
    earnings: 4200,
  },
  {
    id: '3',
    title: '2021 Toyota Prius',
    image: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg',
    price: 45,
    status: 'paused',
    bookings: 12,
    rating: 4.6,
    earnings: 1890,
  },
];

export default function HostDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      case 'active':
        return 'bg-success text-success-foreground';
      case 'paused':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <div className="pt-20">
        {/* Header */}
        <section className="bg-muted/30 border-b border-border/50 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Host Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage your listings and track your earnings
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/host/cars/add">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Car
                  </Button>
                </Link>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="cars">My Cars</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                {/* Stats Cards */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  initial="initial"
                  animate="animate"
                  variants={staggerContainer}
                >
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Earnings
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          ${hostStats.totalEarnings.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-success">+12%</span> from last month
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Active Listings
                        </CardTitle>
                        <Car className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {hostStats.activeListings}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          All cars available for booking
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Bookings
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {hostStats.totalBookings}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-success">+8</span> this month
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Average Rating
                        </CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {hostStats.averageRating}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Based on 127 reviews
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>

                {/* Recent Bookings */}
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={fadeInUp}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Car</TableHead>
                            <TableHead>Guest</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Earnings</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentBookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">
                                {booking.carTitle}
                              </TableCell>
                              <TableCell>{booking.guestName}</TableCell>
                              <TableCell>{booking.dates}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {booking.earnings}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="cars" className="space-y-6">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial="initial"
                  animate="animate"
                  variants={staggerContainer}
                >
                  {hostCars.map((car) => (
                    <motion.div key={car.id} variants={fadeInUp}>
                      <Card className="overflow-hidden">
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={car.image}
                            alt={car.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className={getStatusColor(car.status)}>
                              {car.status}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2">
                            {car.title}
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                            <div>
                              <span className="font-medium">Price:</span> ${car.price}/day
                            </div>
                            <div>
                              <span className="font-medium">Bookings:</span> {car.bookings}
                            </div>
                            <div>
                              <span className="font-medium">Rating:</span> ⭐ {car.rating}
                            </div>
                            <div>
                              <span className="font-medium">Earned:</span> ${car.earnings}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="bookings">
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={fadeInUp}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>All Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Car</TableHead>
                            <TableHead>Guest</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentBookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">
                                {booking.carTitle}
                              </TableCell>
                              <TableCell>{booking.guestName}</TableCell>
                              <TableCell>{booking.dates}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                {booking.earnings}
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline">
                                  View Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="analytics">
                <motion.div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  initial="initial"
                  animate="animate"
                  variants={staggerContainer}
                >
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Monthly Earnings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 flex items-center justify-center text-muted-foreground">
                          Earnings chart would go here
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Booking Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 flex items-center justify-center text-muted-foreground">
                          Booking trends chart would go here
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </div>
  );
}