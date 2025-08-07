#!/usr/bin/env python3
"""
Test simple para abrir Chrome y navegar a n8n
"""
import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

# Rutas
CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CHROMEDRIVER_PATH = "/Users/wavesmanagement/.wdm/drivers/chromedriver/mac64/139.0.7258.66/chromedriver-mac-arm64/chromedriver"

# URL de n8n
N8N_URL = 'http://localhost:5678'

def test_open_n8n():
    """Test simple para abrir Chrome y navegar a n8n"""
    try:
        print("🧪 Test n8n: Abriendo Chrome...")
        
        chrome_options = Options()
        chrome_options.binary_location = CHROME_PATH
        chrome_options.add_argument("--start-maximized")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        service = Service(CHROMEDRIVER_PATH)
        
        print("🌐 Iniciando Chrome...")
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        print("✅ Chrome abierto correctamente!")
        print(f"📍 Navegando a n8n: {N8N_URL}")
        
        driver.get(N8N_URL)
        print(f"✅ Navegado a: {driver.title}")
        
        print("⏳ Manteniendo abierto por 30 segundos...")
        print("💡 Usa Ctrl+C para cerrar manualmente")
        time.sleep(30)
        
        driver.quit()
        print("✅ Chrome cerrado")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🔧 Test Simple de n8n")
    print("=" * 25)
    
    success = test_open_n8n()
    
    if success:
        print("🎉 ¡Test exitoso! n8n se abre correctamente")
    else:
        print("❌ Test fallido")
