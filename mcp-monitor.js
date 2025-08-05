const axios = require('axios');

// Configuración del n8n MCP Server
const N8N_API_URL = 'http://localhost:5678/api/v1';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZTlmYTc0YS05MWUyLTRlYjctYmNhNy05NDJhOWNkNDE5MTciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0MzQ5MjkzLCJleHAiOjE3NTY4NzIwMDB9.cwcMSR7gyrxW4WNRU9ZV_rLBPugUa0mw9ry6UHY_r1o';

// Configuración de axios
const api = axios.create({
  baseURL: N8N_API_URL,
  headers: {
    'X-N8N-API-KEY': N8N_API_KEY,
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Variables de seguimiento
let knownWorkflows = new Map();
let knownExecutions = new Map();
let workflowHashes = new Map();

// Función para generar hash del workflow
function generateWorkflowHash(workflow) {
  const content = JSON.stringify({
    nodes: workflow.nodes,
    connections: workflow.connections,
    settings: workflow.settings,
    name: workflow.name,
    active: workflow.active
  });
  return require('crypto').createHash('md5').update(content).digest('hex');
}

// Función para monitorear workflows
async function monitorWorkflows() {
  try {
    console.log(`\n🔍 [${new Date().toLocaleTimeString()}] Monitoreando workflows...`);
    
    const response = await api.get('/workflows');
    const workflows = response.data.data || [];
    
    console.log(`📊 Workflows encontrados: ${workflows.length}`);
    
    for (const workflow of workflows) {
      const workflowId = workflow.id;
      const workflowName = workflow.name;
      
      // Verificar si es un workflow nuevo
      if (!knownWorkflows.has(workflowId)) {
        console.log(`🆕 Nuevo workflow detectado: ${workflowName} (${workflowId})`);
        knownWorkflows.set(workflowId, workflow);
        workflowHashes.set(workflowId, generateWorkflowHash(workflow));
      } else {
        // Verificar cambios en el workflow
        const currentHash = generateWorkflowHash(workflow);
        const previousHash = workflowHashes.get(workflowId);
        
        if (currentHash !== previousHash) {
          console.log(`🔄 Cambios detectados en workflow: ${workflowName} (${workflowId})`);
          console.log(`   Hash anterior: ${previousHash?.substring(0, 8)}...`);
          console.log(`   Hash actual:   ${currentHash.substring(0, 8)}...`);
          workflowHashes.set(workflowId, currentHash);
        }
        
        // Verificar cambios de estado
        const previousWorkflow = knownWorkflows.get(workflowId);
        if (previousWorkflow.active !== workflow.active) {
          console.log(`🔄 Cambio de estado en workflow: ${workflowName} (${workflowId})`);
          console.log(`   Estado anterior: ${previousWorkflow.active ? 'Activo' : 'Inactivo'}`);
          console.log(`   Estado actual:   ${workflow.active ? 'Activo' : 'Inactivo'}`);
        }
        
        knownWorkflows.set(workflowId, workflow);
      }
      
      // Monitorear ejecuciones del workflow
      await monitorWorkflowExecutions(workflowId, workflowName);
    }
    
    // Verificar workflows eliminados
    const currentWorkflowIds = new Set(workflows.map(w => w.id));
    for (const [workflowId, workflow] of knownWorkflows) {
      if (!currentWorkflowIds.has(workflowId)) {
        console.log(`🗑️ Workflow eliminado: ${workflow.name} (${workflowId})`);
        knownWorkflows.delete(workflowId);
        workflowHashes.delete(workflowId);
        knownExecutions.delete(workflowId);
      }
    }
    
  } catch (error) {
    console.log(`❌ Error monitoreando workflows: ${error.message}`);
  }
}

// Función para monitorear ejecuciones de un workflow
async function monitorWorkflowExecutions(workflowId, workflowName) {
  try {
    const response = await api.get(`/workflows/${workflowId}/executions`);
    const executions = response.data.data || [];
    
    const previousExecutions = knownExecutions.get(workflowId) || [];
    const newExecutions = executions.filter(exec => 
      !previousExecutions.some(prev => prev.id === exec.id)
    );
    
    if (newExecutions.length > 0) {
      console.log(`⚡ ${newExecutions.length} nueva(s) ejecución(es) en workflow: ${workflowName}`);
      
      for (const execution of newExecutions) {
        console.log(`   🚀 Ejecución: ${execution.id}`);
        console.log(`      Estado: ${execution.status}`);
        console.log(`      Fecha: ${new Date(execution.startedAt).toLocaleString()}`);
        
        if (execution.stoppedAt) {
          const duration = Math.round((new Date(execution.stoppedAt) - new Date(execution.startedAt)) / 1000);
          console.log(`      Duración: ${duration}s`);
        }
      }
    }
    
    knownExecutions.set(workflowId, executions);
    
  } catch (error) {
    console.log(`❌ Error monitoreando ejecuciones de ${workflowName}: ${error.message}`);
  }
}

// Función para mostrar estadísticas
function showStats() {
  console.log('\n📊 Estadísticas del monitoreo:');
  console.log(`   Workflows monitoreados: ${knownWorkflows.size}`);
  console.log(`   Workflows activos: ${Array.from(knownWorkflows.values()).filter(w => w.active).length}`);
  console.log(`   Total de ejecuciones: ${Array.from(knownExecutions.values()).flat().length}`);
}

// Función principal
async function startMonitoring() {
  console.log('🚀 Iniciando monitoreo con n8n MCP Server...');
  console.log(`🔗 URL: ${N8N_API_URL}`);
  console.log('⏰ Monitoreando cada 30 segundos...\n');
  
  // Verificación inicial
  await monitorWorkflows();
  
  // Monitoreo continuo
  setInterval(monitorWorkflows, 30000);
  
  // Mostrar estadísticas cada 5 minutos
  setInterval(showStats, 300000);
}

// Manejo de señales para salir limpiamente
process.on('SIGINT', () => {
  console.log('\n👋 Monitoreo detenido');
  showStats();
  process.exit(0);
});

// Iniciar monitoreo
startMonitoring().catch(console.error); 