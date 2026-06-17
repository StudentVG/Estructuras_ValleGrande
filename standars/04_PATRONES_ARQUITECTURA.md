# Patrones de Arquitectura — Valle Grande

> Define qué patrón se espera en cada semestre y cómo verificar su correcta implementación. Incluye patrones de diseño, patrones de resiliencia y patrones enterprise de microservicios.

---

## Criterios de Evaluación de Arquitectura

| Criterio                                               | Peso |
| ------------------------------------------------------ | ---- |
| Patrón correcto para el semestre detectado             | 35 % |
| Capas bien separadas (sin mezcla de responsabilidades) | 30 % |
| Flujo de dependencias correcto                         | 20 % |
| Sufijos de clase y naming correcto                     | 15 % |

---

## 1. Patrón por Semestre — Tabla de Referencia Rápida

| Semestre | Patrón principal           | Flujo esperado                                                          |
| -------- | -------------------------- | ----------------------------------------------------------------------- |
| II Java  | MVC + DAO                  | `View → Controller → Service → DAO → MySQL`                            |
| II Flask | MVC + Blueprint            | `Template → Route (Blueprint) → Service → Model → MySQL`               |
| III      | Layered REST (MVC)         | `Angular → HTTP → Rest → Service → Repository → SQL Server`            |
| IV       | Layered Reactivo           | `React/Expo → HTTP → Rest → Service (Mono/Flux) → R2DBC/Mongo`         |
| V·VI     | Layered ó Hexagonal ó CQRS | Según complejidad del microservicio                                     |

---

## 2. MVC + DAO — Semestre II Java Swing

### Flujo de capas

```
View (Swing / JFrame)
  │  delega eventos de UI
  ↓
Controller
  │  coordina respuesta a eventos
  ↓
Service
  │  lógica de negocio
  ↓
DAO
  │  SQL directo con JDBC
  ↓
AccessDB (conexión)
  ↓
MySQL
```

### Reglas de dependencias

- `View` solo conoce `Controller`
- `Controller` solo conoce `Service`
- `Service` solo conoce `DAO`
- `DAO` solo conoce `AccessDB`
- **Nadie salta capas**

### Violaciones críticas

| Violación                                     | Severidad |
| --------------------------------------------- | --------- |
| `import java.sql.*` en clase `View`           | Crítica   |
| `AccessDB` instanciado fuera de `DAO`         | Crítica   |
| `View` llama a `DAO` directamente             | Crítica   |
| Lógica de negocio en `DAO` (más que CRUD SQL) | Alta      |
| Lógica de UI en `Service`                     | Alta      |
| Más de una clase `AccessDB`                   | Media     |

---

## 3. Layered REST — Semestre III Spring Boot MVC

### Flujo de capas

```
Angular (HTTP Request)
  ↓
@RestController (sufijo: Rest)
  │  valida request, delega
  ↓
@Service
  │  lógica de negocio, transacciones
  ↓
JpaRepository
  │  queries SQL generadas por Hibernate
  ↓
SQL Server
```

### Reglas de dependencias

- `Rest` inyecta `Service` — **nunca `Repository` directamente**
- `Service` inyecta `Repository`
- `Repository` no tiene lógica de negocio
- La entidad `@Entity` es solo un POJO de datos

### Violaciones críticas

| Violación                                          | Severidad |
| -------------------------------------------------- | --------- |
| `@Autowired` del `Repository` en el `Rest`         | Crítica   |
| `ResponseEntity` en el `Service`                   | Alta      |
| `@Entity` con métodos que llaman servicios         | Alta      |
| `application.properties` en lugar de `.yaml`       | Media     |
| Sufijo `Controller` en lugar de `Rest`             | Media     |

---

## 4. Layered Reactivo — Semestre IV Spring WebFlux

### Regla fundamental: todo debe ser reactivo

| Elemento           | Incorrecto (MVC)        | Correcto (WebFlux)                   |
| ------------------ | ----------------------- | ------------------------------------ |
| Dependencia base   | starter-web             | starter-webflux                      |
| Retorno service    | `T` / `List<T>`         | `Mono<T>` / `Flux<T>`               |
| Retorno rest       | `ResponseEntity<T>`     | `Mono<ResponseEntity<T>>`            |
| Entidad Oracle     | `@Entity` + JPA         | `@Table` + R2DBC (Spring Data)       |
| Entidad MongoDB    | `@Entity`               | `@Document` (Spring Data MongoDB)    |
| Repositorio Oracle | `JpaRepository`         | `ReactiveCrudRepository`             |
| Repositorio Mongo  | `MongoRepository`       | `ReactiveMongoRepository`            |

