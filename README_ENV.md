# 🔧 Configuración de Variables de Entorno

## 📋 Variables Disponibles

### **n8n Configuration**
- `N8N_BASE_URL`: URL base de n8n (default: http://localhost:5678/api/v1)
- `N8N_API_TOKEN`: Token de API de n8n (requerido para operaciones)
- `N8N_WORKFLOW_ID`: ID del workflow a monitorear (opcional)

### **Server Configuration**
- `SERVER_PORT`: Puerto del servidor Node.js (default: 3001)
- `NODE_ENV`: Entorno de Node.js (default: development)

## 🚀 Configuración Automática

### **Opción 1: Script Interactivo**
```bash
node update-env.js
```

### **Opción 2: Edición Manual**
Edita el archivo `.env` directamente:

```env
# n8n Configuration
N8N_BASE_URL=http://localhost:5678/api/v1
N8N_API_TOKEN=tu_token_aqui
N8N_WORKFLOW_ID=tu_workflow_id_aqui

# Server Configuration
SERVER_PORT=3001
NODE_ENV=development
```

## 🔑 Obtener Token de n8n

1. Ve a http://localhost:5678
2. Inicia sesión en n8n
3. Ve a **Settings** → **API**
4. Copia el **API Key**

## 📋 Obtener Workflow ID

1. Ve a http://localhost:5678
2. Selecciona un workflow
3. Copia el ID de la URL: `http://localhost:5678/workflow/123` → ID = `123`

## 🔄 Aplicar Cambios

Después de actualizar el archivo `.env`, reinicia el servidor:

```bash
cd server
npm start
```

## ✅ Verificar Configuración

```bash
curl http://localhost:3001/api/config
```

## 🛠️ Ejemplo de Configuración Completa

```env
# n8n Configuration
N8N_BASE_URL=http://localhost:5678/api/v1
N8N_API_TOKEN=PEiPnfWFWwk17oKy
N8N_WORKFLOW_ID=FVKBIatFo5HXrLs7

# Server Configuration
SERVER_PORT=3001
NODE_ENV=development
```

## 🔒 Seguridad

- **NUNCA** subas el archivo `.env` al repositorio
- El archivo `.env` ya está en `.gitignore`
- Mantén tu token de API seguro
