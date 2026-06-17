# Estándares de Diseño API REST — Valle Grande

> Define cómo deben diseñarse los endpoints REST desde Semestre III en adelante. Aplica a Spring Boot MVC, Spring WebFlux y Flask con API JSON.

---

## Criterios de Evaluación de API REST

| Criterio                                           | Peso en la categoría |
| -------------------------------------------------- | -------------------- |
| URLs correctas (recurso, plural, kebab-case)       | 25 %                 |
| Verbos HTTP correctos por operación                | 20 %                 |
| Códigos de estado HTTP correctos                   | 20 %                 |
| Formato de respuesta consistente                   | 20 %                 |
| Versionado de API                                  | 15 %                 |

---

## 1. Diseño de URLs

### Reglas

| Regla                            | Correcto                          | Incorrecto                          |
| -------------------------------- | --------------------------------- | ----------------------------------- |
| Sustantivos (no verbos)          | `/api/v1/clients`                 | `/api/v1/getClients`                |
| Plural                           | `/api/v1/users`                   | `/api/v1/user`                      |
| `kebab-case`                     | `/api/v1/academic-records`        | `/api/v1/academicRecords`           |
| Minúsculas                       | `/api/v1/organizations`           | `/api/v1/Organizations`             |
| Recursos anidados                | `/api/v1/organizations/{id}/users`| `/api/v1/getUsersByOrg?orgId={id}`  |
| Versionado con `/v1`             | `/api/v1/clients`                 | `/api/clients` (sin versión)        |

### Jerarquía de recursos

```
/api/v1/organizations                          ← colección de organizaciones
/api/v1/organizations/{orgId}                  ← una organización específica
/api/v1/organizations/{orgId}/users            ← usuarios de esa organización
/api/v1/organizations/{orgId}/users/{userId}   ← un usuario específico dentro de la org
/api/v1/enrollments/{id}/grades                ← notas de una matrícula
```

### Filtros y búsquedas — Query params

```
/api/v1/users?status=A                         ← filtrar activos
/api/v1/users?role=TEACHER&orgId=5             ← múltiples filtros
/api/v1/users?page=0&size=20                   ← paginación
/api/v1/users?search=juan&sort=createdAt,desc  ← búsqueda + ordenamiento
```

---

## 2. Verbos HTTP por Operación

| Operación                    | Verbo HTTP | URL ejemplo                        |
| ---------------------------- | ---------- | ---------------------------------- |
| Listar todos los recursos    | `GET`      | `GET /api/v1/clients`              |
| Obtener un recurso por ID    | `GET`      | `GET /api/v1/clients/{id}`         |
| Crear un nuevo recurso       | `POST`     | `POST /api/v1/clients`             |
| Reemplazar un recurso completo | `PUT`    | `PUT /api/v1/clients/{id}`         |
| Actualizar parcialmente      | `PATCH`    | `PATCH /api/v1/clients/{id}`       |
| Eliminar (lógico)            | `DELETE`   | `DELETE /api/v1/clients/{id}`      |
| Restaurar un recurso inactivo| `PATCH`    | `PATCH /api/v1/clients/{id}/restore`|
| Cambiar estado específico    | `PATCH`    | `PATCH /api/v1/clients/{id}/status`|

### Violaciones comunes de verbos

```
GET  /api/v1/deleteClient/{id}     ← MAL: verbo en la URL
POST /api/v1/getClients            ← MAL: GET para leer, no POST
GET  /api/v1/clients/create        ← MAL: acción en la URL
POST /api/v1/clients/delete/{id}   ← MAL: usar DELETE
```

---

## 3. Códigos de Estado HTTP

| Situación                                          | Código | Nombre              |
| -------------------------------------------------- | ------ | ------------------- |
| Lectura exitosa (GET)                              | 200    | OK                  |
| Creación exitosa (POST)                            | 201    | Created             |
| Operación sin contenido de respuesta (DELETE)      | 204    | No Content          |
| Solicitud inválida (validación fallida)            | 400    | Bad Request         |
| No autenticado (sin token ó token inválido)        | 401    | Unauthorized        |
| Sin permisos (token válido pero rol insuficiente)  | 403    | Forbidden           |
| Recurso no encontrado                              | 404    | Not Found           |
| Conflicto (duplicado)                              | 409    | Conflict            |
| Error interno del servidor                         | 500    | Internal Server Error|

### Implementación en Spring WebFlux

```java
@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientRest {
    private final ClientService service;

    @GetMapping
    public Flux<ClientResponse> getAll() {
        return service.findAll();                        // 200 implícito con Flux
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<ClientResponse>> getById(@PathVariable Long id) {
        return service.findById(id)
            .map(ResponseEntity::ok)                     // 200 OK
            .defaultIfEmpty(ResponseEntity.notFound().build());  // 404
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)                  // 201 Created
    public Mono<ClientResponse> create(@RequestBody @Valid ClientRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<ClientResponse>> update(
            @PathVariable Long id,
            @RequestBody @Valid ClientRequest request) {
        return service.update(id, request)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)               // 204 No Content
    public Mono<Void> delete(@PathVariable Long id) {
        return service.delete(id);
    }

    @PatchMapping("/{id}/restore")
    public Mono<ResponseEntity<ClientResponse>> restore(@PathVariable Long id) {
        return service.restore(id)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
```

