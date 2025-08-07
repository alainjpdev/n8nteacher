#!/usr/bin/env python3
"""
Recolector de Datos Vectorizados con Base de Datos PostgreSQL
"""
import os
import time
import json
import numpy as np
import threading
import psycopg2
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Configuración
N8N_URL = 'http://localhost:5678'

# Rutas que funcionan
CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CHROMEDRIVER_PATH = "/Users/wavesmanagement/.wdm/drivers/chromedriver/mac64/139.0.7258.66/chromedriver-mac-arm64/chromedriver"

# Configuración de la base de datos
DB_URL = 'postgresql://neondb_owner:npg_h6dvHmE4PqRl@ep-misty-shape-aelsxf2q-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

class DBVectorizedCollector:
    def __init__(self):
        self.driver = None
        self.is_monitoring = False
        self.current_url = ""
        self.current_title = ""
        self.monitor_thread = None
        self.last_page_source = ""
        self.db_connection = None
        self.session_id = datetime.now().strftime("%Y%m%d_%H%M%S")

        # Vectorizadores
        self.text_vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.context_encoder = LabelEncoder()
        self.action_encoder = LabelEncoder()

        # Contadores para evitar repeticiones
        self.last_errors = []
        self.last_actions = []
        self.last_context = ""

        # Acumuladores para vectorización
        self.text_corpus = []
        self.context_categories = []
        self.action_categories = []

        # Conectar a la base de datos
        self._setup_database()

    def _setup_database(self):
        """Configurar la base de datos y crear tablas"""
        try:
            print("🗄️ Conectando a la base de datos PostgreSQL...")
            self.db_connection = psycopg2.connect(DB_URL)
            print("✅ Conexión a la base de datos establecida")
            
            # Crear tablas si no existen
            self._create_tables()
            
        except Exception as e:
            print(f"❌ Error conectando a la base de datos: {e}")
            raise

    def _create_tables(self):
        """Crear tablas en la base de datos"""
        try:
            cursor = self.db_connection.cursor()
            
            # Tabla para sesiones
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sessions (
                    session_id VARCHAR(50) PRIMARY KEY,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    total_samples INTEGER DEFAULT 0,
                    status VARCHAR(20) DEFAULT 'active'
                )
            """)
            
            # Tabla para datos vectorizados
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS vectorized_data (
                    id SERIAL PRIMARY KEY,
                    session_id VARCHAR(50) REFERENCES sessions(session_id),
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    text_vector JSONB,
                    context_vector JSONB,
                    action_vector JSONB,
                    numerical_features JSONB,
                    teaching_moment JSONB,
                    error_pattern VARCHAR(100),
                    success_pattern VARCHAR(100),
                    user_intent VARCHAR(100),
                    page_type VARCHAR(50),
                    interaction_type VARCHAR(50)
                )
            """)
            
            # Tabla para metadatos
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS metadata (
                    session_id VARCHAR(50) REFERENCES sessions(session_id),
                    context_categories JSONB,
                    action_categories JSONB,
                    feature_names JSONB,
                    text_vectorizer_state JSONB,
                    context_encoder_state JSONB,
                    action_encoder_state JSONB
                )
            """)
            
            # Insertar sesión actual
            cursor.execute("""
                INSERT INTO sessions (session_id, created_at)
                VALUES (%s, CURRENT_TIMESTAMP)
                ON CONFLICT (session_id) DO NOTHING
            """, (self.session_id,))
            
            self.db_connection.commit()
            cursor.close()
            print("✅ Tablas creadas/verificadas en la base de datos")
            
        except Exception as e:
            print(f"❌ Error creando tablas: {e}")
            raise

    def start_browser(self):
        """Abrir Chrome"""
        try:
            print("🧪 Recolector DB: Abriendo Chrome...")
            chrome_options = Options()
            chrome_options.binary_location = CHROME_PATH
            chrome_options.add_argument("--start-maximized")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            service = Service(CHROMEDRIVER_PATH)
            print("🌐 Iniciando Chrome...")
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            print("✅ Chrome abierto correctamente!")
            return True
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()
            return False

    def navigate_to_n8n(self):
        """Navegar a n8n"""
        try:
            if not self.driver:
                print("❌ Navegador no abierto")
                return False
            print(f"🌐 Navegando a n8n...")
            print(f"📍 URL: {N8N_URL}")
            self.driver.get(N8N_URL)
            self.current_url = self.driver.current_url
            self.current_title = self.driver.title
            time.sleep(3)
            print(f"✅ Navegado a: {self.driver.title}")
            return True
        except Exception as e:
            print(f"❌ Error navegando a n8n: {e}")
            return False

    def start_data_collection(self):
        """Iniciar recolección de datos vectorizados en DB"""
        if not self.driver:
            print("❌ Navegador no abierto")
            return False
        self.is_monitoring = True
        self.monitor_thread = threading.Thread(target=self._db_vectorized_loop, daemon=True)
        self.monitor_thread.start()
        print("📊 Recolección de datos vectorizados en DB iniciada")
        return True

    def _db_vectorized_loop(self):
        """Loop de recolección de datos vectorizados en DB"""
        print("📊 Recolectando y guardando datos vectorizados en DB...")
        while self.is_monitoring and self.driver:
            try:
                current_url = self.driver.current_url
                current_title = self.driver.title
                current_page_source = self.driver.page_source
                
                if current_url != self.current_url:
                    self._collect_db_navigation(current_url, current_title)
                    self.current_url = current_url
                    self.current_title = current_title
                    
                if current_page_source != self.last_page_source:
                    self._collect_db_interactions(current_page_source)
                    self.last_page_source = current_page_source
                    
                self._collect_db_n8n_data()
                time.sleep(0.5)
                
            except Exception as e:
                print(f"❌ Error en recolección DB: {e}")
                time.sleep(1)

    def _collect_db_navigation(self, url, title):
        """Recolectar y guardar datos de navegación en DB"""
        try:
            text_features = f"{url} {title}"
            self.text_corpus.append(text_features)
            
            if len(self.text_corpus) > 1:
                text_vector = self.text_vectorizer.fit_transform([text_features]).toarray()[0]
            else:
                text_vector = np.zeros(1000)
                
            numerical_features = [
                len(url), len(title), url.count('/'), url.count('?'), url.count('='),
                1 if 'workflow' in url.lower() else 0, 
                1 if 'signin' in url.lower() else 0, 
                1 if 'home' in url.lower() else 0
            ]
            
            context = self._analyze_context(url, title)
            self.context_categories.append(context['page_type'])
            context_vector = self._encode_context(context)
            
            # Guardar en DB
            cursor = self.db_connection.cursor()
            cursor.execute("""
                INSERT INTO vectorized_data 
                (session_id, text_vector, context_vector, numerical_features, 
                 user_intent, page_type, interaction_type)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                self.session_id,
                json.dumps(text_vector.tolist()),
                json.dumps(context_vector),
                json.dumps(numerical_features),
                context['user_intent'],
                context['page_type'],
                'navigation'
            ))
            
            self.db_connection.commit()
            cursor.close()
            print(f"📊 Navegación guardada en DB: {context['page_type']}")
            
        except Exception as e:
            print(f"❌ Error guardando navegación en DB: {e}")

    def _collect_db_interactions(self, page_source):
        """Recolectar y guardar datos de interacciones en DB"""
        try:
            text_features = self._extract_page_text_features(page_source)
            self.text_corpus.append(text_features)
            
            if len(self.text_corpus) > 1:
                text_vector = self.text_vectorizer.fit_transform([text_features]).toarray()[0]
            else:
                text_vector = np.zeros(1000)
                
            numerical_features = [
                len(page_source), page_source.count('button'), page_source.count('input'),
                page_source.count('form'), page_source.count('error'), page_source.count('success'),
                page_source.count('manual trigger'), page_source.count('execute workflow'), page_source.count('save')
            ]
            
            interaction_type = self._detect_interaction_type(page_source)
            self.action_categories.append(interaction_type)
            action_vector = self._encode_action(interaction_type)
            
            teaching_moment = self._detect_vectorized_teaching_moment(page_source)
            
            # Guardar en DB
            cursor = self.db_connection.cursor()
            cursor.execute("""
                INSERT INTO vectorized_data 
                (session_id, text_vector, action_vector, numerical_features, 
                 teaching_moment, interaction_type)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                self.session_id,
                json.dumps(text_vector.tolist()),
                json.dumps(action_vector),
                json.dumps(numerical_features),
                json.dumps(teaching_moment) if teaching_moment else None,
                interaction_type
            ))
            
            self.db_connection.commit()
            cursor.close()
            print(f"📊 Interacción guardada en DB: {interaction_type}")
            
        except Exception as e:
            print(f"❌ Error guardando interacción en DB: {e}")

    def _collect_db_n8n_data(self):
        """Recolectar datos específicos de n8n y guardar en DB"""
        try:
            # Detectar elementos de workflow
            workflow_elements = self.driver.find_elements(By.CSS_SELECTOR, "[data-test-id*='node']")
            if workflow_elements:
                workflow_text = " ".join([elem.text.strip() for elem in workflow_elements if elem.text.strip()])
                self.text_corpus.append(workflow_text)
                text_vector = self.text_vectorizer.fit_transform([workflow_text]).toarray()[0]
                numerical_features = [len(workflow_elements), len(workflow_text)]
                
                cursor = self.db_connection.cursor()
                cursor.execute("""
                    INSERT INTO vectorized_data 
                    (session_id, text_vector, numerical_features, success_pattern)
                    VALUES (%s, %s, %s, %s)
                """, (
                    self.session_id,
                    json.dumps(text_vector.tolist()),
                    json.dumps(numerical_features),
                    'workflow_elements_detected'
                ))
                self.db_connection.commit()
                cursor.close()
                
            # Detectar errores
            error_elements = self.driver.find_elements(By.XPATH, "//*[contains(@class, 'error') or contains(@class, 'warning')]")
            current_errors = []
            for error in error_elements:
                try:
                    error_text = error.text.strip()
                    if error_text:
                        current_errors.append(error_text)
                except:
                    pass
                    
            if current_errors != self.last_errors:
                if current_errors:
                    error_text = " ".join(current_errors)
                    self.text_corpus.append(error_text)
                    text_vector = self.text_vectorizer.fit_transform([error_text]).toarray()[0]
                    numerical_features = [len(current_errors), len(error_text)]
                    
                    cursor = self.db_connection.cursor()
                    cursor.execute("""
                        INSERT INTO vectorized_data 
                        (session_id, text_vector, numerical_features, error_pattern)
                        VALUES (%s, %s, %s, %s)
                    """, (
                        self.session_id,
                        json.dumps(text_vector.tolist()),
                        json.dumps(numerical_features),
                        self._categorize_error(current_errors)
                    ))
                    self.db_connection.commit()
                    cursor.close()
                    
                self.last_errors = current_errors
                
        except Exception as e:
            print(f"❌ Error guardando datos n8n en DB: {e}")

    def _analyze_context(self, url, title):
        """Analizar el contexto de la navegación"""
        context = {"page_type": "unknown", "user_intent": "unknown", "teaching_opportunity": False}
        if "workflow" in url.lower():
            context["page_type"] = "workflow_editor"
            context["user_intent"] = "creating_or_editing_workflow"
            context["teaching_opportunity"] = True
        elif "signin" in url.lower():
            context["page_type"] = "authentication"
            context["user_intent"] = "logging_in"
        elif "home" in url.lower():
            context["page_type"] = "dashboard"
            context["user_intent"] = "browsing_workflows"
        elif "settings" in url.lower():
            context["page_type"] = "configuration"
            context["user_intent"] = "configuring_platform"
        return context

    def _extract_page_text_features(self, page_source):
        """Extraer características de texto de la página"""
        import re
        text_content = re.sub(r'<[^>]+>', '', page_source)
        text_content = re.sub(r'\s+', ' ', text_content)
        return text_content[:1000]

    def _detect_interaction_type(self, page_source):
        """Detectar tipo de interacción"""
        page_lower = page_source.lower()
        if "manual trigger" in page_lower: return "manual_trigger_interaction"
        elif "execute workflow" in page_lower: return "execution_interaction"
        elif "save" in page_lower: return "save_interaction"
        elif "error" in page_lower: return "error_interaction"
        elif "success" in page_lower: return "success_interaction"
        else: return "general_interaction"

    def _detect_vectorized_teaching_moment(self, page_source):
        """Detectar momentos de enseñanza vectorizados"""
        teaching_moment = None
        if "manual trigger" in page_source.lower():
            teaching_moment = {
                "type": "manual_trigger_lesson",
                "context": "workflow_creation",
                "teaching_points": ["Manual Trigger es el punto de inicio", "Se ejecuta manualmente", "Puede recibir datos de entrada"],
                "user_action_needed": "configure_manual_trigger"
            }
        elif "execute workflow" in page_source.lower():
            teaching_moment = {
                "type": "execution_lesson",
                "context": "workflow_testing",
                "teaching_points": ["Execute workflow ejecuta todo el workflow", "Execute node ejecuta solo el nodo seleccionado", "Los resultados aparecen en el panel derecho"],
                "user_action_needed": "execute_workflow"
            }
        elif "save" in page_source.lower():
            teaching_moment = {
                "type": "save_lesson",
                "context": "workflow_persistence",
                "teaching_points": ["Usa Ctrl+S para guardar rápidamente", "Dale un nombre descriptivo", "Guarda frecuentemente"],
                "user_action_needed": "save_workflow"
            }
        return teaching_moment

    def _encode_context(self, context):
        """Codificar contexto como vector"""
        context_vector = [0] * 10
        page_types = ["workflow_editor", "authentication", "dashboard", "configuration", "unknown"]
        if context["page_type"] in page_types:
            context_vector[page_types.index(context["page_type"])] = 1
        intents = ["creating_or_editing_workflow", "logging_in", "browsing_workflows", "configuring_platform", "unknown"]
        if context["user_intent"] in intents:
            context_vector[5 + intents.index(context["user_intent"])] = 1
        return context_vector

    def _encode_action(self, action_type):
        """Codificar acción como vector"""
        action_vector = [0] * 6
        action_types = ["manual_trigger_interaction", "execution_interaction", "save_interaction", "error_interaction", "success_interaction", "general_interaction"]
        if action_type in action_types:
            action_vector[action_types.index(action_type)] = 1
        return action_vector

    def _categorize_error(self, errors):
        """Categorizar errores"""
        error_text = " ".join(errors).lower()
        if "manual trigger" in error_text: return "manual_trigger_error"
        elif "execute" in error_text: return "execution_error"
        elif "save" in error_text: return "save_error"
        else: return "general_error"

    def get_db_summary(self):
        """Obtener resumen de datos en DB"""
        try:
            cursor = self.db_connection.cursor()
            
            # Contar registros por sesión
            cursor.execute("""
                SELECT COUNT(*) as total_samples,
                       COUNT(CASE WHEN teaching_moment IS NOT NULL THEN 1 END) as teaching_moments,
                       COUNT(CASE WHEN error_pattern IS NOT NULL THEN 1 END) as error_patterns,
                       COUNT(CASE WHEN success_pattern IS NOT NULL THEN 1 END) as success_patterns
                FROM vectorized_data 
                WHERE session_id = %s
            """, (self.session_id,))
            
            result = cursor.fetchone()
            cursor.close()
            
            return {
                "session_id": self.session_id,
                "total_samples": result[0] if result else 0,
                "teaching_moments": result[1] if result else 0,
                "error_patterns": result[2] if result else 0,
                "success_patterns": result[3] if result else 0
            }
            
        except Exception as e:
            print(f"❌ Error obteniendo resumen de DB: {e}")
            return {"error": str(e)}

    def save_metadata_to_db(self):
        """Guardar metadatos en DB"""
        try:
            cursor = self.db_connection.cursor()
            cursor.execute("""
                INSERT INTO metadata 
                (session_id, context_categories, action_categories, feature_names)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (session_id) DO UPDATE SET
                context_categories = EXCLUDED.context_categories,
                action_categories = EXCLUDED.action_categories,
                feature_names = EXCLUDED.feature_names
            """, (
                self.session_id,
                json.dumps(list(set(self.context_categories))),
                json.dumps(list(set(self.action_categories))),
                json.dumps(["url_length", "title_length", "url_slashes", "url_params", "url_equals", "is_workflow", "is_signin", "is_home"])
            ))
            
            self.db_connection.commit()
            cursor.close()
            print("💾 Metadatos guardados en DB")
            
        except Exception as e:
            print(f"❌ Error guardando metadatos en DB: {e}")

    def stop_browser(self):
        """Cerrar navegador"""
        try:
            if self.driver:
                self.stop_monitoring()
                self.driver.quit()
                self.driver = None
                print("✅ Navegador Chrome cerrado")
                return True
            return False
        except Exception as e:
            print(f"❌ Error cerrando navegador: {e}")
            return False

    def stop_monitoring(self):
        """Detener monitoreo"""
        self.is_monitoring = False
        print("📊 Recolección de datos vectorizados en DB detenida")
        return True

    def close_db_connection(self):
        """Cerrar conexión a la base de datos"""
        if self.db_connection:
            self.save_metadata_to_db()
            self.db_connection.close()
            print("✅ Conexión a la base de datos cerrada")

def main():
    """Función principal"""
    print("📊 Recolector de Datos Vectorizados con Base de Datos")
    print("=" * 60)
    print(f"🔗 Conectando a: {N8N_URL}")
    print(f"🗄️ Base de datos: PostgreSQL (Neon)")
    print(f"📍 Chrome path: {CHROME_PATH}")
    print(f"📁 ChromeDriver path: {CHROMEDRIVER_PATH}")
    print()
    
    collector = None
    try:
        collector = DBVectorizedCollector()
        
        if not collector.start_browser():
            print("❌ No se pudo abrir el browser")
            return
            
        if not collector.navigate_to_n8n():
            print("❌ No se pudo navegar a n8n")
            collector.stop_browser()
            return
            
        if not collector.start_data_collection():
            print("❌ No se pudo iniciar la recolección")
            collector.stop_browser()
            return
            
        print("🎉 ¡Recolector de datos vectorizados con DB funcionando!")
        print("📊 Recolectando y guardando datos vectorizados en PostgreSQL")
        print("📋 Comandos disponibles:")
        print("  - Presiona 's' + Enter para ver resumen de DB")
        print("  - Presiona 'q' + Enter para salir")
        print()
        
        while True:
            command = input("Comando (s/q): ").strip().lower()
            if command == 's':
                summary = collector.get_db_summary()
                print(f"📊 Resumen de datos en DB: {json.dumps(summary, indent=2)}")
            elif command == 'q':
                print("🔄 Cerrando...")
                break
            else:
                print("❓ Comando no válido")
                
    except KeyboardInterrupt:
        print("\n🔄 Cerrando por Ctrl+C...")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if collector:
            collector.stop_browser()
            collector.close_db_connection()
        print("✅ Recolector de datos vectorizados con DB cerrado")

if __name__ == "__main__":
    main()
