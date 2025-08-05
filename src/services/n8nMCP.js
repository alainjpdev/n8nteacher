import axios from 'axios';

class N8nMCPService {
  constructor() {
    this.baseURL = '/api/v1'; // Use relative URL for proxy
    this.apiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMjc4M2MxZS0xYzM0LTQ2NjUtYTQ4Yy1hYzI3NjAwMmI2OTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0MzQxMzY2LCJleHAiOjE3NTY4NzU2MDB9.nsmSysDs7tv-sYdtDa_Kir3dnTysylUgZ1aVX_EH5_Q';
    this.isAuthenticated = false;
    this.corsError = false;
    this.logCallback = null;
    this.pollingInterval = null;
    this.lastWorkflowCount = 0;
    this.lastExecutionCount = 0;
    this.activeWorkflows = new Set();
  }

  // Set log callback function
  setLogCallback(callback) {
    this.logCallback = callback;
  }

  // Emit log message
  emitLog(type, message, details = null) {
    const logEntry = {
      type, // 'info', 'success', 'error', 'warning'
      message,
      details,
      timestamp: new Date().toLocaleTimeString()
    };
    
    if (this.logCallback) {
      this.logCallback(logEntry);
    }
    
    console.log(`n8n MCP [${type.toUpperCase()}]:`, message, details);
  }

  // Initialize connection to n8n
  async initialize() {
    try {
      this.emitLog('info', 'Iniciando conexión con n8n...');
      
      // Clear any existing session to force re-authentication
      localStorage.removeItem('n8n_session');
      
      // Try to authenticate with API key
      const authenticated = await this.authenticateWithToken();
      if (authenticated) {
        this.isAuthenticated = true;
        localStorage.setItem('n8n_session', 'true');
        this.emitLog('success', 'Autenticación exitosa con n8n');
        console.log('n8n MCP: Authenticated with API key');
        
        // Don't start monitoring automatically, let user control it
        // this.startRealTimeMonitoring();
        
        return true;
      }
      
      return false;
    } catch (error) {
      this.emitLog('error', 'Error durante la inicialización', error.message);
      console.error('n8n MCP: Initialization error:', error);
      return false;
    }
  }

