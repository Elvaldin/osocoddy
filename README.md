# 🐻 osoCoddy

Plataforma web educativa para aprender programación mediante cursos, lecciones, retos de código y seguimiento personalizado del progreso.

## Funciones principales

- Registro e inicio de sesión de usuarios.
- Autenticación mediante JWT.
- Rutas y lecciones de programación.
- Retos con ejecución y validación de código.
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

### Frontend

- React
- TypeScript
- Vite
- React Router
- HTML y CSS

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
