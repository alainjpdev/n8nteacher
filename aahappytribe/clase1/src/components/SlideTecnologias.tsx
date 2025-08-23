import React from 'react';
import { Layers } from 'lucide-react';

interface SlideTecnologiasProps {
  isActive: boolean;
}

const SlideTecnologias: React.FC<SlideTecnologiasProps> = ({ isActive }) => {
  return (
    <div className={`slide ${isActive ? 'opacity-100' : 'opacity-0'} p-8`}>
      <div className="flex items-center mb-8">
        <Layers className="w-12 h-12 text-emerald-400 mr-4" />
        <h2 className="text-4xl font-bold text-white">Tecnologías Base de la Web</h2>
      </div>
      
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-orange-500/20 rounded-lg p-6 border border-orange-400/30 text-center">
            <h3 className="text-3xl font-bold text-orange-300 mb-3">HTML</h3>
            <div className="text-6xl mb-4">🦴</div>
            <p className="text-lg text-white/90">Estructura</p>
            <p className="text-sm text-orange-300">(el esqueleto)</p>
          </div>

          <div className="bg-blue-500/20 rounded-lg p-6 border border-blue-400/30 text-center">
            <h3 className="text-3xl font-bold text-blue-300 mb-3">CSS</h3>
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-lg text-white/90">Estilos</p>
            <p className="text-sm text-blue-300">(colores y diseño)</p>
          </div>

          <div className="bg-yellow-500/20 rounded-lg p-6 border border-yellow-400/30 text-center">
            <h3 className="text-3xl font-bold text-yellow-300 mb-3">JavaScript</h3>
            <div className="text-6xl mb-4">⚡</div>
            <p className="text-lg text-white/90">Interacción</p>
            <p className="text-sm text-yellow-300">(cuando haces clic y pasa algo)</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-6 border border-green-400/30">
          <h3 className="text-2xl font-semibold text-green-300 mb-4">🎮 Mini MVP Vibe Coding</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🎨</div>
              <p className="text-white/90">Cambiar color de fondo</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📏</div>
              <p className="text-white/90">Agrandar un título</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🚨</div>
              <p className="text-white/90">Probar alert() gracioso</p>
            </div>
          </div>
          <p className="text-center mt-4 text-xl font-bold text-yellow-400">
            "Juega con el código, que se note tu estilo" ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default SlideTecnologias;
