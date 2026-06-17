# Comunicación entre Microservicios — Valle Grande

> Define los estándares de comunicación entre microservicios (sincrónica y asincrónica), entre servicios y frontend, y las herramientas aceptadas para cada escenario. Aplica principalmente a Semestre V·VI.

---

## Criterios de Evaluación

| Criterio                                                   | Peso |
| ---------------------------------------------------------- | ---- |
| Tipo de comunicación correcto según el escenario           | 30 % |
| Implementación correcta del cliente HTTP o broker          | 30 % |
| Manejo de fallos (Circuit Breaker, fallbacks)              | 20 % |
| Contratos de eventos bien definidos                        | 20 % |

---

## 1. Mapa de Comunicación del Ecosistema PRS

```
                    ┌─────────────────┐
  Angular/React ───►│  API Gateway    │─── JWT validation
                    │  vg-ms-gateway  │─── Rate limiting
                    │  :8080          │─── Routing
                    └────────┬────────┘
                             │ HTTP/REST (síncrono)
           ┌─────────────────┼──────────────────────┐
           ▼                 ▼                      ▼
   ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
   │ vg-ms-users  │  │  vg-ms-orgs  │  │ vg-ms-enrollment │
   │  PostgreSQL  │  │  PostgreSQL  │  │  PostgreSQL       │
   └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘
          │                 │                    │
          │    Eventos (asíncrono) via RabbitMQ/Kafka
          └──────────────────┴────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
   ┌──────────────────┐         ┌────────────────────┐
   │  vg-ms-audit     │         │ vg-ms-notifications│
   │  MongoDB         │         │ MongoDB             │
   └──────────────────┘         └────────────────────┘
```

---

## 2. Comunicación Sincrónica — HTTP/REST con WebClient

Usar cuando se necesita la **respuesta inmediata** para continuar la operación.

### Cuándo usar

| Escenario                                              | Motivo                          |
| ------------------------------------------------------ | ------------------------------- |
| Validar que una organización existe antes de crear usuario | Necesita respuesta ahora    |
| Obtener datos de otro servicio para armar un DTO       | Requiere datos en la respuesta  |
| Verificar permisos contra el servicio de auth          | Decisión síncrona de acceso     |
| Consulta de estado actual de un recurso externo        | Dato en tiempo real necesario   |

### WebClient — Cliente HTTP Reactivo

```java
// config/WebClientConfig.java
@Configuration
public class WebClientConfig {

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder()
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .codecs(c -> c.defaultCodecs().maxInMemorySize(1024 * 1024)); // 1MB buffer
    }
}
```

```java
// client/OrgServiceClient.java
@Service
@RequiredArgsConstructor
@Slf4j
public class OrgServiceClient {

    private final WebClient.Builder webClientBuilder;

    private static final String BASE_URL = "http://vg-ms-organizations";

    public Mono<OrgResponse> getOrganization(String orgId) {
        return webClientBuilder.build()
            .get()
            .uri(BASE_URL + "/api/v1/organizations/{id}", orgId)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, res ->
                res.bodyToMono(ErrorResponse.class)
                   .flatMap(err -> Mono.error(
                       new ResourceNotFoundException("Organization not found: " + orgId)
                   ))
            )
            .onStatus(HttpStatusCode::is5xxServerError, res ->
                Mono.error(new ServiceUnavailableException("vg-ms-organizations is unavailable"))
            )
            .bodyToMono(OrgResponse.class)
            .doOnError(e -> log.error("Failed to fetch org {}: {}", orgId, e.getMessage()));
    }

    public Mono<Boolean> existsOrganization(String orgId) {
        return webClientBuilder.build()
            .head()
            .uri(BASE_URL + "/api/v1/organizations/{id}", orgId)
            .exchangeToMono(res -> Mono.just(res.statusCode().is2xxSuccessful()));
    }
}
```

### WebClient con Circuit Breaker + Retry

```java
// client/UserServiceClient.java (llamado desde otro microservicio)
@Service
@RequiredArgsConstructor
public class UserServiceClient {

    private final WebClient.Builder webClientBuilder;
    private final CircuitBreakerRegistry circuitBreakerRegistry;
    private final RetryRegistry retryRegistry;

    public Mono<UserResponse> getUser(String userId) {
        CircuitBreaker cb    = circuitBreakerRegistry.circuitBreaker("user-service");
        Retry          retry = retryRegistry.retry("user-service");

        return webClientBuilder.build()
            .get()
            .uri("http://vg-ms-users/api/v1/users/{id}", userId)
            .retrieve()
            .bodyToMono(UserResponse.class)
            .transformDeferred(CircuitBreakerOperator.of(cb))
            .transformDeferred(RetryOperator.of(retry))
            .onErrorReturn(CallNotPermittedException.class,
                UserResponse.unavailable());   // fallback cuando el CB está OPEN
    }
}
```

```yaml
# application.yaml — Resilience4j config
resilience4j:
  circuitbreaker:
    instances:
      user-service:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 30s
        permittedNumberOfCallsInHalfOpenState: 3
      org-service:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 60s

  retry:
    instances:
      user-service:
        maxAttempts: 3
        waitDuration: 500ms
        retryExceptions:
          - java.io.IOException
          - org.springframework.web.reactive.function.client.WebClientRequestException

  timelimiter:
    instances:
      user-service:
        timeoutDuration: 5s
      org-service:
        timeoutDuration: 5s
```

---

## 3. Comunicación Asincrónica — RabbitMQ

Usar cuando la **respuesta inmediata no es necesaria** o cuando múltiples servicios deben reaccionar al mismo evento.

### Cuándo usar RabbitMQ

| Escenario                                              | Motivo                             |
| ------------------------------------------------------ | ---------------------------------- |
| Notificar que un usuario fue creado                    | Fire-and-forget, múltiples consumidores |
| Registrar en auditoría                                 | No debe bloquear la operación principal |
| Enviar email de bienvenida                             | Puede procesarse con retardo        |
| Sincronizar proyecciones de lectura (CQRS)             | Eventual consistency aceptable      |
| Coordinar Saga entre microservicios                    | Flujo de múltiples pasos            |

### Topología de Exchanges y Queues

```
Exchange: vg-exchange (tipo: topic)
  │
  ├── Binding: user.* ──────────────────────► Queue: audit-queue
  │                                                    │
  ├── Binding: user.created ──────────────────► Queue: notification-queue
  │                                                    │
  ├── Binding: user.created ──────────────────► Queue: auth-sync-queue
  │
  └── Binding: enrollment.created ────────────► Queue: academic-queue

Dead Letter Exchange: vg-dlx
  └── Queue: vg-dead-letter-queue  ← mensajes que fallaron 3 veces
```

### Configuración

```java
// config/RabbitMQConfig.java
@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE       = "vg-exchange";
    public static final String DLX            = "vg-dlx";
    public static final String AUDIT_QUEUE    = "audit-queue";
    public static final String NOTIF_QUEUE    = "notification-queue";
    public static final String DLQ            = "vg-dead-letter-queue";

    @Bean
    public TopicExchange mainExchange() {
        return ExchangeBuilder.topicExchange(EXCHANGE)
            .durable(true)
            .build();
    }

    @Bean
    public DirectExchange deadLetterExchange() {
        return ExchangeBuilder.directExchange(DLX).durable(true).build();
    }

    @Bean
    public Queue auditQueue() {
        return QueueBuilder.durable(AUDIT_QUEUE)
            .withArgument("x-dead-letter-exchange", DLX)
            .withArgument("x-dead-letter-routing-key", "dead")
            .withArgument("x-message-ttl", 86400000)  // 24h TTL
            .build();
    }

    @Bean
    public Queue notificationQueue() {
        return QueueBuilder.durable(NOTIF_QUEUE)
            .withArgument("x-dead-letter-exchange", DLX)
            .withArgument("x-dead-letter-routing-key", "dead")
            .build();
    }

    @Bean
    public Queue deadLetterQueue() {
        return QueueBuilder.durable(DLQ).build();
    }

    @Bean
    public Binding auditBinding(Queue auditQueue, TopicExchange mainExchange) {
        return BindingBuilder.bind(auditQueue).to(mainExchange).with("user.*");
    }

    @Bean
    public Binding notificationBinding(Queue notificationQueue, TopicExchange mainExchange) {
        return BindingBuilder.bind(notificationQueue).to(mainExchange).with("user.created");
    }

    @Bean
    public Binding dlqBinding(Queue deadLetterQueue, DirectExchange deadLetterExchange) {
        return BindingBuilder.bind(deadLetterQueue).to(deadLetterExchange).with("dead");
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory factory,
                                          MessageConverter converter) {
        RabbitTemplate template = new RabbitTemplate(factory);
        template.setMessageConverter(converter);
        template.setMandatory(true);
        return template;
    }
}
```

