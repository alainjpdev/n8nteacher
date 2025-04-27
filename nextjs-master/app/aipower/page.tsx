"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Rocket, Bot, Globe, Target, Smartphone } from "lucide-react";

export default function AIPowerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Revolutionize Your Real Estate Marketing with AI
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
          Next-gen solutions for agents, teams, and brokers. Generate, nurture, and convert leads smarter and faster than ever before.
        </p>
        <Button size="lg" className="text-lg">
          <Sparkles className="mr-2 h-5 w-5" />
          Get Started with AI Power
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <Rocket className="mx-auto h-12 w-12 text-primary" />
              <h2 className="text-2xl font-semibold">AI Lead Generation</h2>
              <p className="text-muted-foreground">
                Attract high-intent buyers and sellers through dynamic ads across Google, Facebook, Instagram, and more.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <Bot className="mx-auto h-12 w-12 text-primary" />
              <h2 className="text-2xl font-semibold">Automated Nurturing</h2>
              <p className="text-muted-foreground">
                Engage leads with personalized texts, emails, and retargeting powered by intelligent AI workflows.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <Globe className="mx-auto h-12 w-12 text-primary" />
              <h2 className="text-2xl font-semibold">IDX Websites</h2>
              <p className="text-muted-foreground">
                Branded home search sites with real-time MLS listings to convert browsing visitors into loyal clients.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* More Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
              <Target className="h-12 w-12 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Precision Targeting</h3>
                <p className="text-muted-foreground">
                  Hyper-target your ads and listings to the right audience with behavior-driven AI targeting models.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
              <Smartphone className="h-12 w-12 text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Mobile-Optimized Everything</h3>
                <p className="text-muted-foreground">
                  Full mobile responsiveness for all sites, ads, and communication — connect with your clients anywhere, anytime.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
        <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-8">
          Let AI do the heavy lifting. Focus on closing deals, not chasing leads.
        </p>
        <Button size="lg" className="text-lg">
          <Rocket className="mr-2 h-5 w-5" />
          Launch AI Campaign
        </Button>
      </section>
    </div>
  );
}