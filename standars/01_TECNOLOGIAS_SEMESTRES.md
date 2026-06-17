# Tecnologías por Semestre — Valle Grande

> Mapa de referencia rápida. El evaluador lo usa para confirmar qué stack se espera en cada semestre y detectar desviaciones.

---

## Semestre II — A

### Stack: Java Desktop + Swing + MySQL

| Tecnología    | Versión mínima | Rol                          | ¿Obligatorio? |
| ------------- | -------------- | ---------------------------- | ------------- |
| Java          | 17+            | Lenguaje principal           | Sí            |
| Java Swing    | Incluido JDK   | Interfaz gráfica escritorio  | Sí            |
| MySQL         | 8+             | Base de datos relacional     | Sí            |
| JDBC          | Incluido JDK   | Conexión Java ↔ MySQL        | Sí            |
| IntelliJ IDEA | Cualquiera     | IDE de desarrollo            | Sí            |
| Maven/Gradle  | —              | Gestión de dependencias      | Opcional      |

**Convención de nombre del proyecto:** minúsculas (`mi-proyecto/`)

**Convención de paquete base:** `pe.edu.vallegrande.<nombre-proyecto>.<paquete>`

---

## Semestre II — B

### Stack: Python Flask + MySQL (Web)

| Tecnología    | Versión mínima | Rol                          | ¿Obligatorio? |
| ------------- | -------------- | ---------------------------- | ------------- |
| Python        | 3.x            | Lenguaje del backend         | Sí            |
| Flask         | Cualquiera     | Framework web ligero         | Sí            |
| MySQL         | 8+             | Base de datos relacional     | Sí            |
| SQLAlchemy    | Cualquiera     | ORM para MySQL               | Sí            |
| Tailwind CSS  | CDN            | Estilos (sin npm)            | Sí            |
| VS Code       | —              | Editor                       | Sí            |

**Archivos obligatorios en raíz:** `.env`, `.gitignore`, `app.py`, `requirements.txt`

---

## Semestre III

### Stack: Spring Boot 3 MVC + SQL Server + Angular 17+

#### Backend
| Tecnología       | Versión    | Rol                        | ¿Obligatorio? |
| ---------------- | ---------- | -------------------------- | ------------- |
| Java             | 17         | Lenguaje del servidor      | Sí            |
| Spring Boot 3    | 3.x        | Framework backend REST     | Sí            |
| Spring Data JPA  | Incluido   | Persistencia ORM           | Sí            |
| SQL Server       | 2019+      | Base de datos              | Sí            |
| Maven            | 3.x        | Gestión de dependencias    | Sí            |
| Lombok           | Cualquiera | Reducir boilerplate        | Sí            |
| IntelliJ IDEA    | —          | IDE                        | Sí            |

**Dependencias Spring Initializr obligatorias:** Spring Web, Spring Data JPA, MS SQL Server Driver, Lombok, Spring Boot DevTools

**Metadatos Spring Initializr:**
- Group: `pe.edu.vallegrande`
- Java: `17`
- Packaging: `Jar`

#### Frontend
| Tecnología    | Versión | Rol                    | ¿Obligatorio? |
| ------------- | ------- | ---------------------- | ------------- |
| Angular       | 17+     | Framework SPA          | Sí            |
| TypeScript    | 5       | Lenguaje tipado        | Sí            |
| Bootstrap 5   | 5.x     | Estilos y componentes  | Sí            |
| Node.js       | 20+     | Entorno de ejecución   | Sí            |
| Angular CLI   | —       | Scaffolding            | Sí            |

---

## Semestre IV — A

### Stack: Spring WebFlux + Oracle R2DBC ó MongoDB + React 19 + Vite

#### Backend
| Tecnología             | Versión | Rol                       | ¿Obligatorio? |
| ---------------------- | ------- | ------------------------- | ------------- |
| Java                   | 17      | Lenguaje del servidor     | Sí            |
| Spring WebFlux 3       | 3.x     | Framework reactivo        | Sí            |
| Spring Data R2DBC      | Incluido| Persistencia reactiva SQL | Si Oracle     |
| Oracle R2DBC ó MongoDB | —       | Base de datos             | Sí (una)      |
| Lombok                 | —       | Reducir boilerplate       | Sí            |
| Maven                  | 3.x     | Dependencias              | Sí            |

> **Prohibición:** No usar `spring-boot-starter-web` ni `spring-boot-starter-data-jpa`. Solo WebFlux.

#### Frontend
| Tecnología    | Versión | Rol                         | ¿Obligatorio? |
| ------------- | ------- | --------------------------- | ------------- |
| React         | 19      | Librería de componentes     | Sí            |
| Vite          | 6+      | Bundler y dev server        | Sí            |
| Tailwind CSS  | npm     | Framework CSS               | Sí            |
| Axios         | —       | Cliente HTTP                | Sí            |
| React Router  | 7       | Enrutamiento SPA            | Sí            |
| JavaScript    | ES6+    | Lenguaje (sin TypeScript)   | Sí            |

