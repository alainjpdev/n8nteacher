import React from 'react';
import { MessageSquare } from 'lucide-react';

interface SlidePromptProps {
  isActive: boolean;
}

const SlidePrompt: React.FC<SlidePromptProps> = ({ isActive }) => {
  return (
    <div className={`slide ${isActive ? 'opacity-100' : 'opacity-0'} p-8`}>
      <div className="flex items-center mb-8">
        <MessageSquare className="w-12 h-12 text-green-400 mr-4" />
        <h2 className="text-4xl font-bold text-white">¿Qué es un Prompt?</h2>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <p className="text-xl text-white/90 mb-4">
            El prompt es la <span className="text-green-400 font-bold">instrucción o pregunta</span> que se le da a la IA.
          </p>
          <div className="text-2xl font-bold text-center text-yellow-400">
            Buen prompt = Buena respuesta ✨
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-500/20 rounded-lg p-6 border border-red-400/30">
            <h3 className="text-xl font-semibold text-red-300 mb-3">❌ Prompt Débil</h3>
            <div className="bg-red-500/30 p-4 rounded-lg">
              <code className="text-white">"Hazme una página web"</code>
            </div>
          </div>

          <div className="bg-green-500/20 rounded-lg p-6 border border-green-400/30">
            <h3 className="text-xl font-semibold text-green-300 mb-3">✅ Prompt Fuerte</h3>
            <div className="bg-green-500/30 p-4 rounded-lg">
              <code className="text-white text-sm">
                "Crea una landing page en HTML y CSS con un título grande que diga 'Bienvenido', 
                un botón azul que diga 'Comenzar', y un fondo amarillo"
              </code>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-400/30">
          <h3 className="text-2xl font-semibold text-purple-300 mb-4">🎮 Vibe Coding Twist</h3>
          <p className="text-lg text-white/90">
            Cada alumno inventa un prompt divertido y vemos qué genera la IA.
          </p>
          <div className="mt-3 text-yellow-300 font-semibold">
            Ejemplo: "Una página web sobre gatos que hablan inglés" 🐱🌮
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlidePrompt;
