import React from 'react';
import { formatCurrency } from '../utils/calculations';

type Props = {
  monthlyIncome: number;
  annualIncome: number;
};

const ResultsDisplay: React.FC<Props> = ({ monthlyIncome, annualIncome }) => {
  return (
    <div className="mb-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <h3 className="text-gray-400 mb-2 text-sm font-medium">Monthly Income</h3>
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent">
            {formatCurrency(monthlyIncome)}
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-gray-400 mb-2 text-sm font-medium">Annual Income</h3>
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent">
            {formatCurrency(annualIncome)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;