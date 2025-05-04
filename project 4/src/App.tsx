import React from 'react';
import IncomeCalculator from './components/IncomeCalculator';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(120,80,255,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(80,120,255,0.15),transparent_50%)] pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            ALGORITHMICS 585 
          </h1>
          <p>Calculate Your Income</p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Find out how much you can earn as a software developer in Spain based on your experience level and working hours.
          </p>
        </div>
        
        <IncomeCalculator />
        
        <div className="text-center mt-8 text-gray-500 text-sm">
          © 2025 Spain Dev Calculator | Rates are estimates based on market averages
        </div>
      </div>
    </div>
  );
}

export default App;