# Estructuras de Proyecto — Valle Grande

> Define la estructura de directorios esperada para cada stack con el nivel de detalle necesario para que el sistema de code review detecte cumplimiento o violaciones específicas.

---

## Criterios de Evaluación de Estructura

| Criterio                                                          | Peso |
| ----------------------------------------------------------------- | ---- |
| Directorios obligatorios presentes y con contenido correcto       | 35 % |
| Archivos obligatorios en raíz (pom.xml, .gitignore, README, etc.) | 20 % |
| Naming del proyecto correcto (prefijo, kebab-case)                | 15 % |
| Package base correcto (`pe.edu.vallegrande.*`)                    | 15 % |
| Archivos que NO deben estar (node_modules, .class, .env en git)   | 15 % |

---

## Señales de detección por stack

El evaluador debe buscar estos indicadores para identificar el stack antes de revisar la estructura:

| Indicador encontrado                               | Stack identificado               |
| -------------------------------------------------- | -------------------------------- |
| `pom.xml` + `spring-boot-starter-web`              | Spring Boot MVC (Sem III)        |
| `pom.xml` + `spring-boot-starter-webflux`          | Spring WebFlux (Sem IV / V·VI)   |
| `pom.xml` + `r2dbc-postgresql`                     | WebFlux + PostgreSQL (V·VI)      |
| `pom.xml` + `oracle-r2dbc`                         | WebFlux + Oracle (Sem IV)        |
| `pom.xml` + `spring-data-mongodb-reactive`         | WebFlux + MongoDB                |
| `requirements.txt` + `Flask` + `mysql`             | Flask + MySQL (Sem II)           |
| `requirements.txt` + `Flask` + `sqlite`            | Flask + SQLite (Sem IV)          |
| `package.json` + `"@angular/core"`                 | Angular (Sem III / V·VI)         |
| `package.json` + `"react"` + `"vite"`              | React (Sem IV / V·VI)            |
| `app.json` + `"expo"`                              | Expo / React Native (Sem IV)     |
| `.java` + `import javax.swing` + `import java.sql` | Java Swing + JDBC (Sem II)       |

---

## 1. Semestre II — Java Desktop (Swing + JDBC + MySQL)

### Convenciones de naming
- Nombre del proyecto: **minúsculas**, sin guiones (`miproyecto/`, no `mi-proyecto/`)
- Package raíz: `pe.edu.vallegrande.<nombre-sin-guiones>.<paquete>`

### Estructura completa con detección

```
mi-proyecto/
└── src/
    └── pe/
        └── edu/
            └── vallegrande/
                └── miproyecto/
                    │
                    ├── view/                          ← OBLIGATORIO
                    │   ├── {Entidad}CrudView.java     ← sufijo: View
                    │   └── {Entidad}EditView.java
                    │
                    ├── controller/                    ← OBLIGATORIO
                    │   └── {Entidad}CrudController.java  ← sufijo: Controller
                    │
                    ├── service/                       ← OBLIGATORIO
                    │   └── {Entidad}Service.java      ← sufijo: Service
                    │
                    ├── dto/                           ← OBLIGATORIO
                    │   └── {Entidad}Dto.java          ← sufijo: Dto
                    │
                    ├── model/                         ← OBLIGATORIO
                    │   └── {Entidad}.java             ← sin sufijo (solo PascalCase)
                    │
                    ├── dao/                           ← OBLIGATORIO
                    │   └── {Entidad}DAO.java          ← sufijo: DAO (mayúsculas)
                    │
                    ├── db/                            ← OBLIGATORIO
                    │   └── AccessDB.java              ← EXACTAMENTE este nombre
                    │
                    ├── util/                          ← OBLIGATORIO (puede estar vacío)
                    ├── exception/                     ← OBLIGATORIO (puede estar vacío)
                    └── prueba/                        ← OBLIGATORIO para tests
                        └── {Entidad}ServiceTest.java
```

### Contenido esperado en clases clave

```java
// db/AccessDB.java — debe contener la conexión JDBC
public class AccessDB {
    private static final String URL = "jdbc:mysql://localhost:3306/{db}";
    // getConnection() o similar
}

// dao/{Entidad}DAO.java — debe extender o usar AccessDB
public class ClientDAO {
    // métodos: save(), findAll(), findById(), update(), delete()
    // usa AccessDB para obtener la conexión
}

// service/{Entidad}Service.java — usa DAO, no accede a BD directamente
public class ClientService {
    private ClientDAO dao;  // inyección por constructor o campo
}

// controller/{Entidad}Controller.java — maneja eventos de la View
public class ClientController {
    private ClientService service;  // usa Service, NUNCA DAO directamente
}

// view/{Entidad}View.java — extiende JFrame o JPanel
public class ClientCrudView extends JFrame {
    private ClientController controller;
}
```

### Violaciones detectables

