'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import FilterBar from '@/components/FilterBar';
import CarCardList from '@/components/CarCard';
import MapView from '@/components/MapView';
import { MapPin } from 'lucide-react';

export default function SearchWithResultsPage() {
  const [showMap, setShowMap] = useState(false);
  const constraintsRef = useRef(null);

  return (
    <section className="w-full h-screen flex flex-col relative">
      <Navbar />
      <FilterBar />

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Car list - Desktop */}
        <div className="w-full lg:w-[50%] overflow-y-auto p-6 space-y-6 hidden lg:block">
          <h2 className="text-lg font-semibold mb-4">200+ cars available</h2>
          <CarCardList />
        </div>

        {/* Map - Desktop */}
        <div className="hidden lg:block w-full lg:w-[50%] h-full">
          <MapView />
        </div>
      </div>

      {/* Map + Draggable CarCardList - Mobile */}
      {showMap && (
        <div ref={constraintsRef} className="lg:hidden fixed inset-0 z-40 bg-white">
          <MapView />

          {/* Draggable Card Panel */}
          <motion.div
            drag="y"
            dragConstraints={{ top: -500, bottom: 0 }}
            dragElastic={0.2}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl p-4 max-h-[80%] overflow-y-auto"
            initial={{ y: 300 }}
            animate={{ y: 0 }}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-4 text-center">200+ cars available</h2>
            <CarCardList />
          </motion.div>
        </div>
      )}

      {/* Map Button */}
      <button
        onClick={() => setShowMap(!showMap)}
        className="lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-md rounded-full p-3 z-50"
      >
        <MapPin className="w-5 h-5 text-indigo-600" />
      </button>
    </section>
  );
}