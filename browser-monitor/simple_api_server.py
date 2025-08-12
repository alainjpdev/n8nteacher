#!/usr/bin/env python3
"""
API Server Simple para Control del Browser
"""
import os
import sys
import json
import subprocess
import threading
import time
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Variables globales
browser_process = None
browser_running = False
output_log = []


def run_browser_script():
    """Ejecutar el script de browser en segundo plano"""
    global browser_process, browser_running, output_log
    
    try:
        # Cambiar al directorio correcto
        script_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(script_dir)
        
        # Ejecutar el script
        browser_process = subprocess.Popen(
            ['python3', 'simple_browser_control.py'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
            universal_newlines=True
        )
        
        browser_running = True
        output_log.append("🚀 Script iniciado correctamente")
        
        # Leer output en tiempo real
        while browser_process.poll() is None:
            line = browser_process.stdout.readline()
            if line:
                output_log.append(line.strip())
                # Mantener solo las últimas 50 líneas
                if len(output_log) > 50:
                    output_log.pop(0)
        
        browser_running = False
        output_log.append("✅ Script terminado")
        
    except Exception as e:
        browser_running = False
        output_log.append(f"❌ Error: {str(e)}")

@app.route('/api/browser/status', methods=['GET'])
def get_status():
    """Obtener estado del browser"""
    return jsonify({
        'running': browser_running,
        'output': output_log[-10:] if output_log else [],  # Últimas 10 líneas
        'process_id': browser_process.pid if browser_process else None
    })

@app.route('/api/browser/start', methods=['POST'])
def start_browser():
    """Iniciar el browser"""
    global browser_process, browser_running
    
    if browser_running:
        return jsonify({'success': False, 'message': 'Browser ya está corriendo'})
    
    try:
        # Limpiar log anterior
        output_log.clear()
        
        # Iniciar en thread separado
        thread = threading.Thread(target=run_browser_script)
        thread.daemon = True
        thread.start()
        
        return jsonify({
            'success': True, 
            'message': 'Browser iniciando...',
            'status': 'starting'
        })
        
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': f'Error iniciando browser: {str(e)}'
        })

@app.route('/api/browser/stop', methods=['POST'])
def stop_browser():
    """Detener el browser"""
    global browser_process, browser_running
    
    if not browser_running or not browser_process:
        return jsonify({'success': False, 'message': 'Browser no está corriendo'})
    
    try:
        browser_process.terminate()
        browser_running = False
        output_log.append("🛑 Browser detenido por usuario")
        
        return jsonify({
            'success': True, 
            'message': 'Browser detenido',
            'status': 'stopped'
        })
        
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': f'Error deteniendo browser: {str(e)}'
        })



@app.route('/api/browser/logs', methods=['GET'])
def get_logs():
    """Obtener logs completos"""
    return jsonify({
        'logs': output_log,
        'count': len(output_log)
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({
        'status': 'ok',
        'browser_running': browser_running,
        'timestamp': time.time()
    })

if __name__ == '__main__':
    print("🚀 Iniciando API Server Simple para Browser Control")
    print("📍 Endpoints disponibles:")
    print("  • GET  /api/browser/status - Estado del browser")
    print("  • POST /api/browser/start  - Iniciar browser")
    print("  • POST /api/browser/stop   - Detener browser")
    print("  • GET  /api/browser/logs   - Ver logs")
    print("  • GET  /health             - Health check")
    print("")
    print("🌐 Servidor corriendo en http://localhost:5001")
    print("💡 Para usar desde frontend:")
    print("   fetch('http://localhost:5001/api/browser/start', {method: 'POST'})")
    print("")
    
    app.run(host='0.0.0.0', port=5001, debug=False)
