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

## Estado

Proyecto en desarrollo activo.

## Autor

**José Oswaldo Mora Rodríguez**

- GitHub: [Elvaldin](https://github.com/Elvaldin)
- Portafolio: [elvaldin-github-io.vercel.app](https://elvaldin-github-io.vercel.app/)
