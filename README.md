# Mini Task Manager (Arquitectura en 5 Capas)

Proyecto desarrollado para la materia **Programación Web 2**, implementando el principio rector de **Separación de Responsabilidades** (*Separation of Concerns*): «Cada capa tiene un solo trabajo y habla exclusivamente con su vecina».

---

## 🏗️ Mapa Arquitectónico

```text
┌──────────────────────────────────────────────────────────┐
│ 1. Frontend (HTML5 / Vanilla JS Accesible)               │
└────────────────────────────┬─────────────────────────────┘
                             │ Peticiones HTTP (JSON)
┌────────────────────────────▼─────────────────────────────┐
│ 2. API / Controlador (Express.js)                        │
└────────────────────────────┬─────────────────────────────┘
                             │ Invocación de métodos y tipos nativos
┌────────────────────────────▼─────────────────────────────┐
│ 3. Lógica de Negocio (Service)                           │
└────────────────────────────┬─────────────────────────────┘
                             │ Interfaces de datos limpias
┌────────────────────────────▼─────────────────────────────┐
│ 4. Acceso a Datos (Repository)                           │
└────────────────────────────┬─────────────────────────────┘
                             │ Queries SQL Parametrizadas ($1, $2)
┌────────────────────────────▼─────────────────────────────┐
│ 5. Base de Datos (PostgreSQL / Supabase)                 │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```text
minitask/
├── .env.example
├── .gitignore
├── README.md
├── docs/
│   └── schema.sql                  # Capa 5: DDL PostgreSQL y Triggers
├── backend/
│   ├── package.json
│   └── src/
│       ├── app.js                  # Entrada del servidor Express
│       ├── config/
│       │   └── db.js               # Conexión Pool PostgreSQL
│       ├── controllers/
│       │   └── taskController.js   # Capa 2: Filtro HTTP y códigos de estado
│       ├── routes/
│       │   └── taskRoutes.js       # Mapeo de rutas REST
│       ├── services/
│       │   └── taskService.js      # Capa 3: Reglas de negocio y validación de dominio
│       └── repositories/
│           └── taskRepository.js   # Capa 4: Acceso a datos y consultas SQL ($1, $2)
└── frontend/
    └── index.html                  # Capa 1: Cliente Web Accesible
```

---

## 🚀 Puesta en Marcha

### 1. Base de Datos (PostgreSQL / Supabase)
Ejecuta el script [docs/schema.sql](docs/schema.sql) en tu cliente PostgreSQL (pgAdmin, psql) o en el SQL Editor de Supabase para crear la tabla `tasks` y el disparador `trg_tasks_updated_at`.

### 2. Configuración de Variables de Entorno
Copia el archivo `.env.example` a `.env` en la raíz del proyecto (o en `backend/`) y configura la cadena de conexión:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/taskdb
```

### 3. Instalación de Dependencias del Backend
```bash
cd backend
npm install
```

### 4. Iniciar el Servidor Backend
```bash
# Modo desarrollo con nodemon
npm run dev

# Modo producción
npm start
```
El servidor quedará escuchando en `http://localhost:3000`.

### 5. Abrir el Frontend
Abre directamente [frontend/index.html](frontend/index.html) en tu navegador preferido o mediante la extensión *Live Server*.

---

## 🛡️ Pruebas y Validación de Responsabilidades

### A. Validación de Formato (Capa 2: API)
Envío de campo inválido o vacío:
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": ""}'
```
*Respuesta esperada:* `400 Bad Request`

### B. Validación de Regla de Negocio (Capa 3: Service)
Envío de palabra prohibida (`groseria`, `spam`, `invalido`):
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "comprar spam"}'
```
*Respuesta esperada:* `422 Unprocessable Entity`

### C. Protección contra SQL Injection (Capa 4: Repository)
Envío de payload con inyección SQL:
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Comprar pan\'); DROP TABLE tasks;--"}'
```
*Resultado esperado:* El texto se almacena de forma segura como texto plano gracias a los parámetros `$1`.

---

## ✅ Verificación de Cumplimiento y Acciones Realizadas

El proyecto fue auditado exhaustivamente contra el documento **"Tutorial Paso a Paso: Implementación del Mini Task Manager (5 Capas)"**, validando el cumplimiento del 100% de los requerimientos y realizando las siguientes optimizaciones técnicas:

### 1. Despliegue del Esquema DDL en Base de Datos
- Se ejecutó el script [`docs/schema.sql`](docs/schema.sql) sobre la instancia en PostgreSQL/Supabase.
- Se creó la tabla `tasks` con sus restricciones de dominio (`CHECK (status IN ('pending', 'done'))`) y el disparador automático `trg_tasks_updated_at` para la columna `updated_at`.

### 2. Corrección en la Carga de Variables de Entorno (`db.js`)
- **Problema detectado:** El tutorial indicaba `require('dotenv').config({ path: '../../.env' })`. Al ejecutar el backend desde la carpeta `backend/` (`npm run dev`), `dotenv` buscaba dos niveles por encima en el sistema de archivos (`F:\Progra web 2\.env`), dejando las credenciales vacías.
- **Solución implementada:** Se integró `path.resolve(__dirname, '../../../.env')` junto con un fallback a `require('dotenv').config()` en [`backend/src/config/db.js`](backend/src/config/db.js), garantizando la correcta lectura de variables de entorno sin importar desde qué directorio se ejecute el servidor.

### 3. Compatibilidad SSL con Supabase / Cloud Databases
- Se implementó detección automática de conexiones remotas en `db.js` (`ssl: { rejectUnauthorized: false }`) para permitir la conectividad con Supabase de forma transparente sin requerir forzar `NODE_ENV=production` en local.

### 4. Batería de Pruebas Automatizadas (Flujo de 13 Pasos)
Se verificaron exitosamente todos los escenarios de prueba descritos en las páginas 14 y 15 del tutorial:
- **Validación de formato (Capa 2):** Respuestas con `HTTP 400 Bad Request` ante entradas vacías o tipos inválidos, asociando el campo culpable (`field: "title"`).
- **Validación de negocio (Capa 3):** Rechazo con `HTTP 422 Unprocessable Entity` ante títulos de menos de 3 caracteres o con palabras restringidas (`groseria`, `spam`, `invalido`).
- **Seguridad Repository (Capa 4):** Resistencia total ante SQL Injection con parámetros seguros `$1` y `$2`.
- **Operaciones completas:** Inserción (`POST 201`), consulta cronológica (`GET 200`), alternancia de estado (`PATCH 200`) y eliminación física (`DELETE 200`).
- **Accesibilidad y Frontend (Capa 1):** Interfaz web con atributos ARIA, navegación por teclado, anuncios para lectores de pantalla y consumo asíncrono con `fetch`.

