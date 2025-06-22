'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full fixed top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold tracking-tight">
          <span className="bg-black text-white px-2 py-1 rounded-md">TURO</span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/*<Link
            href="/become-a-host"
            className="text-sm font-medium px-4 py-2 border border-black rounded-full hover:bg-gray-100 transition"
          >
            Become a host
          </Link>*/}

          <Link
            href="/sign-in"
            className="text-sm font-medium px-4 py-2 border border-gray-800 rounded-full hover:bg-gray-100 transition"
          >
            Sign In
          </Link>

          <button className="p-2 rounded-full hover:bg-gray-200">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}