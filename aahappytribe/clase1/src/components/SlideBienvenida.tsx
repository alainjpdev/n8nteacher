import React from 'react';
import { Sparkles } from 'lucide-react';

interface SlideBienvenidaProps {
  isActive: boolean;
}

const SlideBienvenida: React.FC<SlideBienvenidaProps> = ({ isActive }) => {
  return (
    <div className={`slide ${isActive ? 'opacity-100' : 'opacity-0'} p-8`}>
      <div className="flex items-center mb-8">
        <Sparkles className="w-12 h-12 text-yellow-400 mr-4" />
        <h2 className="text-4xl font-bold text-white">Bienvenida e Introducción</h2>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-2xl font-semibold text-blue-300 mb-4">¿Qué veremos este año?</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['IA', 'Landing Pages', 'React', 'n8n', 'Vapi'].map((tech, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-center font-semibold">
                {tech}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-2xl font-semibold text-green-300 mb-4">🧠 Sobre la IA</h3>
          <p className="text-lg text-white/90">
            La IA no es magia, sino <span className="text-yellow-400 font-bold">programas que aprenden</span> a responder 
            o generar información a partir de datos.
          </p>
        </div>

        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-6 border border-yellow-400/30">
          <h3 className="text-2xl font-semibold text-yellow-300 mb-4">🎮 Filosofía Vibe Coding</h3>
          <ul className="text-lg text-white/90 space-y-2">
            <li>• <span className="text-green-400">No aprender todo de golpe</span></li>
            <li>• <span className="text-blue-400">Explorar, probar y jugar</span> con el código</li>
            <li>• Como si fuera un <span className="text-purple-400">videojuego</span></li>
            <li>• <span className="text-yellow-400">Si algo falla, está bien</span> - ¡así aprendemos!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SlideBienvenida;
