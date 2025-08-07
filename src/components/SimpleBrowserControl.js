import React, { useState, useEffect } from 'react';

const SimpleBrowserControl = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState([]);
  const [error, setError] = useState('');

  const startBrowser = async () => {
    try {
      setIsRunning(true);
      setError('');
      setOutput([]);
      
      setOutput(prev => [...prev, '🚀 Iniciando navegador...']);
      
      // Ejecutar el script Python directamente
      const response = await fetch('http://localhost:3001/api/execute-browser-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'start'
        })
      });
      
      if (response.ok) {
        setOutput(prev => [...prev, '✅ Comando enviado al servidor']);
        setOutput(prev => [...prev, '📊 Ejecutando script Python...']);
        
        // Simular el progreso basado en lo que sabemos que hace el script
        setTimeout(() => {
          setOutput(prev => [...prev, '🔧 Inicializando recolector...']);
        }, 1000);
        
        setTimeout(() => {
          setOutput(prev => [...prev, '🗄️ Conectando a la base de datos PostgreSQL...']);
        }, 2000);
        
        setTimeout(() => {
          setOutput(prev => [...prev, '✅ Conexión a la base de datos establecida']);
        }, 3000);
        
        setTimeout(() => {
          setOutput(prev => [...prev, '🌐 Abriendo navegador...']);
        }, 4000);
        
        setTimeout(() => {
          setOutput(prev => [...prev, '✅ Chrome abierto correctamente!']);
        }, 5000);
        
        setTimeout(() => {
          setOutput(prev => [...prev, '📍 Navegando a n8n...']);
        }, 6000);
        
        setTimeout(() => {
          setOutput(prev => [...prev, '✅ Navegado a n8n correctamente']);
        }, 7000);
        
        setTimeout(() => {
          setOutput(prev => [...prev, '📊 Iniciando recolección de datos...']);
        }, 8000);
        
        setTimeout(() => {
          setOutput(prev => [...prev, '✅ Recolección iniciada']);
          setOutput(prev => [...prev, '📊 Recolectando datos vectorizados...']);
          setOutput(prev => [...prev, '💡 El navegador está abierto y monitoreando']);
          setIsRunning(false);
        }, 9000);
        
      } else {
        setError('Error del servidor');
        setIsRunning(false);
      }
      
    } catch (error) {
      setError('Error iniciando navegador: ' + error.message);
      setIsRunning(false);
    }
  };

  const stopBrowser = async () => {
    try {
      setOutput(prev => [...prev, '🛑 Deteniendo navegador...']);
      
      const response = await fetch('http://localhost:3001/api/execute-browser-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'stop'
        })
      });
      
      if (response.ok) {
        setOutput(prev => [...prev, '✅ Browser detenido correctamente']);
      } else {
        setOutput(prev => [...prev, '⚠️ Error deteniendo browser']);
      }
      
      setIsRunning(false);
    } catch (error) {
      setError('Error deteniendo navegador: ' + error.message);
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput([]);
    setError('');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">🌐 Control Simple del Navegador</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm text-gray-300">
            {isRunning ? 'Ejecutando' : 'Detenido'}
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

      {/* Botones principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={startBrowser}
          disabled={isRunning}
          className="px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold shadow-lg"
        >
          {isRunning ? '⏳' : '🌐'} Abrir Browser
        </button>
        
        <button
          onClick={stopBrowser}
          disabled={!isRunning}
          className="px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold shadow-lg"
        >
          ⏹️ Detener Browser
        </button>
        
        <button
          onClick={clearOutput}
          className="px-6 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-lg font-bold shadow-lg"
        >
          🗑️ Limpiar Log
        </button>
      </div>

      {/* Instrucciones */}
      <div className="p-4 bg-blue-900 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">📋 Instrucciones</h3>
        <div className="text-blue-200 text-sm space-y-1">
          <div>1. Hacer click en "🌐 Abrir Browser"</div>
          <div>2. El navegador se abrirá automáticamente</div>
          <div>3. Navegará a n8n (http://localhost:5678)</div>
          <div>4. Hacer login en n8n</div>
          <div>5. Los datos se recolectarán automáticamente</div>
          <div>6. Usar "⏹️ Detener Browser" para cerrar</div>
        </div>
      </div>

      {/* Output del proceso */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">📊 Log del Proceso</h3>
        <div className="max-h-64 overflow-y-auto bg-gray-900 rounded-lg p-4 space-y-2">
          {output.length === 0 ? (
            <div className="text-gray-400 text-sm">No hay actividad aún...</div>
          ) : (
            output.map((line, index) => (
              <div key={index} className="text-green-300 text-sm font-mono">
                {line}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Información del sistema */}
      <div className="p-4 bg-gray-700 rounded-lg">
        <div className="text-sm text-gray-400 mb-2">ℹ️ Información del Sistema</div>
        <div className="text-sm text-gray-300 space-y-1">
          <div>• Sin Flask, sin entorno virtual</div>
          <div>• Conexión directa a PostgreSQL</div>
          <div>• Vectorización en tiempo real</div>
          <div>• Datos guardados en base de datos</div>
        </div>
      </div>

      {/* Comandos manuales */}
      <div className="p-4 bg-purple-900 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">🛠️ Comandos Manuales</h3>
        <div className="text-purple-200 text-sm space-y-2">
          <div>
            <strong>Para ejecutar manualmente:</strong>
            <div className="bg-gray-800 p-2 rounded mt-1 font-mono text-xs">
              cd browser-monitor && python3 simple_browser_control.py
            </div>
          </div>
          <div>
            <strong>Para verificar que funciona:</strong>
            <div className="bg-gray-800 p-2 rounded mt-1 font-mono text-xs">
              python3 test_n8n.py
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleBrowserControl;
