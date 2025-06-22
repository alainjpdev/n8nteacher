'use client';

import Navbar from '@/components/Navbar';
import ExploreSection from '@/components/ExploreSection'; // ⬅️ Asegúrate que la ruta sea correcta
import BrowseByDestination from '@/components/BrowseByDestination';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center bg-white text-black">
        {/* Hero Section */}
        <section
          className="relative w-full h-[80vh] bg-cover bg-center"
          style={{ backgroundImage: "url('/images/your-hero-image.png')" }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30" />

          {/* Search Bar */}
          <div className="relative z-10 max-w-4xl mx-auto mt-32 bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="City, airport, address or hotel"
              className="flex-1 border p-3 rounded-md w-full"
            />
            <input type="date" className="border p-3 rounded-md" />
            <input type="time" className="border p-3 rounded-md" />
            <input type="date" className="border p-3 rounded-md" />
            <input type="time" className="border p-3 rounded-md" />
            <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800">
              Search
            </button>
          </div>
        </section>

        {/* Title Section */}
        <section className="text-center py-16 px-6 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Skip the rental car counter</h1>
          <p className="text-lg text-gray-600">
            Rent just about any car, just about anywhere
          </p>
        </section>

        {/* 🆕 Explore Section (galería + texto) */}
     {/* }   <ExploreSection />*/}

        {/* Feature Section */}
        {/*<section className="flex flex-col md:flex-row gap-12 items-center px-6 pb-24 max-w-5xl">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-4">Airport pickup made easy</h2>
            <p className="text-gray-600 mb-4">
              Easy pickup offered by hosts at hundreds of airports across the US,
              UK, Canada, France, and Australia.
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>No lines, no paperwork, no hassle</li>
            </ul>
          </div>
          <div className="flex-1">
            <img
              src="/images/airport-pickup-illustration.svg"
              alt="Airport illustration"
              className="w-full max-w-sm mx-auto"
            />
          </div>
        </section>*/}
      {/*}  <BrowseByDestination />*/}
      </main>
    </>
  );
}