| Patrón en código                              | Violación                          |
| --------------------------------------------- | ---------------------------------- |
| `import java.sql.*` en una clase `View`       | SQL directo en View                |
| `AccessDB` en `Controller` o `Service`        | Conexión BD fuera del DAO          |
| Clase `View` sin `extends JFrame/JPanel`      | No es una View de Swing            |
| Más de un archivo `AccessDB` en el proyecto   | Duplicación de conexión            |
| Archivos `.class` en el repositorio           | Archivos compilados subidos        |

### .gitignore mínimo esperado

```gitignore
*.class
out/
build/
.idea/
*.iml
```

---

## 2. Semestre II — Python Flask + MySQL

### Convenciones
- Nombre: minúsculas con guiones (`mi-proyecto/`)
- `app/__init__.py` DEBE contener la función `create_app()`

### Estructura completa

```
mi-proyecto/
│
├── app/                               ← paquete principal
│   ├── __init__.py                    ← OBLIGATORIO — contiene create_app()
│   ├── config.py                      ← OBLIGATORIO — configuración por entorno
│   ├── database.py                    ← OBLIGATORIO — SQLAlchemy init
│   │
│   ├── models/                        ← OBLIGATORIO
│   │   ├── __init__.py                ← OBLIGATORIO en cada paquete
│   │   └── {entidad}.py               ← Clase modelo con db.Model
│   │
│   ├── routes/                        ← OBLIGATORIO
│   │   ├── __init__.py                ← OBLIGATORIO
│   │   └── {entidad}.py               ← Blueprint por módulo
│   │
│   ├── services/                      ← OBLIGATORIO
│   │   └── {entidad}_service.py       ← lógica de negocio
│   │
│   ├── static/
│   │   ├── css/
│   │   ├── js/
│   │   │   └── main.js
│   │   └── img/
│   │
│   └── templates/
│       ├── base.html                  ← OBLIGATORIO — CDN Tailwind + bloques Jinja
│       └── {entidad}/
│           ├── index.html
│           └── form.html
│
├── .env                               ← variables locales (NO subir a git)
├── .gitignore                         ← OBLIGATORIO
├── app.py                             ← OBLIGATORIO — punto de entrada
└── requirements.txt                   ← OBLIGATORIO — pip freeze
```

### Contenido esperado en archivos clave

```python
# app/__init__.py — DEBE tener create_app()
from flask import Flask
from .database import db

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    db.init_app(app)
    from .routes.clientes import bp as clients_bp
    app.register_blueprint(clients_bp)
    return app

# app/routes/{entidad}.py — DEBE usar Blueprint
from flask import Blueprint
bp = Blueprint("{entidad}", __name__, url_prefix="/api/{entidad}s")

# app/models/{entidad}.py — DEBE extender db.Model
class Cliente(db.Model):
    __tablename__ = 'clientes'
    id = db.Column(db.Integer, primary_key=True)

# app.py — DEBE llamar create_app()
from app import create_app
app = create_app()
if __name__ == '__main__':
    app.run(debug=True)
```

### Violaciones detectables

| Patrón                                        | Violación                                   |
| --------------------------------------------- | ------------------------------------------- |
| `app/__init__.py` sin `create_app()`          | No usa factory pattern                      |
| `import mysql.connector` en routes            | Acceso BD directo en capa de rutas          |
| Sin `Blueprint` en rutas                      | Rutas sin modularización                    |
| `venv/` en el repositorio                     | Entorno virtual subido (ignorar con .gitignore) |
| `.env` en el repositorio                      | Credenciales expuestas                      |
| Sin `requirements.txt`                        | Dependencias no declaradas                  |
| Tailwind con `npm` en lugar de CDN            | Violación de stack para Sem II             |

### .gitignore mínimo esperado

```gitignore
venv/
__pycache__/
*.pyc
.env
*.db
instance/
```

---

## 3. Semestre III — Spring Boot 3 MVC + SQL Server

### Convenciones de naming
- Proyecto: `vg-ms-{nombre}` en **kebab-case** (ej. `vg-ms-clientes`)
- Package base: `pe.edu.vallegrande.vgms{nombre}` (sin guiones en el package)
- Clase principal: `VgMs{Nombre}Application.java` (PascalCase, sin guiones)

### Estructura completa

