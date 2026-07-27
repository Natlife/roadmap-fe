# Roadmap Admin (`roadmap-fe`)

Production-ready React admin console for the Roadmap platform. Built on a modern MUI + Vite
stack and styled after [Dokploy](https://dokploy.com) — a compact, bordered, dark-first
developer console. Ships with a clean, feature-oriented architecture that is easy to extend
module-by-module.

First modules included: **Authentication**, **User management**, **Group management**
(with membership editing), plus a Dashboard, Analytics, and Settings.

---

## Tech stack

| Concern            | Choice                                             |
| ------------------ | -------------------------------------------------- |
| Build tool         | Vite 6 + `@vitejs/plugin-react`                    |
| Language           | TypeScript 5.8 (strict)                            |
| UI kit             | MUI 7 (`@mui/material`, `@mui/x-charts`, x-date-pickers) |
| Icons              | `iconsax-reactjs`                                  |
| Data / server state| TanStack Query 5                                   |
| HTTP               | Axios (envelope-aware interceptors)                |
| Forms + validation | Formik + Yup                                       |
| Routing            | React Router 7 (`createBrowserRouter`, lazy routes)|
| Tables             | TanStack Table 8                                   |
| Notifications      | notistack                                          |
| Fonts              | Inter (UI) + Roboto Mono (ids/code)               |

## Requirements

- Node.js 20+
- Yarn 4 (Corepack): `corepack enable`

## Getting started

```bash
corepack enable          # enables the pinned Yarn 4
yarn install
cp .env.example .env      # then edit VITE_API_BASE_URL if needed
yarn dev                  # http://localhost:3000
```

Make sure the `node-backend` API is running (default `http://localhost:5001`).

### Scripts

| Script            | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `yarn dev`        | Start Vite dev server on port 3000       |
| `yarn build`      | Type-check then production build         |
| `yarn preview`    | Preview the production build             |
| `yarn typecheck`  | `tsc --noEmit`                           |
| `yarn lint`       | ESLint over `src`                        |
| `yarn lint:fix`   | ESLint autofix                           |
| `yarn prettier`   | Format `src`                             |
| `yarn knip`       | Find unused files/exports/deps           |

## Environment variables

| Var                  | Default                 | Description                     |
| -------------------- | ----------------------- | ------------------------------- |
| `VITE_API_BASE_URL`  | `http://localhost:5001` | Backend REST base URL           |
| `VITE_APP_NAME`      | `Roadmap Admin`         | App title / logo text           |
| `VITE_APP_VERSION`   | `1.0.0`                 | Shown in the header chip        |
| `VITE_APP_BASE_NAME` | `/`                     | Router basename                 |

---

## Architecture

```
src/
├── api/            # axios instance, endpoint map, query keys, query client
├── components/     # shared, reusable UI (MainCard, Avatar, Dialogs, Logo, …)
│   └── extended/   # MUI wrappers/extensions
├── config.ts       # global app config + constants
├── contexts/       # ConfigContext (theme prefs), JWTContext (auth), MenuContext
├── hooks/          # useAuth, useConfig, useUsers, useGroups, useLocalStorage
├── layout/         # Dashboard shell (Drawer/Header/Footer) + Auth layout
├── menu-items/     # sidebar navigation config (role-aware)
├── pages/          # route entry points (lazy-loaded)
├── routes/         # router, guards composition, Main/Login route trees
├── sections/       # feature-specific composite UI (tables, form dialogs)
├── services/       # API service layer (auth, users, groups)
├── themes/         # palette, typography, shadows, component overrides
├── types/          # shared TypeScript contracts
└── utils/          # route guards (Auth/Guest/Role) & helpers
```

### Data flow

`page` → `hooks/use*` (TanStack Query) → `services/*` → `api/axios` (envelope
unwrap + auth header) → backend.

The backend wraps every response as `{ code, message, data, timestamp, meta? }`
with success `code === 1000`. The axios interceptor unwraps `data`, surfaces
errors as `ApiException`, and auto-signs-out on `401`.

### Auth

JWT is stored in `sessionStorage`. On boot, `JWTContext` validates the token
(`jwt-decode` expiry check) and hydrates the user from `GET /auth/me`. Routes are
protected by `AuthGuard`; the login page uses `GuestGuard`; admin areas add
`RoleGuard(['ADMIN'])`.

### Theming (Dokploy-style)

`ThemeCustomization` builds the MUI theme from `ConfigContext`. Supports **dark +
light** toggle, four accent presets, mini sidebar, boxed container, and language —
all persisted to `localStorage`. The look is compact with 1px borders, muted zinc
neutrals, subtle shadows, and a violet accent.

### Backend endpoints consumed

```
POST   /auth/login
GET    /auth/me
GET    /users?page&pageSize          (admin)
POST   /admin/users                  (admin)
PUT    /users/:id
DELETE /users/:id
GET    /admin/groups
GET    /admin/groups/:id
POST   /admin/groups
PUT    /admin/groups/:id
DELETE /admin/groups/:id
POST   /admin/groups/:groupId/members/:userId
DELETE /admin/groups/:groupId/members/:userId
```

All paths are centralized in `src/api/endpoints.ts`.

---

## Adding a new module (recipe)

1. **Types** — add contracts in `src/types/<feature>.ts` and re-export from `index.ts`.
2. **Endpoints** — add paths to `src/api/endpoints.ts`.
3. **Service** — create `src/services/<feature>Service.ts` (unwrap envelopes).
4. **Query hooks** — add `src/hooks/use<Feature>.ts` (+ keys in `api/queryKeys.ts`).
5. **Sections** — build tables/forms in `src/sections/admin/<feature>/`.
6. **Page** — create `src/pages/admin/<feature>/index.tsx`.
7. **Route** — register it in `src/routes/MainRoutes.tsx` (wrap with `RoleGuard` if needed).
8. **Menu** — add an entry in `src/menu-items/administration.tsx`.

---

## Notes

- `sessionStorage` key + config `localStorage` key are defined in `src/config.ts`.
- The users list currently searches within the loaded page (backend has no `search`
  param yet); wire it up in `userService.list` when the API supports it.
