import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ChatHeader from './ChatHeader';
import ChatContent from './ChatContent';
import ChatFooter from './ChatFooter';
import ApiConfig from './ApiConfig';
import WorkflowSelector from './WorkflowSelector';
import InitialSetup from './InitialSetup';
import BrowserMonitor from './BrowserMonitor';
import SimpleBrowserControl from './SimpleBrowserControl';
import ExerciseManager from './ExerciseManager';
import TriggersWorkflow from './TriggersWorkflow';
import ServerStatus from './ServerStatus';
import ExerciseSelector from './ExerciseSelector';
import ExerciseGuide from './ExerciseGuide';
// import N8nLogs from './N8nLogs';
import n8nMonitorService from '../services/n8nMonitorService';

const ChatBox = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [audioError, setAudioError] = useState('');
  const [speechReady, setSpeechReady] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  
  // n8n Monitor Integration states
  const [n8nConnected, setN8nConnected] = useState(false);
  const [n8nLoading, setN8nLoading] = useState(false);
  const [n8nError, setN8nError] = useState('');
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  // const [n8nLogs, setN8nLogs] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState(null);
  
  // API Configuration states
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);
  const [apiConfig, setApiConfig] = useState({ token: '', baseUrl: 'http://localhost:5678' });
  
  // Workflow Selection states
  const [showWorkflowSelector, setShowWorkflowSelector] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [workflowConfigured, setWorkflowConfigured] = useState(false);
  
  // Initial Setup states
  const [showInitialSetup, setShowInitialSetup] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Browser Monitor states
  const [showBrowserMonitor, setShowBrowserMonitor] = useState(false);
  const [browserMonitorData, setBrowserMonitorData] = useState(null);
  
  // Simple Browser Control states
  const [showSimpleBrowserControl, setShowSimpleBrowserControl] = useState(false);
  
  // Exercise Manager states
  const [showExerciseManager, setShowExerciseManager] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showExerciseGuide, setShowExerciseGuide] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  
  // Server Status states
  const [showServerStatus, setShowServerStatus] = useState(false);

  // Triggers modal state
  const [showTriggersWorkflow, setShowTriggersWorkflow] = useState(false);

  // Sistema de ejercicios simplificado - Solo usa ExerciseSelector
  const instructions = useMemo(() => [], []);

  // n8n Log callback - Comentado ya que los logs están ocultos
  // const handleN8nLog = useCallback((logEntry) => {
  //   setN8nLogs(prevLogs => {
  //     const newLogs = [...prevLogs, logEntry];
  //     // Keep only last 50 logs to prevent memory issues
  //     return newLogs.slice(-50);
  //   });
  // }, []);

  // n8n Status callback
  const handleN8nStatus = useCallback((statusData) => {
    console.log('Estado n8n actualizado:', statusData);
    setIsMonitoring(statusData.isMonitoring);
    setN8nConnected(statusData.isMonitoring || statusData.isConnected);
    setWorkflowStatus(statusData);
    
    // Log connection status changes
    if (statusData.connectionStatus) {
      switch (statusData.connectionStatus) {
        case 'connected':
          setN8nError('');
          break;
        case 'connecting':
          setN8nError('Conectando al servidor...');
          break;
        case 'error':
          // setN8nError('Error de conexión con el servidor'); // OCULTO
          break;
        case 'disconnected':
          // setN8nError('Desconectado del servidor'); // OCULTO
          break;
        default:
          // Handle any other status
          break;
      }
    }
  }, []);

  // Mostrar setup inicial solo si no está inicializado - OCULTO
  useEffect(() => {
    console.log('🔐 Verificando estado de inicialización...');
    if (!isInitialized) {
      console.log('🔐 Setup inicial oculto - usando configuración automática');
      // setShowInitialSetup(true); // OCULTO
    } else {
      console.log('🔐 Ya inicializado - no mostrar setup');
      setShowInitialSetup(false);
    }
  }, [isInitialized]);

  // API Configuration handlers
  const handleApiConfigured = useCallback((config) => {
    setApiConfig(config);
    setApiConfigured(true);
    setShowApiConfig(false);
    
    // Send API config to backend
    if (window.WebSocket && n8nMonitorService) {
      n8nMonitorService.updateApiConfig(config);
    }
    
    // No usar localStorage - siempre mostrar workflow selector después de configurar API
    setTimeout(() => {
      setShowWorkflowSelector(true);
    }, 1000);
  }, []);

  const handleOpenApiConfig = useCallback(() => {
    setShowApiConfig(true);
  }, []);

  // Workflow Selection handlers
  const handleWorkflowSelected = useCallback(async (workflow) => {
    setSelectedWorkflow(workflow);
    setWorkflowConfigured(true);
    setShowWorkflowSelector(false);
    
    // Send workflow selection to backend
    try {
      const response = await fetch('http://localhost:3001/api/workflow/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workflowId: workflow.id,
          workflowName: workflow.name
        })
      });
      
      if (response.ok) {
        console.log('✅ Workflow seleccionado correctamente:', workflow.name);
      } else {
        console.error('❌ Error al seleccionar workflow');
      }
    } catch (error) {
      console.error('❌ Error enviando selección de workflow:', error);
    }
  }, []);

  const handleOpenWorkflowSelector = useCallback(() => {
    setShowWorkflowSelector(true);
  }, []);

  const handleOpenBrowserMonitor = useCallback(() => {
    setShowBrowserMonitor(true);
  }, []);

  const handleOpenSimpleBrowserControl = useCallback(() => {
    setShowSimpleBrowserControl(true);
  }, []);

  const handleCloseSimpleBrowserControl = useCallback(() => {
    setShowSimpleBrowserControl(false);
  }, []);

  // Server Status handlers
  const handleOpenServerStatus = useCallback(() => {
    setShowServerStatus(true);
  }, []);

  const handleCloseServerStatus = useCallback(() => {
    setShowServerStatus(false);
  }, []);

  // Triggers modal handlers
  const handleOpenTriggersWorkflow = useCallback(() => {
    setShowTriggersWorkflow(true);
  }, []);

  const handleCloseTriggersWorkflow = useCallback(() => {
    setShowTriggersWorkflow(false);
  }, []);

  

  // Toggle real-time monitoring
  const handleToggleMonitoring = useCallback(() => {
    if (isMonitoring) {
      n8nMonitorService.stopMonitoring();
      setIsMonitoring(false);
    } else {
      n8nMonitorService.startMonitoring();
      setIsMonitoring(true);
    }
  }, [isMonitoring]);

  // Initialize n8n if configuration is complete
  useEffect(() => {
    if (apiConfigured && workflowConfigured) {
      setIsInitialized(true);
      initializeN8n();
    }
  }, [apiConfigured, workflowConfigured]);

  // Persist initialization state in memory
  useEffect(() => {
    if (isInitialized) {
      console.log('🔐 Estado de inicialización persistido en memoria');
      // El estado se mantiene en memoria mientras la app esté corriendo
    }
  }, [isInitialized]);

  // Hydrate from localStorage on first load
  useEffect(() => {
    try {
      const savedBaseUrl = localStorage.getItem('n8n_base_url');
      const savedToken = localStorage.getItem('n8n_api_token');
      const savedWorkflow = localStorage.getItem('n8n_selected_workflow');

      if (savedBaseUrl && savedToken) {
        const config = { token: savedToken, baseUrl: savedBaseUrl };
        setApiConfig(config);
        setApiConfigured(true);
        
        // Enviar config al backend para sincronizar
        if (n8nMonitorService) {
          n8nMonitorService.updateApiConfig(config);
        }
      }

      if (savedWorkflow) {
        try {
          const wf = JSON.parse(savedWorkflow);
          setSelectedWorkflow(wf);
          setWorkflowConfigured(true);
        } catch (_) { /* ignore parse error */ }
      }

      if ((savedBaseUrl && savedToken) || savedWorkflow) {
        setIsInitialized(true);
        // Inicializar conexión n8n si hay datos suficientes
        setTimeout(() => {
          initializeN8n();
        }, 500);
      }
    } catch (e) {
      console.warn('No se pudo leer localStorage:', e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize n8n Monitor connection
  const initializeN8n = async () => {
    setN8nLoading(true);
    setN8nError(''); // Limpiar errores previos
    
    try {
      // Set up callbacks
      // n8nMonitorService.setLogCallback(handleN8nLog);
      n8nMonitorService.setStatusCallback(handleN8nStatus);
      
      // Test connection
      const workflow = await n8nMonitorService.getWorkflowDetails();
      if (workflow) {
        setN8nConnected(true);
        setCurrentWorkflow(workflow);
        console.log('n8n Monitor: Connected successfully');
      } else {
        // setN8nError('No se pudo conectar al workflow'); // OCULTO - Error no crítico
      }
    } catch (err) {
      // setN8nError('Failed to initialize n8n Monitor connection'); // OCULTO - Error no crítico
      console.error('n8n Monitor Init Error:', err);
    } finally {
      setN8nLoading(false);
    }
  };

  // Handle initial setup completion
  const handleInitialSetupComplete = useCallback((config) => {
    console.log('✅ Setup inicial completado:', config);
    setShowInitialSetup(false);
    setIsInitialized(true);
    setApiConfigured(true);
    setWorkflowConfigured(true);
    setSelectedWorkflow(config.workflow);
    setApiConfig({
      token: config.token,
      baseUrl: config.baseUrl
    });
    
    // Initialize n8n connection after setup
    setTimeout(() => {
      initializeN8n();
      // Aplicar nodos iniciales (manual trigger) al workflow seleccionado
      fetch('http://localhost:3001/api/workflow/apply-from-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: 'json-files/clase1/manualtriger.json' })
      }).catch(() => {});
    }, 1000);
  }, []);

  // Handle browser monitor data
  const handleBrowserMonitorData = useCallback((data) => {
    console.log('📊 Datos del monitor de navegador:', data);
    setBrowserMonitorData(data);
    
    // Procesar acciones del usuario para actualizar la guía
    if (data.type === 'user_action') {
      processUserAction(data.action);
    }
  }, []);

  // Process user actions from browser monitor
  const processUserAction = useCallback((action) => {
    console.log('🎯 Procesando acción del usuario:', action);
    
    // Actualizar instrucciones basado en las acciones del usuario
    switch (action.type) {
      case 'workflow_created':
        // El usuario creó un workflow - avanzar al siguiente paso
        console.log('✅ Usuario creó un workflow - avanzando al siguiente paso');
        break;
        
      case 'node_added':
        // El usuario agregó un nodo - verificar si es el correcto
        console.log('✅ Usuario agregó un nodo - verificando tipo');
        break;
        
      case 'workflow_activated':
        // El usuario activó el workflow - paso completado
        console.log('✅ Usuario activó el workflow - paso completado');
        break;
        
      case 'n8n_navigation':
        // El usuario navegó a una sección específica
        console.log('✅ Usuario navegó a:', action.data.section);
        break;
        
      default:
        console.log('📝 Acción registrada:', action.type);
    }
  }, []);

  // Handle exercise selection
  const handleExerciseSelected = useCallback((exercise) => {
    console.log('🎯 Ejercicio seleccionado:', exercise);
    setCurrentExercise(exercise);
    setShowExerciseSelector(false);
    setShowExerciseGuide(true);
  }, []);

  // Handle exercise completion
  const handleExerciseComplete = useCallback(() => {
    console.log('✅ Ejercicio completado:', currentExercise?.title);
    setShowExerciseGuide(false);
    setCurrentExercise(null);
    
    // Mostrar mensaje de éxito en consola
    console.log(`¡Excelente! Has completado el ejercicio "${currentExercise?.title}". ¿Te gustaría continuar con otro ejercicio?`);
  }, [currentExercise]);

  // Handle exercise actions
  const handleExerciseAction = useCallback(async (exercise) => {
    if (!n8nConnected) {
      setN8nError('No conectado a n8n. Inicia el monitoreo primero.');
      return;
    }

    setN8nLoading(true);
    setN8nError('');

    try {
      // Log the exercise action
      n8nMonitorService.log(`🎯 Ejercicio iniciado: ${exercise.title}`, 'exercise');
      
      switch (exercise.action) {
        case 'create_webhook_workflow':
          n8nMonitorService.log('📝 Creando workflow con webhook...', 'exercise');
          // The monitoring will detect the workflow changes
          break;

        case 'add_set_node':
          n8nMonitorService.log('📝 Agregando nodo Set para procesar datos...', 'exercise');
          break;

        case 'add_validation_node':
          n8nMonitorService.log('📝 Agregando nodo de validación...', 'exercise');
          break;

        case 'add_database_node':
          n8nMonitorService.log('📝 Agregando nodo de base de datos...', 'exercise');
          break;

        case 'add_email_node':
          n8nMonitorService.log('📝 Agregando nodo de email...', 'exercise');
          break;

        case 'test_workflow':
          n8nMonitorService.log('🚀 Ejecutando workflow de prueba...', 'exercise');
          break;

        default:
          n8nMonitorService.log(`📝 Ejercicio: ${exercise.title}`, 'exercise');
      }
    } catch (err) {
      setN8nError(`Error en ejercicio: ${exercise.action}`);
      console.error('Exercise Action Error:', err);
    } finally {
      setN8nLoading(false);
    }
  }, [n8nConnected]);

  // Connect to n8n
  const connectN8n = useCallback(async () => {
    setN8nLoading(true);
    setN8nError('');
    
    try {
      // Start monitoring automatically
      if (!isMonitoring) {
        n8nMonitorService.startMonitoring();
        setIsMonitoring(true);
      }
      
      setN8nConnected(true);
      setN8nError('');
      
      console.log('n8n Monitor: Connected successfully');
    } catch (err) {
      setN8nError('Connection failed: ' + err.message);
      console.error('n8n Monitor Connection Error:', err);
    } finally {
      setN8nLoading(false);
    }
  }, [isMonitoring]);

  // Reconnect function
  const handleReconnect = useCallback(() => {
    setN8nLoading(true);
    setN8nError('Reconectando...');
    n8nMonitorService.stopMonitoring();
    setTimeout(() => {
      n8nMonitorService.startMonitoring();
      setN8nLoading(false);
    }, 2000);
  }, []);

  // Initialize speech synthesis
  useEffect(() => {
    if (window.speechSynthesis) {
      const checkVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setSpeechReady(true);
          console.log('Speech synthesis ready with', voices.length, 'voices');
        } else {
          setTimeout(checkVoices, 100);
        }
      };

      window.speechSynthesis.onvoiceschanged = checkVoices;
      checkVoices();
    }
  }, []);

  // Auto-start speech when ready and user has interacted
  useEffect(() => {
    if (speechReady && userInteracted && !hasStarted) {
      setHasStarted(true);
    }
  }, [speechReady, userInteracted, hasStarted]);

  // Speech synthesis effect
  useEffect(() => {
    if (!speechReady || !userInteracted || !hasStarted) return;

    const utterance = new SpeechSynthesisUtterance();
    utterance.text = instructions[currentStep].content;
    utterance.lang = 'es-ES';
    utterance.rate = 0.8;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      console.log('Speech started');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('Speech ended');
      setIsSpeaking(false);
      
      // Execute n8n action when speech ends
      const currentExercise = instructions[currentStep];
      if (currentExercise && currentExercise.action) {
        handleExerciseAction(currentExercise);
      }
      
      // Wait a bit more after speech ends before changing step
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % instructions.length);
      }, 2000); // 2 seconds pause after speech
    };

    utterance.onerror = (event) => {
      console.log('Speech error:', event);
      setIsSpeaking(false);
      
      if (event.error === 'not-allowed') {
        setAudioError('Audio blocked by browser. Click "Probar Audio" to enable.');
      } else if (event.error === 'network') {
        setAudioError('Network error with speech synthesis.');
      } else if (event.error === 'synthesis-not-supported') {
        setAudioError('Speech synthesis not supported in this browser.');
      } else {
        setAudioError(`Speech error: ${event.error}`);
      }
    };

    // Start speaking
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [speechReady, userInteracted, instructions, currentStep, handleExerciseAction, hasStarted]);

  // Step change effect
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Test audio function
  const testAudio = useCallback(() => {
    setUserInteracted(true);
    setAudioError('');
    
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = 'Audio funcionando correctamente';
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      utterance.volume = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        setAudioError(`Error de audio: ${event.error}`);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Stop speaking function
  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Navigation functions
  const handleNextStep = useCallback(() => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, instructions.length]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg shadow-xl">
              <ChatHeader 
          isSpeaking={isSpeaking} 
          onStopSpeaking={stopSpeaking} 
          onTestAudio={testAudio}
          n8nConnected={n8nConnected}
          n8nLoading={n8nLoading}
          onConnectN8n={connectN8n}
          isMonitoring={isMonitoring}
          onToggleMonitoring={handleToggleMonitoring}
          onReconnect={handleReconnect}
          apiConfigured={apiConfigured}
          onOpenApiConfig={handleOpenApiConfig}
          workflowConfigured={workflowConfigured}
          selectedWorkflow={selectedWorkflow}
          onOpenWorkflowSelector={handleOpenWorkflowSelector}
          isInitialized={isInitialized}
          onOpenBrowserMonitor={handleOpenBrowserMonitor}
          onOpenSimpleBrowserControl={handleOpenSimpleBrowserControl}
          onOpenExerciseManager={() => setShowExerciseManager(true)}
          onOpenExerciseSelector={() => setShowExerciseSelector(true)}
          onOpenServerStatus={handleOpenServerStatus}
          onOpenTriggersWorkflow={handleOpenTriggersWorkflow}
        />
      
      <div className="flex-1"> {/* This div now takes full width */}
        <ChatContent 
          currentStep={currentStep}
          instructions={instructions}
          isVisible={isVisible}
          audioError={audioError}
          speechReady={speechReady}
          userInteracted={userInteracted}
          n8nConnected={n8nConnected}
          n8nLoading={n8nLoading}
          n8nError={n8nError}
          currentWorkflow={currentWorkflow}
          workflowStatus={workflowStatus}
          isInitialized={isInitialized}
          onNextStep={handleNextStep}
          onPreviousStep={handlePreviousStep}
        />
        
        {/* n8n Logs Section - Oculto */}
        {/* <N8nLogs logs={n8nLogs} /> */}
      </div>
      
      <ChatFooter 
        currentStep={currentStep} 
        instructions={instructions} 
        isSpeaking={isSpeaking} 
      />
      
      {/* {showInitialSetup && (
        <InitialSetup
          onSetupComplete={handleInitialSetupComplete}
          onOpenSimpleBrowserControl={handleOpenSimpleBrowserControl}
        />
      )} */}
      
      {/* {showApiConfig && (
        <ApiConfig
          onApiConfigured={handleApiConfigured}
          onClose={() => setShowApiConfig(false)}
        />
      )} */}
      
      {/* {showWorkflowSelector && (
        <WorkflowSelector
          onWorkflowSelected={handleWorkflowSelected}
          onClose={() => setShowWorkflowSelector(false)}
          apiConfig={apiConfig}
        />
      )} */}
      
      {showBrowserMonitor && (
        <BrowserMonitor
          onDataReceived={handleBrowserMonitorData}
          onClose={() => setShowBrowserMonitor(false)}
        />
      )}

      {showSimpleBrowserControl && (
        <SimpleBrowserControl
          onClose={handleCloseSimpleBrowserControl}
        />
      )}

      {showExerciseManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Gestor de Ejercicios Dinámicos</h2>
              <button
                onClick={() => setShowExerciseManager(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <ExerciseManager
              exercises={[]}
              onAddExercise={() => {}}
              onRemoveExercise={() => {}}
              onUpdateExercise={() => {}}
              onGenerateFromVideo={() => {}}
            />
          </div>
        </div>
      )}

      {showServerStatus && (
        <ServerStatus
          isVisible={showServerStatus}
          onClose={handleCloseServerStatus}
        />
      )}

      {showTriggersWorkflow && (
        <TriggersWorkflow
          isVisible={showTriggersWorkflow}
          onClose={handleCloseTriggersWorkflow}
        />
      )}

      {showExerciseSelector && (
        <ExerciseSelector
          onExerciseSelected={handleExerciseSelected}
          onClose={() => setShowExerciseSelector(false)}
        />
      )}

      {showExerciseGuide && currentExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ExerciseGuide
            exercise={currentExercise}
            onComplete={handleExerciseComplete}
            onClose={() => setShowExerciseGuide(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ChatBox; 