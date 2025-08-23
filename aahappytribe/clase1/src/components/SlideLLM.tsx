import React from 'react';
import { Brain, MapPin, TrendingUp, Lightbulb } from 'lucide-react';

interface SlideLLMProps {
  isActive: boolean;
}

const SlideLLM: React.FC<SlideLLMProps> = ({ isActive }) => {
  return (
    <div className={`slide ${isActive ? 'opacity-100' : 'opacity-0'} p-8`}>
      <div className="flex items-center mb-8">
        <Brain className="w-12 h-12 text-purple-400 mr-4" />
        <h2 className="text-4xl font-bold text-white">¿Qué es un LLM?</h2>
      </div>
      
      <div className="space-y-6">
        {/* Definición básica */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-2xl font-semibold text-purple-300 mb-4">Large Language Model</h3>
          <p className="text-xl text-white/90 mb-4">
            Un modelo de lenguaje es como un <span className="text-purple-400 font-bold">"cerebro entrenado"</span> con 
            millones de textos que puede responder, redactar y crear ideas.
          </p>
        </div>

        {/* Ejemplos conocidos */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-2xl font-semibold text-blue-300 mb-4">Ejemplos Conocidos</h3>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'ChatGPT', color: 'from-green-500 to-emerald-600' },
              { name: 'Gemini', color: 'from-blue-500 to-cyan-600' },
              { name: 'Claude', color: 'from-orange-500 to-red-600' }
            ].map((llm, index) => (
              <div key={index} className={`bg-gradient-to-r ${llm.color} text-white px-6 py-3 rounded-lg font-bold text-lg`}>
                {llm.name}
              </div>
            ))}
          </div>
        </div>

        {/* Cómo funciona - Sección principal */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-6 border border-purple-400/30">
          <h3 className="text-3xl font-bold text-purple-300 mb-6 text-center">🌐 ¿Cómo funciona un LLM?</h3>
          <p className="text-lg text-white/90 mb-6 text-center">
            <span className="text-yellow-400 font-bold">Versión para jóvenes</span> - ¡No es magia, es matemáticas!
          </p>
        </div>

        {/* 1. Las palabras como números */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-6 border border-green-400/30">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4 font-bold text-white">1</div>
            <h3 className="text-2xl font-semibold text-green-300">Las palabras como números</h3>
          </div>
          <div className="space-y-3 text-white/90">
            <p>• Una computadora no entiende directamente "gato" o "pelota".</p>
            <p>• Lo que hace el LLM es convertir cada palabra en un número o coordenada dentro de un mapa gigante (eso se llama <span className="text-green-400 font-bold">vector</span>).</p>
            <div className="bg-green-500/30 p-4 rounded-lg mt-3">
              <p className="font-semibold text-green-200">Ejemplo:</p>
              <p>• "gato" podría estar en el punto <span className="text-yellow-400">(2, 7)</span></p>
              <p>• "perro" en <span className="text-yellow-400">(3, 6)</span></p>
              <p>• Como están cerca en el mapa, el modelo sabe que significan cosas parecidas.</p>
            </div>
          </div>
        </div>

        {/* 2. El mapa de significados */}
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-6 border border-blue-400/30">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4 font-bold text-white">2</div>
            <h3 className="text-2xl font-semibold text-blue-300">El mapa de significados</h3>
          </div>
          <div className="space-y-3 text-white/90">
            <p>• Imagina un mapa en 3D donde las palabras que se parecen se juntan:</p>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <div className="bg-blue-500/30 p-3 rounded-lg">
                <p className="font-semibold text-blue-200">Cerca entre sí:</p>
                <p>• "rey" y "reina"</p>
                <p>• "fútbol" y "baloncesto"</p>
              </div>
              <div className="bg-red-500/30 p-3 rounded-lg">
                <p className="font-semibold text-red-200">Muy lejos:</p>
                <p>• "rey" y "computadora"</p>
                <p>• "fútbol" y "ensalada"</p>
              </div>
            </div>
            <p className="mt-3">Este mapa es lo que permite que el modelo "entienda" relaciones de significado.</p>
          </div>
        </div>

        {/* 3. Predicción paso a paso */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-6 border border-orange-400/30">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-4 font-bold text-white">3</div>
            <h3 className="text-2xl font-semibold text-orange-300">Predicción paso a paso</h3>
          </div>
          <div className="space-y-3 text-white/90">
            <p>• Cuando escribes una pregunta, el LLM busca en ese mapa cuáles son las palabras más probables que deberían seguir.</p>
            <div className="bg-orange-500/30 p-4 rounded-lg mt-3">
              <p className="font-semibold text-orange-200">Ejemplo:</p>
              <p>Tú pones: <span className="text-yellow-400 font-bold">"Los gatos beben…"</span></p>
              <p>El modelo revisa el mapa y ve que después de "gatos beben" lo más probable es <span className="text-green-400 font-bold">"leche"</span> o <span className="text-blue-400 font-bold">"agua"</span>.</p>
              <p>Así va armando la respuesta palabra por palabra, como si adivinara la siguiente ficha de dominó.</p>
            </div>
          </div>
        </div>

        {/* 4. ¿Por qué parecen inteligentes? */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-400/30">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-4 font-bold text-white">4</div>
            <h3 className="text-2xl font-semibold text-purple-300">¿Por qué parecen inteligentes?</h3>
          </div>
          <div className="space-y-3 text-white/90">
            <p>• Porque han visto <span className="text-purple-400 font-bold">millones de ejemplos</span> en libros, páginas web y artículos.</p>
            <p>• Eso les da "intuición" para escribir como un humano, aunque no tengan conciencia.</p>
            <p>• Es como un estudiante que ha leído tanto que puede escribir ensayos, poemas o contestar exámenes basándose en todo lo que ya vio.</p>
          </div>
        </div>

        {/* Imagen demostrativa conceptual */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-6 border border-yellow-400/30">
          <h3 className="text-2xl font-semibold text-yellow-300 mb-4 text-center">🖼️ Visualización del Proceso</h3>
          <div className="grid md:grid-cols-4 gap-4 items-center">
            <div className="text-center">
              <div className="text-3xl mb-2">📝</div>
              <p className="text-white/90 text-sm">"Los gatos beben..."</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">➡️</div>
              <p className="text-white/90 text-sm">Análisis</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🗺️</div>
              <p className="text-white/90 text-sm">Mapa de vectores</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">✨</div>
              <p className="text-white/90 text-sm">"leche"</p>
            </div>
          </div>
          <p className="text-center mt-4 text-lg text-yellow-300 font-semibold">
            ¡No memoriza, calcula relaciones matemáticas!
          </p>
        </div>

        {/* Actividad Vibe Coding */}
        
      </div>
    </div>
  );
};

export default SlideLLM;
