import React, { useState, useEffect } from 'react';

const WorkflowSelector = ({ onWorkflowSelected, onClose, apiConfig }) => {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Pequeña demora para asegurar que la configuración del backend esté lista
    const timer = setTimeout(() => {
      fetchWorkflows();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const fetchWorkflows = async () => {
    setIsLoading(true);
    setError('');

    try {
      console.log('📋 Solicitando lista de workflows...');
      const response = await fetch('http://localhost:3001/api/workflows/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      console.log('📋 Respuesta del servidor:', { status: response.status, result });

      if (response.ok && result.success) {
        setWorkflows(result.workflows || []);
        console.log(`✅ ${result.workflows?.length || 0} workflows encontrados`);
        
        // Si hay un workflow guardado previamente, seleccionarlo
        const savedWorkflowId = localStorage.getItem('selected_workflow_id');
        if (savedWorkflowId && result.workflows.find(w => w.id === savedWorkflowId)) {
          setSelectedWorkflow(savedWorkflowId);
        }
      } else {
        // Si hay un error que indica que necesita configuración, mostrar mensaje específico
        if (result.needsConfig) {
          throw new Error('API de n8n no configurada. Por favor configura tu token de API primero.');
        } else {
          throw new Error(result.error || 'Error al obtener workflows');
        }
      }
    } catch (error) {
      setError(error.message);
      console.error('❌ Error obteniendo workflows:', error);
      
      // Si es un error de configuración, sugerir cerrar el selector
      if (error.message.includes('API de n8n no configurada') || error.message.includes('Token de API inválido')) {
        console.log('💡 Sugerencia: Cerrar WorkflowSelector debido a problema de configuración');
      }
    }

    setIsLoading(false);
  };

  const handleWorkflowSelect = () => {
    if (!selectedWorkflow) {
      setError('Por favor selecciona un workflow');
      return;
    }

    const workflow = workflows.find(w => w.id === selectedWorkflow);
    if (!workflow) {
      setError('Workflow no encontrado');
      return;
    }

    // Guardar selección
    localStorage.setItem('selected_workflow_id', selectedWorkflow);
    localStorage.setItem('selected_workflow_name', workflow.name);

    // Notificar al componente padre
    onWorkflowSelected({
      id: selectedWorkflow,
      name: workflow.name,
      active: workflow.active
    });
  };

  const formatLastUpdate = (updatedAt) => {
    if (!updatedAt) return 'Nunca';
    
    const date = new Date(updatedAt);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Hace un momento';
    if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
    if (diffMinutes < 1440) return `Hace ${Math.floor(diffMinutes / 60)} h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              🎯 Seleccionar Workflow a Monitorear
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Instrucciones:</strong> Selecciona el workflow que quieres monitorear en tiempo real. 
              El sistema detectará automáticamente cambios en nodos, conexiones y ejecuciones.
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600 dark:text-gray-400">Cargando workflows...</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200 rounded-md text-sm">
              ❌ {error}
              <button 
                onClick={fetchWorkflows}
                className="ml-2 text-red-600 dark:text-red-400 underline hover:no-underline"
              >
                Reintentar
              </button>
            </div>
          )}

          {!isLoading && workflows.length === 0 && !error && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No hay workflows disponibles en tu instancia de n8n.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Ve a <a href="http://localhost:5678" target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 dark:text-blue-400 underline">
                  n8n
                </a> y crea tu primer workflow.
              </p>
            </div>
          )}

          {!isLoading && workflows.length > 0 && (
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Workflows disponibles ({workflows.length}):
                </label>
                <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md">
                  {workflows.map((workflow) => (
                    <label
                      key={workflow.id}
                      className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 last:border-b-0 ${
                        selectedWorkflow === workflow.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="workflow"
                        value={workflow.id}
                        checked={selectedWorkflow === workflow.id}
                        onChange={(e) => setSelectedWorkflow(e.target.value)}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {workflow.name}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              workflow.active 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' 
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {workflow.active ? '🟢 Activo' : '⚪ Inactivo'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {workflow.nodes?.length || 0} nodos
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          ID: {workflow.id} • Actualizado: {formatLastUpdate(workflow.updatedAt)}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {selectedWorkflow && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 dark:text-green-400">✅</span>
                    <span className="text-sm text-green-800 dark:text-green-200">
                      <strong>Workflow seleccionado:</strong> {workflows.find(w => w.id === selectedWorkflow)?.name}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleWorkflowSelect}
                  disabled={!selectedWorkflow}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🎯 Comenzar Monitoreo
                </button>
                
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowSelector;