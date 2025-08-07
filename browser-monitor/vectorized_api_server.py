#!/usr/bin/env python3
"""
Servidor API para Recolector de Datos Vectorizados
"""
import os
import json
import threading
import time
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from db_vectorized_collector import DBVectorizedCollector

app = Flask(__name__)
CORS(app)

# Configuración
DB_URL = 'postgresql://neondb_owner:npg_h6dvHmE4PqRl@ep-misty-shape-aelsxf2q-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

# Variables globales
collector = None
collector_thread = None
collector_status = {
    'browser_running': False,
    'monitoring': False,
    'db_connected': False,
    'session_id': '',
    'total_samples': 0,
    'teaching_moments': 0,
    'error_patterns': 0,
    'success_patterns': 0
}

def get_db_connection():
    """Obtener conexión a la base de datos"""
    try:
        return psycopg2.connect(DB_URL)
    except Exception as e:
        print(f"❌ Error conectando a DB: {e}")
        return None

@app.route('/api/vectorized/status', methods=['GET'])
def get_status():
    """Obtener estado del recolector"""
    global collector_status
    
    # Actualizar estadísticas desde DB si está conectado
    if collector_status['db_connected']:
        try:
            conn = get_db_connection()
            if conn:
                cursor = conn.cursor()
                
                # Obtener estadísticas de la sesión actual
                if collector_status['session_id']:
                    cursor.execute("""
                        SELECT COUNT(*) as total_samples,
                               COUNT(CASE WHEN teaching_moment IS NOT NULL THEN 1 END) as teaching_moments,
                               COUNT(CASE WHEN error_pattern IS NOT NULL THEN 1 END) as error_patterns,
                               COUNT(CASE WHEN success_pattern IS NOT NULL THEN 1 END) as success_patterns
                        FROM vectorized_data 
                        WHERE session_id = %s
                    """, (collector_status['session_id'],))
                    
                    result = cursor.fetchone()
                    if result:
                        collector_status['total_samples'] = result[0]
                        collector_status['teaching_moments'] = result[1]
                        collector_status['error_patterns'] = result[2]
                        collector_status['success_patterns'] = result[3]
                
                cursor.close()
                conn.close()
        except Exception as e:
            print(f"❌ Error obteniendo estadísticas: {e}")
    
    return jsonify(collector_status)