  // Authenticate with API key
  async authenticateWithToken() {
    try {
      this.emitLog('info', 'Verificando token de API...');
      
      // Test the token by making a simple API call
      const response = await axios.get(`${this.baseURL}/workflows`, {
        headers: {
          'X-N8N-API-KEY': this.apiToken,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.status === 200) {
        this.emitLog('success', 'Token de API válido', `Status: ${response.status}`);
        console.log('n8n MCP: API key authentication successful');
        this.corsError = false;
        return true;
      }
      return false;
    } catch (error) {
      console.error('n8n MCP: API key authentication failed:', error);
      
      // Check if it's a CORS error
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        this.corsError = true;
        this.emitLog('warning', 'Error de CORS detectado', 'Los navegadores bloquean conexiones directas por seguridad');
        console.error('n8n MCP: CORS error detected - using fallback mode');
        return false;
      }
      
      this.emitLog('error', 'Error de autenticación', error.message);
      return false;
    }
  }

  // Check if CORS is blocking requests
  isCorsBlocked() {
    return this.corsError;
  }

  // Get CORS error message
  getCorsErrorMessage() {
    return 'CORS Error: No se puede conectar directamente a n8n desde el navegador. Esto es normal por razones de seguridad.';
  }

  // Legacy email/password authentication (kept for compatibility)
  async authenticate(email, password) {
    try {
      this.emitLog('info', 'Intentando autenticación con email/password...');
      
      const response = await axios.post(`/signin`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.status === 200) {
        this.isAuthenticated = true;
        localStorage.setItem('n8n_session', 'true');
        this.emitLog('success', 'Autenticación exitosa');
        console.log('n8n MCP: Authentication successful');
        return true;
      }
      return false;
    } catch (error) {
      this.emitLog('error', 'Error de autenticación', error.message);
      console.error('n8n MCP: Authentication failed:', error);
      return false;
    }
  }

  // Create a new workflow
  async createWorkflow(workflowData) {
    if (!this.isAuthenticated) {
      this.emitLog('error', 'No autenticado con n8n');
      throw new Error('Not authenticated with n8n');
    }

    if (this.corsError) {
      this.emitLog('warning', 'No se puede crear workflow debido a restricciones CORS');
      throw new Error('Cannot create workflow due to CORS restrictions');
    }

    try {
      this.emitLog('info', 'Creando nuevo workflow...', workflowData.name);
      
      const workflow = {
        name: workflowData.name || 'New Workflow',
        nodes: workflowData.nodes || [],
        connections: workflowData.connections || {},
        settings: workflowData.settings || {},
        tags: workflowData.tags || []
      };

      const response = await axios.post(`${this.baseURL}/workflows`, workflow, {
        headers: {
          'X-N8N-API-KEY': this.apiToken,
          'Content-Type': 'application/json'
        }
      });

      this.emitLog('success', 'Workflow creado exitosamente', {
        name: workflow.name,
        id: response.data.id,
        nodes: workflow.nodes.length
      });
      
      console.log('n8n MCP: Workflow created successfully:', response.data);
      return response.data;
    } catch (error) {
      this.emitLog('error', 'Error al crear workflow', error.message);
      console.error('n8n MCP: Failed to create workflow:', error);
      throw error;
    }
  }

  // Get all workflows
  async getWorkflows() {
    if (!this.isAuthenticated) {
      this.emitLog('error', 'No autenticado con n8n');
      throw new Error('Not authenticated with n8n');
    }

    if (this.corsError) {
      this.emitLog('warning', 'No se pueden obtener workflows debido a restricciones CORS');
      throw new Error('Cannot get workflows due to CORS restrictions');
    }

    try {
      this.emitLog('info', 'Obteniendo workflows...');
      
      const response = await axios.get(`${this.baseURL}/workflows`, {
        headers: {
          'X-N8N-API-KEY': this.apiToken
        }
      });

      this.emitLog('success', 'Workflows obtenidos', {
        count: response.data.length,
        workflows: response.data.map(w => w.name)
      });

      console.log('n8n MCP: Workflows retrieved:', response.data);
      return response.data;
    } catch (error) {
      this.emitLog('error', 'Error al obtener workflows', error.message);
      console.error('n8n MCP: Failed to get workflows:', error);
      throw error;
    }
  }

  // Execute a workflow
  async executeWorkflow(workflowId, inputData = {}) {
    if (!this.isAuthenticated) {
      this.emitLog('error', 'No autenticado con n8n');
      throw new Error('Not authenticated with n8n');
    }

    if (this.corsError) {
      this.emitLog('warning', 'No se puede ejecutar workflow debido a restricciones CORS');
      throw new Error('Cannot execute workflow due to CORS restrictions');
    }

    try {
      this.emitLog('info', 'Ejecutando workflow...', { workflowId, inputData });
      
      const response = await axios.post(`${this.baseURL}/workflows/${workflowId}/execute`, {
        input: inputData
      }, {
        headers: {
          'X-N8N-API-KEY': this.apiToken,
          'Content-Type': 'application/json'
        }
      });

      this.emitLog('success', 'Workflow ejecutado exitosamente', {
        workflowId,
        executionId: response.data.id,
        status: response.data.status
      });

      console.log('n8n MCP: Workflow executed successfully:', response.data);
      return response.data;
    } catch (error) {
      this.emitLog('error', 'Error al ejecutar workflow', error.message);
      console.error('n8n MCP: Failed to execute workflow:', error);
      throw error;
    }
  }

  // Create a webhook trigger
  async createWebhookTrigger(workflowId, webhookData) {
    if (!this.isAuthenticated) {
      this.emitLog('error', 'No autenticado con n8n');
      throw new Error('Not authenticated with n8n');
    }

    if (this.corsError) {
      this.emitLog('warning', 'No se puede crear webhook debido a restricciones CORS');
      throw new Error('Cannot create webhook due to CORS restrictions');
    }

    try {
      this.emitLog('info', 'Creando webhook...', webhookData);
      
      const webhook = {
        workflowId,
        httpMethod: webhookData.method || 'POST',
        path: webhookData.path || '/webhook',
        authentication: webhookData.authentication || 'none',
        responseMode: webhookData.responseMode || 'responseNode'
      };

      const response = await axios.post(`${this.baseURL}/webhooks`, webhook, {
        headers: {
          'X-N8N-API-KEY': this.apiToken,
          'Content-Type': 'application/json'
        }
      });

      this.emitLog('success', 'Webhook creado exitosamente', {
        path: webhook.path,
        method: webhook.httpMethod,
        webhookId: response.data.id
      });

      console.log('n8n MCP: Webhook created successfully:', response.data);
      return response.data;
    } catch (error) {
      this.emitLog('error', 'Error al crear webhook', error.message);
      console.error('n8n MCP: Failed to create webhook:', error);
      throw error;
    }
  }

  // Add a node to workflow
  async addNode(workflowId, nodeData) {
    if (!this.isAuthenticated) {
      this.emitLog('error', 'No autenticado con n8n');
      throw new Error('Not authenticated with n8n');
    }

    if (this.corsError) {
      this.emitLog('warning', 'No se puede agregar nodo debido a restricciones CORS');
      throw new Error('Cannot add node due to CORS restrictions');
    }

    try {
      this.emitLog('info', 'Agregando nodo al workflow...', {
        nodeName: nodeData.name,
        nodeType: nodeData.type,
        workflowId
      });
      
      const node = {
        id: nodeData.id,
        name: nodeData.name,
        type: nodeData.type,
        typeVersion: nodeData.typeVersion || 1,
        position: nodeData.position || [0, 0],
        parameters: nodeData.parameters || {}
      };

      const response = await axios.post(`${this.baseURL}/workflows/${workflowId}/nodes`, node, {
        headers: {
          'X-N8N-API-KEY': this.apiToken,
          'Content-Type': 'application/json'
        }
      });

      this.emitLog('success', 'Nodo agregado exitosamente', {
        nodeName: node.name,
        nodeType: node.type,
        nodeId: response.data.id
      });

      console.log('n8n MCP: Node added successfully:', response.data);
      return response.data;
    } catch (error) {
      this.emitLog('error', 'Error al agregar nodo', error.message);
      console.error('n8n MCP: Failed to add node:', error);
      throw error;
    }
  }

  // Connect nodes in workflow
  async connectNodes(workflowId, connectionData) {
    if (!this.isAuthenticated) {
      this.emitLog('error', 'No autenticado con n8n');
      throw new Error('Not authenticated with n8n');
    }

    if (this.corsError) {
      this.emitLog('warning', 'No se pueden conectar nodos debido a restricciones CORS');
      throw new Error('Cannot connect nodes due to CORS restrictions');
    }

    try {
      this.emitLog('info', 'Conectando nodos...', {
        sourceNode: connectionData.sourceNodeId,
        targetNode: connectionData.targetNodeId,
        workflowId
      });
      
      const connection = {
        sourceNodeId: connectionData.sourceNodeId,
        sourceOutputIndex: connectionData.sourceOutputIndex || 0,
        targetNodeId: connectionData.targetNodeId,
        targetInputIndex: connectionData.targetInputIndex || 0
      };

      const response = await axios.post(`${this.baseURL}/workflows/${workflowId}/connections`, connection, {
        headers: {
          'X-N8N-API-KEY': this.apiToken,
          'Content-Type': 'application/json'
        }
      });

      this.emitLog('success', 'Nodos conectados exitosamente', {
        sourceNode: connection.sourceNodeId,
        targetNode: connection.targetNodeId
      });

      console.log('n8n MCP: Nodes connected successfully:', response.data);
      return response.data;
    } catch (error) {
      this.emitLog('error', 'Error al conectar nodos', error.message);
      console.error('n8n MCP: Failed to connect nodes:', error);
      throw error;
    }
  }

  // Get workflow execution history
  async getExecutionHistory(workflowId) {
    if (!this.isAuthenticated) {
      this.emitLog('error', 'No autenticado con n8n');
      throw new Error('Not authenticated with n8n');
    }

    if (this.corsError) {
      this.emitLog('warning', 'No se puede obtener historial debido a restricciones CORS');
      throw new Error('Cannot get execution history due to CORS restrictions');
    }

    try {
      this.emitLog('info', 'Obteniendo historial de ejecuciones...', { workflowId });
      
      const response = await axios.get(`${this.baseURL}/workflows/${workflowId}/executions`, {
        headers: {
          'X-N8N-API-KEY': this.apiToken
        }
      });

      this.emitLog('success', 'Historial de ejecuciones obtenido', {
        workflowId,
        executionsCount: response.data.length
      });

      console.log('n8n MCP: Execution history retrieved:', response.data);
      return response.data;
    } catch (error) {
      this.emitLog('error', 'Error al obtener historial', error.message);
      console.error('n8n MCP: Failed to get execution history:', error);
      throw error;
    }
  }

  // Logout from n8n
  async logout() {
    try {
      this.emitLog('info', 'Cerrando sesión de n8n...');
      
      // Stop real-time monitoring
      this.stopRealTimeMonitoring();
      
      this.isAuthenticated = false;
      this.corsError = false;
      localStorage.removeItem('n8n_session');
      
      this.emitLog('success', 'Sesión cerrada exitosamente');
      console.log('n8n MCP: Logout successful');
    } catch (error) {
      this.emitLog('error', 'Error al cerrar sesión', error.message);
      console.error('n8n MCP: Logout failed:', error);
    }
  }

  // Start real-time monitoring
  startRealTimeMonitoring() {
    if (this.pollingInterval) {
      this.stopRealTimeMonitoring();
    }
    
    this.emitLog('info', 'Iniciando monitoreo en tiempo real de n8n...');
    this.emitLog('info', 'El sistema verificará workflows y ejecuciones cada 10 segundos');
    
    this.pollingInterval = setInterval(() => {
      this.checkForChanges();
    }, 10000); // Check every 10 seconds
    
    console.log('n8n MCP: Real-time monitoring started');
  }

  // Stop real-time monitoring
  stopRealTimeMonitoring() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      this.emitLog('info', 'Monitoreo en tiempo real detenido');
      console.log('n8n MCP: Real-time monitoring stopped');
    }
  }

  // Check for changes in workflows and executions
  async checkForChanges() {
    try {
      this.emitLog('info', 'Verificando cambios en workflows...');
      
      // Check workflows
      const workflowsResponse = await axios.get(`${this.baseURL}/workflows`, {
        headers: {
          'X-N8N-API-KEY': this.apiToken
        }
      });
      
      // Ensure data is an array
      const workflows = Array.isArray(workflowsResponse.data) ? workflowsResponse.data : [];
      const currentWorkflowCount = workflows.length;
      
      this.emitLog('info', `Workflows encontrados: ${currentWorkflowCount}`);
      
      // Log all workflows for debugging
      if (workflows.length > 0) {
        workflows.forEach((workflow, index) => {
          this.emitLog('info', `Workflow ${index + 1}: ${workflow.name || 'Sin nombre'} (ID: ${workflow.id})`);
        });
      }
      
      // Only log if there are workflows and the count changed
      if (currentWorkflowCount > 0 && currentWorkflowCount !== this.lastWorkflowCount) {
        if (currentWorkflowCount > this.lastWorkflowCount) {
          const newWorkflows = currentWorkflowCount - this.lastWorkflowCount;
          this.emitLog('success', `Nuevo workflow detectado`, {
            totalWorkflows: currentWorkflowCount,
            newWorkflows: newWorkflows
          });
        }
      }
      
      this.lastWorkflowCount = currentWorkflowCount;
      
      // Only check executions if we have workflows
      if (workflows.length > 0) {
        this.emitLog('info', 'Verificando ejecuciones de workflows...');
        
        // Check executions for each workflow (limit to first 5 to avoid spam)
        for (const workflow of workflows.slice(0, 5)) {
          if (workflow && workflow.id) {
            await this.checkWorkflowExecutions(workflow.id);
          }
        }
      }
      
    } catch (error) {
      console.error('n8n MCP: Error checking for changes:', error);
      // Only log error if it's not a 404 (no workflows yet)
      if (error.response && error.response.status !== 404) {
        this.emitLog('error', 'Error al verificar cambios', error.message);
      } else {
        this.emitLog('info', 'No hay workflows aún - esto es normal al inicio');
      }
    }
  }

  // Check executions for a specific workflow
  async checkWorkflowExecutions(workflowId) {
    try {
      const response = await axios.get(`${this.baseURL}/workflows/${workflowId}/executions`, {
        headers: {
          'X-N8N-API-KEY': this.apiToken
        }
      });
      
      // Ensure data is an array
      const executions = Array.isArray(response.data) ? response.data : [];
      const currentExecutionCount = executions.length;
      
      this.emitLog('info', `Workflow ${workflowId}: ${currentExecutionCount} ejecuciones encontradas`);
      
      // Check for new executions
      if (currentExecutionCount > this.lastExecutionCount) {
        const newExecutions = currentExecutionCount - this.lastExecutionCount;
        this.emitLog('success', `Nueva ejecución detectada`, {
          workflowId: workflowId,
          newExecutions: newExecutions,
          totalExecutions: currentExecutionCount
        });
        
        // Get details of the latest execution
        if (executions.length > 0) {
          const latestExecution = executions[0];
          this.emitLog('info', `Ejecución completada`, {
            workflowId: workflowId,
            executionId: latestExecution.id,
            status: latestExecution.status,
            startedAt: latestExecution.startedAt,
            finishedAt: latestExecution.finishedAt
          });
        }
      } else if (currentExecutionCount > 0) {
        // Log existing executions for context
        const latestExecution = executions[0];
        this.emitLog('info', `Última ejecución del workflow ${workflowId}`, {
          status: latestExecution.status,
          startedAt: latestExecution.startedAt,
          finishedAt: latestExecution.finishedAt
        });
      }
      
      this.lastExecutionCount = currentExecutionCount;
      
    } catch (error) {
      console.error(`n8n MCP: Error checking executions for workflow ${workflowId}:`, error);
      // Don't emit log for individual workflow errors to avoid spam
      if (error.response && error.response.status === 404) {
        this.emitLog('info', `Workflow ${workflowId}: No hay ejecuciones aún`);
      }
    }
  }

  // Check connection status
  async checkConnection() {
    try {
      this.emitLog('info', 'Verificando estado de conexión...');
      
      const response = await axios.get(`${this.baseURL}/workflows`, {
        headers: {
          'X-N8N-API-KEY': this.apiToken
        },
        timeout: 5000
      });
      
      const isConnected = response.status === 200;
      this.emitLog(isConnected ? 'success' : 'error', 
        isConnected ? 'Conexión estable' : 'Conexión fallida');
      
      return isConnected;
    } catch (error) {
      this.emitLog('error', 'Error al verificar conexión', error.message);
      console.error('n8n MCP: Connection check failed:', error);
      return false;
    }
  }
}

const n8nMCPService = new N8nMCPService();
export default n8nMCPService; 