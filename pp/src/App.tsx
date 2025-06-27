import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import PromptExplanation from './components/PromptExplanation';
import AISimulation from './components/AISimulation';
import PingPongGame from './components/PingPongGame';
import LandingPageDemo from './components/LandingPageDemo';
import FinalInvitation from './components/FinalInvitation';

type Screen = 'welcome' | 'prompt' | 'ai-simulation' | 'ping-pong' | 'landing' | 'final';
type Choice = 'game' | 'landing' | null;
type Language = 'es' | 'en';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [userChoice, setUserChoice] = useState<Choice>(null);
  const [language, setLanguage] = useState<Language>('es');

  const navigateToScreen = (screen: Screen, choice?: Choice) => {
    if (choice) setUserChoice(choice);
    setCurrentScreen(screen);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen 
            onNext={() => navigateToScreen('prompt')} 
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        );
      case 'prompt':
        return (
          <PromptExplanation
            onChoice={(choice) => navigateToScreen('ai-simulation', choice)}
            language={language}
          />
        );
      case 'ai-simulation':
        return (
          <AISimulation
            choice={userChoice!}
            onComplete={() => navigateToScreen(userChoice === 'game' ? 'ping-pong' : 'landing')}
            language={language}
          />
        );
      case 'ping-pong':
        return (
          <PingPongGame 
            onComplete={() => navigateToScreen('final')} 
            language={language}
          />
        );
      case 'landing':
        return (
          <LandingPageDemo 
            onComplete={() => navigateToScreen('final')} 
            language={language}
          />
        );
      case 'final':
        return (
          <FinalInvitation 
            onRestart={() => navigateToScreen('welcome')} 
            language={language}
          />
        );
      default:
        return (
          <WelcomeScreen 
            onNext={() => navigateToScreen('prompt')} 
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="transition-all duration-500 ease-in-out">
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;