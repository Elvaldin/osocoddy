# 🐻 osoCoddy

Plataforma web educativa para aprender programación mediante cursos, lecciones, retos de código y seguimiento personalizado del progreso.

> [!IMPORTANT]
> **Estado actual: v0.1 Alpha.** El proyecto es funcional y está publicado, pero continúa en desarrollo activo.

## Demostración

- Aplicación: [osocoddy-web.vercel.app](https://osocoddy-web.vercel.app/)
- Estado de la API: [API Health](https://osocoddy-production.up.railway.app/api/health)


## Funciones disponibles

- Registro e inicio de sesión de usuarios.
- Autenticación mediante JWT.
- Rutas y lecciones de programación.
- Ejecución segura de Python en el navegador mediante Pyodide.
- Validación de los requisitos de cada reto desde la API.
- Seguimiento de lecciones completadas.
- Sistema de experiencia, niveles y rachas.
- Logros y progreso por usuario.
- Rutas protegidas para usuarios autenticados.

## Tecnologías

### Backend

- C#
- .NET 10
- ASP.NET Core Minimal API
- Entity Framework Core
- PostgreSQL
- Autenticación JWT
- Docker

### Frontend

- React
- TypeScript
- Vite
- React Router
- HTML y CSS
- Pyodide y Web Workers

### Infraestructura

- Vercel para el frontend.
- Railway para la API.
- PostgreSQL alojado en Railway.
- Docker para construir y desplegar el backend.

## Estructura del proyecto

```text
OsoCoddy/
├── Backend/
│   └── OsoCoddy.api/
│       ├── DTOs/
│       ├── Data/
│       ├── Migrations/
│       ├── Models/
│       └── Services/
├── Web/
│   ├── public/
│   └── src/
├── Docs/
└── Mobile/

```

## Requisitos

- .NET SDK 10
- Node.js y npm
- PostgreSQL
- Entity Framework Core CLI

## Configuración local

Copia el archivo de ejemplo:

```bash
cp Backend/OsoCoddy.api/appsettings.Example.json Backend/OsoCoddy.api/appsettings.json
```

Edita `appsettings.json` con los datos de PostgreSQL local. No publiques contraseñas, conexiones reales ni claves JWT.

Configura JWT mediante User Secrets:

```bash
cd Backend/OsoCoddy.api
dotnet user-secrets set "Jwt:Key" "$(openssl rand -base64 48)"
dotnet user-secrets set "Jwt:Issuer" "OsoCoddy.Api"
dotnet user-secrets set "Jwt:Audience" "OsoCoddy.Web"
```

## Ejecutar el backend

```bash
cd Backend/OsoCoddy.api
dotnet restore
dotnet ef database update
dotnet run
```

La API estará disponible normalmente en `http://localhost:5025`.

## Ejecutar el frontend

```bash
cd Web
npm install
npm run dev
```

El frontend estará disponible normalmente en `http://localhost:5173`.

## Estado del proyecto

La versión pública actual corresponde a **osoCoddy v0.1 Alpha**.

### Implementado

- Autenticación y rutas protegidas.
- Curso inicial de Python con 12 lecciones.
- Ejecución de Python dentro del navegador.
- Validación de mini retos.
- Seguimiento de progreso y lecciones completadas.
- Sistema de XP, niveles, rachas y logros.
- Frontend, API y base de datos desplegados.

### En desarrollo

- Nuevos cursos y lenguajes de programación.
- Más ejercicios y proyectos prácticos.
- Mejoras en el editor de código y retroalimentación.
- Pruebas automatizadas y mejoras de accesibilidad.
- Aplicación móvil.
- Nuevas funciones para perfiles y rutas de aprendizaje.

## Autor

**José Oswaldo Mora Rodríguez**

- GitHub: [Elvaldin](https://github.com/Elvaldin)
- Portafolio: [elvaldin-github-io.vercel.app](https://elvaldin-github-io.vercel.app/)
