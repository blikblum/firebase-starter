---
name: manage-routes
description: Create or edit TanStack Router file-based routes in this repo. Use when adding/removing route files under src/routes, changing route paths, adding layout or pathless layout routes, wiring Outlet usage, or adjusting navigation/redirect logic tied to routes.
---

# Manage Routes

## Overview

Create and refactor TanStack Router routes using the file-based routing conventions in this repo, including layout/pathless layout patterns with Outlet.

## Workflow

### 1) Choose the route type and file name

- Prefer directory route structure under `src/routes/<route>/` with `route.tsx` for layouts and `index.tsx` for index routes.
- Use a layout route when multiple pages share UI or auth logic.
- Use a pathless layout for shared UI without adding a path segment (prefix with `_`).
- Use flat routes (`src/routes/*.tsx`) only for one-off or very small apps.

Examples:

- `/about` route (directory): `src/routes/about/route.tsx` with `createFileRoute('/about')`.
- Pathless layout (directory): `src/routes/_app/route.tsx` with `createFileRoute('/_app')` and child pages like `src/routes/_app/index.tsx` (`createFileRoute('/_app/')`) and `src/routes/_app/about.tsx` (`createFileRoute('/_app/about')`).

### 2) Implement the route component

- Use explicit return types: `React.JSX.Element` or `React.JSX.Element | null`.
- Use `<Outlet />` in layout routes to render child content.
- Prefer `Link`, `useNavigate`, `useRouterState`, and `Route.useParams()` from `@tanstack/react-router` instead of manual URL handling.
- If auth gating is required, read the session atom via `useStore` and redirect to `/login` when signed out.

### 3) Keep file-based routing in sync

- Do not edit `src/routeTree.gen.ts` directly; it is generated.
- After adding/moving routes, ensure `createFileRoute()` paths reflect the file path (the plugin will update them on build/dev).

### 4) Verify types

- Run `yarn check:types` after changes.
