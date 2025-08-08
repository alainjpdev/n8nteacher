const axios = require('axios');

// n8n Configuration
const N8N_BASE_URL = 'http://localhost:5678/api/v1';

async function getNewToken() {
  console.log('🔑 Obteniendo nuevo token de API de n8n...\n');
  
  try {
    // Intentar obtener workflows para verificar si necesitamos token
    console.log('📡 Verificando conexión con n8n...');
    const response = await axios.get(`${N8N_BASE_URL}/workflows`, {
      timeout: 10000
    });
    
    console.log('✅ Conexión exitosa sin token (modo público)');
    console.log('📋 Workflows disponibles:', response.data.length);
    
    // Mostrar información de los workflows
    response.data.forEach((workflow, index) => {
      console.log(`   ${index + 1}. ${workflow.name} (ID: ${workflow.id})`);
    });
    
    console.log('\n💡 Para limpiar el workflow de prueba:');
    console.log('   1. Ve a http://localhost:5678');
    console.log('   2. Abre el workflow que quieres limpiar');
    console.log('   3. Elimina todos los nodos manualmente');
    console.log('   4. Guarda el workflow');
    
    return null;
    
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('🔐 n8n requiere autenticación');
      console.log('\n📝 Para obtener un nuevo token:');
      console.log('   1. Ve a http://localhost:5678');
      console.log('   2. Haz login en n8n');
      console.log('   3. Ve a Settings → API');
      console.log('   4. Crea un nuevo API Key');
      console.log('   5. Copia el token y actualiza el script');
    } else {
      console.error('❌ Error:', error.message);
    }
    throw error;
  }
}

// Ejecutar
getNewToken()
  .then(() => {
    console.log('\n✅ Verificación completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error:', error.message);
    process.exit(1);
  });
