import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import LanguageSelector from '../components/ui/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../hooks/useDarkMode';
import { Moon, Sun } from 'lucide-react';

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

  const [dark, setDark] = useDarkMode();

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-panel shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="ml-3 text-2xl font-bold text-text">Algorithmics AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Link 
                to="/login"
                className="text-text-secondary hover:text-text transition-colors"
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
      <section className="py-20 bg-panel border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-text mb-6">
              {t('landing.heroTitle1')}
              <span className="text-primary block">{t('landing.heroTitle2')}</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
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
            <h2 className="text-3xl font-bold text-text mb-4">
              {t('landing.featuresTitle')}
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {t('landing.featuresDescription')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-border hover:shadow-lg transition-shadow bg-panel">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-panel border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-text mb-6">
                {t('landing.benefitsTitle')}
              </h2>
              <p className="text-lg text-text-secondary mb-8">
                {t('landing.benefitsDescription')}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                    <span className="text-text-secondary">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-bg p-8 rounded-lg shadow-lg border border-border">
              <h3 className="text-2xl font-bold text-text mb-4">{t('landing.startJourney')}</h3>
              <p className="text-text-secondary mb-6">
                {t('landing.registerNow')}
              </p>
              <Link to="/register">
                <Button size="lg" className="w-full">
                  {t('landing.registerFree')}
                </Button>
              </Link>
              <p className="text-sm text-text-secondary mt-4 text-center">
                {t('landing.noCommitment')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-panel text-text py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="ml-2 text-xl font-bold">Algorithmics AI</span>
              </div>
              <p className="text-text-secondary">
                La escuela líder en educación tecnológica para el futuro.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Programas</h3>
              <ul className="space-y-2 text-text-secondary">
                <li>Programación Básica</li>
                <li>Desarrollo Web</li>
                <li>Inteligencia Artificial</li>
                <li>Robótica</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-text-secondary">
                <li>Sobre Nosotros</li>
                <li>Metodología</li>
                <li>Profesores</li>
                <li>Contacto</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-text-secondary">
                <li>Centro de Ayuda</li>
                <li>Términos de Uso</li>
                <li>Privacidad</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-text-secondary">
            <p>&copy; 2024 Algorithmics AI. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};