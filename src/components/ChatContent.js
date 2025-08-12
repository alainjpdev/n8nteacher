import React from 'react';

const ChatContent = ({ 
  currentStep, 
  instructions, 
  isVisible, 
  audioError, 
  speechReady, 
  userInteracted,
  n8nConnected,
  n8nLoading,
  n8nError,
  currentWorkflow,
  workflowStatus,
  isInitialized,
  onNextStep,
  onPreviousStep
}) => {
  const [showConnectionBanner, setShowConnectionBanner] = React.useState(true);

  // Estado para tracking de pasos
  const [stepStatus, setStepStatus] = React.useState({
    step1Completed: false,
    step2Completed: false,
    step3Completed: false
  });





  // Ocultar banner de conexión después de 8 segundos
  React.useEffect(() => {
    if (isInitialized && n8nConnected && !n8nLoading && !n8nError) {
      // Mostrar banner cuando se conecta
      setShowConnectionBanner(true);
      
      // Ocultar después de 8 segundos
      const timer = setTimeout(() => {
        setShowConnectionBanner(false);
      }, 8000); // 8 segundos

      return () => clearTimeout(timer);
    } else if (!n8nConnected || n8nLoading || n8nError) {
      // Ocultar banner cuando hay errores o está cargando
      setShowConnectionBanner(false);
    }
  }, [isInitialized, n8nConnected, n8nLoading, n8nError]);

  // Función para verificar si el Manual Trigger está presente
  const checkManualTrigger = React.useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/workflows/PEiPnfWFWwk17oKy');
      if (response.ok) {
        const workflow = await response.json();
        
        // Buscar nodos de tipo Manual Trigger
        const hasManualTrigger = workflow.nodes?.some(node => 
          node.type === 'n8n-nodes-base.manualTrigger' || 
          (node.typeVersion === 1 && node.type.includes('manual'))
        );
        
        if (hasManualTrigger && !stepStatus.step2Completed) {
          setStepStatus(prev => ({ 
            ...prev, 
            step1Completed: true, // Auto-completar paso 1 también
            step2Completed: true 
          }));
          console.log('✅ Manual Trigger detectado! Pasos 1 y 2 completados.');
        } else if (!hasManualTrigger) {
          // Silenciar logs excesivos - solo mostrar cada 30 segundos
          const now = Date.now();
          if (!window.lastManualTriggerLog || now - window.lastManualTriggerLog > 30000) {
            console.log('🔍 No Manual Trigger found yet...');
            window.lastManualTriggerLog = now;
          }
        }
        
        return hasManualTrigger;
      }
    } catch (error) {
      console.error('Error verificando Manual Trigger:', error);
    }
    return false;
  }, [stepStatus.step2Completed]);

  // Función para verificar si el workflow ha sido guardado
  const checkWorkflowSaved = React.useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/workflows/PEiPnfWFWwk17oKy');
      if (response.ok) {
        const workflow = await response.json();
        
        // Verificar si hay un Manual Trigger presente
        const hasManualTrigger = workflow.nodes?.some(node => 
          node.type === 'n8n-nodes-base.manualTrigger' || 
          (node.typeVersion === 1 && node.type.includes('manual'))
        );
        
        // Verificar si el workflow tiene metadata de guardado reciente
        const hasRecentSave = workflow.meta?.savedAt && 
          (new Date().getTime() - new Date(workflow.meta.savedAt).getTime()) < 60000; // Último minuto
        
        // Log detallado para debug
        console.log('🔍 Verificando guardado:', {
          hasManualTrigger,
          hasRecentSave,
          savedAt: workflow.meta?.savedAt,
          step3Completed: stepStatus.step3Completed,
          nodes: workflow.nodes?.length || 0
        });
        
        // Si hay Manual Trigger Y se guardó recientemente, completar todos los pasos
        if (hasManualTrigger && hasRecentSave && !stepStatus.step3Completed) {
          setStepStatus(prev => ({ 
            ...prev, 
            step1Completed: true,
            step2Completed: true,
            step3Completed: true 
          }));
          console.log('🎉 ¡Manual Trigger + Save detectado! Todos los pasos completados automáticamente.');
        }
        
        return hasRecentSave;
      }
    } catch (error) {
      console.error('Error verificando guardado del workflow:', error);
    }
    return false;
  }, [stepStatus.step3Completed]);



  // Verificar estado del workflow cada 3 segundos
  React.useEffect(() => {
    const interval = setInterval(() => {
      checkManualTrigger();
      // Verificar guardado siempre para detectar Manual Trigger + Save
      checkWorkflowSaved();
    }, 3000);

    return () => clearInterval(interval);
  }, [checkManualTrigger, checkWorkflowSaved]);

  // Log temporal para verificar el estado
  React.useEffect(() => {
    if (stepStatus.step2Completed && stepStatus.step3Completed) {
      console.log('🎉 ¡Tarea completada! Botón Siguiente habilitado');
    }
    
    // Log detallado del estado
    console.log('🔍 Estado actual:', {
      step1: stepStatus.step1Completed,
      step2: stepStatus.step2Completed,
      step3: stepStatus.step3Completed,
      botonHabilitado: stepStatus.step2Completed && stepStatus.step3Completed
    });
  }, [stepStatus.step2Completed, stepStatus.step3Completed]);




  return (
    <div className="flex-1 p-4 bg-gray-900">
      <div className={`transition-opacity duration-500 h-full ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 h-full flex flex-col">
          
          {/* n8n Connection Banner - Solo mostrar si está inicializado y showConnectionBanner es true */}
          {isInitialized && n8nConnected && showConnectionBanner && (
            <div className="mb-4 p-4 bg-green-900 border border-green-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <h3 className="text-green-200 font-semibold">¡Conectado a n8n!</h3>
                  <p className="text-green-300 text-sm">
                    Tu aplicación está lista para crear workflows automáticamente
                  </p>
                </div>
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          )}

          {/* n8n Loading Banner - Solo mostrar si está inicializado */}
          {isInitialized && n8nLoading && (
            <div className="mb-4 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b border-yellow-400"></div>
                <div className="flex-1">
                  <h3 className="text-yellow-200 font-semibold">Conectando a n8n...</h3>
                  <p className="text-yellow-300 text-sm">
                    Configurando la integración automática
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* n8n Manual Connection Prompt - OCULTO - Solo mostrar si está inicializado */}
          {/* {isInitialized && !n8nConnected && !n8nLoading && !n8nError && (
            <div className="mb-4 p-4 bg-blue-900 border border-blue-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <h3 className="text-blue-200 font-semibold">Configurar Token de API n8n</h3>
                  <p className="text-blue-300 text-sm">
                    Para conectar con n8n, necesitas:
                  </p>
                  <ol className="text-blue-300 text-xs mt-2 space-y-1 list-decimal list-inside">
                    <li>Ir a <a href="https://algorithmicsaischool.app.n8n.cloud/settings/api" target="_blank" rel="noopener noreferrer" className="underline">Settings → API</a></li>
                    <li>Crear un nuevo API Key</li>
                    <li>Copiar el token y agregarlo en src/services/n8nMCP.js</li>
                    <li>Hacer clic en "Conectar n8n" en el header</li>
                  </ol>
                </div>
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          )} */}

          {/* n8n Error Banner - OCULTO - Solo mostrar si está inicializado y hay un error crítico */}
          {/* {isInitialized && n8nError && (
            <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="flex-1">
                  <h3 className="text-red-200 font-semibold">Error de conexión n8n</h3>
                  <p className="text-red-300 text-sm">{n8nError}</p>
                </div>
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          )} */}

          {/* CORS Error Banner - OCULTO - Solo mostrar si está inicializado */}
          {/* {isInitialized && n8nError && n8nError.includes('CORS') && (
            <div className="mb-4 p-4 bg-orange-900 border border-orange-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <div className="flex-1">
                  <h3 className="text-orange-200 font-semibold">Limitación de Seguridad del Navegador</h3>
                  <p className="text-orange-300 text-sm">
                    Los navegadores bloquean conexiones directas a APIs externas por seguridad. 
                    Para usar n8n completamente, necesitas:
                  </p>
                  <ul className="text-orange-300 text-xs mt-2 space-y-1">
                    <li>• Usar un servidor proxy</li>
                    <li>• Configurar CORS en el servidor n8n</li>
                    <li>• Usar una extensión de navegador</li>
                  </ul>
                </div>
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          )} */}

          {/* Audio Error Message */}
          {audioError && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Error de audio: {audioError}</span>
              </div>
            </div>
          )}

          {/* Speech Status */}
          {!speechReady && (
            <div className="mb-4 p-3 bg-blue-900 border border-blue-700 text-blue-200 rounded text-sm">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-400"></div>
                <span>Cargando voces de audio...</span>
              </div>
            </div>
          )}

          {/* Audio Test Message - OCULTO */}
          {/* {speechReady && !userInteracted && (
            <div className="mb-4 p-3 bg-yellow-900 border border-yellow-700 text-yellow-200 rounded text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span>Haz clic en "Probar Audio" para activar la narración</span>
              </div>
            </div>
          )} */}

          {/* Step Indicator */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                Ejercicio {currentStep + 1} de {instructions.length}
              </span>
              <span className="text-sm text-gray-400">
                {Math.round(((currentStep + 1) / instructions.length) * 100)}% completado
              </span>
            </div>
            
            {/* Progress Dots */}
            <div className="flex space-x-1">
              {instructions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep 
                      ? 'bg-blue-500' 
                      : index < currentStep 
                      ? 'bg-green-500' 
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onPreviousStep}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                currentStep === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Anterior</span>
            </button>

            <div className="text-sm text-gray-400">
              {currentStep + 1} / {instructions.length}
            </div>

            <button
              onClick={onNextStep}
              disabled={currentStep === instructions.length - 1 || !(stepStatus.step2Completed && stepStatus.step3Completed)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                currentStep === instructions.length - 1 || !(stepStatus.step2Completed && stepStatus.step3Completed)
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <span>
                {stepStatus.step2Completed && stepStatus.step3Completed ? '🚀 Siguiente' : 'Siguiente'}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Mensaje cuando el botón Siguiente se habilita */}
            {stepStatus.step2Completed && stepStatus.step3Completed && (
              <div className="mt-2 text-center">
                <div className="text-xs text-green-400 animate-pulse">
                  ✅ ¡Puedes continuar al siguiente ejercicio!
                </div>
              </div>
            )}
          </div>
          
          {/* Current Instruction */}
          <div className="space-y-4 flex-1">
            {instructions.length > 0 && currentStep < instructions.length ? (
              <>
                <h3 className="text-xl font-semibold text-white">
                  {instructions[currentStep].title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {instructions[currentStep].content}
                </p>
              </>
            ) : (
              <div className="text-center py-8">


                <h3 className="text-xl font-semibold text-white mb-4">
                  🎯 Clase 1: Introducción a los Triggers de n8n
                </h3>


                
                {/* Pasos de la clase directamente en el contenido */}
                <div className="space-y-6 mb-6">
                  {/* Paso 1 */}
                  <div className={`border rounded-lg p-4 transition-all duration-300 ${
                    stepStatus.step1Completed 
                      ? 'bg-green-900/20 border-green-700/30' 
                      : 'bg-blue-900/20 border-blue-700/30'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        stepStatus.step1Completed 
                          ? 'bg-green-600 text-white' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        {stepStatus.step1Completed ? '✅' : '1'}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2">
                          Presionar el botón '+'
                        </h4>
                        <p className="text-gray-300">
                          Presiona el botón <strong>"+"</strong> que se encuentra en el centro de la pantalla de n8n.
                        </p>

                        {stepStatus.step1Completed && (
                          <div className="mt-2 animate-pulse">
                            <div className="flex items-center space-x-2 bg-green-600 text-white px-3 py-1 rounded-lg shadow-lg">
                              <div className="text-lg">✨</div>
                              <div className="text-xs font-medium">
                                ¡Paso completado!
                              </div>
                              <div className="text-lg">✨</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Paso 2 */}
                  <div className={`border rounded-lg p-4 transition-all duration-300 ${
                    stepStatus.step2Completed 
                      ? 'bg-green-900/20 border-green-700/30' 
                      : 'bg-green-900/20 border-green-700/30'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        stepStatus.step2Completed 
                          ? 'bg-green-600 text-white' 
                          : 'bg-green-600 text-white'
                      }`}>
                        {stepStatus.step2Completed ? '✅' : '2'}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2">
                          Seleccionar Manual Trigger
                        </h4>
                        <p className="text-gray-300 mb-3">
                          En el panel lateral que aparece, busca la sección <strong>"Triggers"</strong> y selecciona <strong>"Manual Trigger"</strong>.
                        </p>
                        <div className="bg-green-800/30 border border-green-600/30 rounded-lg p-3">
                          <div className="text-center">
                            <div className="text-2xl mb-2">📋</div>
                            <p className="text-sm text-green-200 font-medium">
                              Aparecerá un panel lateral con categorías de nodos
                            </p>
                            <p className="text-xs text-green-300 mt-1">
                              Busca la sección "Triggers" y selecciona "Manual Trigger"
                            </p>
                          </div>
                        </div>
                            

                      </div>
                    </div>
                  </div>

                  {/* Paso 3 */}
                  <div className={`border rounded-lg p-4 transition-all duration-300 ${
                    stepStatus.step3Completed 
                      ? 'bg-green-900/20 border-green-700/30' 
                      : 'bg-blue-900/20 border-blue-700/30'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        stepStatus.step3Completed 
                          ? 'bg-green-600 text-white' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        {stepStatus.step3Completed ? '✅' : '3'}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2">
                          Guardar el Workflow
                        </h4>
                        <p className="text-gray-300 mb-3">
                          Haz clic en el botón <strong>"Save"</strong> que se encuentra en la parte superior derecha de la pantalla para guardar tu workflow.
                        </p>
                        <div className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-3">
                          <div className="text-center">
                            <div className="text-2xl mb-2">💾</div>
                            <p className="text-sm text-blue-200 font-medium">
                              Busca el botón "Save" en la barra superior
                            </p>
                            <p className="text-xs text-blue-300 mt-1">
                              Es importante guardar para que los cambios se mantengan
                            </p>
                          </div>
                        </div>

                        {stepStatus.step3Completed && (
                          <div className="mt-3 space-y-3">
                            <div className="animate-pulse">
                              <div className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                                <div className="text-2xl">🚀</div>
                                <div className="text-sm font-medium">
                                  ¡Workflow guardado exitosamente!
                                </div>
                                <div className="text-2xl">🚀</div>
                              </div>
                            </div>
                            
                            {/* Caja minimalista de tarea completada */}
                            <div className="p-4 bg-green-900/20 border border-green-700/30 rounded-lg">
                              <div className="text-center">
                                <div className="text-2xl mb-2">✅</div>
                                <div className="text-green-300 font-medium">
                                  Tarea completada
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Botón temporal para simular guardado */}
                        {stepStatus.step2Completed && !stepStatus.step3Completed && (
                          <div className="mt-3">
                            <button
                              onClick={async () => {
                                try {
                                  const response = await fetch('http://localhost:3001/api/workflows/PEiPnfWFWwk17oKy/simulate-save', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json'
                                    }
                                  });
                                  if (response.ok) {
                                    console.log('🎯 Simulación de guardado enviada');
                                  }
                                } catch (error) {
                                  console.error('Error simulando guardado:', error);
                                }
                              }}
                              className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                            >
                              🎯 Simular Guardado
                            </button>
                          </div>
                        )}



                      </div>
                    </div>
                  </div>
                </div>

                

              </div>
            )}
            
            {/* Compact n8n Action Info */}
            {instructions.length > 0 && currentStep < instructions.length && instructions[currentStep].action && (
              <div className="mt-4 p-3 bg-blue-900 border border-blue-700 rounded-md">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-200">Acción n8n:</span>
                </div>
                <p className="text-xs text-blue-300">
                  {getActionDescription(instructions[currentStep].action)}
                </p>
              </div>
            )}

                      {/* Current Workflow Status */}
          {workflowStatus && n8nConnected && (
            <div className="mt-4 p-3 bg-green-900 border border-green-700 rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-green-200">Estado del Workflow:</span>
              </div>
              <div className="text-xs text-green-300 space-y-1">
                <p><strong>Nombre:</strong> {workflowStatus.workflowDetails?.name || 'Desconocido'}</p>
                <p><strong>Estado:</strong> {workflowStatus.isActive ? '🟢 Activo' : '🔴 Inactivo'}</p>
                <p><strong>Nodos:</strong> {workflowStatus.nodeCount || 0}</p>
                <p><strong>Conexiones:</strong> {workflowStatus.connectionCount || 0}</p>
                {workflowStatus.lastHash && (
                  <p><strong>Hash:</strong> {workflowStatus.lastHash}...</p>
                )}
              </div>
            </div>
          )}
          </div>
          
          {/* Progress Bar */}
          {instructions.length > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / instructions.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



  // Helper function to get action descriptions
  const getActionDescription = (action) => {
    const descriptions = {
      // Acciones generales
      'create_webhook_workflow': 'Creará un nuevo workflow con trigger de webhook',
      'add_set_node': 'Agregará un nodo Set para procesar datos',
      'add_validation_node': 'Agregará un nodo IF para validar email',
      'add_database_node': 'Agregará un nodo PostgreSQL para guardar datos',
      'add_email_node': 'Agregará un nodo Email para enviar notificaciones',
      'test_workflow': 'Ejecutará el workflow con datos de prueba',
      
      // Acciones específicas de triggers
      'introduction_triggers': 'Te introducirá a los conceptos básicos de triggers en n8n',
      'manual_trigger': 'Te guiará para crear y configurar un trigger manual',
      'webhook_trigger': 'Te ayudará a configurar un trigger webhook para recibir datos externos',
      'schedule_trigger': 'Te mostrará cómo configurar un trigger de programación temporal',
      'email_trigger': 'Te enseñará a configurar un trigger para monitorear emails',
      'database_trigger': 'Te guiará para configurar un trigger que monitoree cambios en bases de datos',
      'file_trigger': 'Te ayudará a configurar un trigger para monitorear cambios en archivos',
      'final_project': 'Te guiará para crear un workflow completo combinando múltiples triggers'
    };
    return descriptions[action] || 'Acción no definida';
  };

export default ChatContent; 