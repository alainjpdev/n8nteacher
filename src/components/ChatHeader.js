import React, { useState, useEffect } from 'react';

const ChatHeader = ({ isSpeaking, onStopSpeaking, onTestAudio, n8nConnected, n8nLoading, onConnectN8n, isMonitoring, onToggleMonitoring, onReconnect }) => {
  const [showWorkflowSelector, setShowWorkflowSelector] = useState(false);
  const [workflowId, setWorkflowId] = useState('');
  const [targetWorkflowId, setTargetWorkflowId] = useState(null);

  // Get current target workflow from server
  useEffect(() => {
    const fetchTargetWorkflow = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/target-workflow');
        const data = await response.json();
        setTargetWorkflowId(data.targetWorkflowId);
      } catch (error) {
        console.error('Error fetching target workflow:', error);
      }
    };

    if (n8nConnected) {
      fetchTargetWorkflow();
    }
  }, [n8nConnected]);

  const selectWorkflow = async (workflowId) => {
    try {
      const response = await fetch('http://localhost:3001/api/target-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId: workflowId || null })
      });
      const data = await response.json();
      if (data.success) {
        setShowWorkflowSelector(false);
        setWorkflowId('');
        setTargetWorkflowId(data.targetWorkflowId);
        // Refresh the page or update state
        window.location.reload();
      }
    } catch (error) {
      console.error('Error selecting workflow:', error);
    }
  };

  const configureWebhook = async () => {
    if (!targetWorkflowId) {
      alert('Primero configura un workflow objetivo');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/configure-webhook/${targetWorkflowId}`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        alert('Webhook configurado exitosamente');
      } else {
        alert('Error configurando webhook');
      }
    } catch (error) {
      alert('Error configurando webhook');
    }
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Home Button */}
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300">
            🏠 Inicio
          </button>

          {/* Settings Button */}
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-600 text-white hover:bg-gray-700 transition-all duration-300">
            ⚙️ Configuración
          </button>

          {/* Audio Test Button */}
          <button 
            onClick={onTestAudio}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
          >
            🔊 Probar Audio
          </button>

          {/* Stop Speaking Button */}
          {isSpeaking && (
            <button 
              onClick={onStopSpeaking}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
            >
              ⏹️ Parar Audio
            </button>
          )}

          {/* n8n Connection Button */}
          <button 
            onClick={onConnectN8n}
            disabled={n8nLoading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
              n8nConnected 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            } ${n8nLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className={`w-2 h-2 rounded-full ${
              n8nConnected 
                ? 'bg-green-300 animate-pulse' 
                : 'bg-gray-300'
            }`}></div>
            <span>
              {n8nLoading ? 'Conectando...' : n8nConnected ? 'Conectado' : 'Conectar n8n'}
            </span>
          </button>

          {/* Workflow Selector Button */}
          <button 
            onClick={() => setShowWorkflowSelector(!showWorkflowSelector)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300"
          >
            📋 Configurar Workflow
          </button>

          {/* Configure Webhook Button */}
          {n8nConnected && targetWorkflowId && (
            <button 
              onClick={configureWebhook}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300"
            >
              🔗 Configurar Webhook
            </button>
          )}

          {/* Real-time Monitoring Button */}
          {n8nConnected && (
            <button 
              onClick={onToggleMonitoring}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                isMonitoring 
                  ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                isMonitoring 
                  ? 'bg-purple-300 animate-pulse' 
                  : 'bg-gray-300'
              }`}></div>
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>
                  {isMonitoring ? 'Monitoreando' : 'Monitorear'}
                </span>
              </span>
            </button>
          )}

          {/* Reconnect Button */}
          <button 
            onClick={onReconnect}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-600 text-white hover:bg-orange-700 transition-all duration-300 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reconectar</span>
          </button>
        </div>

        {/* Workflow Selector Modal */}
        {showWorkflowSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Configurar Workflow para Monitorear</h3>
                <button 
                  onClick={() => setShowWorkflowSelector(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ID del Workflow (opcional)
                  </label>
                  <input
                    type="text"
                    value={workflowId}
                    onChange={(e) => setWorkflowId(e.target.value)}
                    placeholder="Ej: 0o5pJ8V3SCYCNJnF"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Deja vacío para monitorear todos los workflows
                  </p>
                </div>
                
                <div className="text-sm text-gray-300">
                  <p className="mb-2"><strong>Instrucciones:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Para encontrar el ID del workflow, ve a tu instancia de n8n</li>
                    <li>Abre el workflow que quieres monitorear</li>
                    <li>El ID aparece en la URL: <code className="bg-gray-700 px-1 rounded">https://algorithmicsaischool.app.n8n.cloud/workflow/ID_DEL_WORKFLOW</code></li>
                    <li>Copia solo el ID (sin la URL completa)</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                <button 
                  onClick={() => selectWorkflow(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Monitorear Todos
                </button>
                <button 
                  onClick={() => selectWorkflow(workflowId)}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Configurar
                </button>
                <button 
                  onClick={() => setShowWorkflowSelector(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader; 