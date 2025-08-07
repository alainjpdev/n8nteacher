#!/usr/bin/env node

const axios = require('axios');

// Función para actualizar el token
async function updateToken(newToken) {
  try {
    console.log('🔄 Actualizando token de n8n...');
    
    const response = await axios.post('http://localhost:3001/api/config', {
      apiToken: newToken
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      console.log('✅ Token actualizado correctamente');
      console.log('📊 Configuración actual:', response.data.config);
    } else {
      console.error('❌ Error actualizando token:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Error conectando al servidor:', error.message);
    console.log('💡 Asegúrate de que el servidor esté ejecutándose en http://localhost:3001');
  }
}

// Función para verificar la configuración actual
async function checkConfig() {
  try {
    console.log('🔍 Verificando configuración actual...');
    
    const response = await axios.get('http://localhost:3001/api/config');
    
    if (response.data.success) {
      console.log('📊 Configuración actual:');
      console.log(`   📡 URL: ${response.data.config.baseURL}`);
      console.log(`   🔑 Token: ${response.data.config.hasToken ? 'Configurado' : 'No configurado'}`);
      console.log(`   📋 Workflow ID: ${response.data.config.workflowId}`);
    } else {
      console.error('❌ Error obteniendo configuración');
    }
  } catch (error) {
    console.error('❌ Error conectando al servidor:', error.message);
  }
}

// Función para probar la conexión con n8n
async function testConnection() {
  try {
    console.log('🧪 Probando conexión con n8n...');
    
    const response = await axios.get('http://localhost:3001/api/workflows/nGrfYSwOctx13r2U');
    
    if (response.data) {
      console.log('✅ Conexión exitosa con n8n');
      console.log(`📋 Workflow: ${response.data.name || 'Sin nombre'}`);
      console.log(`🟢 Estado: ${response.data.active ? 'Activo' : 'Inactivo'}`);
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('❌ Token inválido o expirado');
      console.log('💡 Actualiza el token usando: node update-token.js <tu_nuevo_token>');
    } else if (error.response?.status === 404) {
      console.error('❌ Workflow no encontrado');
    } else {
      console.error('❌ Error de conexión:', error.message);
    }
  }
}

// Manejo de argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('🔧 Herramienta de configuración de n8n');
  console.log('');
  console.log('Uso:');
  console.log('  node update-token.js <token>     - Actualizar token');
  console.log('  node update-token.js check       - Verificar configuración');
  console.log('  node update-token.js test        - Probar conexión');
  console.log('');
  console.log('Ejemplo:');
  console.log('  node update-token.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
} else if (args[0] === 'check') {
  checkConfig();
} else if (args[0] === 'test') {
  testConnection();
} else {
  // Asumir que es un token
  updateToken(args[0]);
}
