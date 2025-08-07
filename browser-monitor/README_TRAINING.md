# Sistema de Recolección de Datos para Entrenamiento de Profesores Inteligentes

## 🎯 Objetivo

Este sistema recolecta datos estructurados de interacciones de usuarios con n8n para entrenar modelos de IA que generen profesores inteligentes capaces de guiar a usuarios en tiempo real.

## 📁 Estructura del Sistema

### 1. Recolector de Datos (`training_data_collector.py`)
- **Función**: Monitorea y recolecta datos de interacciones de usuarios
- **Datos recolectados**:
  - Navegación del usuario
  - Interacciones con elementos de n8n
  - Momentos de enseñanza detectados
  - Patrones de error y éxito
  - Transiciones de contexto

### 2. Procesador de Datasets (`create_training_datasets.py`)
- **Función**: Procesa datos recolectados y crea datasets estructurados
- **Datasets generados**:
  - Dataset de enseñanza
  - Dataset de manejo de errores
  - Dataset de guía de usuarios

### 3. Recolector Vectorizado (`vectorized_data_collector.py`)
- **Función**: Recolecta y vectoriza datos en tiempo real
- **Ventajas**:
  - Datos listos para entrenamiento directo
  - Vectorización automática con TF-IDF
  - Codificación de contexto y acciones
  - Características numéricas extraídas

### 4. Cargador de Datos Vectorizados (`load_vectorized_data.py`)
- **Función**: Carga datos vectorizados y entrena modelos directamente
- **Modelos entrenados**:
  - Random Forest
  - Neural Network (MLP)
  - Evaluación automática
  - Visualizaciones de resultados

## 🚀 Cómo Usar el Sistema

### Paso 1: Recolectar Datos

```bash
# Ejecutar el recolector de datos
python3 training_data_collector.py
```

**Comandos disponibles:**
- `s` - Ver resumen de recolección
- `save` - Guardar datos actuales
- `q` - Salir

### Paso 2: Crear Datasets

```bash
# Procesar datos recolectados y crear datasets
python3 create_training_datasets.py
```

### Paso 3: Recolectar Datos Vectorizados (Recomendado)

```bash
# Recolectar y vectorizar datos en tiempo real
python3 vectorized_data_collector.py
```

### Paso 4: Entrenar Modelos Directamente

```bash
# Cargar datos vectorizados y entrenar modelos
python3 load_vectorized_data.py
```

## 📊 Estructura de Datos Recolectados

### Datos de Sesión de Usuario
```json
{
  "session_id": "20241201_143022",
  "user_sessions": [
    {
      "start_time": "2024-12-01T14:30:22",
      "end_time": "2024-12-01T15:45:33",
      "user_actions": [
        {
          "timestamp": "2024-12-01T14:31:15",
          "type": "navigation",
          "url": "http://localhost:5678/workflow/abc123",
          "title": "Workflow Editor",
          "context": {
            "page_type": "workflow_editor",
            "user_intent": "creating_or_editing_workflow",
            "teaching_opportunity": true
          }
        }
      ],
      "context_changes": [...],
      "teaching_moments": [...],
      "error_patterns": [...],
      "success_patterns": [...]
    }
  ]
}
```

### Momentos de Enseñanza Detectados
```json
{
  "timestamp": "2024-12-01T14:35:22",
  "type": "manual_trigger_lesson",
  "context": "workflow_creation",
  "teaching_points": [
    "Manual Trigger es el punto de inicio",
    "Se ejecuta manualmente",
    "Puede recibir datos de entrada"
  ],
  "user_action_needed": "configure_manual_trigger"
}
```

## 🤖 Datasets Generados

### Datos Vectorizados (Recomendado)
```json
{
  "session_id": "20241201_143022",
  "features": {
    "text_vectors": [[0.1, 0.2, ...]],  // 1000 dimensiones TF-IDF
    "context_vectors": [[1, 0, 0, ...]], // 10 dimensiones one-hot
    "action_vectors": [[1, 0, 0, ...]],  // 6 dimensiones one-hot
    "numerical_features": [[50, 20, 3, ...]] // 8 características numéricas
  },
  "labels": {
    "teaching_moments": [...],
    "error_patterns": [...],
    "success_patterns": [...],
    "user_intents": [...]
  }
}
```

**Ventajas de los datos vectorizados:**
- ✅ Listos para entrenamiento directo
- ✅ Vectorización automática con TF-IDF
- ✅ Codificación one-hot para categorías
- ✅ Características numéricas extraídas
- ✅ Compatible con scikit-learn, TensorFlow, PyTorch

### 1. Dataset de Enseñanza
**Propósito**: Entrenar modelos para proporcionar lecciones contextuales

**Estructura**:
```json
{
  "input": "Contexto: workflow_creation, Acción necesaria: configure_manual_trigger",
  "output": "Manual Trigger es el punto de inicio\nSe ejecuta manualmente\nPuede recibir datos de entrada",
  "type": "manual_trigger_lesson",
  "context": "workflow_creation"
}
```

### 2. Dataset de Manejo de Errores
**Propósito**: Entrenar modelos para detectar y resolver errores