### Interfaz + Implementación obligatoria

```java
// service/ClientService.java — INTERFAZ obligatoria
public interface ClientService {
    Flux<ClientResponse> findAll();
    Mono<ClientResponse> findById(Long id);
    Mono<ClientResponse> create(ClientRequest request);
    Mono<ClientResponse> update(Long id, ClientRequest request);
    Mono<Void>           delete(Long id);
}

// service/impl/ClientServiceImpl.java — IMPLEMENTACIÓN
@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final ClientRepository repository;
    private final ClientMapper mapper;
    // ...
}
```

---

## 5. Arquitectura Hexagonal (Ports & Adapters) — V·VI

### Principio central

El **dominio** no conoce Spring, ni la BD, ni ningún framework. Las dependencias siempre apuntan **hacia adentro**:

```
INFRAESTRUCTURA  →  APLICACIÓN  →  DOMINIO (puro)
```

### Las tres capas

#### Capa de Dominio (núcleo puro)

```java
// domain/model/User.java — POJO puro
@Builder @Getter
public class User {           // ← sin @Table, @Entity, @Document
    private Long id;          // ← sin anotaciones de Spring
    private String fullName;
    private String email;
    private Role role;
    private String orgId;
    private String status;
}

// domain/port/in/IUserUseCase.java — interfaz de entrada
public interface IUserUseCase {
    Mono<User> createUser(CreateUserRequest request);
    Mono<User> getUserById(Long id);
    Flux<User> getAllByOrg(String orgId);
    Mono<User> updateUser(Long id, UpdateUserRequest request);
    Mono<Void> deleteUser(Long id);
}

// domain/port/out/IUserRepository.java — interfaz de salida
public interface IUserRepository {
    Mono<User> save(User user);
    Mono<User> findById(Long id);
    Flux<User> findByOrgId(String orgId);
    Mono<Boolean> existsByEmail(String email);
}

// domain/port/out/IUserEventPublisher.java — interfaz de salida
public interface IUserEventPublisher {
    Mono<Void> publishUserCreated(User user);
    Mono<Void> publishUserUpdated(User user);
}
```

#### Capa de Aplicación (casos de uso)

```java
// application/usecases/UserUseCaseImpl.java
@UseCase  // o @Service
@RequiredArgsConstructor
public class UserUseCaseImpl implements IUserUseCase {
    private final IUserRepository userRepository;     // ← usa la interfaz del dominio
    private final IUserEventPublisher eventPublisher;  // ← usa la interfaz del dominio
    private final UserMapper mapper;

    @Override
    public Mono<User> createUser(CreateUserRequest request) {
        return userRepository.existsByEmail(request.getEmail())
            .flatMap(exists -> {
                if (exists) return Mono.error(new DuplicateEmailException(request.getEmail()));
                User user = mapper.toModel(request);
                return userRepository.save(user)
                    .flatMap(saved -> eventPublisher
                        .publishUserCreated(saved)
                        .thenReturn(saved));
            });
    }
}
```

#### Capa de Infraestructura (adaptadores)

```java
// infrastructure/adapters/in/rest/UserRest.java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserRest {
    private final IUserUseCase userUseCase;   // ← usa el port de entrada

    @GetMapping("/{id}")
    public Mono<ResponseEntity<UserResponse>> getById(@PathVariable Long id) {
        return userUseCase.getUserById(id)
            .map(mapper::toResponse)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}

// infrastructure/adapters/out/persistence/UserPersistenceAdapter.java
@Repository
@RequiredArgsConstructor
public class UserPersistenceAdapter implements IUserRepository {   // ← implementa el port
    private final UserR2dbcRepository r2dbcRepo;
    private final UserEntityMapper mapper;

    @Override
    public Mono<User> save(User user) {
        return r2dbcRepo.save(mapper.toEntity(user))
            .map(mapper::toDomain);
    }
}

// infrastructure/persistence/entities/UserEntity.java
@Table("users")              // ← @Table SOLO en infraestructura, no en dominio
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserEntity {
    @Id private Long id;
    @Column("full_name") private String fullName;
    private String email;
    private String role;
    @Column("org_id") private String orgId;
    private String status;
}
```

