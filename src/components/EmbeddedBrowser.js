import React, { useState, useEffect, useRef } from 'react';

const EmbeddedBrowser = () => {
  const [browserStatus, setBrowserStatus] = useState('stopped');
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);
  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const checkBrowserStatus = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/browser/status');
      const data = await response.json();
      setBrowserStatus(data.status || (data.running ? 'running' : 'stopped'));
      if (data.output) {
        setLogs(data.output);
      }
    } catch (error) {
      console.error('Error checking browser status:', error);
      setError('No se puede conectar al servidor del browser embebido');
    }
  };

  const startBrowser = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5001/api/browser/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBrowserStatus('starting');
        // Poll status until running
        const pollInterval = setInterval(async () => {
          await checkBrowserStatus();
          if (browserStatus === 'running') {
            clearInterval(pollInterval);
            setIsLoading(false);
          }
        }, 1000);
      } else {
        setError(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      setError('Error iniciando el browser');
      setIsLoading(false);
    }
  };

  const stopBrowser = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/browser/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBrowserStatus('stopped');
        setLogs([]);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error deteniendo el browser');
    }
  };

  const refreshLogs = async () => {
    await checkBrowserStatus();
  };

  useEffect(() => {
    // Check status on component mount
    checkBrowserStatus();
    
    // Poll status every 10 seconds to reduce server load
    const interval = setInterval(checkBrowserStatus, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">🌐 Browser Embebido - n8n</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                browserStatus === 'running' ? 'bg-green-500' : 
                browserStatus === 'starting' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm">
                {browserStatus === 'running' ? 'Ejecutando' : 
                 browserStatus === 'starting' ? 'Iniciando...' : 'Detenido'}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={startBrowser}
                disabled={isLoading || browserStatus === 'running'}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isLoading || browserStatus === 'running'
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isLoading ? '⏳ Iniciando...' : '▶️ Iniciar'}
              </button>
              
              <button
                onClick={stopBrowser}
                disabled={browserStatus === 'stopped'}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  browserStatus === 'stopped'
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                ⏹️ Detener
              </button>
              
              <button
                onClick={refreshLogs}
                className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
              >
                🔄 Actualizar
              </button>
              
              <button
                onClick={() => window.open('http://localhost:5678/workflow/PEiPnfWFWwk17oKy', '_blank')}
                className="px-4 py-2 rounded-md text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white"
                title="Abrir workflow en nueva pestaña"
              >
                🔗 Abrir Workflow
              </button>
              
              <button
                onClick={async () => {
                  try {
                    await fetch('http://localhost:5001/api/browser/clear-logs', { method: 'POST' });
                    setLogs([]);
                  } catch (error) {
                    console.error('Error limpiando logs:', error);
                  }
                }}
                className="px-4 py-2 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white"
                title="Limpiar logs"
              >
                🧹 Limpiar
              </button>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-2 p-2 bg-red-900 border border-red-700 rounded-md text-red-200">
            ❌ {error}
          </div>
        )}
        
        {/* Info sobre browser embebido */}
        <div className="mt-2 p-2 bg-green-900 border border-green-700 rounded-md text-green-200 text-xs">
          ✅ <strong>Browser Embebido:</strong> No se abre Chrome externo. El monitoreo se realiza directamente en el iframe. 
          Los logs muestran la actividad simulada del sistema de monitoreo.
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="h-full bg-white rounded-lg overflow-hidden border border-gray-600">
          {browserStatus === 'running' ? (
                          <iframe
                ref={iframeRef}
                src="http://localhost:5678/workflow/PEiPnfWFWwk17oKy"
                className="w-full h-full border-0"
                title="n8n Browser"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-storage-access-by-user-activation"
                allow="fullscreen; microphone; camera; geolocation"
                onLoad={() => {
                  console.log('🌐 n8n iframe cargado correctamente - Workflow directo');
                }}
                onError={(e) => {
                  console.error('❌ Error cargando iframe:', e);
                  setError('Error cargando n8n en el iframe');
                }}
              />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100 text-gray-600">
              <div className="text-center">
                <div className="text-6xl mb-4">🌐</div>
                <h3 className="text-xl font-semibold mb-2">Browser no iniciado</h3>
                <p className="text-gray-500">
                  Haz clic en "Iniciar" para comenzar el monitoreo de n8n
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Mini logs panel at bottom */}
        {logs.length > 0 && (
          <div className="mt-2 bg-gray-800 rounded-lg p-2 max-h-20 overflow-y-auto">
            <div className="text-xs text-gray-400 mb-1">📊 Últimos logs:</div>
            <div className="space-y-1">
              {logs.slice(-3).map((log, index) => (
                <div key={index} className="text-xs text-gray-300 truncate">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbeddedBrowser;
