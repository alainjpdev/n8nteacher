import React, { useState, useEffect, useCallback } from 'react';
import n8nMCPService from '../services/n8nMCP';

const N8nWorkflowStatus = ({ currentWorkflow, onWorkflowUpdate }) => {
  const [workflows, setWorkflows] = useState([]);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Load workflows on component mount
  const loadWorkflows = useCallback(async () => {
    setIsLoading(true);
    try {
      const workflowsData = await n8nMCPService.getWorkflows();
      setWorkflows(workflowsData.data || []);
    } catch (err) {
      setError('Failed to load workflows');
      console.error('n8n MCP Load Workflows Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadExecutionHistory = useCallback(async () => {
    if (!currentWorkflow) return;
    
    try {
      const history = await n8nMCPService.getExecutionHistory(currentWorkflow.id);
      setExecutionHistory(history.data || []);
    } catch (err) {
      console.error('n8n MCP Load History Error:', err);
    }
  }, [currentWorkflow]);

  useEffect(() => {
    if (currentWorkflow) {
      loadWorkflows();
      loadExecutionHistory();
    }
  }, [currentWorkflow, loadWorkflows, loadExecutionHistory]);

  const executeWorkflow = async () => {
    if (!currentWorkflow) return;
    
    setIsLoading(true);
    try {
      const testData = {
        email: 'test@example.com',
        nombre: 'Usuario de Prueba',
        timestamp: new Date().toISOString()
      };
      
      const result = await n8nMCPService.executeWorkflow(currentWorkflow.id, testData);
      console.log('n8n MCP: Workflow executed:', result);
      
      // Reload execution history
      await loadExecutionHistory();
      
      if (onWorkflowUpdate) {
        onWorkflowUpdate(result);
      }
    } catch (err) {
      setError('Failed to execute workflow');
      console.error('n8n MCP Execute Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openInN8n = () => {
    if (currentWorkflow) {
      window.open(`https://algorithmicsaischool.app.n8n.cloud/workflow/${currentWorkflow.id}`, '_blank');
    }
  };

  return (
    <div className="h-full bg-gray-800 rounded-lg p-6 border border-gray-700 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">n8n MCP Dashboard</h3>
          <p className="text-sm text-gray-400">Control de Workflows</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={executeWorkflow}
            disabled={isLoading || !currentWorkflow}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b border-white"></div>
                <span>Ejecutando...</span>
              </div>
            ) : (
              'Ejecutar Workflow'
            )}
          </button>
          <button
            onClick={openInN8n}
            disabled={!currentWorkflow}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Abrir en n8n
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg text-sm">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="flex-1 space-y-6 overflow-y-auto">
        {currentWorkflow ? (
          <>
            {/* Current Workflow Info */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-200 mb-3">Workflow Activo</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Nombre:</span>
                  <span className="text-white font-medium">{currentWorkflow.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">ID:</span>
                  <span className="text-white font-mono text-sm">{currentWorkflow.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Estado:</span>
                  <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-medium">
                    Activo
                  </span>
                </div>
              </div>
            </div>

            {/* Execution History */}
            {executionHistory.length > 0 && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-200 mb-3">Historial de Ejecuciones</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {executionHistory.slice(0, 8).map((execution, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-600 rounded">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          execution.finished ? 'bg-green-400' : 'bg-yellow-400'
                        }`}></div>
                        <span className="text-gray-300 text-sm">
                          {new Date(execution.startedAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        execution.finished ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                      }`}>
                        {execution.finished ? 'Completado' : 'En progreso'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Workflows */}
            {workflows.length > 0 && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-200 mb-3">Workflows Disponibles</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {workflows.slice(0, 5).map((workflow, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-600 rounded">
                      <span className="text-white text-sm truncate">{workflow.name}</span>
                      <span className="text-gray-400 text-xs font-mono">{workflow.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No hay workflow activo</h3>
            <p className="text-gray-500 text-sm">Los ejercicios crearán workflows automáticamente</p>
            <p className="text-gray-600 text-xs mt-2">Esperando instrucciones...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default N8nWorkflowStatus; 