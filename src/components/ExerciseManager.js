import React, { useState } from 'react';

const ExerciseManager = ({ 
  exercises, 
  onAddExercise, 
  onRemoveExercise, 
  onUpdateExercise,
  onGenerateFromVideo 
}) => {
  const [newExercise, setNewExercise] = useState({
    title: '',
    content: '',
    duration: 8000,
    type: 'general',
    action: 'custom_action',
    difficulty: 'beginner'
  });

  const [isAdding, setIsAdding] = useState(false);

  const handleAddExercise = () => {
    if (newExercise.title && newExercise.content) {
      onAddExercise(newExercise);
      setNewExercise({
        title: '',
        content: '',
        duration: 8000,
        type: 'general',
        action: 'custom_action',
        difficulty: 'beginner'
      });
      setIsAdding(false);
    }
  };

  const handleVideoAnalysis = () => {
    const videoUrl = prompt('Ingresa la URL del video de YouTube:');
    if (videoUrl) {
      onGenerateFromVideo(videoUrl);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Gestor de Ejercicios Dinámicos</h3>
        <div className="space-x-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            {isAdding ? 'Cancelar' : '➕ Agregar Ejercicio'}
          </button>
          <button
            onClick={handleVideoAnalysis}
            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
          >
            🎬 Analizar Video
          </button>
        </div>
      </div>

      {/* Formulario para agregar ejercicio */}
      {isAdding && (
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <h4 className="text-white font-medium mb-3">Nuevo Ejercicio</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Título:</label>
              <input
                type="text"
                value={newExercise.title}
                onChange={(e) => setNewExercise(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-600 text-white rounded-md"
                placeholder="Ejercicio: Configurar credenciales"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Contenido:</label>
              <textarea
                value={newExercise.content}
                onChange={(e) => setNewExercise(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-600 text-white rounded-md"
                rows={3}
                placeholder="Descripción detallada del ejercicio..."
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Duración (ms):</label>
                <input
                  type="number"
                  value={newExercise.duration}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Tipo:</label>
                <select
                  value={newExercise.type}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded-md"
                >
                  <option value="general">General</option>
                  <option value="credentials">Credenciales</option>
                  <option value="workflow">Workflow</option>
                  <option value="testing">Testing</option>
                  <option value="monitoring">Monitoreo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Dificultad:</label>
                <select
                  value={newExercise.difficulty}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded-md"
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleAddExercise}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              ✅ Agregar Ejercicio
            </button>
          </div>
        </div>
      )}

      {/* Lista de ejercicios existentes */}
      <div className="space-y-2">
        <h4 className="text-white font-medium mb-2">Ejercicios Actuales ({exercises.length})</h4>
        {exercises.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay ejercicios configurados. Agrega tu primer ejercicio.</p>
        ) : (
          exercises.map((exercise, index) => (
            <div key={exercise.id} className="bg-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h5 className="text-white font-medium">{exercise.title}</h5>
                  <p className="text-gray-300 text-sm mt-1">{exercise.content}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                    <span>📊 {exercise.type}</span>
                    <span>⏱️ {exercise.duration}ms</span>
                    <span>🎯 {exercise.difficulty}</span>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveExercise(exercise.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExerciseManager;
