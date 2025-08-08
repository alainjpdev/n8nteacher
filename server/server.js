require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5678'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'X-N8N-API-KEY',
    'Accept',
    'Origin'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Additional CORS handling for preflight requests
app.options('*', cors(corsOptions));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'running',
    timestamp: new Date().toISOString(),
    services: {
      server: 'running',
      n8n: global.N8N_BASE_URL ? 'configured' : 'not_configured',
      browser: browserProcess && !browserProcess.killed ? 'running' : 'stopped'
    }
  });
});

// API endpoints
app.post('/api/config', (req, res) => {
  try {
    const { baseURL, apiToken, workflowId } = req.body;
    
    if (baseURL) {
      global.N8N_BASE_URL = baseURL;
      console.log(`🔧 URL de n8n actualizada: ${baseURL}`);
    }
    
    if (apiToken) {
      global.N8N_API_TOKEN = apiToken;
      console.log(`🔧 Token de API actualizado: ${apiToken.substring(0, 20)}...`);
    }
    
    if (workflowId) {
      global.TARGET_WORKFLOW_ID = workflowId;
      console.log(`🔧 Workflow ID actualizado: ${workflowId}`);
    }
    
    res.json({
      success: true,
      message: 'Configuración actualizada correctamente',
      config: {
        baseURL: global.N8N_BASE_URL,
        workflowId: global.TARGET_WORKFLOW_ID,
        hasToken: !!global.N8N_API_TOKEN
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error actualizando configuración',
      error: error.message
    });
  }
});

app.get('/api/config', (req, res) => {
  res.json({
    success: true,
    config: {
      baseURL: global.N8N_BASE_URL,
      workflowId: global.TARGET_WORKFLOW_ID,
      hasToken: !!global.N8N_API_TOKEN
    }
  });
});

// Custom middleware to handle X-N8N-API-KEY header
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-N8N-API-KEY, Accept, Origin');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// n8n Configuration from environment variables
global.N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678/api/v1';
global.N8N_API_TOKEN = null; // No token por defecto - se configurará desde el frontend
global.TARGET_WORKFLOW_ID = null; // No workflow por defecto

// Validate required environment variables (optional for first-time setup)
console.log('🔧 Configuración inicial:');
console.log(`   📡 URL: ${global.N8N_BASE_URL}`);
console.log(`   🔑 Token: No configurado - se configurará desde el frontend`);
console.log(`   📋 Workflow ID: No configurado - se seleccionará desde el frontend`);
console.log('💡 La aplicación pedirá el token en el frontend');

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
    const response = await axios.get(`${global.N8N_BASE_URL}/workflows/${workflowId}`, {
      headers: {
        'X-N8N-API-KEY': global.N8N_API_TOKEN,
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
    const healthResponse = await axios.get('http://localhost:5678/', {
      timeout: 5000
    });
    log('success', 'La URL de n8n es accesible');
    
    // Test API endpoint with authentication
    try {
      const apiResponse = await axios.get(`${global.N8N_BASE_URL}/workflows`, {
        headers: {
          'X-N8N-API-KEY': global.N8N_API_TOKEN,
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
    
    if (global.TARGET_WORKFLOW_ID) {
      // Monitoreo específico de un workflow
      log('info', `Monitoreando workflow específico: ${global.TARGET_WORKFLOW_ID}`);
      await checkSpecificWorkflow(global.TARGET_WORKFLOW_ID);
    } else {
      // Monitoreo general de todos los workflows
      log('info', 'Verificando cambios en workflows...');
      log('info', `URL de n8n: ${global.N8N_BASE_URL}`);
      
      const workflowsResponse = await axios.get(`${global.N8N_BASE_URL}/workflows`, {
        headers: {
          'X-N8N-API-KEY': global.N8N_API_TOKEN,
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
    const workflowResponse = await axios.get(`${global.N8N_BASE_URL}/workflows/${workflowId}`, {
      headers: {
        'X-N8N-API-KEY': global.N8N_API_TOKEN,
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
    const response = await axios.get(`${global.N8N_BASE_URL}/workflows/${workflowId}/executions`, {
      headers: { 'X-N8N-API-KEY': global.N8N_API_TOKEN }
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
    const workflowResponse = await axios.get(`${global.N8N_BASE_URL}/workflows/${workflowId}`, {
      headers: {
        'X-N8N-API-KEY': global.N8N_API_TOKEN,
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
        const updateResponse = await axios.put(`${global.N8N_BASE_URL}/workflows/${workflowId}`, workflow, {
          headers: {
            'X-N8N-API-KEY': global.N8N_API_TOKEN,
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
  
  // Solo iniciar si hay token configurado
  if (!global.N8N_API_TOKEN) {
    log('warning', 'No se puede iniciar monitoreo: Token no configurado');
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
    targetWorkflowId: global.TARGET_WORKFLOW_ID,
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
    const response = await axios.get(`${global.N8N_BASE_URL}/workflows`, {
      headers: {
        'X-N8N-API-KEY': global.N8N_API_TOKEN,
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
    global.TARGET_WORKFLOW_ID = workflowId;
    log('info', `Workflow objetivo configurado: ${workflowId}`);
    res.json({ 
      success: true, 
      message: `Monitoreo configurado para workflow: ${workflowId}`,
      targetWorkflowId: global.TARGET_WORKFLOW_ID
    });
  } else {
    global.TARGET_WORKFLOW_ID = null;
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

// Endpoint to get list of workflows (must be before parameterized route)
app.get('/api/workflows/list', async (req, res) => {
  try {
    console.log('📋 Obteniendo lista de workflows...');
    
    if (!global.N8N_API_TOKEN || !global.N8N_BASE_URL) {
      return res.status(400).json({ 
        error: 'API de n8n no configurada. Configure primero el token de API.',
        needsConfig: true
      });
    }
    
    const response = await axios.get(`${global.N8N_BASE_URL}/workflows`, {
      headers: { 'X-N8N-API-KEY': global.N8N_API_TOKEN },
      timeout: 10000
    });
    
    if (response.status === 200) {
      const workflows = response.data.data || [];
      console.log(`✅ ${workflows.length} workflows encontrados`);
      
      // Formatear datos para el frontend
      const formattedWorkflows = workflows.map(workflow => ({
        id: workflow.id,
        name: workflow.name,
        active: workflow.active,
        nodes: workflow.nodes,
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt
      }));
      
      res.json({
        success: true,
        workflows: formattedWorkflows,
        count: formattedWorkflows.length
      });
    } else {
      throw new Error('Error al obtener workflows de n8n');
    }
    
  } catch (error) {
    console.error('❌ Error obteniendo workflows:', error.message);
    
    if (error.response?.status === 401) {
      res.status(401).json({ 
        error: 'Token de API inválido',
        needsConfig: true
      });
    } else {
      res.status(500).json({ 
        error: 'Error al conectar con n8n: ' + error.message
      });
    }
  }
});

// Proxy endpoint for frontend to get workflow details
app.get('/api/workflows/:workflowId', async (req, res) => {
  try {
    const { workflowId } = req.params;
    
    console.log(`🔍 Intentando obtener workflow: ${workflowId}`);
    console.log(`📡 URL: ${global.N8N_BASE_URL}/workflows/${workflowId}`);
    console.log(`🔑 Token: ${global.N8N_API_TOKEN ? 'Configurado' : 'No configurado'}`);
    
    if (!global.N8N_API_TOKEN) {
      return res.status(500).json({
        success: false,
        error: 'Token de API no configurado',
        message: 'Configura el token de API de n8n primero'
      });
    }
    
    const response = await axios.get(`${global.N8N_BASE_URL}/workflows/${workflowId}`, {
      headers: {
        'X-N8N-API-KEY': global.N8N_API_TOKEN,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log(`✅ Workflow obtenido exitosamente: ${workflowId}`);
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error fetching workflow:', error.message);
    console.error('📊 Detalles del error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      res.status(401).json({ 
        success: false, 
        message: 'Token de API inválido o expirado',
        error: 'Unauthorized - Invalid API token'
      });
    } else if (error.response?.status === 404) {
      res.status(404).json({ 
        success: false, 
        message: 'Workflow no encontrado',
        error: 'Workflow not found'
      });
    } else if (error.code === 'ECONNREFUSED') {
      res.status(503).json({ 
        success: false, 
        message: 'n8n no está disponible',
        error: 'n8n service unavailable'
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: error.message,
        message: 'Error al obtener workflow'
      });
    }
  }
});

// Endpoint to validate API configuration
app.post('/api/config/validate', async (req, res) => {
  try {
    const { n8nBaseUrl, n8nApiToken } = req.body;
    
    if (!n8nApiToken) {
      return res.status(400).json({ error: 'Token de API requerido' });
    }
    
    if (!n8nBaseUrl) {
      return res.status(400).json({ error: 'URL base de n8n requerida' });
    }
    
    // Validate the configuration by testing the connection
    const testUrl = n8nBaseUrl.endsWith('/api/v1') ? n8nBaseUrl : `${n8nBaseUrl}/api/v1`;
    
    // First, check if n8n is available
    try {
      const healthUrl = n8nBaseUrl.endsWith('/api/v1') ? n8nBaseUrl.replace('/api/v1', '') : n8nBaseUrl;
      const healthResponse = await axios.get(`${healthUrl}/healthz`, { timeout: 5000 });
      
      if (healthResponse.status !== 200) {
        throw new Error('n8n no está disponible en esta URL');
      }
    } catch (error) {
      console.log('Health check failed:', error.message);
      return res.status(400).json({ 
        error: 'n8n no está disponible en esta URL. Verifica que n8n esté funcionando.',
        details: error.message
      });
    }
    
    // Then, test the API token
    try {
      const apiResponse = await axios.get(`${testUrl}/workflows`, {
        headers: { 'X-N8N-API-KEY': n8nApiToken },
        timeout: 10000
      });
      
      if (apiResponse.status === 200) {
        // Configuration is valid, update it
        global.N8N_BASE_URL = testUrl;
        global.N8N_API_TOKEN = n8nApiToken;
        
        console.log(`✅ Configuración validada y actualizada:`);
        console.log(`   📡 URL base: ${global.N8N_BASE_URL}`);
        console.log(`   🔑 Token: ${n8nApiToken.substring(0, 20)}...`);
        
        // Broadcast configuration update to WebSocket clients
        const message = JSON.stringify({
          type: 'config_updated',
          message: 'Configuración de API actualizada',
          timestamp: new Date().toISOString()
        });
        
        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
        
        res.json({ 
          success: true, 
          message: 'Configuración válida y actualizada',
          workflowCount: apiResponse.data?.data?.length || 0
        });
      } else {
        throw new Error('Token de API inválido');
      }
    } catch (error) {
      console.log('API validation failed:', error.message);
      if (error.response?.status === 401) {
        return res.status(400).json({ error: 'Token de API inválido' });
      } else {
        return res.status(400).json({ 
          error: 'Error al conectar con la API de n8n',
          details: error.message
        });
      }
    }
    
  } catch (error) {
    console.error('Error validando configuración:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Endpoint to update target workflow
app.post('/api/workflow/select', (req, res) => {
  try {
    const { workflowId, workflowName } = req.body;
    
    if (!workflowId) {
      return res.status(400).json({ error: 'ID de workflow requerido' });
    }
    
    // Update target workflow globally
    TARGET_WORKFLOW_ID = workflowId;
    
    console.log(`🎯 Workflow objetivo actualizado:`);
    console.log(`   📋 ID: ${workflowId}`);
    console.log(`   📝 Nombre: ${workflowName || 'Sin nombre'}`);
    
    // Reset monitoring state when changing workflow
    isMonitoring = false;
    lastWorkflowCount = 0;
    lastExecutionCount = 0;
    knownWorkflows.clear();
    knownExecutions.clear();
    workflowHashes.clear();
    
    // Broadcast workflow change to WebSocket clients
    const message = JSON.stringify({
      type: 'workflow_selected',
      workflowId: workflowId,
      workflowName: workflowName,
      message: `Workflow seleccionado: ${workflowName}`,
      timestamp: new Date().toISOString()
    });
    
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Workflow objetivo actualizado',
      workflowId: workflowId,
      workflowName: workflowName
    });
    
  } catch (error) {
    console.error('Error actualizando workflow objetivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Apply nodes from JSON file to the currently selected (empty) workflow
app.post('/api/workflow/apply-from-file', async (req, res) => {
  try {
    if (!TARGET_WORKFLOW_ID) {
      return res.status(400).json({ success: false, message: 'No hay workflow objetivo seleccionado' });
    }

    const fileRelPath = req.body?.filePath || 'json-files/clase1/manualtriger.json';
    const filePath = path.join(__dirname, '..', fileRelPath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: `Archivo no encontrado: ${fileRelPath}` });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(fileContent);

    // Fetch current workflow
    const wfUrl = `${global.N8N_BASE_URL}/workflows/${TARGET_WORKFLOW_ID}`;
    const headers = { 'X-N8N-API-KEY': global.N8N_API_TOKEN };
    const current = await axios.get(wfUrl, { headers });

    const currentData = current.data?.data || current.data;
    const isEmpty = !currentData?.nodes || currentData.nodes.length === 0;

    // Build payload: only use nodes/connections from file
    const payload = {
      name: currentData?.name || json?.name || 'Clase 1',
      nodes: json.nodes || [],
      connections: json.connections || {},
      settings: { ...(currentData?.settings || {}), ...(json?.settings || {}) },
      pinData: json.pinData || {},
      tags: currentData?.tags || []
    };

    // Update workflow (even if not empty, we follow user instruction to apply)
    const updateRes = await axios.patch(wfUrl, payload, { headers });

    return res.json({ success: true, message: 'Workflow actualizado con nodos del archivo', appliedNodes: payload.nodes?.length || 0, workflowId: TARGET_WORKFLOW_ID, data: updateRes.data });
  } catch (error) {
    console.error('❌ Error aplicando nodos desde archivo:', error.response?.data || error.message);
    return res.status(500).json({ success: false, message: 'Error aplicando nodos desde archivo', error: error.response?.data || error.message });
  }
});

// Endpoint to update API configuration
app.post('/api/config/update', (req, res) => {
  try {
    const { n8nBaseUrl, n8nApiToken } = req.body;
    
    if (!n8nApiToken) {
      return res.status(400).json({ error: 'Token de API requerido' });
    }
    
    if (!n8nBaseUrl) {
      return res.status(400).json({ error: 'URL base de n8n requerida' });
    }
    
    // Update global configuration
    global.N8N_BASE_URL = n8nBaseUrl.endsWith('/api/v1') ? n8nBaseUrl : `${n8nBaseUrl}/api/v1`;
    global.N8N_API_TOKEN = n8nApiToken;
    
    console.log(`🔧 Configuración actualizada:`);
    console.log(`   📡 URL base: ${global.N8N_BASE_URL}`);
    console.log(`   🔑 Token: ${n8nApiToken.substring(0, 20)}...`);
    
    // Broadcast configuration update to WebSocket clients
    const message = JSON.stringify({
      type: 'config_updated',
      message: 'Configuración de API actualizada',
      timestamp: new Date().toISOString()
    });
    
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Configuración actualizada correctamente',
      config: {
        baseUrl: global.N8N_BASE_URL,
        tokenLength: n8nApiToken.length
      }
    });
    
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Debug endpoint to check global configuration
app.get('/debug/config', (req, res) => {
  res.json({
    hasApiToken: !!global.N8N_API_TOKEN,
    hasBaseUrl: !!global.N8N_BASE_URL,
    tokenLength: global.N8N_API_TOKEN ? global.N8N_API_TOKEN.length : 0,
    baseUrl: global.N8N_BASE_URL || 'No configurado',
    targetWorkflowId: TARGET_WORKFLOW_ID || 'No configurado',
    timestamp: new Date().toISOString()
  });
});

// Variable global para rastrear el proceso del navegador
let browserProcess = null;

// Endpoint para verificar si hay un navegador activo
app.get('/api/browser-status', (req, res) => {
  try {
    const isActive = browserProcess && !browserProcess.killed;
    
    res.json({
      success: true,
      isActive: isActive,
      active: isActive,
      message: isActive ? 'Navegador activo' : 'No hay navegador activo'
    });
  } catch (error) {
    console.error('❌ Error verificando estado del navegador:', error);
    res.status(500).json({
      success: false,
      message: 'Error verificando estado del navegador',
      error: error.message
    });
  }
});

// Endpoint para ejecutar el script Python del browser
app.post('/api/execute-browser-script', (req, res) => {
  try {
    const { action } = req.body;
    
    if (action === 'start') {
      // Verificar si ya hay un navegador activo
      if (browserProcess && !browserProcess.killed) {
        console.log('⚠️ Ya hay un navegador activo');
        return res.status(409).json({
          success: false,
          message: 'Ya hay un navegador activo. Cierra el navegador actual antes de abrir uno nuevo.',
          isActive: true
        });
      }
      
      console.log('🚀 Ejecutando script Python para abrir browser...');
      
      // Ejecutar el script Python en segundo plano
      const { spawn } = require('child_process');
      const path = require('path');
      
      // Ruta al script Python
      const scriptPath = path.join(__dirname, '../browser-monitor/simple_browser_control.py');
      
      console.log(`📁 Ejecutando script: ${scriptPath}`);
      
      browserProcess = spawn('python3', [scriptPath], {
        cwd: path.join(__dirname, '../browser-monitor'),
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      // Capturar output
      browserProcess.stdout.on('data', (data) => {
        console.log(`📊 Browser Script: ${data.toString().trim()}`);
      });
      
      browserProcess.stderr.on('data', (data) => {
        console.error(`❌ Browser Script Error: ${data.toString().trim()}`);
      });
      
      browserProcess.on('close', (code) => {
        console.log(`✅ Browser Script terminado con código: ${code}`);
        browserProcess = null; // Limpiar referencia cuando termina
      });
      
      res.json({
        success: true,
        message: 'Script Python iniciado correctamente',
        action: 'start'
      });
      
    } else if (action === 'stop') {
      console.log('🛑 Deteniendo script Python...');
      
      if (browserProcess && !browserProcess.killed) {
        browserProcess.kill('SIGTERM');
        browserProcess = null;
        console.log('✅ Proceso del navegador terminado');
      }
      
      res.json({
        success: true,
        message: 'Script Python detenido',
        action: 'stop'
      });
      
    } else {
      res.status(400).json({
        success: false,
        message: 'Acción no válida',
        validActions: ['start', 'stop']
      });
    }
    
  } catch (error) {
    console.error('❌ Error ejecutando script Python:', error);
    res.status(500).json({
      success: false,
      message: 'Error ejecutando script Python',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Servidor de monitoreo n8n corriendo en puerto ${PORT}`);
  console.log(`📊 WebSocket disponible en ws://localhost:${PORT}`);
  console.log(`🔗 API disponible en http://localhost:${PORT}`);
}); 