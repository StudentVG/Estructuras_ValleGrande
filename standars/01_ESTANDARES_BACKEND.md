# 📘 Estándares Backend — Valle Grande

> Documento de referencia para **code review automatizado**. Contiene TODOS los estándares backend definidos por semestre (II al V·VI).

---

## Índice

1. [Semestre II — Java Desktop (Swing + MySQL)](#semestre-ii--java-desktop-swing--mysql)
2. [Semestre II — Python Flask (Web + MySQL)](#semestre-ii--python-flask-web--mysql)
3. [Semestre III — Spring Boot 3 MVC + JPA (SQL Server)](#semestre-iii--spring-boot-3-mvc--jpa-sql-server)
4. [Semestre IV — Spring WebFlux Reactivo (Oracle / MongoDB)](#semestre-iv--spring-webflux-reactivo-oracle--mongodb)
5. [Semestre IV — Python Flask + SQLite (Backend para React)](#semestre-iv--python-flask--sqlite-backend-para-react)
6. [Semestre V·VI — Microservicios Enterprise](#semestre-vvi--microservicios-enterprise)
   - [Patrones de Diseño (Layered, Hexagonal, CQRS)](#patrones-de-diseño)
   - [Comunicación entre Microservicios](#comunicación-entre-microservicios)
   - [Bases de Datos](#bases-de-datos)
   - [Seguridad y RBAC](#seguridad-y-rbac)
   - [Ecosistema de Microservicios PRS](#ecosistema-de-microservicios-prs)
   - [Paquetes Backend por Patrón](#paquetes-backend-por-patrón)
   - [Despliegue: Orquestación vs Coreografía](#despliegue-orquestación-vs-coreografía)

---

---

# Semestre II — Java Desktop (Swing + MySQL)

## Stack Tecnológico

| Tecnología     | Rol                              |
| -------------- | -------------------------------- |
| Java 17+       | Lenguaje principal               |
| Java Swing     | Interfaces gráficas de escritorio |
| MySQL          | Base de datos relacional         |
| JDBC           | Conexión Java → MySQL            |
| IntelliJ IDEA  | IDE de desarrollo                |

## Artifact Base Obligatorio

```
pe.edu.vallegrande.<nombre-proyecto>.<paquete>
```

El nombre del proyecto en **minúsculas** (`mi-proyecto/`).

## Paquetes Estándar (10 paquetes)

| Paquete     | Descripción                                 | Sufijo de Clase       | Ejemplo                         |
| ----------- | ------------------------------------------- | --------------------- | ------------------------------- |
| `view`      | Interfaces gráficas Swing                   | **View**              | `ClientCrudView`, `ClientEditView` |
| `controller`| Lógica de eventos de la UI                  | **Controller**        | `ClientCrudController`          |
| `service`   | Lógica de negocio                           | **Service**           | `ClientCrudService`             |
| `dto`       | Objetos de transferencia de datos           | **Dto**               | `ClientDto`                     |
| `model`     | Clases de dominio (entidades)               | *(sin sufijo)*        | `Client`, `Producto`            |
| `dao`       | Persistencia y consultas SQL                | **DAO**               | `ClientDAO`                     |
| `db`        | Clase de conexión a la BD                   | **AccessDB.java**     | `AccessDB`                      |
| `util`      | Clases utilitarias del proyecto             | *(libre)*             | `DateUtil`, `Validator`         |
| `exception` | Excepciones personalizadas                  | *(libre)*             | `NegocioException`              |
| `prueba`    | Casos de prueba unitaria                    | *(libre)*             | `ClientServiceTest`             |

## Estructura de Directorios

```
mi-proyecto/                            ← nombre del proyecto en minúsculas
└── src/
    └── pe/
        └── edu/
            └── vallegrande/
                └── miproyecto/
                    ├── view/
                    │   ├── ClientCrudView.java
                    │   └── ClientEditView.java
                    ├── controller/
                    │   └── ClientCrudController.java
                    ├── service/
                    │   └── ClientCrudService.java
                    ├── dto/
                    │   └── ClientDto.java
                    ├── model/
                    │   └── Client.java
                    ├── dao/
                    │   └── ClientDAO.java
                    ├── db/
                    │   └── AccessDB.java
                    ├── util/
                    └── exception/
```

## Flujo Arquitectónico

```
View → Controller → Service → DAO → MySQL
```

Propagación de errores: `throw new RuntimeException("msg")` desde Service/DAO hacia Controller.

---

---

# Semestre II — Python Flask (Web + MySQL)

## Stack Tecnológico

| Tecnología     | Rol                              |
| -------------- | -------------------------------- |
| Python 3       | Lenguaje del backend             |
| Flask          | Framework web ligero             |
| MySQL          | Base de datos relacional         |
| SQLAlchemy     | ORM para conexión con MySQL      |
| VS Code        | Editor de código                 |

## Estructura de Directorios

```
mi-proyecto/
├── app/                        ← paquete principal
│   ├── __init__.py             ← create_app() — factory function
│   ├── config.py               ← configuración por entorno
│   ├── database.py             ← conexión MySQL / SQLAlchemy
│   ├── models/                 ← clases ORM (tablas)
│   │   ├── __init__.py
│   │   └── cliente.py
│   ├── routes/                 ← blueprints por módulo
│   │   ├── __init__.py
│   │   └── clientes.py
│   ├── services/               ← lógica de negocio
│   │   └── cliente_service.py
│   ├── static/
│   │   ├── css/
│   │   ├── js/
│   │   │   └── main.js
│   │   └── img/
│   └── templates/
│       ├── base.html           ← incluye CDN de Tailwind
│       └── clientes/
│           ├── index.html
│           └── form.html
├── .env                        ← variables de entorno (no subir a Git)
├── .gitignore
├── app.py                      ← punto de entrada
└── requirements.txt
```

## Reglas Obligatorias

- `__init__.py` debe contener la función `create_app()` (factory pattern).
- La configuración va en `config.py`, separada por entorno.
- La conexión BD va en `database.py`.
- Tailwind CSS se integra vía CDN en `base.html`, **sin npm**.
- `base.html` debe usar bloques Jinja: `{% block title %}` y `{% block content %}`.
- Archivos obligatorios en la raíz: `.env`, `.gitignore`, `app.py`, `requirements.txt`.

## Template Base (base.html)

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>{% block title %}Mi Proyecto{% endblock %}</title>
</head>
<body class="bg-gray-100">
  {% block content %}{% endblock %}
</body>
</html>
```

---

---

# Semestre III — Spring Boot 3 MVC + JPA (SQL Server)

## Stack Tecnológico

| Tecnología        | Rol                              |
| ----------------- | -------------------------------- |
| Java 17           | Lenguaje del servidor            |
| Spring Boot 3     | Framework backend REST           |
| Spring Data JPA   | Capa de persistencia ORM         |
| SQL Server        | Base de datos relacional         |
| Maven             | Gestión de dependencias          |
| Lombok            | Reduce código boilerplate        |
| IntelliJ IDEA     | IDE oficial del ciclo            |

## Metadatos del Proyecto (Spring Initializr)

| Campo       | Valor                            |
| ----------- | -------------------------------- |
| Group       | `pe.edu.vallegrande`             |
| Java        | `17`                             |
| Packaging   | `Jar`                            |

## Dependencias obligatorias (Spring Initializr)

1. Spring Web
2. Spring Data JPA
3. MS SQL Server Driver
4. Lombok
5. Spring Boot DevTools

## Paquetes Estándar (8 paquetes)

| Paquete      | Descripción                                                   | Sufijo         | Ejemplo                                  |
| ------------ | ------------------------------------------------------------- | -------------- | ---------------------------------------- |
| `controller` | Endpoints REST. Recibe peticiones HTTP y delega al service.   | **Controller** | `ClientController`, `ProductController`  |
| `service`    | Lógica de negocio. Anota con @Service.                       | **Service**    | `ClientService`, `ProductService`        |
| `repository` | Acceso a datos. Extiende `JpaRepository` o `CrudRepository`. | **Repository** | `ClientRepository`                       |
| `model`      | Entidades JPA. Mapea cada tabla con `@Entity`.               | *(sin sufijo)* | `Client`, `Product`                      |
| `dto`        | Objetos de transferencia. Separa entidad de request/response. | **Dto** o **Request/Response** | `ClientDto`, `ClientRequest` |
| `exception`  | Manejo global con `@ControllerAdvice` + excepciones custom.  | *(libre)*      | `GlobalExceptionHandler`, `ResourceNotFoundException` |
| `config`     | Configuraciones Spring (`@Configuration`). CORS, Security.   | **Config**     | `CorsConfig`, `SecurityConfig`           |
| `util`       | Clases utilitarias sin estado. Constantes, validadores.      | *(libre)*      | `DateUtil`, `Constants`                  |

## Estructura de Directorios

```
mi-proyecto/                            ← nombre en kebab-case con prefijo vg-ms-{}
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── pe/edu/vallegrande/vg-ms-{}/
│   │   │       ├── config/
│   │   │       │   └── CorsConfig.java
│   │   │       ├── rest/
│   │   │       │   └── ClientRest.java
│   │   │       ├── service/
│   │   │       │   └── ClientService.java
│   │   │       ├── repository/
│   │   │       │   └── ClientRepository.java
│   │   │       ├── model/
│   │   │       │   └── Client.java
│   │   │       ├── dto/
│   │   │       │   └── ClientDto.java
│   │   │       ├── exception/
│   │   │       │   └── GlobalExceptionHandler.java
│   │   │       └── VGMS{}Application.java
│   │   └── resources/
│   │       ├── application.yaml            ← SQL Server connection
│   │       └── static/
│   └── test/
└── pom.xml
```

## Configuración application.yaml

```yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=mi_db;encrypt=false
    username: sa
    password: TuPassword123
    driver-class-name: com.microsoft.sqlserver.jdbc.SQLServerDriver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.SQLServerDialect

server:
  port: 8080
```

## Flujo REST Arquitectónico

```
Angular (Frontend) → HTTP → @RestController Controller → @Service Service → Repository (JpaRepository) → SQL Server
```

### Reglas de Validación

- Usar `application.yaml` (NO `.properties`).
- Driver de SQL Server: `com.microsoft.sqlserver.jdbc.SQLServerDriver`.
- Group ID: `pe.edu.vallegrande`.
- Nombre de proyecto en kebab-case.
- Paquete base: `pe.edu.vallegrande.*`.

---

---

# Semestre IV — Spring WebFlux Reactivo (Oracle / MongoDB)

## Paradigma

Programación **reactiva no-bloqueante** con `Mono<T>` / `Flux<T>` (Project Reactor).

- Dependencia base: `spring-boot-starter-webflux` (**NO** `spring-boot-starter-web`).
- Retorno en service: `Mono<T>` / `Flux<T>` (**NO** `T` / `List<T>`).
- Retorno en controller: `Mono<ResponseEntity<T>>` (**NO** `ResponseEntity<T>`).

## Stack — Variante Oracle R2DBC

| Tecnología            | Rol                                     |
| --------------------- | --------------------------------------- |
| Java 17               | Lenguaje del servidor                   |
| Spring WebFlux 3      | Framework reactivo no-bloqueante        |
| Project Reactor       | Mono<T> / Flux<T> para streams          |
| Spring Data R2DBC     | Persistencia reactiva SQL               |
| Oracle R2DBC          | Driver reactivo para Oracle DB          |
| Lombok                | Reduce código boilerplate               |
| Maven                 | Gestión de dependencias                 |

### Dependencias Initializr (Oracle)

1. Spring Reactive Web
2. Spring Data R2DBC
3. Oracle R2DBC Driver
4. Lombok
5. Spring Boot DevTools

## Stack — Variante MongoDB

| Tecnología                    | Rol                                     |
| ----------------------------- | --------------------------------------- |
| Java 17                       | Lenguaje del servidor                   |
| Spring WebFlux 3              | Framework reactivo no-bloqueante        |
| Project Reactor               | Mono<T> / Flux<T>                       |
| Spring Data Reactive MongoDB  | Persistencia reactiva NoSQL             |
| MongoDB 7                     | BD NoSQL orientada a documentos         |
| Lombok                        | Reduce código boilerplate               |
| Maven                         | Gestión de dependencias                 |

### Dependencias Initializr (MongoDB)

1. Spring Reactive Web
2. Spring Data Reactive MongoDB
3. Lombok
4. Spring Boot DevTools

## Tabla de Migración MVC → WebFlux

| Concepto           | MVC (Sem III)                   | WebFlux Oracle                                   | WebFlux MongoDB                                        |
| ------------------ | ------------------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| Dependencia base   | spring-boot-starter-web         | spring-boot-starter-webflux                      | spring-boot-starter-webflux                            |
| Persistencia       | Spring Data JPA                 | Spring Data R2DBC + oracle-r2dbc                 | Spring Data Reactive MongoDB                           |
| Driver BD          | ojdbc11 (JDBC)                  | com.oracle.database.r2dbc:oracle-r2dbc           | Incluido en spring-boot-starter-data-mongodb-reactive  |
| Entidad            | @Entity + @Id (javax)           | @Table + @Id (Spring Data)                       | @Document("col") + @Id                                 |
| Repositorio        | JpaRepository<T, ID>            | ReactiveCrudRepository<T, Long>                  | ReactiveMongoRepository<T, ObjectId>                   |
| Retorno service    | T / List<T>                     | Mono<T> / Flux<T>                                | Mono<T> / Flux<T>                                      |
| Retorno controller | ResponseEntity<T>               | Mono<ResponseEntity<T>>                          | Mono<ResponseEntity<T>>                                |
| Clase controller   | sufijo Controller               | @RestController + sufijo **Rest**                | @RestController + sufijo **Rest**                      |
| Config BD          | spring.datasource.url           | spring.r2dbc.url (application.yaml)              | spring.data.mongodb.uri (application.yaml)             |

## Paquetes Estándar WebFlux (7 paquetes)

| Paquete      | Descripción                                                          | Ejemplo                         |
| ------------ | -------------------------------------------------------------------- | ------------------------------- |
| `rest`       | Endpoints reactivos. Retorna `Mono<ResponseEntity<T>>`. Sufijo **Rest**. | `ClientRest`, `ProductRest` |
| `service`    | Lógica reactiva. `Mono<T>` / `Flux<T>`. Interfaz + `impl/`.         | `ClientService` + `ClientServiceImpl` |
| `repository` | `ReactiveCrudRepository` (Oracle) o `ReactiveMongoRepository` (MongoDB). | `ClientRepository`          |
| `model`      | Oracle: `@Table + @Id` — MongoDB: `@Document + @Id`. **Nunca @Entity**. | `Client`, `Product`         |
| `dto`        | Request/Response separados de la entidad.                            | `ClientDto`, `ClientRequest`    |
| `exception`  | `@ControllerAdvice` + excepciones personalizadas.                    | `GlobalExceptionHandler`        |
| `config`     | CORS, Security, Beans de configuración `@Configuration`.             | `CorsConfig`, `SecurityConfig`  |

## Estructura — Oracle R2DBC

```
vg-ms-{nombre}/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── pe/edu/vallegrande/vg_ms_{}/
│   │   │       ├── config/
│   │   │       │   └── CorsConfig.java
│   │   │       ├── rest/                          ← sufijo Rest (no Controller)
│   │   │       │   └── ClientRest.java
│   │   │       ├── service/
│   │   │       │   ├── ClientService.java         ← interfaz del servicio
│   │   │       │   └── impl/
│   │   │       │       └── ClientServiceImpl.java ← implementación
│   │   │       ├── repository/
│   │   │       │   └── ClientRepository.java      ← ReactiveCrudRepository
│   │   │       ├── model/
│   │   │       │   └── Client.java                ← @Table, Long id, no @Entity
│   │   │       ├── dto/
│   │   │       │   └── ClientDto.java
│   │   │       ├── exception/
│   │   │       │   └── GlobalExceptionHandler.java
│   │   │       └── VGMSApplication.java
│   │   └── resources/
│   │       └── application.yaml                   ← spring.r2dbc, no datasource
│   └── test/
└── pom.xml
```

## Estructura — MongoDB

```
vg-ms-{nombre}/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── pe/edu/vallegrande/vg_ms_{}/
│   │   │       ├── config/
│   │   │       │   └── CorsConfig.java
│   │   │       ├── rest/                          ← sufijo Rest (no Controller)
│   │   │       │   └── ClientRest.java
│   │   │       ├── service/
│   │   │       │   ├── ClientService.java         ← interfaz del servicio
│   │   │       │   └── impl/
│   │   │       │       └── ClientServiceImpl.java ← implementación
│   │   │       ├── repository/
│   │   │       │   └── ClientRepository.java      ← ReactiveMongoRepository
│   │   │       ├── model/
│   │   │       │   └── Client.java                ← @Document, ObjectId, no @Entity
│   │   │       ├── dto/
│   │   │       │   └── ClientDto.java
│   │   │       ├── exception/
│   │   │       │   └── GlobalExceptionHandler.java
│   │   │       └── VGMSApplication.java
│   │   └── resources/
│   │       └── application.yaml                   ← spring.data.mongodb.uri
│   └── test/
└── pom.xml
```

## Configuración YAML — Oracle

```yaml
spring:
  r2dbc:
    url: r2dbc:oracle://localhost:1521/XEPDB1
    username: system
    password: TuPassword123
  sql:
    init:
      mode: always

server:
  port: 8080
```

## Configuración YAML — MongoDB

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/vg_nombre_db
      auto-index-creation: true

server:
  port: 8080
```

## Código de Referencia — Oracle

```java
// model/Client.java
@Table("clients")
public class Client {
    @Id
    private Long id;
    private String name;
    private String email;
}

// repository/ClientRepository.java
public interface ClientRepository
        extends ReactiveCrudRepository<Client, Long> {}

// service/ClientService.java  ← interfaz
public interface ClientService {
    Flux<Client> findAll();
    Mono<Client> findById(Long id);
    Mono<Client> save(Client c);
    Mono<Void>   delete(Long id);
}

// service/impl/ClientServiceImpl.java  ← implementación
@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final ClientRepository repo;

    @Override public Flux<Client> findAll()          { return repo.findAll(); }
    @Override public Mono<Client> findById(Long id)  { return repo.findById(id); }
    @Override public Mono<Client> save(Client c)     { return repo.save(c); }
    @Override public Mono<Void>   delete(Long id)    { return repo.deleteById(id); }
}

// rest/ClientRest.java
@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientRest {
    private final ClientService svc;

    @GetMapping             public Flux<Client> all()                               { return svc.findAll(); }
    @GetMapping("/{id}")    public Mono<Client> one(@PathVariable Long id)          { return svc.findById(id); }
    @PostMapping            public Mono<Client> create(@RequestBody Client c)       { return svc.save(c); }
    @DeleteMapping("/{id}") public Mono<Void>   delete(@PathVariable Long id)       { return svc.delete(id); }
}
```

## Código de Referencia — MongoDB

```java
// model/Client.java
@Document("clients")
public class Client {
    @Id
    private ObjectId id;
    private String name;
    private String email;
}

// repository/ClientRepository.java
public interface ClientRepository
        extends ReactiveMongoRepository<Client, ObjectId> {}

// service/ClientService.java  ← interfaz
public interface ClientService {
    Flux<Client> findAll();
    Mono<Client> findById(ObjectId id);
    Mono<Client> save(Client c);
    Mono<Void>   delete(ObjectId id);
}

// service/impl/ClientServiceImpl.java  ← implementación
@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final ClientRepository repo;

    @Override public Flux<Client> findAll()                { return repo.findAll(); }
    @Override public Mono<Client> findById(ObjectId id)    { return repo.findById(id); }
    @Override public Mono<Client> save(Client c)           { return repo.save(c); }
    @Override public Mono<Void>   delete(ObjectId id)      { return repo.deleteById(id); }
}

// rest/ClientRest.java
@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientRest {
    private final ClientService svc;

    @GetMapping             public Flux<Client> all()                                          { return svc.findAll(); }
    @GetMapping("/{id}")    public Mono<Client> one(@PathVariable String id)                   { return svc.findById(new ObjectId(id)); }
    @PostMapping            public Mono<Client> create(@RequestBody Client c)                  { return svc.save(c); }
    @DeleteMapping("/{id}") public Mono<Void>   delete(@PathVariable String id)                { return svc.delete(new ObjectId(id)); }
}
```

---

---

# Semestre IV — Python Flask + SQLite (Backend para React)

## Stack Tecnológico

| Tecnología     | Rol                                                   |
| -------------- | ----------------------------------------------------- |
| Python 3.12    | Lenguaje del backend del proyecto                     |
| Flask          | Micro-framework REST ligero                           |
| SQLite         | Base de datos local — database.db en la raíz          |
| Flask-CORS     | Habilita CORS para que React consuma la API           |
| python-dotenv  | Carga variables de entorno desde .env                 |

## Estructura de Directorios

```
vg-ms-{nombre}-be/
├── app/
│   ├── models/
│   │   ├── __init__.py        ← Permite tratar el directorio como módulo
│   │   └── {entidad}.py       ← Modelo de datos
│   ├── routes/
│   │   ├── __init__.py        ← Inicialización del módulo de rutas
│   │   └── {entidad}_routes.py ← Endpoints relacionados con la entidad
│   ├── services/
│   │   ├── __init__.py        ← Inicialización del módulo de servicios
│   │   └── {entidad}_service.py ← Lógica y operaciones
│   ├── __init__.py            ← Inicialización de la aplicación Flask
│   └── settings.py            ← Configuración (DB, variables de entorno)
├── venv/                      ← Entorno virtual de Python (no subir a git)
├── .env                       ← Variables de entorno (claves, URL DB)
├── database.db                ← Base de datos SQLite
├── README.md
├── requirements.txt           ← pip freeze > requirements.txt
└── run.py                     ← Punto de entrada: python run.py
```

## Reglas Obligatorias

- Nombre del proyecto: `vg-ms-{nombre}-be/`.
- Cada módulo (`models/`, `routes/`, `services/`) debe tener `__init__.py`.
- Archivos de ruta: `{entidad}_routes.py` con `Blueprint`.
- Archivos de servicio: `{entidad}_service.py`.
- Punto de entrada: `run.py`.
- Base de datos: `database.db` en raíz.
- Dependencias en `requirements.txt` generado con `pip freeze`.
- Entorno virtual en `venv/` — **no subir a Git**.
- Variables de entorno en `.env`.

## Código de Referencia

```python
# app/settings.py
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE = os.path.join(os.path.dirname(__file__), '..', 'database.db')

# app/services/{entidad}_service.py
import sqlite3
from app import settings

def get_all():
    conn = sqlite3.connect(settings.DATABASE)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM clients").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def create(data):
    conn = sqlite3.connect(settings.DATABASE)
    conn.execute("INSERT INTO clients (name, email) VALUES (?, ?)",
                 (data["name"], data["email"]))
    conn.commit()
    conn.close()

# app/routes/{entidad}_routes.py
from flask import Blueprint, request, jsonify
from app.services import client_service

bp = Blueprint("clients", __name__)

@bp.route("/clients", methods=["GET"])
def list_clients():
    return jsonify(client_service.get_all())

@bp.route("/clients", methods=["POST"])
def add_client():
    client_service.create(request.json)
    return jsonify({"ok": True}), 201

# run.py
from app import app as application

if __name__ == "__main__":
    application.run(debug=True)
```

---

---

# Semestre V·VI — Microservicios Enterprise

## Stack Base

| Tecnología          | Rol                                            |
| ------------------- | ---------------------------------------------- |
| Java 21             | Lenguaje del servidor                          |
| Spring WebFlux 3    | Framework reactivo no-bloqueante               |
| PostgreSQL R2DBC    | BD relacional reactiva (por defecto)           |
| Project Reactor     | Mono<T> / Flux<T>                              |
| Spring Security     | Autenticación y autorización (JWT)             |
| RabbitMQ            | Broker de mensajería asíncrona                 |
| Resilience4j        | CircuitBreaker + Retry + TimeLimiter           |
| Flyway              | Migraciones SQL versionadas                    |
| Lombok              | Reduce código boilerplate                      |
| Maven               | Gestión de dependencias                        |
| Docker              | Contenedores para cada microservicio           |

---

## Patrones de Diseño

### 1. Arquitectura Hexagonal (Ports & Adapters)

**Principio:** Desacopla la lógica de negocio del mundo exterior (DB, HTTP, mensajería). El dominio NO conoce Spring, ni la BD, ni el framework.

**Capas:**

| Capa              | Responsabilidad                                                   |
| ----------------- | ----------------------------------------------------------------- |
| `domain/`         | Entidades de negocio, reglas puras, interfaces (ports)            |
| `application/`    | Casos de uso — orquesta el dominio, NO accede a infra directamente |
| `infrastructure/` | Adaptadores: REST controllers, repos JPA/R2DBC, Kafka producers  |

**Cuándo usar:** Microservicio mediano-grande con lógica de negocio rica. Ideal para el sistema multi-organización si una entidad (org, user) tiene reglas complejas.

**Estructura:**

```
vg-ms-users/
├── src/main/java/pe/edu/vallegrande/users/
│   ├── domain/
│   │   ├── model/
│   │   │   └── User.java              ← POJO puro, sin @Table ni @Entity
│   │   ├── port/
│   │   │   ├── in/
│   │   │   │   └── UserUseCase.java    ← interfaz de entrada
│   │   │   └── out/
│   │   │       └── UserRepository.java ← interfaz de salida
│   │   └── exception/
│   │       └── UserNotFoundException.java
│   ├── application/
│   │   └── service/
│   │       └── UserService.java        ← implementa UserUseCase, usa ports
│   └── infrastructure/
│       ├── adapter/
│       │   ├── in/
│       │   │   └── rest/
│       │   │       └── UserRest.java   ← @RestController
│       │   └── out/
│       │       └── persistence/
│       │           ├── UserEntity.java  ← @Table/@Document (aquí sí va la anotación)
│       │           ├── UserR2dbcRepo.java
│       │           └── UserPersistenceAdapter.java ← implementa UserRepository port
│       └── config/
│           └── CorsConfig.java
```

**Regla importante del Domain:**

- Los modelos en `domain/models/` son POJOs puros (con `@Builder`, `@Getter` de Lombok está bien) pero **NUNCA** `@Table`, `@Entity`, `@Document`.
- Las anotaciones de persistencia van **solo** en `infrastructure/persistence/entities/`.

### 2. MVC por Capas (Layered)

**Principio:** Controller → Service → Repository. Para microservicios CRUD sin lógica compleja.

**Capas:**

| Capa              | Responsabilidad                                                      |
| ----------------- | -------------------------------------------------------------------- |
| `rest/`           | Endpoints HTTP. Sufijo **Rest** en WebFlux.                          |
| `service/ + impl/`| Interfaz + implementación. Lógica de negocio.                        |
| `repository/`     | `ReactiveCrudRepository` o `ReactiveMongoRepository`.                |
| `model/`          | `@Table` (R2DBC) o `@Document` (MongoDB).                           |

**Cuándo usar:** Microservicio pequeño-mediano, CRUD directo. La mayoría del proyecto PRS.

**Estructura:**

```
vg-ms-users/
├── src/main/java/pe/edu/vallegrande/users/
│   ├── config/
│   │   └── CorsConfig.java
│   ├── rest/
│   │   └── UserRest.java               ← @RestController
│   ├── service/
│   │   ├── UserService.java            ← interfaz
│   │   └── impl/
│   │       └── UserServiceImpl.java    ← @Service
│   ├── repository/
│   │   └── UserRepository.java
│   ├── model/
│   │   └── User.java                   ← @Table o @Document
│   ├── dto/
│   │   └── UserDto.java
│   ├── exception/
│   │   └── GlobalExceptionHandler.java
│   └── VgMsUsersApplication.java
```

### 3. CQRS (Command Query Responsibility Segregation)

**Principio:** Separa lectura (Query) de escritura (Command). Cada lado puede tener su propio modelo y BD.

**Capas:**

| Capa        | Responsabilidad                                                         |
| ----------- | ----------------------------------------------------------------------- |
| `command/`  | Handlers de escritura: create, update, delete. Emiten eventos.          |
| `query/`    | Handlers de lectura: findAll, findById. Vista optimizada.               |
| `event/`    | Eventos de dominio que sincronizan lectura con escritura.               |

**Cuándo usar:** Lectura y escritura con requisitos muy diferentes. Avanzado — evaluar si la complejidad se justifica.

**Estructura:**

```
vg-ms-users/
├── src/main/java/pe/edu/vallegrande/users/
│   ├── command/
│   │   ├── handler/
│   │   │   └── CreateUserHandler.java
│   │   └── model/
│   │       └── CreateUserCommand.java
│   ├── query/
│   │   ├── handler/
│   │   │   └── GetUserHandler.java
│   │   └── model/
│   │       └── UserView.java
│   ├── event/
│   │   └── UserCreatedEvent.java
│   ├── shared/
│   │   ├── model/User.java
│   │   └── repository/UserRepository.java
│   └── infrastructure/
│       ├── rest/UserRest.java
│       └── config/CorsConfig.java
```

### Comparativa de Patrones

| Criterio              | Layered       | Hexagonal                  | CQRS                          |
| --------------------- | ------------- | -------------------------- | ----------------------------- |
| Complejidad           | ⭐            | ⭐⭐⭐                     | ⭐⭐⭐⭐                      |
| Desacoplamiento       | Bajo          | Alto                       | Muy alto                      |
| Testabilidad          | Media         | Alta (dominio puro)        | Alta                          |
| Curva de aprendizaje  | Baja          | Media-Alta                 | Alta                          |
| Ideal para            | CRUD simple   | Lógica de negocio rica     | Lectura/escritura muy distintas |
| Cantidad de archivos  | Pocos         | Muchos (ports, adapters)   | Muchos (commands, queries)    |
| Recomendado PRS       | ✅ Servicios CRUD | ✅ Servicio core (users, orgs) | ⚠ Solo si se justifica    |

---

## Comunicación entre Microservicios

### Síncrona (HTTP/REST)

- **WebClient** — Cliente HTTP reactivo de Spring WebFlux, reemplaza RestTemplate.
- **OpenFeign** — Cliente declarativo con interfaces.

**Ventajas:** Fácil de implementar, respuesta inmediata, trazabilidad directa.
**Desventajas:** Acoplamiento temporal, mayor latencia en cadenas, no escala bien.

```java
@Service @RequiredArgsConstructor
public class OrgServiceClient {
    private final WebClient.Builder webClientBuilder;
    public Mono<OrgDto> getOrg(String orgId) {
        return webClientBuilder.build()
            .get()
            .uri("http://vg-ms-orgs/api/orgs/{id}", orgId)
            .retrieve()
            .bodyToMono(OrgDto.class);
    }
}
```

### Asíncrona (Eventos/Mensajería)

- **Apache Kafka** — Broker distribuido, alta throughput.
- **RabbitMQ** — Message broker con colas, AMQP, buen default.
- **Spring Cloud Stream** — Abstracción que conecta Kafka o Rabbit vía binders.

**Ventajas:** Desacoplamiento total, tolerancia a fallos, escala horizontal.
**Desventajas:** Eventual consistency, más difícil de debuggear, infraestructura extra.

```java
// RabbitMQ Producer
@Service @RequiredArgsConstructor
public class UserEventPublisher {
    private final RabbitTemplate rabbit;
    public void publishCreated(User user) {
        UserEvent event = new UserEvent("USER_CREATED", user.getId(),
            user.getOrgId(), Instant.now());
        rabbit.convertAndSend("user-exchange", "user.created", event);
    }
}

// RabbitMQ Consumer
@Service
public class UserEventListener {
    @RabbitListener(queues = "notification-queue")
    public void onUserCreated(UserEvent event) {
        if ("USER_CREATED".equals(event.type())) {
            // enviar email de bienvenida, notificación push, etc.
        }
    }
}
```

### Cuándo usar cada una

| Escenario                                                | Tipo       | Razón                                   |
| -------------------------------------------------------- | ---------- | --------------------------------------- |
| Validar si una organización existe antes de crear usuario | Síncrona   | Necesita respuesta inmediata            |
| Notificar que un usuario fue creado                      | Asíncrona  | Fire-and-forget, múltiples consumidores |
| Obtener datos para armar un DTO compuesto                | Síncrona   | Se necesita la data ahora               |
| Sincronizar base de datos de lectura tras escritura      | Asíncrona  | Eventual consistency aceptable          |
| Auditoría — registrar cada acción en log central         | Asíncrona  | No debe bloquear la operación principal |

### Kafka vs RabbitMQ

| Criterio        | Kafka                                       | RabbitMQ                                    |
| --------------- | ------------------------------------------- | ------------------------------------------- |
| Modelo          | Log distribuido — particiones, offsets       | Cola de mensajes — AMQP, exchanges, queues  |
| Throughput      | Muy alto — millones de msg/s                 | Medio-alto — miles de msg/s                 |
| Persistencia    | Mensajes se retienen (configurable)          | Se eliminan al consumir (default)            |
| Orden           | Garantizado por partición                    | Garantizado por cola                         |
| Replay          | ✅ Re-leer mensajes (offset reset)           | ❌ Una vez consumido, se borró              |
| Complejidad     | Alta (ZooKeeper/KRaft, particiones)          | Media (exchanges, bindings, dead-letter)     |
| Ideal para      | Event sourcing, logs, stream processing      | Tareas async, notificaciones, colas trabajo  |
| Spring Boot     | spring-kafka + KafkaTemplate                 | spring-amqp + RabbitTemplate                 |
| Recomendación   | ✅ Auditoría, event streaming entre ms       | ✅ Notificaciones, tareas background         |

---

## Bases de Datos

### Opciones Disponibles

| Base de Datos | Tipo              | Driver R2DBC                              | Anotación Entity           | Repositorio                           | Config YAML                                          |
| ------------- | ----------------- | ----------------------------------------- | -------------------------- | ------------------------------------- | ---------------------------------------------------- |
| Oracle DB     | SQL Relacional    | oracle-r2dbc                              | @Table + @Id (Long)        | ReactiveCrudRepository<T, Long>       | `spring.r2dbc.url: r2dbc:oracle://...`               |
| PostgreSQL    | SQL Relacional    | r2dbc-postgresql                          | @Table + @Id (Long)        | ReactiveCrudRepository<T, Long>       | `spring.r2dbc.url: r2dbc:postgresql://...`           |
| MySQL         | SQL Relacional    | r2dbc-mysql (io.asyncer:r2dbc-mysql)      | @Table + @Id (Long)        | ReactiveCrudRepository<T, Long>       | `spring.r2dbc.url: r2dbc:mysql://...`                |
| MongoDB       | NoSQL Documentos  | spring-data-mongodb-reactive              | @Document + @Id (ObjectId) | ReactiveMongoRepository<T, ObjectId>  | `spring.data.mongodb.uri: mongodb://...`             |

### Patrón: Database per Service

Cada microservicio tiene su propia base de datos. **No se comparte BD entre servicios.**

### Estrategia por Microservicio

| Microservicio       | BD Recomendada               | Razón                                              |
| ------------------- | ---------------------------- | -------------------------------------------------- |
| vg-ms-users         | Oracle / PostgreSQL / MySQL  | Usuarios + organizaciones + roles = muchas FK       |
| vg-ms-orgs          | Oracle / PostgreSQL / MySQL  | Organizaciones padre-hijo, jerarquía relacional     |
| vg-ms-audit         | MongoDB                      | Logs de auditoría, alto volumen, schema libre       |
| vg-ms-notifications | MongoDB                      | Payload variable, no necesita FK                    |
| vg-ms-config        | MongoDB / PostgreSQL         | Config por org — JSON flexible o JSONB              |

---

## Seguridad y RBAC

### Opciones de Autenticación

#### Keycloak (Self-hosted IAM)

- Multi-tenancy nativo: 1 Realm = 1 organización.
- OAuth 2.0 + OIDC estándar.
- Roles granulares: Realm roles, Client roles, Groups, Policies.
- Admin Console web para gestionar sin código.
- Self-hosted — datos en tu servidor.

```yaml
# docker-compose — Keycloak
services:
  keycloak:
    image: quay.io/keycloak/keycloak:25.0
    command: start-dev
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    ports: ["8180:8080"]

# application.yaml — Spring Boot + Keycloak
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8180/realms/vg-prs
```

#### Firebase Auth (Cloud-managed)

- Proveedores múltiples: Google, GitHub, email/password, phone.
- Sin servidor propio — Google gestiona todo.
- Custom claims para roles: `admin.auth().setCustomUserClaims(uid, {role: 'admin'})`.
- Free tier: 50k MAU gratis.

```java
// Spring Boot — verificar token Firebase
@Component
public class FirebaseTokenFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req,
            HttpServletResponse res, FilterChain chain) {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            FirebaseToken decoded = FirebaseAuth.getInstance()
                .verifyIdToken(token);
        }
        chain.doFilter(req, res);
    }
}
```

### Comparativa Keycloak vs Firebase

| Criterio              | Keycloak                          | Firebase Auth                    |
| --------------------- | --------------------------------- | -------------------------------- |
| Infraestructura       | Self-hosted (Docker/K8s)          | Cloud gestionado (Google)        |
| Multi-tenancy         | Nativo — 1 Realm = 1 org         | Limitado (Identity Platform)     |
| Protocolo             | OAuth 2.0 / OIDC completo        | JWT propio + OAuth providers     |
| Roles                 | RBAC completo (realm + client)    | Custom claims manuales           |
| Costo                 | Free — pagas infra                | Free <50k MAU                    |
| Curva aprendizaje     | Alta (Realms, Flows, SPIs)        | Baja (SDK + Console)             |
| Control de datos      | Total (tu servidor)               | Google Cloud                     |
| Recomendación PRS     | ✅ Multi-org enterprise           | ✅ MVP / equipo pequeño          |

### Sistema de Roles (RBAC)

| Rol           | Alcance                | Permisos                                                               |
| ------------- | ---------------------- | ---------------------------------------------------------------------- |
| SUPER_ADMIN   | Sistema completo       | Gestionar todas las organizaciones, crear ORG_ADMIN, configurar global |
| ORG_ADMIN     | Su organización        | CRUD usuarios de su org, gestionar niveles/cursos, ver reportes        |
| TEACHER       | Sus cursos asignados   | Registrar notas/asistencia, ver alumnos, subir recursos                |
| STUDENT       | Su perfil              | Ver sus notas, asistencia, horario. Sin acceso a otros estudiantes     |

### Reglas de Acceso por Endpoint

| Método | Path                  | Roles Permitidos                | Nota                               |
| ------ | --------------------- | ------------------------------- | ---------------------------------- |
| GET    | `/api/users/**`       | ORG_ADMIN, TEACHER, STUDENT     | Lectura — todos los autenticados   |
| POST   | `/api/users`          | ORG_ADMIN                       | Crear usuarios                     |
| PUT    | `/api/users/{id}`     | ORG_ADMIN                       | Editar usuario                     |
| DELETE | `/api/users/{id}`     | SUPER_ADMIN                     | Eliminar — solo super admin        |
| GET    | `/api/orgs/**`        | SUPER_ADMIN                     | Ver todas las organizaciones       |
| POST   | `/api/enrollment`     | ORG_ADMIN                       | Matricular                         |
| POST   | `/api/grades`         | TEACHER                         | Registrar notas                    |

---

## Ecosistema de Microservicios PRS

| Servicio              | Descripción                                                         | Base de datos |
| --------------------- | ------------------------------------------------------------------- | ------------- |
| vg-ms-gateway         | API Gateway — Spring Cloud Gateway. Ruteo, rate limiting, filtro JWT | —             |
| vg-ms-auth            | Adapter Keycloak/Firebase. Token exchange, sync perfiles, refresh   | PostgreSQL    |
| vg-ms-users           | CRUD usuarios. Roles por org (RBAC). Perfil, estado, auditoría     | PostgreSQL    |
| vg-ms-orgs            | Organizaciones, sedes, niveles, grados, secciones                  | PostgreSQL    |
| vg-ms-enrollment      | Matrículas, períodos académicos, asignación alumno→grado→sección   | PostgreSQL    |
| vg-ms-academic        | Cursos, horarios, notas, asistencia. Docentes por sección          | PostgreSQL    |
| vg-ms-audit           | Log central de TODOS los eventos. Consume de Kafka, inmutable      | MongoDB       |
| vg-ms-notifications   | Emails, push, SMS. Consume eventos de usuarios, matrículas, notas  | MongoDB       |
| vg-ms-reports         | Dashboards, reportes PDF/Excel. Lee de múltiples ms vía API        | MongoDB       |
| vg-ms-config          | Feature flags, parámetros por org, configuración dinámica          | PostgreSQL    |

---

## Paquetes Backend por Patrón

### Layered (12 paquetes)

| Paquete          | Responsabilidad                                                                      |
| ---------------- | ------------------------------------------------------------------------------------ |
| `config/`        | CORS, SecurityWebFilterChain, WebClient beans, Kafka/Rabbit config. @Configuration.  |
| `security/`      | JwtAuthenticationFilter, RoleConstants. Validación JWT y extracción de roles.        |
| `rest/`          | Endpoints reactivos con @PreAuthorize. Sufijo Rest. Retorna Mono<>/Flux<>.           |
| `service/`       | Interfaz del servicio. Define el contrato de negocio.                                |
| `service/impl/`  | Implementación @Service. Lógica + validaciones + eventos + llamadas entre ms.        |
| `repository/`    | R2DBC Repository + @Query custom. Métodos derivados para filtros.                    |
| `model/`         | Entidades @Table (R2DBC PostgreSQL). Enum de roles. Campos de auditoría.             |
| `dto/`           | Request/Response DTOs con @NotBlank, @Email. Sin campos sensibles.                   |
| `mapper/`        | Conversión Entity ↔ DTO. Métodos estáticos toEntity(), toResponse().                |
| `exception/`     | @ControllerAdvice + NotFoundException, ForbiddenOrgException.                        |
| `event/`         | Publishers Kafka/Rabbit, Listeners, records de evento.                               |
| `client/`        | WebClient calls a otros ms. Clases *ServiceClient.                                   |

### Hexagonal (14 paquetes)

| Paquete                        | Responsabilidad                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| `domain/models/`               | Entidades de dominio PURAS (User.java). Value Objects. Sin @Table ni Spring.          |
| `domain/ports/in/`             | Interfaces de casos de uso: ICreateUserUseCase, IGetUserUseCase, etc.                 |
| `domain/ports/out/`            | Interfaces de salida: IUserRepository, IUserEventPublisher, ISecurityContext.          |
| `domain/exceptions/`           | DomainException (abstract), BusinessRuleException, NotFoundException.                 |
| `domain/services/`             | UserAuthorizationService — RBAC puro, sin Spring.                                     |
| `application/usecases/`        | Implementaciones: CreateUserUseCaseImpl, GetUserUseCaseImpl, etc.                      |
| `application/dto/`             | CreateUserRequest, UpdateUserRequest, UserResponse, ApiResponse<T>.                   |
| `application/events/`          | UserCreatedEvent, UserUpdatedEvent, UserDeletedEvent con correlationId.               |
| `application/mappers/`         | UserMapper @Component — toModel(Request), toResponse(User).                            |
| `infrastructure/adapters/in/`  | UserRest, SetupRest @RestController. GlobalExceptionHandler.                           |
| `infrastructure/adapters/out/` | persistence/ (UserRepositoryImpl), messaging/ (UserEventPublisherImpl), external/.    |
| `infrastructure/config/`       | SecurityConfig, R2dbcConfig, RabbitMQConfig, WebClientConfig, Resilience4jConfig.     |
| `infrastructure/persistence/`  | entities/ (UserEntity @Table) + repositories/ (UserR2dbcRepository).                  |
| `infrastructure/security/`     | GatewayHeadersFilter, GatewayHeadersExtractor, SecurityContextAdapter.                |

### CQRS (13 paquetes)

| Paquete                   | Responsabilidad                                                         |
| ------------------------- | ----------------------------------------------------------------------- |
| `command/handler/`        | CreateUserHandler, UpdateUserHandler, DeleteUserHandler.                |
| `command/model/`          | Records inmutables: CreateUserCommand, UpdateUserCommand.               |
| `command/repository/`     | UserWriteRepository — ReactiveCrudRepository → PostgreSQL.              |
| `query/handler/`          | GetUserHandler, ListUsersByOrgHandler. Solo lectura.                    |
| `query/model/`            | UserView — proyección optimizada para lectura.                          |
| `query/repository/`       | UserReadRepository — queries de solo lectura.                           |
| `event/`                  | UserCreatedEvent, UserEventPublisher (Kafka), UserEventProjector.       |
| `shared/model/`           | User @Table R2DBC, Role enum. Compartidos entre command y query.        |
| `shared/dto/`             | UserRequest, UserResponse. DTOs compartidos.                            |
| `infrastructure/rest/`    | UserRest @RestController. Delega POST a command, GET a query.           |
| `infrastructure/config/`  | SecurityConfig, KafkaConfig, WebClientConfig.                           |
| `infrastructure/security/`| JwtAuthenticationFilter. Extracción de JWT y roles.                     |
| `infrastructure/client/`  | OrgServiceClient — WebClient calls a vg-ms-orgs.                       |

---

## Despliegue: Orquestación vs Coreografía

### Orquestación

Un componente central (orquestador) coordina la secuencia de llamadas entre microservicios.

- **Ventajas:** Flujo visible y depurable, rollback centralizado (Saga), fácil de testear, control total del orden.
- **Desventajas:** Single point of failure, acoplamiento al orquestador, puede ser bottleneck.
- **Herramientas:** Spring Cloud Gateway, Camunda, Temporal.io, AWS Step Functions.
- **Ejemplo PRS:** API Gateway recibe request → llama vg-ms-users → luego vg-ms-orgs → luego vg-ms-notifications → responde.

### Coreografía

No hay coordinador central. Cada microservicio reacciona a eventos publicados por otros.

- **Ventajas:** Sin single point of failure, bajo acoplamiento, escalabilidad natural, autonomía.
- **Desventajas:** Flujo difícil de seguir (event spaghetti), debug complejo, requiere idempotencia, difícil garantizar orden.
- **Herramientas:** RabbitMQ, Apache Kafka, Amazon SNS/SQS, Redis Streams.
- **Ejemplo PRS:** vg-ms-users publica 'user.created' → vg-ms-auth escucha y crea credenciales → vg-ms-notifications escucha y envía bienvenida.

### Comparativa

| Criterio          | Orquestación                                    | Coreografía                                     |
| ----------------- | ----------------------------------------------- | ----------------------------------------------- |
| Coordinación      | Centralizada — el orquestador decide el flujo   | Distribuida — cada ms reacciona a eventos       |
| Acoplamiento      | Medio — dependen del orquestador                | Bajo — solo conocen los eventos                 |
| Visibilidad       | ✅ Alta — flujo visible en un lugar              | ⚠️ Baja — hay que rastrear eventos              |
| Escalabilidad     | ⚠️ Limitada por el orquestador                  | ✅ Alta — cada ms escala independientemente      |
| Rollback/Saga     | ✅ Saga centralizada                             | ⚠️ Saga coreografiada (más compleja)            |
| Debugging         | ✅ Fácil — logs centralizados                    | ⚠️ Requiere tracing distribuido                 |
| Recomendación PRS | ✅ Para flujos críticos (crear usuario, matrícula) | ✅ Para eventos no-críticos (notificaciones, logs) |

### Herramientas de Despliegue

| Herramienta    | Uso                          | Ventajas                                    | Desventajas                              |
| -------------- | ---------------------------- | ------------------------------------------- | ---------------------------------------- |
| Docker Compose | Desarrollo local + CI/CD    | Un comando levanta todo, redes internas     | Solo 1 host, sin auto-healing            |
| Kubernetes     | Staging + Producción         | Auto-scaling, self-healing, rolling updates | Curva alta, requiere cluster             |
| Docker Swarm   | Producción bajo/medio tráfico | Integrado en Docker, más simple que K8s     | Menos features, comunidad pequeña        |

### Docker Compose — Entorno Completo PRS

```yaml
version: '3.9'
services:
  # ═══ INFRAESTRUCTURA ═══
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports: ["5672:5672", "15672:15672"]

  # ═══ MICROSERVICIOS ═══
  vg-ms-config:
    build: ./vg-ms-config
    ports: ["8888:8888"]

  vg-ms-eureka:
    build: ./vg-ms-eureka
    ports: ["8761:8761"]
    depends_on: [vg-ms-config]

  vg-ms-gateway:
    build: ./vg-ms-gateway
    ports: ["8080:8080"]
    depends_on: [vg-ms-eureka, vg-ms-config]
    environment:
      EUREKA_URI: http://vg-ms-eureka:8761/eureka

  vg-ms-users:
    build: ./vg-ms-users
    depends_on: [postgres, rabbitmq, vg-ms-eureka]
    environment:
      SPRING_R2DBC_URL: r2dbc:postgresql://postgres:5432/vg_users_db
      SPRING_RABBITMQ_HOST: rabbitmq
      EUREKA_URI: http://vg-ms-eureka:8761/eureka

  vg-ms-organizations:
    build: ./vg-ms-organizations
    depends_on: [postgres, rabbitmq, vg-ms-eureka]

  vg-ms-auth:
    build: ./vg-ms-auth
    depends_on: [postgres, vg-ms-eureka]

  vg-ms-notifications:
    build: ./vg-ms-notifications
    depends_on: [rabbitmq, vg-ms-eureka]

volumes:
  postgres_data:
```

---

> **Fin del documento.** Este README contiene todos los estándares backend desde el Semestre II hasta el V·VI para ser utilizado como fuente de verdad en el code review automatizado con Amazon Bedrock.
