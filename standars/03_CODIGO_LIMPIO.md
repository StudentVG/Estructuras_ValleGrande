# Código Limpio — Valle Grande

> Criterios de calidad de código aplicables a todos los semestres y lenguajes. Un código limpio es legible, mantenible y no requiere comentarios para explicar lo que hace.

---

## Criterios de Evaluación

| Criterio                              | Peso |
| ------------------------------------- | ---- |
| Nomenclatura de identificadores       | 20 % |
| Tamaño y responsabilidad de funciones | 20 % |
| Principio DRY (no duplicación)        | 15 % |
| Principio SRP (una responsabilidad)   | 15 % |
| Ausencia de magic numbers/strings     | 10 % |
| Manejo de errores correcto            | 10 % |
| Calidad de comentarios y documentación| 10 % |

---

## 1. Nomenclatura de Identificadores

### Convenciones por lenguaje

| Elemento          | Java / Kotlin       | Python            | TypeScript / JS   |
| ----------------- | ------------------- | ----------------- | ----------------- |
| Clase             | PascalCase          | PascalCase        | PascalCase        |
| Método / función  | camelCase           | snake_case        | camelCase         |
| Variable local    | camelCase           | snake_case        | camelCase         |
| Constante         | UPPER_SNAKE_CASE    | UPPER_SNAKE_CASE  | UPPER_SNAKE_CASE  |
| Interfaz Java     | PascalCase (`IRepo` en Hexagonal) | — | PascalCase   |
| Enum              | PascalCase, valores UPPER_SNAKE | UPPER_SNAKE | enum PascalCase, valores UPPER_SNAKE |
| Archivo Java      | PascalCase          | snake_case        | PascalCase (.ts/.tsx) ó kebab-case (.js/.jsx) |
| Package / módulo  | lowercase           | snake_case        | camelCase ó kebab-case |

### Nombres que revelan intención

```java
// MAL
int d;
List<Object> list;
String s;
boolean flag;

// BIEN
int daysSinceCreation;
List<Client> activeClients;
String fullName;
boolean isAuthenticated;
```

```python
# MAL
def fn(x, y):
    return x * y * 0.18

# BIEN
def calculate_tax(unit_price: float, quantity: int) -> float:
    TAX_RATE = 0.18
    return unit_price * quantity * TAX_RATE
```

```typescript
// MAL
const x = users.filter(u => u.s === 'A');
const handleIt = (e: any) => {};

// BIEN
const activeUsers = users.filter(user => user.status === 'A');
const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {};
```

### Nombres prohibidos

| Patrón               | Problema                          | Corrección sugerida             |
| -------------------- | --------------------------------- | ------------------------------- |
| `a`, `b`, `x`, `i2` | Sin significado                   | Nombre descriptivo del dato     |
| `data`, `info`, `obj`| Demasiado genérico                | `userResponse`, `clientData`    |
| `doIt()`, `process()`| Verbo sin contexto                | `processPayment()`, `sendEmail()`|
| `flag`, `check`      | Booleano ambiguo                  | `isAuthenticated`, `hasExpired` |
| `temp`, `tmp`, `aux` | Variable transitoria sin nombre   | Nombrar según su contenido      |
| `Manager`, `Handler` sin contexto | Nombre comodín       | `UserAuthService`, `OrderProcessor` |

---

## 2. Tamaño y Responsabilidad de Funciones

| Indicador               | Ideal  | Aceptable | Inaceptable |
| ----------------------- | ------ | --------- | ----------- |
| Líneas por método       | ≤ 15   | 16–30     | > 30        |
| Parámetros por método   | ≤ 3    | 4–5       | > 5         |
| Niveles de indentación  | ≤ 2    | 3         | > 3         |
| Complejidad ciclomática | ≤ 5    | 6–10      | > 10        |

### Early return — reducir anidamiento

```java
// MAL — anidamiento profundo (complejidad alta)
public String getDiscount(User user) {
    if (user != null) {
        if (user.isActive()) {
            if (user.isPremium()) {
                return "20%";
            } else {
                return "5%";
            }
        } else {
            return "0%";
        }
    } else {
        return "0%";
    }
}

// BIEN — early return reduce indentación y complejidad
public String getDiscount(User user) {
    if (user == null || !user.isActive()) return "0%";
    return user.isPremium() ? "20%" : "5%";
}
```

---

## 3. Principio DRY — Don't Repeat Yourself

Si el mismo bloque de código aparece 2 o más veces, debe extraerse a un método o clase.

```java
// MAL — validación duplicada en create y update
public Mono<Client> createClient(ClientRequest req) {
    if (req.getName() == null || req.getName().isBlank())
        return Mono.error(new IllegalArgumentException("Name required"));
    if (req.getEmail() == null || req.getEmail().isBlank())
        return Mono.error(new IllegalArgumentException("Email required"));
    return repository.save(mapper.toEntity(req));
}

public Mono<Client> updateClient(Long id, ClientRequest req) {
    if (req.getName() == null || req.getName().isBlank())     // ← duplicado
        return Mono.error(new IllegalArgumentException("Name required"));
    if (req.getEmail() == null || req.getEmail().isBlank())   // ← duplicado
        return Mono.error(new IllegalArgumentException("Email required"));
    return repository.findById(id).flatMap(existing -> { ... });
}

// BIEN — validación extraída una vez
private Mono<Void> validateRequest(ClientRequest req) {
    if (req.getName() == null || req.getName().isBlank())
        return Mono.error(new IllegalArgumentException("Name required"));
    if (req.getEmail() == null || req.getEmail().isBlank())
        return Mono.error(new IllegalArgumentException("Email required"));
    return Mono.empty();
}

public Mono<Client> createClient(ClientRequest req) {
    return validateRequest(req).then(repository.save(mapper.toEntity(req)));
}

public Mono<Client> updateClient(Long id, ClientRequest req) {
    return validateRequest(req)
        .then(repository.findById(id))
        .flatMap(existing -> { ... });
}
```

---

## 4. Principio SRP — Single Responsibility Principle

```java
// MAL — ClientService hace demasiado
@Service
public class ClientService {
    public Client save(Client c) { ... }
    public void sendWelcomeEmail(Client c) { ... }      // ← no es su responsabilidad
    public String generateReport() { ... }               // ← no es su responsabilidad
    public void logAudit(String action) { ... }          // ← no es su responsabilidad
}

// BIEN — responsabilidades separadas
@Service public class ClientService { ... }              // solo CRUD de clientes
@Service public class EmailService  { ... }              // solo envío de emails
@Service public class AuditService  { ... }              // solo auditoría
```

---

## 5. Magic Numbers y Magic Strings

```java
// MAL
if (user.getRole().equals("SUPER_ADMIN")) { ... }
if (items.size() > 50) { ... }
double tax = price * 0.18;

// BIEN
private static final String ROLE_SUPER_ADMIN   = "SUPER_ADMIN";
private static final int    MAX_PAGE_SIZE      = 50;
private static final double TAX_RATE           = 0.18;

if (user.getRole().equals(ROLE_SUPER_ADMIN)) { ... }
if (items.size() > MAX_PAGE_SIZE) { ... }
double tax = price * TAX_RATE;
```

```typescript
// MAL
const active = users.filter(u => u.status === 'A');
if (res.status === 404) { ... }

// BIEN
const USER_STATUS = { ACTIVE: 'A', INACTIVE: 'I' } as const;
const HTTP_STATUS = { OK: 200, NOT_FOUND: 404, UNAUTHORIZED: 401 } as const;

const active = users.filter(u => u.status === USER_STATUS.ACTIVE);
if (res.status === HTTP_STATUS.NOT_FOUND) { ... }
```

---

## 6. Manejo de Errores

```java
// MAL
try {
    return repository.findById(id).get();
} catch (Exception e) {
    throw new Exception("Error");    // ← excepción genérica, mensaje inútil
}

// BIEN
public Mono<Client> findById(Long id) {
    return repository.findById(id)
        .switchIfEmpty(Mono.error(
            new ResourceNotFoundException("Client not found with id: " + id)
        ));
}
```

```python
# MAL
@bp.route('/clients/<int:id>')
def get_client(id):
    try:
        return jsonify(client_service.find_by_id(id))
    except:                                          # ← captura todo sin manejar
        return jsonify({'error': 'error'}), 500

# BIEN
@bp.route('/clients/<int:id>')
def get_client(id):
    client = client_service.find_by_id(id)
    if client is None:
        return jsonify({'error': f'Client {id} not found'}), 404
    return jsonify({'data': client}), 200
```

```typescript
// MAL
const fetchUsers = async () => {
    const res = await axios.get('/users');    // sin try/catch
    setUsers(res.data);
};

// BIEN
const fetchUsers = async () => {
    try {
        const { data } = await userService.getAll();
        setUsers(data.data);
    } catch (error) {
        const message = axios.isAxiosError(error)
            ? (error.response?.data?.message ?? 'Failed to load users')
            : 'Unexpected error';
        setError(message);
    } finally {
        setLoading(false);
    }
};
```

---

## 7. Comentarios — Estándares y Buenas Prácticas

### 7.1 Principio Fundamental

> **El código limpio no necesita comentarios para explicar lo que hace. Los comentarios explican el POR QUÉ, no el QUÉ.**

Si necesitas un comentario para explicar qué hace una línea de código, el nombre de la función, variable o clase es incorrecto.

---

### 7.2 Comentarios que NO se deben escribir

