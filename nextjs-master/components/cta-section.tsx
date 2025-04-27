import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Ready to Find Your Dream Home?
            </h2>
            <p className="mb-6 max-w-md">
              Join thousands of satisfied homeowners who found their perfect match with MiCasApp.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="secondary">
                <Link href="/buy">Browse Properties</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Contact an Agent</Link>
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg bg-primary-foreground/10 p-6">
            <h3 className="mb-4 text-xl font-semibold">Why Choose MiCasApp?</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-xl">✓</span>
                <span>Thousands of verified listings updated daily</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xl">✓</span>
                <span>Personalized search based on your preferences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xl">✓</span>
                <span>Trusted network of professional real estate agents</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xl">✓</span>
                <span>Detailed neighborhood insights and data</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}