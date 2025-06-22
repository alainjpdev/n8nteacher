"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { NavigationHeader } from '@/components/ui/navigation-header';
import {
  Car,
  Shield,
  Clock,
  Star,
  MapPin,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Search,
  Calendar,
  Key,
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: 'Verified Hosts',
      description: 'Every host is thoroughly verified with background checks and insurance coverage.',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for any questions or emergencies.',
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Curated selection of well-maintained vehicles from trusted local hosts.',
    },
    {
      icon: MapPin,
      title: 'Convenient Locations',
      description: 'Cars available in prime locations across your city for easy pickup.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Happy Customers' },
    { value: '5K+', label: 'Verified Cars' },
    { value: '50+', label: 'Cities' },
    { value: '4.9', label: 'Average Rating' },
  ];

  const steps = [
    {
      icon: Search,
      title: 'Find Your Car',
      description: 'Browse thousands of cars from local hosts in your area.',
    },
    {
      icon: Calendar,
      title: 'Book Instantly',
      description: 'Select your dates and book instantly with flexible cancellation.',
    },
    {
      icon: Key,
      title: 'Unlock & Drive',
      description: 'Unlock your car with the app and start your adventure.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1
              className="text-4xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 text-balance"
              variants={fadeInUp}
            >
              The Future of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Car Sharing
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl lg:text-2xl text-muted-foreground mb-8 text-balance"
              variants={fadeInUp}
            >
              Rent cars from trusted local hosts. Skip the rental counter and 
              unlock thousands of unique vehicles in your neighborhood.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              variants={fadeInUp}
            >
              <Link href="/cars">
                <Button size="lg" className="text-lg px-8 py-6 group">
                  Start Exploring
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/become-host">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Become a Host
                </Button>
              </Link>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 max-w-2xl mx-auto shadow-lg"
              variants={scaleIn}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Location
                  </label>
                  <Input
                    placeholder="Where to?"
                    className="border-0 bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    className="border-0 bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    End Date
                  </label>
                  <Input
                    type="date"
                    className="border-0 bg-background/50"
                  />
                </div>
              </div>
              <Button className="w-full mt-4" size="lg">
                <Search className="mr-2 h-5 w-5" />
                Search Cars
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={fadeInUp}
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose CarFlow?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the perfect blend of convenience, trust, and quality
              in every rental.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                variants={scaleIn}
                whileHover={{ y: -5 }}
              >
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get on the road in three simple steps
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="text-center group"
                variants={fadeInUp}
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-gradient-to-r from-primary to-accent rounded-3xl p-8 lg:p-12 text-center text-white relative overflow-hidden"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of travelers who choose CarFlow for their 
                transportation needs. Sign up today and get $25 off your first rental.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/cars">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8 py-6"
                  >
                    Browse Cars
                  </Button>
                </Link>
                <Link href="/become-host">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 border-white/20 text-white hover:bg-white/10"
                  >
                    Start Hosting
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xl font-bold text-foreground">CarFlow</span>
              </div>
              <p className="text-muted-foreground">
                The future of car sharing. Rent cars from trusted local hosts
                across the globe.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="/press" className="hover:text-foreground transition-colors">Press</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-foreground transition-colors">Safety</Link></li>
                <li><Link href="/insurance" className="hover:text-foreground transition-colors">Insurance</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
                <li><Link href="/dmca" className="hover:text-foreground transition-colors">DMCA</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 CarFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}