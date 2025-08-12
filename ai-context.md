# 🤖 Contexto para Agentes de IA - N8N Teacher App

## 🎯 **Propósito de la Aplicación**

Esta es una **super app educativa** diseñada para enseñar n8n (workflow automation) de manera interactiva y guiada. El sistema combina:

- **🎓 Aprendizaje Guiado**: Ejercicios paso a paso con workflows predefinidos
- **👁️ Monitoreo en Tiempo Real**: Observación de las acciones del estudiante
- **🤖 Asistencia IA**: Guía contextual basada en el progreso del alumno
- **📊 Datos Vectorizados**: Almacenamiento de patrones de aprendizaje

## 🏗️ **Arquitectura del Sistema**

### **Componentes Principales:**
1. **Frontend React** (localhost:3000) - Interfaz de usuario
2. **Backend Node.js** (localhost:3001) - API y WebSockets
3. **Browser Monitor** (localhost:5001) - Monitoreo embebido
4. **Base de Datos PostgreSQL** - Almacenamiento de datos vectorizados
5. **n8n** (localhost:5678) - Plataforma de workflows

### **Flujo de Datos:**
```
Alumno → Browser Monitor → Vectorización → PostgreSQL → IA → ChatBox → Alumno
```

## 📚 **Sistema de Ejercicios**

### **Estructura de Carpetas:**
```
json-files/
├── clase1/                    # Nivel básico
│   ├── manualtriger.json     # Trigger manual
│   ├── webhook_trigger.json  # Trigger webhook
│   └── schedule_trigger.json # Trigger programado
├── clase2/                    # Nivel intermedio
│   ├── data_processing.json  # Procesamiento de datos
│   ├── api_integration.json  # Integración de APIs
│   └── error_handling.json   # Manejo de errores
└── clase3/                    # Nivel avanzado
    ├── database_ops.json     # Operaciones de BD
    ├── file_operations.json  # Operaciones de archivos
    └── complex_workflow.json # Workflow complejo
```

### **Formato de Workflows JSON:**
Cada archivo JSON contiene:
- **Nodos**: Configuración de nodos específicos para el ejercicio
- **Conexiones**: Relaciones entre nodos
- **Metadatos**: Información del ejercicio (dificultad, objetivos, etc.)

## 🎓 **Proceso de Aprendizaje**

### **1. Selección de Ejercicio**
- El alumno elige un ejercicio del catálogo
- El sistema inicia una guía interactiva paso a paso
- El alumno crea el workflow desde cero siguiendo las instrucciones

### **2. Ejecución Guiada**
- El alumno sigue instrucciones paso a paso en n8n
- **Paso 1**: Presionar el botón "+" al centro de la instancia de n8n
- **Paso 2**: Seleccionar "Manual Trigger" del menú desplegable
- **Pasos siguientes**: Configurar y conectar nodos según el ejercicio
- El sistema guía al alumno para crear workflows desde cero
- El browser monitor captura todas las acciones
- Los datos se vectorizan y almacenan en PostgreSQL

### **3. Asistencia IA**
- La IA analiza el progreso del alumno
- Proporciona ayuda contextual basada en:
  - Errores cometidos
  - Tiempo en cada paso
  - Patrones de comportamiento
  - Objetivos del ejercicio

### **4. Evaluación y Feedback**
- El sistema evalúa la completitud del ejercicio
- Proporciona feedback personalizado
- Sugiere ejercicios siguientes

## 📊 **Datos Vectorizados**

### **Tipos de Datos Capturados:**
- **Text Vectors**: Contenido de páginas y elementos
- **Context Vectors**: Tipo de página y contexto
- **Action Vectors**: Interacciones del usuario
- **Numerical Features**: Métricas de comportamiento

### **Momentos de Enseñanza:**
- Errores frecuentes
- Puntos de confusión
- Patrones exitosos
- Tiempo de resolución

## 🤖 **Contexto para Agentes de IA**

### **Información Clave:**
1. **Objetivo**: Enseñar n8n de manera interactiva
2. **Audiencia**: Estudiantes de automatización
3. **Metodología**: Aprendizaje basado en proyectos
4. **Evaluación**: Monitoreo continuo y feedback

### **Capacidades del Sistema:**
- ✅ Guía interactiva paso a paso
- ✅ Creación de workflows desde cero
- ✅ Monitoreo en tiempo real
- ✅ Vectorización de datos
- ✅ Almacenamiento en PostgreSQL
- ✅ Interfaz web responsiva
- ✅ Chat integrado para IA

### **Puntos de Integración IA:**
1. **Análisis de Progreso**: Evaluar el avance del alumno
2. **Detección de Errores**: Identificar problemas comunes
3. **Generación de Ayuda**: Proporcionar asistencia contextual
4. **Recomendaciones**: Sugerir ejercicios siguientes
5. **Personalización**: Adaptar la experiencia al nivel del alumno

## 🔧 **Configuración Técnica**

### **Variables de Entorno:**
```bash
N8N_BASE_URL=http://localhost:5678
N8N_API_TOKEN=your_token_here
DB_URL=postgresql://user:pass@host/db
```

### **Endpoints Principales:**
- `GET /api/workflows` - Listar workflows disponibles
- `POST /api/workflow/apply-from-file` - Aplicar workflow desde JSON
- `GET /api/browser/status` - Estado del monitoreo
- `POST /api/browser/start` - Iniciar monitoreo

### **Base de Datos:**
- **Tabla**: `vectorized_data` - Datos de aprendizaje
- **Tabla**: `sessions` - Sesiones de estudiantes
- **Tabla**: `teaching_moments` - Momentos de enseñanza

## 🎯 **Casos de Uso para IA**

### **1. Tutoría Inteligente**
- Analizar patrones de error
- Proporcionar explicaciones personalizadas
- Adaptar la dificultad del ejercicio

### **2. Evaluación Automática**
- Calificar la completitud del ejercicio
- Identificar áreas de mejora
- Generar reportes de progreso

### **3. Recomendaciones**
- Sugerir ejercicios basados en el nivel
- Identificar lagunas de conocimiento
- Proponer rutas de aprendizaje

### **4. Análisis Predictivo**
- Predecir dificultades futuras
- Optimizar la secuencia de ejercicios
- Mejorar la experiencia de aprendizaje

## 🚀 **Próximos Pasos**

1. **Expandir Biblioteca**: Más ejercicios y niveles
2. **Mejorar IA**: Integración con modelos más avanzados
3. **Analytics**: Dashboard de progreso
4. **Gamificación**: Sistema de logros y badges
5. **Colaboración**: Ejercicios grupales

---

**Nota para Agentes de IA**: Este sistema está diseñado para ser extensible y adaptable. La estructura modular permite agregar nuevos ejercicios, niveles y capacidades de IA fácilmente.