### Violaciones críticas en Hexagonal

| Violación                                                  | Severidad |
| ---------------------------------------------------------- | --------- |
| `@Table` / `@Document` en `domain/model/`                 | Crítica   |
| `import org.springframework.*` en `domain/`               | Crítica   |
| `application/` accede directamente a repos R2DBC          | Crítica   |
| Sin interfaces `port/in/` y `port/out/`                   | Alta      |
| `UserService` en lugar de `IUserUseCase`                   | Media     |
| `UserRest` en `domain/` o `application/`                  | Crítica   |

---

## 6. CQRS — Command Query Responsibility Segregation

### Principio

Separar completamente las operaciones de escritura (Commands) de las de lectura (Queries).

```
POST/PUT/DELETE  →  CommandHandler  →  Write Repository  →  publica Evento
GET              →  QueryHandler   →  Read Repository   (proyección optimizada)
```

### Implementación

```java
// command/model/CreateUserCommand.java — record inmutable
public record CreateUserCommand(
    String fullName,
    String email,
    String role,
    String orgId
) {}

// command/handler/CreateUserHandler.java
@Component
@RequiredArgsConstructor
public class CreateUserHandler {
    private final UserWriteRepository writeRepository;
    private final UserEventPublisher  eventPublisher;

    public Mono<UserResponse> handle(CreateUserCommand cmd) {
        User user = User.builder()
            .fullName(cmd.fullName())
            .email(cmd.email())
            .role(cmd.role())
            .orgId(cmd.orgId())
            .status("A")
            .build();
        return writeRepository.save(user)
            .flatMap(saved ->
                eventPublisher.publishUserCreated(saved)
                    .thenReturn(mapper.toResponse(saved)));
    }
}

// query/model/UserView.java — proyección optimizada para lectura
@Table("user_views")   // puede ser una vista o proyección
@Data
public class UserView {
    private Long id;
    private String fullName;
    private String email;
    private String roleName;   // ← puede incluir joins aplanados para evitar N+1
    private String orgName;
}

// query/handler/GetUsersHandler.java
@Component
@RequiredArgsConstructor
public class GetUsersHandler {
    private final UserReadRepository readRepository;

    public Flux<UserView> handle(String orgId) {
        return readRepository.findAllByOrgId(orgId);
    }
}

// infrastructure/rest/UserRest.java — delega según operación
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserRest {
    private final CreateUserHandler createHandler;
    private final GetUsersHandler   getHandler;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<UserResponse> create(@RequestBody @Valid CreateUserRequest req) {
        return createHandler.handle(new CreateUserCommand(
            req.fullName(), req.email(), req.role(), req.orgId()
        ));
    }

    @GetMapping
    public Flux<UserView> getByOrg(@RequestParam String orgId) {
        return getHandler.handle(orgId);
    }
}
```

---

## 7. Event-Driven Architecture (EDA)

Patrón donde los microservicios se comunican a través de eventos, sin acoplamiento directo.

### Componentes

```
Productor (vg-ms-users)
  │  publica evento  →  "user.created" { userId, orgId, role, timestamp }
  ↓
Broker de eventos (RabbitMQ ó Kafka)
  │  enruta a suscriptores
  ↓
Consumidores:
  ├── vg-ms-notifications → envía email de bienvenida
  ├── vg-ms-audit         → registra en log de auditoría
  └── vg-ms-auth          → crea credenciales de acceso
```

### Contrato de Evento

```java
// Evento de dominio — record inmutable con todos los campos necesarios
public record UserCreatedEvent(
    String  eventId,         // UUID único del evento (para idempotencia)
    String  eventType,       // "USER_CREATED"
    String  aggregateId,     // ID del usuario
    String  orgId,
    String  role,
    String  email,
    Instant occurredAt,
    String  correlationId    // para trazabilidad en logs distribuidos
) {
    public static UserCreatedEvent from(User user) {
        return new UserCreatedEvent(
            UUID.randomUUID().toString(),
            "USER_CREATED",
            user.getId().toString(),
            user.getOrgId(),
            user.getRole(),
            user.getEmail(),
            Instant.now(),
            MDC.get("correlationId")
        );
    }
}
```

