# 🎨 Estándares Frontend — Valle Grande

> Documento de referencia para **code review automatizado**. Contiene TODOS los estándares frontend definidos por semestre (II al V·VI).

---

## Índice

1. [Semestre II — HTML + CSS + Tailwind CDN + JS (Flask Templates)](#semestre-ii--html--css--tailwind-cdn--js-flask-templates)
2. [Semestre III — Angular 17+ (Bootstrap 5)](#semestre-iii--angular-17-bootstrap-5)
3. [Semestre IV — React 19 + Vite + Tailwind CSS](#semestre-iv--react-19--vite--tailwind-css)
4. [Semestre IV — Expo / React Native (TypeScript)](#semestre-iv--expo--react-native-typescript)
5. [Semestre V·VI — Angular Enterprise (Microservicios)](#semestre-vvi--angular-enterprise-microservicios)
6. [Semestre V·VI — React Enterprise (Microservicios)](#semestre-vvi--react-enterprise-microservicios)

---

---

# Semestre II — HTML + CSS + Tailwind CDN + JS (Flask Templates)

## Stack Tecnológico

| Tecnología     | Rol                                        |
| -------------- | ------------------------------------------ |
| HTML5          | Estructura de las páginas                  |
| CSS3           | Estilos base si se necesitan               |
| Tailwind CSS   | Framework CSS vía CDN (no npm)             |
| JavaScript ES6 | Lógica del lado del cliente                |
| Jinja2         | Motor de templates de Flask                |

## Integración con Flask

El frontend se renderiza desde el servidor Flask usando templates Jinja2. No es un SPA.

### Archivos Frontend dentro del proyecto Flask

```
app/
├── static/
│   ├── css/           ← estilos adicionales si se necesitan
│   ├── js/
│   │   └── main.js    ← lógica del cliente
│   └── img/           ← imágenes del proyecto
└── templates/
    ├── base.html      ← layout maestro con CDN de Tailwind
    └── clientes/
        ├── index.html ← lista
        └── form.html  ← formulario
```

## Reglas Obligatorias

- **Tailwind CSS se integra vía CDN** en `base.html` — **sin npm, sin build**.
- `base.html` debe incluir:

  ```html
  <script src="https://cdn.tailwindcss.com"></script>
  ```

- Usar bloques Jinja para herencia de templates:
  - `{% block title %}{% endblock %}`
  - `{% block content %}{% endblock %}`
- Archivos JS en `static/js/`.
- Imágenes en `static/img/`.
- Las páginas extienden `base.html` con `{% extends "base.html" %}`.

## Template Base de Referencia

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>{% block title %}Mi Proyecto{% endblock %}</title>
</head>
<body class="bg-gray-100">
  {% block content %}{% endblock %}
</body>
</html>
```

---

---

# Semestre III — Angular 17+ (Bootstrap 5)

## Stack Tecnológico

| Tecnología        | Rol                              |
| ----------------- | -------------------------------- |
| Angular 17+       | Framework SPA                    |
| TypeScript 5      | Lenguaje tipado obligatorio      |
| Bootstrap 5       | Estilos y componentes CSS        |
| Node.js 20+       | Entorno de ejecución             |
| Angular CLI       | Scaffolding y comandos           |
| VS Code           | Editor de código                 |

## Estructura de Directorios

```
vg-fe-{nombre}/
├── src/
│   ├── app/
│   │   ├── core/                      ← singleton: servicios, guards, interceptors
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   └── token.interceptor.ts
│   │   │   └── services/
│   │   │       └── auth.service.ts
│   │   ├── shared/                    ← reutilizable: pipes, directives, componentes UI
│   │   │   ├── components/
│   │   │   │   └── navbar/
│   │   │   │       ├── navbar.component.ts
│   │   │   │       ├── navbar.component.html
│   │   │   │       └── navbar.component.css
│   │   │   ├── pipes/
│   │   │   │   └── date-format.pipe.ts
│   │   │   └── directives/
│   │   │       └── highlight.directive.ts
│   │   ├── modules/                   ← feature modules — uno por módulo de negocio
│   │   │   └── clients/
│   │   │       ├── components/
│   │   │       │   ├── client-list/
│   │   │       │   │   ├── client-list.component.ts
│   │   │       │   │   ├── client-list.component.html
│   │   │       │   │   └── client-list.component.css
│   │   │       │   └── client-form/
│   │   │       │       ├── client-form.component.ts
│   │   │       │       ├── client-form.component.html
│   │   │       │       └── client-form.component.css
│   │   │       ├── services/
│   │   │       │   └── client.service.ts
│   │   │       ├── models/
│   │   │       │   └── client.model.ts
│   │   │       └── clients-routing.module.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── environments/
│   │   ├── environment.ts             ← producción
│   │   └── environment.development.ts ← desarrollo
│   ├── assets/
│   ├── index.html
│   └── styles.css                     ← import de Bootstrap
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Convenciones de Nomenclatura (6 reglas)

| Tipo        | Convención                      | Ejemplo                                    |
| ----------- | ------------------------------- | ------------------------------------------ |
| Componentes | `nombre.component.ts`           | `client-list.component.ts`                 |
| Servicios   | `nombre.service.ts`             | `client.service.ts`                        |
| Modelos     | `nombre.model.ts`               | `client.model.ts`                          |
| Guards      | `nombre.guard.ts`               | `auth.guard.ts`                            |
| Pipes       | `nombre.pipe.ts`                | `date-format.pipe.ts`                      |
| Directives  | `nombre.directive.ts`           | `highlight.directive.ts`                   |

## Reglas Obligatorias

- Proyecto creado con `ng new vg-fe-{nombre}`.
- Archivos KEBAB-CASE con sufijo de tipo: `.component.ts`, `.service.ts`, `.model.ts`, `.guard.ts`, `.pipe.ts`, `.directive.ts`.
- Tres carpetas principales dentro de `app/`:
  - `core/` — Servicios singleton, guards, interceptors. Se importa UNA sola vez en `AppModule`.
  - `shared/` — Pipes, directivas, componentes reutilizables. Se importa en cada módulo que lo necesite.
  - `modules/` — Feature modules. Un directorio por módulo funcional.
- Environments configurados: `environment.ts` (prod), `environment.development.ts` (dev).
- Bootstrap 5 instalado vía `npm install bootstrap` y declarado en `angular.json` o `styles.css`.

## Configuración de Environments

```typescript
// environments/environment.development.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};

// environments/environment.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.vallegrande.edu.pe/api'
};
```

## Uso en Servicio

```typescript
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private url = `${environment.apiUrl}/clients`;
  // ...
}
```

---

---

# Semestre IV — React 19 + Vite + Tailwind CSS

## Stack Tecnológico

| Tecnología     | Rol                                        |
| -------------- | ------------------------------------------ |
| React 19       | Librería de componentes                    |
| Vite           | Bundler y dev server rápido                |
| Tailwind CSS   | Framework de utilidad CSS                  |
| Axios          | Cliente HTTP (obligatorio, no fetch)       |
| React Router 7 | Enrutamiento SPA                           |
| SweetAlert2    | Modales y alertas                          |
| JavaScript     | Lenguaje — **sin TypeScript en este ciclo**|

> **Nota:** En semestre IV NO se usa TypeScript en React. Solo JavaScript con extensión `.jsx`.

## Setup Inicial

1. `npm create vite@latest vg-fe-{nombre} -- --template react`
2. `cd vg-fe-{nombre} && npm install`
3. `npm install -D tailwindcss @tailwindcss/vite` y configurar Tailwind en Vite

## Estructura de Directorios

```
vg-fe-{nombre}/
├── src/
│   ├── api/                    ← configuración de Axios (baseURL, interceptores)
│   │   └── axios.js
│   ├── components/             ← componentes reutilizables (botones, modales)
│   │   └── Navbar.jsx
│   ├── pages/                  ← páginas/vistas principales
│   │   ├── Home.jsx
│   │   └── clients/
│   │       ├── ClientList.jsx
│   │       └── ClientForm.jsx
│   ├── services/               ← llamadas HTTP con Axios (1 archivo por entidad)
│   │   └── clientService.js
│   ├── hooks/                  ← custom hooks (useClients, useFetch)
│   │   └── useClients.js
│   ├── context/                ← React Context (si se necesita estado global)
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css               ← imports de Tailwind: @import "tailwindcss"
├── .env                         ← VITE_API_URL=http://localhost:8080/api
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Convenciones de Nomenclatura (6 reglas)

| Tipo               | Convención                    | Ejemplo                             |
| ------------------ | ----------------------------- | ----------------------------------- |
| Componentes React  | PascalCase `.jsx`             | `ClientList.jsx`, `Navbar.jsx`      |
| Servicios          | camelCase `.js`               | `clientService.js`                  |
| Hooks              | `use` + PascalCase `.js`      | `useClients.js`, `useFetch.js`      |
| Contextos          | PascalCase + Context `.jsx`   | `AuthContext.jsx`                   |
| Páginas            | PascalCase `.jsx`             | `Home.jsx`, `Dashboard.jsx`        |
| Variables de entorno | `VITE_` prefijo             | `VITE_API_URL`, `VITE_APP_NAME`    |

## Reglas Obligatorias

- **Sin TypeScript** — Solo `.jsx` y `.js`.
- **Axios obligatorio** — No usar `fetch()` nativo. Configurar `baseURL` en `api/axios.js`.
- **Tailwind CSS instalado vía npm** (no CDN como en semestre II).
- Variables de entorno con prefijo `VITE_` en archivo `.env`.
- Servicios en `services/` — un archivo por entidad.
- Custom hooks en `hooks/`.

## Código de Referencia

```jsx
// api/axios.js
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});
export default api;

// services/clientService.js
import api from '../api/axios';
export const getClients = () => api.get('/clients');
export const createClient = (data) => api.post('/clients', data);
export const updateClient = (id, data) => api.put(`/clients/${id}`, data);
export const deleteClient = (id) => api.delete(`/clients/${id}`);

// pages/clients/ClientList.jsx
import { useState, useEffect } from 'react';
import { getClients, deleteClient } from '../../services/clientService';
import Swal from 'sweetalert2';

export default function ClientList() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    getClients().then(res => setClients(res.data));
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar?', icon: 'warning',
      showCancelButton: true, confirmButtonText: 'Sí'
    });
    if (result.isConfirmed) {
      await deleteClient(id);
      setClients(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>
      {clients.map(c => (
        <div key={c.id} className="border p-3 mb-2 rounded flex justify-between">
          <span>{c.name}</span>
          <button onClick={() => handleDelete(c.id)}
            className="text-red-500">Eliminar</button>
        </div>
      ))}
    </div>
  );
}
```

---

---

# Semestre IV — Expo / React Native (TypeScript)

## Stack Tecnológico

| Tecnología           | Rol                                        |
| -------------------- | ------------------------------------------ |
| React Native 0.76+   | Framework para apps móviles nativas        |
| Expo SDK 52+         | Plataforma para desarrollo React Native    |
| TypeScript 5         | Lenguaje tipado — **obligatorio**          |
| Expo Router          | Enrutamiento file-based (como Next.js)     |
| NativeWind           | Tailwind CSS para React Native             |
| Axios                | Cliente HTTP obligatorio                   |
| AsyncStorage         | Almacenamiento local persistente           |
| React Hook Form      | Manejo de formularios tipados              |

> **Nota:** En móvil SÍ se usa TypeScript (a diferencia de React web en sem IV).

## Setup Inicial

1. `npx create-expo-app@latest vg-app-{nombre}` (template typescript)
2. `cd vg-app-{nombre} && npx expo install`
3. Instalar NativeWind + Tailwind CSS siguiendo la documentación oficial de NativeWind v4

## Estructura de Directorios

```
vg-app-{nombre}/
├── app/                          ← Expo Router (rutas basadas en archivos)
│   ├── (tabs)/                   ← Tab Navigator con layout
│   │   ├── _layout.tsx           ← define las tabs
│   │   ├── index.tsx             ← primera tab (Home)
│   │   └── settings.tsx          ← segunda tab
│   ├── clients/
│   │   ├── index.tsx             ← lista de clientes
│   │   └── [id].tsx              ← detalle cliente (ruta dinámica)
│   ├── _layout.tsx               ← layout raíz (Stack Navigator)
│   └── +not-found.tsx            ← página 404
├── components/                   ← componentes reutilizables
│   ├── ui/                       ← componentes de UI (Button, Card, Input)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   └── clients/                  ← componentes específicos de clientes
│       ├── ClientCard.tsx
│       └── ClientForm.tsx
├── services/                     ← llamadas HTTP con Axios
│   └── clientService.ts
├── hooks/                        ← custom hooks
│   └── useClients.ts
├── types/                        ← interfaces y tipos TypeScript
│   └── client.types.ts
├── constants/                    ← colores, API URL, dimensiones
│   └── Colors.ts
├── assets/                       ← imágenes, fuentes
│   ├── images/
│   └── fonts/
├── app.json                      ← configuración de Expo
├── tsconfig.json                 ← configuración TypeScript estricta
├── package.json
└── README.md
```

## Convenciones de Nomenclatura (7 reglas)

| Tipo                 | Convención                    | Ejemplo                                |
| -------------------- | ----------------------------- | -------------------------------------- |
| Componentes React    | PascalCase `.tsx`             | `ClientCard.tsx`, `Button.tsx`         |
| Rutas (app/)         | kebab-case `.tsx`             | `index.tsx`, `[id].tsx`, `settings.tsx`|
| Servicios            | camelCase `.ts`               | `clientService.ts`                     |
| Hooks                | `use` + PascalCase `.ts`      | `useClients.ts`                        |
| Tipos/Interfaces     | PascalCase `.types.ts`        | `client.types.ts`                      |
| Constantes           | PascalCase `.ts`              | `Colors.ts`, `Api.ts`                 |
| Estilos              | StyleSheet nativo — **NO inline objects** | `StyleSheet.create({...})`   |

## Reglas Obligatorias

- **TypeScript obligatorio** — extensiones `.ts` y `.tsx`.
- **TypeScript strict mode** habilitado en `tsconfig.json`: `"strict": true`.
- Estilos con `StyleSheet.create()` — **nunca objetos inline**.
- Expo Router para enrutamiento — file-based en `app/`.
- Axios para HTTP, nunca `fetch()`.
- Componentes en `components/` con subcarpetas por dominio (`ui/`, `clients/`).
- Tipos en `types/` — un archivo `.types.ts` por entidad.
- Custom hooks en `hooks/`.

## Código de Referencia

```tsx
// types/client.types.ts
export interface Client {
  id: number;
  name: string;
  email: string;
  status: 'A' | 'I';
}

// services/clientService.ts
import axios from 'axios';
import type { Client } from '../types/client.types';

const API = axios.create({ baseURL: 'http://192.168.1.100:8080/api' });

export const getClients = () => API.get<Client[]>('/clients');
export const createClient = (data: Omit<Client, 'id'>) =>
  API.post<Client>('/clients', data);

// hooks/useClients.ts
import { useState, useEffect } from 'react';
import { getClients } from '../services/clientService';
import type { Client } from '../types/client.types';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClients()
      .then(res => setClients(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { clients, loading, setClients };
}

// components/clients/ClientCard.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Client } from '../../types/client.types';

interface Props {
  client: Client;
  onPress: (id: number) => void;
}

export default function ClientCard({ client, onPress }: Props) {
  return (
    <TouchableOpacity onPress={() => onPress(client.id)}>
      <View style={styles.card}>
        <Text style={styles.name}>{client.name}</Text>
        <Text style={styles.email}>{client.email}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#fff',
    borderRadius: 12, marginBottom: 8, elevation: 2 },
  name: { fontSize: 16, fontWeight: '600' },
  email: { fontSize: 14, color: '#6b7280' },
});
```

---

---

# Semestre V·VI — Angular Enterprise (Microservicios)

## Stack Tecnológico

| Tecnología          | Rol                                        |
| ------------------- | ------------------------------------------ |
| Angular 17+         | Framework SPA enterprise                   |
| TypeScript 5        | Lenguaje tipado                            |
| CSS Framework libre | Tailwind CSS 4, Bootstrap, Angular Material, PrimeNG u otro |
| RxJS                | Programación reactiva                      |
| Angular Router      | Enrutamiento con lazy loading              |
| HTTPClient          | Con interceptors para JWT                  |

## Estructura de Directorios

```
vg-fe-{nombre}/
├── src/
│   ├── app/
│   │   ├── core/                               ← singleton: guards, interceptors, auth
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts               ← verifica RBAC roles
│   │   │   ├── interceptors/
│   │   │   │   ├── jwt.interceptor.ts          ← agrega Bearer token
│   │   │   │   └── error.interceptor.ts        ← manejo global de errores HTTP
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── token.service.ts
│   │   │   └── models/
│   │   │       ├── user.model.ts
│   │   │       └── api-response.model.ts
│   │   ├── shared/                             ← reutilizable entre módulos
│   │   │   ├── components/
│   │   │   │   ├── confirm-dialog/
│   │   │   │   ├── loading-spinner/
│   │   │   │   └── data-table/
│   │   │   ├── pipes/
│   │   │   ├── directives/
│   │   │   └── utils/
│   │   ├── features/                           ← módulos por funcionalidad
│   │   │   ├── users/
│   │   │   │   ├── components/
│   │   │   │   ├── services/
│   │   │   │   ├── models/
│   │   │   │   └── users-routing.module.ts
│   │   │   ├── organizations/
│   │   │   ├── enrollment/
│   │   │   └── dashboard/
│   │   ├── layouts/                            ← layouts con sidebar, header, footer
│   │   │   ├── admin-layout/
│   │   │   └── public-layout/
│   │   ├── app.component.ts
│   │   ├── app.routes.ts                       ← standalone routing
│   │   └── app.config.ts                       ← provideRouter, provideHttpClient
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.development.ts
│   ├── assets/
│   ├── index.html
│   └── styles.scss
├── angular.json
├── package.json
└── tsconfig.json
```

## Convenciones de Nomenclatura (6 reglas)

| Tipo          | Convención                      | Ejemplo                                       |
| ------------- | ------------------------------- | --------------------------------------------- |
| Componentes   | `kebab-case.component.ts`       | `user-list.component.ts`                      |
| Servicios     | `kebab-case.service.ts`         | `user.service.ts`, `auth.service.ts`          |
| Guards        | `kebab-case.guard.ts`           | `auth.guard.ts`, `role.guard.ts`              |
| Interceptors  | `kebab-case.interceptor.ts`     | `jwt.interceptor.ts`, `error.interceptor.ts`  |
| Modelos       | `kebab-case.model.ts`           | `user.model.ts`, `api-response.model.ts`      |
| Directivas    | `kebab-case.directive.ts`       | `highlight.directive.ts`                       |

## Código de Referencia — Servicio con Interceptor JWT

```typescript
// core/services/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);
  readonly user = this.currentUser.asReadonly();

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(tap(res => {
        localStorage.setItem('token', res.token);
        this.currentUser.set(res.user);
      }));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.roles?.includes(role) ?? false;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }
}
```

```typescript
// core/guards/auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.getToken()) return true;
  return router.createUrlTree(['/login']);
};

