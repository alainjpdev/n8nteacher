import React, { useState } from 'react';

const ExerciseGuide = ({ exercise, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Pasos para crear un workflow desde cero
  const steps = [
    {
      id: 1,
      title: "Crear Nuevo Workflow",
      description: "Presiona el botón '+' (Add) que se encuentra al centro de la instancia de n8n",
      hint: "Busca el botón azul grande con el símbolo '+' en el centro del área de trabajo vacía",
      action: "click_add_button",
      expected: "workflow_created"
    },
    {
      id: 2,
      title: "Seleccionar Manual Trigger",
      description: "En el menú desplegable que aparece, busca y selecciona 'Manual Trigger'",
      hint: "El Manual Trigger suele estar en la primera sección llamada 'Triggers'. Es el trigger más básico",
      action: "select_manual_trigger",
      expected: "manual_trigger_added"
    },
    {
      id: 3,
      title: "Configurar el Trigger",
      description: "Configura el nombre del trigger y sus parámetros básicos",
      hint: "Puedes cambiar el nombre del nodo haciendo doble clic en él",
      action: "configure_trigger",
      expected: "trigger_configured"
    },
    {
      id: 4,
      title: "Agregar Nodo de Procesamiento",
      description: "Presiona el '+' que aparece al lado del Manual Trigger para agregar otro nodo",
      hint: "Busca el punto de conexión (círculo) en el lado derecho del Manual Trigger",
      action: "add_processing_node",
      expected: "processing_node_added"
    },
    {
      id: 5,
      title: "Seleccionar Tipo de Nodo",
      description: "Elige un nodo como 'Code' o 'HTTP Request' para procesar datos",
      hint: "Los nodos están organizados por categorías. 'Code' está en 'Core'",
      action: "select_node_type",
      expected: "node_type_selected"
    },
    {
      id: 6,
      title: "Conectar los Nodos",
      description: "Arrastra desde el punto de salida del Manual Trigger al punto de entrada del nuevo nodo",
      hint: "Haz clic y arrastra desde el círculo de salida al círculo de entrada",
      action: "connect_nodes",
      expected: "nodes_connected"
    },
    {
      id: 7,
      title: "Configurar el Nodo",
      description: "Configura los parámetros del nodo según el ejercicio",
      hint: "Haz doble clic en el nodo para abrir su configuración",
      action: "configure_node",
      expected: "node_configured"
    },
    {
      id: 8,
      title: "Probar el Workflow",
      description: "Presiona 'Execute Workflow' para probar tu creación",
      hint: "Busca el botón 'Execute Workflow' en la barra superior",
      action: "execute_workflow",
      expected: "workflow_executed"
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowHint(false);
    } else {
      setIsCompleted(true);
      onComplete && onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowHint(false);
    }
  };

  const handleHint = () => {
    setShowHint(!showHint);
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
            
            {/* Visual guide for step 1 */}
            {currentStep === 0 && (
              <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-center">
                  <div className="text-4xl mb-2">➕</div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    Busca este botón azul grande en el centro de la pantalla
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
                    Aparecerá un menú con categorías de nodos
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                    Busca la sección "Triggers" y selecciona "Manual Trigger"
                  </p>
                </div>
              </div>
            )}
            
            {/* Hint Section */}
            <div className="mt-4">
              <button
                onClick={handleHint}
                className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
              >
                💡 {showHint ? 'Ocultar pista' : 'Mostrar pista'}
              </button>
              {showHint && (
                <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    {currentStepData.hint}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Info */}
      {exercise && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            📋 Información del Ejercicio
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Duración:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{exercise.duration}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Dificultad:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{exercise.difficulty}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {exercise.description}
          </p>
        </div>
      )}

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
          <button
            onClick={handleHint}
            className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
          >
            💡 Pista
          </button>
          
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Completar' : 'Siguiente →'}
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
