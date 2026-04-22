# 📝 Estándares de Conventional Commits — Valle Grande

> Guía completa de **Conventional Commits** para todos los semestres (II al V·VI). Documento de referencia para el código review automatizado con Amazon Bedrock.

---

## Índice

1. [¿Qué son los Conventional Commits?](#qué-son-los-conventional-commits)
2. [Formato del Mensaje](#formato-del-mensaje)
3. [Tipos de Commit Permitidos](#tipos-de-commit-permitidos)
4. [Reglas Obligatorias](#reglas-obligatorias)
5. [Scope (Alcance) — Opcional](#scope-alcance--opcional)
6. [Breaking Changes](#breaking-changes)
7. [Ejemplos por Semestre](#ejemplos-por-semestre)
8. [Ejemplos con Scope](#ejemplos-con-scope)
9. [Buenos vs Malos Commits](#buenos-vs-malos-commits)
10. [Flujo de Trabajo con Git](#flujo-de-trabajo-con-git)
11. [Validación Automatizada](#validación-automatizada)

---

---

## ¿Qué son los Conventional Commits?

Es una **convención para escribir mensajes de commit** estandarizados que describen de forma clara y consistente los cambios en el código fuente. Permite:

- Generar changelogs automáticamente.
- Determinar incrementos de versión semántica (MAJOR.MINOR.PATCH).
- Comunicar la naturaleza de los cambios al equipo.
- Facilitar la revisión de código automatizada y manual.
- Filtrar commits por tipo (features, fixes, etc.).

**Especificación oficial:** [conventionalcommits.org](https://www.conventionalcommits.org/es/v1.0.0/)

---

## Formato del Mensaje

```
<tipo>(<scope opcional>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Estructura mínima (obligatoria)

```
tipo: descripción
```

### Estructura completa

```
tipo(scope): descripción corta en imperativo

Cuerpo: explicación más detallada del cambio.
Puede ser de varias líneas.

Footer: BREAKING CHANGE: descripción del cambio que rompe compatibilidad
Closes #123
```

---

## Tipos de Commit Permitidos

Se definen **8 tipos obligatorios** para todos los semestres:

| Tipo         | Descripción                                                   | Ejemplo de Mensaje                                      |
| ------------ | ------------------------------------------------------------- | ------------------------------------------------------- |
| `feat`       | Nueva funcionalidad para el usuario                           | `feat: agregar formulario de registro de clientes`      |
| `fix`        | Corrección de un bug                                          | `fix: corregir validación de email vacío`               |
| `docs`       | Cambios en documentación (README, comentarios, JSDoc)         | `docs: actualizar instrucciones de instalación`         |
| `style`      | Cambios de formato (espacios, comas, indentación). No afecta lógica | `style: formatear código según prettier`           |
| `refactor`   | Reestructuración de código sin cambiar funcionalidad          | `refactor: extraer lógica de validación a servicio`     |
| `test`       | Agregar o modificar tests                                     | `test: agregar pruebas unitarias para ClientService`    |
| `chore`      | Tareas de mantenimiento (configs, dependencias, CI/CD)        | `chore: actualizar dependencias de Spring Boot`         |
| `perf`       | Mejora de rendimiento sin cambiar funcionalidad               | `perf: optimizar consulta de listado con paginación`    |

### Tipos adicionales permitidos (opcionales)

| Tipo         | Descripción                                                   | Ejemplo                                                 |
| ------------ | ------------------------------------------------------------- | ------------------------------------------------------- |
| `build`      | Cambios en build system o dependencias externas               | `build: agregar plugin de Docker al pom.xml`            |
| `ci`         | Cambios en CI/CD (GitHub Actions, Jenkins, etc.)              | `ci: agregar pipeline de deploy a staging`              |
| `revert`     | Revertir un commit anterior                                   | `revert: revertir "feat: agregar endpoint DELETE"`      |

---

## Reglas Obligatorias

### 1. Todo en minúsculas

```
✅ feat: agregar endpoint de login
❌ Feat: Agregar Endpoint de Login
❌ FEAT: AGREGAR ENDPOINT DE LOGIN
```

### 2. Dos puntos + espacio después del tipo

```
✅ feat: descripción
❌ feat:descripción
❌ feat :descripción
❌ feat - descripción
```

### 3. Descripción en imperativo (como una orden)

```
✅ feat: agregar validación de formulario
❌ feat: agregué validación de formulario
❌ feat: se agrega validación de formulario
❌ feat: agregando validación de formulario
```

### 4. Primera letra de la descripción en MINÚSCULA

```
✅ feat: agregar botón de eliminar
❌ feat: Agregar botón de eliminar
```

### 5. Sin punto final

```
✅ feat: agregar endpoint de clientes
❌ feat: agregar endpoint de clientes.
```

### 6. Máximo 72 caracteres en la primera línea

La primera línea (tipo + scope + descripción) no debe exceder 72 caracteres. Si se necesita más detalle, usar el cuerpo del commit.

### 7. Un commit = un cambio lógico

Cada commit debe representar UN solo cambio coherente. No combinar funcionalidades distintas en un solo commit.

```
✅ Dos commits separados:
   feat: agregar endpoint POST para clientes
   feat: agregar endpoint DELETE para clientes

❌ Un commit con todo junto:
   feat: agregar endpoints POST y DELETE para clientes y también arreglar login
```

---

## Scope (Alcance) — Opcional

El scope indica **QUÉ módulo o componente** fue afectado. Va entre paréntesis después del tipo.

```
tipo(scope): descripción
```

### Formato del scope

- **Minúsculas**
- **Sin espacios** — usar guiones si es necesario
- Nombre del módulo, entidad o componente

### Ejemplos

```
feat(users): agregar endpoint de búsqueda por email
fix(auth): corregir expiración del token JWT
refactor(enrollment): separar lógica de validación a servicio
docs(readme): agregar sección de configuración de BD
style(client-form): aplicar formato prettier al formulario
test(organizations): agregar test para creación de sede
chore(docker): actualizar versión de postgres en compose
perf(reports): agregar caché a consulta de dashboard
```

---

## Breaking Changes

Un **breaking change** es un cambio que rompe la compatibilidad hacia atrás. Se indica de dos formas:

### Opción 1: Signo de exclamación después del tipo

```
feat!: cambiar respuesta de /api/users a formato paginado
refactor(auth)!: reemplazar JWT simétrico por asimétrico
```

### Opción 2: Footer con BREAKING CHANGE

```
feat: migrar autenticación a OAuth 2.0

BREAKING CHANGE: los tokens anteriores ya no son válidos.
Los clientes deben re-autenticarse con el nuevo flujo.
```

### Versionamiento semántico

| Tipo de Cambio     | Versión que incrementa | Ejemplo       |
| ------------------ | ---------------------- | ------------- |
| `fix`              | PATCH (0.0.X)          | 1.2.3 → 1.2.4 |
| `feat`             | MINOR (0.X.0)          | 1.2.3 → 1.3.0 |
| `BREAKING CHANGE`  | MAJOR (X.0.0)          | 1.2.3 → 2.0.0 |

---

## Ejemplos por Semestre

### Semestre II — Java Swing / Flask

```bash
# Java Swing
feat: crear vista principal de clientes con JTable
feat: agregar formulario de edición de productos
fix: corregir conexión a MySQL en AccessDB
refactor: separar lógica de DAO en la clase ClientDAO
style: formatear código según convenciones de IntelliJ
docs: agregar README con instrucciones de ejecución
chore: agregar .gitignore para archivos .class
test: agregar prueba unitaria para ClientService

# Flask Web
feat: agregar blueprint de clientes con CRUD completo
feat: crear template base.html con Tailwind CDN
fix: corregir ruta de redirección después de crear cliente
refactor: mover conexión a database.py con factory pattern
style: formatear templates HTML con indentación correcta
docs: documentar endpoints en README
chore: actualizar requirements.txt con nuevas dependencias
```

### Semestre III — Spring Boot MVC + Angular

```bash
# Spring Boot
feat: agregar endpoint GET /api/clients con paginación
feat: implementar @ControllerAdvice para manejo global de errores
fix: corregir mapeo JPA en entidad Client
refactor: extraer lógica de validación de ClientService
chore: actualizar Spring Boot de 3.2.0 a 3.3.1
test: agregar tests de integración para ClientRepository
docs: agregar documentación Swagger para endpoints

# Angular
feat: crear componente client-list con tabla Bootstrap
feat: implementar guards de autenticación
fix: corregir interceptor de token expirado
refactor: mover servicios HTTP a core/services
style: aplicar reglas de TSLint al módulo de clientes
chore: actualizar Angular de 17 a 18
```

### Semestre IV — WebFlux + React + Expo

```bash
# Spring WebFlux
feat: agregar endpoint reactivo GET /api/clients con Flux
feat: implementar ReactiveCrudRepository para Oracle R2DBC
fix: corregir serialización de ObjectId en MongoDB
refactor: migrar de ResponseEntity a Mono<ResponseEntity>
perf: agregar cache reactivo con Caffeine
chore: agregar driver oracle-r2dbc al pom.xml

# React + Vite
feat: crear componente ClientList con Tailwind y Axios
feat: agregar hook useClients para gestionar estado
fix: corregir ruta protegida que no redirigía al login
refactor: mover llamadas HTTP a services/clientService.js
style: aplicar formato Prettier en todos los componentes
chore: actualizar Vite de 5 a 6

# Expo / React Native
feat: crear pantalla de lista de clientes con FlatList
feat: agregar navegación con Expo Router
fix: corregir tipos TypeScript en clientService
refactor: extraer estilos a StyleSheet.create
chore: actualizar Expo SDK de 51 a 52
test: agregar test para hook useClients
```

### Semestre V·VI — Microservicios Enterprise

```bash
# Backend microservicios
feat: implementar arquitectura hexagonal en vg-ms-users
feat: agregar RabbitMQ producer para evento USER_CREATED
feat: configurar SecurityConfig con JWT y roles RBAC
feat: agregar CircuitBreaker con Resilience4j al WebClient
fix: corregir deserialización de evento en consumer Rabbit
fix: corregir RBAC — TEACHER no debería crear usuarios
refactor: migrar de Layered a Hexagonal en servicio de users
refactor: separar ports de entrada y salida en domain
perf: agregar índice compuesto en tabla organizations
chore: agregar Flyway para migraciones SQL versionadas
chore: actualizar Docker Compose con servicio de RabbitMQ
docs: documentar ecosistema PRS en README

# Frontend enterprise
feat: implementar lazy loading en rutas con React.lazy
feat: agregar interceptor JWT en Axios con refresh token
feat: crear componente RoleRoute para protección RBAC
fix: corregir logout que no limpiaba estado del contexto
refactor: migrar guards a functional guards en Angular
style: reorganizar estructura de features por módulo
chore: agregar configuración de environments para staging
```

---

## Buenos vs Malos Commits

### ✅ BUENOS (correctos)

```
feat: agregar endpoint POST /api/clients
fix: corregir NullPointerException al buscar cliente inexistente
docs: agregar sección de instalación al README
refactor: extraer validaciones a clase ValidationUtil
style: aplicar indentación de 4 espacios en servicios
test: agregar test para método findByEmail
chore: agregar .env.example al repositorio
perf: implementar paginación en listado de clientes
feat(users): agregar búsqueda por email y estado
fix(auth): renovar token antes de expiración
```

### ❌ MALOS (incorrectos)

```
update                                    ← no tiene tipo ni descripción
arreglos varios                           ← sin tipo, vago
feat: Agregar Endpoint                    ← mayúsculas incorrectas
Fix:corregir bug                          ← falta espacio después de :
FEAT: agregar login                       ← tipo en mayúsculas
feat: se agregó validación de email       ← no es imperativo (pasado)
feat: agregar login.                      ← punto final innecesario
wip                                       ← no es un tipo válido
asdf                                      ← sin significado
fix: arreglar cosas                       ← descripción vaga e inútil
feat: agregar login y registro y dashboard y reportes  ← múltiples cambios
```

---

## Flujo de Trabajo con Git

### Antes de cada commit

1. Verificar los archivos modificados: `git status`
2. Agregar solo los archivos del cambio lógico: `git add <archivos>`
3. Escribir el mensaje siguiendo el formato: `git commit -m "tipo: descripción"`

### Ejemplo completo de un flujo

```bash
# 1. Crear rama feature
git checkout -b feat/client-crud

# 2. Desarrollar y commitear incrementalmente
git add src/service/ClientService.java
git commit -m "feat: crear servicio ClientService con método findAll"

git add src/rest/ClientRest.java
git commit -m "feat: agregar endpoint GET /api/clients"

git add src/rest/ClientRest.java
git commit -m "feat: agregar endpoint POST /api/clients"

git add src/dto/ClientDto.java
git commit -m "refactor: crear DTO para separar modelo de respuesta"

git add src/exception/
git commit -m "feat: agregar manejo global de excepciones"

# 3. Push y Pull Request
git push origin feat/client-crud
```

### Reglas de branching (recomendadas)

| Tipo de Rama            | Formato                           | Ejemplo                          |
| ----------------------- | --------------------------------- | -------------------------------- |
| Feature                 | `feat/<descripción-corta>`        | `feat/client-crud`               |
| Bugfix                  | `fix/<descripción-corta>`         | `fix/login-validation`           |
| Hotfix (producción)     | `hotfix/<descripción-corta>`      | `hotfix/null-pointer-users`      |
| Release                 | `release/<versión>`               | `release/1.2.0`                  |

---

## Validación Automatizada

### Criterios de validación que aplicará el sistema de code review

El sistema de code review automatizado (Lambda + Bedrock) evaluará los commits del repositorio del estudiante según estos criterios:

| Regla                                        | Verificación                                                  | Severidad |
| -------------------------------------------- | ------------------------------------------------------------- | --------- |
| Tipo válido                                  | `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `build`, `ci`, `revert` | ERROR |
| Formato `tipo: descripción`                  | Regex: `^(feat|fix|docs|style|refactor|test|chore|perf|build|ci|revert)(\(.+\))?(!)?: .+$` | ERROR |
| Todo en minúsculas (tipo y primer carácter)  | Sin mayúsculas en el tipo ni en el inicio de la descripción   | ERROR     |
| Descripción no vacía                         | Mínimo 10 caracteres de descripción                          | ERROR     |
| Máximo 72 caracteres en primera línea        | `len(primera_línea) <= 72`                                    | WARNING   |
| Sin punto final                              | No termina en `.`                                             | WARNING   |
| Imperativo                                   | No empieza con: "se agregó", "agregando", "agregué"          | WARNING   |
| Un cambio por commit                         | Análisis del diff — solo archivos relacionados                | INFO      |

### Regex de validación (para el engine de review)

```regex
^(feat|fix|docs|style|refactor|test|chore|perf|build|ci|revert)(\([a-z0-9\-]+\))?(!)?: [a-z].{9,70}[^.]$
```

Explicación:

- `^` — inicio
- `(feat|fix|...)` — tipo válido
- `(\([a-z0-9\-]+\))?` — scope opcional en minúsculas con guiones
- `(!)?` — breaking change opcional
- `:` — dos puntos + espacio
- `[a-z]` — primer carácter en minúscula
- `.{9,70}` — entre 9 y 70 caracteres más de descripción
- `[^.]$` — no termina en punto

---

> **Fin del documento.** Este README contiene la guía completa de Conventional Commits aplicable a todos los semestres (II al V·VI) para ser utilizado como fuente de verdad en el code review automatizado con Amazon Bedrock.
