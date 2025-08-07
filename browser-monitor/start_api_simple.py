#!/usr/bin/env python3
"""
Script simple para iniciar el servidor API
"""
import os
import sys
import subprocess

def main():
    print("🚀 Iniciando servidor API para Recolector Vectorizado...")
    print("=" * 60)
    
    # Verificar que n8n esté corriendo
    print("🔍 Verificando n8n...")
    try:
        import requests
        response = requests.get("http://localhost:5678", timeout=5)
        if response.status_code == 200:
            print("✅ n8n está corriendo en http://localhost:5678")
        else:
            print("❌ n8n no responde correctamente")
            return
    except:
        print("❌ n8n no está corriendo. Por favor inicia n8n primero:")
        print("   n8n start")
        return
    
    print("")
    print("🌐 Iniciando servidor API en puerto 3004...")
    print("📊 Endpoints disponibles:")
    print("  - GET  /health")
    print("  - GET  /api/vectorized/status")
    print("  - POST /api/vectorized/start-browser")
    print("  - POST /api/vectorized/start-collection")
    print("  - GET  /api/vectorized/current-status")
    print("  - POST /api/vectorized/extract-token")
    print("")
    print("💡 Para usar:")
    print("   1. Abrir http://localhost:3000")
    print("   2. Ir a pestaña '📊 Recolector Vectorizado'")
    print("   3. Hacer click en '🌐 Abrir Browser'")
    print("")
    
    # Iniciar el servidor
    try:
        from vectorized_api_server import app
        app.run(host='0.0.0.0', port=3004, debug=True)
    except KeyboardInterrupt:
        print("\n✅ Servidor detenido")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
