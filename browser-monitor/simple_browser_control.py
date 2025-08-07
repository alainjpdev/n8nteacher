#!/usr/bin/env python3
"""
Control simple del navegador sin Flask
"""
import os
import time
import json
from datetime import datetime
from db_vectorized_collector import DBVectorizedCollector

def main():
    print("🚀 Control Simple del Navegador")
    print("=" * 40)
    print("🌐 Sin Flask, sin entorno virtual")
    print("📊 Solo abrir navegador y recolectar datos")
    print()
    
    collector = None
    try:
        print("🔧 Inicializando recolector...")
        collector = DBVectorizedCollector()
        
        print("🌐 Abriendo navegador...")
        if collector.start_browser():
            print("✅ Navegador abierto correctamente")
            
            print("📍 Navegando a n8n...")
            if collector.navigate_to_n8n():
                print("✅ Navegado a n8n correctamente")
                
                print("📊 Iniciando recolección de datos...")
                if collector.start_data_collection():
                    print("✅ Recolección iniciada")
                    print("📊 Recolectando datos vectorizados...")
                    print("💡 El navegador está abierto y monitoreando")
                    print("💡 Usa Ctrl+C para detener")
                    print()
                    
                    # Mantener corriendo
                    try:
                        while True:
                            time.sleep(5)
                            # Mostrar resumen cada 30 segundos
                            if int(time.time()) % 30 == 0:
                                summary = collector.get_db_summary()
                                print(f"📊 Resumen: {summary['total_samples']} muestras, {summary['teaching_moments']} momentos de enseñanza")
                    except KeyboardInterrupt:
                        print("\n🛑 Deteniendo...")
                else:
                    print("❌ Error iniciando recolección")
            else:
                print("❌ Error navegando a n8n")
        else:
            print("❌ Error abriendo navegador")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if collector:
            print("💾 Guardando datos...")
            collector.save_metadata_to_db()
            collector.stop_browser()
            collector.close_db_connection()
        print("✅ Proceso terminado")

if __name__ == "__main__":
    main()
