const axios = require('axios');

// Tokens para probar
const tokens = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMjc4M2MxZS0xYzM0LTQ2NjUtYTQ4Yy1hYzI3NjAwMmI2OTZiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0MzQ1OTQ5LCJleHAiOjE3NTY4NzU2MDB9._pTP0n3gOAzhigHv9i0EDQMZuFGR3jrpbcXTK-o1-ak',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMjc4M2MxZS0xYzM0LTQ2NjUtYTQ4Yy1hYzI3NjAwMmI2OTZiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0MzQ1NjYwLCJleHAiOjE3NTY4NzU2MDB9.VhIvqxdybx9185cNplJrMMQcru02cPYBSaYNx4zBVb0',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMjc4M2MxZS0xYzM0LTQ2NjUtYTQ4Yy1hYzI3NjAwMmI2OTZiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0MzQ0OTg2LCJleHAiOjE3NTY4NzU2MDB9.LUL_oBfPY48krBRGzJqI5e9Zfzz0EpQun_7fh-nfazo'
];

const N8N_BASE_URL = 'https://algorithmicsaischool.app.n8n.cloud/api/v1';

async function testToken(token, index) {
  console.log(`\n🔍 Probando token ${index + 1}:`);
  console.log(`   ${token.substring(0, 50)}...`);
  
  try {
    const response = await axios.get(`${N8N_BASE_URL}/workflows`, {
      headers: {
        'X-N8N-API-KEY': token,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log(`✅ Token ${index + 1} FUNCIONA`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Workflows encontrados: ${response.data.data?.length || 0}`);
    
    if (response.data.data && response.data.data.length > 0) {
      console.log(`   Primer workflow: ${response.data.data[0].name} (${response.data.data[0].id})`);
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Token ${index + 1} FALLA`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.message || 'Unknown error'}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    return false;
  }
}

async function testAllTokens() {
  console.log('🚀 Probando conectividad con n8n...\n');
  
  let workingToken = null;
  
  for (let i = 0; i < tokens.length; i++) {
    const isWorking = await testToken(tokens[i], i);
    if (isWorking) {
      workingToken = tokens[i];
      break;
    }
  }
  
  if (workingToken) {
    console.log(`\n🎉 ¡Token funcional encontrado!`);
    console.log(`   Token: ${workingToken}`);
    
    // Probar el workflow específico
    console.log(`\n🔍 Probando workflow específico...`);
    try {
      const response = await axios.get(`${N8N_BASE_URL}/workflows/azmyvvsFI4XLvF6g`, {
        headers: {
          'X-N8N-API-KEY': workingToken,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✅ Workflow encontrado:`);
      console.log(`   Nombre: ${response.data.name}`);
      console.log(`   ID: ${response.data.id}`);
      console.log(`   Activo: ${response.data.active ? 'Sí' : 'No'}`);
      
    } catch (error) {
      console.log(`❌ Workflow no encontrado o error:`);
      console.log(`   ${error.response?.data?.message || error.message}`);
    }
    
  } else {
    console.log(`\n❌ Ningún token funciona. Posibles causas:`);
    console.log(`   1. Todos los tokens han expirado`);
    console.log(`   2. La instancia de n8n no está disponible`);
    console.log(`   3. Los tokens no tienen permisos de API`);
    console.log(`   4. La URL de n8n ha cambiado`);
  }
}

testAllTokens().catch(console.error); 