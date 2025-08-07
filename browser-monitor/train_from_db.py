#!/usr/bin/env python3
"""
Entrenamiento de Modelos desde Base de Datos PostgreSQL
"""
import os
import json
import numpy as np
import psycopg2
import pickle
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt

# Configuración de la base de datos
DB_URL = 'postgresql://neondb_owner:npg_h6dvHmE4PqRl@ep-misty-shape-aelsxf2q-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

class DBTrainer:
    def __init__(self):
        self.db_connection = None
        self.models = {}
        self.training_results = {}
        
    def connect_to_db(self):
        """Conectar a la base de datos"""
        try:
            print("🗄️ Conectando a la base de datos PostgreSQL...")
            self.db_connection = psycopg2.connect(DB_URL)
            print("✅ Conexión a la base de datos establecida")
            return True
        except Exception as e:
            print(f"❌ Error conectando a la base de datos: {e}")
            return False

    def load_data_from_db(self):
        """Cargar datos vectorizados desde la base de datos"""
        try:
            print("📊 Cargando datos desde la base de datos...")
            cursor = self.db_connection.cursor()
            
            # Obtener todos los datos vectorizados
            cursor.execute("""
                SELECT 
                    text_vector,
                    context_vector,
                    action_vector,
                    numerical_features,
                    user_intent,
                    page_type,
                    interaction_type,
                    teaching_moment,
                    error_pattern,
                    success_pattern
                FROM vectorized_data
                ORDER BY timestamp
            """)
            
            results = cursor.fetchall()
            cursor.close()
            
            if not results:
                print("❌ No hay datos en la base de datos")
                return False
                
            print(f"📊 Cargados {len(results)} registros desde la base de datos")
            
            # Procesar datos
            self.X_text = []
            self.X_context = []
            self.X_action = []
            self.X_numerical = []
            self.y_user_intent = []
            self.y_page_type = []
            self.y_interaction_type = []
            self.y_teaching_moment = []
            self.y_error_pattern = []
            self.y_success_pattern = []
            
            for row in results:
                # Text vector
                if row[0]:
                    text_vector = json.loads(row[0])
                    self.X_text.append(text_vector)
                else:
                    self.X_text.append([0] * 1000)
                    
                # Context vector
                if row[1]:
                    context_vector = json.loads(row[1])
                    self.X_context.append(context_vector)
                else:
                    self.X_context.append([0] * 10)
                    
                # Action vector
                if row[2]:
                    action_vector = json.loads(row[2])
                    self.X_action.append(action_vector)
                else:
                    self.X_action.append([0] * 6)
                    
                # Numerical features
                if row[3]:
                    numerical_features = json.loads(row[3])
                    self.X_numerical.append(numerical_features)
                else:
                    self.X_numerical.append([0] * 8)
                    
                # Labels
                self.y_user_intent.append(row[4] if row[4] else 'unknown')
                self.y_page_type.append(row[5] if row[5] else 'unknown')
                self.y_interaction_type.append(row[6] if row[6] else 'unknown')
                self.y_teaching_moment.append(1 if row[7] else 0)
                self.y_error_pattern.append(row[8] if row[8] else 'none')
                self.y_success_pattern.append(row[9] if row[9] else 'none')
            
            # Convertir a numpy arrays
            self.X_text = np.array(self.X_text)
            self.X_context = np.array(self.X_context)
            self.X_action = np.array(self.X_action)
            self.X_numerical = np.array(self.X_numerical)
            
            print(f"✅ Datos procesados:")
            print(f"   - Text vectors: {self.X_text.shape}")
            print(f"   - Context vectors: {self.X_context.shape}")
            print(f"   - Action vectors: {self.X_action.shape}")
            print(f"   - Numerical features: {self.X_numerical.shape}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error cargando datos desde DB: {e}")
            return False

    def prepare_training_data(self):
        """Preparar datos para entrenamiento"""
        try:
            print("🔧 Preparando datos para entrenamiento...")
            
            # Combinar todas las características
            self.X_combined = np.concatenate([
                self.X_text,
                self.X_context,
                self.X_action,
                self.X_numerical
            ], axis=1)
            
            print(f"✅ Características combinadas: {self.X_combined.shape}")
            
            # Preparar diferentes targets para diferentes modelos
            self.targets = {
                'user_intent': self.y_user_intent,
                'page_type': self.y_page_type,
                'interaction_type': self.y_interaction_type,
                'teaching_moment': self.y_teaching_moment,
                'error_pattern': self.y_error_pattern,
                'success_pattern': self.y_success_pattern
            }
            
            return True
            
        except Exception as e:
            print(f"❌ Error preparando datos: {e}")
            return False

    def train_models(self):
        """Entrenar modelos de machine learning"""
        try:
            print("🤖 Entrenando modelos...")
            
            for target_name, y_target in self.targets.items():
                print(f"\n🎯 Entrenando modelo para: {target_name}")
                
                # Filtrar datos válidos
                valid_indices = [i for i, y in enumerate(y_target) if y is not None and y != 'unknown' and y != 'none']
                
                if len(valid_indices) < 10:
                    print(f"⚠️ Insuficientes datos para {target_name}: {len(valid_indices)} muestras")
                    continue
                    
                X_valid = self.X_combined[valid_indices]
                y_valid = [y_target[i] for i in valid_indices]
                
                # Split train/test
                X_train, X_test, y_train, y_test = train_test_split(
                    X_valid, y_valid, test_size=0.2, random_state=42
                )
                
                print(f"   📊 Datos de entrenamiento: {len(X_train)} muestras")
                print(f"   📊 Datos de prueba: {len(X_test)} muestras")
                
                # Entrenar Random Forest
                rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
                rf_model.fit(X_train, y_train)
                rf_score = accuracy_score(y_test, rf_model.predict(X_test))
                
                # Entrenar Neural Network
                nn_model = MLPClassifier(hidden_layer_sizes=(100, 50), max_iter=500, random_state=42)
                nn_model.fit(X_train, y_train)
                nn_score = accuracy_score(y_test, nn_model.predict(X_test))
                
                # Guardar resultados
                self.models[target_name] = {
                    'random_forest': rf_model,
                    'neural_network': nn_model,
                    'rf_score': rf_score,
                    'nn_score': nn_score,
                    'X_test': X_test,
                    'y_test': y_test
                }
                
                print(f"   ✅ Random Forest accuracy: {rf_score:.3f}")
                print(f"   ✅ Neural Network accuracy: {nn_score:.3f}")
                
        except Exception as e:
            print(f"❌ Error entrenando modelos: {e}")
            import traceback
            traceback.print_exc()

    def evaluate_models(self):
        """Evaluar modelos entrenados"""
        try:
            print("\n📊 Evaluación de Modelos")
            print("=" * 50)
            
            for target_name, model_data in self.models.items():
                print(f"\n🎯 Modelo: {target_name}")
                print("-" * 30)
                
                # Random Forest
                rf_predictions = model_data['random_forest'].predict(model_data['X_test'])
                print("🌲 Random Forest:")
                print(f"   Accuracy: {model_data['rf_score']:.3f}")
                print("   Classification Report:")
                print(classification_report(model_data['y_test'], rf_predictions, zero_division=0))
                
                # Neural Network
                nn_predictions = model_data['neural_network'].predict(model_data['X_test'])
                print("🧠 Neural Network:")
                print(f"   Accuracy: {model_data['nn_score']:.3f}")
                print("   Classification Report:")
                print(classification_report(model_data['y_test'], nn_predictions, zero_division=0))
                
        except Exception as e:
            print(f"❌ Error evaluando modelos: {e}")

    def save_models(self):
        """Guardar modelos entrenados"""
        try:
            print("\n💾 Guardando modelos...")
            
            # Crear directorio si no existe
            os.makedirs('trained_models_db', exist_ok=True)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            
            for target_name, model_data in self.models.items():
                # Guardar Random Forest
                rf_filename = f"trained_models_db/rf_{target_name}_{timestamp}.pkl"
                with open(rf_filename, 'wb') as f:
                    pickle.dump(model_data['random_forest'], f)
                print(f"   💾 Random Forest guardado: {rf_filename}")
                
                # Guardar Neural Network
                nn_filename = f"trained_models_db/nn_{target_name}_{timestamp}.pkl"
                with open(nn_filename, 'wb') as f:
                    pickle.dump(model_data['neural_network'], f)
                print(f"   💾 Neural Network guardado: {nn_filename}")
                
            # Guardar metadatos
            metadata = {
                'timestamp': timestamp,
                'models_trained': list(self.models.keys()),
                'data_shape': self.X_combined.shape,
                'training_results': {
                    target: {
                        'rf_score': model_data['rf_score'],
                        'nn_score': model_data['nn_score']
                    } for target, model_data in self.models.items()
                }
            }
            
            metadata_filename = f"trained_models_db/metadata_{timestamp}.json"
            with open(metadata_filename, 'w') as f:
                json.dump(metadata, f, indent=2)
            print(f"   💾 Metadatos guardados: {metadata_filename}")
            
        except Exception as e:
            print(f"❌ Error guardando modelos: {e}")

    def create_visualizations(self):
        """Crear visualizaciones de los resultados"""
        try:
            print("\n📈 Creando visualizaciones...")
            
            # Crear directorio si no existe
            os.makedirs('visualizations_db', exist_ok=True)
            
            # Comparar accuracy de modelos
            model_names = list(self.models.keys())
            rf_scores = [self.models[name]['rf_score'] for name in model_names]
            nn_scores = [self.models[name]['nn_score'] for name in model_names]
            
            x = np.arange(len(model_names))
            width = 0.35
            
            fig, ax = plt.subplots(figsize=(12, 6))
            bars1 = ax.bar(x - width/2, rf_scores, width, label='Random Forest', color='skyblue')
            bars2 = ax.bar(x + width/2, nn_scores, width, label='Neural Network', color='lightcoral')
            
            ax.set_xlabel('Modelos')
            ax.set_ylabel('Accuracy')
            ax.set_title('Comparación de Accuracy por Modelo')
            ax.set_xticks(x)
            ax.set_xticklabels(model_names, rotation=45)
            ax.legend()
            
            # Agregar valores en las barras
            for bars in [bars1, bars2]:
                for bar in bars:
                    height = bar.get_height()
                    ax.annotate(f'{height:.3f}',
                                xy=(bar.get_x() + bar.get_width() / 2, height),
                                xytext=(0, 3),
                                textcoords="offset points",
                                ha='center', va='bottom')
            
            plt.tight_layout()
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            viz_filename = f"visualizations_db/model_comparison_{timestamp}.png"
            plt.savefig(viz_filename, dpi=300, bbox_inches='tight')
            print(f"   📈 Visualización guardada: {viz_filename}")
            
            plt.close()
            
        except Exception as e:
            print(f"❌ Error creando visualizaciones: {e}")

    def predict_from_db(self, session_id=None):
        """Hacer predicciones usando datos de la base de datos"""
        try:
            print("\n🔮 Haciendo predicciones...")
            
            cursor = self.db_connection.cursor()
            
            if session_id:
                # Predicciones para una sesión específica
                cursor.execute("""
                    SELECT text_vector, context_vector, action_vector, numerical_features
                    FROM vectorized_data
                    WHERE session_id = %s
                    ORDER BY timestamp DESC
                    LIMIT 10
                """, (session_id,))
            else:
                # Predicciones para los últimos datos
                cursor.execute("""
                    SELECT text_vector, context_vector, action_vector, numerical_features
                    FROM vectorized_data
                    ORDER BY timestamp DESC
                    LIMIT 10
                """)
            
            recent_data = cursor.fetchall()
            cursor.close()
            
            if not recent_data:
                print("❌ No hay datos recientes para predicción")
                return
                
            print(f"📊 Haciendo predicciones para {len(recent_data)} muestras recientes...")
            
            for i, row in enumerate(recent_data):
                print(f"\n🔮 Predicción {i+1}:")
                
                # Preparar datos
                text_vector = json.loads(row[0]) if row[0] else [0] * 1000
                context_vector = json.loads(row[1]) if row[1] else [0] * 10
                action_vector = json.loads(row[2]) if row[2] else [0] * 6
                numerical_features = json.loads(row[3]) if row[3] else [0] * 8
                
                features = np.concatenate([text_vector, context_vector, action_vector, numerical_features]).reshape(1, -1)
                
                # Hacer predicciones
                for target_name, model_data in self.models.items():
                    rf_pred = model_data['random_forest'].predict(features)[0]
                    nn_pred = model_data['neural_network'].predict(features)[0]
                    
                    print(f"   {target_name}:")
                    print(f"     🌲 Random Forest: {rf_pred}")
                    print(f"     🧠 Neural Network: {nn_pred}")
                    
        except Exception as e:
            print(f"❌ Error haciendo predicciones: {e}")

    def close_db_connection(self):
        """Cerrar conexión a la base de datos"""
        if self.db_connection:
            self.db_connection.close()
            print("✅ Conexión a la base de datos cerrada")

def main():
    """Función principal"""
    print("🤖 Entrenamiento de Modelos desde Base de Datos")
    print("=" * 60)
    print("🗄️ Base de datos: PostgreSQL (Neon)")
    print()
    
    trainer = None
    try:
        trainer = DBTrainer()
        
        if not trainer.connect_to_db():
            print("❌ No se pudo conectar a la base de datos")
            return
            
        if not trainer.load_data_from_db():
            print("❌ No se pudieron cargar datos desde la base de datos")
            return
            
        if not trainer.prepare_training_data():
            print("❌ No se pudieron preparar los datos")
            return
            
        trainer.train_models()
        trainer.evaluate_models()
        trainer.save_models()
        trainer.create_visualizations()
        
        # Hacer predicciones de ejemplo
        trainer.predict_from_db()
        
        print("\n🎉 ¡Entrenamiento completado!")
        print("📁 Modelos guardados en: trained_models_db/")
        print("📈 Visualizaciones en: visualizations_db/")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if trainer:
            trainer.close_db_connection()
        print("✅ Entrenamiento desde DB completado")

if __name__ == "__main__":
    main()