```
vg-ms-{nombre}/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── pe/edu/vallegrande/vgms{nombre}/
│   │   │       │
│   │   │       ├── config/                            ← OBLIGATORIO
│   │   │       │   └── CorsConfig.java                ← OBLIGATORIO, exactamente este nombre
│   │   │       │
│   │   │       ├── rest/                              ← OBLIGATORIO (NO "controller/")
│   │   │       │   └── {Entidad}Rest.java             ← sufijo obligatorio: Rest
│   │   │       │
│   │   │       ├── service/                           ← OBLIGATORIO
│   │   │       │   └── {Entidad}Service.java          ← sufijo: Service
│   │   │       │
│   │   │       ├── repository/                        ← OBLIGATORIO
│   │   │       │   └── {Entidad}Repository.java       ← sufijo: Repository
│   │   │       │
│   │   │       ├── model/                             ← OBLIGATORIO
│   │   │       │   └── {Entidad}.java                 ← sin sufijo, PascalCase
│   │   │       │
│   │   │       ├── dto/                               ← OBLIGATORIO
│   │   │       │   └── {Entidad}Dto.java              ← sufijo: Dto
│   │   │       │
│   │   │       ├── exception/                         ← OBLIGATORIO
│   │   │       │   ├── GlobalExceptionHandler.java    ← OBLIGATORIO, exactamente este nombre
│   │   │       │   └── ResourceNotFoundException.java ← excepción custom
│   │   │       │
│   │   │       └── VgMs{Nombre}Application.java       ← OBLIGATORIO — clase main
│   │   │
│   │   └── resources/
│   │       └── application.yaml                       ← OBLIGATORIO (.yaml NO .properties)
│   │
│   └── test/
│       └── java/
│           └── pe/edu/vallegrande/vgms{nombre}/
│               └── {Entidad}ServiceTest.java
│
└── pom.xml                                            ← OBLIGATORIO
```

### Contenido esperado en clases clave

```java
// config/CorsConfig.java — debe usar @Configuration
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOriginPatterns("*")
            .allowedMethods("GET","POST","PUT","DELETE","PATCH","OPTIONS");
    }
}

// rest/{Entidad}Rest.java — debe tener @RestController + @RequestMapping
@RestController
@RequestMapping("/api/v1/{entidades}")
public class ClientRest {
    // @GetMapping, @PostMapping, @PutMapping, @DeleteMapping

// service/{Entidad}Service.java — debe tener @Service
@Service
public class ClientService {
    // @Autowired ó @RequiredArgsConstructor para repositorio

// repository/{Entidad}Repository.java — debe extender JpaRepository
public interface ClientRepository extends JpaRepository<Client, Long> {}

// model/{Entidad}.java — debe tener @Entity + @Table
@Entity
@Table(name = "clients")
public class Client {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

// exception/GlobalExceptionHandler.java — debe tener @RestControllerAdvice
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(...) {}
}
```

### Metadatos pom.xml obligatorios

```xml
<groupId>pe.edu.vallegrande</groupId>
<artifactId>vg-ms-{nombre}</artifactId>
<packaging>jar</packaging>
<java.version>17</java.version>

<!-- Dependencias obligatorias -->
spring-boot-starter-web
spring-boot-starter-data-jpa
mssql-jdbc  (SQL Server driver)
lombok
spring-boot-devtools
```

### application.yaml — configuración esperada

```yaml
spring:
  datasource:
    url: jdbc:sqlserver://${DB_HOST:localhost}:1433;databaseName=${DB_NAME}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: com.microsoft.sqlserver.jdbc.SQLServerDriver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false       # false en staging/prod
    properties:
      hibernate:
        dialect: org.hibernate.dialect.SQLServerDialect
server:
  port: ${PORT:8080}
```

### Violaciones detectables

| Patrón                                              | Violación                             |
| --------------------------------------------------- | ------------------------------------- |
| Carpeta `controller/` en lugar de `rest/`           | Sufijo incorrecto para este ciclo     |
| `@Controller` en lugar de `@RestController`         | Clase no es REST                      |
| `JpaRepository` inyectado directamente en Rest      | Acceso BD saltando el Service         |
| `application.properties` en lugar de `application.yaml` | Formato de configuración incorrecto |
| `groupId` diferente de `pe.edu.vallegrande`         | Metadatos del proyecto incorrectos    |
| Credenciales hardcodeadas en YAML                   | Violación de seguridad crítica        |
| Sin `CorsConfig.java`                               | CORS no configurado                   |
| Sin `GlobalExceptionHandler.java`                   | Sin manejo de errores global          |

---

## 4. Semestre III — Angular 17+ Frontend

### Convenciones
- Proyecto: `vg-fe-{nombre}` en kebab-case
- Creado con: `ng new vg-fe-{nombre} --routing --style=css`

### Estructura completa

```
vg-fe-{nombre}/
│
├── src/
│   ├── app/
│   │   ├── core/                                  ← OBLIGATORIO
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts                  ← sufijo: .guard.ts
│   │   │   ├── interceptors/
│   │   │   │   └── token.interceptor.ts           ← sufijo: .interceptor.ts
│   │   │   └── services/
│   │   │       └── auth.service.ts                ← sufijo: .service.ts
│   │   │
│   │   ├── shared/                                ← OBLIGATORIO
│   │   │   ├── components/
│   │   │   │   └── navbar/
│   │   │   │       ├── navbar.component.ts        ← 3 archivos por componente
│   │   │   │       ├── navbar.component.html
│   │   │   │       └── navbar.component.css
│   │   │   ├── pipes/
│   │   │   └── directives/
│   │   │
│   │   ├── modules/                               ← OBLIGATORIO (uno por entidad)
│   │   │   └── {entidad}/
│   │   │       ├── components/
│   │   │       │   ├── {entidad}-list/
│   │   │       │   │   ├── {entidad}-list.component.ts
│   │   │       │   │   ├── {entidad}-list.component.html
│   │   │       │   │   └── {entidad}-list.component.css
│   │   │       │   └── {entidad}-form/
│   │   │       ├── services/
│   │   │       │   └── {entidad}.service.ts
│   │   │       ├── models/
│   │   │       │   └── {entidad}.model.ts         ← sufijo: .model.ts
│   │   │       └── {entidad}-routing.module.ts
│   │   │
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   │
│   ├── environments/
│   │   ├── environment.ts                         ← OBLIGATORIO (producción)
│   │   └── environment.development.ts             ← OBLIGATORIO (desarrollo)
│   ├── assets/
│   ├── index.html
│   └── styles.css
│
├── angular.json                                   ← OBLIGATORIO
├── package.json                                   ← OBLIGATORIO
├── tsconfig.json                                  ← OBLIGATORIO
└── README.md
```

### Contenido esperado

```typescript
// environments/environment.development.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};

// core/services/{entidad}.service.ts
@Injectable({ providedIn: 'root' })
export class ClientService {
  private url = `${environment.apiUrl}/v1/clients`;
  constructor(private http: HttpClient) {}
  // métodos HTTP
}

// modules/{entidad}/models/{entidad}.model.ts — interface o class
export interface Client {
  id: number;
  fullName: string;
  email: string;
  status: string;
}
```

### Violaciones detectables

| Patrón                                               | Violación                            |
| ---------------------------------------------------- | ------------------------------------ |
| Sin carpetas `core/`, `shared/`, `modules/`          | Estructura de módulos ausente        |
| Llamadas HTTP en componentes (sin servicio)          | Lógica de datos en la vista          |
| Sin `environments/`                                  | Configuración de URL hardcodeada     |
| Bootstrap instalado con CDN en lugar de npm          | Violación de stack Angular           |
| `node_modules/` en el repositorio                    | Dependencias subidas a git           |

---

## 5. Semestre IV — Spring WebFlux (Oracle R2DBC ó MongoDB)

### Convenciones
- Proyecto: `vg-ms-{nombre}` kebab-case
- Package: `pe.edu.vallegrande.vg_ms_{nombre}` (guiones → underscore en Java)

### Estructura completa

```
vg-ms-{nombre}/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── pe/edu/vallegrande/vg_ms_{nombre}/
│   │   │       │
│   │   │       ├── config/
│   │   │       │   └── CorsConfig.java            ← OBLIGATORIO
│   │   │       │
│   │   │       ├── rest/                          ← OBLIGATORIO (NO controller/)
│   │   │       │   └── {Entidad}Rest.java         ← sufijo: Rest
│   │   │       │
│   │   │       ├── service/                       ← OBLIGATORIO
│   │   │       │   ├── {Entidad}Service.java      ← INTERFAZ — obligatoria
│   │   │       │   └── impl/                      ← OBLIGATORIO
│   │   │       │       └── {Entidad}ServiceImpl.java  ← sufijo: ServiceImpl
│   │   │       │
│   │   │       ├── repository/
│   │   │       │   └── {Entidad}Repository.java
│   │   │       │
│   │   │       ├── model/
│   │   │       │   └── {Entidad}.java             ← @Table (R2DBC) ó @Document (MongoDB)
│   │   │       │                                  ← NUNCA @Entity aquí
│   │   │       ├── dto/
│   │   │       │   └── {Entidad}Dto.java
│   │   │       │
│   │   │       ├── exception/
│   │   │       │   └── GlobalExceptionHandler.java
│   │   │       │
│   │   │       └── VgMs{Nombre}Application.java
│   │   │
│   │   └── resources/
│   │       └── application.yaml
│   │
│   └── test/
└── pom.xml
```

### Contenido esperado en clases clave (WebFlux)

```java
// rest/{Entidad}Rest.java — retornos SIEMPRE Mono o Flux
@RestController
@RequestMapping("/api/v1/{entidades}")
@RequiredArgsConstructor
public class ClientRest {
    private final ClientService service;  // inyección por constructor

    @GetMapping
    public Flux<ClientResponse> getAll() { ... }         // Flux para listas

    @GetMapping("/{id}")
    public Mono<ResponseEntity<ClientResponse>> getById(@PathVariable Long id) { ... }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<ClientResponse> create(@RequestBody @Valid ClientRequest request) { ... }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> delete(@PathVariable Long id) { ... }
}

// service/{Entidad}Service.java — DEBE ser interfaz
public interface ClientService {
    Flux<ClientResponse> findAll();
    Mono<ClientResponse> findById(Long id);
    Mono<ClientResponse> create(ClientRequest request);
    Mono<ClientResponse> update(Long id, ClientRequest request);
    Mono<Void> delete(Long id);
}

// service/impl/{Entidad}ServiceImpl.java
@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final ClientRepository repository;
    // implementaciones que retornan Mono/Flux
}

// model/{Entidad}.java — Oracle R2DBC
@Table("clients")              // @Table de org.springframework.data.relational.core.mapping
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Client {
    @Id private Long id;       // @Id de org.springframework.data.annotation
    // sin @GeneratedValue — R2DBC lo maneja diferente
}

// model/{Entidad}.java — MongoDB
@Document("clients")           // @Document de spring-data-mongodb
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Client {
    @Id private ObjectId id;   // ObjectId de org.bson.types
}

// repository/{Entidad}Repository.java — Oracle
public interface ClientRepository
    extends ReactiveCrudRepository<Client, Long> {}    // ReactiveCrudRepository, no JpaRepository

// repository/{Entidad}Repository.java — MongoDB
public interface ClientRepository
    extends ReactiveMongoRepository<Client, ObjectId> {}
```

### Dependencias pom.xml — señales de detección

```xml
<!-- WebFlux -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>

<!-- Oracle R2DBC -->
<dependency>
  <groupId>com.oracle.database.r2dbc</groupId>
  <artifactId>oracle-r2dbc</artifactId>
</dependency>

<!-- MongoDB Reactivo -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-mongodb-reactive</artifactId>
</dependency>
```

### Violaciones críticas detectables

| Patrón en código o pom.xml                              | Violación                                   |
| ------------------------------------------------------- | ------------------------------------------- |
| `spring-boot-starter-web` en pom.xml                   | Usando MVC en lugar de WebFlux              |
| `spring-boot-starter-data-jpa` en pom.xml              | JPA en proyecto reactivo                    |
| `@Entity` + `import jakarta.persistence` en model/     | Usando JPA en lugar de R2DBC                |
| `extends JpaRepository` en repository/                 | Repositorio bloqueante en WebFlux           |
| Método que retorna `T` o `List<T>` (no Mono/Flux)      | Operación bloqueante en stack reactivo      |
| `.block()` dentro de un flujo reactivo                  | Bloqueo dentro de contexto reactivo         |
| Sin interfaz `{Entidad}Service.java`                   | Falta contrato de servicio                  |
| `{Entidad}ServiceImpl` sin `implements {Entidad}Service`| Implementación sin contrato                |

---

## 6. Semestre IV — React 19 + Vite + Tailwind (sin TypeScript)

### Convenciones
- Proyecto: `vg-fe-{nombre}` kebab-case
- **Sin TypeScript** — solo `.jsx` y `.js`

### Estructura completa

```
vg-fe-{nombre}/
│
├── src/
│   ├── api/
│   │   └── axios.js                    ← OBLIGATORIO — baseURL centralizado
│   │
│   ├── components/                     ← Componentes reutilizables
│   │   └── Navbar.jsx                  ← PascalCase + .jsx
│   │
│   ├── pages/                          ← OBLIGATORIO
│   │   ├── Home.jsx
│   │   └── {entidad}/
│   │       ├── {Entidad}List.jsx       ← PascalCase
│   │       └── {Entidad}Form.jsx
│   │
│   ├── services/                       ← OBLIGATORIO — un archivo por entidad
│   │   └── {entidad}Service.js         ← camelCase + .js
│   │
│   ├── hooks/                          ← OBLIGATORIO
│   │   └── use{Entidad}.js             ← prefijo "use" + PascalCase
│   │
│   ├── context/                        ← si hay estado global
│   │   └── AuthContext.jsx
│   │
│   ├── App.jsx                         ← OBLIGATORIO
│   ├── main.jsx                        ← OBLIGATORIO
│   └── index.css                       ← @import "tailwindcss"
│
├── .env                                ← VITE_API_URL=http://localhost:8080/api
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

### Contenido esperado

```jsx
// api/axios.js — DEBE configurar baseURL con variable de entorno
import axios from 'axios';
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
});
export default api;

// services/{entidad}Service.js — exportar funciones usando el axios configurado
import api from '../api/axios';
export const getClients = () => api.get('/v1/clients');
export const getClientById = (id) => api.get(`/v1/clients/${id}`);
export const createClient = (data) => api.post('/v1/clients', data);
export const updateClient = (id, data) => api.put(`/v1/clients/${id}`, data);
export const deleteClient = (id) => api.delete(`/v1/clients/${id}`);

// hooks/use{Entidad}.js — lógica de estado separada del componente
export function useClients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // fetchClients, etc.
    return { clients, loading, error, refetch: fetchClients };
}
```

### Violaciones detectables

| Patrón                                          | Violación                                   |
| ----------------------------------------------- | ------------------------------------------- |
| `fetch('/api/...')` en lugar de Axios           | Sin usar librería HTTP obligatoria          |
| `axios.get()` dentro de un componente directamente | HTTP fuera de la capa de servicios       |
| Archivos `.tsx` o `.ts` en el proyecto          | TypeScript en sem IV frontend (no permitido)|
| `import.meta.env.VITE_API_URL` sin `.env`       | Variable de entorno sin declarar            |
| Sin carpeta `services/`                         | Llamadas HTTP sin capa de abstracción       |

---

## 7. Semestre IV — Expo / React Native + TypeScript

### Convenciones
- Proyecto: `vg-app-{nombre}` kebab-case
- **TypeScript obligatorio** — `.ts` y `.tsx`

### Estructura completa

```
vg-app-{nombre}/
│
├── app/                               ← OBLIGATORIO — Expo Router
│   ├── (tabs)/                        ← Tab Navigator
│   │   ├── _layout.tsx                ← define las tabs
│   │   ├── index.tsx                  ← primera tab
│   │   └── settings.tsx
│   ├── {entidad}/
│   │   ├── index.tsx                  ← lista
│   │   └── [id].tsx                   ← detalle (ruta dinámica)
│   ├── _layout.tsx                    ← Stack Navigator raíz
│   └── +not-found.tsx                 ← 404
│
├── components/                        ← OBLIGATORIO
│   ├── ui/                            ← componentes genéricos
│   │   ├── Button.tsx                 ← PascalCase + .tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   └── {entidad}/                     ← componentes específicos
│       ├── {Entidad}Card.tsx
│       └── {Entidad}Form.tsx
│
├── services/                          ← OBLIGATORIO
│   └── {entidad}Service.ts            ← camelCase + .ts
│
├── hooks/                             ← OBLIGATORIO
│   └── use{Entidad}.ts
│
├── types/                             ← OBLIGATORIO
│   └── {entidad}.types.ts             ← sufijo: .types.ts
│
├── constants/
│   └── Colors.ts                      ← PascalCase
│
├── assets/
├── app.json                           ← OBLIGATORIO — config Expo
├── tsconfig.json                      ← OBLIGATORIO — strict: true
└── package.json
```

### Contenido esperado

```typescript
// types/{entidad}.types.ts — interfaces TypeScript
export interface Client {
    id: number;
    fullName: string;
    email: string;
    status: 'A' | 'I';
}

// services/{entidad}Service.ts — tipado genérico en Axios
import axios from 'axios';
import type { Client } from '../types/client.types';
const API = axios.create({ baseURL: 'http://192.168.X.X:8080/api' });
export const getClients = () => API.get<Client[]>('/v1/clients');