> **Importante:** En semestre IV frontend web NO se usa TypeScript. Solo `.jsx` y `.js`.

---

## Semestre IV — B

### Stack: Python Flask + SQLite (Backend para React)

| Tecnología   | Versión | Rol                           | ¿Obligatorio? |
| ------------ | ------- | ----------------------------- | ------------- |
| Python       | 3.12    | Lenguaje backend              | Sí            |
| Flask        | —       | Micro-framework REST          | Sí            |
| SQLite       | Incluido| Base de datos local           | Sí            |
| Flask-CORS   | —       | Habilitar CORS para React     | Sí            |
| python-dotenv| —       | Variables de entorno          | Sí            |

**Convención de nombre:** `vg-ms-{nombre}-be/`

---

## Semestre IV — C

### Stack: Expo / React Native + TypeScript

| Tecnología       | Versión | Rol                          | ¿Obligatorio? |
| ---------------- | ------- | ---------------------------- | ------------- |
| React Native     | 0.76+   | Framework apps móviles       | Sí            |
| Expo SDK         | 52+     | Plataforma RN                | Sí            |
| TypeScript       | 5       | Lenguaje tipado              | Sí            |
| Expo Router      | —       | Enrutamiento file-based      | Sí            |
| NativeWind       | v4      | Tailwind para React Native   | Sí            |
| Axios            | —       | Cliente HTTP                 | Sí            |
| AsyncStorage     | —       | Almacenamiento local         | Sí            |
| React Hook Form  | —       | Formularios tipados          | Sí            |

> **Importante:** En móvil SÍ se usa TypeScript con `strict: true`, a diferencia de React web en sem IV.

---

## Semestre V·VI

### Stack: Microservicios Enterprise

#### Backend
| Tecnología       | Versión | Rol                                | ¿Obligatorio? |
| ---------------- | ------- | ---------------------------------- | ------------- |
| Java             | 21      | Lenguaje del servidor              | Sí            |
| Spring WebFlux 3 | 3.x     | Framework reactivo no-bloqueante   | Sí            |
| PostgreSQL R2DBC | —       | BD relacional reactiva (default)   | Sí            |
| Project Reactor  | —       | Mono<T> / Flux<T>                  | Sí            |
| Spring Security  | —       | Autenticación y autorización JWT   | Sí            |
| RabbitMQ ó Kafka | —       | Mensajería asíncrona               | Sí            |
| Resilience4j     | —       | CircuitBreaker + Retry             | Recomendado   |
| Flyway           | —       | Migraciones SQL versionadas        | Sí            |
| Lombok           | —       | Reducir boilerplate                | Sí            |
| Maven            | 3.x     | Dependencias                       | Sí            |
| Docker           | —       | Contenedores                       | Sí            |

#### Frontend
| Tecnología              | Versión | Rol                            | ¿Obligatorio? |
| ----------------------- | ------- | ------------------------------ | ------------- |
| Angular 17+ **ó** React | 17+ / 19| Framework SPA enterprise       | Sí (uno)      |
| TypeScript              | 5       | Lenguaje tipado strict mode    | Sí            |
| Axios (React) ó HttpClient (Angular) | — | Cliente HTTP          | Sí            |
| Zustand (React)         | —       | Estado global                  | Si React      |
| React Hook Form + Zod   | —       | Formularios validados          | Si React      |
| CSS Framework libre     | —       | Tailwind, Bootstrap, PrimeNG, shadcn/ui | Sí    |

---

## Tabla Comparativa Rápida de Detección

| Archivo encontrado                     | Indicador de                              |
| -------------------------------------- | ----------------------------------------- |
| `AccessDB.java` + `import java.sql.*`  | Java Swing Sem II                         |
| `application.properties` (no .yaml)   | Violación — debería ser `.yaml` desde Sem III |
| `spring-boot-starter-web` en pom.xml  | Spring MVC (Sem III)                      |
| `spring-boot-starter-webflux`          | WebFlux (Sem IV o V·VI)                   |
| `r2dbc-postgresql` en pom.xml          | Spring WebFlux + PostgreSQL (V·VI)        |
| `oracle-r2dbc` en pom.xml             | Spring WebFlux + Oracle (Sem IV)          |
| `spring-data-mongodb-reactive`         | WebFlux + MongoDB                         |
| `@Entity` + `@Table` en WebFlux       | ERROR — no mezclar JPA con WebFlux        |
| `requirements.txt` sin `flask`        | ERROR — backend Python sin framework      |
| `.jsx` y `.js` en src/               | React Sem IV (sin TypeScript)             |
| `.tsx` y `.ts` en src/               | React Sem V·VI (con TypeScript)           |
| `app/` carpeta con `_layout.tsx`      | Expo Router (Sem IV)                      |
