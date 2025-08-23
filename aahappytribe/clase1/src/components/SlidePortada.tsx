import React from 'react';
import { Sparkles } from 'lucide-react';

interface SlidePortadaProps {
  isActive: boolean;
}

const SlidePortada: React.FC<SlidePortadaProps> = ({ isActive }) => {
  return (
    <div className={`slide ${isActive ? 'opacity-100' : 'opacity-0'} flex flex-col items-center justify-center text-center`}>
      <div className="mb-8">
        <Sparkles className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-pulse" />
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
          Clase 1
        </h1>
        <h2 className="text-4xl font-bold text-white mb-6">
          Introducción a la IA y Creación de Landing Pages
        </h2>
        <div className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-xl">
          🎮 Vibe Coding Mode
        </div>
      </div>
    </div>
  );
};

export default SlidePortada;
