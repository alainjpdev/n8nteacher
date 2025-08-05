import React from 'react';

const ChatFooter = ({ currentStep, instructions, isSpeaking }) => {
  return (
    <div className="p-4 border-t border-gray-700 bg-gray-800">
      <div className="text-center">
        <p className="text-sm text-gray-300">
          Ejercicio en progreso... {Math.round(((currentStep + 1) / instructions.length) * 100)}% completado
        </p>
        {isSpeaking && (
          <p className="text-xs text-blue-400 mt-1 animate-pulse">
            🔊 Reproduciendo audio...
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatFooter; 