import React, { useState } from 'react';
import { MessageSquare, Gamepad2, Globe, Sparkles, ArrowRight } from 'lucide-react';

interface PromptExplanationProps {
  onChoice: (choice: 'game' | 'landing') => void;
  language: 'es' | 'en';
}

const PromptExplanation: React.FC<PromptExplanationProps> = ({ onChoice, language }) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleChoice = (choice: 'game' | 'landing') => {
    setSelectedChoice(choice);
    setTimeout(() => onChoice(choice), 500);
  };

  const content = {
    es: {
      title: '¿Qué es un Prompt?',
      description: 'Un prompt es una instrucción que le das a la Inteligencia Artificial para que cree algo increíble. ¡Es como darle órdenes mágicas a una computadora súper inteligente!',
      chooseTitle: '¡Elige tu primera creación con AI!',
      gameTitle: 'Crear Videojuego',
      gameDescription: '¡Crea un divertido juego de Ping Pong usando Inteligencia Artificial en segundos!',
      gameAction: 'Crear en segundos',
      landingTitle: 'Crear Landing Page',
      landingDescription: '¡Diseña una página web profesional usando el poder de la AI en tiempo real!',
      landingAction: 'Diseñar ahora'
    },
    en: {
      title: 'What is a Prompt?',
      description: 'A prompt is an instruction you give to Artificial Intelligence to create something incredible. It\'s like giving magical commands to a super intelligent computer!',
      chooseTitle: 'Choose your first AI creation!',
      gameTitle: 'Create Video Game',
      gameDescription: 'Create a fun Ping Pong game using Artificial Intelligence in seconds!',
      gameAction: 'Create in seconds',
      landingTitle: 'Create Landing Page',
      landingDescription: 'Design a professional website using the power of AI in real time!',
      landingAction: 'Design now'
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <MessageSquare className="text-blue-400 w-16 h-16 animate-pulse" />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {content[language].title.split(' ').map((word, index) => 
              word === 'Prompt' ? (
                <span key={index} className="text-blue-400">{word}</span>
              ) : (
                <span key={index}>{word} </span>
              )
            )}
          </h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-12">
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              {language === 'es' ? (
                <>
                  Un <span className="text-blue-400 font-semibold">prompt</span> es una instrucción que le das a la 
                  <span className="text-purple-400 font-semibold"> Inteligencia Artificial </span>
                  para que cree algo increíble. ¡Es como darle órdenes mágicas a una computadora súper inteligente!
                </>
              ) : (
                <>
                  A <span className="text-blue-400 font-semibold">prompt</span> is an instruction you give to 
                  <span className="text-purple-400 font-semibold"> Artificial Intelligence </span>
                  to create something incredible. It's like giving magical commands to a super intelligent computer!
                </>
              )}
            </p>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
          {content[language].chooseTitle}
        </h2>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Game Option */}
          <div 
            className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-105 ${selectedChoice === 'game' ? 'ring-4 ring-blue-400' : ''}`}
            onClick={() => handleChoice('game')}
          >
            <div className="flex items-center justify-center mb-4">
              <Gamepad2 className="text-green-400 w-16 h-16" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
              {content[language].gameTitle}
            </h3>
            <p className="text-gray-300 mb-6">
              {content[language].gameDescription}
            </p>
            <div className="flex items-center justify-center text-blue-400 font-semibold">
              <Sparkles className="w-5 h-5 mr-2" />
              {content[language].gameAction}
              <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </div>

          {/* Landing Page Option */}
          <div 
            className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-105 ${selectedChoice === 'landing' ? 'ring-4 ring-purple-400' : ''}`}
            onClick={() => handleChoice('landing')}
          >
            <div className="flex items-center justify-center mb-4">
              <Globe className="text-purple-400 w-16 h-16" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
              {content[language].landingTitle}
            </h3>
            <p className="text-gray-300 mb-6">
              {content[language].landingDescription}
            </p>
            <div className="flex items-center justify-center text-purple-400 font-semibold">
              <Sparkles className="w-5 h-5 mr-2" />
              {content[language].landingAction}
              <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptExplanation;