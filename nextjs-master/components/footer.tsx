import Link from "next/link";
import { Home } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">MiCasApp</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Discover your dream home with MiCasApp, your trusted real estate marketplace.
            </p>
          </div>
          <div>
            <h3 className="font-medium">For Sale</h3>
            {/*<ul className="mt-2 space-y-2">
              <li>
                <Link href="/buy/homes" className="text-sm text-muted-foreground hover:text-foreground">
                  Homes for Sale
                </Link>
              </li>
              <li>
                <Link href="/buy/new-construction" className="text-sm text-muted-foreground hover:text-foreground">
                  New Construction
                </Link>
              </li>
              <li>
                <Link href="/buy/foreclosures" className="text-sm text-muted-foreground hover:text-foreground">
                  Foreclosures
                </Link>
              </li>
            </ul>*/}
          </div>
          <div>
            <h3 className="font-medium">For Rent</h3>
            {/*<ul className="mt-2 space-y-2">
              <li>
                <Link href="/rent/apartments" className="text-sm text-muted-foreground hover:text-foreground">
                  Apartments
                </Link>
              </li>
              <li>
                <Link href="/rent/houses" className="text-sm text-muted-foreground hover:text-foreground">
                  Houses
                </Link>
              </li>
              <li>
                <Link href="/rent/condos" className="text-sm text-muted-foreground hover:text-foreground">
                  Condos
                </Link>
              </li>
            </ul>*/}
          </div>
          <div>
            <h3 className="font-medium">MiCasApp</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Jean Paul Raimond. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}