const puppeteer = require('puppeteer');

async function refreshBrowser() {
  console.log('🔄 Iniciando refresh automático del navegador...\n');
  
  try {
    // Launch browser
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Navigate to n8n workflow
    const workflowUrl = 'http://localhost:5678/workflow/FVKBIatFo5HXrLs7';
    console.log(`🌐 Navegando a: ${workflowUrl}`);
    
    await page.goto(workflowUrl, { waitUntil: 'networkidle0' });
    
    // Wait a moment for the page to load
    await page.waitForTimeout(2000);
    
    // Hard refresh with cache clearing
    console.log('🔄 Ejecutando hard refresh...');
    await page.evaluate(() => {
      // Clear cache and reload
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
      
      // Force reload without cache
      window.location.reload(true);
    });
    
    // Wait for the page to reload
    await page.waitForTimeout(3000);
    
    console.log('✅ Hard refresh completado');
    console.log('📋 Verificando que el workflow se actualizó...');
    
    // Check if the workflow name is correct
    const workflowName = await page.evaluate(() => {
      const titleElement = document.querySelector('h1, .workflow-title, [data-test-id="workflow-title"]');
      return titleElement ? titleElement.textContent : 'No se encontró el título';
    });
    
    console.log(`📝 Nombre del workflow: ${workflowName}`);
    
    // Keep the browser open for manual inspection
    console.log('\n🔍 El navegador permanecerá abierto para inspección manual');
    console.log('💡 Puedes cerrar el navegador cuando hayas verificado los cambios');
    
    // Don't close the browser automatically
    // await browser.close();
    
  } catch (error) {
    console.error('❌ Error durante el refresh:', error.message);
  }
}

// Alternative method using system commands
async function refreshWithSystemCommands() {
  console.log('🔄 Usando comandos del sistema para refresh...\n');
  
  const { exec } = require('child_process');
  
  // For Linux/Ubuntu
  const commands = [
    'xdotool key ctrl+shift+r', // Hard refresh
    'xdotool key F5', // Normal refresh
    'xdotool key ctrl+F5' // Alternative hard refresh
  ];
  
  for (const command of commands) {
    try {
      console.log(`🔄 Ejecutando: ${command}`);
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log(`   ⚠️  ${command}: ${error.message}`);
        } else {
          console.log(`   ✅ ${command} ejecutado`);
        }
      });
      
      // Wait between commands
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`   ❌ Error con ${command}: ${error.message}`);
    }
  }
  
  console.log('\n✅ Comandos de refresh ejecutados');
  console.log('💡 Si no funcionó, intenta hacer refresh manualmente con Ctrl+Shift+R');
}

// Check if puppeteer is available
async function checkAndRefresh() {
  try {
    require.resolve('puppeteer');
    console.log('📦 Puppeteer encontrado, usando método automático...');
    await refreshBrowser();
  } catch (error) {
    console.log('📦 Puppeteer no disponible, usando comandos del sistema...');
    await refreshWithSystemCommands();
  }
}

// Run the refresh
checkAndRefresh(); 