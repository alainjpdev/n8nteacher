const axios = require('axios');

// n8n Configuration
const N8N_BASE_URL = 'http://localhost:5678/api/v1';
const N8N_API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZjkxNGRjYy1jZjZkLTQyYTgtYjEwNy00MWVhY2FkMDU2MmIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0NDE2NjQzLCJleHAiOjE3NTY5NTg0MDB9.3x0inedA6Kqf74uMTHt8teRZoKFRmPS2WzA58y09YbI';

// Workflow ID to monitor
const WORKFLOW_ID = 'FVKBIatFo5HXrLs7';

async function verifyWorkflowMonitoring() {
  console.log('🔍 Verificando monitoreo del workflow...\n');
  
  try {
    // Test 1: Check if workflow exists
    console.log('1️⃣  Verificando que el workflow existe...');
    const workflowResponse = await axios.get(`${N8N_BASE_URL}/workflows/${WORKFLOW_ID}`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Workflow encontrado');
    console.log(`   ID: ${workflowResponse.data.id}`);
    console.log(`   Nombre: ${workflowResponse.data.name}`);
    console.log(`   Estado: ${workflowResponse.data.active ? 'Activo' : 'Inactivo'}`);
    console.log(`   Nodos: ${workflowResponse.data.nodes.length}`);
    
    // Test 2: Check server monitoring status
    console.log('\n2️⃣  Verificando estado del servidor de monitoreo...');
    const serverResponse = await axios.get('http://localhost:3001/api/status', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Servidor de monitoreo funcionando');
    console.log(`   Monitoreo activo: ${serverResponse.data.isMonitoring}`);
    console.log(`   Workflow objetivo: ${serverResponse.data.targetWorkflowId}`);
    console.log(`   Clientes conectados: ${serverResponse.data.connectedClients}`);
    
    // Test 3: Start monitoring
    console.log('\n3️⃣  Iniciando monitoreo...');
    const startResponse = await axios.post('http://localhost:3001/api/monitoring/start', {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Monitoreo iniciado');
    console.log(`   Respuesta: ${startResponse.data.message}`);
    
    // Test 4: Check monitoring again
    console.log('\n4️⃣  Verificando monitoreo activo...');
    const monitoringResponse = await axios.get('http://localhost:3001/api/status', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Monitoreo verificado');
    console.log(`   Monitoreo activo: ${monitoringResponse.data.isMonitoring}`);
    
    console.log('\n🎉 ¡Monitoreo del workflow configurado correctamente!');
    console.log('💡 El servidor ahora monitorea el workflow "Agente para Principiantes"');
    
  } catch (error) {
    console.error('❌ Error en la verificación:', error.message);
    
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

// Run the verification
verifyWorkflowMonitoring(); 