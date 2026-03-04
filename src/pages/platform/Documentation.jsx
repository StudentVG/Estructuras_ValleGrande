import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
     hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
     show: (i = 0) => ({
          opacity: 1, y: 0, filter: "blur(0px)",
          transition: { duration: 0.5, ease: "easeOut", delay: i * 0.08 },
     }),
};

const SEMESTERS = [
     { id: "sem2", label: "Semestre II", roman: "II", accent: "blue" },
     { id: "sem3", label: "Semestre III", roman: "III", accent: "emerald" },
     { id: "sem4", label: "Semestre IV", roman: "IV", accent: "violet" },
     { id: "sem5", label: "Semestre V", roman: "V", accent: "orange" },
];

const NAMING_RULES = [
     { scope: "Backend — Spring Boot", file: "README.md", location: "Raíz del microservicio", example: "vg-ms-users/README.md", color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20" },
     { scope: "Backend — Flask / Python", file: "README.md", location: "Raíz del proyecto backend", example: "vg-ms-nombre-be/README.md", color: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20" },
     { scope: "Frontend — Angular", file: "README.md", location: "Raíz del proyecto Angular", example: "vg-ms-nombre-fe/README.md", color: "text-rose-400", bg: "bg-rose-500/8 border-rose-500/20" },
     { scope: "Frontend — React + Vite", file: "README.md", location: "Raíz del proyecto React", example: "vg-ms-nombre-fe/README.md", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
     { scope: "Mobile — Expo", file: "README.md", location: "Raíz del proyecto Expo", example: "vg-ms-nombre-mobile/README.md", color: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20" },
     { scope: "Desktop — Java Swing", file: "README.md", location: "Raíz del proyecto Java", example: "mi-proyecto/README.md", color: "text-blue-400", bg: "bg-blue-500/8 border-blue-500/20" },
     { scope: "Monorepo / PRS", file: "README.md", location: "Raíz del monorepo + 1 por cada microservicio", example: "proyecto-prs/README.md + proyecto-prs/vg-ms-users/README.md", color: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20" },
];

const FORBIDDEN_FILES = [
     { file: "CONTRIBUTING.md", reason: "No aplica en proyectos académicos" },
     { file: "CHANGELOG.md", reason: "Usar Conventional Commits en su lugar" },
     { file: "CODE_OF_CONDUCT.md", reason: "No requerido" },
     { file: "SECURITY.md", reason: "No requerido" },
     { file: "LICENSE", reason: "Solo si el docente lo solicita" },
     { file: "docs/*.md", reason: "No crear carpeta docs/ con múltiples .md" },
     { file: "INSTALL.md", reason: "Todo va dentro del README.md" },
     { file: "API.md", reason: "Endpoints van en el README.md" },
];

const GENERAL_RULES = [
     { rule: "Un solo README.md por repositorio (en la raíz)", detail: "En monorepos/PRS, cada microservicio tiene su propio README.md adicional" },
     { rule: "Idioma: español para descripciones, inglés para código", detail: "Nombres de variables, endpoints y comandos van en inglés" },
     { rule: "No documentar lo obvio", detail: "No poner 'clonar el repositorio con git clone' ni 'abrir terminal'" },
     { rule: "Variables de entorno: nombre + descripción, nunca el valor real", detail: "Usar VITE_API_URL=tu_url_aqui o DB_PASSWORD=******" },
     { rule: "Estructura de carpetas siempre incluida", detail: "Mostrar el árbol del proyecto con carpetas y archivos principales" },
     { rule: "No generar archivos .md extras con IA", detail: "Si la IA genera CONTRIBUTING.md, CHANGELOG.md, etc., eliminarlos" },
     { rule: "Capturas de pantalla solo si aportan valor", detail: "Máximo 2-3 screenshots relevantes, no llenar de imágenes" },
     { rule: "Mantener actualizado", detail: "El README debe reflejar el estado actual del proyecto, no una versión vieja" },
];

const TEMPLATES = {
     sem2_desktop: {
          title: "Java Swing + MySQL",
          badge: "Desktop",
          accent: "blue",
          template: `# {Nombre del Proyecto}

{Descripción breve del proyecto en 1-3 líneas.}

## Tecnologías

| Tecnología | Versión |
|---|---|
| Java | 17+ |
| Java Swing | — |
| MySQL | 8.x |
| JDBC | — |
| IntelliJ IDEA | 2024.x |

## Requisitos previos

- JDK 17 o superior instalado
- MySQL 8.x corriendo en localhost
- IntelliJ IDEA instalado

## Base de datos

1. Crear la base de datos:

\`\`\`sql
CREATE DATABASE nombre_db;
USE nombre_db;
\`\`\`

2. Ejecutar el script de tablas ubicado en \`/sql/schema.sql\`

## Configuración

Editar la clase \`AccessDB.java\` con tus credenciales:

\`\`\`
URL      = jdbc:mysql://localhost:3306/nombre_db
USER     = tu_usuario
PASSWORD = ******
\`\`\`

## Ejecución

1. Abrir el proyecto en IntelliJ IDEA
2. Ejecutar la clase principal \`Main.java\`

## Estructura del proyecto

\`\`\`
mi-proyecto/
└── src/
    └── pe/edu/vallegrande/miproyecto/
        ├── view/           ← Interfaces gráficas Swing
        ├── controller/     ← Lógica de eventos
        ├── service/        ← Lógica de negocio
        ├── dto/            ← Objetos de transferencia
        ├── model/          ← Entidades de dominio
        ├── dao/            ← Persistencia SQL
        ├── db/             ← Conexión a BD (AccessDB)
        └── util/           ← Utilidades
\`\`\`

## Autores

- {Nombre} — {GitHub}`,
          checklist: [
               "README.md existe en la raíz",
               "Descripción del proyecto (1-3 líneas)",
               "Tabla de tecnologías con versiones",
               "Requisitos previos listados",
               "Instrucciones de BD (crear DB + script SQL)",
               "Configuración de AccessDB documentada (sin contraseñas reales)",
               "Comando/pasos de ejecución",
               "Estructura de carpetas incluida",
               "No hay archivos .md innecesarios",
               "Autores con link a GitHub",
          ],
     },
     sem2_web: {
          title: "Flask + Tailwind + MySQL",
          badge: "Web",
          accent: "violet",
          template: `# {Nombre del Proyecto}

{Descripción breve del proyecto en 1-3 líneas.}

## Tecnologías

| Tecnología | Versión |
|---|---|
| Python | 3.12 |
| Flask | 3.x |
| MySQL | 8.x |
| Tailwind CSS | 4.x (CDN) |
| JavaScript | ES6+ |

## Requisitos previos

- Python 3.12 instalado
- MySQL 8.x corriendo en localhost
- pip (gestor de paquetes de Python)

## Instalación

1. Crear entorno virtual:

\`\`\`bash
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\\Scripts\\activate      # Windows
\`\`\`

2. Instalar dependencias:

\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. Configurar variables de entorno — crear archivo \`.env\`:

\`\`\`
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nombre_db
DB_USER=tu_usuario
DB_PASSWORD=******
SECRET_KEY=tu_clave_secreta
\`\`\`

4. Crear la base de datos y ejecutar el script SQL

## Ejecución

\`\`\`bash
python app.py
\`\`\`

La aplicación estará disponible en \`http://localhost:5000\`

## Estructura del proyecto

\`\`\`
mi-proyecto/
├── app/
│   ├── __init__.py        ← Factory function
│   ├── config.py          ← Configuración
│   ├── database.py        ← Conexión MySQL
│   ├── models/            ← Clases ORM
│   ├── routes/            ← Blueprints (endpoints)
│   ├── services/          ← Lógica de negocio
│   ├── static/            ← CSS, JS, imágenes
│   └── templates/         ← HTML con Jinja2
├── .env                   ← Variables de entorno
├── app.py                 ← Punto de entrada
└── requirements.txt       ← Dependencias
\`\`\`

## Rutas principales

| Método | Ruta | Descripción |
|---|---|---|
| GET | \`/\` | Página principal |
| GET | \`/clientes\` | Listado de clientes |
| POST | \`/clientes\` | Crear cliente |

## Autores

- {Nombre} — {GitHub}`,
          checklist: [
               "README.md existe en la raíz",
               "Descripción del proyecto (1-3 líneas)",
               "Tabla de tecnologías con versiones",
               "Requisitos previos listados",
               "Instrucciones de instalación (venv + pip + .env + BD)",
               "Variables de entorno documentadas (sin valores reales)",
               "Comando de ejecución",
               "Estructura de carpetas incluida",
               "Tabla de rutas principales",
               "No hay archivos .md innecesarios",
               "Autores con link a GitHub",
          ],
     },
     sem3_backend: {
          title: "Spring Boot MVC",
          badge: "Backend",
          accent: "emerald",
          template: `# {Nombre del Microservicio}

{Descripción breve del microservicio en 1-3 líneas.}

## Tecnologías

| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 3.x |
| Spring Data JPA | — |
| SQL Server | 2019+ |
| Maven | 3.9+ |
| Lombok | — |

## Requisitos previos

- JDK 17 instalado
- SQL Server corriendo
- Maven 3.9+
- IntelliJ IDEA

## Configuración

Variables en \`application.yml\` (o \`application.properties\`):

\`\`\`yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=nombre_db
    username: tu_usuario
    password: ******
  jpa:
    hibernate:
      ddl-auto: update
server:
  port: 8080
\`\`\`

## Ejecución

\`\`\`bash
./mvnw spring-boot:run
\`\`\`

## Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | \`/api/v1/clients\` | Listar todos |
| GET | \`/api/v1/clients/{id}\` | Obtener por ID |
| POST | \`/api/v1/clients\` | Crear |
| PUT | \`/api/v1/clients/{id}\` | Actualizar |
| DELETE | \`/api/v1/clients/{id}\` | Eliminar |

## Estructura del proyecto

\`\`\`
src/main/java/pe/edu/vallegrande/nombre/
├── controller/     ← Endpoints REST
├── service/        ← Lógica de negocio
├── repository/     ← Acceso a datos (JPA)
├── model/          ← Entidades (@Entity)
├── dto/            ← Objetos de transferencia
├── exception/      ← Manejo global de errores
├── config/         ← Configuraciones Spring
└── util/           ← Utilidades
\`\`\`

## Autores

- {Nombre} — {GitHub}`,
          checklist: [
               "README.md existe en la raíz del microservicio",
               "Descripción del microservicio (1-3 líneas)",
               "Tabla de tecnologías con versiones",
               "Requisitos previos listados",
               "Configuración application.yml documentada (sin contraseñas)",
               "Comando de ejecución",
               "Tabla de endpoints con método, ruta y descripción",
               "Estructura de paquetes incluida",
               "No hay archivos .md innecesarios",
               "Autores con link a GitHub",
          ],
     },
     sem3_frontend: {
          title: "Angular",
          badge: "Frontend",
          accent: "rose",
          template: `# {Nombre del Frontend}

{Descripción breve del frontend en 1-3 líneas.}

## Tecnologías

| Tecnología | Versión |
|---|---|
| Angular | 17+ |
| TypeScript | 5.x |
| Bootstrap | 5.x |
| RxJS | 7.x |
| Node.js | 20+ |

## Requisitos previos

- Node.js 20+ instalado
- Angular CLI: \`npm install -g @angular/cli\`

## Instalación

\`\`\`bash
npm install
\`\`\`

## Configuración

Editar \`src/environments/environment.ts\`:

\`\`\`typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'
};
\`\`\`

## Ejecución

\`\`\`bash
ng serve
\`\`\`

La aplicación estará en \`http://localhost:4200\`

## Estructura del proyecto

\`\`\`
src/app/
├── components/         ← Componentes reutilizables
│   ├── navbar/
│   └── footer/
├── pages/              ← Vistas principales (1 por ruta)
│   ├── home/
│   └── client-list/
├── services/           ← Servicios HTTP (@Injectable)
│   └── client.service.ts
├── models/             ← Interfaces TypeScript
│   └── client.model.ts
├── guards/             ← Route guards
├── interceptors/       ← HTTP interceptors
└── app.routes.ts       ← Definición de rutas
\`\`\`

## Autores

- {Nombre} — {GitHub}`,
          checklist: [
               "README.md existe en la raíz",
               "Descripción del frontend (1-3 líneas)",
               "Tabla de tecnologías con versiones",
               "Requisitos previos (Node.js + Angular CLI)",
               "Comando de instalación (npm install)",
               "Configuración de environment documentada",
               "Comando de ejecución (ng serve)",
               "Estructura de carpetas incluida",
               "No hay archivos .md innecesarios",
               "Autores con link a GitHub",
          ],
     },
     sem4_webflux: {
          title: "Spring WebFlux (Reactivo)",
          badge: "Backend",
          accent: "emerald",
          template: `# {Nombre del Microservicio}

{Descripción breve — indicar que es un microservicio reactivo con WebFlux.}

## Tecnologías

| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 3.x |
| Spring WebFlux | — |
| Spring Data R2DBC / Reactive MongoDB | — |
| Oracle DB / MongoDB | — |
| Maven | 3.9+ |
| Lombok | — |

## Requisitos previos

- JDK 17 instalado
- Oracle DB o MongoDB corriendo
- Maven 3.9+

## Configuración

\`application.yaml\`:

\`\`\`yaml
spring:
  r2dbc:
    url: r2dbc:oracle://localhost:1521/XEPDB1
    username: tu_usuario
    password: ******
server:
  port: 8080
\`\`\`

## Ejecución

\`\`\`bash
./mvnw spring-boot:run
\`\`\`

## Endpoints

| Método | Endpoint | Retorno | Descripción |
|---|---|---|---|
| GET | \`/api/clients\` | Flux<Client> | Listar todos (stream) |
| GET | \`/api/clients/{id}\` | Mono<Client> | Obtener por ID |
| POST | \`/api/clients\` | Mono<Client> | Crear |
| DELETE | \`/api/clients/{id}\` | Mono<Void> | Eliminar |

## Estructura del proyecto

\`\`\`
src/main/java/pe/edu/vallegrande/nombre/
├── model/          ← Entidades reactivas (@Table / @Document)
├── repository/     ← ReactiveCrudRepository / ReactiveMongoRepository
├── service/        ← Interfaz del servicio
│   └── impl/      ← Implementación con Flux y Mono
├── rest/           ← Endpoints REST reactivos
└── config/         ← Configuraciones (CORS, etc.)
\`\`\`

## Autores

- {Nombre} — {GitHub}`,
          checklist: [
               "README.md existe en la raíz",
               "Menciona que es un proyecto reactivo (WebFlux)",
               "Tabla de tecnologías con versiones",
               "Especifica la BD utilizada (Oracle R2DBC o MongoDB)",
               "Configuración application.yaml documentada (sin contraseñas)",
               "Comando de ejecución",
               "Tabla de endpoints con tipos reactivos (Flux/Mono)",
               "Estructura de paquetes incluida",
               "No hay archivos .md innecesarios",
               "Autores con link a GitHub",
          ],
     },
     sem4_react: {
          title: "React + Vite",
          badge: "Frontend",
          accent: "sky",
          template: `# {Nombre del Frontend}

{Descripción breve del frontend en 1-3 líneas.}

## Tecnologías

| Tecnología | Versión |
|---|---|
| React | 19 |
| Vite | 7.x |
| JavaScript | ES6+ |
| Tailwind CSS | 4.x |
| Axios | 1.x |
| React Router DOM | 7.x |

## Requisitos previos

- Node.js 20+ instalado

## Instalación

\`\`\`bash
npm install
\`\`\`

## Configuración

Crear archivo \`.env\` en la raíz:

\`\`\`
VITE_API_URL=http://localhost:8080/api
\`\`\`

## Ejecución

\`\`\`bash
npm run dev
\`\`\`

## Estructura del proyecto

\`\`\`
src/
├── api/               ← Axios config + funciones por entidad
│   ├── axiosConfig.js
│   └── clientApi.js
├── components/        ← Componentes reutilizables
├── hooks/             ← Custom hooks (useClients, useFetch)
├── pages/             ← Vistas (1 por ruta)
├── context/           ← Context API (estado global)
├── utils/             ← Funciones utilitarias
├── App.jsx            ← Rutas
├── main.jsx           ← Entry point
└── index.css          ← Tailwind import
\`\`\`

## Autores

- {Nombre} — {GitHub}`,
          checklist: [
               "README.md existe en la raíz",
               "Descripción del frontend (1-3 líneas)",
               "Tabla de tecnologías con versiones",
               "Requisitos previos (Node.js)",
               "Comando de instalación (npm install)",
               "Variables de entorno documentadas (.env con VITE_*)",
               "Comando de ejecución (npm run dev)",
               "Estructura de carpetas incluida",
               "No hay archivos .md innecesarios",
               "Autores con link a GitHub",
          ],
     },
     sem4_expo: {
          title: "Expo + React Native",
          badge: "Mobile",
          accent: "violet",
          template: `# {Nombre de la App Móvil}

{Descripción breve de la app móvil en 1-3 líneas.}

## Tecnologías

| Tecnología | Versión |
|---|---|
| Expo SDK | 54 |
| React Native | 0.81 |
| TypeScript | 5.9 |
| Expo Router | v6 |
| React Navigation | 7.x |
| Async Storage | — |

## Requisitos previos

- Node.js 20+ instalado
- Expo Go instalado en el dispositivo móvil
- Android Studio (para emulador Android, opcional)

## Instalación

\`\`\`bash
npm install
\`\`\`

## Configuración

Editar constantes en \`constants/config.ts\`:

\`\`\`typescript
export const BASE_URL = 'http://tu-ip-local:8080/api';
\`\`\`

## Ejecución

\`\`\`bash
npx expo start
\`\`\`

- Presionar \`a\` para Android Emulator
- Escanear QR con Expo Go en dispositivo físico

## Estructura del proyecto

\`\`\`
app/                      ← Expo Router (file-based routing)
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── explore.tsx
├── _layout.tsx
└── login.tsx
components/common/        ← Componentes reutilizables (kebab-case)
hooks/                    ← Custom hooks (use-auth.ts)
services/                 ← HTTP + AsyncStorage
store/                    ← Estado global (Zustand/Context)
types/                    ← Interfaces TypeScript
constants/                ← Colores, config, theme
utils/                    ← Helpers (storage, validators)
\`\`\`

## Build (APK)

\`\`\`bash
eas build --platform android --profile preview
\`\`\`

## Autores

- {Nombre} — {GitHub}`,
          checklist: [
               "README.md existe en la raíz",
               "Descripción de la app (1-3 líneas)",
               "Tabla de tecnologías con versiones (Expo SDK, RN, TS)",
               "Requisitos previos (Node.js, Expo Go)",
               "Comando de instalación",
               "Configuración de BASE_URL documentada",
               "Comando de ejecución (npx expo start)",
               "Estructura de carpetas incluida",
               "Instrucciones de build (APK) si aplica",
               "No hay archivos .md innecesarios",
               "Autores con link a GitHub",
          ],
     },
     sem4_python: {
          title: "Python Flask + SQLite",
          badge: "Automatización",
          accent: "amber",
          template: `# {Nombre del Proyecto}

{Descripción breve — proyecto de automatización web con Flask y SQLite.}

## Tecnologías

| Tecnología | Versión |
|---|---|
| Python | 3.12 |
| Flask | 3.x |
| SQLite | 3.x |
| Flask-CORS | — |
| python-dotenv | — |

## Requisitos previos

- Python 3.12 instalado
- pip (gestor de paquetes)

## Instalación

\`\`\`bash
python -m venv venv
venv\\Scripts\\activate      # Windows
pip install -r requirements.txt
\`\`\`

## Configuración

Crear \`.env\`:

\`\`\`
SECRET_KEY=tu_clave_secreta
\`\`\`

## Ejecución

\`\`\`bash
python run.py
\`\`\`

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | \`/clients\` | Listar todos |
| POST | \`/clients\` | Crear |

## Estructura del proyecto

\`\`\`
vg-ms-nombre-be/
├── app/
│   ├── models/        ← Modelos de datos
│   ├── routes/        ← Endpoints (blueprints)
│   ├── services/      ← Lógica de negocio
│   └── settings.py    ← Configuración
├── database.db        ← SQLite
├── .env
├── run.py             ← Punto de entrada
└── requirements.txt
\`\`\`

## Autores

- {Nombre} — {GitHub}`,
          checklist: [
               "README.md existe en la raíz",
               "Descripción del proyecto (1-3 líneas)",
               "Tabla de tecnologías con versiones",
               "Instrucciones de instalación (venv + pip)",
               "Variables de entorno documentadas (.env)",
               "Comando de ejecución (python run.py)",
               "Tabla de endpoints",
               "Estructura de carpetas incluida",
               "No hay archivos .md innecesarios",
               "Autores con link a GitHub",
          ],
     },
     sem5_monorepo: {
          title: "Microservicios PRS (Monorepo)",
          badge: "Enterprise",
          accent: "orange",
          template: `# {Nombre del Proyecto PRS}

{Descripción general del sistema — qué problema resuelve, cuántos microservicios tiene.}

## Arquitectura

\`\`\`
                    ┌──────────────┐
                    │   Gateway    │ :8080
                    └──────┬───────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ MS Users │    │ MS Claims│    │ MS Notif │
    │  :8081   │    │  :8082   │    │  :8083   │
    └──────────┘    └──────────┘    └──────────┘
\`\`\`

## Microservicios

| Servicio | Puerto | Descripción |
|---|---|---|
| vg-ms-gateway | 8080 | API Gateway — enrutamiento |
| vg-ms-users | 8081 | Gestión de usuarios |
| vg-ms-claims | 8082 | Gestión de reclamos |
| vg-ms-notifications | 8083 | Envío de notificaciones |

## Tecnologías

| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 3.x |
| Spring WebFlux | — |
| Spring Cloud Gateway | — |
| MongoDB / Oracle | — |
| Docker + Docker Compose | — |
| Maven | 3.9+ |

## Requisitos previos

- JDK 17
- Docker y Docker Compose
- Maven 3.9+
- MongoDB / Oracle según el microservicio

## Ejecución con Docker Compose

\`\`\`bash
docker-compose up --build
\`\`\`

## Ejecución individual

\`\`\`bash
cd vg-ms-users
./mvnw spring-boot:run
\`\`\`

## Variables de entorno

| Variable | Descripción |
|---|---|
| DB_HOST | Host de la base de datos |
| DB_PORT | Puerto de la BD |
| DB_NAME | Nombre de la BD |
| DB_USER | Usuario de la BD |
| DB_PASSWORD | Contraseña (no commitear) |
| GATEWAY_PORT | Puerto del Gateway |

## Estructura del monorepo

\`\`\`
proyecto-prs/
├── docker-compose.yml       ← Orquestación de todos los MS
├── README.md                ← Este archivo (visión general)
├── vg-ms-gateway/
│   ├── README.md            ← Documentación del Gateway
│   └── src/
├── vg-ms-users/
│   ├── README.md            ← Documentación de Users
│   └── src/
├── vg-ms-claims/
│   ├── README.md            ← Documentación de Claims
│   └── src/
└── vg-ms-notifications/
    ├── README.md            ← Documentación de Notifications
    └── src/
\`\`\`

## Autores

- {Nombre} — {GitHub}`,
          checklist: [
               "README.md existe en la raíz del monorepo",
               "Cada microservicio tiene su propio README.md",
               "Descripción general del sistema",
               "Diagrama de arquitectura (texto o imagen)",
               "Tabla de microservicios con puertos",
               "Tabla de tecnologías con versiones",
               "Instrucciones de ejecución (docker-compose + individual)",
               "Variables de entorno documentadas (sin valores reales)",
               "Estructura del monorepo incluida",
               "No hay archivos .md innecesarios por MS",
               "Autores con link a GitHub",
          ],
     },
     sem5_ms_individual: {
          title: "Microservicio Individual (dentro del PRS)",
          badge: "Per-Service",
          accent: "teal",
          template: `# {Nombre del Microservicio}

{Descripción breve — qué hace este microservicio dentro del sistema PRS.}

## Tecnologías

| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 3.x |
| Spring WebFlux | — |
| MongoDB / Oracle | — |
| Maven | 3.9+ |

## Configuración

\`application.yml\`:

\`\`\`yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/nombre_db
server:
  port: 8081
\`\`\`

## Endpoints

| Método | Endpoint | Retorno | Descripción |
|---|---|---|---|
| GET | \`/api/users\` | Flux<User> | Listar todos |
| GET | \`/api/users/{id}\` | Mono<User> | Obtener por ID |
| POST | \`/api/users\` | Mono<User> | Crear |
| PUT | \`/api/users/{id}\` | Mono<User> | Actualizar |
| PATCH | \`/api/users/{id}\` | Mono<User> | Cambiar estado |

## Estructura

\`\`\`
src/main/java/pe/edu/vallegrande/nombre/
├── model/
├── repository/
├── service/
│   └── impl/
├── rest/
└── config/
\`\`\`

## Docker

\`\`\`bash
docker build -t vg-ms-users .
docker run -p 8081:8081 vg-ms-users
\`\`\`

## Autores

- {Nombre} — {GitHub}`,
          checklist: [
               "README.md existe en la raíz del microservicio",
               "Descripción de qué hace dentro del sistema PRS",
               "Tabla de tecnologías",
               "Configuración application.yml (sin contraseñas)",
               "Tabla de endpoints con tipos reactivos",
               "Estructura de paquetes",
               "Instrucciones Docker (build + run)",
               "Autores con link a GitHub",
          ],
     },
};

const SEMESTER_TEMPLATES = {
     sem2: [
          { key: "sem2_desktop", ...TEMPLATES.sem2_desktop },
          { key: "sem2_web", ...TEMPLATES.sem2_web },
     ],
     sem3: [
          { key: "sem3_backend", ...TEMPLATES.sem3_backend },
          { key: "sem3_frontend", ...TEMPLATES.sem3_frontend },
     ],
     sem4: [
          { key: "sem4_webflux", ...TEMPLATES.sem4_webflux },
          { key: "sem4_react", ...TEMPLATES.sem4_react },
          { key: "sem4_expo", ...TEMPLATES.sem4_expo },
          { key: "sem4_python", ...TEMPLATES.sem4_python },
     ],
     sem5: [
          { key: "sem5_monorepo", ...TEMPLATES.sem5_monorepo },
          { key: "sem5_ms_individual", ...TEMPLATES.sem5_ms_individual },
     ],
};

const accentMap = {
     blue: { activeBg: "bg-blue-600/20 border-blue-500/50 text-blue-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300", badge: "bg-blue-500/15 border-blue-500/25 text-blue-400", bar: "bg-blue-500", dot: "text-blue-400", checkBg: "bg-blue-500/10 border-blue-500/20", header: "bg-blue-500/8 border-blue-500/20" },
     emerald: { activeBg: "bg-emerald-600/20 border-emerald-500/50 text-emerald-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300", badge: "bg-emerald-500/15 border-emerald-500/25 text-emerald-400", bar: "bg-emerald-500", dot: "text-emerald-400", checkBg: "bg-emerald-500/10 border-emerald-500/20", header: "bg-emerald-500/8 border-emerald-500/20" },
     violet: { activeBg: "bg-violet-600/20 border-violet-500/50 text-violet-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300", badge: "bg-violet-500/15 border-violet-500/25 text-violet-400", bar: "bg-violet-500", dot: "text-violet-400", checkBg: "bg-violet-500/10 border-violet-500/20", header: "bg-violet-500/8 border-violet-500/20" },
     orange: { activeBg: "bg-orange-600/20 border-orange-500/50 text-orange-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300", badge: "bg-orange-500/15 border-orange-500/25 text-orange-400", bar: "bg-orange-500", dot: "text-orange-400", checkBg: "bg-orange-500/10 border-orange-500/20", header: "bg-orange-500/8 border-orange-500/20" },
     sky: { activeBg: "bg-sky-600/20 border-sky-500/50 text-sky-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300", badge: "bg-sky-500/15 border-sky-500/25 text-sky-400", bar: "bg-sky-500", dot: "text-sky-400", checkBg: "bg-sky-500/10 border-sky-500/20", header: "bg-sky-500/8 border-sky-500/20" },
     rose: { activeBg: "bg-rose-600/20 border-rose-500/50 text-rose-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300", badge: "bg-rose-500/15 border-rose-500/25 text-rose-400", bar: "bg-rose-500", dot: "text-rose-400", checkBg: "bg-rose-500/10 border-rose-500/20", header: "bg-rose-500/8 border-rose-500/20" },
     amber: { activeBg: "bg-amber-600/20 border-amber-500/50 text-amber-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300", badge: "bg-amber-500/15 border-amber-500/25 text-amber-400", bar: "bg-amber-500", dot: "text-amber-400", checkBg: "bg-amber-500/10 border-amber-500/20", header: "bg-amber-500/8 border-amber-500/20" },
     teal: { activeBg: "bg-teal-600/20 border-teal-500/50 text-teal-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300", badge: "bg-teal-500/15 border-teal-500/25 text-teal-400", bar: "bg-teal-500", dot: "text-teal-400", checkBg: "bg-teal-500/10 border-teal-500/20", header: "bg-teal-500/8 border-teal-500/20" },
};

function CopyButton({ text }) {
     const [copied, setCopied] = useState(false);
     function handleCopy() {
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
     }
     return (
          <button onClick={handleCopy} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${copied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700"}`}>
               {copied ? (
                    <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copiado</>
               ) : (
                    <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copiar plantilla</>
               )}
          </button>
     );
}

function TemplateCard({ tmpl }) {
     const [expanded, setExpanded] = useState(false);
     const a = accentMap[tmpl.accent] || accentMap.emerald;

     return (
          <div className={`rounded-2xl border ${a.checkBg} overflow-hidden`}>
               <button onClick={() => setExpanded(!expanded)} className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/2`}>
                    <div className={`w-1.5 h-8 rounded-full ${a.bar} shrink-0`} />
                    <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-white font-bold text-sm">{tmpl.title}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-widest ${a.badge}`}>{tmpl.badge}</span>
                         </div>
                         <p className="text-slate-500 text-xs mt-0.5">{tmpl.checklist.length} criterios de validación</p>
                    </div>
                    <svg className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                         <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
               </button>

               <AnimatePresence>
                    {expanded && (
                         <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="overflow-hidden"
                         >
                              <div className="px-5 pb-5 space-y-5">
                                   <div>
                                        <div className="flex items-center justify-between mb-2">
                                             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Plantilla README.md</p>
                                             <CopyButton text={tmpl.template} />
                                        </div>
                                        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                                             <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800 bg-slate-900/80">
                                                  <div className="flex gap-1.5">
                                                       <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                                       <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                                       <span className="w-3 h-3 rounded-full bg-green-500/60" />
                                                  </div>
                                                  <span className="text-slate-500 text-xs font-mono ml-2">README.md</span>
                                             </div>
                                             <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-slate-300 whitespace-pre max-h-96 overflow-y-auto">{tmpl.template}</pre>
                                        </div>
                                   </div>

                                   <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Checklist de Code Review</p>
                                        <div className="space-y-1.5">
                                             {tmpl.checklist.map((item, i) => (
                                                  <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-800/60 bg-slate-900/30 px-3 py-2.5">
                                                       <span className="shrink-0 w-5 h-5 rounded border border-slate-700 bg-slate-800/50 flex items-center justify-center mt-0.5">
                                                            <span className="text-slate-600 text-[10px]">☐</span>
                                                       </span>
                                                       <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>
                              </div>
                         </motion.div>
                    )}
               </AnimatePresence>
          </div>
     );
}

export default function Documentation() {
     const [activeSem, setActiveSem] = useState("sem2");

     const templates = SEMESTER_TEMPLATES[activeSem] || [];

     return (
          <div className="min-h-full px-6 md:px-10 py-10 max-w-5xl mx-auto space-y-14">

               <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                         <span className="bg-amber-600/20 border border-amber-600/40 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                              Documentación
                         </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
                         Estándares de Documentación
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
                         Reglas, plantillas <span className="text-amber-400 font-semibold">README.md</span> y checklists de{" "}
                         <span className="text-emerald-400 font-semibold">code review</span> para cada tipo de proyecto.
                         Asegura que toda la documentación sea consistente y pase la revisión.
                    </p>
               </motion.div>

               <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="w-1 h-5 bg-amber-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Nombre y ubicación del archivo</h2>
                    </div>
                    <p className="text-slate-500 text-sm mb-4 max-w-2xl">Cada repositorio debe tener exactamente <span className="text-white font-semibold">un README.md</span> en la raíz. En monorepos, cada microservicio tiene el suyo adicional.</p>
                    <div className="space-y-2">
                         {NAMING_RULES.map((r) => (
                              <div key={r.scope} className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-xl border px-4 py-3 ${r.bg}`}>
                                   <div className="flex items-center gap-3 sm:w-56 shrink-0">
                                        <span className={`text-sm font-bold ${r.color}`}>{r.scope}</span>
                                   </div>
                                   <div className="flex-1 min-w-0">
                                        <p className="text-slate-400 text-xs">{r.location}</p>
                                        <p className="text-slate-500 text-xs font-mono mt-0.5 truncate">{r.example}</p>
                                   </div>
                                   <span className="text-slate-300 text-xs font-mono font-bold shrink-0 bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-700/50">{r.file}</span>
                              </div>
                         ))}
                    </div>
               </motion.div>

               <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="w-1 h-5 bg-red-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Archivos prohibidos</h2>
                    </div>
                    <p className="text-slate-500 text-sm mb-4 max-w-2xl">La IA suele generar estos archivos automáticamente. <span className="text-red-400 font-semibold">Elimínalos</span> antes del code review.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                         {FORBIDDEN_FILES.map((f) => (
                              <div key={f.file} className="flex items-center gap-3 rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-3">
                                   <span className="text-red-400 text-sm font-mono font-bold">{f.file}</span>
                                   <span className="text-slate-500 text-xs ml-auto text-right">{f.reason}</span>
                              </div>
                         ))}
                    </div>
               </motion.div>

               <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Reglas generales</h2>
                    </div>
                    <div className="space-y-2">
                         {GENERAL_RULES.map((r, i) => (
                              <div key={i} className="flex gap-4 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
                                   <span className="shrink-0 w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs font-black font-mono mt-0.5">
                                        {i + 1}
                                   </span>
                                   <div>
                                        <p className="text-emerald-300 text-sm font-semibold mb-0.5">{r.rule}</p>
                                        <p className="text-slate-500 text-xs leading-relaxed">{r.detail}</p>
                                   </div>
                              </div>
                         ))}
                    </div>
               </motion.div>

               <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="w-1 h-5 bg-sky-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Plantillas y checklists por proyecto</h2>
                    </div>
                    <p className="text-slate-500 text-sm mb-5 max-w-2xl">Selecciona el semestre para ver las plantillas README.md y los criterios de code review para cada tipo de proyecto.</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                         {SEMESTERS.map((sem) => {
                              const a = accentMap[sem.accent];
                              return (
                                   <button
                                        key={sem.id}
                                        onClick={() => setActiveSem(sem.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 ${activeSem === sem.id ? a.activeBg : a.inactive}`}
                                   >
                                        <span className={`w-6 h-6 rounded-md bg-slate-800 border border-slate-700/60 flex items-center justify-center text-[10px] font-black ${a.dot}`}>{sem.roman}</span>
                                        <span>{sem.label}</span>
                                   </button>
                              );
                         })}
                    </div>

                    <AnimatePresence mode="wait">
                         <motion.div
                              key={activeSem}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-3"
                         >
                              {templates.map((tmpl) => (
                                   <TemplateCard key={tmpl.key} tmpl={tmpl} />
                              ))}
                         </motion.div>
                    </AnimatePresence>
               </motion.div>

          </div>
     );
}
