#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Función para crear/actualizar el archivo .env
function setupEnv(token, workflowId = null, baseUrl = null) {
  const envPath = path.join(__dirname, '.env');
  const examplePath = path.join(__dirname, 'env.example');
  
  // Valores por defecto
  const defaultWorkflowId = workflowId || 'nGrfYSwOctx13r2U';
  const defaultBaseUrl = baseUrl || 'http://localhost:5678/api/v1';
  
  // Contenido del archivo .env
  const envContent = `# n8n Configuration - Single Source of Truth
N8N_API_TOKEN=${token}
N8N_WORKFLOW_ID=${defaultWorkflowId}
N8N_BASE_URL=${defaultBaseUrl}

# Server Configuration
SERVER_PORT=3001
NODE_ENV=development
`;

  try {
    // Crear el archivo .env
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Archivo .env creado/actualizado correctamente');
    console.log('');
    console.log('📊 Configuración:');
    console.log(`   🔑 Token: ${token.substring(0, 20)}...`);
    console.log(`   📋 Workflow ID: ${defaultWorkflowId}`);
    console.log(`   📡 URL: ${defaultBaseUrl}`);
    console.log('');
    console.log('🚀 Ahora puedes iniciar el servidor:');
    console.log('   cd server && npm start');
    console.log('');
    console.log('💡 Para cambiar la configuración, ejecuta:');
    console.log('   node setup-env.js <nuevo_token> [workflow_id] [base_url]');
    
  } catch (error) {
    console.error('❌ Error creando archivo .env:', error.message);
  }
}

// Función para mostrar ayuda
function showHelp() {
  console.log('🔧 Configurador de variables de entorno para n8n');
  console.log('');
  console.log('Uso:');
  console.log('  node setup-env.js <token> [workflow_id] [base_url]');
  console.log('');
  console.log('Ejemplos:');
  console.log('  node setup-env.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  console.log('  node setup-env.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... nGrfYSwOctx13r2U');
  console.log('  node setup-env.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... nGrfYSwOctx13r2U http://localhost:5678/api/v1');
  console.log('');
  console.log('💡 Para obtener tu token de n8n:');
  console.log('   1. Ve a tu instancia de n8n');
  console.log('   2. Settings → API Keys');
  console.log('   3. Create API Key');
  console.log('   4. Copia el token generado');
}

// Manejo de argumentos
const args = process.argv.slice(2);

if (args.length === 0) {
  showHelp();
} else {
  const token = args[0];
  const workflowId = args[1] || null;
  const baseUrl = args[2] || null;
  
  if (!token) {
    console.error('❌ Error: Token requerido');
    showHelp();
    process.exit(1);
  }
  
  setupEnv(token, workflowId, baseUrl);
}