---

## 4. Formato de Respuesta Consistente

### Respuesta estándar de éxito

Todos los endpoints deben retornar una estructura consistente:

```json
{
  "data": { ... },
  "message": "Operación exitosa",
  "timestamp": "2025-06-17T10:30:00Z"
}
```

Para listados:

```json
{
  "data": [ ... ],
  "message": "OK",
  "page": 0,
  "pageSize": 20,
  "totalElements": 150,
  "totalPages": 8,
  "timestamp": "2025-06-17T10:30:00Z"
}
```

### Respuesta estándar de error

```json
{
  "error": "ResourceNotFoundException",
  "message": "Client not found with id: 42",
  "path": "/api/v1/clients/42",
  "timestamp": "2025-06-17T10:30:00Z",
  "status": 404
}
```

### DTOs de Request y Response separados

```java
// dto/ClientRequest.java — lo que llega del cliente (con validaciones)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientRequest {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    private String fullName;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    private String email;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^\\d{9}$", message = "El teléfono debe tener 9 dígitos")
    private String phone;
}

// dto/ClientResponse.java — lo que se retorna al cliente (sin datos sensibles)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String status;
    private LocalDateTime createdAt;
    // NO incluir: password, tokens, datos internos
}
```

**Regla:** Nunca retornar la entidad directamente. Siempre usar un DTO de respuesta.

---

## 5. GlobalExceptionHandler — Manejo Centralizado de Errores

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(ResourceNotFoundException ex, ServerWebExchange exchange) {
        return ErrorResponse.builder()
            .error("ResourceNotFoundException")
            .message(ex.getMessage())
            .path(exchange.getRequest().getPath().value())
            .status(404)
            .timestamp(Instant.now())
            .build();
    }

    @ExceptionHandler(WebExchangeBindException.class)      // validaciones @Valid
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidation(WebExchangeBindException ex, ServerWebExchange exchange) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(err -> err.getField() + ": " + err.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return ErrorResponse.builder()
            .error("ValidationException")
            .message(message)
            .path(exchange.getRequest().getPath().value())
            .status(400)
            .timestamp(Instant.now())
            .build();
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGeneric(Exception ex, ServerWebExchange exchange) {
        return ErrorResponse.builder()
            .error("InternalServerError")
            .message("Error interno del servidor")
            .path(exchange.getRequest().getPath().value())
            .status(500)
            .timestamp(Instant.now())
            .build();
    }
}
```

---

## 6. CORS Configuration

```java
// config/CorsConfig.java — OBLIGATORIO en todos los backends
@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOriginPattern("*");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }
}
```

---

## 7. API REST en Python Flask

```python
from flask import Blueprint, request, jsonify
from app.services import client_service

bp = Blueprint("clients", __name__, url_prefix="/api/v1/clients")

@bp.route("", methods=["GET"])
def list_clients():
    clients = client_service.get_all()
    return jsonify({"data": clients, "message": "OK"}), 200

@bp.route("/<int:client_id>", methods=["GET"])
def get_client(client_id):
    client = client_service.find_by_id(client_id)
    if client is None:
        return jsonify({"error": "Not Found",
                        "message": f"Cliente {client_id} no encontrado"}), 404
    return jsonify({"data": client, "message": "OK"}), 200

@bp.route("", methods=["POST"])
def create_client():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Bad Request", "message": "Body requerido"}), 400
    result = client_service.create(data)
    return jsonify({"data": result, "message": "Cliente creado"}), 201

@bp.route("/<int:client_id>", methods=["PUT"])
def update_client(client_id):
    data = request.get_json()
    result = client_service.update(client_id, data)
    if result is None:
        return jsonify({"error": "Not Found"}), 404
    return jsonify({"data": result, "message": "Cliente actualizado"}), 200

@bp.route("/<int:client_id>", methods=["DELETE"])
def delete_client(client_id):
    client_service.soft_delete(client_id)
    return "", 204
```

---

## 8. Paginación

### Spring WebFlux con R2DBC

```java
// Controller — recibe page y size como query params
@GetMapping
public Mono<ResponseEntity<PageResponse<ClientResponse>>> getAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {
    return service.findAll(PageRequest.of(page, size))
        .map(pageData -> ResponseEntity.ok(PageResponse.from(pageData)));
}
```

```json
// Respuesta paginada
{
  "data": [...],
  "page": 0,
  "pageSize": 20,
  "totalElements": 150,
  "totalPages": 8,
  "message": "OK",
  "timestamp": "2025-06-17T10:30:00Z"
}
```

---

## 9. Checklist de API REST

- [ ] URLs usan sustantivos en plural y kebab-case
- [ ] URL contiene versión: `/api/v1/`
- [ ] Verbo HTTP correcto por operación (GET leer, POST crear, PUT actualizar, DELETE eliminar)
- [ ] GET retorna 200, POST retorna 201, DELETE retorna 204
- [ ] Recursos no encontrados retornan 404
- [ ] Validaciones fallidas retornan 400
- [ ] `GlobalExceptionHandler` presente con `@RestControllerAdvice`
- [ ] `CorsConfig.java` presente y configurado
- [ ] DTOs Request y Response separados de la entidad
- [ ] Las entidades NO se retornan directamente en los endpoints
- [ ] No hay verbos en las URLs (`/getClient`, `/deleteUser`)
