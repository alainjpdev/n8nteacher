#!/usr/bin/env python3
"""
Test simple para abrir Chrome directamente
"""

import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

# Rutas
CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CHROMEDRIVER_PATH = "/Users/wavesmanagement/.wdm/drivers/chromedriver/mac64/139.0.7258.66/chromedriver-mac-arm64/chromedriver"

def test_open_chrome():
    """Test simple para abrir Chrome"""
    try:
        print("🧪 Test simple: Abriendo Chrome...")
        
        chrome_options = Options()
        chrome_options.binary_location = CHROME_PATH
        chrome_options.add_argument("--start-maximized")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        service = Service(CHROMEDRIVER_PATH)
        
        print("🌐 Iniciando Chrome...")
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        print("✅ Chrome abierto correctamente!")
        print("📍 Navegando a Google...")
        
        driver.get("https://www.google.com")
        print(f"✅ Navegado a: {driver.title}")
        
        print("⏳ Manteniendo abierto por 10 segundos...")
        time.sleep(10)
        
        driver.quit()
        print("✅ Chrome cerrado")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🔧 Test Simple de Chrome")
    print("=" * 25)
    
    success = test_open_chrome()
    
    if success:
        print("🎉 ¡Test exitoso! Chrome se abre correctamente")
    else:
        print("❌ Test fallido")
