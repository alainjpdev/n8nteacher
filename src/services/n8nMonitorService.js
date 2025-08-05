import axios from 'axios';

class N8nMonitorService {
  constructor() {
    this.baseURL = 'http://localhost:5678/api/v1';
    this.apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZTlmYTc0YS05MWUyLTRlYjctYmNhNy05NDJhOWNkNDE5MTciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0MzQ5MjkzLCJleHAiOjE3NTY4NzIwMDB9.cwcMSR7gyrxW4WNRU9ZV_rLBPugUa0mw9ry6UHY_r1o';
    this.targetWorkflowId = 'nGrfYSwOctx13r2U';
    this.isMonitoring = false;
    this.monitoringInterval = null;
    this.logCallback = null;
    this.statusCallback = null;
    this.lastWorkflowHash = null;
    this.lastExecutionCount = 0;
    this.workflowDetails = null;
    this.lastNodeCount = 0;
    this.lastConnectionCount = 0;
    
    // Configure axios
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'X-N8N-API-KEY': this.apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
  }

  // Set callbacks
  setLogCallback(callback) {
    this.logCallback = callback;
  }

  setStatusCallback(callback) {
    this.statusCallback = callback;
  }

  // Generate workflow hash
  generateWorkflowHash(workflow) {
    const content = JSON.stringify({
      nodes: workflow.nodes,
      connections: workflow.connections,
      settings: workflow.settings,
      name: workflow.name,
      active: workflow.active
    });
    return this.hashString(content);
  }

