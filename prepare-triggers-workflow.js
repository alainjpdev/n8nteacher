const axios = require('axios');

// n8n Configuration
const N8N_BASE_URL = 'http://localhost:5678/api/v1';
const N8N_API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZjkxNGRjYy1jZjZkLTQyYTgtYjEwNy00MWVhY2FkMDU2MmIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0NDE2NjQzLCJleHAiOjE3NTY5NTg0MDB9.3x0inedA6Kqf74uMTHt8teRZoKFRmPS2WzA58y09YbI';

async function createTriggersWorkflow() {
  console.log('🎯 Creando workflow para ejercicios de triggers...\n');
  
  try {
    // Crear un workflow limpio para triggers
    const triggersWorkflow = {
      name: "Curso de Triggers n8n",
      nodes: [
        {
          id: "manual-trigger-1",
          name: "Manual Trigger",
          type: "n8n-nodes-base.manualTrigger",
          typeVersion: 1,
          position: [240, 300],
          parameters: {}
        }
      ],
      connections: {},
      settings: {
        executionOrder: "v1"
      },
      staticData: null,
      tags: ['curso', 'triggers', 'n8n']
    };
    
    console.log('📝 Creando workflow de triggers...');
    console.log(`   Nombre: ${triggersWorkflow.name}`);
    console.log(`   Nodos: ${triggersWorkflow.nodes.length}`);
    console.log(`   Conexiones: ${Object.keys(triggersWorkflow.connections).length}`);
    
    // Crear el workflow
    const response = await axios.post(`${N8N_BASE_URL}/workflows`, triggersWorkflow, {
      headers: {
        'X-N8N-API-KEY': N8N_API_TOKEN,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('\n✅ Workflow de triggers creado exitosamente!');
    console.log(`   ID: ${response.data.id}`);
    console.log(`   Nombre: ${response.data.name}`);
    console.log(`   Estado: ${response.data.active ? 'Activo' : 'Inactivo'}`);
    console.log(`   Creado: ${response.data.createdAt}`);
    
    console.log(`\n🔗 Puedes acceder al workflow en:`);
    console.log(`   http://localhost:5678/workflow/${response.data.id}`);
    
    console.log('\n📚 Ejercicios disponibles:');
    console.log('   1. Introducción a los Triggers');
    console.log('   2. Trigger Manual');
    console.log('   3. Trigger Webhook');
    console.log('   4. Trigger Schedule');
    console.log('   5. Trigger Email');
    console.log('   6. Trigger de Base de Datos');
    console.log('   7. Trigger de Archivos');
    console.log('   8. Proyecto Final');
    
    return response.data;
    
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

// Ejecutar la creación
createTriggersWorkflow()
  .then(() => {
    console.log('\n🎉 ¡Workflow de triggers listo para los ejercicios!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error creando workflow:', error.message);
    process.exit(1);
  });
