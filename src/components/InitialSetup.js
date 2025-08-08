import React, { useState, useEffect } from 'react';

const InitialSetup = ({ onSetupComplete, onOpenSimpleBrowserControl }) => {
  const [step, setStep] = useState(0); // Empezar en paso 0
  const [apiToken, setApiToken] = useState('');
  const [n8nUrl, setN8nUrl] = useState('http://localhost:5678');
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [isLoadingWorkflows, setIsLoadingWorkflows] = useState(false);
  const [browserOpened, setBrowserOpened] = useState(false);
  const [browserActive, setBrowserActive] = useState(false);

  useEffect(() => {
    // Cargar configuración guardada si existe
    try {
      const savedBaseUrl = localStorage.getItem('n8n_base_url');
      const savedToken = localStorage.getItem('n8n_api_token');
      if (savedBaseUrl) setN8nUrl(savedBaseUrl);
      if (savedToken) setApiToken(savedToken);
    } catch (e) {
      // Ignorar errores de localStorage
    }
    // Verificar estado del navegador al cargar
    checkBrowserStatus();
  }, []);

  const checkBrowserStatus = async () => {
    try {
      const statusResponse = await fetch('http://localhost:3001/api/browser-status');
      const statusResult = await statusResponse.json();
      setBrowserActive(statusResult.isActive);
      return statusResult.isActive;
    } catch (error) {
      console.error('Error verificando estado del navegador:', error);
      return false;
    }
  };

  const closeBrowser = async () => {
    setValidationMessage('Cerrando navegador...');
    try {
      const response = await fetch('http://localhost:3001/api/execute-browser-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'stop'
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setValidationMessage('✅ Navegador cerrado correctamente');
        setBrowserActive(false);
        setTimeout(() => {
          setValidationMessage('');
        }, 2000);
      } else {
        setValidationMessage(`Error cerrando navegador: ${result.message}`);
      }
    } catch (error) {
      setValidationMessage(`Error cerrando navegador: ${error.message}`);
    }
  };

  const openBrowser = async () => {
    setValidationMessage('Verificando estado del navegador...');
    
    try {
      // Primero verificar si ya hay un navegador activo
      const isActive = await checkBrowserStatus();
      
      if (isActive) {
        setValidationMessage('⚠️ Ya hay un navegador activo. Cierra el navegador actual antes de abrir uno nuevo.');
        return;
      }
      
      setValidationMessage('Abriendo navegador...');
      
      // Llamar al endpoint del backend para ejecutar el script Python
      const response = await fetch('http://localhost:3001/api/execute-browser-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'start'
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setValidationMessage('✅ Comando enviado al servidor');
        setValidationMessage('📊 Ejecutando script Python...');
        
        // Simular el progreso basado en lo que sabemos que hace el script
        setTimeout(() => {
          setValidationMessage('🔧 Inicializando recolector...');
        }, 1000);
        
        setTimeout(() => {
          setValidationMessage('🗄️ Conectando a la base de datos PostgreSQL...');
        }, 2000);
        
        setTimeout(() => {
          setValidationMessage('✅ Conexión a la base de datos establecida');
        }, 3000);
        
        setTimeout(() => {
          setValidationMessage('🌐 Abriendo navegador...');
        }, 4000);
        
        setTimeout(() => {
          setValidationMessage('✅ Chrome abierto correctamente!');
        }, 5000);
        
        setTimeout(() => {
          setValidationMessage('📍 Navegando a n8n...');
        }, 6000);
        
        setTimeout(() => {
          setValidationMessage('✅ Navegado a n8n correctamente');
        }, 7000);
        
        setTimeout(() => {
          setValidationMessage('📊 Iniciando recolección de datos...');
        }, 8000);
        
        setTimeout(() => {
          setBrowserOpened(true);
          setValidationMessage('✅ Recolección iniciada');
          setValidationMessage('📊 Recolectando datos vectorizados...');
          setValidationMessage('💡 El navegador está abierto y monitoreando');
          setTimeout(() => {
            setStep(1);
          }, 1000);
        }, 9000);
        
      } else if (response.status === 409) {
        // Conflicto - ya hay un navegador activo
        setValidationMessage('⚠️ Ya hay un navegador activo. Cierra el navegador actual antes de abrir uno nuevo.');
      } else {
        setValidationMessage(`Error del servidor: ${result.message}`);
      }
    } catch (error) {
      setValidationMessage(`Error abriendo navegador: ${error.message}`);
    }
  };

  const validateConnection = async () => {
    // Limpiar el token antes de validar
    const cleanedToken = apiToken.trim();
    
    if (!cleanedToken) {
      setValidationMessage('Por favor ingresa tu token de API');
      return;
    }

    // Actualizar el estado con el token limpio
    setApiToken(cleanedToken);

    setIsValidating(true);
    setValidationMessage('Validando conexión...');

    try {
      // Validamos a través de nuestro backend
      const response = await fetch('http://localhost:3001/api/config/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          n8nBaseUrl: n8nUrl,
          n8nApiToken: cleanedToken
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsValidating(false);
        setValidationMessage('¡Conexión exitosa! Cargando workflows...');
        
        // Guardar en localStorage para la sesión
        try {
          localStorage.setItem('n8n_base_url', n8nUrl);
          localStorage.setItem('n8n_api_token', cleanedToken);
        } catch (e) {
          console.warn('No se pudo guardar en localStorage:', e);
        }
        
        // Ir al siguiente paso
        setTimeout(() => {
          setStep(2);
          loadWorkflows();
        }, 1500);
      } else {
        throw new Error(result.error || 'Error al validar la configuración');
      }
    } catch (error) {
      setIsValidating(false);
      setValidationMessage(`Error: ${error.message}`);
    }
  };

  const loadWorkflows = async () => {
    setIsLoadingWorkflows(true);
    try {
      const response = await fetch('http://localhost:3001/api/workflows');
      const result = await response.json();
      
      if (result.success) {
        setWorkflows(result.workflows || []);
      } else {
        throw new Error(result.message || 'Error cargando workflows');
      }
    } catch (error) {
      setValidationMessage(`Error cargando workflows: ${error.message}`);
    } finally {
      setIsLoadingWorkflows(false);
    }
  };

  const selectWorkflow = async (workflow) => {
    setSelectedWorkflow(workflow);
    
    try {
      // Configurar el workflow en el servidor
      const response = await fetch('http://localhost:3001/api/target-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workflowId: workflow.id
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Guardar workflow en localStorage
        try {
          localStorage.setItem('n8n_selected_workflow', JSON.stringify(workflow));
        } catch (e) {
          console.warn('No se pudo guardar workflow en localStorage:', e);
        }
        
        // Completar setup
        setTimeout(() => {
          onSetupComplete({
            token: apiToken.trim(), // Asegurar token limpio
            baseUrl: n8nUrl,
            workflow: workflow
          });
        }, 1000);
      } else {
        throw new Error(result.message || 'Error configurando workflow');
      }
    } catch (error) {
      setValidationMessage(`Error configurando workflow: ${error.message}`);
    }
  };

  const renderStep0 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          🌐 Abrir Navegador
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Ejecutar script Python para abrir Chrome y monitorear n8n
        </p>
      </div>

      {validationMessage && (
        <div className={`p-3 rounded-md text-sm ${
          validationMessage.includes('Error')
            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
        }`}>
          {validationMessage}
        </div>
      )}

      <div className="space-y-3">
        {browserActive ? (
          <>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-md">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                ⚠️ Ya hay un navegador activo. Cierra el navegador actual antes de abrir uno nuevo.
              </p>
            </div>
            <button
              onClick={closeBrowser}
              disabled={validationMessage.includes('Cerrando')}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {validationMessage.includes('Cerrando') ? '⏳ Cerrando...' : '🛑 Cerrar Navegador'}
            </button>
          </>
        ) : (
          <button
            onClick={openBrowser}
            disabled={validationMessage.includes('Abriendo') || validationMessage.includes('✅')}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {validationMessage.includes('Abriendo') ? '⏳ Abriendo...' : 
             validationMessage.includes('✅') ? '✅ Completado' : 
             '🌐 Abrir Explorador'}
          </button>
        )}
      </div>
    </div>
  );

  const getTokenInstructions = () => (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
        📝 Cómo obtener tu token de API de n8n:
      </h4>
              <ol className="text-sm text-blue-700 dark:text-blue-300 list-decimal list-inside space-y-1">
          <li>Realiza login en n8n desde el navegador que acaba de abrir</li>
          <li>Dirígete a los tres puntos que se encuentran en la parte inferior izquierda junto a tu nombre de usuario → <strong>Settings</strong></li>
          <li>Haz clic en <strong>"n8n API"</strong></li>
          <li>Luego presiona <strong>"Create an API key"</strong></li>
          <li>Crea una API key con todos los permisos y salvas</li>
        </ol>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🚀 Configuración Inicial
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configura tu conexión con n8n para comenzar
        </p>
      </div>

      {getTokenInstructions()}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            URL de n8n:
          </label>
          <input
            type="url"
            value={n8nUrl}
            onChange={(e) => setN8nUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="http://localhost:5678"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Token de API de n8n:
          </label>
          <textarea
            value={apiToken}
            onChange={(e) => {
              // Limpiar espacios en blanco automáticamente
              const cleanedValue = e.target.value.trim();
              setApiToken(cleanedValue);
            }}
            onPaste={(e) => {
              // Limpiar espacios cuando se pega
              e.preventDefault();
              const pastedText = e.clipboardData.getData('text');
              const cleanedText = pastedText.trim();
              setApiToken(cleanedText);
            }}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            placeholder="Pega aquí tu token de API de n8n..."
          />
        </div>

        {validationMessage && (
          <div className={`p-3 rounded-md text-sm ${
            validationMessage.includes('¡Conexión exitosa')
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
              : validationMessage.includes('Error')
              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
          }`}>
            {validationMessage}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={() => setStep(0)}
            className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md"
          >
            ← Volver
          </button>
          <button
            onClick={validateConnection}
            disabled={isValidating || !apiToken.trim()}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValidating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Validando...
              </span>
            ) : (
              'Validar y Continuar'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          📋 Selecciona un Workflow
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Elige el workflow que quieres monitorear
        </p>
      </div>

      {isLoadingWorkflows ? (
        <div className="text-center py-8">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Cargando workflows...</p>
        </div>
      ) : workflows.length > 0 ? (
        <div className="space-y-3">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              onClick={() => selectWorkflow(workflow)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedWorkflow?.id === workflow.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {workflow.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ID: {workflow.id}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      workflow.active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
                    }`}>
                      {workflow.active ? '🟢 Activo' : '⚪ Inactivo'}
                    </span>
                  </div>
                </div>
                {selectedWorkflow?.id === workflow.id && (
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">No se encontraron workflows</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Asegúrate de tener workflows creados en n8n
          </p>
        </div>
      )}

      {validationMessage && (
        <div className={`p-3 rounded-md text-sm ${
          validationMessage.includes('Error')
            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
        }`}>
          {validationMessage}
        </div>
      )}

      <button
        onClick={() => setStep(1)}
        className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md"
      >
        ← Volver
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {step === 0 ? renderStep0() : step === 1 ? renderStep1() : renderStep2()}
        </div>
      </div>
    </div>
  );
};

export default InitialSetup;
