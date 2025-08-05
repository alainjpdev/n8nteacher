const axios = require('axios');

// Configuración del webhook de n8n
const N8N_WEBHOOK_URL = 'http://localhost:3001/webhook/workflow-changes/azmyvvsFI4XLvF6g';
const N8N_BASE_URL = 'https://algorithmicsaischool.app.n8n.cloud/api/v1';

// Simular payload de webhook de n8n
const webhookPayload = {
  workflowId: 'azmyvvsFI4XLvF6g',
  event: 'workflow.updated',
  timestamp: new Date().toISOString(),
  data: {
    workflow: {
      id: 'azmyvvsFI4XLvF6g',
      name: 'Test Workflow',
      active: true,
      updatedAt: new Date().toISOString()
    },
    changes: {
      nodes: 'modified',
      connections: 'modified',
      settings: 'unchanged'
    }
  }
};

async function testWebhook() {
  console.log('🔗 Probando webhook de n8n...\n');
  
  try {
    console.log('📤 Enviando payload al webhook:');
    console.log(`   URL: ${N8N_WEBHOOK_URL}`);
    console.log(`   Payload: ${JSON.stringify(webhookPayload, null, 2)}`);
    
    const response = await axios.post(N8N_WEBHOOK_URL, webhookPayload, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'n8n-webhook-simulator'
      },
      timeout: 10000
    });
    
    console.log('\n✅ Webhook enviado exitosamente');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
    
  } catch (error) {
    console.log('\n❌ Error enviando webhook:');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
  }
}

async function checkN8nWebhookSetup() {
  console.log('\n🔍 Verificando configuración de webhook en n8n...\n');
  
  // Verificar si el servidor de monitoreo está corriendo
  try {
    const serverResponse = await axios.get('http://localhost:3001/api/status');
    console.log('✅ Servidor de monitoreo activo');
    console.log(`   Status: ${serverResponse.status}`);
  } catch (error) {
    console.log('❌ Servidor de monitoreo no disponible');
    console.log('   Ejecuta: cd server && node server.js');
    return;
  }
  
  // Verificar endpoint de webhook
  try {
    const webhookResponse = await axios.get('http://localhost:3001/api/webhook-status');
    console.log('✅ Endpoint de webhook disponible');
    console.log(`   Status: ${webhookResponse.status}`);
  } catch (error) {
    console.log('❌ Endpoint de webhook no disponible');
  }
}

async function main() {
  console.log('🚀 Simulador de Webhook n8n\n');
  
  await checkN8nWebhookSetup();
  await testWebhook();
  
  console.log('\n📋 Instrucciones para configurar webhook en n8n:');
  console.log('1. Ve a tu workflow en n8n');
  console.log('2. Agrega un nodo "Webhook"');
  console.log('3. Configura:');
  console.log('   - HTTP Method: POST');
  console.log('   - Path: /workflow-changes/azmyvvsFI4XLvF6g');
  console.log('   - Respond: Immediately');
  console.log('4. Activa el workflow');
  console.log('5. Copia la URL del webhook');
  console.log('6. Configura el webhook para enviar a: http://localhost:3001/webhook/workflow-changes/azmyvvsFI4XLvF6g');
}

main().catch(console.error); 