// core/guards/role.guard.ts
export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data?.['role'] as string;
  if (auth.hasRole(requiredRole)) return true;
  return router.createUrlTree(['/unauthorized']);
};
```

```typescript
// core/interceptors/jwt.interceptor.ts
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};
```

```typescript
// app.routes.ts — Lazy loading con guards
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login.component') },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes')
      },
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { role: 'ORG_ADMIN' },
        loadChildren: () => import('./features/users/users.routes')
      },
      {
        path: 'organizations',
        canActivate: [roleGuard],
        data: { role: 'SUPER_ADMIN' },
        loadChildren: () => import('./features/organizations/org.routes')
      }
    ]
  }
];
```

```typescript
// app.config.ts — Standalone Application Config
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideAnimationsAsync()
  ]
};
```

---

---

# Semestre V·VI — React Enterprise (Microservicios)

## Stack Tecnológico

| Tecnología           | Rol                                                               |
| -------------------- | ----------------------------------------------------------------- |
| React 19             | Librería de componentes                                           |
| TypeScript 5         | Lenguaje tipado — **obligatorio** (strict mode)                   |
| Vite                 | Bundler y dev server rápido                                       |
| CSS Framework libre  | Tailwind CSS 4, Bootstrap, Chakra UI, shadcn/ui u otro            |
| Axios                | Cliente HTTP con interceptors (patrón Adapter)                    |
| Zustand              | Estado global tipado con slices y persistencia                    |
| React Router 7       | Enrutamiento con createBrowserRouter + lazy loading               |
| React Hook Form + Zod| Formularios validados con schema Zod                              |
| Recharts / Chart.js  | Gráficos para dashboards y reportes                               |

> **Nota:** En semestre V·VI **SÍ se usa TypeScript** con strict mode. Extensiones `.ts` y `.tsx`.

> **CSS Framework:** Los equipos pueden elegir libremente el framework CSS/UI que prefieran. No se fuerza Tailwind ni Bootstrap.

## Estructura de Directorios

```
vg-ms-users-fe/
├── src/
│   ├── core/                          ← Capa núcleo — singleton, se importa UNA vez
│   │   ├── adapters/                  ← Patrón Adapter para HTTP
│   │   │   ├── httpClient.ts          ← instancia Axios + baseURL + timeout
│   │   │   ├── requestInterceptor.ts  ← inyecta Bearer JWT en cada request
│   │   │   ├── responseInterceptor.ts ← captura 401→refresh, 403→/unauthorized
│   │   │   └── index.ts              ← barrel export del httpClient configurado
│   │   ├── services/                  ← Servicios que consumen adapters
│   │   │   ├── auth.service.ts        ← login, logout, refreshToken, getUserRole()
│   │   │   ├── user.service.ts        ← CRUD usuarios (getAll, getById, create...)
│   │   │   ├── org.service.ts         ← organizaciones, niveles, sedes
│   │   │   ├── enrollment.service.ts
│   │   │   └── index.ts              ← barrel re-export de todos los services
│   │   ├── models/                    ← Interfaces TypeScript de dominio
│   │   │   ├── user.model.ts          ← User, UserRequest, UserResponse
│   │   │   ├── org.model.ts           ← Organization, Level, Section
│   │   │   ├── auth.model.ts          ← LoginRequest, AuthResponse, TokenPayload
│   │   │   ├── api-response.model.ts  ← ApiResponse<T>, PaginatedResponse<T>
│   │   │   └── index.ts
│   │   ├── config/                    ← Configuración centralizada de la app
│   │   │   ├── env.config.ts          ← parseo y validación de variables VITE_*
│   │   │   ├── routes.config.ts       ← constantes de rutas: ROUTES.USERS, etc.
│   │   │   └── roles.config.ts        ← enum Role { SUPER_ADMIN, ORG_ADMIN... }
│   │   └── constants/
│   │       ├── apiEndpoints.ts        ← /api/v1/users, /api/v1/orgs...
│   │       └── httpStatus.ts          ← HTTP_STATUS.OK, UNAUTHORIZED, etc.
│   ├── shared/                        ← Capa compartida — reutilizable en toda la app
│   │   ├── components/
│   │   │   ├── ui/                    ← Design System propio (Button, Input, Badge...)
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Spinner.tsx
│   │   │   │   └── index.ts           ← barrel export
│   │   │   ├── data-display/          ← Componentes de visualización de datos
│   │   │   │   ├── DataTable.tsx      ← tabla paginada, sorteable, filtrable
│   │   │   │   ├── StatCard.tsx       ← card con icono + valor + delta %
│   │   │   │   └── EmptyState.tsx     ← placeholder cuando no hay registros
│   │   │   ├── feedback/              ← Feedback al usuario
│   │   │   │   ├── Toast.tsx          ← notificaciones success/error/warning
│   │   │   │   ├── ConfirmDialog.tsx  ← modal de confirmación reutilizable
│   │   │   │   └── ErrorBoundary.tsx  ← captura errores de rendering
│   │   │   └── navigation/            ← Componentes de navegación
│   │   │       ├── Sidebar.tsx        ← menú lateral colapsable + rol-aware
│   │   │       ├── Topbar.tsx         ← header con breadcrumbs + user avatar
│   │   │       └── Breadcrumbs.tsx
│   │   ├── hooks/                     ← Custom hooks reutilizables
│   │   │   ├── useAuth.ts             ← acceso cómodo al authStore
│   │   │   ├── useDebounce.ts         ← debounce para search inputs
│   │   │   ├── usePagination.ts       ← page, pageSize, total, next, prev
│   │   │   ├── useLocalStorage.ts     ← get/set tipado genérico
│   │   │   └── usePermissions.ts      ← canView(), canEdit(), canDelete()
│   │   ├── guards/                    ← Route guards (HOC pattern)
│   │   │   ├── ProtectedRoute.tsx     ← redirige /login si no hay token
│   │   │   ├── RoleRoute.tsx          ← verifica RBAC (SUPER_ADMIN, ORG_ADMIN...)
│   │   │   └── GuestRoute.tsx         ← impide acceso si YA está logueado
│   │   ├── hoc/                       ← Higher-Order Components
│   │   │   └── withErrorBoundary.tsx  ← envuelve cualquier componente con boundary
│   │   └── utils/                     ← Funciones puras utilitarias
│   │       ├── formatDate.ts          ← formatear fechas según locale
│   │       ├── roleMapper.ts          ← SUPER_ADMIN → "Super Administrador"
│   │       ├── validators.ts          ← email, phone, ruc, dni
│   │       └── cn.ts                  ← classnames helper (clsx/twMerge)
│   ├── store/                         ← Estado global (Zustand con slices)
│   │   ├── authStore.ts               ← user, token, roles, login(), logout()
│   │   ├── uiStore.ts                 ← sidebarOpen, theme, toasts[]
│   │   └── index.ts
│   ├── layouts/                       ← Contenedores de layout (Outlet)
│   │   ├── AdminLayout.tsx            ← Sidebar + Topbar + <Outlet /> (ADMIN+)
│   │   ├── PublicLayout.tsx           ← login, registro, reset password
│   │   └── RootLayout.tsx             ← providers, ErrorBoundary, theme
│   ├── features/                      ← Módulos por dominio (lazy loaded)
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx       ← métricas por org, StatCards, gráficos
│   │   │   ├── components/
│   │   │   │   ├── KPICard.tsx
│   │   │   │   └── RecentActivity.tsx
│   │   │   └── hooks/
│   │   │       └── useDashboardData.ts
│   │   ├── users/
│   │   │   ├── UserListPage.tsx        ← DataTable + filtros + paginación server-side
│   │   │   ├── UserFormPage.tsx        ← crear/editar con React Hook Form + Zod
│   │   │   ├── UserDetailPage.tsx      ← perfil + roles + historial
│   │   │   ├── components/
│   │   │   │   ├── UserFilters.tsx
│   │   │   │   └── UserCard.tsx
│   │   │   └── hooks/
│   │   │       └── useUsers.ts
│   │   ├── organizations/
│   │   │   ├── OrgListPage.tsx         ← solo SUPER_ADMIN
│   │   │   ├── OrgDetailPage.tsx       ← niveles, sedes, configuración
│   │   │   └── hooks/
│   │   │       └── useOrganizations.ts
│   │   ├── enrollment/
│   │   │   ├── EnrollmentListPage.tsx
│   │   │   ├── EnrollmentFormPage.tsx
│   │   │   └── hooks/
│   │   │       └── useEnrollment.ts
│   │   ├── academic/
│   │   │   ├── GradesPage.tsx
│   │   │   ├── AttendancePage.tsx
│   │   │   ├── SchedulePage.tsx
│   │   │   └── hooks/
│   │   │       └── useAcademic.ts
│   │   └── reports/
│   │       ├── ReportDashboard.tsx     ← gráficos Recharts / Chart.js
│   │       ├── ReportExport.tsx        ← exportar PDF / Excel
│   │       └── hooks/
│   │           └── useReports.ts
│   ├── router/                        ← Configuración de rutas centralizada
│   │   ├── index.tsx                  ← createBrowserRouter o <Routes>
│   │   ├── privateRoutes.tsx          ← rutas protegidas con lazy + guards
│   │   ├── publicRoutes.tsx           ← login, register, forgot-password
│   │   └── routeLoader.ts            ← loaders para data fetching pre-render
│   ├── App.tsx                        ← <RouterProvider> + <Suspense> + ErrorBoundary
│   ├── main.tsx                       ← createRoot + providers + <App />
│   ├── index.css                      ← estilos base (Tailwind / Bootstrap / otro)
│   └── vite-env.d.ts                  ← tipos de variables de entorno Vite
├── .env                               ← VITE_API_URL=http://localhost:8080/api
├── .env.example                       ← plantilla de variables requeridas
├── index.html
├── package.json
├── tsconfig.json                      ← strict: true, paths: { @/* }
├── tsconfig.app.json
└── vite.config.ts                     ← alias @/ → src/, proxy API
```

## Convenciones de Nomenclatura (6 reglas)

| Tipo               | Convención                       | Ejemplo                                                       |
| ------------------ | -------------------------------- | ------------------------------------------------------------- |
| Componentes React  | PascalCase `.tsx`                | `UserListPage.tsx`, `ProtectedRoute.tsx`                      |
| Custom Hooks       | `use` + PascalCase `.ts`         | `useAuth.ts`, `useUsers.ts`, `usePermissions.ts`              |
| Servicios          | camelCase `.service.ts`          | `user.service.ts`, `auth.service.ts`                          |
| Stores (Zustand)   | camelCase + Store `.ts`          | `authStore.ts`, `uiStore.ts`                                  |
| Guards             | PascalCase `.tsx`                | `ProtectedRoute.tsx`, `RoleRoute.tsx`, `GuestRoute.tsx`       |
| Models / Config / Utils | camelCase `.ts`             | `user.model.ts`, `env.config.ts`, `formatDate.ts`             |

## Reglas Obligatorias

- **TypeScript obligatorio** — extensiones `.ts` y `.tsx` con `strict: true`.
- **CSS Framework libre** — Tailwind CSS 4, Bootstrap, Chakra UI, shadcn/ui u otro. Los equipos eligen.
- **Axios obligatorio** — con patrón Adapter en `core/adapters/`. No usar `fetch()` nativo.
- **Zustand para estado global** — stores tipados con `create<T>()`. Context API solo si es muy simple.
- **React Hook Form + Zod** para formularios con validación de schema.
- Variables de entorno con prefijo `VITE_` en `.env` y validar en `env.config.ts`.
- Rutas definidas en `router/` con archivos separados para public/private.
- Cada feature tiene su propia carpeta con `components/`, `hooks/` internos.
- Barrel exports (`index.ts`) en carpetas principales.
- Path aliases obligatorios: `@/` → `src/` configurado en `tsconfig.json` y `vite.config.ts`.

## Código de Referencia — Arquitectura Enterprise React + TypeScript

### Modelos tipados

```typescript
// core/models/user.model.ts
export interface User {
  id: string;
  email: string;
  fullName: string;
  roles: Role[];
  orgId: string;
  status: 'A' | 'I';
  createdAt: string;
}

export interface UserRequest {
  email: string;
  fullName: string;
  roles: Role[];
  orgId: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ORG_ADMIN   = 'ORG_ADMIN',
  TEACHER     = 'TEACHER',
  STUDENT     = 'STUDENT',
}
```

### Patrón Adapter — HTTP Client con Axios

```typescript
// core/adapters/httpClient.ts
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../config/env.config';

const httpClient: AxiosInstance = axios.create({
  baseURL: ENV.API_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — inyecta Bearer JWT
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — maneja 401/403 globalmente
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
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

### Configuración de entorno con validación

```typescript
// core/config/env.config.ts
export const ENV = Object.freeze({
  API_URL: import.meta.env.VITE_API_URL as string,
  APP_NAME: import.meta.env.VITE_APP_NAME as string ?? 'PRS',
  IS_DEV: import.meta.env.DEV,
});
if (!ENV.API_URL) throw new Error('VITE_API_URL no definida en .env');
```

### Servicio CRUD tipado

```typescript
// core/services/user.service.ts
import { httpClient } from '../adapters/httpClient';
import type { User, UserRequest, ApiResponse, PaginatedResponse } from '../models/user.model';

export const userService = {
  getAll:   (page = 0, size = 20) =>
    httpClient.get<PaginatedResponse<User>>(`/api/v1/users?page=${page}&size=${size}`),
  getById:  (id: string)          => httpClient.get<ApiResponse<User>>(`/api/v1/users/${id}`),
  getByOrg: (orgId: string)       => httpClient.get<ApiResponse<User[]>>(`/api/v1/users/org/${orgId}`),
  create:   (data: UserRequest)   => httpClient.post<ApiResponse<User>>('/api/v1/users', data),
  update:   (id: string, data: Partial<UserRequest>) =>
    httpClient.put<ApiResponse<User>>(`/api/v1/users/${id}`, data),
  remove:   (id: string)          => httpClient.delete<void>(`/api/v1/users/${id}`),
  restore:  (id: string)          => httpClient.patch<ApiResponse<User>>(`/api/v1/users/${id}/restore`),
};
```

### Store global con Zustand (tipado + persistencia)

```typescript
// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { httpClient } from '../core/adapters/httpClient';
import type { User, Role } from '../core/models/user.model';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuth: boolean;
  login:   (email: string, password: string) => Promise<void>;
  logout:  () => void;
  hasRole: (role: Role) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null, token: null, isAuth: false,

      login: async (email, password) => {
        const { data } = await httpClient.post('/auth/login', { email, password });
        localStorage.setItem('access_token', data.token);
        set({ user: data.user, token: data.token, isAuth: true });
      },

      logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, token: null, isAuth: false });
      },

      hasRole: (role) => get().user?.roles?.includes(role) ?? false,
    }),
    { name: 'auth-storage', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
```

### Guards tipados

```tsx
// shared/guards/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute() {
  const isAuth = useAuthStore((s) => s.isAuth);
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}

// shared/guards/RoleRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { Role } from '../../core/models/user.model';

interface Props { allowed: Role[]; }
export default function RoleRoute({ allowed }: Props) {
  const hasRole = useAuthStore((s) => s.hasRole);
  return allowed.some((r) => hasRole(r))
    ? <Outlet />
    : <Navigate to="/unauthorized" replace />;
}
```

### ErrorBoundary

```tsx
// shared/components/feedback/ErrorBoundary.tsx
import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(): State { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? <p>Algo salió mal.</p>;
    return this.props.children;
  }
}
```

### Hook de permisos

```typescript
// shared/hooks/usePermissions.ts
import { useAuthStore } from '../../store/authStore';
import { Role } from '../../core/models/user.model';

export function usePermissions() {
  const hasRole = useAuthStore((s) => s.hasRole);
  return {
    canCreate: () => hasRole(Role.SUPER_ADMIN) || hasRole(Role.ORG_ADMIN),
    canEdit:   () => hasRole(Role.SUPER_ADMIN) || hasRole(Role.ORG_ADMIN),
    canDelete: () => hasRole(Role.SUPER_ADMIN),
    canView:   () => true,
  };
}
```

### Feature Hook tipado

```typescript
// features/users/hooks/useUsers.ts
import { useState, useEffect, useCallback } from 'react';
import { userService } from '../../../core/services/user.service';
import type { User } from '../../../core/models/user.model';

export function useUsers(orgId?: string) {
  const [users, setUsers]     = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = orgId
        ? await userService.getByOrg(orgId)
        : await userService.getAll();
      setUsers('data' in data ? (Array.isArray(data.data) ? data.data : [data.data]) : []);
    } catch (err: any) {
      setError(err.message ?? 'Error al cargar usuarios');
    } finally { setLoading(false); }
  }, [orgId]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}
```

### Router con rutas privadas + lazy loading

```tsx
// router/privateRoutes.tsx
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../shared/guards/ProtectedRoute';
import RoleRoute from '../shared/guards/RoleRoute';
import { Role } from '../core/models/user.model';

const Dashboard   = lazy(() => import('../features/dashboard/DashboardPage'));
const UserList    = lazy(() => import('../features/users/UserListPage'));
const UserForm    = lazy(() => import('../features/users/UserFormPage'));
const UserDetail  = lazy(() => import('../features/users/UserDetailPage'));
const OrgList     = lazy(() => import('../features/organizations/OrgListPage'));
const OrgDetail   = lazy(() => import('../features/organizations/OrgDetailPage'));
const Enrollment  = lazy(() => import('../features/enrollment/EnrollmentListPage'));
const Grades      = lazy(() => import('../features/academic/GradesPage'));
const Attendance  = lazy(() => import('../features/academic/AttendancePage'));
const Reports     = lazy(() => import('../features/reports/ReportDashboard'));

export const privateRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [{
      element: <AdminLayout />,
      children: [
        { path: '/dashboard', element: <Dashboard /> },
        {
          element: <RoleRoute allowed={[Role.SUPER_ADMIN, Role.ORG_ADMIN]} />,
          children: [
            { path: '/users',             element: <UserList /> },
            { path: '/users/new',         element: <UserForm /> },
            { path: '/users/:id',         element: <UserDetail /> },
            { path: '/users/:id/edit',    element: <UserForm /> },
            { path: '/organizations',     element: <OrgList /> },
            { path: '/organizations/:id', element: <OrgDetail /> },
            { path: '/enrollment',        element: <Enrollment /> },
          ],
        },
        {
          element: <RoleRoute allowed={[Role.ORG_ADMIN, Role.TEACHER]} />,
          children: [
            { path: '/grades',     element: <Grades /> },
            { path: '/attendance', element: <Attendance /> },
          ],
        },
        { path: '/reports', element: <Reports /> },
      ],
    }],
  },
];
```

### App.tsx — Entry point con providers + ErrorBoundary

```tsx
// App.tsx
import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from './shared/components/feedback/ErrorBoundary';
import { privateRoutes } from './router/privateRoutes';
import { publicRoutes }  from './router/publicRoutes';
import Spinner from './shared/components/ui/Spinner';

const router = createBrowserRouter([...publicRoutes, ...privateRoutes]);

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner fullScreen />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

> **Fin del documento.** Este README contiene todos los estándares frontend desde el Semestre II hasta el V·VI para ser utilizado como fuente de verdad en el code review automatizado con Amazon Bedrock.
