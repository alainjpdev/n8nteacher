import React, { useState, useEffect } from 'react';

const ApiConfig = ({ onApiConfigured, onClose }) => {
  const [apiToken, setApiToken] = useState('');
  const [n8nUrl, setN8nUrl] = useState('http://localhost:5678');
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Cargar configuración guardada
    const savedToken = localStorage.getItem('n8n_api_token');
    const savedUrl = localStorage.getItem('n8n_base_url');
    
    if (savedToken) setApiToken(savedToken);
    if (savedUrl) setN8nUrl(savedUrl);
  }, []);

  const validateConnection = async () => {
    if (!apiToken.trim()) {
      setValidationMessage('Por favor ingresa tu token de API');
      return;
    }

    setIsValidating(true);
    setValidationMessage('Validando conexión...');

    try {
      // Validamos a través de nuestro backend para evitar problemas de CORS
      const response = await fetch('http://localhost:3001/api/config/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          n8nBaseUrl: n8nUrl,
          n8nApiToken: apiToken
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsValid(true);
        setValidationMessage('¡Conexión exitosa! Token válido.');
        
        // Guardar configuración
        localStorage.setItem('n8n_api_token', apiToken);
        localStorage.setItem('n8n_base_url', n8nUrl);
        
        // Notificar al componente padre
        setTimeout(() => {
          onApiConfigured({ token: apiToken, baseUrl: n8nUrl });
        }, 1500);
      } else {
        throw new Error(result.error || 'Error al validar la configuración');
      }
    } catch (error) {
      setIsValid(false);
      setValidationMessage(`Error: ${error.message}`);
    }

    setIsValidating(false);
  };

  const getTokenInstructions = () => (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
        📝 Cómo obtener tu token de API de n8n:
      </h4>
      <ol className="text-sm text-blue-700 dark:text-blue-300 list-decimal list-inside space-y-1">
        <li>Abre n8n en: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{n8nUrl}</code></li>
        <li>Ve a <strong>Settings</strong> → <strong>API</strong></li>
        <li>Haz clic en <strong>"Create API Key"</strong></li>
        <li>Copia el token generado y pégalo aquí</li>
      </ol>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              🔧 Configuración de API
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
            >
              ×
            </button>
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
                onChange={(e) => setApiToken(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Pega aquí tu token de API de n8n..."
              />
            </div>

            {validationMessage && (
              <div className={`p-3 rounded-md text-sm ${
                isValid 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                  : validationMessage.includes('Error')
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
              }`}>
                {validationMessage}
              </div>
            )}

            <div className="flex gap-3 pt-4">
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
                  'Validar y Guardar'
                )}
              </button>
              
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiConfig;