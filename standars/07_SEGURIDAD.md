# Estándares de Seguridad — Valle Grande

> Define los estándares de seguridad obligatorios para todos los semestres: manejo de credenciales, autenticación (Firebase Auth o Keycloak), autorización RBAC, validación de entradas y configuración profesional de Spring Security.

---

## Criterios de Evaluación de Seguridad

| Criterio                                              | Peso |
| ----------------------------------------------------- | ---- |
| Sin credenciales hardcodeadas (código o repositorio)  | 30 % |
| Validación de entradas correcta                       | 20 % |
| Configuración de autenticación correcta               | 25 % |
| RBAC y autorización por endpoint                      | 15 % |
| Variables de entorno y .gitignore                     | 10 % |

---

## 1. Regla de Oro — Cero Credenciales en el Código

**Violación más crítica. Descuento automático de −15 puntos si se detecta.**

### Lo que NUNCA debe estar en el repositorio

```java
// MAL — Java hardcodeado
String password = "admin123";
String jwtSecret = "mySecretKey";
String dbUrl = "jdbc:postgresql://prod.db:5432/vg?user=admin&password=secret";
```

```yaml
# MAL — application.yaml con credenciales reales
spring:
  datasource:
    username: postgres
    password: mi_password_real   # ← NUNCA
  security:
    jwt:
      secret: miClaveSecreta     # ← NUNCA
```

```typescript
// MAL — Firebase config con API key real en el código
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXX",  // ← NUNCA
  authDomain: "vg-prs.firebaseapp.com"
};
```

### Lo correcto

```yaml
# BIEN — application.yaml usa placeholders de entorno
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:5432/${DB_NAME:vg_db}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  security:
    jwt:
      secret: ${JWT_SECRET}
      expiration: ${JWT_EXPIRATION:86400000}
```

```bash
# .env — NUNCA subir a git (en .gitignore)
DB_HOST=localhost
DB_NAME=vg_users_db
DB_USERNAME=postgres
DB_PASSWORD=segura_contraseña_aqui
JWT_SECRET=clave_de_512_bits_minimo_aqui
```

```typescript
// BIEN — React/Angular usan variables del sistema de build
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

// BIEN — Angular usa environments/
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  firebaseConfig: {
    apiKey: '<placeholder>',   // valor real en CI/CD, no en código
  }
};
```

### .gitignore obligatorio por stack

```gitignore
# Java / Spring
target/
*.class
*.jar
.env
.env.local

# Python
venv/
__pycache__/
*.pyc
*.pyo
.env
instance/
*.db

# Node.js / Angular / React
node_modules/
dist/
build/
.env
.env.local
.env.production
.env.staging

# Expo / React Native
.expo/
node_modules/
.env

# IDE
.idea/
.vscode/
*.iml
.DS_Store
```

---

## 2. Opciones de Autenticación

Valle Grande usa dos sistemas de autenticación según el semestre y el tipo de proyecto:

| Sistema       | Semestre de uso                   | Cuándo elegirlo                        |
| ------------- | --------------------------------- | -------------------------------------- |
| **Firebase Auth** | IV (MVP rápido) / V·VI opción A | Multi-proveedor fácil, equipo pequeño  |
| **Keycloak**  | V·VI (Enterprise, multi-org)     | Multi-tenancy, OIDC estándar, control total |
| **JWT propio**| III (básico)                     | Solo para aprendizaje, sin OAuth       |

---

## 3. Firebase Auth — Configuración Profesional

### Backend Spring Boot con Firebase

#### Dependencia

```xml
<!-- pom.xml -->
<dependency>
    <groupId>com.google.firebase</groupId>
    <artifactId>firebase-admin</artifactId>
    <version>9.3.0</version>
</dependency>
```

#### Inicialización del SDK

```java
// config/FirebaseConfig.java
@Configuration
public class FirebaseConfig {

    @Value("${firebase.credentials.path}")
    private String credentialsPath;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            FileInputStream serviceAccount =
                new FileInputStream(credentialsPath);
            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();
            return FirebaseApp.initializeApp(options);
        }
        return FirebaseApp.getInstance();
    }

    @Bean
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        return FirebaseAuth.getInstance(firebaseApp);
    }
}
```

```yaml
# application.yaml
firebase:
  credentials:
    path: ${FIREBASE_CREDENTIALS_PATH:/etc/secrets/firebase-service-account.json}
```

#### Filtro de validación de token (WebFlux)

```java
// security/FirebaseAuthenticationFilter.java
@Component
@RequiredArgsConstructor
public class FirebaseAuthenticationFilter implements WebFilter {

    private final FirebaseAuth firebaseAuth;

    private static final List<String> PUBLIC_PATHS =
        List.of("/api/v1/auth/", "/actuator/health");

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getPath().value();

        if (isPublicPath(path)) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest()
            .getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String idToken = authHeader.substring(7);

        return Mono.fromCallable(() -> firebaseAuth.verifyIdToken(idToken))
            .flatMap(decoded -> {
                String uid = decoded.getUid();
                String role = (String) decoded.getClaims().getOrDefault("role", "STUDENT");
                String orgId = (String) decoded.getClaims().get("orgId");

                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                        uid, null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    );

                // Propagar orgId en el contexto para multi-tenancy
                ServerWebExchange mutated = exchange.mutate()
                    .request(r -> r.header("X-User-Id", uid)
                                   .header("X-User-Role", role)
                                   .header("X-Org-Id", orgId != null ? orgId : ""))
                    .build();

                return chain.filter(mutated)
                    .contextWrite(ReactiveSecurityContextHolder.withAuthentication(auth));
            })
            .onErrorResume(FirebaseAuthException.class, e -> {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            })
            .subscribeOn(Schedulers.boundedElastic());
    }

    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }
}
```

#### Asignar roles con Custom Claims (backend de administración)

```java
// service/impl/AuthServiceImpl.java
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final FirebaseAuth firebaseAuth;

    public Mono<Void> assignRole(String uid, String role, String orgId) {
        return Mono.fromCallable(() -> {
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", role);       // "SUPER_ADMIN", "ORG_ADMIN", "TEACHER", "STUDENT"
            claims.put("orgId", orgId);
            firebaseAuth.setCustomUserClaims(uid, claims);
            return null;
        }).subscribeOn(Schedulers.boundedElastic()).then();
    }
}
```

#### Frontend React — inicialización y login

```typescript
// core/config/firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey:       import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:   import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:    import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:        import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseApp  = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
```

```typescript
// core/services/auth.service.ts
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../config/firebase.config';
import { httpClient } from '../adapters/httpClient';

export const authService = {
    login: async (email: string, password: string) => {
        const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const idToken = await credential.user.getIdToken();
        localStorage.setItem('access_token', idToken);

        // Forzar refresh de claims (roles custom asignados en backend)
        const tokenResult = await credential.user.getIdTokenResult(true);
        return { user: credential.user, role: tokenResult.claims['role'] };
    },

    logout: async () => {
        await signOut(firebaseAuth);
        localStorage.removeItem('access_token');
    },

    // Renovar token antes de expirar (Firebase lo hace automáticamente cada hora)
    getCurrentToken: async () => {
        const user = firebaseAuth.currentUser;
        if (!user) return null;
        return user.getIdToken(); // renueva automáticamente si expiró
    },
};
```

---

## 4. Keycloak — Configuración Profesional (V·VI Enterprise)

### Arquitectura con Keycloak

```
Frontend Angular/React
     ↓  redirige a Keycloak Login
Keycloak (Realm: vg-prs)
     ↓  emite access_token (JWT) + refresh_token
API Gateway (Spring Cloud Gateway)
     ↓  valida JWT con Keycloak JWKS
Microservicios (solo confían en el Gateway)
```

### Docker Compose — Keycloak

```yaml
# docker-compose.yml
services:
  keycloak:
    image: quay.io/keycloak/keycloak:25.0
    command: start-dev
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak_db
      KC_DB_USERNAME: ${DB_USERNAME}
      KC_DB_PASSWORD: ${DB_PASSWORD}
      KEYCLOAK_ADMIN: ${KC_ADMIN_USER}
      KEYCLOAK_ADMIN_PASSWORD: ${KC_ADMIN_PASSWORD}
      KC_HTTP_PORT: 8180
    ports:
      - "8180:8180"
    depends_on:
      - postgres
```

### Spring Boot — Resource Server con Keycloak JWKS

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
```

```yaml
# application.yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: ${KEYCLOAK_ISSUER_URI:http://localhost:8180/realms/vg-prs}
          jwk-set-uri: ${KEYCLOAK_ISSUER_URI:http://localhost:8180/realms/vg-prs}/protocol/openid-connect/certs
```

```java
// config/SecurityConfig.java — Keycloak Resource Server
@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain filterChain(ServerHttpSecurity http) {
        return http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .authorizeExchange(auth -> auth
                .pathMatchers("/api/v1/auth/**", "/actuator/health").permitAll()
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(keycloakJwtConverter()))
            )
            .build();
    }

    @Bean
    public ReactiveJwtAuthenticationConverterAdapter keycloakJwtConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter =
            new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("realm_access.roles");
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);

        return new ReactiveJwtAuthenticationConverterAdapter(jwtConverter);
    }
}
```

---

## 5. JWT Propio — Configuración Profesional (Semestre III y fallback)

```java
// security/JwtUtil.java
@Component
public class JwtUtil {

    @Value("${security.jwt.secret}")
    private String secret;

    @Value("${security.jwt.expiration:86400000}")
    private long expirationMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String userId, String role, String orgId) {
        return Jwts.builder()
            .subject(userId)
            .claim("role", role)
            .claim("orgId", orgId)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expirationMs))
            .signWith(getSigningKey(), Jwts.SIG.HS512)
            .compact();
    }

    public Claims validateToken(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
```

```java
// security/JwtAuthenticationFilter.java — WebFlux
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter implements WebFilter {

    private final JwtUtil jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String authHeader = exchange.getRequest()
            .getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return chain.filter(exchange);
        }

        try {
            Claims claims = jwtUtil.validateToken(authHeader.substring(7));
            String userId = claims.getSubject();
            String role   = claims.get("role", String.class);
            String orgId  = claims.get("orgId", String.class);

            UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                    userId, null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + role))
                );

            return chain.filter(exchange)
                .contextWrite(ReactiveSecurityContextHolder.withAuthentication(auth));

        } catch (JwtException e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }
}
```

```java
// config/SecurityConfig.java — JWT propio
@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityWebFilterChain filterChain(ServerHttpSecurity http) {
        return http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
            .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
            .authorizeExchange(auth -> auth
                .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .pathMatchers("/api/v1/auth/login",
                               "/api/v1/auth/register",
                               "/actuator/health").permitAll()
                .pathMatchers(HttpMethod.GET, "/api/v1/**")
                    .hasAnyRole("SUPER_ADMIN", "ORG_ADMIN", "TEACHER", "STUDENT")
                .pathMatchers(HttpMethod.POST, "/api/v1/users")
                    .hasAnyRole("SUPER_ADMIN", "ORG_ADMIN")
                .pathMatchers(HttpMethod.PUT, "/api/v1/**")
                    .hasAnyRole("SUPER_ADMIN", "ORG_ADMIN")
                .pathMatchers(HttpMethod.DELETE, "/api/v1/**")
                    .hasRole("SUPER_ADMIN")
                .anyExchange().authenticated()
            )
            .addFilterAt(jwtAuthFilter, SecurityWebFiltersOrder.AUTHENTICATION)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
```

---

## 6. Sistema de Roles RBAC

### Roles del ecosistema Valle Grande

| Rol           | Nivel  | Permisos principales                                               |
| ------------- | ------ | ------------------------------------------------------------------ |
| `SUPER_ADMIN` | Global | Todo: gestionar orgs, crear admins, configuración global           |
| `ORG_ADMIN`   | Org    | CRUD usuarios de su org, gestionar cursos, niveles, ver reportes   |
| `TEACHER`     | Cursos | Registrar notas/asistencia, ver alumnos de sus cursos              |
| `STUDENT`     | Perfil | Solo leer sus propios datos (notas, asistencia, horario)           |

### Tabla de acceso por endpoint (referencia para verificación)

| Método   | Path                         | Roles permitidos                        |
| -------- | ---------------------------- | --------------------------------------- |
| `GET`    | `/api/v1/users`              | `SUPER_ADMIN`, `ORG_ADMIN`              |
| `GET`    | `/api/v1/users/{id}`         | `SUPER_ADMIN`, `ORG_ADMIN`, `STUDENT`   |
| `POST`   | `/api/v1/users`              | `SUPER_ADMIN`, `ORG_ADMIN`              |
| `PUT`    | `/api/v1/users/{id}`         | `SUPER_ADMIN`, `ORG_ADMIN`              |
| `DELETE` | `/api/v1/users/{id}`         | `SUPER_ADMIN`                           |
| `GET`    | `/api/v1/organizations`      | `SUPER_ADMIN`                           |
| `POST`   | `/api/v1/enrollment`         | `ORG_ADMIN`                             |
| `POST`   | `/api/v1/grades`             | `TEACHER`                               |
| `GET`    | `/api/v1/grades/my`          | `STUDENT`                               |

### @PreAuthorize en métodos específicos

```java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserRest {

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_ADMIN')")
    public Flux<UserResponse> getAll() { ... }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<UserResponse> create(@RequestBody @Valid UserRequest req) { ... }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> delete(@PathVariable Long id) { ... }
}
```

---

## 7. Validación de Entradas

### Spring Boot — Bean Validation

```java
// dto/UserRequest.java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).+$",
        message = "Password must contain at least one uppercase, one number, and one special character"
    )
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    @NotBlank(message = "Organization ID is required")
    private String orgId;
}
```

### Prevención de SQL Injection

```java
// BIEN — siempre usar parámetros nombrados, nunca concatenar
@Query("SELECT u FROM User u WHERE u.email = :email AND u.status = :status")
Mono<User> findByEmailAndStatus(@Param("email") String email, @Param("status") String status);
```

```python
# BIEN — placeholder ? para SQLite, %s para MySQL
cursor.execute("SELECT * FROM users WHERE email = ? AND status = ?", (email, 'A'))
```

---

## 8. CORS — Configuración Profesional

```java
// config/CorsConfig.java — WebFlux
@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins:*}")
    private String allowedOrigins;

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // En producción: especificar dominios, no "*"
        if ("*".equals(allowedOrigins)) {
            config.addAllowedOriginPattern("*");
        } else {
            Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .forEach(config::addAllowedOrigin);
        }

        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("PATCH");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }
}
```

```yaml
# application.yaml — control por entorno
cors:
  allowed-origins: ${CORS_ALLOWED_ORIGINS:*}
  # Producción: https://app.vallegrande.edu.pe,https://admin.vallegrande.edu.pe
```

---

## 9. Frontend — Autenticación e Interceptores

### React — Interceptor Axios con renovación de token

```typescript
// core/adapters/httpClient.ts
import axios from 'axios';
import { ENV } from '../config/env.config';
import { authService } from '../services/auth.service';

const httpClient = axios.create({
    baseURL: ENV.API_URL,
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json' },
});

// Request: inyectar token vigente
httpClient.interceptors.request.use(async (config) => {
    // Para Firebase: obtener token fresco (renueva automáticamente)
    const token = await authService.getCurrentToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response: manejar errores de autenticación/autorización
httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        if (status === 401) {
            await authService.logout();
            window.location.href = '/login';
        }
        if (status === 403) {
            window.location.href = '/unauthorized';
        }
        return Promise.reject(error);
    }
);

export { httpClient };
```

### Angular — Interceptor JWT

```typescript
// core/interceptors/jwt.interceptor.ts
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const auth  = inject(AuthService);
    const router = inject(Router);
    const token = auth.getToken();

    const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                auth.logout();
                router.navigate(['/login']);
            }
            if (error.status === 403) {
                router.navigate(['/unauthorized']);
            }
            return throwError(() => error);
        })
    );
};
```

### Guards de rutas

```typescript
// Angular — role.guard.ts
export const roleGuard: CanActivateFn = (route) => {
    const auth   = inject(AuthService);
    const router = inject(Router);
    const requiredRole = route.data?.['role'] as string;

    if (!auth.getToken()) return router.createUrlTree(['/login']);
    if (!auth.hasRole(requiredRole)) return router.createUrlTree(['/unauthorized']);
    return true;
};

// React — RoleRoute.tsx
export default function RoleRoute({ allowed }: { allowed: Role[] }) {
    const hasRole = useAuthStore(s => s.hasRole);
    return allowed.some(r => hasRole(r))
        ? <Outlet />
        : <Navigate to="/unauthorized" replace />;
}
```

---

## 10. Comparativa Firebase Auth vs Keycloak

| Criterio              | Firebase Auth                     | Keycloak                           |
| --------------------- | --------------------------------- | ---------------------------------- |
| Infraestructura       | Cloud gestionado (Google)         | Self-hosted (Docker / K8s)         |
| Multi-tenancy         | Limitado (Identity Platform $$$)  | Nativo — 1 Realm = 1 org           |
| Protocolo             | JWT propio + OAuth providers      | OAuth 2.0 / OIDC estándar completo |
| Roles                 | Custom claims manuales (código)   | RBAC completo (Realm + Client)     |
| Proveedores sociales  | Google, GitHub, Facebook, Phone   | Google, GitHub, SAML, LDAP         |
| Costo                 | Gratis < 50k MAU                  | Gratis — pagas infra del servidor  |
| Curva de aprendizaje  | Baja (SDK + Console web)          | Alta (Realms, Flows, SPIs, Admin)  |
| Control de datos      | Google Cloud (no tuyo)            | Total (tu servidor)                |
| Ideal para            | MVP / equipo pequeño / sem IV     | Enterprise multi-org / V·VI        |

---

## 11. Checklist de Seguridad

- [ ] Sin contraseñas, API keys ni secrets hardcodeados en el código
- [ ] `.env` en `.gitignore` — no subido al repositorio
- [ ] `node_modules/`, `target/`, `venv/` en `.gitignore`
- [ ] Credenciales con `${VARIABLE}` en YAML o `os.getenv()` en Python
- [ ] `.env.example` presente con nombres de variables (sin valores reales)
- [ ] Validación de entradas con `@Valid` (Spring) o Zod (TS) o validación manual (Python)
- [ ] Sin concatenación de strings en consultas SQL
- [ ] `CorsConfig.java` presente y configurado
- [ ] `GlobalExceptionHandler` presente
- [ ] JWT validado en cada request protegido (sem IV y V·VI)
- [ ] RBAC con roles correctos por endpoint (`@PreAuthorize` o `authorizeExchange`)
- [ ] Interceptor JWT en el frontend (Angular: `jwt.interceptor.ts` / React: `httpClient.ts`)
- [ ] Guards de rutas privadas (`authGuard` / `roleGuard` en Angular; `ProtectedRoute` / `RoleRoute` en React)
- [ ] `PasswordEncoder` configurado con BCrypt (no MD5, no SHA1)
