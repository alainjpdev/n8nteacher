# 🎓 N8N Teacher App - Super App de Aprendizaje

## 🚀 Arquitectura de la Super App

Esta es una **super app educativa** que combina:

1. **🎯 ChatBox**: La guía principal que dirige el aprendizaje paso a paso
2. **🌐 BrowserMonitor**: Los "ojos" que ven lo que hace el usuario en n8n
3. **🔧 API n8n**: Monitoreo tradicional de workflows y ejecuciones
4. **⚛️ Frontend React**: Interfaz moderna y responsiva

### 🎯 Flujo de Aprendizaje

```
Usuario → BrowserMonitor (ve acciones) → ChatBox (interpreta y guía) → Usuario
```

- **BrowserMonitor**: Abre n8n en Chrome y detecta todas las acciones del usuario
- **ChatBox**: Procesa esas acciones y proporciona guía personalizada
- **API n8n**: Complementa con datos de workflows y ejecuciones
- **Resultado**: Experiencia de aprendizaje interactiva y guiada

### 1. Limpiar Configuración (Si es necesario)

Si quieres empezar desde cero:

```bash
# Limpiar configuración
cd /Users/wavesmanagement/scripts/new/n8n-teacher-app
node clear-config.js

# O manualmente en el navegador:
# 1. Abre F12 (herramientas de desarrollador)
# 2. Ve a Application → Local Storage
# 3. Haz clic derecho en http://localhost:3000 → Clear
# 4. O ejecuta en la consola: localStorage.clear()
```

### 2. Iniciar la Aplicación

```bash
# Instalar dependencias
cd /Users/wavesmanagement/scripts/new/n8n-teacher-app
npm install

cd /Users/wavesmanagement/scripts/new/n8n-teacher-app/server
npm install

# Iniciar servidores
cd /Users/wavesmanagement/scripts/new/n8n-teacher-app
npm start

# En otra terminal
cd /Users/wavesmanagement/scripts/new/n8n-teacher-app/server
npm start
```

### 3. Configuración Inicial (Primera Vez)

Cuando abras la aplicación por primera vez, verás:

1. **🔧 Paso 1: Configurar Token de n8n**
   - Ingresa la URL de tu instancia de n8n
   - Pega tu token de API de n8n
   - La app validará la conexión automáticamente

2. **📋 Paso 2: Seleccionar Workflow**
   - La app cargará todos tus workflows disponibles
   - Selecciona el workflow que quieres monitorear
   - ¡Listo! La app comenzará a monitorear

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)

```bash
# Iniciar todos los servicios automáticamente
cd /Users/wavesmanagement/scripts/new/n8n-teacher-app
./start-all-services.sh
```

### Opción 2: Inicio Manual

```bash
# 1. Backend n8n
cd /Users/wavesmanagement/scripts/new/n8n-teacher-app/server
npm start

# 2. Browser Monitor (en nueva terminal)
cd /Users/wavesmanagement/scripts/new/n8n-teacher-app/browser-monitor
pip install -r requirements.txt
python3 browser_monitor.py

# 3. Frontend React (en nueva terminal)
cd /Users/wavesmanagement/scripts/new/n8n-teacher-app
npm start
```

## 🎯 Cómo Usar la Super App

1. **Abre** http://localhost:3000
2. **Configura** tu token de n8n en la experiencia de primera vez
3. **Haz clic** en "🎓 Monitor" para abrir el monitor de navegador
4. **Sigue** las instrucciones del ChatBox paso a paso
5. **El BrowserMonitor** verá tus acciones y el ChatBox te guiará

## 📱 URLs de la Aplicación

- **🌐 Frontend**: http://localhost:3000
- **🔧 Backend**: http://localhost:3001  
- **🎓 Browser Monitor**: http://localhost:3004
- **🌐 n8n**: http://localhost:5678

## Variables de Entorno

La aplicación usa las siguientes variables de entorno (archivo `.env`):

- `N8N_API_TOKEN` - Tu token de API de n8n
- `N8N_WORKFLOW_ID` - ID del workflow a monitorear
- `N8N_BASE_URL` - URL base de la API de n8n

## Ventajas de esta estructura:

✅ **Experiencia intuitiva** - Guía paso a paso para primera vez
✅ **Una sola fuente de verdad** - Todas las configuraciones en un lugar
✅ **Fácil actualización** - Un comando para cambiar el token
✅ **Sin sincronización** - No más problemas de tokens desactualizados
✅ **Seguridad** - Token no hardcodeado en el código
✅ **Flexibilidad** - Fácil cambiar workflow o URL
✅ **Limpieza fácil** - Script para empezar desde cero

## URLs de la Aplicación

- **Frontend**: http://localhost:3000
- **Servidor**: http://localhost:3001

### Nota
Asegúrate de tener Node.js instalado en tu sistema antes de ejecutar estos comandos. 