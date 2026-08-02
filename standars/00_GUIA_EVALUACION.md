# Guía de Evaluación — Code Review Automatizado Valle Grande

> **Documento raíz.** Define cómo identificar el contexto de un repositorio, qué categorías evaluar, sus pesos y cómo calcular la calificación final. El sistema de code review debe leer este documento primero.

---

## 1. Identificar el Contexto del Repositorio

### 1.1 Por nombre del repositorio

| Patrón de nombre          | Stack principal                    | Semestre      |
| ------------------------- | ---------------------------------- | ------------- |
| `vg-ms-*` (sin `-be`)    | Microservicio Java (Spring)        | III, IV, V·VI |
| `vg-ms-*-be`             | Backend Python Flask               | IV            |
| `vg-fe-*`                | Frontend web (Angular o React)     | III, IV, V·VI |
| `vg-app-*`               | App móvil Expo / React Native      | IV            |
| Sin prefijo estándar      | Java Desktop (Swing)               | II            |

### 1.2 Por tecnología detectada en el repositorio

| Indicador (archivo / dependencia)                    | Stack            | Semestre  |
| ---------------------------------------------------- | ---------------- | --------- |
| `pom.xml` + `spring-boot-starter-web`                | Spring Boot MVC  | III       |
| `pom.xml` + `spring-boot-starter-webflux` + `r2dbc`  | Spring WebFlux   | IV, V·VI  |
| `requirements.txt` + `flask` + `mysql`               | Python Flask     | II        |
| `requirements.txt` + `flask` + `sqlite`              | Flask + SQLite   | IV        |
| `package.json` + `@angular/core`                     | Angular          | III, V·VI |
| `package.json` + `react` + `vite`                    | React Web        | IV, V·VI  |
| `app.json` + `expo`                                  | Expo/React Native| IV        |
| `.java` + `import javax.swing` + `JDBC`              | Java Swing       | II        |

### 1.3 Por semestre (tabla resumen)

| Semestre | Backend                             | Frontend             | Base de datos             |
| -------- | ----------------------------------- | -------------------- | ------------------------- |
| II       | Java Swing + JDBC **ó** Flask       | Jinja2 + Tailwind CDN| MySQL                     |
| III      | Spring Boot 3 MVC + JPA             | Angular 17+ (Bootstrap ó Tailwind) | SQL Server  |
| IV       | Spring WebFlux R2DBC **ó** Flask    | React 19 + Vite **ó** Expo | Oracle **ó** MongoDB **ó** SQLite |
| V·VI     | Spring WebFlux + PostgreSQL R2DBC   | Angular 17+ **ó** React 19 + TS | PostgreSQL + MongoDB |

> **Nota para el evaluador — versión de Angular:** donde se indica `Angular 17+`, el `+` significa **17 o superior**. Un proyecto con Angular 18, 19, 20 o cualquier versión mayor a 17 es válido y **no debe descontarse ni marcarse como desviación del stack**. Solo se marca violación si la versión detectada en `package.json` es **menor** a 17.

---

## 2. Categorías de Evaluación y Pesos

| #  | Categoría                         | Peso  | Documento de referencia         |
| -- | --------------------------------- | ----- | ------------------------------- |
| 1  | Estructura del Proyecto           | 15 %  | `02_ESTRUCTURAS_PROYECTO.md`    |
| 2  | Patrones de Arquitectura          | 20 %  | `04_PATRONES_ARQUITECTURA.md`   |
| 3  | Código Limpio                     | 20 %  | `03_CODIGO_LIMPIO.md`           |
| 4  | Base de Datos                     | 15 %  | `05_BASE_DATOS.md`              |
| 5  | Diseño de API REST                | 10 %  | `06_API_REST.md`                |
| 6  | Seguridad                         | 10 %  | `07_SEGURIDAD.md`               |
| 7  | Conventional Commits              | 5 %   | `09_CONVENTIONAL_COMMITS.md`    |
| 8  | Pruebas                           | 5 %   | `08_PRUEBAS.md`                 |
|    | **TOTAL**                         | **100 %** |                             |

> **Nota para el evaluador:** Si el repositorio es frontend puro (sin base de datos propia), la categoría "Base de Datos" se redistribuye: +5 % a Estructura y +10 % a Código Limpio. Si no tiene API propia, "Diseño de API REST" se redistribuye al resto proporcionalmente.