---

## 8. Saga Pattern

Gestiona transacciones distribuidas entre múltiples microservicios. Dos variantes:

### Saga Orquestada (Orchestrated Saga)

Un orquestador central coordina todos los pasos. Si alguno falla, ejecuta los pasos compensatorios.

```
API Gateway / Orquestador
  │
  ├─ 1. vg-ms-users.createUser()       → éxito
  ├─ 2. vg-ms-auth.createCredentials() → éxito
  ├─ 3. vg-ms-enrollment.enroll()      → FALLA
  │                                    ↓
  │  Compensación (rollback):
  ├─ 3b. vg-ms-auth.deleteCredentials()
  └─ 4b. vg-ms-users.deleteUser()
```

```java
// Paso de la Saga con compensación
@Component
public class EnrollmentSagaStep {

    public Mono<Void> execute(EnrollmentContext ctx) {
        return enrollmentService.enroll(ctx.getStudentId(), ctx.getCourseId());
    }

    public Mono<Void> compensate(EnrollmentContext ctx) {
        return enrollmentService.cancelEnrollment(ctx.getStudentId(), ctx.getCourseId());
    }
}
```

### Saga Coreografiada (Choreographed Saga)

No hay orquestador. Cada microservicio reacciona al evento del anterior y publica el suyo.

```
vg-ms-users     publica → "user.created"
  ↓ escucha
vg-ms-auth      publica → "credentials.created"
  ↓ escucha
vg-ms-notifications publica → "welcome.email.sent"
```

---

## 9. API Gateway Pattern

### Responsabilidades del Gateway (Spring Cloud Gateway)

```java
// config/GatewayConfig.java
@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            // Rutas con prefijo /api/v1/users → vg-ms-users
            .route("users-service", r -> r
                .path("/api/v1/users/**")
                .filters(f -> f
                    .rewritePath("/api/v1/users/(?<segment>.*)", "/api/v1/users/${segment}")
                    .addRequestHeader("X-Gateway-Source", "vg-gateway")
                    .circuitBreaker(c -> c.setName("users-cb")
                        .setFallbackUri("forward:/fallback/users"))
                )
                .uri("lb://vg-ms-users")    // service discovery con Eureka
            )
            .route("organizations-service", r -> r
                .path("/api/v1/organizations/**")
                .filters(f -> f
                    .circuitBreaker(c -> c.setName("orgs-cb"))
                )
                .uri("lb://vg-ms-organizations")
            )
            .build();
    }
}
```

```yaml
# application.yaml — configuración del gateway
spring:
  cloud:
    gateway:
      default-filters:
        - name: RequestRateLimiter
          args:
            redis-rate-limiter.replenishRate: 100
            redis-rate-limiter.burstCapacity: 200
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOriginPatterns: "*"
            allowedMethods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"]
            allowedHeaders: "*"
            allowCredentials: true
```

---

## 10. Circuit Breaker Pattern (Resilience4j)

Previene cascadas de fallos cuando un microservicio falla o está lento.

### Estados del Circuit Breaker

```
CLOSED (normal)
  │ falla > umbral (ej: 50% en 10 llamadas)
  ↓
OPEN (rechaza llamadas, usa fallback)
  │ después de waitDurationInOpenState (60s)
  ↓
HALF_OPEN (permite N llamadas de prueba)
  │ si pasan → CLOSED
  │ si fallan → OPEN
```

### Implementación con WebClient

```java
// client/OrgServiceClient.java
@Service
@RequiredArgsConstructor
public class OrgServiceClient {

    private final WebClient.Builder webClientBuilder;
    private final CircuitBreakerRegistry cbRegistry;

    public Mono<OrgResponse> getOrganization(String orgId) {
        CircuitBreaker cb = cbRegistry.circuitBreaker("org-service");

        return Mono.fromCallable(() -> cb)
            .flatMap(circuitBreaker ->
                webClientBuilder.build()
                    .get()
                    .uri("http://vg-ms-organizations/api/v1/organizations/{id}", orgId)
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError,
                        res -> Mono.error(new ResourceNotFoundException("Org: " + orgId)))
                    .bodyToMono(OrgResponse.class)
                    .transformDeferred(CircuitBreakerOperator.of(circuitBreaker))
                    .onErrorReturn(CallNotPermittedException.class,
                        OrgResponse.unavailable())     // ← fallback cuando está OPEN
            );
    }
}
```

