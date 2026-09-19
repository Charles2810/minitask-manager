# 🚀 Registro de Mejoras y Evolución: Mini Task Manager

Documento de seguimiento de mejoras implementadas y propuestas de evolución futura para el proyecto, estructurado por capas y clasificado por nivel de complejidad y prioridad.

---

## ✅ Mejoras Implementadas (Fase 1: UI/UX Flat & Productividad)

En esta fase se transformó el frontend tradicional en una interfaz **Flat Minimalista (inspirada en GitHub y Linear)** con alta reactividad, accesibilidad y cero gradientes:

1. **Estética Flat Minimalista (GitHub / Linear):**
   - Eliminación total de gradientes en favor de colores 100% planos y sobrios (`#f6f8fa` / `#ffffff` en claro, `#0d1117` / `#161b22` en oscuro).
   - Bordes nítidos de 1px (`#d0d7de` y `#30363d`), tipografía moderna Inter y sombras sutiles.
2. **Modo Oscuro / Modo Claro Persistente:**
   - Detección automática de preferencia del sistema operativo (`prefers-color-scheme`).
   - Interruptor con botón e icono plano (`bi-sun` / `bi-moon`) y guardado local en `localStorage`.
3. **Filtros Reactivos y Contadores en Vivo:**
   - Pestañas estilo *pills* de GitHub para alternar entre **Todas**, **Pendientes** y **Completadas**.
   - Badges numéricos planos que se recalculan en tiempo real sin recargar la página.
4. **Métricas y Barra de Progreso Compacta:**
   - Track de progreso plano de 6px que muestra el porcentaje completado y la relación `X de Y`.
5. **Alertas Inline (GitHub Alert Style):**
   - Banner plano accesible integrado directamente en la tarjeta con auto-cierre y botón manual (verde para éxito, rojo para errores de validación, azul para información).
6. **Integración con Bootstrap Icons CDN Oficial (`v1.11.3`):**
   - Iconografía de línea nítida para todas las acciones interactivas (`bi-check2-square`, `bi-circle`, `bi-check-circle-fill`, `bi-trash3`).

---

## 🎨 1. Próximas Mejoras en Frontend y Experiencia de Usuario (UI/UX)

### Opción 1.1: Edición en Línea del Título (Inline Editing) (Complejidad: Media 🟡 | Impacto: Alto 🌟)
- **Descripción:** Permitir hacer doble clic sobre el texto de una tarea (o presionar un botón de lápiz ✏️) para transformar el texto en un `<input>` editable y presionar `Enter` o `Escape`.
- **Beneficio:** Convierte la aplicación en un CRUD interactivo completo y moderno sin recargar.

### Opción 1.2: Buscador en Tiempo Real (Complejidad: Baja 🟢 | Impacto: Medio ⭐)
- **Descripción:** Añadir un campo de búsqueda rápida con icono `bi-search` para filtrar tareas por texto al instante mientras el usuario escribe.
- **Beneficio:** Localización ágil de tareas cuando el listado crece.

---

## ⚙️ 2. Mejoras en Backend y Arquitectura (API & Capas)

### Opción 2.1: Endpoint de Actualización de Título (`PUT /api/tasks/:id`) (Complejidad: Baja 🟢 | Impacto: Alto 🌟)
- **Descripción:** Actualmente la API solo permite modificar el estado (`/toggle`), pero no corregir o editar el texto del título.
- **Implementación por capas:**
  1. **Repository:** Método `updateTitle(id, title)`.
  2. **Service:** Validación de longitud (≥ 3 caracteres) y palabras prohibidas.
  3. **Controller:** Validación de formato y retorno de `200 OK`.
  4. **Routes:** `router.put('/tasks/:id', ...)`.

### Opción 2.2: Middleware Centralizado de Errores en Express (Complejidad: Baja-Media 🟡 | Impacto: Alto 🌟)
- **Descripción:** En `taskController.js`, cada función tiene bloques `try/catch` repetitivos formateando códigos de error.
- **Solución:**
  - Crear un middleware `errorHandler(err, req, res, next)`.
  - Simplificar las funciones del controlador pasando errores con `next(err)`.
- **Beneficio:** Mayor limpieza de código y arquitectura más profesional.

### Opción 2.3: Búsqueda, Filtrado y Paginación en la API (Complejidad: Media 🟡 | Impacto: Alto 🌟)
- **Descripción:** Soportar parámetros query en `GET /api/tasks?status=pending&search=pan&limit=10&page=1`.
- **Beneficio:** Enseña cómo construir consultas dinámicas parametrizadas seguras en SQL con `$1, $2` condicionales.

---

## 🗄️ 3. Mejoras en Base de Datos (PostgreSQL / Supabase)

### Opción 3.1: Borrado Lógico (*Soft Deletes*) (Complejidad: Media 🟡 | Impacto: Alto 🌟)
- **Descripción:** En lugar de eliminar físicamente registros de la base de datos con `DELETE FROM tasks WHERE id = $1`, agregar una columna `deleted_at TIMESTAMP WITH TIME ZONE NULL`.
- **Beneficio:**
  - Evita pérdida accidental de información en producción.
  - Permite implementar una pestaña de **"Papelera / Recuperar tareas"**.

### Opción 3.2: Prioridades y Fechas Límite (*Due Dates*) (Complejidad: Media 🟡 | Impacto: Alto 🌟)
- **Descripción:** Extender la tabla `tasks` con:
  - `priority VARCHAR(10) DEFAULT 'media' CHECK (priority IN ('baja', 'media', 'alta'))`
  - `due_date DATE NULL`
- **Beneficio:** Permite ordenar las tareas por urgencia y pintar badges de colores planos (Alta, Media, Baja).

### Opción 3.3: Creación de Índices de Rendimiento (Complejidad: Muy Baja 🟢 | Impacto: Medio ⭐)
- **Descripción:** Agregar índices en `status` y `created_at` para optimizar consultas a gran escala:
  ```sql
  CREATE INDEX idx_tasks_status ON tasks(status);
  CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
  ```

---

## 🧪 4. Automatización, Pruebas y Despliegue

### Opción 4.1: Suite de Tests Automatizados con Jest y Supertest (Complejidad: Media 🟡 | Impacto: Muy Alto 🏆)
- **Descripción:** Crear pruebas automatizadas que corran con `npm test`:
  - **Unit tests:** Probar las reglas de negocio de `taskService.js` aislando el repositorio con Mocks.
  - **Integration tests:** Probar los endpoints HTTP de `app.js` usando `supertest`.
- **Beneficio:** Demuestra dominio de testing en arquitecturas por capas para la materia.

### Opción 4.2: Contenedorización con Docker & Docker Compose (Complejidad: Media 🟡 | Impacto: Alto 🌟)
- **Descripción:** Crear un archivo `docker-compose.yml` para levantar PostgreSQL local y el backend con un solo comando (`docker-compose up`).

---

## 🗓️ Próximo Paso Sugerido
Completar el ciclo **Full CRUD** añadiendo la actualización de título (`PUT /api/tasks/:id`) a través de las 5 capas arquitectónicas (Repository &rarr; Service &rarr; Controller &rarr; Frontend con doble clic o botón de editar).
