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

### 2.1 Nombres de tablas

| Regla                             | Correcto             | Incorrecto              |
| --------------------------------- | -------------------- | ----------------------- |
| `snake_case`                      | `academic_records`   | `AcademicRecords`       |
| Plural                            | `clients`            | `client`, `Cliente`     |
| Minúsculas                        | `enrollment_periods` | `EnrollmentPeriods`     |
| Sin prefijo de tipo               | `users`              | `tbl_users`, `tb_users` |
| Español o inglés (consistente)    | `usuarios` ó `users` | mezclar ambos           |

### 2.2 Nombres de columnas

| Regla                             | Correcto             | Incorrecto              |
| --------------------------------- | -------------------- | ----------------------- |
| `snake_case`                      | `first_name`         | `firstName`, `FirstName`|
| Singular                          | `status`             | `statuses`              |
| Foreign key: `{tabla_singular}_id`| `organization_id`    | `orgId`, `idOrg`        |
| Booleanos: prefijo `is_` ó `has_` | `is_active`          | `active`, `activo`      |

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
| `status`     | CHAR(1) ó VARCHAR(1)   | Estado: `'A'` = activo, `'I'` = inactivo |

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
  flyway:
    enabled: true
    url: jdbc:postgresql://localhost:5432/vg_nombre_db
    user: ${DB_USERNAME}
    password: ${DB_PASSWORD}
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

## 5. Migraciones SQL — Flyway (Obligatorio en V·VI)

### Convención de nombres de scripts

```
src/main/resources/db/migration/
├── V1__create_schema.sql
├── V2__create_users_table.sql
├── V3__create_organizations_table.sql
├── V4__add_status_to_users.sql
└── V5__create_indexes.sql
```

**Formato obligatorio:** `V{número}__{descripción_en_snake_case}.sql`

### Ejemplo de script Flyway

```sql
-- V2__create_users_table.sql
CREATE TABLE users (
    id          BIGSERIAL       PRIMARY KEY,
    full_name   VARCHAR(100)    NOT NULL,
    email       VARCHAR(150)    NOT NULL UNIQUE,
    role        VARCHAR(30)     NOT NULL,
    org_id      BIGINT          REFERENCES organizations(id),
    status      CHAR(1)         NOT NULL DEFAULT 'A',
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_org_id ON users(org_id);
```

**Reglas de Flyway:**
- Scripts de migración son **inmutables** — nunca modificar un script ya ejecutado
- Para corregir, crear un nuevo script con versión superior
- El `ddl-auto` debe ser `validate` o `none` cuando Flyway está activo (no `update`)

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
    private String entityType;      // "USER", "ORGANIZATION"
    private String entityId;
    private String performedBy;     // userId del actor
    private String orgId;
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

- [ ] Tablas en `snake_case` plural
- [ ] Columnas en `snake_case` singular
- [ ] PK siempre llamada `id`
- [ ] FK con patrón `{tabla_singular}_id`
- [ ] Campos de auditoría: `created_at`, `updated_at`, `status`
- [ ] Borrado lógico (`status = 'I'`), no `DELETE` físico
- [ ] Credenciales en variables de entorno, no hardcodeadas
- [ ] Índices en columnas de búsqueda frecuente
- [ ] Scripts Flyway en `resources/db/migration/` (V·VI)
- [ ] `@Entity` + JPA ausente en proyectos WebFlux
- [ ] `@Table` de Spring Data (no JPA) en proyectos R2DBC
