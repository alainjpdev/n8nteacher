const axios = require('axios');

// Configuración
const N8N_BASE_URL = 'https://algorithmicsaischool.app.n8n.cloud/api/v1';
const N8N_API_TOKEN = 'TU_NUEVO_TOKEN_AQUI'; // ← Actualiza con tu token
const TARGET_WORKFLOW_ID = 'azmyvvsFI4XLvF6g';
const WEBHOOK_CALLBACK_URL = 'http://localhost:3001/webhook/workflow-changes/azmyvvsFI4XLvF6g';

// Configuración de axios para n8n
const n8nApi = axios.create({
  baseURL: N8N_BASE_URL,
  headers: {
    'X-N8N-API-KEY': N8N_API_TOKEN,
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

async function getWorkflowDetails() {
  console.log('🔍 Obteniendo detalles del workflow...');
  
  try {
    const response = await n8nApi.get(`/workflows/${TARGET_WORKFLOW_ID}`);
    const workflow = response.data;
    
    console.log('✅ Workflow encontrado:');
    console.log(`   Nombre: ${workflow.name}`);
    console.log(`   ID: ${workflow.id}`);
    console.log(`   Activo: ${workflow.active ? 'Sí' : 'No'}`);
    console.log(`   Nodos: ${workflow.nodes?.length || 0}`);
    
    return workflow;
  } catch (error) {
    console.log('❌ Error obteniendo workflow:');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.message || 'Unknown error'}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    return null;
  }
}

async function checkExistingWebhooks(workflow) {
  console.log('\n🔍 Verificando webhooks existentes...');
  
  const webhookNodes = workflow.nodes?.filter(node => 
    node.type === 'n8n-nodes-base.webhook'
  ) || [];
  
  console.log(`   Webhooks encontrados: ${webhookNodes.length}`);
  
  webhookNodes.forEach((node, index) => {
    console.log(`   ${index + 1}. ${node.name} - ${node.webhookId || 'Sin ID'}`);
  });
  
  return webhookNodes;
}

async function createWebhookNode(workflow) {
  console.log('\n🔧 Creando nodo webhook...');
  
  const webhookNode = {
    id: `webhook-${Date.now()}`,
    name: 'Workflow Monitor Webhook',
    type: 'n8n-nodes-base.webhook',
    typeVersion: 1,
    position: [240, 300],
    parameters: {
      httpMethod: 'POST',
      path: `workflow-changes/${TARGET_WORKFLOW_ID}`,
      respondWith: 'immediately',
      responseCode: 200,
      responseData: 'allEntries',
      options: {
        allowedOrigins: '*',
        rawBody: true
      }
    }
  };
  
  // Agregar el nodo al workflow
  const updatedWorkflow = {
    ...workflow,
    nodes: [...(workflow.nodes || []), webhookNode]
  };
  
  try {
    const response = await n8nApi.put(`/workflows/${TARGET_WORKFLOW_ID}`, updatedWorkflow);
    console.log('✅ Nodo webhook creado exitosamente');
    console.log(`   Webhook ID: ${webhookNode.id}`);
    console.log(`   Path: ${webhookNode.parameters.path}`);
    
    return webhookNode;
  } catch (error) {
    console.log('❌ Error creando nodo webhook:');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.message || 'Unknown error'}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    return null;
  }
}

async function activateWorkflow() {
  console.log('\n🚀 Activando workflow...');
  
  try {
    const response = await n8nApi.post(`/workflows/${TARGET_WORKFLOW_ID}/activate`);
    console.log('✅ Workflow activado exitosamente');
    return true;
  } catch (error) {
    console.log('❌ Error activando workflow:');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.message || 'Unknown error'}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    return false;
  }
}

async function getWebhookUrl(workflow) {
  console.log('\n🔗 Obteniendo URL del webhook...');
  
  const webhookNodes = workflow.nodes?.filter(node => 
    node.type === 'n8n-nodes-base.webhook'
  ) || [];
  
  if (webhookNodes.length > 0) {
    const webhookNode = webhookNodes[webhookNodes.length - 1];
    const webhookUrl = `${N8N_BASE_URL.replace('/api/v1', '')}/webhook/${webhookNode.parameters.path}`;
    
    console.log('✅ URL del webhook:');
    console.log(`   ${webhookUrl}`);
    
    return webhookUrl;
  }
  
  console.log('❌ No se encontró nodo webhook');
  return null;
}

async function main() {
  console.log('🚀 Configurador de Webhook n8n\n');
  
  // Verificar token
  if (N8N_API_TOKEN === 'TU_NUEVO_TOKEN_AQUI') {
    console.log('❌ Error: Actualiza N8N_API_TOKEN en el script');
    console.log('   1. Ve a n8n → Settings → API Keys');
    console.log('   2. Crea un nuevo API Key');
    console.log('   3. Actualiza el token en este script');
    return;
  }
  
  // Obtener workflow
  const workflow = await getWorkflowDetails();
  if (!workflow) return;
  
  // Verificar webhooks existentes
  const existingWebhooks = await checkExistingWebhooks(workflow);
  
  if (existingWebhooks.length === 0) {
    // Crear nuevo webhook
    const webhookNode = await createWebhookNode(workflow);
    if (!webhookNode) return;
    
    // Activar workflow
    const activated = await activateWorkflow();
    if (!activated) return;
    
    // Obtener URL del webhook
    const updatedWorkflow = await getWorkflowDetails();
    if (updatedWorkflow) {
      await getWebhookUrl(updatedWorkflow);
    }
  } else {
    console.log('\n✅ Workflow ya tiene webhooks configurados');
    await getWebhookUrl(workflow);
  }
  
  console.log('\n📋 Próximos pasos:');
  console.log('1. Ejecuta el servidor de monitoreo: cd server && node server.js');
  console.log('2. Prueba el webhook: node webhook-monitor.js');
  console.log('3. Haz cambios en tu workflow de n8n');
  console.log('4. Verifica que lleguen las notificaciones al servidor');
}

main().catch(console.error); 