**Estructura**:
```json
{
  "input": "Error detectado en workflow_editor: Only one Manual Trigger allowed",
  "output": "Verifica que solo tengas un Manual Trigger por workflow\nAsegúrate de que el Manual Trigger esté correctamente configurado",
  "error_type": "manual_trigger_error",
  "context": "workflow_editor"
}
```

### 3. Dataset de Guía de Usuarios
**Propósito**: Entrenar modelos para proporcionar guía personalizada

**Estructura**:
```json
{
  "input": "Usuario con 15 acciones, 3 errores, 2 éxitos",
  "output": "El usuario está teniendo dificultades. Sugerencias:\n- Revisa los errores paso a paso\n- Verifica la configuración de cada nodo",
  "session_id": "20241201"
}
```

## 🎓 Aplicaciones para Entrenamiento

### Con Datos Vectorizados (Recomendado)
- **Entrenamiento Directo**: Los datos ya están vectorizados y listos para usar
- **Modelos Compatibles**: scikit-learn, TensorFlow, PyTorch, Keras
- **Tiempo de Entrenamiento**: Reducido significativamente
- **Precisión**: Mejorada por características optimizadas

### Flujo de Trabajo Vectorizado:
1. **Recolección**: `vectorized_data_collector.py` recolecta y vectoriza
2. **Entrenamiento**: `load_vectorized_data.py` entrena modelos directamente
3. **Evaluación**: Métricas automáticas y visualizaciones
4. **Despliegue**: Modelos guardados listos para usar

### 1. Modelos de Generación de Texto
- **Entrada**: Contexto del usuario + acción necesaria
- **Salida**: Explicación o guía contextual
- **Uso**: GPT, BERT, T5, etc.

### 2. Modelos de Clasificación
- **Entrada**: Patrón de comportamiento del usuario
- **Salida**: Tipo de ayuda necesaria
- **Uso**: Random Forest, SVM, Neural Networks

### 3. Modelos de Secuencia
- **Entrada**: Secuencia de acciones del usuario
- **Salida**: Próxima acción recomendada
- **Uso**: LSTM, Transformer, RNN

## 📈 Métricas de Calidad de Datos

### Cantidad de Datos
- **Mínimo recomendado**: 100 sesiones de usuario
- **Óptimo**: 500+ sesiones de usuario
- **Por sesión**: 10-50 acciones de usuario

### Calidad de Datos
- **Diversidad**: Diferentes tipos de usuarios y escenarios
- **Completitud**: Datos de navegación, interacciones y resultados
- **Consistencia**: Formato uniforme en todos los archivos

## 🔧 Configuración Avanzada

### Personalizar Detección de Momentos de Enseñanza
```python
def _detect_teaching_moment(self, page_source):
    # Agregar nuevos patrones de detección
    if "tu_nuevo_patron" in page_source.lower():
        return {
            "type": "nueva_leccion",
            "context": "nuevo_contexto",
            "teaching_points": ["Punto 1", "Punto 2"],
            "user_action_needed": "nueva_accion"
        }
```

### Agregar Nuevos Tipos de Datos
```python
# En training_data_collector.py
def _collect_custom_data(self):
    # Recolectar datos personalizados
    custom_data = {
        "timestamp": datetime.now().isoformat(),
        "type": "custom_data",
        "data": "tu_dato_personalizado"
    }
    self.training_data["current_session"]["user_actions"].append(custom_data)
```

## 📋 Checklist de Implementación

### Para Recolectar Datos
- [ ] Ejecutar `training_data_collector.py`
- [ ] Navegar por n8n con diferentes usuarios
- [ ] Probar diferentes funcionalidades
- [ ] Generar errores y éxitos
- [ ] Guardar datos con `save`

### Para Crear Datasets
- [ ] Ejecutar `create_training_datasets.py`
- [ ] Verificar que se creó la carpeta `datasets`
- [ ] Revisar los archivos generados
- [ ] Validar la calidad de los datos

### Para Datos Vectorizados (Recomendado)
- [ ] Ejecutar `vectorized_data_collector.py`
- [ ] Navegar por n8n para recolectar datos
- [ ] Guardar datos vectorizados con `save`
- [ ] Ejecutar `load_vectorized_data.py` para entrenar modelos
- [ ] Revisar modelos guardados en `trained_models/`
- [ ] Verificar visualizaciones en `visualizations/`

### Para Entrenar Modelos
- [ ] Cargar datasets en tu framework de ML
- [ ] Dividir en train/validation/test
- [ ] Entrenar modelos específicos
- [ ] Evaluar rendimiento
- [ ] Desplegar modelos entrenados

## 🎯 Próximos Pasos

1. **Recolectar más datos**: Ejecutar el recolector con diferentes usuarios
2. **Mejorar detección**: Agregar más patrones de detección
3. **Entrenar modelos**: Usar los datasets con frameworks como TensorFlow, PyTorch
4. **Desplegar**: Integrar modelos entrenados en el sistema de monitoreo
5. **Evaluar**: Medir efectividad de los profesores inteligentes generados

## 📞 Soporte

Para preguntas o problemas:
1. Revisar los logs de error
2. Verificar que n8n esté corriendo en `localhost:5678`
3. Asegurar que Chrome y ChromeDriver estén instalados
4. Verificar permisos de escritura en el directorio

---

**¡El sistema está listo para crear profesores inteligentes que aprendan de las interacciones reales de usuarios con n8n!** 🚀
