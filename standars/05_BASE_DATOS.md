# Estándares de Base de Datos — Valle Grande

> Define convenciones de diseño, nomenclatura, modelado y configuración de bases de datos para todos los semestres y motores.

---

## Criterios de Evaluación de Base de Datos

| Criterio                                             | Peso en la categoría |
| ---------------------------------------------------- | -------------------- |
| Nomenclatura de tablas, columnas y colecciones       | 25 %                 |
| Diseño relacional correcto (PK, FK, normalización)   | 25 %                 |
| Configuración correcta en `application.yaml`         | 20 %                 |
| Campos de auditoría presentes                        | 15 %                 |
| Migraciones / scripts SQL versionados (V·VI)         | 15 %                 |

---

## 1. Bases de Datos por Semestre

| Semestre | Motor                     | Tipo       | Librería de acceso                       |
| -------- | ------------------------- | ---------- | ---------------------------------------- |
| II       | MySQL 8                   | Relacional | JDBC directo ó SQLAlchemy (Python)       |
| III      | SQL Server 2019+          | Relacional | Spring Data JPA + Hibernate              |
| IV       | Oracle XE ó MongoDB       | Rel / NoSQL| R2DBC (Oracle) ó ReactiveMongoRepository |
| IV       | SQLite                    | Relacional | `sqlite3` (Python estándar)              |
| V·VI     | PostgreSQL 16 (principal) | Relacional | Spring Data R2DBC                        |
| V·VI     | MongoDB 7 (logs/docs)     | NoSQL      | Spring Data Reactive MongoDB             |

---

## 2. Convenciones SQL (MySQL, SQL Server, PostgreSQL, Oracle, SQLite)

### 2.0 Idioma obligatorio: Inglés

**Regla crítica — validación principal del bot:** todo nombre de tabla, columna, colección, entidad, DTO y campo debe estar en **inglés**, sin excepción, en todos los semestres (II a V·VI) y en todos los motores de base de datos. No se acepta español ni mezcla de ambos idiomas.

**Por qué:** es el estándar de la industria, evita problemas de codificación con tildes/`ñ` en distintos motores, y mantiene consistencia con el código Java/Python que ya se escribe en inglés (`Client`, `ClientDto`, `full_name`).

Glosario de términos de dominio frecuentes (español → inglés) para no traducir mal:

| Español | Inglés | Español | Inglés |
| --- | --- | --- | --- |
| cliente | `client` | matrícula | `enrollment` |
| usuario | `user` | periodo académico | `academic_period` |
| estudiante | `student` | curso | `course` |
| docente / profesor | `teacher` | calificación | `grade` |
| organización | `organization` | asistencia | `attendance` |
| rol | `role` | pago / cuota | `payment` / `installment` |
| producto | `product` | comprobante | `receipt` |
| pedido / orden | `order` | estado | `status` |
| dirección | `address` | notificación | `notification` |

**Violación crítica detectable por el bot:** cualquier tabla, columna o entidad con nombre en español (`clientes`, `usuarios`, `nombre_completo`) descuenta puntos directamente — ver `00_GUIA_EVALUACION.md`, sección de descuentos automáticos.

### 2.1 Nombres de tablas

| Regla                             | Correcto             | Incorrecto              |
| --------------------------------- | -------------------- | ----------------------- |
| `snake_case`                      | `academic_records`   | `AcademicRecords`       |
| Plural                            | `clients`            | `client`, `Cliente`     |
| Minúsculas                        | `enrollment_periods` | `EnrollmentPeriods`     |
| Sin prefijo de tipo               | `users`              | `tbl_users`, `tb_users` |
| Siempre en inglés (ver 2.0)       | `users`              | `usuarios`, `clientes`  |

### 2.2 Nombres de columnas

| Regla                             | Correcto             | Incorrecto              |
| --------------------------------- | -------------------- | ----------------------- |
| `snake_case`                      | `first_name`         | `firstName`, `FirstName`|
| Singular                          | `status`             | `statuses`              |
| Foreign key: `{tabla_singular}_id`| `category_id`        | `categoryId`, `idCategory` |
| Booleanos (dominio, no ciclo de vida): prefijo `is_` ó `has_` | `is_verified` | `active`, `activo`, `is_active` junto a `status` (ver 2.4.1) |

### 2.3 Primary Keys

| Semestre | Motor       | Tipo recomendado      | Autoincremento                              |
| -------- | ----------- | --------------------- | ------------------------------------------- |
| II       | MySQL       | `INT` / `BIGINT`      | `AUTO_INCREMENT`                            |
| III      | SQL Server  | `BIGINT`              | `IDENTITY(1,1)`                             |
| IV       | Oracle      | `NUMBER(19)`          | Sequence + Trigger ó `GENERATED ALWAYS AS IDENTITY` |
| IV       | MongoDB     | `ObjectId`            | Automático (`_id`)                          |
| IV       | SQLite      | `INTEGER`             | `AUTOINCREMENT`                             |
| V·VI     | PostgreSQL  | `BIGINT` / `BIGSERIAL`| `GENERATED ALWAYS AS IDENTITY` ó `SERIAL`  |

**Regla:** La columna de clave primaria siempre se llama `id` (no `cliente_id`, no `cod_usuario`).

### 2.4 Campos de Auditoría Obligatorios

Todo modelo de datos debe incluir campos de auditoría para trazabilidad:

| Campo        | Tipo                    | Descripción                          |
| ------------ | ----------------------- | ------------------------------------ |
| `id`         | BIGINT / ObjectId       | Clave primaria                       |
| `created_at` | TIMESTAMP / DATETIME    | Fecha de creación (automático)       |
| `updated_at` | TIMESTAMP / DATETIME    | Fecha de última modificación         |
| `status`     | CHAR(1) ó VARCHAR(1)   | Estado del ciclo de vida del registro (ver 2.4.1) |

### 2.4.1 Manejo de Estados — Regla Única y Obligatoria

**Esta es la validación crítica que más se confunde. Hay una sola forma correcta, sin excepciones, en todos los semestres y motores.**

**Regla:** el **ciclo de vida del registro** (¿existe o fue borrado lógicamente?) se representa **siempre** con la columna/campo `status`, nunca con un booleano. Un booleano (`is_x` / `has_x`) se reserva **exclusivamente** para atributos de dominio independientes del ciclo de vida (`is_verified`, `has_paid_fees`, `is_featured`). Nunca coexisten `status` y un booleano de tipo `is_active`/`is_deleted` para lo mismo — eso duplica la fuente de verdad y permite estados contradictorios (`is_active = true` pero `status = 'I'`).

| Por qué NO un booleano para el ciclo de vida | Por qué SÍ `status` |
| ---------------------------------------------- | --------------------------------------------- |
| Un booleano solo modela 2 estados. El día que se necesite `PENDING`, `SUSPENDED`, `BANNED`, `ARCHIVED`, hay que migrar el schema (romper el contrato) | `status` ya soporta N valores sin tocar el tipo de columna |
| Dos columnas para la misma idea (`is_active` + `status`) violan **single source of truth** (Clean Code) — pueden quedar desincronizadas | Una sola columna, un solo lugar donde se decide si el registro está vivo |
| `is_deleted = true` es ambiguo con borrado lógico real vs. otros tipos de baja (ej. baja administrativa vs. autoeliminación) | El valor de `status` documenta explícitamente el motivo del estado |

**Tipo de columna por motor:**

| Motor                          | Tipo de columna         | Valores válidos                          |
| ------------------------------ | ------------------------ | ------------------------------------------ |
| MySQL / SQL Server / Oracle / SQLite | `CHAR(1)`           | `'A'` (activo) / `'I'` (inactivo)          |
| PostgreSQL                     | `CHAR(1)` ó `VARCHAR(20)` si hay más de 2 estados | `'A'` / `'I'`, o `'PENDING'`, `'SUSPENDED'`, etc. |
| MongoDB                        | `String`                 | `"A"` / `"I"` (mismo valor, sin comillas simples) |

**Regla para más de 2 estados:** si el dominio requiere más de activo/inactivo (ej. una orden con `PENDING`, `PAID`, `CANCELLED`), no se reutiliza `status` para eso — se crea una columna de dominio propia (`order_status`, `payment_status`) con su propio enum documentado, y `status` se mantiene aparte solo para el ciclo de vida del registro (borrado lógico).

**Mapeo obligatorio en el código (evita "primitive obsession" — Clean Code):** el campo `status` nunca se compara contra el string/char mágico directamente en la lógica de negocio; se mapea a un enum o constante nombrada.

```java
// MAL — magic string disperso en el código
if (client.getStatus().equals("A")) { ... }

// BIEN — enum con intención explícita
public enum RecordStatus {
    ACTIVE("A"), INACTIVE("I");
    private final String code;
    RecordStatus(String code) { this.code = code; }
    public String code() { return code; }
}

if (client.getStatus().equals(RecordStatus.ACTIVE.code())) { ... }
```

```python
# MAL
if client["status"] == "A": ...

# BIEN
class RecordStatus:
    ACTIVE = "A"
    INACTIVE = "I"

if client["status"] == RecordStatus.ACTIVE: ...
```

**Regla:** No eliminar registros físicamente (`DELETE`). Usar borrado lógico con `status = 'I'`.

```sql
-- MAL — eliminar físicamente
DELETE FROM clients WHERE id = 1;

-- BIEN — borrado lógico
UPDATE clients SET status = 'I', updated_at = NOW() WHERE id = 1;
```

### 2.5 Normalización

El diseño relacional debe estar en al menos **Tercera Forma Normal (3NF)**:

| Forma Normal | Regla                                                        |
| ------------ | ------------------------------------------------------------ |
| 1FN          | Sin grupos repetitivos, cada celda un valor atómico         |
| 2FN          | Sin dependencias parciales de la clave primaria              |
| 3FN          | Sin dependencias transitivas entre columnas no clave         |

```sql
-- MAL — viola 3FN: ciudad depende de código_postal, no de id
CREATE TABLE clients (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100),
    postal_code VARCHAR(10),
    city VARCHAR(50)          -- depende de postal_code, no de id
);

-- BIEN — separar en tabla cities
CREATE TABLE postal_codes (
    code VARCHAR(10) PRIMARY KEY,
    city VARCHAR(50)
);

CREATE TABLE clients (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100),
    postal_code VARCHAR(10) REFERENCES postal_codes(code)
);
```

### 2.6 Índices

```sql
-- Índice en columnas de búsqueda frecuente
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_enrollments_student_period ON enrollments(student_id, period_id);

-- Índice único donde aplique
CREATE UNIQUE INDEX uq_users_email ON users(email);
```

**Regla:** Crear índices en:
- Columnas usadas en `WHERE` frecuentemente
- Foreign keys
- Columnas de búsqueda de texto (`email`, `document_number`)
- Columnas de ordenamiento (`created_at`)

---

## 3. Configuración por Motor (application.yaml)

### MySQL (Semestre II — Spring Boot si aplica)

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/vg_nombre_db?useSSL=false&serverTimezone=UTC
    username: root
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

### SQL Server (Semestre III)

```yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=vg_nombre_db;encrypt=false
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
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

### Oracle R2DBC (Semestre IV)

```yaml
spring:
  r2dbc:
    url: r2dbc:oracle://localhost:1521/XEPDB1
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  sql:
    init:
      mode: always
server:
  port: 8080
```

### MongoDB (Semestre IV y V·VI — logs/docs)

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/vg_nombre_db
      auto-index-creation: true
server:
  port: 8080
```

### PostgreSQL R2DBC (Semestre V·VI — principal)

```yaml
spring:
  r2dbc:
    url: r2dbc:postgresql://localhost:5432/vg_nombre_db
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  sql:
    init:
      mode: always      # ejecuta schema.sql al iniciar
server:
  port: 8080
```

**Regla crítica:** Las credenciales (`username`, `password`) NUNCA van hardcodeadas. Siempre `${VARIABLE_DE_ENTORNO}`.

---

## 4. Entidades Java por Motor

### Spring Data JPA — SQL Server (Semestre III)

```java
@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(unique = true, nullable = false, length = 150)
    private String email;

    @Column(length = 1, columnDefinition = "CHAR(1) DEFAULT 'A'")
    private String status;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### Spring Data R2DBC — Oracle (Semestre IV)

```java
@Table("clients")                          // ← @Table de Spring Data, NO de JPA
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {
    @Id
    private Long id;                       // ← Long para Oracle (no @GeneratedValue en R2DBC)

    @Column("full_name")
    private String fullName;

    private String email;
    private String status;

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("updated_at")
    private LocalDateTime updatedAt;
}
```

### Spring Data Reactive MongoDB (Semestre IV y V·VI)

```java
@Document("clients")                       // ← nombre de la colección
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {
    @Id
    private ObjectId id;                   // ← ObjectId, no Long

    @Field("full_name")
    private String fullName;

    private String email;
    private String status;

    @Field("created_at")
    private Instant createdAt;

    @Field("updated_at")
    private Instant updatedAt;
}
```

---

## 5. Script SQL del Proyecto

### Convención de nombres

Cada proyecto mantiene un único script `schema.sql` en `src/main/resources/` (Java) o en la raíz del proyecto (Python) con la definición completa de tablas e índices.

```
src/main/resources/
└── schema.sql
```

### Ejemplo de script

```sql
-- schema.sql
CREATE TABLE users (
    id          BIGSERIAL       PRIMARY KEY,
    full_name   VARCHAR(100)    NOT NULL,
    email       VARCHAR(150)    NOT NULL UNIQUE,
    role        VARCHAR(30)     NOT NULL,
    status      CHAR(1)         NOT NULL DEFAULT 'A',
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

> **Multi-tenancy (`organization_id` / `org_id`):** solo aplica a los microservicios PRS de **Semestre V·VI** (ver `04_PATRONES_ARQUITECTURA.md`, sección Hexagonal/CQRS). En los semestres II, III y IV **no** se agrega columna de organización — los proyectos de esos ciclos no son multi-tenant.

**Regla:** `ddl-auto` en `application.yaml` debe ser `update` (nunca `create-drop` en un entorno compartido) para que Hibernate mantenga el schema sincronizado con las entidades.

---

## 6. Diseño MongoDB — Documentos

### Cuándo embeber vs cuándo referenciar

| Escenario                                              | Estrategia   | Razón                                     |
| ------------------------------------------------------ | ------------ | ----------------------------------------- |
| Datos que siempre se leen juntos (dirección de usuario)| Embeber      | Reduce consultas                          |
| Datos con cardinalidad 1-a-pocos (< 10 items)          | Embeber      | Eficiente en espacio y tiempo             |
| Datos con cardinalidad 1-a-muchos (> 10 items)         | Referenciar  | Documentos grandes degradan performance   |
| Entidades que existen independientemente               | Referenciar  | Evita duplicación de datos                |
| Datos de auditoría / eventos                           | Colección separada | Volumen alto, schema libre           |

### Ejemplo de documento de auditoría (colección separada)

```java
// model/AuditLog.java — MongoDB
@Document("audit_logs")
@Data
@Builder
public class AuditLog {
    @Id
    private ObjectId id;

    private String action;          // "USER_CREATED", "USER_UPDATED"
    private String entityType;      // "USER", "PRODUCT"
    private String entityId;
    private String performedBy;     // userId del actor
    private Object payload;         // Schema libre — JSON del estado anterior/nuevo
    private Instant timestamp;
}
```

---

## 7. Python — Base de Datos

### SQLite (Semestre IV)

```python
# app/settings.py
import os
DATABASE = os.path.join(os.path.dirname(__file__), '..', 'database.db')

# app/services/client_service.py
import sqlite3
from app import settings

def get_all():
    conn = sqlite3.connect(settings.DATABASE)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM clients WHERE status = 'A'").fetchall()
    conn.close()
    return [dict(r) for r in rows]
```

**Reglas Python + SQLite:**
- Siempre cerrar la conexión (`conn.close()` ó usar `with`)
- Usar `conn.row_factory = sqlite3.Row` para retornar dicts
- Usar placeholders `?` para parámetros — nunca f-strings en SQL (previene SQL injection)

```python
# MAL — vulnerable a SQL injection
conn.execute(f"SELECT * FROM users WHERE email = '{email}'")

# BIEN — placeholder seguro
conn.execute("SELECT * FROM users WHERE email = ?", (email,))
```

### SQLAlchemy + MySQL (Semestre II)

```python
# app/database.py
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

# app/models/client.py
from app.database import db

class Client(db.Model):
    __tablename__ = 'clients'
    id         = db.Column(db.Integer, primary_key=True)
    full_name  = db.Column(db.String(100), nullable=False)
    email      = db.Column(db.String(150), unique=True, nullable=False)
    status     = db.Column(db.String(1), default='A')
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
```

---

## 8. Checklist de Base de Datos

- [ ] Todo nombre de tabla, columna, colección y entidad está en **inglés** (ver 2.0)
- [ ] Tablas en `snake_case` plural
- [ ] Columnas en `snake_case` singular
- [ ] PK siempre llamada `id`
- [ ] FK con patrón `{tabla_singular}_id`
- [ ] Campos de auditoría: `created_at`, `updated_at`, `status`
- [ ] Borrado lógico (`status = 'I'`), no `DELETE` físico
- [ ] Credenciales en variables de entorno, no hardcodeadas
- [ ] Índices en columnas de búsqueda frecuente
- [ ] Script `schema.sql` en `resources/` con la definición de tablas e índices
- [ ] `@Entity` + JPA ausente en proyectos WebFlux
- [ ] `@Table` de Spring Data (no JPA) en proyectos R2DBC
