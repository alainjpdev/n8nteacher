import React, { useState, useEffect } from 'react';

const ServerStatus = ({ isVisible, onClose }) => {
  const [serverStatus, setServerStatus] = useState({
    frontend: { status: 'unknown', port: 3000 },
    backend: { status: 'unknown', port: 3001 },
    n8n: { status: 'unknown', port: 5678 },
    browser: { status: 'unknown' }
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const checkServerStatus = async (url, name) => {
    try {
      const response = await fetch(url, { 
        method: 'GET',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok ? 'running' : 'error';
    } catch (error) {
      return 'stopped';
    }
  };

  const checkBrowserStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/browser-status', {
        method: 'GET',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        return data.isActive ? 'running' : 'stopped';
      }
      return 'stopped';
    } catch (error) {
      return 'stopped';
    }
  };

  const updateAllStatus = async () => {
    setLoading(true);
    
    const newStatus = { ...serverStatus };
    
    // Verificar frontend
    newStatus.frontend.status = await checkServerStatus('http://localhost:3000', 'frontend');
    
    // Verificar backend
    newStatus.backend.status = await checkServerStatus('http://localhost:3001/api/health', 'backend');
    
    // Verificar n8n
    newStatus.n8n.status = await checkServerStatus('http://localhost:5678', 'n8n');
    
    // Verificar browser
    newStatus.browser.status = await checkBrowserStatus();
    
    setServerStatus(newStatus);
    setLastUpdate(new Date());
    setLoading(false);
  };

  useEffect(() => {
    if (isVisible) {
      updateAllStatus();
      const interval = setInterval(updateAllStatus, 5000); // Actualizar cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-green-500';
      case 'stopped': return 'text-red-500';
      case 'error': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return '🟢';
      case 'stopped': return '🔴';
      case 'error': return '🟡';
      default: return '⚪';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'running': return 'Ejecutándose';
      case 'stopped': return 'Detenido';
      case 'error': return 'Error';
      default: return 'Desconocido';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Estado de Servidores</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 mb-4">
          {Object.entries(serverStatus).map(([serverName, server]) => (
            <div key={serverName} className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getStatusIcon(server.status)}</span>
                <div>
                  <div className="font-medium text-white capitalize">
                    {serverName === 'frontend' ? 'Frontend (React)' :
                     serverName === 'backend' ? 'Backend (Node.js)' :
                     serverName === 'n8n' ? 'n8n Server' :
                     'Browser Monitor'}
                  </div>
                  <div className="text-sm text-gray-400">
                    Puerto: {server.port || 'N/A'}
                  </div>
                </div>
              </div>
              <div className={`font-medium ${getStatusColor(server.status)}`}>
                {getStatusText(server.status)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <span>
            {loading ? '⏳ Actualizando...' : '✅ Actualizado'}
          </span>
          {lastUpdate && (
            <span>
              Última actualización: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={updateAllStatus}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔄 Actualizar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerStatus;
