const axios = require('axios');

// CONFIGURACIÓN - Actualiza con tu nuevo token
const N8N_BASE_URL = 'https://algorithmicsaischool.app.n8n.cloud/api/v1';
const N8N_API_TOKEN = 'TU_NUEVO_TOKEN_AQUI'; // ← Reemplaza con tu nuevo token
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

async function checkWorkflow() {
  console.log('🔍 Verificando workflow...\n');
  
  try {
    // Verificar workflows disponibles
    console.log('📋 Obteniendo lista de workflows...');
    const workflowsResponse = await api.get('/workflows');
    const workflows = workflowsResponse.data.data || [];
    
    console.log(`✅ Encontrados ${workflows.length} workflows:`);
    workflows.forEach((wf, index) => {
      console.log(`   ${index + 1}. ${wf.name} (${wf.id}) - ${wf.active ? '🟢 Activo' : '🔴 Inactivo'}`);
    });
    
    // Verificar workflow específico
    console.log(`\n🎯 Verificando workflow específico: ${TARGET_WORKFLOW_ID}`);
    const workflowResponse = await api.get(`/workflows/${TARGET_WORKFLOW_ID}`);
    const workflow = workflowResponse.data;
    
    console.log(`✅ Workflow encontrado:`);
    console.log(`   Nombre: ${workflow.name}`);
    console.log(`   ID: ${workflow.id}`);
    console.log(`   Estado: ${workflow.active ? '🟢 Activo' : '🔴 Inactivo'}`);
    console.log(`   Nodos: ${workflow.nodes?.length || 0}`);
    
    // Verificar ejecuciones
    console.log(`\n⚡ Verificando ejecuciones...`);
    const executionsResponse = await api.get(`/workflows/${TARGET_WORKFLOW_ID}/executions`);
    const executions = executionsResponse.data.data || [];
    
    console.log(`✅ Encontradas ${executions.length} ejecuciones:`);
    
    if (executions.length > 0) {
      const lastExecution = executions[0];
      console.log(`   Última ejecución:`);
      console.log(`     ID: ${lastExecution.id}`);
      console.log(`     Estado: ${lastExecution.status}`);
      console.log(`     Fecha: ${new Date(lastExecution.startedAt).toLocaleString()}`);
      console.log(`     Duración: ${lastExecution.stoppedAt ? 
        Math.round((new Date(lastExecution.stoppedAt) - new Date(lastExecution.startedAt)) / 1000) + 's' : 
        'En progreso'}`);
    }
    
    console.log('\n✅ Verificación completada exitosamente');
    
  } catch (error) {
    console.log('❌ Error durante la verificación:');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.message || 'Unknown error'}`);
      
      if (error.response.status === 401) {
        console.log('\n🔑 Solución:');
        console.log('   1. Ve a tu instancia de n8n');
        console.log('   2. Settings → API Keys');
        console.log('   3. Crea un nuevo API Key');
        console.log('   4. Actualiza N8N_API_TOKEN en este script');
      }
    } else {
      console.log(`   Error: ${error.message}`);
    }
  }
}

// Ejecutar verificación
checkWorkflow(); 