"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMapPage = pathname.startsWith("/map");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!isMapPage && <Footer />}
    </div>
  );
}