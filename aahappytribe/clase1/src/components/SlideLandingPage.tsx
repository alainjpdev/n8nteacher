import React from 'react';
import { Globe } from 'lucide-react';

interface SlideLandingPageProps {
  isActive: boolean;
}

const SlideLandingPage: React.FC<SlideLandingPageProps> = ({ isActive }) => {
  return (
    <div className={`slide ${isActive ? 'opacity-100' : 'opacity-0'} p-8`}>
      <div className="flex items-center mb-8">
        <Globe className="w-12 h-12 text-cyan-400 mr-4" />
        <h2 className="text-4xl font-bold text-white">¿Qué es una Landing Page?</h2>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-2xl font-semibold text-cyan-300 mb-4">Definición</h3>
          <p className="text-xl text-white/90">
            Página web sencilla que presenta una <span className="text-cyan-400 font-bold">idea, producto o servicio</span>.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-2xl font-semibold text-green-300 mb-6">Estructura Básica</h3>
          <div className="space-y-4">
            {[
              { number: '1', title: 'Header o título principal', desc: '(lo que atrapa la atención)', color: 'from-red-500 to-pink-500' },
              { number: '2', title: 'Texto breve que explica qué es', desc: '', color: 'from-blue-500 to-cyan-500' },
              { number: '3', title: 'Botón o llamada a la acción (CTA)', desc: '', color: 'from-green-500 to-emerald-500' }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${item.color} text-white flex items-center justify-center rounded-full font-bold text-xl`}>
                  {item.number}
                </div>
                <div>
                  <p className="text-lg text-white font-semibold">{item.title}</p>
                  {item.desc && <p className="text-sm text-white/70">{item.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-400/30">
          <h3 className="text-2xl font-semibold text-purple-300 mb-4">🎮 Vibe Coding Challenge</h3>
          <p className="text-lg text-white/90">
            Los alumnos improvisan títulos locos para sus primeras páginas
          </p>
          <div className="mt-3 text-yellow-300 font-semibold text-center">
            "Bienvenidos al club del helado de espagueti" 🍦🍝
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideLandingPage;