@app.route('/api/vectorized/db-stats', methods=['GET'])
def get_db_stats():
    """Obtener estadísticas de la base de datos"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({
                'total_sessions': 0,
                'total_records': 0,
                'last_session': None
            })
        
        cursor = conn.cursor()
        
        # Contar sesiones totales
        cursor.execute("SELECT COUNT(*) FROM sessions")
        total_sessions = cursor.fetchone()[0]
        
        # Contar registros totales
        cursor.execute("SELECT COUNT(*) FROM vectorized_data")
        total_records = cursor.fetchone()[0]
        
        # Obtener última sesión
        cursor.execute("""
            SELECT session_id, created_at 
            FROM sessions 
            ORDER BY created_at DESC 
            LIMIT 1
        """)
        last_session_result = cursor.fetchone()
        last_session = last_session_result[1].isoformat() if last_session_result else None
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'total_sessions': total_sessions,
            'total_records': total_records,
            'last_session': last_session
        })
        
    except Exception as e:
        print(f"❌ Error obteniendo estadísticas de DB: {e}")
        return jsonify({
            'total_sessions': 0,
            'total_records': 0,
            'last_session': None
        })

@app.route('/api/vectorized/start-browser', methods=['POST'])
def start_browser():
    """Iniciar navegador"""
    global collector, collector_status
    
    try:
        if collector_status['browser_running']:
            return jsonify({'status': 'error', 'message': 'Navegador ya está ejecutándose'})
        
        collector = DBVectorizedCollector()
        
        if collector.start_browser():
            collector_status['browser_running'] = True
            collector_status['db_connected'] = True
            collector_status['session_id'] = collector.session_id
            return jsonify({'status': 'success', 'message': 'Navegador iniciado correctamente'})
        else:
            return jsonify({'status': 'error', 'message': 'Error iniciando navegador'})
            
    except Exception as e:
        print(f"❌ Error iniciando navegador: {e}")
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/api/vectorized/stop-browser', methods=['POST'])
def stop_browser():
    """Cerrar navegador"""
    global collector, collector_status
    
    try:
        if not collector_status['browser_running']:
            return jsonify({'status': 'error', 'message': 'Navegador no está ejecutándose'})
        
        if collector:
            collector.stop_browser()
            collector.close_db_connection()
            collector = None
        
        collector_status['browser_running'] = False
        collector_status['monitoring'] = False
        collector_status['session_id'] = ''
        
        return jsonify({'status': 'success', 'message': 'Navegador cerrado correctamente'})
        
    except Exception as e:
        print(f"❌ Error cerrando navegador: {e}")
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/api/vectorized/start-collection', methods=['POST'])
def start_collection():
    """Iniciar recolección de datos"""
    global collector, collector_status, collector_thread
    
    try:
        if not collector_status['browser_running']:
            return jsonify({'status': 'error', 'message': 'Navegador no está ejecutándose'})
        
        if collector_status['monitoring']:
            return jsonify({'status': 'error', 'message': 'Recolección ya está activa'})
        
        if collector:
            # Navegar a n8n si no está ya ahí
            if not collector.current_url or 'localhost:5678' not in collector.current_url:
                if not collector.navigate_to_n8n():
                    return jsonify({'status': 'error', 'message': 'Error navegando a n8n'})
            
            # Iniciar recolección
            if collector.start_data_collection():
                collector_status['monitoring'] = True
                
                # Iniciar thread para actualizar estado
                collector_thread = threading.Thread(target=update_collector_status, daemon=True)
                collector_thread.start()
                
                return jsonify({'status': 'success', 'message': 'Recolección iniciada correctamente'})
            else:
                return jsonify({'status': 'error', 'message': 'Error iniciando recolección'})
        else:
            return jsonify({'status': 'error', 'message': 'Recolector no inicializado'})
            
    except Exception as e:
        print(f"❌ Error iniciando recolección: {e}")
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/api/vectorized/stop-collection', methods=['POST'])
def stop_collection():
    """Detener recolección de datos"""
    global collector, collector_status
    
    try:
        if not collector_status['monitoring']:
            return jsonify({'status': 'error', 'message': 'Recolección no está activa'})
        
        if collector:
            collector.stop_monitoring()
            collector.save_metadata_to_db()
        
        collector_status['monitoring'] = False
        
        return jsonify({'status': 'success', 'message': 'Recolección detenida correctamente'})
        
    except Exception as e:
        print(f"❌ Error deteniendo recolección: {e}")
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/api/vectorized/db-summary', methods=['GET'])
def get_db_summary():
    """Obtener resumen de la base de datos"""
    global collector_status
    
    try:
        if collector and collector_status['session_id']:
            summary = collector.get_db_summary()
            collector_status.update(summary)
            return jsonify(summary)
        else:
            return jsonify({'error': 'No hay sesión activa'})
            
    except Exception as e:
        print(f"❌ Error obteniendo resumen: {e}")
        return jsonify({'error': str(e)})

@app.route('/api/vectorized/recent-data', methods=['GET'])
def get_recent_data():
    """Obtener datos recientes"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'recent_data': []})
        
        cursor = conn.cursor()
        
        # Obtener datos recientes
        cursor.execute("""
            SELECT 
                timestamp,
                page_type,
                user_intent,
                interaction_type,
                teaching_moment,
                error_pattern,
                success_pattern
            FROM vectorized_data
            ORDER BY timestamp DESC
            LIMIT 20
        """)
        
        results = cursor.fetchall()
        recent_data = []
        
        for row in results:
            recent_data.append({
                'timestamp': row[0].isoformat() if row[0] else None,
                'page_type': row[1],
                'user_intent': row[2],
                'interaction_type': row[3],
                'teaching_moment': bool(row[4]),
                'error_pattern': row[5],
                'success_pattern': row[6]
            })
        
        cursor.close()
        conn.close()
        
        return jsonify({'recent_data': recent_data})
        
    except Exception as e:
        print(f"❌ Error obteniendo datos recientes: {e}")
        return jsonify({'recent_data': []})