#### No comentar lo obvio

```java
// MAL — el comentario no agrega nada que el código no diga
// Get all clients
public Flux<Client> getAllClients() {
    return repository.findAll();
}

// MAL — comentario que repite el nombre del método
// Check if user is admin
if (user.isAdmin()) { ... }

// MAL — comentario que repite el tipo
// List of users
List<User> users = new ArrayList<>();

// MAL — comentario que explica el idioma
// Loop through clients
for (Client c : clients) { ... }
```

#### No dejar código comentado (código muerto)

```java
// MAL — código comentado que nadie sabe si se puede borrar
// public Mono<Client> findByEmail(String email) {
//     return repository.findByEmail(email);
// }
//
// public void sendNotification(Client c) {
//     emailService.send(c.getEmail(), "Welcome!");
// }

// BIEN — si no se usa, se borra. El historial de git guarda la historia.
```

#### No escribir comentarios que caducan

```java
// MAL — comentario con fecha o nombre de autor (caduca e induce a error)
// Added by Juan on 2024-01-15 for ticket VG-123
// TODO: fix this later (never done)
// TEMP: remove after testing

// BIEN — si es un TODO real con fecha y responsable, usar el formato estándar:
// TODO(juan.perez): Remove after migration to Flyway completes — deadline 2025-08-01
```

---

### 7.3 Comentarios que SÍ se deben escribir

Los únicos comentarios válidos explican **por qué** el código hace algo de una manera no obvia.

#### Restricción técnica o workaround

```java
// Oracle R2DBC does not support RETURNING clause; we must query again after insert
return repository.save(entity)
    .flatMap(saved -> repository.findById(saved.getId()));

// Spring WebFlux does not propagate SecurityContext automatically in async operations.
// ReactiveSecurityContextHolder must be set explicitly per chain.
return chain.filter(exchange)
    .contextWrite(ReactiveSecurityContextHolder.withAuthentication(auth));
```

#### Decisión de negocio no obvia

```java
// Status 'I' is used instead of physical DELETE to comply with audit requirements (GDPR).
// Never call repository.deleteById() — always use softDelete().
public Mono<Void> delete(Long id) {
    return repository.findById(id)
        .flatMap(entity -> {
            entity.setStatus("I");
            return repository.save(entity).then();
        });
}
```

#### Advertencia sobre consecuencias

```java
// WARNING: this method calls an external API that charges per request.
// Use the cached version getCachedExchangeRate() for non-critical reads.
public Mono<ExchangeRate> getLiveExchangeRate(String currency) { ... }
```

#### Aclaración de algoritmo complejo

```java
// Knuth-Morris-Pratt algorithm for substring search.
// Time complexity O(n+m) — chosen over indexOf() because we need to find all occurrences.
private List<Integer> findAllOccurrences(String text, String pattern) { ... }
```

---

### 7.4 JavaDoc — Cuándo y Cómo

JavaDoc solo se escribe en **API públicas de librerías o interfaces de dominio**. No en implementaciones internas.

#### Cuándo escribir JavaDoc

```java
// BIEN — interfaz de dominio pública (quién la implementa necesita el contrato)
/**
 * Port defining the contract for user persistence operations.
 * Implementations must guarantee idempotency on save operations.
 */
public interface IUserRepository {

    /**
     * Persists a user and returns the saved instance with generated ID.
     *
     * @param user the user to persist; must have a non-null email
     * @return the persisted user wrapped in a Mono
     * @throws DuplicateEmailException if the email already exists
     */
    Mono<User> save(User user);
}
```

#### Cuándo NO escribir JavaDoc

```java
// MAL — JavaDoc en método privado obvio
/**
 * Validates if the name is not null or blank.
 * @param name the name to validate
 * @return true if valid
 */
private boolean isValidName(String name) {
    return name != null && !name.isBlank();
}

// BIEN — sin JavaDoc, el código es autoexplicativo
private boolean isValidName(String name) {
    return name != null && !name.isBlank();
}
```

---

### 7.5 Python Docstrings — Estilo Google

Python usa docstrings (entre triple comillas) para documentar módulos, clases y funciones públicas.

#### Cuándo usar docstrings

```python
# BIEN — función pública con lógica no trivial
def calculate_enrollment_fee(student_level: str, scholarship_pct: float) -> float:
    """Calculate the enrollment fee after applying scholarship discount.

    Args:
        student_level: Academic level ('BASIC', 'INTERMEDIATE', 'ADVANCED').
        scholarship_pct: Scholarship percentage between 0.0 and 1.0.

    Returns:
        Final enrollment fee in PEN (Peruvian sol).

    Raises:
        ValueError: If scholarship_pct is outside [0.0, 1.0].
    """
    if not 0.0 <= scholarship_pct <= 1.0:
        raise ValueError(f"Invalid scholarship percentage: {scholarship_pct}")
    base_fee = BASE_FEES[student_level]
    return base_fee * (1 - scholarship_pct)
```