### Publisher de eventos

```java
// event/UserEventPublisher.java
@Component
@RequiredArgsConstructor
@Slf4j
public class UserEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishUserCreated(User user) {
        UserCreatedEvent event = UserCreatedEvent.builder()
            .eventId(UUID.randomUUID().toString())
            .userId(user.getId().toString())
            .email(user.getEmail())
            .role(user.getRole())
            .orgId(user.getOrgId())
            .occurredAt(Instant.now())
            .build();

        rabbitTemplate.convertAndSend(
            RabbitMQConfig.EXCHANGE,
            "user.created",       // routing key
            event
        );

        log.info("Published USER_CREATED event for user: {}", user.getId());
    }

    public void publishUserUpdated(User user) {
        // routing key: user.updated → va a audit-queue (user.*)
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, "user.updated",
            UserUpdatedEvent.from(user));
    }

    public void publishUserDeleted(String userId, String orgId) {
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, "user.deleted",
            UserDeletedEvent.of(userId, orgId, Instant.now()));
    }
}
```

### Consumer de eventos

```java
// event/NotificationEventListener.java (en vg-ms-notifications)
@Service
@Slf4j
public class NotificationEventListener {

    @RabbitListener(
        queues = RabbitMQConfig.NOTIF_QUEUE,
        ackMode = "MANUAL"       // confirmación manual para garantizar procesamiento
    )
    public void onUserCreated(UserCreatedEvent event,
                               Channel channel,
                               @Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag) {
        try {
            log.info("Received USER_CREATED for user: {}", event.getUserId());
            notificationService.sendWelcomeEmail(event.getEmail(), event.getUserId());
            channel.basicAck(deliveryTag, false);    // confirmar procesamiento exitoso
        } catch (Exception e) {
            log.error("Failed to process USER_CREATED event: {}", e.getMessage());
            try {
                channel.basicNack(deliveryTag, false, false); // rechazar → va a DLQ
            } catch (IOException ioException) {
                log.error("Failed to NACK message", ioException);
            }
        }
    }
}
```

```java
// event/AuditEventListener.java (en vg-ms-audit)
@Service
@RequiredArgsConstructor
@Slf4j
public class AuditEventListener {

    private final AuditLogRepository auditRepository;

    @RabbitListener(queues = RabbitMQConfig.AUDIT_QUEUE)
    public Mono<Void> onAnyUserEvent(Map<String, Object> eventPayload) {
        AuditLog log = AuditLog.builder()
            .eventType((String) eventPayload.get("eventType"))
            .entityId((String) eventPayload.get("userId"))
            .entityType("USER")
            .payload(eventPayload)
            .timestamp(Instant.now())
            .build();
        return auditRepository.save(log).then();
    }
}
```

---

## 4. Comunicación Asincrónica — Apache Kafka

Usar Kafka cuando se necesita **alta throughput**, **replay de eventos** o **event streaming**.

