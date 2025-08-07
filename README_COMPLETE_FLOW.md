# 🎯 Flujo Completo: Usuario → n8n → Token

Sistema completo para automatizar el proceso de login en n8n y extraer tokens automáticamente.

## 🚀 Inicio Rápido

### 1. **Iniciar todos los servidores**
```bash
# Opción A: Script automático (recomendado)
./start_all_servers.sh

# Opción B: Manual
# Terminal 1: API Server
cd browser-monitor
./start_api_server.sh

# Terminal 2: Frontend React
npm start
```

### 2. **Verificar que todo esté corriendo**
```bash
# Verificar n8n
curl http://localhost:5678

# Verificar API Server
curl http://localhost:3004/health

# Verificar Frontend
curl http://localhost:3000
```

### 3. **Usar el flujo completo**
1. Abrir: `http://localhost:3000`
2. Ir a pestaña: "📊 Recolector Vectorizado"
3. Hacer click: "🚀 Iniciar Flujo Completo"
4. El navegador se abrirá automáticamente
5. Hacer login en n8n
6. El token se extraerá automáticamente

## 📊 Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Server    │    │   n8n Server    │
│   React         │◄──►│   Flask         │◄──►│   Local/Remote  │
│   Port 3000     │    │   Port 3004     │    │   Port 5678     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Chrome        │    │   PostgreSQL    │    │   Vectorized    │
│   Browser       │    │   Database      │    │   Data          │
│   Automated     │    │   Neon Cloud    │    │   Collection    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 Flujo Detallado

### **Paso 1: Usuario abre la app**
- Frontend React en `http://localhost:3000`
- Interfaz con pestañas: Chat y Recolector Vectorizado

### **Paso 2: Click en "Iniciar Flujo Completo"**
- Frontend llama a API: `POST /api/vectorized/start-browser`
- API Server inicia Chrome automáticamente
- Chrome navega a `http://localhost:5678` (n8n)

### **Paso 3: Usuario hace login**
- Chrome está abierto en n8n
- Usuario ingresa credenciales
- Sistema detecta cambio de URL (signin → dashboard)

### **Paso 4: Extracción automática de token**
- API detecta que está en n8n después del login
- Ejecuta JavaScript para extraer token de localStorage/cookies
- Token se muestra en el frontend
- Usuario puede copiar token con un click

## 🛠️ Endpoints del API

### **Control del Navegador**
```bash
# Iniciar navegador
POST /api/vectorized/start-browser

# Cerrar navegador  
POST /api/vectorized/stop-browser

# Estado del navegador
GET /api/vectorized/status
```

### **Recolección de Datos**
```bash
# Iniciar recolección
POST /api/vectorized/start-collection

# Detener recolección
POST /api/vectorized/stop-collection

# Estado actual
GET /api/vectorized/current-status
```

### **Extracción de Token**
```bash
# Extraer token de n8n
POST /api/vectorized/extract-token
```

### **Base de Datos**
```bash
# Estadísticas de DB
GET /api/vectorized/db-stats

# Resumen de sesión
GET /api/vectorized/db-summary

# Datos recientes
GET /api/vectorized/recent-data
```

## 🎯 Estados del Flujo

1. **`ready`** - Listo para iniciar
2. **`browser_opening`** - Abriendo navegador
3. **`browser_opened`** - Navegador abierto
4. **`monitoring_started`** - Monitoreando acciones
5. **`login_detected`** - Login detectado
6. **`in_n8n`** - Dentro de n8n
7. **`token_extracted`** - Token extraído
8. **`completed`** - Completado

## 📊 Datos Vectorizados

### **Text Vectors** (1000 dimensiones)
- TF-IDF de URLs y títulos
- Contenido de páginas
- Texto extraído de elementos

### **Context Vectors** (10 dimensiones)
- Tipos de página: workflow_editor, authentication, dashboard, etc.
- Intenciones del usuario: creating_workflow, logging_in, etc.

### **Action Vectors** (6 dimensiones)
- Tipos de interacción: manual_trigger, execution, save, error, success, general

### **Numerical Features** (8 dimensiones)
- Longitud de URL y título
- Contadores de elementos
- Flags de tipos de página

## 🗄️ Base de Datos

### **Tabla: `sessions`**
```sql
CREATE TABLE sessions (
    session_id VARCHAR(50) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_samples INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active'
);
```

### **Tabla: `vectorized_data`**
```sql
CREATE TABLE vectorized_data (
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
);
```

## 🔧 Configuración

### **Rutas de Chrome (macOS)**
```python
CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CHROMEDRIVER_PATH = "/Users/wavesmanagement/.wdm/drivers/chromedriver/mac64/139.0.7258.66/chromedriver-mac-arm64/chromedriver"
```

### **URLs**
```python
N8N_URL = 'http://localhost:5678'
DB_URL = 'postgresql://neondb_owner:npg_h6dvHmE4PqRl@ep-misty-shape-aelsxf2q-pooler.c-2.us-east-2.aws.neon.tech/neondb'
```

## 🚨 Solución de Problemas

### **n8n no está corriendo**
```bash
n8n start
```

### **API Server no responde**
```bash
cd browser-monitor
python3 vectorized_api_server.py
```

### **Frontend no carga**
```bash
npm install
npm start
```

### **Chrome no abre**
```bash
python3 test_n8n.py
```

### **Error de base de datos**
```bash
# Verificar conexión
python3 -c "import psycopg2; psycopg2.connect('postgresql://neondb_owner:npg_h6dvHmE4PqRl@ep-misty-shape-aelsxf2q-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require')"
```

## 🎉 Resultado Final

Al completar el flujo, tendrás:
- ✅ Navegador Chrome abierto automáticamente
- ✅ Login en n8n detectado
- ✅ Token extraído automáticamente
- ✅ Token copiable en el frontend
- ✅ Datos vectorizados guardados en PostgreSQL
- ✅ Sistema listo para entrenar modelos ML

¡El sistema está completo y funcional! 🚀
