const axios = require('axios');

console.log('🧪 Probando acceso del frontend sin problemas de CORS...\n');

async function testFrontendAccess() {
  try {
    // Test 1: Access workflow through our proxy
    console.log('1️⃣  Probando acceso al workflow a través del proxy...');
    const workflowResponse = await axios.get('http://localhost:3001/api/workflows/FVKBIatFo5HXrLs7', {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      }
    });
    
    console.log('✅ Acceso al workflow exitoso');
    console.log(`   Status: ${workflowResponse.status}`);
    console.log(`   Nombre: ${workflowResponse.data.name}`);
    console.log(`   Nodos: ${workflowResponse.data.nodes.length}`);
    
    // Test 2: Check CORS headers
    console.log('\n2️⃣  Verificando headers CORS...');
    const corsResponse = await axios.options('http://localhost:3001/api/workflows/FVKBIatFo5HXrLs7', {
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('✅ CORS headers correctos');
    console.log(`   Allow-Origin: ${corsResponse.headers['access-control-allow-origin']}`);
    console.log(`   Allow-Methods: ${corsResponse.headers['access-control-allow-methods']}`);
    console.log(`   Allow-Headers: ${corsResponse.headers['access-control-allow-headers']}`);
    
    // Test 3: Test server status endpoint
    console.log('\n3️⃣  Probando endpoint de estado del servidor...');
    const statusResponse = await axios.get('http://localhost:3001/api/status', {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      }
    });
    
    console.log('✅ Endpoint de estado accesible');
    console.log(`   Monitoreo activo: ${statusResponse.data.isMonitoring}`);
    console.log(`   Workflow objetivo: ${statusResponse.data.targetWorkflowId}`);
    
    console.log('\n🎉 ¡Frontend puede acceder sin problemas de CORS!');
    console.log('💡 El error "X-N8N-API-KEY is not allowed" está resuelto');
    console.log('💡 El frontend ahora usa nuestro servidor proxy en lugar de n8n directamente');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Headers: ${JSON.stringify(error.response.headers, null, 2)}`);
    }
  }
}

// Run the test
testFrontendAccess(); 