### Cuándo usar Kafka vs RabbitMQ

| Criterio            | Kafka                                   | RabbitMQ                              |
| ------------------- | --------------------------------------- | ------------------------------------- |
| Throughput          | Millones de msg/s                       | Miles–cientos de miles msg/s          |
| Persistencia        | Retiene mensajes (configurable)         | Elimina al consumir (default)         |
| Replay              | Sí — reset de offset                    | No — una vez consumido, se pierde     |
| Orden               | Garantizado por partición               | Garantizado por cola                  |
| Ideal para          | Auditoría, event sourcing, analytics    | Notificaciones, tareas, Saga          |
| Curva aprendizaje   | Alta                                    | Media                                 |

### Configuración Kafka

```yaml
# application.yaml
spring:
  kafka:
    bootstrap-servers: ${KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
      acks: all                  # espera confirmación de todos los replicas
      retries: 3
      properties:
        enable.idempotence: true  # exactamente una vez
    consumer:
      group-id: ${spring.application.name}
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "pe.edu.vallegrande.*"
```

### Tópicos del ecosistema PRS

```java
// constants/KafkaTopics.java
public final class KafkaTopics {
    public static final String USER_EVENTS        = "vg.user.events";
    public static final String ORG_EVENTS         = "vg.org.events";
    public static final String ENROLLMENT_EVENTS  = "vg.enrollment.events";
    public static final String AUDIT_EVENTS       = "vg.audit.events";
    private KafkaTopics() {}
}
```

### Producer Kafka

```java
// event/UserKafkaProducer.java
@Service
@RequiredArgsConstructor
@Slf4j
public class UserKafkaProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishUserCreated(User user) {
        UserCreatedEvent event = UserCreatedEvent.from(user);

        kafkaTemplate.send(
            KafkaTopics.USER_EVENTS,
            user.getId().toString(),  // key = userId (garantiza orden por usuario)
            event
        ).whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to publish USER_CREATED for user {}: {}",
                    user.getId(), ex.getMessage());
            } else {
                log.info("Published USER_CREATED to partition {} offset {}",
                    result.getRecordMetadata().partition(),
                    result.getRecordMetadata().offset());
            }
        });
    }
}
```

### Consumer Kafka

```java
// event/AuditKafkaConsumer.java (en vg-ms-audit)
@Service
@RequiredArgsConstructor
@Slf4j
public class AuditKafkaConsumer {

    private final AuditLogRepository auditRepository;

    @KafkaListener(
        topics = { KafkaTopics.USER_EVENTS, KafkaTopics.ORG_EVENTS, KafkaTopics.ENROLLMENT_EVENTS },
        groupId = "audit-consumer-group",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void consume(ConsumerRecord<String, Map<String, Object>> record) {
        log.info("Received event from topic={} partition={} offset={}",
            record.topic(), record.partition(), record.offset());

        AuditLog auditLog = AuditLog.builder()
            .eventType((String) record.value().get("eventType"))
            .aggregateId(record.key())
            .entityType(extractEntityType(record.topic()))
            .payload(record.value())
            .timestamp(Instant.ofEpochMilli(record.timestamp()))
            .build();

        auditRepository.save(auditLog).subscribe();
    }

    private String extractEntityType(String topic) {
        if (topic.contains("user"))       return "USER";
        if (topic.contains("org"))        return "ORGANIZATION";
        if (topic.contains("enrollment")) return "ENROLLMENT";
        return "UNKNOWN";
    }
}
```

---

## 5. Contrato de Eventos — Diseño de Payloads

Todo evento debe tener una estructura mínima estandarizada:

```java
// Estructura base de todos los eventos del ecosistema PRS
public record BaseEvent(
    String  eventId,        // UUID único — para idempotencia en el consumidor
    String  eventType,      // "USER_CREATED", "USER_UPDATED", etc.
    String  aggregateId,    // ID de la entidad principal del evento
    String  aggregateType,  // "USER", "ORGANIZATION", "ENROLLMENT"
    String  orgId,          // contexto de multi-tenancy
    Instant occurredAt,     // cuándo ocurrió en el origen
    String  correlationId,  // para trazabilidad a través de múltiples servicios
    int     version         // versión del esquema del evento (inicia en 1)
) {}

// Evento específico extiende o incluye el contrato base
@Builder
public record UserCreatedEvent(
    String  eventId,
    String  eventType,      // siempre "USER_CREATED"
    String  aggregateId,    // userId
    String  aggregateType,  // "USER"
    String  orgId,
    Instant occurredAt,
    String  correlationId,
    int     version,        // 1
    // campos específicos del evento:
    String  email,
    String  fullName,
    String  role
) {
    public static UserCreatedEvent from(User user) {
        return UserCreatedEvent.builder()
            .eventId(UUID.randomUUID().toString())
            .eventType("USER_CREATED")
            .aggregateId(user.getId().toString())
            .aggregateType("USER")
            .orgId(user.getOrgId())
            .occurredAt(Instant.now())
            .correlationId(MDC.get("correlationId"))
            .version(1)
            .email(user.getEmail())
            .fullName(user.getFullName())
            .role(user.getRole())
            .build();
    }
}
```

### Catálogo de eventos del ecosistema PRS

| Tópico / Exchange  | Routing Key           | Evento                  | Publicado por         | Consumido por                      |
| ------------------- | --------------------- | ----------------------- | --------------------- | ---------------------------------- |
| `vg-exchange`       | `user.created`        | `UserCreatedEvent`      | vg-ms-users           | vg-ms-notifications, vg-ms-auth, vg-ms-audit |
| `vg-exchange`       | `user.updated`        | `UserUpdatedEvent`      | vg-ms-users           | vg-ms-audit                        |
| `vg-exchange`       | `user.deleted`        | `UserDeletedEvent`      | vg-ms-users           | vg-ms-auth, vg-ms-audit            |
| `vg-exchange`       | `enrollment.created`  | `EnrollmentCreatedEvent`| vg-ms-enrollment      | vg-ms-notifications, vg-ms-audit   |
| `vg.user.events`    | key = userId          | `UserCreatedEvent`      | vg-ms-users           | vg-ms-audit (Kafka)                |

---

## 6. Comunicación Frontend → Backend

### Angular → API Gateway

```typescript
// core/adapters/httpClient.ts (Angular)
// El frontend SIEMPRE habla con el API Gateway, nunca directamente con un microservicio

@Injectable({ providedIn: 'root' })
export class HttpClientService {

    constructor(private http: HttpClient, private auth: AuthService) {}

    get<T>(path: string): Observable<T> {
        return this.http.get<T>(`${environment.apiUrl}${path}`);
        // environment.apiUrl = 'http://localhost:8080/api'
        // Todo va a través del Gateway en :8080
    }
}
```

```typescript
// core/interceptors/jwt.interceptor.ts
// Inyectar Bearer token en cada request al Gateway
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const token = auth.getToken();
    if (token) {
        req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return next(req);
};

// app.config.ts — registrar interceptor
export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
    ]
};
```

### React → API Gateway

```typescript
// core/adapters/httpClient.ts (React)
import axios from 'axios';
import { ENV } from '../config/env.config';

const httpClient = axios.create({
    baseURL: ENV.API_URL,   // http://localhost:8080/api — solo el Gateway
    timeout: 15_000,
});

// Interceptor de request — inyectar JWT
httpClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Interceptor de response — manejar 401/403
httpClient.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
        if (err.response?.status === 403) {
            window.location.href = '/unauthorized';
        }
        return Promise.reject(err);
    }
);

export { httpClient };
```

---

## 7. Comunicación entre Microservicios — Service Discovery (Eureka)

