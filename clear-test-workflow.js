const axios = require('axios');

// n8n Configuration
const N8N_BASE_URL = 'http://localhost:5678/api/v1';
const N8N_API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZjkxNGRjYy1jZjZkLTQyYTgtYjEwNy00MWVhY2FkMDU2MmIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0NDE2NjQzLCJleHAiOjE3NTY5NTg0MDB9.3x0inedA6Kqf74uMTHt8teRZoKFRmPS2WzA58y09YbI';

// Workflow ID del workflow de prueba
const TEST_WORKFLOW_ID = 'nGrfYSwOctx13r2U';

async function clearTestWorkflow() {
  console.log('🧹 Limpiando workflow de prueba...\n');
  
  try {
    // Primero obtener el workflow actual
    console.log('📥 Obteniendo workflow actual...');
    const getResponse = await axios.get(`${N8N_BASE_URL}/workflows/${TEST_WORKFLOW_ID}`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_TOKEN,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Workflow obtenido:', getResponse.data.name);
    
    // Crear un workflow completamente limpio
    const cleanWorkflow = {
      name: getResponse.data.name || 'Test Workflow',
      nodes: [], // Sin nodos
      connections: {}, // Sin conexiones
      settings: {
        executionOrder: 'v1'
      },
      staticData: null,
      tags: ['test', 'clean']
    };
    
    console.log('🧹 Creando workflow limpio...');
    console.log(`   Nodos: ${cleanWorkflow.nodes.length}`);
    console.log(`   Conexiones: ${Object.keys(cleanWorkflow.connections).length}`);
    
    // Actualizar el workflow con contenido limpio
    const updateResponse = await axios.put(`${N8N_BASE_URL}/workflows/${TEST_WORKFLOW_ID}`, cleanWorkflow, {
      headers: {
        'X-N8N-API-KEY': N8N_API_TOKEN,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('\n✅ Workflow limpiado exitosamente!');
    console.log(`   ID: ${updateResponse.data.id}`);
    console.log(`   Nombre: ${updateResponse.data.name}`);
    console.log(`   Estado: ${updateResponse.data.active ? 'Activo' : 'Inactivo'}`);
    console.log(`   Nodos: ${updateResponse.data.nodes.length}`);
    console.log(`   Conexiones: ${Object.keys(updateResponse.data.connections).length}`);
    
    // Desactivar el workflow para que no se ejecute automáticamente
    console.log('\n🛑 Desactivando workflow...');
    const deactivateResponse = await axios.patch(`${N8N_BASE_URL}/workflows/${TEST_WORKFLOW_ID}/activate`, {
      active: false
    }, {
      headers: {
        'X-N8N-API-KEY': N8N_API_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Workflow desactivado');
    
    console.log(`\n🔗 Puedes ver el workflow limpio en:`);
    console.log(`   http://localhost:5678/workflow/${TEST_WORKFLOW_ID}`);
    
    return updateResponse.data;
    
  } catch (error) {
    if (error.response) {
      console.error('❌ Error del servidor:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('❌ Error de conexión:', error.message);
    } else {
      console.error('❌ Error:', error.message);
    }
    throw error;
  }
}

// Ejecutar la limpieza
clearTestWorkflow()
  .then(() => {
    console.log('\n🎉 ¡Workflow limpiado completamente!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error limpiando workflow:', error.message);
    process.exit(1);
  });