// components/{Entidad}Card.tsx — StyleSheet obligatorio
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({...});  // NUNCA objetos inline como style={{...}}
```

### tsconfig.json obligatorio

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Violaciones detectables

| Patrón                                        | Violación                                  |
| --------------------------------------------- | ------------------------------------------ |
| Archivos `.js` o `.jsx` en el proyecto        | Sin TypeScript (obligatorio en Expo)       |
| `strict: false` en tsconfig                   | TypeScript no estricto                     |
| `style={{...}}` inline en componentes         | Estilos inline en lugar de StyleSheet      |
| `fetch()` en lugar de Axios                   | HTTP sin librería obligatoria              |
| Sin carpeta `types/`                          | Sin tipado de modelos                      |

---

## 8. Semestre IV — Python Flask + SQLite

### Convenciones
- Proyecto: `vg-ms-{nombre}-be/` (con sufijo `-be`)

### Estructura completa

```
vg-ms-{nombre}-be/
│
├── app/
│   ├── __init__.py                    ← OBLIGATORIO — init Flask app
│   ├── settings.py                    ← OBLIGATORIO — DATABASE path y env vars
│   │
│   ├── models/
│   │   ├── __init__.py                ← OBLIGATORIO
│   │   └── {entidad}.py
│   │
│   ├── routes/
│   │   ├── __init__.py                ← OBLIGATORIO
│   │   └── {entidad}_routes.py        ← sufijo: _routes.py + Blueprint
│   │
│   └── services/
│       ├── __init__.py                ← OBLIGATORIO
│       └── {entidad}_service.py       ← sufijo: _service.py
│
├── venv/                              ← NO en git
├── .env                               ← NO en git
├── database.db                        ← SQLite en raíz
├── requirements.txt                   ← OBLIGATORIO
└── run.py                             ← OBLIGATORIO — punto de entrada
```

### Violaciones detectables

| Patrón                                | Violación                           |
| ------------------------------------- | ----------------------------------- |
| Sin sufijo `-be` en el nombre         | Convención de naming incorrecta     |
| Sin `__init__.py` en algún módulo     | No es un paquete Python válido      |
| `.env` en el repositorio              | Credenciales expuestas              |
| `venv/` en el repositorio             | Entorno virtual subido              |
| SQL directo en `routes/`             | Acceso BD fuera de `services/`      |

---

## 9. Semestre V·VI — Microservicios Enterprise

### Naming del ecosistema PRS

| Microservicio         | Nombre esperado          | BD               |
| --------------------- | ------------------------ | ---------------- |
| API Gateway           | `vg-ms-gateway`          | —                |
| Autenticación         | `vg-ms-auth`             | PostgreSQL       |
| Usuarios              | `vg-ms-users`            | PostgreSQL       |
| Organizaciones        | `vg-ms-organizations`    | PostgreSQL       |
| Matrículas            | `vg-ms-enrollment`       | PostgreSQL       |
| Académico             | `vg-ms-academic`         | PostgreSQL       |
| Auditoría             | `vg-ms-audit`            | MongoDB          |
| Notificaciones        | `vg-ms-notifications`    | MongoDB          |
| Reportes              | `vg-ms-reports`          | MongoDB          |
| Configuración         | `vg-ms-config`           | PostgreSQL       |

### Estructura Layered (V·VI)

```
vg-ms-{nombre}/
│
├── src/main/java/pe/edu/vallegrande/{nombre}/
│   │
│   ├── config/                    ← CORS, Security, WebClient, RabbitMQ/Kafka beans
│   │   ├── CorsConfig.java
│   │   ├── SecurityConfig.java    ← @EnableWebFluxSecurity
│   │   ├── RabbitMQConfig.java    ← (si usa Rabbit)
│   │   ├── KafkaConfig.java       ← (si usa Kafka)
│   │   └── WebClientConfig.java   ← WebClient.Builder bean
│   │
│   ├── security/
│   │   ├── JwtAuthenticationFilter.java  ← WebFilter que valida JWT
│   │   └── RoleConstants.java            ← constantes de roles
│   │
│   ├── rest/                      ← @RestController + @PreAuthorize
│   │   └── {Entidad}Rest.java
│   │
│   ├── service/
│   │   ├── {Entidad}Service.java  ← interfaz
│   │   └── impl/
│   │       └── {Entidad}ServiceImpl.java
│   │
│   ├── repository/
│   │   └── {Entidad}Repository.java  ← R2DBC: extends ReactiveCrudRepository
│   │
│   ├── model/
│   │   └── {Entidad}.java         ← @Table (R2DBC PostgreSQL)
│   │
│   ├── dto/
│   │   ├── {Entidad}Request.java  ← validaciones @NotBlank, @Email
│   │   └── {Entidad}Response.java ← sin campos sensibles
│   │
│   ├── mapper/                    ← conversión Entity ↔ DTO
│   │   └── {Entidad}Mapper.java
│   │
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ResourceNotFoundException.java
│   │   └── ForbiddenOrgException.java
│   │
│   ├── event/                     ← mensajería asíncrona
│   │   ├── {Entidad}EventPublisher.java   ← publica a Rabbit/Kafka
│   │   ├── {Entidad}EventListener.java    ← consume de Rabbit/Kafka
│   │   └── {Entidad}CreatedEvent.java     ← record del evento
│   │
│   └── client/                    ← WebClient calls a otros microservicios
│       └── {Servicio}ServiceClient.java
│
├── src/main/resources/
│   ├── application.yaml
│   └── db/migration/              ← OBLIGATORIO con Flyway
│       ├── V1__create_schema.sql
│       └── V2__create_{entidad}_table.sql
│
└── pom.xml
```

### Estructura Hexagonal (V·VI)

```
vg-ms-{nombre}/
│
├── src/main/java/pe/edu/vallegrande/{nombre}/
│   │
│   ├── domain/                    ← CAPA DE DOMINIO — sin imports de Spring
│   │   ├── model/
│   │   │   └── {Entidad}.java     ← POJO puro (@Builder, @Getter de Lombok OK)
│   │   │                          ← NUNCA @Table, @Entity, @Document
│   │   ├── port/
│   │   │   ├── in/
│   │   │   │   └── I{Entidad}UseCase.java      ← interfaz de entrada
│   │   │   └── out/
│   │   │       ├── I{Entidad}Repository.java   ← interfaz de salida (persistencia)
│   │   │       └── I{Entidad}EventPublisher.java ← interfaz de salida (eventos)
│   │   ├── exception/
│   │   │   ├── DomainException.java
│   │   │   └── {Entidad}NotFoundException.java
│   │   └── service/               ← servicios de dominio (reglas de negocio puras)
│   │       └── {Entidad}AuthorizationService.java
│   │
│   ├── application/               ← CAPA DE APLICACIÓN — usa interfaces del dominio
│   │   ├── usecases/
│   │   │   └── {Entidad}UseCaseImpl.java   ← implementa I{Entidad}UseCase
│   │   ├── dto/
│   │   │   ├── {Entidad}Request.java
│   │   │   └── {Entidad}Response.java
│   │   ├── events/
│   │   │   └── {Entidad}CreatedEvent.java  ← record con correlationId
│   │   └── mappers/
│   │       └── {Entidad}Mapper.java        ← toModel(), toResponse()
│   │
│   └── infrastructure/            ← CAPA DE INFRA — implementa ports del dominio
│       ├── adapters/
│       │   ├── in/
│       │   │   └── rest/
│       │   │       └── {Entidad}Rest.java  ← @RestController
│       │   └── out/
│       │       ├── persistence/
│       │       │   ├── {Entidad}Entity.java         ← @Table AQUÍ sí (no en domain)
│       │       │   ├── {Entidad}R2dbcRepository.java
│       │       │   └── {Entidad}PersistenceAdapter.java ← implementa I{Entidad}Repository
│       │       └── messaging/
│       │           └── {Entidad}EventPublisherAdapter.java ← implementa I{Entidad}EventPublisher
│       ├── config/
│       │   ├── SecurityConfig.java
│       │   ├── R2dbcConfig.java
│       │   ├── RabbitMQConfig.java
│       │   └── WebClientConfig.java
│       └── security/
│           ├── GatewayHeadersFilter.java
│           └── JwtAuthenticationFilter.java
```

### Violaciones críticas detectables en V·VI

| Patrón                                                    | Violación                              |
| --------------------------------------------------------- | -------------------------------------- |
| `@Table` en `domain/model/`                              | Infra en capa de dominio               |
| `import org.springframework.*` en `domain/`              | Framework en capa de dominio           |
| `@RestController` fuera de `infrastructure/adapters/in/` | Capa de entrega en dominio/aplicación  |
| Sin `db/migration/V*.sql`                                 | Sin Flyway                             |
| `ddl-auto: create` ó `update` con Flyway activo          | DDL automático incompatible con Flyway |
| Sin `event/` y sin `client/`                             | Microservicio no integrado al ecosistema|
| `@Autowired` en campos (no constructor injection)        | Inyección no recomendada               |

---

## 10. Semestre V·VI — Frontend Enterprise

### Angular Enterprise

```
vg-fe-{nombre}/
├── src/app/
│   ├── core/                              ← singleton — importado UNA sola vez en AppModule
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── role.guard.ts              ← verifica RBAC
│   │   ├── interceptors/
│   │   │   ├── jwt.interceptor.ts         ← inyecta Bearer token
│   │   │   └── error.interceptor.ts       ← manejo global 401/403/500
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── token.service.ts
│   │   └── models/
│   │       └── api-response.model.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── confirm-dialog/
│   │   │   ├── loading-spinner/
│   │   │   └── data-table/
│   │   ├── pipes/
│   │   └── directives/
│   │
│   ├── features/                          ← lazy loaded por módulo
│   │   ├── auth/
│   │   │   └── login/
│   │   ├── users/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── users-routing.module.ts
│   │   ├── organizations/
│   │   ├── enrollment/
│   │   └── dashboard/
│   │
│   ├── layouts/
│   │   ├── admin-layout/
│   │   └── public-layout/
│   │
│   ├── app.component.ts
│   ├── app.routes.ts                      ← standalone routing
│   └── app.config.ts                      ← provideRouter, provideHttpClient
│
└── src/environments/
    ├── environment.ts
    └── environment.development.ts
