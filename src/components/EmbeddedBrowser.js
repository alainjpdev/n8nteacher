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
    
    // Auto-start browser if not running
    if (browserStatus === 'stopped') {
      setTimeout(() => {
        startBrowser();
      }, 1000);
    }
    
    // Poll status every 10 seconds to reduce server load
    const interval = setInterval(checkBrowserStatus, 10000);
    
    return () => clearInterval(interval);
  }, [browserStatus]);



  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header - OCULTO */}
      {/* <div className="bg-gray-800 p-4 border-b border-gray-700">
        ... header content ...
      </div> */}

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
        
        {/* Mini logs panel at bottom - OCULTO */}
        {/* {logs.length > 0 && (
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
        )} */}
      </div>
    </div>
  );
};

export default EmbeddedBrowser;
