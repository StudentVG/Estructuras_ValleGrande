import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import spring0 from "../../assets/tercero/Springboot0.png";
import spring1 from "../../assets/tercero/Springboot1.png";
import spring2 from "../../assets/tercero/Springboot2.png";
import spring3 from "../../assets/tercero/Springboot3.png";

const fadeUp = {
     hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
     show: (i = 0) => ({
          opacity: 1, y: 0, filter: "blur(0px)",
          transition: { duration: 0.5, ease: "easeOut", delay: i * 0.08 },
     }),
};

const TECH_STACK = [
     {
          track: "Backend",
          accent: "emerald",
          techs: [
               { name: "Java 17", role: "Lenguaje del servidor", color: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20" },
               { name: "Spring Boot 3", role: "Framework backend REST", color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20" },
               { name: "Spring Data JPA", role: "Capa de persistencia ORM", color: "text-teal-400", bg: "bg-teal-500/8 border-teal-500/20" },
               { name: "SQL Server", role: "Base de datos relacional", color: "text-red-400", bg: "bg-red-500/8 border-red-500/20" },
               { name: "Maven", role: "Gestión de dependencias", color: "text-amber-400", bg: "bg-amber-500/8 border-amber-500/20" },
               { name: "Lombok", role: "Reduce código boilerplate", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
               { name: "IntelliJ IDEA", role: "IDE oficial del ciclo", color: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20" },
          ],
     },
     {
          track: "Frontend",
          accent: "rose",
          techs: [
               { name: "Angular 17+", role: "Framework SPA", color: "text-rose-400", bg: "bg-rose-500/8 border-rose-500/20" },
               { name: "TypeScript", role: "Tipado estático en Angular", color: "text-blue-400", bg: "bg-blue-500/8 border-blue-500/20" },
               { name: "HTML & CSS", role: "Estructura y estilos base", color: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20" },
               { name: "Bootstrap 5 ó Tailwind", role: "Framework CSS — el equipo elige uno", color: "text-indigo-400", bg: "bg-indigo-500/8 border-indigo-500/20" },
               { name: "RxJS", role: "Ya viene con Angular — HttpClient retorna Observable", color: "text-pink-400", bg: "bg-pink-500/8 border-pink-500/20" },
               { name: "VS Code / IntelliJ", role: "Editor de frontend", color: "text-slate-400", bg: "bg-slate-500/8 border-slate-500/20" },
          ],
     },
];

const SPRING_PACKAGES = [
     { pkg: "rest", accent: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20", desc: "Endpoints REST. Recibe peticiones HTTP y delega al service.", suffix: "Sufijo Rest", example: "ClientRest, ProductRest" },
     { pkg: "service", accent: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20", desc: "Lógica de negocio. Interfaz obligatoria + sub-paquete impl/ con @Service.", suffix: "Interfaz + impl/Impl", example: "ClientService (interfaz), impl/ClientServiceImpl" },
     { pkg: "repository", accent: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20", desc: "Acceso a datos. Extiende JpaRepository o CrudRepository.", suffix: "Sufijo Repository", example: "ClientRepository" },
     { pkg: "model", accent: "text-indigo-400", bg: "bg-indigo-500/8 border-indigo-500/20", desc: "Entidades JPA. Mapea cada tabla de SQL Server con @Entity.", suffix: "", example: "Client, Product" },
     { pkg: "dto", accent: "text-pink-400", bg: "bg-pink-500/8 border-pink-500/20", desc: "Objetos de transferencia. Si hay muchas entidades, subcarpeta por entidad (dto/client/, dto/product/).", suffix: "Sufijo Dto o Request/Response", example: "dto/client/ClientDto.java" },
     { pkg: "exception", accent: "text-red-400", bg: "bg-red-500/8 border-red-500/20", desc: "Manejo global de errores con @RestControllerAdvice y excepciones custom.", suffix: "", example: "GlobalExceptionHandler, ResourceNotFoundException" },
     { pkg: "config", accent: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20", desc: "Configuraciones de Spring (@Configuration). CORS, Security, Beans.", suffix: "Sufijo Config", example: "CorsConfig, SecurityConfig" },
     { pkg: "util", accent: "text-green-400", bg: "bg-green-500/8 border-green-500/20", desc: "Clases utilitarias sin estado. Constantes, validadores, helpers.", suffix: "", example: "DateUtil, Constants" },
];

const SPRING_STRUCTURE = `mi-proyecto/                    ← nombre del proyecto en kebab-case
├── database/                      ← FUERA de src/, junto a pom.xml
│   └── schema.sql                 ← script de tablas (ver 05_BASE_DATOS.md)
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── pe/
│   │   │       └── edu/
│   │   │           └── vallegrande/
│   │   │               └── vg-ms-{}/
│   │   │                   ├── config/
│   │   │                   │   └── CorsConfig.java     ← DatabaseConfig.java opcional aquí
│   │   │                   ├── rest/
│   │   │                   │   └── ClientRest.java
│   │   │                   ├── service/
│   │   │                   │   ├── ClientService.java      ← INTERFAZ
│   │   │                   │   └── impl/
│   │   │                   │       └── ClientServiceImpl.java
│   │   │                   ├── repository/
│   │   │                   │   └── ClientRepository.java
│   │   │                   ├── model/
│   │   │                   │   └── Client.java
│   │   │                   ├── dto/                       ← pocos DTOs: van sueltos aquí
│   │   │                   │   ├── client/                ← muchos DTOs: subcarpeta por entidad
│   │   │                   │   │   ├── ClientDto.java
│   │   │                   │   │   ├── ClientRequest.java
│   │   │                   │   │   └── ClientResponse.java
│   │   │                   │   └── product/
│   │   │                   │       ├── ProductDto.java
│   │   │                   │       └── ProductResponse.java
│   │   │                   ├── exception/
│   │   │                   │   └── GlobalExceptionHandler.java
│   │   │                   └── VGMS{}Application.java
│   │   └── resources/
│   │       ├── application.yaml        ← SQL Server connection
│   │       └── static/
│   └── test/
│       └── java/
│           └── pe/edu/vallegrande/vg-ms-{}/
└── pom.xml                     ← dependencias Maven`;

const APP_PROPERTIES = `spring:
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
  port: 8080`;

const DB_NAMING_SQLSERVER = [
     { element: "Tablas", rule: "snake_case · plural · inglés", good: "clients, purchase_orders", bad: "Client, tbl_Clientes" },
     { element: "Columnas", rule: "snake_case · inglés", good: "full_name, created_at", bad: "FullName, fch_creacion" },
     { element: "Primary Key", rule: "siempre id", good: "id BIGINT IDENTITY(1,1)", bad: "id_cliente, clientId" },
     { element: "Foreign Key", rule: "{tabla_singular}_id", good: "category_id", bad: "categoryId, id_categoria" },
     { element: "Booleanos (dominio, no ciclo de vida)", rule: "prefijo is_ / has_ · tipo BIT", good: "is_verified", bad: "is_active junto a status" },
     { element: "Estado lógico", rule: "columna status · CHAR(1) — única fuente de verdad", good: "status ('A' / 'I')", bad: "estado, is_deleted, is_active" },
];

const ENTITY_SQLSERVER_TABLE = `-- schema.sql (SQL Server)
CREATE TABLE clients (
    id              BIGINT IDENTITY(1,1) PRIMARY KEY,
    full_name       VARCHAR(100)  NOT NULL,
    email           VARCHAR(150)  NOT NULL UNIQUE,
    status          CHAR(1)       NOT NULL DEFAULT 'A',   -- único campo del ciclo de vida
    created_at      DATETIME2     NOT NULL DEFAULT GETDATE(),
    updated_at      DATETIME2     NOT NULL DEFAULT GETDATE()
);`;

const SERVICE_SNIPPET = `// service/ClientService.java — INTERFAZ obligatoria (especificación)
public interface ClientService {
    List<ClientDto> findAll();
    ClientDto findById(Long id);
    ClientDto create(ClientDto dto);
    ClientDto update(Long id, ClientDto dto);
    void delete(Long id);
}

// service/impl/ClientServiceImpl.java — IMPLEMENTACIÓN
@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final ClientRepository repository;

    @Override
    public List<ClientDto> findAll() {
        return repository.findByStatus("A").stream()
            .map(this::toDto)
            .toList();
    }

    @Override
    public ClientDto create(ClientDto dto) {
        Client saved = repository.save(toEntity(dto));
        return toDto(saved);
    }
    // ...resto de métodos + mapeo Entity <-> Dto
}

// rest/ClientRest.java — inyecta la INTERFAZ, nunca el Impl
@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientRest {
    private final ClientService service;   // ← tipo interfaz
    // Spring inyecta ClientServiceImpl automáticamente
}`;

const ENTITY_SQLSERVER_JAVA = `// model/Client.java — Entidad JPA mapeada a SQL Server
@Entity
@Table(name = "clients")              // tabla: snake_case, plural, inglés
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                  // PK: siempre "id"

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;          // columna snake_case ↔ campo Java camelCase

    @Column(unique = true, nullable = false, length = 150)
    private String email;

    @Column(length = 1, columnDefinition = "CHAR(1) DEFAULT 'A'")
    private String status;            // único campo del ciclo de vida: 'A' (activo) / 'I' (inactivo)

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

// repository/ClientRepository.java
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);
    List<Client> findByStatus(String status);   // soft delete: solo status = 'A'
}`;

const ANGULAR_STRUCTURE = `mi-proyecto-frontend/          ← ng new mi-proyecto-frontend
├── src/
│   ├── app/
│   │   ├── core/                          ← servicios singleton, guards
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts
│   │   │   └── services/
│   │   │       └── auth.service.ts
│   │   ├── shared/                        ← componentes reutilizables
│   │   │   ├── components/
│   │   │   │   └── navbar/
│   │   │   ├── pipes/
│   │   │   │   └── status-label.pipe.ts
│   │   │   └── models/
│   │   │       └── client.model.ts
│   │   ├── modules/                       ← un módulo por dominio
│   │   │   └── client/
│   │   │       ├── components/
│   │   │       │   ├── client-list/
│   │   │       │   │   ├── client-list.component.ts
│   │   │       │   │   └── client-list.component.html
│   │   │       │   └── client-form/
│   │   │       │       ├── client-form.component.ts
│   │   │       │       └── client-form.component.html
│   │   │       ├── services/
│   │   │       │   └── client.service.ts
│   │   │       └── client.module.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── assets/
│   ├── environments/
│   │   ├── environment.ts               ← apiUrl para dev
│   │   └── environment.prod.ts
│   └── index.html
├── angular.json
├── package.json
└── tsconfig.json`;

const ANGULAR_NAMES = [
     { what: "Component", rule: "kebab-case + .component.ts", example: "client-list.component.ts → ClientListComponent", color: "text-rose-400", bg: "bg-rose-500/8 border-rose-500/20" },
     { what: "Service", rule: "kebab-case + .service.ts", example: "client.service.ts → ClientService", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
     { what: "Model/Interface", rule: "kebab-case + .model.ts", example: "client.model.ts → interface Client { }", color: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20" },
     { what: "Module", rule: "kebab-case + .module.ts", example: "client.module.ts → ClientModule", color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20" },
     { what: "Guard", rule: "kebab-case + .guard.ts", example: "auth.guard.ts → AuthGuard", color: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20" },
     { what: "Interceptor", rule: "kebab-case + .interceptor.ts", example: "auth.interceptor.ts → AuthInterceptor", color: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20" },
     { what: "Pipe", rule: "kebab-case + .pipe.ts", example: "status-label.pipe.ts → StatusLabelPipe", color: "text-pink-400", bg: "bg-pink-500/8 border-pink-500/20" },
];

const PIPE_SNIPPET = `// shared/pipes/status-label.pipe.ts
// Transforma el status del backend ('A' / 'I') en un texto legible.
// No es obligatorio: Angular ya trae pipes built-in (date, currency,
// uppercase) que cubren la mayoría de casos. Un pipe custom solo se
// crea cuando hay una transformación propia del dominio que se repite
// en varias vistas — como este caso de 'status'.
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
  transform(status: string): string {
    return status === 'A' ? 'Activo' : 'Inactivo';
  }
}

// client-list.component.html — uso en el template
// <span>{{ client.status | statusLabel }}</span>`;

const ENV_SNIPPET = `// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};

// src/app/modules/client/services/client.service.ts
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private url = \`\${environment.apiUrl}/clients\`;

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Client[]>(this.url); }
  create(c: Client) { return this.http.post(this.url, c); }
  update(id: number, c: Client) { return this.http.put(\`\${this.url}/\${id}\`, c); }
  delete(id: number) { return this.http.delete(\`\${this.url}/\${id}\`); }
}`;

const INSTALL_SECTIONS = [
     {
          id: "java",
          label: "JDK 17",
          icon: "☕",
          color: "orange",
          steps: [
               { n: 1, title: "Descargar JDK 17", body: "Ve a adoptium.net → Downloads → JDK 17 (LTS) → Windows x64 .msi y descarga el instalador." },
               { n: 2, title: "Ejecutar instalador", body: "Abre el .msi descargado y sigue el wizard. Al terminar, JDK queda en C:\\Program Files\\Eclipse Adoptium\\jdk-17..." },
               { n: 3, title: "Configurar JAVA_HOME", body: "Busca \"Variables de entorno\" en Windows. Crea NUEVA variable de sistema: JAVA_HOME = C:\\Program Files\\Eclipse Adoptium\\jdk-17.x.x.x-hotspot" },
               { n: 4, title: "Agregar al PATH", body: "En Variables de sistema → Path → Editar → Nuevo → escribe: %JAVA_HOME%\\bin" },
               { n: 5, title: "Verificar instalación", body: "Abre cmd o PowerShell y ejecuta: java -version. Debes ver: openjdk version \"17.x.x\"" },
          ],
          verifyCmd: "java -version",
          verifyOut: 'openjdk version "17.0.x"',
     },
     {
          id: "maven",
          label: "Apache Maven",
          icon: "📦",
          color: "amber",
          steps: [
               { n: 1, title: "Descargar Maven", body: "Ve a maven.apache.org/download.cgi → Binary zip archive → descarga apache-maven-3.x.x-bin.zip" },
               { n: 2, title: "Extraer el archivo", body: "Descomprime el .zip en C:\\Program Files\\Maven\\apache-maven-3.x.x — debe quedar esa carpeta con /bin, /lib, etc." },
               { n: 3, title: "Configurar MAVEN_HOME", body: "Variables de entorno → Nueva variable de sistema: MAVEN_HOME = C:\\Program Files\\Maven\\apache-maven-3.x.x" },
               { n: 4, title: "Agregar al PATH", body: "Variables de sistema → Path → Editar → Nuevo → escribe: %MAVEN_HOME%\\bin" },
               { n: 5, title: "Verificar instalación", body: "Abre cmd o PowerShell y ejecuta: mvn -version. Debes ver la versión de Maven y la de Java." },
          ],
          verifyCmd: "mvn -version",
          verifyOut: "Apache Maven 3.x.x",
     },
     {
          id: "intellij",
          label: "IntelliJ IDEA",
          icon: "⚡",
          color: "violet",
          steps: [
               { n: 1, title: "Descargar IntelliJ", body: "Ve a jetbrains.com/idea/download → elige Community (gratuita) o Ultimate (para estudiantes con correo .edu es gratis). Descarga el instalador .exe." },
               { n: 2, title: "Instalar", body: "Ejecuta el instalador. En \"Installation Options\" marca: Create Desktop Shortcut, Add launchers dir to PATH, .java association." },
               { n: 3, title: "Plugin Spring Boot", body: "Para la versión Ultimate: File → Settings → Plugins → busca \"Spring Boot\" → instala Spring Boot Support. En Community: usa Spring Initializr vía browser." },
               { n: 4, title: "Configurar JDK en IntelliJ", body: "File → Project Structure → SDK → + Add SDK → JDK → apunta a C:\\Program Files\\Eclipse Adoptium\\jdk-17..." },
          ],
          verifyCmd: "Menú: Help → About",
          verifyOut: "IntelliJ IDEA 2024.x",
     },
     {
          id: "node",
          label: "Node.js + Angular CLI",
          icon: "🅰",
          color: "rose",
          steps: [
               { n: 1, title: "Descargar Node.js", body: "Ve a nodejs.org → descarga la versión LTS (20.x o superior). Instala con el wizard por defecto. Incluye npm automáticamente." },
               { n: 2, title: "Verificar npm", body: "Abre cmd: node -v y npm -v. Deben mostrar las versiones instaladas." },
               { n: 3, title: "Instalar Angular CLI", body: "En cmd o PowerShell ejecuta: npm install -g @angular/cli. Esto instala el comando ng globalmente." },
               { n: 4, title: "Verificar Angular CLI", body: "Ejecuta: ng version. Verás Angular CLI junto con versiones de Node y TypeScript." },
               { n: 5, title: "Crear proyecto Angular", body: "ng new mi-proyecto --style=css --routing=true → cd mi-proyecto → ng serve. Abre http://localhost:4200" },
          ],
          verifyCmd: "ng version",
          verifyOut: "Angular CLI: 17.x.x",
     },
];

const SPRING_INIT_STEPS = [
     { n: 1, label: "New Project", detail: "File → New → Project... → seleccionar \"Spring Boot\" en el panel izquierdo (requiere plugin o Ultimate).", img: spring0, imgCaption: "New Project — Spring Initializr en IntelliJ", imgBadge: "IntelliJ IDEA", borderColor: "border-violet-500/20", bgColor: "bg-violet-500/5", borderTop: "border-violet-500/15", badgeColor: "text-violet-500/60" },
     { n: 2, label: "Configurar metadatos", detail: "Group: pe.edu.vallegrande · Artifact: mi-proyecto · Package: pe.edu.vallegrande.miproyecto · Java: 17 · Packaging: Jar", img: spring1, imgCaption: "Configurar metadatos del proyecto", imgBadge: "Spring Boot · Maven · Java 17", borderColor: "border-emerald-500/20", bgColor: "bg-emerald-500/5", borderTop: "border-emerald-500/15", badgeColor: "text-emerald-500/60" },
     { n: 3, label: "Elegir dependencias", detail: "Spring Web · Spring Data JPA · MS SQL Server Driver · Lombok · Spring Boot DevTools", img: spring2, imgCaption: "Seleccionar dependencias", imgBadge: "SQL · Lombok · DevTools", borderColor: "border-teal-500/20", bgColor: "bg-teal-500/5", borderTop: "border-teal-500/15", badgeColor: "text-teal-500/60" },
     { n: 4, label: "Finish", detail: "IntelliJ descarga el proyecto y lo abre. Primera compilación puede tardar unos minutos (descarga dependencias Maven).", img: spring3, imgCaption: "Proyecto generado en IntelliJ", imgBadge: "vg-ms-users", borderColor: "border-sky-500/20", bgColor: "bg-sky-500/5", borderTop: "border-sky-500/15", badgeColor: "text-sky-500/60" },
     { n: 5, label: "Configurar application.yaml", detail: "En src/main/resources/ renombra o crea application.yaml y pega la configuración de SQL Server (ver sección siguiente)." },
];

const COMMITS = [
     { type: "feat", color: "text-green-400 bg-green-500/10 border-green-500/25", desc: "New feature", ex: "feat(client): add POST /api/clients endpoint" },
     { type: "fix", color: "text-red-400 bg-red-500/10 border-red-500/25", desc: "Bug fix", ex: "fix(service): resolve NullPointerException in ClientService" },
     { type: "style", color: "text-pink-400 bg-pink-500/10 border-pink-500/25", desc: "CSS / HTML style changes", ex: "style: adjust padding in ng-bootstrap table" },
     { type: "refactor", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/25", desc: "Refactor without behavior change", ex: "refactor: move logic from Rest to ClientService" },
     { type: "docs", color: "text-sky-400 bg-sky-500/10 border-sky-500/25", desc: "Documentation changes", ex: "docs: add Swagger annotations to ClientRest" },
     { type: "chore", color: "text-slate-400 bg-slate-500/10 border-slate-500/25", desc: "Maintenance and config", ex: "chore: add .gitignore for IntelliJ and Maven" },
     { type: "test", color: "text-violet-400 bg-violet-500/10 border-violet-500/25", desc: "Unit / integration tests", ex: "test: add unit test to ClientService with Mockito" },
     { type: "perf", color: "text-orange-400 bg-orange-500/10 border-orange-500/25", desc: "Performance improvements", ex: "perf: add index to email column in SQL Server" },
];

function FileIcon({ name, accentColor }) {
     const clean = name.replace(/\s*←.*$/, '').trim();
     const isDir = clean.endsWith('/');
     const ext = clean.includes('.') ? clean.split('.').pop() : '';

     if (isDir) return (
          <svg style={{ width: 13, height: 13, marginRight: 5, display: 'inline-block', verticalAlign: 'middle', marginTop: -2, flexShrink: 0 }} viewBox="0 0 16 16" fill="none">
               <path d="M1 4a1 1 0 011-1h3.586a1 1 0 01.707.293L7.414 4.5H14a1 1 0 011 1V12a1 1 0 01-1 1H2a1 1 0 01-1-1V4z"
                    fill={accentColor === 'rose' ? '#e11d48' : accentColor === 'amber' ? '#d97706' : '#059669'}
                    opacity="0.85" />
          </svg>
     );

     const badges = {
          java: { bg: '#1d4ed8', color: '#bfdbfe', text: 'J' },
          ts: { bg: '#1e3a5f', color: '#7dd3fc', text: 'TS' },
          html: { bg: '#7c2d12', color: '#fdba74', text: 'H' },
          css: { bg: '#1e1b4b', color: '#a5b4fc', text: 'CSS' },
          json: { bg: '#1c1917', color: '#d6d3d1', text: '{}' },
          xml: { bg: '#292524', color: '#a8a29e', text: 'XML' },
          md: { bg: '#134e4a', color: '#5eead4', text: 'MD' },
          properties: { bg: '#1c1917', color: '#78716c', text: 'PRO' },
     };

     if (clean === '.gitignore') return <span style={{ fontSize: 10, marginRight: 5, color: '#f97316', verticalAlign: 'middle' }}>⊘</span>;
     if (clean === '.env') return <span style={{ fontSize: 9, marginRight: 5, background: '#14532d', color: '#86efac', fontWeight: 900, fontFamily: 'monospace', padding: '0 3px', borderRadius: 3, verticalAlign: 'middle' }}>ENV</span>;

     const b = badges[ext];
     if (b) return <span style={{ fontSize: 9, marginRight: 5, background: b.bg, color: b.color, fontWeight: 900, fontFamily: 'monospace', padding: '0 3px', borderRadius: 3, verticalAlign: 'middle' }}>{b.text}</span>;
     return <span style={{ fontSize: 10, marginRight: 5, color: '#475569', verticalAlign: 'middle' }}>◦</span>;
}

function FileTree({ content, accentColor }) {
     const colorForName = (clean) => {
          if (clean.endsWith('/')) {
               if (accentColor === 'rose') return 'text-rose-400';
               if (accentColor === 'amber') return 'text-amber-400';
               return 'text-emerald-400';
          }
          const ext = clean.includes('.') ? clean.split('.').pop() : '';
          if (ext === 'java') return 'text-blue-300';
          if (ext === 'ts') return 'text-sky-300';
          if (ext === 'html') return 'text-orange-300';
          if (ext === 'css') return 'text-indigo-300';
          if (ext === 'json') return 'text-slate-300';
          if (ext === 'xml') return 'text-stone-400';
          if (ext === 'properties') return 'text-teal-300';
          if (ext === 'md') return 'text-teal-300';
          return 'text-slate-400';
     };
     return (
          <div className="text-sm font-mono leading-loose p-5 overflow-x-auto">
               {content.split('\n').map((line, i) => {
                    const treeChars = line.match(/^[│├└─\s]+/)?.[0] || '';
                    const rest = line.slice(treeChars.length);
                    const clean = rest.replace(/\s*←.*$/, '').trim();
                    const comment = rest.match(/\s*(←.*)$/)?.[1] || '';
                    return (
                         <div key={i} className="flex items-center">
                              <span className="text-slate-700 select-none whitespace-pre">{treeChars}</span>
                              {rest && (
                                   <>
                                        <FileIcon name={rest} accentColor={accentColor} />
                                        <span className={colorForName(clean)}>{clean}</span>
                                        {comment && <span className="text-slate-600 ml-3 text-xs italic">{comment}</span>}
                                   </>
                              )}
                         </div>
                    );
               })}
          </div>
     );
}

function StepCard({ step, color }) {
     const colors = {
          orange: { num: "bg-orange-500/15 border-orange-500/30 text-orange-400", title: "text-orange-300" },
          amber: { num: "bg-amber-500/15 border-amber-500/30 text-amber-400", title: "text-amber-300" },
          violet: { num: "bg-violet-500/15 border-violet-500/30 text-violet-400", title: "text-violet-300" },
          rose: { num: "bg-rose-500/15 border-rose-500/30 text-rose-400", title: "text-rose-300" },
     };
     const c = colors[color] || colors.orange;
     return (
          <div className="flex gap-4">
               <span className={`shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-black font-mono mt-0.5 ${c.num}`}>
                    {step.n}
               </span>
               <div>
                    <p className={`text-sm font-semibold mb-0.5 ${c.title}`}>{step.title}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.body}</p>
               </div>
          </div>
     );
}

export default function Semester3() {
     const [activeInstall, setActiveInstall] = useState("java");
     const [lightbox, setLightbox] = useState(null);
     const section = INSTALL_SECTIONS.find((s) => s.id === activeInstall);

     const installTabColors = {
          orange: { active: "bg-orange-600/20 border-orange-500/50 text-orange-300" },
          amber: { active: "bg-amber-600/20 border-amber-500/50 text-amber-300" },
          violet: { active: "bg-violet-600/20 border-violet-500/50 text-violet-300" },
          rose: { active: "bg-rose-600/20 border-rose-500/50 text-rose-300" },
     };

     return (<>
          <div className="min-h-full px-6 md:px-10 py-10 max-w-5xl mx-auto space-y-14">

               <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                         <span className="bg-emerald-600/20 border border-emerald-600/40 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                              Semestre III
                         </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
                         Backend Empresarial
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
                         Desarrollo de APIs REST con{" "}
                         <span className="text-emerald-400 font-medium">Spring Boot 3 + Java 17</span>{" "}
                         y base de datos{" "}
                         <span className="text-red-400 font-medium">SQL Server</span>,
                         consumidas por un frontend SPA con{" "}
                         <span className="text-rose-400 font-medium">Angular 17+</span>.
                         Todo el ciclo se desarrolla en{" "}
                         <span className="text-violet-400 font-medium">IntelliJ IDEA</span>.
                    </p>
               </motion.div>

               <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-5">
                         <div className="w-1 h-5 bg-slate-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Stack tecnológico</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {TECH_STACK.map((group, gi) => (
                              <div key={gi} className={`rounded-2xl border p-5 ${group.accent === 'emerald' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
                                   <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${group.accent === 'emerald' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {group.track}
                                   </p>
                                   <div className="flex flex-wrap gap-2">
                                        {group.techs.map((t, ti) => (
                                             <div key={ti} className={`flex items-center gap-2 border rounded-xl px-3 py-2 ${t.bg}`}>
                                                  <span className={`text-xs font-black font-mono ${t.color}`}>{t.name}</span>
                                                  <span className="text-slate-600 text-[11px] hidden sm:block">{t.role}</span>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                         ))}
                    </div>
               </motion.div>

               <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="w-1 h-5 bg-amber-400 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Guía de instalación del entorno</h2>
                    </div>
                    <p className="text-slate-500 text-sm mb-5 leading-relaxed max-w-2xl">
                         Antes de crear el proyecto asegúrate de tener instaladas todas las herramientas. Sigue los pasos en orden.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-5">
                         {INSTALL_SECTIONS.map((s) => (
                              <button
                                   key={s.id}
                                   onClick={() => setActiveInstall(s.id)}
                                   className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${activeInstall === s.id
                                        ? installTabColors[s.color].active
                                        : "border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                                        }`}
                              >
                                   <span className="text-base leading-none">{s.icon}</span>
                                   {s.label}
                              </button>
                         ))}
                    </div>

                    <AnimatePresence mode="wait">
                         <motion.div
                              key={activeInstall}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                         >
                              <div className={`rounded-2xl border p-6 space-y-5 ${section.color === 'orange' ? 'border-orange-500/20 bg-orange-500/5' :
                                   section.color === 'amber' ? 'border-amber-500/20 bg-amber-500/5' :
                                        section.color === 'violet' ? 'border-violet-500/20 bg-violet-500/5' :
                                             'border-rose-500/20 bg-rose-500/5'
                                   }`}>
                                   <div className="flex items-center gap-3 mb-1">
                                        <span className="text-2xl">{section.icon}</span>
                                        <p className="text-white font-bold text-base">{section.label}</p>
                                   </div>
                                   {section.steps.map((step) => (
                                        <StepCard key={step.n} step={step} color={section.color} />
                                   ))}
                                   <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 font-mono text-sm flex flex-wrap items-center gap-3">
                                        <span className="text-slate-500 text-xs uppercase tracking-widest">Verificar:</span>
                                        <span className="text-emerald-400">{section.verifyCmd}</span>
                                        <span className="text-slate-600">→</span>
                                        <span className="text-slate-400 text-xs">{section.verifyOut}</span>
                                   </div>
                              </div>
                         </motion.div>
                    </AnimatePresence>
               </motion.div>

               <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Crear proyecto Spring Boot en IntelliJ</h2>
                         <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                              Intellij Idea
                         </span>
                    </div>
                    <p className="text-slate-500 text-sm mb-5 leading-relaxed max-w-2xl">
                         IntelliJ IDEA Ultimate integra Spring Initializr directamente en el wizard. No se usa Eclipse ni el navegador.
                    </p>

                    <div className="space-y-4 mb-6">
                         {SPRING_INIT_STEPS.map((step) => (
                              <div key={step.n}>
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
                                                  onClick={() => setLightbox({ src: step.img, alt: step.imgCaption })}
                                             />
                                        </div>
                                   )}
                              </div>
                         ))}
                    </div>

                    <p className="text-slate-500 text-sm mb-2 leading-relaxed">
                         El artifact base del grupo Valle Grande es:
                    </p>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 mb-6 font-mono text-sm inline-flex flex-wrap items-center gap-2">
                         <span className="text-slate-500">Group:</span>
                         <span className="text-emerald-400">pe.edu.vallegrande</span>
                         <span className="text-slate-600 mx-2">·</span>
                         <span className="text-slate-500">Artifact:</span>
                         <span className="text-yellow-400">&lt;nombre-proyecto&gt;</span>
                         <span className="text-slate-600 mx-2">·</span>
                         <span className="text-slate-500">Java:</span>
                         <span className="text-orange-400">17</span>
                    </div>

                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-3">Dependencias requeridas en Spring Initializr</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                         {[
                              { name: "Spring Web", color: "text-sky-400 bg-sky-500/10 border-sky-500/25" },
                              { name: "Spring Data JPA", color: "text-teal-400 bg-teal-500/10 border-teal-500/25" },
                              { name: "MS SQL Server Driver", color: "text-red-400 bg-red-500/10 border-red-500/25" },
                              { name: "Lombok", color: "text-violet-400 bg-violet-500/10 border-violet-500/25" },
                              { name: "Spring Boot DevTools", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
                         ].map((dep) => (
                              <span key={dep.name} className={`text-xs font-bold font-mono px-3 py-1.5 rounded-xl border ${dep.color}`}>
                                   {dep.name}
                              </span>
                         ))}
                    </div>
               </motion.div>

               <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Arquitectura de paquetes Spring Boot</h2>
                         <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                              IntelliJ · SQL Server
                         </span>
                    </div>

                    <div className="space-y-2 mb-6">
                         {SPRING_PACKAGES.map((p, i) => (
                              <div key={i} className={`flex items-start gap-4 border rounded-xl px-4 py-3 ${p.bg}`}>
                                   <span className={`shrink-0 font-mono text-xs font-black w-24 pt-0.5 ${p.accent}`}>{p.pkg}</span>
                                   <div className="flex-1 min-w-0">
                                        <p className="text-slate-300 text-sm leading-tight">{p.desc}</p>
                                        {p.example && <p className="text-slate-600 text-xs mt-0.5 font-mono">{p.example}</p>}
                                   </div>
                                   {p.suffix && <span className="shrink-0 text-slate-600 text-xs font-mono hidden sm:block">{p.suffix}</span>}
                              </div>
                         ))}
                    </div>

                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-3">Service — interfaz + implementación (obligatorio)</p>
                    <p className="text-slate-500 text-sm mb-4 leading-relaxed max-w-2xl">
                         Igual que en Semestre IV, <span className="text-emerald-400 font-medium">service</span> nunca es una sola clase concreta: siempre se separa en interfaz (especificación) e implementación. El <span className="text-sky-400 font-medium">Rest</span> inyecta la interfaz, nunca el <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">Impl</code> directamente.
                    </p>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6">
                         <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800">
                              <div className="flex gap-1.5">
                                   <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-green-500/60" />
                              </div>
                              <span className="text-slate-500 text-xs font-mono ml-2">service/ClientService.java · service/impl/ClientServiceImpl.java · rest/ClientRest.java</span>
                         </div>
                         <pre className="text-xs font-mono leading-relaxed p-5 overflow-x-auto text-slate-300 whitespace-pre">{SERVICE_SNIPPET}</pre>
                    </div>

                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-3">Flujo REST — petición HTTP</p>
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden p-6 overflow-x-auto mb-6">
                         <svg viewBox="0 0 780 120" className="w-full min-w-120" xmlns="http://www.w3.org/2000/svg">
                              <rect x="10" y="30" width="90" height="50" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
                              <text x="55" y="52" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="monospace" fontWeight="700">Angular</text>
                              <text x="55" y="66" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="monospace">Frontend</text>
                              <line x1="100" y1="55" x2="145" y2="55" stroke="#38bdf8" strokeWidth="1.8" markerEnd="url(#arrowBlue3)" />
                              <text x="122" y="47" textAnchor="middle" fontSize="7" fill="#38bdf8" fontFamily="monospace">HTTP</text>
                              <rect x="147" y="25" width="120" height="60" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                              <rect x="147" y="25" width="120" height="18" rx="6" fill="#0c2231" />
                              <rect x="147" y="35" width="120" height="8" fill="#0c2231" />
                              <text x="207" y="37" textAnchor="middle" fontSize="7.5" fill="#7dd3fc" fontFamily="monospace">@RestController</text>
                              <text x="207" y="60" textAnchor="middle" fontSize="8.5" fill="#94a3b8" fontFamily="monospace">Rest</text>
                              <text x="207" y="74" textAnchor="middle" fontSize="7" fill="#475569" fontFamily="monospace">@GetMapping · @PostMapping</text>
                              <line x1="267" y1="55" x2="312" y2="55" stroke="#34d399" strokeWidth="1.8" markerEnd="url(#arrowGreen3)" />
                              <text x="289" y="47" textAnchor="middle" fontSize="7" fill="#34d399" fontFamily="monospace">llama</text>
                              <rect x="314" y="25" width="120" height="60" rx="6" fill="#0f172a" stroke="#34d399" strokeWidth="1.5" />
                              <rect x="314" y="25" width="120" height="18" rx="6" fill="#022c22" />
                              <rect x="314" y="35" width="120" height="8" fill="#022c22" />
                              <text x="374" y="37" textAnchor="middle" fontSize="7.5" fill="#6ee7b7" fontFamily="monospace">@Service</text>
                              <text x="374" y="60" textAnchor="middle" fontSize="8.5" fill="#94a3b8" fontFamily="monospace">ServiceImpl</text>
                              <text x="374" y="74" textAnchor="middle" fontSize="7" fill="#475569" fontFamily="monospace">lógica de negocio</text>
                              <line x1="434" y1="55" x2="480" y2="55" stroke="#a78bfa" strokeWidth="1.8" markerEnd="url(#arrowPurple3)" />
                              <text x="457" y="47" textAnchor="middle" fontSize="7" fill="#a78bfa" fontFamily="monospace">llama</text>
                              <rect x="482" y="25" width="120" height="60" rx="6" fill="#0f172a" stroke="#a78bfa" strokeWidth="1.5" />
                              <rect x="482" y="25" width="120" height="18" rx="6" fill="#2e1065" />
                              <rect x="482" y="35" width="120" height="8" fill="#2e1065" />
                              <text x="542" y="37" textAnchor="middle" fontSize="7.5" fill="#c4b5fd" fontFamily="monospace">Repository</text>
                              <text x="542" y="60" textAnchor="middle" fontSize="8.5" fill="#94a3b8" fontFamily="monospace">JpaRepository</text>
                              <text x="542" y="74" textAnchor="middle" fontSize="7" fill="#475569" fontFamily="monospace">Spring Data JPA</text>
                              <line x1="602" y1="55" x2="645" y2="55" stroke="#f43f5e" strokeWidth="1.8" markerEnd="url(#arrowRed3)" />
                              <text x="623" y="47" textAnchor="middle" fontSize="7" fill="#f43f5e" fontFamily="monospace">SQL</text>
                              <rect x="647" y="25" width="120" height="60" rx="6" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5" />
                              <rect x="647" y="25" width="120" height="18" rx="6" fill="#3b0014" />
                              <rect x="647" y="35" width="120" height="8" fill="#3b0014" />
                              <text x="707" y="37" textAnchor="middle" fontSize="7.5" fill="#fda4af" fontFamily="monospace">SQL Server</text>
                              <text x="707" y="60" textAnchor="middle" fontSize="8.5" fill="#94a3b8" fontFamily="monospace">Database</text>
                              <text x="707" y="74" textAnchor="middle" fontSize="7" fill="#475569" fontFamily="monospace">localhost:1433</text>

                              <defs>
                                   <marker id="arrowBlue3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                                        <path d="M0,0 L0,6 L8,3 z" fill="#38bdf8" />
                                   </marker>
                                   <marker id="arrowGreen3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                                        <path d="M0,0 L0,6 L8,3 z" fill="#34d399" />
                                   </marker>
                                   <marker id="arrowPurple3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                                        <path d="M0,0 L0,6 L8,3 z" fill="#a78bfa" />
                                   </marker>
                                   <marker id="arrowRed3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                                        <path d="M0,0 L0,6 L8,3 z" fill="#f43f5e" />
                                   </marker>
                              </defs>
                         </svg>
                    </div>

                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-3">Conexión SQL Server — application.yaml</p>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6">
                         <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800">
                              <div className="flex gap-1.5">
                                   <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-green-500/60" />
                              </div>
                              <span className="text-slate-500 text-xs font-mono ml-2">src/main/resources/application.yaml</span>
                         </div>
                         <pre className="text-xs font-mono leading-relaxed p-5 overflow-x-auto">
                              {APP_PROPERTIES.split('\n').map((line, i) => {
                                   const isComment = line.trim().startsWith('#');
                                   const parts = line.split('=');
                                   if (isComment) return <div key={i}><span className="text-slate-600 italic">{line}</span></div>;
                                   if (parts.length >= 2) {
                                        const key = parts[0];
                                        const val = parts.slice(1).join('=');
                                        return (
                                             <div key={i}>
                                                  <span className="text-sky-400">{key}</span>
                                                  <span className="text-slate-500">=</span>
                                                  <span className="text-teal-300">{val}</span>
                                             </div>
                                        );
                                   }
                                   return <div key={i}><span className="text-slate-400">{line}</span></div>;
                              })}
                         </pre>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                         <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                              <div className="flex gap-1.5">
                                   <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-green-500/60" />
                              </div>
                              <span className="text-slate-500 text-xs font-mono ml-2">estructura-spring-boot/</span>
                         </div>
                         <FileTree content={SPRING_STRUCTURE} accentColor="emerald" />
                    </div>

                    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3">
                         <p className="text-slate-400 text-xs leading-relaxed">
                              <span className="text-emerald-400 font-semibold">¿Y la carpeta <code className="text-slate-300 bg-slate-800 px-1 py-0.5 rounded">database</code>?</span> Existe, pero **fuera de <code className="text-slate-300 bg-slate-800 px-1 py-0.5 rounded">src/</code>**, a nivel raíz del proyecto (junto a <code className="text-slate-300 bg-slate-800 px-1 py-0.5 rounded">pom.xml</code>) — no es un paquete Java, solo guarda <code className="text-slate-300 bg-slate-800 px-1 py-0.5 rounded">schema.sql</code> como referencia/documentación. La conexión real la arma Spring solo con el <code className="text-slate-300 bg-slate-800 px-1 py-0.5 rounded">datasource</code> de <code className="text-slate-300 bg-slate-800 px-1 py-0.5 rounded">application.yaml</code> (a diferencia de Semestre II, donde sí hay que crear <code className="text-slate-300 bg-slate-800 px-1 py-0.5 rounded">db/AccessDB.java</code> a mano). Si alguna vez necesitas configuración custom (ej. múltiples datasources), va en <code className="text-slate-300 bg-slate-800 px-1 py-0.5 rounded">config/DatabaseConfig.java</code> — opcional, no obligatorio.
                         </p>
                    </div>
               </motion.div>

               <motion.div custom={4.5} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="w-1 h-5 bg-red-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Base de datos — Nomenclatura y Entidad SQL Server</h2>
                         <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                              Inglés obligatorio
                         </span>
                    </div>
                    <p className="text-slate-500 text-sm mb-5 leading-relaxed max-w-2xl">
                         Toda tabla y columna de SQL Server se nombra en <span className="text-red-400 font-medium">inglés</span>, en <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">snake_case</code>. Ver estándar completo en <span className="text-teal-400 font-medium">Convenciones → Base de Datos</span>.
                    </p>
                    <div className="rounded-2xl border border-slate-800 overflow-hidden mb-6">
                         <div className="grid grid-cols-4 bg-slate-900/80 border-b border-slate-800 px-4 py-2">
                              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Elemento</span>
                              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Regla</span>
                              <span className="text-emerald-400/70 text-xs font-bold uppercase tracking-widest">Correcto ✓</span>
                              <span className="text-red-400/70 text-xs font-bold uppercase tracking-widest">Incorrecto ✗</span>
                         </div>
                         {DB_NAMING_SQLSERVER.map((row, i) => (
                              <div key={i} className="grid grid-cols-4 px-4 py-3 border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30 transition-colors">
                                   <span className="text-xs font-semibold text-slate-300">{row.element}</span>
                                   <span className="text-slate-400 text-xs">{row.rule}</span>
                                   <span className="text-emerald-300 text-xs font-mono">{row.good}</span>
                                   <span className="text-red-400/70 text-xs font-mono line-through">{row.bad}</span>
                              </div>
                         ))}
                    </div>

                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-3">Script de tabla — SQL Server</p>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6">
                         <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800">
                              <div className="flex gap-1.5">
                                   <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-green-500/60" />
                              </div>
                              <span className="text-slate-500 text-xs font-mono ml-2">database/schema.sql</span>
                         </div>
                         <pre className="text-xs font-mono leading-relaxed p-5 overflow-x-auto text-slate-300 whitespace-pre">{ENTITY_SQLSERVER_TABLE}</pre>
                    </div>

                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-3">Entidad JPA + Repository — Java</p>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                         <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800">
                              <div className="flex gap-1.5">
                                   <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-green-500/60" />
                              </div>
                              <span className="text-slate-500 text-xs font-mono ml-2">model/Client.java · repository/ClientRepository.java</span>
                         </div>
                         <pre className="text-xs font-mono leading-relaxed p-5 overflow-x-auto text-slate-300 whitespace-pre">{ENTITY_SQLSERVER_JAVA}</pre>
                    </div>
               </motion.div>

               <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="w-1 h-5 bg-rose-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Estándar de proyecto Angular</h2>
                         <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                              SPA · TypeScript
                         </span>
                    </div>
                    <p className="text-slate-500 text-sm mb-5 leading-relaxed max-w-2xl">
                         Arquitectura por <span className="text-rose-400 font-medium">Feature Modules</span>:
                         cada dominio (clients, products, users…) vive en su propio módulo con sus componentes y servicios.
                         El módulo <span className="text-sky-400 font-medium">core</span> centraliza los singletons; el módulo{" "}
                         <span className="text-violet-400 font-medium">shared</span> agrupa lo reutilizable.
                    </p>

                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-3">Convención de nombres de archivos</p>
                    <div className="space-y-2 mb-6">
                         {ANGULAR_NAMES.map((n, i) => (
                              <div key={i} className={`flex items-start gap-4 border rounded-xl px-4 py-3 ${n.bg}`}>
                                   <span className={`shrink-0 font-mono text-xs font-black w-24 pt-0.5 ${n.color}`}>{n.what}</span>
                                   <div className="flex-1 min-w-0">
                                        <p className="text-slate-300 text-sm leading-tight font-mono">{n.rule}</p>
                                        <p className="text-slate-500 text-xs mt-0.5 font-mono">{n.example}</p>
                                   </div>
                              </div>
                         ))}
                    </div>

                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-3">Consumir el API REST desde Angular</p>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6">
                         <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800">
                              <div className="flex gap-1.5">
                                   <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-green-500/60" />
                              </div>
                              <span className="text-slate-500 text-xs font-mono ml-2">environment.ts · client.service.ts</span>
                         </div>
                         <pre className="text-xs font-mono leading-relaxed p-5 overflow-x-auto">
                              {ENV_SNIPPET.split('\n').map((line, i) => {
                                   const isComment = line.trim().startsWith('//');
                                   const isDecorator = line.trim().startsWith('@');
                                   const isKeyword = /^\s*(export|import|const|constructor|return|private)/.test(line);
                                   return (
                                        <div key={i}>
                                             <span className={
                                                  isComment ? 'text-slate-600 italic' :
                                                       isDecorator ? 'text-yellow-400' :
                                                            isKeyword ? 'text-violet-400' :
                                                                 line.includes('environment.apiUrl') ? 'text-sky-300' :
                                                                      line.includes('http.') ? 'text-teal-300' :
                                                                           'text-slate-300'
                                             }>{line}</span>
                                        </div>
                                   );
                              })}
                         </pre>
                    </div>

                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-3">RxJS — lo mínimo que necesitas</p>
                    <p className="text-slate-500 text-sm mb-4 leading-relaxed max-w-2xl">
                         No es una librería que se instala aparte: viene incluida con Angular porque <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">HttpClient</code> devuelve un <span className="text-pink-400 font-medium">Observable</span>, no una Promise. En el 90% de los casos solo necesitas <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">.subscribe()</code> para leer el resultado.
                    </p>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6">
                         <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800">
                              <div className="flex gap-1.5">
                                   <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-green-500/60" />
                              </div>
                              <span className="text-slate-500 text-xs font-mono ml-2">client-list.component.ts</span>
                         </div>
                         <pre className="text-xs font-mono leading-relaxed p-5 overflow-x-auto text-slate-300 whitespace-pre">{`export class ClientListComponent implements OnInit {
  clients: Client[] = [];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    // .subscribe() ejecuta la petición y entrega el resultado aquí
    this.clientService.getAll().subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error('Error al cargar clientes', err),
    });
  }
}`}</pre>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6">
                         <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                              <div className="flex gap-1.5">
                                   <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-green-500/60" />
                              </div>
                              <span className="text-slate-500 text-xs font-mono ml-2">estructura-angular/</span>
                         </div>
                         <FileTree content={ANGULAR_STRUCTURE} accentColor="rose" />
                    </div>

                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-3">Pipes — transformar datos en el template</p>
                    <p className="text-slate-500 text-sm mb-4 max-w-2xl">
                         Un <span className="text-pink-400 font-medium">pipe</span> formatea un valor directamente en el HTML sin tocar el componente. Angular ya trae varios (<code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">date</code>, <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">currency</code>, <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">uppercase</code>). Solo se crea uno propio cuando hay una transformación del dominio que se repite en varias vistas.
                    </p>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                         <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800">
                              <div className="flex gap-1.5">
                                   <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-green-500/60" />
                              </div>
                              <span className="text-slate-500 text-xs font-mono ml-2">shared/pipes/status-label.pipe.ts</span>
                         </div>
                         <pre className="text-xs font-mono leading-relaxed p-5 overflow-x-auto text-slate-300 whitespace-pre">{PIPE_SNIPPET}</pre>
                    </div>
               </motion.div>

               <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-4">
                         <div className="w-1 h-5 bg-green-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Conventional Commits</h2>
                         <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">Git</span>
                    </div>
                    <p className="text-slate-500 text-sm mb-2 leading-relaxed max-w-2xl">
                         Formato estándar para mensajes de commit. El scope indica el módulo afectado: <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">feat(client)</code>, <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">fix(auth)</code>.
                    </p>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 mb-5 font-mono text-sm">
                         <span className="text-slate-500">$ git commit -m &quot;</span>
                         <span className="text-green-400">tipo</span>
                         <span className="text-slate-500">(</span>
                         <span className="text-yellow-400">módulo</span>
                         <span className="text-slate-500">): </span>
                         <span className="text-slate-300">descripción corta en minúsculas</span>
                         <span className="text-slate-500">&quot;</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {COMMITS.map((c, i) => (
                              <div key={i} className={`flex items-start gap-3 border rounded-xl p-4 ${c.color}`}>
                                   <span className={`shrink-0 font-mono text-xs font-black px-2 py-1 rounded-lg border ${c.color}`}>{c.type}</span>
                                   <div className="min-w-0">
                                        <p className="text-slate-300 text-sm font-medium leading-tight">{c.desc}</p>
                                        <p className="text-slate-600 text-xs mt-1 font-mono truncate">{c.ex}</p>
                                   </div>
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
