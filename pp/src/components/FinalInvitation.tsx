import React from 'react';
import { Sparkles, ExternalLink, RotateCcw, GraduationCap, Calendar } from 'lucide-react';

interface FinalInvitationProps {
  onRestart: () => void;
  language: 'es' | 'en';
}

const FinalInvitation: React.FC<FinalInvitationProps> = ({ onRestart, language }) => {
  const handleVisitWebsite = () => {
    window.open('https://algorithmicsai.com', '_blank');
  };

  const content = {
    es: {
      title: '¡Increíble Experiencia!',
      description: 'Acabas de experimentar el poder de la Inteligencia Artificial de primera mano. ¿Te imaginas todo lo que podrías crear con las herramientas adecuadas?',
      courseTitle: 'Curso de Verano Algorithmics AI',
      courseDescription: 'Aprende a crear videojuegos, aplicaciones web, arte digital y mucho más usando las herramientas de Inteligencia Artificial más avanzadas del mundo.',
      feature1Title: 'Proyectos Reales',
      feature1Description: 'Crea juegos y apps como un profesional',
      feature2Title: 'Instructores Expertos',
      feature2Description: 'Aprende de los mejores en AI',
      feature3Title: 'Horarios Flexibles',
      feature3Description: 'Clases adaptadas a tu tiempo',
      enrollButton: '¡Inscríbete Ahora!',
      restartButton: 'Repetir Demo',
      footer: '✨ Descubre tu potencial creativo con Algorithmics AI ✨'
    },
    en: {
      title: 'Incredible Experience!',
      description: 'You just experienced the power of Artificial Intelligence firsthand. Can you imagine everything you could create with the right tools?',
      courseTitle: 'Algorithmics AI Summer Course',
      courseDescription: 'Learn to create video games, web applications, digital art and much more using the most advanced Artificial Intelligence tools in the world.',
      feature1Title: 'Real Projects',
      feature1Description: 'Create games and apps like a professional',
      feature2Title: 'Expert Instructors',
      feature2Description: 'Learn from the best in AI',
      feature3Title: 'Flexible Schedules',
      feature3Description: 'Classes adapted to your time',
      enrollButton: 'Enroll Now!',
      restartButton: 'Repeat Demo',
      footer: '✨ Discover your creative potential with Algorithmics AI ✨'
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="text-yellow-400 w-20 h-20 animate-bounce" />
          </div>
          
          <h1 className="text-3xl md:text-6xl font-bold text-white mb-6">
            {content[language].title}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            {language === 'es' ? (
              <>
                Acabas de experimentar el poder de la 
                <span className="text-blue-400 font-semibold"> Inteligencia Artificial </span>
                de primera mano. ¿Te imaginas todo lo que podrías crear con las herramientas adecuadas?
              </>
            ) : (
              <>
                You just experienced the power of 
                <span className="text-blue-400 font-semibold"> Artificial Intelligence </span>
                firsthand. Can you imagine everything you could create with the right tools?
              </>
            )}
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-8">
          <div className="flex items-center justify-center mb-6">
            <Calendar className="text-purple-400 w-16 h-16" />
          </div>
          
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
            🚀 {language === 'es' ? 'Curso de Verano' : 'Summer Course'}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 block">
              Algorithmics AI
            </span>
          </h2>
          
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            {content[language].courseDescription}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 rounded-xl p-4">
              <Sparkles className="text-yellow-400 w-8 h-8 mx-auto mb-2" />
              <h3 className="text-white font-bold mb-2">{content[language].feature1Title}</h3>
              <p className="text-gray-300 text-sm">{content[language].feature1Description}</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4">
              <GraduationCap className="text-blue-400 w-8 h-8 mx-auto mb-2" />
              <h3 className="text-white font-bold mb-2">{content[language].feature2Title}</h3>
              <p className="text-gray-300 text-sm">{content[language].feature2Description}</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4">
              <Calendar className="text-purple-400 w-8 h-8 mx-auto mb-2" />
              <h3 className="text-white font-bold mb-2">{content[language].feature3Title}</h3>
              <p className="text-gray-300 text-sm">{content[language].feature3Description}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleVisitWebsite}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center"
          >
            <span className="flex items-center">
              {content[language].enrollButton}
              <ExternalLink className="ml-3 w-6 h-6" />
            </span>
          </button>

          <button
            onClick={onRestart}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 flex items-center"
          >
            <span className="flex items-center">
              <RotateCcw className="mr-3 w-6 h-6" />
              {content[language].restartButton}
            </span>
          </button>
        </div>

        <div className="mt-8">
          <p className="text-gray-400 text-sm">
            {content[language].footer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinalInvitation;