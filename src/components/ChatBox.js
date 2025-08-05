import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ChatHeader from './ChatHeader';
import ChatContent from './ChatContent';
import ChatFooter from './ChatFooter';
import N8nLogs from './N8nLogs';
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
  const [n8nLogs, setN8nLogs] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState(null);

  const instructions = useMemo(() => [
    {
      title: "Ejercicio 1: Configuración Básica",
      content: "Crea un nuevo workflow en n8n. Configura un trigger de webhook que se active cuando recibas una petición POST con datos JSON.",
      duration: 8000,
      type: 'webhook',
      action: 'create_webhook_workflow'
    },
    {
      title: "Ejercicio 2: Procesamiento de Datos",
      content: "Agrega un nodo Set para procesar los datos recibidos. Extrae el email y nombre del JSON de entrada.",
      duration: 8000,
      type: 'data_processing',
      action: 'add_set_node'
    },
    {
      title: "Ejercicio 3: Validación",
      content: "Implementa un nodo IF para validar que el email tenga un formato correcto antes de continuar.",
      duration: 8000,
      type: 'validation',
      action: 'add_validation_node'
    },
    {
      title: "Ejercicio 4: Almacenamiento",
      content: "Agrega un nodo PostgreSQL para guardar los datos validados en una base de datos.",
      duration: 8000,
      type: 'database',
      action: 'add_database_node'
    },
    {
      title: "Ejercicio 5: Notificaciones",
      content: "Configura un nodo Email para enviar una notificación de confirmación al usuario.",
      duration: 8000,
      type: 'notification',
      action: 'add_email_node'
    },
    {
      title: "Ejercicio 6: Pruebas",
      content: "Ejecuta el workflow completo con datos de prueba para verificar que todo funcione correctamente.",
      duration: 8000,
      type: 'testing',
      action: 'test_workflow'
    }
  ], []);

  // n8n Log callback
  const handleN8nLog = useCallback((logEntry) => {
    setN8nLogs(prevLogs => {
      const newLogs = [...prevLogs, logEntry];
      // Keep only last 50 logs to prevent memory issues
      return newLogs.slice(-50);
    });
  }, []);

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
      }
    }
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
        n8nMonitorService.setLogCallback(handleN8nLog);
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
  }, [handleN8nLog, handleN8nStatus]);

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
        
        {/* n8n Logs Section */}
        <N8nLogs logs={n8nLogs} />
      </div>
      
      <ChatFooter 
        currentStep={currentStep} 
        instructions={instructions} 
        isSpeaking={isSpeaking} 
      />
    </div>
  );
};

export default ChatBox; 