  // Simple hash function
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  // Get workflow details
  async getWorkflowDetails() {
    try {
      const response = await this.api.get(`/workflows/${this.targetWorkflowId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        this.log('❌ Workflow no encontrado');
        return null;
      }
      throw error;
    }
  }

  // Log function
  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      id: Date.now(),
      timestamp,
      message,
      type
    };
    
    if (this.logCallback) {
      this.logCallback(logEntry);
    }
    
    console.log(`[${timestamp}] ${message}`);
  }

  // Monitor workflow
  async monitorWorkflow() {
    try {
      const timestamp = new Date().toLocaleTimeString();
      this.log(`🔍 Monitoreando workflow: ${this.targetWorkflowId}`, 'monitoring');
      
      // Get workflow details
      const workflow = await this.getWorkflowDetails();
      if (!workflow) {
        this.log('❌ No se pudo obtener detalles del workflow', 'error');
        return;
      }
      
      // Show basic information
      this.log(`📋 Workflow: ${workflow.name}`, 'info');
      this.log(`🟢 Estado: ${workflow.active ? 'Activo' : 'Inactivo'}`, 'status');
      this.log(`🔧 Nodos: ${workflow.nodes?.length || 0}`, 'info');
      this.log(`🔗 Conexiones: ${Object.keys(workflow.connections || {}).length}`, 'info');
      
      // Detect changes in node count
      const currentNodeCount = workflow.nodes?.length || 0;
      const currentConnectionCount = Object.keys(workflow.connections || {}).length;
      
      if (this.lastNodeCount !== 0 && currentNodeCount !== this.lastNodeCount) {
        const change = currentNodeCount - this.lastNodeCount;
        this.log(`🔄 Cambio en nodos detectado!`, 'change');
        this.log(`   Nodos anteriores: ${this.lastNodeCount}`, 'change');
        this.log(`   Nodos actuales: ${currentNodeCount}`, 'change');
        this.log(`   Cambio: ${change > 0 ? '+' : ''}${change}`, 'change');
        
        if (change > 0) {
          this.log(`   ➕ Se agregaron ${change} nodo(s)`, 'change');
        } else {
          this.log(`   ➖ Se eliminaron ${Math.abs(change)} nodo(s)`, 'change');
        }
      }
      
      if (this.lastConnectionCount !== 0 && currentConnectionCount !== this.lastConnectionCount) {
        const change = currentConnectionCount - this.lastConnectionCount;
        this.log(`🔄 Cambio en conexiones detectado!`, 'change');
        this.log(`   Conexiones anteriores: ${this.lastConnectionCount}`, 'change');
        this.log(`   Conexiones actuales: ${currentConnectionCount}`, 'change');
        this.log(`   Cambio: ${change > 0 ? '+' : ''}${change}`, 'change');
      }
      
      // Log detailed nodes if they exist
      if (workflow.nodes && workflow.nodes.length > 0) {
        this.log(`📝 Nodos actuales:`, 'info');
        workflow.nodes.forEach((node, index) => {
          this.log(`   ${index + 1}. ${node.name} (${node.type})`, 'node');
        });
      } else {
        this.log(`📝 No hay nodos en el workflow`, 'info');
      }
      
      // Check for workflow content changes
      const currentHash = this.generateWorkflowHash(workflow);
      if (this.lastWorkflowHash && this.lastWorkflowHash !== currentHash) {
        const changeTime = new Date().toLocaleTimeString();
        this.log(`🔄 ¡CAMBIOS DETECTADOS en el workflow!`, 'change');
        this.log(`   Hash anterior: ${this.lastWorkflowHash.substring(0, 8)}...`, 'change');
        this.log(`   Hash actual:   ${currentHash.substring(0, 8)}...`, 'change');
        this.log(`   📊 Resumen de cambios:`, 'change');
        
        // Show specific change details
        if (this.workflowDetails) {
          const nodeChanges = workflow.nodes.length - this.workflowDetails.nodes.length;
          const connectionChanges = Object.keys(workflow.connections || {}).length - Object.keys(this.workflowDetails.connections || {}).length;
          
          if (nodeChanges > 0) {
            this.log(`   ➕ Nodos agregados: +${nodeChanges}`, 'change');
          } else if (nodeChanges < 0) {
            this.log(`   ➖ Nodos eliminados: ${nodeChanges}`, 'change');
          }
          
          if (connectionChanges > 0) {
            this.log(`   ➕ Conexiones agregadas: +${connectionChanges}`, 'change');
          } else if (connectionChanges < 0) {
            this.log(`   ➖ Conexiones eliminadas: ${connectionChanges}`, 'change');
          }
          
          // Detect new nodes specifically
          const newNodes = workflow.nodes.filter(node => 
            !this.workflowDetails.nodes.some(oldNode => oldNode.id === node.id)
          );
          
          if (newNodes.length > 0) {
            this.log(`   🆕 Nuevos nodos detectados:`, 'change');
            newNodes.forEach(node => {
              this.log(`      - ${node.name} (${node.type})`, 'change');
            });
          }
          
          // Detect deleted nodes
          const deletedNodes = this.workflowDetails.nodes.filter(oldNode => 
            !workflow.nodes.some(node => node.id === oldNode.id)
          );
          
          if (deletedNodes.length > 0) {
            this.log(`   🗑️ Nodos eliminados:`, 'change');
            deletedNodes.forEach(node => {
              this.log(`      - ${node.name} (${node.type})`, 'change');
            });
          }
          
          // Detect node configuration changes
          const modifiedNodes = workflow.nodes.filter(node => {
            const oldNode = this.workflowDetails.nodes.find(n => n.id === node.id);
            return oldNode && JSON.stringify(oldNode.parameters) !== JSON.stringify(node.parameters);
          });
          
          if (modifiedNodes.length > 0) {
            this.log(`   🔧 Nodos modificados:`, 'change');
            modifiedNodes.forEach(node => {
              this.log(`      - ${node.name} (configuración actualizada)`, 'change');
            });
          }
        }
      }
      
      this.lastWorkflowHash = currentHash;
      this.workflowDetails = workflow;
      this.lastNodeCount = currentNodeCount;
      this.lastConnectionCount = currentConnectionCount;
      
      // Only monitor executions if workflow has nodes
      if (workflow.nodes && workflow.nodes.length > 0) {
        await this.monitorWorkflowExecutions();
      } else {
        this.log(`📝 Workflow vacío - no se monitorean ejecuciones`, 'info');
      }
      
      // Update status
      if (this.statusCallback) {
        this.statusCallback({
          isMonitoring: this.isMonitoring,
          workflowDetails: workflow,
          nodeCount: currentNodeCount,
          connectionCount: currentConnectionCount,
          isActive: workflow.active,
          lastHash: currentHash.substring(0, 16)
        });
      }
      
    } catch (error) {
      this.log(`❌ Error monitoreando workflow: ${error.message}`, 'error');
    }
  }

  // Monitor workflow executions
  async monitorWorkflowExecutions() {
    try {
      const response = await this.api.get(`/workflows/${this.targetWorkflowId}/executions`);
      const executions = response.data.data || [];
      
      this.log(`⚡ Ejecuciones totales: ${executions.length}`, 'execution');
      
      // Check for new executions
      if (executions.length > this.lastExecutionCount) {
        const newExecutions = executions.length - this.lastExecutionCount;
        const executionTime = new Date().toLocaleTimeString();
        this.log(`🚀 ¡${newExecutions} nueva(s) ejecución(es) detectada(s)!`, 'execution');
        
        // Show details of new executions
        const newExecutionsList = executions.slice(0, newExecutions);
        for (const execution of newExecutionsList) {
          this.log(`   📊 Ejecución ID: ${execution.id}`, 'execution');
          this.log(`      Estado: ${execution.status}`, 'execution');
          this.log(`      Inicio: ${new Date(execution.startedAt).toLocaleString()}`, 'execution');
          
          if (execution.stoppedAt) {
            const duration = Math.round((new Date(execution.stoppedAt) - new Date(execution.startedAt)) / 1000);
            this.log(`      Duración: ${duration}s`, 'execution');
            this.log(`      Fin: ${new Date(execution.stoppedAt).toLocaleString()}`, 'execution');
          } else {
            this.log(`      ⏳ En progreso...`, 'execution');
          }
          
          // Show additional information if available
          if (execution.data) {
            this.log(`      📄 Datos: ${JSON.stringify(execution.data).substring(0, 100)}...`, 'execution');
          }
          
          // Show results if available
          if (execution.result) {
            this.log(`      ✅ Resultado: ${JSON.stringify(execution.result).substring(0, 100)}...`, 'execution');
          }
        }
      }
      
      this.lastExecutionCount = executions.length;
      
      // Show the last execution for context
      if (executions.length > 0) {
        const lastExecution = executions[0];
        this.log(`   📈 Última ejecución: ${lastExecution.id} - ${lastExecution.status}`, 'execution');
      }
      
    } catch (error) {
      if (error.response?.status === 404) {
        this.log(`📝 No hay ejecuciones registradas aún (workflow inactivo o sin ejecuciones previas)`, 'info');
      } else {
        this.log(`❌ Error monitoreando ejecuciones: ${error.message}`, 'error');
      }
    }
  }

  // Start monitoring
  startMonitoring() {
    if (this.isMonitoring) {
      this.log('⚠️ El monitoreo ya está activo', 'warning');
      return;
    }
    
    this.isMonitoring = true;
    this.log('🎯 Iniciando monitoreo del workflow', 'start');
    this.log(`📋 Workflow ID: ${this.targetWorkflowId}`, 'info');
    this.log(`🔗 URL: ${this.baseURL}`, 'info');
    this.log('⏰ Monitoreando cada 10 segundos...', 'info');
    
    // Initial check
    this.monitorWorkflow();
    
    // Set up monitoring interval
    this.monitoringInterval = setInterval(() => {
      this.monitorWorkflow();
    }, 10000);
    
    // Check executions every 5 seconds
    this.executionInterval = setInterval(() => {
      if (this.workflowDetails?.nodes?.length > 0) {
        this.monitorWorkflowExecutions();
      }
    }, 5000);
    
    if (this.statusCallback) {
      this.statusCallback({
        isMonitoring: true,
        connectionStatus: 'connected'
      });
    }
  }

  // Stop monitoring
  stopMonitoring() {
    if (!this.isMonitoring) {
      this.log('⚠️ El monitoreo no está activo', 'warning');
      return;
    }
    
    this.isMonitoring = false;
    this.log('🛑 Monitoreo detenido', 'stop');
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    if (this.executionInterval) {
      clearInterval(this.executionInterval);
      this.executionInterval = null;
    }
    
    if (this.statusCallback) {
      this.statusCallback({
        isMonitoring: false,
        connectionStatus: 'disconnected'
      });
    }
  }

  // Get current status
  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      workflowDetails: this.workflowDetails,
      lastHash: this.lastWorkflowHash?.substring(0, 16),
      executionCount: this.lastExecutionCount,
      nodeCount: this.lastNodeCount,
      connectionCount: this.lastConnectionCount
    };
  }

  // Cleanup
  cleanup() {
    this.stopMonitoring();
  }
}

// Create singleton instance
const n8nMonitorService = new N8nMonitorService();

export default n8nMonitorService; 