---

## 3. Escala de Calificación

| Puntaje final | Letra | Nivel      | Descripción                                                |
| ------------- | ----- | ---------- | ---------------------------------------------------------- |
| 90 – 100      | A     | Excelente  | Cumple todos los estándares, supera en varios criterios    |
| 75 – 89       | B     | Bueno      | Cumple la mayoría de estándares, fallos menores aislados   |
| 60 – 74       | C     | Suficiente | Cumple los estándares básicos, varios puntos mejorables    |
| 45 – 59       | D     | Deficiente | Incumple criterios importantes, requiere correcciones      |
| 0 – 44        | F     | Reprobado  | Incumple criterios fundamentales, rehacer desde la base    |

---

## 4. Descuentos Automáticos (aplican antes del cálculo final)

Estas violaciones descontarán puntos directamente del puntaje final, con independencia de las categorías.

| Violación                                                           | Descuento |
| ------------------------------------------------------------------- | --------- |
| Credenciales hardcodeadas en código (passwords, API keys, tokens)   | −15 pts   |
| Archivo `.env` subido al repositorio                                | −10 pts   |
| `node_modules/`, `.class`, `target/`, `__pycache__/`, `venv/` subidos | −5 pts |
| Ausencia total de `.gitignore`                                      | −5 pts    |
| Group ID incorrecto (no `pe.edu.vallegrande`)                       | −10 pts   |
| Nombre de proyecto incorrecto (no sigue convención `vg-ms-*`)      | −5 pts    |
| Tabla, columna, colección o entidad con nombre en español o mixto (no inglés) | −10 pts |

---

## 5. Rúbrica por Categoría

Cada categoría se puntúa de 0 a 100. Los niveles son:

| Puntaje categoría | Descripción                                                          |
| ----------------- | -------------------------------------------------------------------- |
| 90 – 100          | Sin incumplimientos. Supera lo esperado.                             |
| 70 – 89           | 1–2 incumplimientos menores que no afectan funcionamiento.           |
| 50 – 69           | Incumplimientos moderados. El patrón existe pero tiene errores.      |
| 25 – 49           | Incumplimientos graves. El patrón está mal implementado.             |
| 0 – 24            | No se aplica el patrón o se ignora completamente la categoría.       |

---

## 6. Proceso de Evaluación Paso a Paso

```
1. Leer este documento (00_GUIA_EVALUACION.md)
2. Identificar semestre y stack del repositorio (sección 1)
3. Para cada categoría (secciones del 2.1 al 2.8):
   a. Leer el documento de referencia correspondiente
   b. Verificar los criterios uno a uno contra el código
   c. Asignar puntaje de 0-100 a esa categoría
4. Calcular puntaje ponderado: Σ (puntaje_categoría × peso)
5. Aplicar descuentos automáticos (sección 4)
6. Asignar letra según escala (sección 3)
7. Generar reporte con hallazgos específicos por categoría
```

---

## 7. Formato del Reporte de Evaluación

El reporte final debe incluir:

```markdown
## Repositorio: [nombre]
## Semestre detectado: [II / III / IV / V·VI]
## Stack detectado: [ej. Spring WebFlux + MongoDB + React 19]

### Puntajes por Categoría
| Categoría              | Puntaje (0-100) | Peso  | Ponderado |
|------------------------|-----------------|-------|-----------|
| Estructura             | XX              | 15%   | XX.XX     |
| Patrones Arquitectura  | XX              | 20%   | XX.XX     |
| Código Limpio          | XX              | 20%   | XX.XX     |
| Base de Datos          | XX              | 15%   | XX.XX     |
| Diseño API REST        | XX              | 10%   | XX.XX     |
| Seguridad              | XX              | 10%   | XX.XX     |
| Conventional Commits   | XX              | 5%    | XX.XX     |
| Pruebas                | XX              | 5%    | XX.XX     |
| **Subtotal**           |                 |       | **XX.XX** |

### Descuentos Automáticos
- [Describir cada violación encontrada]: -X pts

### Puntaje Final: XX.XX / 100 — Letra: X

### Hallazgos Principales
**Cumple:**
- [lista de buenas prácticas encontradas]

**A mejorar (crítico):**
- [lista de violaciones graves]

**A mejorar (sugerido):**
- [lista de mejoras no críticas]
```
