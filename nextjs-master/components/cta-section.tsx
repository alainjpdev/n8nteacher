import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function CTASection() {
  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="container px-4 md:px-6">
        {/* CONTENIDO NORMAL */}
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

        {/* SECCIÓN DE LOGOS EN MOVIMIENTO */}
        <div className="mt-16 bg-black rounded-lg py-8">
          <h3 className="mb-8 text-center text-2xl font-bold text-white">Our Trusted Partners</h3>
          <div className="overflow-hidden relative w-full">
            <div className="flex animate-marquee gap-16 whitespace-nowrap">
              {/* Logos */}
              <Image src="https://maxproperties.com.mx/nuevo/wp-content/uploads/2025/04/logo-max-web.png" alt="Agency 1" width={120} height={60} className="opacity-80" style={{ width: '100px' }}  />
              <Image src="https://www.zisla.com/static/assets/zisla-logo-1.fef355eb.png" alt="Agency 2" width={120} height={60} className="opacity-80" />
              <Image src="https://www.rivieramayarealestategroup.com/wp-content/uploads/2024/02/RMREG-logo-2024_2x.png" alt="Agency 3" width={120} height={60} className="opacity-80" style={{ width: '100px' }}/>
              <Image src="https://img-v2.gtsstatic.net/reno/imagereader.aspx?imageurl=https%3A%2F%2Fimg-v2.gtsstatic.net%2Freno%2Fimagereader.aspx%3Fimageurl%3Dhttps%3A%2F%2Fapi.sothebysrealty.com%2Fresources%2Fsiteresources%2Fmy%20folder%2Fhugeheader%2Flogo.svg%26option%3DN%26permitphotoenlargement%3Dfalse&option=N&permitphotoenlargement=false" alt="Agency 4" width={120} height={60} className="opacity-80" />
              
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}