```yaml
# application.yaml — configuración Resilience4j
resilience4j:
  circuitbreaker:
    instances:
      org-service:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 60s
        permittedNumberOfCallsInHalfOpenState: 3
  retry:
    instances:
      org-service:
        maxAttempts: 3
        waitDuration: 500ms
        retryExceptions:
          - java.io.IOException
          - org.springframework.web.reactive.function.client.WebClientRequestException
  timelimiter:
    instances:
      org-service:
        timeoutDuration: 5s
```

---

## 11. Outbox Pattern

Garantiza consistencia entre la base de datos y la mensajería cuando se necesita publicar eventos tras una escritura.

```
Problema: si la escritura en BD y la publicación del evento son operaciones separadas,
puede quedar uno sin el otro si hay un fallo entre ambos.

Solución Outbox:
1. Escribir el registro + el evento en la MISMA transacción (tabla outbox)
2. Un proceso separado (Outbox Poller) lee la tabla y publica los eventos pendientes
3. Marcar el evento como publicado
```

```sql
-- Tabla outbox en PostgreSQL
CREATE TABLE outbox_events (
    id           BIGSERIAL   PRIMARY KEY,
    event_type   VARCHAR(100) NOT NULL,     -- "USER_CREATED"
    aggregate_id VARCHAR(100) NOT NULL,     -- userId
    payload      JSONB        NOT NULL,     -- evento completo
    published    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_outbox_unpublished ON outbox_events(published) WHERE published = FALSE;
```

```java
// service/impl/UserServiceImpl.java — escritura + outbox en misma transacción
@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl {

    private final UserRepository      userRepository;
    private final OutboxEventRepository outboxRepository;

    public Mono<User> createUser(User user) {
        return userRepository.save(user)
            .flatMap(saved -> {
                OutboxEvent event = OutboxEvent.builder()
                    .eventType("USER_CREATED")
                    .aggregateId(saved.getId().toString())
                    .payload(toJson(UserCreatedEvent.from(saved)))
                    .published(false)
                    .build();
                return outboxRepository.save(event).thenReturn(saved);
            });
    }
}
```

---

## 12. Database per Service

Cada microservicio tiene su propia base de datos. **Nunca compartir una BD entre dos microservicios.**

```
vg-ms-users         →  PostgreSQL: vg_users_db
vg-ms-organizations →  PostgreSQL: vg_organizations_db
vg-ms-enrollment    →  PostgreSQL: vg_enrollment_db
vg-ms-academic      →  PostgreSQL: vg_academic_db
vg-ms-audit         →  MongoDB:    vg_audit_db
vg-ms-notifications →  MongoDB:    vg_notifications_db
```

### Violaciones detectables

| Patrón                                                   | Violación                               |
| -------------------------------------------------------- | --------------------------------------- |
| Dos microservicios con la misma URL de BD                | Acoplamiento de datos                   |
| `UserRepository` inyectado en `EnrollmentService`        | Acceso cruzado a datos de otro dominio  |
| Entidad de otro servicio importada directamente          | Violación de dominio                    |
| Join SQL entre tablas de diferentes dominios de negocio  | Acoplamiento de esquemas                |

---

## 13. Comparativa de Patrones

| Criterio              | Layered    | Hexagonal                   | CQRS                          | EDA                          |
| --------------------- | ---------- | --------------------------- | ----------------------------- | ---------------------------- |
| Complejidad           | Baja       | Media-Alta                  | Alta                          | Alta                         |
| Desacoplamiento       | Bajo       | Alto                        | Muy alto                      | Máximo                       |
| Testabilidad          | Media      | Alta (dominio puro)         | Alta                          | Media (mock de eventos)      |
| Consistencia          | Fuerte     | Fuerte                      | Eventual                      | Eventual                     |
| Curva aprendizaje     | Baja       | Media-Alta                  | Alta                          | Alta                         |
| Ideal para            | CRUD simple| Lógica de negocio rica      | Lectura/escritura muy distintas | Ecosistema distribuido      |
| Recomendado V·VI PRS  | CRUD básico| Servicio core (users, orgs) | Solo si se justifica          | Notificaciones, auditoría    |