```

### React Enterprise

```
vg-ms-{nombre}-fe/  ó  vg-fe-{nombre}/
├── src/
│   ├── core/
│   │   ├── adapters/
│   │   │   ├── httpClient.ts              ← Axios configurado con interceptors
│   │   │   └── index.ts                   ← barrel export
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   └── index.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── api-response.model.ts
│   │   │   └── index.ts
│   │   └── config/
│   │       ├── env.config.ts              ← validación de variables VITE_*
│   │       └── roles.config.ts            ← enum Role
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/                        ← design system
│   │   │   ├── data-display/
│   │   │   ├── feedback/
│   │   │   │   └── ErrorBoundary.tsx
│   │   │   └── navigation/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePermissions.ts
│   │   └── guards/
│   │       ├── ProtectedRoute.tsx
│   │       ├── RoleRoute.tsx
│   │       └── GuestRoute.tsx
│   │
│   ├── store/                             ← Zustand stores
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   │
│   ├── layouts/
│   │   ├── AdminLayout.tsx
│   │   └── PublicLayout.tsx
│   │
│   ├── features/                          ← módulos lazy loaded
│   │   └── {feature}/
│   │       ├── components/
│   │       └── hooks/
│   │
│   ├── router/
│   │   ├── privateRoutes.tsx
│   │   └── publicRoutes.tsx
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env
├── .env.example                           ← OBLIGATORIO — plantilla sin valores reales
├── tsconfig.json                          ← strict: true, paths: {"@/*": ["src/*"]}
└── vite.config.ts                         ← alias @/ → src/
```

### Violaciones detectables en V·VI Frontend

| Patrón                                          | Violación                              |
| ----------------------------------------------- | -------------------------------------- |
| `fetch()` en lugar de Axios con interceptors    | Sin manejo centralizado de auth        |
| `useState` para auth global (sin Zustand)       | Estado global sin librería adecuada    |
| Sin `ProtectedRoute` ó `authGuard`              | Rutas privadas sin protección          |
| Sin `ErrorBoundary`                             | Sin manejo de errores de render        |
| Sin `.env.example`                              | Plantilla de variables ausente         |
| `any` en TypeScript sin justificación           | Tipado débil                           |
| Sin path alias `@/` en vite.config + tsconfig   | Sin alias de imports                   |