@app.route('/api/vectorized/train-models', methods=['POST'])
def train_models():
    """Entrenar modelos desde la base de datos"""
    try:
        # Importar el entrenador
        from train_from_db import DBTrainer
        
        trainer = DBTrainer()
        
        if not trainer.connect_to_db():
            return jsonify({'status': 'error', 'message': 'Error conectando a la base de datos'})
        
        if not trainer.load_data_from_db():
            return jsonify({'status': 'error', 'message': 'No hay datos para entrenar'})
        
        if not trainer.prepare_training_data():
            return jsonify({'status': 'error', 'message': 'Error preparando datos'})
        
        trainer.train_models()
        trainer.evaluate_models()
        trainer.save_models()
        trainer.create_visualizations()
        trainer.close_db_connection()
        
        return jsonify({'status': 'success', 'message': 'Modelos entrenados exitosamente'})
        
    except Exception as e:
        print(f"❌ Error entrenando modelos: {e}")
        return jsonify({'status': 'error', 'message': str(e)})

def update_collector_status():
    """Actualizar estado del recolector en background"""
    global collector_status
    
    while collector_status['monitoring'] and collector:
        try:
            if collector:
                summary = collector.get_vectorized_summary()
                collector_status.update(summary)
            time.sleep(5)  # Actualizar cada 5 segundos
        except Exception as e:
            print(f"❌ Error actualizando estado: {e}")
            time.sleep(10)

@app.route('/api/vectorized/current-status', methods=['GET'])
def get_current_status():
    """Obtener estado actual del navegador"""
    global collector, collector_status
    
    try:
        if collector and collector.driver:
            current_url = collector.driver.current_url
            current_title = collector.driver.title
            return jsonify({
                'current_url': current_url,
                'current_title': current_title,
                'browser_running': collector_status['browser_running'],
                'monitoring': collector_status['monitoring']
            })
        else:
            return jsonify({
                'current_url': None,
                'current_title': None,
                'browser_running': False,
                'monitoring': False
            })
    except Exception as e:
        print(f"❌ Error obteniendo estado actual: {e}")
        return jsonify({'error': str(e)})

@app.route('/api/vectorized/extract-token', methods=['POST'])
def extract_token():
    """Extraer token de n8n"""
    global collector
    
    try:
        if not collector or not collector.driver:
            return jsonify({'status': 'error', 'message': 'Navegador no está abierto'})
        
        # Intentar extraer token de localStorage
        token = collector.driver.execute_script("""
            return localStorage.getItem('n8n-auth-token') || 
                   localStorage.getItem('auth-token') ||
                   sessionStorage.getItem('n8n-auth-token') ||
                   sessionStorage.getItem('auth-token');
        """)
        
        # Si no hay token en localStorage, intentar extraer de cookies
        if not token:
            cookies = collector.driver.get_cookies()
            for cookie in cookies:
                if 'token' in cookie['name'].lower() or 'auth' in cookie['name'].lower():
                    token = cookie['value']
                    break
        
        # Extraer información adicional
        extracted_data = {
            'url': collector.driver.current_url,
            'title': collector.driver.title,
            'cookies_count': len(collector.driver.get_cookies()),
            'local_storage_keys': collector.driver.execute_script("""
                return Object.keys(localStorage);
            """),
            'session_storage_keys': collector.driver.execute_script("""
                return Object.keys(sessionStorage);
            """)
        }
        
        if token:
            return jsonify({
                'status': 'success',
                'token': token,
                'extracted_data': extracted_data
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'No se pudo extraer token',
                'extracted_data': extracted_data
            })
            
    except Exception as e:
        print(f"❌ Error extrayendo token: {e}")
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/health', methods=['GET'])
def health_check():
    """Health check"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    print("🚀 Iniciando servidor API para Recolector Vectorizado")
    print("=" * 60)
    print("🗄️ Base de datos: PostgreSQL (Neon)")
    print("🌐 Servidor: http://localhost:3004")
    print("📊 Endpoints disponibles:")
    print("  - GET  /api/vectorized/status")
    print("  - GET  /api/vectorized/db-stats")
    print("  - POST /api/vectorized/start-browser")
    print("  - POST /api/vectorized/stop-browser")
    print("  - POST /api/vectorized/start-collection")
    print("  - POST /api/vectorized/stop-collection")
    print("  - GET  /api/vectorized/db-summary")
    print("  - GET  /api/vectorized/recent-data")
    print("  - POST /api/vectorized/train-models")
    print()
    
    app.run(host='0.0.0.0', port=3004, debug=True)
