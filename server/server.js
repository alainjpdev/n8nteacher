const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const axios = require('axios');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// n8n Configuration
const N8N_BASE_URL = 'https://algorithmicsaischool.app.n8n.cloud/api/v1';
const N8N_API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMjc4M2MxZS0xYzM0LTQ2NjUtYTQ4Yy1hYzI3NjAwMmI2OTZiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0MzQ1NjYwLCJleHAiOjE3NTY4NzU2MDB9.VhIvqxdybx9185cNplJrMMQcru02cPYBSaYNx4zBVb0';

// Configuración de monitoreo específico
let TARGET_WORKFLOW_ID = null; // Cambia a un ID específico para monitorear solo ese workflow
// Ejemplo: TARGET_WORKFLOW_ID = '0o5pJ8V3SCYCNJnF';

// Store connected clients
const clients = new Set();

// n8n monitoring state
let isMonitoring = false;
let monitoringInterval = null;
let lastWorkflowCount = 0;
let lastExecutionCount = 0;
let knownWorkflows = new Set();
let knownExecutions = new Set();

// Rate limiting variables
let lastApiCall = 0;
let consecutiveErrors = 0;
const MIN_API_INTERVAL = 30000; // 30 seconds minimum between API calls
const MAX_CONSECUTIVE_ERRORS = 3;

// Store workflow hashes for change detection
let workflowHashes = new Map();

// Generate hash for workflow content
function generateWorkflowHash(workflow) {
  const content = JSON.stringify({
    nodes: workflow.nodes,
    connections: workflow.connections,
    settings: workflow.settings,
    staticData: workflow.staticData
  });
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}

// Check for workflow content changes
async function checkWorkflowContentChanges(workflowId) {
  try {
    const response = await axios.get(`${N8N_BASE_URL}/workflows/${workflowId}`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200) {
      const workflow = response.data;
      const currentHash = generateWorkflowHash(workflow);
      const previousHash = workflowHashes.get(workflowId);
      
      if (previousHash && previousHash !== currentHash) {
        log('success', `Cambio detectado en contenido del workflow: ${workflow.name}`, {
          workflowId,
          workflowName: workflow.name,
          previousHash,
          currentHash,
          timestamp: new Date().toISOString()
        });
        
        // Analyze what changed
        const previousWorkflow = JSON.parse(JSON.stringify(workflow)); // Clone for comparison
        // You could add more detailed change analysis here
        
        log('info', `Análisis de cambios en workflow: ${workflow.name}`, {
          nodeCount: workflow.nodes ? workflow.nodes.length : 0,
          connectionCount: workflow.connections ? Object.keys(workflow.connections).length : 0
        });
      }
      
      workflowHashes.set(workflowId, currentHash);
    }
  } catch (error) {
    log('error', `Error verificando cambios de contenido en workflow ${workflowId}`, error.message);
  }
}

