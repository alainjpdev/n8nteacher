import React, { useState, useEffect, useRef } from 'react';

const VectorizedDataCollector = () => {
  const [collectorStatus, setCollectorStatus] = useState({
    browser_running: false,
    monitoring: false,
    db_connected: false,
    session_id: '',
    total_samples: 0,
    teaching_moments: 0,
    error_patterns: 0,
    success_patterns: 0
  });
  
  const [userFlow, setUserFlow] = useState({
    step: 'ready', // ready, browser_opening, login_detected, token_extracted, completed
    n8n_token: '',
    login_detected: false,
    current_url: '',
    extracted_data: {}
  });
  
  const [dbStats, setDbStats] = useState({
    total_sessions: 0,
    total_records: 0,
    last_session: null
  });
  
  const [recentData, setRecentData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const apiBaseUrl = 'http://localhost:3004';

  // Cargar estado inicial
  useEffect(() => {
    fetchCollectorStatus();
    fetchDatabaseStats();
  }, []);

  const fetchCollectorStatus = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/vectorized/status`);
      const data = await response.json();
      setCollectorStatus(data);
    } catch (error) {
      console.error('❌ Error obteniendo estado del recolector:', error);
      setError('Error obteniendo estado del recolector');
    }
  };

  const fetchDatabaseStats = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/vectorized/db-stats`);
      const data = await response.json();
      setDbStats(data);
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de DB:', error);
    }
  };

  // === NUEVO: FLUJO COMPLETO DEL USUARIO ===

  const startUserFlow = async () => {
    try {
      setLoading(true);
      setUserFlow(prev => ({ ...prev, step: 'browser_opening' }));
      
      // 1. Abrir navegador
      const browserResponse = await fetch(`${apiBaseUrl}/api/vectorized/start-browser`, {
        method: 'POST'
      });
      const browserData = await browserResponse.json();
      
      if (browserData.status === 'success') {
        setUserFlow(prev => ({ ...prev, step: 'browser_opened' }));
        
        // 2. Iniciar recolección
        const collectionResponse = await fetch(`${apiBaseUrl}/api/vectorized/start-collection`, {
          method: 'POST'
        });
        const collectionData = await collectionResponse.json();
        
        if (collectionData.status === 'success') {
          setUserFlow(prev => ({ ...prev, step: 'monitoring_started' }));
          
          // 3. Iniciar monitoreo de login
          startLoginMonitoring();
          
          fetchCollectorStatus();
          setError('');
        } else {
          setError('Error iniciando recolección');
        }
      } else {
        setError('Error abriendo navegador');
      }
    } catch (error) {
      console.error('❌ Error en flujo de usuario:', error);
      setError('Error en flujo de usuario');
    } finally {
      setLoading(false);
    }
  };

  const startLoginMonitoring = () => {
    // Monitorear cambios en tiempo real
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/vectorized/current-status`);
        const data = await response.json();
        
        if (data.current_url) {
          setUserFlow(prev => ({ ...prev, current_url: data.current_url }));
          
          // Detectar login
          if (data.current_url.includes('signin') || data.current_url.includes('login')) {
            setUserFlow(prev => ({ ...prev, step: 'login_detected' }));
          }
          
          // Detectar que está en n8n después del login
          if (data.current_url.includes('localhost:5678') && !data.current_url.includes('signin')) {
            setUserFlow(prev => ({ ...prev, step: 'in_n8n' }));
            
            // Extraer token
            extractN8nToken();
          }
        }
      } catch (error) {
        console.error('Error monitoreando:', error);
      }
    }, 2000);
    
    // Limpiar intervalo después de 5 minutos
    setTimeout(() => clearInterval(interval), 300000);
  };

  const extractN8nToken = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/vectorized/extract-token`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.status === 'success' && data.token) {
        setUserFlow(prev => ({ 
          ...prev, 
          step: 'token_extracted',
          n8n_token: data.token,
          extracted_data: data.extracted_data || {}
        }));
      }
    } catch (error) {
      console.error('Error extrayendo token:', error);
    }
  };

  const copyTokenToClipboard = () => {
    if (userFlow.n8n_token) {
      navigator.clipboard.writeText(userFlow.n8n_token);
      alert('✅ Token copiado al portapapeles');
    }
  };

  // === FUNCIONES ORIGINALES ===

  const startBrowser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/api/vectorized/start-browser`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        fetchCollectorStatus();
        setError('');
      } else {
        setError(data.message || 'Error iniciando navegador');
      }
    } catch (error) {
      console.error('❌ Error iniciando navegador:', error);
      setError('Error iniciando navegador');
    } finally {
      setLoading(false);
    }
  };

  const stopBrowser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/api/vectorized/stop-browser`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        fetchCollectorStatus();
        setError('');
      } else {
        setError(data.message || 'Error cerrando navegador');
      }
    } catch (error) {
      console.error('❌ Error cerrando navegador:', error);
      setError('Error cerrando navegador');
    } finally {
      setLoading(false);
    }
  };

  const startDataCollection = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/api/vectorized/start-collection`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        fetchCollectorStatus();
        setError('');
      } else {
        setError(data.message || 'Error iniciando recolección');
      }
    } catch (error) {
      console.error('❌ Error iniciando recolección:', error);
      setError('Error iniciando recolección');
    } finally {
      setLoading(false);
    }
  };

  const stopDataCollection = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/api/vectorized/stop-collection`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        fetchCollectorStatus();
        setError('');
      } else {
        setError(data.message || 'Error deteniendo recolección');
      }
    } catch (error) {
      console.error('❌ Error deteniendo recolección:', error);
      setError('Error deteniendo recolección');
    } finally {
      setLoading(false);
    }
  };

  const getDbSummary = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/vectorized/db-summary`);
      const data = await response.json();
      setCollectorStatus(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('❌ Error obteniendo resumen de DB:', error);
      setError('Error obteniendo resumen de DB');
    }
  };

  const trainModels = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/api/vectorized/train-models`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setError('');
        alert('✅ Modelos entrenados exitosamente');
      } else {
        setError(data.message || 'Error entrenando modelos');
      }
    } catch (error) {
      console.error('❌ Error entrenando modelos:', error);
      setError('Error entrenando modelos');
    } finally {
      setLoading(false);
    }
  };

  const getRecentData = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/vectorized/recent-data`);
      const data = await response.json();
      setRecentData(data.recent_data || []);
    } catch (error) {
      console.error('❌ Error obteniendo datos recientes:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES');
  };

  const getStepIcon = (step) => {
    const icons = {
      ready: '🎯',
      browser_opening: '🚀',
      browser_opened: '✅',
      monitoring_started: '📊',
      login_detected: '🔐',
      in_n8n: '🌐',
      token_extracted: '🎉',
      completed: '🏆'
    };
    return icons[step] || '⏳';
  };

  const getStepDescription = (step) => {
    const descriptions = {
      ready: 'Listo para iniciar',
      browser_opening: 'Abriendo navegador...',
      browser_opened: 'Navegador abierto',
      monitoring_started: 'Monitoreando acciones...',
      login_detected: 'Login detectado',
      in_n8n: 'Dentro de n8n',
      token_extracted: 'Token extraído',
      completed: 'Completado'
    };
    return descriptions[step] || 'Procesando...';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">📊 Recolector de Datos Vectorizados</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={startBrowser}
            disabled={collectorStatus.browser_running || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? '⏳' : '🌐'} Abrir Browser
          </button>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${collectorStatus.db_connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm text-gray-300">
              {collectorStatus.db_connected ? 'DB Conectada' : 'DB Desconectada'}
            </span>
          </div>
        </div>
      </div>

      {/* Botón principal prominente */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-center">
        <h3 className="text-2xl font-bold text-white mb-4">🚀 Control del Navegador</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={startBrowser}
            disabled={collectorStatus.browser_running || loading}
            className="px-6 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold shadow-lg"
          >
            {loading ? '⏳' : '🌐'} Abrir Browser
          </button>
          
          <button
            onClick={startDataCollection}
            disabled={!collectorStatus.browser_running || collectorStatus.monitoring || loading}
            className="px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold shadow-lg"
          >
            {loading ? '⏳' : '📊'} Iniciar Recolección
          </button>
          
          <button
            onClick={stopBrowser}
            disabled={!collectorStatus.browser_running || loading}
            className="px-6 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold shadow-lg"
          >
            {loading ? '⏳' : '⏹️'} Cerrar Browser
          </button>
        </div>
        <p className="text-blue-100 text-sm mt-4">
          Estado: {collectorStatus.browser_running ? '🟢 Activo' : '🔴 Inactivo'} | 
          Recolección: {collectorStatus.monitoring ? '🟢 Activa' : '🔴 Inactiva'}
        </p>
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

      {/* === NUEVO: FLUJO DEL USUARIO === */}
      <div className="p-6 bg-blue-900 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">🎯 Flujo Completo del Usuario</h3>
        
        {/* Estado del flujo */}
        <div className="mb-4 p-4 bg-blue-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getStepIcon(userFlow.step)}</span>
            <div>
              <div className="text-white font-medium">{getStepDescription(userFlow.step)}</div>
              {userFlow.current_url && (
                <div className="text-blue-300 text-sm">URL: {userFlow.current_url}</div>
              )}
            </div>
          </div>
        </div>

        {/* Botones principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={startUserFlow}
            disabled={loading || userFlow.step !== 'ready'}
            className="px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
          >
            {loading ? '⏳ Procesando...' : '🚀 Iniciar Flujo Completo'}
          </button>
          
          <button
            onClick={startBrowser}
            disabled={collectorStatus.browser_running || loading}
            className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
          >
            {loading ? '⏳' : '🌐'} Solo Abrir Browser
          </button>
        </div>

        {/* Token extraído */}
        {userFlow.n8n_token && (
          <div className="mt-4 p-4 bg-green-900 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-200 font-medium">🎉 Token n8n Extraído</div>
                <div className="text-green-300 text-sm font-mono break-all">
                  {userFlow.n8n_token.substring(0, 50)}...
                </div>
              </div>
              <button
                onClick={copyTokenToClipboard}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                📋 Copiar
              </button>
            </div>
          </div>
        )}

        {/* Datos extraídos */}
        {Object.keys(userFlow.extracted_data).length > 0 && (
          <div className="mt-4 p-4 bg-purple-900 rounded-lg">
            <div className="text-purple-200 font-medium mb-2">📊 Datos Extraídos</div>
            <div className="text-purple-300 text-sm">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(userFlow.extracted_data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Controles principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={startBrowser}
          disabled={collectorStatus.browser_running || loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳' : '🚀'} Iniciar Navegador
        </button>
        
        <button
          onClick={stopBrowser}
          disabled={!collectorStatus.browser_running || loading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳' : '⏹️'} Cerrar Navegador
        </button>
        
        <button
          onClick={startDataCollection}
          disabled={!collectorStatus.browser_running || collectorStatus.monitoring || loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳' : '📊'} Iniciar Recolección
        </button>
        
        <button
          onClick={stopDataCollection}
          disabled={!collectorStatus.monitoring || loading}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳' : '⏸️'} Detener Recolección
        </button>
      </div>

      {/* Estado del recolector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Estado del Navegador</div>
          <div className="text-lg font-semibold text-white">
            {collectorStatus.browser_running ? '🟢 Activo' : '🔴 Inactivo'}
          </div>
        </div>
        
        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Recolección</div>
          <div className="text-lg font-semibold text-white">
            {collectorStatus.monitoring ? '🟢 Activa' : '🔴 Inactiva'}
          </div>
        </div>
        
        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Muestras Totales</div>
          <div className="text-lg font-semibold text-white">
            {collectorStatus.total_samples}
          </div>
        </div>
        
        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Sesión ID</div>
          <div className="text-sm font-semibold text-white">
            {collectorStatus.session_id || 'N/A'}
          </div>
        </div>
      </div>

      {/* Estadísticas de la base de datos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Sesiones Totales</div>
          <div className="text-lg font-semibold text-white">
            {dbStats.total_sessions}
          </div>
        </div>
        
        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Registros Totales</div>
          <div className="text-lg font-semibold text-white">
            {dbStats.total_records}
          </div>
        </div>
        
        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Última Sesión</div>
          <div className="text-sm font-semibold text-white">
            {dbStats.last_session ? formatTimestamp(dbStats.last_session) : 'N/A'}
          </div>
        </div>
      </div>

      {/* Contadores de patrones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-900 rounded-lg">
          <div className="text-sm text-blue-300">Momentos de Enseñanza</div>
          <div className="text-lg font-semibold text-white">
            {collectorStatus.teaching_moments}
          </div>
        </div>
        
        <div className="p-4 bg-red-900 rounded-lg">
          <div className="text-sm text-red-300">Patrones de Error</div>
          <div className="text-lg font-semibold text-white">
            {collectorStatus.error_patterns}
          </div>
        </div>
        
        <div className="p-4 bg-green-900 rounded-lg">
          <div className="text-sm text-green-300">Patrones de Éxito</div>
          <div className="text-lg font-semibold text-white">
            {collectorStatus.success_patterns}
          </div>
        </div>
      </div>

      {/* Acciones adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={getDbSummary}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          📊 Obtener Resumen DB
        </button>
        
        <button
          onClick={getRecentData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          📋 Datos Recientes
        </button>
        
        <button
          onClick={trainModels}
          disabled={loading}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳' : '🤖'} Entrenar Modelos
        </button>
      </div>

      {/* Datos recientes */}
      {recentData.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">📋 Datos Recientes</h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {recentData.slice(-10).reverse().map((data, index) => (
              <div key={index} className="p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-white">
                    {data.interaction_type || 'Navegación'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTimestamp(data.timestamp)}
                  </div>
                </div>
                {data.page_type && (
                  <div className="mt-1 text-sm text-gray-300">
                    <div>Tipo de página: {data.page_type}</div>
                    {data.user_intent && <div>Intención: {data.user_intent}</div>}
                    {data.teaching_moment && <div className="text-blue-300">🎓 Momento de enseñanza detectado</div>}
                    {data.error_pattern && <div className="text-red-300">⚠️ Error: {data.error_pattern}</div>}
                    {data.success_pattern && <div className="text-green-300">✅ Éxito: {data.success_pattern}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información de la base de datos */}
      <div className="p-4 bg-gray-700 rounded-lg">
        <div className="text-sm text-gray-400 mb-2">🗄️ Información de Base de Datos</div>
        <div className="text-sm text-gray-300 space-y-1">
          <div>• Base de datos: PostgreSQL (Neon)</div>
          <div>• Tablas: sessions, vectorized_data, metadata</div>
          <div>• Características: text_vectors, context_vectors, action_vectors, numerical_features</div>
          <div>• Labels: teaching_moments, error_patterns, success_patterns, user_intents</div>
        </div>
      </div>
    </div>
  );
};

export default VectorizedDataCollector;
