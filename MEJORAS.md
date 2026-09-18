# 🚀 Opciones de Mejora para Mini Task Manager

Documento de propuestas de evolución para el proyecto, estructurado por capas y clasificado por nivel de complejidad y prioridad para abordar en las próximas sesiones.

---

## 📌 Resumen de Opciones Recomendadas para Mañana

Si buscas dar un salto de calidad rápido en la presentación y funcionalidad del proyecto, las 3 mejoras más recomendadas son:
1. **Edición del título de tareas (Full CRUD):** Completar el ciclo agregando la actualización de texto en Backend y Frontend.
2. **Filtros por Estado y Buscador en tiempo real:** Todas / Pendientes / Completadas + contador visual.
3. **Manejador Global de Errores en Express:** Limpieza de código en los controladores.

---

## 🎨 1. Mejoras en Frontend y Experiencia de Usuario (UI/UX)

### Opción 1.1: Filtros de Estado y Contadores (Complejidad: Baja 🟢 | Impacto: Alto 🌟)
- **Descripción:** Agregar una barra de pestañas para filtrar las tareas por: **"Todas"**, **"Pendientes"** y **"Completadas"**.
- **Detalle:**
  - Añadir contadores visuales (ej. *"3 pendientes, 2 completadas"*).
  - Botón de acción rápida: *"Marcar todas como completadas"* o *"Limpiar completadas"*.
- **Beneficio:** Aporta dinamismo inmediato a la vista sin requerir grandes cambios en el backend.

### Opción 1.2: Edición en Línea del Título (Inline Editing) (Complejidad: Media 🟡 | Impacto: Alto 🌟)
- **Descripción:** Permitir hacer doble clic sobre el texto de una tarea (o presionar un botón de lápiz ✏️) para transformar el texto en un `<input>` editable y presionar `Enter` o `Escape`.
- **Beneficio:** Convierte la aplicación en un CRUD interactivo completo y moderno.

### Opción 1.3: Modo Oscuro (Dark Mode) y Diseño Glassmorphism (Complejidad: Baja 🟢 | Impacto: Medio ⭐)
- **Descripción:** Agregar un interruptor de tema (Sol ☀️ / Luna 🌙) con persistencia en `localStorage`.
- **Detalle:**
  - Variables CSS dinámicas para modo oscuro (`--bg: #0f172a`, `--surface: #1e293b`, etc.).
  - Micro-animaciones al agregar o eliminar elementos (fade-in, slide-out).

### Opción 1.4: Notificaciones Toast y Confirmaciones Accesibles (Complejidad: Baja 🟢 | Impacto: Medio ⭐)
- **Descripción:** Reemplazar las alertas de error estáticas por banners tipo *Toast* flotantes temporizados (desaparecen tras 3-4 segundos con barra de progreso).
- **Detalle:** Modal o confirmación accesible antes de eliminar una tarea importante.

---

## ⚙️ 2. Mejoras en Backend y Arquitectura (API & Capas)

### Opción 2.1: Endpoint de Actualización de Título (`PUT` o `PATCH /api/tasks/:id`) (Complejidad: Baja 🟢 | Impacto: Alto 🌟)
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
- **Beneficio:** Permite ordenar las tareas por urgencia y pintar badges de colores (Rojo = Alta, Amarillo = Media, Verde = Baja).

### Opción 3.3: Creación de Índices de Rendimiento (Complejidad: Muy Baja 🟢 | Impacto: Medio ⭐)
- **Descripción:** Agregar índices en `status` y `created_at` para optimizar consultas a gran escala:
  ```sql
  CREATE INDEX idx_tasks_status ON tasks(status);
  CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
  ```

---

## 🧪 4. Automatización, Pruebas y Calidad de Código

### Opción 4.1: Suite de Tests Automatizados con Jest y Supertest (Complejidad: Media 🟡 | Impacto: Muy Alto 🏆)
- **Descripción:** Crear pruebas automatizadas que corran con `npm test`:
  - **Unit tests:** Probar las reglas de negocio de `taskService.js` aislando el repositorio con Mocks.
  - **Integration tests:** Probar los endpoints HTTP de `app.js` usando `supertest`.
- **Beneficio:** Demuestra dominio de testing en arquitecturas por capas para la materia.

### Opción 4.2: Contenedorización con Docker & Docker Compose (Complejidad: Media 🟡 | Impacto: Alto 🌟)
- **Descripción:** Crear un archivo `docker-compose.yml` para levantar PostgreSQL local y el backend con un solo comando (`docker-compose up`).

---

## 🗓️ Hoja de Ruta Sugerida para Mañana

Si dispones de **1 a 2 horas**, el plan más productivo es:

1. **Paso 1 (Backend):** Implementar la actualización de títulos (`PUT /api/tasks/:id`) a través de las capas Repository -> Service -> Controller.
2. **Paso 2 (Frontend):** Añadir soporte para editar tarea (doble clic o botón editar) y botones de filtro: *"Todas"*, *"Pendientes"*, *"Completadas"*.
3. **Paso 3 (Estilos & UX):** Añadir el interruptor de Modo Oscuro y badges de estado visuales.
