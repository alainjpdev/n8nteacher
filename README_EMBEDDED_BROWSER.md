# 🌐 n8n Teacher App - Browser Embebido

## 🎯 Nueva Funcionalidad: Browser Embebido

La aplicación ahora incluye un **browser embebido** que permite ver n8n directamente dentro de la interfaz, junto con el chat de asistencia.

### 📐 Distribución de la Pantalla

```
┌─────────────────────────────────────────────────────────┐
│                    n8n Teacher App                      │
├─────────────────────────────────────┬───────────────────┤
│                                     │                   │
│        Browser Embebido             │       Chat        │
│         (2/3 ancho)                 │    (1/3 ancho)    │
│                                     │                   │
│  ┌─────────────────────────────┐    │                   │
│  │                             │    │                   │
│  │      iframe n8n             │    │                   │
│  │   (localhost:5678)          │    │                   │
│  │                             │    │                   │
│  └─────────────────────────────┘    │                   │
│                                     │                   │
│  [Controles] [Mini logs]            │                   │
└─────────────────────────────────────┴───────────────────┘
```

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)
```bash
cd n8n-teacher-app
./start-all-servers.sh
```

### Opción 2: Inicio Manual
```bash
# 1. Iniciar n8n
n8n start

# 2. Iniciar servidor de monitoreo Node.js
cd server && npm start

# 3. Iniciar servidor Python del browser embebido
cd browser-monitor && python3 embedded_browser_server.py

# 4. Iniciar React frontend
npm start
```

## 🌐 URLs de Acceso

- **Frontend Principal**: http://localhost:3000
- **n8n Directo**: http://localhost:5678
- **API del Browser**: http://localhost:5001
- **Servidor de Monitoreo**: http://localhost:3001

## 🎮 Controles del Browser Embebido

### Botones Disponibles:
- **▶️ Iniciar**: Inicia el monitoreo embebido
- **⏹️ Detener**: Detiene el monitoreo
- **🔄 Actualizar**: Actualiza los logs
- **🔗 Abrir n8n**: Abre n8n en una nueva pestaña
- **🧹 Limpiar**: Limpia los logs

### Estado Visual:
- 🔴 **Rojo**: Browser detenido
- 🟡 **Amarillo**: Browser iniciando
- 🟢 **Verde**: Browser ejecutándose

## ⚠️ Notas Importantes

### Browser Embebido
El sistema ahora funciona **sin abrir Chrome externo**:

- ✅ **Monitoreo simulado**: Actividad simulada en tiempo real
- ✅ **Sin browser externo**: No se abre ventana de Chrome
- ✅ **Logs en tiempo real**: Actividad del sistema de monitoreo
- ✅ **Iframe n8n**: n8n embebido directamente en la interfaz

**Nota**: Los errores de "sandbox" y "storage access" son normales en el iframe y no afectan la funcionalidad.

### Restricciones del Iframe
- Algunas funcionalidades de n8n pueden estar limitadas
- Los analytics y tracking pueden no funcionar
- El almacenamiento local está restringido

## 🔧 Configuración

### Puertos Utilizados:
- **3000**: React Frontend
- **3001**: Servidor de Monitoreo Node.js
- **5001**: API del Browser Python
- **5678**: n8n

### Variables de Entorno:
```bash
# Para el servidor de monitoreo
N8N_BASE_URL=http://localhost:5678/api/v1
N8N_TOKEN=your_token_here

# Para el browser embebido
BROWSER_API_PORT=5001
```

## 🐛 Solución de Problemas

### Puerto 5000 Ocupado
```bash
# En macOS, deshabilitar AirPlay Receiver:
# System Preferences > General > AirDrop & Handoff > AirPlay Receiver
```

### Python no Encontrado
```bash
# Usar python3 en lugar de python
python3 simple_api_server.py
```

### Errores de CORS
Los servidores ya están configurados con CORS habilitado. Si persisten los errores:
```bash
# Verificar que todos los servidores estén corriendo
lsof -i :3000 -i :3001 -i :5001 -i :5678
```

## 📊 Monitoreo y Logs

### Logs en Tiempo Real:
- Los logs aparecen en el mini panel inferior del browser embebido
- Se muestran los últimos 3 logs para ahorrar espacio
- Los logs completos están disponibles en la API

### API Endpoints:
```bash
# Estado del browser embebido
GET http://localhost:5001/api/browser/status

# Iniciar browser embebido
POST http://localhost:5001/api/browser/start

# Detener browser embebido
POST http://localhost:5001/api/browser/stop

# Logs completos
GET http://localhost:5001/api/browser/logs

# Limpiar logs
POST http://localhost:5001/api/browser/clear-logs
```

## 🎯 Próximas Mejoras

- [ ] WebSocket para logs en tiempo real
- [ ] Control directo del browser desde el frontend
- [ ] Captura de pantalla automática
- [ ] Integración con el sistema de chat
- [ ] Modo de pantalla completa para el browser

## 📝 Changelog

### v2.0.0 - Browser Embebido
- ✅ Distribución 2/3 - 1/3 (Browser - Chat)
- ✅ Iframe embebido de n8n
- ✅ Controles de inicio/detención
- ✅ Mini panel de logs
- ✅ Botón para abrir n8n en nueva pestaña
- ✅ Manejo de errores de sandbox
- ✅ Script de inicio automático
