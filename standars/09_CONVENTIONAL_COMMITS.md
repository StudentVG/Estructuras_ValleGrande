# Conventional Commits — Valle Grande

> **All commit messages must be written in English.** No Spanish is allowed in any commit message, scope, or description. This rule applies to all semesters (II through V·VI).

---

## Evaluation Criteria

| Criterion                                           | Weight |
| --------------------------------------------------- | ------ |
| Valid commit types used                             | 30 %   |
| Correct format `type: description`                  | 25 %   |
| Description in imperative, lowercase, no period     | 25 %   |
| Atomic commits (one logical change per commit)      | 20 %   |

---

## 1. Message Format

### Minimum structure (mandatory)

```
type: description in imperative mood
```

### Full structure (optional)

```
type(scope): short imperative description

Optional body: detailed explanation of the change.
Can span multiple lines.

Optional footer: BREAKING CHANGE: description
Closes #123
```

---

## 2. Allowed Types

### Core types (mandatory — all semesters)

| Type       | When to use                                                    | Example                                               |
| ---------- | -------------------------------------------------------------- | ----------------------------------------------------- |
| `feat`     | New feature for the user                                       | `feat: add client registration endpoint`              |
| `fix`      | Bug fix                                                        | `fix: correct empty email validation`                 |
| `docs`     | Documentation changes (README, comments)                       | `docs: update installation instructions`              |
| `style`    | Formatting only (spaces, indentation). No logic change         | `style: format code with prettier`                    |
| `refactor` | Code restructuring without changing functionality              | `refactor: extract validation logic to service`       |
| `test`     | Add or modify tests                                            | `test: add unit tests for ClientService`              |
| `chore`    | Maintenance (configs, dependencies, CI/CD, .gitignore)         | `chore: update Spring Boot dependencies`              |
| `perf`     | Performance improvement without changing functionality         | `perf: add pagination to client list endpoint`        |

### Additional types (optional)

| Type      | When to use                                       | Example                                             |
| --------- | ------------------------------------------------- | --------------------------------------------------- |
| `build`   | Changes to build system or external dependencies  | `build: add docker plugin to pom.xml`               |
| `ci`      | Changes to CI/CD pipelines                        | `ci: add staging deployment workflow`               |
| `revert`  | Revert a previous commit                          | `revert: revert "feat: add DELETE endpoint"`        |

---

## 3. Mandatory Rules

### Rule 1 — Everything in lowercase (type and description)

```
✅ feat: add login endpoint
❌ Feat: Add Login Endpoint
❌ FEAT: ADD LOGIN ENDPOINT
```

### Rule 2 — Colon followed by a single space

```
✅ feat: description
❌ feat:description         ← missing space
❌ feat :description        ← space before colon
❌ feat - description       ← dash instead of ":"
```

### Rule 3 — Imperative mood in the description

The verb must be in the base/imperative form, as if giving a command.

```
✅ feat: add form validation
✅ fix: correct AccessDB connection error
✅ refactor: move business logic to ClientService

❌ feat: added form validation        ← past tense
❌ feat: adding form validation       ← gerund
❌ feat: form validation was added    ← passive voice
```

### Rule 4 — First letter of description in lowercase

```
✅ feat: add delete button
❌ feat: Add delete button
```

### Rule 5 — No period at the end

```
✅ feat: add client endpoint
❌ feat: add client endpoint.
```

### Rule 6 — Maximum 72 characters on the first line

If more detail is needed, use the commit body (blank line + text).

```
✅ feat: implement hexagonal architecture in vg-ms-users
❌ feat: implement the hexagonal architecture with ports and adapters in the users microservice with full JWT support
   (too long — use the body)
```

### Rule 7 — One commit = one logical change

```
✅ Two atomic commits:
   feat: add POST endpoint for clients
   feat: add DELETE endpoint for clients

❌ One commit mixing multiple changes:
   feat: add POST and DELETE endpoints for clients and fix login bug and update README
```

---

## 4. Language Rule

**All commit messages, scopes, and descriptions must be in English.**

```
✅ feat(users): add email search by organization
✅ fix(auth): correct JWT token expiration handling
✅ refactor(enrollment): extract validation to separate service
✅ docs(readme): add database configuration section
✅ chore(docker): update postgres version in compose file

❌ feat(usuarios): agregar búsqueda por email          ← Spanish forbidden
❌ fix: corregir error en AccessDB                     ← Spanish forbidden
❌ refactor: mover lógica al servicio                  ← Spanish forbidden
```

---

## 5. Scope (Optional)

The scope indicates the module or component affected. It goes in parentheses after the type.

```
feat(users): add email search endpoint
fix(auth): correct token refresh timing
refactor(enrollment): extract validation to service
docs(readme): add database configuration guide
style(client-form): apply prettier formatting
test(organizations): add test for branch creation
chore(docker): update postgres to 16-alpine
perf(reports): add cache to dashboard query
```

**Scope rules:**
- Lowercase only
- No spaces — use hyphens if needed
- Module name, entity, or component

---

## 6. Breaking Changes

A change that breaks backward compatibility. Two ways to mark it:

```
// Option 1: Exclamation mark after the type
feat!: change /api/users response to paginated format
refactor(auth)!: replace symmetric JWT with asymmetric RS256

// Option 2: BREAKING CHANGE footer
feat: migrate authentication to OAuth 2.0

BREAKING CHANGE: previous JWT tokens are no longer valid.
Clients must re-authenticate using the new OAuth flow.
```

---

## 7. Examples by Semester

### Semester II — Java Swing / Python Flask

```bash
# Java Swing
feat: create main client view with JTable
feat: add product edit form
fix: correct MySQL connection in AccessDB
refactor: extract SQL logic to ClientDAO class
style: format code according to IntelliJ conventions
docs: add README with execution instructions
chore: add .gitignore for .class and out/ files
test: add unit test for ClientService

# Flask Web
feat: add client blueprint with full CRUD
feat: create base.html template with Tailwind CDN
fix: correct redirect path after client creation
refactor: move connection to database.py with factory pattern
style: format HTML templates with correct indentation
docs: document API endpoints in README
chore: update requirements.txt with new dependencies
```

### Semester III — Spring Boot + Angular

```bash
# Spring Boot
feat: add GET /api/v1/clients endpoint with pagination
feat: implement GlobalExceptionHandler with @ControllerAdvice
fix: correct JPA mapping in Client entity (email field)
refactor: extract email validation to private method
chore: migrate application.properties to application.yaml
test: add integration tests for ClientRepository
docs: document API endpoints in Swagger

# Angular
feat: create client-list component with Bootstrap table
feat: implement auth.guard for protected routes
fix: correct expired token interceptor behavior
refactor: move HTTP services to core/services
style: format .ts files according to TSLint rules
chore: update Angular from 17 to 18
```

### Semester IV — WebFlux + React + Expo

```bash
# Spring WebFlux
feat: add reactive GET /api/v1/clients endpoint with Flux
feat: implement ClientRepository with ReactiveCrudRepository
fix: correct ObjectId serialization in MongoDB
refactor: add ClientService interface with separate impl
perf: add reactive cache with Caffeine to list endpoint
chore: add oracle-r2dbc driver to pom.xml

# React + Vite
feat: create ClientList component with Tailwind and Axios
feat: add useClients hook for state management
fix: correct protected route not redirecting to login
refactor: move HTTP calls to services/clientService.js
style: apply Prettier format to all components
chore: update Vite from 5 to 6

# Expo / React Native
feat: create client list screen with FlatList
feat: add tab navigation with Expo Router
fix: correct TypeScript types in clientService
refactor: extract styles to StyleSheet.create
chore: update Expo SDK from 51 to 52
test: add test for useClients hook
```

### Semester V·VI — Enterprise Microservices

```bash
# Backend microservices
feat: implement hexagonal architecture in vg-ms-users
feat: add RabbitMQ producer for USER_CREATED event
feat: configure SecurityConfig with JWT and RBAC roles
feat: add Resilience4j CircuitBreaker to WebClient calls
fix: correct event deserialization in RabbitMQ consumer
fix: correct RBAC — TEACHER should not create users
refactor: migrate from layered to hexagonal in users service
refactor: separate domain input and output ports
perf: add composite index on organizations(org_id, status)
chore: add Flyway for versioned SQL migrations
chore: update Docker Compose with RabbitMQ and PostgreSQL
docs: document PRS microservices ecosystem in README

# Frontend enterprise
feat: implement lazy loading on all private routes
feat: add JWT interceptor in Axios with 401 handling
feat: create RoleRoute component for RBAC route protection
fix: correct logout not clearing Zustand auth state
refactor: migrate from Context API to Zustand in authStore
style: reorganize feature modules folder structure
chore: add environment configuration for staging
```

