# Sistema de Monitoreo n8n en Tiempo Real

Este proyecto proporciona un sistema completo de monitoreo en tiempo real para n8n, con una aplicación React como frontend y un servidor Node.js como backend.

## 🏗️ Arquitectura

```
┌─────────────────┐    WebSocket    ┌─────────────────┐    HTTP API    ┌─────────────┐
│   React App     │ ◄─────────────► │  Node.js Server │ ◄────────────► │    n8n      │
│   (Frontend)    │                 │   (Backend)     │                │  Instance   │
└─────────────────┘                 └─────────────────┘                └─────────────┘
```

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)
```bash
./start-monitoring.sh
```

### Opción 2: Inicio Manual

1. **Iniciar el servidor de monitoreo:**
```bash
cd server
npm install
node server.js
```

2. **Iniciar la aplicación React:**
```bash
npm install
npm start
```

## 📊 Características

### Backend (Node.js + WebSocket)
- ✅ **Monitoreo en tiempo real** de workflows y ejecuciones
- ✅ **WebSocket** para actualizaciones instantáneas
- ✅ **API REST** para control del monitoreo
- ✅ **Reconexión automática** en caso de desconexión
- ✅ **Logs detallados** de todas las actividades

### Frontend (React)
- ✅ **Interfaz moderna** con modo oscuro
- ✅ **Logs en tiempo real** con diferentes tipos (info, success, error, warning)
- ✅ **Control de monitoreo** con botones de inicio/parada
- ✅ **Estado de conexión** visual
- ✅ **Responsive design** para móviles

## 🔧 Configuración

### Token de API n8n
El token de API está configurado en `server/server.js`:
```javascript
const N8N_API_TOKEN = 'tu-token-aqui';
```

### URLs
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **WebSocket:** ws://localhost:3001

## 📋 Endpoints del Servidor

### API REST
- `GET /health` - Estado del servidor
- `GET /api/status` - Estado del monitoreo
- `POST /api/monitoring/start` - Iniciar monitoreo
- `POST /api/monitoring/stop` - Detener monitoreo

### WebSocket
- `start_monitoring` - Iniciar monitoreo
- `stop_monitoring` - Detener monitoreo
- `get_status` - Obtener estado actual

## 🔍 Monitoreo

El sistema monitorea:

1. **Workflows**
   - Nuevos workflows creados
   - Cambios en workflows existentes
   - Eliminación de workflows

2. **Ejecuciones**
   - Nuevas ejecuciones de workflows
   - Estado de ejecuciones (success, error, running)
   - Tiempo de inicio y fin

3. **Logs en tiempo real**
   - Información detallada de cada evento
   - Timestamps precisos
   - Diferentes niveles de log

## 🎯 Uso

1. **Inicia el sistema** usando el script automático
2. **Abre la aplicación** en http://localhost:3000
3. **Haz clic en "Conectar n8n"** para iniciar el monitoreo
4. **Ve a tu instancia de n8n** y crea/modifica workflows
5. **Observa los logs** aparecer en tiempo real en la aplicación

## 🛠️ Desarrollo

### Estructura del Proyecto
```
dummy/
├── src/
│   ├── components/
│   │   ├── ChatBox.js          # Componente principal
│   │   ├── ChatHeader.js       # Header con controles
│   │   ├── ChatContent.js      # Contenido del chat
│   │   ├── ChatFooter.js       # Footer con progreso
│   │   └── N8nLogs.js         # Componente de logs
│   └── services/
│       └── n8nWebSocket.js    # Servicio WebSocket
├── server/
│   ├── server.js              # Servidor Node.js
│   └── package.json           # Dependencias del servidor
├── package.json               # Dependencias del frontend
└── start-monitoring.sh       # Script de inicio
```

### Tecnologías Utilizadas
- **Frontend:** React, Tailwind CSS, WebSocket
- **Backend:** Node.js, Express, WebSocket, Axios
- **Monitoreo:** Polling inteligente, detección de cambios

## 🔧 Troubleshooting

### El servidor no inicia
```bash
# Verificar puerto disponible
lsof -i :3001

# Verificar dependencias
cd server && npm install
```

### WebSocket no conecta
```bash
# Verificar que el servidor esté corriendo
curl http://localhost:3001/health

# Verificar logs del servidor
tail -f server/logs.txt
```

### No aparecen logs
1. Verifica que el token de API sea correcto
2. Asegúrate de que n8n esté accesible
3. Revisa la consola del navegador para errores

## 📝 Logs

Los logs se muestran en:
- **Consola del servidor:** Terminal donde corre `node server.js`
- **Consola del navegador:** F12 → Console
- **Interfaz web:** Sección de logs en la aplicación

## 🎉 ¡Listo!

El sistema está configurado para proporcionar monitoreo en tiempo real de tu instancia de n8n. ¡Disfruta viendo tus workflows y ejecuciones en tiempo real! 