import React, { useEffect, useState } from 'react';
import { Timer, Star, Users, Zap, ArrowRight, Eye, MousePointer } from 'lucide-react';

interface LandingPageDemoProps {
  onComplete: () => void;
  language: 'es' | 'en';
}

const LandingPageDemo: React.FC<LandingPageDemoProps> = ({ onComplete, language }) => {
  const [timeLeft, setTimeLeft] = useState(20);
  const [interactions, setInteractions] = useState(0);

  const content = {
    es: {
      demoTitle: '🎨 Landing Page Demo - Creada con AI',
      demoSubtitle: 'Esta es una demostración de una landing page creada con Inteligencia Artificial',
      demoNote: 'Cualquier botón te llevará al final de la presentación',
      remaining: 'restantes',
      interactions: 'interacciones',
      heroTitle: 'Bienvenido al Futuro Digital',
      heroSubtitle: 'Una landing page increíble creada con Inteligencia Artificial en segundos. ¡Experimenta el poder de la creatividad automatizada!',
      heroButton: '¡Comienza Ahora!',
      featuresTitle: '¿Por qué elegir nuestra plataforma?',
      feature1Title: 'Súper Rápido',
      feature1Description: 'Crea proyectos increíbles en segundos con el poder de la AI',
      feature2Title: 'Calidad Premium',
      feature2Description: 'Resultados profesionales que superan las expectativas',
      feature3Title: 'Fácil de Usar',
      feature3Description: 'Interfaz intuitiva diseñada para todos los niveles',
      ctaTitle: '¡No esperes más!',
      ctaSubtitle: 'Únete a miles de usuarios que ya están creando con AI',
      ctaButton: 'Empezar Gratis'
    },
    en: {
      demoTitle: '🎨 Landing Page Demo - Created with AI',
      demoSubtitle: 'This is a demonstration of a landing page created with Artificial Intelligence',
      demoNote: 'Any button will take you to the end of the presentation',
      remaining: 'remaining',
      interactions: 'interactions',
      heroTitle: 'Welcome to the Digital Future',
      heroSubtitle: 'An incredible landing page created with Artificial Intelligence in seconds. Experience the power of automated creativity!',
      heroButton: 'Start Now!',
      featuresTitle: 'Why choose our platform?',
      feature1Title: 'Super Fast',
      feature1Description: 'Create incredible projects in seconds with the power of AI',
      feature2Title: 'Premium Quality',
      feature2Description: 'Professional results that exceed expectations',
      feature3Title: 'Easy to Use',
      feature3Description: 'Intuitive interface designed for all levels',
      ctaTitle: 'Don\'t wait any longer!',
      ctaSubtitle: 'Join thousands of users who are already creating with AI',
      ctaButton: 'Start Free'
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  const handleInteraction = () => {
    setInteractions(prev => prev + 1);
    // Any button click goes to final screen
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Demo Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-purple-500/30">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="text-purple-400 w-6 h-6 mr-3" />
              <div>
                <h3 className="text-white font-bold text-sm md:text-base">
                  {content[language].demoTitle}
                </h3>
                <p className="text-gray-300 text-xs md:text-sm">
                  {content[language].demoSubtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                <Timer className="text-blue-400 w-4 h-4 mr-2" />
                <span className="text-white font-bold text-sm">
                  {timeLeft}s {content[language].remaining}
                </span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                <Star className="text-yellow-400 w-4 h-4 mr-2" />
                <span className="text-white font-bold text-sm">
                  {interactions} {content[language].interactions}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="fixed bottom-4 left-4 right-4 z-50">
        <div className="max-w-md mx-auto bg-yellow-500/90 backdrop-blur-sm rounded-lg p-3 border border-yellow-400">
          <div className="flex items-center">
            <MousePointer className="text-yellow-900 w-5 h-5 mr-2 animate-bounce" />
            <p className="text-yellow-900 font-semibold text-sm">
              {content[language].demoNote}
            </p>
          </div>
        </div>
      </div>

      {/* Landing Page Content */}
      <div className="pt-20">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
              {language === 'es' ? (
                <>
                  Bienvenido al
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 block">
                    Futuro Digital
                  </span>
                </>
              ) : (
                <>
                  Welcome to the
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 block">
                    Digital Future
                  </span>
                </>
              )}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {content[language].heroSubtitle}
            </p>

            <button
              onClick={handleInteraction}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
            >
              <span className="flex items-center">
                {content[language].heroButton}
                <ArrowRight className="ml-3 w-6 h-6" />
              </span>
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-12">
              {content[language].featuresTitle}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div 
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-105"
                onClick={handleInteraction}
              >
                <Zap className="text-yellow-400 w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-4">{content[language].feature1Title}</h3>
                <p className="text-gray-300">
                  {content[language].feature1Description}
                </p>
              </div>

              <div 
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-105"
                onClick={handleInteraction}
              >
                <Star className="text-purple-400 w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-4">{content[language].feature2Title}</h3>
                <p className="text-gray-300">
                  {content[language].feature2Description}
                </p>
              </div>

              <div 
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-105"
                onClick={handleInteraction}
              >
                <Users className="text-blue-400 w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-4">{content[language].feature3Title}</h3>
                <p className="text-gray-300">
                  {content[language].feature3Description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {content[language].ctaTitle}
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                {content[language].ctaSubtitle}
              </p>
              <button
                onClick={handleInteraction}
                className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                {content[language].ctaButton}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPageDemo;