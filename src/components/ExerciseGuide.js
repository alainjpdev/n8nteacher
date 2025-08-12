import React, { useState } from 'react';

const ExerciseGuide = ({ exercise, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stepCompleted, setStepCompleted] = useState(false);

  // Pasos específicos para crear un workflow desde cero
  const steps = [
    {
      id: 1,
      title: "Presionar el botón '+'",
      description: "Presiona el botón '+' que se encuentra en el centro de la pantalla de n8n",
      hint: "Busca el botón blanco con el símbolo '+' en el centro del área de trabajo vacía"
    },
    {
      id: 2,
      title: "Seleccionar Manual Trigger",
      description: "En el panel lateral que aparece, busca la sección 'Triggers' y selecciona 'Manual Trigger'",
      hint: "El Manual Trigger permite ejecutar el workflow manualmente desde la interfaz de n8n"
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (!stepCompleted) {
      return; // No permitir avanzar si el paso no está completado
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setStepCompleted(false); // Reset para el siguiente paso
    } else {
      setIsCompleted(true);
      onComplete && onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setStepCompleted(false); // Reset cuando retrocede
    }
  };

  const handleConfirmStep = () => {
    setStepCompleted(true);
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🎯 {exercise?.title || 'Ejercicio Interactivo'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sigue los pasos para crear tu workflow desde cero
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Paso {currentStep + 1} de {steps.length}</span>
          <span>{Math.round(getProgressPercentage())}% completado</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Current Step */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
            {currentStep + 1}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {currentStepData.description}
            </p>
            
            {/* Estado del paso */}
            <div className={`mb-4 p-3 rounded-lg border-2 border-dashed ${
              stepCompleted 
                ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/10' 
                : 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full ${stepCompleted ? 'bg-green-500' : 'bg-red-400'}`}></div>
                <span className={`text-sm font-medium ${stepCompleted ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {stepCompleted ? '✅ Paso completado - Puedes continuar' : '🚫 Debes completar este paso antes de continuar'}
                </span>
              </div>
            </div>
            
                            {/* Visual guide for step 1 */}
                {currentStep === 0 && (
                  <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-center">
                      <div className="text-4xl mb-2 text-white">+</div>
                      <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                        Busca este botón blanco en el centro de la pantalla
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                        Es el primer paso para crear cualquier workflow en n8n
                      </p>
                    </div>
                  </div>
                )}

                {/* Visual guide for step 2 */}
                {currentStep === 1 && (
                  <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📋</div>
                      <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                        Aparecerá un panel lateral con categorías de nodos
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                        Busca la sección "Triggers" y selecciona "Manual Trigger"
                      </p>
                    </div>
                  </div>
                )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentStep === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          ← Anterior
        </button>

        <div className="flex space-x-2">
          {/* Botón para confirmar que el paso está completado */}
          <button
            onClick={handleConfirmStep}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              stepCompleted
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
            }`}
          >
            {stepCompleted ? '✅ Paso Confirmado' : '✅ Completé este paso'}
          </button>
          
          {/* Botón Siguiente - bloqueado hasta confirmar */}
          <button
            onClick={handleNext}
            disabled={!stepCompleted}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              stepCompleted
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-red-100 text-red-600 cursor-not-allowed dark:bg-red-900/20 dark:text-red-400 border-2 border-red-300 dark:border-red-700'
            }`}
          >
            {currentStep === steps.length - 1 ? 'Completar' : 'Siguiente →'}
            {!stepCompleted && ' (Bloqueado)'}
          </button>
        </div>
      </div>

      {/* Completion Message */}
      {isCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              ¡Ejercicio Completado!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Has creado exitosamente tu primer workflow en n8n. ¡Excelente trabajo!
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseGuide;