---

## 8. Good vs Bad Commits

### Good commits

```
feat: add POST /api/v1/clients endpoint
fix: correct NullPointerException when client not found
docs: add installation section to README
refactor: extract validations to ValidationUtil class
test: add test for duplicate email in ClientService
chore: add .env.example with required variables
perf: implement server-side pagination on client list
feat(users): add search by email and active status
fix(auth): refresh token 5 minutes before expiration
build: add Docker multi-stage build to Dockerfile
ci: add GitHub Actions workflow for automated tests
```

### Bad commits

```
update                                           ← no type, no description
various fixes                                    ← no type, too vague
wip                                              ← not a valid type
asdf                                             ← meaningless
Fix: Correct Bug                                 ← capitalized type
fix:correct bug                                  ← missing space after colon
FEAT: add login                                  ← uppercase type
feat: Added form validation                      ← past tense
feat: Add delete button.                         ← capitalized + period
fix: fix things                                  ← vague description
feat: add login, register, dashboard and reports ← multiple changes
agregar endpoint de clientes                     ← Spanish — NOT ALLOWED
feat: agregar validación                         ← Spanish — NOT ALLOWED
```

---

## 9. Branch Naming Convention

| Branch type              | Format                             | Example                          |
| ------------------------ | ---------------------------------- | -------------------------------- |
| New feature              | `feat/<short-description>`         | `feat/client-crud`               |
| Bug fix                  | `fix/<short-description>`          | `fix/login-validation`           |
| Production hotfix        | `hotfix/<short-description>`       | `hotfix/null-pointer-users`      |
| Release                  | `release/<version>`                | `release/1.2.0`                  |
| Refactoring              | `refactor/<description>`           | `refactor/hexagonal-users`       |
| Documentation            | `docs/<description>`               | `docs/api-endpoints`             |

---

## 10. Validation Regex

The code review system uses this regex to validate each commit:

```regex
^(feat|fix|docs|style|refactor|test|chore|perf|build|ci|revert)(\([a-z0-9\-]+\))?(!)?: [a-z].{9,70}[^.]$
```

**Breakdown:**
- `^(feat|fix|...)` — valid type at the start
- `(\([a-z0-9\-]+\))?` — optional scope: lowercase letters, numbers, and hyphens
- `(!)?` — optional breaking change marker
- `: ` — colon + space (mandatory)
- `[a-z]` — first character of description must be lowercase
- `.{9,70}` — description between 9 and 70 additional characters
- `[^.]$` — must not end with a period

### Validator severity table

| Rule                               | Verification                                                        | Severity |
| ---------------------------------- | ------------------------------------------------------------------- | -------- |
| Valid type                         | Matches the list of allowed types                                   | ERROR    |
| Correct format `type: description` | Full regex passes                                                   | ERROR    |
| Lowercase type                     | No uppercase in the type                                            | ERROR    |
| Non-empty description              | At least 10 characters                                              | ERROR    |
| English language                   | No Spanish words detected (agregé, agregar, corregir, actualizar…) | ERROR    |
| Max 72 characters on line 1        | `len(first_line) <= 72`                                             | WARNING  |
| No period at the end               | Does not end with `.`                                               | WARNING  |
| Imperative mood                    | Does not start with: "added", "adding", "fixed", "fixing"          | WARNING  |
| Atomic commit                      | Diff analysis — only related files per commit                       | INFO     |

---

## 11. Workflow Example

```bash
# 1. Create feature branch
git checkout -b feat/client-crud

# 2. Develop with small, atomic commits
git add src/service/ClientService.java
git commit -m "feat: add ClientService interface with CRUD methods"

git add src/service/impl/ClientServiceImpl.java
git commit -m "feat: implement ClientServiceImpl with business logic"

git add src/rest/ClientRest.java
git commit -m "feat: add GET and POST /api/v1/clients endpoints"

git add src/dto/
git commit -m "feat: add ClientRequest and ClientResponse DTOs"

git add src/exception/
git commit -m "feat: add GlobalExceptionHandler for REST errors"

git add src/test/
git commit -m "test: add unit tests for ClientService"

# 3. Push and open Pull Request
git push origin feat/client-crud
```
