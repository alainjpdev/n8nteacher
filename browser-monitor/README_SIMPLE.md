# 🌐 Control Simple del Navegador

**SIN Flask, SIN entorno virtual** - Solo Python puro que funciona.

## 🚀 Uso Directo (Recomendado)

### 1. **Abrir navegador y recolectar datos:**
```bash
cd n8n-teacher-app/browser-monitor
python3 simple_browser_control.py
```

### 2. **Solo probar que Chrome abre:**
```bash
python3 test_n8n.py
```

### 3. **Usar desde el frontend:**
1. Abrir `http://localhost:3000`
2. Ir a pestaña "🌐 Control Simple"
3. Hacer click en "🌐 Abrir Browser"

## 📁 Archivos que FUNCIONAN

### 🟢 **Archivos Principales:**
1. **`simple_browser_control.py`** ✅ - **FUNCIONA** - Abre navegador y recolecta datos
2. **`test_n8n.py`** ✅ - **FUNCIONA** - Test simple que abre Chrome
3. **`db_vectorized_collector.py`** ✅ - **FUNCIONA** - Recolector con base de datos
4. **`train_from_db.py`** ✅ - **FUNCIONA** - Entrenamiento de modelos
5. **`requirements.txt`** ✅ - **FUNCIONA** - Dependencias

### 🔴 **Archivos que NO funcionan:**
- ❌ `vectorized_api_server.py` - Problemas con Flask
- ❌ Cualquier cosa con Flask o entorno virtual

## 🎯 Flujo Simple

### **Opción 1: Directo desde terminal**
```bash
python3 simple_browser_control.py
```
**Resultado:**
- ✅ Chrome se abre automáticamente
- ✅ Navega a n8n (http://localhost:5678)
- ✅ Recolecta datos vectorizados
- ✅ Guarda en PostgreSQL
- ✅ Muestra progreso en tiempo real

### **Opción 2: Desde frontend**
1. Abrir `http://localhost:3000`
2. Pestaña "🌐 Control Simple"
3. Click "🌐 Abrir Browser"
4. El navegador se abre automáticamente

## 📊 Lo que hace el sistema

### **Vectorización en Tiempo Real:**
- **Text Vectors** (1000 dims): TF-IDF de URLs y contenido
- **Context Vectors** (10 dims): Tipos de página e intenciones
- **Action Vectors** (6 dims): Tipos de interacción
- **Numerical Features** (8 dims): Características numéricas

### **Detección Automática:**
- 🎓 **Momentos de enseñanza** (Manual Trigger, etc.)
- ⚠️ **Patrones de error** (errores de configuración)
- ✅ **Patrones de éxito** (workflows creados)
- 🔐 **Login detectado** (cambios de URL)

### **Guardado en Base de Datos:**
- **Tabla `sessions`**: Sesiones de recolección
- **Tabla `vectorized_data`**: Datos vectorizados
- **Tabla `metadata`**: Metadatos del sistema

## 🗄️ Base de Datos

**Conexión:** PostgreSQL (Neon)
```python
DB_URL = 'postgresql://neondb_owner:npg_h6dvHmE4PqRl@ep-misty-shape-aelsxf2q-pooler.c-2.us-east-2.aws.neon.tech/neondb'
```

## 🔧 Configuración

### **Rutas de Chrome (macOS):**
```python
CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CHROMEDRIVER_PATH = "/Users/wavesmanagement/.wdm/drivers/chromedriver/mac64/139.0.7258.66/chromedriver-mac-arm64/chromedriver"
```

### **URL de n8n:**
```python
N8N_URL = 'http://localhost:5678'
```

## 📋 Comandos Útiles

```bash
# Verificar que Chrome abre
python3 test_n8n.py

# Abrir navegador y recolectar datos
python3 simple_browser_control.py

# Entrenar modelos con datos recolectados
python3 train_from_db.py

# Ver documentación completa
cat README_TRAINING.md
```

## 🎉 Resultado

Al ejecutar `simple_browser_control.py`:

1. **Chrome se abre** automáticamente
2. **Navega a n8n** (http://localhost:5678)
3. **Inicia recolección** de datos vectorizados
4. **Guarda en PostgreSQL** en tiempo real
5. **Muestra progreso** cada 30 segundos
6. **Detecta patrones** automáticamente
7. **Se puede detener** con Ctrl+C

## ✅ Estado Actual

- ✅ **Chrome abre correctamente**
- ✅ **Navega a n8n automáticamente**
- ✅ **Recolecta datos vectorizados**
- ✅ **Guarda en PostgreSQL**
- ✅ **Sin Flask, sin entorno virtual**
- ✅ **Funciona desde terminal**
- ✅ **Funciona desde frontend**

## 🚨 Solución de Problemas

### **Chrome no abre:**
```bash
python3 test_n8n.py
```

### **n8n no está corriendo:**
```bash
n8n start
```

### **Error de base de datos:**
```bash
# Verificar conexión
python3 -c "import psycopg2; psycopg2.connect('postgresql://neondb_owner:npg_h6dvHmE4PqRl@ep-misty-shape-aelsxf2q-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require')"
```

### **Frontend no carga:**
```bash
cd ..
npm start
```

## 🎯 ¡Sistema Simple y Funcional!

**Sin complicaciones, sin Flask, sin entorno virtual** - Solo Python puro que funciona y recolecta datos vectorizados en tiempo real. 🚀
