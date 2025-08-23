import React from 'react';
import { Code } from 'lucide-react';

interface SlideHerramientasProps {
  isActive: boolean;
}

const SlideHerramientas: React.FC<SlideHerramientasProps> = ({ isActive }) => {
  return (
    <div className={`slide ${isActive ? 'opacity-100' : 'opacity-0'} p-8`}>
      <div className="flex items-center mb-8">
        <Code className="w-12 h-12 text-blue-400 mr-4" />
        <h2 className="text-4xl font-bold text-white">Herramientas para Crear</h2>
      </div>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-orange-500/20 rounded-lg p-6 border border-orange-400/30">
            <h3 className="text-2xl font-semibold text-orange-300 mb-4">🔧 Replit</h3>
            <ul className="text-white/90 space-y-2">
              <li>• Editor online para programar</li>
              <li>• No se instala nada</li>
              <li>• Ejecutar archivos HTML directamente</li>
            </ul>
          </div>

          <div className="bg-blue-500/20 rounded-lg p-6 border border-blue-400/30">
            <h3 className="text-2xl font-semibold text-blue-300 mb-4">⚡ Bolt.new</h3>
            <ul className="text-white/90 space-y-2">
              <li>• Crear apps y sitios web en segundos</li>
              <li>• Powered by IA</li>
              <li>• Resultados instantáneos</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-6 border border-yellow-400/30">
          <h3 className="text-2xl font-semibold text-yellow-300 mb-4">🎮 Filosofía Vibe Coding</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-white/90">Exploren</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🗑️</div>
              <p className="text-white/90">Borren</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎨</div>
              <p className="text-white/90">Cambien colores</p>
            </div>
          </div>
          <p className="text-center mt-4 text-lg text-white/90">
            <span className="text-red-400 font-bold">Rompan el código sin miedo</span> - La idea es experimentar, no seguir un manual perfecto
          </p>
        </div>
      </div>
    </div>
  );
};

export default SlideHerramientas;
