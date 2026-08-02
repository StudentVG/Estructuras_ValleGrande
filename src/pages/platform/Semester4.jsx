import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import innov0 from "../../assets/cuarto/Innovacion0.png";
import innov1 from "../../assets/cuarto/Innovacion1.png";
import innov2 from "../../assets/cuarto/Innovacion2.png";
import android1 from "../../assets/cuarto/Android1.png";
import android2 from "../../assets/cuarto/Android2.png";
import android3 from "../../assets/cuarto/Android3.png";
const fadeUp = {
     hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
     show: (i = 0) => ({
          opacity: 1, y: 0, filter: "blur(0px)",
          transition: { duration: 0.5, ease: "easeOut", delay: i * 0.08 },
     }),
};

const PROJECTS = [
     { id: "webflux", label: "Spring WebFlux", icon: "⚛", badge: "Reactivo", accent: "emerald", tagBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
     { id: "react", label: "React JS", icon: "🌐", badge: "Automatización", accent: "sky", tagBg: "bg-sky-500/10 border-sky-500/20 text-sky-400" },
     { id: "expo", label: "Expo · React Native", icon: "📱", badge: "Móvil", accent: "violet", tagBg: "bg-violet-500/10 border-violet-500/20 text-violet-400" },
];

const WEBFLUX_STACK_ORACLE = [
     { name: "Java 17", role: "Lenguaje del servidor", color: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20" },
     { name: "Spring WebFlux 3", role: "Framework reactivo no-bloqueante", color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20" },
     { name: "Project Reactor", role: "Mono<T> / Flux<T> para streams reactivos", color: "text-teal-400", bg: "bg-teal-500/8 border-teal-500/20" },
     { name: "Spring Data R2DBC", role: "Persistencia reactiva SQL con R2DBC", color: "text-cyan-400", bg: "bg-cyan-500/8 border-cyan-500/20" },
     { name: "Oracle R2DBC", role: "Driver reactivo para Oracle DB", color: "text-red-400", bg: "bg-red-500/8 border-red-500/20" },
     { name: "Lombok", role: "Reduce código boilerplate", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
     { name: "Maven", role: "Gestión de dependencias", color: "text-amber-400", bg: "bg-amber-500/8 border-amber-500/20" },
     { name: "Angular 17+", role: "Frontend SPA (igual que Semestre III)", color: "text-rose-400", bg: "bg-rose-500/8 border-rose-500/20" },
];

const WEBFLUX_STACK_MONGO = [
     { name: "Java 17", role: "Lenguaje del servidor", color: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20" },
     { name: "Spring WebFlux 3", role: "Framework reactivo no-bloqueante", color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20" },
     { name: "Project Reactor", role: "Mono<T> / Flux<T> para streams reactivos", color: "text-teal-400", bg: "bg-teal-500/8 border-teal-500/20" },
     { name: "Spring Data Reactive MongoDB", role: "Persistencia reactiva NoSQL para MongoDB", color: "text-green-400", bg: "bg-green-500/8 border-green-500/20" },
     { name: "MongoDB 7", role: "Base de datos NoSQL orientada a documentos", color: "text-lime-400", bg: "bg-lime-500/8 border-lime-500/20" },
     { name: "Lombok", role: "Reduce código boilerplate", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
     { name: "Maven", role: "Gestión de dependencias", color: "text-amber-400", bg: "bg-amber-500/8 border-amber-500/20" },
     { name: "Angular 17+", role: "Frontend SPA (igual que Semestre III)", color: "text-rose-400", bg: "bg-rose-500/8 border-rose-500/20" },
];

const WEBFLUX_MIGRATION = [
     { what: "Dependencia base", mvc: "spring-boot-starter-web", reactive: "spring-boot-starter-webflux", color: "text-emerald-400" },
     { what: "Persistencia", mvc: "Spring Data JPA", reactiveOracle: "Spring Data R2DBC + oracle-r2dbc", reactiveMongo: "Spring Data Reactive MongoDB", color: "text-teal-400" },
     { what: "Driver BD", mvc: "ojdbc11 (JDBC)", reactiveOracle: "com.oracle.database.r2dbc:oracle-r2dbc", reactiveMongo: "Incluido en spring-boot-starter-data-mongodb-reactive", color: "text-cyan-400" },
     { what: "Entidad", mvc: "@Entity + @Id (javax)", reactiveOracle: "@Table + @Id (Spring Data)", reactiveMongo: "@Document(\"col\") + @Id", color: "text-violet-400" },
     { what: "Repositorio", mvc: "JpaRepository<T, ID>", reactiveOracle: "ReactiveCrudRepository<T, Long>", reactiveMongo: "ReactiveMongoRepository<T, ObjectId>", color: "text-sky-400" },
     { what: "Retorno service", mvc: "T / List<T>", reactive: "Mono<T> / Flux<T>", color: "text-pink-400" },
     { what: "Retorno controller", mvc: "ResponseEntity<T>", reactive: "Mono<ResponseEntity<T>>", color: "text-rose-400" },
     { what: "Clase controller", mvc: "sufijo Controller", reactive: "@RestController + sufijo Rest", color: "text-orange-400" },
     { what: "Config BD", mvc: "spring.datasource.url", reactiveOracle: "spring.r2dbc.url (application.yaml)", reactiveMongo: "spring.data.mongodb.uri (application.yaml)", color: "text-yellow-400" },
];

const WEBFLUX_PACKAGES = [
     { pkg: "rest", accent: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20", desc: "Endpoints reactivos. Retorna Mono<ResponseEntity<T>> o Flux<T>. Sufijo Rest.", example: "ClientRest, ProductRest" },
     { pkg: "service", accent: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20", desc: "Lógica de negocio reactiva. Retorna Mono<T> o Flux<T>. Anota con @Service.", example: "ClientService, ProductService" },
     { pkg: "repository", accent: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20", desc: "Extiende ReactiveCrudRepository (Oracle) o ReactiveMongoRepository (MongoDB). No JpaRepository.", example: "ClientRepository" },
     { pkg: "model", accent: "text-indigo-400", bg: "bg-indigo-500/8 border-indigo-500/20", desc: "Oracle: @Table + @Id — MongoDB: @Document + @Id. Nunca @Entity de JPA.", example: "Client, Product" },
     { pkg: "dto", accent: "text-pink-400", bg: "bg-pink-500/8 border-pink-500/20", desc: "Request/Response separados de la entidad. Usados en los métodos del Rest.", example: "ClientDto, ClientRequest" },
     { pkg: "exception", accent: "text-red-400", bg: "bg-red-500/8 border-red-500/20", desc: "Manejo global con @ControllerAdvice. Excepciones personalizadas.", example: "GlobalExceptionHandler, NotFoundException" },
     { pkg: "config", accent: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20", desc: "CORS, Security, Beans de configuración (@Configuration).", example: "CorsConfig, SecurityConfig" },
];

const WEBFLUX_STRUCTURE_ORACLE = `vg-ms-{nombre}/
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
└── pom.xml`;

const WEBFLUX_STRUCTURE_MONGO = `vg-ms-{nombre}/
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
└── pom.xml`;

const WEBFLUX_YAML_ORACLE = `spring:
  r2dbc:
    url: r2dbc:oracle://localhost:1521/XEPDB1
    username: system
    password: TuPassword123
  sql:
    init:
      mode: always

server:
  port: 8080`;

const WEBFLUX_YAML_MONGO = `spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/vg_nombre_db
      auto-index-creation: true

server:
  port: 8080`;

const DB_NAMING_ORACLE = [
     { element: "Tablas", rule: "snake_case · plural · inglés", good: "clients", bad: "Client, tbl_clientes" },
     { element: "Columnas", rule: "snake_case · inglés", good: "full_name, created_at", bad: "fullName, fch_creacion" },
     { element: "Primary Key", rule: "siempre id", good: "id NUMBER(19)", bad: "id_cliente, clientId" },
     { element: "Estado lógico", rule: "columna status · CHAR(1)", good: "status ('A' / 'I')", bad: "estado, is_deleted" },
];

const DB_NAMING_MONGO_R2DBC = [
     { element: "Colecciones", rule: "snake_case · plural · inglés", good: "clients", bad: "Client, tblClients" },
     { element: "Campos", rule: "camelCase · inglés", good: "fullName, createdAt", bad: "full_name, nombreCompleto" },
     { element: "Primary Key", rule: "auto-generado _id", good: "_id (ObjectId)", bad: "id manual como PK" },
     { element: "Estado lógico", rule: "campo status · String", good: "status ('A' / 'I')", bad: "estado, isDeleted" },
];

const ORACLE_TABLE_SQL = `-- schema.sql (Oracle)
CREATE TABLE clients (
    id          NUMBER(19)    GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name   VARCHAR2(100) NOT NULL,
    email       VARCHAR2(150) NOT NULL UNIQUE,
    status      CHAR(1)       DEFAULT 'A' NOT NULL,
    created_at  TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL,
    updated_at  TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL
);`;

const WEBFLUX_SNIPPET_ORACLE = `// model/Client.java
@Table("clients")                       // tabla: snake_case, plural, inglés
public class Client {
    @Id
    private Long id;                    // PK: siempre "id"

    @Column("full_name")
    private String fullName;            // columna snake_case ↔ campo Java camelCase

    private String email;
    private String status;              // 'A' activo / 'I' inactivo (soft delete)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
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
}`;

const MONGO_R2DBC_EXAMPLE = `// Documento MongoDB — colección "clients"
{
  "_id": ObjectId("..."),
  "fullName": "Ana Torres",     // campo: camelCase, inglés
  "email": "ana@example.com",
  "status": "A",                // 'A' activo / 'I' inactivo
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}`;

const WEBFLUX_SNIPPET_MONGO = `// model/Client.java
@Document("clients")                    // colección: snake_case, plural, inglés
public class Client {
    @Id
    private ObjectId id;                // _id auto-generado

    private String fullName;            // campo Mongo: camelCase, inglés
    private String email;
    private String status;              // 'A' activo / 'I' inactivo (soft delete)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
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
}`;

const WEBFLUX_DEPS_ORACLE = [
     { name: "Spring Reactive Web", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
     { name: "Spring Data R2DBC", color: "text-teal-400 bg-teal-500/10 border-teal-500/25" },
     { name: "Oracle R2DBC Driver", color: "text-red-400 bg-red-500/10 border-red-500/25" },
     { name: "Lombok", color: "text-violet-400 bg-violet-500/10 border-violet-500/25" },
     { name: "Spring Boot DevTools", color: "text-slate-400 bg-slate-500/10 border-slate-500/25" },
];

const WEBFLUX_DEPS_MONGO = [
     { name: "Spring Reactive Web", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
     { name: "Spring Data Reactive MongoDB", color: "text-green-400 bg-green-500/10 border-green-500/25" },
     { name: "Lombok", color: "text-violet-400 bg-violet-500/10 border-violet-500/25" },
     { name: "Spring Boot DevTools", color: "text-slate-400 bg-slate-500/10 border-slate-500/25" },
];

const REACT_STACK = [
     { name: "React 19", role: "Framework UI (JavaScript puro, sin TypeScript)", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
     { name: "JavaScript ES6+", role: "Lenguaje base del proyecto (no TypeScript)", color: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20" },
     { name: "Vite 7", role: "Bundler ultrarrápido + dev server", color: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20" },
     { name: "Tailwind CSS v4", role: "Framework CSS utility-first", color: "text-teal-400", bg: "bg-teal-500/8 border-teal-500/20" },
     { name: "React Router DOM", role: "Navegación SPA con rutas declarativas", color: "text-pink-400", bg: "bg-pink-500/8 border-pink-500/20" },
     { name: "Axios", role: "Cliente HTTP para consumir el API REST", color: "text-blue-400", bg: "bg-blue-500/8 border-blue-500/20" },
     { name: "VS Code", role: "Editor de código recomendado", color: "text-slate-400", bg: "bg-slate-500/8 border-slate-500/20" },
];

const REACT_STEPS = [
     { n: 1, label: "Crear proyecto Vite + React", detail: "npm create vite@latest vg-ms-{nombre}-fe -- --template react → cd vg-ms-nombre-fe → npm install", img: innov0, imgCaption: "Crear proyecto con Vite — React + JavaScript", imgBadge: "Vite 7 · React 19", borderColor: "border-sky-500/20", bgColor: "bg-sky-500/5", borderTop: "border-sky-500/15", badgeColor: "text-sky-500/60" },
     { n: 2, label: "Instalar Tailwind CSS", detail: "npm install tailwindcss @tailwindcss/vite → Agregar plugin en vite.config.js → @import 'tailwindcss' en index.css", img: innov1, imgCaption: "Configurar Tailwind CSS v4 en Vite", imgBadge: "Tailwind v4", borderColor: "border-teal-500/20", bgColor: "bg-teal-500/5", borderTop: "border-teal-500/15", badgeColor: "text-teal-500/60" },
     { n: 3, label: "Instalar dependencias adicionales", detail: "npm install axios react-router-dom → Configura el router en main.jsx con <BrowserRouter> y las rutas en App.jsx", img: innov2, imgCaption: "Proyecto listo con todas las dependencias", imgBadge: "Axios · Router DOM", borderColor: "border-violet-500/20", bgColor: "bg-violet-500/5", borderTop: "border-violet-500/15", badgeColor: "text-violet-500/60" },
];

const REACT_STRUCTURE = `vg-ms-{nombre}-fe/
├── public/                    ← Estáticos (favicon, img que no se importan)
├── src/
│   ├── api/                   ← Instancias axios + funciones por entidad
│   │   ├── axiosConfig.js     ← baseURL desde import.meta.env.VITE_API_URL
│   │   └── clientApi.js       ← getAll(), create(), update(), remove()
│   ├── components/            ← Componentes reutilizables (UI puro)
│   │   ├── Navbar.jsx
│   │   ├── ClientCard.jsx
│   │   └── Modal.jsx
│   ├── hooks/                 ← Custom hooks (lógica reutilizable)
│   │   ├── useClients.js      ← fetch + estado de clientes
│   │   └── useFetch.js        ← hook genérico para GET
│   ├── pages/                 ← Vistas completas (una por ruta)
│   │   ├── HomePage.jsx
│   │   └── ClientPage.jsx
│   ├── context/               ← Context API para estado global
│   │   └── AuthContext.jsx
│   ├── utils/                 ← Funciones puras reutilizables
│   │   └── formatDate.js
│   ├── App.jsx                ← Rutas con <Routes> y <Route>
│   ├── main.jsx               ← <BrowserRouter> + <App />
│   └── index.css              ← @import 'tailwindcss'
├── .env                       ← VITE_API_URL=http://localhost:8080/api
├── index.html
├── package.json
└── vite.config.js`;

const REACT_NAMES = [
     { what: "Component / Page", rule: "PascalCase · extensión .jsx", example: "ClientCard.jsx → ClientCard(), ClientPage.jsx → ClientPage()", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
     { what: "Custom Hook", rule: "camelCase · prefijo use · extensión .js", example: "useClients.js → export function useClients() { }", color: "text-teal-400", bg: "bg-teal-500/8 border-teal-500/20" },
     { what: "API file", rule: "camelCase · sufijo Api · extensión .js", example: "clientApi.js → export const getAll = () => axios.get(...)", color: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20" },
     { what: "Context", rule: "PascalCase · sufijo Context · extensión .jsx", example: "AuthContext.jsx → export const AuthContext = createContext()", color: "text-pink-400", bg: "bg-pink-500/8 border-pink-500/20" },
     { what: "Utility", rule: "camelCase · extensión .js", example: "formatDate.js → export function formatDate(date) { }", color: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20" },
     { what: "Props / vars", rule: "camelCase siempre", example: "clientName, isLoading, onSubmit, handleClick", color: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20" },
];

const REACT_SNIPPET = `// src/api/axiosConfig.js
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// src/api/clientApi.js
import { api } from './axiosConfig';

export const getAll    = ()         => api.get('/clients');
export const getById   = (id)       => api.get(\`/clients/\${id}\`);
export const create    = (data)     => api.post('/clients', data);
export const update    = (id, data) => api.put(\`/clients/\${id}\`, data);
export const remove    = (id)       => api.delete(\`/clients/\${id}\`);

// src/hooks/useClients.js
import { useState, useEffect } from 'react';
import { getAll } from '../api/clientApi';

export function useClients() {
  const [clients, setClients]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    getAll()
      .then(res => setClients(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { clients, loading, error };
}`;

const PYTHON_BE_STACK = [
     { name: "Python 3.12", role: "Lenguaje del backend del proyecto", color: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20" },
     { name: "Flask", role: "Micro-framework REST ligero", color: "text-amber-400", bg: "bg-amber-500/8 border-amber-500/20" },
     { name: "SQLite", role: "Base de datos local — database.db en la raíz del proyecto", color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20" },
     { name: "Flask-CORS", role: "Habilita CORS para que React consuma la API sin errores", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
     { name: "python-dotenv", role: "Carga variables de entorno desde .env", color: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20" },
];

const PYTHON_BE_STRUCTURE = `vg-ms-{nombre}-be/
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
└── run.py                     ← Punto de entrada: python run.py`;

const DB_NAMING_SQLITE = [
     { element: "Tablas", rule: "snake_case · plural · inglés", good: "clients", bad: "Client, tbl_clientes" },
     { element: "Columnas", rule: "snake_case · inglés", good: "full_name, created_at", bad: "fullName, nombre" },
     { element: "Primary Key", rule: "siempre id", good: "id INTEGER AUTOINCREMENT", bad: "id_cliente" },
     { element: "Estado lógico", rule: "columna status · TEXT(1)", good: "status ('A' / 'I')", bad: "estado, activo" },
];

const SQLITE_TABLE_SQL = `-- schema.sql (SQLite)
CREATE TABLE clients (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name   TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    status      TEXT    NOT NULL DEFAULT 'A',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);`;

const PYTHON_BE_SNIPPET = `# app/settings.py
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
    application.run(debug=True)`;

const EXPO_STACK = [
     { name: "Expo SDK 54", role: "Framework — genera app iOS y Android desde un solo repo TS", color: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20" },
     { name: "React Native 0.81", role: "View, Text, FlatList, StyleSheet — sin divs ni HTML", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
     { name: "TypeScript 5.9", role: "Tipado estricto — archivos .tsx y .ts en todo el proyecto", color: "text-blue-400", bg: "bg-blue-500/8 border-blue-500/20" },
     { name: "Expo Router v6", role: "Navegación file-based dentro de app/ (tabs, stack, modals)", color: "text-pink-400", bg: "bg-pink-500/8 border-pink-500/20" },
     { name: "React Navigation", role: "Bottom tabs, Stack Navigator — @react-navigation/bottom-tabs", color: "text-teal-400", bg: "bg-teal-500/8 border-teal-500/20" },
     { name: "Async Storage", role: "Persistencia local — guardar tokens y preferencias", color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20" },
     { name: "React Native Reanimated", role: "Animaciones nativas de alto rendimiento", color: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20" },
     { name: "Expo Go", role: "App para probar en dispositivo físico escaneando el QR", color: "text-slate-400", bg: "bg-slate-500/8 border-slate-500/20" },
];

const EXPO_STEPS = [
     { n: 1, label: "Crear proyecto Expo", detail: "npx create-expo-app vg-ms-{nombre}-mobile → selecciona el default template (TypeScript) → cd vg-ms-nombre-mobile", img: android1, imgCaption: "Crear proyecto con create-expo-app", imgBadge: "Expo SDK 54", borderColor: "border-violet-500/20", bgColor: "bg-violet-500/5", borderTop: "border-violet-500/15", badgeColor: "text-violet-500/60" },
     { n: 2, label: "Instalar dependencias del proyecto", detail: "npm install @react-native-async-storage/async-storage @react-navigation/bottom-tabs @react-navigation/native react-native-reanimated react-native-gesture-handler", img: android2, imgCaption: "Instalar dependencias de navegación y storage", imgBadge: "Navigation · Storage", borderColor: "border-teal-500/20", bgColor: "bg-teal-500/5", borderTop: "border-teal-500/15", badgeColor: "text-teal-500/60" },
     { n: 3, label: "Correr en emulador / dispositivo", detail: "npx expo start → presiona 'a' para Android Emulator, 'i' para iOS Simulator, o escanea el QR con Expo Go en tu móvil físico", img: android3, imgCaption: "App corriendo en emulador Android", imgBadge: "Expo Go · Android", borderColor: "border-sky-500/20", bgColor: "bg-sky-500/5", borderTop: "border-sky-500/15", badgeColor: "text-sky-500/60" },
];

const EXPO_STRUCTURE = `vg-ms-{nombre}-mobile/
├── app/                           ← Expo Router: cada archivo = pantalla
│   ├── (tabs)/
│   │   ├── _layout.tsx            ← Config tabs: iconos, labels, colores
│   │   ├── index.tsx              ← Tab Home
│   │   └── explore.tsx            ← Tab Explorar (o el nombre del módulo)
│   ├── _layout.tsx                ← Root layout: Stack + SplashScreen + fuentes
│   └── login.tsx                  ← Pantalla pública (sin tabs)
├── components/
│   ├── common/                    ← Componentes reutilizables globales
│   │   ├── app-button.tsx         ← kebab-case siempre en archivos
│   │   ├── app-header.tsx
│   │   ├── app-input.tsx
│   │   ├── screen-container.tsx
│   │   └── index.ts               ← Barrel export: export * from './app-button'
│   └── ui/                        ← Componentes visuales específicos
├── constants/
│   ├── colors.ts              ← Paleta de colores de la app
│   ├── config.ts              ← BASE_URL, timeouts, claves públicas
│   └── theme.ts               ← Tipografía, espaciado, bordes
├── hooks/
│   ├── use-auth.ts            ← kebab-case: use-{nombre}.ts
│   └── use-theme.ts
├── services/                  ← Llamadas HTTP + AsyncStorage (no api/)
│   ├── auth.service.ts        ← {entidad}.service.ts
│   └── index.ts
├── store/                     ← Estado global (Zustand / Context)
│   ├── auth.store.tsx
│   └── theme.store.tsx
├── types/
│   ├── auth.types.ts          ← Interfaces y tipos TypeScript
│   └── index.ts               ← Re-exporta todos los tipos
├── utils/
│   ├── storage.ts             ← Wrappers de AsyncStorage
│   └── validators.ts          ← Funciones de validación de formularios
├── assets/images/             ← icon.png, splash-icon.png, etc.
├── app.json                   ← name, slug, icon, splash, scheme
├── expo-env.d.ts
├── tsconfig.json
└── package.json`;

const EXPO_NAMES = [
     { what: "Archivo (todos)", rule: "kebab-case · extensión .tsx / .ts", example: "app-button.tsx, use-auth.ts, auth.service.ts, auth.types.ts", color: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20" },
     { what: "Componente (función)", rule: "PascalCase dentro del archivo", example: "app-button.tsx → export function AppButton({ ... }) { }", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
     { what: "Custom Hook", rule: "camelCase · prefijo use · archivo kebab", example: "use-auth.ts → export function useAuth() { }", color: "text-teal-400", bg: "bg-teal-500/8 border-teal-500/20" },
     { what: "Service", rule: "Objeto/clase PascalCase · archivo kebab + .service", example: "auth.service.ts → export const AuthService = { login, logout }", color: "text-pink-400", bg: "bg-pink-500/8 border-pink-500/20" },
     { what: "Store", rule: "camelCase hook · archivo kebab + .store", example: "auth.store.tsx → export const useAuthStore = create(...)", color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20" },
     { what: "Tipo / Interfaz", rule: "PascalCase · archivo kebab + .types", example: "auth.types.ts → export interface LoginRequest { email: string }", color: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20" },
     { what: "Constante exportada", rule: "UPPER_SNAKE_CASE o camelCase en constants/", example: "colors.ts → export const PRIMARY = '#7c3aed'", color: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20" },
];

const EXPO_SNIPPET = `// components/common/app-button.tsx  ← StyleSheet nativo, sin Tailwind
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function AppButton({ label, onPress, variant = 'primary' }: AppButtonProps) {
  return (
    <TouchableOpacity style={[styles.base, styles[variant]]} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base:      { borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primary:   { backgroundColor: '#7c3aed' },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#7c3aed' },
  label:     { color: '#fff', fontWeight: '700', fontSize: 15 },
});

// services/auth.service.ts  ← services/ no api/, usa fetch + AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../constants/config';

export const AuthService = {
  login: async (email: string, password: string) => {
    const res = await fetch(\`\${BASE_URL}/auth/login\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },
  saveToken: (token: string) => AsyncStorage.setItem('token', token),
  getToken:  ()              => AsyncStorage.getItem('token'),
};

// hooks/use-auth.ts
import { useState } from 'react';
import { AuthService } from '../services/auth.service';

export function useAuth() {
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const data = await AuthService.login(email, password);
    await AuthService.saveToken(data.token);
    setLoading(false);
  };

  return { login, loading };
}`;

const COMMITS = [
     { type: "feat", color: "text-green-400 bg-green-500/10 border-green-500/25", desc: "New feature", ex: "feat(client): add POST /api/clients endpoint" },
     { type: "fix", color: "text-red-400 bg-red-500/10 border-red-500/25", desc: "Bug fix", ex: "fix(service): resolve NullPointerException in ClientService" },
     { type: "style", color: "text-pink-400 bg-pink-500/10 border-pink-500/25", desc: "CSS / HTML style changes", ex: "style: adjust padding in client-list component" },
     { type: "refactor", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/25", desc: "Refactor without behavior change", ex: "refactor: move logic from Rest to ClientService" },
     { type: "docs", color: "text-sky-400 bg-sky-500/10 border-sky-500/25", desc: "Documentation changes", ex: "docs: add Swagger annotations to ClientRest" },
     { type: "chore", color: "text-slate-400 bg-slate-500/10 border-slate-500/25", desc: "Maintenance and config", ex: "chore: add .gitignore for venv and __pycache__" },
     { type: "test", color: "text-violet-400 bg-violet-500/10 border-violet-500/25", desc: "Unit / integration tests", ex: "test: add unit test to ClientService with pytest" },
     { type: "perf", color: "text-orange-400 bg-orange-500/10 border-orange-500/25", desc: "Performance improvements", ex: "perf: add index to email field in MongoDB" },
];

function FileIcon({ type }) {
     if (type === "dir") return <span style={{ fontSize: 11, marginRight: 5, color: '#38bdf8', verticalAlign: 'middle' }}>▸</span>;
     return <span style={{ fontSize: 10, marginRight: 5, color: '#475569', verticalAlign: 'middle' }}>◦</span>;
}

function FileTree({ code }) {
     return (
          <pre className="text-xs leading-relaxed p-4 overflow-x-auto font-mono">
               {code.split('\n').map((line, i) => {
                    const isDir = line.includes('/') && !line.includes('.') && !line.includes('←');
                    const isComment = line.includes('←');
                    const trimmed = line.replace(/[├└│─\s]+/, '');
                    const type = isDir ? 'dir' : 'file';
                    return (
                         <div key={i} className="flex items-start">
                              <span className="text-slate-600 select-none whitespace-pre">{line.replace(trimmed, '')}</span>
                              <FileIcon type={type} />
                              <span className={isComment ? 'text-slate-500' : isDir ? 'text-sky-400' : 'text-slate-300'}>
                                   {trimmed}
                              </span>
                         </div>
                    );
               })}
          </pre>
     );
}

function StepCard({ step, onImgClick }) {
     return (
          <div>
               <div className="flex gap-4 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
                    <span className="shrink-0 w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs font-black font-mono mt-0.5">
                         {step.n}
                    </span>
                    <div>
                         <p className="text-emerald-300 text-sm font-semibold mb-0.5">{step.label}</p>
                         <p className="text-slate-400 text-sm leading-relaxed">{step.detail}</p>
                    </div>
               </div>
               {step.img && (
                    <div className={`mt-2 rounded-2xl border ${step.borderColor} ${step.bgColor} overflow-hidden`}>
                         <div className={`flex items-center gap-2 px-4 py-2.5 border-b ${step.borderTop}`}>
                              <div className="flex gap-1.5">
                                   <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-green-500/60" />
                              </div>
                              <span className="text-slate-500 text-xs font-mono ml-2">Paso {step.n} — {step.imgCaption}</span>
                              <span className={`ml-auto ${step.badgeColor} text-[10px] font-mono uppercase tracking-widest`}>{step.imgBadge}</span>
                         </div>
                         <img
                              src={step.img}
                              alt={step.imgCaption}
                              className="w-full object-cover cursor-zoom-in transition-transform duration-200 hover:scale-[1.01]"
                              onClick={() => onImgClick({ src: step.img, alt: step.imgCaption })}
                         />
                    </div>
               )}
          </div>
     );
}

function CodeBlock({ filename, code }) {
     return (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
               <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                    <div className="flex gap-1.5">
                         <span className="w-3 h-3 rounded-full bg-red-500/60" />
                         <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                         <span className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-slate-500 text-xs font-mono ml-2">{filename}</span>
               </div>
               <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-slate-300 whitespace-pre">{code}</pre>
          </div>
     );
}

export default function Semester4() {
     const [activeProject, setActiveProject] = useState("webflux");
     const [dbChoice, setDbChoice] = useState("oracle");
     const [lightbox, setLightbox] = useState(null);

     const projectColors = {
          webflux: { active: "bg-emerald-600/20 border-emerald-500/50 text-emerald-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300" },
          react: { active: "bg-sky-600/20 border-sky-500/50 text-sky-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300" },
          expo: { active: "bg-violet-600/20 border-violet-500/50 text-violet-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300" },
     };

     return (<>
          <div className="min-h-full px-6 md:px-10 py-10 max-w-5xl mx-auto space-y-14">

               <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                         <span className="bg-violet-600/20 border border-violet-600/40 text-violet-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                              Semestre IV
                         </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
                         Full Stack Avanzado
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
                         Migración del backend a{" "}
                         <span className="text-emerald-400 font-semibold">Spring WebFlux</span> reactivo,
                         proyecto de automatización web con{" "}
                         <span className="text-sky-400 font-semibold">React JS + Tailwind</span> y aplicación móvil nativa con{" "}
                         <span className="text-violet-400 font-semibold">Expo + React Native</span>.
                    </p>
               </motion.div>

               <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-4">
                         <div className="w-1 h-5 bg-violet-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Proyectos del ciclo</h2>
                    </div>
                    <p className="text-slate-500 text-sm mb-5">Selecciona el proyecto para ver sus estándares, estructura y configuración.</p>
                    <div className="flex flex-wrap gap-2">
                         {PROJECTS.map((p) => (
                              <button
                                   key={p.id}
                                   onClick={() => setActiveProject(p.id)}
                                   className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 ${activeProject === p.id ? projectColors[p.id].active : projectColors[p.id].inactive}`}
                              >
                                   <span>{p.icon}</span>
                                   <span>{p.label}</span>
                                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.tagBg}`}>{p.badge}</span>
                              </button>
                         ))}
                    </div>
               </motion.div>

               <AnimatePresence mode="wait">

                    {activeProject === "webflux" && (
                         <motion.div key="webflux" custom={2} variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }} className="space-y-10">

                              <div>
                                   <div className="flex items-center gap-3 mb-2">
                                        <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Stack tecnológico — WebFlux</h2>
                                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">Reactivo</span>
                                   </div>
                                   <p className="text-slate-500 text-sm mb-3 max-w-2xl">Misma base que Semestre III pero migrado a programación reactiva no-bloqueante. El frontend Angular se mantiene igual. Elige la base de datos del proyecto:</p>
                                   <div className="flex items-center gap-3 mb-5">
                                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Base de datos:</span>
                                        <div className="flex rounded-xl border border-slate-800 overflow-hidden">
                                             <button
                                                  onClick={() => setDbChoice("oracle")}
                                                  className={`px-4 py-1.5 text-xs font-bold transition-all border-r border-slate-800 ${dbChoice === "oracle" ? "bg-red-500/15 text-red-300" : "text-slate-500 hover:text-slate-300"
                                                       }`}
                                             >
                                                  Oracle DB
                                             </button>
                                             <button
                                                  onClick={() => setDbChoice("mongo")}
                                                  className={`px-4 py-1.5 text-xs font-bold transition-all ${dbChoice === "mongo" ? "bg-green-500/15 text-green-300" : "text-slate-500 hover:text-slate-300"
                                                       }`}
                                             >
                                                  MongoDB
                                             </button>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {(dbChoice === "mongo" ? WEBFLUX_STACK_MONGO : WEBFLUX_STACK_ORACLE).map((t) => (
                                             <div key={t.name} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${t.bg}`}>
                                                  <p className={`text-sm font-bold ${t.color}`}>{t.name}</p>
                                                  <p className="text-slate-500 text-xs ml-auto text-right">{t.role}</p>
                                             </div>
                                        ))}
                                   </div>
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-2">
                                        <div className="w-1 h-5 bg-teal-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Qué cambia respecto a Semestre III</h2>
                                   </div>
                                   <p className="text-slate-500 text-sm mb-4 max-w-2xl">Cada fila muestra lo que se usaba en MVC y su equivalente reactivo en WebFlux.</p>
                                   <div className="rounded-2xl border border-slate-800 overflow-hidden">
                                        <div className="grid grid-cols-3 bg-slate-900/80 border-b border-slate-800 px-4 py-2">
                                             <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Concepto</span>
                                             <span className="text-rose-400/70 text-xs font-bold uppercase tracking-widest">MVC (Sem. III)</span>
                                             <span className="text-emerald-400/70 text-xs font-bold uppercase tracking-widest">WebFlux (Sem. IV)</span>
                                        </div>
                                        {WEBFLUX_MIGRATION.map((row) => (
                                             <div key={row.what} className="grid grid-cols-3 px-4 py-3 border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30 transition-colors">
                                                  <span className={`text-xs font-semibold ${row.color}`}>{row.what}</span>
                                                  <span className="text-slate-500 text-xs font-mono">{row.mvc}</span>
                                                  <span className="text-emerald-300 text-xs font-mono">{row.reactive ?? (dbChoice === "mongo" ? row.reactiveMongo : row.reactiveOracle)}</span>
                                             </div>
                                        ))}
                                   </div>
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-2">
                                        <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Arquitectura de paquetes</h2>
                                   </div>
                                   <div className="space-y-2 mb-6">
                                        {WEBFLUX_PACKAGES.map((pkg) => (
                                             <div key={pkg.pkg} className={`flex gap-4 rounded-xl border px-4 py-3 ${pkg.bg}`}>
                                                  <span className={`shrink-0 font-black font-mono text-sm w-24 pt-0.5 ${pkg.accent}`}>{pkg.pkg}/</span>
                                                  <div>
                                                       <p className="text-slate-300 text-sm leading-relaxed">{pkg.desc}</p>
                                                       <p className="text-slate-500 text-xs mt-1 font-mono">{pkg.example}</p>
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-4">
                                        <div className="w-1 h-5 bg-teal-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Estructura y configuración</h2>
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                                             <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                                                  <div className="flex gap-1.5">
                                                       <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                                       <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                                       <span className="w-3 h-3 rounded-full bg-green-500/60" />
                                                  </div>
                                                  <span className="text-slate-500 text-xs font-mono ml-2">estructura-webflux/</span>
                                             </div>
                                             <FileTree code={dbChoice === "mongo" ? WEBFLUX_STRUCTURE_MONGO : WEBFLUX_STRUCTURE_ORACLE} />
                                        </div>
                                        <div className="space-y-4">
                                             <CodeBlock filename={dbChoice === "mongo" ? "application.yaml — MongoDB" : "application.yaml — Oracle R2DBC"} code={dbChoice === "mongo" ? WEBFLUX_YAML_MONGO : WEBFLUX_YAML_ORACLE} lang="yaml" />
                                        </div>
                                   </div>
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-4">
                                        <div className="w-1 h-5 bg-cyan-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Código reactivo — ejemplo CRUD</h2>
                                   </div>
                                   <CodeBlock filename="Client.java · ClientService.java · ClientServiceImpl.java · ClientRest.java" code={dbChoice === "mongo" ? WEBFLUX_SNIPPET_MONGO : WEBFLUX_SNIPPET_ORACLE} lang="java" />
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-2">
                                        <div className="w-1 h-5 bg-red-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Base de datos — Nomenclatura {dbChoice === "mongo" ? "MongoDB" : "Oracle"}</h2>
                                        <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">Inglés obligatorio</span>
                                   </div>
                                   <p className="text-slate-500 text-sm mb-4 max-w-2xl">Ver estándar completo en <span className="text-teal-400 font-medium">Convenciones → Base de Datos</span>.</p>
                                   <div className="rounded-2xl border border-slate-800 overflow-hidden mb-6">
                                        <div className="grid grid-cols-4 bg-slate-900/80 border-b border-slate-800 px-4 py-2">
                                             <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Elemento</span>
                                             <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Regla</span>
                                             <span className="text-emerald-400/70 text-xs font-bold uppercase tracking-widest">Correcto ✓</span>
                                             <span className="text-red-400/70 text-xs font-bold uppercase tracking-widest">Incorrecto ✗</span>
                                        </div>
                                        {(dbChoice === "mongo" ? DB_NAMING_MONGO_R2DBC : DB_NAMING_ORACLE).map((row, i) => (
                                             <div key={i} className="grid grid-cols-4 px-4 py-3 border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30 transition-colors">
                                                  <span className="text-xs font-semibold text-slate-300">{row.element}</span>
                                                  <span className="text-slate-400 text-xs">{row.rule}</span>
                                                  <span className="text-emerald-300 text-xs font-mono">{row.good}</span>
                                                  <span className="text-red-400/70 text-xs font-mono line-through">{row.bad}</span>
                                             </div>
                                        ))}
                                   </div>
                                   <CodeBlock filename={dbChoice === "mongo" ? "documento — clients" : "schema.sql"} code={dbChoice === "mongo" ? MONGO_R2DBC_EXAMPLE : ORACLE_TABLE_SQL} lang={dbChoice === "mongo" ? "json" : "sql"} />
                              </div>

                              <div>
                                   <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-3">Dependencias en Spring Initializr</p>
                                   <div className="flex flex-wrap gap-2">
                                        {(dbChoice === "mongo" ? WEBFLUX_DEPS_MONGO : WEBFLUX_DEPS_ORACLE).map((d) => (
                                             <span key={d.name} className={`text-xs font-bold font-mono px-3 py-1.5 rounded-xl border ${d.color}`}>{d.name}</span>
                                        ))}
                                   </div>
                              </div>
                         </motion.div>
                    )}

                    {activeProject === "react" && (
                         <motion.div key="react" custom={2} variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }} className="space-y-10">

                              <div>
                                   <div className="flex items-center gap-3 mb-2">
                                        <div className="w-1 h-5 bg-sky-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Stack tecnológico — Automatización</h2>
                                        <span className="bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">Full Stack</span>
                                   </div>
                                   <p className="text-slate-500 text-sm mb-1 max-w-2xl">Proyecto web <span className="text-sky-400 font-semibold">full-stack de automatización</span>. Backend con <span className="text-yellow-400 font-semibold">Python 3.12 + Flask</span> y base de datos <span className="text-emerald-400 font-semibold">SQLite</span>. Frontend con <span className="text-sky-400 font-semibold">React 19 + Vite</span> en JavaScript puro — sin TypeScript.</p>
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-2">
                                        <div className="w-1 h-5 bg-amber-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Backend — Python + Flask</h2>
                                        <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">Python · Flask · SQLite</span>
                                   </div>
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {PYTHON_BE_STACK.map((t) => (
                                             <div key={t.name} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${t.bg}`}>
                                                  <p className={`text-sm font-bold ${t.color}`}>{t.name}</p>
                                                  <p className="text-slate-500 text-xs ml-auto text-right">{t.role}</p>
                                             </div>
                                        ))}
                                   </div>
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-4">
                                        <div className="w-1 h-5 bg-amber-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Estructura del backend</h2>
                                   </div>
                                   <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6">
                                        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                                             <div className="flex gap-1.5">
                                                  <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                                  <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                                  <span className="w-3 h-3 rounded-full bg-green-500/60" />
                                             </div>
                                             <span className="text-slate-500 text-xs font-mono ml-2">vg-ms-nombre-be/</span>
                                        </div>
                                        <FileTree code={PYTHON_BE_STRUCTURE} />
                                   </div>
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-4">
                                        <div className="w-1 h-5 bg-amber-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Código del backend — patrón por capas</h2>
                                   </div>
                                   <CodeBlock filename="settings.py · {entidad}_service.py · {entidad}_routes.py · run.py" code={PYTHON_BE_SNIPPET} lang="python" />
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-2">
                                        <div className="w-1 h-5 bg-red-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Base de datos — Nomenclatura SQLite</h2>
                                        <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">Inglés obligatorio</span>
                                   </div>
                                   <p className="text-slate-500 text-sm mb-4 max-w-2xl">Ver estándar completo en <span className="text-teal-400 font-medium">Convenciones → Base de Datos</span>.</p>
                                   <div className="rounded-2xl border border-slate-800 overflow-hidden mb-6">
                                        <div className="grid grid-cols-4 bg-slate-900/80 border-b border-slate-800 px-4 py-2">
                                             <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Elemento</span>
                                             <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Regla</span>
                                             <span className="text-emerald-400/70 text-xs font-bold uppercase tracking-widest">Correcto ✓</span>
                                             <span className="text-red-400/70 text-xs font-bold uppercase tracking-widest">Incorrecto ✗</span>
                                        </div>
                                        {DB_NAMING_SQLITE.map((row, i) => (
                                             <div key={i} className="grid grid-cols-4 px-4 py-3 border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30 transition-colors">
                                                  <span className="text-xs font-semibold text-slate-300">{row.element}</span>
                                                  <span className="text-slate-400 text-xs">{row.rule}</span>
                                                  <span className="text-emerald-300 text-xs font-mono">{row.good}</span>
                                                  <span className="text-red-400/70 text-xs font-mono line-through">{row.bad}</span>
                                             </div>
                                        ))}
                                   </div>
                                   <CodeBlock filename="schema.sql" code={SQLITE_TABLE_SQL} lang="sql" />
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-2">
                                        <div className="w-1 h-5 bg-sky-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Frontend — React + Vite</h2>
                                        <span className="bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">React · JS · Tailwind</span>
                                   </div>
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {REACT_STACK.map((t) => (
                                             <div key={t.name} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${t.bg}`}>
                                                  <p className={`text-sm font-bold ${t.color}`}>{t.name}</p>
                                                  <p className="text-slate-500 text-xs ml-auto text-right">{t.role}</p>
                                             </div>
                                        ))}
                                   </div>
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-2">
                                        <div className="w-1 h-5 bg-sky-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Crear proyecto React + Vite</h2>
                                   </div>
                                   <div className="space-y-4 mb-6">
                                        {REACT_STEPS.map((step) => (
                                             <StepCard key={step.n} step={step} onImgClick={setLightbox} />
                                        ))}
                                   </div>
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-4">
                                        <div className="w-1 h-5 bg-teal-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Estructura del proyecto</h2>
                                   </div>
                                   <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6">
                                        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                                             <div className="flex gap-1.5">
                                                  <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                                  <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                                  <span className="w-3 h-3 rounded-full bg-green-500/60" />
                                             </div>
                                             <span className="text-slate-500 text-xs font-mono ml-2">estructura-react/</span>
                                        </div>
                                        <FileTree code={REACT_STRUCTURE} />
                                   </div>
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-4">
                                        <div className="w-1 h-5 bg-violet-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Convención de nombres</h2>
                                   </div>
                                   <div className="space-y-2 mb-6">
                                        {REACT_NAMES.map((n) => (
                                             <div key={n.what} className={`rounded-xl border px-4 py-3 ${n.bg}`}>
                                                  <div className="flex items-center gap-3 mb-1">
                                                       <span className={`text-sm font-bold ${n.color}`}>{n.what}</span>
                                                       <span className="text-slate-500 text-xs font-mono">{n.rule}</span>
                                                  </div>
                                                  <p className="text-slate-400 text-xs font-mono">{n.example}</p>
                                             </div>
                                        ))}
                                   </div>
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-4">
                                        <div className="w-1 h-5 bg-blue-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Consumir API REST — patrón estándar</h2>
                                   </div>
                                   <CodeBlock filename="axiosConfig.js · clientApi.js · useClients.js" code={REACT_SNIPPET} lang="js" />
                              </div>
                         </motion.div>
                    )}

                    {activeProject === "expo" && (
                         <motion.div key="expo" custom={2} variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }} className="space-y-10">

                              <div>
                                   <div className="flex items-center gap-3 mb-2">
                                        <div className="w-1 h-5 bg-violet-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Stack tecnológico — Móvil</h2>
                                        <span className="bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">Expo · React Native</span>
                                   </div>
                                   <p className="text-slate-500 text-sm mb-5 max-w-2xl">Aplicación móvil nativa con <span className="text-violet-400 font-semibold">Expo SDK 54 + TypeScript</span>. Arquitectura por capas: <span className="text-sky-400 font-semibold">services/</span> para HTTP + AsyncStorage, <span className="text-teal-400 font-semibold">store/</span> para estado global, <span className="text-pink-400 font-semibold">hooks/</span> para lógica reutilizable. Estilos con <span className="text-orange-400 font-semibold">StyleSheet</span> nativo, sin Tailwind.</p>
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {EXPO_STACK.map((t) => (
                                             <div key={t.name} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${t.bg}`}>
                                                  <p className={`text-sm font-bold ${t.color}`}>{t.name}</p>
                                                  <p className="text-slate-500 text-xs ml-auto text-right">{t.role}</p>
                                             </div>
                                        ))}
                                   </div>
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-2">
                                        <div className="w-1 h-5 bg-violet-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Configurar proyecto Expo</h2>
                                   </div>
                                   <div className="space-y-4 mb-6">
                                        {EXPO_STEPS.map((step) => (
                                             <StepCard key={step.n} step={step} onImgClick={setLightbox} />
                                        ))}
                                   </div>
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-4">
                                        <div className="w-1 h-5 bg-teal-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Estructura del proyecto</h2>
                                   </div>
                                   <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6">
                                        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                                             <div className="flex gap-1.5">
                                                  <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                                  <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                                  <span className="w-3 h-3 rounded-full bg-green-500/60" />
                                             </div>
                                             <span className="text-slate-500 text-xs font-mono ml-2">vg-ms-nombre-mobile/</span>
                                        </div>
                                        <FileTree code={EXPO_STRUCTURE} />
                                   </div>
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-4">
                                        <div className="w-1 h-5 bg-violet-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Convención de nombres</h2>
                                   </div>
                                   <div className="space-y-2 mb-6">
                                        {EXPO_NAMES.map((n) => (
                                             <div key={n.what} className={`rounded-xl border px-4 py-3 ${n.bg}`}>
                                                  <div className="flex items-center gap-3 mb-1">
                                                       <span className={`text-sm font-bold ${n.color}`}>{n.what}</span>
                                                       <span className="text-slate-500 text-xs font-mono">{n.rule}</span>
                                                  </div>
                                                  <p className="text-slate-400 text-xs font-mono">{n.example}</p>
                                             </div>
                                        ))}
                                   </div>
                              </div>

                              <div>
                                   <div className="flex items-center gap-3 mb-4">
                                        <div className="w-1 h-5 bg-sky-500 rounded-full" />
                                        <h2 className="text-white font-bold text-lg">Componente nativo + consumo de API</h2>
                                   </div>
                                   <CodeBlock filename="app-button.tsx · auth.service.ts · use-auth.ts" code={EXPO_SNIPPET} />
                              </div>
                         </motion.div>
                    )}

               </AnimatePresence>

               <motion.div custom={7} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="w-1 h-5 bg-violet-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Conventional Commits</h2>
                         <span className="bg-slate-700/50 border border-slate-700 text-slate-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">Todos los proyectos</span>
                    </div>
                    <p className="text-slate-500 text-sm mb-4 max-w-2xl">
                         Formato: <span className="font-mono text-slate-300">{"<type>(<scope>): <description>"}</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                         {COMMITS.map((c) => (
                              <div key={c.type} className={`rounded-xl border px-4 py-3 ${c.color}`}>
                                   <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono font-black text-sm">{c.type}</span>
                                        <span className="text-xs opacity-70">{c.desc}</span>
                                   </div>
                                   <p className="font-mono text-[11px] opacity-60 leading-relaxed">{c.ex}</p>
                              </div>
                         ))}
                    </div>
               </motion.div>

          </div>

          <AnimatePresence>
               {lightbox && (
                    <motion.div
                         className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         transition={{ duration: 0.2 }}
                         onClick={() => setLightbox(null)}
                    >
                         <motion.div
                              className="relative max-w-5xl w-full"
                              initial={{ scale: 0.55, opacity: 0, y: 40 }}
                              animate={{ scale: 1, opacity: 1, y: 0 }}
                              exit={{ scale: 0.55, opacity: 0, y: 40 }}
                              transition={{ type: "spring", stiffness: 280, damping: 22 }}
                              onClick={(e) => e.stopPropagation()}
                         >
                              <img
                                   src={lightbox.src}
                                   alt={lightbox.alt}
                                   className="w-full max-h-[88vh] object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
                              />
                              <p className="text-center text-slate-400 text-xs mt-3 font-mono">{lightbox.alt}</p>
                              <button
                                   onClick={() => setLightbox(null)}
                                   className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center text-sm font-bold transition-colors"
                              >
                                   ✕
                              </button>
                         </motion.div>
                    </motion.div>
               )}
          </AnimatePresence>
     </>);
}
