import React from 'react';
import { EXPERIENCE_LEVELS } from '../constants';

type Props = {
  selectedExperience: string;
  onChange: (experienceId: string) => void;
};

const ExperienceSelector: React.FC<Props> = ({ selectedExperience, onChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-white text-xl mb-4 font-medium">Experience Level</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {EXPERIENCE_LEVELS.map((level) => (
          <button
            key={level.id}
            onClick={() => onChange(level.id)}
            className={`py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
              selectedExperience === level.id
                ? 'bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg shadow-purple-500/20'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="text-lg">{level.label}</div>
            <div className="text-sm opacity-80">{level.rate}€/h</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSelector;