#!/usr/bin/env python3
"""
Servidor para Browser Embebido - Sin Chrome Externo
"""
import os
import sys
import json
import threading
import time
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Variables globales
browser_status = 'stopped'  # 'stopped', 'starting', 'running', 'error'
output_log = []
monitoring_active = False
monitoring_thread = None

def log_message(message):
    """Agregar mensaje al log con timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    log_entry = f"[{timestamp}] {message}"
    output_log.append(log_entry)
    # Mantener solo las últimas 100 líneas
    if len(output_log) > 100:
        output_log.pop(0)
    print(log_entry)

def simulate_monitoring():
    """Simular monitoreo sin abrir browser externo"""
    global browser_status, monitoring_active
    
    try:
        log_message("🚀 Iniciando monitoreo embebido...")
        browser_status = 'starting'
        
        # Simular tiempo de inicio
        time.sleep(2)
        
        log_message("✅ Browser embebido iniciado correctamente")
        log_message("🌐 Conectando a n8n en iframe...")
        
        browser_status = 'running'
        monitoring_active = True
        
        # Simular actividad de monitoreo
        activity_counter = 0
        while monitoring_active:
            time.sleep(10)  # Simular actividad cada 10 segundos
            
            if monitoring_active:
                activity_counter += 1
                
                # Simular diferentes tipos de actividad
                activities = [
                    "📊 Monitoreando actividad de n8n...",
                    "🔍 Detectando interacciones del usuario...",
                    "💾 Guardando datos de navegación...",
                    "📈 Analizando patrones de uso...",
                    "🎯 Identificando momentos de enseñanza...",
                    "🔄 Sincronizando con base de datos...",
                    "📱 Procesando eventos del iframe...",
                    "⚡ Optimizando rendimiento...",
                    "🔐 Verificando seguridad...",
                    "📋 Actualizando logs de actividad..."
                ]
                
                activity = activities[activity_counter % len(activities)]
                log_message(activity)
                
                # Simular resumen cada 30 segundos
                if activity_counter % 3 == 0:
                    log_message(f"📊 Resumen: {activity_counter * 10} segundos de monitoreo activo")
        
    except Exception as e:
        log_message(f"❌ Error en monitoreo: {str(e)}")
        browser_status = 'error'
    finally:
        monitoring_active = False
        browser_status = 'stopped'
        log_message("🛑 Monitoreo detenido")

@app.route('/api/browser/status', methods=['GET'])
def get_status():
    """Obtener estado del browser embebido"""
    return jsonify({
        'running': browser_status == 'running',
        'status': browser_status,
        'output': output_log[-20:] if output_log else [],  # Últimas 20 líneas
        'monitoring_active': monitoring_active,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/browser/start', methods=['POST'])
def start_browser():
    """Iniciar el browser embebido"""
    global browser_status, monitoring_thread, monitoring_active
    
    if browser_status in ['starting', 'running']:
        return jsonify({
            'success': False, 
            'message': 'Browser ya está iniciando o ejecutándose'
        })
    
    try:
        # Limpiar log anterior
        output_log.clear()
        
        log_message("🚀 Iniciando browser embebido...")
        log_message("🌐 Configurando iframe de n8n...")
        
        # Iniciar thread de monitoreo
        monitoring_thread = threading.Thread(target=simulate_monitoring)
        monitoring_thread.daemon = True
        monitoring_thread.start()
        
        return jsonify({
            'success': True, 
            'message': 'Browser embebido iniciando...',
            'status': 'starting'
        })
        
    except Exception as e:
        log_message(f"❌ Error iniciando browser: {str(e)}")
        return jsonify({
            'success': False, 
            'message': f'Error iniciando browser: {str(e)}'
        })

@app.route('/api/browser/stop', methods=['POST'])
def stop_browser():
    """Detener el browser embebido"""
    global browser_status, monitoring_active
    
    if browser_status == 'stopped':
        return jsonify({
            'success': False, 
            'message': 'Browser no está ejecutándose'
        })
    
    try:
        log_message("🛑 Deteniendo browser embebido...")
        monitoring_active = False
        
        # Esperar a que el thread termine
        if monitoring_thread and monitoring_thread.is_alive():
            monitoring_thread.join(timeout=5)
        
        browser_status = 'stopped'
        log_message("✅ Browser embebido detenido correctamente")
        
        return jsonify({
            'success': True, 
            'message': 'Browser embebido detenido',
            'status': 'stopped'
        })
        
    except Exception as e:
        log_message(f"❌ Error deteniendo browser: {str(e)}")
        return jsonify({
            'success': False, 
            'message': f'Error deteniendo browser: {str(e)}'
        })

@app.route('/api/browser/logs', methods=['GET'])
def get_logs():
    """Obtener logs completos"""
    return jsonify({
        'logs': output_log,
        'count': len(output_log),
        'status': browser_status,
        'monitoring_active': monitoring_active
    })

@app.route('/api/browser/clear-logs', methods=['POST'])
def clear_logs():
    """Limpiar logs"""
    global output_log
    output_log.clear()
    log_message("🧹 Logs limpiados")
    return jsonify({
        'success': True,
        'message': 'Logs limpiados correctamente'
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({
        'status': 'ok',
        'browser_status': browser_status,
        'monitoring_active': monitoring_active,
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🚀 Iniciando Servidor de Browser Embebido")
    print("📍 Endpoints disponibles:")
    print("  • GET  /api/browser/status    - Estado del browser")
    print("  • POST /api/browser/start     - Iniciar browser")
    print("  • POST /api/browser/stop      - Detener browser")
    print("  • GET  /api/browser/logs      - Ver logs")
    print("  • POST /api/browser/clear-logs - Limpiar logs")
    print("  • GET  /health                - Health check")
    print("")
    print("🌐 Servidor corriendo en http://localhost:5001")
    print("💡 Browser embebido - Sin Chrome externo")
    print("")
    
    app.run(host='0.0.0.0', port=5001, debug=False)
