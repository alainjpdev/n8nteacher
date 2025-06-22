'use client';

import Image from 'next/image';
import Link from 'next/link';

type Destination = {
  name: string;
  icon: string;
};

const destinations: Destination[] = [
  { name: 'Los Angeles', icon: '/icons/los-angeles.svg' },
  { name: 'Honolulu', icon: '/icons/honolulu.svg' },
  { name: 'Paris', icon: '/icons/paris.svg' },
  { name: 'Sydney', icon: '/icons/sydney.svg' },
  { name: 'London', icon: '/icons/london.svg' },
  { name: 'Toronto', icon: '/icons/toronto.svg' },
];

export default function BrowseByDestination(): JSX.Element {
  return (
    <section className="w-full px-6 py-16 flex flex-col items-center text-center">
      <h2 className="text-xl font-semibold mb-8">Browse by destination</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-16">
        {destinations.map((dest, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 flex flex-col items-center hover:shadow transition"
          >
            <Image
              src={dest.icon}
              alt={dest.name}
              width={64}
              height={64}
              className="mb-3"
            />
            <span className="text-sm font-medium">{dest.name}</span>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="max-w-xl">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-purple-100 h-3 top-6 -z-10 rounded"></span>
            Get your gearhead fix
          </span>
        </h3>
        <p className="text-gray-600 mb-6">
          Peruse the latest features and photos of the best cars from around the marketplace.
        </p>
        <Link
          href="/blog"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition"
        >
          Explore the blog
        </Link>
      </div>
    </section>
  );
}