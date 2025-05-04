import React from 'react';

const CallToAction: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-xl p-6 border border-purple-800/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(120,80,255,0.15),transparent)] pointer-events-none"></div>
      
      <h3 className="text-xl font-bold text-white mb-2">Want to maximize your income?</h3>
      <p className="text-gray-300 mb-4">Get personalized coaching to accelerate your career and increase your hourly rate.</p>
      
      <button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/20">
        Schedule a Free Consultation
      </button>
    </div>
  );
};

export default CallToAction;