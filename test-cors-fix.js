const axios = require('axios');

console.log('🧪 Probando la corrección de CORS...\n');

async function testCorsFix() {
  try {
    // Test 1: OPTIONS request (preflight)
    console.log('1️⃣  Probando preflight request...');
    const optionsResponse = await axios.options('http://localhost:3001/api/status', {
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'X-N8N-API-KEY'
      }
    });
    
    console.log('✅ Preflight request exitoso');
    console.log(`   Status: ${optionsResponse.status}`);
    console.log(`   Allow-Headers: ${optionsResponse.headers['access-control-allow-headers']}`);
    
    // Test 2: Actual GET request with X-N8N-API-KEY header
    console.log('\n2️⃣  Probando GET request con X-N8N-API-KEY...');
    const getResponse = await axios.get('http://localhost:3001/api/status', {
      headers: {
        'X-N8N-API-KEY': 'test-token',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ GET request exitoso');
    console.log(`   Status: ${getResponse.status}`);
    console.log(`   Data: ${JSON.stringify(getResponse.data, null, 2)}`);
    
    // Test 3: Test n8n API endpoint
    console.log('\n3️⃣  Probando endpoint de n8n...');
    const n8nResponse = await axios.get('http://localhost:3001/api/test-n8n', {
      headers: {
        'X-N8N-API-KEY': 'test-token',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Endpoint de n8n exitoso');
    console.log(`   Status: ${n8nResponse.status}`);
    console.log(`   Data: ${JSON.stringify(n8nResponse.data, null, 2)}`);
    
    console.log('\n🎉 ¡CORS corregido exitosamente!');
    console.log('💡 El error "X-N8N-API-KEY is not allowed" debería estar resuelto');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Headers: ${JSON.stringify(error.response.headers, null, 2)}`);
    }
  }
}

// Run the test
testCorsFix(); 