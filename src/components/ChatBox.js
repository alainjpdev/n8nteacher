import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ChatHeader from './ChatHeader';
import ChatContent from './ChatContent';
import ChatFooter from './ChatFooter';
import ApiConfig from './ApiConfig';
import WorkflowSelector from './WorkflowSelector';
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

  const instructions = useMemo(() => [
    {
      title: "Ejercicio 1: Configurar Credenciales de OpenAI",
      content: "Abre el workflow 'Agente para Principiantes' en n8n. Ve al nodo 'OpenAI Chat Model' y configura las credenciales de OpenAI. Necesitarás tu API key de OpenAI para que el agente funcione correctamente.",
      duration: 10000,
      type: 'credentials',
      action: 'configure_openai_credentials'
    },
    {
      title: "Ejercicio 2: Configurar Credenciales de Gmail",
      content: "En el mismo workflow, ve al nodo 'Gmail' y configura las credenciales de Gmail. Esto permitirá que el agente envíe emails automáticamente cuando reciba formularios.",
      duration: 10000,
      type: 'credentials',
      action: 'configure_gmail_credentials'
    },
    {
      title: "Ejercicio 3: Activar el Workflow",
      content: "Una vez configuradas las credenciales, activa el workflow 'Agente para Principiantes' haciendo clic en el botón de activación. Esto hará que el agente esté listo para recibir formularios.",
      duration: 8000,
      type: 'activation',
      action: 'activate_workflow'
    },
    {
      title: "Ejercicio 4: Probar el Formulario",
      content: "Ve a la URL del formulario web del workflow y llena el formulario con datos de prueba. Esto activará el agente y deberías recibir un email de respuesta automática.",
      duration: 10000,
      type: 'testing',
      action: 'test_form'
    },
    {
      title: "Ejercicio 5: Monitorear Ejecuciones",
      content: "En n8n, ve a la pestaña 'Executions' para ver las ejecuciones del workflow. Aquí podrás ver si el agente está procesando correctamente los formularios y enviando emails.",
      duration: 8000,
      type: 'monitoring',
      action: 'monitor_executions'
    },
    {
      title: "Ejercicio 6: Personalizar el Agente",
      content: "Modifica el prompt del nodo 'AI Agent' para personalizar las respuestas del agente. Puedes cambiar el tono, agregar más información o modificar la lógica de respuesta según tus necesidades.",
      duration: 12000,
      type: 'customization',
      action: 'customize_agent'
    }
  ], []);

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
          setN8nError('Error de conexión con el servidor');
          break;
        case 'disconnected':
          setN8nError('Desconectado del servidor');
          break;
        default:
          // Handle any other status
          break;
      }
    }
  }, []);

  // Check for saved API configuration on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('n8n_api_token');
    const savedUrl = localStorage.getItem('n8n_base_url');
    const savedWorkflowId = localStorage.getItem('selected_workflow_id');
    const savedWorkflowName = localStorage.getItem('selected_workflow_name');
    
    if (savedToken && savedUrl) {
      const config = { n8nApiToken: savedToken, n8nBaseUrl: savedUrl };
      setApiConfig(config);
      setApiConfigured(true);
      
      // Send saved configuration to backend
      console.log('🔄 Enviando configuración guardada al backend...');
      if (window.WebSocket && n8nMonitorService) {
        n8nMonitorService.updateApiConfig(config);
      }
      
      // Check if workflow is also configured
      if (savedWorkflowId && savedWorkflowName) {
        setSelectedWorkflow({ 
          id: savedWorkflowId, 
          name: savedWorkflowName 
        });
        setWorkflowConfigured(true);
      } else {
        // API configured but no workflow selected - wait for backend config to apply
        console.log('⏳ Esperando configuración del backend...');
        setTimeout(() => {
          setShowWorkflowSelector(true);
        }, 2000); // Increased wait time for backend config
      }
    } else {
      // No API configuration
      console.log('🔐 No hay configuración guardada, mostrando modal de configuración');
      setShowApiConfig(true);
    }
  }, []);

  // API Configuration handlers
  const handleApiConfigured = useCallback((config) => {
    setApiConfig(config);
    setApiConfigured(true);
    setShowApiConfig(false);
    
    // Send API config to backend
    if (window.WebSocket && n8nMonitorService) {
      n8nMonitorService.updateApiConfig(config);
    }
    
    // After API is configured, show workflow selector if no workflow is selected
    const savedWorkflowId = localStorage.getItem('selected_workflow_id');
    if (!savedWorkflowId) {
      // Wait a moment for the API config to propagate to the backend
      setTimeout(() => {
        setShowWorkflowSelector(true);
      }, 1000);
    }
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

  // Initialize n8n Monitor connection
  useEffect(() => {
    const initializeN8n = async () => {
      setN8nLoading(true);
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
          setN8nError('No se pudo conectar al workflow');
        }
      } catch (err) {
        setN8nError('Failed to initialize n8n Monitor connection');
        console.error('n8n Monitor Init Error:', err);
      } finally {
        setN8nLoading(false);
      }
    };

    initializeN8n();
  }, [handleN8nStatus]);

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
        />
        
        {/* n8n Logs Section - Oculto */}
        {/* <N8nLogs logs={n8nLogs} /> */}
      </div>
      
      <ChatFooter 
        currentStep={currentStep} 
        instructions={instructions} 
        isSpeaking={isSpeaking} 
      />
      
      {showApiConfig && (
        <ApiConfig
          onApiConfigured={handleApiConfigured}
          onClose={() => setShowApiConfig(false)}
        />
      )}
      
      {showWorkflowSelector && (
        <WorkflowSelector
          onWorkflowSelected={handleWorkflowSelected}
          onClose={() => setShowWorkflowSelector(false)}
          apiConfig={apiConfig}
        />
      )}
    </div>
  );
};

export default ChatBox; 