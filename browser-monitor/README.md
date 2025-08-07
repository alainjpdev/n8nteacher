# 🎓 Recolector de Datos Vectorizados para n8n

Sistema completo para recolectar, vectorizar y entrenar modelos de machine learning basados en interacciones de usuarios con n8n.

## 📁 Archivos Principales

### 🟢 Archivos que FUNCIONAN:

1. **`test_n8n.py`** - Test básico para verificar que Chrome abre y navega a n8n
2. **`simple_test.py`** - Test básico para verificar que Chrome abre correctamente
3. **`db_vectorized_collector.py`** - Recolector principal que guarda datos vectorizados en PostgreSQL
4. **`vectorized_api_server.py`** - Servidor API para el frontend React
5. **`train_from_db.py`** - Entrenamiento de modelos ML desde la base de datos
6. **`requirements.txt`** - Dependencias de Python
7. **`README_TRAINING.md`** - Documentación completa del sistema de entrenamiento

## 🚀 Uso Rápido

### 1. Instalar dependencias:
```bash
pip install -r requirements.txt
```

### 2. Probar que Chrome funciona:
```bash
python3 simple_test.py
```

### 3. Probar que Chrome navega a n8n:
```bash
python3 test_n8n.py
```

### 4. Usar el recolector directamente:
```bash
python3 db_vectorized_collector.py
```

### 5. Usar con frontend (servidor API):
```bash
python3 vectorized_api_server.py
```

### 6. Entrenar modelos:
```bash
python3 train_from_db.py
```

## 🗄️ Base de Datos

- **Tipo**: PostgreSQL (Neon)
- **URL**: `postgresql://neondb_owner:npg_h6dvHmE4PqRl@ep-misty-shape-aelsxf2q-pooler.c-2.us-east-2.aws.neon.tech/neondb`
- **Tablas**:
  - `sessions` - Sesiones de recolección
  - `vectorized_data` - Datos vectorizados
  - `metadata` - Metadatos del sistema

## 📊 Características Vectorizadas

- **Text Vectors**: TF-IDF de URLs, títulos y contenido
- **Context Vectors**: Codificación de tipos de página e intenciones
- **Action Vectors**: Codificación de tipos de interacción
- **Numerical Features**: Características numéricas extraídas

## 🎯 Labels para ML

- **teaching_moments**: Momentos de enseñanza detectados
- **error_patterns**: Patrones de error categorizados
- **success_patterns**: Patrones de éxito
- **user_intents**: Intenciones del usuario
- **page_types**: Tipos de página
- **interaction_types**: Tipos de interacción

## 🌐 Frontend

El frontend React incluye:
- **ChatBox**: Interfaz de chat original
- **VectorizedDataCollector**: Nueva interfaz para el recolector

### Acceder al frontend:
1. Iniciar el servidor API: `python3 vectorized_api_server.py`
2. Abrir: `http://localhost:3000`
3. Cambiar a la pestaña "📊 Recolector Vectorizado"

## 🔧 Configuración

### Rutas de Chrome (macOS):
```python
CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CHROMEDRIVER_PATH = "/Users/wavesmanagement/.wdm/drivers/chromedriver/mac64/139.0.7258.66/chromedriver-mac-arm64/chromedriver"
```

### URL de n8n:
```python
N8N_URL = 'http://localhost:5678'
```

## 📈 Flujo de Trabajo

1. **Recolección**: `db_vectorized_collector.py` recolecta datos mientras el usuario usa n8n
2. **Vectorización**: Los datos se vectorizan en tiempo real usando TF-IDF y codificación
3. **Almacenamiento**: Los datos vectorizados se guardan en PostgreSQL
4. **Entrenamiento**: `train_from_db.py` entrena modelos ML con los datos
5. **Visualización**: Se generan gráficos y reportes de rendimiento

## 🤖 Modelos de Machine Learning

- **Random Forest**: Para clasificación de intenciones y patrones
- **Neural Network**: Para predicción de comportamientos
- **Evaluación**: Accuracy y classification reports
- **Persistencia**: Modelos guardados en `trained_models_db/`

## 📋 Comandos Útiles

```bash
# Verificar que Chrome abre
python3 simple_test.py

# Verificar que navega a n8n
python3 test_n8n.py

# Recolectar datos
python3 db_vectorized_collector.py

# Servidor API para frontend
python3 vectorized_api_server.py

# Entrenar modelos
python3 train_from_db.py

# Ver documentación completa
cat README_TRAINING.md
```

## ✅ Estado Actual

- ✅ Chrome abre correctamente
- ✅ Conexión a PostgreSQL funciona
- ✅ Vectorización en tiempo real
- ✅ Frontend React integrado
- ✅ Entrenamiento de modelos ML
- ✅ Visualizaciones automáticas

## 🎉 ¡Sistema Completo y Funcional!

Este sistema permite recolectar datos de interacciones con n8n, vectorizarlos en tiempo real, almacenarlos en PostgreSQL y entrenar modelos de machine learning para crear "profesores inteligentes".
