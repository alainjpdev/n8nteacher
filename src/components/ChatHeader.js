import React from 'react';

const ChatHeader = ({ isSpeaking, onStopSpeaking, onTestAudio, n8nConnected, n8nLoading, onConnectN8n, isMonitoring, onToggleMonitoring, onReconnect, apiConfigured, onOpenApiConfig, workflowConfigured, selectedWorkflow, onOpenWorkflowSelector }) => {
  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">


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

          {/* Real-time Monitoring Button */}
          {n8nConnected && workflowConfigured && (
            <button 
              onClick={onToggleMonitoring}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                isMonitoring 
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                isMonitoring 
                  ? 'bg-green-300 animate-pulse' 
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

          {/* API Configuration Button */}
          <button 
            onClick={onOpenApiConfig}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
              apiConfigured 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-yellow-600 text-white hover:bg-yellow-700 animate-pulse'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>
              {apiConfigured ? 'Configurar API' : '⚠️ Configurar API'}
            </span>
          </button>

          {/* Workflow Selection Button */}
          {apiConfigured && (
            <button 
              onClick={onOpenWorkflowSelector}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                workflowConfigured 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-yellow-600 text-white hover:bg-yellow-700 animate-pulse'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>
                {workflowConfigured ? (
                  <span className="flex items-center space-x-1">
                    <span>🎯</span>
                    <span className="max-w-32 truncate">{selectedWorkflow?.name || 'Workflow'}</span>
                  </span>
                ) : (
                  '⚠️ Seleccionar Workflow'
                )}
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
      </div>
    </div>
  );
};

export default ChatHeader; 