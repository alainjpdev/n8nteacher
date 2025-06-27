import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, Rocket } from 'lucide-react';

interface WelcomeScreenProps {
  onNext: () => void;
  language: 'es' | 'en';
  onLanguageChange: (language: 'es' | 'en') => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext, language, onLanguageChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 500);
    const timer2 = setTimeout(() => setShowButton(true), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const content = {
    es: {
      welcome: '¡Bienvenido al Futuro',
      withAI: 'con Algorithmics AI!',
      description: 'Prepárate para un viaje increíble donde no solo aprenderás sobre Inteligencia Artificial, sino que también te convertirás en un creador!',
      button: 'Comenzar la Aventura'
    },
    en: {
      welcome: 'Welcome to the Future',
      withAI: 'with Algorithmics AI!',
      description: 'Get ready for an incredible journey where you will not only learn about Artificial Intelligence, but also become a creator!',
      button: 'Start the Adventure'
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Language Selector */}
      <div className="fixed top-6 right-6 z-50 flex space-x-2">
        <button
          onClick={() => onLanguageChange('es')}
          className={`w-12 h-8 rounded-md overflow-hidden border-2 transition-all duration-300 ${
            language === 'es' ? 'border-white shadow-lg scale-110' : 'border-gray-400 opacity-60 hover:opacity-80'
          }`}
        >
          <div className="w-full h-full bg-gradient-to-b from-green-500 via-white to-red-500 flex items-center justify-center">
            <span className="text-xs font-bold text-green-800">🇲🇽</span>
          </div>
        </button>
        <button
          onClick={() => onLanguageChange('en')}
          className={`w-12 h-8 rounded-md overflow-hidden border-2 transition-all duration-300 ${
            language === 'en' ? 'border-white shadow-lg scale-110' : 'border-gray-400 opacity-60 hover:opacity-80'
          }`}
        >
          <div className="w-full h-full bg-gradient-to-b from-blue-500 via-white to-red-500 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-800">🇺🇸</span>
          </div>
        </button>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 animate-pulse">
          <Sparkles className="text-yellow-400 w-8 h-8" />
        </div>
        <div className="absolute top-20 right-16 animate-bounce">
          <Zap className="text-blue-400 w-6 h-6" />
        </div>
        <div className="absolute bottom-20 left-20 animate-ping">
          <Rocket className="text-purple-400 w-10 h-10" />
        </div>
        <div className="absolute bottom-32 right-12 animate-pulse">
          <Sparkles className="text-pink-400 w-6 h-6" />
        </div>
      </div>

      <div className="text-center z-10 max-w-4xl mx-auto">
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="text-yellow-400 w-12 h-12 mr-4 animate-spin" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {content[language].welcome}
            </h1>
            <Sparkles className="text-yellow-400 w-12 h-12 ml-4 animate-spin" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            <span className="text-white">{language === 'es' ? 'con ' : 'with '}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse">
              Algorithmics AI!
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed">
            {language === 'es' ? (
              <>
                Prepárate para un viaje increíble donde no solo aprenderás sobre 
                <span className="text-blue-400 font-semibold"> Inteligencia Artificial</span>, 
                ¡sino que también te convertirás en un 
                <span className="text-purple-400 font-semibold"> creador</span>!
              </>
            ) : (
              <>
                Get ready for an incredible journey where you will not only learn about 
                <span className="text-blue-400 font-semibold"> Artificial Intelligence</span>, 
                but also become a 
                <span className="text-purple-400 font-semibold"> creator</span>!
              </>
            )}
          </p>
        </div>

        {showButton && (
          <div className={`transform transition-all duration-1000 ${showButton ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <button
              onClick={onNext}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
            >
              <span className="flex items-center">
                {content[language].button}
                <Rocket className="ml-3 w-6 h-6 animate-bounce" />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;