// Broadcast to all connected clients
function broadcast(message) {
  const messageStr = JSON.stringify(message);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

// Log function
function log(type, message, details = null) {
  const logEntry = {
    type,
    message,
    details,
    timestamp: new Date().toLocaleTimeString()
  };
  
  console.log(`[${type.toUpperCase()}] ${message}`, details);
  broadcast({
    type: 'log',
    data: logEntry
  });
}

// Test n8n connectivity
async function testN8nConnectivity() {
  try {
    log('info', 'Probando conectividad con n8n...');
    
    // Test basic connectivity
    const healthResponse = await axios.get('https://algorithmicsaischool.app.n8n.cloud/', {
      timeout: 5000
    });
    log('success', 'La URL de n8n es accesible');
    
    // Test API endpoint with authentication
    try {
      const apiResponse = await axios.get(`${N8N_BASE_URL}/workflows`, {
        headers: {
          'X-N8N-API-KEY': N8N_API_TOKEN,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      if (apiResponse.status === 200) {
        // Check if we can parse the response correctly
        const workflows = apiResponse.data.data || apiResponse.data;
        const workflowsArray = Array.isArray(workflows) ? workflows : [];
        
        log('success', 'Autenticación con n8n exitosa');
        log('info', `Workflows disponibles: ${workflowsArray.length}`);
        
        return true;
      }
    } catch (apiError) {
      if (apiError.response) {
        log('error', `Error de autenticación n8n - Status: ${apiError.response.status}`, {
          status: apiError.response.status,
          statusText: apiError.response.statusText
        });
        
        if (apiError.response.status === 401) {
          log('error', 'Token de API inválido o expirado');
        } else if (apiError.response.status === 403) {
          log('error', 'Acceso denegado - Verificar permisos del token');
        }
      } else {
        log('error', 'Error de conexión con la API de n8n', apiError.message);
      }
    }
    
    return false;
  } catch (error) {
    log('error', 'No se pudo conectar con n8n', error.message);
    return false;
  }
}

// Check n8n workflows and executions
async function checkN8nChanges() {
  try {
    // Rate limiting check
    const now = Date.now();
    if (now - lastApiCall < MIN_API_INTERVAL) {
      log('info', 'Rate limiting: esperando antes de hacer otra llamada a la API');
      return;
    }
    
    // Check for too many consecutive errors
    if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
      log('warning', `Demasiados errores consecutivos (${consecutiveErrors}). Pausando monitoreo por 5 minutos.`);
      consecutiveErrors = 0;
      return;
    }
    
    lastApiCall = now;
    
    if (TARGET_WORKFLOW_ID) {
      // Monitoreo específico de un workflow
      log('info', `Monitoreando workflow específico: ${TARGET_WORKFLOW_ID}`);
      await checkSpecificWorkflow(TARGET_WORKFLOW_ID);
    } else {
      // Monitoreo general de todos los workflows
      log('info', 'Verificando cambios en workflows...');
      log('info', `URL de n8n: ${N8N_BASE_URL}`);
      
      const workflowsResponse = await axios.get(`${N8N_BASE_URL}/workflows`, {
        headers: {
          'X-N8N-API-KEY': N8N_API_TOKEN,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      log('info', `Respuesta de n8n - Status: ${workflowsResponse.status}`);
      log('info', `Tipo de respuesta: ${typeof workflowsResponse.data}`);
      log('info', `Estructura de respuesta: ${JSON.stringify(Object.keys(workflowsResponse.data))}`);
      
      // Check if response is HTML instead of JSON
      if (typeof workflowsResponse.data === 'string' && workflowsResponse.data.includes('<!DOCTYPE html>')) {
        log('error', 'La API de n8n devolvió HTML en lugar de JSON. Posible problema de autenticación o URL incorrecta.');
        log('info', 'Verificando conectividad de n8n...');
        await testN8nConnectivity();
        return;
      }
      
      // Handle the correct response structure
      const workflows = workflowsResponse.data.data || workflowsResponse.data;
      const workflowsArray = Array.isArray(workflows) ? workflows : [];
      const currentWorkflowCount = workflowsArray.length;
      
      log('info', `Workflows encontrados: ${currentWorkflowCount}`);
      
      // Log all workflows for debugging
      workflowsArray.forEach((workflow, index) => {
        log('info', `Workflow ${index + 1}: ${workflow.name || 'Sin nombre'} (ID: ${workflow.id}) - Estado: ${workflow.active ? 'Activo' : 'Inactivo'}`);
      });
      
      // Check for new workflows or status changes
      workflowsArray.forEach(workflow => {
        const workflowKey = `${workflow.id}-${workflow.active}`;
        
        if (!knownWorkflows.has(workflowKey)) {
          knownWorkflows.add(workflowKey);
          
          if (knownWorkflows.has(workflow.id)) {
            // Status change detected
            log('success', `Cambio de estado detectado: ${workflow.name || 'Sin nombre'}`, {
              workflowId: workflow.id,
              name: workflow.name,
              status: workflow.active ? 'Activado' : 'Desactivado',
              totalWorkflows: currentWorkflowCount
            });
          } else {
            // New workflow detected
            log('success', `Nuevo workflow detectado: ${workflow.name || 'Sin nombre'}`, {
              workflowId: workflow.id,
              name: workflow.name,
              status: workflow.active ? 'Activo' : 'Inactivo',
              totalWorkflows: currentWorkflowCount
            });
          }
        }
      });
      
      // Check for deleted workflows
      const currentWorkflowIds = new Set(workflowsArray.map(w => w.id));
      const knownWorkflowIds = new Set();
      
      knownWorkflows.forEach(key => {
        const workflowId = key.split('-')[0];
        if (!currentWorkflowIds.has(workflowId)) {
          knownWorkflowIds.add(workflowId);
        }
      });
      
      if (knownWorkflowIds.size > 0) {
        log('warning', `Workflows eliminados detectados: ${Array.from(knownWorkflowIds).join(', ')}`);
        // Clean up deleted workflows from known set
        knownWorkflows.forEach(key => {
          const workflowId = key.split('-')[0];
          if (!currentWorkflowIds.has(workflowId)) {
            knownWorkflows.delete(key);
          }
        });
      }
      
      // Check executions for each workflow
      if (workflowsArray.length > 0) {
        log('info', 'Verificando ejecuciones de workflows...');
        
        for (const workflow of workflowsArray.slice(0, 5)) {
          if (workflow && workflow.id) {
            await checkWorkflowExecutions(workflow.id);
          }
        }
      }
      
      lastWorkflowCount = currentWorkflowCount;
      consecutiveErrors = 0; // Reset error counter on success
    }
    
  } catch (error) {
    console.error('Error checking n8n changes:', error);
    consecutiveErrors++;
    
    if (error.response) {
      log('error', `Error de API n8n - Status: ${error.response.status}`, {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        consecutiveErrors
      });
    } else if (error.request) {
      log('error', 'No se pudo conectar con n8n - Error de red', {
        message: error.message,
        consecutiveErrors
      });
    } else {
      log('error', 'Error al verificar cambios', {
        message: error.message,
        consecutiveErrors
      });
    }
  }
}

// Check a specific workflow and its executions
async function checkSpecificWorkflow(workflowId) {
  try {
    log('info', `Monitoreando workflow específico: ${workflowId}`);
    
    // Get workflow details
    const workflowResponse = await axios.get(`${N8N_BASE_URL}/workflows/${workflowId}`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_TOKEN,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    if (workflowResponse.status === 200) {
      const workflow = workflowResponse.data;
      log('info', `Workflow: ${workflow.name || 'Sin nombre'} (ID: ${workflow.id}) - Estado: ${workflow.active ? 'Activo' : 'Inactivo'}`);
      
      // Check for status changes
      const workflowKey = `${workflow.id}-${workflow.active}`;
      if (!knownWorkflows.has(workflowKey)) {
        knownWorkflows.add(workflowKey);
        log('success', `Cambio de estado en workflow: ${workflow.name}`, {
          workflowId: workflow.id,
          name: workflow.name,
          status: workflow.active ? 'Activado' : 'Desactivado'
        });
      }
      
      // Check for content changes (nodes, connections, etc.)
      await checkWorkflowContentChanges(workflowId);
      
      // Check executions for this specific workflow
      await checkWorkflowExecutions(workflowId);
      consecutiveErrors = 0; // Reset error counter on success
    }
    
  } catch (error) {
    if (error.response && error.response.status === 404) {
      log('error', `Workflow ${workflowId} no encontrado`);
    } else {
      log('error', `Error al monitorear workflow ${workflowId}`, error.message);
    }
  }
}

// Check executions for a specific workflow
async function checkWorkflowExecutions(workflowId) {
  try {
    const response = await axios.get(`${N8N_BASE_URL}/workflows/${workflowId}/executions`, {
      headers: { 'X-N8N-API-KEY': N8N_API_TOKEN }
    });
    
    const executions = Array.isArray(response.data) ? response.data : [];
    const currentExecutionCount = executions.length;
    
    log('info', `Workflow ${workflowId}: ${currentExecutionCount} ejecuciones encontradas`);
    
    // Check for new executions
    executions.forEach(execution => {
      const executionKey = `${workflowId}-${execution.id}`;
      if (!knownExecutions.has(executionKey)) {
        knownExecutions.add(executionKey);
        log('success', `Nueva ejecución detectada`, {
          workflowId: workflowId,
          executionId: execution.id,
          status: execution.status,
          startedAt: execution.startedAt,
          finishedAt: execution.finishedAt
        });
      }
    });
    
    // Log latest execution for context
    if (currentExecutionCount > 0) {
      const latestExecution = executions[0];
      log('info', `Última ejecución del workflow ${workflowId}`, {
        status: latestExecution.status,
        startedAt: latestExecution.startedAt,
        finishedAt: latestExecution.finishedAt
      });
    }
    
    lastExecutionCount = currentExecutionCount;
    
  } catch (error) {
    console.error(`Error checking executions for workflow ${workflowId}:`, error);
    if (error.response && error.response.status === 404) {
      log('info', `Workflow ${workflowId}: No hay ejecuciones aún`);
    } else {
      log('error', `Error al verificar ejecuciones del workflow ${workflowId}`, error.message);
    }
  }
}

// Configure webhook for real-time workflow changes
async function configureWorkflowWebhook(workflowId) {
  try {
    log('info', `Configurando webhook para workflow: ${workflowId}`);
    
    // Get current workflow to check if it has webhook trigger
    const workflowResponse = await axios.get(`${N8N_BASE_URL}/workflows/${workflowId}`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    
    if (workflowResponse.status === 200) {
      const workflow = workflowResponse.data;
      log('info', `Workflow actual: ${workflow.name}`);
      
      // Check if workflow has webhook trigger
      const hasWebhookTrigger = workflow.nodes && workflow.nodes.some(node => 
        node.type === 'n8n-nodes-base.webhook'
      );
      
      if (hasWebhookTrigger) {
        log('success', `Workflow ${workflow.name} ya tiene trigger de webhook`);
        return true;
      } else {
        log('info', `Workflow ${workflow.name} no tiene webhook trigger. Agregando...`);
        
        // Add webhook trigger to workflow
        const webhookNode = {
          id: `webhook-${Date.now()}`,
          name: 'Webhook Trigger',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [240, 300],
          parameters: {
            httpMethod: 'POST',
            path: `workflow-changes-${workflowId}`,
            responseMode: 'responseNode',
            options: {}
          }
        };
        
        // Add webhook node to workflow
        workflow.nodes.push(webhookNode);
        
        // Update workflow
        const updateResponse = await axios.put(`${N8N_BASE_URL}/workflows/${workflowId}`, workflow, {
          headers: {
            'X-N8N-API-KEY': N8N_API_TOKEN,
            'Content-Type': 'application/json'
          }
        });
        
        if (updateResponse.status === 200) {
          log('success', `Webhook trigger agregado al workflow: ${workflow.name}`);
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    log('error', `Error configurando webhook para workflow ${workflowId}`, error.message);
    return false;
  }
}

// Monitor workflow changes via webhook
app.post('/webhook/workflow-changes/:workflowId', (req, res) => {
  const { workflowId } = req.params;
  const changeData = req.body;
  
  log('success', `Cambio detectado en workflow ${workflowId}`, {
    workflowId,
    changeType: changeData.changeType || 'unknown',
    timestamp: new Date().toISOString(),
    details: changeData
  });
  
  res.json({ success: true, message: 'Webhook recibido' });
});

// Start monitoring
function startMonitoring() {
  if (isMonitoring) {
    log('warning', 'El monitoreo ya está activo');
    return;
  }
  
  log('info', 'Iniciando monitoreo en tiempo real de n8n...');
  log('info', 'El sistema verificará workflows y ejecuciones cada 5 minutos');
  
  isMonitoring = true;
  monitoringInterval = setInterval(checkN8nChanges, 300000); // 5 minutos
  
  log('success', 'Monitoreo en tiempo real activado');
}

// Stop monitoring
function stopMonitoring() {
  if (!isMonitoring) {
    log('warning', 'El monitoreo no está activo');
    return;
  }
  
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }
  
  isMonitoring = false;
  log('info', 'Monitoreo en tiempo real detenido');
}

// WebSocket connection handler
wss.on('connection', (ws) => {
  // Limpiar conexiones anteriores del mismo cliente
  const clientId = ws._socket?.remoteAddress || 'unknown';
  console.log(`Nuevo cliente conectado desde: ${clientId}`);
  
  // Remover conexiones anteriores del mismo cliente
  for (const client of clients) {
    if (client._socket?.remoteAddress === clientId) {
      clients.delete(client);
      console.log('Conexión anterior removida');
    }
  }
  
  clients.add(ws);
  
  // Send current status
  try {
    ws.send(JSON.stringify({
      type: 'status',
      data: {
        isMonitoring,
        connectedClients: clients.size
      }
    }));
  } catch (error) {
    console.error('Error sending initial status:', error);
  }
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Mensaje recibido del cliente:', data);
      
      switch (data.action) {
        case 'start_monitoring':
          startMonitoring();
          break;
        case 'stop_monitoring':
          stopMonitoring();
          break;
        case 'get_status':
          try {
            ws.send(JSON.stringify({
              type: 'status',
              data: {
                isMonitoring,
                connectedClients: clients.size
              }
            }));
          } catch (error) {
            console.error('Error sending status response:', error);
          }
          break;
        default:
          console.log('Acción desconocida:', data.action);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
  
  ws.on('close', (code, reason) => {
    console.log('Cliente desconectado', { code, reason: reason.toString() });
    clients.delete(ws);
  });
  
  ws.on('error', (error) => {
    console.error('Error en WebSocket:', error);
    clients.delete(ws);
  });
  
  // Handle ping/pong for connection health
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });
});

// Heartbeat interval to keep connections alive
const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log('Terminando conexión inactiva');
      return ws.terminate();
    }
    
    ws.isAlive = false;
    try {
      ws.ping();
    } catch (error) {
      console.error('Error en ping:', error);
    }
  });
}, 30000); // 30 seconds

// Cleanup on server close
wss.on('close', () => {
  clearInterval(heartbeatInterval);
});

// API Routes
app.get('/api/status', (req, res) => {
  res.json({
    isMonitoring,
    connectedClients: clients.size,
    targetWorkflowId: TARGET_WORKFLOW_ID,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/monitoring/start', (req, res) => {
  startMonitoring();
  res.json({ success: true, message: 'Monitoreo iniciado' });
});

app.post('/api/monitoring/stop', (req, res) => {
  stopMonitoring();
  res.json({ success: true, message: 'Monitoreo detenido' });
});

// List available workflows
app.get('/api/workflows', async (req, res) => {
  try {
    const response = await axios.get(`${N8N_BASE_URL}/workflows`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_TOKEN,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    const workflows = response.data.data || response.data;
    const workflowsArray = Array.isArray(workflows) ? workflows : [];
    
    const workflowList = workflowsArray.map(workflow => ({
      id: workflow.id,
      name: workflow.name || 'Sin nombre',
      active: workflow.active,
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt
    }));
    
    res.json({
      success: true,
      workflows: workflowList,
      total: workflowList.length
    });
    
  } catch (error) {
    console.error('Error fetching workflows:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener workflows'
    });
  }
});

// Set target workflow for monitoring
app.post('/api/target-workflow', (req, res) => {
  const { workflowId } = req.body;
  
  if (workflowId) {
    TARGET_WORKFLOW_ID = workflowId;
    log('info', `Workflow objetivo configurado: ${workflowId}`);
    res.json({ 
      success: true, 
      message: `Monitoreo configurado para workflow: ${workflowId}`,
      targetWorkflowId: TARGET_WORKFLOW_ID
    });
  } else {
    TARGET_WORKFLOW_ID = null;
    log('info', 'Monitoreo configurado para todos los workflows');
    res.json({ 
      success: true, 
      message: 'Monitoreo configurado para todos los workflows',
      targetWorkflowId: null
    });
  }
});

// Configure webhook for a specific workflow
app.post('/api/configure-webhook/:workflowId', async (req, res) => {
  try {
    const { workflowId } = req.params;
    const success = await configureWorkflowWebhook(workflowId);
    
    if (success) {
      res.json({ 
        success: true, 
        message: `Webhook configurado para workflow ${workflowId}`,
        webhookUrl: `http://localhost:3001/webhook/workflow-changes/${workflowId}`
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: `Error configurando webhook para workflow ${workflowId}` 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get current target workflow
app.get('/api/target-workflow', (req, res) => {
  res.json({ 
    targetWorkflowId: TARGET_WORKFLOW_ID,
    isMonitoring: isMonitoring
  });
});

app.get('/api/test-n8n', async (req, res) => {
  try {
    const isConnected = await testN8nConnectivity();
    res.json({ success: isConnected, message: isConnected ? 'Conexión exitosa' : 'Error de conexión', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message, timestamp: new Date().toISOString() });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Servidor de monitoreo n8n corriendo en puerto ${PORT}`);
  console.log(`📊 WebSocket disponible en ws://localhost:${PORT}`);
  console.log(`🔗 API disponible en http://localhost:${PORT}`);
}); 