import React, { useState, useEffect, useCallback } from 'react';

const ExerciseSelector = ({ onExerciseSelected, onClose }) => {
  const [exercises, setExercises] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('clase1');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Estructura de ejercicios por nivel
  const exerciseStructure = {
    clase1: [
      {
        id: 1,
        title: "Ejercicio 1: Introducción a los Triggers de n8n",
        content: "Los triggers son el punto de entrada de cualquier workflow en n8n. Son los que inician la automatización. En este ejercicio aprenderás los tipos básicos de triggers y cómo usarlos.",
        duration: 12000,
        type: 'triggers',
        action: 'introduction_triggers',
        difficulty: 'beginner',
        videoReference: null,
        timestamp: new Date().toISOString()
      }
    ],

  };

  const loadExercises = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simular carga de ejercicios desde la estructura
      const levelExercises = exerciseStructure[selectedLevel] || [];
      setExercises(levelExercises);
    } catch (error) {
      setError('Error cargando ejercicios: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedLevel]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  const selectExercise = async (exercise) => {
    try {
      console.log('🎯 Ejercicio seleccionado:', exercise.title);
      
      // En lugar de cargar un workflow predefinido, iniciamos la guía interactiva
      console.log('✅ Iniciando guía interactiva para:', exercise.title);
      onExerciseSelected(exercise);
    } catch (error) {
      console.error('❌ Error seleccionando ejercicio:', error);
      setError('Error iniciando ejercicio: ' + error.message);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getLevelInfo = (level) => {
    switch (level) {
      case 'clase1': return { title: 'Clase 1', description: 'Introducción a los Triggers de n8n' };
      default: return { title: 'Clase', description: 'Descripción' };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              📚 Seleccionar Ejercicio
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Elige un ejercicio para practicar con n8n
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

        {/* Level Selector */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            {Object.keys(exerciseStructure).map((level) => {
              const levelInfo = getLevelInfo(level);
              return (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedLevel === level
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {levelInfo.title}
                </button>
              );
            })}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {getLevelInfo(selectedLevel).description}
          </p>
        </div>

        {/* Exercise List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando ejercicios...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 dark:text-red-400 mb-2">❌ {error}</div>
              <button
                onClick={loadExercises}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Reintentar
              </button>
            </div>
          ) : exercises.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-600 dark:text-gray-400">
                No hay ejercicios disponibles para este nivel
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
                  onClick={() => selectExercise(exercise)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {exercise.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {exercise.content || exercise.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                          {exercise.difficulty}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ⏱️ {typeof exercise.duration === 'number' ? `${Math.round(exercise.duration / 1000)}s` : exercise.duration}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Seleccionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            💡 <strong>Consejo:</strong> Los ejercicios se cargan automáticamente en n8n para que puedas practicar paso a paso.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSelector;
