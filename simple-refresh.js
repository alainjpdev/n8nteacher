const { exec } = require('child_process');

console.log('🔄 Iniciando refresh automático del navegador...\n');

// Function to execute system commands
function executeCommand(command, description) {
  return new Promise((resolve) => {
    console.log(`🔄 ${description}...`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`   ⚠️  ${description}: ${error.message}`);
      } else {
        console.log(`   ✅ ${description} completado`);
      }
      resolve();
    });
  });
}

async function refreshBrowser() {
  try {
    // Method 1: Using xdotool (if available)
    await executeCommand('xdotool key ctrl+shift+r', 'Hard refresh con xdotool');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Method 2: Alternative refresh
    await executeCommand('xdotool key F5', 'Refresh normal');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Method 3: Using wmctrl to focus browser window
    await executeCommand('wmctrl -a "n8n"', 'Enfocar ventana de n8n');
    await new Promise(resolve => setTimeout(resolve, 500));
    await executeCommand('xdotool key ctrl+shift+r', 'Hard refresh en ventana enfocada');
    
    console.log('\n✅ Refresh automático completado');
    console.log('💡 Si no funcionó, haz refresh manualmente:');
    console.log('   - Ctrl+Shift+R (Hard refresh)');
    console.log('   - Ctrl+F5 (Alternative hard refresh)');
    console.log('   - F12 → Click derecho en refresh → Empty Cache and Hard Reload');
    
  } catch (error) {
    console.error('❌ Error durante el refresh:', error.message);
  }
}

// Alternative method using wget to clear cache
async function clearCacheAndRefresh() {
  console.log('\n🧹 Limpiando cache del navegador...');
  
  try {
    // Clear browser cache by making a request
    await executeCommand('wget --no-cache --spider http://localhost:5678/', 'Limpiando cache con wget');
    
    console.log('✅ Cache limpiado');
    console.log('💡 Ahora haz refresh manual en tu navegador');
    
  } catch (error) {
    console.log('⚠️  No se pudo limpiar el cache automáticamente');
  }
}

// Run both methods
refreshBrowser().then(() => {
  clearCacheAndRefresh();
}); 