```yaml
# application.yaml — microservicio cliente
eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_URI:http://localhost:8761/eureka}
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true
    instance-id: ${spring.application.name}:${random.value}
```

```java
// Con Eureka, el WebClient usa el nombre lógico del servicio (load balanced)
@Bean
@LoadBalanced    // ← habilita resolución de nombre por Eureka
public WebClient.Builder loadBalancedWebClientBuilder() {
    return WebClient.builder();
}

// Usar nombre del servicio como host (Eureka lo resuelve a IP real)
webClientBuilder.build()
    .get()
    .uri("http://vg-ms-users/api/v1/users/{id}", userId)   // "vg-ms-users" = nombre en Eureka
    .retrieve()
    .bodyToMono(UserResponse.class);
```

---

## 8. Comunicación Gateway → Microservicios

```yaml
# vg-ms-gateway — application.yaml
spring:
  cloud:
    gateway:
      routes:
        - id: users-route
          uri: lb://vg-ms-users          # load balanced via Eureka
          predicates:
            - Path=/api/v1/users/**
          filters:
            - name: CircuitBreaker
              args:
                name: users-cb
                fallbackUri: forward:/fallback/users
            - AddRequestHeader=X-Gateway-Source, vg-gateway
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 50
                redis-rate-limiter.burstCapacity: 100

        - id: organizations-route
          uri: lb://vg-ms-organizations
          predicates:
            - Path=/api/v1/organizations/**
          filters:
            - name: CircuitBreaker
              args:
                name: orgs-cb

        - id: enrollment-route
          uri: lb://vg-ms-enrollment
          predicates:
            - Path=/api/v1/enrollment/**
```

```java
// Microservicios internos leen headers propagados por el Gateway
@Component
public class GatewayHeadersExtractor {

    public String extractUserId(ServerWebExchange exchange) {
        return exchange.getRequest().getHeaders().getFirst("X-User-Id");
    }

    public String extractUserRole(ServerWebExchange exchange) {
        return exchange.getRequest().getHeaders().getFirst("X-User-Role");
    }

    public String extractOrgId(ServerWebExchange exchange) {
        return exchange.getRequest().getHeaders().getFirst("X-Org-Id");
    }
}
```

---

## 9. Docker Compose — Infraestructura completa PRS

