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

async function testN8nConnection() {
  console.log('🔗 Probando conexión con n8n MCP Server...\n');
  
  try {
    // Verificar conectividad básica
    console.log('📡 Verificando conectividad...');
    const response = await api.get('/workflows');
    
    console.log('✅ Conexión exitosa');
    console.log(`   Status: ${response.status}`);
    console.log(`   Workflows encontrados: ${response.data.data?.length || 0}`);
    
    if (response.data.data && response.data.data.length > 0) {
      console.log('\n📋 Workflows disponibles:');
      response.data.data.forEach((workflow, index) => {
        console.log(`   ${index + 1}. ${workflow.name} (${workflow.id}) - ${workflow.active ? '🟢 Activo' : '🔴 Inactivo'}`);
      });
    }
    
    return true;
  } catch (error) {
    console.log('❌ Error de conexión:');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.message || 'Unknown error'}`);
      
      if (error.response.status === 401) {
        console.log('\n🔑 Posibles soluciones:');
        console.log('   1. Verifica que el API key sea correcto');
        console.log('   2. Asegúrate de que n8n esté corriendo en localhost:5678');
        console.log('   3. Verifica que el API key tenga permisos de lectura');
      }
    } else {
      console.log(`   Error: ${error.message}`);
      console.log('\n🔧 Posibles soluciones:');
      console.log('   1. Verifica que n8n esté corriendo en http://localhost:5678');
      console.log('   2. Verifica que el puerto 5678 esté disponible');
    }
    return false;
  }
}

async function testWorkflowOperations() {
  console.log('\n🔧 Probando operaciones de workflows...');
  
  try {
    // Listar workflows
    console.log('📋 Listando workflows...');
    const workflowsResponse = await api.get('/workflows');
    const workflows = workflowsResponse.data.data || [];
    
    if (workflows.length > 0) {
      const firstWorkflow = workflows[0];
      console.log(`✅ Workflow encontrado: ${firstWorkflow.name}`);
      
      // Obtener detalles del workflow
      console.log('🔍 Obteniendo detalles del workflow...');
      const workflowResponse = await api.get(`/workflows/${firstWorkflow.id}`);
      console.log(`   Nodos: ${workflowResponse.data.nodes?.length || 0}`);
      console.log(`   Activo: ${workflowResponse.data.active ? 'Sí' : 'No'}`);
      
      // Verificar ejecuciones
      console.log('⚡ Verificando ejecuciones...');
      const executionsResponse = await api.get(`/workflows/${firstWorkflow.id}/executions`);
      const executions = executionsResponse.data.data || [];
      console.log(`   Ejecuciones totales: ${executions.length}`);
      
      if (executions.length > 0) {
        const lastExecution = executions[0];
        console.log(`   Última ejecución: ${lastExecution.id} - ${lastExecution.status}`);
      }
    }
    
    return true;
  } catch (error) {
    console.log('❌ Error en operaciones de workflow:');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.message || 'Unknown error'}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    return false;
  }
}

async function testMCPServer() {
  console.log('🚀 Probando n8n MCP Server\n');
  
  const connectionTest = await testN8nConnection();
  if (connectionTest) {
    await testWorkflowOperations();
  }
  
  console.log('\n📋 Próximos pasos:');
  console.log('1. Si las pruebas son exitosas, puedes usar el MCP Server');
  console.log('2. Configura el MCP Server en tu aplicación principal');
  console.log('3. Usa las herramientas disponibles para monitorear workflows');
}

testMCPServer().catch(console.error); 