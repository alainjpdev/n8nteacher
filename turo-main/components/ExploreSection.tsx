'use client';

import Image from 'next/image';
import Link from 'next/link';

const carImages: string[] = [
  '/cars/car1.jpg',
  '/cars/car2.jpg',
  '/cars/car3.jpg',
  '/cars/car4.jpg',
  '/cars/car5.jpg',
  '/cars/car6.jpg',
  '/cars/car7.jpg',
  '/cars/car8.jpg',
  '/cars/car9.jpg',
  '/cars/car10.jpg',
  '/cars/car11.jpg',
  '/cars/car12.jpg',
];

export default function ExploreSection(): JSX.Element {
  return (
    <section className="w-full bg-[#f5f5f5] py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Grid de imágenes */}
        <div className="grid grid-cols-4 gap-4 flex-shrink-0">
          {carImages.map((src: string, index: number) => (
            <Link
              key={index}
              href="/searchwithresults"
              className="rounded-lg overflow-hidden shadow-sm hover:scale-105 transition-transform"
            >
              <Image
                src={src}
                alt={`Car ${index + 1}`}
                width={160}
                height={100}
                className="object-cover w-full h-auto"
              />
            </Link>
          ))}
        </div>

        {/* Texto + botón */}
        <div className="max-w-md text-center lg:text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Rent cars for any occasion
          </h2>
          <p className="text-gray-600 mb-6">
            Browse an incredible selection of cars, from the everyday to the extraordinary.
          </p>
          <Link
            href="/searchwithresults"
            className="inline-block bg-indigo-600 text-white text-sm font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 transition"
          >
            Explore cars
          </Link>
        </div>
      </div>
    </section>
  );
}