#!/usr/bin/env node

console.log('🧹 Limpiando configuración de la aplicación...');

// Simular limpieza del localStorage del navegador
console.log('📝 Para limpiar completamente la configuración:');
console.log('');
console.log('1. Abre las herramientas de desarrollador (F12)');
console.log('2. Ve a la pestaña "Application" o "Aplicación"');
console.log('3. En el panel izquierdo, busca "Local Storage"');
console.log('4. Haz clic derecho en http://localhost:3000');
console.log('5. Selecciona "Clear" o "Limpiar"');
console.log('');
console.log('O ejecuta en la consola del navegador:');
console.log('localStorage.clear()');
console.log('');
console.log('✅ Después de limpiar, recarga la página para ver la experiencia de primera vez');

// También limpiar archivo .env si existe
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.unlinkSync(envPath);
  console.log('🗑️ Archivo .env eliminado');
}

console.log('');
console.log('🚀 Ahora puedes iniciar la aplicación desde cero:');
console.log('cd /Users/wavesmanagement/scripts/new/n8n-teacher-app');
console.log('npm start');