#### Cuándo NO usar docstrings

```python
# MAL — docstring que repite el nombre de la función
def get_all_clients():
    """Get all clients."""         # ← no agrega nada
    return client_service.get_all()

# BIEN — sin docstring, nombre es suficiente
def get_all_clients():
    return client_service.get_all()
```

---

### 7.6 TypeScript / JavaScript — JSDoc

En TypeScript, el sistema de tipos ya actúa como documentación. JSDoc se usa principalmente para:
- Librerías o módulos que otros desarrolladores consumen
- Funciones complejas de utilidad

```typescript
// BIEN — función utilitaria pública compleja
/**
 * Formats a date for display in the Peruvian locale.
 * Uses 'America/Lima' timezone by default to avoid UTC offset issues.
 *
 * @param date - ISO string or Date object
 * @param format - 'short' (dd/MM/yyyy) or 'long' (dd de MMMM de yyyy)
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const options: Intl.DateTimeFormatOptions = format === 'short'
        ? { day: '2-digit', month: '2-digit', year: 'numeric' }
        : { day: '2-digit', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('es-PE', { ...options, timeZone: 'America/Lima' }).format(d);
}
```

```typescript
// MAL — JSDoc que repite lo que TypeScript ya dice
/**
 * @param id - the user id
 * @returns a Promise with the user
 */
async function getUserById(id: string): Promise<User> { ... }

// BIEN — TypeScript hace el trabajo, sin JSDoc innecesario
async function getUserById(id: string): Promise<User> { ... }
```

---

### 7.7 Comentarios Inline — Regla de Oro

Un comentario inline válido explica una **decisión no obvia** en una sola línea corta.

```java
// BIEN — explica por qué, no qué
users.sort(Comparator.comparing(User::getCreatedAt).reversed()); // newest first per UX spec

return repository.findById(id)
    .delayElement(Duration.ofMillis(100));  // intentional delay to respect external API rate limit

// Avoid eager loading — this query returns 10k+ rows in production
.fetchSize(100)
```

```python
# BIEN
result = value & 0xFF  # mask to unsigned byte range (0–255)
time.sleep(0.5)        # Firebase SDK requires 500ms between consecutive writes
```

```typescript
// BIEN
const BCRYPT_ROUNDS = 12; // OWASP recommends 10-12 rounds for password hashing
z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/); // NIST SP 800-63B requirements
```

---

### 7.8 Resumen — Qué comentar y qué no

| Situación                                        | Comentar | Ejemplo válido                                     |
| ------------------------------------------------ | -------- | -------------------------------------------------- |
| Restricción técnica del framework o librería     | Sí       | `// R2DBC does not support RETURNING clause`       |
| Decisión de negocio no obvia                     | Sí       | `// Status 'I' for GDPR audit compliance`          |
| Advertencia sobre consecuencias de uso           | Sí       | `// WARNING: charges per API call`                 |
| Algoritmo complejo con nombre críptico           | Sí       | `// KMP algorithm — O(n+m) time complexity`        |
| Workaround a un bug conocido de librería externa | Sí       | `// Workaround for spring-data #1234`              |
| Explicar qué hace el código                      | No       | `// get all clients` antes de `findAll()`          |
| Repetir el nombre del método o variable          | No       | `// check if admin` antes de `if (user.isAdmin())` |
| Código comentado (muerto)                        | No       | `// old implementation: ...`                       |
| TODO sin fecha/responsable/ticket                | No       | `// TODO: fix later`                               |
| Comentarios de autor o fecha                     | No       | `// Added by Juan on 2024-01-15`                   |

---

## 8. Checklist de Código Limpio

- [ ] Nombres de variables/funciones/clases son descriptivos
- [ ] Funciones tienen ≤ 30 líneas
- [ ] Cada función hace UNA sola cosa
- [ ] Sin código duplicado (mismas 3+ líneas en 2+ lugares)
- [ ] Sin magic numbers ni magic strings sin constante nombrada
- [ ] Errores manejados con excepciones específicas (no genéricas)
- [ ] Sin `catch` vacíos o que solo hacen `e.printStackTrace()`
- [ ] Sin `console.log()`, `print()` o `System.out.println()` de debug commiteados
- [ ] Sin código comentado (bloques `//` que fueron código funcional)
- [ ] Sin `any` en TypeScript sin justificación
- [ ] Sin `TODO` sin fecha, responsable o ticket asociado
- [ ] Comentarios explican el POR QUÉ, no el QUÉ
- [ ] JavaDoc/docstrings solo en interfaces públicas complejas
- [ ] Sin JavaDoc que repite el nombre del método
