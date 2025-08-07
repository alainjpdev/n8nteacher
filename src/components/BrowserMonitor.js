import React, { useState, useEffect, useRef } from 'react';

const BrowserMonitor = () => {
  const [browserStatus, setBrowserStatus] = useState({
    browser_running: false,
    monitoring: false,
    current_url: '',
    clients_connected: 0,
    actions_recorded: 0
  });
  
  const [learningProgress, setLearningProgress] = useState({
    current_step: 0,
    completed_steps: [],
    user_actions_in_step: []
  });
  
  const [screenshots, setScreenshots] = useState([]);
  const [actions, setActions] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  
  const websocketRef = useRef(null);
  const apiBaseUrl = 'http://localhost:3004';

  // Conectar WebSocket
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        websocketRef.current = new WebSocket('ws://localhost:3005');
        
        websocketRef.current.onopen = () => {
          console.log('✅ WebSocket conectado al monitor de navegador');
          setIsConnected(true);
          setError('');
        };
        
        websocketRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'screenshot') {
            setScreenshots(prev => [...prev.slice(-10), data.data]); // Mantener últimos 10
          } else if (data.type === 'user_action') {
            setActions(prev => [...prev.slice(-50), data.action]); // Mantener últimos 50
          }
        };
        
        websocketRef.current.onclose = () => {
          console.log('❌ WebSocket desconectado del monitor de navegador');
          setIsConnected(false);
        };
        
        websocketRef.current.onerror = (error) => {
          console.error('❌ Error en WebSocket:', error);
          setError('Error de conexión WebSocket');
        };
        
      } catch (error) {
        console.error('❌ Error conectando WebSocket:', error);
        setError('Error conectando al monitor de navegador');
      }
    };
    
    connectWebSocket();
    
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  // Cargar estado inicial
  useEffect(() => {
    fetchBrowserStatus();
    fetchLearningProgress();
  }, []);

  const fetchBrowserStatus = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/browser/status`);
      const data = await response.json();
      setBrowserStatus(data);
    } catch (error) {
      console.error('❌ Error obteniendo estado del navegador:', error);
      setError('Error obteniendo estado del navegador');
    }
  };

  const startBrowser = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/browser/start`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        fetchBrowserStatus();
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('❌ Error iniciando navegador:', error);
      setError('Error iniciando navegador');
    }
  };

  const stopBrowser = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/browser/stop`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        fetchBrowserStatus();
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('❌ Error cerrando navegador:', error);
      setError('Error cerrando navegador');
    }
  };

  const startMonitoring = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/browser/monitor/start`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        fetchBrowserStatus();
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('❌ Error iniciando monitoreo:', error);
      setError('Error iniciando monitoreo');
    }
  };

  const stopMonitoring = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/browser/monitor/stop`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        fetchBrowserStatus();
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('❌ Error deteniendo monitoreo:', error);
      setError('Error deteniendo monitoreo');
    }
  };

  const navigateTo = async (url) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/browser/navigate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        fetchBrowserStatus();
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('❌ Error navegando:', error);
      setError('Error navegando');
    }
  };

  const fetchLearningProgress = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/browser/learning/progress`);
      const data = await response.json();
      if (data.status === 'success') {
        setLearningProgress(data.progress);
      }
    } catch (error) {
      console.error('❌ Error obteniendo progreso de aprendizaje:', error);
    }
  };

  const setLearningStep = async (step) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/browser/learning/step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ step })
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        fetchLearningProgress();
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('❌ Error estableciendo paso de aprendizaje:', error);
      setError('Error estableciendo paso de aprendizaje');
    }
  };

  const checkStepCompletion = async (requirements) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/browser/learning/check-step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requirements })
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        return data.completion;
      } else {
        setError(data.message);
        return null;
      }
    } catch (error) {
      console.error('❌ Error verificando completitud del paso:', error);
      setError('Error verificando completitud del paso');
      return null;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">🎓 Monitor de Aprendizaje n8n</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm text-gray-300">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900 border border-red-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="flex-1">
              <h3 className="text-red-200 font-semibold">Error</h3>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Controles del navegador */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={startBrowser}
          disabled={browserStatus.browser_running}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🚀 Iniciar Navegador
        </button>
        
        <button
          onClick={stopBrowser}
          disabled={!browserStatus.browser_running}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ⏹️ Cerrar Navegador
        </button>
        
        <button
          onClick={startMonitoring}
          disabled={!browserStatus.browser_running || browserStatus.monitoring}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔍 Iniciar Monitoreo
        </button>
        
        <button
          onClick={stopMonitoring}
          disabled={!browserStatus.monitoring}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ⏸️ Detener Monitoreo
        </button>
      </div>

      {/* Estado del navegador */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Estado del Navegador</div>
          <div className="text-lg font-semibold text-white">
            {browserStatus.browser_running ? '🟢 Activo' : '🔴 Inactivo'}
          </div>
        </div>
        
        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Monitoreo</div>
          <div className="text-lg font-semibold text-white">
            {browserStatus.monitoring ? '🟢 Activo' : '🔴 Inactivo'}
          </div>
        </div>
        
        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Acciones Registradas</div>
          <div className="text-lg font-semibold text-white">
            {browserStatus.actions_recorded}
          </div>
        </div>
        
        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Clientes Conectados</div>
          <div className="text-lg font-semibold text-white">
            {browserStatus.clients_connected}
          </div>
        </div>
      </div>

      {/* URL actual */}
      {browserStatus.current_url && (
        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">URL Actual</div>
          <div className="text-white break-all">{browserStatus.current_url}</div>
        </div>
      )}

      {/* Control de Aprendizaje */}
      <div className="p-4 bg-gray-700 rounded-lg">
        <div className="text-sm text-gray-400 mb-2">📚 Control de Aprendizaje</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Paso Actual</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={learningProgress.current_step}
                onChange={(e) => setLearningStep(parseInt(e.target.value))}
                className="w-16 px-2 py-1 bg-gray-600 text-white rounded text-sm"
                min="0"
              />
              <button
                onClick={() => setLearningStep(learningProgress.current_step)}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Establecer
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-1">Verificar Paso</label>
            <button
              onClick={() => checkStepCompletion(['workflow_created', 'node_added', 'workflow_activated'])}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Verificar Completitud
            </button>
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-1">Progreso</label>
            <div className="text-sm text-white">
              Paso {learningProgress.current_step} • 
              {learningProgress.completed_steps.length} completados
            </div>
          </div>
        </div>
      </div>

      {/* Navegación rápida a n8n */}
      <div className="p-4 bg-gray-700 rounded-lg">
        <div className="text-sm text-gray-400 mb-2">🌐 Navegación n8n</div>
        <div className="flex flex-wrap gap-2">
          {[
            'http://localhost:5678',
            'http://localhost:5678/workflows',
            'http://localhost:5678/executions',
            'http://localhost:5678/settings'
          ].map(url => (
            <button
              key={url}
              onClick={() => navigateTo(url)}
              disabled={!browserStatus.browser_running}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {new URL(url).pathname || 'Dashboard'}
            </button>
          ))}
        </div>
      </div>

      {/* Screenshots */}
      {screenshots.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">📸 Screenshots Recientes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {screenshots.slice(-6).map((screenshot, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <img
                  src={`data:image/png;base64,${screenshot.screenshot}`}
                  alt="Screenshot"
                  className="w-full h-auto rounded"
                />
                <div className="mt-2 text-sm text-gray-300">
                  <div>{screenshot.title}</div>
                  <div className="text-xs text-gray-400">
                    {formatTimestamp(screenshot.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acciones del usuario */}
      {actions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">📝 Acciones del Usuario</h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {actions.slice(-20).reverse().map((action, index) => (
              <div key={index} className="p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-white">
                    {action.type.replace('_', ' ').toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTimestamp(action.timestamp)}
                  </div>
                </div>
                {action.data && (
                  <div className="mt-1 text-sm text-gray-300">
                    {action.data.url && <div>URL: {action.data.url}</div>}
                    {action.data.title && <div>Título: {action.data.title}</div>}
                    {action.data.from && <div>Desde: {action.data.from}</div>}
                    {action.data.to && <div>Hacia: {action.data.to}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowserMonitor;
