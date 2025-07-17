import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import LanguageSelector from '../components/ui/LanguageSelector';
import { useTranslation } from 'react-i18next';

export const Landing: React.FC = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: Brain,
      title: t('landing.featureAI'),
      description: t('landing.featureAIText')
    },
    {
      icon: Users,
      title: t('landing.featureClasses'),
      description: t('landing.featureClassesText')
    },
    {
      icon: Award,
      title: t('landing.featureCert'),
      description: t('landing.featureCertText')
    }
  ];

  const benefits = [
    t('landing.benefit1'),
    t('landing.benefit2'),
    t('landing.benefit3'),
    t('landing.benefit4'),
    t('landing.benefit5'),
    t('landing.benefit6')
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">Algorithmics AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Link 
                to="/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('login')}
              </Link>
              <Link to="/register">
                <Button>{t('register')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {t('landing.heroTitle1')}
              <span className="text-blue-600 block">{t('landing.heroTitle2')}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('landing.heroDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="flex items-center">
                  {t('landing.startNow')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                {t('landing.seeDemo')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('landing.featuresTitle')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('landing.featuresDescription')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('landing.benefitsTitle')}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('landing.benefitsDescription')}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('landing.startJourney')}</h3>
              <p className="text-gray-600 mb-6">
                {t('landing.registerNow')}
              </p>
              <Link to="/register">
                <Button size="lg" className="w-full">
                  {t('landing.registerFree')}
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-4 text-center">
                {t('landing.noCommitment')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">Algorithmics AI</span>
              </div>
              <p className="text-gray-400">
                La escuela líder en educación tecnológica para el futuro.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Programas</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Programación Básica</li>
                <li>Desarrollo Web</li>
                <li>Inteligencia Artificial</li>
                <li>Robótica</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre Nosotros</li>
                <li>Metodología</li>
                <li>Profesores</li>
                <li>Contacto</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Centro de Ayuda</li>
                <li>Términos de Uso</li>
                <li>Privacidad</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Algorithmics AI. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};