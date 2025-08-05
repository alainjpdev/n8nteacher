const axios = require('axios');

// n8n Configuration
const N8N_BASE_URL = 'https://algorithmicsaischool.app.n8n.cloud/api/v1';
const N8N_API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMjc4M2MxZS0xYzM0LTQ2NjUtYTQ4Yy1hYzI3NjAwMmI2OTZiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0MzQ1OTQ5LCJleHAiOjE3NTY4NzU2MDB9._pTP0n3gOAzhigHv9i0EDQMZuFGR3jrpbcXTK-o1-ak';
const TARGET_WORKFLOW_ID = 'azmyvvsFI4XLvF6g';

// Configuración de axios
const api = axios.create({
  baseURL: N8N_BASE_URL,
  headers: {
    'X-N8N-API-KEY': N8N_API_TOKEN,
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Variables de seguimiento
let lastWorkflowHash = null;
let lastExecutionCount = 0;

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

// Función para verificar el workflow específico
async function checkWorkflow() {
  try {
    console.log(`\n🔍 Verificando workflow: ${TARGET_WORKFLOW_ID}`);
    
    // Obtener detalles del workflow
    const workflowResponse = await api.get(`/workflows/${TARGET_WORKFLOW_ID}`);
    const workflow = workflowResponse.data;
    
    console.log(`📋 Workflow: ${workflow.name}`);
    console.log(`🟢 Estado: ${workflow.active ? 'Activo' : 'Inactivo'}`);
    
    // Generar hash actual
    const currentHash = generateWorkflowHash(workflow);
    
    // Verificar cambios en el contenido
    if (lastWorkflowHash && lastWorkflowHash !== currentHash) {
      console.log(`🔄 ¡CAMBIOS DETECTADOS en el workflow!`);
      console.log(`   Hash anterior: ${lastWorkflowHash.substring(0, 8)}...`);
      console.log(`   Hash actual:   ${currentHash.substring(0, 8)}...`);
    }
    
    lastWorkflowHash = currentHash;
    
    // Verificar ejecuciones
    const executionsResponse = await api.get(`/workflows/${TARGET_WORKFLOW_ID}/executions`);
    const executions = executionsResponse.data.data || [];
    
    console.log(`⚡ Ejecuciones totales: ${executions.length}`);
    
    if (executions.length > lastExecutionCount) {
      const newExecutions = executions.length - lastExecutionCount;
      console.log(`🚀 ¡${newExecutions} nueva(s) ejecución(es) detectada(s)!`);
      
      // Mostrar la última ejecución
      if (executions.length > 0) {
        const lastExecution = executions[0];
        console.log(`   Última ejecución: ${lastExecution.id}`);
        console.log(`   Estado: ${lastExecution.status}`);
        console.log(`   Fecha: ${new Date(lastExecution.startedAt).toLocaleString()}`);
      }
    }
    
    lastExecutionCount = executions.length;
    
  } catch (error) {
    if (error.response) {
      console.log(`❌ Error ${error.response.status}: ${error.response.statusText}`);
      if (error.response.status === 401) {
        console.log('🔑 Token de API inválido o expirado');
      }
    } else {
      console.log(`❌ Error de conexión: ${error.message}`);
    }
  }
}

// Función principal
async function startMonitoring() {
  console.log('🚀 Iniciando monitoreo de n8n...');
  console.log(`🎯 Workflow objetivo: ${TARGET_WORKFLOW_ID}`);
  console.log('⏰ Verificando cada 30 segundos...\n');
  
  // Verificación inicial
  await checkWorkflow();
  
  // Monitoreo continuo
  setInterval(checkWorkflow, 30000);
}

// Manejo de señales para salir limpiamente
process.on('SIGINT', () => {
  console.log('\n👋 Monitoreo detenido');
  process.exit(0);
});

// Iniciar monitoreo
startMonitoring().catch(console.error); 