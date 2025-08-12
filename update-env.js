#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env');

function updateEnvFile() {
  console.log('🔧 Configurando variables de entorno para n8n Teacher App');
  console.log('==================================================\n');

  // Leer el archivo .env existente si existe
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Función para actualizar o agregar una variable
  function updateEnvVar(key, value) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  }

  // Función para preguntar al usuario
  function askQuestion(question, defaultValue = '') {
    return new Promise((resolve) => {
      const prompt = defaultValue ? `${question} (${defaultValue}): ` : `${question}: `;
      rl.question(prompt, (answer) => {
        resolve(answer || defaultValue);
      });
    });
  }

  async function configure() {
    try {
      console.log('📡 Configuración de n8n:');
      
      const baseUrl = await askQuestion('URL base de n8n', 'http://localhost:5678/api/v1');
      updateEnvVar('N8N_BASE_URL', baseUrl);

      const apiToken = await askQuestion('Token de API de n8n (deja vacío si no lo tienes)');
      if (apiToken) {
        updateEnvVar('N8N_API_TOKEN', apiToken);
      }

      const workflowId = await askQuestion('ID del workflow (deja vacío si no lo tienes)');
      if (workflowId) {
        updateEnvVar('N8N_WORKFLOW_ID', workflowId);
      }

      console.log('\n⚙️ Configuración del servidor:');
      
      const serverPort = await askQuestion('Puerto del servidor Node.js', '3001');
      updateEnvVar('SERVER_PORT', serverPort);

      const nodeEnv = await askQuestion('Entorno de Node.js', 'development');
      updateEnvVar('NODE_ENV', nodeEnv);

      // Escribir el archivo .env
      fs.writeFileSync(envPath, envContent.trim() + '\n');
      
      console.log('\n✅ Archivo .env actualizado correctamente!');
      console.log('📁 Ubicación:', envPath);
      console.log('\n🔄 Reinicia el servidor para aplicar los cambios:');
      console.log('   npm start (en el directorio server)');
      
    } catch (error) {
      console.error('❌ Error configurando variables de entorno:', error.message);
    } finally {
      rl.close();
    }
  }

  configure();
}

// Ejecutar si se llama directamente
if (require.main === module) {
  updateEnvFile();
}

module.exports = { updateEnvFile };