```yaml
# docker-compose.yml
version: '3.9'

services:

  # ─── INFRAESTRUCTURA ─────────────────────────────────────────
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME}"]
      interval: 10s
      retries: 5

  mongodb:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: [mongo_data:/data/db]

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"       # AMQP
      - "15672:15672"     # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBIT_USER}
      RABBITMQ_DEFAULT_PASS: ${RABBIT_PASSWORD}
    healthcheck:
      test: rabbitmq-diagnostics -q ping
      interval: 10s
      retries: 5

  zookeeper:
    image: confluentinc/cp-zookeeper:7.6.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

  kafka:
    image: confluentinc/cp-kafka:7.6.0
    depends_on: [zookeeper]
    ports: ["9092:9092"]
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1

  # ─── MICROSERVICIOS ──────────────────────────────────────────
  vg-ms-eureka:
    build: ./vg-ms-eureka
    ports: ["8761:8761"]
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8761/actuator/health"]
      interval: 15s
      retries: 5

  vg-ms-gateway:
    build: ./vg-ms-gateway
    ports: ["8080:8080"]
    depends_on:
      vg-ms-eureka:
        condition: service_healthy
    environment:
      EUREKA_URI: http://vg-ms-eureka:8761/eureka

  vg-ms-users:
    build: ./vg-ms-users
    depends_on:
      postgres:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
      vg-ms-eureka:
        condition: service_healthy
    environment:
      SPRING_R2DBC_URL: r2dbc:postgresql://postgres:5432/vg_users_db
      SPRING_R2DBC_USERNAME: ${DB_USERNAME}
      SPRING_R2DBC_PASSWORD: ${DB_PASSWORD}
      SPRING_RABBITMQ_HOST: rabbitmq
      SPRING_RABBITMQ_PORT: 5672
      SPRING_RABBITMQ_USERNAME: ${RABBIT_USER}
      SPRING_RABBITMQ_PASSWORD: ${RABBIT_PASSWORD}
      EUREKA_URI: http://vg-ms-eureka:8761/eureka
      JWT_SECRET: ${JWT_SECRET}

  vg-ms-organizations:
    build: ./vg-ms-organizations
    depends_on:
      postgres:
        condition: service_healthy
      vg-ms-eureka:
        condition: service_healthy
    environment:
      SPRING_R2DBC_URL: r2dbc:postgresql://postgres:5432/vg_orgs_db
      SPRING_R2DBC_USERNAME: ${DB_USERNAME}
      SPRING_R2DBC_PASSWORD: ${DB_PASSWORD}
      EUREKA_URI: http://vg-ms-eureka:8761/eureka

  vg-ms-notifications:
    build: ./vg-ms-notifications
    depends_on:
      rabbitmq:
        condition: service_healthy
      mongodb:
        condition: service_started
      vg-ms-eureka:
        condition: service_healthy
    environment:
      SPRING_DATA_MONGODB_URI: mongodb://mongodb:27017/vg_notifications_db
      SPRING_RABBITMQ_HOST: rabbitmq
      EUREKA_URI: http://vg-ms-eureka:8761/eureka

  vg-ms-audit:
    build: ./vg-ms-audit
    depends_on: [rabbitmq, kafka, mongodb, vg-ms-eureka]
    environment:
      SPRING_DATA_MONGODB_URI: mongodb://mongodb:27017/vg_audit_db
      SPRING_RABBITMQ_HOST: rabbitmq
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092
      EUREKA_URI: http://vg-ms-eureka:8761/eureka

volumes:
  postgres_data:
  mongo_data:
```

---

## 10. Tabla de Decisión — ¿Qué usar cuándo?

| Necesidad                                                    | Solución               | Herramienta         |
| ------------------------------------------------------------ | ---------------------- | ------------------- |
| Obtener datos de otro ms para responder al cliente           | Síncrona               | WebClient           |
| Validar existencia antes de crear                            | Síncrona               | WebClient           |
| Notificar que algo ocurrió (sin esperar respuesta)           | Asíncrona              | RabbitMQ            |
| Enviar email / push / SMS                                    | Asíncrona              | RabbitMQ            |
| Registrar en auditoría                                       | Asíncrona              | RabbitMQ o Kafka    |
| Flujo crítico multi-pasos con rollback (Saga)                | Asíncrona orquestada   | RabbitMQ + Saga     |
| Event streaming / analytics / replay de eventos              | Asíncrona              | Kafka               |
| Alta throughput (millones de eventos/s)                      | Asíncrona              | Kafka               |
| Enrutar requests del frontend                                | Sincrónica vía Gateway | Spring Cloud Gateway|
| Balanceo de carga entre instancias del mismo servicio        | Service Discovery      | Eureka + WebClient  |

---

## 11. Checklist de Comunicación

- [ ] Frontend NO llama directamente a microservicios — siempre pasa por el Gateway
- [ ] WebClient configurado como Bean con `@LoadBalanced`
- [ ] Servicios usan nombre lógico Eureka en las URIs (`http://vg-ms-users/...`)
- [ ] CircuitBreaker configurado en todos los clientes WebClient
- [ ] Eventos tienen `eventId` (UUID) para idempotencia
- [ ] Eventos tienen `correlationId` para trazabilidad
- [ ] Queues configuradas con Dead Letter Queue (DLX)
- [ ] Consumers usan `ackMode = MANUAL` para control del procesamiento
- [ ] Credenciales de RabbitMQ/Kafka en variables de entorno
- [ ] Docker Compose con `healthcheck` y `depends_on.condition: service_healthy`
- [ ] `application.yaml` de cada servicio usa nombres de host del compose (no `localhost`)
